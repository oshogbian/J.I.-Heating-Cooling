import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Emergency from './pages/Emergency';
import InvoiceGenerator from './pages/InvoiceGenerator';
import Login from './pages/Login';
import FanCoilService from './pages/FanCoilService';
import HeatPumpService from './pages/HeatPumpService';
import VentCleaningService from './pages/VentCleaningService';
import { errorReporter, ErrorBoundary } from './utils/errorReporting';

function App() {
  useEffect(() => {
    // Setup global error handling
    errorReporter.setupGlobalErrorHandling();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Header />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/login" element={<Login />} />
            <Route path="/invoices" element={<InvoiceGenerator />} />
            <Route path="/fan-coil-service" element={<FanCoilService />} />
            <Route path="/heat-pump-service" element={<HeatPumpService />} />
            <Route path="/vent-cleaning-service" element={<VentCleaningService />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
