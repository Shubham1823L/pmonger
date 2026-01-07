import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import * as cookie from 'cookie'
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const protectedRoutes: Array<string> = ["/dashboard", "/products"]
const antiProtectedRoutes: Array<string> = ["/login", "signup"]

export default async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const res = NextResponse.next()

    const isProtectedRoute = protectedRoutes.includes(pathname)
    const isAntiProtectedRoute = antiProtectedRoutes.includes(pathname)

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
    const accessToken = req.cookies.get('accessToken')
    const refreshToken = req.cookies.get('refreshToken')
    if (accessToken) {
        if (!accessToken && isProtectedRoute) NextResponse.redirect(new URL('/login', req.nextUrl))
        if (accessToken && isAntiProtectedRoute) NextResponse.redirect(new URL('/dashboard', req.nextUrl))
        return res
    }

    else if (refreshToken) {
        const response = await fetch(`${baseURL}/auth/validateSession`, {
            method: "POST",
            headers: {
                'Cookie': (await cookies()).toString()
            }
        })

        const cookieHeader = response.headers.get('set-cookie')
        if (response.ok && cookieHeader) res.cookies.set(cookie.parseSetCookie(cookieHeader) as ResponseCookie)



        if (!response.ok && isProtectedRoute) NextResponse.redirect(new URL('/login', req.nextUrl))
        if (response.ok && isAntiProtectedRoute) NextResponse.redirect(new URL('/dashboard', req.nextUrl))
        return res
    }


    if (isProtectedRoute) NextResponse.redirect(new URL('/login', req.nextUrl))
    return res

}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.well-known/appspecific/com.chrome.devtools.json).*)',
    ],
}