# Email Notification Setup Guide

This guide will help you set up automatic email notifications when forms are submitted to your J.I. Heating & Cooling website.

## Option 1: Deploy Webhook Service (Recommended)

### Step 1: Deploy the Webhook Service

You can deploy the webhook service to any of these platforms:

#### A. Render.com (Free tier available)

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Set the following:
   - **Build Command**: `cd webhook-service && npm install`
   - **Start Command**: `cd webhook-service && npm start`
   - **Environment**: Node

#### B. Railway.app (Free tier available)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set the root directory to `webhook-service`

#### C. Vercel (Free tier available)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repository
3. Set the root directory to `webhook-service`

### Step 2: Configure Environment Variables

Set these environment variables in your deployment platform:

```env
PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
COMPANY_EMAIL=sam@jiheatingandcooling.org
```

### Step 3: Set Up Gmail App Password (if using Gmail)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_PASSWORD`

### Step 4: Update Supabase Triggers

1. Go to your Supabase project dashboard
2. Go to SQL Editor
3. Run this SQL (replace `YOUR_WEBHOOK_URL` with your deployed service URL):

```sql
-- Enable the pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the webhook function
CREATE OR REPLACE FUNCTION send_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSON;
  response_id BIGINT;
BEGIN
  webhook_url := 'YOUR_WEBHOOK_URL/webhook/email';

  payload := json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'record', row_to_json(NEW),
    'timestamp', NOW()
  );

  SELECT net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'User-Agent', 'Supabase-Webhook/1.0'
    ),
    body := payload::jsonb
  ) INTO response_id;

  RAISE LOG 'Webhook sent with response ID: %', response_id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error sending webhook notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_contact_email_webhook
  AFTER INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION send_email_notification();

CREATE TRIGGER trigger_service_request_email_webhook
  AFTER INSERT ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION send_email_notification();

CREATE TRIGGER trigger_emergency_request_email_webhook
  AFTER INSERT ON emergency_requests
  FOR EACH ROW
  EXECUTE FUNCTION send_email_notification();
```

## Option 2: Use Existing Backend (Alternative)

If you prefer to use your existing backend setup:

### Step 1: Update Your Backend Routes

Your existing routes in `/routes/contact.js`, `/routes/emergency.js`, and `/routes/services.js` already have email functionality. Just make sure your environment variables are set:

```env
COMPANY_EMAIL=sam@jiheatingandcooling.org
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Step 2: Deploy Your Backend

Deploy your existing backend to Render, Railway, or any other platform.

## Testing

1. Submit a test form on your website
2. Check your email inbox
3. Check the logs in your deployment platform

## Troubleshooting

### Email Not Sending

- Check your email credentials
- Verify SMTP settings
- Check deployment logs for errors

### Webhook Not Triggering

- Verify the webhook URL is correct
- Check Supabase logs for trigger errors
- Ensure pg_net extension is enabled

### Gmail Issues

- Make sure 2FA is enabled
- Use App Password, not your regular password
- Check Gmail's "Less secure app access" settings

## Email Templates

The system will send formatted emails for:

1. **Contact Form**: General inquiries
2. **Service Requests**: Quote requests with service details
3. **Emergency Requests**: Urgent HVAC issues (marked with ⚠️)

Each email includes:

- Customer information
- Form details
- Timestamp
- Professional formatting

## Support

If you need help with setup, check:

- Deployment platform documentation
- Supabase documentation
- Email provider SMTP settings
