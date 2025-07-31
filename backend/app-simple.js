require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// In-memory storage for development
let invoices = [];
let sessions = new Set();

// Simple authentication middleware
const requireAuth = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  next();
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'ji-hvac-2024') {
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    sessions.add(sessionId);
    
    res.json({
      success: true,
      message: 'Login successful',
      sessionId
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (sessionId) {
    sessions.delete(sessionId);
  }
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Authenticated'
  });
});

// Invoice routes
app.post('/api/invoices', requireAuth, (req, res) => {
  try {
    const invoice = {
      id: Date.now(),
      invoice_number: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + 1).padStart(3, '0')}`,
      status: 'draft',
      ...req.body,
      due_date: req.body.due_date ? new Date(req.body.due_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    invoices.push(invoice);
    
    res.json({
      success: true,
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create invoice'
    });
  }
});

app.get('/api/invoices', requireAuth, (req, res) => {
  res.json({
    success: true,
    invoices: invoices
  });
});

app.get('/api/invoices/:id', requireAuth, (req, res) => {
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
});

app.put('/api/invoices/:id', requireAuth, (req, res) => {
  const index = invoices.findIndex(inv => inv.id == req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Invoice not found'
    });
  }
  
  invoices[index] = {
    ...invoices[index],
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json({
    success: true,
    message: 'Invoice updated successfully'
  });
});

app.delete('/api/invoices/:id', requireAuth, (req, res) => {
  const index = invoices.findIndex(inv => inv.id == req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Invoice not found'
    });
  }
  
  invoices.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Invoice deleted successfully'
  });
});

// PDF generation
app.get('/api/invoices/:id/pdf', (req, res) => {
  const sessionId = req.query.token || req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  const invoice = invoices.find(inv => inv.id == req.params.id);
  
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
        <strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}<br>
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
});

// Health check
app.get('/', (req, res) => {
  res.send('J.I. Heating and Cooling API (Development Mode)');
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Development Mode)`);
  console.log('Admin credentials: admin / ji-hvac-2024');
}); 