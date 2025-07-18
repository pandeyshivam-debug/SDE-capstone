import express from 'express'
import { getBackendToken } from '../controllers/auth.controller'

const router = express.Router()

router.post('/token', getBackendToken)

export default router