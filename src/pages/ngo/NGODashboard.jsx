import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { cn } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/slices/authSlice'
import API from '@/api/axios'
import NotificationsPanel from '@/components/common/NotificationsPanel'
import { LayoutDashboard, FileText, Settings, Building, Shield, CheckCircle2, Users, Package, ChevronRight, Menu, X, MapPin, Siren, Activity, LogOut, AlertTriangle } from 'lucide-react'

// NGO operational dashboard, real only:
//   GET /ngo/profile — own profile + verificationStatus (shown honestly,
//     not always "Verified").
//   GET /emergency/open — Reported/Help Requested cases this NGO has not
//     declined; PATCH /emergency/:id/accept accepts one (verified NGOs only).
//   GET /emergency/assigned — cases assigned to this NGO; PATCH
//     /emergency/:id/status advances forward-only.
//   GET /supplies/mine — own supply requests.
// The old dashboard showed a fake "Live Dispatch Map" with pins at fixed
// screen positions, invented metrics (12 pending adoptions, 8 open supply
// requests), an "active" toggle with no backend meaning, and an accept
// button that only changed local Redux state. All of that is removed.
const TRACKING_ORDER = ['Reported', 'Help Requested', 'Rescue Accepted', 'Rescuer On The Way', 'Animal Picked Up', 'At Veterinary Facility', 'Resolved']
const NEXT_TRACKING = { 'Rescue Accepted': 'Rescuer On The Way', 'Rescuer On The Way': 'Animal Picked Up', 'Animal Picked Up': 'At Veterinary Facility', 'At Veterinary Facility': 'Resolved' }

const NGODashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isRoot = location.pathname === '/ngo/dashboard' || location.pathname === '/ngo/dashboard/'

  const [profile, setProfile] = useState(null)
  const [openCases, setOpenCases] = useState([])
  const [assignedCases, setAssignedCases] = useState([])
  const [mySupplies, setMySupplies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [prof, open, assigned, supplies] = await Promise.all([
        API.get('/ngo/profile').catch(() => null),
        API.get('/emergency/open'),
        API.get('/emergency/assigned'),
        API.get('/supplies/mine').catch(() => ({ data: { data: [] } })),
      ])
      setProfile(prof?.data?.data || null)
      setOpenCases(open.data?.data || [])
      setAssignedCases(assigned.data?.data || [])
      setMySupplies(supplies.data?.data || [])
    } catch (err) {
      setError(err?.message || 'Could not load NGO dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isRoot) fetchAll() }, [isRoot])

  const handleAccept = async (id) => {
    setActionError('')
    try {
      await API.patch(`/emergency/${id}/accept`)
      fetchAll()
    } catch (err) {
      setActionError(err?.message || 'Case could not be accepted.')
    }
  }

  const handleAdvance = async (c) => {
    const next = NEXT_TRACKING[c.status]
    if (!next) return
    setActionError('')
    try {
      await API.patch(`/emergency/${c._id}/status`, { status: next })
      fetchAll()
    } catch (err) {
      setActionError(err?.message || 'Status could not be updated.')
    }
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const navLinks = [
    { name: 'Overview', path: '/ngo/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/ngo/dashboard/profile', icon: Building },
    { name: 'Campaigns', path: '/ngo/dashboard/campaigns', icon: Activity },
    { name: 'Documents', path: '/ngo/dashboard/documents', icon: FileText },
    { name: 'Settings', path: '/ngo/dashboard/settings', icon: Settings },
  ]

  const sidebar = (onNavigate) => (
    <>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-[#DDE9DF] rounded-xl flex items-center justify-center text-[#087F70] shrink-0"><Shield className="w-6 h-6" /></div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-800 leading-tight truncate">{profile?.organizationName || 'Animal Lifeline'}</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{profile?.verificationStatus ? `NGO • ${profile.verificationStatus}` : 'NGO dashboard'}</p>
          </div>
        </div>
        {onNavigate && <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X className="w-5 h-5" /></button>}
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const active = location.pathname === link.path || (link.path === '/ngo/dashboard' && isRoot)
          return (
            <Link key={link.name} to={link.path} onClick={onNavigate} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors", active ? "bg-[#DDE9DF] text-[#183B35]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <link.icon className={cn("w-5 h-5", active ? "text-[#087F70]" : "text-slate-400")} />
              {link.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 w-full transition-colors">
          <LogOut className="w-5 h-5" /> Log out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden md:flex bg-[#F7F5EF] text-slate-900">
      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-xl transition-transform duration-300 md:hidden", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        {sidebar(() => setSidebarOpen(false))}
      </aside>
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 h-full flex-col sticky left-0 top-0 shrink-0">
        {sidebar(null)}
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu className="w-5 h-5" /></button>
            <h1 className="font-display font-bold text-lg text-[#183B35]">NGO Dashboard</h1>
          </div>
          <Link to="/nearby-ngos" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#087F70] hover:underline"><MapPin className="w-4 h-4" /> Nearby Help</Link>
        </header>

        <div className="flex-1 overflow-y-auto">
          {isRoot ? (
            <div className="pb-8 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-6">
                {[
                  ['Open cases', openCases.length, Siren],
                  ['Assigned to you', assignedCases.length, Activity],
                  ['Resolved by you', assignedCases.filter((c) => c.status === 'Resolved').length, CheckCircle2],
                  ['Your supply requests', mySupplies.length, Package],
                ].map(([title, value, Icon]) => (
                  <div key={title} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#DDE9DF] flex items-center justify-center text-[#087F70] shrink-0"><Icon className="w-5 h-5" /></div>
                    <div><p className="text-xs font-medium text-slate-500">{title}</p><p className="text-xl font-bold text-slate-900">{loading ? '…' : value}</p></div>
                  </div>
                ))}
              </div>

              {error && <div className="mx-4 sm:mx-6 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
              {actionError && <div className="mx-4 sm:mx-6 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{actionError}</div>}

              {profile && profile.verificationStatus !== 'verified' && (
                <div className="mx-4 sm:mx-6 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4">
                  Your NGO profile is <strong>{profile.verificationStatus}</strong>. Only verified NGOs can accept emergencies, post campaigns and opportunities. Complete your profile and documents, then wait for admin review.
                </div>
              )}

              <div className="px-4 sm:px-6 grid gap-6 lg:grid-cols-2">
                <section className="space-y-3">
                  <h2 className="font-bold text-[#183B35] flex items-center gap-2"><Siren className="w-5 h-5 text-[#C96A4A]" /> Open cases you can accept</h2>
                  {openCases.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No open cases right now. Cases you declined are hidden from this list, as the backend records them in declinedBy.</p>
                  ) : (
                    openCases.map((c) => (
                      <article key={c._id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                        <div className="flex justify-between gap-3">
                          <p className="font-bold text-slate-900">{c.animalInfo?.species || 'Animal'}</p>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#DDE9DF] text-[#183B35] shrink-0">{c.status}</span>
                        </div>
                        <p className="text-sm text-slate-600">{c.animalInfo?.quickDescription || c.quickDescription || ''}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleAccept(c._id)} className="flex-1 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35] flex items-center justify-center gap-1">Accept rescue <ChevronRight className="w-4 h-4" /></button>
                          <Link to={`/tracker/${c._id}`} className="px-4 py-2.5 bg-white border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50">Details</Link>
                        </div>
                      </article>
                    ))
                  )}
                </section>

                <section className="space-y-3">
                  <h2 className="font-bold text-[#183B35] flex items-center gap-2"><Users className="w-5 h-5 text-[#087F70]" /> Assigned to you</h2>
                  {assignedCases.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No cases assigned to you yet. Accept an open case to see it here and advance its status.</p>
                  ) : (
                    assignedCases.map((c) => (
                      <article key={c._id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                        <div className="flex justify-between gap-3">
                          <p className="font-bold text-slate-900">{c.animalInfo?.species || 'Animal'}</p>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#DDE9DF] text-[#183B35] shrink-0">{c.status}</span>
                        </div>
                        <p className="text-sm text-slate-600">{c.animalInfo?.quickDescription || c.quickDescription || ''}</p>
                        <p className="text-xs text-slate-500">Tracking order: {TRACKING_ORDER.slice(TRACKING_ORDER.indexOf(c.status)).join(' → ')}</p>
                        <div className="flex gap-2">
                          {NEXT_TRACKING[c.status] && (
                            <button onClick={() => handleAdvance(c)} className="flex-1 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35]">Mark: {NEXT_TRACKING[c.status]}</button>
                          )}
                          <Link to={`/tracker/${c._id}`} className="px-4 py-2.5 bg-white border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50">Track &amp; update</Link>
                        </div>
                      </article>
                    ))
                  )}
                </section>
              </div>

              <div className="px-4 sm:px-6"><NotificationsPanel /></div>
            </div>
          ) : (
            <div className="h-full"><Outlet /></div>
          )}
        </div>
      </main>
    </div>
  )
}

export default NGODashboard
