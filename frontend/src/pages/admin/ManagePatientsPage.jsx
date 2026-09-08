import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, CheckCircle2, XCircle, ShieldCheck, UserX, UserCheck, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManagePatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await api.get('/admin/users?role=PATIENT');
      if (res.data && res.data.success) {
        setPatients(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch patient accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-status`);
      if (res.data && res.data.success) {
        setMessage('Patient account status toggled.');
        fetchPatients();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update account status.');
    }
  };

  const filtered = patients.filter(p => 
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-patients-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Patient Directory</h2>
          <p className="text-muted text-xs mb-0">Review registered patient demographics, medical identifiers, and account status</p>
        </div>
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

      <div className="card p-3 border rounded-4 bg-white shadow-xs mb-4">
        <div className="position-relative" style={{ maxWidth: '350px' }}>
          <Search size={16} className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} />
          <input 
            type="text" 
            className="form-control form-control-sm rounded-pill ps-5 text-xs"
            placeholder="Search by patient name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading patients directory..." />
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Patient</th>
                  <th>Contact</th>
                  <th>Age / Gender</th>
                  <th>Blood Group</th>
                  <th>Emergency Contact</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient.id}>
                    <td className="ps-4">
                      <strong className="text-dark d-block">{patient.fullName}</strong>
                      <span className="text-muted text-xxs">{patient.email}</span>
                    </td>
                    <td>
                      <span className="text-dark text-xs">{patient.phoneNumber || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="text-muted text-xs">{patient.age ? `${patient.age} yrs` : 'N/A'} • {patient.gender || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-danger border text-xs">{patient.bloodGroup || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="text-muted text-xs">{patient.emergencyContact || 'None'}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill text-xxs ${patient.active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {patient.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button 
                        className={`btn btn-sm rounded-pill px-3 py-1 text-xs fw-semibold ${patient.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(patient.id)}
                      >
                        {patient.active ? 'Suspend' : 'Activate'}
                      </button>
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

export default ManagePatientsPage;
