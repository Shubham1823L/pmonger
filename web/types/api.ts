export type ApiResponse<T> = ApiError | ApiSuccess<T>

export type ApiError = {
    status: number,
    data: {
        success: false,
        code: string,
        message: string
    }

}

export type ApiSuccess<T> = {
    status: number,
    data: {
        success: true,
        data: T
        message: string
    }

}
