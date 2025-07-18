import { verifyToken } from "../utils/jwt.utils"

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ error: "No token provided" })

    const token = authHeader.split(" ")[1]

    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

export function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role)
            return res.status(403).json({ error: "Forbidden" })
        next()
    }
}