import { Metadata } from 'next'
import productsStyles from '@/app/(BaseLayout)/products/products.module.css'
import styles from './edit.module.css'
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Form from '@/components/Products/add-product/Form'

export const metadata: Metadata = {
    title: 'Edit Product - P Monger',
    description: "Edit and update your product easily"
}

const Edit = () => {
    return (
        <div>
            <div className={productsStyles.wrapper}>
                <div className={productsStyles.header}>
                    <h1>Edit Product</h1>
                    <Link href='/products'>
                        <ArrowLeft size={24} />
                        <span>All Products</span>
                    </Link>
                </div>

                <Form />

            </div>
        </div>
    )
}

export default Edit
