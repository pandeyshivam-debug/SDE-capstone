import admin from '../firebase/admin.js'
import { generateToken } from '../utils/jwt.utils.js'

export async function getBackendToken(req, res, next) {
    const { idToken } = req.body
    // console.log("Incoming ID Token:", idToken)

    if (!idToken) {
        console.log("No ID token sent")
        return res.status(400).json({ error: "ID token is required" })
    }
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        // console.log("Decoded Firebase Token:", decodedToken)

        const role = decodedToken.email === "admin@example.com" ? "admin" : "user"

        const backendToken = generateToken({
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: role
        })

        console.log("Generated backend JWT:", backendToken)

        res.json({token: backendToken, role})
    } catch(err) {
        console.error("Error verifying Firebase token or generating JWT:", err)
        next(err)
    }
}