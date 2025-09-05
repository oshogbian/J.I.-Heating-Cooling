import React from 'react';

// Simplified Frontend Error Reporting
class ErrorReporter {
  constructor() {
    // Disable error reporting in production to avoid process.env issues
    this.enabled = false;
    this.serviceName = 'ji-hvac-frontend';
    this.version = '1.0.0';
  }

  // Setup global error handling
  setupGlobalErrorHandling() {
    if (!this.enabled) return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(new Error(event.reason), {
        type: 'unhandledrejection',
        component: 'global'
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.reportError(event.error || new Error(event.message), {
        type: 'global-error',
        component: 'global',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }

  // Report an error with detailed logging for debugging
  async reportError(error, context = {}) {
    if (!this.enabled) {
      console.warn('Error reporting disabled:', error);
      return;
    }

    try {
      // Create comprehensive error log
      const errorLog = {
        timestamp: new Date().toISOString(),
        service: this.serviceName,
        version: this.version,
        error: {
          message: error.message || 'Unknown error',
          name: error.name || 'Error',
          stack: error.stack
        },
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          component: context.component || 'unknown',
          action: context.action || 'unknown',
          type: context.type || 'frontend-error',
          user: context.user || 'anonymous'
        }
      };

      // Log to console for immediate debugging
      console.error('🚨 Error Report:', errorLog);

      // Store in localStorage for debugging
      if (typeof window !== 'undefined' && window.localStorage) {
        const errorHistory = JSON.parse(localStorage.getItem('errorHistory') || '[]');
        errorHistory.push(errorLog);
        
        // Keep only last 10 errors
        if (errorHistory.length > 10) {
          errorHistory.splice(0, errorHistory.length - 10);
        }
        
        localStorage.setItem('errorHistory', JSON.stringify(errorHistory));
      }

    } catch (reportingError) {
      console.error('Error in error reporting:', reportingError);
    }
  }

  // Report React component errors
  reportComponentError(error, errorInfo) {
    this.reportError(error, {
      component: errorInfo.componentStack || 'unknown',
      action: 'component-error',
      type: 'react-error'
    });
  }

  // Report API errors
  reportApiError(error, endpoint, method, statusCode) {
    this.reportError(error, {
      type: 'api-error',
      component: 'api',
      action: `${method} ${endpoint}`,
      statusCode: statusCode
    });
  }

  // Report PDF generation errors
  reportPdfError(error, action) {
    this.reportError(error, {
      type: 'pdf-error',
      component: 'pdf-generator',
      action: action
    });
  }
}

// Create a singleton instance
export const errorReporter = new ErrorReporter();

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    errorReporter.reportError(error, {
      type: 'react-error-boundary',
      component: 'error-boundary',
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          color: '#333'
        }}>
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 