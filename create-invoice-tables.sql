-- Create Invoice table (corrected version)
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

-- Create InvoiceItem table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_status ON "Invoices"("status");
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON "Invoices"("issue_date");
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON "InvoiceItems"("invoice_id");

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

-- Verify the tables and policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('Invoices', 'InvoiceItems')
ORDER BY tablename, policyname; 