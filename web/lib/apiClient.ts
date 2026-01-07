import { ApiSuccess } from "@/types/api"


type Method = "get" | "post" | "put" | "patch" | "delete"

const apiClient = async <T,>(method: Method, input: RequestInfo, bodyData?: object): Promise<ApiSuccess<T>> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    try {
        const response = await fetch(`${baseUrl}${input}`, {
            method: method.toUpperCase(),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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

export default apiClient