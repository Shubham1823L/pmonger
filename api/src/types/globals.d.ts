import { MiddlewareUser } from "./types"

declare global {
    namespace Express {
        interface Request {
            user: MiddlewareUser
        }
        interface Response {
            success: (status?: number, data?: object, message?: string) => Response,
            fail: (status?: number, code?: string, message?: string) => Response
        }
    }
}

export { }