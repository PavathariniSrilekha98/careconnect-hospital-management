import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Activity } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading hospital records...', text, fullScreen = false, fullPage = false }) => {
  const displayMsg = text || message;
  const isFull = fullScreen || fullPage;

  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
      <div className="position-relative mb-3">
        <Spinner animation="border" variant="primary" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '3px' }} />
        <Activity
          size={20}
          className="text-primary position-absolute top-50 start-50 translate-middle animate-pulse"
        />
      </div>
      <h6 className="fw-semibold text-secondary mb-1">{displayMsg}</h6>
      <small className="text-muted">Connecting securely to real-time system</small>
    </div>
  );

  if (isFull) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

