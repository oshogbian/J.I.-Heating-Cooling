-- Supabase Database Triggers for Email Notifications
-- This will call your Render backend whenever forms are submitted

-- Enable the http extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS http;

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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION send_form_email_notification() TO anon, authenticated;
