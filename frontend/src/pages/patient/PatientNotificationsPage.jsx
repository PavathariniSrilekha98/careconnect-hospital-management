import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { useWebSocket } from '../../context/WebSocketContext';
import { Bell, CheckCheck, Clock, CheckCircle2, AlertCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lastEvent, notifications: wsNotifications } = useWebSocket();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getMy(false);
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [lastEvent]);

  // Merge live WS notifications if they arrive in real-time
  useEffect(() => {
    if (wsNotifications && wsNotifications.length > 0) {
      setNotifications(prev => {
        const ids = new Set(prev.map(n => n.id));
        const newOnes = wsNotifications.filter(n => n.id && !ids.has(n.id));
        return [...newOnes, ...prev];
      });
    }
  }, [wsNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, isRead: true }) : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="patient-notifications-page py-2">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Notifications Center</h2>
          <p className="text-muted text-xs mb-0">Real-time alerts regarding your token calls, queue status updates, and doctor notices</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 fw-semibold text-xs d-flex align-items-center gap-1.5"
            onClick={fetchNotifications}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          {notifications.some(n => !n.isRead) && (
            <button 
              className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5 fw-semibold text-xs d-flex align-items-center gap-1.5"
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={16} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your notification feed..." />
      ) : notifications.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <Bell size={40} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No Notifications Yet</h5>
          <p className="text-muted text-xs mb-0">You're all caught up! Real-time alerts when your doctor calls your token will appear here.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2.5">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`card p-3.5 border rounded-4 shadow-xs transition-all ${
                n.isRead ? 'bg-white' : 'bg-blue-50 border-primary-subtle'
              }`}
            >
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className={`p-2.5 rounded-3 text-white flex-shrink-0 ${n.type === 'EMERGENCY' ? 'bg-danger' : 'bg-primary'}`}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="fw-bold text-dark text-sm mb-0">{n.title}</h6>
                      {!n.isRead && (
                        <span className="badge bg-primary text-white text-xxs px-2 py-0.5 rounded-pill">NEW</span>
                      )}
                    </div>
                    <p className="text-muted text-xs mb-2 mt-1">{n.message}</p>
                    <div className="d-flex flex-wrap align-items-center gap-2 text-xxs text-muted">
                      {n.tokenNumber && (
                        <span className="badge bg-primary-subtle text-primary border font-monospace px-2 py-0.5">
                          Token: {n.tokenNumber}
                        </span>
                      )}
                      {n.roomNumber && (
                        <span className="badge bg-light text-dark border px-2 py-0.5">
                          Room: {n.roomNumber}
                        </span>
                      )}
                      <span>
                        {n.createdAt ? new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <button 
                    className="btn btn-link text-primary btn-sm p-0 text-xs text-decoration-none fw-semibold flex-shrink-0"
                    onClick={() => handleMarkRead(n.id)}
                    title="Mark as read"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientNotificationsPage;
