'use client'
import apiClient from '@/lib/apiClient'
import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'
import { toast } from 'sonner'

const Logout = ({ children, className }: { children: ReactNode, className?: string }) => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            await apiClient('post', '/auth/logout')
            toast.success("Logged Out !", {
                description: 'Redirecting...',
                duration: 1000
            })
            router.replace('/login')

        } catch (error) {
            toast.error("Request Failed", {
                description: "Something went wrong !"
            })
        }
    }
    return (
        <button onClick={handleLogout} className={className}>
            {children}
        </button>
    )
}

export default Logout
