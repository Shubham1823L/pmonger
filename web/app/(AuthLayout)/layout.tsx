import styles from './layout.module.css'



export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.main}>
            <div className={styles.formWrapper}>
                {children}
            </div>
        </div>
    );
}