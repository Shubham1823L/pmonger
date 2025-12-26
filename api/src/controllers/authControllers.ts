import { Request, Response } from "express"
import prisma from "../config/prisma"

export const signup = async (req: Request, res: Response) => {
    await prisma.user.createMany({
        data: [{
            name: "Shubham Panjiyara"
        }, {
            name: "GOGA SINGH"
        }]
    })
    const data = await prisma.user.findMany()
    res.status(200).json({
        success: true,
        data,
        message: "Successfull Request"
    })
}
