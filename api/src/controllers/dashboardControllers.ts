import { RequestHandler } from "express";
import prisma from "../config/prisma";

export const getDashboardOverview: RequestHandler = async (req, res) => {
    const user = req.user

    const productsByCategoryPromise = prisma.product.groupBy({
        by: ['category'],
        _count: {
            _all: true,
            category: true
        },
        where: {
            ownerId: user.id
        }
        //where runs before grouping, having runs after grouping
    })

    const productsByLatestUpdatedAtPromise = prisma.product.findMany({
        where: {
            ownerId: user.id
        },
        orderBy: {
            updatedAt: 'desc'
        },
        take: 5,
    })

    const productsByNewlyAddedPromise = prisma.$queryRaw`
    SELECT 
    CAST("createdAt" as DATE) as date, 
    COUNT(*)::INT as count 
    FROM "Product" 
    WHERE "ownerId" = ${user.id} AND "createdAt" >= NOW() - INTERVAL '30 days'
    GROUP BY date;
    `

    const productsMetricsPromise = prisma.$queryRaw<{ total: number, outOfStock: number, draft: number, categories: number }[]>`
    SELECT
    COUNT(*)::INT AS total,
    COUNT(*) FILTER (WHERE stock = 0)::INT AS "outOfStock",
    COUNT(*) FILTER (WHERE status = 'Draft')::INT AS draft,
    COUNT(DISTINCT category)::INT as categories
    FROM "Product"
    WHERE "ownerId" = ${user.id};
    `



    const [productsByCategory, productsByLatestUpdatedAt, productsByNewlyAdded, productsMetrics] = await Promise.all([productsByCategoryPromise, productsByLatestUpdatedAtPromise, productsByNewlyAddedPromise, productsMetricsPromise])
    return res.success(200, { productsByCategory, productsByLatestUpdatedAt, productsByNewlyAdded, productsMetrics: productsMetrics[0] })
}
