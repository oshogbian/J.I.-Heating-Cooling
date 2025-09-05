-- =====================================================
-- CHECK WHICH TABLES ACTUALLY EXIST
-- =====================================================

-- List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if specific tables exist and their row counts
SELECT 
  'Invoices' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Invoices') 
    THEN (SELECT COUNT(*) FROM "Invoices")::text 
    ELSE 'DOES NOT EXIST' 
  END as row_count

UNION ALL

SELECT 
  'InvoiceItems' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'InvoiceItems') 
    THEN (SELECT COUNT(*) FROM "InvoiceItems")::text 
    ELSE 'DOES NOT EXIST' 
  END as row_count

UNION ALL

SELECT 
  'invoices' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') 
    THEN (SELECT COUNT(*) FROM invoices)::text 
    ELSE 'DOES NOT EXIST' 
  END as row_count

UNION ALL

SELECT 
  'invoice_items' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoice_items') 
    THEN (SELECT COUNT(*) FROM invoice_items)::text 
    ELSE 'DOES NOT EXIST' 
  END as row_count; 