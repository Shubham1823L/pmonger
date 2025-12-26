import express from 'express'
import { signup } from '../controllers/authControllers'

const router = express.Router()

router.get('/', signup)

export default router