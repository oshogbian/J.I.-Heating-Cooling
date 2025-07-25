require('dotenv').config();
const { sendEmail, formatContactEmail } = require('./utils/emailService');

// Test data
const testData = {
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '555-123-4567',
  address: '123 Main St, Anytown USA',
  message: 'This is a test message to verify email functionality.'
};

async function testEmail() {
  console.log('======= EMAIL TEST SCRIPT =======');
  console.log('Testing email with the following configuration:');
  console.log(`- EMAIL_HOST: ${process.env.EMAIL_HOST || 'auto (will detect)'}`);
  console.log(`- EMAIL_PORT: ${process.env.EMAIL_PORT}`);
  console.log(`- EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`- COMPANY_EMAIL: ${process.env.COMPANY_EMAIL}`);
  console.log('\nFormatting test email...');
  
  const { html, text } = formatContactEmail(testData);
  
  console.log('\nSending test email...');
  
  try {
    const result = await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: 'TEST - Website Form Submission',
      html,
      text
    });
    
    if (result.success) {
      console.log('\n✅ SUCCESS: Email sent successfully!');
      console.log(`Message ID: ${result.messageId}`);
      console.log('\nIf you don\'t receive the email, please check:');
      console.log('1. Your spam/junk folder');
      console.log('2. That your email password is correct');
      console.log('3. That your email provider allows app access');
    } else {
      console.log('\n❌ ERROR: Email could not be sent');
      console.log(`Error: ${result.error}`);
      
      if (result.error.includes('authentication')) {
        console.log('\nThis appears to be an authentication issue. Please check:');
        console.log('1. Your email password is correct in the .env file');
        console.log('2. For Gmail accounts, make sure you\'re using an App Password');
        console.log('   (Go to Google Account > Security > App Passwords)');
      }
      
      if (result.error.includes('connect')) {
        console.log('\nThis appears to be a connection issue. Please check:');
        console.log('1. The EMAIL_HOST setting in your .env file');
        console.log('2. The EMAIL_PORT setting in your .env file');
        console.log('3. Your internet connection');
      }
    }
  } catch (error) {
    console.log('\n❌ ERROR: Exception occurred');
    console.log(error);
  }
  
  console.log('\n======= TEST COMPLETE =======');
}

testEmail();
