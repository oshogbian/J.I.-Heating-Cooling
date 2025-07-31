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
  origin: ['https://jiheatingcooling.web.app', 'https://jiheatingandcooling-site.web.app', 'https://jiheatingandcooling.org', 'http://localhost:3000'],
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
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
