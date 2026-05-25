import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const linkCls = ({ isActive }) =>
    `text-sm transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Campus Booking</span>
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/" end className={linkCls}>Home</NavLink>
            <NavLink to="/rooms" className={linkCls}>Rooms</NavLink>
            <NavLink to="/reservations" className={linkCls}>Reservations</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.role}</p>
          </div>
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
