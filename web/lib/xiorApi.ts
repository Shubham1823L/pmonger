import xior from 'xior'

const baseURL = process.env.NEXT_API_BASE_URL
const xiorFetch = xior.create({
    baseURL,
    credentials: "include",
    cache: 'no-store',
})


export default xiorFetch


