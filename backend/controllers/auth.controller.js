import admin from '../firebase/admin.js'
import { generateToken } from '../utils/jwt.utils.js'

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