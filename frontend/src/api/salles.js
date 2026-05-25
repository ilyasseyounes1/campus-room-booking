import api from './client.js'

export const sallesApi = {
  list:      ()         => api.get('/salles'),
  get:       (id)       => api.get(`/salles/${id}`),
  available: (params)   => {
    if (!params) return api.get('/salles/disponibles')
    const q = new URLSearchParams(params).toString()
    return api.get(`/salles/disponibles?${q}`)
  },
  create:    (data)     => api.post('/salles', data),
  update:    (id, data) => api.put(`/salles/${id}`, data),
  remove:    (id)       => api.delete(`/salles/${id}`),
}
