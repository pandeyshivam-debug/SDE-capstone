import app from './index.js'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

config()

const PORT = process.env.PORT

// Create HTTP server
const httpServer = createServer(app)

// Create Socket.IO server
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*", // Or your frontend URL
        methods: ["GET", "POST"]
    }
})

// Socket.IO logic
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Join a room based on fileId
    socket.on('joinRoom', (fileId) => {
        socket.join(fileId)
        console.log(`Socket ${socket.id} joined room ${fileId}`)
    })

    // Listen for document updates from editor
    socket.on('docUpdate', ({ fileId, content }) => {
        // Broadcast to others in the same room (except sender)
        socket.to(fileId).emit('receiveUpdate', content)
    })

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`)
    })
})

httpServer.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
})
