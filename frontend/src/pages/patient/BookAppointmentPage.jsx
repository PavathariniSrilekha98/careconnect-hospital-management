import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { 
  Building2, 
  Stethoscope, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  QrCode,
  Flame,
  HeartPulse,
  Check,
  Ban,
  AlertTriangle,
  Info
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QrCodeModal from '../../components/common/QrCodeModal';

const BookAppointmentPage = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Helper to format local date YYYY-MM-DD
  const getLocalDateString = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Current Date/Time Calculations (Timezone Aware)
  const now = new Date();
  const currentHour = now.getHours();
  const isPast9PM = currentHour >= 21; // 21:00 = 9:00 PM

  const todayStr = getLocalDateString(now);
  const tomorrowObj = new Date(now);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrowObj);

  const defaultDate = isPast9PM ? tomorrowStr : todayStr;
  const minSelectableDate = isPast9PM ? tomorrowStr : todayStr;

  // Form selections
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 09:30 AM');
  const [priority, setPriority] = useState('NORMAL');
  const [symptoms, setSymptoms] = useState('');
  const [confirmedAppt, setConfirmedAppt] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const timeSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
    '03:00 PM - 03:30 PM',
    '03:30 PM - 04:00 PM',
    '04:00 PM - 04:30 PM',
  ];

  // Helper to check if a slot has passed for today
  const isSlotInPast = (slotStr, selectedDateStr) => {
    if (selectedDateStr !== todayStr) return false;
    
    try {
      const startPart = slotStr.split('-')[0].trim(); // e.g. "09:00 AM" or "02:30 PM"
      const [time, modifier] = startPart.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const slotDate = new Date();
      slotDate.setHours(hours, minutes, 0, 0);
      
      return now > slotDate;
    } catch (e) {
      return false;
    }
  };

  const getSlotStatus = (slot) => {
    if (isSlotInPast(slot, appointmentDate)) {
      return { disabled: true, reason: 'Time Passed' };
    }
    if (bookedSlots.includes(slot)) {
      return { disabled: true, reason: 'Already Booked' };
    }
    return { disabled: false, reason: 'Available' };
  };

  // Query parameters support (e.g., /patient/book?departmentId=xxx&doctorId=yyy)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const deptId = query.get('departmentId');
    const docId = query.get('doctorId');

    if (deptId) setSelectedDeptId(deptId);
    if (docId) setSelectedDoctorId(docId);
  }, [location]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [deptRes, docRes] = await Promise.all([
          departmentService.getAll(true).catch(() => ({ success: false, data: [] })),
          doctorService.getAll(null, true).catch(() => ({ success: false, data: [] }))
        ]);
        if (deptRes.success && deptRes.data) {
          setDepartments(deptRes.data);
        }
        if (docRes.success && docRes.data) {
          setDoctors(docRes.data);
        }
      } catch (err) {
        console.error('Failed to load booking dependencies:', err);
        setError('Failed to load departments or doctors. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Fetch booked slots for the selected doctor and date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDoctorId || !appointmentDate) {
        setBookedSlots([]);
        return;
      }
      try {
        const res = await appointmentService.getBookedSlots(selectedDoctorId, appointmentDate);
        if (res.success && res.data) {
          setBookedSlots(res.data);
        } else {
          setBookedSlots([]);
        }
      } catch (e) {
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDoctorId, appointmentDate]);

  // Auto-select first available valid slot
  useEffect(() => {
    const availableSlot = timeSlots.find(s => !getSlotStatus(s).disabled);
    if (availableSlot && (!timeSlot || getSlotStatus(timeSlot).disabled)) {
      setTimeSlot(availableSlot);
    }
  }, [appointmentDate, bookedSlots, selectedDoctorId]);

  const availableDoctors = selectedDeptId
    ? doctors.filter(d => d.departmentId === selectedDeptId)
    : doctors;

  const selectedDepartment = departments.find(d => d.id === selectedDeptId);
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!selectedDeptId) {
        setError('Please click to select a clinical department before continuing.');
        return;
      }
    }
    if (step === 2) {
      if (!selectedDoctorId) {
        setError('Please select a doctor to proceed.');
        return;
      }
    }
    if (step === 3) {
      if (appointmentDate === todayStr && isPast9PM) {
        setError("Today's OPD bookings closed at 9:00 PM. Please select tomorrow or an upcoming date.");
        return;
      }
      if (!appointmentDate || !timeSlot) {
        setError('Please choose a valid appointment date and time slot.');
        return;
      }
      const slotCheck = getSlotStatus(timeSlot);
      if (slotCheck.disabled) {
        setError(`The selected time slot '${timeSlot}' is ${slotCheck.reason.toLowerCase()}. Please select another timing.`);
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const isEmergency = priority === 'EMERGENCY';
      const finalDate = isEmergency ? todayStr : (appointmentDate || todayStr);
      const finalSlot = timeSlot || '09:00 AM - 09:30 AM';

      const payload = {
        departmentId: selectedDeptId,
        doctorId: selectedDoctorId,
        appointmentDate: finalDate,
        timeSlot: finalSlot,
        priority: priority,
        symptoms: symptoms || (isEmergency ? 'Emergency Triage Escalation' : 'General Outpatient Visit'),
        notes: symptoms || (isEmergency ? 'Emergency Triage Escalation' : 'General Outpatient Visit')
      };

      const res = await appointmentService.book(payload);
      if (res.success && res.data) {
        setConfirmedAppt(res.data);
      }
    } catch (err) {
      console.error('Booking error:', err);
      const msg = err.response?.data?.message || (err.response?.data?.validationErrors ? err.response.data.validationErrors.join(', ') : err.message) || 'Failed to book appointment. Please check availability and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading hospital booking wizard..." />;
  }

  return (
    <div className="book-appointment-page py-4">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Wizard Header & Steps Indicator */}
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2 text-xs">
            Online OPD Token Booking
          </span>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Book Hospital Appointment</h2>
          <p className="text-muted text-xs">Receive your instant digital token and QR pass in 4 easy steps</p>

          {/* Stepper Progress */}
          <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
            {[
              { num: 1, label: 'Department' },
              { num: 2, label: 'Doctor' },
              { num: 3, label: 'Date & Time' },
              { num: 4, label: 'Confirm' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="d-flex align-items-center gap-1.5">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-xs ${
                      step === s.num 
                        ? 'bg-primary text-white shadow-xs' 
                        : step > s.num 
                        ? 'bg-success text-white' 
                        : 'bg-light text-muted border'
                    }`}
                    style={{ width: '28px', height: '28px' }}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs fw-semibold d-none d-sm-inline ${step >= s.num ? 'text-dark' : 'text-muted'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div 
                    className="bg-secondary bg-opacity-25" 
                    style={{ width: '30px', height: '2px' }} 
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 9:00 PM Notice if booking late */}
        {isPast9PM && (
          <div className="alert alert-warning text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <Info size={16} className="flex-shrink-0" />
            <span>
              <strong>OPD Notice:</strong> Same-day registrations close at 9:00 PM. Bookings are currently open for <strong>tomorrow ({tomorrowStr})</strong> and upcoming dates.
            </span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-xs d-flex align-items-center gap-2 rounded-3 mb-3 shadow-xs">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Step Content Card */}
        <div className="card p-4 p-md-5 border rounded-4 bg-white shadow-sm">
          {/* STEP 1: SELECT DEPARTMENT */}
          {step === 1 && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-dark text-base mb-0 d-flex align-items-center gap-2">
                  <Building2 size={18} className="text-primary" />
                  Step 1: Select Clinical Department
                </h5>
                <span className="text-xs text-muted">
                  {departments.length} Departments Available
                </span>
              </div>

              {departments.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm bg-light rounded-3">
                  No active departments available at this time.
                </div>
              ) : (
                <div className="row g-3">
                  {departments.map((dept) => {
                    const isSelected = selectedDeptId === dept.id;
                    return (
                      <div key={dept.id} className="col-md-6">
                        <div 
                          className={`p-3.5 rounded-3 border cursor-pointer transition-all d-flex align-items-start gap-3 position-relative ${
                            isSelected 
                              ? 'border-primary bg-primary-subtle shadow-xs' 
                              : 'bg-white hover-bg-light'
                          }`}
                          onClick={() => {
                            setSelectedDeptId(dept.id);
                            setSelectedDoctorId(''); // reset doctor on dept switch
                            setError('');
                          }}
                          style={{ 
                            border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#f0f9ff' : '#ffffff'
                          }}
                        >
                          <div 
                            className={`p-2.5 rounded-3 border shadow-xs d-flex align-items-center justify-content-center ${
                              isSelected ? 'bg-primary text-white border-primary' : 'bg-light text-primary'
                            }`}
                            style={{ width: '42px', height: '42px' }}
                          >
                            <HeartPulse size={20} />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between">
                              <strong className="text-dark text-sm">{dept.name}</strong>
                              <span className="badge bg-light text-muted border text-xxs">{dept.code}</span>
                            </div>
                            <p className="text-muted text-xs mb-1 mt-0.5" style={{ lineHeight: '1.4' }}>
                              {dept.description || 'Specialized outpatient consultation services.'}
                            </p>
                            <div className="d-flex align-items-center justify-content-between mt-2">
                              <span className="text-primary text-xxs fw-semibold">
                                {dept.doctorCount || 0} Doctors Available
                              </span>
                              {isSelected && (
                                <span className="badge bg-primary text-white text-xxs d-flex align-items-center gap-1 rounded-pill px-2 py-0.5">
                                  <Check size={10} /> Selected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SELECT DOCTOR */}
          {step === 2 && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-dark text-base mb-0 d-flex align-items-center gap-2">
                  <Stethoscope size={18} className="text-primary" />
                  Step 2: Choose Specialist Doctor ({selectedDepartment?.name})
                </h5>
                <span className="text-xs text-muted">
                  {availableDoctors.length} Specialists Available
                </span>
              </div>

              {availableDoctors.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm bg-light rounded-3">
                  <p className="mb-2">No specialist doctors currently listed in {selectedDepartment?.name}.</p>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    onClick={handleBack}
                  >
                    Choose another Department
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {availableDoctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div key={doc.id} className="col-md-6">
                        <div 
                          className={`p-3.5 rounded-3 border cursor-pointer transition-all d-flex align-items-center gap-3 ${
                            isSelected 
                              ? 'border-primary bg-primary-subtle shadow-xs' 
                              : 'bg-white hover-bg-light'
                          }`}
                          onClick={() => {
                            setSelectedDoctorId(doc.id);
                            setError('');
                          }}
                          style={{ 
                            border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#f0f9ff' : '#ffffff'
                          }}
                        >
                          <div 
                            className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold text-sm shadow-xs flex-shrink-0"
                            style={{ width: '46px', height: '46px', background: 'linear-gradient(135deg, #0f766e 0%, #0284c7 100%)' }}
                          >
                            {doc.fullName.replace('Dr. ', '').charAt(0)}
                          </div>
                          <div className="overflow-hidden flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between">
                              <strong className="text-dark text-sm d-block text-truncate">{doc.fullName}</strong>
                              {isSelected && (
                                <span className="badge bg-primary text-white text-xxs d-flex align-items-center gap-1 rounded-pill px-2 py-0.5">
                                  <Check size={10} /> Selected
                                </span>
                              )}
                            </div>
                            <span className="text-primary text-xs d-block">{doc.specialization}</span>
                            <span className="text-muted text-xxs d-block">Room {doc.roomNumber || '101'} • {doc.consultationDurationMinutes || 10}m slot</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DATE & TIME SLOT WITH VALIDATION */}
          {step === 3 && (
            <div>
              <h5 className="fw-bold text-dark text-base mb-3 d-flex align-items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Step 3: Appointment Date & Time Slot
              </h5>

              <div className="row g-4">
                {/* Date Picker */}
                <div className="col-md-5">
                  <label className="form-label text-xs fw-bold text-dark text-uppercase">Consultation Date</label>
                  <input 
                    type="date" 
                    className="form-control text-sm py-2"
                    min={minSelectableDate}
                    value={appointmentDate}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      setError('');
                    }}
                    required
                  />
                  {appointmentDate === todayStr && isPast9PM ? (
                    <span className="text-danger text-xxs mt-1 d-block fw-semibold">
                      ⚠️ Registrations closed for today (9:00 PM cutoff). Please pick tomorrow.
                    </span>
                  ) : (
                    <span className="text-muted text-xxs mt-1 d-block">
                      {appointmentDate === todayStr ? 'Booking for Today (Same-Day OPD)' : `Booking for ${appointmentDate}`}
                    </span>
                  )}
                </div>

                {/* Slots with Status Indicators */}
                <div className="col-md-7">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label text-xs fw-bold text-dark text-uppercase mb-0">Select Time Slot</label>
                    <span className="text-xxs text-muted">
                      {timeSlots.filter(s => !getSlotStatus(s).disabled).length} slots available
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {timeSlots.map((slot) => {
                      const status = getSlotStatus(slot);
                      const isSelected = timeSlot === slot;

                      return (
                        <button 
                          key={slot}
                          type="button"
                          disabled={status.disabled}
                          className={`btn btn-sm rounded-pill text-xs px-3 py-1.5 fw-semibold position-relative transition-all ${
                            isSelected && !status.disabled
                              ? 'btn-primary shadow-xs' 
                              : status.disabled
                              ? 'btn-light border text-muted opacity-50 cursor-not-allowed'
                              : 'btn-outline-secondary bg-white text-secondary hover-bg-light'
                          }`}
                          onClick={() => {
                            if (!status.disabled) {
                              setTimeSlot(slot);
                              setError('');
                            }
                          }}
                          title={status.disabled ? `Slot Unavailable: ${status.reason}` : `Select ${slot}`}
                        >
                          <span>{slot}</span>
                          {status.disabled && (
                            <span className="badge bg-secondary-subtle text-secondary border text-xxs ms-1.5" style={{ fontSize: '9px' }}>
                              {status.reason}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {bookedSlots.length > 0 && (
                    <span className="text-muted text-xxs mt-2 d-block">
                      💡 Slots marked <strong>Already Booked</strong> are currently reserved by other patients.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PRIORITY & CONFIRMATION */}
          {step === 4 && (
            <div>
              <h5 className="fw-bold text-dark text-base mb-3 d-flex align-items-center gap-2">
                <ShieldAlert size={18} className="text-primary" />
                Step 4: Priority & Clinical Details
              </h5>

              {/* Priority Select */}
              <div className="mb-4">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Patient Priority Category</label>
                <div className="row g-2">
                  <div className="col-sm-4">
                    <div 
                      className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${priority === 'NORMAL' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                      onClick={() => setPriority('NORMAL')}
                      style={{ border: priority === 'NORMAL' ? '2px solid #0284c7' : '1px solid #e2e8f0' }}
                    >
                      <span className="fw-bold text-dark text-xs d-block">Normal Appointment</span>
                      <span className="text-muted text-xxs">Standard OPD token</span>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div 
                      className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${priority === 'SENIOR_CITIZEN' ? 'border-purple-600 bg-purple-50' : 'bg-light'}`}
                      onClick={() => setPriority('SENIOR_CITIZEN')}
                      style={{ border: priority === 'SENIOR_CITIZEN' ? '2px solid #7c3aed' : '1px solid #e2e8f0' }}
                    >
                      <span className="fw-bold text-purple-700 text-xs d-block">Senior Citizen / Special</span>
                      <span className="text-muted text-xxs">Priority lane scheduling</span>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div 
                      className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${priority === 'EMERGENCY' ? 'border-danger bg-danger-subtle' : 'bg-light'}`}
                      onClick={() => setPriority('EMERGENCY')}
                      style={{ border: priority === 'EMERGENCY' ? '2px solid #dc2626' : '1px solid #e2e8f0' }}
                    >
                      <span className="fw-bold text-danger text-xs d-block">Emergency Case</span>
                      <span className="text-danger text-xxs">Direct Room Escalation</span>
                    </div>
                  </div>
                </div>

                {priority === 'EMERGENCY' && (
                  <div className="alert alert-danger border-danger border-2 p-3 rounded-3 mt-3 mb-0 d-flex align-items-center gap-2.5" style={{ backgroundColor: '#fef2f2' }}>
                    <Flame size={22} className="text-danger flex-shrink-0" />
                    <div className="text-xs">
                      <strong className="text-danger d-block">🚨 DIRECT ROOM ESCALATION ACTIVE</strong>
                      <span className="text-dark">
                        Your emergency token will be placed at <strong>Position #1 (Next In Line)</strong> right behind the patient currently inside Dr. {selectedDoctor?.fullName || 'the doctor'}'s room ({selectedDoctor?.roomNumber || 'Room'}). The doctor will be notified immediately.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Symptoms / Reason */}
              <div className="mb-4">
                <label className="form-label text-xs fw-bold text-dark text-uppercase">Symptoms / Reason for Consultation (Optional)</label>
                <textarea 
                  className="form-control text-sm"
                  rows="3"
                  placeholder="e.g. Chest tightness, chronic knee pain, follow-up on lab tests..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>

              {/* Summary Box */}
              <div className="p-3.5 bg-light rounded-3 border text-xs d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Department:</span>
                  <strong className="text-dark">{selectedDepartment?.name}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Doctor:</span>
                  <strong className="text-dark">Dr. {selectedDoctor?.fullName} ({selectedDoctor?.roomNumber || 'Room 101'})</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Date & Time:</span>
                  <strong className="text-primary">{appointmentDate} ({timeSlot})</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Priority:</span>
                  <strong className="text-dark">{priority}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
            {step > 1 ? (
              <button 
                type="button" 
                className="btn btn-outline-secondary rounded-pill px-4 py-2 text-sm fw-semibold d-flex align-items-center gap-1"
                onClick={handleBack}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button 
                type="button" 
                className="btn btn-primary rounded-pill px-4 py-2 text-sm fw-semibold d-flex align-items-center gap-1 shadow-xs"
                style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                onClick={handleNext}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-success rounded-pill px-4 py-2 text-sm fw-semibold d-flex align-items-center gap-2 shadow-sm"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Confirm & Generate Token</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation & QR Code Modal */}
      {confirmedAppt && (
        <QrCodeModal 
          show={!!confirmedAppt}
          onHide={() => {
            setConfirmedAppt(null);
            navigate('/patient/dashboard');
          }}
          appointment={confirmedAppt}
        />
      )}
    </div>
  );
};

export default BookAppointmentPage;
