import React from 'react';
import { Badge } from 'react-bootstrap';
import { CheckCircle, Clock, AlertCircle, PlayCircle, XCircle, SkipForward, UserX } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  switch (status.toUpperCase()) {
    case 'CALLED':
      return (
        <span className="badge badge-called token-badge">
          <AlertCircle size={14} className="me-1" /> Called - Proceed
        </span>
      );
    case 'IN_CONSULTATION':
      return (
        <span className="badge badge-serving token-badge">
          <PlayCircle size={14} className="me-1" /> In Consultation
        </span>
      );
    case 'WAITING':
    case 'IN_QUEUE':
      return (
        <span className="badge badge-waiting token-badge">
          <Clock size={14} className="me-1" /> Waiting in Queue
        </span>
      );
    case 'BOOKED':
      return (
        <span className="badge badge-waiting token-badge">
          <Clock size={14} className="me-1" /> Booked
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="badge badge-completed token-badge">
          <CheckCircle size={14} className="me-1" /> Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle token-badge">
          <XCircle size={14} className="me-1" /> Cancelled
        </span>
      );
    case 'SKIPPED':
      return (
        <span className="badge bg-secondary-subtle text-secondary border token-badge">
          <SkipForward size={14} className="me-1" /> Skipped
        </span>
      );
    case 'ABSENT':
      return (
        <span className="badge bg-dark-subtle text-dark border token-badge">
          <UserX size={14} className="me-1" /> Absent
        </span>
      );
    default:
      return <Badge bg="light" text="dark" className="border px-2 py-1">{status}</Badge>;
  }
};

export default StatusBadge;
