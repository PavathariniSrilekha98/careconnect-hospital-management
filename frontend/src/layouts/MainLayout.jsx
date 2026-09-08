import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ requireSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide sidebar and standard footer on public kiosk/display routes
  const isKioskOrDisplay = location.pathname === '/display' || location.pathname === '/check-in';
  const showSidebar = requireSidebar && isAuthenticated && !isKioskOrDisplay;

  return (
    <div className="d-flex flex-column min-vh-100 bg-app">
      {!isKioskOrDisplay && (
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showSidebarToggle={showSidebar}
        />
      )}

      <div className="d-flex flex-grow-1 position-relative">
        {showSidebar && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}

        <main 
          className={`flex-grow-1 transition-all ${
            showSidebar ? 'sidebar-margin-lg p-3 p-md-4' : 'p-0'
          }`}
          style={{
            minHeight: 'calc(100vh - 70px)',
            marginLeft: showSidebar ? undefined : 0
          }}
        >
          <Outlet />
        </main>
      </div>

      {!isKioskOrDisplay && !showSidebar && <Footer />}
    </div>
  );
};

export default MainLayout;
