import React from 'react';

function About() {
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 14,
        boxShadow: 'var(--color-shadow)',
        padding: '2.5rem 2rem',
        color: 'var(--color-primary)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '2.1rem', marginBottom: 16 }}>About J.I. Heating & Cooling</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: 18 }}>Family owned and operated since <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>2015</span>. We take pride in serving GTA condo owners with honest, reliable HVAC service.</p>
        <div style={{ background: 'rgba(25,118,210,0.08)', borderRadius: 8, padding: '1rem', marginBottom: 18, fontWeight: 600, color: 'var(--color-primary)' }}>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>Direct access to the owner, Sam.</span> No call centers, no runaround—just real help when you need it.
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>We also run a <span style={{ color: 'var(--color-emergency)', fontWeight: 600 }}>basketball program for youth</span> in our community, giving back to the next generation.</p>
        <div style={{ margin: '1.5rem 0', fontWeight: 600, color: 'var(--color-primary)' }}>Serving all of the <span style={{ color: 'var(--color-secondary)' }}>Greater Toronto Area (GTA)</span>.</div>
        <div style={{ marginTop: 24, color: '#b0b0b0', fontSize: '1rem' }}>Trusted by hundreds of GTA condo owners</div>
      </div>
    </div>
  );
}

export default About;
