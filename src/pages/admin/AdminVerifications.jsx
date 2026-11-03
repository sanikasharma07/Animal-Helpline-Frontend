import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import API from '@/api/axios'
import { ShieldCheck, AlertTriangle } from 'lucide-react'

// Real verification queues. Backend (admin only):
//   GET /admin/ngo/pending, GET /admin/vet/pending
//   PATCH /admin/ngo/:id/verify { status: "verified"|"rejected", rejectionReason }
//   PATCH /admin/vet/:id/verify (same shape; rejection reason required on reject)
// The old page listed invented organisations.
export default function AdminVerifications() {
  const [ngos, setNgos] = useState([])
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [rejectReason, setRejectReason] = useState({})
  const [rejectingId, setRejectingId] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [n, v] = await Promise.all([API.get('/admin/ngo/pending'), API.get('/admin/vet/pending')])
      setNgos(n.data?.data || [])
      setVets(v.data?.data || [])
    } catch (err) {
      setError(err?.message || 'Could not load pending verifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const decide = async (kind, id, status) => {
    setActionError('')
    try {
      const body = { status }
      if (status === 'rejected') body.rejectionReason = rejectReason[id]?.trim() || ''
      await API.patch(`/admin/${kind === 'ngo' ? 'ngo' : 'vet'}/${id}/verify`, body)
      setRejectingId(null)
      fetchAll()
    } catch (err) {
      setActionError(err?.message || 'Decision could not be saved. Rejection requires a reason.')
    }
  }

  const Section = ({ title, items, kind }) => (
    <section className="space-y-3">
      <h2 className="font-bold text-slate-900">{title} ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">Nothing pending in this queue.</p>
      ) : (
        items.map((item) => (
          <article key={item._id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900">{item.organizationName || item.clinicName || 'Unnamed'}</h3>
                <p className="text-sm text-slate-500">{item.description || item.specialization || ''}</p>
                <p className="text-xs text-slate-500 mt-1">{[item.address?.city, item.address?.state].filter(Boolean).join(', ')}{item.user?.name ? ` • Contact: ${item.user.name} (${item.user.email || ''})` : ''}</p>
              </div>
              <Link to={`/admin/verifications/${item._id}`} className="text-xs font-bold text-teal-700 hover:underline self-start">Review →</Link>
            </div>
            {rejectingId === item._id ? (
              <div className="space-y-2">
                <input value={rejectReason[item._id] || ''} onChange={(e) => setRejectReason({ ...rejectReason, [item._id]: e.target.value })} placeholder="Rejection reason (required)" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => decide(kind, item._id, 'rejected')} className="px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl">Confirm rejection</button>
                  <button onClick={() => setRejectingId(null)} className="px-4 py-2 bg-white border border-slate-200 text-sm font-bold rounded-xl">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => decide(kind, item._id, 'verified')} className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700">Approve</button>
                <button onClick={() => setRejectingId(item._id)} className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-50">Reject…</button>
              </div>
            )}
          </article>
        ))
      )}
    </section>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-teal-600" /> Verification queues</h1>
      {loading && <p className="text-sm text-slate-500">Loading queues…</p>}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
      {actionError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{actionError}</div>}
      <Section title="NGOs awaiting verification" items={ngos} kind="ngo" />
      <Section title="Vets awaiting verification" items={vets} kind="vet" />
    </div>
  )
}
