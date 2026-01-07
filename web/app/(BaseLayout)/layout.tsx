import Navbar from "@/components/BaseLayout/Navbar";
import type { Metadata } from "next";
import styles from './layout.module.css'


export const metadata: Metadata = {
    title: "P Monger",
    description: "Your Product Manager",
};

export default function BaseLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                {children}
            </main>
        </>
    );
}
