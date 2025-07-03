import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#f8f8f8', 
      padding: '1rem 2rem', 
      borderTop: '1px solid #eee', 
      textAlign: 'center', 
      marginTop: '2rem' 
    }}>
      <p>&copy; {new Date().getFullYear()} Amin Babapour. All rights reserved.</p>
    </footer>
  );
}

//test
