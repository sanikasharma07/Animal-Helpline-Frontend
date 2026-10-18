import React from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { openSOSModal } from '@/store/slices/emergencySlice'
import EmergencySOSModal from '@/components/emergency/EmergencySOSModal'
import {
  Bell,
  Siren,
  Heart,
  Package,
  Home,
  Users,
  TrendingUp,
  MapPin,
  PawPrint,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { mockCampaigns } from '@/data/mockCampaigns'

export default function UserDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const quickActions = [
    {
      title: 'Adopt / Foster',
      desc: 'Give a rescued animal a loving temporary or forever home.',
      icon: Home,
      accent: 'text-teal-600 bg-teal-50 border-teal-200',
      link: '/foster',
    },
    {
      title: 'Volunteer',
      desc: 'Join local rescue teams & shelter care shifts near you.',
      icon: Users,
      accent: 'text-teal-600 bg-teal-50 border-teal-200',
      link: '/volunteer',
    },
    {
      title: 'Donate Supplies',
      desc: 'Send food, medicines, blankets & critical shelter gear.',
      icon: Package,
      accent: 'text-teal-600 bg-teal-50 border-teal-200',
      link: '/supplies',
    },
    {
      title: 'Fund a Rescue',
      desc: 'Sponsor life-saving surgeries & veterinary treatments.',
      icon: Heart,
      accent: 'text-teal-600 bg-teal-50 border-teal-200',
      link: '/donate',
    },
  ]

  // Filter active support hub feed campaigns
  const activeFeedItems = mockCampaigns.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24 md:pb-12">
      {/* Sticky Header Bar */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-200 shadow-sm px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold overflow-hidden border border-teal-200 shrink-0">
            <img
              src={`https://i.pravatar.cc/100?u=${user?._id || user?.id || 'demo'}`}
              alt={user?.name || 'User'}
            />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight text-base sm:text-lg">
              Hi, {user?.name || 'Animal Savior'} 👋
            </h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Verified Animal Lifeline Community
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6 flex flex-col">
        {/* Quick Impact Stats */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-slate-200/80 shadow-sm gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">1,248</span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  +18 Today
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Animals rescued & treated in your city</p>
            </div>
          </div>

          <Link
            to="/nearby-ngos"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-3.5 py-2 rounded-xl border border-teal-100 hover:bg-teal-100 transition-colors shrink-0"
          >
            <MapPin className="w-4 h-4" /> Nearby NGOs
          </Link>
        </div>

        {/* HERO SECTION: Centralized Pulsing Rose-500 SOS Button */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-900/5 border border-rose-100 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-100 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-100 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-lg z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-black uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              Instant Emergency Dispatch
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              See an Animal in Danger?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Broadcast an immediate emergency SOS alert. Verified NGOs, local volunteers, and nearby rescue teams respond in real-time.
            </p>
          </div>

          {/* MASSIVE PULSING ROSE-500 HERO BUTTON */}
          <button
            type="button"
            onClick={() => dispatch(openSOSModal())}
            className="w-full max-w-md py-5 sm:py-6 px-8 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xl sm:text-2xl rounded-2xl shadow-xl shadow-rose-500/40 flex items-center justify-center gap-3.5 transition-all animate-pulse-soft border-2 border-rose-400 z-10 cursor-pointer"
          >
            <Siren className="w-8 h-8 shrink-0 animate-bounce" />
            <span>🚨 Report Emergency Now</span>
          </button>
        </section>

        {/* QUICK ACTIONS: 2x2 Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-900">How do you want to help?</h3>
            <span className="text-xs font-semibold text-slate-400">4 Core Actions</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="bg-white hover:bg-teal-50/60 border border-slate-200 p-5 rounded-xl shadow-md hover:scale-105 transition-all flex flex-col justify-between gap-3 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn('p-3 rounded-xl border', action.accent)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-teal-700 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* SUPPORT HUB (FEED): Supply Requests & Active Campaigns */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Support Hub Feed</h3>
              <p className="text-xs text-slate-500">Active medical cases & supply requests near you</p>
            </div>
            <Link to="/nearby-ngos" className="text-xs font-bold text-teal-600 hover:underline">
              Explore All
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {activeFeedItems.map((item) => {
              const isDonation = item.type === 'donation'
              const percent = isDonation
                ? Math.min(100, Math.round((item.raisedAmount / item.targetAmount) * 100))
                : Math.min(100, Math.round((item.fulfilledQuantity / item.targetQuantity) * 100))

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border',
                            isDonation
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          )}
                        >
                          {isDonation ? 'Medical Rescue Fund' : 'Supply Request'}
                        </span>
                        <span className="text-xs text-slate-400">• {item.ngoName}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* THICK TEAL-500 PROGRESS BAR */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">
                        {isDonation
                          ? `${formatCurrency(item.raisedAmount)} raised of ${formatCurrency(item.targetAmount)}`
                          : `${item.fulfilledQuantity} ${item.unit || 'units'} collected of ${item.targetQuantity} ${item.unit || 'units'}`}
                      </span>
                      <span className="text-teal-600 font-extrabold">{percent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/60 flex">
                      <div
                        className="bg-teal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>100% Directly Verified NGO</span>
                    </div>

                    <button
                      type="button"
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-teal-600/20 active:scale-95"
                    >
                      {isDonation ? 'Contribute Fund' : 'Provide Supplies'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Global Emergency SOS Modal */}
      <EmergencySOSModal />
    </div>
  )
}
