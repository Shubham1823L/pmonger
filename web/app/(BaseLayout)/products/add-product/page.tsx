import { Metadata } from 'next'
import React from 'react'
import prodcutsStyles from '../products.module.css'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Form from '@/components/Products/add-product/Form'

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
          <span>All Products</span>
        </Link>
      </div>

      <Form />

    </div>
  )
}

export default AddProduct

