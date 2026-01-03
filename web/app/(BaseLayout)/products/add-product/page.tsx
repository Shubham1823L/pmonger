import { Metadata } from 'next'
import React from 'react'
import styles from './addProduct.module.css'
import prodcutsStyles from '../products.module.css'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, CloudUpload, ImagePlus, IndianRupee, Save } from 'lucide-react'

export const metadata: Metadata = {
  title: "Add Product - PMonger",
  description: "Add new product"
}

const AddProduct = () => {
  return (
    <div className={prodcutsStyles.wrapper}>
      <div className={prodcutsStyles.header}>
        <h1>Add Product</h1>
        <Link href='/products'>
          <ArrowLeft size={24} />
          <span>Go back</span>
        </Link>
      </div>

      <form className={styles.form}>
        <div className={styles.main}>
          <FieldBase title='Name and Description'>
            <div className={styles.nameAndDesc}>
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" />
              <label htmlFor="description">Description</label>
              <textarea id="description" />
            </div>
          </FieldBase>
          <FieldBase title='Category'>
            <div className={styles.category}>
              <label htmlFor="category">Select Category</label>
              <div className={styles.selectWrapper}>
                <select id="category">
                  <option value="0">WOW</option>
                  <option value="1">goga</option>
                </select>
                <ChevronDown />
              </div>

            </div>
          </FieldBase>
          <FieldBase title='Manage Stock'>
            <div className={styles.stock}>
              <div>
                <label htmlFor="stock">Stock</label>
                <input type="number" id="stock" inputMode='numeric' />
              </div>
              <div>
                <label htmlFor="minimumStock">Minimum Stock</label>
                <input type="number" id="minimumStock" inputMode='numeric' />
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
                <input type="number" inputMode='numeric' id='price' />
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
                <input type="file" accept='image/*' id='selectImage' />
              </div>
              <div className={styles.imagePreview}>
                {/* <img className={styles.productImage} src="https://res.cloudinary.com/dvln1dlk4/image/upload/w_auto/q_auto/f_auto/v1767196817/lushiroProject_uploads/1767196816477-900961976_oamtmt.jpg" alt="product-image" /> */}
              </div>
            </div>
          </FieldBase>
          <div className={styles.submitBtns}>
            <button className={styles.draftBtn}>
              <Save /> Save as Draft
            </button>
            <button className={styles.publishBtn}>
              <CloudUpload />  Publish
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProduct

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