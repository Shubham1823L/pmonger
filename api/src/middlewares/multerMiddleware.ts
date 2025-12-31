import multer from "multer"
import fs from 'fs'
import { RequestHandler } from "express"

export const checkUploadPath: RequestHandler = async (req, res, next) => {
    await fs.promises.mkdir('tmp', { recursive: true })
    next()
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp')
    },
    filename: function (req, file, cb) {
        const uniqueFilename = Date.now() + '-' + Math.floor(Math.random() * 1e6) + '-' + file.originalname
        cb(null, uniqueFilename)
    }

})



const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) return cb(null, true)
        cb(new Error('Inalid File type'))
    },
})

export default upload