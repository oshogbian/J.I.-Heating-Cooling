const { Sequelize } = require('sequelize');

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'your_supabase_url_here') {
  console.warn('DATABASE_URL not found in environment variables. Database features will be limited.');
  // Create a dummy sequelize instance that won't actually connect
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: ':memory:'
  });
  
  // Override the authenticate method to not actually try to connect
  sequelize.authenticate = () => Promise.resolve();
  
  module.exports = sequelize;
} else {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  // Test the connection
  sequelize.authenticate()
    .then(() => {
      console.log('Database connection established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

  module.exports = sequelize;
} 