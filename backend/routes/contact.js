const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { sendEmail, formatContactEmail } = require('../utils/emailService');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/', async (req, res) => {
  const { name, email, phone = '', address = '', message = '' } = req.body;
  
  try {
    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('customers')
      .insert([{ name, email, phone, address, message }]);
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
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
      message: 'Contact form received, saved, and notification sent', 
      data,
      emailSent: emailResult.success 
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
  }
});

module.exports = router;
