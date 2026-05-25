import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const stats = [
  {  label: 'Total Rooms',      sub: 'Rooms registered' },
  { label  : 'My Reservations',  sub: 'Active bookings'  },
  { label: 'Available Today',  sub: 'Free slots'        },
]

const actions = [
  { label: 'New Reservation', desc: 'Reserve a room for a makeup session', to: '/reservations' },
   { label: 'Browse Rooms',    desc: 'View all rooms and availability',      to: '/rooms'        },
  {  label: 'My Bookings',     desc: 'Manage your reservations',             to: '/reservations' },
]

const adminActions = [
   { label: 'Manage Rooms',   desc: 'Add, edit or remove rooms',     to: '/rooms'  },
  { label : 'All Reservations' , desc: 'View and manage all bookings', to: '/reservations'
  },
]

export default function Home() {
  const { user, logout } = useAuth()
   const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Campus Booking</span>
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

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">{user?.role}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Good day, {firstName}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">—</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Quick actions</p>
          <div className="grid grid-cols-2 gap-3">
            {actions.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-gray-900 text-sm mb-1">{a.label}</p>
                <p className="text-xs text-gray-400">{a.desc}</p>
              </button>
            ))}

            {isAdmin && adminActions.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="text-left bg-gray-900 border border-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-all"
              >
                <p className="font-medium text-white text-sm mb-1">{a.label}</p>
                <p className="text-xs text-gray-400">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
