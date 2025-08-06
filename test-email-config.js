require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmailConfigurations() {
  console.log('=== Email Configuration Test ===\n');
  
  // Show current environment variables
  console.log('Current Environment Variables:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '[SET]' : '[NOT SET]');
  console.log('COMPANY_EMAIL:', process.env.COMPANY_EMAIL);
  console.log('');

  const emailUser = process.env.EMAIL_USER;
  if (!emailUser) {
    console.log('❌ EMAIL_USER is not set');
    return;
  }

  const emailDomain = emailUser.split('@')[1];
  console.log('Email Domain:', emailDomain);
  console.log('');

  // Test different SMTP configurations
  const configs = [
    {
      name: 'Current Configuration',
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_PORT === '465'
    },
    {
      name: 'Gmail SMTP (if using Gmail)',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false
    },
    {
      name: 'Gmail SMTP (SSL)',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true
    },
    {
      name: 'Outlook/Hotmail SMTP',
      host: 'smtp.office365.com',
      port: 587,
      secure: false
    },
    {
      name: 'Yahoo SMTP',
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false
    },
    {
      name: 'Custom Domain (Port 587)',
      host: `mail.${emailDomain}`,
      port: 587,
      secure: false
    },
    {
      name: 'Custom Domain (Port 465)',
      host: `mail.${emailDomain}`,
      port: 465,
      secure: true
    },
    {
      name: 'Custom Domain (Port 25)',
      host: `mail.${emailDomain}`,
      port: 25,
      secure: false
    }
  ];

  for (const config of configs) {
    if (!config.host) continue;
    
    console.log(`Testing: ${config.name}`);
    console.log(`Host: ${config.host}:${config.port} (secure: ${config.secure})`);
    
    try {
      const transporter = nodemailer.createTransporter({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        // Add timeout settings
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000
      });

      // Test connection
      await transporter.verify();
      console.log('✅ Connection successful!');
      
      // Try to send a test email
      try {
        const info = await transporter.sendMail({
          from: `"Test" <${process.env.EMAIL_USER}>`,
          to: process.env.COMPANY_EMAIL || 'sam@jiheatingandcooling.org',
          subject: 'Email Configuration Test',
          text: 'This is a test email to verify your SMTP configuration is working.',
          html: '<h1>Test Email</h1><p>This is a test email to verify your SMTP configuration is working.</p>'
        });
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('');
        
        // If this configuration works, suggest updating environment variables
        console.log('🎉 SUCCESS! This configuration works.');
        console.log('Update your Render environment variables to:');
        console.log(`EMAIL_HOST=${config.host}`);
        console.log(`EMAIL_PORT=${config.port}`);
        console.log('');
        return; // Exit after first successful configuration
        
      } catch (sendError) {
        console.log('❌ Connection works but sending failed:', sendError.message);
        console.log('');
      }
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('');
    }
  }

  console.log('❌ No working email configuration found.');
  console.log('');
  console.log('Recommendations:');
  console.log('1. If using Gmail, make sure you have an App Password set up');
  console.log('2. Check if your email provider requires specific SMTP settings');
  console.log('3. Verify your email credentials are correct');
  console.log('4. Try using a different email service (Gmail, Outlook, etc.)');
}

testEmailConfigurations().catch(console.error); 