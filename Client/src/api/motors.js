import apiClient from './client'

const normalize = (data) => ({
  ...data,
  transmission: data.transmission?.toUpperCase(),
})

export const motorApi = {
  getAll: () => apiClient.get('/motors').then((r) => r.data),
  getById: (id) => apiClient.get(`/motors/${id}`).then((r) => r.data),
  create: (data) => apiClient.post('/motors', normalize(data)).then((r) => r.data),
  update: (id, data) => apiClient.put(`/motors/${id}`, normalize(data)).then((r) => r.data),
  delete: (id) => apiClient.delete(`/motors/${id}`),
}
