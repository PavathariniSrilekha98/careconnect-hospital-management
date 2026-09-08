import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { useWebSocket } from '../../context/WebSocketContext';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  MapPin, 
  QrCode, 
  XCircle, 
  CalendarPlus, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import QrCodeModal from '../../components/common/QrCodeModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedQrAppt, setSelectedQrAppt] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { lastEvent } = useWebSocket();

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMyAppointments();
      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [lastEvent]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment and release your token?')) {
      return;
    }

    setCancellingId(id);
    setError('');
    setSuccess('');

    try {
      const res = await appointmentService.cancelAppointment(id);
      if (res.success) {
        setSuccess('Appointment cancelled successfully.');
        fetchAppointments();
      }
    } catch (err) {
      console.error('Cancel error:', err);
      setError(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = appointments.filter((a) => {
    if (filter === 'ACTIVE') return a.status === 'SCHEDULED' || a.status === 'CHECKED_IN' || a.status === 'CALLED' || a.status === 'IN_CONSULTATION';
    if (filter === 'COMPLETED') return a.status === 'COMPLETED';
    if (filter === 'CANCELLED') return a.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="my-appointments-page">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">My Appointments</h2>
          <p className="text-muted text-xs mb-0">View scheduled consultations, check-in tokens, and consultation history</p>
        </div>

        <Link 
          to="/patient/book" 
          className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-sm d-flex align-items-center gap-2 shadow-xs"
          style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
        >
          <CalendarPlus size={16} />
          <span>Book New Slot</span>
        </Link>
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

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2">
        {[
          { key: 'ALL', label: 'All Appointments' },
          { key: 'ACTIVE', label: 'Active & Upcoming' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'CANCELLED', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold text-xs transition-colors ${
              filter === tab.key ? 'btn-dark text-white' : 'btn-light text-secondary'
            }`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your appointments..." />
      ) : filtered.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <Calendar size={40} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No appointments found in this tab</h5>
          <p className="text-muted text-xs mb-3">Book an appointment with our specialist physicians anytime.</p>
          <Link to="/patient/book" className="btn btn-outline-primary btn-sm rounded-pill mx-auto">
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((appt) => {
            const isCancellable = appt.status === 'SCHEDULED' || appt.status === 'CHECKED_IN';

            return (
              <div key={appt.id} className="col-lg-6">
                <div className="card p-4 border rounded-4 bg-white shadow-xs h-100 d-flex flex-column">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div>
                      <span className="badge bg-light text-dark border font-monospace text-xs px-2 py-1 me-2">
                        Token: {appt.tokenNumber}
                      </span>
                      <PriorityBadge priority={appt.priority} />
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>

                  <h5 className="fw-bold text-dark text-base mb-1 mt-2">{appt.departmentName}</h5>
                  <span className="text-muted text-xs d-flex align-items-center gap-1 mb-3">
                    <Stethoscope size={14} className="text-primary" /> Dr. {appt.doctorName} ({appt.doctorRoom || 'Room 101'})
                  </span>

                  <div className="p-2.5 bg-light rounded-3 d-flex align-items-center justify-content-between text-xs text-secondary mb-3">
                    <div className="d-flex align-items-center gap-1">
                      <Calendar size={14} className="text-muted" />
                      <span>{appt.appointmentDate}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <Clock size={14} className="text-muted" />
                      <span>{appt.timeSlot}</span>
                    </div>
                  </div>

                  {appt.symptoms && (
                    <p className="text-muted text-xs mb-3 bg-white p-2 rounded border">
                      <strong>Reason:</strong> {appt.symptoms}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="d-flex align-items-center gap-2 mt-auto pt-2 border-top">
                    <button 
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold text-xs d-flex align-items-center gap-1"
                      onClick={() => setSelectedQrAppt(appt)}
                    >
                      <QrCode size={14} />
                      <span>Show QR</span>
                    </button>

                    {(appt.status === 'SCHEDULED' || appt.status === 'CHECKED_IN') && (
                      <Link 
                        to={`/patient/live-queue?appointmentId=${appt.id}`} 
                        className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold text-xs d-flex align-items-center gap-1"
                      >
                        <Clock size={14} />
                        <span>Live Queue</span>
                      </Link>
                    )}

                    {appt.status === 'COMPLETED' && (
                      <Link 
                        to="/patient/history" 
                        className="btn btn-outline-success btn-sm rounded-pill px-3 fw-semibold text-xs d-flex align-items-center gap-1"
                      >
                        <FileText size={14} />
                        <span>Prescription & Notes</span>
                      </Link>
                    )}

                    {isCancellable && (
                      <button 
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold text-xs ms-auto d-flex align-items-center gap-1"
                        onClick={() => handleCancel(appt.id)}
                        disabled={cancellingId === appt.id}
                      >
                        <XCircle size={14} />
                        <span>{cancellingId === appt.id ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal */}
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

export default MyAppointmentsPage;
