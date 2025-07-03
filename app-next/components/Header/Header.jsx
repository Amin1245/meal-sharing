import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      backgroundColor: '#f8f8f8', 
      padding: '1rem 2rem', 
      borderBottom: '1px solid #eee', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Meal Sharing App
      </Link>
      <nav>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '1rem' }}>
          <li><Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>Home</Link></li>
          <li><Link href="/meals" style={{ textDecoration: 'none', color: '#0070f3' }}>Meals</Link></li>
        </ul>
      </nav>
    </header>
  );
}

//test