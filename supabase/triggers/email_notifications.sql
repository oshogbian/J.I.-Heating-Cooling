-- Create a function to call the email edge function
CREATE OR REPLACE FUNCTION send_form_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  table_name TEXT;
  payload JSON;
BEGIN
  -- Get the table name
  table_name := TG_TABLE_NAME;
  
  -- Create payload with table name and record data
  payload := json_build_object(
    'table', table_name,
    'record', row_to_json(NEW)
  );
  
  -- Call the edge function
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/send-form-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := payload::jsonb
    );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the insert
    RAISE LOG 'Error sending email notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER trigger_contact_email_notification
  AFTER INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION send_form_email_notification();

CREATE TRIGGER trigger_service_request_email_notification
  AFTER INSERT ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION send_form_email_notification();

CREATE TRIGGER trigger_emergency_request_email_notification
  AFTER INSERT ON emergency_requests
  FOR EACH ROW
  EXECUTE FUNCTION send_form_email_notification();

-- Alternative approach using pg_net extension (if available)
-- This is simpler and more reliable than the above approach

-- Create a simpler function using pg_net
CREATE OR REPLACE FUNCTION send_email_via_edge_function()
RETURNS TRIGGER AS $$
DECLARE
  table_name TEXT;
  payload JSON;
BEGIN
  table_name := TG_TABLE_NAME;
  
  payload := json_build_object(
    'table', table_name,
    'record', row_to_json(NEW)
  );
  
  -- Use pg_net to make the HTTP request
  PERFORM
    net.http_post(
      url := 'https://ljsthabxoycpgizmpavx.supabase.co/functions/v1/send-form-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc3RoYWJ4b3ljcGdpem1wYXZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyNjY4NSwiZXhwIjoyMDY4OTAyNjg1fQ.lFc_Zw631ki369yfucku2OZF0pcZ4RzyozImaXcnDOo'
      ),
      body := payload::jsonb
    );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error sending email notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_contact_email_notification ON contacts;
DROP TRIGGER IF EXISTS trigger_service_request_email_notification ON service_requests;
DROP TRIGGER IF EXISTS trigger_emergency_request_email_notification ON emergency_requests;

-- Create new triggers using the simpler function
CREATE TRIGGER trigger_contact_email_notification
  AFTER INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION send_email_via_edge_function();

CREATE TRIGGER trigger_service_request_email_notification
  AFTER INSERT ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION send_email_via_edge_function();

CREATE TRIGGER trigger_emergency_request_email_notification
  AFTER INSERT ON emergency_requests
  FOR EACH ROW
  EXECUTE FUNCTION send_email_via_edge_function();
