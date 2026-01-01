import { ApiError, ApiResponse, ApiSuccess } from "@/types/api"
import { cookies } from "next/headers"

type Method = "get" | "post" | "put" | "patch" | "delete"

const fetchData = async <T,>(method: Method, input: RequestInfo, bodyData?: object): Promise<ApiSuccess<T>> => {
    try {
        const response = await fetch(input, {
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
        if (!data.success) throw finalResponse as ApiError
        return finalResponse

    } catch (error) {
        const finalResponse = { status: 500, data: { success: false, code: "INTERNAL_ERROR", message: "Something went wrong!" } }
        throw finalResponse as ApiError
    }


}

export default fetchData