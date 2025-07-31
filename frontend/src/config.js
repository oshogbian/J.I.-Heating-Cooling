// Configuration for different environments
const config = {
  // API URL - will use environment variable or fallback to localhost
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5050',
  
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Supabase configuration (if needed for frontend)
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
};

export default config; 