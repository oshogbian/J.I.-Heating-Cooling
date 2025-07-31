-- Add Invoice Tables to Existing J.I. Heating & Cooling Supabase Setup
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE INVOICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20),
  customer_address TEXT,
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP NOT NULL,
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  notes TEXT,
  payment_terms VARCHAR(50) DEFAULT 'Net 30',
  company_info JSONB,
  items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. CREATE INVOICE ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  service_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. CREATE CUSTOMERS TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(20), 
  email VARCHAR(100),
  address VARCHAR(200),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. CREATE EMERGENCY REQUESTS TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS emergency_requests (
  id SERIAL PRIMARY KEY,
  customer_info TEXT,
  email VARCHAR(100),
  phone VARCHAR(20),
  address VARCHAR(200),
  issue TEXT,
  contact_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. ADD MISSING COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add missing columns to service_requests table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE service_requests ADD COLUMN name VARCHAR(100);
        RAISE NOTICE 'Added name column to service_requests table';
    ELSE
        RAISE NOTICE 'Name column already exists in service_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE service_requests ADD COLUMN email VARCHAR(100);
        RAISE NOTICE 'Added email column to service_requests table';
    ELSE
        RAISE NOTICE 'Email column already exists in service_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE service_requests ADD COLUMN phone VARCHAR(20);
        RAISE NOTICE 'Added phone column to service_requests table';
    ELSE
        RAISE NOTICE 'Phone column already exists in service_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'address'
    ) THEN
        ALTER TABLE service_requests ADD COLUMN address VARCHAR(200);
        RAISE NOTICE 'Added address column to service_requests table';
    ELSE
        RAISE NOTICE 'Address column already exists in service_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'preferred_date'
    ) THEN
        ALTER TABLE service_requests ADD COLUMN preferred_date VARCHAR(100);
        RAISE NOTICE 'Added preferred_date column to service_requests table';
    ELSE
        RAISE NOTICE 'Preferred_date column already exists in service_requests table';
    END IF;
END $$;

-- Add missing columns to customers table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'customers' 
        AND column_name = 'message'
    ) THEN
        ALTER TABLE customers ADD COLUMN message TEXT;
        RAISE NOTICE 'Added message column to customers table';
    ELSE
        RAISE NOTICE 'Message column already exists in customers table';
    END IF;
END $$;

-- Add missing columns to emergency_requests table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'emergency_requests' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE emergency_requests ADD COLUMN email VARCHAR(100);
        RAISE NOTICE 'Added email column to emergency_requests table';
    ELSE
        RAISE NOTICE 'Email column already exists in emergency_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'emergency_requests' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE emergency_requests ADD COLUMN phone VARCHAR(20);
        RAISE NOTICE 'Added phone column to emergency_requests table';
    ELSE
        RAISE NOTICE 'Phone column already exists in emergency_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'emergency_requests' 
        AND column_name = 'address'
    ) THEN
        ALTER TABLE emergency_requests ADD COLUMN address VARCHAR(200);
        RAISE NOTICE 'Added address column to emergency_requests table';
    ELSE
        RAISE NOTICE 'Address column already exists in emergency_requests table';
    END IF;
END $$;

-- =====================================================
-- 6. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON service_requests(email);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_email ON emergency_requests(email);

-- =====================================================
-- 7. VERIFY THE COMPLETE SCHEMA
-- =====================================================
-- This shows you what your tables should look like after running this SQL
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('invoices', 'invoice_items', 'customers', 'service_requests', 'emergency_requests')
ORDER BY table_name, ordinal_position; 