'use client'
import React from 'react'
import styles from '@/app/(BaseLayout)/dashboard/dashboard.module.css'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ProductsByCategoryChartProps = {
    data: Array<{ value: number, category: string }>
}


const ProductsByCategoryChart = ({ data }: ProductsByCategoryChartProps) => {
    return (
        <div className={styles.chartWrapper}>
            <div className={styles.chartHeader}>
                <p className={styles.charTitle}>Products By Category</p>
            </div>

            <ResponsiveContainer width={'100%'} minHeight={300} >
                <BarChart data={data} >
                    <XAxis dataKey={'category'} stroke='var(--font-neutral)' fontSize={14} />
                    <YAxis dataKey={'value'} stroke='var(--font-neutral)' fontSize={14} />
                    <Tooltip cursor={{ fill: 'var(--neutral-hover)' }} />
                    <Bar fill='var(--primary-300)' dataKey='value' type={'monotone'} name='Products Added' stroke='var(--primary-300)' />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ProductsByCategoryChart
