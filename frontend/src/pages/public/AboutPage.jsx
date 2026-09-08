import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Clock, Sparkles, Users, Award, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2 text-xs">
            About Our Healthcare System
          </span>
          <h1 className="fw-extrabold text-dark tracking-tight">Smart Healthcare Infrastructure</h1>
          <p className="text-muted text-sm" style={{ maxWidth: '650px', margin: '0 auto' }}>
            CareConnect Multi-Speciality Hospital is dedicated to combining clinical excellence with next-generation digital healthcare delivery to eliminate waiting line congestion and provide compassionate patient care.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card p-4 border rounded-4 h-100 bg-white shadow-xs">
              <div className="p-3 rounded-3 bg-primary-subtle text-primary d-inline-block mb-3" style={{ width: 'fit-content' }}>
                <Clock size={24} />
              </div>
              <h5 className="fw-bold text-dark text-base mb-2">Real-Time Queue Sync</h5>
              <p className="text-muted text-xs mb-0">
                STOMP WebSockets deliver instant queue status updates directly to patients' smartphones, reducing physical waiting room congestion by over 70%.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 border rounded-4 h-100 bg-white shadow-xs">
              <div className="p-3 rounded-3 bg-emerald-100 text-success d-inline-block mb-3" style={{ width: 'fit-content' }}>
                <ShieldCheck size={24} />
              </div>
              <h5 className="fw-bold text-dark text-base mb-2">Enterprise Security</h5>
              <p className="text-muted text-xs mb-0">
                End-to-end JWT token validation, BCrypt credential encryption, and role-based permissions protect electronic medical records and patient privacy.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 border rounded-4 h-100 bg-white shadow-xs">
              <div className="p-3 rounded-3 bg-purple-100 text-purple-700 d-inline-block mb-3" style={{ width: 'fit-content', color: '#7c3aed' }}>
                <Sparkles size={24} />
              </div>
              <h5 className="fw-bold text-dark text-base mb-2">Smart Priority Triage</h5>
              <p className="text-muted text-xs mb-0">
                Intelligent queue scheduling prioritizes emergency and senior citizen patients while dynamically maintaining sequence integrity and estimated wait calculations.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="card border-0 rounded-4 p-4 text-white mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)' }}>
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h2 className="display-6 fw-extrabold mb-1">100%</h2>
              <span className="text-xs opacity-90">Digital Token Accuracy</span>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-6 fw-extrabold mb-1">&lt; 15m</h2>
              <span className="text-xs opacity-90">Average OPD Wait Time</span>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-6 fw-extrabold mb-1">50+</h2>
              <span className="text-xs opacity-90">Specialist Doctors</span>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-6 fw-extrabold mb-1">24/7</h2>
              <span className="text-xs opacity-90">Emergency Care</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
