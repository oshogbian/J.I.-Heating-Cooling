import React, { useState } from 'react';

function Emergency() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', issue: '' });
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
      const res = await fetch('https://j-i-heating-cooling-2.onrender.com/api/emergency', {
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
      <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderRadius: 12, boxShadow: 'var(--color-shadow)', padding: '2rem', textAlign: 'center', color: 'var(--color-emergency)', fontWeight: 600 }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          🚨 {submissionMessage || 'Thank you! We\'ll respond to your emergency ASAP.'}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
          Your emergency request has been submitted successfully.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        borderRadius: 14,
        boxShadow: 'var(--color-shadow)',
        padding: '2.5rem 2rem',
        color: 'var(--color-emergency)',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '2.1rem', marginBottom: 16 }}> Emergency Service</h2>
        <div style={{ fontSize: '1.15rem', marginBottom: 10 }}>
          For immediate help, call <a href="tel:+14169979123" style={{ color: 'var(--color-emergency)', fontWeight: 700, textDecoration: 'none' }}>+1 416 997 9123</a> (Sam)
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
        <h3 style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 16 }}>Request Emergency Service</h3>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
          {error && <div style={{ color: 'var(--color-emergency)', marginBottom: 8 }}>{error}</div>}
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Name:</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required aria-label="Name" style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Email:</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required aria-label="Email" style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="phone" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Phone:</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required aria-label="Phone" style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="address" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Address:</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} required aria-label="Address" style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="issue" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Issue Description:</label>
            <textarea id="issue" name="issue" value={form.issue} onChange={handleChange} required aria-label="Issue Description" style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--color-gray)', borderRadius: 4, fontSize: '1rem', minHeight: 80 }} />
          </div>
          <button type="submit" style={{ background: 'var(--color-emergency)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.9rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', width: '100%', transition: 'background 0.2s' }}>Request Emergency Service</button>
        </form>
      </div>
    </div>
  );
}

export default Emergency;
