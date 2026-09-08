import api from './api';

export const doctorService = {
  getAll: async (departmentId, activeOnly = false) => {
    let url = `/doctors?activeOnly=${activeOnly}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    const res = await api.get(url);
    return res.data;
  },

  getAllDoctors: async (departmentId, activeOnly = false) => {
    let url = `/doctors?activeOnly=${activeOnly}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    const res = await api.get(url);
    return res.data;
  },

  getDoctors: async (departmentId, activeOnly = false) => {
    let url = `/doctors?activeOnly=${activeOnly}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    const res = await api.get(url);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  getDoctorById: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  getByUserId: async (userId) => {
    const res = await api.get(`/doctors/user/${userId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/doctors', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/doctors/${id}`, data);
    return res.data;
  },

  updateAvailability: async (id, status) => {
    const res = await api.patch(`/doctors/${id}/availability`, { status });
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/doctors/${id}`);
    return res.data;
  }
};
