import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { Search, Stethoscope, Filter, CalendarPlus, Clock, MapPin, Award, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, deptRes] = await Promise.all([
          doctorService.getAllDoctors(null, true),
          departmentService.getAllDepartments(true)
        ]);
        if (docRes.success) setDoctors(docRes.data || []);
        if (deptRes.success) setDepartments(deptRes.data || []);
      } catch (err) {
        console.error('Failed to load doctors data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = doctors.filter((doc) => {
    const matchesSearch = 
      doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.specialization && doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.departmentName && doc.departmentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = !selectedDept || doc.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="py-5 bg-app">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2 text-xs">
              Medical Specialists
            </span>
            <h1 className="fw-extrabold text-dark tracking-tight mb-0">Find a Doctor</h1>
            <p className="text-muted text-sm mt-1 mb-0">
              Consult with board-certified physicians, cardiologists, orthopedic surgeons, and specialists.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="position-relative" style={{ minWidth: '220px' }}>
              <Search size={16} className="position-absolute text-muted" style={{ top: '12px', left: '12px' }} />
              <input 
                type="text" 
                className="form-control rounded-pill ps-5 pe-3 py-2 text-sm bg-white"
                placeholder="Search by doctor or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="form-select rounded-pill py-2 text-sm bg-white" 
              style={{ width: 'auto', minWidth: '180px' }}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading doctors directory..." />
        ) : filtered.length === 0 ? (
          <div className="card p-5 text-center bg-white rounded-4 border">
            <Stethoscope size={36} className="text-muted opacity-50 mx-auto mb-2" />
            <h5 className="fw-bold text-dark text-base">No doctors found</h5>
            <p className="text-muted text-sm mb-3">Try adjusting your search criteria or selecting another department.</p>
            <button 
              className="btn btn-outline-primary btn-sm rounded-pill mx-auto" 
              onClick={() => { setSearchTerm(''); setSelectedDept(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((doc) => (
              <div key={doc.id} className="col-lg-4 col-md-6">
                <div className="card p-4 border rounded-4 h-100 bg-white shadow-xs hover-shadow transition-all d-flex flex-column">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div 
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm flex-shrink-0"
                      style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #0f766e 0%, #0284c7 100%)' }}
                    >
                      {doc.fullName.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="d-flex align-items-center gap-2">
                        <h5 className="fw-bold text-dark text-base mb-0 text-truncate">{doc.fullName}</h5>
                      </div>
                      <span className="text-primary fw-semibold text-xs d-block">{doc.specialization}</span>
                      <span className="badge bg-light text-secondary border text-xxs mt-1">
                        {doc.departmentName || 'General OPD'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-light rounded-3 d-flex flex-column gap-1.5 text-xs text-secondary mb-3 flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted">Room / OPD:</span>
                      <span className="fw-semibold text-dark">{doc.roomNumber || 'Room 101'}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted">Avg Consultation:</span>
                      <span className="fw-semibold text-dark">{doc.consultationDurationMinutes || 10} mins</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted">Status:</span>
                      <span className={`badge rounded-pill text-xxs ${
                        doc.availabilityStatus === 'AVAILABLE' 
                          ? 'bg-success-subtle text-success' 
                          : doc.availabilityStatus === 'IN_CONSULTATION' 
                          ? 'bg-warning-subtle text-warning' 
                          : 'bg-secondary-subtle text-secondary'
                      }`}>
                        ● {doc.availabilityStatus || 'AVAILABLE'}
                      </span>
                    </div>
                  </div>

                  <Link 
                    to={`/patient/book?doctorId=${doc.id}&departmentId=${doc.departmentId}`} 
                    className="btn btn-outline-primary rounded-pill w-100 py-2 fw-semibold text-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    <CalendarPlus size={16} />
                    <span>Book Appointment</span>
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

export default DoctorsPage;
