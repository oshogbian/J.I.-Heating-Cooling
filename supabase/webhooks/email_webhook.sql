-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send email notifications via webhook
CREATE OR REPLACE FUNCTION send_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSON;
  response_id BIGINT;
BEGIN
  -- Set your webhook URL (you'll need to deploy this to a service like Render, Vercel, or Railway)
  webhook_url := 'https://your-webhook-service.com/webhook/email';
  
  -- Create the payload
  payload := json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'record', row_to_json(NEW),
    'timestamp', NOW()
  );
  
  -- Send the webhook request
  SELECT net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'User-Agent', 'Supabase-Webhook/1.0'
    ),
    body := payload::jsonb
  ) INTO response_id;
  
  -- Log the response ID for debugging
  RAISE LOG 'Webhook sent with response ID: %', response_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the insert
    RAISE LOG 'Error sending webhook notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
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
