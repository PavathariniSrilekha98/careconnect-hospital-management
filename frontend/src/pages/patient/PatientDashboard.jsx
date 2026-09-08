import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { appointmentService } from '../../services/appointmentService';
import { consultationService } from '../../services/consultationService';
import { 
  CalendarPlus, 
  Clock, 
  CalendarCheck, 
  Activity, 
  Stethoscope, 
  MapPin, 
  QrCode, 
  ChevronRight, 
  Users, 
  AlertCircle,
  CheckCircle2,
  FileText,
  Pill,
  Calendar
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import QrCodeModal from '../../components/common/QrCodeModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { lastEvent } = useWebSocket();
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQrAppt, setSelectedQrAppt] = useState(null);

  const fetchData = async () => {
    try {
      const [apptRes, consRes] = await Promise.allSettled([
        appointmentService.getMyAppointments(),
        user?.id ? consultationService.getByPatientId(user.id) : Promise.resolve({ data: [] })
      ]);

      if (apptRes.status === 'fulfilled' && apptRes.value?.success) {
        setAppointments(apptRes.value.data || []);
      }
      if (consRes.status === 'fulfilled' && consRes.value?.success) {
        setConsultations(consRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load patient dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id, lastEvent]);

  // Find active today appointment
  const activeAppointment = appointments.find(
    (a) => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN' || a.status === 'CALLED' || a.status === 'IN_CONSULTATION'
  );

  return (
    <div className="patient-dashboard">
      {/* Welcome Banner */}
      <div className="card border-0 rounded-4 p-4 text-white mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-1 mb-2 text-xs fw-semibold">
              CareConnect Patient Health Portal
            </span>
            <h2 className="fw-extrabold text-white tracking-tight mb-1">
              Hello, {user?.fullName || 'Patient'}!
            </h2>
            <p className="text-white text-opacity-90 text-sm mb-0">
              Track your live position in queue and access your permanent medical & consultation records.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link 
              to="/patient/book" 
              className="btn btn-light rounded-pill px-3.5 py-2 fw-semibold text-sm text-primary shadow-xs d-flex align-items-center gap-2"
            >
              <CalendarPlus size={16} />
              <span>Book Appointment</span>
            </Link>
            <Link 
              to="/patient/history" 
              className="btn btn-outline-light rounded-pill px-3.5 py-2 fw-semibold text-sm d-flex align-items-center gap-2"
            >
              <FileText size={16} />
              <span>My Records</span>
            </Link>
            <Link 
              to="/check-in" 
              className="btn btn-outline-light rounded-pill px-3.5 py-2 fw-semibold text-sm d-flex align-items-center gap-2"
            >
              <QrCode size={16} />
              <span>QR Kiosk</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your appointments and medical records..." />
      ) : (
        <div className="row g-4 mb-4">
          {/* Active Live Token Card */}
          <div className="col-lg-7">
            {activeAppointment ? (
              <div className="card border rounded-4 p-4 bg-white shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">Active Queue Token</h5>
                      <span className="text-muted text-xs">Live position synchronized</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <PriorityBadge priority={activeAppointment.priority} />
                    <StatusBadge status={activeAppointment.status} />
                  </div>
                </div>

                <div className="row g-3 text-center my-2">
                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="text-muted text-xxs text-uppercase fw-bold d-block">My Token</span>
                      <span className="fw-extrabold text-primary fs-5 font-monospace">{activeAppointment.tokenNumber}</span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="text-muted text-xxs text-uppercase fw-bold d-block">Current Token</span>
                      <span className="fw-extrabold text-dark fs-5 font-monospace">{activeAppointment.currentServingToken || 'None'}</span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="text-muted text-xxs text-uppercase fw-bold d-block">Ahead</span>
                      <span className="fw-extrabold text-dark fs-5">{activeAppointment.patientsAheadCount || 0}</span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="text-muted text-xxs text-uppercase fw-bold d-block">Est. Wait</span>
                      <span className="fw-extrabold text-dark fs-5">~{activeAppointment.estimatedWaitingMinutes || 10}m</span>
                    </div>
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="p-3 bg-blue-50 rounded-3 border border-blue-100 my-3 text-xs d-flex flex-column gap-1.5">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-1"><Stethoscope size={14} /> Doctor:</span>
                    <strong className="text-dark">Dr. {activeAppointment.doctorName} ({activeAppointment.departmentName})</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-1"><MapPin size={14} /> Room / OPD:</span>
                    <strong className="text-dark">{activeAppointment.doctorRoom || 'Room 101'}</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-1"><Clock size={14} /> Time Slot:</span>
                    <strong className="text-dark">{activeAppointment.appointmentDate} at {activeAppointment.timeSlot}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2 mt-auto">
                  <Link 
                    to={`/patient/live-queue?appointmentId=${activeAppointment.id}`} 
                    className="btn btn-primary rounded-pill flex-grow-1 py-2 fw-semibold text-sm d-flex align-items-center justify-content-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                  >
                    <Clock size={16} />
                    <span>Open Live Queue Tracker</span>
                  </Link>

                  <button 
                    className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold text-sm d-flex align-items-center gap-1.5"
                    onClick={() => setSelectedQrAppt(activeAppointment)}
                  >
                    <QrCode size={16} />
                    <span>View QR</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="card border rounded-4 p-5 text-center bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center">
                <CalendarCheck size={42} className="text-muted opacity-50 mb-3" />
                <h5 className="fw-bold text-dark mb-1">No Active Queue Token</h5>
                <p className="text-muted text-xs mb-4" style={{ maxWidth: '380px' }}>
                  You do not have an active token in the queue for today. Book an appointment to get an instant digital token.
                </p>
                <Link 
                  to="/patient/book" 
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-sm d-flex align-items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                >
                  <CalendarPlus size={16} />
                  <span>Book New Appointment</span>
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming & Recent Appointments Column */}
          <div className="col-lg-5">
            <div className="card border rounded-4 p-4 bg-white shadow-sm h-100 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h6 className="fw-bold text-dark mb-0">My Appointments</h6>
                <Link to="/patient/appointments" className="text-xs text-primary fw-semibold text-decoration-none">
                  View All &rarr;
                </Link>
              </div>

              {appointments.length === 0 ? (
                <div className="p-4 text-center text-muted text-xs my-auto">
                  <Clock size={28} className="text-secondary opacity-50 mb-2 mx-auto" />
                  <p className="mb-0">No appointment records found</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2.5 overflow-auto flex-grow-1" style={{ maxHeight: '380px' }}>
                  {appointments.slice(0, 4).map((appt) => (
                    <div key={appt.id} className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-dark text-sm">{appt.departmentName}</span>
                          <span className="badge bg-white text-primary border font-monospace text-xxs px-1.5">
                            {appt.tokenNumber}
                          </span>
                        </div>
                        <span className="text-muted text-xs d-block mt-0.5">Dr. {appt.doctorName} • {appt.appointmentDate}</span>
                      </div>
                      <div className="text-end">
                        <StatusBadge status={appt.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-top d-flex gap-2">
                <Link to="/patient/history" className="btn btn-outline-primary rounded-pill btn-sm w-100 fw-semibold text-xs py-2 d-flex align-items-center justify-content-center gap-1">
                  <FileText size={14} /> View All Consultation Records ({consultations.length})
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT MEDICAL & CONSULTATION RECORDS SECTION */}
      <div className="card border rounded-4 p-4 bg-white shadow-sm mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-teal-subtle text-teal" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
              <FileText size={20} />
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-0">Consultation & Medical Records</h5>
              <span className="text-muted text-xs">Permanent log of your doctor diagnoses, clinical advice, and digital prescriptions</span>
            </div>
          </div>

          <Link to="/patient/history" className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 text-xs fw-semibold">
            Full Medical History &rarr;
          </Link>
        </div>

        {consultations.length === 0 ? (
          <div className="p-4 text-center text-muted text-xs bg-light rounded-3">
            <FileText size={32} className="text-muted opacity-50 mb-2 mx-auto" />
            <p className="fw-bold text-dark mb-1">No Past Consultation Records</p>
            <p className="mb-0">When your specialist completes an OPD consultation, your prescriptions and clinical notes will remain permanently available here.</p>
          </div>
        ) : (
          <div className="row g-3">
            {consultations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="col-md-4">
                <div className="p-3.5 rounded-3 border bg-light h-100 d-flex flex-column text-xs">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-primary-subtle text-primary border font-monospace text-xxs">
                      Token: {rec.tokenNumber}
                    </span>
                    <span className="badge bg-success-subtle text-success text-xxs">
                      Completed
                    </span>
                  </div>

                  <strong className="text-dark fs-6 d-block mb-1">{rec.departmentName}</strong>
                  <span className="text-muted d-block mb-2">Dr. {rec.doctorName} • {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}</span>

                  <div className="p-2.5 bg-white rounded-2 border mb-2">
                    <span className="text-xxs text-muted text-uppercase fw-bold d-block mb-0.5">Diagnosis</span>
                    <p className="text-dark fw-semibold mb-0 text-truncate" title={rec.diagnosis}>{rec.diagnosis || 'Clinical Consultation'}</p>
                  </div>

                  {rec.prescriptionItems && rec.prescriptionItems.length > 0 && (
                    <div className="d-flex align-items-center gap-1.5 text-primary fw-semibold mb-3">
                      <Pill size={14} />
                      <span>{rec.prescriptionItems.length} Prescribed Medicines</span>
                    </div>
                  )}

                  <div className="mt-auto pt-2 border-top">
                    <Link to="/patient/history" className="btn btn-outline-primary btn-sm rounded-pill w-100 text-xxs fw-bold py-1.5">
                      View Full Prescription
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Viewer Modal */}
      {selectedQrAppt && (
        <QrCodeModal 
          show={!!selectedQrAppt}
          onHide={() => setSelectedQrAppt(null)}
          appointment={selectedQrAppt}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
