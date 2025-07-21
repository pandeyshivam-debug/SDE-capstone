import admin from '../firebase/admin.js'
import { generateToken } from '../utils/jwt.utils.js'
import { db } from '../utils/firestore.js'

export async function getBackendToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ error: "Authorization header with Bearer token is required" });
    }
    const idToken = authHeader.split(" ")[1]
    try {
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("Decoded Firebase Token:", decodedToken);
        await createUserProfile(
            decodedToken.uid, 
            decodedToken.email, 
            decodedToken.name || decodedToken.displayName
        );
        // Temporary role logic (later fetch from Firestore or DB)
        const role = decodedToken.email === "admin@example.com" ? "admin" : "user";

        // Generate backend JWT
        const backendToken = generateToken({
            uid: decodedToken.uid,
            email: decodedToken.email,
            role,
        });

        console.log("Generated backend JWT:", backendToken);
        res.json({ token: backendToken, role });
    } catch(err) {
        console.error("Error verifying Firebase token or generating JWT:", err)
        next(err)
    }
}

export async function createUserProfile(uid, email, displayName) {
  try {
    const usersCollection = db.collection('users');
    
    await usersCollection.doc(uid).set({
      email,
      displayName: displayName || email.split('@')[0], // Use email prefix if no display name
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true }); // merge: true will update existing or create new
    
    console.log("User profile created/updated for:", email);
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return false;
  }
}