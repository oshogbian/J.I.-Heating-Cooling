const express = require('express');
const router = express.Router();
const { reportError } = require('../utils/errorReporting');

// Test route to verify error reporting is working
router.post('/error', (req, res) => {
  try {
    // Intentionally throw an error to test error reporting
    throw new Error('Test error for error reporting verification');
  } catch (error) {
    // Report the error
    reportError(error, {
      user: 'test-user',
      customContext: {
        type: 'test-error',
        purpose: 'error-reporting-verification'
      }
    });
    
    res.status(500).json({
      success: false,
      message: 'Test error generated and reported successfully',
      error: error.message
    });
  }
});

// Test route for frontend error reporting
router.post('/frontend-error', (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Create a test error
    const testError = new Error(message || 'Frontend test error');
    
    // Report the error
    reportError(testError, {
      user: context?.user || 'frontend-test-user',
      customContext: {
        ...context,
        type: 'frontend-test-error',
        purpose: 'frontend-error-reporting-verification'
      }
    });
    
    res.json({
      success: true,
      message: 'Frontend test error reported successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to report frontend test error',
      error: error.message
    });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Error reporting service is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'not-configured'
  });
});

module.exports = router; 