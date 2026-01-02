import { ApiError, ApiSuccess } from "@/types/api"
import { cookies } from "next/headers"
import * as cookie from 'cookie'
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

type Method = "get" | "post" | "put" | "patch" | "delete"

const fetchData = async <T,>(method: Method, input: RequestInfo, bodyData?: object): Promise<ApiSuccess<T>> => {
    const baseUrl = process.env.NEXT_API_BASE_URL
    try {
        const response = await fetch(`${baseUrl}${input}`, {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': (await cookies()).toString()
            },
            body: JSON.stringify(bodyData)
        })

        const data = await response.json()

        /*data= {success:boolean,code:string | data:T,message:string}
         we want to make the final response similar to axiosResponse like finalResponse = {
        status:number,data:actual data returned by server which can be a json like {success:boolean,code|data,message} or a simple text or array
        }*/
        const finalResponse = { status: response.status, data }
        if (!data.success) {
            if (data.code === "TOKEN_NOT_FOUND" || data.code === "ACCESS_TOKEN_EXPIRED") {

                try {
                    const response = await fetch(`${baseUrl}/auth/refresh`, {
                        method: 'POST',
                        credentials: "include",
                        headers: {
                            'Cookie': (await cookies()).toString()
                        },
                    })
                    //Retrying request
                    if (!response.ok) throw { success: false, code: "UNAUTHORIZED", message: "Session expired" }

                    //Successfully refreshed accessToken, now setting it for browser since ssr has got it rn, express can't connect to browser directly
                    const cookieHeader = response.headers.get('set-cookie')
                    if (!cookieHeader) throw { success: false, code: "UNAUTHORIZED", message: "Session Expired" }
                    const { expires, ...parsedCookie } = cookie.parseSetCookie(cookieHeader);
                    (await cookies()).set(parsedCookie as ResponseCookie)




                } catch (error) {
                    console.log(error)
                    throw { success: false, code: "UNAUTHORIZED", message: "Session Expired" }
                }

                try {
                    const response = await fetch(`${baseUrl}${input}`, {
                        method: method.toUpperCase(),
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': (await cookies()).toString()
                        },
                        body: JSON.stringify(bodyData)
                    })

                    const data = await response.json()

                    const finalResponse = { status: response.status, data }
                    if (!data.success) throw finalResponse as ApiError
                    return finalResponse

                } catch (error) {
                    const finalResponse = { status: 500, data: { success: false, code: "INTERNAL_ERROR", message: "Something went wrong!" } }
                    throw finalResponse as ApiError
                }


            }
            throw finalResponse as ApiError
        }
        return finalResponse

    } catch (error) {
        const finalResponse = { status: 500, data: { success: false, code: "INTERNAL_ERROR", message: "Something went wrong!" } }
        throw finalResponse as ApiError
    }


}

export default fetchData