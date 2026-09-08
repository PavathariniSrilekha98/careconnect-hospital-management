import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { consultationService } from '../../services/consultationService';
import { 
  FileText, 
  Stethoscope, 
  Calendar, 
  Pill, 
  Clock, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  Download,
  Printer,
  RefreshCw,
  Search,
  User,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorHistoryPage = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const fetchHistory = async () => {
    if (!user?.doctorId && !user?.id) return;
    try {
      setLoading(true);
      // Fetch by doctorId or userId
      const targetDocId = user.doctorId || user.id;
      const res = await consultationService.getByDoctorId(targetDocId);
      if (res.success && res.data) {
        setConsultations(res.data);
        if (res.data.length > 0) {
          setExpandedId(res.data[0].id); // expand most recent record
        }
      }
    } catch (err) {
      console.error('Failed to load doctor consultation history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.doctorId, user?.id]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredConsultations = consultations.filter((rec) => {
    const matchesSearch = 
      (rec.patientName && rec.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.tokenNumber && rec.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.diagnosis && rec.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = selectedDate ? (rec.createdAt && rec.createdAt.startsWith(selectedDate)) : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="doctor-history-page py-2">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Doctor EMR & Consultation History</h2>
          <p className="text-muted text-xs mb-0">
            Log of all completed clinical consultations, diagnoses, and digital prescriptions recorded by Dr. {user?.fullName}
          </p>
        </div>

        <button 
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 fw-semibold text-xs d-flex align-items-center gap-1.5"
          onClick={fetchHistory}
        >
          <RefreshCw size={14} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-3 rounded-4 border bg-white shadow-xs mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-7">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <Search size={15} className="text-muted" />
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Search by patient name, token number, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex gap-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <CalendarDays size={15} className="text-muted" />
              </span>
              <input 
                type="date" 
                className="form-control border-start-0" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            {selectedDate && (
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedDate('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching clinical consultation records..." />
      ) : filteredConsultations.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <FileText size={42} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No Consultation Records Found</h5>
          <p className="text-muted text-xs mb-0">
            {searchTerm || selectedDate 
              ? 'No records match your search criteria. Try clearing the filters.' 
              : 'Consultation records and prescriptions you submit from the Queue Controller will appear here.'}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredConsultations.map((rec) => {
            const isExpanded = expandedId === rec.id;

            return (
              <div key={rec.id} className="card border rounded-4 bg-white shadow-xs overflow-hidden">
                {/* Header Strip */}
                <div 
                  className="p-3.5 d-flex align-items-center justify-content-between cursor-pointer hover-bg-light transition-colors"
                  onClick={() => toggleExpand(rec.id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2.5 rounded-3 bg-teal-subtle text-teal" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold text-dark text-sm mb-0">
                          {rec.patientName || 'Patient Consultation'}
                        </h6>
                        <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 font-monospace text-xxs">
                          Token: {rec.tokenNumber}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-3 text-xxs text-muted mt-0.5">
                        <span>Dept: <strong>{rec.departmentName || 'General OPD'}</strong></span>
                        <span>Date: {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : 'Recent'}</span>
                        {rec.durationMinutes && (
                          <span>Duration: {rec.durationMinutes} mins</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success-subtle text-success border border-success border-opacity-25 text-xxs px-2.5 py-1">
                      <CheckCircle2 size={11} className="me-1 inline" /> Completed
                    </span>
                    <button className="btn btn-light btn-sm rounded-circle p-1.5 text-muted">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-top bg-light bg-opacity-40">
                    {/* Vitals Bar if available */}
                    {rec.vitals && (
                      <div className="p-2.5 rounded-3 bg-white border mb-3 d-flex flex-wrap align-items-center gap-3 text-xxs">
                        <span className="fw-bold text-dark d-flex align-items-center gap-1">
                          <Activity size={13} className="text-danger" /> Patient Clinical Vitals:
                        </span>
                        <span className="text-secondary font-monospace">{rec.vitals}</span>
                      </div>
                    )}

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 bg-white border">
                          <span className="text-xxs text-muted text-uppercase fw-bold d-block mb-1">Clinical Diagnosis</span>
                          <p className="text-dark fw-semibold text-sm mb-0">{rec.diagnosis || 'General Consultation & Examination'}</p>
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 bg-white border">
                          <span className="text-xxs text-muted text-uppercase fw-bold d-block mb-1">Reported Symptoms</span>
                          <p className="text-dark text-sm mb-0">{rec.symptoms || 'Routine follow-up / general checkup'}</p>
                        </div>
                      </div>

                      {rec.clinicalNotes && (
                        <div className="col-12">
                          <div className="p-3 rounded-3 bg-white border">
                            <span className="text-xxs text-muted text-uppercase fw-bold d-block mb-1">Doctor Advice & Clinical Notes</span>
                            <p className="text-secondary text-xs mb-0" style={{ whiteSpace: 'pre-line' }}>{rec.clinicalNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Prescriptions Section */}
                    <div className="p-3.5 rounded-3 bg-white border mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2.5">
                        <div className="d-flex align-items-center gap-2">
                          <Pill size={16} className="text-primary" />
                          <h6 className="fw-bold text-dark text-xs text-uppercase mb-0">Prescribed Medications</h6>
                        </div>
                        <button 
                          className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-0.5 text-xxs fw-semibold d-flex align-items-center gap-1"
                          onClick={() => window.print()}
                        >
                          <Printer size={12} />
                          <span>Print Prescription</span>
                        </button>
                      </div>

                      {(!rec.prescriptionItems || rec.prescriptionItems.length === 0) ? (
                        <p className="text-muted text-xs mb-0">No specific medications prescribed during this visit.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered align-middle mb-0 text-xs">
                            <thead className="table-light text-muted">
                              <tr>
                                <th>#</th>
                                <th>Medicine Name</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                                <th>Instructions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rec.prescriptionItems.map((med, mIdx) => (
                                <tr key={mIdx}>
                                  <td className="fw-bold text-muted">{mIdx + 1}</td>
                                  <td className="fw-bold text-dark">{med.medicineName}</td>
                                  <td><span className="badge bg-light text-dark border">{med.dosage}</span></td>
                                  <td>{med.frequency}</td>
                                  <td>{med.durationDays ? `${med.durationDays} Days` : '-'}</td>
                                  <td className="text-muted">{med.instructions || 'As directed'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Follow-up Note */}
                    {rec.followUpDate && (
                      <div className="d-flex align-items-center gap-2 text-xs text-primary bg-primary-subtle p-2.5 rounded-3 border border-primary border-opacity-25">
                        <Calendar size={14} />
                        <span>Recommended Follow-Up Appointment Date: <strong>{new Date(rec.followUpDate).toLocaleDateString()}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorHistoryPage;
