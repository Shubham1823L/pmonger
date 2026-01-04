import React from 'react'
import styles from './dashboard.module.css'
import { Metadata } from 'next'
import TopCard from '@/components/Dashboard/TopCard'
import ProductsByDayChart from '@/components/Dashboard/charts/ProductsByDayChart'
import ProductsByCategoryChart from '@/components/Dashboard/charts/ProductsByCategoryChart'
import Link from 'next/link'
import fetchData from '@/lib/fetchData'
import { type Product } from '@/types/product'

export const metadata: Metadata = {
  title: "Dashboard - PMonger"
}

const Dashboard = async () => {

  type DashboardApiResponse = {
    productsByCategory: {
      _count: {
        _all: number
      },
      category: string
    }[],
    productsByLatestUpdatedAt: Product[],
    productsByNewlyAdded: {
      date: string,
      count: number
    }[],
    productsMetrics: {
      total: number,
      outOfStock: number,
      draft: number,
      categories:number
    }
  }

  let data
  try {
    const response = await fetchData<DashboardApiResponse>('get', '/dashboard')
    data = response.data.data
  } catch (error) {
    return <div style={{
      height: '100vh',
      textAlign: 'center'

    }}>500 INTERNAL ERROR</div>
  }

  const latestProducts = data.productsByLatestUpdatedAt
  const data2 = data.productsByCategory.map(p => ({ value: p._count._all, category: p.category }))
  const { productsByNewlyAdded, productsMetrics } = data

  return (
    <div className={styles.wrapper}>

      <div className={styles.topCards}>

        <TopCard title='Total Products' metricCount={productsMetrics.total} metricTrendingStat={-2.21} />
        <TopCard title='Drafted Products' metricCount={productsMetrics.draft} metricTrendingStat={0.01} />
        <TopCard title='Out of Stock' metricCount={productsMetrics.outOfStock} metricTrendingStat={0.6} />
        <TopCard title='Categories' metricCount={productsMetrics.categories} metricTrendingStat={0.01} />

      </div>

      <div className={styles.charts}>
        <ProductsByDayChart data={productsByNewlyAdded} />
        <ProductsByCategoryChart data={data2} />
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <span>Recently Updated</span>
          <Link href={'/products'}>View all products</Link>
        </div>
        <div className={styles.table}>
          <div className={styles.thead}>
            <div>Product</div>
            <div>Status</div>
            <div>Updated</div>
          </div>
          <div className={styles.tbody}>
            {
              latestProducts.map(product => {
                const updatedDate = new Date(product.updatedAt).toLocaleDateString()
                const updateTime = new Date(product.updatedAt).toLocaleTimeString()
                return (
                  <div className={styles.latestProductRow} key={product.id}>
                    <div><Link href={`/products/${product.id}`}>{product.name}</Link></div>
                    <div>{product.status}</div>
                    <div>{updatedDate} {updateTime}</div>
                  </div>
                )
              })
            }


          </div>
        </div>
      </div>


    </div>
  )
}

export default Dashboard



