import styles from './baseLayout.module.css'
import { BarChart3, Cog, Layers, LayoutDashboard, LogOut, Package, User } from 'lucide-react'
import ActiveLink from './ActiveLink'
import Logout from '../Buttons/Logout'
import Link from 'next/link'
const Navbar = () => {
    return (
        <header className={styles.navbarWrapper}>
            <nav className={styles.navbar}>

                <Link href={'/dashboard'} className={styles.navLogoWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={'/logo-dark.svg'} alt='pmonger-logo' />
                </Link>

                <div className={styles.navbarUpperList}>
                    <ActiveLink href={'/dashboard'} className={styles.navItem}>
                        <LayoutDashboard />
                        <p>Dashboard</p>
                    </ActiveLink>

                    <ActiveLink href={'/products'} className={styles.navItem}>
                        <Package />
                        <p>Products</p>
                    </ActiveLink>

                    <ActiveLink href={'/categories'} className={styles.navItem}>
                        <Layers />
                        <p>Categories</p>
                    </ActiveLink>

                    <ActiveLink href={'/analytics'} className={styles.navItem}>
                        <BarChart3 />
                        <p>Analytics</p>
                    </ActiveLink>
                </div>


                <div className={styles.navbarLowerList}>
                    <ActiveLink href={'/profile'} className={styles.navItem}>
                        <User />
                        <p>Profile</p>
                    </ActiveLink>
                    <ActiveLink href={'/settings'} className={styles.navItem}>
                        <Cog />
                        <p>Settings</p>
                    </ActiveLink>

                    <Logout className={styles.navItem} >
                        <LogOut />
                        <p>Logout</p>
                    </Logout>

                </div>



            </nav>
        </header >
    )
}

export default Navbar
