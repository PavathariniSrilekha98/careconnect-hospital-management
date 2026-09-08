import api from './api';

export const queueService = {
  getDoctorQueue: async (doctorId, date) => {
    const url = date ? `/queues/doctor/${doctorId}?date=${date}` : `/queues/doctor/${doctorId}`;
    const res = await api.get(url);
    return res.data;
  },

  getQueueForDoctor: async (doctorId, date) => {
    const url = date ? `/queues/doctor/${doctorId}?date=${date}` : `/queues/doctor/${doctorId}`;
    const res = await api.get(url);
    return res.data;
  },

  getDepartmentQueue: async (departmentId, date) => {
    const url = date ? `/queues/department/${departmentId}?date=${date}` : `/queues/department/${departmentId}`;
    const res = await api.get(url);
    return res.data;
  },

  getQueueForDepartment: async (departmentId, date) => {
    const url = date ? `/queues/department/${departmentId}?date=${date}` : `/queues/department/${departmentId}`;
    const res = await api.get(url);
    return res.data;
  },

  callNext: async (doctorId) => {
    const res = await api.post(`/queues/doctor/${doctorId}/next`);
    return res.data;
  },

  callNextPatient: async (doctorId) => {
    const res = await api.post(`/queues/doctor/${doctorId}/next`);
    return res.data;
  },

  updateStatus: async (ticketId, status, notes) => {
    const res = await api.patch(`/queues/${ticketId}/status`, { status, notes });
    return res.data;
  },

  updateTicketStatus: async (ticketId, status, notes) => {
    const res = await api.patch(`/queues/${ticketId}/status`, { status, notes });
    return res.data;
  },

  updatePriority: async (ticketId, priority, reason) => {
    const res = await api.patch(`/queues/${ticketId}/priority`, { priority, reason });
    return res.data;
  },

  updateTicketPriority: async (ticketId, priority, reason) => {
    const res = await api.patch(`/queues/${ticketId}/priority`, { priority, reason });
    return res.data;
  },

  getHospitalDisplayFeed: async () => {
    const res = await api.get('/queues/display-feed');
    return res.data;
  }
};

