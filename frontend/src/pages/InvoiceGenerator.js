import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaDownload, FaEye, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function InvoiceGenerator() {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    tax_rate: 13,
    notes: '',
    payment_terms: 'Net 30',
    items: [{ description: '', quantity: 1, unit_price: 0, service_type: '', notes: '' }]
  });

  // Company info
  const [companyInfo, setCompanyInfo] = useState({
    name: 'J-I Heating & Cooling',
    address: 'Toronto, ON',
    phone: '(416) 555-0123',
    email: 'info@ji-hvac.com'
  });

  useEffect(() => {
    // Check if user is authenticated
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      navigate('/login');
      return;
    }
    
    fetchInvoices();
  }, [navigate]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const sessionId = localStorage.getItem('adminSessionId');
      const response = await fetch(`${config.API_URL}/api/invoices`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('adminSessionId');
        navigate('/login');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.invoices);
      } else {
        setError('Failed to fetch invoices');
      }
    } catch (error) {
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
    
    // Recalculate item total
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, unit_price: 0, service_type: '', notes: '' }]
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
      const sessionId = localStorage.getItem('adminSessionId');
      const invoiceData = {
        customer_id: Date.now(), // Simple ID generation
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        customer_address: form.customer_address,
        due_date: form.due_date,
        items: form.items,
        tax_rate: form.tax_rate,
        notes: form.notes,
        payment_terms: form.payment_terms,
        company_info: companyInfo
      };

      const url = editingInvoice 
        ? `${config.API_URL}/api/invoices/${editingInvoice.id}`
        : `${config.API_URL}/api/invoices`;
      
      const method = editingInvoice ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        },
        body: JSON.stringify(invoiceData)
      });

      if (response.status === 401) {
        localStorage.removeItem('adminSessionId');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setForm({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          customer_address: '',
          due_date: '',
          tax_rate: 13,
          notes: '',
          payment_terms: 'Net 30',
          items: [{ description: '', quantity: 1, unit_price: 0, service_type: '', notes: '' }]
        });
        setShowForm(false);
        setEditingInvoice(null);
        fetchInvoices();
      } else {
        setError(data.error || 'Failed to save invoice');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setForm({
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      customer_phone: invoice.customer_phone || '',
      customer_address: invoice.customer_address || '',
      due_date: new Date(invoice.due_date).toISOString().split('T')[0],
      tax_rate: invoice.tax_rate,
      notes: invoice.notes || '',
      payment_terms: invoice.payment_terms,
      items: invoice.InvoiceItems || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const sessionId = localStorage.getItem('adminSessionId');
      const response = await fetch(`${config.API_URL}/api/invoices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('adminSessionId');
        navigate('/login');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        fetchInvoices();
      } else {
        setError('Failed to delete invoice');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const downloadPDF = (id) => {
    const sessionId = localStorage.getItem('adminSessionId');
    window.open(`${config.API_URL}/api/invoices/${id}/pdf?token=${sessionId}`, '_blank');
  };

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      await fetch(`${config.API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminSessionId');
      navigate('/login');
    }
  };

  const viewInvoice = (invoice) => {
    // You can implement a modal or redirect to a view page
    console.log('View invoice:', invoice);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '2.2rem' }}>Invoice Generator</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {showForm ? 'Cancel' : 'Create New Invoice'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: 8, 
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          boxShadow: 'var(--color-shadow)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
            {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label>Customer Name *</label>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label>Customer Email *</label>
                <input
                  name="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label>Customer Phone</label>
                <input
                  name="customer_phone"
                  type="tel"
                  value={form.customer_phone}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label>Due Date *</label>
                <input
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label>Customer Address</label>
              <textarea
                name="customer_address"
                value={form.customer_address}
                onChange={handleFormChange}
                rows="2"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Invoice Items</h4>
              {form.items.map((item, index) => (
                <div key={index} style={{ 
                  border: '1px solid var(--color-gray)', 
                  borderRadius: 8, 
                  padding: '1rem', 
                  marginBottom: '1rem',
                  background: '#f9f9f9'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                      <label>Description *</label>
                      <input
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                      />
                    </div>
                    <div>
                      <label>Quantity</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                      />
                    </div>
                    <div>
                      <label>Unit Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                      />
                    </div>
                    <div>
                      <label>Total</label>
                      <input
                        value={`$${(item.quantity * item.unit_price).toFixed(2)}`}
                        readOnly
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4, background: '#f0f0f0' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={form.items.length === 1}
                      style={{
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addItem}
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaPlus /> Add Item
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label>Tax Rate (%)</label>
                <input
                  name="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.tax_rate}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label>Payment Terms</label>
                <select
                  name="payment_terms"
                  value={form.payment_terms}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                rows="3"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-gray)', borderRadius: 4 }}
              />
            </div>

            <div style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: 8, 
              marginBottom: '1.5rem',
              border: '1px solid var(--color-gray)'
            }}>
              <h4 style={{ marginBottom: '1rem' }}>Invoice Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Tax ({form.tax_rate}%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.75rem 1.5rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Saving...' : (editingInvoice ? 'Update Invoice' : 'Create Invoice')}
            </button>
          </form>
        </div>
      )}

      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        boxShadow: 'var(--color-shadow)',
        padding: '2rem'
      }}>
        <h3 style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>Invoice History</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No invoices found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray)' }}>Invoice #</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray)' }}>Customer</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray)' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray)' }}>Due Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray)' }}>Total</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray)' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{invoice.invoice_number}</td>
                    <td style={{ padding: '1rem' }}>{invoice.customer_name}</td>
                                         <td style={{ padding: '1rem' }}>{new Date(invoice.createdAt || invoice.issue_date || Date.now()).toLocaleDateString()}</td>
                     <td style={{ padding: '1rem' }}>{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>${invoice.total_amount}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: invoice.status === 'paid' ? '#d4edda' : 
                                   invoice.status === 'overdue' ? '#f8d7da' : '#fff3cd',
                        color: invoice.status === 'paid' ? '#155724' : 
                               invoice.status === 'overdue' ? '#721c24' : '#856404'
                                             }}>
                         {(invoice.status || 'draft').toUpperCase()}
                       </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => viewInvoice(invoice)}
                          style={{
                            background: '#17a2b8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '0.5rem',
                            cursor: 'pointer'
                          }}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          style={{
                            background: '#ffc107',
                            color: '#000',
                            border: 'none',
                            borderRadius: 4,
                            padding: '0.5rem',
                            cursor: 'pointer'
                          }}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => downloadPDF(invoice.id)}
                          style={{
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '0.5rem',
                            cursor: 'pointer'
                          }}
                          title="Download PDF"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          style={{
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '0.5rem',
                            cursor: 'pointer'
                          }}
                          title="Delete"
                        >
                          <FaTrash />
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
    </div>
  );
}

export default InvoiceGenerator; 