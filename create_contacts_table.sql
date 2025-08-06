-- =====================================================
-- CREATE CONTACTS TABLE FOR J.I. HVAC WEBSITE
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
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- =====================================================
-- ADD RLS (Row Level Security) POLICIES
-- =====================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for authenticated users (admin)
CREATE POLICY "Allow all operations for authenticated users" ON contacts
    FOR ALL USING (true);

-- Policy to allow insert for anonymous users (contact form submissions)
CREATE POLICY "Allow insert for anonymous users" ON contacts
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- ADD COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE contacts IS 'Contact form submissions from the website';
COMMENT ON COLUMN contacts.name IS 'Customer name';
COMMENT ON COLUMN contacts.email IS 'Customer email address';
COMMENT ON COLUMN contacts.phone IS 'Customer phone number (optional)';
COMMENT ON COLUMN contacts.message IS 'Customer message';
COMMENT ON COLUMN contacts.service_type IS 'Type of service requested';
COMMENT ON COLUMN contacts.created_at IS 'Timestamp when contact was submitted';
COMMENT ON COLUMN contacts.updated_at IS 'Timestamp when contact was last updated'; 