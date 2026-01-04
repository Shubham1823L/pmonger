'use client'
import React, { useActionState, useEffect, useRef, useState } from 'react'
import styles from '@/app/(BaseLayout)/products/add-product/addProduct.module.css'
import { ChevronDown, CloudUpload, ImagePlus, IndianRupee, Save } from 'lucide-react'
import saveProduct from './actions'
import clsx from 'clsx'

const Form = () => {
  const [data, action, isPending] = useActionState(saveProduct, undefined)
  const [tempURL, setTempURL] = useState<string>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setTempURL(URL.createObjectURL(files[0]))
  }


  return (
    <form action={action} className={styles.form}>
      <div className={styles.main}>
        <FieldBase title='Name and Description'>
          <div className={styles.nameAndDesc}>
            <label htmlFor="name">Product Name</label>
            <input type="text" name='name' id="name" />
            <label htmlFor="description">Description</label>
            <textarea name='description' id="description" />
          </div>
        </FieldBase>
        <FieldBase title='Category'>
          <div className={styles.category}>
            <label htmlFor="category">Select Category</label>
            <div className={styles.selectWrapper}>
              <select name='category' id="category">
                <option value="Appliance">Appliance</option>
                <option value="Electronic">Electronic</option>
              </select>
              <ChevronDown />
            </div>

          </div>
        </FieldBase>
        <FieldBase title='Manage Stock'>
          <div className={styles.stock}>
            <div>
              <label htmlFor="stock">Stock</label>
              <input type="number" name='stock' id="stock" inputMode='numeric' />
            </div>
            <div>
              <label htmlFor="minimumStock">Minimum Stock</label>
              <input type="number" name='minimumStock' id="minimumStock" inputMode='numeric' />
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
              <input type="number" inputMode='numeric' name='price' id='price' />
            </div>
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
        </FieldBase>
        <div className={styles.submitBtns}>
          <button name='status' value='Draft' disabled={isPending} className={clsx(styles.draftBtn, isPending && styles.disabledBtn)}>
            <Save /> Save as Draft
          </button>
          <button name='status' value='Published' disabled={isPending} className={clsx(styles.publishBtn, isPending && styles.disabledBtn)}>
            <CloudUpload />  Publish
          </button>
        </div>
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
