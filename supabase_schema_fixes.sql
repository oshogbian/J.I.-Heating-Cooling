-- Fix for Service Requests table - add missing columns
ALTER TABLE service_requests 
ADD COLUMN name VARCHAR(100),
ADD COLUMN email VARCHAR(100),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN description TEXT;

-- Fix for Emergency Requests table - add missing columns  
ALTER TABLE emergency_requests 
ADD COLUMN email VARCHAR(100),
ADD COLUMN phone VARCHAR(20);

-- Optional: Add message column to customers table if you want to store contact form messages
-- ALTER TABLE customers ADD COLUMN message TEXT; 