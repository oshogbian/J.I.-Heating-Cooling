const express = require('express');
const router = express.Router();
const { Invoice, InvoiceItem } = require('../models/associations');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { requireAuth, activeSessions } = require('./auth');

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
  
  // Get count of invoices for this month
  const startOfMonth = new Date(year, date.getMonth(), 1);
  const endOfMonth = new Date(year, date.getMonth() + 1, 0);
  
  const count = await Invoice.count({
    where: {
      createdAt: {
        [require('sequelize').Op.between]: [startOfMonth, endOfMonth]
      }
    }
  });
  
  return `INV-${year}${month}-${String(count + 1).padStart(3, '0')}`;
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

    // Create invoice
    const invoice = await Invoice.create({
      invoice_number,
      customer_id: customer_id || 1, // Default customer ID if not provided
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
      company_info
    });

    // Create invoice items
    for (const item of items) {
      await InvoiceItem.create({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
        service_type: item.service_type,
        notes: item.notes
      });
    }

    res.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: invoice
    });
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
    const invoices = await Invoice.findAll({
      include: [{ model: InvoiceItem, as: 'InvoiceItems' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      invoices
    });
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
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [{ model: InvoiceItem, as: 'InvoiceItems' }]
    });

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
    const invoice = await Invoice.findByPk(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

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

    // Update invoice
    await invoice.update({
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      due_date: due_date ? new Date(due_date) : invoice.due_date,
      tax_rate,
      notes,
      payment_terms,
      company_info,
      status
    });

    // Update items if provided
    if (items) {
      // Delete existing items
      await InvoiceItem.destroy({
        where: { invoice_id: invoice.id }
      });

      // Create new items
      for (const item of items) {
        await InvoiceItem.create({
          invoice_id: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.quantity * item.unit_price,
          service_type: item.service_type,
          notes: item.notes
        });
      }

      // Recalculate totals
      let subtotal = 0;
      items.forEach(item => {
        subtotal += parseFloat(item.quantity) * parseFloat(item.unit_price);
      });

      const tax_amount = subtotal * (tax_rate / 100);
      const total_amount = subtotal + tax_amount;

      await invoice.update({
        subtotal,
        tax_amount,
        total_amount
      });
    }

    res.json({
      success: true,
      message: 'Invoice updated successfully'
    });
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
    const invoice = await Invoice.findByPk(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    // Delete associated items
    await InvoiceItem.destroy({
      where: { invoice_id: invoice.id }
    });

    // Delete invoice
    await invoice.destroy();

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
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
    try {
      invoice = await Invoice.findByPk(req.params.id, {
        include: [{ model: InvoiceItem, as: 'InvoiceItems' }]
      });
    } catch (dbError) {
      console.error('Database error when fetching invoice:', dbError.message);
      console.log('Creating mock invoice for testing...');
      
      // Create a mock invoice for testing when database is not available
      invoice = {
        id: req.params.id,
        invoice_number: 'INV-2025001',
        customer_name: 'John Doe',
        customer_email: 'sam@jiheatingandcooling.org',
        customer_phone: '+1 416 555 0123',
        customer_address: '123 Main Street, Toronto, ON M5V 2H1',
        issue_date: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: 850.00,
        tax_rate: 13.00,
        tax_amount: 110.50,
        total_amount: 960.50,
        status: 'draft',
        notes: 'Thank you for choosing J.I. Heating & Cooling for your HVAC needs.',
        payment_terms: 'Net 30',
        InvoiceItems: [
          {
            id: 1,
            description: 'HVAC System Maintenance',
            quantity: 1,
            unit_price: 150.00,
            total: 150.00,
            service_type: 'Maintenance'
          },
          {
            id: 2,
            description: 'Air Filter Replacement',
            quantity: 2,
            unit_price: 25.00,
            total: 50.00,
            service_type: 'Parts'
          },
          {
            id: 3,
            description: 'Duct Cleaning Service',
            quantity: 1,
            unit_price: 650.00,
            total: 650.00,
            service_type: 'Cleaning'
          }
        ]
      };
    }

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    // Debug: Log invoice structure
    console.log('Invoice data structure:', {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      customer_name: invoice.customer_name,
      hasItems: !!invoice.InvoiceItems,
      hasItemsAlt: !!invoice.items,
      itemsCount: invoice.InvoiceItems?.length || invoice.items?.length || 0,
      itemsStructure: invoice.InvoiceItems ? invoice.InvoiceItems[0] : invoice.items ? invoice.items[0] : null
    });

    // Create PDF with professional layout
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Define professional colors
    const primaryColor = '#183153';
    const secondaryColor = '#ff9800';
    const accentColor = '#28a745';
    const lightGray = '#f8f9fa';
    const borderColor = '#dee2e6';

    // Add professional header with gradient effect
    doc.rect(0, 0, 595, 120).fill(primaryColor);
    
    // Add logo if available
    const logoPath = path.join(__dirname, '../../frontend/public/logo.png');
    const altLogoPath = path.join(process.cwd(), 'frontend/public/logo.png');
    
    let logoAdded = false;
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, 50, 30, { width: 60, height: 60 });
        logoAdded = true;
      } catch (error) {
        console.log('Logo not added from relative path:', error.message);
      }
    }
    
    if (!logoAdded && fs.existsSync(altLogoPath)) {
      try {
        doc.image(altLogoPath, 50, 30, { width: 60, height: 60 });
        logoAdded = true;
      } catch (error) {
        console.log('Logo not added from absolute path:', error.message);
      }
    }

    // Company info in header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#fff').text('J.I. HEATING & COOLING', 130, 35);
    doc.fontSize(10).font('Helvetica').fillColor('#e3f2fd').text('Professional HVAC Services', 130, 65);
    doc.fontSize(9).font('Helvetica').fillColor('#e3f2fd').text('Serving the Greater Toronto Area', 130, 80);
    doc.fontSize(9).font('Helvetica').fillColor('#e3f2fd').text('Phone: +1 416 997 9123 | Email: sam@jiheatingandcooling.org', 130, 95);

    // Invoice title and number
    doc.fontSize(32).font('Helvetica-Bold').fillColor(primaryColor).text('INVOICE', 50, 150);
    doc.fontSize(14).font('Helvetica-Bold').fillColor(accentColor).text(`#${invoice.invoice_number}`, 450, 150);

    // Invoice details section
    const detailsY = 200;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text('Invoice Details', 50, detailsY);
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    doc.text(`Date: ${new Date(invoice.createdAt || invoice.issue_date || invoice.created_at || Date.now()).toLocaleDateString()}`, 50, detailsY + 20);
    doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 50, detailsY + 35);
    doc.text(`Payment Terms: ${invoice.payment_terms || 'Net 30'}`, 50, detailsY + 50);

    // Customer info section
    const customerY = detailsY + 80;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text('Bill To', 50, customerY);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text(invoice.customer_name, 50, customerY + 20);
    doc.fontSize(10).font('Helvetica').fillColor('#666');
    if (invoice.customer_email) doc.text(invoice.customer_email, 50, customerY + 35);
    if (invoice.customer_phone) doc.text(invoice.customer_phone, 50, customerY + 50);
    if (invoice.customer_address) doc.text(invoice.customer_address, 50, customerY + 65);

    // Professional items table
    const tableStartY = customerY + 100;
    const tableWidth = 495;
    const col1Width = 250; // Description
    const col2Width = 70;  // Quantity
    const col3Width = 90;  // Unit Price
    const col4Width = 85;  // Total

    // Table header with professional styling
    doc.rect(50, tableStartY, tableWidth, 30).fillAndStroke(primaryColor, primaryColor);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#fff');
    doc.text('Description', 60, tableStartY + 10);
    doc.text('Qty', 60 + col1Width, tableStartY + 10);
    doc.text('Unit Price', 60 + col1Width + col2Width, tableStartY + 10);
    doc.text('Total', 60 + col1Width + col2Width + col3Width, tableStartY + 10);

    // Items with alternating row colors
    let currentY = tableStartY + 30;
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    
    // Handle different invoice data structures
    const items = invoice.InvoiceItems || invoice.items || [];
    
    if (items.length === 0) {
      // Add a placeholder row if no items
      doc.rect(50, currentY, tableWidth, 25).fillAndStroke('#fff', borderColor);
      doc.text('No items found', 60, currentY + 8);
      currentY += 25;
    } else {
      items.forEach((item, index) => {
        const rowHeight = 25;
        const bgColor = index % 2 === 0 ? '#fff' : '#f8f9fa';
        
        // Row background
        doc.rect(50, currentY, tableWidth, rowHeight).fillAndStroke(bgColor, borderColor);
        
        // Item details with better spacing and null checks
        const description = item.description || item.Description || 'No description';
        const quantity = item.quantity || item.Quantity || 1;
        const unitPrice = item.unit_price || item.UnitPrice || item.unitPrice || 0;
        
        doc.text(description, 60, currentY + 8);
        doc.text(quantity.toString(), 60 + col1Width, currentY + 8);
        doc.text(`$${parseFloat(unitPrice).toFixed(2)}`, 60 + col1Width + col2Width, currentY + 8);
        doc.text(`$${(quantity * unitPrice).toFixed(2)}`, 60 + col1Width + col2Width + col3Width, currentY + 8);
        
        currentY += rowHeight;
      });
    }

    // Professional totals section
    currentY += 20;
    const totalsX = 60 + col1Width + col2Width;
    const totalsWidth = col3Width + col4Width;

    // Subtotal
    doc.fontSize(11).font('Helvetica').fillColor('#666');
    doc.text('Subtotal:', totalsX, currentY);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333');
    doc.text(`$${parseFloat(invoice.subtotal || 0).toFixed(2)}`, totalsX + totalsWidth - 85, currentY);
    currentY += 25;

    // Tax
    if (invoice.tax_rate > 0) {
      doc.fontSize(11).font('Helvetica').fillColor('#666');
      doc.text(`Tax (${invoice.tax_rate}%):`, totalsX, currentY);
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#333');
      doc.text(`$${parseFloat(invoice.tax_amount || 0).toFixed(2)}`, totalsX + totalsWidth - 85, currentY);
      currentY += 25;
    }

    // Total with emphasis
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor);
    doc.text('Total:', totalsX, currentY);
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor);
    doc.text(`$${parseFloat(invoice.total_amount || 0).toFixed(2)}`, totalsX + totalsWidth - 85, currentY);

    // Notes section with professional styling
    if (invoice.notes) {
      currentY += 40;
      doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text('Notes:', 50, currentY);
      doc.fontSize(10).font('Helvetica').fillColor('#333').text(invoice.notes, 50, currentY + 20);
    }

    // Professional footer
    const footerY = 750;
    doc.rect(0, footerY, 595, 50).fill(lightGray);
    doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor).text('Thank you for choosing J.I. Heating & Cooling!', { align: 'center' }, footerY + 10);
    doc.fontSize(8).font('Helvetica').fillColor('#666').text('Professional HVAC Services | Licensed & Insured | Serving the GTA', { align: 'center' }, footerY + 25);
    doc.fontSize(8).font('Helvetica').fillColor('#666').text('Phone: +1 416 997 9123 | Email: sam@jiheatingandcooling.org', { align: 'center' }, footerY + 40);

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