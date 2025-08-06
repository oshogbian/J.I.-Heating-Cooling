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
        <h2 style={{ fontWeight: 700, fontSize: '2.1rem', marginBottom: 16 }}>Get Your Free Consultation Today</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
          Ready to transform your condo's comfort? Contact us for a free consultation and discover how we can improve your comfort, air quality, and energy efficiency.
        </p>
        <div style={{ fontSize: '1.15rem', marginBottom: 10 }}>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Phone:</span> <a href="tel:+14169979123" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none' }}>+1 416 997 9123</a>
        </div>
        <div style={{ fontSize: '1.15rem', marginBottom: 10 }}>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Email:</span> <a href="mailto:sam@jiheatingandcooling.org" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none' }}>sam@jiheatingandcooling.org</a>
        </div>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: 10 }}>
          <strong>Service Area:</strong> Toronto, North York, Etobicoke, Scarborough, Mississauga, and the Greater Toronto Area
        </div>
        <div style={{ color: '#666666', fontSize: '1rem', marginBottom: 18 }}>Direct to owner, Sam. No call centers, no runaround—just real help when you need it.</div>
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

      {/* Business Hours & Emergency Services */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary), #1a365d)',
        borderRadius: '15px',
        padding: '2rem',
        margin: '2rem auto',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 1.5rem 0', color: '#fff' }}>
          Business Hours & Emergency Services
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '1rem'
        }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#fff' }}>
              Regular Business Hours
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, opacity: 0.9 }}>
              Monday - Friday: 8:00 AM - 6:00 PM<br />
              Saturday: 9:00 AM - 4:00 PM<br />
              Sunday: Emergency Services Only
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#fff' }}>
              24/7 Emergency Services
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, opacity: 0.9 }}>
              Available for urgent HVAC issues<br />
              Rapid response times<br />
              Same-day service when possible
            </p>
          </div>
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
