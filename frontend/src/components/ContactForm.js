import React, { useState } from 'react';
import config from '../config';

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
      const res = await fetch(`${config.SUPABASE_URL}/rest/v1/contacts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': config.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${config.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          service_type: 'general_inquiry'
        }),
      });
      
      if (res.ok) {
        setSubmissionMessage('Thank you! We\'ll be in touch soon.');
        setSubmitted(true);
      } else {
        setError('There was an error. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div style={{ 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(8px)', 
        borderRadius: 12, 
        boxShadow: 'var(--color-shadow)', 
        padding: 'clamp(1.5rem, 4vw, 2rem)', 
        textAlign: 'center', 
        color: 'var(--color-primary)', 
        fontWeight: 600,
        margin: '0 auto',
        maxWidth: '100%',
        width: '100%'
      }}>
        <div style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.1rem)', 
          marginBottom: '0.5rem' 
        }}>
          ✅ {submissionMessage || 'Thank you! We\'ll be in touch soon.'}
        </div>
        <div style={{ 
          fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', 
          color: '#666', 
          fontWeight: 500 
        }}>
          Your message has been sent successfully.
        </div>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        maxWidth: '100%', 
        width: '100%',
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(8px)', 
        borderRadius: 12, 
        boxShadow: 'var(--color-shadow)', 
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(0.75rem, 2vw, 1rem)'
      }}
    >
      {error && (
        <div style={{ 
          color: 'var(--color-emergency)', 
          marginBottom: '1rem',
          padding: '0.75rem',
          background: 'rgba(220,53,69,0.1)',
          borderRadius: 8,
          border: '1px solid rgba(220,53,69,0.2)',
          fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label 
          htmlFor="name" 
          style={{ 
            display: 'block', 
            fontWeight: 600, 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            color: 'var(--color-primary)'
          }}
        >
          Name: *
        </label>
        <input 
          id="name" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          required 
          style={{ 
            width: '100%', 
            padding: 'clamp(0.75rem, 2vw, 0.875rem)', 
            border: '1px solid var(--color-gray)', 
            borderRadius: 8, 
            fontSize: '16px',
            minHeight: 44,
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }} 
          placeholder="Your full name"
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label 
          htmlFor="email" 
          style={{ 
            display: 'block', 
            fontWeight: 600, 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            color: 'var(--color-primary)'
          }}
        >
          Email: *
        </label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          style={{ 
            width: '100%', 
            padding: 'clamp(0.75rem, 2vw, 0.875rem)', 
            border: '1px solid var(--color-gray)', 
            borderRadius: 8, 
            fontSize: '16px',
            minHeight: 44,
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }} 
          placeholder="your.email@example.com"
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label 
          htmlFor="phone" 
          style={{ 
            display: 'block', 
            fontWeight: 600, 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            color: 'var(--color-primary)'
          }}
        >
          Phone (optional):
        </label>
        <input 
          id="phone" 
          name="phone" 
          type="tel" 
          value={form.phone} 
          onChange={handleChange} 
          style={{ 
            width: '100%', 
            padding: 'clamp(0.75rem, 2vw, 0.875rem)', 
            border: '1px solid var(--color-gray)', 
            borderRadius: 8, 
            fontSize: '16px',
            minHeight: 44,
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }} 
          placeholder="(416) 997-9123"
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label 
          htmlFor="address" 
          style={{ 
            display: 'block', 
            fontWeight: 600, 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            color: 'var(--color-primary)'
          }}
        >
          Address (optional):
        </label>
        <input 
          id="address" 
          name="address" 
          value={form.address} 
          onChange={handleChange} 
          style={{ 
            width: '100%', 
            padding: 'clamp(0.75rem, 2vw, 0.875rem)', 
            border: '1px solid var(--color-gray)', 
            borderRadius: 8, 
            fontSize: '16px',
            minHeight: 44,
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }} 
          placeholder="Your condo address"
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label 
          htmlFor="message" 
          style={{ 
            display: 'block', 
            fontWeight: 600, 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            color: 'var(--color-primary)'
          }}
        >
          Message: *
        </label>
        <textarea 
          id="message" 
          name="message" 
          value={form.message} 
          onChange={handleChange} 
          required 
          style={{ 
            width: '100%', 
            padding: 'clamp(0.75rem, 2vw, 0.875rem)', 
            border: '1px solid var(--color-gray)', 
            borderRadius: 8, 
            fontSize: '16px', 
            minHeight: 'clamp(80px, 20vw, 120px)',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }} 
          placeholder="Tell us about your HVAC needs..."
        />
      </div>
      
      <button 
        type="submit" 
        style={{ 
          background: 'var(--color-primary)', 
          color: '#fff', 
          border: 'none', 
          borderRadius: 8, 
          padding: 'clamp(0.875rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)', 
          fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', 
          fontWeight: 700, 
          cursor: 'pointer', 
          width: '100%', 
          transition: 'background 0.2s, transform 0.1s',
          minHeight: 44,
          marginTop: '0.5rem'
        }}
        onMouseEnter={(e) => e.target.style.background = 'var(--color-secondary-dark)'}
        onMouseLeave={(e) => e.target.style.background = 'var(--color-primary)'}
        onMouseDown={(e) => e.target.style.transform = 'translateY(1px)'}
        onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Send Message
      </button>
    </form>
  );
}

export default ContactForm;
