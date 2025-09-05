-- =====================================================
-- CHECK EXISTING TABLES AND DATA
-- =====================================================

-- 1. Check all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check data in uppercase tables
SELECT 'Invoices' as table_name, COUNT(*) as row_count FROM "Invoices" 
UNION ALL
SELECT 'InvoiceItems' as table_name, COUNT(*) as row_count FROM "InvoiceItems";

-- 3. Check data in lowercase tables  
SELECT 'invoices' as table_name, COUNT(*) as row_count FROM invoices
UNION ALL
SELECT 'invoice_items' as table_name, COUNT(*) as row_count FROM invoice_items;

-- 4. Check other tables
SELECT 'contacts' as table_name, COUNT(*) as row_count FROM contacts
UNION ALL
SELECT 'customers' as table_name, COUNT(*) as row_count FROM customers
UNION ALL
SELECT 'emergency_requests' as table_name, COUNT(*) as row_count FROM emergency_requests
UNION ALL
SELECT 'service_requests' as table_name, COUNT(*) as row_count FROM service_requests;

-- 5. Sample data from each table to see what's there
SELECT 'Invoices sample:' as info, * FROM "Invoices" LIMIT 2;
SELECT 'invoices sample:' as info, * FROM invoices LIMIT 2; 