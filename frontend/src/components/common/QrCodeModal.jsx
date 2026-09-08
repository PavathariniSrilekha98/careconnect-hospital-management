import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, QrCode, CheckCircle2, User, Calendar, Clock, Stethoscope } from 'lucide-react';

export const QrCodeModal = ({ show, onHide, appointment }) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrValue = appointment.qrCodeData || `HQMS:${appointment.id}:${appointment.tokenNumber}`;

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <QrCode className="text-primary" size={22} />
          Hospital Token & Check-In Pass
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 text-center">
        <div className="bg-primary-subtle p-3 rounded-3 mb-3 border border-primary-subtle">
          <small className="text-primary-emphasis fw-semibold text-uppercase tracking-wider">
            CareConnect Multi-Speciality Hospital &bull; {appointment.departmentName || 'Medical Center'}
          </small>
          <div className="display-5 fw-extrabold text-primary my-1">
            {appointment.tokenNumber}
          </div>
          <small className="text-muted">Show this QR code or token at reception kiosk</small>
        </div>

        <div className="d-flex justify-content-center p-3 bg-white rounded-3 border shadow-sm my-3">
          {appointment.qrCodeImageBase64 ? (
            <img
              src={appointment.qrCodeImageBase64}
              alt="Appointment QR Code"
              style={{ width: '200px', height: '200px' }}
            />
          ) : (
            <QRCodeSVG value={qrValue} size={200} level="H" includeMargin />
          )}
        </div>

        <Card className="text-start border bg-light p-3 rounded-3 mb-2">
          <div className="row g-2 small">
            <div className="col-6">
              <span className="text-muted d-block">Patient Name:</span>
              <strong className="text-dark">{appointment.patientName}</strong>
            </div>
            <div className="col-6">
              <span className="text-muted d-block">Doctor:</span>
              <strong className="text-dark">Dr. {appointment.doctorName}</strong>
            </div>
            <div className="col-6">
              <span className="text-muted d-block">Date & Slot:</span>
              <strong className="text-dark">{appointment.appointmentDate} ({appointment.timeSlot})</strong>
            </div>
            <div className="col-6">
              <span className="text-muted d-block">Room / Location:</span>
              <strong className="text-primary">{appointment.doctorRoom || 'Main OPD'}</strong>
            </div>
          </div>
        </Card>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <Button variant="outline-secondary" size="sm" onClick={handlePrint}>
          <Printer size={16} className="me-1" /> Print Pass
        </Button>
        <Button variant="primary" size="sm" onClick={onHide}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QrCodeModal;
