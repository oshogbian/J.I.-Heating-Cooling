import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFan, FaSnowflake, FaWind, FaPhoneAlt, FaExclamationTriangle, FaCalendarCheck } from 'react-icons/fa';

const cardData = [
  {
    key: 'fan',
    icon: <FaFan size={48} color="var(--color-primary)" style={{ marginBottom: 14 }} />,
    title: 'Fan Coil',
    color: 'var(--color-primary)',
    summary: [
      'Install, repair & maintain condo fan coil units',
      'Optimal comfort & air quality',
      'Fast, clean, reliable',
    ],
    why: (
      <ul style={{ padding: 0, margin: 0, listStyle: 'none', textAlign: 'left', fontSize: '0.98rem', lineHeight: 1.5 }}>
        <li>• Buildup reduces air quality and efficiency.</li>
        <li>• Risk of leaks and costly breakdowns.</li>
        <li>• Regular service keeps your home healthy.</li>
      </ul>
    ),
    timeframe: 'Recommended: Service twice a year',
  },
  {
    key: 'heat',
    icon: <FaSnowflake size={48} color="#1976d2" style={{ marginBottom: 14 }} />,
    title: 'Heat Pump',
    color: '#1976d2',
    summary: [
      'High-efficiency installation & maintenance',
      'Year-round savings & comfort',
      'Energy-saving solutions',
    ],
    why: 'Heat pumps need regular maintenance to ensure efficiency, prevent costly repairs, and extend lifespan. Clean filters and coils save energy.',
    timeframe: 'Recommended: Maintenance once a year',
  },
  {
    key: 'vent',
    icon: <FaWind size={48} color="#00bcd4" style={{ marginBottom: 14 }} />,
    title: 'Vent Cleaning',
    color: '#00bcd4',
    summary: [
      'Professional vent & dryer vent cleaning prevents fire hazards',
      'Breathe easier, live better',
      'Healthier home, cleaner air',
    ],
    why: (
      <ul style={{ padding: 0, margin: 0, listStyle: 'none', textAlign: 'left', fontSize: '0.98rem', lineHeight: 1.5 }}>
        <li>• Improves air quality and health.</li>
        <li>• Reduces fire risk and prevents blockages.</li>
      </ul>
    ),
    timeframe: 'Recommended: Clean once ayear',
  },
];

function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function Home() {
  const [flipped, setFlipped] = useState({});
  const [touched, setTouched] = useState(false);
  const touch = isTouchDevice();

  const handleFlip = key => setFlipped(f => ({ ...f, [key]: true }));
  const handleUnflip = key => setFlipped(f => ({ ...f, [key]: false }));
  const handleToggle = key => setFlipped(f => ({ ...f, [key]: !f[key] }));

  return (
    <div>
      <section style={{
        position: 'relative',
        minHeight: '420px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary-gradient)',
        padding: 0,
        overflow: 'hidden',
      }}>
        {/* Video background */}
        <video
          src="/vid.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            minHeight: '420px',
          }}
          poster="/logo.png"
        />
        {/* Gradient overlay for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(24,49,83,0.55) 0%, rgba(24,49,83,0.25) 60%, rgba(24,49,83,0.65) 100%)',
          zIndex: 2,
        }} />
        {/* Hero content overlay */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4.5rem 1rem 2.5rem 1rem',
        }}>
          
          <h1 style={{ fontSize: '2.8rem', color: 'var(--color-text-light)', margin: 0, letterSpacing: '2px', fontWeight: 800, textShadow: '0 2px 8px rgba(24,49,83,0.10)', textAlign: 'center' }}>J.I. Heating & Cooling</h1>
          <div style={{ width: 60, height: 3, background: 'var(--color-secondary)', borderRadius: 2, margin: '18px auto 14px auto', opacity: 0.85 }} />
          <p style={{ fontSize: '1.13rem', color: '#e0e0e0', marginBottom: 32, fontWeight: 500, fontStyle: 'italic', letterSpacing: '0.04em', textShadow: '0 1px 4px rgba(24,49,83,0.10)', textAlign: 'center', maxWidth: 600, lineHeight: 1.6 }}>Direct access to the owner, Sam. No call centers, no runaround—just real help when you need it.</p>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:+14169979123" style={{ display: 'flex', alignItems: 'center', background: 'var(--color-secondary)', color: '#fff', padding: '1rem 2.5rem', borderRadius: 10, fontSize: '1.22rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 8px rgba(255,111,0,0.10)', transition: 'background 0.2s', gap: 12, letterSpacing: '0.02em' }}>
              <FaPhoneAlt style={{ marginRight: 6, fontSize: 20 }} /> Call Sam Now
            </a>
            <Link to="/services" style={{ display: 'flex', alignItems: 'center', background: 'var(--color-primary)', color: '#fff', border: '2px solid var(--color-primary)', borderRadius: 10, padding: '1rem 2.5rem', fontWeight: 700, fontSize: '1.18rem', textDecoration: 'none', boxShadow: '0 1px 4px rgba(24,49,83,0.10)', gap: 10, transition: 'background 0.2s, color 0.2s', letterSpacing: '0.02em' }}>
              <FaCalendarCheck style={{ marginRight: 6, fontSize: 20 }} /> Book Service
            </Link>
            <Link to="/emergency" style={{ display: 'flex', alignItems: 'center', background: '#fff', color: 'var(--color-emergency)', border: '2px solid var(--color-emergency)', borderRadius: 10, padding: '1rem 2.5rem', fontWeight: 700, fontSize: '1.18rem', textDecoration: 'none', boxShadow: '0 1px 4px rgba(220,53,69,0.10)', gap: 10, transition: 'background 0.2s, color 0.2s', letterSpacing: '0.02em' }}>
              <FaExclamationTriangle style={{ marginRight: 6, fontSize: 20 }} /> Emergency
            </Link>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: '2rem auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {cardData.map(card => (
          <div
            key={card.key}
            style={{
              perspective: 1200,
              flex: '1 1 300px',
              minWidth: 280,
              maxWidth: 340,
              height: 270,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(.4,2,.3,1)',
                transform: flipped[card.key] ? 'rotateY(180deg)' : 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={!touch ? () => handleFlip(card.key) : undefined}
              onMouseLeave={!touch ? () => handleUnflip(card.key) : undefined}
              tabIndex={0}
              onFocus={!touch ? () => handleFlip(card.key) : undefined}
              onBlur={!touch ? () => handleUnflip(card.key) : undefined}
              onClick={touch ? () => { setTouched(true); handleToggle(card.key); } : undefined}
            >
              {/* Front */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 16,
                  boxShadow: '0 4px 16px rgba(24,49,83,0.10)',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {card.icon}
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: card.color }}>{card.title}</h3>
                {card.summary.map((line, i) => (
                  <div key={i} style={{ color: i === 0 ? 'var(--color-text)' : (i === 1 ? card.color : '#b0b0b0'), fontSize: i === 0 ? '1.08rem' : '0.99rem', fontWeight: 600, marginBottom: i === 2 ? 0 : 2, letterSpacing: '0.01em', marginTop: i === 0 ? 0 : 2 }}>{line}</div>
                ))}
                {touch && !flipped[card.key] && (
                  <div style={{ marginTop: 16, color: '#b0b0b0', fontSize: '0.97rem', fontWeight: 500, fontStyle: 'italic' }}>Tap to flip</div>
                )}
              </div>
              {/* Back */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'rgba(255,255,255,0.97)',
                  borderRadius: 16,
                  boxShadow: '0 4px 16px rgba(24,49,83,0.13)',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(180deg)',
                  zIndex: 3,
                }}
              >
                <h4 style={{ color: card.color, fontWeight: 700, fontSize: '1.13rem', marginBottom: 10 }}>Why do this service?</h4>
                <div style={{ color: 'var(--color-text)', fontSize: '1.01rem', marginBottom: 14, textAlign: 'center', fontWeight: 500, lineHeight: 1.5 }}>{card.why}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.98rem', fontWeight: 600, marginTop: 8 }}>{card.timeframe}</div>
                {touch && (
                  <div style={{ marginTop: 16, color: '#b0b0b0', fontSize: '0.97rem', fontWeight: 500, fontStyle: 'italic' }}>Tap to flip back</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="card" style={{ maxWidth: 900, margin: '2rem auto', background: '#fff3e0', color: 'var(--color-emergency)', textAlign: 'center', fontWeight: 600, fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(255,111,0,0.07)' }}>
        <h3 style={{ color: 'var(--color-emergency)' }}> Emergency Service</h3>
        <p>Need help now? <Link to="/emergency" style={{ color: 'var(--color-emergency)', fontWeight: 700 }}>Request emergency service</Link></p>
      </section>
    </div>
  );
}

export default Home;
