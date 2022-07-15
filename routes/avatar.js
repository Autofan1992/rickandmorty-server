import express from 'express'
import { setAvatar } from '../controllers/avatarController.js'

const router = express.Router()

router.post('/', setAvatar)

export default router