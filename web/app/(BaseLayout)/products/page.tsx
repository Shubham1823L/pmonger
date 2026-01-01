import { Metadata } from 'next'
import React from 'react'
import styles from './products.module.css'
import Link from 'next/link'
import { Check, Ellipsis, ListFilter, Plus, Search, X, XCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: "Products - PMonger",
    description: "View and manage your products"
}

const Products = () => {
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
                        <TableRow />
                        <TableRow />
                        <TableRow />
                        <TableRow />
                        <TableRow />
                    </div>
                </div>

                <div className={styles.pageSelectorWrapper}></div>
            </div>

        </div>
    )
}

export default Products


export const TableRow = () => {
    return (
        <div className={styles.tr}>
            <div className={styles.td}>
                <input type="checkbox" className={styles.checkbox} />
                <Check className={styles.checkmark} />
            </div>
            <div className={styles.td}>
                <span>
                    RGX pro 112 suprabase limited
                </span>

            </div>
            <div className={styles.td}>
                <span>
                    Home Appliance, Electronics, goga singh pogga is here btw
                </span>
            </div>
            <div className={styles.td}>
                <span>Out of Stock</span>
            </div>
            <div className={styles.td}>
                <span>$49.99</span>
            </div>
            <div className={styles.td}>
                <span>Published</span>
            </div>
            <div className={styles.td}>
                <button className={styles.actionsBtn}>
                    <Ellipsis />
                </button>
            </div>
        </div>
    )
}