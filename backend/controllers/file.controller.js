import { db } from '../utils/firestore'

const filesCollection = db.collection('files')

export async function createFile(req, res) {
    const { title } = req.body

    const docRef= await filesCollection.add({
        ownerId: req.user.uid,
        title: title || "Untitled",
        content: "",
        createdAt: new Date(),
        updatedAt: new Date()
    })

    res.status(201).json({ id: docRef.id, title, ownerId: req.user.uid})
}

export async function getUserFiles(req, res) {
    console.log("getUserFiles → req.user:", req.user)
    try {
        const snapshot = await filesCollection
            .where("ownerId", "==", req.user.uid)
            .orderBy("updatedAt", "desc")
            .get()
        const files = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
            }
            
        })

        res.json(files)
    } catch(err) {
        console.error("Error in getUserFiles:", err);
        res.status(500).json({ error: "Failed to fetch user files" })
    }
}

export async function getFileById(req, res) {
    try {
        const fileId = req.params.id;
        const userId = req.user.uid;

        const docRef = filesCollection.doc(fileId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "File not found" });
        }

        const file = doc.data();

        let hasAccess = file.ownerId === userId;
        let accessLevel = 'owner';
        if (!hasAccess) {
        // Check collaboration permissions
        const collabQuery = await db.collection('file_collaborators')
            .where('fileId', '==', fileId)
            .where('collaboratorId', '==', userId)
            .get();
        
            if (!collabQuery.empty) {
                hasAccess = true;
                accessLevel = collabQuery.docs[0].data().permission;
            }
        } 
        
        if (!hasAccess) {
          return res.status(403).json({ error: "Unauthorized" });
        }

        res.json({
            id: doc.id,
            ...file,
            accessLevel,
            createdAt: file.createdAt?.toDate?.() || file.createdAt,
            updatedAt: file.updatedAt?.toDate?.() || file.updatedAt
        });
    } catch (err) {
        console.error("Error in getFileById:", err);
        res.status(500).json({ error: "Failed to fetch file" });
    }
}
export async function updateFile(req, res) {
    try {
        const fileId = req.params.id;
        const { title, content } = req.body;

        const docRef = filesCollection.doc(fileId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "File not found" });
        }

        const file = doc.data();

        await docRef.update({
        title: title || file.title,
            content: content || file.content,
            updatedAt: new Date(),
        });

        res.json({ message: "File updated" });
    } catch (err) {
        console.error("Error in updateFile:", err);
        res.status(500).json({ error: "Failed to update file" });
    }
    
}

export async function deleteFile(req, res) {
    try {
        const fileId = req.params.id
        const docRef = filesCollection.doc(fileId)
        const doc = await docRef.get()

        if (!doc.exists) {
            return res.status(404).json({ error: "File not found" });
        }

        const file = doc.data();

        await docRef.delete()
        res.status(204).send()
    } catch (err) {
        console.error("Error in deleteFile:", err);
        res.status(500).json({ error: "Failed to delete file" });
    }
    
}

export async function shareFile(req, res) {
  try {
    const fileId = req.params.id;
    const { collaboratorEmail, permission = 'write' } = req.body;
    const ownerId = req.user.uid;

    // Verify file ownership
    const docRef = filesCollection.doc(fileId);
    const doc = await docRef.get();
    
    if (!doc.exists || doc.data().ownerId !== ownerId) {
      return res.status(404).json({ error: "File not found or unauthorized" });
    }

    // Find collaborator by email (you'll need a users collection)
    const usersQuery = await db.collection('users')
      .where('email', '==', collaboratorEmail)
      .get();
    
    if (usersQuery.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const collaboratorId = usersQuery.docs[0].id;

    // Add collaboration permission
    await db.collection('file_collaborators').add({
      fileId,
      ownerId,
      collaboratorId,
      permission,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ success: true, message: "File shared successfully" });
  } catch (err) {
    console.error("Error sharing file:", err);
    res.status(500).json({ error: "Failed to share file" });
  }
}

export async function getCollaborators(req, res) {
  try {
    const fileId = req.params.id;
    const userId = req.user.uid;

    // Verify user has access to this file
    const hasAccess = await checkFileAccess(fileId, userId);
    if (!hasAccess) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Get collaborators
    const collabQuery = await db.collection('file_collaborators')
      .where('fileId', '==', fileId)
      .get();

    const collaborators = await Promise.all(
      collabQuery.docs.map(async (doc) => {
        const collabData = doc.data();
        
        // Fetch user details to get email
        const userDoc = await db.collection('users').doc(collabData.collaboratorId).get();
        const userData = userDoc.exists ? userDoc.data() : null;

        return {
          id: doc.id,
          ...collabData,
          collaboratorEmail: userData?.email || collabData.collaboratorId, // Show email or fallback to ID
          createdAt: collabData.createdAt?.toDate?.() || collabData.createdAt,
          updatedAt: collabData.updatedAt?.toDate?.() || collabData.updatedAt
        };
      })
    );

    res.json(collaborators);
  } catch (err) {
    console.error("Error getting collaborators:", err);
    res.status(500).json({ error: "Failed to get collaborators" });
  }
}

// Helper function to check file access
async function checkFileAccess(fileId, userId) {
  const docRef = filesCollection.doc(fileId);
  const doc = await docRef.get();
  
  if (!doc.exists) return false;
  
  const file = doc.data();
  if (file.ownerId === userId) return true;
  
  const collabQuery = await db.collection('file_collaborators')
    .where('fileId', '==', fileId)
    .where('collaboratorId', '==', userId)
    .get();
    
  return !collabQuery.empty;
}

export async function removeCollaborator(req, res) {
  try {
    const fileId = req.params.id;
    const collaboratorId = req.params.collaboratorId;
    const ownerId = req.user.uid;

    // Verify file ownership - only owner can remove collaborators
    const docRef = filesCollection.doc(fileId);
    const doc = await docRef.get();
    
    if (!doc.exists || doc.data().ownerId !== ownerId) {
      return res.status(404).json({ error: "File not found or unauthorized" });
    }

    // Find and delete the collaboration record
    const collabQuery = await db.collection('file_collaborators')
      .where('fileId', '==', fileId)
      .where('collaboratorId', '==', collaboratorId)
      .get();

    if (collabQuery.empty) {
      return res.status(404).json({ error: "Collaborator not found" });
    }

    // Delete the collaboration record
    const batch = db.batch();
    collabQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.json({ success: true, message: "Collaborator access removed successfully" });
  } catch (err) {
    console.error("Error removing collaborator:", err);
    res.status(500).json({ error: "Failed to remove collaborator access" });
  }
}