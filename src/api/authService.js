import axiosClient from './axiosClient';

export const authService = {
  login: async (email, password) => {
    return axiosClient.post('/auth/login', { email, password });
  },
  
  register: async (userData) => {
    return axiosClient.post('/auth/register', userData);
  },
  
  logout: async () => {
    return axiosClient.post('/auth/logout');
  },
  
  getMe: async () => {
    return axiosClient.get('/auth/me');
  }
};
