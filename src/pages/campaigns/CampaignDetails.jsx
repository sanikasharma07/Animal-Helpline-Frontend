import React, { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { useParams, useNavigate, Link } from 'react-router'
import { useSelector } from 'react-redux'
import API from '@/api/axios'
import AuthRequiredState from '@/components/common/AuthRequiredState'
import { ArrowLeft, Heart, Shield, TrendingUp, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react'

// Campaign detail is real only. Backend:
//   GET /donations/campaigns/:id — signed-in users; donors are hidden in
//   this response (-donors), NGO is populated (organizationName only).
//   Status is Active | Goal Reached | Closed. There is no deadline, so
//   the old "Days Left: 14" was invented, as were the donor counts, the
//   80G claim and the fallback to the first invented campaign for any id.
//   campaign.impact (photos + message) is shown when the NGO has posted it.
// Donating happens on the Donate page, where the Razorpay order + verify
// flow lives; this page links there instead of pretending to take payment.
export default function CampaignDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    const fetchCampaign = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await API.get(`/donations/campaigns/${id}`)
        if (!cancelled) setCampaign(res.data?.data || null)
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Campaign could not be loaded.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchCampaign()
    return () => { cancelled = true }
  }, [id, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] px-4 py-10">
        <div className="max-w-2xl mx-auto"><AuthRequiredState title="Sign in to view this campaign" message="Campaign details are available to signed-in users, because the backend requires authentication for the campaign detail endpoint." /></div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading campaign" /></div>
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">{error || 'Campaign not found'}</h2>
          <p className="text-sm text-slate-500">Unknown campaign ids no longer fall back to an invented campaign.</p>
          <button onClick={() => navigate(-1)} className="text-teal-600 font-semibold hover:underline">← Go back</button>
        </div>
      </div>
    )
  }

  const percent = campaign.targetAmount > 0 ? Math.min(100, Math.round(((campaign.raisedAmount || 0) / campaign.targetAmount) * 100)) : 0
  const remaining = Math.max(0, (campaign.targetAmount || 0) - (campaign.raisedAmount || 0))

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#087F70] text-white">
            {campaign.status === 'Goal Reached' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />}
            {campaign.status}
          </span>
          <h1 className="font-display text-3xl font-bold text-[#183B35] leading-tight mt-3">{campaign.title}</h1>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DDE9DF] flex items-center justify-center shrink-0"><Building2 className="w-6 h-6 text-[#087F70]" /></div>
          <div>
            <p className="font-bold text-slate-900">{campaign.ngo?.organizationName || 'Verified NGO'}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-600" /> Campaigns are published by verified NGOs only.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-2">About this campaign</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{campaign.description}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-slate-900">{formatCurrency(campaign.raisedAmount || 0)}</p>
              <p className="text-xs text-slate-500 mt-0.5">raised of {formatCurrency(campaign.targetAmount)} goal</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#087F70]">{percent}%</p>
              <p className="text-xs text-slate-500">funded</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div className="h-full rounded-full bg-[#087F70]" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-sm text-slate-600 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#087F70]" /> {formatCurrency(remaining)} still needed. Donor identities are not shown on this page — the backend hides the donor list here.</p>
          {campaign.status === 'Active' ? (
            <Link to="/donate" className="w-full py-4 bg-[#087F70] hover:bg-[#183B35] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 fill-current" /> Donate to this campaign
            </Link>
          ) : (
            <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">This campaign is no longer accepting donations.</p>
          )}
          <p className="text-xs text-slate-400 text-center">Donating on the Donate page uses Razorpay and is verified by the backend before it is recorded.</p>
        </div>

        {campaign.impact && (campaign.impact.message || campaign.impact.photos?.length > 0) && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900">Impact update from the NGO</h2>
            {campaign.impact.message && <p className="text-sm text-slate-600 leading-relaxed">{campaign.impact.message}</p>}
            {campaign.impact.photos?.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {campaign.impact.photos.map((photo, i) => (
                  <img key={i} src={photo} alt="Campaign impact" className="w-full h-40 object-cover rounded-xl" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
