import api from './api';

export const checkInService = {
  checkIn: async (data) => {
    let payload = data;
    if (typeof data === 'string') {
      payload = { qrCodeData: data };
    } else if (data && !data.qrCodeData) {
      payload = { qrCodeData: data.tokenNumber || data.appointmentId || '' };
    }
    const res = await api.post('/check-in', payload);
    return res.data;
  },

  verifyAndCheckIn: async (qrCodeData) => {
    let payload = qrCodeData;
    if (typeof qrCodeData === 'string') {
      payload = { qrCodeData };
    }
    const res = await api.post('/check-in', payload);
    return res.data;
  },

  getHospitalDisplayFeed: async () => {
    const res = await api.get('/display/live');
    return res.data;
  }
};
