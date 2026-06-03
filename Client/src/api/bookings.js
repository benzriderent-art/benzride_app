import apiClient from './client'

export const bookingApi = {
  getAll: (status) =>
    apiClient.get('/bookings', { params: status ? { status } : {} }).then((r) => r.data),
  create: (data) => apiClient.post('/bookings', data).then((r) => r.data),
  createWhatsApp: (data) => apiClient.post('/bookings/whatsapp', data).then((r) => r.data),
  createManual: (data) => apiClient.post('/bookings/admin', data).then((r) => r.data),
  updateStatus: (id, status) =>
    apiClient.patch(`/bookings/${id}/status`, { status }).then((r) => r.data),
  updatePaymentStatus: (id, paymentStatus) =>
    apiClient.patch(`/bookings/${id}/payment-status`, { paymentStatus }).then((r) => r.data),
  delete: (id) => apiClient.delete(`/bookings/${id}`),
  editBooking: (id, data) =>
    apiClient.put(`/bookings/${id}`, data).then((r) => r.data),
  getBookedDates: (motorId) =>
    apiClient.get(`/bookings/motor/${motorId}/booked-dates`).then((r) => r.data),
  track: (id, phone) =>
    apiClient.get('/bookings/track', { params: { id, phone } }).then((r) => r.data),
}
