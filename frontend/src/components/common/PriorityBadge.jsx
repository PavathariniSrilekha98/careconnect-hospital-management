import React from 'react';
import { Flame, ShieldAlert, Heart } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  if (!priority) return null;

  switch (priority.toUpperCase()) {
    case 'EMERGENCY':
      return (
        <span className="badge badge-emergency token-badge">
          <Flame size={14} className="me-1 animate-bounce" /> Emergency
        </span>
      );
    case 'SENIOR_CITIZEN':
      return (
        <span className="badge badge-senior token-badge">
          <Heart size={14} className="me-1" /> Senior Citizen
        </span>
      );
    case 'NORMAL':
    default:
      return (
        <span className="badge bg-light text-secondary border token-badge">
          Normal Priority
        </span>
      );
  }
};

export default PriorityBadge;
