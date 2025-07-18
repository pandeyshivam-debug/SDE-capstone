import express from 'express'
import * as fileController from '../controllers/file.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.use(requireAuth)

router.post("/", fileController.create)
router.get("/", fileController.getAll)
router.get("/:id", fileController.getOne)
router.put("/:id", fileController.update)
router.delete("/:id", fileController.remove)

export default router