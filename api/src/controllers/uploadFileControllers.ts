import { RequestHandler } from "express";
import cloudinary from "../config/cloudinary";
import fs from 'fs'

export const uploadFile: RequestHandler = async (req, res) => {
    const file = req.file
    if (!file) return res.fail(400, "EMPTY_FILE", "File was empty")

    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'pmonger',
        use_filename: true,
        unique_filename: true,
        resource_type: 'auto'
    })

    fs.unlink(file.path, (err) => {
        if (err) {
            console.log('error unlinking file')
            throw err
        }
    })

    res.success(201, { publicId: result.public_id })
}
