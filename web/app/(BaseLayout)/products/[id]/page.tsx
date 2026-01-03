import React from 'react'
import styles from './product.module.css'
import productsStyles from '../products.module.css'
import { Metadata } from 'next'
import fetchData from '@/lib/fetchData'
import { type Product } from '@/types/product'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type ProductProps = {
    params: Promise<{ id: string }>,
}

type generateMetadataProps = Pick<ProductProps, "params">

export const generateMetadata = async ({ params }: generateMetadataProps): Promise<Metadata> => {
    const { id } = await params
    let data
    try {
        const repsonse = await fetchData<{ product: Product }>('get', `/products/${id}`)
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
        console.error('GG nigga!')
        return <div>GG NIGGA!</div>
    }

    const product = data.product

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
                    <img className={styles.productImage} src="https://res.cloudinary.com/dvln1dlk4/image/upload/w_auto/q_auto/f_auto/v1767196817/lushiroProject_uploads/1767196816477-900961976_oamtmt.jpg" alt="product-image" />
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
                        <p>Prodcut Description - Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, quos id dignissimos ex earum nihil pariatur harum, ab, iste aperiam temporibus perferendis sequi magni? Cumque repellat id fugit unde neque? Ullam harum placeat nulla ex. Doloremque voluptatem perferendis harum, quod sit reiciendis id architecto sequi, facere ullam, exercitationem quae impedit?</p>
                    </section>
                    <LineBreak />

                    <section>
                        <h3>Stock</h3>
                        <span style={{ color: product.stock === 0 ? 'red' : '' }}>{product.stock} {product.stock === 0 && "Out of Stock"}</span>
                    </section>
                    <LineBreak />
                    <section>
                        <h3>Status</h3>
                        <span style={{ color: product.status === "Published" ? 'green' : "yellow" }}>{product.status}</span>
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

