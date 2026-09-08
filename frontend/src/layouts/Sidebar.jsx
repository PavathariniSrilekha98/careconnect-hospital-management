import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarCheck,
  Clock,
  Bell,
  FileText,
  User,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Layers,
  BarChart3,
  ScrollText,
  Activity,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isPatient, isDoctor, isAdmin, logout } = useAuth();
  const { notifications } = useWebSocket();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/book', label: 'Book Appointment', icon: CalendarPlus },
    { to: '/patient/appointments', label: 'My Appointments', icon: CalendarCheck },
    { to: '/patient/live-queue', label: 'Live Queue Tracker', icon: Clock },
    { to: '/patient/notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { to: '/patient/history', label: 'Consultation Records', icon: FileText },
    { to: '/patient/profile', label: 'My Profile', icon: User },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor/queue', label: 'Queue Controller', icon: Activity },
    { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { to: '/doctor/history', label: 'Consultation Records', icon: FileText },
    { to: '/doctor/profile', label: 'Doctor Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/doctors', label: 'Doctors Directory', icon: Stethoscope },
    { to: '/admin/patients', label: 'Patients Management', icon: Users },
    { to: '/admin/appointments', label: 'All Appointments', icon: CalendarCheck },
    { to: '/admin/queues', label: 'Live Queue Control', icon: Layers },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/audit-logs', label: 'System Audit Logs', icon: ScrollText },
  ];

  let links = [];
  let roleTitle = 'User Portal';
  let roleColor = '#0284c7'; // default blue

  if (isAdmin) {
    links = adminLinks;
    roleTitle = 'Admin Console';
    roleColor = '#7c3aed';
  } else if (isDoctor) {
    links = doctorLinks;
    roleTitle = 'Doctor Portal';
    roleColor = '#0f766e';
  } else if (isPatient) {
    links = patientLinks;
    roleTitle = 'Patient Portal';
    roleColor = '#0284c7';
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none"
          style={{ zIndex: 1025 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`med-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* User Card */}
        <div className="p-3 border-bottom bg-light">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span 
              className="badge rounded-pill text-white text-xxs px-2.5 py-1" 
              style={{ backgroundColor: roleColor }}
            >
              {roleTitle}
            </span>
            <button 
              className="btn btn-sm btn-link text-muted p-0 d-lg-none"
              onClick={onClose}
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div 
              className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold text-sm shadow-sm flex-shrink-0"
              style={{ width: '38px', height: '38px', backgroundColor: roleColor }}
            >
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="fw-bold text-dark text-sm text-truncate">{user?.fullName || 'User'}</div>
              <div className="text-muted text-xs text-truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-2 flex-grow-1 overflow-auto">
          <ul className="nav nav-pills flex-column gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li className="nav-item" key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 text-sm fw-medium transition-colors ${
                        isActive
                          ? 'active text-white shadow-sm'
                          : 'text-secondary hover-bg-light'
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? roleColor : 'transparent',
                      color: isActive ? '#ffffff' : '#334155'
                    })}
                  >
                    <div className="d-flex align-items-center gap-2.5">
                      <Icon size={18} strokeWidth={2} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="badge bg-danger rounded-pill text-xxs px-2 py-0.5">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer info / Logout */}
        <div className="p-3 border-top bg-light mt-auto">
          <button 
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 fw-semibold"
            onClick={logout}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
