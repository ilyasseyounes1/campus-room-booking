import { createContext, useContext, useState } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] =  useState(() => {
    const raw = localStorage. getItem('user')
    return raw ? JSON. parse( raw) : null
  })
  const [loading, setLoading] = useState(false)

  const  login = async (email, password) => {
    setLoading (true)
    try {


      const  data = await api.  post('/auth/login', { email, password })
       localStorage.setItem('token', data.token)
       const u = { name: data.name, email, role: data .role }
      localStorage.setItem('user', JSON.stringify(u))
      setUser(u )
      return u
    } finally {
       setLoading(false)
    }
  }

  const register = async (form) => {
    setLoading(true)
    try {
       return await api.post  ('/auth/register', form)
    } finally {
      setLoading(false)
    }
  }

  const logout =  ( ) => {
    localStorage. clear( )
     setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}   >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
