import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Link, Outlet, useLocation } from 'react-router'
import { ADMIN_NAV_ITEMS } from '@/lib/constants'
import API from '@/api/axios'
import { ShieldCheck, LayoutDashboard, Users, AlertTriangle, FileText, Menu, X, ChevronRight, Flag, Building } from 'lucide-react'

// Admin shell, real only. The old shell rendered sidebar icons from
// string names (so no icons appeared) and linked to /admin/ngos and
// /admin/settings, which have no route. The old overview showed invented
// totals, an invented "orphaned emergencies" alert and invented recent
// activity. The overview now counts real queues and lists the real
// AdminAction audit history (immutable, newest first).
const ICONS = { LayoutDashboard, ShieldCheck, Users, AlertTriangle, FileText, Flag, Building }

function AdminNav({ onNavigate, dark }) {
  const location = useLocation()
  return (
    <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)
        const Icon = ICONS[item.icon] || FileText
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
              dark
                ? (isActive ? "bg-teal-500/10 text-teal-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white")
                : (isActive ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-600 hover:bg-slate-50")
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const isIndex = location.pathname === '/admin' || location.pathname === '/admin/'

  return (
    <div className="flex h-screen bg-[#F7F5EF] overflow-hidden text-slate-900">
      {mobileSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-full shadow-2xl transition-transform duration-300 md:hidden", mobileSidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-between">
          <div className="flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-teal-400 shrink-0" /><span className="font-bold text-lg">Admin Panel</span></div>
          <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400" aria-label="Close sidebar"><X className="h-5 w-5" /></button>
        </div>
        <AdminNav dark onNavigate={() => setMobileSidebarOpen(false)} />
      </aside>
      <aside className="hidden md:flex bg-slate-900 text-white flex-col h-full shrink-0 shadow-xl w-64">
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <ShieldCheck className="h-8 w-8 text-teal-400 shrink-0" />
          <span className="font-bold text-lg ml-3">Admin Panel</span>
        </div>
        <AdminNav dark />
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500" onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">Admin Panel</h1>
          </div>
          <Link to="/admin/reports" className="text-xs font-bold text-teal-700 hover:underline">Reports &amp; moderation →</Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isIndex ? <DashboardHome /> : <Outlet />}
        </main>
      </div>
    </div>
  )
}

function DashboardHome() {
  const [counts, setCounts] = useState({ pendingNgos: 0, pendingVets: 0, pendingReports: 0, users: 0, emergencies: 0, campaigns: 0 })
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      API.get('/admin/ngo/pending'),
      API.get('/admin/vet/pending'),
      API.get('/admin/reports', { params: { status: 'Pending' } }),
      API.get('/admin/users'),
      API.get('/admin/emergencies'),
      API.get('/admin/campaigns'),
      API.get('/admin/actions'),
    ])
      .then(([ngos, vets, reports, users, emergencies, campaigns, act]) => {
        if (cancelled) return
        setCounts({
          pendingNgos: (ngos.data?.data || []).length,
          pendingVets: (vets.data?.data || []).length,
          pendingReports: (reports.data?.data || []).length,
          users: (users.data?.data || []).length,
          emergencies: (emergencies.data?.data || []).length,
          campaigns: (campaigns.data?.data || []).length,
        })
        setActions(act.data?.data || [])
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Could not load admin overview.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const cards = [
    ['NGOs pending verification', counts.pendingNgos, '/admin/verifications'],
    ['Vets pending verification', counts.pendingVets, '/admin/verifications'],
    ['Reports pending', counts.pendingReports, '/admin/reports'],
    ['Users', counts.users, '/admin/users'],
    ['Emergency cases', counts.emergencies, '/admin/emergencies'],
    ['Campaigns', counts.campaigns, '/admin/campaigns'],
  ]

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Information-dense admin overview, by design not decorative. Every number below is a live count from the backend; moderation actions are reversible and recorded in the audit history.</p>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(([label, value, to]) => (
          <Link key={label} to={to} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:border-teal-300">
            <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '…' : value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Admin action audit history</h3>
          <span className="text-xs text-slate-400">Immutable — reversals are recorded as new entries, never overwrites</span>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          {actions.length === 0 ? (
            <p className="text-sm text-slate-500">No admin actions recorded yet.</p>
          ) : (
            actions.slice(0, 20).map((a) => (
              <div key={a._id} className="text-sm">
                <p className="font-semibold text-slate-900">{a.actionType} <span className="font-normal text-slate-500">on {a.targetType}</span></p>
                <p className="text-slate-600">{a.reason}</p>
                <p className="text-xs text-slate-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}{a.admin?.name ? ` • by ${a.admin.name}` : ''}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
