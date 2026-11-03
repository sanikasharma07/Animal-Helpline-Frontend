import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import API from '@/api/axios'
import { ArrowLeft, MapPin, CheckCircle2, AlertTriangle, Shield } from 'lucide-react'

// Real rescue tracking. Backend:
//   GET /emergency/:id — reporter, assigned NGO or admin only (others 403).
//   Statuses (forward-only): Reported → Help Requested → Rescue Accepted
//     → Rescuer On The Way → Animal Picked Up → At Veterinary Facility
//     → Resolved. Forward skips are allowed, backwards moves are refused.
//   PATCH /emergency/:id/status { status } — assigned NGO only.
//   POST /emergency/:id/updates { type, message, photos? } — assigned NGO.
//   PATCH /emergency/:id/request-info, PATCH /emergency/:id/unable-to-respond.
// The old tracker invented a timeline that advanced itself every 8
// seconds, invented ETAs ("15 min away"), a rescuer phone number and a
// chat button. None of that exists in the backend: there is no live GPS,
// no ETAs, no chat and no contact sharing. Progress updates are the
// only real-time-ish signal, and they come from the assigned NGO.
const TRACKING_ORDER = ['Reported', 'Help Requested', 'Rescue Accepted', 'Rescuer On The Way', 'Animal Picked Up', 'At Veterinary Facility', 'Resolved']
const NEXT_TRACKING = { 'Rescue Accepted': 'Rescuer On The Way', 'Rescuer On The Way': 'Animal Picked Up', 'Animal Picked Up': 'At Veterinary Facility', 'At Veterinary Facility': 'Resolved' }
const UPDATE_TYPES = ['Rescue', 'Animal Picked Up', 'Veterinary Facility', 'Treatment', 'General Update']

export default function ActiveRescueTracker() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [c, setC] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [updateType, setUpdateType] = useState('General Update')
  const [updateMessage, setUpdateMessage] = useState('')
  const [posting, setPosting] = useState(false)

  const fetchCase = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.get(`/emergency/${id}`)
      setC(res.data?.data || null)
    } catch (err) {
      setError(err?.message || 'Case could not be loaded. Only the reporter, the assigned NGO or an admin can view it.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCase() }, [id])

  // The detail endpoint populates assignedNgo with organizationName only;
  // whether the caller is that NGO is proven by the backend itself: the
  // status/update endpoints refuse anyone who is not the assigned NGO.
  // So the action buttons are shown to any signed-in NGO viewing an
  // assigned case, and the backend enforces the real check.
  const showNgoActions = user?.role === 'ngo' && !!c?.assignedNgo && c.status !== 'Resolved'

  const act = async (fn) => {
    setActionError('')
    try { await fn(); fetchCase() } catch (err) { setActionError(err?.message || 'Action could not be completed.') }
  }

  const postUpdate = async (e) => {
    e.preventDefault()
    setPosting(true)
    try {
      await API.post(`/emergency/${id}/updates`, { type: updateType, message: updateMessage.trim() })
      setUpdateMessage('')
      fetchCase()
    } catch (err) {
      setActionError(err?.message || 'Update could not be posted.')
    } finally {
      setPosting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading case" /></div>
  if (error || !c) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center p-6 gap-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-semibold text-slate-800">Case not available</h2>
        <p className="text-slate-600 max-w-md">{error || 'This case does not exist.'} Emergency cases are private: only the reporter, the assigned NGO and admins can view them.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#087F70] text-white rounded-lg shadow font-medium">Go back</button>
      </div>
    )
  }

  const currentIndex = TRACKING_ORDER.indexOf(c.status)

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-wrap justify-between gap-2">
            <h1 className="font-display text-2xl font-bold text-[#183B35]">{c.animalInfo?.species || 'Animal'} emergency</h1>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#DDE9DF] text-[#183B35] self-start">{c.status}</span>
          </div>
          <p className="text-sm text-slate-600">{c.animalInfo?.quickDescription || c.quickDescription || ''}</p>
          {c.location?.coordinates && <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-4 h-4" /> Location: {c.location.coordinates[1]}, {c.location.coordinates[0]}</p>}
          <p className="text-xs text-slate-500 flex items-center gap-1"><Shield className="w-4 h-4 text-[#087F70]" /> Assigned NGO: {c.assignedNgo?.organizationName || 'Not yet assigned — a verified NGO can accept this case.'}</p>
          {c.aiCare && (
            <div className="bg-[#F7F5EF] border border-[#DDE9DF] rounded-xl p-4">
              <p className="text-xs font-bold text-[#183B35] mb-1">First-aid guidance (rule-based, not a diagnosis)</p>
              <p className="text-sm text-slate-600">{c.aiCare}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-[#183B35] mb-4">Rescue progress</h2>
          <p className="text-xs text-slate-500 mb-4">Status moves forward only, as the assigned NGO updates it. There are no ETAs or live locations in this system — updates below are the record.</p>
          <ol className="space-y-4">
            {TRACKING_ORDER.map((status, i) => {
              const done = i < currentIndex
              const current = i === currentIndex
              return (
                <li key={status} className="flex gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done || current ? 'bg-[#087F70] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {done || current ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-slate-300" />}
                  </span>
                  <span className={`text-sm ${current ? 'font-bold text-slate-900' : done ? 'text-slate-700' : 'text-slate-400'}`}>{status}{current ? ' — current' : ''}</span>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h2 className="font-bold text-[#183B35]">Progress updates</h2>
          {(!c.updates || c.updates.length === 0) ? (
            <p className="text-sm text-slate-500">No progress updates yet. The assigned NGO posts updates here as the rescue proceeds.</p>
          ) : (
            <ul className="space-y-3">
              {[...c.updates].reverse().map((u, i) => (
                <li key={i} className="border-b border-slate-100 last:border-0 pb-3">
                  <p className="text-sm font-bold text-slate-900">{u.type} <span className="font-normal text-slate-500">• {u.ngo?.organizationName || 'Assigned NGO'}</span></p>
                  <p className="text-sm text-slate-600">{u.message}</p>
                  {u.photos?.length > 0 && <div className="flex gap-2 mt-2">{u.photos.map((ph, j) => <img key={j} src={ph} alt="Progress update" className="w-20 h-20 object-cover rounded-lg" />)}</div>}
                  <p className="text-[11px] text-slate-400 mt-1">{u.createdAt ? new Date(u.createdAt).toLocaleString() : ''}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showNgoActions && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-[#183B35]">NGO actions</h2>
            <p className="text-xs text-slate-500">These actions are enforced by the backend: only the assigned NGO can use them. If you are not that NGO, the backend refuses with an error shown below.</p>
            {actionError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{actionError}</div>}
            {NEXT_TRACKING[c.status] && (
              <button onClick={() => act(() => API.patch(`/emergency/${id}/status`, { status: NEXT_TRACKING[c.status] }))} className="w-full py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35]">Advance status to {NEXT_TRACKING[c.status]}</button>
            )}
            <div className="flex gap-2">
              <button onClick={() => act(() => API.patch(`/emergency/${id}/request-info`))} className="flex-1 py-2.5 bg-white border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50">Request more info from reporter</button>
              <button onClick={() => act(() => API.patch(`/emergency/${id}/unable-to-respond`))} className="flex-1 py-2.5 bg-white border border-rose-200 text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-50">Unable to respond (release case)</button>
            </div>
            <form onSubmit={postUpdate} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">Post a progress update
                <select value={updateType} onChange={(e) => setUpdateType(e.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm">
                  {UPDATE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <textarea required value={updateMessage} onChange={(e) => setUpdateMessage(e.target.value)} rows={3} placeholder="What happened?" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              <button type="submit" disabled={posting} className="w-full py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl disabled:opacity-50">{posting ? 'Posting…' : 'Post update'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
