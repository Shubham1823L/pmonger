import express from 'express'
import asyncHandler from '../utils/asyncHandler'
import { getDashboardOverview } from '../controllers/dashboardControllers'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware)

router.get('/',asyncHandler(getDashboardOverview))

export default router