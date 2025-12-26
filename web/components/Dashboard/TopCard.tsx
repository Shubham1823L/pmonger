import styles from '@/app/(BaseLayout)/dashboard/dashboard.module.css'
import { TrendingDown, TrendingUp } from 'lucide-react'

type TopCard = {
    title: string,
    metricCount: number,
    metricTrendingStat: number
}

const TopCard = ({ title, metricCount, metricTrendingStat }: TopCard) => {

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

export default TopCard