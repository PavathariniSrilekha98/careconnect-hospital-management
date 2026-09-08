import api from './api';

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
