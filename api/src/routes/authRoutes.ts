import express from 'express'
import { login, signup } from '../controllers/authControllers'
import asyncHandler from '../utils/asyncHandler'

const router = express.Router()

router.post('/signup', asyncHandler(signup))

router.post('/login', asyncHandler(login))

export default router