import apiClient from './client'

export const tourApi = {
  getAll: (available) =>
    apiClient.get('/tours', { params: available ? { available: true } : {} }).then((r) => r.data),
  getById: (id) => apiClient.get(`/tours/${id}`).then((r) => r.data),
  create: (data) => apiClient.post('/tours', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/tours/${id}`, data).then((r) => r.data),
  delete: (id) => apiClient.delete(`/tours/${id}`).then((r) => r.data),
}

export const tourBookingApi = {
  getAll: (status) =>
    apiClient.get('/tour-bookings', { params: status ? { status } : {} }).then((r) => r.data),
  create: (data) => apiClient.post('/tour-bookings', data).then((r) => r.data),
  updateStatus: (id, status) =>
    apiClient.patch(`/tour-bookings/${id}/status`, { status }).then((r) => r.data),
  delete: (id) => apiClient.delete(`/tour-bookings/${id}`),
}
