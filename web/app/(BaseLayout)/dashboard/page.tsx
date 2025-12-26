import React from 'react'
import styles from './dashboard.module.css'
import { Metadata } from 'next'
import TopCard from '@/components/Dashboard/TopCard'
import ProductsByDayChart from '@/components/Dashboard/charts/ProductsByDayChart'
import ProductsByCategoryChart from '@/components/Dashboard/charts/ProductsByCategoryChart'

export const metadata: Metadata = {
  title: "Dashboard"
}

const Dashboard = () => {
  const data1 = [
    { value: 0, date: "2025-12-3" },
    { value: 2, date: "2025-12-4" },
    { value: 5, date: "2025-12-5" },
    { value: 10, date: "2025-12-6" },
    { value: 0, date: "2025-12-7" },
    { value: 0, date: "2025-12-8" },
    { value: 5, date: "2025-12-9" },
    { value: 25, date: "2025-12-10" },
    { value: 52, date: "2025-12-11" },
    { value: 12, date: "2025-12-12" },
  ]

  const data2 = [
    { value: 12, category: "Appliances" },
    { value: 21, category: "Furniture" },
    { value: 5, category: "Utensils" },
    { value: 40, category: "Toys" },
    { value: 10, category: "Sports" },
    { value: 25, category: "Agronomy" }
  ]
  return (
    <div className={styles.wrapper}>

      <div className={styles.topCards}>

        <TopCard title='Total Products' metricCount={214} metricTrendingStat={-2.21} />
        <TopCard title='Drafted Products' metricCount={12} metricTrendingStat={0.01} />
        <TopCard title='Out of Stock' metricCount={5} metricTrendingStat={0.6} />
        <TopCard title='Categories' metricCount={20} metricTrendingStat={0.01} />

      </div>

      <div className={styles.charts}>
        <ProductsByDayChart data={data1} />
        <ProductsByCategoryChart data={data2} />
      </div>


    </div>
  )
}

export default Dashboard



