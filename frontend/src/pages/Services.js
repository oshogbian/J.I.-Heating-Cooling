import React, { useState } from 'react';
import { FaFan, FaSnowflake, FaWind } from 'react-icons/fa';

function Services() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', service_type: 'fan coil', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('https://j-i-heating-cooling-2.onrender.com/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        setSubmissionMessage(result.message);
        setSubmitted(true);
      } else {
        setError(result.error || 'There was an error. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 800, margin: '2rem auto', background: 'var(--color-neutral-card)', borderRadius: 12, boxShadow: 'var(--color-shadow)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
          ✅ {submissionMessage || 'Thank you! We\'ll be in touch soon.'}
        </div>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>
          Your service request has been submitted successfully.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2.2rem', marginBottom: '2rem' }}>Our Services</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
        <div className="card" style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 340, textAlign: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
          <FaFan size={48} color="var(--color-primary)" style={{ marginBottom: 12 }} />
          <h3>Fan Coil</h3>
          <p>Install, repair, maintenance, and service for condo fan coil units.</p>
        </div>
        <div className="card" style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 340, textAlign: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
          <FaSnowflake size={48} color="#1976d2" style={{ marginBottom: 12 }} />
          <h3>Heat Pump</h3>
          <p>Maintenance and installation for high-efficiency heat pumps.</p>
        </div>
        <div className="card" style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 340, textAlign: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
          <FaWind size={48} color="#00bcd4" style={{ marginBottom: 12 }} />
          <h3 style={{ color: '#00bcd4' }}>Vent Cleaning</h3>
          <p>Professional vent cleaning to improve air quality and prevent mold.</p>
        </div>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        boxShadow: 'var(--color-shadow)',
        padding: '2rem',
        maxWidth: 600,
        margin: '2rem auto',
      }}>
        <h3 style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Request a Quote</h3>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'var(--color-emergency)', marginBottom: 8 }}>{error}</div>}
          <div>
            <label>Name:</label>
            <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label>Email:</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label>Service Needed:</label>
            <select name="service_type" value={form.service_type} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }}>
              <option value="fan coil">Fan Coil</option>
              <option value="heat pump">Heat Pump</option>
              <option value="vent cleaning">Vent Cleaning</option>
            </select>
          </div>
          <div>
            <label>Phone (optional):</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label>Address (optional):</label>
            <input name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={form.description} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.75rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>Request Quote</button>
        </form>
      </div>
    </div>
  );
}

export default Services;
