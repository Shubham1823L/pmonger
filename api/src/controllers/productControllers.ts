import { RequestHandler } from "express";
import prisma from "../config/prisma";
import * as z from 'zod'

const ProductSchema = z.object({
    name: z.string(),
    avatarPublicId: z.string().optional(),
    stock: z.int().min(0),
    price: z.number().min(0),
    status: z.enum(["Draft", "Published"])
})



export const publishNewProduct: RequestHandler = async (req, res) => {
    const user = req.user
    const parsedData = ProductSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid details")

    const productData = parsedData.data

    const product = await prisma.product.create({
        data: { ...productData, ownerId: user.id }
    })

    return res.success(201, { product }, "Added new Product")

}

export const getProducts: RequestHandler = async (req, res) => {
    const user = req.user

    const products = await prisma.product.findMany({
        where: {
            ownerId: user.id
        }
    })

    return res.success(200, { products })
}


export const getProduct: RequestHandler = async (req, res) => {
    const product = req.body.product
    return res.success(200, { product })
}

export const updateProduct: RequestHandler = async (req, res) => {
    const { productId } = req.params
    const parsedData = ProductSchema.partial().safeParse(req.body)
    if (!parsedData.success || Object.keys(parsedData.data).length === 0) return res.fail(400, "BAD_REQUEST", "Invalid details")

    const productData = parsedData.data

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            ...productData
        }
    })


    return res.success(200, { product: updatedProduct })

    // ###LATER search about the object[key] issue and fix it
    // for (const [key, value] of Object.entries(productData)) {
    // }

}


export const deleteProduct: RequestHandler = async (req, res) => {
    const { productId } = req.params
    if (!productId) return res.fail(400, "BAD_REQUEST", "Product id not received")

    await prisma.product.delete({
        where: {
            id: productId
        }
    })

    return res.sendStatus(204)
}
