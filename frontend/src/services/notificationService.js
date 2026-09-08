import api from './api';

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
