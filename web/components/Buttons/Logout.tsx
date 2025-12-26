'use client'
import React, { ReactNode } from 'react'

const Logout = ({ children, className }: { children: ReactNode, className?: string }) => {

    const handleLogout = () => {
        console.log("Logged Out!")
    }
    return (
        <button onClick={handleLogout} className={className}>
            {children}
        </button>
    )
}

export default Logout
