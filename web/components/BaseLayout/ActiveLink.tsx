'use client'
import clsx from 'clsx'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import styles from './baseLayout.module.css'
import { usePathname } from 'next/navigation'

const ActiveLink = ({ href, children, className }: { href: string, children: ReactNode, className?: string }) => {

    const pathname = usePathname()

    return (
        <Link href={href} className={clsx(className, pathname.startsWith(href) && styles.activeLink)}>
            {children}
        </Link>
    )
}

export default ActiveLink
