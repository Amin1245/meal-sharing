import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Meal Sharing App
      </Link>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li><Link href="/" className={styles.navLink}>Home</Link></li>
          <li><Link href="/meals" className={styles.navLink}>Meals</Link></li>
        </ul>
      </nav>
    </header>
  );
}
