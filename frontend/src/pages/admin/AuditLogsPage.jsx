import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ScrollText, Search, ShieldCheck, Clock, User, Activity, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      const url = actionFilter ? `/audit-logs?action=${actionFilter}` : '/audit-logs';
      const res = await api.get(url);
      if (res.data && res.data.success) {
        setLogs(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const filtered = logs.filter(l => 
    l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="audit-logs-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">System Audit & Compliance Logs</h2>
          <p className="text-muted text-xs mb-0">Immutable records of all user actions, queue state changes, and staff operations</p>
        </div>

        <button 
          className="btn btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold text-xs d-flex align-items-center gap-1"
          onClick={fetchLogs}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="card p-3 border rounded-4 bg-white shadow-xs mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div className="position-relative flex-grow-1" style={{ maxWidth: '350px' }}>
            <Search size={15} className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} />
            <input 
              type="text" 
              className="form-control form-control-sm rounded-pill ps-5 text-xs"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="form-select form-select-sm rounded-pill text-xs" 
            style={{ width: 'auto', minWidth: '180px' }}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="BOOK_APPOINTMENT">BOOK_APPOINTMENT</option>
            <option value="CHECK_IN">CHECK_IN</option>
            <option value="CALL_NEXT_PATIENT">CALL_NEXT_PATIENT</option>
            <option value="CONSULTATION_COMPLETED">CONSULTATION_COMPLETED</option>
            <option value="CREATE_DOCTOR">CREATE_DOCTOR</option>
            <option value="CREATE_DEPARTMENT">CREATE_DEPARTMENT</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading system audit logs..." />
      ) : filtered.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <ScrollText size={40} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No audit log entries recorded</h5>
          <p className="text-muted text-xs mb-0">System events will automatically appear here as users interact with the app.</p>
        </div>
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Timestamp</th>
                  <th>Action</th>
                  <th>User & Role</th>
                  <th>Entity</th>
                  <th>Description</th>
                  <th className="pe-4">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id}>
                    <td className="ps-4 text-muted text-xs font-monospace">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' }) : 'Recent'}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border text-xs font-monospace">
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <strong className="text-dark text-xs d-block">{log.userEmail || 'Anonymous'}</strong>
                      <span className="badge bg-secondary-subtle text-secondary text-xxs">{log.userRole || 'SYSTEM'}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary text-xs">
                        {log.entityName || 'System'}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted text-xs">{log.description}</span>
                    </td>
                    <td className="pe-4 text-muted text-xs font-monospace">
                      {log.ipAddress || '127.0.0.1'}
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

export default AuditLogsPage;
