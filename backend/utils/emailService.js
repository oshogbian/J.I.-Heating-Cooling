const nodemailer = require('nodemailer');

// Create a transporter using SMTP with better error handling and fallbacks
const createTransporter = async () => {
  // Get the email domain to determine potential provider
  const emailUser = process.env.EMAIL_USER;
  const emailDomain = emailUser.split('@')[1];
  
  // Default configuration
  let config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Add timeout settings to prevent hanging connections
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 10000,     // 10 seconds
  };
  
  // Optional: Auto-detect common email providers based on domain
  // This makes it easier to set up without knowing specific SMTP details
  if (!process.env.EMAIL_HOST || process.env.EMAIL_HOST === 'auto') {
    if (emailDomain === 'gmail.com') {
      config.host = 'smtp.gmail.com';
      config.port = 587;
    } else if (emailDomain === 'outlook.com' || emailDomain === 'hotmail.com') {
      config.host = 'smtp.office365.com';
      config.port = 587;
    } else if (emailDomain === 'yahoo.com') {
      config.host = 'smtp.mail.yahoo.com';
      config.port = 587;
    } else if (emailDomain === 'aol.com') {
      config.host = 'smtp.aol.com';
      config.port = 587;
    } else if (emailDomain === 'zoho.com') {
      config.host = 'smtp.zoho.com';
      config.port = 587;
    } else {
      // Try to use the domain's own mail server (common for business emails)
      config.host = `mail.${emailDomain}`;
      config.port = 587;
    }
  }
  
  // Always update secure based on port
  config.secure = config.port === 465;
  
  console.log(`Setting up email with host: ${config.host}, port: ${config.port}, secure: ${config.secure}`);
  
  const transporter = nodemailer.createTransport(config);
  
  // Verify connection configuration with timeout
  try {
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Verification timeout')), 5000)
      )
    ]);
    console.log('SMTP connection verified successfully');
  } catch (error) {
    console.warn('SMTP verification failed:', error.message);
    console.log('Will attempt to send email anyway');
  }
  
  return transporter;
};

// Send email function with retry logic
const sendEmail = async ({ to, subject, html, text }) => {
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const transporter = await createTransporter();
      
      const mailOptions = {
        from: `"J.I. Heating and Cooling" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text, // Plain text version for email clients that don't support HTML
      };
      
      const info = await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Send timeout')), 15000)
        )
      ]);
      
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error;
      console.error(`Email attempt ${attempt} failed:`, error.message);
      
             // Don't retry authentication errors - they won't succeed
       if (error.code === 'EAUTH' || error.responseCode === 535 || error.responseCode === 534) {
         console.error('Authentication failed - check your email credentials');
         return { 
           success: false, 
           error: 'Email authentication failed. Please check your email credentials in the environment variables.',
           authError: true 
         };
       }
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${attempt * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  }
  
  console.error('All email attempts failed:', lastError);
  return { success: false, error: lastError.message };
};

// Format contact form submission as HTML email
const formatContactEmail = (data) => {
  const { name, email, phone = 'Not provided', address = 'Not provided', message = '' } = data;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a5276;">New Contact Form Submission</h2>
      <p>You have received a new contact request from your website.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      </div>
      
      <p style="color: #7f8c8d; font-size: 12px;">
        This is an automated email from your website. Please do not reply to this message.
      </p>
    </div>
  `;
  
  const text = `
    New Contact Form Submission
    
    You have received a new contact request from your website.
    
    Customer Information:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone}
    - Address: ${address}
    ${message ? `- Message: ${message}` : ''}
    
    This is an automated email from your website.
  `;
  
  return { html, text };
};

// Format service request as HTML email
const formatServiceEmail = (data) => {
  const { 
    name, 
    email, 
    phone = 'Not provided', 
    address = 'Not provided',
    serviceType = 'Not specified',
    preferredDate = 'Not specified',
    description = ''
  } = data;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a5276;">New Service Request</h2>
      <p>You have received a new service request from your website.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>
      
      <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Service Details</h3>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
      </div>
      
      <p style="color: #7f8c8d; font-size: 12px;">
        This is an automated email from your website. Please do not reply to this message.
      </p>
    </div>
  `;
  
  const text = `
    New Service Request
    
    You have received a new service request from your website.
    
    Customer Information:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone}
    - Address: ${address}
    
    Service Details:
    - Service Type: ${serviceType}
    - Preferred Date: ${preferredDate}
    ${description ? `- Description: ${description}` : ''}
    
    This is an automated email from your website.
  `;
  
  return { html, text };
};

// Format emergency request as HTML email
const formatEmergencyEmail = (data) => {
  const { 
    name, 
    email, 
    phone = 'Not provided', 
    address = 'Not provided',
    issue = 'Not specified'
  } = data;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #c0392b;">⚠️ EMERGENCY SERVICE REQUEST ⚠️</h2>
      <p>You have received an <strong>emergency service request</strong> from your website.</p>
      
      <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e74c3c;">
        <h3 style="margin-top: 0; color: #c0392b;">Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>
      
      <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e74c3c;">
        <h3 style="margin-top: 0; color: #c0392b;">Emergency Details</h3>
        <p><strong>Issue:</strong> ${issue}</p>
      </div>
      
      <p style="color: #7f8c8d; font-size: 12px;">
        This is an automated email from your website. Please do not reply to this message.
      </p>
    </div>
  `;
  
  const text = `
    ⚠️ EMERGENCY SERVICE REQUEST ⚠️
    
    You have received an EMERGENCY service request from your website.
    
    Customer Information:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone}
    - Address: ${address}
    
    Emergency Details:
    - Issue: ${issue}
    
    This is an automated email from your website.
  `;
  
  return { html, text };
};

module.exports = {
  sendEmail,
  formatContactEmail,
  formatServiceEmail,
  formatEmergencyEmail
};
