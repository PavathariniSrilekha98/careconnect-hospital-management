import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, User, Mail, Lock, Phone, MapPin, AlertCircle, ArrowRight, HeartPulse, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    age: '',
    gender: 'MALE',
    bloodGroup: 'UNKNOWN',
    address: '',
    emergencyContact: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        age: formData.age ? parseInt(formData.age, 10) : null,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        role: 'PATIENT'
      };

      const res = await register(payload);
      if (res.success) {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-app">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-4 shadow-sm text-white mb-2" 
                style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
              >
                <Activity size={28} strokeWidth={2.5} />
              </div>
              <h2 className="fw-extrabold text-dark tracking-tight mb-1">Create Patient Account</h2>
              <p className="text-muted text-sm">Register once to book OPD tokens, track live waiting positions, and download prescriptions</p>
            </div>

            {error && (
              <div className="alert alert-danger text-xs d-flex align-items-center gap-2 rounded-3 mb-3">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="card p-4 p-md-5 border rounded-4 bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0"><User size={16} /></span>
                      <input 
                        type="text" 
                        name="fullName"
                        className="form-control border-start-0 text-sm"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Email Address *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0"><Mail size={16} /></span>
                      <input 
                        type="email" 
                        name="email"
                        className="form-control border-start-0 text-sm"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0"><Phone size={16} /></span>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        className="form-control border-start-0 text-sm"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Age</label>
                    <input 
                      type="number" 
                      name="age"
                      min="1"
                      max="125"
                      className="form-control text-sm"
                      placeholder="e.g. 35"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Gender</label>
                    <select 
                      name="gender" 
                      className="form-select text-sm"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Blood Group</label>
                    <select 
                      name="bloodGroup" 
                      className="form-select text-sm"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    >
                      <option value="UNKNOWN">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Emergency Contact</label>
                    <input 
                      type="text" 
                      name="emergencyContact"
                      className="form-control text-sm"
                      placeholder="Name & Contact Number"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Home / City Address</label>
                    <input 
                      type="text" 
                      name="address"
                      className="form-control text-sm"
                      placeholder="Street, City, Postal Code"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0"><Lock size={16} /></span>
                      <input 
                        type="password" 
                        name="password"
                        className="form-control border-start-0 text-sm"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase">Confirm Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0"><Lock size={16} /></span>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        className="form-control border-start-0 text-sm"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary rounded-pill w-100 py-2.5 fw-semibold text-sm shadow-xs d-flex align-items-center justify-content-center gap-2 mt-4"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      <span>Complete Patient Registration</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Staff Provisioning Info Callout */}
              <div className="alert alert-light border rounded-3 text-xxs text-muted mt-3 mb-0 d-flex align-items-center gap-2">
                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                <span>Doctor and medical staff accounts are provisioned exclusively by Hospital Administration.</span>
              </div>

              <div className="text-center mt-3 border-top pt-3">
                <p className="text-muted text-xs mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Sign In here
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

export default RegisterPage;
