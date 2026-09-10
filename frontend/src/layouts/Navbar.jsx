import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  Activity, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  CalendarPlus,
  CalendarCheck, 
  QrCode, 
  Shield, 
  Stethoscope, 
  Clock, 
  Building2,
  Users,
  Layers,
  BarChart3,
  CheckCheck,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { notificationService } from '../services/notificationService';

const Navbar = ({ onToggleSidebar, showSidebarToggle }) => {
  const { user, isAuthenticated, logout, isPatient, isDoctor, isAdmin } = useAuth();
  const { connected, notifications } = useWebSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isDoctor) return '/doctor/dashboard';
    if (isPatient) return '/patient/dashboard';
    return '/';
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Role-specific badge theme
  const roleColor = isAdmin ? '#7c3aed' : isDoctor ? '#0f766e' : '#0284c7';
  const roleLabel = isAdmin ? 'Admin' : isDoctor ? 'Doctor' : 'Patient';

  return (
    <header className="med-navbar border-bottom bg-white sticky-top shadow-sm" style={{ zIndex: 1040, height: '70px' }}>
      <div className="container-fluid px-3 px-lg-4 h-100">
        <div className="d-flex align-items-center justify-content-between h-100">
          {/* Brand & Mobile Sidebar Toggle */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {showSidebarToggle && (
              <button 
                className="btn btn-outline-secondary btn-sm d-lg-none p-1.5 d-flex align-items-center"
                onClick={onToggleSidebar}
                aria-label="Toggle Sidebar Menu"
              >
                <Menu size={18} />
              </button>
            )}

            <Link to={getDashboardLink()} className="d-flex align-items-center gap-2 text-decoration-none text-dark">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm text-white" 
                style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
              >
                <Activity size={22} strokeWidth={2.5} />
              </div>
              <div>
                <span className="fw-bold text-dark fs-6 tracking-tight d-block leading-none">CareConnect</span>
                <span className="badge rounded-pill text-white fw-semibold" style={{ fontSize: '9px', backgroundColor: roleColor }}>
                  {isAuthenticated ? `${roleLabel} Portal` : 'Smart Queue'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (Strictly Role Segregated) */}
          <nav className="d-none d-md-flex align-items-center gap-1">
            {!isAuthenticated ? (
              // 1. Public Links for Unauthenticated Guests
              <>
                <Link 
                  to="/" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm ${isActive('/') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/departments" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm ${isActive('/departments') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  Departments
                </Link>
                <Link 
                  to="/doctors" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm ${isActive('/doctors') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  Doctors
                </Link>
                <Link 
                  to="/check-in" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/check-in') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <QrCode size={15} />
                  QR Check-in
                </Link>
              </>
            ) : isAdmin ? (
              // 2. Admin Only Top Links
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/admin/dashboard') ? 'bg-purple-50 text-purple-700 fw-semibold border-purple-200' : 'text-secondary hover-bg-light'}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <Link 
                  to="/admin/departments" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/admin/departments') ? 'bg-purple-50 text-purple-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <Building2 size={15} />
                  Departments
                </Link>
                <Link 
                  to="/admin/doctors" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/admin/doctors') ? 'bg-purple-50 text-purple-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <Stethoscope size={15} />
                  Doctors
                </Link>
                <Link 
                  to="/admin/patients" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/admin/patients') ? 'bg-purple-50 text-purple-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <Users size={15} />
                  Patients
                </Link>
                <Link 
                  to="/admin/queues" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/admin/queues') ? 'bg-purple-50 text-purple-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <Layers size={15} />
                  Queue Control
                </Link>
                <Link 
                  to="/admin/reports" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/admin/reports') ? 'bg-purple-50 text-purple-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <BarChart3 size={15} />
                  Analytics
                </Link>
              </>
            ) : isDoctor ? (
              // 3. Doctor Only Top Links
              <>
                <Link 
                  to="/doctor/dashboard" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/doctor/dashboard') ? 'bg-teal-50 text-teal-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <Link 
                  to="/doctor/queue" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/doctor/queue') ? 'bg-teal-50 text-teal-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <Activity size={15} />
                  Queue Controller
                </Link>
                <Link 
                  to="/doctor/history" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/doctor/history') ? 'bg-teal-50 text-teal-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <FileText size={15} />
                  EMR & Records
                </Link>
                <Link 
                  to="/doctor/appointments" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/doctor/appointments') ? 'bg-teal-50 text-teal-700 fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <CalendarCheck size={15} />
                  Appointments
                </Link>
              </>
            ) : (
              // 4. Patient Only Top Links
              <>
                <Link 
                  to="/patient/dashboard" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/patient/dashboard') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <Link 
                  to="/patient/book" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/patient/book') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <CalendarPlus size={15} />
                  Book Appointment
                </Link>
                <Link 
                  to="/patient/appointments" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/patient/appointments') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <CalendarCheck size={15} />
                  My Appointments
                </Link>
                <Link 
                  to="/patient/history" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/patient/history') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <FileText size={15} />
                  Medical Records
                </Link>
                <Link 
                  to="/patient/live-queue" 
                  className={`nav-link px-3 py-1.5 rounded-pill fw-medium text-sm d-flex align-items-center gap-1 ${isActive('/patient/live-queue') ? 'bg-primary-subtle text-primary fw-semibold' : 'text-secondary hover-bg-light'}`}
                >
                  <Clock size={15} />
                  Live Tracker
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Items */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {/* Live WebSocket Status Indicator */}
            <div 
              className={`d-none d-sm-flex align-items-center gap-1 px-2.5 py-1 rounded-pill text-xs fw-medium ${
                connected ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'
              }`}
              title={connected ? 'Real-time WebSocket Live' : 'Connecting to WebSocket...'}
              style={{ fontSize: '11px' }}
            >
              <span 
                className={`d-inline-block rounded-circle ${connected ? 'bg-success' : 'bg-warning'}`} 
                style={{ width: '7px', height: '7px' }}
              />
              {connected ? 'Live Sync' : 'Connecting'}
            </div>

            {isAuthenticated ? (
              <>
                {/* Notification Bell Dropdown */}
                <div className="position-relative">
                  <button 
                    className="btn btn-light rounded-circle p-2 position-relative border"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    aria-label="Notifications"
                  >
                    <Bell size={18} className="text-secondary" />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div 
                      className="dropdown-menu show dropdown-menu-end shadow-lg border p-0 mt-2 position-absolute"
                      style={{ width: '320px', maxWidth: '90vw', right: 0, zIndex: 1050, borderRadius: '12px' }}
                    >
                      <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light rounded-top">
                        <span className="fw-bold text-dark text-sm">Notifications</span>
                        {notifications.length > 0 && (
                          <button 
                            className="btn btn-link btn-sm text-primary p-0 text-decoration-none text-xs d-flex align-items-center gap-1"
                            onClick={handleMarkAllRead}
                          >
                            <CheckCheck size={14} /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="overflow-auto" style={{ maxHeight: '280px' }}>
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-muted text-sm">
                            <Bell size={24} className="mb-2 text-secondary opacity-50" />
                            <p className="mb-0">No new notifications</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n, i) => (
                            <div key={n.id || i} className={`p-3 border-bottom hover-bg-light ${n.isRead ? '' : 'bg-blue-50'}`}>
                              <div className="d-flex align-items-start justify-content-between">
                                <span className="fw-semibold text-xs text-dark">{n.title}</span>
                                <span className="text-muted" style={{ fontSize: '10px' }}>
                                  {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                </span>
                              </div>
                              <p className="mb-0 text-xs text-muted mt-1">{n.message}</p>
                              {n.tokenNumber && (
                                <span className="badge bg-primary-subtle text-primary text-xxs mt-1">
                                  Token: {n.tokenNumber}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {isPatient && (
                        <div className="p-2 border-top text-center bg-light rounded-bottom">
                          <Link 
                            to="/patient/notifications" 
                            className="text-xs text-primary fw-semibold text-decoration-none"
                            onClick={() => setShowNotifications(false)}
                          >
                            View all notifications &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="position-relative">
                  <button 
                    className="btn btn-light rounded-pill border d-flex align-items-center gap-2 p-1.5 pe-3"
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                  >
                    <div 
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold text-xs"
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        backgroundColor: roleColor 
                      }}
                    >
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="d-none d-sm-block text-start">
                      <div className="fw-bold text-dark text-xs leading-none" style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.fullName?.split(' ')[0] || 'Account'}
                      </div>
                      <span className="text-muted text-xxs d-block" style={{ fontSize: '10px' }}>
                        {user?.role}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div 
                      className="dropdown-menu show dropdown-menu-end shadow-lg border p-2 mt-2 position-absolute"
                      style={{ width: '220px', right: 0, zIndex: 1050, borderRadius: '12px' }}
                    >
                      <div className="px-3 py-2 border-bottom mb-1">
                        <p className="fw-bold text-dark text-sm mb-0">{user?.fullName}</p>
                        <p className="text-muted text-xs mb-0">{user?.email}</p>
                        <span className="badge rounded-pill text-white text-xxs mt-1 px-2 py-0.5" style={{ backgroundColor: roleColor }}>
                          {user?.role}
                        </span>
                      </div>

                      <Link 
                        to={getDashboardLink()} 
                        className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard size={16} className="text-muted" />
                        My Dashboard
                      </Link>

                      {isPatient && (
                        <>
                          <Link 
                            to="/patient/appointments" 
                            className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <CalendarCheck size={16} className="text-muted" />
                            My Appointments
                          </Link>
                          <Link 
                            to="/patient/history" 
                            className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FileText size={16} className="text-muted" />
                            Medical Records
                          </Link>
                          <Link 
                            to="/patient/live-queue" 
                            className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Clock size={16} className="text-muted" />
                            Live Tracker
                          </Link>
                          <Link 
                            to="/patient/profile" 
                            className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <UserIcon size={16} className="text-muted" />
                            My Profile
                          </Link>
                        </>
                      )}

                      {isDoctor && (
                        <>
                          <Link 
                            to="/doctor/queue" 
                            className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Activity size={16} className="text-muted" />
                            Queue Controller
                          </Link>
                          <Link 
                            to="/doctor/history" 
                            className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FileText size={16} className="text-muted" />
                            EMR & Consultation Records
                          </Link>
                          <Link 
                            to="/doctor/profile" 
                            className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <UserIcon size={16} className="text-muted" />
                            Doctor Profile
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link 
                          to="/admin/departments" 
                          className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield size={16} className="text-muted" />
                          Admin Console
                        </Link>
                      )}

                      <div className="dropdown-divider my-1"></div>

                      <button 
                        className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-sm text-danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link 
                  to="/login" 
                  className="btn btn-light btn-sm rounded-pill px-3 py-1.5 fw-medium text-secondary border hover-bg-light"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm rounded-pill px-3 py-1.5 fw-semibold shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Nav Toggle */}
            <button 
              className="btn btn-light btn-sm rounded-circle d-md-none p-2 border"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="d-md-none border-top py-3 bg-white animate-fade-in shadow-sm">
            <div className="d-flex flex-column gap-1">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Home
                  </Link>
                  <Link to="/departments" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Departments
                  </Link>
                  <Link to="/doctors" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Doctors
                  </Link>
                  <Link to="/check-in" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    QR Check-in Kiosk
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <Link to="/admin/dashboard" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/departments" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Departments
                  </Link>
                  <Link to="/admin/doctors" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Doctors Directory
                  </Link>
                  <Link to="/admin/patients" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Patients
                  </Link>
                  <Link to="/admin/queues" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Queue Control
                  </Link>
                  <Link to="/admin/reports" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Analytics
                  </Link>
                </>
              ) : isDoctor ? (
                <>
                  <Link to="/doctor/dashboard" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Doctor Dashboard
                  </Link>
                  <Link to="/doctor/queue" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Queue Controller
                  </Link>
                  <Link to="/doctor/history" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    EMR & Consultation Records
                  </Link>
                  <Link to="/doctor/appointments" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Appointments
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/patient/dashboard" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Patient Dashboard
                  </Link>
                  <Link to="/patient/book" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Book Appointment
                  </Link>
                  <Link to="/patient/appointments" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    My Appointments
                  </Link>
                  <Link to="/patient/history" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Medical & Consultation Records
                  </Link>
                  <Link to="/patient/live-queue" className="nav-link py-2 px-3 rounded-2 fw-medium text-dark hover-bg-light" onClick={() => setMobileNavOpen(false)}>
                    Live Queue Tracker
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
