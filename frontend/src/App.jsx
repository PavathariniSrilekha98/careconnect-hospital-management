import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
