import { Request, Response, NextFunction, RequestHandler } from "express"

// export type RouteHandler = (req: Request, res: Response, next: NextFunction) => Response | NextFunction | void | Promise<void> | Promise<any>

export type AsyncHandler = (fn: RequestHandler) => RequestHandler

export type MiddlewareUser = {
    id: string,
    fullName: string,
    email: string
}

export type CookieOptions = {
    httpOnly: boolean,
    secure: boolean,
    sameSite: "lax",
    maxAge: number,
}