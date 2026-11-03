import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { Users, AlertTriangle } from 'lucide-react'

// Real user management. Backend (admin only):
//   GET /admin/users (?role, ?accountStatus)
//   POST /admin/moderation/warn { targetType, targetId, reason, reportId? }
//   POST /admin/moderation/suspend { targetId, reason, durationDays | suspendedUntil | indefinite }
//   POST /admin/moderation/lift-suspension { targetId, reason }
// Suspension blocks login, refresh and authenticated routes, and expires
// on its own; lifting it early is a reversible action recorded in the
// AdminAction audit history (GET /admin/actions). The old page "banned"
// invented users in local state only.
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [reason, setReason] = useState({})
  const [days, setDays] = useState({})

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const params = roleFilter ? { role: roleFilter } : {}
      const res = await API.get('/admin/users', { params })
      setUsers(res.data?.data || [])
    } catch (err) {
      setError(err?.message || 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [roleFilter])

  const act = async (fn) => {
    setActionError('')
    try { await fn(); fetchUsers() } catch (err) { setActionError(err?.message || 'Action could not be completed. A reason is required.') }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Users className="w-6 h-6 text-teal-600" /> Users</h1>
      <div className="flex gap-2 flex-wrap">
        {[['', 'All roles'], ['user', 'Users'], ['ngo', 'NGOs'], ['vet', 'Vets'], ['admin', 'Admins']].map(([v, label]) => (
          <button key={v} onClick={() => setRoleFilter(v)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${roleFilter === v ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}>{label}</button>
        ))}
      </div>
      {loading && <p className="text-sm text-slate-500">Loading users…</p>}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
      {actionError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{actionError}</div>}
      <div className="space-y-3">
        {users.map((u) => (
          <article key={u._id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900">{u.name}</h3>
                <p className="text-sm text-slate-500">{u.email}{u.phone ? ` • ${u.phone}` : ''}</p>
              </div>
              <div className="flex gap-2 text-xs font-bold">
                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">{u.role}</span>
                <span className={`px-2 py-1 rounded-full ${u.accountStatus === 'Suspended' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.accountStatus || 'Active'}</span>
              </div>
            </div>
            {u.accountStatus === 'Suspended' && (
              <p className="text-xs text-slate-500">Suspended{u.suspendedUntil ? ` until ${new Date(u.suspendedUntil).toLocaleString()}` : ' indefinitely'}{u.suspensionReason ? ` — ${u.suspensionReason}` : ''}</p>
            )}
            <div className="flex flex-wrap gap-2 items-center">
              <input value={reason[u._id] || ''} onChange={(e) => setReason({ ...reason, [u._id]: e.target.value })} placeholder="Reason (required for every action)" className="flex-1 min-w-[200px] px-3 py-2 border border-slate-200 rounded-xl text-sm" />
              <button onClick={() => act(() => API.post('/admin/moderation/warn', { targetType: 'User', targetId: u._id, reason: reason[u._id] }))} className="px-3 py-2 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl">Warn</button>
              {u.accountStatus === 'Suspended' ? (
                <button onClick={() => act(() => API.post('/admin/moderation/lift-suspension', { targetId: u._id, reason: reason[u._id] }))} className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">Lift suspension</button>
              ) : (
                <>
                  <input type="number" min="1" max="365" value={days[u._id] || '7'} onChange={(e) => setDays({ ...days, [u._id]: e.target.value })} className="w-20 px-2 py-2 border border-slate-200 rounded-xl text-sm" aria-label="Suspension days" />
                  <button onClick={() => act(() => API.post('/admin/moderation/suspend', { targetId: u._id, reason: reason[u._id], durationDays: Number(days[u._id] || 7) }))} className="px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl">Suspend (days)</button>
                  <button onClick={() => act(() => API.post('/admin/moderation/suspend', { targetId: u._id, reason: reason[u._id], indefinite: true }))} className="px-3 py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded-xl">Suspend indefinitely</button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
