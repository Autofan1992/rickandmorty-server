import express from 'express'
import { getLinkedinAuthInfo, getUserAuthInfo } from '../controllers/loginController.js'

const router = express.Router()

router.get('/', getLinkedinAuthInfo)

router.get('/me', getUserAuthInfo)

export default router