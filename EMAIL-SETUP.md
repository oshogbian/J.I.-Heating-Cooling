# Email Setup Guide for J.I. Heating and Cooling

## Current Issue
Your application is experiencing SMTP connection timeouts when trying to connect to `mail.jiheatingandcooling.com`. This guide will help you resolve this issue.

## Quick Fix Options

### Option 1: Use Gmail SMTP (Recommended for testing)
If you have a Gmail account, this is the easiest setup:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Note:** For Gmail, you need to use an "App Password" instead of your regular password. To get one:
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate a new app password for "Mail"

### Option 2: Use Outlook/Office 365
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Option 3: Use Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### Option 4: Fix your custom domain email
If you want to use `mail.jiheatingandcooling.com`, you need to:

1. **Check your DNS settings** - Make sure you have proper MX and A records
2. **Verify SMTP credentials** - Ensure the username and password are correct
3. **Check firewall settings** - Port 587 might be blocked
4. **Contact your hosting provider** - They might need to enable SMTP access

## Environment Variables for Render

Add these to your Render environment variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
COMPANY_EMAIL=your-company-email@jiheatingandcooling.com
```

## Testing Email Configuration

You can test your email setup by running:

```bash
node test-email.js
```

This will attempt to send a test email and show you detailed error messages.

## Common Issues and Solutions

### Connection Timeout
- **Cause**: Network issues, wrong host/port, or firewall blocking
- **Solution**: Try a different email provider (Gmail, Outlook, Yahoo)

### Authentication Failed
- **Cause**: Wrong username/password
- **Solution**: Double-check credentials, use app passwords for Gmail

### Port Blocked
- **Cause**: Firewall or hosting provider blocking port 587
- **Solution**: Try port 465 with secure: true, or contact your hosting provider

## Recommended Setup for Production

For a business website, we recommend:

1. **Use a reliable email service** like Gmail, Outlook, or a dedicated email service
2. **Set up proper SPF/DKIM records** to improve email deliverability
3. **Monitor email sending** to ensure notifications are working
4. **Have a backup email service** configured

## Next Steps

1. Choose an email provider from the options above
2. Update your Render environment variables
3. Test the email functionality
4. Monitor the logs to ensure emails are sending successfully

## Support

If you continue to have issues:
1. Check the Render logs for detailed error messages
2. Test with a different email provider
3. Verify all environment variables are set correctly 