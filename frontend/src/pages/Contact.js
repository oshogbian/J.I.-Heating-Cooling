import React from 'react';
import ContactForm from '../components/ContactForm';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

function Contact() {
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 14,
        boxShadow: 'var(--color-shadow)',
        padding: '2.5rem 2rem',
        color: 'var(--color-primary)',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '2.1rem', marginBottom: 16 }}>Contact Us</h2>
        <div style={{ fontSize: '1.15rem', marginBottom: 10 }}>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Phone:</span> <a href="tel:+14169979123" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none' }}>+1 416 997 9123</a>
        </div>
        <div style={{ fontSize: '1.15rem', marginBottom: 10 }}>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Email:</span> <a href="mailto:SAM@jiheatingandcooling.com" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none' }}>SAM@jiheatingandcooling.com</a>
        </div>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: 10 }}>Service Area: GTA</div>
        <div style={{ color: '#b0b0b0', fontSize: '1rem', marginBottom: 18 }}>Direct to owner, no call centers</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 10 }}>
          <a href="https://facebook.com/jiheatingandcooling" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook size={32} color="#1877f3" style={{ transition: 'transform 0.2s' }} />
          </a>
          <a href="https://instagram.com/jiheatingandcooling" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram size={32} color="#e4405f" style={{ transition: 'transform 0.2s' }} />
          </a>
          <a href="https://wa.me/14169979123" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp size={32} color="#25d366" style={{ transition: 'transform 0.2s' }} />
          </a>
          <a href="https://www.tiktok.com/@jiheatingandcooling" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok size={32} color="#000" style={{ transition: 'transform 0.2s' }} />
          </a>
        </div>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 14,
        boxShadow: 'var(--color-shadow)',
        padding: '2rem 1.5rem',
        color: 'var(--color-primary)',
        textAlign: 'center',
      }}>
        <h3 style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 16 }}>Send Us a Message</h3>
        <ContactForm />
      </div>
    </div>
  );
}

export default Contact;
