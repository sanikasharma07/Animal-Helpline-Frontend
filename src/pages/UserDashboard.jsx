import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { openSOSModal } from '@/store/slices/emergencySlice'
import EmergencySOSModal from '@/components/emergency/EmergencySOSModal'
import API from '@/api/axios'
import NotificationsPanel from '@/components/common/NotificationsPanel'
import { Siren, Heart, Package, Home, Users, MapPin, ShieldCheck, AlertTriangle } from 'lucide-react'

// Personal dashboard, real only:
//   GET /users/impact-profile → { lifetimeStats: { rescuesReported,
//     suppliesDonated, campaignsFunded, volunteerHours }, timeline[] }
//   GET /emergency/my → the caller's own emergency cases.
// The old page showed an invented city total ("1,248 rescued, +18 today"),
// a generated avatar photo for the user, a permanently lit notification
// dot, and a feed of invented campaigns. All four are removed.
export default function UserDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [impact, setImpact] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [myCases, setMyCases] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [impactRes, casesRes] = await Promise.all([
          API.get('/users/impact-profile'),
          API.get('/emergency/my'),
        ])
        if (!cancelled) {
          setImpact(impactRes.data?.data?.lifetimeStats || null)
          setTimeline(impactRes.data?.data?.timeline || [])
          setMyCases(casesRes.data?.data || [])
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Could not load your dashboard.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  const initials = (user?.name || 'A').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const quickActions = [
    { title: 'Adopt / Foster', desc: 'Give a rescued animal a loving temporary or forever home.', icon: Home, link: '/foster' },
    { title: 'Volunteer', desc: 'Join open opportunities posted by verified NGOs.', icon: Users, link: '/volunteer' },
    { title: 'Donate Supplies', desc: 'Pledge food, medicines and accessories shelters need.', icon: Package, link: '/supplies' },
    { title: 'Fund a Rescue', desc: 'Support campaigns by verified NGOs, verified by Razorpay.', icon: Heart, link: '/donate' },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col pb-24 md:pb-12">
      <header className="bg-white sticky top-0 z-30 border-b border-[#DDE9DF] px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#087F70] flex items-center justify-center text-white font-bold shrink-0" aria-hidden="true">{initials}</div>
          <div>
            <h1 className="font-bold text-[#183B35] leading-tight text-base sm:text-lg">Hi, {user?.name || 'friend'}</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#087F70]" /> Animal Lifeline community</p>
          </div>
        </div>
        <Link to="/nearby-ngos" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#087F70] bg-[#DDE9DF] px-3.5 py-2 rounded-xl hover:bg-teal-100 transition-colors shrink-0">
          <MapPin className="w-4 h-4" /> Nearby Help
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6 flex flex-col">
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}

        {/* Impact — bento row, real counters only */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Your impact">
          {[
            ['Emergencies reported', impact?.rescuesReported ?? '—'],
            ['Supply pledges received', impact?.suppliesDonated ?? '—'],
            ['Campaigns funded', impact?.campaignsFunded ?? '—'],
            ['Volunteer hours', impact?.volunteerHours ?? '—'],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-2xl font-black text-[#183B35]">{loading ? '…' : value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </section>
        <p className="text-xs text-slate-400 -mt-3">Counts come from your own activity: emergencies you reported, pledges an NGO marked Received, campaigns you funded, and hours from completed volunteer work.</p>

        {/* Emergency reporting — honest copy */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E7A18A]/60 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#E7A18A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-lg z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#183B35]">See an animal in danger?</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Report it with its location and, if you can, a photo. Reporting creates a case that a verified NGO can accept — it does not dispatch anyone automatically, and no NGO is notified until it picks up the case.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(openSOSModal())}
            className="w-full max-w-md py-5 px-8 bg-[#C96A4A] hover:bg-[#183B35] active:scale-95 text-white font-black text-xl rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all z-10 cursor-pointer"
          >
            <Siren className="w-7 h-7 shrink-0" />
            <span>Report Emergency</span>
          </button>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-[#183B35] px-1">How do you want to help?</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} to={action.link} className="bg-white hover:bg-[#DDE9DF]/60 border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow transition-all flex flex-col gap-3 text-left group">
                  <div className="p-3 rounded-xl bg-[#DDE9DF] text-[#087F70] self-start"><Icon className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-[#183B35] text-base mb-1">{action.title}</h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{action.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-[#183B35]">My emergency cases</h3>
            <Link to="/nearby-ngos" className="text-xs font-bold text-[#087F70] hover:underline">Nearby Help</Link>
          </div>
          {myCases.length === 0 ? (
            <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">You have not reported an emergency yet. When you do, its status and updates appear here.</p>
          ) : (
            <div className="space-y-2">
              {myCases.map((c) => (
                <Link key={c._id} to={`/tracker/${c._id}`} className="bg-white border rounded-xl px-4 py-3 flex flex-wrap justify-between gap-2 hover:border-teal-300">
                  <span className="text-sm font-semibold text-slate-800">{c.animalInfo?.species || 'Animal'} — {c.animalInfo?.quickDescription || c.quickDescription || 'Emergency case'}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#DDE9DF] text-[#183B35]">{c.status}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <NotificationsPanel />

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-[#183B35] px-1">My activity</h3>
          {timeline.length === 0 ? (
            <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No activity yet — your reports, received pledges and donations will be listed here as they happen.</p>
          ) : (
            <ul className="space-y-2">
              {timeline.slice(0, 10).map((t, i) => (
                <li key={i} className="bg-white border rounded-xl px-4 py-3 flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-semibold text-slate-800">{t.title}</span>
                  <span className="text-xs text-slate-500">{t.ngoName}{t.date ? ` • ${new Date(t.date).toLocaleDateString()}` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <EmergencySOSModal />
    </div>
  )
}
