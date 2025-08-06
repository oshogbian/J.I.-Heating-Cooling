import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaDownload, FaEye, FaEdit, FaSignOutAlt, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import jsPDF from 'jspdf';

function InvoiceGenerator() {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tax_rate: 13,
    notes: '',
    payment_terms: 'Net 30',
    items: [{ description: '', quantity: 1, unit_price: 0 }]
  });

  // Company info
  const companyInfo = {
    name: 'J.I. Heating & Cooling',
    address: 'Serving the GTA',
    phone: '+1 (416) 997-9123',
    email: 'sam@jiheatingandcooling.org',
    website: 'www.jiheatingandcooling.org'
  };

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const sessionId = localStorage.getItem('adminSessionId');
      console.log('Checking session ID:', sessionId ? 'exists' : 'not found');
      
      if (!sessionId) {
        console.log('No session ID found, redirecting to login');
        navigate('/login');
        return false;
      }
      
      // Check if session is still valid - be more lenient with session validation
      try {
        const sessionParts = sessionId.split('-');
        if (sessionParts.length >= 3) {
          const sessionTime = sessionParts[2];
          const currentTime = Date.now();
          const sessionAge = currentTime - parseInt(sessionTime);
          
          // Session valid for 24 hours
          if (sessionAge > 24 * 60 * 60 * 1000) {
            console.log('Session expired, redirecting to login');
            localStorage.removeItem('adminSessionId');
            navigate('/login');
            return false;
          }
        } else {
          console.log('Invalid session format, redirecting to login');
          localStorage.removeItem('adminSessionId');
          navigate('/login');
          return false;
        }
      } catch (error) {
        console.error('Session validation error:', error);
        localStorage.removeItem('adminSessionId');
        navigate('/login');
        return false;
      }
      
      console.log('Session valid, proceeding with fetch');
      return true;
    };

    // Add a longer delay for mobile browsers to ensure localStorage is properly loaded
    const authCheck = setTimeout(() => {
      if (checkAuth()) {
        fetchInvoices();
      }
    }, 1000);

    return () => clearTimeout(authCheck);
  }, [navigate]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      console.log('Fetching invoices from:', `${config.SUPABASE_URL}/rest/v1/invoices?select=*`);
      
      // Fetch invoices with their items
      const response = await fetch(`${config.SUPABASE_URL}/rest/v1/invoices?select=*`, {
        headers: {
          'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        console.log('401 Unauthorized - API key issue, redirecting to login');
        localStorage.removeItem('adminSessionId');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        setError(`API Error: ${response.status} ${response.statusText}`);
        return;
      }
      
      const invoices = await response.json();
      console.log('Invoices fetched successfully:', invoices.length);
      
      // Fetch items for each invoice
      const invoicesWithItems = await Promise.all(
        invoices.map(async (invoice) => {
          try {
            const itemsResponse = await fetch(
              `${config.SUPABASE_URL}/rest/v1/invoice_items?invoice_id=eq.${invoice.id}&select=*`,
              {
                headers: {
                  'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
                  'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`
                }
              }
            );
            const items = await itemsResponse.json();
            return { ...invoice, items: items || [] };
          } catch (error) {
            console.error('Error fetching items for invoice:', invoice.id, error);
            return { ...invoice, items: [] };
          }
        })
      );
      
      setInvoices(invoicesWithItems || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, unit_price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const calculateSubtotal = () => {
    return form.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (form.tax_rate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const invoiceData = {
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        customer_address: form.customer_address,
        due_date: form.due_date,
        tax_rate: form.tax_rate,
        notes: form.notes,
        payment_terms: form.payment_terms,
        total_amount: calculateTotal(),
        subtotal: calculateSubtotal(),
        tax_amount: calculateTax(),
        status: editingInvoice ? editingInvoice.status : 'draft'
      };

      if (editingInvoice) {
        // Update existing invoice
        const response = await fetch(`${config.SUPABASE_URL}/rest/v1/invoices?id=eq.${editingInvoice.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(invoiceData)
        });

        if (response.ok) {
          // Update items
          const items = form.items.filter(item => item.description.trim() !== '');
          for (const item of items) {
            if (item.id) {
              // Update existing item
              await fetch(`${config.SUPABASE_URL}/rest/v1/invoice_items?id=eq.${item.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
                  'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`
                },
                body: JSON.stringify({
                  description: item.description,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  total: item.quantity * item.unit_price
                })
              });
            } else {
              // Add new item
              await fetch(`${config.SUPABASE_URL}/rest/v1/invoice_items`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
                  'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`
                },
                body: JSON.stringify({
                  invoice_id: editingInvoice.id,
                  description: item.description,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  total: item.quantity * item.unit_price
                })
              });
            }
          }
        }
      } else {
        // Create new invoice
        const response = await fetch(`${config.SUPABASE_URL}/rest/v1/invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(invoiceData)
        });

        if (response.ok) {
          const newInvoice = await response.json();
          const items = form.items.filter(item => item.description.trim() !== '');
          
          // Add items for the new invoice
          for (const item of items) {
            await fetch(`${config.SUPABASE_URL}/rest/v1/invoice_items`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`
              },
              body: JSON.stringify({
                invoice_id: newInvoice[0].id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.quantity * item.unit_price
              })
            });
          }
        }
      }

      fetchInvoices(); // Refresh the invoice list
      setShowForm(false);
      setEditingInvoice(null);
      setForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tax_rate: 13,
        notes: '',
        payment_terms: 'Net 30',
        items: [{ description: '', quantity: 1, unit_price: 0 }]
      });
    } catch (error) {
      console.error('Error saving invoice:', error);
      setError('Error saving invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setForm({
      customer_name: invoice.customer_name || '',
      customer_email: invoice.customer_email || '',
      customer_phone: invoice.customer_phone || '',
      customer_address: invoice.customer_address || '',
      due_date: invoice.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tax_rate: invoice.tax_rate || 13,
      notes: invoice.notes || '',
      payment_terms: invoice.payment_terms || 'Net 30',
      items: invoice.items || [{ description: '', quantity: 1, unit_price: 0 }]
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        setLoading(true);
        
        // Delete invoice items first (due to foreign key constraint)
        const itemsResponse = await fetch(`${config.SUPABASE_URL}/rest/v1/invoice_items?invoice_id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`
          }
        });

        if (itemsResponse.ok) {
          // Delete the invoice
          const response = await fetch(`${config.SUPABASE_URL}/rest/v1/invoices?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
              'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`
            }
          });

          if (response.ok) {
            fetchInvoices(); // Refresh the invoice list
          } else {
            setError('Failed to delete invoice');
          }
        } else {
          setError('Failed to delete invoice items');
        }
      } catch (error) {
        console.error('Error deleting invoice:', error);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
  };

  const generatePrintableInvoice = (invoice) => {
    const printWindow = window.open('', '_blank');
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #1e40af;
            }
            
            .company-info h1 {
              color: #1e40af;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .company-info p {
              color: #666;
              margin: 2px 0;
              font-size: 14px;
            }
            
            .invoice-title {
              text-align: right;
            }
            
            .invoice-title h2 {
              color: #1e40af;
              font-size: 36px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .invoice-number {
              color: #666;
              font-size: 16px;
            }
            
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            
            .bill-to, .invoice-info {
              width: 48%;
            }
            
            .bill-to h3, .invoice-info h3 {
              color: #1e40af;
              font-size: 18px;
              margin-bottom: 12px;
              text-transform: uppercase;
              font-weight: bold;
            }
            
            .customer-details {
              background: #f8fafc;
              padding: 16px;
              border-radius: 6px;
              border-left: 4px solid #1e40af;
            }
            
            .customer-details h4 {
              color: #1e40af;
              font-size: 16px;
              margin-bottom: 8px;
            }
            
            .customer-details p {
              color: #666;
              font-size: 14px;
              margin: 2px 0;
            }
            
            .invoice-info-item {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .invoice-info-item:last-child {
              border-bottom: none;
            }
            
            .invoice-info-item strong {
              color: #1e40af;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              overflow: hidden;
            }
            
            .items-table thead {
              background: #1e40af;
              color: white;
            }
            
            .items-table th, .items-table td {
              padding: 12px;
              text-align: left;
            }
            
            .items-table th {
              font-weight: bold;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            
            .items-table th:nth-child(2), .items-table th:nth-child(3), .items-table th:nth-child(4),
            .items-table td:nth-child(2), .items-table td:nth-child(3), .items-table td:nth-child(4) {
              text-align: right;
            }
            
            .items-table tbody tr:nth-child(even) {
              background: #f8fafc;
            }
            
            .items-table tbody tr:hover {
              background: #e2e8f0;
            }
            
            .items-table td {
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
            }
            
            .totals {
              margin-left: auto;
              width: 300px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 20px;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 4px 0;
            }
            
            .total-row.subtotal, .total-row.tax {
              color: #666;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
            }
            
            .total-row.final-total {
              font-weight: bold;
              font-size: 18px;
              color: #1e40af;
              border-top: 2px solid #1e40af;
              padding-top: 12px;
              margin-top: 12px;
            }
            
            .notes {
              margin-top: 40px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 6px;
              border-left: 4px solid #1e40af;
            }
            
            .notes h4 {
              color: #1e40af;
              margin-bottom: 10px;
              font-size: 16px;
            }
            
            .notes p {
              color: #666;
              line-height: 1.6;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              padding: 20px;
              border-top: 1px solid #e2e8f0;
              color: #666;
              font-size: 14px;
            }
            
            .footer strong {
              color: #1e40af;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
              
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="company-info">
              <h1>${companyInfo.name}</h1>
              <p>${companyInfo.address}</p>
              <p>Phone: ${companyInfo.phone}</p>
              <p>Email: ${companyInfo.email}</p>
              <p>Website: ${companyInfo.website}</p>
            </div>
            <div class="invoice-title">
              <h2>INVOICE</h2>
              <div class="invoice-number">#${invoice.invoice_number}</div>
            </div>
          </div>
          
          <div class="invoice-details">
            <div class="bill-to">
              <h3>Bill To</h3>
              <div class="customer-details">
                <h4>${invoice.customer_name}</h4>
                <p>${invoice.customer_email}</p>
                ${invoice.customer_phone ? `<p>${invoice.customer_phone}</p>` : ''}
                ${invoice.customer_address ? `<p>${invoice.customer_address}</p>` : ''}
              </div>
            </div>
            
            <div class="invoice-info">
              <h3>Invoice Details</h3>
              <div class="invoice-info-item">
                <span>Invoice Date:</span>
                <strong>${new Date(invoice.created_at).toLocaleDateString('en-CA')}</strong>
              </div>
              <div class="invoice-info-item">
                <span>Due Date:</span>
                <strong>${new Date(invoice.due_date).toLocaleDateString('en-CA')}</strong>
              </div>
              <div class="invoice-info-item">
                <span>Payment Terms:</span>
                <strong>${invoice.payment_terms}</strong>
              </div>
              <div class="invoice-info-item">
                <span>Status:</span>
                <strong style="text-transform: uppercase;">${invoice.status}</strong>
              </div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unit_price.toFixed(2)}</td>
                  <td>$${(item.quantity * item.unit_price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row subtotal">
              <span>Subtotal:</span>
              <span>$${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row tax">
              <span>Tax (${invoice.tax_rate}%):</span>
              <span>$${invoice.tax_amount.toFixed(2)}</span>
            </div>
            <div class="total-row final-total">
              <span>TOTAL:</span>
              <span>$${invoice.total_amount.toFixed(2)}</span>
            </div>
          </div>
          
          ${invoice.notes ? `
            <div class="notes">
              <h4>Notes</h4>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p><strong>Thank you for choosing ${companyInfo.name}!</strong></p>
            <p>For questions about this invoice, please contact us at ${companyInfo.phone}</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto print after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const downloadPDF = (invoice) => {
    try {
      console.log('Generating PDF for invoice:', invoice.invoice_number);
      
      // Create new PDF document with explicit settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set initial position
      let y = 20;
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Company header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(companyInfo.name, margin, y);
      y += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(companyInfo.address, margin, y);
      y += 5;
      pdf.text(`Phone: ${companyInfo.phone}`, margin, y);
      y += 5;
      pdf.text(`Email: ${companyInfo.email}`, margin, y);
      y += 5;
      pdf.text(`Website: ${companyInfo.website}`, margin, y);
      y += 15;
      
      // Invoice title and number
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', pageWidth - margin - 30, 30);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`#${invoice.invoice_number}`, pageWidth - margin - 30, 40);
      y += 20;
      
      // Customer information
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', margin, y);
      y += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoice.customer_name, margin, y);
      y += 5;
      pdf.text(invoice.customer_email, margin, y);
      y += 5;
      if (invoice.customer_phone) {
        pdf.text(invoice.customer_phone, margin, y);
        y += 5;
      }
      if (invoice.customer_address) {
        pdf.text(invoice.customer_address, margin, y);
        y += 5;
      }
      y += 10;
      
      // Invoice details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Invoice Details:', pageWidth - margin - 50, y);
      y += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice Date: ${new Date(invoice.created_at).toLocaleDateString('en-CA')}`, pageWidth - margin - 50, y);
      y += 5;
      pdf.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString('en-CA')}`, pageWidth - margin - 50, y);
      y += 5;
      pdf.text(`Payment Terms: ${invoice.payment_terms}`, pageWidth - margin - 50, y);
      y += 5;
      pdf.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - margin - 50, y);
      y += 20;
      
      // Items table
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description', margin, y);
      pdf.text('Qty', margin + 80, y);
      pdf.text('Unit Price', margin + 120, y);
      pdf.text('Total', margin + 160, y);
      y += 8;
      
      // Draw line under header
      pdf.line(margin, y, pageWidth - margin, y);
      y += 5;
      
      // Items
      pdf.setFont('helvetica', 'normal');
      invoice.items.forEach((item) => {
        if (y > pageHeight - 60) { // Check if we need a new page
          pdf.addPage();
          y = 20;
        }
        
        pdf.text(item.description, margin, y);
        pdf.text(item.quantity.toString(), margin + 80, y);
        pdf.text(`$${item.unit_price.toFixed(2)}`, margin + 120, y);
        pdf.text(`$${(item.quantity * item.unit_price).toFixed(2)}`, margin + 160, y);
        y += 6;
      });
      
      y += 10;
      
      // Draw line before totals
      pdf.line(margin, y, pageWidth - margin, y);
      y += 5;
      
      // Totals
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Subtotal:', margin + 100, y);
      pdf.text(`$${invoice.subtotal.toFixed(2)}`, margin + 160, y);
      y += 6;
      
      pdf.text(`Tax (${invoice.tax_rate}%):`, margin + 100, y);
      pdf.text(`$${invoice.tax_amount.toFixed(2)}`, margin + 160, y);
      y += 6;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL:', margin + 100, y);
      pdf.text(`$${invoice.total_amount.toFixed(2)}`, margin + 160, y);
      y += 15;
      
      // Notes
      if (invoice.notes) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes:', margin, y);
        y += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        
        // Simple text wrapping
        const maxWidth = pageWidth - (margin * 2);
        const words = invoice.notes.split(' ');
        let line = '';
        
        for (let word of words) {
          const testLine = line + word + ' ';
          if (pdf.getTextWidth(testLine) < maxWidth) {
            line = testLine;
          } else {
            pdf.text(line, margin, y);
            y += 4;
            line = word + ' ';
          }
        }
        if (line) {
          pdf.text(line, margin, y);
          y += 8;
        }
      }
      
      // Footer
      y += 10;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Thank you for choosing ${companyInfo.name}!`, margin, y);
      y += 4;
      pdf.text(`For questions about this invoice, please contact us at ${companyInfo.phone}`, margin, y);
      
      // Save the PDF with proper error handling
      const filename = `invoice-${invoice.invoice_number}.pdf`;
      console.log('Saving PDF as:', filename);
      
      // Use a more reliable save method
      try {
        pdf.save(filename);
        console.log('PDF saved successfully');
      } catch (saveError) {
        console.error('PDF save error:', saveError);
        // Fallback: try to open in new window
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const viewInvoice = (invoice) => {
    setViewingInvoice(invoice);
  };

  const closeViewModal = () => {
    setViewingInvoice(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Invoice Generator</h1>
          <p className="text-blue-600">{companyInfo.name} - Professional Invoicing System</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 shadow-lg"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'New Invoice'}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('adminSessionId');
              navigate('/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 shadow-lg"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer Email *
                </label>
                <input
                  name="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer Phone
                </label>
                <input
                  name="customer_phone"
                  type="tel"
                  value={form.customer_phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Address
              </label>
              <textarea
                name="customer_address"
                value={form.customer_address}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Items */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice Items</h3>
              {form.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <input
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Unit Price
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={form.items.length === 1}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm text-gray-600">
                    Item Total: ${(item.quantity * item.unit_price).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <FaPlus /> Add Item
              </button>
            </div>

            {/* Invoice Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  name="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.tax_rate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  name="payment_terms"
                  value={form.payment_terms}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes or terms..."
              />
            </div>

            {/* Summary */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Invoice Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({form.tax_rate}%):</span>
                  <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-blue-900 border-t pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              {loading ? 'Saving...' : (editingInvoice ? 'Update Invoice' : 'Create Invoice')}
            </button>
          </form>
        </div>
      )}

      {/* Invoice List */}
      <div className="bg-white rounded-xl shadow-xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Invoice History</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No invoices found</p>
            <p className="text-gray-400">Create your first invoice to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-900">
                        {invoice.invoice_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {invoice.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${invoice.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'sent'
                          ? 'bg-blue-100 text-blue-800'
                          : invoice.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          title="View Invoice"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors duration-150"
                          title="Edit Invoice"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadPDF(invoice)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-150"
                          title="Print/Download PDF"
                        >
                          <FaPrint className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150"
                          title="Delete Invoice"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-150"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Invoice Preview</h2>
                  <p className="text-blue-100">{viewingInvoice.invoice_number}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full uppercase ${
                    viewingInvoice.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : viewingInvoice.status === 'sent'
                      ? 'bg-blue-100 text-blue-800'
                      : viewingInvoice.status === 'overdue'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {viewingInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-96">
              {/* Company and Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">From</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">{companyInfo.name}</h4>
                    <p className="text-gray-600 text-sm">{companyInfo.address}</p>
                    <p className="text-gray-600 text-sm">{companyInfo.phone}</p>
                    <p className="text-gray-600 text-sm">{companyInfo.email}</p>
                    <p className="text-gray-600 text-sm">{companyInfo.website}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Bill To</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{viewingInvoice.customer_name}</h4>
                    <p className="text-gray-600 text-sm">{viewingInvoice.customer_email}</p>
                    {viewingInvoice.customer_phone && (
                      <p className="text-gray-600 text-sm">{viewingInvoice.customer_phone}</p>
                    )}
                    {viewingInvoice.customer_address && (
                      <p className="text-gray-600 text-sm">{viewingInvoice.customer_address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500 uppercase font-semibold">Invoice Date</span>
                  <p className="font-semibold text-gray-900">
                    {new Date(viewingInvoice.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 uppercase font-semibold">Due Date</span>
                  <p className="font-semibold text-gray-900">
                    {new Date(viewingInvoice.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 uppercase font-semibold">Payment Terms</span>
                  <p className="font-semibold text-gray-900">{viewingInvoice.payment_terms}</p>
                </div>
              </div>
              
              {/* Items Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Items</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewingInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            ${item.unit_price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                            ${(item.quantity * item.unit_price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Totals and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {viewingInvoice.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700">{viewingInvoice.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">${viewingInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax ({viewingInvoice.tax_rate}%):</span>
                        <span className="font-semibold">${viewingInvoice.tax_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-blue-900 border-t pt-3">
                        <span>TOTAL:</span>
                        <span>${viewingInvoice.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-4 border-t">
              <button
                onClick={() => downloadPDF(viewingInvoice)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <FaPrint /> Print/Download
              </button>
              <button
                onClick={() => {
                  handleEdit(viewingInvoice);
                  closeViewModal();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceGenerator;