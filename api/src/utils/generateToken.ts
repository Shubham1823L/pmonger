import { SignJWT } from "jose"
import env from "../config/env"

type GenerateToken = (email: string) => Promise<string>

export const generateUint8Array = (secret: string | undefined): Uint8Array => new TextEncoder().encode(secret)


export const generateAccessToken: GenerateToken = async (email) => {
    try {
        const accessToken = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime('15 minutes')
            .sign(generateUint8Array(env.ACCESS_TOKEN_SECRET))
        return accessToken
    } catch (error) {
        throw error
    }

}

export const generateRefreshToken: GenerateToken = async (email) => {
    try {
        const refreshToken = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime('30 days')
            .sign(generateUint8Array(env.REFRESH_TOKEN_SECRET))
        return refreshToken
    } catch (error) {
        throw error
    }
}
