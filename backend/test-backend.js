const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins during testing
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Simple auth test
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'ji-hvac-2024') {
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
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

// Test PDF generation
app.get('/api/test/pdf', (req, res) => {
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="test.pdf"');
  
  doc.pipe(res);
  doc.fontSize(20).text('Test PDF Generation', 100, 100);
  doc.fontSize(12).text('If you can see this, PDF generation is working!', 100, 150);
  doc.end();
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log('- GET /api/test');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/test/pdf');
}); 