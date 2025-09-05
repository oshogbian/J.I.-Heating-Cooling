-- =====================================================
-- COMPLETE DATABASE SETUP FOR J.I. HVAC WEBSITE
-- ALL TABLES FOR FORMS AND INVOICES
-- =====================================================

-- =====================================================
-- 1. CREATE INVOICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "Invoices" (
  "id" SERIAL PRIMARY KEY,
  "invoice_number" VARCHAR(255) UNIQUE NOT NULL,
  "customer_name" VARCHAR(255) NOT NULL,
  "customer_email" VARCHAR(255) NOT NULL,
  "customer_phone" VARCHAR(255),
  "customer_address" TEXT,
  "issue_date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "due_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "tax_rate" DECIMAL(5,2) DEFAULT 0,
  "tax_amount" DECIMAL(10,2) DEFAULT 0,
  "total_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "status" VARCHAR(255) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  "notes" TEXT,
  "payment_terms" VARCHAR(255) DEFAULT 'Net 30',
  "company_info" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. CREATE INVOICE ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "InvoiceItems" (
  "id" SERIAL PRIMARY KEY,
  "invoice_id" INTEGER NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
  "unit_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "service_type" VARCHAR(255),
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("invoice_id") REFERENCES "Invoices"("id") ON DELETE CASCADE
);

-- =====================================================
-- 3. CREATE CONTACTS TABLE (Contact Form)
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  service_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. CREATE SERVICE REQUESTS TABLE (Services Form)
-- =====================================================
CREATE TABLE IF NOT EXISTS service_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  service_type VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. CREATE EMERGENCY REQUESTS TABLE (Emergency Form)
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
-- 6. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_invoices_status ON "Invoices"("status");
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON "Invoices"("issue_date");
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON "InvoiceItems"("invoice_id");
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON service_requests(email);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_email ON emergency_requests(email);

-- =====================================================
-- 7. ENABLE RLS AND CREATE POLICIES FOR ALL TABLES
-- =====================================================

-- Invoices table policies
ALTER TABLE "Invoices" ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'Invoices' 
        AND policyname = 'Allow all operations for authenticated users on Invoices'
    ) THEN
        CREATE POLICY "Allow all operations for authenticated users on Invoices" ON "Invoices"
            FOR ALL USING (true);
        RAISE NOTICE 'Created policy for Invoices table';
    ELSE
        RAISE NOTICE 'Policy already exists for Invoices table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'Invoices' 
        AND policyname = 'Allow insert for anonymous users on Invoices'
    ) THEN
        CREATE POLICY "Allow insert for anonymous users on Invoices" ON "Invoices"
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created insert policy for Invoices table';
    ELSE
        RAISE NOTICE 'Insert policy already exists for Invoices table';
    END IF;
END $$;

-- InvoiceItems table policies
ALTER TABLE "InvoiceItems" ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'InvoiceItems' 
        AND policyname = 'Allow all operations for authenticated users on InvoiceItems'
    ) THEN
        CREATE POLICY "Allow all operations for authenticated users on InvoiceItems" ON "InvoiceItems"
            FOR ALL USING (true);
        RAISE NOTICE 'Created policy for InvoiceItems table';
    ELSE
        RAISE NOTICE 'Policy already exists for InvoiceItems table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'InvoiceItems' 
        AND policyname = 'Allow insert for anonymous users on InvoiceItems'
    ) THEN
        CREATE POLICY "Allow insert for anonymous users on InvoiceItems" ON "InvoiceItems"
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created insert policy for InvoiceItems table';
    ELSE
        RAISE NOTICE 'Insert policy already exists for InvoiceItems table';
    END IF;
END $$;

-- Contacts table policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Allow all operations for authenticated users on contacts'
    ) THEN
        CREATE POLICY "Allow all operations for authenticated users on contacts" ON contacts
            FOR ALL USING (true);
        RAISE NOTICE 'Created policy for contacts table';
    ELSE
        RAISE NOTICE 'Policy already exists for contacts table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Allow insert for anonymous users on contacts'
    ) THEN
        CREATE POLICY "Allow insert for anonymous users on contacts" ON contacts
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created insert policy for contacts table';
    ELSE
        RAISE NOTICE 'Insert policy already exists for contacts table';
    END IF;
END $$;

-- Service requests table policies
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_requests' 
        AND policyname = 'Allow all operations for authenticated users on service_requests'
    ) THEN
        CREATE POLICY "Allow all operations for authenticated users on service_requests" ON service_requests
            FOR ALL USING (true);
        RAISE NOTICE 'Created policy for service_requests table';
    ELSE
        RAISE NOTICE 'Policy already exists for service_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_requests' 
        AND policyname = 'Allow insert for anonymous users on service_requests'
    ) THEN
        CREATE POLICY "Allow insert for anonymous users on service_requests" ON service_requests
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created insert policy for service_requests table';
    ELSE
        RAISE NOTICE 'Insert policy already exists for service_requests table';
    END IF;
END $$;

-- Emergency requests table policies
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'emergency_requests' 
        AND policyname = 'Allow all operations for authenticated users on emergency_requests'
    ) THEN
        CREATE POLICY "Allow all operations for authenticated users on emergency_requests" ON emergency_requests
            FOR ALL USING (true);
        RAISE NOTICE 'Created policy for emergency_requests table';
    ELSE
        RAISE NOTICE 'Policy already exists for emergency_requests table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'emergency_requests' 
        AND policyname = 'Allow insert for anonymous users on emergency_requests'
    ) THEN
        CREATE POLICY "Allow insert for anonymous users on emergency_requests" ON emergency_requests
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created insert policy for emergency_requests table';
    ELSE
        RAISE NOTICE 'Insert policy already exists for emergency_requests table';
    END IF;
END $$;

-- =====================================================
-- 8. VERIFY ALL TABLES AND POLICIES WERE CREATED
-- =====================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('Invoices', 'InvoiceItems', 'contacts', 'service_requests', 'emergency_requests')
ORDER BY tablename, policyname; 