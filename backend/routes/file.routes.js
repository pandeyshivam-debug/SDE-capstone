import express from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { 
    createFile,
    getUserFiles,
    getFileById,
    updateFile,
    deleteFile } from '../controllers/file.controller'

const router = express.Router()

router.use(requireAuth)

router.get("/", getUserFiles)      
router.get("/:id", getFileById)   
router.post("/", createFile)      
router.put("/:id", updateFile);    
router.delete("/:id", deleteFile)

export default router