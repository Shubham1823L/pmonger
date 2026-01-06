'use client'
import React, { useState } from 'react'
import Form from './Form'
import { toast } from 'sonner'
import { SubmitHandler } from 'react-hook-form'
import xiorFetch from '@/lib/xiorApi'
import apiClient from '@/lib/apiClient'
import { type Product } from '@/types/product'
import { FormFields } from './schema'
import { isEqual } from 'lodash-es'
import { getImgURL } from '@/lib/cloudinary'

type EditProductFormProps = {
    product: Product
}


const EditProductForm = ({ product }: EditProductFormProps) => {

    const [tempURL, setTempURL] = useState<string>(getImgURL(product.avatarPublicId, 400))
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
        //We should not throw error if no img is selected, but update image if any image is selected
        //Incase the image is updated, we do not need to pass the publicId , as it will remain the same
        if (file) {
            toast.loading("Uploading image...", {
                id: 'editProduct'
            })

            const imgFormData = new FormData()
            imgFormData.append('productAvatar', file)
            imgFormData.append('avatarPublicId', product.avatarPublicId)
            try {
                await xiorFetch.post('/uploadFile', imgFormData)
                toast.dismiss('editProduct')
            } catch (error) {
                toast.dismiss('editProduct')
                return toast.error("Something went wrong", {
                    id: 'editProduct',
                    description: "Image upload failed"
                })
            }
        }



        const { id, avatarPublicId, createdAt, updatedAt, ownerId, ...changableData } = product
        const dataIsSame = isEqual(data, changableData)

        if (dataIsSame && file) return toast.success("Successful update", {
            description: "Image updated successfully",
            id: "editProduct"
        })
        if (dataIsSame && !file) return toast.error("Invalid Request", {
            description: "No changes were made",
            id: "editProduct"
        })


        for (const key in data) {
            if (data[key] == changableData[key]) delete changableData[key]
        }

        toast.loading("Saving Product...", {
            id: "editProduct"
        })

        try {
            await apiClient<{ product: Product }>('patch', `/products/${product.id}`, changableData)
        } catch (error) {
            toast.dismiss('editProduct')
            return toast.error("Something went wrong", {
                id: 'editProduct',
                description: "Product could not be saved"
            })
        }

        const succuessMessage = data.status === 'Draft' ? "Draft Successful" : "Published"
        toast.dismiss('editProduct')
        toast.success(succuessMessage, {
            description: "Product updated successfully !",
            id: "editProduct"
        })


    }


    return (
        <Form onSubmit={onSubmit} handleFileChange={handleFileChange} tempURL={tempURL} fileError={fileError} product={product} />
    )
}

export default EditProductForm
