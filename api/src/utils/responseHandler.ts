import { RequestHandler } from "express";

const responseHandler: RequestHandler = (req, res, next) => {
    res.success = (status = 200, data = {}, message = "Successful Request") => {
        return res.status(status).json({ success: true, data, message })
    }
    res.fail = (status = 500, code, message = "Something went wrong!") => {
        if (!code) {
            if (status === 401) code = "UNAUTHORIZED"
            else if (status === 403) code = "FORBIDDEN"
            else if (status === 500) code = "INTERNAL_ERROR"
            else if(status ===400) code = "BAD_REQUEST"
        }

        return res.status(status).json({ success: false, code, message })
    }
    next()
}

export default responseHandler