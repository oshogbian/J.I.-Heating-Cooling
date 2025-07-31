import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        // Store session ID in localStorage
        localStorage.setItem('adminSessionId', data.sessionId);
        // Redirect to invoice generator
        navigate('/invoices');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '4rem auto', 
      padding: '2rem',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: 12,
      boxShadow: 'var(--color-shadow)'
    }}>
      <h2 style={{ 
        color: 'var(--color-primary)', 
        fontWeight: 700, 
        fontSize: '2rem', 
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Admin Login
      </h2>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: 8, 
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Username
          </label>
          <input
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid var(--color-gray)', 
              borderRadius: 8,
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Password
          </label>
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid var(--color-gray)', 
              borderRadius: 8,
              fontSize: '1rem'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ 
        marginTop: '2rem', 
        textAlign: 'center', 
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p>Access the invoice management system</p>
      </div>
    </div>
  );
}

export default Login; 