import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import API from '@/api/axios'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

// Admin campaign monitoring. Backend (admin only):
//   GET /admin/campaigns (?status, ?removedByAdmin=true) — includes
//     soft-removed campaigns when requested.
//   POST /admin/moderation/remove-campaign { campaignId, reason }
//   POST /admin/moderation/restore-campaign { campaignId, reason }
// Removal is soft, never deletion: ownership, donors and pledges are
// preserved, the campaign is hidden from lists and normal detail, and
// an admin can restore it. Every action is recorded in AdminAction
// history (visible on the Overview page). The old page suspended
// invented campaigns in local state only.
export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [showRemoved, setShowRemoved] = useState(false)
  const [reason, setReason] = useState({})

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const params = showRemoved ? { removedByAdmin: true } : {}
      const res = await API.get('/admin/campaigns', { params })
      setCampaigns(res.data?.data || [])
    } catch (err) {
      setError(err?.message || 'Could not load campaigns.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [showRemoved])

  const act = async (endpoint, campaignId) => {
    setActionError('')
    try {
      await API.post(endpoint, { campaignId, reason: reason[campaignId] || 'Admin moderation' })
      fetchAll()
    } catch (err) {
      setActionError(err?.message || 'Action could not be completed. A reason is required.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Campaigns &amp; donations</h1>
      <div className="flex gap-2">
        <button onClick={() => setShowRemoved(false)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${!showRemoved ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}>Live campaigns</button>
        <button onClick={() => setShowRemoved(true)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${showRemoved ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}>Removed campaigns</button>
      </div>
      {loading && <p className="text-sm text-slate-500">Loading campaigns…</p>}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
      {actionError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{actionError}</div>}
      <div className="space-y-3">
        {campaigns.map((c) => (
          <article key={c._id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900">{c.title}</h3>
                <p className="text-sm text-slate-500">{formatCurrency(c.raisedAmount || 0)} of {formatCurrency(c.targetAmount)} • {c.ngo?.organizationName || 'Verified NGO'}</p>
                {c.removedByAdmin && <p className="text-xs text-rose-600 font-semibold">Removed by admin{c.removalReason ? `: ${c.removalReason}` : ''}</p>}
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">{c.status}</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <input value={reason[c._id] || ''} onChange={(e) => setReason({ ...reason, [c._id]: e.target.value })} placeholder="Reason for the action" className="flex-1 min-w-[200px] px-3 py-2 border border-slate-200 rounded-xl text-sm" />
              {c.removedByAdmin ? (
                <button onClick={() => act('/admin/moderation/restore-campaign', c._id)} className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">Restore</button>
              ) : (
                <button onClick={() => act('/admin/moderation/remove-campaign', c._id)} className="px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl">Remove (soft)</button>
              )}
              <Link to={`/campaign/${c._id}`} className="px-3 py-2 bg-white border border-slate-200 text-xs font-bold rounded-xl">View</Link>
            </div>
          </article>
        ))}
        {!loading && campaigns.length === 0 && <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No campaigns in this view.</p>}
      </div>
    </div>
  )
}
