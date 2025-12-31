import express from 'express'
import authMiddleware from '../middlewares/authMiddleware'
import asyncHandler from '../utils/asyncHandler'
import { uploadFile } from '../controllers/uploadFileControllers'
import upload, { checkUploadPath } from '../middlewares/multerMiddleware'

const router = express.Router()

router.use(authMiddleware)
router.use(asyncHandler(checkUploadPath))

router.post('/', upload.single('productAvatar'), asyncHandler(uploadFile))

export default router