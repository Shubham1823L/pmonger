'use client'
import React, { useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from '@/app/(BaseLayout)/products/add-product/addProduct.module.css'
import { Check, CheckCircle, ChevronDown, Circle, CircleCheck, CloudUpload, ImagePlus, IndianRupee, Save } from 'lucide-react'
import clsx from 'clsx'
import categories from '@/lib/categoies'
import apiClient from '@/lib/apiClient'
import xiorFetch from '@/lib/xiorApi'
import { type Product } from '@/types/product'
import { toast } from 'sonner'


// type FormFields = {
//   name: string,
//   description: string,
//   category: string,
//   stock: number,
//   minimumStock: number,
//   price: number,
//   selectImage: FileList,
//   status: "Draft" | "Published"
// }

const FormSchema = z.object({
  name: z.string().min(5, { error: "Minimum 5 characters" }),
  description: z.string().min(5, { error: "Minimum 5 characters" }),
  category: z.string(),
  stock: z.preprocess(e => e === '' ? undefined : e,
    z.coerce.number({ error: "Must be an integer" }).int({ error: "Must be an integer" }).min(0, { error: "Cannot be negative" })
  ),
  minimumStock: z.preprocess(e => e === '' ? undefined : e,
    z.coerce.number({ error: "Must be an integer" }).int({ error: "Must be an integer" }).min(0, { error: "Cannot be negative" })
  ),
  price: z.preprocess(e => e === '' ? undefined : e,
    z.coerce.number({ error: "Must be a number" }).min(0, { error: "Cannot be negative" })
  ),
  status: z.enum(["Draft", "Published"])
})

type FormFields = z.infer<typeof FormSchema>

const Form = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting, isSubmitted } } = useForm<FormFields>({ resolver: zodResolver(FormSchema) })
  const [tempURL, setTempURL] = useState<string>()

  const [file, setFile] = useState<File>()
  const [fileError, setFileError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return setFileError('Image cannot be empty')
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

    let productData
    try {
      const response = await apiClient<{ product: Product }>('post', '/products', { ...data, avatarPublicId })
      productData = response.data.data.product
    } catch (error) {
      toast.dismiss('api')
      return toast.error("Something went wrong", {
        id: 'api',
        description: "Product could not be saved"
      })
    }

    const succuessMessage = data.status === 'Draft' ? "Draft Successful" : "Published"

    toast.dismiss('api')
    toast.success(succuessMessage, {
      description: "Product added successfully !",
      id: "api"
    })

  }

  useEffect(() => {
    setTempURL('')
  }, [isSubmitted])


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.main}>
        <FieldBase title='Name and Description'>
          <div className={styles.nameAndDesc}>
            <label htmlFor="name">Product Name</label>
            <input {...register('name')} type="text" name='name' id="name" />
            {errors.name && <div className={styles.errorMsg}>{errors.name.message}</div>}
            <label htmlFor="description">Description</label>
            <textarea {...register('description')} name='description' id="description" />
            {errors.description && <div className={styles.errorMsg}>{errors.description.message}</div>}
          </div>
        </FieldBase>
        <FieldBase title='Category'>
          <div className={styles.category}>
            <label htmlFor="category">Select Category</label>
            <div className={styles.selectWrapper}>
              <select {...register('category')} name='category' id="category">
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
              <ChevronDown />
            </div>
            {errors.category && <div className={styles.errorMsg}>{errors.category.message}</div>}

          </div>
        </FieldBase>
        <FieldBase title='Manage Stock'>
          <div className={styles.stock}>
            <div>
              <label htmlFor="stock">Stock</label>
              <input {...register('stock')} type="number" name='stock' id="stock" inputMode='numeric' step={'any'} />
              {errors.stock && <div className={styles.errorMsg}>{errors.stock.message}</div>}
            </div>
            <div>
              <label htmlFor="minimumStock">Minimum Stock</label>
              <input {...register('minimumStock')} type="number" name='minimumStock' id="minimumStock" inputMode='numeric' step={'any'} />
              {errors.minimumStock && <div className={styles.errorMsg}>{errors.minimumStock.message}</div>}
            </div>
          </div>
        </FieldBase>
      </div>
      <div className={styles.sidebar}>
        <FieldBase title='Product Pricing'>
          <div className={styles.pricing}>
            <label htmlFor="price">Price</label>
            <div className={styles.priceInputWrapper}>
              <IndianRupee size={20} />
              <input {...register('price')} type="number" inputMode='numeric' step={'any'} name='price' id='price' />
            </div>
            {errors.price && <div className={styles.errorMsg}>{errors.price.message}</div>}
          </div>
        </FieldBase>
        <FieldBase title='Product Image'>
          <div className={styles.image}>
            <div className={styles.selectImage}>
              <label htmlFor="selectImage">
                <ImagePlus />
                Click to Upload
              </label>
              <input onChange={handleFileChange} type="file" accept='image/*' name='selectImage' id='selectImage' />
            </div>
            <div className={styles.imagePreview}>
              {
                tempURL && <img src={tempURL} alt="product-image-preview" />
              }
            </div>
          </div>
          {fileError && <div className={styles.errorMsg}>{fileError}</div>}
        </FieldBase>
        <div className={styles.submitBtns}>
          <button disabled={isSubmitting} {...register('status')} name='status' value='Draft' className={clsx(styles.draftBtn, isSubmitting && styles.disabledBtn)}>
            <Save /> Save as Draft
          </button>
          <button disabled={isSubmitting} {...register('status')} name='status' value='Published' className={clsx(styles.publishBtn, isSubmitting && styles.disabledBtn)}>
            <CloudUpload />  Publish
          </button>
        </div>
        {errors.root && <div className={styles.errorMsg}>{errors.root.message}</div>}
      </div>
    </form>
  )
}

export default Form


type FieldBaseProps = {
  children: React.ReactNode,
  title: string,
}

const FieldBase = ({ children, title, }: FieldBaseProps) => {
  return (
    <fieldset className={styles.nameAndDesc}>
      <legend className='sr-only'>{title}</legend>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </fieldset>
  )
}
