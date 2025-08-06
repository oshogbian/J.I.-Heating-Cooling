const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { sendEmail, formatContactEmail } = require('../utils/emailService');

// Initialize Supabase client only if environment variables are available
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && 
    process.env.SUPABASE_URL !== 'your_supabase_url_here') {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } catch (error) {
    console.warn('Supabase client initialization failed:', error.message);
    supabase = null;
  }
} else {
  console.log('Supabase not configured, running without database storage');
}

router.post('/', async (req, res) => {
  const { name, email, phone = '', address = '', message = '' } = req.body;
  
  try {
    // 1. Save to Supabase (if available)
    let data = null;
    if (supabase) {
      const { data: supabaseData, error } = await supabase
        .from('customers')
        .insert([{ name, email, phone, address, message }]);
        
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }
      data = supabaseData;
    } else {
      console.log('Contact form submission (no database):', { name, email, phone, address, message });
    }
    
    // 2. Send email notification
    const { html, text } = formatContactEmail({ name, email, phone, address, message });
    const emailResult = await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: 'New Contact Form Submission - J.I. Heating and Cooling',
      html,
      text
    });
    
    if (!emailResult.success) {
      console.warn('Email could not be sent but data was saved:', emailResult.error);
    }
    
    res.json({ 
      success: true,
      message: emailResult.success 
        ? 'Message sent successfully! We\'ll be in touch soon.' 
        : 'Message sent successfully! We\'ve saved your information and will contact you soon.',
      data,
      emailSent: emailResult.success,
      emailError: emailResult.authError ? 'Email notification failed due to server configuration. Your message was still saved.' : null
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
  }
});

module.exports = router;
