import { Metadata } from 'next'
import React from 'react'
import productsStyles from '../products.module.css'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Form from '@/components/Products/add-product/Form'

export const metadata: Metadata = {
  title: "Add Product - P Monger",
  description: "Add new product"
}

const AddProduct = () => {
  return (
    <div className={productsStyles.wrapper}>
      <div className={productsStyles.header}>
        <h1>Add Product</h1>
        <Link href='/products'>
          <ArrowLeft size={24} />
          <span>All Products</span>
        </Link>
      </div>

      <Form />

    </div>
  )
}

export default AddProduct

