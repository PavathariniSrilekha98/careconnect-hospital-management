import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { consultationService } from '../../services/consultationService';
import { appointmentService } from '../../services/appointmentService';
import { queueService } from '../../services/queueService';
import { 
  FileText, 
  Stethoscope, 
  Pill, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  User, 
  Clock, 
  Activity, 
  HeartPulse,
  Send
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorConsultationPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointmentId');
  const ticketId = queryParams.get('ticketId');

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [prescriptionItems, setPrescriptionItems] = useState([
    { medicineName: '', dosage: '1 Tablet', frequency: 'Twice daily after meals', durationDays: 5, instructions: 'Take with full glass of water' }
  ]);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setError('No appointment ID provided. Please select an active patient from your Queue Controller board.');
        setLoading(false);
        return;
      }

      try {
        const apptRes = await appointmentService.getById(appointmentId);
        if (apptRes.success && apptRes.data) {
          setAppointment(apptRes.data);
          setSymptoms(apptRes.data.symptoms || '');
        }

        // Check if consultation already exists
        try {
          const consRes = await consultationService.getByAppointmentId(appointmentId);
          if (consRes.success && consRes.data) {
            const data = consRes.data;
            setDiagnosis(data.diagnosis || '');
            setClinicalNotes(data.clinicalNotes || '');
            setFollowUpDate(data.followUpDate || '');
            if (data.prescriptionItems && data.prescriptionItems.length > 0) {
              setPrescriptionItems(data.prescriptionItems);
            }
          }
        } catch (e) {
          // No consultation yet, expected for new visits
        }
      } catch (err) {
        console.error('Failed to load consultation appointment:', err);
        setError('Could not load appointment details. Please check if the appointment exists.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleAddMedicine = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      { medicineName: '', dosage: '1 Tablet', frequency: 'Once daily after meals', durationDays: 5, instructions: '' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    if (prescriptionItems.length === 1) return;
    setPrescriptionItems(prescriptionItems.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescriptionItems];
    updated[index][field] = value;
    setPrescriptionItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError('Please provide a clinical diagnosis before finalizing the consultation.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const validPrescriptions = prescriptionItems.filter(p => p.medicineName.trim());

      const payload = {
        appointmentId: appointmentId,
        symptoms: symptoms,
        diagnosis: diagnosis,
        clinicalNotes: clinicalNotes,
        prescriptionItems: validPrescriptions,
        followUpDate: followUpDate || null,
        durationMinutes: parseInt(durationMinutes, 10) || 10
      };

      const res = await consultationService.save(payload);
      if (res.success) {
        // If ticketId exists, mark ticket as COMPLETED in queue
        if (ticketId) {
          try {
            await queueService.updateStatus(ticketId, 'COMPLETED', 'Consultation finished and prescription recorded');
          } catch (qErr) {
            console.warn('Could not auto-complete ticket status:', qErr);
          }
        }

        setSuccess('Consultation completed successfully! Prescription and records have been updated.');
        setTimeout(() => {
          navigate('/doctor/queue');
        }, 1500);
      }
    } catch (err) {
      console.error('Consultation save error:', err);
      setError(err.response?.data?.message || 'Failed to complete consultation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading patient consultation record..." />;
  }

  return (
    <div className="doctor-consultation-page py-3">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Top bar with back button */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <Link to="/doctor/queue" className="btn btn-outline-secondary rounded-circle p-2">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h3 className="fw-extrabold text-dark tracking-tight mb-0">Doctor Consultation & EMR</h3>
              <span className="text-muted text-xs">Record patient diagnosis, clinical advice, and digital prescriptions</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Patient Summary Header Card */}
        {appointment && (
          <div className="card p-3.5 border rounded-4 bg-light mb-4 shadow-xs">
            <div className="row g-3 text-xs align-items-center">
              <div className="col-sm-3 col-6">
                <span className="text-muted text-xxs text-uppercase fw-bold d-block">Patient Name</span>
                <strong className="text-dark fs-6">{appointment.patientName}</strong>
              </div>
              <div className="col-sm-3 col-6">
                <span className="text-muted text-xxs text-uppercase fw-bold d-block">Token Number</span>
                <strong className="text-primary font-monospace fs-6">{appointment.tokenNumber}</strong>
              </div>
              <div className="col-sm-3 col-6">
                <span className="text-muted text-xxs text-uppercase fw-bold d-block">Department</span>
                <span className="text-dark fw-semibold">{appointment.departmentName}</span>
              </div>
              <div className="col-sm-3 col-6">
                <span className="text-muted text-xxs text-uppercase fw-bold d-block">Date & Slot</span>
                <span className="text-dark">{appointment.appointmentDate} ({appointment.timeSlot})</span>
              </div>
            </div>
          </div>
        )}

        {/* Main EMR Form */}
        <div className="card p-4 p-md-5 border rounded-4 bg-white shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Symptoms / Chief Complaint */}
            <div className="mb-4">
              <label className="form-label text-xs fw-bold text-dark text-uppercase">
                Reported Symptoms / Chief Complaints
              </label>
              <textarea 
                className="form-control text-sm"
                rows="2"
                placeholder="e.g. Chest tightness on exertion, shortness of breath, mild fever for 3 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            {/* Diagnosis */}
            <div className="mb-4">
              <label className="form-label text-xs fw-bold text-dark text-uppercase">
                Clinical Diagnosis *
              </label>
              <input 
                type="text" 
                className="form-control text-sm fw-semibold"
                placeholder="e.g. Acute Bronchitis / Stage 1 Hypertension / Lumbar Muscle Strain"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>

            {/* Doctor's Clinical Notes */}
            <div className="mb-4">
              <label className="form-label text-xs fw-bold text-dark text-uppercase">
                Doctor's Clinical Notes & Lifestyle Advice
              </label>
              <textarea 
                className="form-control text-sm"
                rows="3"
                placeholder="e.g. Advised low-sodium diet, regular aerobic exercise, avoid smoking, monitor BP twice daily..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
              />
            </div>

            {/* Dynamic Prescription Builder */}
            <div className="mb-4 border-top pt-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <label className="form-label text-xs fw-bold text-dark text-uppercase mb-0 d-flex align-items-center gap-1.5">
                  <Pill size={16} className="text-primary" />
                  <span>Prescription & Medication List</span>
                </label>
                <button 
                  type="button" 
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 text-xs fw-semibold d-flex align-items-center gap-1"
                  onClick={handleAddMedicine}
                >
                  <Plus size={14} />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div className="d-flex flex-column gap-2.5">
                {prescriptionItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-light rounded-3 border">
                    <div className="row g-2 align-items-center">
                      <div className="col-md-4 col-12">
                        <label className="text-xxs fw-bold text-muted text-uppercase d-block mb-1">Medicine Name & Strength</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm text-xs"
                          placeholder="e.g. Amoxicillin 500mg"
                          value={item.medicineName}
                          onChange={(e) => handleMedicineChange(idx, 'medicineName', e.target.value)}
                        />
                      </div>

                      <div className="col-md-2 col-6">
                        <label className="text-xxs fw-bold text-muted text-uppercase d-block mb-1">Dosage</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm text-xs"
                          placeholder="1 Tab / 5ml"
                          value={item.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        />
                      </div>

                      <div className="col-md-3 col-6">
                        <label className="text-xxs fw-bold text-muted text-uppercase d-block mb-1">Frequency</label>
                        <select 
                          className="form-select form-select-sm text-xs"
                          value={item.frequency}
                          onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        >
                          <option value="Once daily in the morning">Once daily (Morning)</option>
                          <option value="Once daily after dinner">Once daily (Night)</option>
                          <option value="Twice daily after meals">Twice daily (Morning & Night)</option>
                          <option value="Thrice daily after meals">Thrice daily (TID)</option>
                          <option value="As needed for pain (SOS)">As needed (SOS)</option>
                        </select>
                      </div>

                      <div className="col-md-2 col-8">
                        <label className="text-xxs fw-bold text-muted text-uppercase d-block mb-1">Duration (Days)</label>
                        <input 
                          type="number" 
                          className="form-control form-control-sm text-xs"
                          min="1"
                          max="90"
                          value={item.durationDays}
                          onChange={(e) => handleMedicineChange(idx, 'durationDays', parseInt(e.target.value, 10))}
                        />
                      </div>

                      <div className="col-md-1 col-4 text-end pt-3">
                        {prescriptionItems.length > 1 && (
                          <button 
                            type="button" 
                            className="btn btn-outline-danger btn-sm p-1.5 rounded-circle"
                            onClick={() => handleRemoveMedicine(idx)}
                            title="Remove medicine"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up & Duration */}
            <div className="row g-3 border-top pt-3 mb-4">
              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Recommended Follow-up Date</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><Calendar size={16} /></span>
                  <input 
                    type="date" 
                    className="form-control border-start-0 text-sm"
                    min={new Date().toISOString().split('T')[0]}
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Actual Consultation Duration (Minutes)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><Clock size={16} /></span>
                  <input 
                    type="number" 
                    min="1"
                    max="120"
                    className="form-control border-start-0 text-sm"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
              <Link to="/doctor/queue" className="btn btn-outline-secondary rounded-pill px-4 py-2 text-sm fw-semibold">
                Cancel
              </Link>

              <button 
                type="submit" 
                className="btn btn-success rounded-pill px-5 py-2.5 fw-bold text-sm shadow-sm d-flex align-items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Complete Consultation & Dispatch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultationPage;
