import axiosClient from './axiosClient';

export const authService = {
  login: (email, password) => axiosClient.post('/auth/login', { email, password }),
  register: (userData) => axiosClient.post('/auth/register', userData),
  logout: () => axiosClient.post('/auth/logout'),
  getMe: () => axiosClient.get('/auth/me'),
};

export const userService = {
  getAllUsers: () => axiosClient.get('/users'),
  getOwnProfile: () => axiosClient.get('/users/me'),
  updateOwnProfile: (data) => axiosClient.put('/users/me', data),
  deleteOwnProfile: () => axiosClient.delete('/users/me'),
  getUserById: (id) => axiosClient.get(`/users/${id}`),
  createUser: (data) => axiosClient.post('/users', data),
  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
};

export const vehicleService = {
  getMyVehicles: () => axiosClient.get('/vehicles/me'),
  getAllVehicles: () => axiosClient.get('/vehicles'),
  getVehicleById: (id) => axiosClient.get(`/vehicles/${id}`),
  addVehicle: (data) => axiosClient.post('/vehicles', data),
  updateVehicle: (id, data) => axiosClient.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => axiosClient.delete(`/vehicles/${id}`),
  adminUpdateVehicle: (id, data) => axiosClient.put(`/vehicles/${id}/admin`, data),
  adminDeleteVehicle: (id) => axiosClient.delete(`/vehicles/${id}/admin`),
};

export const lotService = {
  getAllLots: () => axiosClient.get('/parking-lots'),
  getLotById: (id) => axiosClient.get(`/parking-lots/${id}`),
  createLot: (data) => axiosClient.post('/parking-lots', data),
  updateLot: (id, data) => axiosClient.put(`/parking-lots/${id}`, data),
  deleteLot: (id) => axiosClient.delete(`/parking-lots/${id}`),
  // parkingSlotRoute uses GET /parking-slots/:id where :id is the lotId
  getSlotsByLotId: (lotId) => axiosClient.get(`/parking-slots/${lotId}`),
};

export const slotService = {
  getByLotId: (lotId) => axiosClient.get(`/parking-slots/${lotId}`),
  createSlot: (data) => axiosClient.post('/parking-slots', data),
  updateSlot: (id, data) => axiosClient.put(`/parking-slots/${id}`, data),
  updateSlotStatus: (id, status) => axiosClient.put(`/parking-slots/${id}/status`, { status }),
  deleteSlot: (id) => axiosClient.delete(`/parking-slots/${id}`),
};

export const bookingService = {
  getMyBookings: () => axiosClient.get('/bookings/me'),
  getAllBookings: () => axiosClient.get('/bookings'),
  getBookingById: (id) => axiosClient.get(`/bookings/${id}`),
  createBooking: (data) => axiosClient.post('/bookings', data),
  updateOwnBooking: (id, data) => axiosClient.put(`/bookings/${id}`, data),
  adminUpdateBooking: (id, data) => axiosClient.put(`/bookings/${id}/admin`, data),
  cancelBooking: (id) => axiosClient.delete(`/bookings/${id}`),        // USER cancel own
  adminDeleteBooking: (id) => axiosClient.delete(`/bookings/${id}/admin`),
};

export const recordService = {
  checkIn: (data) => axiosClient.post('/records/checkin', data),
  checkOut: (id) => axiosClient.put(`/records/${id}/checkout`),
  getMyRecords: () => axiosClient.get('/records/me'),
  getAllRecords: () => axiosClient.get('/records'),
};

export const paymentService = {
  getMyPayments: () => axiosClient.get('/payments/me'),
  getAllPayments: () => axiosClient.get('/payments'),
  getPaymentById: (id) => axiosClient.get(`/payments/${id}`),
  getPaymentsByUserId: (userId) => axiosClient.get(`/payments/user/${userId}`),
  createPayment: (data) => axiosClient.post('/payments', data),
};

export const passService = {
  getMyPasses: () => axiosClient.get('/monthly-passes/me'),
  getAllPasses: () => axiosClient.get('/monthly-passes'),
  createPass: (data) => axiosClient.post('/monthly-passes', data),
  renewPass: (id, data) => axiosClient.put(`/monthly-passes/${id}/renew`, data),
  cancelPass: (id) => axiosClient.delete(`/monthly-passes/${id}`),     // USER cancel own
  updatePassStatus: (id, status) => axiosClient.put(`/monthly-passes/${id}/status`, { status }),
  updatePrices: (data) => axiosClient.put('/monthly-passes/price', data),
};
