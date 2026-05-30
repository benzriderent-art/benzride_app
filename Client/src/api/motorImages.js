import apiClient from './client'

export const motorImageApi = {
  upload: (motorId, files) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return apiClient.post(`/motors/${motorId}/images`, form).then((r) => r.data)
  },
  delete: (motorId, imageId) =>
    apiClient.delete(`/motors/${motorId}/images/${imageId}`),
}
