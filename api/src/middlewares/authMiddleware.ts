import { RequestHandler } from "express"
import { jwtVerify } from "jose"
import { generateUint8Array } from "../utils/generateToken"
import env from "../config/env"
import prisma from "../config/prisma"
import { REFRESH_COOKIE_OPTIONS } from "../libs/cookieOptions"

const authMiddleware: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (!accessToken) return res.fail(401, 'TOKEN_NOT_FOUND', "Access Token was missing")

    let decoded
    try {
        decoded = await jwtVerify(accessToken, generateUint8Array(env.ACCESS_TOKEN_SECRET))

    } catch (error: any) {
        if (error.code === "ERR_JWT_EXPIRED") return res.fail(401, "ACCESS_TOKEN_EXPIRED", "Access Token Expired")
        res.clearCookie('refreshToken',REFRESH_COOKIE_OPTIONS)
        throw error
    }
    const email = decoded.payload.email as string
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        res.clearCookie('refreshToken',REFRESH_COOKIE_OPTIONS)
        return res.fail(401, "USER_NOT_FOUND", "Invalid Session")
    }
    req.user = user
    next()
}

export default authMiddleware