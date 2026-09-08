import api from './api';

export const consultationService = {
  save: async (data) => {
    const res = await api.post('/consultations', data);
    return res.data;
  },

  saveConsultation: async (data) => {
    const res = await api.post('/consultations', data);
    return res.data;
  },

  createOrUpdateConsultation: async (data) => {
    const res = await api.post('/consultations', data);
    return res.data;
  },

  createConsultation: async (data) => {
    const res = await api.post('/consultations', data);
    return res.data;
  },

  getByAppointmentId: async (appointmentId) => {
    const res = await api.get(`/consultations/appointment/${appointmentId}`);
    return res.data;
  },

  getConsultationByAppointmentId: async (appointmentId) => {
    const res = await api.get(`/consultations/appointment/${appointmentId}`);
    return res.data;
  },

  getByPatientId: async (patientId) => {
    const res = await api.get(`/consultations/patient/${patientId}`);
    return res.data;
  },

  getPatientConsultations: async (patientId) => {
    const res = await api.get(`/consultations/patient/${patientId}`);
    return res.data;
  },

  getConsultationsByPatientId: async (patientId) => {
    const res = await api.get(`/consultations/patient/${patientId}`);
    return res.data;
  },

  getByDoctorId: async (doctorId) => {
    const res = await api.get(`/consultations/doctor/${doctorId}`);
    return res.data;
  },

  getDoctorConsultations: async (doctorId) => {
    const res = await api.get(`/consultations/doctor/${doctorId}`);
    return res.data;
  },

  getConsultationsByDoctorId: async (doctorId) => {
    const res = await api.get(`/consultations/doctor/${doctorId}`);
    return res.data;
  }
};
