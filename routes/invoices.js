const express = require('express');
const router = express.Router();
const { requireAuth, activeSessions } = require('./auth');

// Initialize Supabase
let supabase = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('Supabase connected for invoice storage');
  } else {
    console.warn('Supabase not configured, invoices will be stored in memory only');
  }
} catch (error) {
  console.warn('Supabase not available, using in-memory storage');
}

// Fallback in-memory storage
let invoices = [];

// Apply authentication middleware to all invoice routes except PDF
router.use((req, res, next) => {
  if (req.path.endsWith('/pdf')) {
    return next(); // Skip auth for PDF route (handled separately)
  }
  return requireAuth(req, res, next);
});

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  if (supabase) {
    // Get count from Supabase
    const startOfMonth = new Date(year, date.getMonth(), 1);
    const endOfMonth = new Date(year, date.getMonth() + 1, 0);
    
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString());
    
    if (error) {
      console.error('Error getting invoice count:', error);
      return `INV-${year}${month}-${String(Date.now()).slice(-3)}`;
    }
    
    return `INV-${year}${month}-${String((count || 0) + 1).padStart(3, '0')}`;
  } else {
    // Fallback to in-memory count
    const startOfMonth = new Date(year, date.getMonth(), 1);
    const endOfMonth = new Date(year, date.getMonth() + 1, 0);
    
    const count = invoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      return invDate >= startOfMonth && invDate <= endOfMonth;
    }).length;
    
    return `INV-${year}${month}-${String(count + 1).padStart(3, '0')}`;
  }
};

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      due_date,
      items,
      tax_rate = 0,
      notes,
      payment_terms = 'Net 30',
      company_info
    } = req.body;

    // Generate invoice number
    const invoice_number = await generateInvoiceNumber();

    // Calculate totals
    let subtotal = 0;
    items.forEach(item => {
      subtotal += parseFloat(item.quantity) * parseFloat(item.unit_price);
    });

    const tax_amount = subtotal * (tax_rate / 100);
    const total_amount = subtotal + tax_amount;

    if (supabase) {
      // Save to Supabase
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          invoice_number,
          customer_id,
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          due_date: new Date(due_date).toISOString(),
          subtotal,
          tax_rate,
          tax_amount,
          total_amount,
          notes,
          payment_terms,
          company_info,
          items,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.json({
        success: true,
        message: 'Invoice created successfully',
        invoice: data
      });
    } else {
      // Fallback to in-memory storage
      const invoice = {
        id: Date.now(),
        invoice_number,
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        due_date: new Date(due_date),
        subtotal,
        tax_rate,
        tax_amount,
        total_amount,
        notes,
        payment_terms,
        company_info,
        items,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      invoices.push(invoice);

      res.json({
        success: true,
        message: 'Invoice created successfully',
        invoice: invoice
      });
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create invoice'
    });
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      // Get from Supabase
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.json({
        success: true,
        invoices: data || []
      });
    } else {
      // Fallback to in-memory storage
      res.json({
        success: true,
        invoices: invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      });
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoices'
    });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    if (supabase) {
      // Get from Supabase
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        invoice: data
      });
    } else {
      // Fallback to in-memory storage
      const invoice = invoices.find(inv => inv.id == req.params.id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        invoice
      });
    }
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoice'
    });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      due_date,
      items,
      tax_rate,
      notes,
      payment_terms,
      company_info,
      status
    } = req.body;

    if (supabase) {
      // Update in Supabase
      const updateData = {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        due_date: due_date ? new Date(due_date).toISOString() : undefined,
        tax_rate,
        notes,
        payment_terms,
        company_info,
        status,
        items,
        updated_at: new Date().toISOString()
      };

      // Recalculate totals if items provided
      if (items) {
        let subtotal = 0;
        items.forEach(item => {
          subtotal += parseFloat(item.quantity) * parseFloat(item.unit_price);
        });

        const tax_amount = subtotal * (tax_rate / 100);
        const total_amount = subtotal + tax_amount;

        updateData.subtotal = subtotal;
        updateData.tax_amount = tax_amount;
        updateData.total_amount = total_amount;
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', req.params.id);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.json({
        success: true,
        message: 'Invoice updated successfully'
      });
    } else {
      // Fallback to in-memory storage
      const index = invoices.findIndex(inv => inv.id == req.params.id);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      // Update invoice
      invoices[index] = {
        ...invoices[index],
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        due_date: due_date ? new Date(due_date) : invoices[index].due_date,
        tax_rate,
        notes,
        payment_terms,
        company_info,
        status,
        items,
        updatedAt: new Date()
      };

      // Recalculate totals if items provided
      if (items) {
        let subtotal = 0;
        items.forEach(item => {
          subtotal += parseFloat(item.quantity) * parseFloat(item.unit_price);
        });

        const tax_amount = subtotal * (tax_rate / 100);
        const total_amount = subtotal + tax_amount;

        invoices[index].subtotal = subtotal;
        invoices[index].tax_amount = tax_amount;
        invoices[index].total_amount = total_amount;
      }

      res.json({
        success: true,
        message: 'Invoice updated successfully'
      });
    }
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update invoice'
    });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    if (supabase) {
      // Delete from Supabase
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } else {
      // Fallback to in-memory storage
      const index = invoices.findIndex(inv => inv.id == req.params.id);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      // Delete invoice
      invoices.splice(index, 1);

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete invoice'
    });
  }
});

// Generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    // Check authentication for PDF download
    const sessionId = req.query.token || req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId || !activeSessions.has(sessionId)) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    let invoice;
    if (supabase) {
      // Get from Supabase
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }
      invoice = data;
    } else {
      // Fallback to in-memory storage
      invoice = invoices.find(inv => inv.id == req.params.id);
    }

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    // Import PDFKit for PDF generation
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const path = require('path');

    // Create PDF with better margins
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4'
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Define colors
    const primaryColor = '#183153';
    const secondaryColor = '#ff9800';
    const lightGray = '#f8f9fa';

    // Add logo if available
    const logoPath = path.join(__dirname, '../frontend/public/logo.png');
    const altLogoPath = path.join(process.cwd(), 'frontend/public/logo.png');
    
    let logoAdded = false;
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, 40, 40, { width: 80, height: 80 });
        logoAdded = true;
        console.log('Logo added from relative path');
      } catch (error) {
        console.log('Logo not added from relative path:', error.message);
      }
    }
    
    if (!logoAdded && fs.existsSync(altLogoPath)) {
      try {
        doc.image(altLogoPath, 40, 40, { width: 80, height: 80 });
        logoAdded = true;
        console.log('Logo added from absolute path');
      } catch (error) {
        console.log('Logo not added from absolute path:', error.message);
      }
    }
    
    if (!logoAdded) {
      console.log('Logo file not found at either path');
    }

    // Create a professional PDF that matches the view version exactly
    
    // Header with gradient background (simulated with colored rectangles)
    const headerHeight = 120;
    doc.rect(0, 0, 595, headerHeight).fill(primaryColor);
    
    // Logo in header
    if (logoAdded) {
      doc.image(logoPath, 40, 30, { width: 50, height: 50 });
    }
    
    // INVOICE title in header
    doc.fontSize(36).font('Helvetica-Bold').fillColor('#fff').text('INVOICE', 200, 40);
    doc.fontSize(16).font('Helvetica').fillColor('#fff').text(`#${invoice.invoice_number}`, 200, 85);
    
    // Status badge removed as requested
    
    // Content area
    const contentY = headerHeight + 40;
    
    // Two-column layout for company and customer info
    const leftColumnX = 40;
    const rightColumnX = 350;
    
    // Left column - From section
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('From', leftColumnX, contentY);
    doc.rect(leftColumnX, contentY + 20, 280, 80).fillAndStroke('#f8f9fa', '#e0e0e0');
    
    const companyInfo = invoice.company_info || {
      name: 'J.I. Heating & Cooling',
      address: 'Serving the GTA',
      phone: '+1 416 997 9123',
      email: 'sam@jiheatingandcooling.org'
    };
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text(companyInfo.name, leftColumnX + 15, contentY + 35);
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(companyInfo.address, leftColumnX + 15, contentY + 55);
    doc.text(`Phone: ${companyInfo.phone}`, leftColumnX + 15, contentY + 70);
    doc.text(`Email: ${companyInfo.email}`, leftColumnX + 15, contentY + 85);
    
    // Right column - Bill To section
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('Bill To', rightColumnX, contentY);
    doc.rect(rightColumnX, contentY + 20, 280, 80).fillAndStroke('#f8f9fa', '#e0e0e0');
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text(invoice.customer_name, rightColumnX + 15, contentY + 35);
    if (invoice.customer_email) doc.fontSize(11).font('Helvetica').fillColor('#666').text(invoice.customer_email, rightColumnX + 15, contentY + 55);
    if (invoice.customer_phone) doc.text(invoice.customer_phone, rightColumnX + 15, contentY + 70);
    if (invoice.customer_address) doc.text(invoice.customer_address, rightColumnX + 15, contentY + 85);
    
    // Invoice details section
    const detailsY = contentY + 140;
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('Invoice Details', leftColumnX, detailsY);
    
    // Three-column layout for invoice details
    const detailCol1X = leftColumnX;
    const detailCol2X = leftColumnX + 180;
    const detailCol3X = leftColumnX + 360;
    
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Invoice Date', detailCol1X, detailsY + 25);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text(new Date(invoice.created_at || invoice.createdAt || Date.now()).toLocaleDateString(), detailCol1X, detailsY + 40);
    
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Due Date', detailCol2X, detailsY + 25);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text(new Date(invoice.due_date).toLocaleDateString(), detailCol2X, detailsY + 40);
    
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Payment Terms', detailCol3X, detailsY + 25);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text(invoice.payment_terms || 'Net 30', detailCol3X, detailsY + 40);
    
    // Items section - Fixed positioning
    const itemsY = detailsY + 80;
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('Items', leftColumnX, itemsY);
    
    // Items table with professional styling - Fixed positioning
    const tableStartY = itemsY + 30;
    const tableWidth = 520;
    const col1Width = 250; // Description
    const col2Width = 60;  // Quantity
    const col3Width = 80;  // Unit Price
    const col4Width = 80;  // Total
    
    // Table header with gradient background
    doc.rect(leftColumnX, tableStartY, tableWidth, 30).fillAndStroke('#f8f9fa', '#dee2e6');
    doc.fontSize(11).font('Helvetica-Bold').fillColor(primaryColor).text('Description', leftColumnX + 10, tableStartY + 10);
    doc.text('Qty', leftColumnX + col1Width, tableStartY + 10);
    doc.text('Unit Price', leftColumnX + col1Width + col2Width, tableStartY + 10);
    doc.text('Total', leftColumnX + col1Width + col2Width + col3Width, tableStartY + 10);
    
    // Items rows
    let tableY = tableStartY + 30;
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    
    console.log('Invoice items:', invoice.items);
    if (invoice.items && Array.isArray(invoice.items)) {
      invoice.items.forEach((item, index) => {
        console.log('Processing item:', item);
        const rowHeight = 25;
        const bgColor = index % 2 === 0 ? '#fff' : '#fafafa';
        
        // Row background
        doc.rect(leftColumnX, tableY, tableWidth, rowHeight).fillAndStroke(bgColor, '#f0f0f0');
        
        // Item details with proper alignment and debugging
        const description = item.description || '';
        const quantity = (item.quantity || 0).toString();
        const unitPrice = `$${parseFloat(item.unit_price || 0).toFixed(2)}`;
        const total = `$${(parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)).toFixed(2)}`;
        
        console.log('Rendering item:', { description, quantity, unitPrice, total });
        console.log('Table position:', { tableY, leftColumnX, col1Width });
        
        // Ensure text is within page bounds
        const maxWidth = 595 - 40; // Page width minus margins
        if (tableWidth <= maxWidth) {
          doc.text(description, leftColumnX + 10, tableY + 8);
          doc.text(quantity, leftColumnX + col1Width, tableY + 8);
          doc.text(unitPrice, leftColumnX + col1Width + col2Width, tableY + 8);
          doc.text(total, leftColumnX + col1Width + col2Width + col3Width, tableY + 8);
        } else {
          console.log('Table too wide, adjusting columns');
          // Fallback with smaller columns
          doc.text(description, leftColumnX + 10, tableY + 8);
          doc.text(quantity, leftColumnX + 200, tableY + 8);
          doc.text(unitPrice, leftColumnX + 250, tableY + 8);
          doc.text(total, leftColumnX + 350, tableY + 8);
        }
        
        tableY += rowHeight;
      });
    } else {
      console.log('Items not found or not an array:', invoice.items);
    }
    
    // Summary section
    const summaryY = tableY + 30;
    const summaryX = leftColumnX + 300;
    const summaryWidth = 220;
    
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('Summary', summaryX, summaryY);
    doc.rect(summaryX, summaryY + 20, summaryWidth, 100).fillAndStroke('#f8f9fa', '#e0e0e0');
    
    // Summary calculations
    const summaryContentY = summaryY + 35;
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('Subtotal:', summaryX + 15, summaryContentY);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text(`$${parseFloat(invoice.subtotal || 0).toFixed(2)}`, summaryX + 120, summaryContentY);
    
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(`Tax (${invoice.tax_rate || 0}%):`, summaryX + 15, summaryContentY + 20);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text(`$${parseFloat(invoice.tax_amount || 0).toFixed(2)}`, summaryX + 120, summaryContentY + 20);
    
    // Total with emphasis
    doc.fontSize(13).font('Helvetica-Bold').fillColor(primaryColor).text('Total:', summaryX + 15, summaryContentY + 50);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(primaryColor).text(`$${parseFloat(invoice.total_amount || 0).toFixed(2)}`, summaryX + 120, summaryContentY + 50);
    
    // Notes section (if exists)
    if (invoice.notes) {
      const notesY = summaryY + 120;
      doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('Notes', leftColumnX, notesY);
      doc.rect(leftColumnX, notesY + 20, 280, 80).fillAndStroke('#f8f9fa', '#e0e0e0');
      doc.fontSize(11).font('Helvetica').fillColor('#333').text(invoice.notes, leftColumnX + 15, notesY + 35);
    }
    
    // Footer
    const footerY = 750;
    doc.fontSize(10).font('Helvetica').fillColor('#999').text('Thank you for your business!', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF'
    });
  }
});

module.exports = router; 