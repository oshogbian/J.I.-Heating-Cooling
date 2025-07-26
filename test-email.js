require('dotenv').config();
const { sendEmail } = require('./backend/utils/emailService');

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Environment variables:');
  console.log('- EMAIL_HOST:', process.env.EMAIL_HOST || 'Not set');
  console.log('- EMAIL_PORT:', process.env.EMAIL_PORT || 'Not set');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
  console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');
  console.log('- COMPANY_EMAIL:', process.env.COMPANY_EMAIL || 'Not set');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Missing required email environment variables');
    console.log('Please set EMAIL_USER and EMAIL_PASSWORD in your environment');
    return;
  }

  try {
    const result = await sendEmail({
      to: process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
      subject: '🧪 Test Email - J.I. Heating and Cooling Website',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a5276;">Email Test Successful! 🎉</h2>
          <p>This is a test email from your J.I. Heating and Cooling website.</p>
          <p>If you received this email, your email configuration is working correctly.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>Host:</strong> ${process.env.EMAIL_HOST || 'Auto-detected'}</p>
            <p><strong>Port:</strong> ${process.env.EMAIL_PORT || 'Auto-detected'}</p>
            <p><strong>User:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #7f8c8d; font-size: 12px;">
            This is a test email. You can safely delete it.
          </p>
        </div>
      `,
      text: `
        Email Test Successful!
        
        This is a test email from your J.I. Heating and Cooling website.
        If you received this email, your email configuration is working correctly.
        
        Configuration Details:
        - Host: ${process.env.EMAIL_HOST || 'Auto-detected'}
        - Port: ${process.env.EMAIL_PORT || 'Auto-detected'}
        - User: ${process.env.EMAIL_USER}
        - Sent at: ${new Date().toLocaleString()}
        
        This is a test email. You can safely delete it.
      `
    });

    if (result.success) {
      console.log('✅ Email test successful!');
      console.log('Message ID:', result.messageId);
      console.log('Check your email inbox for the test message.');
    } else {
      console.error('❌ Email test failed:', result.error);
      console.log('');
      console.log('Troubleshooting tips:');
      console.log('1. Check your email credentials');
      console.log('2. Verify your SMTP settings');
      console.log('3. Try a different email provider (Gmail, Outlook, Yahoo)');
      console.log('4. Check the EMAIL-SETUP.md file for detailed instructions');
    }
  } catch (error) {
    console.error('❌ Email test failed with exception:', error.message);
    console.log('');
    console.log('Troubleshooting tips:');
    console.log('1. Check your email credentials');
    console.log('2. Verify your SMTP settings');
    console.log('3. Try a different email provider (Gmail, Outlook, Yahoo)');
    console.log('4. Check the EMAIL-SETUP.md file for detailed instructions');
  }
}

// Run the test
testEmail(); 