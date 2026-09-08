import api from './api';

export const appointmentService = {
  book: async (data) => {
    const res = await api.post('/appointments', data);
    return res.data;
  },

  bookAppointment: async (data) => {
    const res = await api.post('/appointments', data);
    return res.data;
  },

  createAppointment: async (data) => {
    const res = await api.post('/appointments', data);
    return res.data;
  },

  getMy: async () => {
    const res = await api.get('/appointments/my');
    return res.data;
  },

  getMyAppointments: async () => {
    const res = await api.get('/appointments/my');
    return res.data;
  },

  getDoctorAppointments: async (doctorId, date) => {
    const url = date ? `/appointments/doctor/${doctorId}?date=${date}` : `/appointments/doctor/${doctorId}`;
    const res = await api.get(url);
    return res.data;
  },

  getAll: async (date) => {
    const url = date ? `/appointments/all?date=${date}` : '/appointments/all';
    const res = await api.get(url);
    return res.data;
  },

  getAllAppointments: async (date) => {
    const url = date ? `/appointments/all?date=${date}` : '/appointments/all';
    const res = await api.get(url);
    return res.data;
  },

  getBookedSlots: async (doctorId, date) => {
    const res = await api.get(`/appointments/booked-slots?doctorId=${doctorId}&date=${date}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  cancel: async (id, reason) => {
    const res = await api.put(`/appointments/${id}/cancel`, { reason });
    return res.data;
  },

  cancelAppointment: async (id, reason) => {
    const res = await api.put(`/appointments/${id}/cancel`, { reason });
    return res.data;
  },

  reschedule: async (id, date, timeSlot) => {
    const res = await api.put(`/appointments/${id}/reschedule`, { date, timeSlot });
    return res.data;
  }
};

export const queueService = {
  getDoctorQueue: async (doctorId, date) => {
    const url = date ? `/queues/doctor/${doctorId}?date=${date}` : `/queues/doctor/${doctorId}`;
    const res = await api.get(url);
    return res.data;
  },

  getLiveQueueForDoctor: async (doctorId, date) => {
    const url = date ? `/queues/doctor/${doctorId}?date=${date}` : `/queues/doctor/${doctorId}`;
    const res = await api.get(url);
    return res.data;
  },

  getDepartmentQueue: async (departmentId, date) => {
    const url = date ? `/queues/department/${departmentId}?date=${date}` : `/queues/department/${departmentId}`;
    const res = await api.get(url);
    return res.data;
  },

  getLiveQueueForDepartment: async (departmentId, date) => {
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
  }
};

export const consultationService = {
  save: async (data) => {
    const res = await api.post('/consultations', data);
    return res.data;
  },

  saveConsultation: async (data) => {
    const res = await api.post('/consultations', data);
    return res.data;
  },

  getByAppointmentId: async (appointmentId) => {
    const res = await api.get(`/consultations/appointment/${appointmentId}`);
    return res.data;
  },

  getByPatientId: async (patientId) => {
    const res = await api.get(`/consultations/patient/${patientId}`);
    return res.data;
  },

  getByDoctorId: async (doctorId) => {
    const res = await api.get(`/consultations/doctor/${doctorId}`);
    return res.data;
  }
};

export const notificationService = {
  getMy: async (unreadOnly = false) => {
    const res = await api.get(`/notifications?unreadOnly=${unreadOnly}`);
    return res.data;
  },

  getMyNotifications: async (unreadOnly = false) => {
    const res = await api.get(`/notifications?unreadOnly=${unreadOnly}`);
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  }
};

export const analyticsService = {
  getAdminDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getDoctorDashboard: async (doctorId) => {
    const url = doctorId ? `/doctor/${doctorId}/dashboard` : '/doctor/dashboard';
    const res = await api.get(url);
    return res.data;
  },

  getAnalyticsReport: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  getAuditLogs: async (action, userId) => {
    let url = '/audit-logs?';
    if (action) url += `action=${action}&`;
    if (userId) url += `userId=${userId}&`;
    const res = await api.get(url);
    return res.data;
  },

  getUsers: async (role, search) => {
    let url = '/admin/users?';
    if (role) url += `role=${role}&`;
    if (search) url += `search=${search}&`;
    const res = await api.get(url);
    return res.data;
  },

  toggleUserStatus: async (id) => {
    const res = await api.patch(`/admin/users/${id}/toggle-status`);
    return res.data;
  }
};

export const checkInService = {
  verifyAndCheckIn: async (qrCodeData) => {
    const res = await api.post('/check-in', { qrCodeData });
    return res.data;
  },

  getHospitalDisplayFeed: async () => {
    const res = await api.get('/display/live');
    return res.data;
  }
};
