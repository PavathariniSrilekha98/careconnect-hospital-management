import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { queueService } from '../../services/queueService';
import { departmentService } from '../../services/departmentService';
import { useSpeechAnnouncement } from '../../hooks/useSpeechAnnouncement';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Tv, 
  Maximize2, 
  Clock, 
  HeartPulse, 
  AlertCircle, 
  CheckCircle2, 
  Users,
  Flame
} from 'lucide-react';
import PriorityBadge from '../../components/common/PriorityBadge';

const LiveQueueDisplayPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('ALL');
  const [displayFeed, setDisplayFeed] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const { connected, subscribe } = useWebSocket();
  const { announceToken } = useSpeechAnnouncement();

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial departments and public display feed
  useEffect(() => {
    const init = async () => {
      try {
        const [deptRes, feedRes] = await Promise.all([
          departmentService.getAllDepartments(true),
          queueService.getHospitalDisplayFeed()
        ]);
        if (deptRes.success) setDepartments(deptRes.data || []);
        if (feedRes.success) setDisplayFeed(feedRes.data || {});
      } catch (err) {
        console.error('Failed to initialize display feed:', err);
      }
    };

    init();
  }, []);

  // Subscribe to real-time public display WebSocket channel
  useEffect(() => {
    const unsubscribe = subscribe('/topic/public-display', (msg) => {
      console.log('📢 TV Screen received real-time queue event:', msg);

      // Trigger audio voice announcement if enabled
      if (msg.type === 'NEXT_PATIENT_CALLED' && msg.tokenNumber && msg.roomNumber) {
        if (audioEnabled) {
          announceToken(msg.tokenNumber, msg.roomNumber, msg.doctorName);
        }
      }

      // Re-fetch or merge display feed
      queueService.getHospitalDisplayFeed().then((res) => {
        if (res.success) setDisplayFeed(res.data || {});
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe, audioEnabled, announceToken]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  const departmentsList = displayFeed.departments || [];
  const filteredDepartments = selectedDeptId === 'ALL'
    ? departmentsList
    : departmentsList.filter(d => d.departmentId === selectedDeptId);

  return (
    <div className="min-vh-100 bg-dark text-white d-flex flex-column overflow-hidden" style={{ backgroundColor: '#090d16', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Header Bar */}
      <header className="px-4 py-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center justify-content-between bg-slate-900" style={{ backgroundColor: '#0f172a' }}>
        <div className="d-flex align-items-center gap-3">
          <div 
            className="d-flex align-items-center justify-content-center rounded-3 text-white shadow-sm" 
            style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
          >
            <Activity size={30} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="fw-extrabold mb-0 tracking-tight text-white fs-4">CARECONNECT MULTI-SPECIALITY HOSPITAL</h2>
            <span className="text-secondary text-xs text-uppercase tracking-widest fw-semibold" style={{ color: '#38bdf8' }}>
              Smart OPD Command • Real-Time Queue TV Display
            </span>
          </div>
        </div>

        {/* Center Department Filter Pills */}
        <div className="d-none d-lg-flex align-items-center gap-2">
          <button 
            className={`btn btn-sm rounded-pill px-3 fw-bold text-xs ${selectedDeptId === 'ALL' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSelectedDeptId('ALL')}
          >
            All Departments
          </button>
          {departments.map((d) => (
            <button 
              key={d.id}
              className={`btn btn-sm rounded-pill px-3 fw-bold text-xs ${selectedDeptId === d.id ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
              onClick={() => setSelectedDeptId(d.id)}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Right Info: Clock, Audio & Fullscreen */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="fw-extrabold text-lg text-white font-monospace leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs text-secondary text-uppercase tracking-wider" style={{ color: '#94a3b8' }}>
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button 
              className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 py-1.5 ${audioEnabled ? 'btn-success' : 'btn-outline-secondary text-light'}`}
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Voice Announcements Enabled' : 'Enable Voice Chimes & Announcements'}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="text-xs fw-semibold">{audioEnabled ? 'Audio ON' : 'Audio OFF'}</span>
            </button>

            <button 
              className="btn btn-outline-secondary btn-sm text-light rounded-circle p-2"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Display Grid */}
      <main className="flex-grow-1 p-4 overflow-auto">
        {filteredDepartments.length === 0 ? (
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
            <Activity size={48} className="text-secondary opacity-50 mb-3" />
            <h4 className="fw-bold text-light">No Active OPD Queues</h4>
            <p className="text-secondary text-sm">Consultation counters will appear here once doctors start calling tokens.</p>
          </div>
        ) : (
          <div className="row g-4 h-100">
            {filteredDepartments.map((dept) => {
              const serving = dept.currentServingTicket;
              const waitingList = dept.upcomingWaitingTickets || [];

              return (
                <div key={dept.departmentId} className={`${filteredDepartments.length === 1 ? 'col-12' : 'col-xl-6 col-12'}`}>
                  <div 
                    className="card h-100 border border-secondary border-opacity-25 rounded-4 overflow-hidden shadow-lg"
                    style={{ backgroundColor: '#131b2e' }}
                  >
                    {/* Department Header */}
                    <div 
                      className="px-4 py-3 d-flex align-items-center justify-content-between"
                      style={{ background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <HeartPulse size={22} className="text-primary" style={{ color: '#38bdf8' }} />
                        <h4 className="fw-extrabold text-white mb-0 text-uppercase tracking-wider fs-5">
                          {dept.departmentName}
                        </h4>
                      </div>
                      <span className="badge bg-primary text-white px-3 py-1 text-xs fw-bold rounded-pill">
                        {dept.roomBlock || 'Room Block A'}
                      </span>
                    </div>

                    {/* NOW SERVING HERO BOX */}
                    <div className="p-4 text-center border-bottom border-secondary border-opacity-25" style={{ background: 'linear-gradient(180deg, #131b2e 0%, #0b1120 100%)' }}>
                      <span className="badge bg-success-subtle text-success px-4 py-1.5 rounded-pill text-xs fw-bold text-uppercase tracking-widest mb-3 border border-success-subtle">
                        ● NOW SERVING
                      </span>

                      {serving ? (
                        <div className="animate-pulse-subtle">
                          <div 
                            className="display-2 fw-extrabold text-white tracking-wider my-2 font-monospace"
                            style={{ textShadow: '0 0 30px rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                          >
                            {serving.tokenNumber}
                          </div>

                          <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                            <div className="bg-dark px-4 py-2 rounded-3 border border-secondary border-opacity-50">
                              <span className="text-secondary text-xs text-uppercase d-block fw-bold">Doctor</span>
                              <span className="fw-bold text-white fs-6">Dr. {serving.doctorName || 'On Duty'}</span>
                            </div>
                            <div className="bg-primary px-4 py-2 rounded-3 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
                              <span className="text-white text-opacity-75 text-xs text-uppercase d-block fw-bold">Proceed To</span>
                              <span className="fw-extrabold text-white fs-5">{serving.roomNumber || 'Room 101'}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-muted">
                          <Clock size={36} className="mb-2 opacity-50 text-secondary" />
                          <h5 className="fw-semibold text-secondary mb-0">Waiting for next patient call...</h5>
                        </div>
                      )}
                    </div>

                    {/* UPCOMING NEXT IN LINE TICKER */}
                    <div className="p-3 bg-slate-900" style={{ backgroundColor: '#0b1120' }}>
                      <div className="d-flex align-items-center justify-content-between mb-2 px-2">
                        <span className="text-secondary text-xs fw-bold text-uppercase tracking-wider">
                          Next in Line ({waitingList.length})
                        </span>
                        <span className="text-xs text-muted">Please stay nearby</span>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {waitingList.length === 0 ? (
                          <span className="text-secondary text-xs px-2 py-1">No upcoming tokens waiting</span>
                        ) : (
                          waitingList.slice(0, 8).map((ticket, index) => (
                            <div 
                              key={ticket.id} 
                              className="px-3 py-2 rounded-3 border border-secondary border-opacity-25 bg-slate-800 d-flex align-items-center gap-2 shadow-xs"
                              style={{ backgroundColor: index === 0 ? '#1e293b' : '#111827' }}
                            >
                              <span className="badge bg-secondary text-light rounded-pill text-xxs px-1.5">
                                #{index + 1}
                              </span>
                              <span className="fw-bold text-sm text-light font-monospace">
                                {ticket.tokenNumber}
                              </span>
                              {ticket.priority === 'EMERGENCY' && (
                                <span className="badge bg-danger text-white text-xxs">EMERGENCY</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Ticker Bar */}
      <footer className="px-4 py-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between text-xs text-secondary bg-slate-900" style={{ backgroundColor: '#0f172a' }}>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success rounded-circle" style={{ width: '8px', height: '8px' }} />
          <span>WebSocket Real-Time Broadcast Active</span>
        </div>
        <div className="d-flex align-items-center gap-4">
          <span>Please scan your appointment QR code at the Kiosk to activate your spot</span>
          <span>Emergency Helpline: +1 (800) 555-CARE</span>
        </div>
      </footer>
    </div>
  );
};

export default LiveQueueDisplayPage;
