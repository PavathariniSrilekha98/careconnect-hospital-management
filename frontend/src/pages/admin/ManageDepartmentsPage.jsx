import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import { Building2, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Search, X } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', roomBlock: '', icon: 'HeartPulse' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getAllDepartments(false);
      if (res.success) setDepartments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '', roomBlock: 'Block A - 1st Floor', icon: 'HeartPulse' });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      roomBlock: dept.roomBlock || '',
      icon: dept.icon || 'HeartPulse'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      if (editingDept) {
        await departmentService.updateDepartment(editingDept.id, formData);
        setMessage('Department updated successfully.');
      } else {
        await departmentService.createDepartment(formData);
        setMessage('New department created successfully.');
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save department.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this department?')) return;
    try {
      await departmentService.deleteDepartment(id);
      setMessage('Department deactivated.');
      fetchDepartments();
    } catch (err) {
      console.error(err);
      setError('Failed to deactivate department.');
    }
  };

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-departments-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Department Management</h2>
          <p className="text-muted text-xs mb-0">Create, configure, and assign hospital clinical departments</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-sm d-flex align-items-center gap-2 shadow-xs"
            onClick={openAddModal}
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
          >
            <Plus size={16} />
            <span>Add Department</span>
          </button>
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

      {/* Search Filter */}
      <div className="card p-3 border rounded-4 bg-white shadow-xs mb-4">
        <div className="position-relative" style={{ maxWidth: '350px' }}>
          <Search size={16} className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} />
          <input 
            type="text" 
            className="form-control form-control-sm rounded-pill ps-5 text-xs"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading departments..." />
      ) : (
        <div className="card border rounded-4 bg-white shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-xs text-uppercase text-muted border-bottom">
                <tr>
                  <th className="ps-4">Code</th>
                  <th>Department Name</th>
                  <th>Location / Room Block</th>
                  <th>Doctors</th>
                  <th>Waiting Queue</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((dept) => (
                  <tr key={dept.id}>
                    <td className="ps-4 font-monospace fw-bold text-primary">
                      {dept.code}
                    </td>
                    <td>
                      <strong className="text-dark d-block">{dept.name}</strong>
                      <span className="text-muted text-xxs">{dept.description?.slice(0, 60)}...</span>
                    </td>
                    <td>
                      <span className="text-dark text-xs">{dept.roomBlock}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border text-xs">{dept.doctorCount || 0} Doctors</span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary text-xs">{dept.activeQueueCount || 0} Waiting</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill text-xxs ${dept.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                        {dept.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button 
                          className="btn btn-outline-secondary btn-sm p-1.5 rounded-circle"
                          onClick={() => openEditModal(dept)}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm p-1.5 rounded-circle"
                          onClick={() => handleDelete(dept.id)}
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

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold text-dark text-base">
                  {editingDept ? 'Edit Department' : 'Create New Department'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 d-flex flex-column gap-3 text-xs">
                  <div>
                    <label className="form-label text-xxs fw-bold text-dark text-uppercase">Department Name *</label>
                    <input 
                      type="text" 
                      className="form-control text-sm"
                      placeholder="e.g. Ophthalmology"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xxs fw-bold text-dark text-uppercase">Code Prefix *</label>
                      <input 
                        type="text" 
                        className="form-control text-sm text-uppercase font-monospace"
                        placeholder="e.g. OPHTH"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xxs fw-bold text-dark text-uppercase">Room Block *</label>
                      <input 
                        type="text" 
                        className="form-control text-sm"
                        placeholder="e.g. Block C - 3rd Floor"
                        value={formData.roomBlock}
                        onChange={(e) => setFormData({ ...formData, roomBlock: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-xxs fw-bold text-dark text-uppercase">Description</label>
                    <textarea 
                      className="form-control text-sm"
                      rows="3"
                      placeholder="Clinical scope, diagnostic capabilities..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top p-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Department'}
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

export default ManageDepartmentsPage;
