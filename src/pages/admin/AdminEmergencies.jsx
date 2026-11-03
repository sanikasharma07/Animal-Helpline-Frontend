import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import API from '@/api/axios'
import { AlertTriangle } from 'lucide-react'

// Admin emergency monitoring. Backend (admin only):
//   GET /admin/emergencies (?status) — cases with reporter and assigned NGO.
// Admins can view cases for investigation; there is no admin "flag as
// spam" or delete endpoint in the backend, so the old page's flag/delete
// buttons (which only changed local state) are removed. Moderation of a
// case happens through the Reports flow.
export default function AdminEmergencies() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    const params = statusFilter ? { status: statusFilter } : {}
    API.get('/admin/emergencies', { params })
      .then((res) => { if (!cancelled) setCases(res.data?.data || []) })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Could not load emergencies.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [statusFilter])

  const statuses = ['', 'Reported', 'Help Requested', 'Rescue Accepted', 'Rescuer On The Way', 'Animal Picked Up', 'At Veterinary Facility', 'Resolved']

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Emergency cases</h1>
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button key={s || 'all'} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${statusFilter === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}>{s || 'All statuses'}</button>
        ))}
      </div>
      {loading && <p className="text-sm text-slate-500">Loading cases…</p>}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
      <div className="space-y-3">
        {cases.map((c) => (
          <article key={c._id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-bold text-slate-900">{c.animalInfo?.species || 'Animal'} — {c.animalInfo?.quickDescription || c.quickDescription || 'Emergency case'}</h3>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">{c.status}</span>
            </div>
            <p className="text-xs text-slate-500">Reporter: {c.reporter?.name || 'Unknown'} • Assigned NGO: {c.assignedNgo?.organizationName || 'Unassigned'}{c.createdAt ? ` • ${new Date(c.createdAt).toLocaleString()}` : ''}</p>
            <Link to={`/tracker/${c._id}`} className="inline-flex text-xs font-bold text-teal-700 hover:underline">View case →</Link>
          </article>
        ))}
        {!loading && cases.length === 0 && <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No cases in this view.</p>}
      </div>
    </div>
  )
}
