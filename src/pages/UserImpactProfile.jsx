import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import API from '@/api/axios'
import {
  Shield, Heart, Package, Users, Siren,
  CheckCircle2, ChevronLeft, PawPrint, Calendar, Loader2, AlertCircle
} from 'lucide-react'

// ── Animated Counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, duration = 1000 }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      setCount(Math.floor(target * percentage))
      if (percentage < 1) requestAnimationFrame(animate)
    }
    const req = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(req)
  }, [target, duration])
  return <>{count}</>
}

// ── Static fallback timeline when backend is offline ────────────────────────
const FALLBACK_TIMELINE = [
  { type: 'Emergency', date: 'Sep 13, 2026', title: 'Reported Injured Dog', ngoName: 'Local Animal Rescue', status: 'Resolved', color: 'bg-rose-500', pill: 'Emergency', pillColor: 'bg-rose-100 text-rose-700' },
  { type: 'Supply', date: 'Sep 10, 2026', title: 'Donated 5kg Dog Food', ngoName: 'Prani Seva Sansthan', color: 'bg-blue-500', pill: 'Supply Drop', pillColor: 'bg-blue-100 text-blue-700' },
  { type: 'Donation', date: 'Aug 28, 2026', title: "Donated ₹500 towards: Bruno's Surgery Fund", ngoName: 'Helping Paws Foundation', color: 'bg-emerald-500', pill: 'Donation', pillColor: 'bg-emerald-100 text-emerald-700' },
  { type: 'Emergency', date: 'Aug 20, 2026', title: 'Reported Trapped Kitten', ngoName: 'City Animal Care', status: 'Resolved', color: 'bg-rose-500', pill: 'Emergency', pillColor: 'bg-rose-100 text-rose-700' },
]

const FALLBACK_STATS = {
  rescuesReported: 3,
  suppliesDonated: 2,
  campaignsFunded: 1,
  volunteerHours: 0,
}

// ── Type → pill color mapping ────────────────────────────────────────────────
const TYPE_META = {
  Emergency: { color: 'bg-rose-500', pill: 'Emergency', pillColor: 'bg-rose-100 text-rose-700' },
  Supply:    { color: 'bg-blue-500',  pill: 'Supply',    pillColor: 'bg-blue-100 text-blue-700'  },
  Donation:  { color: 'bg-emerald-500', pill: 'Donation', pillColor: 'bg-emerald-100 text-emerald-700' },
}

export default function UserImpactProfile() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const [lifetimeStats, setLifetimeStats] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchProfile = async () => {
      setLoading(true)
      try {
        // GET /api/v1/users/impact-profile (requires Bearer token)
        const res = await API.get('/users/impact-profile')
        if (!cancelled) {
          const { lifetimeStats: stats, timeline: tl } = res.data.data
          setLifetimeStats(stats)
          setTimeline(
            (tl || []).map((item) => ({
              ...item,
              ...TYPE_META[item.type],
            }))
          )
          setIsMock(false)
        }
      } catch (err) {
        if (!cancelled) {
          // Fall back to user.impact (stored in Redux after login) or static defaults
          const impact = user?.impact || FALLBACK_STATS
          setLifetimeStats(impact)
          setTimeline(FALLBACK_TIMELINE)
          setIsMock(true)
          if (err.response) {
            setError(err?.message || 'Could not load impact data')
          }
          // If network error, silently use fallback — no error shown
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProfile()
    return () => { cancelled = true }
  }, [user?.impact])

  const stats = lifetimeStats || FALLBACK_STATS

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto p-4 space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative pt-12 text-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="mx-auto w-24 h-24 rounded-full border-4 border-teal-200 overflow-hidden mb-4 bg-teal-50 flex items-center justify-center">
            {user ? (
              <img
                src={`https://i.pravatar.cc/200?u=${user._id || user.id || user.email}`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <PawPrint className="h-10 w-10 text-teal-400" />
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-2">
            {user?.name || 'Animal Lifeline User'}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black border border-amber-300">
              <Shield className="h-3.5 w-3.5" />
              Verified Helper
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              {user?.createdAt
                ? `Member since ${new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`
                : 'Animal Lifeline Member'}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold text-slate-700">
            <span className="bg-slate-100 px-3 py-1 rounded-full">🚨 {stats.rescuesReported} Rescues</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">💰 {stats.campaignsFunded} Campaigns Funded</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">📦 {stats.suppliesDonated} Supplies</span>
          </div>

          {isMock && !error && (
            <p className="text-[11px] text-slate-400 mt-3">Showing offline demo data</p>
          )}
        </div>

        {/* LIFETIME STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: Siren, label: 'Rescues Assisted', value: stats.rescuesReported, bg: 'bg-rose-50', color: 'text-rose-500' },
            { icon: Users, label: 'Hours Volunteered', value: stats.volunteerHours, bg: 'bg-teal-50', color: 'text-teal-600' },
            { icon: Package, label: 'Supplies Given', value: stats.suppliesDonated, bg: 'bg-blue-50', color: 'text-blue-600' },
          ].map(({ icon: Icon, label, value, bg, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
              <div className={cn('p-3 rounded-full mb-3', bg)}>
                <Icon className={cn('h-6 w-6', color)} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                <AnimatedCounter target={value || 0} duration={1000} />
              </h3>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* IMPACT TIMELINE */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-teal-500" />
            My Impact Timeline
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading your timeline…</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-4">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          ) : null}

          {timeline.length > 0 && (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 z-0" />
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="relative pl-12"
                  >
                    <div className={cn('absolute left-2.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow flex items-center justify-center z-10', event.color)} />
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide', event.pillColor)}>
                          {event.pill}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {event.date
                            ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : ''}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-slate-500">{event.ngoName}</p>
                      {event.status && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-2.5 w-2.5" /> {event.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {!loading && timeline.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <PawPrint className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No activity yet</p>
              <p className="text-sm mt-1">Start by reporting an emergency or donating to a campaign!</p>
            </div>
          )}
        </div>

        {/* CTA CARD */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-sm text-center">
          <h2 className="text-xl font-black mb-4">Keep Making a Difference 🐾</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              Report Emergency
            </button>
            <button
              onClick={() => navigate('/nearby-ngos')}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-teal-700 rounded-xl font-bold transition-colors shadow-sm"
            >
              Explore NGOs
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
