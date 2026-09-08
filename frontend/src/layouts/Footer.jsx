import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, ShieldCheck, HeartPulse, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-top bg-white mt-auto">
      {/* Top Banner with Emergency Contact */}
      <div className="bg-primary text-white py-2 px-3" style={{ background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)' }}>
        <div className="container d-flex flex-wrap align-items-center justify-content-between text-xs">
          <div className="d-flex align-items-center gap-2 py-1">
            <HeartPulse size={16} className="text-warning" />
            <span className="fw-semibold">Emergency Trauma Care:</span>
            <span className="badge bg-danger text-white">24/7 Available</span>
          </div>
          <div className="d-flex align-items-center gap-4 py-1">
            <div className="d-flex align-items-center gap-1">
              <Phone size={14} />
              <span>Hotline: <strong>+1 (800) 555-CARE</strong></span>
            </div>
            <div className="d-none d-sm-flex align-items-center gap-1">
              <Clock size={14} />
              <span>OPD Timings: <strong>8:00 AM - 8:00 PM</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Hospital Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm text-white" 
                style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
              >
                <Activity size={22} strokeWidth={2.5} />
              </div>
              <div>
                <span className="fw-bold text-dark fs-5 tracking-tight d-block leading-none">CareConnect Multi-Speciality Hospital</span>
                <span className="text-muted text-xs">Smart Queue & Patient Care Center</span>
              </div>
            </div>
            <p className="text-muted text-sm mb-3">
              Transforming outpatient visits with intelligent real-time queue management, instant digital token tracking, and streamlined doctor consultations.
            </p>
            <div className="d-flex align-items-center gap-2 text-xs text-muted">
              <ShieldCheck size={16} className="text-success" />
              <span>HIPAA Compliant • ISO 9001:2025 Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-dark text-sm mb-3">Patient Portal</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-sm">
              <li><Link to="/patient/book" className="text-muted text-decoration-none hover-text-primary">Book Appointment</Link></li>
              <li><Link to="/patient/live-queue" className="text-muted text-decoration-none hover-text-primary">Live Queue Tracker</Link></li>
              <li><Link to="/patient/appointments" className="text-muted text-decoration-none hover-text-primary">My Appointments</Link></li>
              <li><Link to="/check-in" className="text-muted text-decoration-none hover-text-primary">QR Check-in Kiosk</Link></li>
              <li><Link to="/patient/history" className="text-muted text-decoration-none hover-text-primary">Medical Records</Link></li>
            </ul>
          </div>

          {/* Clinical Departments */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="fw-bold text-dark text-sm mb-3">Departments</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-sm">
              <li><Link to="/departments" className="text-muted text-decoration-none hover-text-primary">Cardiology & Heart Center</Link></li>
              <li><Link to="/departments" className="text-muted text-decoration-none hover-text-primary">Orthopedics & Joint Care</Link></li>
              <li><Link to="/departments" className="text-muted text-decoration-none hover-text-primary">General Medicine & OPD</Link></li>
              <li><Link to="/departments" className="text-muted text-decoration-none hover-text-primary">Pediatrics & Child Health</Link></li>
              <li><Link to="/departments" className="text-muted text-decoration-none hover-text-primary">Dental & Orthodontics</Link></li>
            </ul>
          </div>

          {/* Hospital Location & TV Screen */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark text-sm mb-3">Hospital Information</h6>
            <div className="d-flex flex-column gap-2.5 text-sm text-muted">
              <div className="d-flex align-items-start gap-2">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <span>450 Healthcare Boulevard, Medical District, Suite 100</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span>support@careconnecthospital.com</span>
              </div>
              <div className="mt-2">
                <Link 
                  to="/display" 
                  target="_blank"
                  className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-semibold text-xs py-2"
                >
                  Open Public TV Waiting Screen
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-top mt-4 pt-4 d-flex flex-wrap align-items-center justify-content-between text-xs text-muted">
          <div>
            &copy; {new Date().getFullYear()} CareConnect Multi-Speciality Hospital Queue Management System. All rights reserved.
          </div>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <Link to="/about" className="text-muted text-decoration-none hover-text-primary">About System</Link>
            <span>•</span>
            <Link to="/login" className="text-muted text-decoration-none hover-text-primary">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
