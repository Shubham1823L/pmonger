import { RequestHandler } from "express";
import cloudinary from "../config/cloudinary";
import fs from 'fs'
import prisma from "../config/prisma";

export const uploadFile: RequestHandler = async (req, res) => {
    const user = req.user
    const file = req.file
    if (!file) return res.fail(400, "EMPTY_FILE", "File was empty")

    const publicId = req.body.avatarPublicId
    console.log(publicId)
    //###LATER FIX For now we assume that owner gives his publicId only , and no intruders are there
    let updateImageOptions = {}
    if (publicId) updateImageOptions = {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
    }
    console.log(updateImageOptions)
    console.log({ ...updateImageOptions })

    const result = await cloudinary.uploader.upload(file.path, {
        asset_folder:"pmonger",
        use_filename: true,
        unique_filename: true,
        resource_type: 'auto',
        ...updateImageOptions,
    })

    fs.unlink(file.path, (err) => {
        if (err) {
            console.log('error unlinking file')
            throw err
        }
    })

    res.success(201, { publicId: result.public_id })
}
