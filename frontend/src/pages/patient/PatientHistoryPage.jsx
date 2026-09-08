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
  HeartPulse,
  Thermometer,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientHistoryPage = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await consultationService.getByPatientId(user.id);
      if (res.success && res.data) {
        setConsultations(res.data);
        if (res.data.length > 0) {
          setExpandedId(res.data[0].id); // expand most recent visit
        }
      }
    } catch (err) {
      console.error('Failed to load consultation history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePrint = (rec) => {
    window.print();
  };

  return (
    <div className="patient-history-page py-2">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-extrabold text-dark tracking-tight mb-0">Consultation & Medical Records</h2>
            <span className="badge bg-primary-subtle text-primary rounded-pill text-xxs px-2.5 py-1">Permanent EMR</span>
          </div>
          <p className="text-muted text-xs mb-0">Permanent log of diagnoses, clinical vitals, doctor notes, and digital prescriptions for {user?.fullName}</p>
        </div>

        <button 
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 fw-semibold text-xs d-flex align-items-center gap-1.5"
          onClick={fetchHistory}
        >
          <RefreshCw size={14} />
          <span>Refresh Records</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your medical consultation records..." />
      ) : consultations.length === 0 ? (
        <div className="card p-5 text-center bg-white rounded-4 border shadow-xs">
          <FileText size={42} className="text-muted opacity-50 mx-auto mb-2" />
          <h5 className="fw-bold text-dark text-base">No Consultation Records Yet</h5>
          <p className="text-muted text-xs mb-0">After your doctor completes a consultation session, your clinical diagnosis and prescription notes will automatically appear here permanently.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {consultations.map((rec) => {
            const isExpanded = expandedId === rec.id;

            return (
              <div key={rec.id} className="card border rounded-4 bg-white shadow-xs overflow-hidden">
                {/* Header Strip */}
                <div 
                  className="p-3.5 d-flex align-items-center justify-content-between cursor-pointer hover-bg-light transition-colors"
                  onClick={() => toggleExpand(rec.id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2.5 rounded-3 bg-primary-subtle text-primary">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold text-dark text-sm mb-0">
                          {rec.departmentName || 'Outpatient Consultation'} - Dr. {rec.doctorName}
                        </h6>
                        <span className="badge bg-light text-primary border font-monospace text-xxs">
                          Token: {rec.tokenNumber}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-3 text-xxs text-muted mt-0.5">
                        <span>Date: <strong>{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}</strong></span>
                        {rec.durationMinutes && (
                          <span>Duration: {rec.durationMinutes} mins</span>
                        )}
                        {rec.diagnosis && (
                          <span className="text-dark fw-semibold text-truncate d-none d-sm-inline" style={{ maxWidth: '280px' }}>
                            • {rec.diagnosis}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success-subtle text-success text-xxs px-2.5 py-1 rounded-pill">
                      Completed Visit
                    </span>
                    <button className="btn btn-sm btn-light rounded-circle p-1">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-4 border-top bg-light animate-fade-in text-xs">
                    {/* Vitals Bar if available */}
                    {rec.vitals && (
                      <div className="p-2.5 rounded-3 bg-white border mb-3 d-flex flex-wrap align-items-center gap-3 text-xxs">
                        <span className="fw-bold text-dark d-flex align-items-center gap-1">
                          <Activity size={13} className="text-danger" /> Clinical Vitals:
                        </span>
                        <span className="text-secondary font-monospace">{rec.vitals}</span>
                      </div>
                    )}

                    <div className="row g-4">
                      {/* Clinical Assessment */}
                      <div className="col-md-6">
                        <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Clinical Diagnosis & Notes</h6>
                        <div className="p-3 bg-white rounded-3 border mb-3">
                          <span className="text-xxs text-muted text-uppercase fw-bold d-block mb-1">Diagnosis</span>
                          <p className="text-dark fw-bold mb-2 fs-6">{rec.diagnosis || 'General clinical consultation'}</p>
                          {rec.symptoms && (
                            <p className="text-muted mb-0"><strong>Chief Complaints:</strong> {rec.symptoms}</p>
                          )}
                        </div>

                        {rec.clinicalNotes && (
                          <>
                            <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Doctor's Advice & Lifestyle Guidance</h6>
                            <div className="p-3 bg-white rounded-3 border">
                              <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-line' }}>{rec.clinicalNotes}</p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Prescriptions List */}
                      <div className="col-md-6">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-0 d-flex align-items-center gap-1.5">
                            <Pill size={14} className="text-primary" />
                            <span>Digital Prescription</span>
                          </h6>
                          <button 
                            className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-0.5 text-xxs fw-semibold d-flex align-items-center gap-1"
                            onClick={() => handlePrint(rec)}
                          >
                            <Printer size={12} />
                            <span>Print Prescription</span>
                          </button>
                        </div>

                        {rec.prescriptionItems && rec.prescriptionItems.length > 0 ? (
                          <div className="d-flex flex-column gap-2">
                            {rec.prescriptionItems.map((med, idx) => (
                              <div key={idx} className="p-2.5 bg-white rounded-3 border d-flex align-items-start justify-content-between">
                                <div>
                                  <strong className="text-dark text-xs d-block">{med.medicineName}</strong>
                                  <span className="text-muted text-xxs">Dosage: {med.dosage} • Frequency: {med.frequency}</span>
                                  {med.instructions && (
                                    <span className="text-primary text-xxs d-block mt-0.5">Instruction: {med.instructions}</span>
                                  )}
                                </div>
                                <span className="badge bg-light text-dark border text-xxs">{med.durationDays || 5} Days</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-white rounded-3 border text-muted">
                            No medication prescribed for this visit.
                          </div>
                        )}

                        {rec.followUpDate && (
                          <div className="mt-3 p-2.5 bg-primary-subtle rounded-3 border border-primary-subtle text-primary d-flex align-items-center gap-2">
                            <Calendar size={15} />
                            <span>Recommended Follow-up Visit: <strong>{new Date(rec.followUpDate).toLocaleDateString()}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
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

export default PatientHistoryPage;
