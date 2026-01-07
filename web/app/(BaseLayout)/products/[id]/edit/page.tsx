import { Metadata } from 'next'
import productsStyles from '@/app/(BaseLayout)/products/products.module.css'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import fetchData from '@/lib/fetchData'
import { type Product } from '@/types/product'
import EditProductForm from '@/components/Products/EditProductForm'
import { ApiError } from '@/types/api'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Edit Product - P Monger',
    description: "Edit and update your product easily"
}

type EditProps = {
    params: Promise<{ id: string }>
}

const Edit = async ({ params }: EditProps) => {
    const { id } = await params

    let data
    try {
        const response = await fetchData<{ product: Product }>('get', `/products/${id}`)
        data = response.data.data
    } catch (error) {
        return redirect('/dashboard')
    }

    const { product } = data

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

                <EditProductForm product={product} />
            </div>
        </div>
    )
}

export default Edit
