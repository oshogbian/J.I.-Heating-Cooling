const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
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
      include: [InvoiceItem],
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
      include: [InvoiceItem]
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

    const invoice = await Invoice.findByPk(req.params.id, {
      include: [InvoiceItem]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(24).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Company info
    const companyInfo = invoice.company_info || {
      name: 'J-I Heating & Cooling',
      address: 'Toronto, ON',
      phone: '(416) 555-0123',
      email: 'info@ji-hvac.com'
    };

    doc.fontSize(12).text(companyInfo.name);
    doc.fontSize(10).text(companyInfo.address);
    doc.text(companyInfo.phone);
    doc.text(companyInfo.email);
    doc.moveDown();

    // Invoice details
    doc.fontSize(14).text(`Invoice #: ${invoice.invoice_number}`);
    doc.fontSize(10).text(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`);
    doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`);
    doc.moveDown();

    // Customer info
    doc.fontSize(12).text('Bill To:');
    doc.fontSize(10).text(invoice.customer_name);
    if (invoice.customer_address) doc.text(invoice.customer_address);
    if (invoice.customer_phone) doc.text(invoice.customer_phone);
    doc.text(invoice.customer_email);
    doc.moveDown();

    // Items table
    const tableTop = doc.y;
    let tableY = tableTop;

    // Headers
    doc.fontSize(10).text('Description', 50, tableY);
    doc.text('Qty', 300, tableY);
    doc.text('Unit Price', 350, tableY);
    doc.text('Total', 450, tableY);
    
    tableY += 20;
    doc.moveTo(50, tableY).lineTo(550, tableY).stroke();
    tableY += 10;

    // Items
    invoice.InvoiceItems.forEach(item => {
      doc.text(item.description, 50, tableY);
      doc.text(item.quantity.toString(), 300, tableY);
      doc.text(`$${item.unit_price.toFixed(2)}`, 350, tableY);
      doc.text(`$${item.total.toFixed(2)}`, 450, tableY);
      tableY += 20;
    });

    // Totals
    tableY += 10;
    doc.moveTo(50, tableY).lineTo(550, tableY).stroke();
    tableY += 20;

    doc.text('Subtotal:', 350, tableY);
    doc.text(`$${invoice.subtotal.toFixed(2)}`, 450, tableY);
    tableY += 20;

    if (invoice.tax_rate > 0) {
      doc.text(`Tax (${invoice.tax_rate}%):`, 350, tableY);
      doc.text(`$${invoice.tax_amount.toFixed(2)}`, 450, tableY);
      tableY += 20;
    }

    doc.fontSize(12).text('Total:', 350, tableY);
    doc.text(`$${invoice.total_amount.toFixed(2)}`, 450, tableY);

    // Notes
    if (invoice.notes) {
      doc.moveDown(2);
      doc.fontSize(10).text('Notes:', 50);
      doc.fontSize(9).text(invoice.notes, 50);
    }

    // Payment terms
    doc.moveDown();
    doc.fontSize(10).text(`Payment Terms: ${invoice.payment_terms}`, 50);

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