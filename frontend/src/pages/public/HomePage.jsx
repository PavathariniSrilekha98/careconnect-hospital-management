import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  CalendarPlus, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  HeartPulse, 
  Stethoscope, 
  Phone, 
  AlertTriangle,
  Flame,
  ChevronRight
} from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { doctorService } from '../../services/doctorService';
import { useWebSocket } from '../../context/WebSocketContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';

const HomePage = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenSearch, setTokenSearch] = useState('');
  const { connected, lastEvent } = useWebSocket();
  const { isAuthenticated, isPatient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          departmentService.getAllDepartments(true),
          doctorService.getAllDoctors(null, true)
        ]);
        if (deptRes.success) setDepartments(deptRes.data || []);
        if (docRes.success) setDoctors(docRes.data || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lastEvent]);

  const handleTrackToken = (e) => {
    e.preventDefault();
    if (tokenSearch.trim()) {
      navigate(`/patient/live-queue?token=${encodeURIComponent(tokenSearch.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="position-relative overflow-hidden py-5 py-lg-6" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)' }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white border shadow-xs mb-3 text-xs fw-semibold text-primary">
                <span className="badge bg-primary text-white rounded-pill px-2 py-0.5">Live Sync</span>
                <span>Zero Physical Waiting Lines • Smart Real-Time OPD Queue</span>
              </div>

              <h1 className="display-4 fw-extrabold text-dark tracking-tight mb-3">
                Smart Hospital Queue Management, <span className="text-primary" style={{ color: '#0284c7' }}>Zero Waiting Hassle.</span>
              </h1>

              <p className="lead text-muted mb-4 fs-6" style={{ maxWidth: '600px' }}>
                Book appointments online, receive instant QR-enabled digital tokens, and track your live spot from anywhere on your phone. Get notified right when the doctor calls you.
              </p>

              {/* Quick Actions Bar */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <Link 
                  to={isAuthenticated ? (isPatient ? "/patient/book" : "/patient/dashboard") : "/login?redirect=/patient/book"} 
                  className="btn btn-primary btn-lg rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                >
                  <CalendarPlus size={20} />
                  Book Appointment
                </Link>

                <Link 
                  to="/check-in" 
                  className="btn btn-outline-secondary btn-lg rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 bg-white"
                >
                  <QrCode size={20} />
                  QR Check-in Kiosk
                </Link>
              </div>

              {/* Direct Token Tracker Input */}
              <div className="card border p-3 rounded-4 bg-white shadow-sm" style={{ maxWidth: '500px' }}>
                <form onSubmit={handleTrackToken} className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Clock size={18} className="text-primary" />
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 text-sm fw-semibold text-uppercase"
                      placeholder="Enter Token (e.g. CARD-001)"
                      value={tokenSearch}
                      onChange={(e) => setTokenSearch(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-dark rounded-3 px-3 fw-semibold text-sm d-flex align-items-center gap-1">
                    Track
                  </button>
                </form>
              </div>
            </div>

            {/* Right Live Hospital Queue Snapshot Card */}
            <div className="col-lg-5">
              <div className="med-card p-4 shadow-lg border rounded-4 position-relative bg-white">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">Live OPD Counter</h6>
                      <span className="text-muted text-xxs">Updated Real-Time via WebSocket</span>
                    </div>
                  </div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle text-xxs px-2.5 py-1">
                    {connected ? '● Live Connected' : '○ Connecting'}
                  </span>
                </div>

                {/* Department Live Queues */}
                <div className="d-flex flex-column gap-2.5">
                  {departments.slice(0, 4).map((dept) => (
                    <div key={dept.id} className="p-2.5 rounded-3 border bg-light d-flex align-items-center justify-content-between hover-bg-white transition-all">
                      <div>
                        <span className="fw-bold text-dark text-sm d-block">{dept.name}</span>
                        <span className="text-muted text-xxs">{dept.roomBlock}</span>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary rounded-pill text-xs px-2.5 py-1">
                          {dept.activeQueueCount || 0} in queue
                        </span>
                        <span className="text-muted text-xxs d-block mt-0.5">
                          ~{(dept.activeQueueCount || 0) * 10} mins wait
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emergency Notice */}
                <div className="mt-3 p-2.5 rounded-3 border border-danger-subtle bg-danger-subtle d-flex align-items-center gap-2">
                  <Flame size={18} className="text-danger flex-shrink-0" />
                  <span className="text-xs text-danger fw-semibold">
                    Emergency cases bypass the standard queue automatically.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2 text-xs">
              Seamless Healthcare Journey
            </span>
            <h2 className="fw-extrabold text-dark tracking-tight">How Smart Queue Works</h2>
            <p className="text-muted text-sm" style={{ maxWidth: '550px', margin: '0 auto' }}>
              Four simple steps from booking your slot at home to meeting your specialist doctor.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-sm-6">
              <div className="card h-100 p-4 border rounded-4 text-center hover-shadow transition-all bg-light">
                <div className="rounded-circle bg-primary text-white mx-auto d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '56px', height: '56px' }}>
                  <CalendarPlus size={24} />
                </div>
                <h5 className="fw-bold text-dark text-base mb-2">1. Book Online</h5>
                <p className="text-muted text-xs mb-0">
                  Select department, chosen specialist doctor, date, and preferred time slot in seconds.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card h-100 p-4 border rounded-4 text-center hover-shadow transition-all bg-light">
                <div className="rounded-circle bg-teal-600 text-white mx-auto d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '56px', height: '56px', backgroundColor: '#0f766e' }}>
                  <QrCode size={24} />
                </div>
                <h5 className="fw-bold text-dark text-base mb-2">2. Get QR Token</h5>
                <p className="text-muted text-xs mb-0">
                  Instant unique token number (e.g. CARD-005) and digital check-in QR code generated.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card h-100 p-4 border rounded-4 text-center hover-shadow transition-all bg-light">
                <div className="rounded-circle bg-indigo-600 text-white mx-auto d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '56px', height: '56px', backgroundColor: '#4f46e5' }}>
                  <Clock size={24} />
                </div>
                <h5 className="fw-bold text-dark text-base mb-2">3. Track Live Spot</h5>
                <p className="text-muted text-xs mb-0">
                  Watch live position: "Patients ahead: 2, Est. wait: 20 mins". Relax anywhere in the hospital.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card h-100 p-4 border rounded-4 text-center hover-shadow transition-all bg-light">
                <div className="rounded-circle bg-emerald-600 text-white mx-auto d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '56px', height: '56px', backgroundColor: '#059669' }}>
                  <Stethoscope size={24} />
                </div>
                <h5 className="fw-bold text-dark text-base mb-2">4. Direct Consultation</h5>
                <p className="text-muted text-xs mb-0">
                  Receive instant chime alert and voice announcement to proceed directly to the doctor's room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Departments Grid */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2 text-xs">
                Clinical Excellence
              </span>
              <h2 className="fw-extrabold text-dark tracking-tight mb-0">Outpatient Departments</h2>
            </div>
            <Link to="/departments" className="btn btn-outline-primary rounded-pill btn-sm px-3 fw-semibold">
              View All Departments &rarr;
            </Link>
          </div>

          <div className="row g-3">
            {departments.slice(0, 6).map((dept) => (
              <div key={dept.id} className="col-lg-4 col-md-6">
                <div className="card p-3.5 border rounded-4 h-100 bg-white hover-shadow transition-all">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="p-2.5 rounded-3 bg-primary-subtle text-primary">
                      <HeartPulse size={22} />
                    </div>
                    <span className="badge bg-light text-dark border text-xs">
                      {dept.code}
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark text-base mb-1">{dept.name}</h5>
                  <p className="text-muted text-xs mb-3" style={{ minHeight: '36px' }}>{dept.description}</p>

                  <div className="d-flex align-items-center justify-content-between border-top pt-2.5 text-xs text-muted">
                    <span>{dept.doctorCount || 0} Doctors Available</span>
                    <Link 
                      to={`/patient/book?departmentId=${dept.id}`} 
                      className="text-primary fw-semibold text-decoration-none d-flex align-items-center gap-1"
                    >
                      Book Slot <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Priority Fast-Track Feature Highlight */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="card border-0 rounded-4 overflow-hidden p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span className="badge bg-danger text-white rounded-pill px-3 py-1 mb-3 text-xs fw-semibold">
                  Intelligent Priority Engine
                </span>
                <h3 className="fw-extrabold text-white tracking-tight mb-2">
                  Emergency & Senior Citizen Fast-Track
                </h3>
                <p className="text-light opacity-80 text-sm mb-4" style={{ maxWidth: '650px' }}>
                  Our queue algorithm assigns dynamic priority weights: Critical and emergency patients are prioritized immediately at the front of the queue, and senior citizens receive accelerated consultations without creating duplicate tokens.
                </p>
                <div className="d-flex flex-wrap gap-4 text-xs">
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Emergency Priority Boost</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Senior Citizen Priority Lane</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Self-Service QR Check-in</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link 
                  to="/patient/book" 
                  className="btn btn-light btn-lg rounded-pill px-4 fw-bold text-dark shadow-sm"
                >
                  Book Priority Token
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
