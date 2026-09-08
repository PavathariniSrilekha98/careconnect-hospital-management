import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { analyticsService } from '../../services/analyticsService';
import { departmentService } from '../../services/departmentService';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  CalendarCheck, 
  Clock, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  BarChart3, 
  Layers, 
  ScrollText,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { lastEvent } = useWebSocket();
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [statsRes, deptRes] = await Promise.all([
        analyticsService.getAdminDashboard(),
        departmentService.getAllDepartments(false)
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (deptRes.success) setDepartments(deptRes.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [lastEvent]);

  if (loading) {
    return <LoadingSpinner text="Loading hospital management analytics..." />;
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Banner */}
      <div className="card border-0 rounded-4 p-4 text-white mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-1 mb-2 text-xs fw-semibold">
              Hospital Operations Command Center
            </span>
            <h2 className="fw-extrabold text-white tracking-tight mb-1">
              Admin Console Overview
            </h2>
            <p className="text-white text-opacity-90 text-sm mb-0">
              Live hospital traffic monitoring, department queue depths, and staff allocation.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to="/admin/queues" className="btn btn-light rounded-pill px-3.5 py-2 fw-bold text-sm text-purple-700 shadow-sm d-flex align-items-center gap-2">
              <Layers size={16} />
              <span>Queue Supervisor</span>
            </Link>
            <Link to="/admin/reports" className="btn btn-outline-light rounded-pill px-3.5 py-2 fw-semibold text-sm d-flex align-items-center gap-2">
              <BarChart3 size={16} />
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Total Patients</span>
              <div className="p-2 rounded-3 bg-blue-100 text-primary">
                <Users size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{stats?.totalPatients || 0}</h3>
            <span className="text-muted text-xxs">Registered Patient Accounts</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Active Doctors</span>
              <div className="p-2 rounded-3 bg-teal-100 text-teal-700">
                <Stethoscope size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{stats?.activeDoctors || 0} / {stats?.totalDoctors || 0}</h3>
            <span className="text-muted text-xxs">On OPD duty today</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Today's Appointments</span>
              <div className="p-2 rounded-3 bg-purple-100 text-purple-700">
                <CalendarCheck size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{stats?.todayAppointments || 0}</h3>
            <span className="text-muted text-xxs">{stats?.completedConsultations || 0} Completed ({stats?.waitingPatients || 0} Waiting)</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted text-xs text-uppercase fw-bold">Average Wait Time</span>
              <div className="p-2 rounded-3 bg-amber-100 text-warning">
                <Clock size={18} />
              </div>
            </div>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">~{stats?.averageWaitTimeMinutes || 15}m</h3>
            <span className="text-muted text-xxs">Hospital-wide average</span>
          </div>
        </div>
      </div>

      {/* Departments Live Queues Grid */}
      <div className="card p-4 border rounded-4 bg-white shadow-sm mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
          <div>
            <h5 className="fw-bold text-dark text-base mb-0">Live Department Queue Depths</h5>
            <span className="text-muted text-xs">Real-time status across outpatient specialties</span>
          </div>
          <Link to="/admin/departments" className="text-xs text-primary fw-semibold text-decoration-none">
            Manage Departments &rarr;
          </Link>
        </div>

        <div className="row g-3">
          {departments.map((dept) => (
            <div key={dept.id} className="col-lg-4 col-md-6">
              <div className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between hover-bg-white transition-all">
                <div className="d-flex align-items-center gap-2.5">
                  <div className="p-2 rounded-3 bg-white text-primary border shadow-xs">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <strong className="text-dark text-sm d-block">{dept.name}</strong>
                    <span className="text-muted text-xxs">{dept.roomBlock}</span>
                  </div>
                </div>
                <div className="text-end">
                  <span className="badge bg-primary text-white rounded-pill text-xs px-2.5 py-1">
                    {dept.activeQueueCount || 0} waiting
                  </span>
                  <span className="text-muted text-xxs d-block mt-0.5">
                    {dept.doctorCount || 0} doctors
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="row g-3">
        <div className="col-md-3 col-6">
          <Link to="/admin/doctors" className="card p-3 border rounded-4 bg-white shadow-xs text-decoration-none hover-shadow transition-all text-center">
            <Stethoscope size={24} className="text-teal-600 mx-auto mb-1.5" style={{ color: '#0f766e' }} />
            <span className="fw-bold text-dark text-sm d-block">Manage Doctors</span>
            <span className="text-muted text-xxs">Add & assign rooms</span>
          </Link>
        </div>

        <div className="col-md-3 col-6">
          <Link to="/admin/patients" className="card p-3 border rounded-4 bg-white shadow-xs text-decoration-none hover-shadow transition-all text-center">
            <Users size={24} className="text-primary mx-auto mb-1.5" />
            <span className="fw-bold text-dark text-sm d-block">Manage Patients</span>
            <span className="text-muted text-xxs">Directory & records</span>
          </Link>
        </div>

        <div className="col-md-3 col-6">
          <Link to="/admin/queues" className="card p-3 border rounded-4 bg-white shadow-xs text-decoration-none hover-shadow transition-all text-center">
            <Layers size={24} className="text-purple-600 mx-auto mb-1.5" style={{ color: '#7c3aed' }} />
            <span className="fw-bold text-dark text-sm d-block">Queue Supervisor</span>
            <span className="text-muted text-xxs">Pause/resume queues</span>
          </Link>
        </div>

        <div className="col-md-3 col-6">
          <Link to="/admin/audit-logs" className="card p-3 border rounded-4 bg-white shadow-xs text-decoration-none hover-shadow transition-all text-center">
            <ScrollText size={24} className="text-dark mx-auto mb-1.5" />
            <span className="fw-bold text-dark text-sm d-block">Audit Logs</span>
            <span className="text-muted text-xxs">System audit trail</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
