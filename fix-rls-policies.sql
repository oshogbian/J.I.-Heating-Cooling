-- Fix RLS Policies for J.I. HVAC Website
-- This script adds the missing RLS policies for emergency_requests and service_requests tables

-- Enable RLS on emergency_requests table
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for authenticated users (admin)
CREATE POLICY "Allow all operations for authenticated users on emergency_requests" ON emergency_requests
    FOR ALL USING (true);

-- Policy to allow insert for anonymous users (emergency form submissions)
CREATE POLICY "Allow insert for anonymous users on emergency_requests" ON emergency_requests
    FOR INSERT WITH CHECK (true);

-- Enable RLS on service_requests table
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for authenticated users (admin)
CREATE POLICY "Allow all operations for authenticated users on service_requests" ON service_requests
    FOR ALL USING (true);

-- Policy to allow insert for anonymous users (service form submissions)
CREATE POLICY "Allow insert for anonymous users on service_requests" ON service_requests
    FOR INSERT WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('emergency_requests', 'service_requests', 'contacts')
ORDER BY tablename, policyname; 