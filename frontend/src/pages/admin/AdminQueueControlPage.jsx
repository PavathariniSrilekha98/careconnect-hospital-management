import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import { queueService } from '../../services/queueService';
import { useWebSocket } from '../../context/WebSocketContext';
import { 
  Layers, 
  Activity, 
  Building2, 
  Flame, 
  PhoneForwarded, 
  Pause, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminQueueControlPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { lastEvent, subscribe } = useWebSocket();

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getAllDepartments(true);
      if (res.success && res.data && res.data.length > 0) {
        setDepartments(res.data);
        if (!selectedDeptId) {
          setSelectedDeptId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async () => {
    if (!selectedDeptId) return;
    try {
      const res = await queueService.getDepartmentQueue(selectedDeptId);
      if (res.success) {
        setQueue(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [selectedDeptId, lastEvent]);

  // Subscribe to real-time events for this department
  useEffect(() => {
    if (!selectedDeptId) return;
    const unsubscribe = subscribe(`/topic/queue/${selectedDeptId}`, () => {
      fetchQueue();
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedDeptId, subscribe]);

  const handleUpgradePriority = async (ticketId, priority) => {
    setActionLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await queueService.updateTicketPriority(ticketId, priority, 'Admin supervisor override');
      if (res.success) {
        setMessage(`Upgraded ticket priority to ${priority}`);
        fetchQueue();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update ticket priority.');
    } finally {
      setActionLoading(false);
    }
  };

  const selectedDept = departments.find(d => d.id === selectedDeptId);

  return (
    <div className="admin-queue-control-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Queue Supervisor Console</h2>
          <p className="text-muted text-xs mb-0">Oversee live department queues, fast-track emergencies, and re-order waiting tickets</p>
        </div>

        <button 
          className="btn btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold text-xs d-flex align-items-center gap-1"
          onClick={fetchQueue}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
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

      {/* Department Selector Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-2">
        {departments.map((dept) => (
          <button
            key={dept.id}
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold text-xs d-flex align-items-center gap-1.5 transition-colors ${
              selectedDeptId === dept.id ? 'btn-primary text-white shadow-xs' : 'btn-light text-secondary'
            }`}
            onClick={() => setSelectedDeptId(dept.id)}
          >
            <Building2 size={14} />
            <span>{dept.name} ({dept.activeQueueCount || 0})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading department live queue..." />
      ) : queue.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <Layers size={40} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No active tokens in {selectedDept?.name}</h5>
          <p className="text-muted text-xs mb-0">The queue is currently clear.</p>
        </div>
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Sequence</th>
                  <th>Token Number</th>
                  <th>Patient Name</th>
                  <th>Doctor & Room</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Triage Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((ticket) => (
                  <tr key={ticket.id} className={ticket.priority === 'EMERGENCY' ? 'table-danger bg-opacity-25' : ''}>
                    <td className="ps-4 fw-bold text-muted text-xs">#{ticket.tokenSequence}</td>
                    <td>
                      <span className="fw-bold text-primary font-monospace fs-6">
                        {ticket.tokenNumber}
                      </span>
                    </td>
                    <td>
                      <strong className="text-dark d-block">{ticket.patientName}</strong>
                      <span className="text-muted text-xxs">{ticket.patientPhone || 'On File'}</span>
                    </td>
                    <td>
                      <span className="text-dark text-xs d-block">Dr. {ticket.doctorName}</span>
                      <span className="text-muted text-xxs">{ticket.roomNumber || 'Room 101'}</span>
                    </td>
                    <td>
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td>
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="text-end pe-4">
                      {ticket.priority !== 'EMERGENCY' ? (
                        <button 
                          className="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-1 text-xs d-inline-flex align-items-center gap-1"
                          onClick={() => handleUpgradePriority(ticket.id, 'EMERGENCY')}
                          disabled={actionLoading}
                          title="Triage patient to Emergency front-of-queue"
                        >
                          <Flame size={13} />
                          <span>Emergency Bump</span>
                        </button>
                      ) : (
                        <span className="badge bg-danger text-white text-xxs">Priority 1 Active</span>
                      )}
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

export default AdminQueueControlPage;
