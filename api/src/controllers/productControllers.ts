import { RequestHandler } from "express";
import prisma from "../config/prisma";
import * as z from 'zod'

const ProductSchema = z.object({
    name: z.string().min(1),
    avatarPublicId: z.string(),
    description: z.string().min(5),
    minimumStock: z.int().min(0).default(0),
    category: z.string().min(1),
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
    const getDefaultParam = (param: unknown, defaultValue: string): string => {
        if (typeof param === 'string') return param
        return defaultValue
    }
    const getDefaultConditionalParam = (param: unknown) => {
        if (param === null || param === undefined || typeof param === 'string') return param
        return undefined
    }

    const page = parseInt(getDefaultParam(req.query.page, "1"))
    const limit = parseInt(getDefaultParam(req.query.limit, "5"))
    const skip = (page - 1) * limit
    const hasPrevPage = page > 1

    const where: Record<string, any> = {
        ownerId: user.id,
    }

    const category = getDefaultConditionalParam(req.query.category)
    where.category = category



    const products = await prisma.product.findMany({
        where,
        orderBy: {
            'updatedAt': 'desc'
        },
        skip,
        take: limit + 1,
    })

    const slicedProducts = products.slice(0, limit) //won't overcut incase of less elements,unlike limit = -1
    const hasNextPage = slicedProducts.length < products.length
    return res.success(200, { products: slicedProducts, hasNextPage, hasPrevPage })
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



export const deleteProducts: RequestHandler = async (req, res) => {
    const user = req.user

    //Check validity of data format
    const DeleteProductsSchema = z.object({
        productIds: z.array(z.string())
    })
    const parsedData = DeleteProductsSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid data")
    const { productIds } = parsedData.data

    //Delete only those products which are owned, and return the count
    const { count } = await prisma.product.deleteMany({
        where: {
            ownerId: user.id,
            id: { in: productIds }
        }
    })

    return res.success(200, { requested: productIds.length, deleted: count }, `Successfully deleted ${count}/${productIds.length} entries`)
}
