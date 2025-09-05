import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaDownload, FaEye, FaEdit, FaSignOutAlt, FaPrint, FaListUl } from 'react-icons/fa';
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

  // Service descriptions
  const serviceDescriptions = {
    'fan_coil': 'Fan Coil Services\n• Professional installation and maintenance\n• Air quality optimization\n• Emergency repairs and troubleshooting\n• System performance testing\n• Filter replacement and cleaning',
    'heat_pump': 'Heat Pump Services\n• High-efficiency installation\n• Regular maintenance and optimization\n• Performance testing and calibration\n• Energy efficiency improvements\n• Emergency repair services',
    'vent_cleaning': 'Ventilation Cleaning\n• Complete duct system cleaning\n• Air quality improvement\n• Mold and allergen removal\n• System sanitization\n• Performance restoration',
    'custom': ''
  };

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
    items: [{ service_type: '', custom_service_name: '', description: '', quantity: 1, unit_price: 0, bullet_points: [] }]
  });

  // Company info
  const companyInfo = {
    name: 'J.I. Heating & Cooling',
    address: 'Serving the GTA',
    phone: '+1 (416) 997-9123',
    email: 'sam@jiheatingandcooling.org',
    website: 'www.jiheatingandcooling.org',
    hst_number: 'HST #123456789 RT0001',
    warranty_info: 'All work guaranteed for 1 year',
    payment_instructions: 'Payment accepted via e-transfer, cheque, or cash'
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
      console.log('Fetching invoices from:', `${config.SUPABASE_URL}/rest/v1/invoices?select=*`);
      const response = await fetch(`${config.SUPABASE_URL}/rest/v1/invoices?select=*`, {
        headers: {
          'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.status === 401) {
        console.log('401 Unauthorized - API key issue, redirecting to login');
        localStorage.removeItem('adminSessionId');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        const errorMsg = `API Error: ${response.status} ${response.statusText}`;
        console.error(errorMsg);
        setError(errorMsg);
        errorReporter.reportApiError(new Error(errorMsg), '/rest/v1/invoices', 'GET', response.status);
        return;
      }
      
      const invoices = await response.json();
      console.log('Invoices fetched successfully:', invoices.length);
      console.log('Invoices data:', invoices);
      
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
            errorReporter.reportApiError(error, `/rest/v1/invoice_items?invoice_id=eq.${invoice.id}`, 'GET', 0);
            return { ...invoice, items: [] };
          }
        })
      );
      
      setInvoices(invoicesWithItems || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Network error');
      errorReporter.reportApiError(error, '/rest/v1/invoices', 'GET', 0);
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
    
    // Auto-populate description when service type is selected
    if (field === 'service_type' && value !== 'custom') {
      newItems[index].description = serviceDescriptions[value] || '';
    }
    
    setForm({ ...form, items: newItems });
  };

  // Helper function to handle description input
  const handleDescriptionInput = (index, value) => {
    const newItems = [...form.items];
    newItems[index].description = value;
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { service_type: '', custom_service_name: '', description: '', quantity: 1, unit_price: 0, bullet_points: [] }]
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
      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`;
      
      const invoiceData = {
        invoice_number: invoiceNumber,
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
                  service_type: item.service_type || item.custom_service_name || '',
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
                  service_type: item.service_type || item.custom_service_name || '',
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
        console.log('Creating invoice with data:', invoiceData);
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

        console.log('Invoice creation response status:', response.status);
        
                  if (response.ok) {
            const newInvoice = await response.json();
            console.log('Invoice created successfully:', newInvoice);
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
                  service_type: item.service_type || item.custom_service_name || '',
                  description: item.description,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  total: item.quantity * item.unit_price
                })
            });
          }
        }
      }

      console.log('Invoice saved, refreshing list...');
      await fetchInvoices(); // Refresh the invoice list
      console.log('Invoice list refreshed');
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
        items: [{ service_type: '', custom_service_name: '', description: '', quantity: 1, unit_price: 0, bullet_points: [] }]
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
      items: invoice.items || [{ service_type: '', custom_service_name: '', description: '', quantity: 1, unit_price: 0, bullet_points: [] }]
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: #ffffff;
            }
            
            /* Header Section - Professional Layout */
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #ddd;
            }
            
            .company-info {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            
            .company-info h1 {
              color: #333;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
              line-height: 1.2;
            }
            
            .company-info p {
              color: #666;
              margin: 0;
              font-size: 12px;
              line-height: 1.4;
            }
            
            .invoice-details {
              text-align: right;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            
            .invoice-title {
              color: #333;
              font-size: 28px;
              font-weight: bold;
              margin: 0;
              text-transform: uppercase;
            }
            
            .invoice-number {
              color: #333;
              font-size: 16px;
              font-weight: bold;
              margin: 0;
            }
            
            .invoice-date {
              color: #666;
              font-size: 12px;
              margin: 0;
            }
            

            

            
            /* Billing Section */
            .billing-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            
            .client-info {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            
            .client-name {
              color: #333;
              font-size: 16px;
              font-weight: bold;
              margin: 0;
            }
            
            .client-details {
              color: #666;
              font-size: 12px;
              margin: 0;
              line-height: 1.4;
            }
            
            .project-section {
              margin-top: 15px;
            }
            
            .project-label {
              color: #333;
              font-size: 14px;
              font-weight: bold;
              margin: 0 0 5px 0;
              text-transform: uppercase;
            }
            
            .project-name {
              color: #333;
              font-size: 14px;
              margin: 0;
            }
            

            
            /* Table Section */
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              background: white;
              border: 2px solid #183153;
              border-radius: 8px;
              overflow: hidden;
            }
            
            .detail-item {
              text-align: center;
              font-weight: 600;
            }
            
            .items-table thead {
              background: linear-gradient(135deg, #183153, #1e40af);
              color: white;
            }
            
            .items-table th {
              padding: 15px 12px;
              text-align: left;
              font-weight: bold;
              font-size: 13px;
              text-transform: uppercase;
              color: white;
              border-right: 1px solid rgba(255,255,255,0.2);
            }
            
            .items-table th:last-child {
              text-align: right;
              border-right: none;
            }
            
            .items-table td {
              padding: 15px 12px;
              border-bottom: 1px solid #e5e7eb;
              border-right: 1px solid #e5e7eb;
              font-size: 12px;
              line-height: 1.5;
              vertical-align: top;
            }
            
            .items-table td:last-child {
              text-align: right;
              font-weight: bold;
              border-right: none;
            }
            
            .items-table tbody tr:hover {
              background-color: #f8fafc;
            }
            
            /* Service/Product Details Table */

            

            
            .items-table tbody tr:nth-child(even) {
              background: #f9f9f9;
            }
            
            .description-cell {
              white-space: pre-line;
              line-height: 1.4;
            }
            
            .description-intro {
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .description-bullets {
              margin-left: 15px;
            }
            
            /* Totals Section */
            .totals-section {
              margin-left: auto;
              width: 320px;
              text-align: right;
              background: linear-gradient(135deg, #f8fafc, #ffffff);
              border: 2px solid #183153;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 4px 12px rgba(24, 49, 83, 0.1);
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 8px 0;
              font-size: 14px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .total-row:last-child {
              border-bottom: none;
            }
            
            .total-row.tax {
              color: #6b7280;
              font-weight: 500;
            }
            
            .total-row.final-total {
              font-weight: bold;
              font-size: 18px;
              color: #183153;
              border-top: 2px solid #183153;
              border-bottom: none;
              padding-top: 12px;
              margin-top: 12px;
            }
            

            
            /* Footer */
            .footer {
              margin-top: 40px;
              text-align: center;
              padding: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 10px;
              line-height: 1.4;
            }
            
            .footer p {
              margin: 5px 0;
            }
            
            /* Footer Information */
            .footer {
              margin-top: 25px;
              text-align: center;
              padding: 25px 20px;
              border-top: 2px solid #183153;
              color: #666;
              font-size: 12px;
              background: linear-gradient(135deg, #f8f9fa, #ffffff);
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(24, 49, 83, 0.1);
            }
            
            .footer strong {
              color: #183153;
              font-weight: bold;
            }
            
            .footer-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-top: 20px;
              text-align: left;
            }
            
            .footer-section h5 {
              color: #183153;
              font-size: 14px;
              margin-bottom: 8px;
              font-weight: bold;
            }
            
            .footer-section p {
              font-size: 12px;
              line-height: 1.4;
              margin: 4px 0;
            }
            
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
              body {
                padding: 15px;
              }
              
              .invoice-header {
                flex-direction: column;
                gap: 20px;
                text-align: center;
              }
              
              .invoice-details {
                text-align: center;
              }
              
              .billing-section {
                flex-direction: column;
                gap: 20px;
              }
              
              .totals-section {
                width: 100%;
                margin: 20px 0;
              }
              
              .invoice-details-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                padding: 15px;
              }
              
              .financial-summary {
                width: 100%;
                margin: 20px 0;
              }
              
              .items-table {
                font-size: 12px;
              }
              
              .items-table th, .items-table td {
                padding: 8px 6px;
              }
              
              .footer-grid {
                grid-template-columns: 1fr;
                text-align: center;
              }
            }
            
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
              
              .no-print {
                display: none !important;
              }
              
              .invoice-header {
                page-break-inside: avoid;
              }
              
              .items-table {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <!-- Header Section -->
          <div class="invoice-header">
            <div class="company-info">
              <h1>${companyInfo.name}</h1>
              <p>${companyInfo.address}</p>
              <p>Phone: ${companyInfo.phone}</p>
              <p>Email: ${companyInfo.email}</p>
            </div>
            <div class="invoice-details">
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">#${invoice.invoice_number}</div>
              <div class="invoice-date">Date: ${new Date(invoice.created_at).toLocaleDateString('en-CA')}</div>
            </div>
          </div>
          
          <!-- Billing Section -->
          <div class="billing-section">
            <div class="client-info">
              <div class="client-name">${invoice.customer_name}</div>
              <div class="client-details">${invoice.customer_email}</div>
              ${invoice.customer_phone ? `<div class="client-details">${invoice.customer_phone}</div>` : ''}
              ${invoice.customer_address ? `<div class="client-details">${invoice.customer_address}</div>` : ''}
              
              <div class="project-section">
                <div class="project-label">FOR:</div>
                <div class="project-name">HVAC Services</div>
              </div>
            </div>
          </div>
          

          
          <!-- Service/Product Details Table -->
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
              ${invoice.items.map(item => {
                const descriptionLines = item.description.split('\n');
                const introLine = descriptionLines[0] || '';
                const bulletPoints = descriptionLines.slice(1).filter(line => line.trim());
                
                return `
                  <tr>
                    <td class="description-cell">
                      <div class="description-intro">${introLine}</div>
                      ${bulletPoints.length > 0 ? `<div class="description-bullets">${bulletPoints.map(line => `• ${line.trim()}`).join('<br>')}</div>` : ''}
                    </td>
                    <td class="detail-item">${item.quantity}</td>
                    <td class="detail-item">$${item.unit_price.toFixed(2)}</td>
                    <td class="detail-item">$${(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <!-- Totals Section -->
          <div class="totals-section">
            <div class="total-row">
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
          
          <!-- Footer -->
          <div class="footer">
            <p>Thank you for choosing ${companyInfo.name}!</p>
            <p>Payment is due within ${invoice.payment_terms}. Please include invoice number with payment.</p>
            <p>All work guaranteed for 1 year. Parts warranty as per manufacturer.</p>
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
      
      // Set initial position with optimized spacing
      let y = 20;
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Helper function to format bullet points for PDF
      const formatDescriptionForPDF = (description) => {
        if (!description) return '';
        
        // Split by newlines and filter out empty lines
        const lines = description.split('\n').filter(line => line.trim() !== '');
        
        // Process each line to ensure proper bullet point formatting
        const formattedLines = lines.map(line => {
          const trimmed = line.trim();
          // Fix bullet point characters and ensure proper formatting
          if (trimmed.includes('●') || trimmed.includes('•') || trimmed.includes('-') || trimmed.includes('*')) {
            return trimmed.replace(/[●•]/g, '•'); // Normalize bullet points
          } else if (trimmed.length > 0) {
            return `• ${trimmed}`;
          }
          return trimmed;
        });
        
        return formattedLines;
      };
      
      // Add company logo to PDF (smaller size)
      try {
        const logoUrl = '/logo.png';
        pdf.addImage(logoUrl, 'PNG', margin, y - 8, 15, 15);
      } catch (error) {
        console.log('Logo not found, using text fallback');
        // Draw a smaller placeholder for the logo
        pdf.setFillColor(24, 49, 83);
        pdf.rect(margin, y - 8, 15, 15, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('JI', margin + 4, y - 1);
      }
      
      // Company header beside logo with adjusted alignment
      const logoHeight = 15;
      const companyInfoHeight = 18; // Total height of company info
      const startY = y - logoHeight/2 - companyInfoHeight/2 + 12; // Center relative to logo, moved down more
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(24, 49, 83); // Dark blue color
      pdf.text(companyInfo.name, margin + 20, startY);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(74, 85, 104); // Gray color
      pdf.text(companyInfo.address, margin + 20, startY + 6);
      pdf.text(`Phone: ${companyInfo.phone}`, margin + 20, startY + 9);
      pdf.text(`Email: ${companyInfo.email}`, margin + 20, startY + 12);
      pdf.text(`Website: ${companyInfo.website}`, margin + 20, startY + 15);
      
      y += 8;
      
      // Invoice title and number (right-aligned, compact)
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(24, 49, 83);
      pdf.text('INVOICE', pageWidth - margin - 35, 25);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(24, 49, 83);
      pdf.text(`#${invoice.invoice_number}`, pageWidth - margin - 35, 35);
      y += 20;
      
      // Customer information section (professional layout)
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(24, 49, 83);
      pdf.text('Bill To:', margin, y);
      y += 6;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(45, 55, 72);
      pdf.text(invoice.customer_name, margin, y);
      y += 4;
      pdf.text(invoice.customer_email, margin, y);
      y += 4;
      if (invoice.customer_phone) {
        pdf.text(invoice.customer_phone, margin, y);
        y += 4;
      }
      if (invoice.customer_address) {
        pdf.text(invoice.customer_address, margin, y);
        y += 4;
      }
      y += 6;
      
      // Invoice details (professional layout)
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Invoice Details:', pageWidth - margin - 45, y);
      y += 6;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice Date: ${new Date(invoice.created_at).toLocaleDateString('en-CA')}`, pageWidth - margin - 45, y);
      y += 4;
      pdf.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString('en-CA')}`, pageWidth - margin - 45, y);
      y += 4;
      pdf.text(`Payment Terms: ${invoice.payment_terms}`, pageWidth - margin - 45, y);
      y += 12;
      
      // Items table header (clean)
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(24, 49, 83);
      
      // Draw header background
      pdf.setFillColor(240, 245, 250);
      pdf.rect(margin, y - 6, pageWidth - (margin * 2), 10, 'F');
      
      // Header text with compact column positions
      pdf.text('Description', margin, y);
      pdf.setFontSize(10);
      pdf.text('Qty', margin + 95, y);
      pdf.text('Unit Price', margin + 125, y);
      pdf.text('Total', margin + 160, y);
      y += 8;
      
      // Draw single line under header
      pdf.setDrawColor(24, 49, 83);
      pdf.setLineWidth(0.8);
      pdf.line(margin, y, pageWidth - margin, y);
      
      // Store the starting Y position for table
      const tableStartY = y;
      
      y += 6;
      
      // Items table with proper formatting
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(45, 55, 72);
      
      let tableEndY = tableStartY;
      
      invoice.items.forEach((item) => {
        // Check if we need a new page
        if (y > pageHeight - 60) {
          pdf.addPage();
          y = 20;
        }
        
        // Handle bullet points in description
        const descriptionLines = formatDescriptionForPDF(item.description);
        
        // No top border for rows to avoid lines through content
        
        // Show service type first
        const serviceType = item.service_type || item.custom_service_name || 'Service';
        if (y > pageHeight - 40) {
          pdf.addPage();
          y = 25;
        }
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(24, 49, 83);
        pdf.text(serviceType, margin, y);
        y += 6;
        
        // Process each line of the description
        descriptionLines.forEach((line, lineIndex) => {
          // Check if we need a new page - allow more space for content
          if (y > pageHeight - 40) {
            pdf.addPage();
            y = 25;
          }
          
          // Only show quantity and price on the first line
          if (lineIndex === 0) {
            pdf.setFontSize(9);
            // Wrap long description text to fit in column
            const maxDescWidth = 70; // Further reduced width to prevent overflow
            const words = line.split(' ');
            let currentLine = '';
            let descLineCount = 0;
            
            for (let word of words) {
              const testLine = currentLine + word + ' ';
              if (pdf.getTextWidth(testLine) < maxDescWidth) {
                currentLine = testLine;
              } else {
                if (descLineCount === 0) {
                  // First line shows quantity and price
                  pdf.text(currentLine.trim(), margin, y);
                  pdf.setFontSize(8);
                  pdf.text(item.quantity.toString(), margin + 95, y);
                  pdf.text(`$${item.unit_price.toFixed(2)}`, margin + 125, y);
                  pdf.text(`$${(item.quantity * item.unit_price).toFixed(2)}`, margin + 160, y);
                } else {
                  // Continuation lines - only show description, no other columns
                  pdf.text(`  ${currentLine.trim()}`, margin, y);
                }
                y += 6;
                currentLine = word + ' ';
                descLineCount++;
              }
            }
            
            // Handle the last line
            if (currentLine.trim()) {
              if (descLineCount === 0) {
                pdf.text(currentLine.trim(), margin, y);
                pdf.setFontSize(8);
                pdf.text(item.quantity.toString(), margin + 95, y);
                pdf.text(`$${item.unit_price.toFixed(2)}`, margin + 125, y);
                pdf.text(`$${(item.quantity * item.unit_price).toFixed(2)}`, margin + 160, y);
              } else {
                pdf.text(`  ${currentLine.trim()}`, margin, y);
              }
              y += 6;
            }
          } else {
            // For continuation lines, only show the description with indentation
            pdf.setFontSize(8);
            // Wrap long continuation lines too
            const maxDescWidth = 70;
            const words = line.split(' ');
            let currentLine = '';
            
            for (let word of words) {
              const testLine = currentLine + word + ' ';
              if (pdf.getTextWidth(testLine) < maxDescWidth) {
                currentLine = testLine;
              } else {
                pdf.text(`  ${currentLine.trim()}`, margin, y);
                y += 6;
                currentLine = word + ' ';
              }
            }
            
            if (currentLine.trim()) {
              pdf.text(`  ${currentLine.trim()}`, margin, y);
              y += 6;
            }
          }
        });
        
        // Draw bottom border for the row (only at the very bottom)
        tableEndY = y + 1;
        y += 6;
      });
      
      // Draw vertical column separators that match the table height
      pdf.setDrawColor(24, 49, 83);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 90, tableStartY - 8, margin + 90, tableEndY); // Qty column separator
      pdf.line(margin + 120, tableStartY - 8, margin + 120, tableEndY); // Unit Price column separator
      pdf.line(margin + 155, tableStartY - 8, margin + 155, tableEndY); // Total column separator
      
      // Draw bottom border for the entire table
      pdf.setDrawColor(24, 49, 83);
      pdf.setLineWidth(0.3);
      pdf.line(margin, tableEndY, pageWidth - margin, tableEndY);
      
      y += 10;
      
      // Check if we need a new page for totals
      if (y > pageHeight - 50) {
        pdf.addPage();
        y = 25;
      }
      
      // Draw line before totals
      pdf.setDrawColor(30, 64, 175);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 8;
      
      // Financial Summary aligned with table columns
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(74, 85, 104);
      
      pdf.text('Subtotal:', margin + 120, y);
      pdf.text(`$${invoice.subtotal.toFixed(2)}`, margin + 155, y);
      y += 6;
      
      pdf.text(`Tax (${invoice.tax_rate}%):`, margin + 120, y);
      pdf.text(`$${invoice.tax_amount.toFixed(2)}`, margin + 155, y);
      y += 8;
      
      // Final total with emphasis
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text('TOTAL:', margin + 120, y);
      pdf.text(`$${invoice.total_amount.toFixed(2)}`, margin + 155, y);
      y += 15;
      
      // Notes section (compact)
      if (invoice.notes) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 64, 175);
        pdf.text('Notes:', margin, y);
        y += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(74, 85, 104);
        
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
      
      // Footer (compact)
      y += 10;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text(`Thank you for choosing ${companyInfo.name}!`, margin, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(74, 85, 104);
      pdf.text(`For questions about this invoice, please contact us at ${companyInfo.phone}`, margin, y);
      y += 5;
      pdf.text(`Website: ${companyInfo.website}`, margin, y);
      
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
      errorReporter.reportPdfError(error, 'download-pdf');
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
                  Email *
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
                  Phone
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
                Address
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
              
              {/* Description Help */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FaListUl /> Description Tips
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Type • for bullet points</li>
                  <li>• Use any format you prefer</li>
                  <li>• Include details like parts, time, special notes</li>
                </ul>
              </div>
              {form.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Service Type *
                      </label>
                      <input
                        type="text"
                        value={item.service_type === 'custom' ? item.custom_service_name || '' : item.service_type}
                        onChange={(e) => {
                          if (item.service_type === 'custom') {
                            handleItemChange(index, 'custom_service_name', e.target.value);
                          } else {
                            handleItemChange(index, 'service_type', e.target.value);
                          }
                        }}
                        placeholder="Enter service type (e.g., Fan Coil Installation, Heat Pump Repair)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                      />
                      
                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quick Select (Optional)
                        </label>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleItemChange(index, 'service_type', e.target.value);
                              handleItemChange(index, 'custom_service_name', '');
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Or choose from common services...</option>
                          <option value="Fan Coil Services">Fan Coil Services</option>
                          <option value="Heat Pump Services">Heat Pump Services</option>
                          <option value="Ventilation Cleaning">Ventilation Cleaning</option>
                          <option value="Air Filter Replacement">Air Filter Replacement</option>
                          <option value="System Maintenance">System Maintenance</option>
                          <option value="Emergency Repair">Emergency Repair</option>
                        </select>
                      </div>
                      
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleDescriptionInput(index, e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter detailed service description...&#10;You can use bullet points (•) or any format you prefer&#10;Example:&#10;• Replaced fan coil unit&#10;• Installed new thermostat&#10;• Cleaned air ducts"
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
                <FaPlus /> Add Another Service
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
                  Terms
                </label>
                <select
                  name="payment_terms"
                  value={form.payment_terms}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
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
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional additional notes..."
              />
            </div>

            {/* Summary */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Summary</h3>
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
              disabled={loading || form.items.some(item => (!item.service_type && !item.custom_service_name) || !item.description.trim())}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              {loading ? 'Saving...' : (editingInvoice ? 'Update' : 'Create Invoice')}
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
                      {viewingInvoice.items.map((item, index) => {
                        const descriptionLines = item.description.split('\n');
                        return descriptionLines.map((line, lineIndex) => (
                          <tr key={`${index}-${lineIndex}`}>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line">
                              {lineIndex === 0 ? line : `    ${line}`}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right">
                              {lineIndex === 0 ? item.quantity : ''}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right">
                              {lineIndex === 0 ? `$${item.unit_price.toFixed(2)}` : ''}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                              {lineIndex === 0 ? `$${(item.quantity * item.unit_price).toFixed(2)}` : ''}
                            </td>
                          </tr>
                        ));
                      })}
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