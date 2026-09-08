import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, Stethoscope, Users, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorAppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = async () => {
    if (!user?.doctorId) return;
    try {
      const res = await appointmentService.getDoctorAppointments(user.doctorId, selectedDate);
      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.doctorId, selectedDate]);

  const filtered = appointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctor-appointments-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Doctor Appointment Schedule</h2>
          <p className="text-muted text-xs mb-0">Review patients booked for consultations by date</p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <input 
            type="date" 
            className="form-control form-control-sm text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <div className="position-relative" style={{ minWidth: '220px' }}>
            <Search size={15} className="position-absolute text-muted" style={{ top: '10px', left: '10px' }} />
            <input 
              type="text" 
              className="form-control form-control-sm ps-4 text-xs"
              placeholder="Search patient / token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading appointment schedule..." />
      ) : filtered.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <Calendar size={40} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No appointments booked for {selectedDate}</h5>
          <p className="text-muted text-xs mb-0">Select another date to review booked appointments.</p>
        </div>
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Token</th>
                  <th>Patient Name</th>
                  <th>Time Slot</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th className="pe-4">Reason / Symptoms</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => (
                  <tr key={appt.id}>
                    <td className="ps-4 font-monospace fw-bold text-primary">
                      {appt.tokenNumber}
                    </td>
                    <td>
                      <strong className="text-dark d-block">{appt.patientName}</strong>
                      <span className="text-muted text-xxs">{appt.patientPhone || 'On File'}</span>
                    </td>
                    <td>
                      <span className="text-muted text-xs">{appt.timeSlot}</span>
                    </td>
                    <td>
                      <PriorityBadge priority={appt.priority} />
                    </td>
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="pe-4 text-muted text-xs">
                      {appt.symptoms || 'General routine consultation'}
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

export default DoctorAppointmentsPage;
