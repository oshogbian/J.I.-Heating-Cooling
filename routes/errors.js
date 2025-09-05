const express = require('express');
const router = express.Router();
const { reportError } = require('../utils/errorReporting');

// Route to handle frontend error reports
router.post('/', async (req, res) => {
  try {
    const {
      message,
      stack,
      name,
      service,
      version,
      timestamp,
      userAgent,
      url,
      referrer,
      context
    } = req.body;

    // Create a proper Error object for Google Cloud Error Reporting
    const error = new Error(message);
    error.name = name || 'FrontendError';
    error.stack = stack;

    // Report to Google Cloud Error Reporting
    reportError(error, {
      user: context?.user || 'frontend-user',
      request: {
        method: 'POST',
        url: '/api/errors',
        userAgent: userAgent,
        referrer: referrer
      },
      customContext: {
        ...context,
        service: service,
        version: version,
        timestamp: timestamp,
        frontendUrl: url,
        errorType: 'frontend-error'
      }
    });

    res.json({ 
      success: true, 
      message: 'Error reported successfully' 
    });

  } catch (error) {
    console.error('Error handling frontend error report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to report error' 
    });
  }
});

module.exports = router; 