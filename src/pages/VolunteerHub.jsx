import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import API from '@/api/axios'
import AuthRequiredState from '@/components/common/AuthRequiredState'
import { Users, Search, X, CheckCircle2, AlertCircle, Building2, Heart } from 'lucide-react'

// Volunteer board is real only. Backend:
//   GET /volunteer — Open opportunities (general + emergency-linked),
//     ?linked=general|emergency filter; requires sign-in.
//   POST /volunteer/:id/apply { message, experience } — signed-in user;
//     an NGO cannot apply to its own opportunity.
//   POST /volunteer — verified NGOs only, { title, description,
//     volunteersNeeded, optional lng/lat }.
//   GET /volunteer/my-applications — the caller's applications.
//   GET /volunteer/heroes — stories; posting is gated by the backend to
//     users with an Approved or Completed application (403 otherwise).
// The old page listed invented opportunities and reported a successful
// sign-up even when its (wrong-shaped) API call failed.

export default function VolunteerHub() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const isNgo = user?.role === 'ngo'
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [linkedFilter, setLinkedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [myApplications, setMyApplications] = useState([])
  const [selected, setSelected] = useState(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [applyExperience, setApplyExperience] = useState('')
  const [applyError, setApplyError] = useState('')
  const [applySuccess, setApplySuccess] = useState(false)
  const [applying, setApplying] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ title: '', description: '', volunteersNeeded: '1' })
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)
  const [stories, setStories] = useState([])
  const [storyForm, setStoryForm] = useState({ title: '', story: '' })
  const [storyError, setStoryError] = useState('')
  const [storySuccess, setStorySuccess] = useState(false)

  const fetchBoard = async () => {
    setLoading(true)
    setError('')
    try {
      const params = linkedFilter !== 'all' ? { linked: linkedFilter } : {}
      const res = await API.get('/volunteer', { params })
      setOpportunities(res.data?.data || [])
    } catch (err) {
      setError(err?.message || 'Could not load volunteer opportunities.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMine = async () => {
    try {
      const res = await API.get('/volunteer/my-applications')
      setMyApplications(res.data?.data || [])
    } catch { /* applications list is secondary; board still works */ }
    try {
      const res = await API.get('/volunteer/heroes')
      setStories(res.data?.data || [])
    } catch { /* stories are secondary */ }
  }

  useEffect(() => {
    if (isAuthenticated) { fetchBoard(); fetchMine() }
  }, [isAuthenticated, linkedFilter])

  const filtered = opportunities.filter((o) => {
    const q = searchQuery.trim().toLowerCase()
    return !q || `${o.title} ${o.description}`.toLowerCase().includes(q)
  })
  const appliedIds = new Set(myApplications.map((a) => String(a.opportunity?._id || a.opportunity)))

  const handleApply = async (e) => {
    e.preventDefault()
    setApplyError('')
    setApplying(true)
    try {
      await API.post(`/volunteer/${selected._id}/apply`, { message: applyMessage.trim() || undefined, experience: applyExperience.trim() || undefined })
      setApplySuccess(true)
      fetchMine()
    } catch (err) {
      setApplyError(err?.message || 'Application could not be submitted.')
    } finally {
      setApplying(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      await API.post('/volunteer', {
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        volunteersNeeded: Number(createForm.volunteersNeeded),
      })
      setShowCreate(false)
      setCreateForm({ title: '', description: '', volunteersNeeded: '1' })
      fetchBoard()
    } catch (err) {
      setCreateError(err?.message || 'Opportunity could not be created. Only verified NGOs can post opportunities.')
    } finally {
      setCreating(false)
    }
  }

  const handleStory = async (e) => {
    e.preventDefault()
    setStoryError('')
    try {
      await API.post('/volunteer/heroes', { title: storyForm.title.trim(), story: storyForm.story.trim() })
      setStorySuccess(true)
      setStoryForm({ title: '', story: '' })
      fetchMine()
    } catch (err) {
      setStoryError(err?.message || 'Story could not be posted. Only volunteers with an approved or completed application can post a story.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-slate-800 pb-20 md:pb-6">
      <header className="sticky top-0 z-40 bg-[#F7F5EF]/90 backdrop-blur-md border-b border-[#DDE9DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#087F70] flex items-center justify-center text-white"><Users className="w-5 h-5" /></div>
            <div>
              <span className="font-extrabold text-[#183B35] text-lg tracking-tight block leading-tight">Animal Lifeline</span>
              <span className="text-[10px] font-semibold text-[#087F70] uppercase tracking-widest block">Volunteer Hub</span>
            </div>
          </Link>
          <Link to="/nearby-ngos" className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-[#087F70]">Find NGOs</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#183B35]">Volunteer with verified NGOs</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">Open opportunities posted by verified NGOs, plus stories from volunteers who completed work. Applying, closing and approval are handled by the NGO — this page shows their real decisions, not placeholders.</p>
          </div>
          {isNgo && (
            <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35]">Post an opportunity</button>
          )}
        </div>

        {isNgo && showCreate && (
          <form onSubmit={handleCreate} className="bg-white border rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-[#183B35]">New general opportunity</h2>
            <p className="text-xs text-slate-500">Only verified NGOs can post. If your NGO is still pending verification, the backend will refuse this with a clear error.</p>
            <label className="block text-xs font-bold text-slate-700">Title
              <input required value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </label>
            <label className="block text-xs font-bold text-slate-700">Description
              <textarea required value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} rows={3} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </label>
            <label className="block text-xs font-bold text-slate-700">Volunteers needed
              <input type="number" min="1" required value={createForm.volunteersNeeded} onChange={(e) => setCreateForm({ ...createForm, volunteersNeeded: e.target.value })} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </label>
            {createError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{createError}</div>}
            <button type="submit" disabled={creating} className="px-4 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl disabled:opacity-50">{creating ? 'Posting…' : 'Post opportunity'}</button>
          </form>
        )}

        {!isAuthenticated ? (
          <AuthRequiredState title="Sign in to see volunteer opportunities" message="The volunteer board is listed for signed-in users, because the backend requires authentication for it." />
        ) : loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading opportunities" /></div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search opportunities…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-2">
                {[['all', 'All'], ['general', 'General'], ['emergency', 'Emergency-linked']].map(([v, label]) => (
                  <button key={v} onClick={() => setLinkedFilter(v)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${linkedFilter === v ? 'bg-[#087F70] text-white border-[#087F70]' : 'bg-white text-slate-600 border-slate-200'}`}>{label}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-slate-500 text-sm">No open volunteer opportunities match right now.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((o) => (
                  <article key={o._id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-bold text-[#183B35]">{o.title}</h2>
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#DDE9DF] text-[#183B35] shrink-0">{o.linkedEmergency ? 'Emergency-linked' : 'General'}</span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3">{o.description}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Building2 size={13} /> {o.ngo?.organizationName || 'Verified NGO'} • {o.volunteersNeeded || 1} needed</p>
                    {appliedIds.has(String(o._id)) ? (
                      <p className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">You have applied — the NGO's decision will appear in your applications.</p>
                    ) : (
                      <button onClick={() => { setSelected(o); setApplyMessage(''); setApplyExperience(''); setApplyError(''); setApplySuccess(false) }} className="w-full py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35]">Apply</button>
                    )}
                  </article>
                ))}
              </div>
            )}

            {myApplications.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-bold text-[#183B35]">My applications</h2>
                <div className="space-y-2">
                  {myApplications.map((a) => (
                    <div key={a._id} className="bg-white border rounded-xl px-4 py-3 flex flex-wrap justify-between gap-2 text-sm">
                      <span className="font-semibold text-slate-800">{a.opportunity?.title || 'Opportunity'}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700">{a.status}{a.hoursContributed ? ` • ${a.hoursContributed} hrs` : ''}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section className="space-y-4">
          <h2 className="font-bold text-[#183B35] flex items-center gap-2"><Heart className="w-5 h-5 text-[#087F70]" /> Our Heroes — volunteer stories</h2>
          {stories.length === 0 ? (
            <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No stories yet. Stories are written by volunteers after an approved or completed application.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {stories.map((st) => (
                <article key={st._id} className="bg-white border rounded-2xl p-5 space-y-2">
                  <h3 className="font-bold text-[#183B35]">{st.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-4">{st.story}</p>
                  <p className="text-xs text-slate-500">{st.volunteer?.name || 'Volunteer'}{st.ngo?.organizationName ? ` • ${st.ngo.organizationName}` : ''}</p>
                </article>
              ))}
            </div>
          )}
          {isAuthenticated && (
            <form onSubmit={handleStory} className="bg-white border rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm text-[#183B35]">Share your story</h3>
              <p className="text-xs text-slate-500">The backend only allows this if you have an approved or completed application; otherwise it returns an error, which is shown below rather than a fake success.</p>
              <input required value={storyForm.title} onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })} placeholder="Story title" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              <textarea required value={storyForm.story} onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })} rows={3} placeholder="What happened, in your words" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              {storyError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{storyError}</div>}
              {storySuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-3 flex gap-2"><CheckCircle2 className="w-4 h-4" />Story posted.</div>}
              <button type="submit" className="px-4 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl">Post story</button>
            </form>
          )}
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setSelected(null)} />
          <form onSubmit={handleApply} className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#183B35]">Apply: {selected.title}</h3>
                <p className="text-xs text-slate-500">{selected.ngo?.organizationName || 'Verified NGO'}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {applySuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-900">Application submitted</p>
                <p className="text-sm text-slate-600">The NGO will approve or reject it; you will see the decision in My applications.</p>
                <button type="button" onClick={() => setSelected(null)} className="px-4 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl">Done</button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-slate-700">Message (optional)
                  <textarea value={applyMessage} onChange={(e) => setApplyMessage(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </label>
                <label className="block text-xs font-bold text-slate-700">Experience (optional)
                  <textarea value={applyExperience} onChange={(e) => setApplyExperience(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </label>
                {applyError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{applyError}</div>}
                <button type="submit" disabled={applying} className="w-full py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl disabled:opacity-50">{applying ? 'Submitting…' : 'Submit application'}</button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
