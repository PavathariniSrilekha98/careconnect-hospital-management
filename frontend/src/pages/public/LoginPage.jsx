import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  Stethoscope, 
  User, 
  HeartPulse, 
  Clock, 
  Sparkles, 
  Quote, 
  Check,
  Building2,
  Search,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';

// Seeded Specialist Doctors in the Hospital Database
const SEEDED_DOCTORS = [
  {
    name: 'Dr. Sarah Jenkins, MD',
    specialty: 'Cardiology & Heart Care',
    room: 'Room 204',
    email: 'doctor.sarah@hospital.com',
    pass: 'Doctor@123',
    badge: 'Senior Cardiologist',
    initials: 'SJ',
    color: '#0284c7'
  },
  {
    name: 'Dr. David Reynolds, MD',
    specialty: 'Cardiology (Interventional)',
    room: 'Room 206',
    email: 'doctor.david@hospital.com',
    pass: 'Doctor@123',
    badge: 'Heart Specialist',
    initials: 'DR',
    color: '#0369a1'
  },
  {
    name: 'Dr. Marcus Vance, MS',
    specialty: 'Orthopedics & Joint Care',
    room: 'Room 102',
    email: 'doctor.marcus@hospital.com',
    pass: 'Doctor@123',
    badge: 'Chief Surgeon',
    initials: 'MV',
    color: '#0f766e'
  },
  {
    name: 'Dr. Priya Sharma, MS',
    specialty: 'Orthopedics & Sports Medicine',
    room: 'Room 105',
    email: 'doctor.priya@hospital.com',
    pass: 'Doctor@123',
    badge: 'Ortho Specialist',
    initials: 'PS',
    color: '#0d9488'
  },
  {
    name: 'Dr. Elena Rostova, MD',
    specialty: 'General Medicine & OPD',
    room: 'Room 003',
    email: 'doctor.elena@hospital.com',
    pass: 'Doctor@123',
    badge: 'Senior Physician',
    initials: 'ER',
    color: '#2563eb'
  },
  {
    name: 'Dr. Alexander Wright, MD',
    specialty: 'Internal Medicine',
    room: 'Room 005',
    email: 'doctor.alex@hospital.com',
    pass: 'Doctor@123',
    badge: 'Family Medicine',
    initials: 'AW',
    color: '#4f46e5'
  },
  {
    name: 'Dr. Maya Lin, MD',
    specialty: 'Pediatrics & Child Care',
    room: 'Room 110',
    email: 'doctor.maya@hospital.com',
    pass: 'Doctor@123',
    badge: 'Child Specialist',
    initials: 'ML',
    color: '#ec4899'
  },
  {
    name: 'Dr. Robert Chen, DDS',
    specialty: 'Dental & Oral Surgery',
    room: 'Room 209',
    email: 'doctor.robert@hospital.com',
    pass: 'Doctor@123',
    badge: 'Dental Surgeon',
    initials: 'RC',
    color: '#eab308'
  },
  {
    name: 'Dr. Aisha Patel, MD',
    specialty: 'Dermatology & Aesthetics',
    room: 'Room 302',
    email: 'doctor.aisha@hospital.com',
    pass: 'Doctor@123',
    badge: 'Dermatologist',
    initials: 'AP',
    color: '#8b5cf6'
  }
];

const LoginPage = () => {
  const [activeRoleTab, setActiveRoleTab] = useState('PATIENT'); // 'PATIENT', 'DOCTOR', 'ADMIN'
  const [email, setEmail] = useState('patient@hospital.com');
  const [password, setPassword] = useState('Patient@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('doctor.sarah@hospital.com');
  const [doctorSearch, setDoctorSearch] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';
  const registered = queryParams.get('registered') === 'true';
  const redirectPath = queryParams.get('redirect');

  const roleConfigs = {
    PATIENT: {
      title: 'Patient Portal',
      subtitle: 'Book OPD appointments, track live tokens & access prescription records',
      defaultEmail: 'patient@hospital.com',
      defaultPass: 'Patient@123',
      color: '#0284c7',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      bgSubtle: '#f0f9ff',
      icon: User,
      quote: '“The greatest wealth is health. We are committed to making your hospital visit frictionless, transparent, and dignified.”',
      quoteAuthor: 'CareConnect Patient Care Philosophy'
    },
    DOCTOR: {
      title: 'Doctor Portal',
      subtitle: 'Manage live OPD queue, call next patient & write EMR prescriptions',
      defaultEmail: 'doctor.sarah@hospital.com',
      defaultPass: 'Doctor@123',
      color: '#0f766e',
      gradient: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
      bgSubtle: '#f0fdfa',
      icon: Stethoscope,
      quote: '“Wherever the art of Medicine is loved, there is also a love of Humanity.”',
      quoteAuthor: 'Hippocrates'
    },
    ADMIN: {
      title: 'Hospital Admin Console',
      subtitle: 'Oversee clinical departments, doctor onboarding, analytics & SLA audits',
      defaultEmail: 'admin@hospital.com',
      defaultPass: 'Admin@123',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      bgSubtle: '#f5f3ff',
      icon: Shield,
      quote: '“Excellence in healthcare operations transforms complexity into compassionate, structured healing.”',
      quoteAuthor: 'Healthcare Management Institute'
    }
  };

  const currentConfig = roleConfigs[activeRoleTab];

  const handleSwitchTab = (role) => {
    setActiveRoleTab(role);
    setError('');
    if (role === 'DOCTOR') {
      const doc = SEEDED_DOCTORS.find(d => d.email === selectedDoctorEmail) || SEEDED_DOCTORS[0];
      setEmail(doc.email);
      setPassword(doc.pass);
    } else {
      setEmail(roleConfigs[role].defaultEmail);
      setPassword(roleConfigs[role].defaultPass);
    }
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctorEmail(doc.email);
    setEmail(doc.email);
    setPassword(doc.pass);
  };

  const filteredDoctors = SEEDED_DOCTORS.filter(d => 
    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.specialty.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.email.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const selectedDoctorObj = SEEDED_DOCTORS.find(d => d.email === email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login({ email, password });
      if (res.success && res.data) {
        if (redirectPath) {
          navigate(redirectPath);
          return;
        }

        const role = res.data.role;
        if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (role === 'DOCTOR') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-app d-flex align-items-center" style={{ minHeight: 'calc(100vh - 70px)', background: '#f8fafc' }}>
      <div className="container">
        <div className="row justify-content-center align-items-stretch g-4">
          
          {/* Left Hero Showcase Column */}
          <div 
            className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-4 p-xl-5 rounded-4 text-white shadow-lg position-relative overflow-hidden" 
            style={{ 
              background: 'linear-gradient(145deg, #0b1329 0%, #111e38 45%, #0369a1 100%)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {/* Ambient Background Glow Effect */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '-50px', 
                right: '-50px', 
                width: '200px', 
                height: '200px', 
                background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} 
            />

            <div>
              {/* Brand Header */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-3 text-white shadow-sm"
                  style={{ width: '46px', height: '46px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                >
                  <Activity size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="fw-extrabold mb-0 tracking-tight text-white fs-4">CareConnect</h3>
                  <span className="text-white text-opacity-75 text-xs text-uppercase tracking-wider fw-semibold">
                    Multi-Speciality Hospital System
                  </span>
                </div>
              </div>

              {/* Catchy Main Heading */}
              <h2 className="fw-extrabold display-6 tracking-tight mb-3 text-white" style={{ lineHeight: '1.2' }}>
                Next-Gen Real-Time <br />
                <span style={{ color: '#38bdf8' }}>Smart OPD & EMR Care</span>
              </h2>

              <p className="text-white text-opacity-80 text-sm mb-4 leading-relaxed">
                Empowering patients with live queue countdowns, instant QR check-in kiosks, and intelligent doctor workspaces for digital prescriptions.
              </p>

              {/* 4 Clinical Stats Badges */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur">
                    <div className="d-flex align-items-center gap-1.5 text-warning mb-1">
                      <Clock size={14} />
                      <span className="fw-bold fs-6 text-white font-monospace">&lt; 12 Mins</span>
                    </div>
                    <span className="text-xxs text-white text-opacity-75">Avg. OPD Waiting Time</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur">
                    <div className="d-flex align-items-center gap-1.5 text-success mb-1">
                      <TrendingUp size={14} />
                      <span className="fw-bold fs-6 text-white font-monospace">99.8%</span>
                    </div>
                    <span className="text-xxs text-white text-opacity-75">Queue Sequence Accuracy</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur">
                    <div className="d-flex align-items-center gap-1.5 text-info mb-1">
                      <Stethoscope size={14} />
                      <span className="fw-bold fs-6 text-white font-monospace">50+ Doctors</span>
                    </div>
                    <span className="text-xxs text-white text-opacity-75">Multi-Specialist Team</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur">
                    <div className="d-flex align-items-center gap-1.5 text-primary-subtle mb-1">
                      <Award size={14} />
                      <span className="fw-bold fs-6 text-white">NABH / JCI</span>
                    </div>
                    <span className="text-xxs text-white text-opacity-75">Accredited Standards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quote & Trust Seal */}
            <div>
              <div className="p-3.5 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur mb-3">
                <Quote size={18} className="text-info mb-1 opacity-75" />
                <p className="text-xs fst-italic mb-1 text-white text-opacity-90" style={{ lineHeight: '1.5' }}>
                  {currentConfig.quote}
                </p>
                <span className="text-xxs text-white text-opacity-60 fw-semibold d-block text-end">
                  — {currentConfig.quoteAuthor}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between text-xxs text-white text-opacity-60 pt-2 border-top border-white border-opacity-10">
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span>🛡️ HIPAA Compliant</span>
                <span>•</span>
                <span>⚡ Live STOMP WebSockets</span>
              </div>
            </div>
          </div>

          {/* Right Role-Tabbed Login Form Card */}
          <div className="col-lg-7 col-md-10">
            <div className="card p-4 p-md-5 border rounded-4 bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
              <div>
                {/* Header with Title */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h3 className="fw-extrabold text-dark tracking-tight mb-1">
                      Sign In to Your Portal
                    </h3>
                    <p className="text-muted text-xs mb-0">
                      Access your role-specific dashboard and queue tools
                    </p>
                  </div>
                  <span className="badge rounded-pill text-white px-3 py-1.5 fw-semibold text-xs shadow-xs" style={{ backgroundColor: currentConfig.color }}>
                    {currentConfig.title}
                  </span>
                </div>

                {/* Role Switcher Tabs */}
                <div className="d-flex rounded-pill bg-light p-1.5 mb-4 border shadow-xs">
                  <button 
                    type="button" 
                    className={`btn btn-sm rounded-pill flex-grow-1 fw-bold text-xs py-2.5 d-flex align-items-center justify-content-center gap-1.5 transition-all ${
                      activeRoleTab === 'PATIENT' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover-bg-light'
                    }`}
                    onClick={() => handleSwitchTab('PATIENT')}
                  >
                    <User size={15} />
                    <span>Patient</span>
                  </button>

                  <button 
                    type="button" 
                    className={`btn btn-sm rounded-pill flex-grow-1 fw-bold text-xs py-2.5 d-flex align-items-center justify-content-center gap-1.5 transition-all ${
                      activeRoleTab === 'DOCTOR' ? 'text-white shadow-xs' : 'text-secondary hover-bg-light'
                    }`}
                    style={{ backgroundColor: activeRoleTab === 'DOCTOR' ? '#0f766e' : undefined }}
                    onClick={() => handleSwitchTab('DOCTOR')}
                  >
                    <Stethoscope size={15} />
                    <span>Doctor ({SEEDED_DOCTORS.length} Specialists)</span>
                  </button>

                  <button 
                    type="button" 
                    className={`btn btn-sm rounded-pill flex-grow-1 fw-bold text-xs py-2.5 d-flex align-items-center justify-content-center gap-1.5 transition-all ${
                      activeRoleTab === 'ADMIN' ? 'text-white shadow-xs' : 'text-secondary hover-bg-light'
                    }`}
                    style={{ backgroundColor: activeRoleTab === 'ADMIN' ? '#7c3aed' : undefined }}
                    onClick={() => handleSwitchTab('ADMIN')}
                  >
                    <Shield size={15} />
                    <span>Admin</span>
                  </button>
                </div>

                {/* Expired / Registered alerts */}
                {isExpired && (
                  <div className="alert alert-warning text-xs d-flex align-items-center gap-2 rounded-3 mb-3">
                    <AlertCircle size={16} />
                    <span>Your previous session has expired. Please sign in again.</span>
                  </div>
                )}

                {registered && (
                  <div className="alert alert-success text-xs d-flex align-items-center gap-2 rounded-3 mb-3">
                    <CheckCircle2 size={16} />
                    <span>Account created successfully! You can now sign in below.</span>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger text-xs d-flex align-items-center gap-2 rounded-3 mb-3">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* DOCTOR SPECIFIC: Interactive Doctor Directory Selector */}
                {activeRoleTab === 'DOCTOR' && (
                  <div className="mb-4 p-3 rounded-4 bg-light border">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-1.5">
                        <Stethoscope size={15} style={{ color: '#0f766e' }} />
                        <span className="text-xs fw-bold text-dark text-uppercase">
                          Select Specialist Doctor to Login
                        </span>
                      </div>
                      <span className="badge text-teal border text-xxs font-monospace" style={{ color: '#0f766e', backgroundColor: '#ccfbf1' }}>
                        1-Click Autofill
                      </span>
                    </div>

                    {/* Quick Doctor Cards Horizontal Carousel */}
                    <div className="d-flex gap-2 overflow-auto pb-2 pt-1" style={{ scrollbarWidth: 'thin' }}>
                      {SEEDED_DOCTORS.map((doc, idx) => {
                        const isSelected = email === doc.email;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`btn btn-sm text-start p-2.5 rounded-3 border flex-shrink-0 transition-all ${
                              isSelected 
                                ? 'border-2 shadow-sm' 
                                : 'bg-white hover-bg-light shadow-2xs'
                            }`}
                            style={{ 
                              width: '185px',
                              borderColor: isSelected ? '#0f766e' : '#e2e8f0',
                              backgroundColor: isSelected ? '#f0fdfa' : '#ffffff'
                            }}
                            onClick={() => handleSelectDoctor(doc)}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-1.5">
                              <div 
                                className="rounded-circle text-white fw-bold text-xxs d-flex align-items-center justify-content-center"
                                style={{ width: '24px', height: '24px', backgroundColor: doc.color }}
                              >
                                {doc.initials}
                              </div>
                              <span className="badge bg-light text-dark border text-xxs font-monospace">
                                {doc.room}
                              </span>
                            </div>
                            <strong className="text-dark d-block text-xs text-truncate">{doc.name}</strong>
                            <span className="text-muted text-xxs d-block text-truncate mt-0.5">{doc.specialty}</span>
                            {isSelected && (
                              <div className="d-flex align-items-center gap-1 text-teal text-xxs fw-bold mt-1.5" style={{ color: '#0f766e' }}>
                                <CheckCircle2 size={12} />
                                <span>Selected</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDoctorObj && (
                      <div className="d-flex align-items-center justify-content-between text-xxs text-muted mt-2 pt-2 border-top">
                        <span>Active Specialist: <strong className="text-dark">{selectedDoctorObj.name}</strong></span>
                        <span>Location: <strong className="text-teal" style={{ color: '#0f766e' }}>{selectedDoctorObj.room}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                {/* PATIENT SPECIFIC: Demo Fast Access Card */}
                {activeRoleTab === 'PATIENT' && (
                  <div className="p-3 rounded-4 border mb-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: currentConfig.bgSubtle }}>
                    <div className="d-flex align-items-center gap-2">
                      <Sparkles size={16} style={{ color: currentConfig.color }} />
                      <div>
                        <span className="text-xs fw-bold text-dark d-block">Demo Patient Account</span>
                        <span className="text-muted text-xxs">{email}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-light border text-xxs px-3 py-1.5 rounded-pill fw-bold text-dark hover-bg-light shadow-xs"
                      onClick={() => {
                        setEmail('patient@hospital.com');
                        setPassword('Patient@123');
                      }}
                    >
                      Fill Demo
                    </button>
                  </div>
                )}

                {/* ADMIN SPECIFIC: Demo Fast Access Card */}
                {activeRoleTab === 'ADMIN' && (
                  <div className="p-3 rounded-4 border mb-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: currentConfig.bgSubtle }}>
                    <div className="d-flex align-items-center gap-2">
                      <Shield size={16} style={{ color: currentConfig.color }} />
                      <div>
                        <span className="text-xs fw-bold text-dark d-block">Hospital Admin Command</span>
                        <span className="text-muted text-xxs">{email}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-light border text-xxs px-3 py-1.5 rounded-pill fw-bold text-dark hover-bg-light shadow-xs"
                      onClick={() => {
                        setEmail('admin@hospital.com');
                        setPassword('Admin@123');
                      }}
                    >
                      Fill Demo
                    </button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <Mail size={16} />
                      </span>
                      <input 
                        type="email" 
                        className="form-control border-start-0 text-sm py-2"
                        placeholder="name@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <Lock size={16} />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="form-control border-start-0 border-end-0 text-sm py-2"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="input-group-text bg-light text-muted border-start-0 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill w-100 py-2.5 fw-bold text-sm shadow-md d-flex align-items-center justify-content-center gap-2"
                    style={{ background: currentConfig.gradient, border: 'none' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <span>Sign In as {activeRoleTab === 'DOCTOR' ? (selectedDoctorObj?.name || 'Doctor') : currentConfig.title.split(' ')[0]}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Bottom Registration Link */}
              <div className="text-center mt-4 border-top pt-3">
                <p className="text-muted text-xs mb-0">
                  Are you a new patient?{' '}
                  <Link to="/register" className="text-primary fw-bold text-decoration-none">
                    Register New Patient Account &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
