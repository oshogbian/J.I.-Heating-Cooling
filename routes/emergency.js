const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { sendEmail, formatEmergencyEmail } = require('../utils/emailService');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/', async (req, res) => {
  const { 
    name = '', 
    email = '', 
    phone = '', 
    address = '',
    issue = '' 
  } = req.body;
  
  try {
    // 1. Save to Supabase (with all form data)
    const { data, error } = await supabase
      .from('emergency_requests')
      .insert([{ 
        customer_info: name, 
        email,
        phone,
        address,
        issue,
        contact_method: 'web_form'
      }]);
      
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // 2. Send URGENT email notification
    // Send email notification (async - don't wait for it)
    const emailPromise = (async () => {
      try {
        const { html, text } = formatEmergencyEmail({ 
          name, 
          email, 
          phone, 
          address,
          issue
        });
        
        const emailResult = await sendEmail({
          to: process.env.COMPANY_EMAIL,
          subject: '🚨 EMERGENCY SERVICE REQUEST - J.I. Heating and Cooling',
          html,
          text
        });
        
        if (!emailResult.success) {
          console.warn('Email could not be sent but emergency data was saved:', emailResult.error);
        }
      } catch (err) {
        console.warn('Email sending failed:', err.message);
      }
    })();
    
    // Return success immediately
    res.json({ 
      success: true,
      message: 'Emergency request submitted successfully! We\'ll respond to your emergency ASAP.',
      data
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
  }
});

module.exports = router;
