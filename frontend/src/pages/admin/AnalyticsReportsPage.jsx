import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Activity, 
  Flame, 
  Calendar,
  Layers
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import LoadingSpinner from '../../components/common/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getAnalyticsReport();
        if (res.success) {
          setReport(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Generating hospital analytics & visualization reports..." />;
  }

  // 1. Daily Trend Data
  const dailyLabels = Object.keys(report?.dailyPatientTrend || {});
  const dailyValues = Object.values(report?.dailyPatientTrend || {});
  const dailyData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Patients Registered / Attended',
        data: dailyValues,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#0284c7',
      }
    ]
  };

  // 2. Department Distribution Data
  const deptLabels = Object.keys(report?.departmentDistribution || {});
  const deptValues = Object.values(report?.departmentDistribution || {});
  const deptData = {
    labels: deptLabels,
    datasets: [
      {
        data: deptValues,
        backgroundColor: [
          '#0284c7',
          '#0f766e',
          '#7c3aed',
          '#f59e0b',
          '#ec4899',
          '#64748b'
        ],
        borderWidth: 1
      }
    ]
  };

  // 3. Hourly Traffic Data
  const hourlyLabels = Object.keys(report?.hourlyTraffic || {});
  const hourlyValues = Object.values(report?.hourlyTraffic || {});
  const hourlyData = {
    labels: hourlyLabels.map(h => `${h}:00`),
    datasets: [
      {
        label: 'Patient Traffic',
        data: hourlyValues,
        backgroundColor: '#0f766e',
        borderRadius: 6
      }
    ]
  };

  // 4. Doctor Consultations
  const doctorLabels = Object.keys(report?.doctorConsultationCounts || {});
  const doctorValues = Object.values(report?.doctorConsultationCounts || {});
  const doctorData = {
    labels: doctorLabels,
    datasets: [
      {
        label: 'Completed Consultations',
        data: doctorValues,
        backgroundColor: '#7c3aed',
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="analytics-reports-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1">Hospital Analytics & Operational Reports</h2>
          <p className="text-muted text-xs mb-0">Visual data intelligence for patient throughput, waiting times, and clinic capacities</p>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <span className="text-muted text-xs text-uppercase fw-bold">Overall Average Wait</span>
            <h3 className="fw-extrabold text-primary mt-2 mb-0">~{report?.overallAverageWaitMinutes || 18}m</h3>
            <span className="text-muted text-xxs">Across all OPD departments</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <span className="text-muted text-xs text-uppercase fw-bold">Peak Rush Period</span>
            <h3 className="fw-extrabold text-danger mt-2 mb-0">{report?.peakHourLabel || '10:00 - 11:00'}</h3>
            <span className="text-muted text-xxs">Highest outpatient influx</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <span className="text-muted text-xs text-uppercase fw-bold">Avg Consultation Duration</span>
            <h3 className="fw-extrabold text-dark mt-2 mb-0">{report?.overallAverageConsultationMinutes || 10}m</h3>
            <span className="text-muted text-xxs">Doctor clinical contact time</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card p-3.5 border rounded-4 bg-white shadow-xs">
            <span className="text-muted text-xs text-uppercase fw-bold">Peak Influx Load</span>
            <h3 className="fw-extrabold text-purple-700 mt-2 mb-0">{report?.peakHourTotal || 0} Patients</h3>
            <span className="text-muted text-xxs">During peak hour window</span>
          </div>
        </div>
      </div>

      {/* Chart Rows */}
      <div className="row g-4 mb-4">
        {/* Daily Patient Volume Trend */}
        <div className="col-lg-8">
          <div className="card p-4 border rounded-4 bg-white shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark text-base mb-0 d-flex align-items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                7-Day Outpatient Volume Trend
              </h5>
            </div>
            <div style={{ height: '280px' }}>
              <Line data={dailyData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="col-lg-4">
          <div className="card p-4 border rounded-4 bg-white shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark text-base mb-0 d-flex align-items-center gap-2">
                <Layers size={18} className="text-primary" />
                Department Load Share
              </h5>
            </div>
            <div className="d-flex align-items-center justify-content-center" style={{ height: '280px' }}>
              <Doughnut data={deptData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Hourly Traffic & Doctor Consultations */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card p-4 border rounded-4 bg-white shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark text-base mb-0 d-flex align-items-center gap-2">
                <Clock size={18} className="text-teal-600" style={{ color: '#0f766e' }} />
                Hourly OPD Rush Hours
              </h5>
            </div>
            <div style={{ height: '280px' }}>
              <Bar data={hourlyData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-4 border rounded-4 bg-white shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark text-base mb-0 d-flex align-items-center gap-2">
                <Users size={18} className="text-purple-600" style={{ color: '#7c3aed' }} />
                Doctor Consultations Output
              </h5>
            </div>
            <div style={{ height: '280px' }}>
              <Bar data={doctorData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReportsPage;
