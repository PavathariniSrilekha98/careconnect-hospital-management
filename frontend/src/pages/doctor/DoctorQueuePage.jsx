import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { queueService } from '../../services/queueService';
import { 
  Activity, 
  PhoneForwarded, 
  Play, 
  Check, 
  SkipForward, 
  UserX, 
  FileText, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorQueuePage = () => {
  const { user } = useAuth();
  const { lastEvent, subscribe } = useWebSocket();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDoctorQueue = async () => {
    if (!user?.doctorId) return;
    try {
      const res = await queueService.getDoctorQueue(user.doctorId);
      if (res.success) {
        setQueue(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load queue:', err);
      setError('Failed to fetch doctor queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorQueue();
  }, [user?.doctorId, lastEvent]);

  // Subscribe to real-time updates on this doctor's queue
  useEffect(() => {
    if (!user?.doctorId) return;
    const unsubscribe = subscribe(`/topic/queue/doctor/${user.doctorId}`, (msg) => {
      console.log('Doctor queue update received:', msg);
      fetchDoctorQueue();
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
        fetchDoctorQueue();
      }
    } catch (err) {
      console.error('Call next error:', err);
      setError(err.response?.data?.message || 'No waiting patients found.');
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
        setMessage(`Updated ticket status to ${nextStatus}`);
        fetchDoctorQueue();
      }
    } catch (err) {
      console.error('Status error:', err);
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgradePriority = async (ticketId, newPriority) => {
    setActionLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await queueService.updateTicketPriority(ticketId, newPriority, 'Doctor clinical escalation');
      if (res.success) {
        setMessage(`Upgraded ticket priority to ${newPriority}`);
        fetchDoctorQueue();
      }
    } catch (err) {
      console.error('Priority error:', err);
      setError(err.response?.data?.message || 'Failed to update priority.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredQueue = queue.filter((t) => {
    if (filter === 'WAITING') return t.status === 'WAITING';
    if (filter === 'ACTIVE') return t.status === 'CALLED' || t.status === 'IN_CONSULTATION';
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    if (filter === 'SKIPPED') return t.status === 'SKIPPED' || t.status === 'ABSENT';
    return true;
  });

  const emergencyWaitingTicket = queue.find(t => t.priority === 'EMERGENCY' && (t.status === 'WAITING' || t.status === 'CALLED'));

  return (
    <div className="doctor-queue-page">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Queue Controller Board</h2>
          <p className="text-muted text-xs mb-0">
            Real-time OPD queue management for Dr. {user?.fullName} ({user?.departmentName})
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold text-xs d-flex align-items-center gap-1.5"
            onClick={fetchDoctorQueue}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button 
            className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-sm shadow-xs d-flex align-items-center gap-2"
            onClick={handleCallNext}
            disabled={actionLoading}
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
          >
            <PhoneForwarded size={16} />
            <span>Call Next Patient</span>
          </button>
        </div>
      </div>

      {/* Emergency Flash Banner if an Emergency Patient is in Queue */}
      {emergencyWaitingTicket && (
        <div className="alert alert-danger border-danger border-2 p-3.5 rounded-4 mb-4 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3" style={{ backgroundColor: '#fef2f2' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
              <Flame size={24} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-danger text-white text-xs fw-bold px-2 py-1">🚨 EMERGENCY PATIENT ESCALATION</span>
                <strong className="text-dark fs-6 font-monospace">Token: {emergencyWaitingTicket.tokenNumber}</strong>
                <span className="text-dark fw-bold">({emergencyWaitingTicket.patientName})</span>
              </div>
              <span className="text-danger text-xs fw-semibold d-block mt-0.5">
                Direct Room Escalation: This patient is prioritized as NEXT IN LINE right after your current patient!
              </span>
            </div>
          </div>
          <button 
            className="btn btn-danger btn-sm rounded-pill px-4 py-2 fw-bold text-xs d-flex align-items-center gap-1.5 shadow-sm"
            onClick={() => handleUpdateStatus(emergencyWaitingTicket.id, 'CALLED')}
            disabled={actionLoading || emergencyWaitingTicket.status === 'CALLED'}
          >
            <PhoneForwarded size={14} />
            <span>{emergencyWaitingTicket.status === 'CALLED' ? 'Emergency Patient Called' : 'Call Emergency Patient Now'}</span>
          </button>
        </div>
      )}

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

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2">
        {[
          { key: 'ALL', label: `All Tokens (${queue.length})` },
          { key: 'WAITING', label: `Waiting (${queue.filter(t => t.status === 'WAITING').length})` },
          { key: 'ACTIVE', label: `In Progress (${queue.filter(t => t.status === 'CALLED' || t.status === 'IN_CONSULTATION').length})` },
          { key: 'COMPLETED', label: `Completed (${queue.filter(t => t.status === 'COMPLETED').length})` },
          { key: 'SKIPPED', label: `Skipped/Absent (${queue.filter(t => t.status === 'SKIPPED' || t.status === 'ABSENT').length})` }
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
        <LoadingSpinner text="Fetching live doctor queue..." />
      ) : filteredQueue.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <Activity size={40} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No patient tickets found in this tab</h5>
          <p className="text-muted text-xs mb-0">Patients who book appointments or check in at the hospital will appear here.</p>
        </div>
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Seq</th>
                  <th>Token</th>
                  <th>Patient Name</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Wait Time</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className={
                      ticket.priority === 'EMERGENCY' && ticket.status === 'WAITING'
                        ? 'table-danger bg-danger bg-opacity-10 border-start border-danger border-4'
                        : ticket.status === 'CALLED' 
                        ? 'table-warning bg-opacity-25' 
                        : ticket.status === 'IN_CONSULTATION' 
                        ? 'table-primary bg-opacity-25' 
                        : ''
                    }
                  >
                    <td className="ps-4 fw-bold text-muted text-xs">#{ticket.tokenSequence}</td>
                    <td>
                      <span className="fw-bold text-primary font-monospace fs-6">
                        {ticket.tokenNumber}
                      </span>
                    </td>
                    <td>
                      <strong className="text-dark d-block">{ticket.patientName}</strong>
                      <span className="text-muted text-xxs">{ticket.patientPhone || 'No Phone'}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <PriorityBadge priority={ticket.priority} />
                        {ticket.priority === 'NORMAL' && (
                          <button 
                            className="btn btn-link btn-sm text-danger p-0 text-xxs text-decoration-none"
                            onClick={() => handleUpgradePriority(ticket.id, 'EMERGENCY')}
                            title="Escalate to Emergency Priority"
                          >
                            <Flame size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td>
                      <span className="text-muted text-xs font-monospace">
                        {ticket.estimatedWaitingMinutes ? `~${ticket.estimatedWaitingMinutes}m` : '0m'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center gap-1.5">
                        {ticket.status === 'WAITING' && (
                          <button 
                            className="btn btn-primary btn-sm rounded-pill px-3 py-1 fw-semibold text-xs d-flex align-items-center gap-1 shadow-xs"
                            onClick={() => handleUpdateStatus(ticket.id, 'CALLED')}
                            disabled={actionLoading}
                          >
                            <PhoneForwarded size={13} />
                            <span>Call</span>
                          </button>
                        )}

                        {ticket.status === 'CALLED' && (
                          <button 
                            className="btn btn-warning btn-sm rounded-pill px-3 py-1 fw-semibold text-xs d-flex align-items-center gap-1 text-dark shadow-xs"
                            onClick={() => handleUpdateStatus(ticket.id, 'IN_CONSULTATION')}
                            disabled={actionLoading}
                          >
                            <Play size={13} />
                            <span>Start</span>
                          </button>
                        )}

                        {(ticket.status === 'CALLED' || ticket.status === 'IN_CONSULTATION') && (
                          <Link 
                            to={`/doctor/consultation?appointmentId=${ticket.appointmentId}&ticketId=${ticket.id}`}
                            className="btn btn-success btn-sm rounded-pill px-3 py-1 fw-semibold text-xs d-flex align-items-center gap-1 shadow-xs"
                          >
                            <FileText size={13} />
                            <span>EMR & Finish</span>
                          </Link>
                        )}

                        {(ticket.status === 'WAITING' || ticket.status === 'CALLED') && (
                          <button 
                            className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-1 text-xs"
                            onClick={() => handleUpdateStatus(ticket.id, 'SKIPPED')}
                            disabled={actionLoading}
                            title="Skip Patient"
                          >
                            <SkipForward size={13} />
                          </button>
                        )}

                        {ticket.status === 'SKIPPED' && (
                          <button 
                            className="btn btn-outline-primary btn-sm rounded-pill px-2.5 py-1 text-xs"
                            onClick={() => handleUpdateStatus(ticket.id, 'WAITING')}
                            disabled={actionLoading}
                            title="Re-queue back to waiting"
                          >
                            Re-queue
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorQueuePage;
