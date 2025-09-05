# Supabase + Render Email Setup Guide

This guide shows how to set up automatic email notifications when forms are submitted to Supabase, using your Render backend to send the emails.

## 🎯 How It Works

1. **Customer submits form** → Data goes to Supabase
2. **Supabase database trigger** → Automatically calls your Render backend
3. **Render backend** → Sends professional email notification
4. **You receive email** → Formatted notification with all details

## 🚀 Setup Steps

### Step 1: Enable HTTP Extension in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run this command to enable HTTP requests:

```sql
-- Enable the http extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS http;
```

### Step 2: Create the Email Notification Function

Run this SQL in your Supabase SQL Editor:

```sql
-- Function to send email notifications via your Render backend
CREATE OR REPLACE FUNCTION send_form_email_notification()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT := 'https://j-i-heating-cooling-2.onrender.com/api/webhook/email';
    payload JSON;
    response http_response;
BEGIN
    -- Prepare the payload for your Render backend
    payload := json_build_object(
        'table', TG_TABLE_NAME,
        'action', TG_OP,
        'record', row_to_json(NEW)
    );
    
    -- Make HTTP request to your Render backend
    SELECT * INTO response FROM http((
        'POST',
        webhook_url,
        ARRAY[http_header('Content-Type', 'application/json')],
        'application/json',
        payload::text
    ));
    
    -- Log the response (optional)
    RAISE LOG 'Email notification sent for % on table %: Status %', TG_OP, TG_TABLE_NAME, response.status;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the insert
        RAISE LOG 'Failed to send email notification: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Step 3: Create Database Triggers

Run this SQL to create triggers for each form:

```sql
-- Create triggers for each form table
-- Contact form trigger
DROP TRIGGER IF EXISTS contact_email_trigger ON contacts;
CREATE TRIGGER contact_email_trigger
    AFTER INSERT ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION send_form_email_notification();

-- Service request trigger
DROP TRIGGER IF EXISTS service_request_email_trigger ON service_requests;
CREATE TRIGGER service_request_email_trigger
    AFTER INSERT ON service_requests
    FOR EACH ROW
    EXECUTE FUNCTION send_form_email_notification();

-- Emergency request trigger
DROP TRIGGER IF EXISTS emergency_request_email_trigger ON emergency_requests;
CREATE TRIGGER emergency_request_email_trigger
    AFTER INSERT ON emergency_requests
    FOR EACH ROW
    EXECUTE FUNCTION send_form_email_notification();
```

### Step 4: Set Up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

### Step 5: Configure Render Environment Variables

In your Render dashboard, add these environment variables:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sam@jiheatingandcooling.org
EMAIL_PASSWORD=your-16-character-app-password
COMPANY_EMAIL=sam@jiheatingandcooling.org
```

## 🧪 Testing

1. **Submit a test form** on your website
2. **Check your email** for the notification
3. **Check Render logs** to see the webhook calls

## 📊 Email Features

| Form Type | Email Subject | Features |
|-----------|---------------|----------|
| **Contact** | "New Contact Form Submission" | Customer info, message |
| **Service Request** | "New Service Request" | Service type, preferred date |
| **Emergency** | "🚨 EMERGENCY SERVICE REQUEST" | **High priority, red formatting** |

## 🔧 Troubleshooting

### Email Not Sending
- Check your Gmail App Password is correct
- Verify Render environment variables are set
- Check Render logs for errors

### Triggers Not Working
- Ensure HTTP extension is enabled in Supabase
- Check Supabase logs for trigger errors
- Verify the webhook URL is correct

### Forms Not Submitting
- Check Supabase connection
- Verify form validation
- Check browser console for errors

## 🎉 Benefits

✅ **Automatic email notifications** - No manual setup needed  
✅ **Professional email templates** - Branded and formatted  
✅ **Reliable delivery** - Uses your existing Render backend  
✅ **Error handling** - Won't break form submissions if email fails  
✅ **Scalable** - Works with any number of form submissions  

Your email notification system is now ready! Every form submission will automatically trigger an email to `sam@jiheatingandcooling.org`. 🚀
