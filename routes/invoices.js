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

    // Create a simple HTML invoice that can be printed as PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 20px; }
          .invoice-details { margin-bottom: 30px; }
          .customer-info { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .totals { text-align: right; }
          .footer { margin-top: 40px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <h2>J-I Heating & Cooling</h2>
          <p>Toronto, ON<br>Phone: (416) 555-0123<br>Email: info@ji-hvac.com</p>
        </div>
        
        <div class="invoice-details">
          <strong>Invoice #:</strong> ${invoice.invoice_number}<br>
          <strong>Date:</strong> ${new Date(invoice.created_at || invoice.createdAt || Date.now()).toLocaleDateString()}<br>
          <strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}
        </div>
        
        <div class="customer-info">
          <strong>Bill To:</strong><br>
          ${invoice.customer_name}<br>
          ${invoice.customer_email}<br>
          ${invoice.customer_phone || ''}<br>
          ${invoice.customer_address || ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items ? invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.unit_price}</td>
                <td>$${(item.quantity * item.unit_price).toFixed(2)}</td>
              </tr>
            `).join('') : ''}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Subtotal:</strong> $${invoice.subtotal || 0}</p>
          <p><strong>Tax (${invoice.tax_rate || 0}%):</strong> $${invoice.tax_amount || 0}</p>
          <p><strong>Total:</strong> $${invoice.total_amount || 0}</p>
        </div>
        
        <div class="footer">
          <p>Payment Terms: ${invoice.payment_terms || 'Net 30'}</p>
          ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        </div>
      </body>
      </html>
    `;
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.html"`);
    res.send(html);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF'
    });
  }
});

module.exports = router; 