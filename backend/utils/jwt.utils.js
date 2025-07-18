import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn})
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET)
}