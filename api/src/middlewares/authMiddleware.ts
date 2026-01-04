import { RequestHandler } from "express"
import { jwtVerify } from "jose"
import { generateUint8Array } from "../utils/generateToken"
import env from "../config/env"
import prisma from "../config/prisma"
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "../libs/cookieOptions"

const authMiddleware: RequestHandler = async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.fail(401, 'TOKEN_NOT_FOUND', "Access Token was missing")

    let decoded
    try {
        decoded = await jwtVerify(accessToken, generateUint8Array(env.ACCESS_TOKEN_SECRET))

    } catch (error: any) {
        if (error.code === "ERR_JWT_EXPIRED") return res.fail(401, "ACCESS_TOKEN_EXPIRED", "Access Token Expired")
        res.clearCookie('accessToken', ACCESS_COOKIE_OPTIONS)
        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
        return res.fail(401, "UNAUTHORIZED", "Access Token verification failed")
    }
    const email = decoded.payload.email as string
    const user = await prisma.user.findUnique({ where: { email }, select: { email: true, id: true, fullName: true } })
    if (!user) {
        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
        return res.fail(401, "USER_NOT_FOUND", "Invalid Session")
    }
    req.user = user
    next()
}

export default authMiddleware