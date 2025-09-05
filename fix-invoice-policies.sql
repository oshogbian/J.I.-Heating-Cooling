-- Enable RLS on Invoices table
ALTER TABLE "Invoices" ENABLE ROW LEVEL SECURITY;

-- Create policies for Invoices table
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

-- Enable RLS on InvoiceItems table
ALTER TABLE "InvoiceItems" ENABLE ROW LEVEL SECURITY;

-- Create policies for InvoiceItems table
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

-- Also add policies for the existing tables you mentioned
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

-- Enable RLS on service_requests table
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

-- Verify all policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('emergency_requests', 'service_requests', 'Invoices', 'InvoiceItems')
ORDER BY tablename, policyname; 