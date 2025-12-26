import React from 'react'
import styles from './dashboard.module.css'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'

export const metadata:Metadata={
  title:"Dashboard"
}

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>

      <div className={styles.topCards}>

        <TopCard title='Total Products' metricCount={214} metricTrendingStat={-2.21} />
        <TopCard title='Drafted Products' metricCount={12} metricTrendingStat={0.01} />
        <TopCard title='Out of Stock' metricCount={5} metricTrendingStat={0.6} />
        <TopCard title='Categories' metricCount={20} metricTrendingStat={0.01} />

      </div>

    </div>
  )
}

export default Dashboard



type TopCard = {
  title: string,
  metricCount: number,
  metricTrendingStat: number
}

export const TopCard = ({ title, metricCount, metricTrendingStat }: TopCard) => {

  const isIncreasing = metricTrendingStat > 0

  return (
    <div className={styles.topCard}>

      <span>{title}</span>

      <div className={styles.topCardMetrics}>
        <span>{metricCount}</span>
        <span style={{
          color: isIncreasing ? "hsl(120, 100%, 28%)" : "red"
        }} className={styles.topCardTrending}>
          {isIncreasing ? <TrendingUp style={{
            backgroundColor: "hsl(120, 100%, 80%)"
          }} /> : <TrendingDown style={{
            backgroundColor: "hsl(0, 100%, 80%)"
          }} />}
          {isIncreasing && '+'}{metricTrendingStat}%
        </span>
      </div>

    </div>
  )

}