import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { queueService } from '../../services/queueService';
import { useWebSocket } from '../../context/WebSocketContext';
import { 
  Activity, 
  Clock, 
  Users, 
  Stethoscope, 
  MapPin, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  Flame,
  ArrowRight,
  QrCode
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientLiveQueuePage = () => {
  const [appointment, setAppointment] = useState(null);
  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calledAlert, setCalledAlert] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const { connected, subscribe, lastEvent } = useWebSocket();

  const queryParams = new URLSearchParams(location.search);
  const targetApptId = queryParams.get('appointmentId');
  const targetToken = queryParams.get('token');

  const fetchQueueData = async () => {
    try {
      // 1. Get patient appointments
      const apptRes = await appointmentService.getMyAppointments();
      let target = null;

      if (apptRes.success && apptRes.data && apptRes.data.length > 0) {
        if (targetApptId) {
          target = apptRes.data.find(a => a.id === targetApptId);
        } else if (targetToken) {
          target = apptRes.data.find(a => a.tokenNumber === targetToken);
        } else {
          // Find first active appointment
          target = apptRes.data.find(a => 
            a.status === 'SCHEDULED' || a.status === 'CHECKED_IN' || a.status === 'CALLED' || a.status === 'IN_CONSULTATION'
          ) || apptRes.data[0];
        }
      }

      setAppointment(target);

      // 2. If appointment found, fetch full department/doctor live queue
      if (target && target.departmentId) {
        const qRes = await queueService.getDepartmentQueue(target.departmentId);
        if (qRes.success) {
          setQueueList(qRes.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to load queue data:', err);
      setError('Could not load live queue position.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, [targetApptId, targetToken]);

  // Real-time WebSocket live updates
  useEffect(() => {
    if (!appointment?.departmentId) return;

    const topic = `/topic/queue/${appointment.departmentId}`;
    const unsubscribe = subscribe(topic, (msg) => {
      console.log('⚡ Patient Live Queue received queue event:', msg);

      // Check if user's token was called
      if (msg.tokenNumber === appointment.tokenNumber) {
        setCalledAlert(true);
      }

      fetchQueueData();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [appointment?.departmentId, appointment?.tokenNumber, subscribe]);

  if (loading) {
    return <LoadingSpinner text="Connecting to live queue..." />;
  }

  if (!appointment) {
    return (
      <div className="card p-5 text-center bg-white rounded-4 border shadow-sm">
        <Activity size={48} className="text-muted opacity-50 mx-auto mb-3" />
        <h4 className="fw-bold text-dark">No Active Queue Token</h4>
        <p className="text-muted text-sm mb-4">You do not have any active appointments in today's OPD queue.</p>
        <Link to="/patient/book" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-sm mx-auto">
          Book Appointment Now
        </Link>
      </div>
    );
  }

  // Calculate live position
  const currentServingTicket = queueList.find(t => t.status === 'CALLED' || t.status === 'IN_CONSULTATION');
  const myTicket = queueList.find(t => t.tokenNumber === appointment.tokenNumber);

  // Position calculation
  const waitingTickets = queueList.filter(t => t.status === 'WAITING');
  const myIndexInWaiting = waitingTickets.findIndex(t => t.tokenNumber === appointment.tokenNumber);
  const patientsAhead = myIndexInWaiting >= 0 ? myIndexInWaiting : 0;
  const estimatedWaitMins = patientsAhead * 10;

  const isMyTurnCalled = appointment.status === 'CALLED' || myTicket?.status === 'CALLED';
  const isMyTurnInConsultation = appointment.status === 'IN_CONSULTATION' || myTicket?.status === 'IN_CONSULTATION';

  const steps = [
    { key: 'SCHEDULED', label: 'Booked' },
    { key: 'WAITING', label: 'In Queue' },
    { key: 'CALLED', label: 'Called' },
    { key: 'IN_CONSULTATION', label: 'Consulting' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const currentStatus = myTicket?.status || appointment.status;

  const getStepIndex = (status) => {
    switch (status) {
      case 'SCHEDULED': return 0;
      case 'CHECKED_IN':
      case 'WAITING': return 1;
      case 'CALLED': return 2;
      case 'IN_CONSULTATION': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const activeStepIndex = getStepIndex(currentStatus);

  return (
    <div className="patient-live-queue py-4">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Token Called Chime Banner */}
        {(calledAlert || isMyTurnCalled) && (
          <div className="alert alert-warning border-2 border-warning p-4 rounded-4 shadow-lg mb-4 text-center animate-pulse">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <Volume2 size={28} className="text-warning text-dark" />
              <h3 className="fw-extrabold mb-0 text-dark">IT'S YOUR TURN!</h3>
            </div>
            <p className="fs-5 text-dark fw-semibold mb-2">
              Token <span className="font-monospace text-primary">{appointment.tokenNumber}</span> has been called.
            </p>
            <div className="p-3 bg-white rounded-3 d-inline-block border text-dark fw-bold text-base">
              Please proceed immediately to <strong>{appointment.doctorRoom || 'Room 101'}</strong> for Dr. {appointment.doctorName}.
            </div>
          </div>
        )}

        {/* Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2 text-xs">
              Live WebSocket Sync
            </span>
            <h2 className="fw-extrabold text-dark tracking-tight mb-1">Real-Time Queue Tracker</h2>
            <p className="text-muted text-xs mb-0">Updates instantly without page refresh when doctor calls tokens</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <PriorityBadge priority={appointment.priority} />
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Live Progress Tracker Bar */}
        <div className="card border p-4 rounded-4 bg-white shadow-sm mb-4">
          <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-3">Queue Status Journey</h6>
          <div className="d-flex align-items-center justify-content-between position-relative px-2">
            {steps.map((st, idx) => {
              const isPassed = activeStepIndex >= idx;
              const isCurrent = activeStepIndex === idx;

              return (
                <div key={st.key} className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 2 }}>
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-xs ${
                      isPassed ? 'bg-primary text-white shadow-xs' : 'bg-light text-muted border'
                    }`}
                    style={{ width: '32px', height: '32px' }}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xxs fw-semibold mt-1.5 ${isCurrent ? 'text-primary' : isPassed ? 'text-dark' : 'text-muted'}`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time KPI Card */}
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm mb-4 text-center">
          <span className="text-muted text-xs text-uppercase fw-bold tracking-wider mb-2 d-block">
            {appointment.departmentName} Department
          </span>

          <div className="row g-4 my-2">
            {/* Current Serving */}
            <div className="col-sm-6 col-12">
              <div className="p-4 rounded-4 bg-light border">
                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill text-xs fw-bold mb-2">
                  ● NOW SERVING
                </span>
                <div className="display-4 fw-extrabold text-dark font-monospace tracking-wide">
                  {currentServingTicket?.tokenNumber || appointment.currentServingToken || '---'}
                </div>
                <span className="text-muted text-xs d-block mt-1">
                  Dr. {appointment.doctorName}
                </span>
              </div>
            </div>

            {/* My Token */}
            <div className="col-sm-6 col-12">
              <div className="p-4 rounded-4 bg-primary-subtle border border-primary-subtle">
                <span className="badge bg-primary text-white px-3 py-1 rounded-pill text-xs fw-bold mb-2">
                  ★ MY TOKEN
                </span>
                <div className="display-4 fw-extrabold text-primary font-monospace tracking-wide">
                  {appointment.tokenNumber}
                </div>
                <span className="text-primary text-xs d-block mt-1 fw-semibold">
                  Patient: {appointment.patientName}
                </span>
              </div>
            </div>
          </div>

          {/* Queue Statistics Metric Grid */}
          <div className="row g-3 mt-2">
            <div className="col-sm-6">
              <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <Users size={20} className="text-primary" />
                  <span className="text-xs text-dark fw-semibold">Patients Ahead of You:</span>
                </div>
                <span className="fw-extrabold text-dark fs-5">{patientsAhead}</span>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  <span className="text-xs text-dark fw-semibold">Estimated Waiting Time:</span>
                </div>
                <span className="fw-extrabold text-primary fs-5">~{estimatedWaitMins} minutes</span>
              </div>
            </div>
          </div>

          {/* Consultation Location & Notes */}
          <div className="mt-4 p-3 bg-blue-50 rounded-3 border border-blue-100 text-xs text-start d-flex flex-column gap-1.5">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted d-flex align-items-center gap-1"><MapPin size={14} /> Doctor Consultation Room:</span>
              <strong className="text-dark">{appointment.doctorRoom || 'Room 101'}</strong>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted d-flex align-items-center gap-1"><Clock size={14} /> Scheduled Date & Time:</span>
              <strong className="text-dark">{appointment.appointmentDate} ({appointment.timeSlot})</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLiveQueuePage;
