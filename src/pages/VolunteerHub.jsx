import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link } from 'react-router'
import {
  Users,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Heart,
  Star,
  Zap,
  Shield,
  ArrowRight,
  PawPrint,
  Sparkles,
  Award,
  Filter,
  Check,
  X,
  Share2,
  AlertCircle,
  Flame,
  Search,
} from 'lucide-react'

const MOCK_OPPORTUNITIES = [
  {
    id: 'vol-001',
    ngo: 'Helping Paws Foundation',
    city: 'Jaipur',
    task: 'Rescue',
    title: 'Weekend Rescue Drives',
    desc: 'Join our weekend rescue team. Training provided. Vehicle available.',
    date: 'Every Saturday',
    time: '7:00 AM - 12:00 PM',
    slots: 5,
    totalSlots: 8,
    urgency: 'high',
  },
  {
    id: 'vol-002',
    ngo: 'Mumbai Animal Rescue',
    city: 'Mumbai',
    task: 'Shelter Care',
    title: 'Daily Shelter Care Shifts',
    desc: 'Help feed, groom, and care for 300+ animals at our shelter.',
    date: 'Daily',
    time: '9:00 AM - 1:00 PM',
    slots: 3,
    totalSlots: 6,
    urgency: 'medium',
  },
  {
    id: 'vol-003',
    ngo: 'Bangalore Compassion Trust',
    city: 'Bangalore',
    task: 'Feeding',
    title: 'Community Feeding Program',
    desc: 'Distribute cooked food to 200+ street animals across 5 zones in Koramangala.',
    date: 'Daily',
    time: '6:00 AM - 8:00 AM',
    slots: 12,
    totalSlots: 15,
    urgency: 'low',
  },
  {
    id: 'vol-004',
    ngo: 'Delhi Stray Friends',
    city: 'Delhi',
    task: 'Events',
    title: 'Monthly Adoption Drive',
    desc: 'Help organize and manage our monthly adoption event at Lodhi Garden.',
    date: 'Oct 26, 2026',
    time: '10:00 AM - 5:00 PM',
    slots: 8,
    totalSlots: 20,
    urgency: 'low',
  },
  {
    id: 'vol-005',
    ngo: 'Chennai Animal Aid',
    city: 'Chennai',
    task: 'Transport',
    title: 'Animal Transport Volunteers',
    desc: 'Drive rescued animals from pick-up points to our veterinary facility. Own vehicle required.',
    date: 'On-Call',
    time: 'Flexible',
    slots: 4,
    totalSlots: 10,
    urgency: 'high',
  },
  {
    id: 'vol-006',
    ngo: 'Prani Seva Sansthan',
    city: 'Kota',
    task: 'Rescue',
    title: 'Emergency Night Rescue Team',
    desc: 'Be part of our 24/7 emergency response team. Handle night-time injury cases.',
    date: 'Rotating shifts',
    time: '10:00 PM - 6:00 AM',
    slots: 2,
    totalSlots: 4,
    urgency: 'high',
  },
]

const TASK_FILTERS = ['All', 'Rescue', 'Shelter Care', 'Feeding', 'Events', 'Transport']

const TASK_BADGE_STYLES = {
  Rescue: 'bg-rose-50 text-rose-700 border-rose-200',
  'Shelter Care': 'bg-teal-50 text-teal-700 border-teal-200',
  Feeding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Events: 'bg-purple-50 text-purple-700 border-purple-200',
  Transport: 'bg-blue-50 text-blue-700 border-blue-200',
}

const STATS_DATA = [
  { label: 'Rescues Assisted', value: '12,450', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: 'Hours Logged', value: '48,200', icon: Clock, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Cities Active', value: '28', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'NGO Partners', value: '150+', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
]

export default function VolunteerHub() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [signedUpIds, setSignedUpIds] = useState([])
  const [activeModalOpp, setActiveModalOpp] = useState(null)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' })

  const filteredOpportunities =
    activeFilter === 'All'
      ? MOCK_OPPORTUNITIES
      : MOCK_OPPORTUNITIES.filter((opp) => opp.task === activeFilter)

  const handleOpenSignUp = (opp) => {
    setActiveModalOpp(opp)
    setModalSuccess(false)
    setFormData({ name: '', phone: '', email: '', notes: '' })
  }

  const handleConfirmSignUp = (e) => {
    e.preventDefault()
    if (!activeModalOpp) return
    setSignedUpIds((prev) => [...prev, activeModalOpp.id])
    setModalSuccess(true)
    setTimeout(() => {
      setActiveModalOpp(null)
      setModalSuccess(false)
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-6">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-teal-600 font-black text-lg group">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5 text-teal-600" />
            </div>
            <span>Animal Lifeline</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/donate"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              Donate
            </Link>
            <Link
              to="/nearby-ngos"
              className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl border border-teal-200 transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              Find NGOs
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-slate-800 text-white py-16 px-6">
        {/* Subtle Animated Paw Print Pattern Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 left-10"
          >
            <PawPrint className="w-24 h-24 text-white" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 18, 0],
              rotate: [0, -6, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-4 left-1/3"
          >
            <PawPrint className="w-20 h-20 text-white" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 8, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-12 right-16"
          >
            <PawPrint className="w-28 h-28 text-white" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 14, 0],
              rotate: [0, -4, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute bottom-8 right-1/4"
          >
            <PawPrint className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-teal-100 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Empowering Animal Rescue Across India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
          >
            Join the Rescue Force 🐾
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-teal-100/90 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Real animals. Real impact. Your city needs you.
          </motion.p>

          {/* Two Stats Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full shadow-lg">
              <Users className="w-4 h-4 text-teal-200" />
              <span className="font-bold text-sm sm:text-base text-white tracking-wide">
                5,000+ Active Volunteers
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full shadow-lg">
              <Shield className="w-4 h-4 text-emerald-300" />
              <span className="font-bold text-sm sm:text-base text-white tracking-wide">
                150+ NGOs
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-20 space-y-8">
        {/* Stats Row (4 cards, bg-white, grid-cols-2 md:grid-cols-4) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS_DATA.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', stat.bg)}>
                    <Icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Live
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </section>

        {/* Filter Row: Horizontal scrollable pill buttons */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Available Shifts & Missions
                <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                  {filteredOpportunities.length} Available
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Choose a task matching your schedule, skills, and city.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none flex-nowrap">
            {TASK_FILTERS.map((filter) => {
              const isActive = activeFilter === filter
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none',
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-600/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-slate-900 shadow-2xs'
                  )}
                >
                  {filter}
                </button>
              )
            })}
          </div>
        </section>

        {/* Opportunity Cards (grid-cols-1 md:grid-cols-2) */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.map((opp, index) => {
                const isSignedUp = signedUpIds.includes(opp.id)
                const effectiveSlots = isSignedUp ? Math.min(opp.totalSlots, opp.slots + 1) : opp.slots
                const percent = Math.min(100, Math.round((effectiveSlots / opp.totalSlots) * 100))
                const badgeStyle = TASK_BADGE_STYLES[opp.task] || 'bg-slate-100 text-slate-700 border-slate-200'

                return (
                  <motion.div
                    key={opp.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top: Task type badge + Urgency dot */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={cn('px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider', badgeStyle)}>
                            {opp.task}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 hidden sm:inline flex items-center gap-1">
                            • {opp.ngo}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {opp.urgency === 'high' ? (
                            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                              </span>
                              Urgent Need
                            </div>
                          ) : opp.urgency === 'medium' ? (
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Medium Urgency
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Standard
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {opp.desc}
                      </p>

                      {/* Metadata Row: MapPin + city, Calendar + date, Clock + time */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-2.5 my-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="truncate">{opp.city}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="truncate">{opp.date}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="truncate">{opp.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: slot progress bar + "Sign Up" button */}
                    <div className="space-y-3 pt-1 mt-auto">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">
                            {effectiveSlots} / {opp.totalSlots} Slots Filled
                          </span>
                          <span className="font-bold text-teal-700">
                            {opp.totalSlots - effectiveSlots > 0
                              ? `${opp.totalSlots - effectiveSlots} slots remaining`
                              : 'Fully Booked'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50 p-0.5">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              percent >= 90
                                ? 'bg-rose-500'
                                : percent >= 60
                                ? 'bg-teal-600'
                                : 'bg-emerald-500'
                            )}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSignedUp || effectiveSlots >= opp.totalSlots}
                        onClick={() => handleOpenSignUp(opp)}
                        className={cn(
                          'w-full py-3.5 px-4 font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98',
                          isSignedUp
                            ? 'bg-emerald-600 text-white cursor-default shadow-emerald-600/20'
                            : effectiveSlots >= opp.totalSlots
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 hover:shadow-md'
                        )}
                      >
                        {isSignedUp ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                            You're Registered!
                          </>
                        ) : effectiveSlots >= opp.totalSlots ? (
                          'Slot Full'
                        ) : (
                          <>
                            Sign Up
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">No shifts match this filter</p>
              <button
                type="button"
                onClick={() => setActiveFilter('All')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Reset to All Filters
              </button>
            </div>
          )}
        </section>

        {/* Impact Quote */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
              <Star className="w-6 h-6 text-amber-600 fill-amber-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-amber-950 leading-snug">
                “Every volunteer hour translates to 3.5 animals getting help.”
              </p>
              <p className="text-xs font-semibold text-amber-800/80">
                — Animal Lifeline Research, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Volunteer Benefits Banner */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            Why Volunteer with Animal Lifeline?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Certificate
              </p>
              <p className="text-slate-500">Official digital verification certificate for college or resume credit.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-teal-600" /> Hands-On Field Training
              </p>
              <p className="text-slate-500">Learn handling, first-aid basics, and safe transport protocols from vets.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Compassionate Network
              </p>
              <p className="text-slate-500">Connect with local rescuers, shelter managers, and foster caregivers.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Sign-Up Modal */}
      <AnimatePresence>
        {activeModalOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !modalSuccess && setActiveModalOpp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 max-h-[90vh] overflow-y-auto"
            >
              {modalSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">You're All Set! 🎉</h3>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">
                    Thank you for stepping up for {activeModalOpp.title}. {activeModalOpp.ngo} will reach out with briefing details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmSignUp} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                        Confirm Volunteer Registration
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                        {activeModalOpp.title}
                      </h3>
                      <p className="text-xs text-slate-500">{activeModalOpp.ngo} • {activeModalOpp.city}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModalOpp(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">When:</span>
                      <span className="font-bold">{activeModalOpp.date} ({activeModalOpp.time})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Task:</span>
                      <span className="font-bold">{activeModalOpp.task}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sanika Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="you@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Any relevant experience or vehicle details (optional)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Have a two-wheeler, comfortable with dog handling..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-teal-600/20"
                  >
                    Confirm & Reserve My Slot
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Free registration. No commitments required beyond selected shift.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
