import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import DepartmentsPage from '../pages/public/DepartmentsPage';
import DoctorsPage from '../pages/public/DoctorsPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import QrCheckInPage from '../pages/public/QrCheckInPage';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import BookAppointmentPage from '../pages/patient/BookAppointmentPage';
import MyAppointmentsPage from '../pages/patient/MyAppointmentsPage';
import PatientLiveQueuePage from '../pages/patient/PatientLiveQueuePage';
import PatientNotificationsPage from '../pages/patient/PatientNotificationsPage';
import PatientHistoryPage from '../pages/patient/PatientHistoryPage';
import PatientProfilePage from '../pages/patient/PatientProfilePage';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorQueuePage from '../pages/doctor/DoctorQueuePage';
import DoctorConsultationPage from '../pages/doctor/DoctorConsultationPage';
import DoctorAppointmentsPage from '../pages/doctor/DoctorAppointmentsPage';
import DoctorHistoryPage from '../pages/doctor/DoctorHistoryPage';
import DoctorProfilePage from '../pages/doctor/DoctorProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageDepartmentsPage from '../pages/admin/ManageDepartmentsPage';
import ManageDoctorsPage from '../pages/admin/ManageDoctorsPage';
import ManagePatientsPage from '../pages/admin/ManagePatientsPage';
import ManageAppointmentsPage from '../pages/admin/ManageAppointmentsPage';
import AdminQueueControlPage from '../pages/admin/AdminQueueControlPage';
import AnalyticsReportsPage from '../pages/admin/AnalyticsReportsPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Kiosk (Full Screen No Main Navbar) */}
      <Route path="/check-in" element={<QrCheckInPage />} />

      {/* 2. Public Pages with Standard Header & Footer */}
      <Route element={<MainLayout requireSidebar={false} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 3. Patient Portal Routes (With Sidebar & Navbar) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <MainLayout requireSidebar={true} />
          </ProtectedRoute>
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointmentPage />} />
        <Route path="/patient/appointments" element={<MyAppointmentsPage />} />
        <Route path="/patient/live-queue" element={<PatientLiveQueuePage />} />
        <Route path="/patient/notifications" element={<PatientNotificationsPage />} />
        <Route path="/patient/history" element={<PatientHistoryPage />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
      </Route>

      {/* 4. Doctor Portal Routes (With Sidebar & Navbar) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
            <MainLayout requireSidebar={true} />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/queue" element={<DoctorQueuePage />} />
        <Route path="/doctor/consultation" element={<DoctorConsultationPage />} />
        <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
        <Route path="/doctor/history" element={<DoctorHistoryPage />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
      </Route>

      {/* 5. Admin Portal Routes (With Sidebar & Navbar) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout requireSidebar={true} />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/departments" element={<ManageDepartmentsPage />} />
        <Route path="/admin/doctors" element={<ManageDoctorsPage />} />
        <Route path="/admin/patients" element={<ManagePatientsPage />} />
        <Route path="/admin/appointments" element={<ManageAppointmentsPage />} />
        <Route path="/admin/queues" element={<AdminQueueControlPage />} />
        <Route path="/admin/reports" element={<AnalyticsReportsPage />} />
        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
