import { Metadata } from 'next'
import React from 'react'
import styles from './products.module.css'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import fetchData from '@/lib/fetchData'
import { type Product } from '@/types/product'
import ProductsTable from '@/components/Products/ProductsTable'


export const metadata: Metadata = {
    title: "Products - PMonger",
    description: "View and manage your products"
}



const Products = async () => {
    let data
    try {
        const response = await fetchData<{ products: Product[] }>('get', `/products?page=1&limit=8`)
        data = response.data.data
    } catch (error) {
        return <div>ERROR</div>
    }


    const { products } = data



    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Products</h1>
                <Link href='../products/add-product'>
                    <Plus size={24} />
                    <span>Add Product</span>
                </Link>
            </div>

            <ProductsTable products={products} />


        </div>
    )
}

export default Products


