import express from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { 
    createFile,
    getUserFiles,
    getFileById,
    updateFile,
    deleteFile,
    shareFile,        // ✅ Add this
    getCollaborators,
    removeCollaborator } from '../controllers/file.controller'

const router = express.Router()

router.use(requireAuth)

router.get("/", getUserFiles)      
router.get("/:id", getFileById)   
router.post("/", createFile)      
router.put("/:id", updateFile);    
router.delete("/:id", deleteFile)
router.post("/:id/share", shareFile);           // Share file with another user
router.get("/:id/collaborators", getCollaborators); // Get file collaborators
router.delete("/:id/collaborators/:collaboratorId", removeCollaborator); // Remove access

export default router