import React, { useState } from 'react';
import { FaFan, FaSnowflake, FaWind } from 'react-icons/fa';
import config from '../config';

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
      const res = await fetch(`${config.SUPABASE_URL}/rest/v1/service_requests`, {
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
          address: form.address,
          service_type: form.service_type,
          description: form.description
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
      <div style={{ maxWidth: 800, margin: '2rem auto', background: '#ffffff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#183153', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
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
      <h2 style={{ color: '#000000 !important', fontWeight: 700, fontSize: '2.2rem', marginBottom: '1rem', textAlign: 'center' }}>Comprehensive Condo HVAC Solutions</h2>
      <p style={{ color: '#333333 !important', fontSize: '1.1rem', textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
        From installation to maintenance and emergency repairs, our specialized services address the unique challenges of condo living. 
        Experience superior comfort, energy savings, and pristine air quality with our expert solutions.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
        <div className="card" style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 340, textAlign: 'center', background: '#ffffff', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <FaFan size={48} color="#183153" style={{ marginBottom: 12 }} />
          <h3 style={{ color: '#183153', marginBottom: '1rem' }}>Fan Coil Services</h3>
          <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            From precise installations to routine maintenance and emergency repairs, our fan coil experts ensure your unit operates quietly and efficiently, providing consistent temperature control and improved air circulation for your condo.
          </p>
          <a href="/fan-coil-service" style={{
            display: 'inline-block',
            background: '#183153',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'background 0.2s'
          }}>
            Learn More
          </a>
        </div>
        <div className="card" style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 340, textAlign: 'center', background: '#ffffff', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <FaSnowflake size={48} color="#183153" style={{ marginBottom: 12 }} />
          <h3 style={{ color: '#183153', marginBottom: '1rem' }}>Heat Pump Solutions</h3>
          <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Embrace sustainable heating and cooling with our advanced heat pump systems. We specialize in installation, repair, and maintenance of air-source and ground-source heat pumps, tailored for Canadian climates to maximize efficiency and reduce your utility bills.
          </p>
          <a href="/heat-pump-service" style={{
            display: 'inline-block',
            background: '#183153',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'background 0.2s'
          }}>
            Learn More
          </a>
        </div>
        <div className="card" style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 340, textAlign: 'center', background: '#ffffff', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <FaWind size={48} color="#183153" style={{ marginBottom: 12 }} />
          <h3 style={{ color: '#183153', marginBottom: '1rem' }}>Professional Vent Cleaning</h3>
          <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Eliminate dust, allergens, and contaminants from your condo's ventilation system. Our comprehensive vent cleaning services improve indoor air quality, enhance HVAC efficiency, and contribute to a healthier living environment.
          </p>
          <a href="/vent-cleaning-service" style={{
            display: 'inline-block',
            background: '#183153',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'background 0.2s'
          }}>
            Learn More
          </a>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div style={{
        background: 'linear-gradient(135deg, #183153, #1a365d)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        margin: '4rem auto',
        maxWidth: '1000px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          margin: '0 0 2rem 0',
          color: '#fff'
        }}>
          Why Choose J.I. Heating & Cooling?
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#fff' }}>
              Local Expertise
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, opacity: 0.9 }}>
              Deep understanding of condo building systems and regulations
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#fff' }}>
              Energy Savings
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, opacity: 0.9 }}>
              Solutions designed to reduce your utility bills in Canadian climates
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#fff' }}>
              Healthier Living
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, opacity: 0.9 }}>
              Improved indoor air quality for a comfortable and safe home
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#fff' }}>
              24/7 Support
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, opacity: 0.9 }}>
              Reliable emergency services when you need them most
            </p>
          </div>
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '2rem',
        maxWidth: 600,
        margin: '2rem auto',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ color: '#000000', fontWeight: 600 }}>Request a Quote</h3>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: '#dc3545', marginBottom: 8 }}>{error}</div>}
          <div>
            <label style={{ color: '#000000', fontWeight: 600 }}>Name:</label>
            <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid #d1d5db', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ color: '#000000', fontWeight: 600 }}>Email:</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid #d1d5db', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ color: '#000000', fontWeight: 600 }}>Service Needed:</label>
            <select name="service_type" value={form.service_type} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid #d1d5db', borderRadius: 4, fontSize: '1rem' }}>
              <option value="fan coil">Fan Coil</option>
              <option value="heat pump">Heat Pump</option>
              <option value="vent cleaning">Vent Cleaning</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#000000', fontWeight: 600 }}>Phone (optional):</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid #d1d5db', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ color: '#000000', fontWeight: 600 }}>Address (optional):</label>
            <input name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid #d1d5db', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ color: '#000000', fontWeight: 600 }}>Description:</label>
            <textarea name="description" value={form.description} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: 12, border: '1px solid #d1d5db', borderRadius: 4, fontSize: '1rem' }} />
          </div>
          <button type="submit" style={{ background: '#183153', color: '#fff', border: 'none', borderRadius: 4, padding: '0.75rem 1.5rem', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>Request Quote</button>
        </form>
      </div>
    </div>
  );
}

export default Services;
