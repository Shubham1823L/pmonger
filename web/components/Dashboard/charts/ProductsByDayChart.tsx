'use client'
import React from 'react'
import styles from '@/app/(BaseLayout)/dashboard/dashboard.module.css'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ProductsByDayChartProps = {
    data: Array<{ value: number, date: string }>
}


const ProductsByDayChart = ({ data }: ProductsByDayChartProps) => {
    return (
        <div className={styles.chartWrapper}>
            <div className={styles.chartHeader}>
                <p className={styles.charTitle}>Products Added</p>
            </div>

            <ResponsiveContainer width={'100%'} minHeight={300} >
                <LineChart data={data} >
                    <CartesianGrid stroke='var(--neutral-500)' />
                    <XAxis dataKey={'date'} tickFormatter={tick => tick.split('-')[2]} stroke='var(--font-neutral)' fontSize={14} />
                    <YAxis dataKey={'value'} stroke='var(--font-neutral)' fontSize={14} />
                    <Tooltip />
                    <Line dot={false} dataKey='value' type={'monotone'} name='Products Added' stroke='var(--primary-400)' />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ProductsByDayChart
