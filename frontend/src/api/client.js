const BASE = '/api'

const headers = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token')
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {}),
})

const handle = async (res) => {
  if (res.status === 401) {
    localStorage.clear()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) {
    const msg = (data && data.message) || (typeof data === 'string' && data) || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return data
}

const api = {
  get:    (url)       => fetch(`${BASE}${url}`, { method: 'GET',    headers: headers() }).then(handle),
  post:   (url, body) => fetch(`${BASE}${url}`, { method: 'POST',   headers: headers(), body: JSON.stringify(body) }).then(handle),
  put:    (url, body) => fetch(`${BASE}${url}`, { method: 'PUT',    headers: headers(), body: JSON.stringify(body) }).then(handle),
  delete: (url)       => fetch(`${BASE}${url}`, { method: 'DELETE', headers: headers() }).then(handle),
}

export default api
