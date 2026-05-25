import api from './client.js'

export const reservationsApi = {
  list:   ()         => api.get('/reservations'),
  mine:   ()         => api.get('/reservations/me'),
  get:    (id)       => api.get(`/reservations/${id}`),
  create: (data)     => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  remove: (id)       => api.delete(`/reservations/${id}`),
}
