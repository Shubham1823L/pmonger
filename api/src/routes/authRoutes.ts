import express from 'express'
import { login, logout, refresh, signup, validateSession } from '../controllers/authControllers'
import asyncHandler from '../utils/asyncHandler'

const router = express.Router()

router.post('/signup', asyncHandler(signup))

router.post('/login', asyncHandler(login))

router.post('/logout', logout)

router.post('/refresh', asyncHandler(refresh))

router.post('/validateSession',asyncHandler(validateSession))

export default router