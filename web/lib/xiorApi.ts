import xior, { XiorRequestConfig } from 'xior'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const xiorFetch = xior.create({
    baseURL,
    credentials: "include",
    cache: 'no-store',
})

xiorFetch.interceptors.response.use(res => res, async err => {
    const originalRequest = err.config as XiorRequestConfig & { hasRetried: boolean } | undefined


    if ((err.response?.data.code === 'ACCESS_TOKEN_EXPIRED' || err.response?.data.code === "ACCESS_TOKEN_EXPIRED") && originalRequest && !originalRequest.hasRetried) {
        originalRequest.hasRetried = true

        try {
            await xior.post('/auth/refresh', {}, {
                baseURL,
                credentials: 'include',
            })
        } catch (error) {
            console.log("Session Expired 401")
            return Promise.reject()
        }

        return xiorFetch(originalRequest as XiorRequestConfig)
    }

    return Promise.reject(err)
})


export default xiorFetch


