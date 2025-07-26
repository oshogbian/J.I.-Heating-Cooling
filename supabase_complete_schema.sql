-- Complete Supabase Database Schema Fixes for J.I. Heating and Cooling
-- Run this in your Supabase SQL Editor to fix all form issues

-- =====================================================
-- 1. FIX SERVICE REQUESTS TABLE
-- =====================================================
-- Add missing columns to service_requests table
ALTER TABLE service_requests 
ADD COLUMN name VARCHAR(100),
ADD COLUMN email VARCHAR(100),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address VARCHAR(200),
ADD COLUMN preferred_date VARCHAR(100),
ADD COLUMN description TEXT;

-- =====================================================
-- 2. FIX EMERGENCY REQUESTS TABLE  
-- =====================================================
-- Add missing columns to emergency_requests table
ALTER TABLE emergency_requests 
ADD COLUMN email VARCHAR(100),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address VARCHAR(200);

-- =====================================================
-- 3. FIX CUSTOMERS TABLE (Optional)
-- =====================================================
-- Add message column to customers table for contact form messages
ALTER TABLE customers ADD COLUMN message TEXT;

-- =====================================================
-- 4. VERIFY THE COMPLETE SCHEMA
-- =====================================================
-- This shows you what your tables should look like after the fixes

-- Customers table structure:
-- CREATE TABLE customers (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(100),
--   phone VARCHAR(20), 
--   email VARCHAR(100),
--   address VARCHAR(200),
--   message TEXT
-- );

-- Service Requests table structure:
-- CREATE TABLE service_requests (
--   id SERIAL PRIMARY KEY,
--   customer_id INTEGER REFERENCES customers(id),
--   name VARCHAR(100),
--   email VARCHAR(100),
--   phone VARCHAR(20),
--   address VARCHAR(200),
--   service_type VARCHAR(50),
--   preferred_date VARCHAR(100),
--   description TEXT,
--   message TEXT,
--   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Emergency Requests table structure:
-- CREATE TABLE emergency_requests (
--   id SERIAL PRIMARY KEY,
--   customer_info TEXT,
--   email VARCHAR(100),
--   phone VARCHAR(20),
--   address VARCHAR(200),
--   issue TEXT,
--   contact_method VARCHAR(100),
--   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- =====================================================
-- 5. TEST QUERIES (Optional - run these to verify)
-- =====================================================
-- Test that the columns were added successfully
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'service_requests' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'emergency_requests' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position; 