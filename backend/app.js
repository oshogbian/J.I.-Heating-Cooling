require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const contactRoutes = require('./routes/contact');
const servicesRoutes = require('./routes/services');
const emergencyRoutes = require('./routes/emergency');
const invoiceRoutes = require('./routes/invoices');
const { router: authRoutes } = require('./routes/auth');

const app = express();
app.use(cors({
  origin: [
    'https://jiheatingcooling.web.app', 
    'https://jiheatingandcooling-site.web.app', 
    'https://jiheatingandcooling.org', 
    'http://localhost:3000',
    'http://localhost:3001',
    // Allow connections from any IP address (for mobile testing)
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
    /^http:\/\/172\.\d+\.\d+\.\d+:\d+$/,
    /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/', (req, res) => {
  res.send('J.I. Heating and Cooling API');
});

const PORT = process.env.PORT || 5050;

// Initialize database and start server
async function startServer() {
  try {
    // Try to sync database models
    try {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized');
    } catch (dbError) {
      console.warn('Database connection failed, but server will start without database features:', dbError.message);
      console.log('Server will run with limited functionality (PDF generation will still work)');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('API endpoints available:');
      console.log('- POST /api/contact');
      console.log('- POST /api/services');
      console.log('- POST /api/emergency');
      console.log('- POST /api/auth/login');
      console.log('- GET /api/invoices/:id/pdf');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
