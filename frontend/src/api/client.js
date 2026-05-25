const BASE = '/api'

const headers = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token'  )
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {}),
})

const handle = async (res) => {
  if (res.status === 401) {
    localStorage.clear()
     window. location.href = '/login'
    throw new Error( 'Unauthorized')
  }
  const text = await res.text()
   try { return JSON. parse(text) } catch { return text  }
}

const api = {
  get:    (url)       => fetch(`${BASE}${url}`, { method: 'GET',    headers: headers() }).then(handle),
  post  :   (url, body) => fetch(`${BASE}${url}`, { method: 'POST',   headers: headers(), body: JSON.stringify(body) }).then(handle),
  put:    (url, body) => fetch(`${BASE}${url}`, { method: 'PUT',    headers: headers(), body: JSON.stringify(body) }).then(handle),
  delete : (url)       => fetch(`${BASE}${url}`, { method: 'DELETE', headers: headers() }).then(handle),
   }

export default api
