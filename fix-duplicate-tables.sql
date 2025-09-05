-- =====================================================
-- FIX DUPLICATE TABLES ISSUE
-- =====================================================

-- Step 1: Check which tables have data
-- Run this first to see what data exists in each table
SELECT 'Invoices' as table_name, COUNT(*) as row_count FROM "Invoices" 
UNION ALL
SELECT 'invoices' as table_name, COUNT(*) as row_count FROM invoices
UNION ALL
SELECT 'InvoiceItems' as table_name, COUNT(*) as row_count FROM "InvoiceItems"
UNION ALL
SELECT 'invoice_items' as table_name, COUNT(*) as row_count FROM invoice_items;

-- Step 2: If lowercase tables have data, migrate it to uppercase tables
-- (Only run this if you want to keep data from lowercase tables)

-- Migrate invoices data (if lowercase has data)
INSERT INTO "Invoices" (
  invoice_number, customer_name, customer_email, customer_phone, 
  customer_address, issue_date, due_date, subtotal, tax_rate, 
  tax_amount, total_amount, status, notes, payment_terms, 
  company_info, "createdAt", "updatedAt"
)
SELECT 
  invoice_number, customer_name, customer_email, customer_phone,
  customer_address, issue_date, due_date, subtotal, tax_rate,
  tax_amount, total_amount, status, notes, payment_terms,
  company_info, created_at, updated_at
FROM invoices 
WHERE NOT EXISTS (
  SELECT 1 FROM "Invoices" WHERE "Invoices".invoice_number = invoices.invoice_number
);

-- Migrate invoice_items data (if lowercase has data)
INSERT INTO "InvoiceItems" (
  invoice_id, description, quantity, unit_price, total, 
  service_type, notes, "createdAt", "updatedAt"
)
SELECT 
  ii.invoice_id, ii.description, ii.quantity, ii.unit_price, ii.total,
  ii.service_type, ii.notes, ii.created_at, ii.updated_at
FROM invoice_items ii
JOIN invoices i ON ii.invoice_id = i.id
JOIN "Invoices" ui ON ui.invoice_number = i.invoice_number
WHERE NOT EXISTS (
  SELECT 1 FROM "InvoiceItems" WHERE "InvoiceItems".invoice_id = ui.id
);

-- Step 3: Drop the lowercase tables (after confirming data migration)
-- WARNING: Only run this after confirming data is migrated!

-- DROP TABLE IF EXISTS invoice_items;
-- DROP TABLE IF EXISTS invoices;

-- Step 4: Verify the correct tables exist and have data
SELECT 'Invoices' as table_name, COUNT(*) as row_count FROM "Invoices";
SELECT 'InvoiceItems' as table_name, COUNT(*) as row_count FROM "InvoiceItems";

-- Step 5: Check RLS policies on correct tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('Invoices', 'InvoiceItems')
ORDER BY tablename, policyname; 