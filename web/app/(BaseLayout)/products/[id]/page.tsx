import React from 'react'
import styles from './product.module.css'
import productsStyles from '../products.module.css'
import { Metadata } from 'next'
import fetchData from '@/lib/fetchData'
import { type Product } from '@/types/product'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getImgURL } from '@/lib/cloudinary'
import { ApiError } from '@/types/api'
import { redirect } from 'next/navigation'

type ProductProps = {
    params: Promise<{ id: string }>,
}

type generateMetadataProps = Pick<ProductProps, "params">

export const generateMetadata = async ({ params }: generateMetadataProps): Promise<Metadata> => {
    const { id } = await params
    let data
    try {
        const repsonse = await fetchData<{ product: Product }>('get', `/products/${id}?page=1&limit=10`)
        data = repsonse.data.data
    } catch (error) {
        console.log("Could not fetch product data for page metadata")
    }
    const product = data?.product

    return {
        title: `${product?.name ?? "Product Page"} - P Monger`,
        description: `This the product page for ${product?.name ?? "a product"}`
    }
}


const Product = async ({ params }: ProductProps) => {
    const { id } = await params

    let data
    try {
        const response = await fetchData<{ product: Product }>('get', `/products/${id}`)
        data = response.data.data
    } catch (error) {
        redirect('/dashboard')
    }

    const product = data.product

    const productAvatarURL = getImgURL(product.avatarPublicId, 400)

    return (
        <div className={productsStyles.wrapper}>
            <div className={productsStyles.header}>
                <h1>Product Overview</h1>
                <Link href='/products'>
                    <ArrowLeft size={24} />
                    <span>All Products</span>
                </Link>
            </div>
            <div className={styles.main}>
                <div className={styles.imageWrapper}>
                    <img className={styles.productImage} src={productAvatarURL} alt="product-image" />
                </div>
                <article className={styles.details}>
                    <header>
                        <h2>{product.name}</h2>
                    </header>
                    <LineBreak />

                    <section>
                        <h3>Pricing</h3>
                        <span className={styles.price}>
                            <span>₹</span>
                            <span>{product.price}</span>
                        </span>
                    </section>
                    <LineBreak />

                    <section>
                        <h3>About this item</h3>
                        <p>{product.description}</p>
                    </section>
                    <LineBreak />

                    <section>
                        <h3>Stock</h3>
                        <span style={{ color: product.stock === 0 ? 'red' : '' }}>{product.stock} {product.stock === 0 && "Out of Stock"}</span>
                    </section>
                    <LineBreak />
                    <section>
                        <h3>Status</h3>
                        <span style={{ color: product.status === "Published" ? 'var(--clr-green-500)' : "var(--clr-yellow-500)" }}>{product.status}</span>
                    </section>
                    <LineBreak />
                    <section>
                        <h3>Created at</h3>
                        <span>{new Date(product.createdAt).toLocaleString()}</span>
                    </section>
                    <LineBreak />
                    <section>
                        <h3>Last updated at</h3>
                        <span>{new Date(product.updatedAt).toLocaleString()}</span>
                    </section>
                    <LineBreak />






                </article>

            </div>
        </div>
    )
}

export default Product

const LineBreak = () => <div className={styles.lineBreak}></div>

