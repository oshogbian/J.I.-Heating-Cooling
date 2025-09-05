// Configuration for different environments
const config = {
  // Supabase configuration
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'https://your-new-project-ref.supabase.co',
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc3RoYWJ4b3ljcGdpem1wYXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjY2ODUsImV4cCI6MjA2ODkwMjY4NX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
  SUPABASE_SERVICE_ROLE_KEY: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc3RoYWJ4b3ljcGdpem1wYXZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyNjY4NSwiZXhwIjoyMDY4OTAyNjg1fQ.lFc_Zw631ki369yfucku2OZF0pcZ4RzyozImaXcnDOo',
  
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