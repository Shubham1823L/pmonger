'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/app/(BaseLayout)/products/products.module.css'
import { Check, Ellipsis, Eye, ListFilter, Pencil, Search, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { type Product } from '@/types/product'
import apiClient from '@/lib/apiClient'
import { getImgURL } from '@/lib/cloudinary'
import clsx from 'clsx'

type ProductsTableProps = {
    products: Product[]
}

const handleDeleteSelected = async (ids: [string] | Set<string>) => {
    const productIds = Array.from(ids)

    let data
    try {
        const response = await apiClient<{ requested: number, deleted: number }>('delete', '/products', { productIds })
        data = response.data.data
        window.location.reload()

    } catch (error) {
        return console.error(error, "Something went wrong")
    }

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
                <button onClick={() => handleDeleteSelected(selectedIds)} role='button' className={styles.deleteSelected}>
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
    const [productAvatarURL, setProductAvatarURL] = useState<string>()
    // ###LATE LEARN WHY--> useMemo also wont help
    // const productAvatarURL = useMemo(() => getImgURL(avatarPublicId,200), [avatarPublicId])
    useEffect(() => {
        (async () => {
            setProductAvatarURL(() => getImgURL(avatarPublicId, 200))
        })()
    }, [avatarPublicId])

    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLButtonElement>(null)

    return (
        <div className={styles.tr}>
            <div className={styles.td}>
                <input checked={checked} value={id} onChange={onChange} type="checkbox" className={styles.checkbox} />
                <Check className={styles.checkmark} />
            </div>
            <Link href={`/products/${id}`} className={styles.td}>
                {/* placeholder for productImage can be an svg or some general professional image either stored locally or rendered via cloudinary */}
                <img className={styles.productImage} src={productAvatarURL} alt="product-image" />
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
                <span style={{ color: stock === 0 ? 'var(--clr-red-500)' : stock <= minimumStock ? 'var(--clr-yellow-500)' : '' }}>{stock === 0 ? "Out of Stock" : stock <= minimumStock ? `${stock} (Low)` : stock}</span>
            </div>
            <div className={styles.td}>
                <span>₹{price}</span>
            </div>
            <div className={styles.td}>
                <span style={{ color: status === "Published" ? 'var(--clr-green-500)' : 'var(--clr-yellow-500)' }}>{status}</span>
            </div>
            <div className={clsx(styles.td, styles.dropDownWrapper)}>
                <button ref={ref} onClick={() => {
                    setIsOpen(prev => !prev)
                }} className={clsx(styles.actionsBtn, 'dropDownOpener')}>
                    <Ellipsis />
                </button>
                {isOpen && <DropDownMenu parentRef={ref} setIsOpen={setIsOpen} id={id} />}
            </div>
        </div>
    )
}

type DropDownMenuProps = {
    id: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    parentRef: React.RefObject<HTMLButtonElement | null>
}

const DropDownMenu = ({ id, setIsOpen, parentRef }: DropDownMenuProps) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ref.current) ref.current.focus()
    }, [])

    return (
        <div ref={ref} tabIndex={0} onBlur={(e) => {
            if (e.currentTarget.contains(e.relatedTarget) || e.relatedTarget === parentRef.current) return
            console.log('onblur')
            setIsOpen(prev => !prev)
        }} className={styles.dropDownMenu}>
            <Link href={`/products/${id}`} className={styles.dropDownItem}>
                <Eye /> <span>View</span>
            </Link>
            <Link href={`/products/${id}/edit`} className={styles.dropDownItem}>
                <Pencil /> <span>Edit</span>
            </Link>
            <button onClick={() => {
                handleDeleteSelected([id])
            }} className={styles.dropDownItem}>
                <Trash2 /> <span>Delete immediately</span>
            </button>
        </div>
    )
}