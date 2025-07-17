import express from 'express'
import { signup, login, verifyGoogleOrGithub } from '../controllers/auth.controller'
import { protect, authorize } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/social-login', verifyGoogleOrGithub)

router.get("/protected", protect, authorize("admin"), (req, res) => {
  res.json({ message: "You are an admin!" });
});


export default router