import { useEffect, useState } from 'react'
import { sallesApi } from '../api/salles.js'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

const emptyForm = { nom: '', capacite: 0, localisation: '', disponible: true }

export default function Salles() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [salles, setSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const [modal, setModal] = useState(null) // { mode: 'create' | 'edit', salle? }
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [confirm, setConfirm] = useState(null) // salle to delete

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await sallesApi.list()
      setSalles(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setFormError('')
    setModal({ mode: 'create' })
  }

  const openEdit = (salle) => {
    setForm({
      nom: salle.nom,
      capacite: salle.capacite,
      localisation: salle.localisation,
      disponible: salle.disponible,
    })
    setFormError('')
    setModal({ mode: 'edit', salle })
  }

  const closeModal = () => setModal(null)

  const submitForm = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const payload = { ...form, capacite: Number(form.capacite) }
      if (modal.mode === 'create') {
        await sallesApi.create(payload)
      } else {
        await sallesApi.update(modal.salle.id, payload)
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
      await sallesApi.remove(confirm.id)
      setConfirm(null)
      load()
    } catch (e) {
      setError(e.message)
      setConfirm(null)
    }
  }

  const filtered = salles.filter(s => {
    const matchSearch = !search ||
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.localisation.toLowerCase().includes(search.toLowerCase())
    const matchAvail = !onlyAvailable || s.disponible
    return matchSearch && matchAvail
  })

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Rooms</p>
            <h1 className="text-2xl font-semibold text-gray-900">Salles</h1>
          </div>
          {isAdmin && (
            <button
              onClick={openCreate}
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + New room
            </button>
          )}
        </div>

        <div className="flex gap-3 mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className={inputCls + " flex-1"}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
            />
            Only available
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No rooms found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Name</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Capacity</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Location</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-2.5">Status</th>
                  {isAdmin && <th className="px-4 py-2.5"></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-gray-900 font-medium">{s.nom}</td>
                    <td className="px-4 py-3 text-gray-700">{s.capacite}</td>
                    <td className="px-4 py-3 text-gray-700">{s.localisation}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                        s.disponible
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {s.disponible ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEdit(s)}
                          className="text-xs text-gray-600 hover:text-gray-900 mr-3"
                        >Edit</button>
                        <button
                          onClick={() => setConfirm(s)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >Delete</button>
                      </td>
                    )}
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
              {modal.mode === 'create' ? 'New room' : 'Edit room'}
            </h2>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input type="number" min="1" required value={form.capacite} onChange={e => setForm({ ...form, capacite: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input required value={form.localisation} onChange={e => setForm({ ...form, localisation: e.target.value })} className={inputCls} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.disponible} onChange={e => setForm({ ...form, disponible: e.target.checked })} />
                Available
              </label>

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
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete room?</h2>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-900">{confirm.nom}</span> will be permanently removed.
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
