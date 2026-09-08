import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CareConnect UI ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
          <div className="card border-0 shadow-lg rounded-4 p-5 text-center" style={{ maxWidth: '540px' }}>
            <div className="mx-auto mb-3 p-3 rounded-circle bg-danger-subtle text-danger d-inline-flex">
              <AlertTriangle size={36} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Something went wrong</h4>
            <p className="text-muted text-sm mb-4">
              An unexpected error occurred while loading this page. You can try refreshing or returning to the home screen.
            </p>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <button 
                className="btn btn-primary rounded-pill px-4 py-2 text-sm fw-semibold d-flex align-items-center gap-2"
                onClick={this.handleReload}
              >
                <RefreshCw size={16} />
                <span>Refresh Page</span>
              </button>
              <button 
                className="btn btn-outline-secondary rounded-pill px-4 py-2 text-sm fw-semibold d-flex align-items-center gap-2"
                onClick={this.handleHome}
              >
                <Home size={16} />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
