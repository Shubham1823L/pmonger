import { ApiError, ApiSuccess } from "@/types/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


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
            cache: 'no-store',
            body: JSON.stringify(bodyData)
        })

        const data = await response.json()
        const finalResponse = { status: response.status, data }


        if (!data.success) throw finalResponse

        return finalResponse

    } catch (error) {
        throw error
    }


}

export default fetchData