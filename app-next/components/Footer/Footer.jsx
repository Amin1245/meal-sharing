import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>&copy; {new Date().getFullYear()} Meal Sharing App. All rights reserved by Amin Babapour.</p>
    </footer>
  );
}
