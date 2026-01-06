'use client'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from '@/app/(BaseLayout)/products/add-product/addProduct.module.css'
import { ChevronDown, CloudUpload, ImagePlus, IndianRupee, Save } from 'lucide-react'
import clsx from 'clsx'
import categories from '@/lib/categoies'
import { type Product } from '@/types/product'
import { FormFields, FormSchema } from './schema'



type FormProps = {
  product?: Product,
  onSubmit: SubmitHandler<FormFields>,
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  tempURL: string,
  fileError: string,

}

const Form = ({ product, onSubmit, handleFileChange, tempURL, fileError }: FormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFields>({
    resolver: zodResolver(FormSchema), defaultValues: product ? {
      name: product.name,
      stock: product.stock,
      minimumStock: product.minimumStock,
      description: product.description,
      category: product.category,
      price: product.price,
      status: product.status
    } : undefined
  })




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

export const FieldBase = ({ children, title, }: FieldBaseProps) => {
  return (
    <fieldset className={styles.nameAndDesc}>
      <legend className='sr-only'>{title}</legend>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </fieldset>
  )
}
