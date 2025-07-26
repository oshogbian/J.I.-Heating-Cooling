-- Fix for missing 'description' column in service_requests table
-- Run this in your Supabase SQL Editor to resolve the PGRST204 error

-- Check if the column already exists to avoid errors
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE service_requests ADD COLUMN description TEXT;
        RAISE NOTICE 'Added description column to service_requests table';
    ELSE
        RAISE NOTICE 'Description column already exists in service_requests table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'service_requests' 
AND column_name = 'description'; 