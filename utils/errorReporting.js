const { ErrorReporting } = require('@google-cloud/error-reporting');

// Initialize Error Reporting
const errors = new ErrorReporting({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || undefined,
  serviceContext: {
    service: 'ji-hvac-backend',
    version: '1.0.0'
  },
  reportMode: process.env.NODE_ENV === 'production' ? 'production' : 'always'
});

// Error reporting middleware for Express
const errorReportingMiddleware = (err, req, res, next) => {
  // Report the error to Google Cloud Error Reporting
  errors.report(err, {
    user: req.user?.id || 'anonymous',
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer'),
      remoteAddress: req.ip || req.connection.remoteAddress
    }
  });

  // Continue to the next error handler
  next(err);
};

// Manual error reporting function
const reportError = (error, context = {}) => {
  console.error('Reporting error to Google Cloud:', error);
  
  errors.report(error, {
    user: context.user || 'system',
    request: context.request || {},
    customContext: context.customContext || {}
  });
};

// Async error wrapper for route handlers
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      reportError(error, {
        user: req.user?.id || 'anonymous',
        request: {
          method: req.method,
          url: req.url,
          userAgent: req.get('User-Agent'),
          referrer: req.get('Referrer'),
          remoteAddress: req.ip || req.connection.remoteAddress
        },
        customContext: {
          route: req.route?.path || req.path,
          params: req.params,
          query: req.query,
          body: req.body
        }
      });
      next(error);
    });
  };
};

// Express error handler
const expressErrorHandler = (err, req, res, next) => {
  // Report the error
  reportError(err, {
    user: req.user?.id || 'anonymous',
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer'),
      remoteAddress: req.ip || req.connection.remoteAddress
    },
    customContext: {
      route: req.route?.path || req.path,
      params: req.params,
      query: req.query,
      body: req.body
    }
  });

  // Send error response
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = {
  errors,
  errorReportingMiddleware,
  reportError,
  asyncErrorHandler,
  expressErrorHandler
}; 