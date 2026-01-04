import { RequestHandler } from "express";
import prisma from "../config/prisma";
import * as z from 'zod'

const ProductSchema = z.object({
    name: z.string().min(5),
    avatarPublicId: z.string(),
    description: z.string().min(5),
    minimumStock: z.int().min(0).default(0),
    category: z.string().min(5),
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
    if (!req.query.page || !req.query.limit) return res.fail(400, "INVALID_QUERY_PARAMS", "Page and/or limit were not defined")
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const skip = (page - 1) * limit

    const products = await prisma.product.findMany({
        where: {
            ownerId: user.id
        },
        orderBy: {
            updatedAt: "desc"
        },
        skip,
        take: limit

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
