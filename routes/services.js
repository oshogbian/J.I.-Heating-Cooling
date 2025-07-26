const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { sendEmail, formatServiceEmail } = require('../utils/emailService');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/', async (req, res) => {
  const { 
    name, 
    email, 
    phone = '', 
    address = '',
    service_type, 
    preferred_date = '', 
    description = '' 
  } = req.body;
  
  try {
    // 1. Save to Supabase (with all form data)
    const { data, error } = await supabase
      .from('service_requests')
      .insert([{ 
        customer_id: null, 
        name,
        email,
        phone,
        address,
        service_type, 
        preferred_date, 
        description  // Using 'description' column
      }]);
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // 2. Send email notification
    const { html, text } = formatServiceEmail({ 
      name, 
      email, 
      phone, 
      address,
      serviceType: service_type,
      preferredDate: preferred_date,
      description
    });
    
    const emailResult = await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: 'New Service Request - J.I. Heating and Cooling',
      html,
      text
    });
    
    if (!emailResult.success) {
      console.warn('Email could not be sent but data was saved:', emailResult.error);
    }
    
    res.json({ 
      success: true,
      message: emailResult.success 
        ? 'Service request submitted successfully! We\'ll be in touch soon.' 
        : 'Service request submitted successfully! We\'ve saved your information and will contact you soon.',
      data,
      emailSent: emailResult.success,
      emailError: emailResult.authError ? 'Email notification failed due to server configuration. Your request was still saved.' : null
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
  }
});

module.exports = router;
