import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import API from '@/api/axios'
import AuthRequiredState from '@/components/common/AuthRequiredState'
import { Package, Search, X, CheckCircle2, AlertCircle, Building2 } from 'lucide-react'

// Supply pledges are in-kind, never payments. The backend model is:
// SupplyRequest { title, description, category Food|Medicine|Accessories|Other,
// requiredQuantity, receivedQuantity, unit, status Open|Fulfilled,
// pledges[{ pledgedQuantity, message, status }] }.
// Pledging is POST /supplies/:id/pledge { pledgedQuantity, message } for a
// signed-in user; the backend records that user as the pledger. The old
// page showed invented requests and a pledge form asking for a donor name,
// phone, address and delivery method — none of which the backend stores —
// and reported success even when the (wrong) API call failed.
const CATEGORIES = ['All', 'Food', 'Medicine', 'Accessories', 'Other']

export default function SuppliesPage() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState('5')
  const [message, setMessage] = useState('')
  const [pledgeError, setPledgeError] = useState('')
  const [pledgeSuccess, setPledgeSuccess] = useState(false)
  const [pledging, setPledging] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.get('/supplies')
      setRequests(res.data?.data || [])
    } catch (err) {
      setError(err?.message || 'Could not load supply requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchRequests()
  }, [isAuthenticated])

  const filtered = requests.filter((r) => {
    if (activeCategory !== 'All' && r.category !== activeCategory) return false
    const q = searchQuery.trim().toLowerCase()
    if (q && !`${r.title} ${r.description}`.toLowerCase().includes(q)) return false
    return true
  })

  const handlePledge = async (e) => {
    e.preventDefault()
    const qty = Number(quantity)
    if (!Number.isFinite(qty) || qty <= 0) {
      setPledgeError('Pledged quantity must be a positive number.')
      return
    }
    setPledgeError('')
    setPledging(true)
    try {
      await API.post(`/supplies/${selected._id}/pledge`, { pledgedQuantity: qty, message: message.trim() || undefined })
      setPledgeSuccess(true)
      fetchRequests()
    } catch (err) {
      setPledgeError(err?.message || 'Pledge could not be recorded.')
    } finally {
      setPledging(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-slate-800 pb-20 md:pb-6">
      <header className="sticky top-0 z-40 bg-[#F7F5EF]/90 backdrop-blur-md border-b border-[#DDE9DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#087F70] flex items-center justify-center text-white"><Package className="w-5 h-5" /></div>
            <div>
              <span className="font-extrabold text-[#183B35] text-lg tracking-tight block leading-tight">Animal Lifeline</span>
              <span className="text-[10px] font-semibold text-[#087F70] uppercase tracking-widest block">Supply Drives</span>
            </div>
          </Link>
          <Link to="/nearby-ngos" className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-[#087F70]">Find NGOs</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#183B35]">Supply drives, in kind</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">Food, medicine and accessories that shelters actually need — pledged by you, received and marked by the NGO. No money changes hands here; for money donations, see <Link to="/donate" className="text-[#087F70] font-semibold hover:underline">Donate</Link>.</p>
        </div>

        {!isAuthenticated ? (
          <AuthRequiredState title="Sign in to see open supply requests" message="Open supply requests are listed for signed-in users, because the backend requires authentication for the supply list." />
        ) : loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading supply requests" /></div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search requests…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${activeCategory === c ? 'bg-[#087F70] text-white border-[#087F70]' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}>{c}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-slate-500 text-sm">No open supply requests match right now.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((r) => {
                  const pct = r.requiredQuantity > 0 ? Math.min(100, Math.round(((r.receivedQuantity || 0) / r.requiredQuantity) * 100)) : 0
                  return (
                    <article key={r._id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-bold text-[#183B35]">{r.title}</h2>
                        <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#DDE9DF] text-[#183B35] shrink-0">{r.category}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-3">{r.description}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Building2 size={13} /> {r.ngo?.organizationName || 'Verified NGO'}</p>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span>{r.receivedQuantity || 0} of {r.requiredQuantity} {r.unit} received</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#087F70] rounded-full" style={{ width: `${pct}%` }} /></div>
                      </div>
                      <button onClick={() => { setSelected(r); setQuantity('5'); setMessage(''); setPledgeError(''); setPledgeSuccess(false) }} className="w-full py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35] transition-colors">Pledge supplies</button>
                    </article>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setSelected(null)} />
          <form onSubmit={handlePledge} className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#183B35]">Pledge: {selected.title}</h3>
                <p className="text-xs text-slate-500">You are pledging as your signed-in account. The NGO marks the pledge Received when it arrives — that is when it counts toward the total.</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {pledgeSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-900">Pledge recorded</p>
                <p className="text-sm text-slate-600">The NGO will contact you through the platform's records and mark it Received on delivery.</p>
                <button type="button" onClick={() => setSelected(null)} className="px-4 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl">Done</button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-slate-700">Quantity ({selected.unit})
                  <input type="number" min="1" step="any" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl font-bold" />
                </label>
                <label className="block text-xs font-bold text-slate-700">Message (optional)
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Anything the NGO should know about the items" className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </label>
                {pledgeError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{pledgeError}</div>}
                <button type="submit" disabled={pledging} className="w-full py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35] disabled:opacity-50">{pledging ? 'Recording pledge…' : 'Confirm pledge'}</button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
