import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import API from '@/api/axios'
import AuthRequiredState from '@/components/common/AuthRequiredState'
import { ArrowLeft, Shield, MapPin, AlertTriangle, Building2 } from 'lucide-react'

// Public NGO profile, real only. The backend has no public NGO-by-id
// endpoint: the verified list (GET /ngo/verified, signed-in users) is
// the only source, and it deliberately excludes documents. So this page
// finds the NGO in that list; if the id is not there, the NGO is either
// not verified or does not exist — and that is what the page says,
// instead of falling back to the first invented NGO as before. Campaigns
// are the NGO's active campaigns from the authenticated campaign list
// (ngo field may be an id or a populated object). There is no animals
// list by NGO in the backend, so no animals tab is shown. The verified
// list requires sign-in, so logged-out visitors see a sign-in prompt.
export default function NGOPublicProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [ngo, setNgo] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    setLoading(true)
    Promise.all([API.get('/ngo/verified'), API.get('/donations/campaigns')])
      .then(([verified, camps]) => {
        if (cancelled) return
        const found = (verified.data?.data || []).find((n) => String(n._id) === id)
        if (!found) {
          setNotFound(true)
          return
        }
        setNgo(found)
        setCampaigns((camps.data?.data || []).filter((c) => String(c.ngo?._id || c.ngo) === id))
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Could not load this NGO.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] px-4 py-10">
        <div className="max-w-2xl mx-auto"><AuthRequiredState title="Sign in to view NGO profiles" message="The verified NGO list requires sign-in in the backend, so NGO profiles are available to signed-in users." /></div>
      </div>
    )
  }
  if (loading) return <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading NGO profile" /></div>
  if (error || notFound || !ngo) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center p-6 gap-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-900">NGO not found in the verified list</h2>
        <p className="text-slate-600 max-w-md">{error || 'This NGO is not in the verified list — it may be pending verification, rejected, or may not exist. Only verified NGOs have public profiles here.'}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#087F70] text-white rounded-lg font-medium">Go back</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDE9DF] flex items-center justify-center text-[#087F70] shrink-0"><Building2 className="w-7 h-7" /></div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#183B35]">{ngo.organizationName}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1"><Shield className="w-4 h-4 text-[#087F70]" /> Verified on Animal Lifeline</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{ngo.description}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-4 h-4" /> {[ngo.address?.city, ngo.address?.state].filter(Boolean).join(', ') || 'Location not listed'}</p>
          {(ngo.user?.phone || ngo.user?.email) && (
            <p className="text-sm text-slate-600">Contact: {ngo.user?.name || ''}{ngo.user?.phone ? ` • ${ngo.user.phone}` : ''}{ngo.user?.email ? ` • ${ngo.user.email}` : ''}</p>
          )}
          {(ngo.animalsHandled || []).length > 0 && (
            <div><h3 className="text-sm font-bold text-slate-900 mb-2">Animals handled</h3><div className="flex flex-wrap gap-1.5">{ngo.animalsHandled.map((a) => <span key={a} className="text-xs px-2 py-1 bg-slate-100 rounded-full">{a}</span>)}</div></div>
          )}
          {(ngo.servicesProvided || []).length > 0 && (
            <div><h3 className="text-sm font-bold text-slate-900 mb-2">Services</h3><div className="flex flex-wrap gap-1.5">{ngo.servicesProvided.map((s) => <span key={s} className="text-xs px-2 py-1 bg-slate-100 rounded-full">{s}</span>)}</div></div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="font-bold text-[#183B35]">Active campaigns ({campaigns.length})</h2>
          {campaigns.length === 0 ? (
            <p className="text-sm text-slate-500">This NGO has no active campaigns listed right now.</p>
          ) : (
            campaigns.map((c) => (
              <Link key={c._id} to={`/campaign/${c._id}`} className="block border rounded-xl px-4 py-3 hover:border-teal-300">
                <p className="font-bold text-slate-900">{c.title}</p>
                <p className="text-sm text-slate-500 line-clamp-2">{c.description}</p>
              </Link>
            ))
          )}
          <p className="text-xs text-slate-400">Documents are never shown on public profiles — the backend excludes them from the verified list.</p>
        </div>
      </div>
    </div>
  )
}
