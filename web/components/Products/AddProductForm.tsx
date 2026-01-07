'use client'
import React, { useState } from 'react'
import Form from './Form'
import { toast } from 'sonner'
import { SubmitHandler } from 'react-hook-form'
import xiorFetch from '@/lib/xiorApi'
import apiClient from '@/lib/apiClient'
import { type Product } from '@/types/product'
import { FormFields } from './schema'

const AddProductForm = () => {

    const [tempURL, setTempURL] = useState<string>('')
    const [file, setFile] = useState<File>()
    const [fileError, setFileError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length == 0) return setFileError('Image cannot be empty')

        setFile(files[0])
        setFileError('')
        setTempURL(URL.createObjectURL(files[0]))
    }

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (fileError || !file) return setFileError('Image cannot be empty')

        toast.loading("Uploading image...", {
            id: "api"
        })
        const imgFormData = new FormData()
        imgFormData.append('productAvatar', file)

        let imgData
        try {
            const imgRes = await xiorFetch.post('/uploadFile', imgFormData)
            imgData = imgRes.data.data
        } catch (error) {
            toast.dismiss('api')
            return toast.error("Something went wrong", {
                id: 'api',
                description: "Image upload failed"
            })
        }

        toast.dismiss('api')
        toast.loading("Saving Product...", {
            id: "api"
        })
        const avatarPublicId = imgData.publicId as string

        //Now, saving product data
        try {
            await apiClient<{ product: Product }>('post', '/products', { ...data, avatarPublicId })
        } catch (error) {
            toast.dismiss('api')
            return toast.error("Something went wrong", {
                id: 'api',
                description: "Product could not be saved"
            })
        }

        setTempURL('')
        const succuessMessage = data.status === 'Draft' ? "Draft Successful" : "Published"
        toast.dismiss('api')
        toast.success(succuessMessage, {
            description: "Product added successfully !",
            id: "api"
        })

    }

    return (
        <Form onSubmit={onSubmit} handleFileChange={handleFileChange} tempURL={tempURL} fileError={fileError} />
    )
}

export default AddProductForm
