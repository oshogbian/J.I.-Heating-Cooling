require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const express = require('express');
const cors = require('cors');

// Import error reporting utilities
const { 
  errorReportingMiddleware, 
  expressErrorHandler, 
  reportError 
} = require('./utils/errorReporting');

const contactRoutes = require('./routes/contact');
const servicesRoutes = require('./routes/services');
const emergencyRoutes = require('./routes/emergency');
const { router: authRoutes } = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');
const webhookRoutes = require('./routes/webhook');
const errorRoutes = require('./routes/errors');
const testRoutes = require('./routes/test');

const app = express();
app.use(cors({
  origin: ['https://jiheatingcooling.web.app', 'https://jiheatingandcooling-site.web.app', 'https://jiheatingandcooling.org', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/errors', errorRoutes);
app.use('/api/test', testRoutes);

app.get('/', (req, res) => {
  res.send('J.I. Heating and Cooling API');
});

// Error reporting middleware (must be after all routes)
app.use(errorReportingMiddleware);

// Global error handler (must be last)
app.use(expressErrorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Error reporting enabled for project: ${process.env.GOOGLE_CLOUD_PROJECT_ID || 'Not configured'}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  reportError(error, {
    user: 'system',
    customContext: { type: 'uncaughtException' }
  });
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  reportError(new Error(`Unhandled Rejection: ${reason}`), {
    user: 'system',
    customContext: { 
      type: 'unhandledRejection',
      promise: promise.toString()
    }
  });
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
