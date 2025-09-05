// =====================================================
// COMPREHENSIVE APP FUNCTIONALITY TESTING
// =====================================================

const config = {
  SUPABASE_URL: 'https://ljsthabxoycpgizmpavx.supabase.co',
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here',
  SUPABASE_SERVICE_ROLE_KEY: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_role_key_here'
};

// Test data for different forms
const testData = {
  contact: {
    name: 'Test Contact',
    email: 'test@example.com',
    phone: '416-555-0123',
    message: 'This is a test contact form submission',
    service_type: 'general_inquiry'
  },
  service: {
    name: 'Test Service',
    email: 'service@example.com',
    phone: '416-555-0124',
    address: '123 Test Street, Toronto, ON',
    service_type: 'fan_coil',
    description: 'Test service request for fan coil maintenance'
  },
  emergency: {
    customer_info: 'Test Emergency',
    email: 'emergency@example.com',
    phone: '416-555-0125',
    address: '456 Emergency Ave, Toronto, ON',
    issue: 'Test emergency HVAC issue'
  },
  invoice: {
    customer_name: 'Test Customer',
    customer_email: 'customer@example.com',
    customer_phone: '416-555-0126',
    customer_address: '789 Invoice St, Toronto, ON',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tax_rate: 13,
    notes: 'Test invoice with bullet points',
    payment_terms: 'Net 30',
    items: [
      {
        description: '• Fan coil installation\n• Air filter replacement\n• System testing',
        quantity: 1,
        unit_price: 500.00
      }
    ]
  }
};

// Test functions
async function testContactForm() {
  console.log('🧪 Testing Contact Form...');
  try {
    const response = await fetch(`${config.SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${config.SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData.contact)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Contact form test PASSED');
      console.log('   - Data saved to contacts table');
      console.log('   - Response:', data);
      return true;
    } else {
      console.log('❌ Contact form test FAILED');
      console.log('   - Status:', response.status);
      console.log('   - Error:', await response.text());
      return false;
    }
  } catch (error) {
    console.log('❌ Contact form test ERROR:', error.message);
    return false;
  }
}

async function testServiceForm() {
  console.log('🧪 Testing Service Request Form...');
  try {
    const response = await fetch(`${config.SUPABASE_URL}/rest/v1/service_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${config.SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData.service)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Service form test PASSED');
      console.log('   - Data saved to service_requests table');
      console.log('   - Response:', data);
      return true;
    } else {
      console.log('❌ Service form test FAILED');
      console.log('   - Status:', response.status);
      console.log('   - Error:', await response.text());
      return false;
    }
  } catch (error) {
    console.log('❌ Service form test ERROR:', error.message);
    return false;
  }
}

async function testEmergencyForm() {
  console.log('🧪 Testing Emergency Form...');
  try {
    const response = await fetch(`${config.SUPABASE_URL}/rest/v1/emergency_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${config.SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData.emergency)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Emergency form test PASSED');
      console.log('   - Data saved to emergency_requests table');
      console.log('   - Response:', data);
      return true;
    } else {
      console.log('❌ Emergency form test FAILED');
      console.log('   - Status:', response.status);
      console.log('   - Error:', await response.text());
      return false;
    }
  } catch (error) {
    console.log('❌ Emergency form test ERROR:', error.message);
    return false;
  }
}

async function testInvoiceCreation() {
  console.log('🧪 Testing Invoice Creation...');
  try {
    // Calculate totals
    const subtotal = testData.invoice.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const taxAmount = subtotal * (testData.invoice.tax_rate / 100);
    const totalAmount = subtotal + taxAmount;
    
    const invoiceData = {
      ...testData.invoice,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: 'draft'
    };
    
    // Create invoice
    const invoiceResponse = await fetch(`${config.SUPABASE_URL}/rest/v1/Invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(invoiceData)
    });
    
    if (invoiceResponse.ok) {
      const invoice = await invoiceResponse.json();
      console.log('✅ Invoice creation test PASSED');
      console.log('   - Invoice saved to Invoices table');
      console.log('   - Invoice ID:', invoice[0].id);
      
      // Create invoice items
      for (const item of testData.invoice.items) {
        const itemResponse = await fetch(`${config.SUPABASE_URL}/rest/v1/InvoiceItems`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            invoice_id: invoice[0].id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.quantity * item.unit_price
          })
        });
        
        if (itemResponse.ok) {
          console.log('   - Invoice item saved with bullet points');
        } else {
          console.log('   - Invoice item save failed');
        }
      }
      
      return true;
    } else {
      console.log('❌ Invoice creation test FAILED');
      console.log('   - Status:', invoiceResponse.status);
      console.log('   - Error:', await invoiceResponse.text());
      return false;
    }
  } catch (error) {
    console.log('❌ Invoice creation test ERROR:', error.message);
    return false;
  }
}

async function testDatabaseTables() {
  console.log('🧪 Testing Database Tables...');
  try {
    const tables = ['contacts', 'service_requests', 'emergency_requests', 'Invoices', 'InvoiceItems'];
    let allTablesExist = true;
    
    for (const table of tables) {
      const response = await fetch(`${config.SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`, {
        headers: {
          'apikey': config.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${config.SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        console.log(`✅ Table '${table}' exists and is accessible`);
      } else {
        console.log(`❌ Table '${table}' not accessible (${response.status})`);
        allTablesExist = false;
      }
    }
    
    return allTablesExist;
  } catch (error) {
    console.log('❌ Database tables test ERROR:', error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive App Testing...\n');
  
  const results = {
    database: await testDatabaseTables(),
    contact: await testContactForm(),
    service: await testServiceForm(),
    emergency: await testEmergencyForm(),
    invoice: await testInvoiceCreation()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Database Tables: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Contact Form: ${results.contact ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Service Form: ${results.service ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Emergency Form: ${results.emergency ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Invoice Creation: ${results.invoice ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your app is ready for deployment.');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
  }
  
  return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testData }; 