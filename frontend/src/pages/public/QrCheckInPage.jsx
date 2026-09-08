import React, { useState, useEffect } from 'react';
import { checkInService } from '../../services/checkInService';
import { 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Stethoscope, 
  MapPin, 
  Activity, 
  ArrowRight, 
  RefreshCw,
  Camera,
  Keyboard,
  Sparkles
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrCheckInPage = () => {
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [scanMode, setScanMode] = useState('manual'); // default to manual for reliable testing
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    let scanner = null;

    if (scanMode === 'camera' && !checkInResult) {
      setCameraError('');
      const timer = setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner(
            "qr-reader-container",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
          );

          scanner.render(
            (decodedText) => {
              handleQrScan(decodedText);
              if (scanner) {
                scanner.clear().catch(() => {});
              }
            },
            (err) => {
              // Non-critical frame decode miss
            }
          );
        } catch (e) {
          console.warn('QR scanner initialization error:', e);
          setCameraError('Camera not available or permission denied. Please use Manual Token Input.');
          setScanMode('manual');
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(() => {});
        }
      };
    }
  }, [scanMode, checkInResult]);

  const handleQrScan = async (qrData) => {
    setLoading(true);
    setError('');
    try {
      const res = await checkInService.checkIn(qrData);
      if (res.success && res.data) {
        setCheckInResult(res.data);
      }
    } catch (err) {
      console.error('Check-in error:', err);
      const msg = err.response?.data?.message || 'Invalid or expired QR code. Please check with the hospital reception desk.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;

    setLoading(true);
    setError('');

    try {
      const input = manualInput.trim();
      const res = await checkInService.checkIn(input);
      if (res.success && res.data) {
        setCheckInResult(res.data);
      }
    } catch (err) {
      console.error('Manual check-in error:', err);
      const msg = err.response?.data?.message || 'Could not verify appointment token. Please verify token number or visit hospital reception.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickToken = async (token) => {
    setManualInput(token);
    setLoading(true);
    setError('');

    try {
      const res = await checkInService.checkIn(token);
      if (res.success && res.data) {
        setCheckInResult(res.data);
      }
    } catch (err) {
      console.error('Quick check-in error:', err);
      const msg = err.response?.data?.message || `Failed to check in token ${token}. It might already be checked in or completed.`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetCheckIn = () => {
    setCheckInResult(null);
    setManualInput('');
    setError('');
    setScanMode('manual');
  };

  return (
    <div className="py-5 bg-app d-flex align-items-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            {/* Header */}
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-4 shadow-sm text-white mb-2" 
                style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)' }}
              >
                <QrCode size={28} />
              </div>
              <h2 className="fw-extrabold text-dark tracking-tight mb-1">Hospital Self Check-In Kiosk</h2>
              <p className="text-muted text-sm">Scan your appointment QR code or enter token to activate your place in queue</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="alert alert-danger text-xs d-flex align-items-center gap-2 rounded-3 mb-3">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {cameraError && (
              <div className="alert alert-warning text-xs d-flex align-items-center gap-2 rounded-3 mb-3">
                <AlertCircle size={16} />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Result State */}
            {checkInResult ? (
              <div className="card p-4 p-md-5 border-0 rounded-4 bg-white shadow-lg text-center animate-fade-in">
                <div className="rounded-circle bg-success text-white mx-auto d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
                  <CheckCircle2 size={36} />
                </div>

                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill text-xs fw-bold text-uppercase mb-2">
                  Check-In Verified
                </span>

                <h3 className="fw-extrabold text-dark mb-1">Welcome, {checkInResult.patientName}!</h3>
                <p className="text-muted text-xs mb-4">Your spot in the live OPD queue is activated.</p>

                {/* Big Token Box */}
                <div className="p-4 rounded-4 bg-light border mb-4">
                  <span className="text-muted text-xs text-uppercase fw-bold d-block mb-1">Your Token Number</span>
                  <div className="display-4 fw-extrabold text-primary font-monospace tracking-wide mb-2">
                    {checkInResult.tokenNumber}
                  </div>
                  <span className="badge bg-primary-subtle text-primary text-xs px-3 py-1 rounded-pill">
                    Department: {checkInResult.departmentName}
                  </span>
                </div>

                {/* Consultation Location info */}
                <div className="d-flex flex-column gap-2 text-start p-3 bg-blue-50 rounded-3 border border-blue-100 text-xs mb-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-1"><Stethoscope size={14} /> Doctor:</span>
                    <strong className="text-dark">Dr. {checkInResult.doctorName}</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-1"><MapPin size={14} /> Room / OPD:</span>
                    <strong className="text-dark">{checkInResult.doctorRoom || 'Room 101'}</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-1"><Clock size={14} /> Estimated Wait:</span>
                    <strong className="text-primary">~{checkInResult.estimatedWaitingMinutes || 10} minutes</strong>
                  </div>
                </div>

                <button 
                  className="btn btn-dark rounded-pill py-2.5 fw-semibold text-sm w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={resetCheckIn}
                >
                  <RefreshCw size={16} />
                  <span>Check In Another Patient</span>
                </button>
              </div>
            ) : (
              /* Kiosk Input Card */
              <div className="card p-4 border rounded-4 bg-white shadow-sm">
                {/* 1-Click Test Demo Tokens */}
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-xs fw-bold text-dark text-uppercase tracking-wider d-flex align-items-center gap-1">
                      <Sparkles size={14} className="text-primary" />
                      <span>1-Click Demo Tokens:</span>
                    </span>
                    <span className="text-muted text-xxs">Instant Test</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {['CARD-001', 'CARD-002', 'CARD-003', 'GEN-001'].map((t) => (
                      <button 
                        key={t}
                        type="button" 
                        className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 text-xs font-monospace fw-bold"
                        onClick={() => handleQuickToken(t)}
                        disabled={loading}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="d-flex rounded-pill bg-light p-1 mb-4">
                  <button 
                    className={`btn btn-sm rounded-pill flex-grow-1 fw-semibold text-xs d-flex align-items-center justify-content-center gap-1.5 py-1.5 ${scanMode === 'manual' ? 'btn-white shadow-xs bg-white text-primary' : 'text-muted'}`}
                    onClick={() => setScanMode('manual')}
                  >
                    <Keyboard size={15} />
                    Enter Token / Appointment ID
                  </button>
                  <button 
                    className={`btn btn-sm rounded-pill flex-grow-1 fw-semibold text-xs d-flex align-items-center justify-content-center gap-1.5 py-1.5 ${scanMode === 'camera' ? 'btn-white shadow-xs bg-white text-primary' : 'text-muted'}`}
                    onClick={() => setScanMode('camera')}
                  >
                    <Camera size={15} />
                    Camera Scanner
                  </button>
                </div>

                {scanMode === 'camera' ? (
                  <div>
                    <div id="qr-reader-container" className="rounded-3 overflow-hidden border mb-3" style={{ minHeight: '260px' }}></div>
                    <p className="text-center text-muted text-xs mb-0">
                      Position your digital QR code pass within the camera viewfinder.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleManualSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-xs fw-bold text-dark text-uppercase">
                        Token Number or Appointment ID
                      </label>
                      <input 
                        type="text" 
                        className="form-control text-sm font-monospace text-uppercase"
                        placeholder="e.g. CARD-001 or APPT ID"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        required
                        autoFocus
                      />
                      <span className="text-muted text-xxs mt-1 d-block">
                        Found on your confirmation pass or digital appointment token.
                      </span>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill w-100 py-2.5 fw-semibold text-sm shadow-xs d-flex align-items-center justify-content-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <>
                          <span>Verify & Activate Queue</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCheckInPage;
