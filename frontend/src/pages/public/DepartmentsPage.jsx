import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import { Search, HeartPulse, Stethoscope, Activity, Users, Clock, ChevronRight, Sparkles } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentService.getAllDepartments(true);
        if (res.success) {
          setDepartments(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filtered = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-5 bg-app">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2 text-xs">
              Specialist Clinical Centers
            </span>
            <h1 className="fw-extrabold text-dark tracking-tight mb-0">Hospital Departments</h1>
            <p className="text-muted text-sm mt-1 mb-0">
              Browse our clinical departments, check live queue status, and book an appointment with a specialist.
            </p>
          </div>

          {/* Search Bar */}
          <div className="position-relative" style={{ minWidth: '280px' }}>
            <Search size={18} className="position-absolute text-muted" style={{ top: '12px', left: '12px' }} />
            <input 
              type="text" 
              className="form-control rounded-pill ps-5 pe-4 py-2 text-sm bg-white"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading hospital departments..." />
        ) : filtered.length === 0 ? (
          <div className="card p-5 text-center bg-white rounded-4 border">
            <Activity size={36} className="text-muted opacity-50 mx-auto mb-2" />
            <h5 className="fw-bold text-dark text-base">No departments match your search</h5>
            <p className="text-muted text-sm mb-3">Try searching for Cardiology, Orthopedics, or General Medicine.</p>
            <button className="btn btn-outline-primary btn-sm rounded-pill mx-auto" onClick={() => setSearchTerm('')}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((dept) => (
              <div key={dept.id} className="col-lg-4 col-md-6">
                <div className="card p-4 border rounded-4 h-100 bg-white shadow-xs hover-shadow transition-all d-flex flex-column">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="p-3 rounded-3 bg-primary-subtle text-primary">
                      <HeartPulse size={24} />
                    </div>
                    <span className="badge bg-light text-dark border fw-semibold text-xs px-2.5 py-1">
                      Code: {dept.code}
                    </span>
                  </div>

                  <h4 className="fw-bold text-dark text-lg mb-1">{dept.name}</h4>
                  <span className="text-muted text-xs mb-3 d-block">{dept.roomBlock}</span>

                  <p className="text-muted text-sm mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>
                    {dept.description || 'Specialized outpatient diagnostic and consultation services.'}
                  </p>

                  <div className="p-2.5 bg-light rounded-3 d-flex align-items-center justify-content-between mb-3 text-xs">
                    <div className="d-flex align-items-center gap-1.5 text-secondary">
                      <Users size={15} className="text-primary" />
                      <span><strong>{dept.doctorCount || 0}</strong> Doctors on duty</span>
                    </div>
                    <div className="d-flex align-items-center gap-1.5 text-secondary">
                      <Clock size={15} className="text-primary" />
                      <span><strong>{dept.activeQueueCount || 0}</strong> in live queue</span>
                    </div>
                  </div>

                  <Link 
                    to={`/patient/book?departmentId=${dept.id}`} 
                    className="btn btn-primary rounded-pill w-100 py-2 fw-semibold text-sm d-flex align-items-center justify-content-center gap-2 shadow-xs"
                    style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                  >
                    <span>Book Appointment</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
