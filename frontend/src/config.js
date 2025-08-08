// Configuration for different environments
const config = {
  // Supabase configuration
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'https://ljsthabxoycpgizmpavx.supabase.co',
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here',
  SUPABASE_SERVICE_ROLE_KEY: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_role_key_here',
  
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API URL - use Supabase for backend
  API_URL: process.env.REACT_APP_SUPABASE_URL || 'https://ljsthabxoycpgizmpavx.supabase.co',
};

// Auto-detect configuration for different environments
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  console.log('Frontend config - hostname:', hostname, 'port:', port);
  console.log('Environment variables check:', {
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV
  });
  
  // For custom domain (production)
  if (hostname === 'jiheatingandcooling.org' || hostname === 'www.jiheatingandcooling.org') {
    // Use Supabase as backend
    config.API_URL = config.SUPABASE_URL;
    console.log('Using Supabase API URL for custom domain:', config.API_URL);
  }
  // For Firebase hosting (production)
  else if (hostname.includes('firebaseapp.com') || hostname.includes('web.app')) {
    // Use Supabase as backend
    config.API_URL = config.SUPABASE_URL;
    console.log('Using Supabase API URL for Firebase hosting:', config.API_URL);
  }
  // For local development
  else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Use localhost for development
    config.API_URL = 'http://localhost:5050';
    console.log('Using localhost API URL for development:', config.API_URL);
  }
  // For other domains
  else {
    // Use Supabase as backend
    config.API_URL = config.SUPABASE_URL;
    console.log('Using Supabase API URL for other domain:', config.API_URL);
  }
}

export default config; 