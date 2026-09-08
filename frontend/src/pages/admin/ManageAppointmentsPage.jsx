import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Stethoscope, 
  Building2 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getAllAppointments(selectedDate);
      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch hospital appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const filtered = appointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-appointments-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Hospital Appointments Master</h2>
          <p className="text-muted text-xs mb-0">Overview of all patient bookings across departments, doctor schedules, and emergency cases</p>
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
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading hospital appointments..." />
      ) : filtered.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <CalendarCheck size={40} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No appointments booked for {selectedDate}</h5>
          <p className="text-muted text-xs mb-0">Select another date to view scheduled visits.</p>
        </div>
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Token</th>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Doctor & Room</th>
                  <th>Time Slot</th>
                  <th>Priority</th>
                  <th>Status</th>
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
                      <span className="text-dark text-xs">{appt.departmentName}</span>
                    </td>
                    <td>
                      <span className="text-dark text-xs d-block">Dr. {appt.doctorName}</span>
                      <span className="text-muted text-xxs">{appt.doctorRoom || 'Room 101'}</span>
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

export default ManageAppointmentsPage;
