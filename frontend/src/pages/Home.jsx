import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { sallesApi } from '../api/salles.js'
import { reservationsApi } from '../api/reservations.js'
import Navbar from '../components/Navbar.jsx'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const firstName = user?.name?.split(' ')[0] || 'there'

  const [stats, setStats] = useState({ totalRooms: '—', myReservations: '—', availableToday: '—' })

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    Promise.all([
      sallesApi.list().catch(() => []),
      reservationsApi.mine().catch(() => []),
      sallesApi.available({ date: today, debut: '08:00', fin: '20:00' }).catch(() => []),
    ]).then(([rooms, mine, avail]) => {
      setStats({
        totalRooms: rooms.length,
        myReservations: mine.length,
        availableToday: avail.length,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Rooms',     value: stats.totalRooms,      sub: 'Rooms registered' },
    { label: 'My Reservations', value: stats.myReservations,  sub: 'Active bookings'  },
    { label: 'Available Today', value: stats.availableToday,  sub: '08:00 – 20:00'    },
  ]

  const actions = [
    { label: 'New Reservation', desc: 'Reserve a room for a makeup session', to: '/reservations' },
    { label: 'Browse Rooms',    desc: 'View all rooms and availability',     to: '/rooms'        },
    { label: 'My Bookings',     desc: 'Manage your reservations',            to: '/reservations' },
  ]

  const adminActions = [
    { label: 'Manage Rooms',     desc: 'Add, edit or remove rooms',      to: '/rooms'        },
    { label: 'All Reservations', desc: 'View and manage all bookings',   to: '/reservations' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">{user?.role}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Good day, {firstName}</h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {cards.map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

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
