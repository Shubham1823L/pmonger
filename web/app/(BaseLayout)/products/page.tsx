import { Metadata } from 'next'
import React from 'react'
import styles from './products.module.css'
import Link from 'next/link'
import { Check, Ellipsis, ListFilter, Plus, Search } from 'lucide-react'
import fetchData from '@/lib/fetchData'
import { type Product } from '@/types/product'
import { redirect } from 'next/navigation'


export const metadata: Metadata = {
    title: "Products - PMonger",
    description: "View and manage your products"
}



const Products = async () => {
    let data
    try {
        const response = await fetchData<{ products: Product[] }>('get', '/products')
        data = response.data.data
    } catch (error) {
        redirect('/login')
    }

    const { products } = data



    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Products</h1>
                <Link href='../products/addProduct'>
                    <Plus size={24} />
                    <span>Add Product</span>
                </Link>
            </div>

            <div className={styles.tableWrapper}>
                <div className={styles.searchAndFiltersWrapper}>
                    <div className={styles.searchWrapper}>
                        <input placeholder='Search' className={styles.search} type="text" />
                        <Search />
                        {/* <XCircle strokeWidth={1.4} size={24}/> */}
                    </div>
                    {/* 
                    <div className={styles.calendar}></div>
                    <div className={styles.status}></div>
                    <div className={styles.category}></div> */}
                    <div role='button' className={styles.filter}>
                        <ListFilter /> Filter
                    </div>

                </div>
                <div className={styles.table}>
                    <div className={styles.thead}>
                        <div className={styles.tr}>
                            <div className={styles.td}>
                                <input type="checkbox" className={styles.checkbox} />
                                <Check className={styles.checkmark} />
                            </div>
                            <div className={styles.td}>
                                Product Name
                            </div>
                            <div className={styles.td}>
                                Category
                            </div>
                            <div className={styles.td}>
                                Stock
                            </div>
                            <div className={styles.td}>
                                Price
                            </div>
                            <div className={styles.td}>
                                Status
                            </div>
                            <div className={styles.td}>
                                Action
                            </div>
                        </div>
                    </div>
                    <div className={styles.tbody}>
                        {products.map(product => {
                            return (
                                <TableRow key={product.id} name={product.name} avatarPublicId={product.avatarPublicId} price={product.price} stock={product.stock} status={product.status} />
                            )
                        })}
                    </div>
                </div>

                <div className={styles.pageSelectorWrapper}></div>
            </div>

        </div>
    )
}

export default Products

type TableRowProps = Omit<Product, "id" | "createdAt" | "updatedAt" | "ownerId">

export const TableRow = ({ name, avatarPublicId, price, status, stock }: TableRowProps) => {
    return (
        <div className={styles.tr}>
            <div className={styles.td}>
                <input type="checkbox" className={styles.checkbox} />
                <Check className={styles.checkmark} />
            </div>
            <div className={styles.td}>
                {/* placeholder for productImage can be an svg or some general professional image either stored locally or rendered via cloudinary */}
                <img className={styles.productImage} src="https://res.cloudinary.com/dvln1dlk4/image/upload/w_50/q_auto/f_auto/v1767196817/lushiroProject_uploads/1767196816477-900961976_oamtmt.jpg" alt="product-image" />
                <span>
                    {name}
                </span>

            </div>
            <div className={styles.td}>
                <span>
                    Home Appliance, Electronics, goga singh pogga is here btw
                </span>
            </div>
            <div className={styles.td}>
                <span style={{ color: stock === 0 ? 'red' : '' }}>{stock > 0 ? stock : "Out of Stock"}</span>
            </div>
            <div className={styles.td}>
                <span>₹{price}</span>
            </div>
            <div className={styles.td}>
                <span style={{ color: status === "Published" ? 'green' : 'yellow' }}>{status}</span>
            </div>
            <div className={styles.td}>
                <button className={styles.actionsBtn}>
                    <Ellipsis />
                </button>
            </div>
        </div>
    )
}