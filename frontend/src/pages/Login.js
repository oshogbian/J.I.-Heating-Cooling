import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkExistingSession = () => {
      const sessionId = localStorage.getItem('adminSessionId');
      console.log('Login page - checking existing session:', sessionId ? 'exists' : 'not found');
      
      if (sessionId) {
        try {
          // Check if session is still valid (simple check)
          const sessionParts = sessionId.split('-');
          if (sessionParts.length >= 3) {
            const sessionTime = sessionParts[2];
            const currentTime = Date.now();
            const sessionAge = currentTime - parseInt(sessionTime);
            
            // Session valid for 24 hours
            if (sessionAge < 24 * 60 * 60 * 1000) {
              console.log('Valid session found, redirecting to invoices');
              navigate('/invoices');
              return;
            } else {
              console.log('Session expired, removing from localStorage');
              localStorage.removeItem('adminSessionId');
            }
          } else {
            console.log('Invalid session format, removing from localStorage');
            localStorage.removeItem('adminSessionId');
          }
        } catch (error) {
          console.error('Session validation error:', error);
          localStorage.removeItem('adminSessionId');
        }
      }
    };

    // Add a longer delay for mobile browsers
    const sessionCheck = setTimeout(checkExistingSession, 1000);
    return () => clearTimeout(sessionCheck);
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Attempting login with Supabase');
    console.log('Supabase URL:', config.SUPABASE_URL);
    console.log('Credentials:', credentials);

    try {
      // For Supabase, we'll use a simple admin check
      // In production, you might want to use Supabase Auth
      if (credentials.username === 'admin' && credentials.password === 'ji-hvac-2024') {
        // Store admin session with timestamp
        const sessionId = 'admin-session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        try {
          localStorage.setItem('adminSessionId', sessionId);
          console.log('Login successful, session ID:', sessionId);
          
          // Verify the session was stored correctly
          const storedSession = localStorage.getItem('adminSessionId');
          if (storedSession === sessionId) {
            console.log('Session stored successfully, redirecting...');
            // Add a longer delay for mobile browsers to ensure localStorage is properly set
            setTimeout(() => {
              navigate('/invoices');
            }, 1000);
          } else {
            console.error('Session storage verification failed');
            setError('Session storage failed. Please try again.');
          }
        } catch (error) {
          console.error('localStorage error:', error);
          setError('Browser storage error. Please try again.');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '4rem auto', 
      padding: '2rem',
      background: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <h2 style={{ 
        color: '#183153', 
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
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 600, 
            color: '#333333',
            fontSize: '1rem'
          }}>
            Username
          </label>
          <input
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: '1rem',
              color: '#333333',
              background: '#ffffff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 600, 
            color: '#333333',
            fontSize: '1rem'
          }}>
            Password
          </label>
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: '1rem',
              color: '#333333',
              background: '#ffffff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: '#183153',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
            minHeight: 44
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ 
        marginTop: '2rem', 
        textAlign: 'center', 
        color: '#666666',
        fontSize: '0.9rem'
      }}>
        <p style={{ marginBottom: '0.5rem', color: '#333333' }}>
          Access the invoice management system
        </p>
        <p style={{ 
          fontSize: '0.8rem', 
          marginTop: '0.5rem',
          color: '#666666',
          background: '#f8f9fa',
          padding: '0.5rem',
          borderRadius: 6,
          border: '1px solid #e9ecef'
        }}>
          Username: admin | Password: ji-hvac-2024
        </p>
      </div>
    </div>
  );
}

export default Login; 