const express = require('express');
const router = express.Router();

// Simple admin credentials (in production, use environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ji-hvac-2024';

// Store active sessions (in production, use Redis or database)
const activeSessions = new Set();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !activeSessions.has(sessionId)) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  next();
};

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Generate session ID
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    activeSessions.add(sessionId);
    
    res.json({
      success: true,
      message: 'Login successful',
      sessionId
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Check authentication status
router.get('/check', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Authenticated'
  });
});

module.exports = { router, requireAuth, activeSessions }; 