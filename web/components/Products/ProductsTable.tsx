'use client'
import React, { useMemo, useRef, useState } from 'react'
import styles from '@/app/(BaseLayout)/products/products.module.css'
import { Check, Ellipsis, ListFilter, Search, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { type Product } from '@/types/product'
import apiClient from '@/lib/apiClient'

type ProductsTableProps = {
    products: Product[]
}

const ProductsTable = ({ products }: ProductsTableProps) => {

    const tbodyRef = useRef<HTMLDivElement>(null)
    const [isChecked, setIsChecked] = useState(false)
    const [selectedIds, setSelectedIds] = useState(new Set<string>())
    const allIds = useMemo(() => new Set(products.map(p => p.id)), [products])

    const handleMasterCheckboxChange = () => {
        setIsChecked(prev => !prev)
        setSelectedIds(() => isChecked ? new Set<string>() : allIds)
    }

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.value
        const isChecked = e.target.checked
        setSelectedIds(prev => {
            const set = new Set(prev)
            if (isChecked) set.add(id)
            else set.delete(id)
            if (set.size == allIds.size) setIsChecked(true)
            else setIsChecked(false)
            return set
        })
    }

    const handleUnselectAll = () => {
        setSelectedIds(new Set<string>())
        setIsChecked(false)
    }
    const handleDeleteSelected = async () => {
        const productIds = Array.from(selectedIds)

        let data
        try {
            const response = await apiClient<{ requested: number, deleted: number }>('delete', '/products', { productIds })
            data = response.data.data
            window.location.reload()

        } catch (error) {
            return console.error(error, "Something went wrong")
        }

    }



    return (
        <div className={styles.tableWrapper}>
            <div className={styles.searchAndFiltersWrapper}>
                <div className={styles.searchWrapper}>
                    <input placeholder='Search' className={styles.search} type="text" />
                    <Search />
                </div>
                <button onClick={handleUnselectAll} role='button' className={styles.unselectAll}>
                    <X />
                </button>
                <button onClick={handleDeleteSelected} role='button' className={styles.deleteSelected}>
                    <Trash2 />
                </button>
                <div role='button' className={styles.filter}>
                    <ListFilter /> Filter
                </div>

            </div>
            <div className={styles.table}>
                <div className={styles.thead}>
                    <div className={styles.tr}>
                        <div className={styles.td}>
                            <input checked={isChecked} onChange={handleMasterCheckboxChange} type="checkbox" className={styles.checkbox} />
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
                <div ref={tbodyRef} className={styles.tbody}>
                    {products.map(product => {
                        return (
                            <TableRow checked={selectedIds.has(product.id)} onChange={handleCheckbox} minimumStock={product.minimumStock} category={product.category} id={product.id} key={product.id} name={product.name} avatarPublicId={product.avatarPublicId} price={product.price} stock={product.stock} status={product.status} />
                        )
                    })}
                </div>
            </div>

            <div className={styles.pageSelectorWrapper}></div>
        </div>
    )
}

export default ProductsTable


type TableRowProps = Omit<Product, "createdAt" | "updatedAt" | "ownerId" | "description"> & {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    checked: boolean
}

const TableRow = ({ name, avatarPublicId, price, status, stock, id, minimumStock, category, onChange, checked }: TableRowProps) => {
    return (
        <div className={styles.tr}>
            <div className={styles.td}>
                <input checked={checked} value={id} onChange={onChange} type="checkbox" className={styles.checkbox} />
                <Check className={styles.checkmark} />
            </div>
            <Link href={`/products/${id}`} className={styles.td}>
                {/* placeholder for productImage can be an svg or some general professional image either stored locally or rendered via cloudinary */}
                <img className={styles.productImage} src="https://res.cloudinary.com/dvln1dlk4/image/upload/w_50/q_auto/f_auto/v1767196817/lushiroProject_uploads/1767196816477-900961976_oamtmt.jpg" alt="product-image" />
                <span>
                    {name}
                </span>

            </Link>
            <div className={styles.td}>
                <span>
                    {category}
                </span>
            </div>
            <div className={styles.td}>
                <span style={{ color: stock === 0 ? 'red' : stock <= minimumStock ? 'yellow' : '' }}>{stock === 0 ? "Out of Stock" : stock <= minimumStock ? `${stock} (Low)` : stock}</span>
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
