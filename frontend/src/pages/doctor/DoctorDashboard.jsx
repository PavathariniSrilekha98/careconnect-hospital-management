import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { analyticsService } from '../../services/analyticsService';
import { queueService } from '../../services/queueService';
import { doctorService } from '../../services/doctorService';
import { consultationService } from '../../services/consultationService';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Activity, 
  PhoneForwarded, 
  SkipForward, 
  Stethoscope, 
  Flame, 
  Play, 
  Check, 
  AlertCircle,
  FileText,
  Pill,
  ChevronRight
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { lastEvent, subscribe } = useWebSocket();
  const [stats, setStats] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDoctorData = async () => {
    try {
      const docId = user?.doctorId || user?.id;
      const [statsRes, consRes] = await Promise.allSettled([
        analyticsService.getDoctorDashboard(),
        docId ? consultationService.getByDoctorId(docId) : Promise.resolve({ data: [] })
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data);
      }
      if (consRes.status === 'fulfilled' && consRes.value?.success) {
        setConsultations(consRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user?.doctorId, user?.id, lastEvent]);

  // Subscribe to doctor queue channel
  useEffect(() => {
    if (!user?.doctorId) return;
    const unsubscribe = subscribe(`/topic/queue/doctor/${user.doctorId}`, () => {
      fetchDoctorData();
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.doctorId, subscribe]);

  const handleCallNext = async () => {
    if (!user?.doctorId) return;
    setActionLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await queueService.callNextPatient(user.doctorId);
      if (res.success) {
        setMessage(`Called Token: ${res.data.tokenNumber}`);
        fetchDoctorData();
      }
    } catch (err) {
      console.error('Call next error:', err);
      setError(err.response?.data?.message || 'No patients currently waiting in queue.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId, nextStatus) => {
    setActionLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await queueService.updateTicketStatus(ticketId, nextStatus);
      if (res.success) {
        setMessage(`Ticket status updated to ${nextStatus}`);
        fetchDoctorData();
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError(err.response?.data?.message || 'Failed to update ticket status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading doctor console..." />;
  }

  const currentServing = stats?.currentServingTicket;
  const waitingQueue = stats?.liveWaitingQueue || [];

  return (
    <div className="doctor-dashboard">
      {/* Top Banner */}
      <div className="card border-0 rounded-4 p-4 text-white mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0284c7 100%)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-1 mb-2 text-xs fw-semibold">
              Doctor Consultation Console
            </span>
            <h2 className="fw-extrabold text-white tracking-tight mb-1">
              Dr. {user?.fullName || 'Physician'}
            </h2>
            <p className="text-white text-opacity-90 text-sm mb-0">
              Department: <strong>{user?.departmentName || 'Cardiology'}</strong> • Room: <strong>{user?.roomNumber || 'Room 101'}</strong>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-light rounded-pill px-4 py-2.5 fw-bold text-sm shadow-sm d-flex align-items-center gap-2"
              onClick={handleCallNext}
              disabled={actionLoading || waitingQueue.length === 0}
              style={{ color: '#0f766e' }}
            >
              <PhoneForwarded size={18} />
              <span>Call Next Patient</span>
            </button>
            <Link to="/doctor/history" className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold text-sm d-flex align-items-center gap-1.5">
              <FileText size={15} />
              <span>EMR Records</span>
            </Link>
            <Link to="/doctor/queue" className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold text-sm">
              Queue Board
            </Link>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-success text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-warning text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Waiting in Queue</span>
              <div className="p-2 rounded-3 bg-blue-100 text-primary">
                <Users size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{stats?.waitingPatients || 0}</h3>
            <span className="text-muted text-xxs">Estimated: ~{(stats?.waitingPatients || 0) * (stats?.averageConsultationMinutes || 10)} mins</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Completed Today</span>
              <div className="p-2 rounded-3 bg-emerald-100 text-success">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{stats?.completedConsultations || 0}</h3>
            <span className="text-success text-xxs fw-semibold">Consultations Done</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Skipped / Absent</span>
              <div className="p-2 rounded-3 bg-amber-100 text-warning">
                <SkipForward size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{stats?.skippedPatients || 0}</h3>
            <span className="text-muted text-xxs">Pending retry or re-queued</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Total EMR Records</span>
              <div className="p-2 rounded-3 bg-purple-100 text-purple-700">
                <FileText size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{consultations.length}</h3>
            <span className="text-muted text-xxs">Permanent saved consultations</span>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* CURRENT SERVING PATIENT CARD */}
        <div className="col-lg-6">
          <div className="card p-4 border rounded-4 bg-white shadow-sm h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark text-base mb-0">Current Active Patient</h5>
              {currentServing && <StatusBadge status={currentServing.status} />}
            </div>

            {currentServing ? (
              <div className="d-flex flex-column flex-grow-1">
                <div className="p-4 rounded-4 bg-light text-center border mb-3">
                  <span className="text-muted text-xs text-uppercase fw-bold d-block mb-1">Serving Token</span>
                  <div className="display-4 fw-extrabold text-primary font-monospace tracking-wide mb-1">
                    {currentServing.tokenNumber}
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <PriorityBadge priority={currentServing.priority} />
                    <span className="badge bg-white text-dark border text-xs">Sequence #{currentServing.tokenSequence}</span>
                  </div>
                </div>

                {/* Patient Demographics */}
                <div className="p-3 bg-light rounded-3 text-xs mb-3 d-flex flex-column gap-1.5 border">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Patient Name:</span>
                    <strong className="text-dark">{currentServing.patientName}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Contact:</span>
                    <span className="text-dark">{currentServing.patientPhone || 'On File'}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Status:</span>
                    <strong className="text-primary">{currentServing.status}</strong>
                  </div>
                </div>

                {/* Quick Doctor Controls */}
                <div className="mt-auto d-flex flex-wrap gap-2 pt-2 border-top">
                  {currentServing.status === 'CALLED' && (
                    <button 
                      className="btn btn-primary btn-sm rounded-pill flex-grow-1 py-2 fw-semibold text-xs d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                      onClick={() => handleUpdateStatus(currentServing.id, 'IN_CONSULTATION')}
                      disabled={actionLoading}
                    >
                      <Play size={14} />
                      <span>Start Consultation</span>
                    </button>
                  )}

                  <Link 
                    to={`/doctor/consultation?appointmentId=${currentServing.appointmentId}&ticketId=${currentServing.id}`}
                    className="btn btn-success btn-sm rounded-pill flex-grow-1 py-2 fw-semibold text-xs d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                  >
                    <FileText size={14} />
                    <span>Prescription & EMR</span>
                  </Link>

                  <button 
                    className="btn btn-outline-warning btn-sm rounded-pill px-3 py-2 fw-semibold text-xs d-flex align-items-center gap-1"
                    onClick={() => handleUpdateStatus(currentServing.id, 'SKIPPED')}
                    disabled={actionLoading}
                  >
                    <SkipForward size={14} />
                    <span>Skip</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center my-auto">
                <Activity size={40} className="text-muted opacity-50 mb-2 mx-auto" />
                <h6 className="fw-bold text-dark text-sm">No Patient Currently Called</h6>
                <p className="text-muted text-xs mb-3">Click "Call Next Patient" to notify the next waiting token.</p>
                <button 
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-xs shadow-xs"
                  onClick={handleCallNext}
                  disabled={actionLoading || waitingQueue.length === 0}
                >
                  Call Next ({waitingQueue.length} waiting)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LIVE WAITING QUEUE LIST */}
        <div className="col-lg-6">
          <div className="card p-4 border rounded-4 bg-white shadow-sm h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark text-base mb-0">
                Waiting Queue ({waitingQueue.length})
              </h5>
              <Link to="/doctor/queue" className="text-xs text-primary fw-semibold text-decoration-none">
                Manage Queue &rarr;
              </Link>
            </div>

            {waitingQueue.length === 0 ? (
              <div className="p-4 text-center text-muted text-xs my-auto">
                <CheckCircle2 size={32} className="text-success opacity-75 mb-2 mx-auto" />
                <p className="mb-0">Waiting queue is clear!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2 overflow-auto flex-grow-1" style={{ maxHeight: '420px' }}>
                {waitingQueue.map((ticket, idx) => (
                  <div key={ticket.id} className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2.5">
                      <span className="badge bg-secondary text-white rounded-pill text-xxs px-2 py-1">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <strong className="text-dark font-monospace text-sm">{ticket.tokenNumber}</strong>
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                        <span className="text-muted text-xs d-block">{ticket.patientName}</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 text-xs fw-semibold"
                        onClick={() => handleUpdateStatus(ticket.id, 'CALLED')}
                        disabled={actionLoading}
                      >
                        Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PERMANENT DOCTOR EMR & CONSULTATION LOG SECTION */}
      <div className="card border rounded-4 p-4 bg-white shadow-sm mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-teal-subtle text-teal" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
              <FileText size={20} />
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-0">Doctor EMR & Completed Consultation History</h5>
              <span className="text-muted text-xs">Constant record of patient diagnoses, prescription logs, and clinical advice</span>
            </div>
          </div>

          <Link to="/doctor/history" className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 text-xs fw-semibold">
            View All EMR Records &rarr;
          </Link>
        </div>

        {consultations.length === 0 ? (
          <div className="p-4 text-center text-muted text-xs bg-light rounded-3">
            <FileText size={32} className="text-muted opacity-50 mb-2 mx-auto" />
            <p className="fw-bold text-dark mb-1">No Past Consultation Records</p>
            <p className="mb-0">Consultations and prescriptions you record from the Queue Controller will permanently appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-3">Token</th>
                  <th>Patient Name</th>
                  <th>Diagnosis</th>
                  <th>Prescribed Drugs</th>
                  <th>Date Recorded</th>
                  <th className="text-end pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {consultations.slice(0, 5).map((rec) => (
                  <tr key={rec.id}>
                    <td className="ps-3">
                      <span className="badge bg-primary-subtle text-primary border font-monospace text-xs">
                        {rec.tokenNumber}
                      </span>
                    </td>
                    <td>
                      <strong className="text-dark d-block">{rec.patientName}</strong>
                      <span className="text-muted text-xxs">{rec.departmentName}</span>
                    </td>
                    <td>
                      <span className="text-dark fw-semibold text-xs">{rec.diagnosis || 'Clinical Consultation'}</span>
                    </td>
                    <td>
                      {rec.prescriptionItems && rec.prescriptionItems.length > 0 ? (
                        <span className="badge bg-light text-dark border text-xxs">
                          <Pill size={11} className="me-1 inline text-primary" />
                          {rec.prescriptionItems.length} Medicines
                        </span>
                      ) : (
                        <span className="text-muted text-xxs">None</span>
                      )}
                    </td>
                    <td>
                      <span className="text-muted text-xs">
                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <Link to="/doctor/history" className="btn btn-outline-primary btn-sm rounded-pill text-xxs px-3 py-1">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
