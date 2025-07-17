import admin, { auth, messaging } from 'firebase-admin'
import jwt from 'jsonwebtoken'

const generateToken = (uid, role='user') => {
    return jwt.sign({ uid, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

export const signup = async (req, res) => {
    const { email, password } = req.body
    try {
        const userRecord = await admin.auth().createUser({
            email, password
        })
        const token = generateToken(userRecord.uid)
        res.status(201).json({jwt: token})
    } catch(err) {
        res.status(400).json({error: err.message})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await admin.auth().getUserByEmail(email)
        res.status(200).json({message: "success"})
    } catch(err) {
        res.status(400).json({ error: "Invalid credentials" })
    }
}

export const verifyGoogleOrGithub = async (req, res) => {
    const { idToken } = req.body
    try {
        const decoded = await admin.auth().verifyIdToken(idToken)
        const token = generateToken(decoded.uid)
        res.status.json({token})
    } catch(err) {
        res.status(401).json({error: "Invalid FIrebase Token"})
    }
}