import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from './../libs/cookieOptions';
import { RequestHandler } from "express"
import prisma from "../config/prisma"
import * as z from 'zod'
import * as argon2 from "argon2"
import { generateAccessToken, generateRefreshToken, generateUint8Array } from "../utils/generateToken"
import { jwtVerify } from 'jose';
import env from '../config/env';


const SignupSchema = z.object({
    fullName: z.string(),
    email: z.email(),
    password: z.string(),
})

const LoginSchema = z.object({
    email: z.email(),
    password: z.string(),
})


export const signup: RequestHandler = async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid Details")

    const { data: { email, password, fullName } } = parsedData

    //Check if email is already registered
    if (await prisma.user.findUnique({ where: { email } })) return res.fail(409, "EMAIL_TAKEN", "Email already registered")

    //Hashing password
    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 64 * 1024, //in kb
        timeCost: 3, // no. of iterations
        parallelism: 1 // threads used
    })

    const user = await prisma.user.create({
        data: {
            email, fullName, passwordHash
        },
        select: { id: true, email: true, fullName: true }
    })

    const accessToken = await generateAccessToken(email)
    const refreshToken = await generateRefreshToken(email)

    res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS)
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)

    return res.success(201, { user }, "Account created successfully")


    const otp = Math.floor(Math.random() * (1e6 - 1e5) + 1e5)

    //Generating otpHash
    const otpHash = await argon2.hash(otp.toString(), {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost: 3,
        parallelism: 1
    })

    //Otp window will remain valid for 15mins
    //Otp will remain valid for 5 mins

    // NEED TO THINK ABOUT WRONG OTP ATTEMPT AND NOT JUST LIMIT

    //Above two => resend otp works only till 15 mins then session dies and user must re submit whole form
    //User may resend otp 2 times per window
    //Total no. of otp request including first ones = 6 attempts/24hrs , this is the limit for that particular email to be registered

}



export const login: RequestHandler = async (req, res) => {
    const parsedData = LoginSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid credentials")

    const { email, password } = parsedData.data

    //Avoid sending more specific status codes and messages to prevent attacks
    //Check if user exists and then check if password exists , necessary for oauth only users
    const user = await prisma.user.findUnique({
        where: { email },
        select: { fullName: true, email: true, id: true, passwordHash: true }
    })
    if (!user?.passwordHash || !await argon2.verify(user.passwordHash, password)) return res.fail(401)
    const { passwordHash, ...filterdUser } = user

    // User successfully authenticated, creating JWTs
    const accessToken = await generateAccessToken(email)
    const refreshToken = await generateRefreshToken(email)

    res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS)
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)

    return res.success(200, { user: filterdUser })
}

export const logout: RequestHandler = (req, res) => {
    res.clearCookie('accessToken', ACCESS_COOKIE_OPTIONS)
    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)

    return res.sendStatus(204)
}


export const refresh: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.fail(401, "TOKEN_NOT_FOUND", "Session expired, please relogin")

    let decoded
    try {
        decoded = await jwtVerify(refreshToken, generateUint8Array(env.REFRESH_TOKEN_SECRET))
    } catch (error) {
        return res.fail(401)
    }
    const email = decoded.payload.email as string
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.fail(401)

    const accessToken = await generateAccessToken(email)
    res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS)
    return res.success()
}
