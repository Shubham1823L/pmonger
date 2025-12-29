import { ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err)
    return res.status(500).json({ success: false, code: "INTERNAL_ERROR", message: "Something went wrong!" })
}

export default errorMiddleware