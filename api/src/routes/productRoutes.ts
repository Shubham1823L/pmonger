import express from 'express'
import asyncHandler from '../utils/asyncHandler'
import { deleteProduct, getProducts, publishNewProduct } from '../controllers/productControllers'
import prisma from '../config/prisma'
import authMiddleware from '../middlewares/authMiddleware'


const router = express.Router()
router.param('productId', async (req, res, next, productId) => {
    console.log('inside router.param')
    const user = req.user
    //Check if associated product exists and user is the real owner
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return res.fail(404, "NOT_FOUND", "Product does not exist")
    if (product.ownerId != user.id) return res.fail(403, "UNAUTHRORIZED", "Can access your products only")
        
    next()
})

router.use(asyncHandler(authMiddleware))

router.post('/', asyncHandler(publishNewProduct))

router.get('/', asyncHandler(getProducts))

router.delete('/:productId', asyncHandler(deleteProduct))

//router.param runs RIGHT BEFORE the matching param router[method], so if there is a local middleware inside the router[method], then router.param would have already ran before it , however if router.use or app.use are used then router.param can use values passed by them as well since it runs after them BUT RIGHT BEFORE the actual router[method]

router.param('productId', async (req, res, next, productId) => {
    const user = req.user
    //Check if associated product exists and user is the real owner
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return res.fail(404, "NOT_FOUND", "Product does not exist")
    if (product.ownerId != user.id) return res.fail(403, "UNAUTHRORIZED", "Can access your products only")
        
    next()
})

export default router