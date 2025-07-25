import React from 'react';

function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: 'rgba(24,49,83,0.92)',
      color: '#fff',
      padding: '2rem 1rem 1rem 1rem',
      textAlign: 'center',
      position: 'relative',
      boxShadow: '0 -2px 8px rgba(24,49,83,0.08)',
      backdropFilter: 'blur(6px)',
      fontSize: '1.1rem',
      marginTop: '3rem',
    }}>
      <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: 8 }}>Contact: <a href="tel:+14169979123" style={{ color: '#ff9800', textDecoration: 'none', fontWeight: 700 }}>+1 416 997 9123</a> | <a href="mailto:SAM@jiheatingandcooling.com" style={{ color: '#ff9800', textDecoration: 'none', fontWeight: 700 }}>SAM@jiheatingandcooling.com</a></div>
      <div style={{ marginBottom: 8 }}>Serving the GTA | Family Owned Since 2015</div>
      <div style={{ fontSize: '0.95rem', color: '#b0b0b0' }}>&copy; {new Date().getFullYear()} J.I. Heating & Cooling</div>
    </footer>
  );
}

export default Footer;
