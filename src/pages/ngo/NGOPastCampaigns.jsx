import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import API from '@/api/axios'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle, ChevronRight } from 'lucide-react'

// The NGO's own campaigns, real only: GET /donations/campaigns/mine
// (owning NGO, donors included — unlike the public detail endpoint, which
// hides donors). The old page listed invented completed campaigns.
export default function NGOPastCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    API.get('/donations/campaigns/mine')
      .then((res) => { if (!cancelled) setCampaigns(res.data?.data || []) })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Could not load your campaigns.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = campaigns.filter((c) => activeTab === 'all' || (activeTab === 'active' ? c.status === 'Active' : c.status !== 'Active'))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#183B35]">My Campaigns</h1>
        <p className="text-slate-500 text-sm mt-1">Every campaign published by your NGO, with its real funding progress and donor count (donors are visible here because these are your own campaigns).</p>
      </div>

      <div className="flex gap-2">
        {[['all', 'All'], ['active', 'Active'], ['finished', 'Goal reached / Closed']].map(([v, label]) => (
          <button key={v} onClick={() => setActiveTab(v)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${activeTab === v ? 'bg-[#087F70] text-white border-[#087F70]' : 'bg-white text-slate-600 border-slate-200'}`}>{label}</button>
        ))}
      </div>

      {loading && <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading campaigns" /></div>}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No campaigns in this view yet. Campaign creation happens through the backend's campaign endpoint for verified NGOs.</p>
      )}
      <div className="space-y-3">
        {filtered.map((c) => {
          const pct = c.targetAmount > 0 ? Math.min(100, Math.round(((c.raisedAmount || 0) / c.targetAmount) * 100)) : 0
          return (
            <Link key={c._id} to={`/campaign/${c._id}`} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-teal-300 block space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">{c.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2">{c.description}</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#DDE9DF] text-[#183B35] shrink-0">{c.status}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>{formatCurrency(c.raisedAmount || 0)} of {formatCurrency(c.targetAmount)}</span>
                  <span>{pct}% • {c.donors?.length || 0} donors</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#087F70]" style={{ width: `${pct}%` }} /></div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#087F70]">View campaign <ChevronRight className="w-3.5 h-3.5" /></span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
