import express from 'express'
import asyncHandler from '../utils/asyncHandler'
import { deleteProduct, deleteProducts, getProduct, getProducts, publishNewProduct, updateProduct } from '../controllers/productControllers'
import prisma from '../config/prisma'
import authMiddleware from '../middlewares/authMiddleware'


const router = express.Router()

router.use(asyncHandler(authMiddleware))

router.route('/')
    .get(asyncHandler(getProducts))
    .post(asyncHandler(publishNewProduct))
    .delete(asyncHandler(deleteProducts))


router.route('/:productId')
    .get(asyncHandler(getProduct))
    .patch(asyncHandler(updateProduct))
    .delete(asyncHandler(deleteProduct))


//router.param runs RIGHT BEFORE the matching param router[method], so if there is a local middleware inside the router[method], then router.param would have already ran before it , however if router.use or app.use are used then router.param can use values passed by them as well since it runs after them BUT RIGHT BEFORE the actual router[method]

router.param('productId', async (req, res, next, productId) => {
    const user = req.user
    //Check if associated product exists and user is the real owner
    try {
        const product = await prisma.product.findUnique({ where: { id: productId } })
        //For security purposes , we do not forward 403 incase of wrong ownership
        if (!product || product.ownerId != user.id) return res.fail(404, "NOT_FOUND", "Product does not exist")
        req.body = { ...req.body, attachedProduct: product }
        next()
    } catch (error) {
        next(error)
    }
})

export default router