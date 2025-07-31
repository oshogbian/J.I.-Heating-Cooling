const express = require('express');
const router = express.Router();
const { sendEmail, formatServiceEmail } = require('../utils/emailService');

// Initialize Supabase only if environment variables are set
let supabase = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
} catch (error) {
  console.warn('Supabase not configured, running without database storage');
}

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
    // 1. Save to Supabase if configured
    let data = null;
    if (supabase) {
      const { data: supabaseData, error } = await supabase
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
        // Continue without database storage
      } else {
        data = supabaseData;
      }
    } else {
      console.log('Service request submission (no database):', { 
        name, 
        email, 
        phone, 
        address,
        service_type, 
        preferred_date, 
        description 
      });
    }
    
    // 2. Send email notification (async - don't wait for it)
    const emailPromise = (async () => {
      try {
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
      } catch (err) {
        console.warn('Email sending failed:', err.message);
      }
    })();
    
    // Return success immediately
    res.json({ 
      success: true,
      message: 'Service request submitted successfully! We\'ll be in touch soon.',
      data
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
  }
});

module.exports = router;
