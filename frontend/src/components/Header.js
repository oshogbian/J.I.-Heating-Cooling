import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header style={{
      width: '100%',
      background: 'linear-gradient(90deg, var(--color-primary) 60%, var(--color-secondary) 100%)',
      color: '#fff',
      padding: '0.75rem 2.5vw',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(24,49,83,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      minHeight: 68,
      gap: 0,
    }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 14 }}>
          <img src="/logo.png" alt="J.I. Heating and Cooling Logo" style={{ height: 50, width: 'auto', display: 'block', background: 'none', borderRadius: 0, boxShadow: 'none', padding: 0, margin: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '1.45rem', letterSpacing: '0.04em', color: '#fff', fontFamily: 'Inter, Roboto, Arial, sans-serif', whiteSpace: 'nowrap', textShadow: '0 1px 4px rgba(24,49,83,0.10)', lineHeight: 1.1, marginTop: 2 }}>J.I. <span style={{ color: '#ff9800', fontWeight: 800 }}>Heating & Cooling</span></span>
        </Link>
      </div>
      <button onClick={() => setNavOpen(!navOpen)} style={{
        display: 'none',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: 32,
        cursor: 'pointer',
        marginLeft: 20,
        marginRight: 0,
        padding: 6,
      }} className="nav-toggle" aria-label="Toggle navigation">
        &#9776;
      </button>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        transition: 'all 0.3s',
        ...(navOpen ? {
          position: 'absolute',
          top: 68,
          right: 18,
          background: '#fff',
          color: 'var(--color-primary)',
          flexDirection: 'column',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(24,49,83,0.16)',
          zIndex: 2000,
          padding: '1.5rem 2.5rem',
          gap: 20,
        } : {}),
      }} className={navOpen ? 'nav-open' : ''}>
        <Link to="/" style={{ color: navOpen ? 'var(--color-primary)' : '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1.13rem', margin: navOpen ? '1rem 0' : 0, padding: '0.25rem 0.5rem' }} onClick={() => setNavOpen(false)}>Home</Link>
        <Link to="/services" style={{ color: navOpen ? 'var(--color-primary)' : '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1.13rem', margin: navOpen ? '1rem 0' : 0, padding: '0.25rem 0.5rem' }} onClick={() => setNavOpen(false)}>Services</Link>
        <Link to="/about" style={{ color: navOpen ? 'var(--color-primary)' : '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1.13rem', margin: navOpen ? '1rem 0' : 0, padding: '0.25rem 0.5rem' }} onClick={() => setNavOpen(false)}>About</Link>
        <Link to="/contact" style={{ color: navOpen ? 'var(--color-primary)' : '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1.13rem', margin: navOpen ? '1rem 0' : 0, padding: '0.25rem 0.5rem' }} onClick={() => setNavOpen(false)}>Contact</Link>
        <Link to="/emergency" style={{ color: navOpen ? 'var(--color-emergency)' : 'var(--color-emergency)', background: navOpen ? 'var(--color-neutral-card)' : '#fff', borderRadius: 8, padding: '0.5rem 1.5rem', fontWeight: 700, fontSize: '1.13rem', textDecoration: 'none', boxShadow: '0 1px 4px rgba(220,53,69,0.10)', margin: navOpen ? '1rem 0' : 0, border: 'none' }} onClick={() => setNavOpen(false)}>Emergency</Link>
      </nav>
      <style>{`
        @media (max-width: 900px) {
          .nav-toggle { display: block !important; }
          nav:not(.nav-open) { display: none !important; }
        }
        @media (max-width: 600px) {
          header { padding: 0.5rem 2vw !important; }
          img { height: 34px !important; }
          .header-left span { font-size: 0.98rem !important; }
          nav.nav-open { padding: 1.2rem 1.2rem !important; gap: 14px !important; }
        }
      `}</style>
    </header>
  );
}

export default Header;
