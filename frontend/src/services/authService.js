import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.success) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updated = { ...currentUser, ...res.data.data };
      localStorage.setItem('user', JSON.stringify(updated));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser: () => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  getStoredToken: () => {
    return localStorage.getItem('token');
  }
};
