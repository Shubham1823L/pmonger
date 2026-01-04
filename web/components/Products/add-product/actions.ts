'use server'
import fetchData from '@/lib/fetchData'
import xiorFetch from '@/lib/xiorApi'
import { ApiSuccess } from '@/types/api'
import { cookies } from 'next/headers'
import * as z from 'zod'

const SaveProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(5),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    minimumStock: z.coerce.number().int().min(0).default(0),
    avatarPublicId: z.string(),
    category: z.string().min(1),
    status: z.enum(["Draft", "Published"])
})
const saveProduct = async (previousState: unknown, formData: FormData) => {

    const file = formData.get('selectImage')
    if (!(file instanceof File)) throw "Image pls"
    const imageFormData = new FormData()
    imageFormData.append('productAvatar', file)

    let imgData
    try {
        const imgRes = await xiorFetch.post('/uploadFile', imageFormData, { headers: { 'Cookie': (await cookies()).toString() } })
        imgData = imgRes.data.data
    } catch (error) {
        console.error('error uploading file')
        return {
            errors: {
                selectImage: "Error uploading image"
            }
        }
    }
    const avatarPublicId = imgData.publicId as string

    const rawData = Object.fromEntries(formData.entries())
    rawData.avatarPublicId = avatarPublicId
    const parsedData = SaveProductSchema.safeParse(rawData)
    if (!parsedData.success) return console.log("ERROR ho gaya pehle hi",parsedData.error)

    let data
    try {
        const response = await fetchData<{ product: z.infer<typeof SaveProductSchema> }>('post', '/products', parsedData.data)
        data = response.data.data
    } catch (error) {
        return console.error(error, "SHIT")
    }

    console.log(data.product)
}

export default saveProduct