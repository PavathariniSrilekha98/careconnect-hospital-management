import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { Stethoscope, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Search, MapPin, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    departmentId: '',
    specialization: '',
    roomNumber: 'Room 101',
    consultationDurationMinutes: 10
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        doctorService.getAllDoctors(null, false),
        departmentService.getAllDepartments(true)
      ]);
      if (docRes.success) setDoctors(docRes.data || []);
      if (deptRes.success) {
        setDepartments(deptRes.data || []);
        if (deptRes.data.length > 0 && !formData.departmentId) {
          setFormData(prev => ({ ...prev, departmentId: deptRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingDoc(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      departmentId: departments[0]?.id || '',
      specialization: '',
      roomNumber: 'Room 101',
      consultationDurationMinutes: 10
    });
    setShowModal(true);
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setFormData({
      fullName: doc.fullName,
      email: doc.email || '',
      password: '',
      phoneNumber: doc.phoneNumber || '',
      departmentId: doc.departmentId,
      specialization: doc.specialization,
      roomNumber: doc.roomNumber || 'Room 101',
      consultationDurationMinutes: doc.consultationDurationMinutes || 10
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      if (editingDoc) {
        await doctorService.updateDoctor(editingDoc.id, formData);
        setMessage('Doctor details updated.');
      } else {
        await doctorService.createDoctor(formData);
        setMessage('New Doctor profile registered.');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save doctor.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this doctor?')) return;
    try {
      await doctorService.deleteDoctor(id);
      setMessage('Doctor deactivated.');
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to deactivate doctor.');
    }
  };

  const filtered = doctors.filter(d => 
    d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.departmentName && d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="manage-doctors-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Doctor Directory Management</h2>
          <p className="text-muted text-xs mb-0">Register doctors, configure consultation rooms, and assign clinical departments</p>
        </div>

        <button 
          className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-sm d-flex align-items-center gap-2 shadow-xs"
          onClick={openAddModal}
          style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
        >
          <Plus size={16} />
          <span>Add Doctor</span>
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

      <div className="card p-3 border rounded-4 bg-white shadow-xs mb-4">
        <div className="position-relative" style={{ maxWidth: '350px' }}>
          <Search size={16} className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} />
          <input 
            type="text" 
            className="form-control form-control-sm rounded-pill ps-5 text-xs"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading doctors directory..." />
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Doctor</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Room</th>
                  <th>Slot Duration</th>
                  <th>Availability</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id}>
                    <td className="ps-4">
                      <strong className="text-dark d-block">{doc.fullName}</strong>
                      <span className="text-muted text-xxs">{doc.email}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border text-xs">{doc.departmentName}</span>
                    </td>
                    <td>
                      <span className="text-primary fw-semibold text-xs">{doc.specialization}</span>
                    </td>
                    <td>
                      <span className="text-dark text-xs">{doc.roomNumber || 'Room 101'}</span>
                    </td>
                    <td>
                      <span className="text-muted text-xs font-monospace">{doc.consultationDurationMinutes || 10}m</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill text-xxs ${
                        doc.availabilityStatus === 'AVAILABLE' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                      }`}>
                        {doc.availabilityStatus || 'AVAILABLE'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button 
                          className="btn btn-outline-secondary btn-sm p-1.5 rounded-circle"
                          onClick={() => openEditModal(doc)}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm p-1.5 rounded-circle"
                          onClick={() => handleDelete(doc.id)}
                          title="Deactivate"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold text-dark text-base">
                  {editingDoc ? 'Edit Doctor Profile' : 'Register New Doctor'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 d-flex flex-column gap-3 text-xs">
                  <div>
                    <label className="form-label text-xxs fw-bold text-dark text-uppercase">Doctor Full Name *</label>
                    <input 
                      type="text" 
                      className="form-control text-sm"
                      placeholder="e.g. Dr. Robert Chen"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  {!editingDoc && (
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label text-xxs fw-bold text-dark text-uppercase">Email *</label>
                        <input 
                          type="email" 
                          className="form-control text-sm"
                          placeholder="doctor@hospital.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-xxs fw-bold text-dark text-uppercase">Password *</label>
                        <input 
                          type="password" 
                          className="form-control text-sm"
                          placeholder="Initial password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xxs fw-bold text-dark text-uppercase">Department *</label>
                      <select 
                        className="form-select text-sm"
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        required
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label text-xxs fw-bold text-dark text-uppercase">Specialization *</label>
                      <input 
                        type="text" 
                        className="form-control text-sm"
                        placeholder="e.g. Interventional Cardiology"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xxs fw-bold text-dark text-uppercase">Room Number *</label>
                      <input 
                        type="text" 
                        className="form-control text-sm"
                        placeholder="e.g. Room 204"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label text-xxs fw-bold text-dark text-uppercase">Avg Duration (Mins)</label>
                      <input 
                        type="number" 
                        min="5"
                        max="60"
                        className="form-control text-sm"
                        value={formData.consultationDurationMinutes}
                        onChange={(e) => setFormData({ ...formData, consultationDurationMinutes: parseInt(e.target.value, 10) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top p-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctorsPage;
