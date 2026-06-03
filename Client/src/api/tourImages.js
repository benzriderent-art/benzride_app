import apiClient from './client'

export const tourImageApi = {
  upload: (tourId, files) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return apiClient.post(`/tours/${tourId}/images`, form).then((r) => r.data)
  },
  delete: (tourId, imageId) =>
    apiClient.delete(`/tours/${tourId}/images/${imageId}`),
}
