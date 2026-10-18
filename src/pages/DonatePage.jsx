import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import { Link } from 'react-router'
import {
  Heart,
  TrendingUp,
  Users,
  Shield,
  CheckCircle2,
  ChevronRight,
  Zap,
  Star,
  Clock,
  PawPrint,
  Building2,
  AlertTriangle,
  Award,
  Sparkles,
  ExternalLink,
  ArrowRight,
  X,
  Lock,
} from 'lucide-react'
import { mockCampaigns } from '@/data/mockCampaigns'

const ANIMAL_PHOTOS = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
  bird: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=600&auto=format&fit=crop&q=80',
  cattle: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=600&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
}

const TABS = ['All', 'Medical Fund', 'Surgery', 'Sterilization', 'Critical Only']

const PLATFORM_STATS = [
  { label: 'Total Raised', value: '₹2.42 Cr', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Campaigns', value: '342', icon: Zap, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Donors', value: '18,290', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Success Rate', value: '98.2%', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
]

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedQuickDonate, setSelectedQuickDonate] = useState(null)
  const [customAmount, setCustomAmount] = useState('500')
  const [donationSuccess, setDonationSuccess] = useState(false)

  // Filter campaigns where type === 'donation'
  const donationCampaigns = mockCampaigns.filter((c) => c.type === 'donation')
  const activeDonationCampaigns = donationCampaigns.filter((c) => c.status !== 'completed')
  const completedCampaigns = donationCampaigns.filter((c) => c.status === 'completed')

  // Apply tab filter on active campaigns
  const filteredCampaigns = activeDonationCampaigns.filter((campaign) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Medical Fund') {
      const text = `${campaign.title} ${campaign.description}`.toLowerCase()
      return text.includes('medical') || text.includes('icu') || text.includes('treatment') || text.includes('parvo')
    }
    if (activeTab === 'Surgery') {
      const text = `${campaign.title} ${campaign.description}`.toLowerCase()
      return text.includes('surgery') || text.includes('fracture')
    }
    if (activeTab === 'Sterilization') {
      const text = `${campaign.title} ${campaign.description}`.toLowerCase()
      return text.includes('sterilization') || text.includes('neutering')
    }
    if (activeTab === 'Critical Only') {
      const percent = (campaign.raisedAmount / (campaign.targetAmount || 1)) * 100
      return campaign.severity === 'critical' || percent < 50
    }
    return true
  })

  const handleQuickDonate = (campaign) => {
    setSelectedQuickDonate(campaign)
    setDonationSuccess(false)
  }

  const handleProcessDonation = (e) => {
    e.preventDefault()
    setDonationSuccess(true)
    setTimeout(() => {
      setSelectedQuickDonate(null)
      setDonationSuccess(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-6">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-teal-700 font-black text-lg group">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5 text-teal-600" />
            </div>
            <span>Animal Lifeline</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/volunteer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              Volunteer Hub
            </Link>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              80G Tax Exempt
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-700 text-white py-14 px-6">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          {/* Large Shield Icon with Checkmark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl relative"
          >
            <Shield className="w-10 h-10 text-white fill-white/10" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
          >
            Fund a Rescue 💚
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-emerald-50 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Direct financial support for critical veterinary surgeries, trauma rescues, and post-operative recovery. Every rupee is tracked with verified receipts.
          </motion.p>

          {/* 3 Pill Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold text-white">
              <TrendingUp className="w-4 h-4 text-emerald-200" />
              <span>₹2.4 Cr+ Raised</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold text-white">
              <Heart className="w-4 h-4 text-rose-300 fill-current" />
              <span>40K+ Animals Helped</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>100% Direct to NGO</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-20 space-y-8">
        {/* Platform Stats Bar (bg-white, grid-cols-2 sm:grid-cols-4) */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {PLATFORM_STATS.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className={cn('p-2 text-center flex flex-col items-center justify-center', idx > 1 && 'pt-4 sm:pt-2')}>
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-1.5', stat.bg)}>
                    <Icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Filter Tabs (horizontal, border-b): All | Medical Fund | Surgery | Sterilization | Critical Only */}
        <section className="space-y-4">
          <div className="border-b border-slate-200">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 scrollbar-none flex-nowrap">
              {TABS.map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'shrink-0 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap',
                      isActive
                        ? 'border-emerald-600 text-emerald-700 bg-emerald-50/60 rounded-t-xl'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    )}
                  >
                    {tab}
                    {tab === 'Critical Only' && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-black">
                        Urgent
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-800">{filteredCampaigns.length}</strong> active medical missions
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <Shield className="w-3.5 h-3.5" /> 100% Verified Cases
            </span>
          </div>
        </section>

        {/* Campaign Cards (space-y-4) */}
        <section className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredCampaigns.map((campaign, index) => {
              const photo = ANIMAL_PHOTOS[campaign.animalType] || ANIMAL_PHOTOS.default
              const target = campaign.targetAmount || 10000
              const raised = campaign.raisedAmount || 0
              const percent = Math.min(100, Math.round((raised / target) * 100))
              const isCritical = campaign.severity === 'critical' || percent < 50

              return (
                <motion.div
                  key={campaign.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-5">
                    {/* Top / Left: Animal Photo with Status Badge */}
                    <div className="md:col-span-4 relative h-48 md:h-full min-h-[190px] overflow-hidden bg-slate-100">
                      <img
                        src={photo}
                        alt={campaign.animalName || campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

                      {/* Overlay badge: campaign status (Active=green, Completed=teal) */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          Active
                        </span>
                        {isCritical && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-md">
                            Critical Need
                          </span>
                        )}
                      </div>

                      {campaign.animalType && (
                        <div className="absolute bottom-3 left-3 md:hidden text-white font-bold text-xs uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                          {campaign.animalType}
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-8 p-5 md:py-5 md:pr-6 md:pl-0 flex flex-col justify-between space-y-4">
                      <div>
                        {/* NGO verified badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                            <Building2 className="w-3.5 h-3.5 text-teal-600" />
                            <span className="truncate">{campaign.ngoName}</span>
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified NGO
                            </span>
                          </div>

                          <span className="text-[11px] font-bold text-slate-500 capitalize">
                            {campaign.animalName ? `${campaign.animalName} • ` : ''}{campaign.animalType || 'Rescue'}
                          </span>
                        </div>

                        {/* Title & Short Description */}
                        <Link to={`/campaign/${campaign.id}`} className="block group-hover:text-emerald-700 transition-colors">
                          <h3 className="font-bold text-lg text-slate-900 leading-snug">
                            {campaign.title}
                          </h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {campaign.description}
                        </p>
                      </div>

                      {/* Thick emerald progress bar with raised/target text */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">
                            {formatCurrency(raised)} <span className="text-slate-400 font-normal">raised of {formatCurrency(target)}</span>
                          </span>
                          <span className="font-black text-emerald-700 text-sm">{percent}%</span>
                        </div>

                        {/* Thick emerald progress bar */}
                        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200/60 p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                          />
                        </div>

                        {/* Donor count + "14 days left" estimate */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1 font-semibold text-slate-600">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {campaign.donorsCount || 0} donors supported
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            14 days left
                          </span>
                        </div>
                      </div>

                      {/* Two buttons: "View Details" (outline) + "Donate Now" (emerald-600 filled) */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <Link
                          to={`/campaign/${campaign.id}`}
                          className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs sm:text-sm font-bold text-center transition-all bg-white hover:bg-emerald-50/40 flex items-center justify-center gap-1.5"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 opacity-70" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleQuickDonate(campaign)}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold text-center transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          Donate Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filteredCampaigns.length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="font-bold text-slate-800">No campaigns match this category right now</p>
              <button
                type="button"
                onClick={() => setActiveTab('All')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                View all campaigns
              </button>
            </div>
          )}
        </section>

        {/* Completed Campaigns Section: Filter mockCampaigns.filter(c => c.status === 'completed') */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Recently Funded & Completed
                <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                  {completedCampaigns.length} Success Stories
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Every mission below was 100% funded and rescued. Review hospital bills, receipts, and recovery updates.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {completedCampaigns.map((campaign, idx) => {
              const photo = ANIMAL_PHOTOS[campaign.animalType] || ANIMAL_PHOTOS.default
              const target = campaign.targetAmount || 10000
              const raised = campaign.raisedAmount || target

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-slate-100/80 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-5">
                    {/* Animal Photo with Completed Badge */}
                    <div className="md:col-span-4 relative h-44 md:h-full min-h-[170px] overflow-hidden bg-slate-200">
                      <img
                        src={photo}
                        alt={campaign.animalName || campaign.title}
                        className="w-full h-full object-cover grayscale-[30%] opacity-90"
                      />
                      {/* Mission Complete Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-600 text-white shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" />
                          Mission Complete ✓
                        </span>
                      </div>
                    </div>

                    {/* Details (Muted, links to ImpactVisualizer view via /campaign/:id) */}
                    <div className="md:col-span-8 p-5 md:py-5 md:pr-6 md:pl-0 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <span className="font-bold text-slate-700">{campaign.ngoName}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> All Bills Verified
                          </span>
                        </div>

                        <h3 className="font-bold text-base sm:text-lg text-slate-800">
                          {campaign.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {campaign.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-600">
                          <span className="font-bold text-slate-900">{formatCurrency(raised)}</span> fully funded by{' '}
                          <strong className="text-slate-800">{campaign.donorsCount || 0} donors</strong>
                        </div>

                        <Link
                          to={`/campaign/${campaign.id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-teal-50 border border-slate-300 hover:border-teal-400 text-teal-700 text-xs font-bold transition-all shadow-2xs shrink-0"
                        >
                          <span>View Transparency & Impact</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Trust Bar (bottom): bg-emerald-50 border-emerald-200 */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-emerald-950">
                🔒 Secured & Verified: Every donation goes directly to the NGO. Admin-verified receipts. Tax-deductible under 80G.
              </p>
              <p className="text-xs text-emerald-800/80">
                100% of your funds cover veterinary diagnosis, operations, hospitalization, and feed. Zero platform cut from direct NGO payouts.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Quick Donate Modal */}
      <AnimatePresence>
        {selectedQuickDonate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !donationSuccess && setSelectedQuickDonate(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 max-h-[90vh] overflow-y-auto"
            >
              {donationSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-10 h-10 fill-current" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Thank You! 💚</h3>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">
                    Your contribution of ₹{Number(customAmount).toLocaleString('en-IN')} for {selectedQuickDonate.title} has been received. Receipt emailed to you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleProcessDonation} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Quick Rescue Donation
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5 line-clamp-1">
                        {selectedQuickDonate.title}
                      </h3>
                      <p className="text-xs text-slate-500">{selectedQuickDonate.ngoName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedQuickDonate(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Preset amounts */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Choose Amount (INR)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['200', '500', '1000', '2500'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCustomAmount(amt)}
                          className={cn(
                            'py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer',
                            customAmount === amt
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'border-slate-200 text-slate-700 hover:border-emerald-400'
                          )}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Or Enter Custom Amount</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="50"
                        required
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Tax exemption note */}
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-0.5">
                    <p className="font-bold flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> 80G Tax Deductible
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Eligible for 50% tax deduction under Section 80G of Indian IT Act.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    Complete Donation of ₹{Number(customAmount || 0).toLocaleString('en-IN')}
                  </button>

                  <div className="text-center">
                    <Link
                      to={`/campaign/${selectedQuickDonate.id}`}
                      className="text-xs font-bold text-teal-600 hover:underline inline-flex items-center gap-1"
                    >
                      Or view full campaign details & breakdown <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
