import { useEffect, useMemo, useState } from 'react'
import { reservationsApi } from '../api/reservations.js'
import { sallesApi } from '../api/salles.js'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

const emptyForm = { salleId: '', date: '', heureDebut: '', heureFin: '', motif: '' }

export default function Reservations() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [reservations, setReservations] = useState([])
  const [salles, setSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState(isAdmin ? 'all' : 'mine') // 'all' | 'mine'
  const [filterSalle, setFilterSalle] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const [modal, setModal] = useState(null) // { mode, reservation? }
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [resList, salleList] = await Promise.all([
        view === 'all' ? reservationsApi.list() : reservationsApi.mine(),
        sallesApi.list(),
      ])
      setReservations(resList)
      setSalles(salleList)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [view])

  const openCreate = () => {
    setForm(emptyForm)
    setFormError('')
    setModal({ mode: 'create' })
  }

  const openEdit = (r) => {
    setForm({
      salleId: r.salleId,
      date: r.date,
      heureDebut: r.heureDebut?.slice(0, 5) ?? '',
      heureFin: r.heureFin?.slice(0, 5) ?? '',
      motif: r.motif ?? '',
    })
    setFormError('')
    setModal({ mode: 'edit', reservation: r })
  }

  const closeModal = () => setModal(null)

  const submitForm = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const payload = {
        salleId: Number(form.salleId),
        date: form.date,
        heureDebut: form.heureDebut,
        heureFin: form.heureFin,
        motif: form.motif,
      }
      if (modal.mode === 'create') {
        await reservationsApi.create(payload)
      } else {
        await reservationsApi.update(modal.reservation.id, payload)
      }
      closeModal()
      load()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const doDelete = async () => {
    try {
      await reservationsApi.remove(confirm.id)
      setConfirm(null)
      load()
    } catch (e) {
      setError(e.message)
      setConfirm(null)
    }
  }

  const canEdit = (r) => isAdmin || r.userEmail === user?.email

  const filtered = useMemo(() => reservations.filter(r => {
    const matchSalle = !filterSalle || String(r.salleId) === filterSalle
    const matchDate = !filterDate || r.date === filterDate
    return matchSalle && matchDate
  }), [reservations, filterSalle, filterDate])

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
  const fmtTime = (t) => t?.slice(0, 5) ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Bookings</p>
            <h1 className="text-2xl font-semibold text-gray-900">Reservations</h1>
          </div>
          <button
            onClick={openCreate}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + New reservation
          </button>
        </div>

        {isAdmin && (
          <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1 mb-4">
            <button
              onClick={() => setView('all')}
              className={`text-sm px-3 py-1 rounded-md transition-colors ${view === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
            >All</button>
            <button
              onClick={() => setView('mine')}
              className={`text-sm px-3 py-1 rounded-md transition-colors ${view === 'mine' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
            >Mine</button>
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <select value={filterSalle} onChange={e => setFilterSalle(e.target.value)} className={inputCls + " flex-1"}>
            <option value="">All rooms</option>
            {salles.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
          </select>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className={inputCls + " flex-1"} />
          {(filterSalle || filterDate) && (
            <button
              onClick={() => { setFilterSalle(''); setFilterDate('') }}
              className="text-sm text-gray-600 border border-gray-200 px-3 rounded-lg hover:bg-gray-100"
            >Clear</button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No reservations found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Room</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Date</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Time</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Motif</th>
                  {(isAdmin || view === 'all') && <th className="text-left font-medium text-gray-500 px-4 py-2.5">Teacher</th>}
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-gray-900 font-medium">{r.salleNom}</td>
                    <td className="px-4 py-3 text-gray-700">{r.date}</td>
                    <td className="px-4 py-3 text-gray-700">{fmtTime(r.heureDebut)} – {fmtTime(r.heureFin)}</td>
                    <td className="px-4 py-3 text-gray-700">{r.motif || '—'}</td>
                    {(isAdmin || view === 'all') && (
                      <td className="px-4 py-3 text-gray-700">{r.userName}</td>
                    )}
                    <td className="px-4 py-3">
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                        {r.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canEdit(r) && (
                        <>
                          <button onClick={() => openEdit(r)} className="text-xs text-gray-600 hover:text-gray-900 mr-3">Edit</button>
                          <button onClick={() => setConfirm(r)} className="text-xs text-red-600 hover:text-red-800">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {modal.mode === 'create' ? 'New reservation' : 'Edit reservation'}
            </h2>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <select required value={form.salleId} onChange={e => setForm({ ...form, salleId: e.target.value })} className={inputCls}>
                  <option value="">Select a room</option>
                  {salles.filter(s => s.disponible).map(s => (
                    <option key={s.id} value={s.id}>{s.nom} — {s.localisation} ({s.capacite})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                  <input type="time" required value={form.heureDebut} onChange={e => setForm({ ...form, heureDebut: e.target.value })} className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                  <input type="time" required value={form.heureFin} onChange={e => setForm({ ...form, heureFin: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <input value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} placeholder="Rattrapage Algo S6" className={inputCls} />
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 text-sm text-gray-700 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete reservation?</h2>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-900">{confirm.salleNom}</span> on {confirm.date} ({fmtTime(confirm.heureDebut)} – {fmtTime(confirm.heureFin)}) will be removed.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirm(null)} className="flex-1 text-sm text-gray-700 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={doDelete} className="flex-1 bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
