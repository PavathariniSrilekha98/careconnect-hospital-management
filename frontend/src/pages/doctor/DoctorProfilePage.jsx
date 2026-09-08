import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { Stethoscope, User, Clock, MapPin, CheckCircle2, AlertCircle, Save, Activity } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorProfilePage = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState('AVAILABLE');
  const [roomNumber, setRoomNumber] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDoctorProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await doctorService.getDoctorByUserId(user.id);
      if (res.success && res.data) {
        setDoctor(res.data);
        setAvailability(res.data.availabilityStatus || 'AVAILABLE');
        setRoomNumber(res.data.roomNumber || '');
        setDurationMinutes(res.data.consultationDurationMinutes || 10);
      }
    } catch (err) {
      console.error('Failed to load doctor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [user?.id]);

  const handleUpdateAvailability = async (newStatus) => {
    if (!doctor?.id) return;
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await doctorService.updateDoctorAvailability(doctor.id, newStatus);
      if (res.success) {
        setAvailability(newStatus);
        setMessage(`Availability updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update availability status.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!doctor?.id) return;
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...doctor,
        roomNumber: roomNumber,
        consultationDurationMinutes: parseInt(durationMinutes, 10) || 10,
        availabilityStatus: availability
      };

      const res = await doctorService.updateDoctor(doctor.id, payload);
      if (res.success) {
        setMessage('Consultation settings updated successfully.');
        fetchDoctorProfile();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading doctor profile..." />;
  }

  return (
    <div className="doctor-profile-page py-3">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="mb-4">
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Doctor Profile & Clinic Settings</h2>
          <p className="text-muted text-xs mb-0">Manage your OPD availability, consultation room, and average duration</p>
        </div>

        {message && (
          <div className="alert alert-success text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Live Availability Toggle Card */}
        <div className="card p-4 border rounded-4 bg-white shadow-sm mb-4">
          <h5 className="fw-bold text-dark text-base mb-2 d-flex align-items-center gap-2">
            <Activity size={18} className="text-primary" />
            Live Clinic Availability Status
          </h5>
          <p className="text-muted text-xs mb-3">
            Your status is broadcasted in real-time to the Hospital TV display and Patient waiting screens.
          </p>

          <div className="d-flex flex-wrap gap-2">
            {[
              { status: 'AVAILABLE', label: '● Available / Ready', color: 'btn-outline-success' },
              { status: 'IN_CONSULTATION', label: '● In Consultation', color: 'btn-outline-warning' },
              { status: 'ON_BREAK', label: '● On Lunch / Break', color: 'btn-outline-info' },
              { status: 'BUSY', label: '● Busy / Off Duty', color: 'btn-outline-secondary' }
            ].map((btn) => (
              <button
                key={btn.status}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold text-xs transition-all ${
                  availability === btn.status 
                    ? btn.status === 'AVAILABLE' ? 'btn-success text-white' : btn.status === 'IN_CONSULTATION' ? 'btn-warning text-dark' : 'btn-dark text-white'
                    : btn.color
                }`}
                onClick={() => handleUpdateAvailability(btn.status)}
                disabled={saving}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinic & Profile Settings Form */}
        <div className="card p-4 p-md-5 border rounded-4 bg-white shadow-sm">
          <form onSubmit={handleSaveSettings}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Doctor Name</label>
                <input 
                  type="text" 
                  className="form-control text-sm bg-light"
                  value={doctor?.fullName || ''}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Department</label>
                <input 
                  type="text" 
                  className="form-control text-sm bg-light"
                  value={doctor?.departmentName || ''}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Specialization</label>
                <input 
                  type="text" 
                  className="form-control text-sm bg-light"
                  value={doctor?.specialization || ''}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Room / OPD Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><MapPin size={16} /></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 text-sm"
                    placeholder="e.g. Room 201"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Average Consultation Duration (Minutes)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><Clock size={16} /></span>
                  <input 
                    type="number" 
                    min="5"
                    max="60"
                    className="form-control border-start-0 text-sm"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                  />
                </div>
                <span className="text-muted text-xxs mt-1 d-block">Used to calculate live estimated wait times for patients.</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn btn-primary rounded-pill px-4 py-2.5 fw-semibold text-sm shadow-xs d-flex align-items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0284c7 100%)', border: 'none' }}
                disabled={saving}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
