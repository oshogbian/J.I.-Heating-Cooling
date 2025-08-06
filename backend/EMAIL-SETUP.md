# Email Notification Setup for J.I. Heating and Cooling

This guide will help you set up email notifications for form submissions on the J.I. Heating and Cooling website.

## Configuration

### 1. Email Password Setup

You need to update the `.env` file with the correct email password:

```
EMAIL_PASSWORD=your_actual_password_here
```

#### For Gmail Accounts:
If using a Gmail account, you'll need to use an App Password, not your regular password:

1. Go to your Google Account (https://myaccount.google.com/)
2. Select "Security" from the menu
3. Under "Signing in to Google," select "2-Step Verification" (enable it if not already enabled)
4. At the bottom, select "App passwords"
5. Select "Mail" as the app and "Other" as the device (name it "J.I. Heating Website")
6. Click "Generate" and copy the 16-character password
7. Paste this password in your `.env` file

#### For Microsoft Accounts (Outlook, Hotmail, etc.):
Similar process - you may need to create an app password in your Microsoft account security settings.

### 2. Email Provider Configuration

The system will try to auto-detect the correct email server settings based on the email domain, but you can also set them manually:

For business emails (like sam@jiheatingandcooling.org), common settings are:

```
EMAIL_HOST=mail.jiheatingandcooling.com
EMAIL_PORT=587
```

If auto-detection doesn't work, you might need to contact your email/hosting provider for the correct SMTP settings.

## Testing the Email Setup

1. Run the test script to verify your email configuration:

```bash
node test-email.js
```

2. Check the email account (sam@jiheatingandcooling.org) to confirm receipt of the test email.
3. If you don't receive the email, check your spam/junk folder.

## Troubleshooting

### Common Issues:

1. **Authentication Failed**: Check that your password is correct. For Gmail accounts, make sure you're using an App Password.

2. **Connection Error**: Verify the EMAIL_HOST and EMAIL_PORT settings. Your email provider or server might be blocking outgoing SMTP connections.

3. **Email Not Received**: Check spam/junk folders. Some email providers might be filtering the automated emails.

### Email Providers and Their SMTP Settings:

- **Gmail**:
  - EMAIL_HOST=smtp.gmail.com
  - EMAIL_PORT=587

- **Outlook/Office 365**:
  - EMAIL_HOST=smtp.office365.com
  - EMAIL_PORT=587

- **GoDaddy Web Hosting**:
  - EMAIL_HOST=smtpout.secureserver.net
  - EMAIL_PORT=587

- **Namecheap Email Hosting**:
  - EMAIL_HOST=mail.privateemail.com
  - EMAIL_PORT=587

- **Bluehost**:
  - EMAIL_HOST=mail.yourdomain.com
  - EMAIL_PORT=587

## Support

If you continue to have issues, you may need to:

1. Contact your email provider or hosting company for the correct SMTP settings
2. Check if your email provider allows third-party apps or SMTP access
3. Consider using a dedicated email service like SendGrid or Mailgun for more reliable delivery

## Alternative: Use a Transactional Email Service

If you continue to have trouble with your regular email provider, consider using a service specifically designed for sending automated emails:

1. **SendGrid** (www.sendgrid.com) - Has a free tier for up to 100 emails per day
2. **Mailgun** (www.mailgun.com) - Has a free tier for up to 5,000 emails per month
3. **Amazon SES** (aws.amazon.com/ses/) - Very low cost, high deliverability

These services provide reliable delivery and are designed for automated emails from websites.
