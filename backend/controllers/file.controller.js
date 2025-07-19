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
        const docRef = filesCollection.doc(fileId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "File not found" });
        }

        const file = doc.data();
        if (file.ownerId !== req.user.uid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        res.json({
            id: doc.id,
            ...file,
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
        if (file.ownerId !== req.user.uid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

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
        if (file.ownerId !== req.user.uid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await docRef.delete()
        res.status(204).send()
    } catch (err) {
        console.error("Error in deleteFile:", err);
        res.status(500).json({ error: "Failed to delete file" });
    }
    
}