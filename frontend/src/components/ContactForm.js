import React, { useState } from 'react';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', message: '' });
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
      const res = await fetch('https://j-i-heating-cooling-2.onrender.com/api/contact', {
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
      <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderRadius: 12, boxShadow: 'var(--color-shadow)', padding: '2rem', textAlign: 'center', color: 'var(--color-primary)', fontWeight: 600 }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          ✅ {submissionMessage || 'Thank you! We\'ll be in touch soon.'}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
          Your message has been sent successfully.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderRadius: 12, boxShadow: 'var(--color-shadow)', padding: '2rem' }}>
      {error && <div style={{ color: 'var(--color-emergency)', marginBottom: 8 }}>{error}</div>}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Name:</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Email:</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="phone" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Phone (optional):</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="address" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Address (optional):</label>
        <input id="address" name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="message" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Message:</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} required style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem', minHeight: 80 }} />
      </div>
      <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.9rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', width: '100%', transition: 'background 0.2s' }}>Send</button>
    </form>
  );
}

export default ContactForm;
