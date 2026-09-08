import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, HeartPulse, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const PatientProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: '',
    gender: 'OTHER',
    bloodGroup: 'UNKNOWN',
    address: '',
    emergencyContact: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        age: user.age || '',
        gender: user.gender || 'OTHER',
        bloodGroup: user.bloodGroup || 'UNKNOWN',
        address: user.address || '',
        emergencyContact: user.emergencyContact || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null
      };

      const res = await updateProfile(payload);
      if (res.success) {
        setSuccess('Profile details saved successfully.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-profile-page py-3">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-extrabold text-dark tracking-tight mb-1">My Patient Profile</h2>
            <p className="text-muted text-xs mb-0">Update contact details, health demographics, and emergency contact numbers</p>
          </div>
        </div>

        {success && (
          <div className="alert alert-success text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="card p-4 p-md-5 border rounded-4 bg-white shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><User size={16} /></span>
                  <input 
                    type="text" 
                    name="fullName"
                    className="form-control border-start-0 text-sm"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Email Address (Read-Only)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><Mail size={16} /></span>
                  <input 
                    type="email" 
                    className="form-control border-start-0 text-sm bg-light"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><Phone size={16} /></span>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    className="form-control border-start-0 text-sm"
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
                  placeholder="e.g. Mary Doe (+1 555-0192)"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Residential Address</label>
                <input 
                  type="text" 
                  name="address"
                  className="form-control text-sm"
                  placeholder="Street, City, Postal Code"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-top d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn btn-primary rounded-pill px-4 py-2.5 fw-semibold text-sm shadow-xs d-flex align-items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                disabled={loading}
              >
                <Save size={16} />
                <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;
