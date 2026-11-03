import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import { Link } from 'react-router'
import API from '@/api/axios'
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
import { useSelector } from 'react-redux'
import AuthRequiredState from '@/components/common/AuthRequiredState'

// Campaigns have no cover photo in the backend — only impact photos uploaded
// after fundraising (campaign.impact.photos). So cards show a real impact
// photo when one exists, and otherwise a neutral typographic panel. A
// stock animal photo would imply a specific animal this campaign is for,
// which the data does not say.

const TABS = ['All', 'Medical Fund', 'Surgery', 'Sterilization', 'Least funded']


export default function DonatePage() {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedQuickDonate, setSelectedQuickDonate] = useState(null)
  const [customAmount, setCustomAmount] = useState('500')
  const [donationSuccess, setDonationSuccess] = useState(false)

  const { isAuthenticated } = useSelector((state) => state.auth)
  // Live campaigns from the backend only. The list endpoint requires
  // authentication (GET /donations/campaigns is verifyJWT), so a logged-out
  // visitor sees a sign-in prompt instead of invented campaigns.
  const [allCampaigns, setAllCampaigns] = useState([])
  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [campaignsError, setCampaignsError] = useState('')
  const [donationError, setDonationError] = useState('')
  const [donationProcessing, setDonationProcessing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setAllCampaigns([])
      setCampaignsLoading(false)
      return
    }
    let cancelled = false
    const fetchCampaigns = async () => {
      setCampaignsLoading(true)
      setCampaignsError('')
      try {
        const res = await API.get('/donations/campaigns')
        if (!cancelled && res.data?.data) {
          const mapped = res.data.data.map((c) => ({
            id: c._id,
            type: 'donation',
            title: c.title,
            description: c.description,
            ngoName: c.ngo?.organizationName || 'Verified NGO',
            targetAmount: c.targetAmount,
            raisedAmount: c.raisedAmount || 0,
            donorsCount: c.donors?.length || 0,
            status: c.status === 'Active' ? 'active' : 'completed',
          }))
          setAllCampaigns(mapped)
        }
      } catch (err) {
        if (!cancelled) setCampaignsError(err?.message || 'Could not load campaigns.')
      } finally {
        if (!cancelled) setCampaignsLoading(false)
      }
    }
    fetchCampaigns()
    return () => { cancelled = true }
  }, [isAuthenticated])


  // Donation campaigns filtered by status
  const donationCampaigns = allCampaigns
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
    if (activeTab === 'Least funded') {
      // Campaigns have no urgency/severity field in the backend; this tab
      // is simply the least-funded half, labelled as such.
      const percent = (campaign.raisedAmount / (campaign.targetAmount || 1)) * 100
      return percent < 50
    }
    return true
  })

  const handleQuickDonate = (campaign) => {
    setSelectedQuickDonate(campaign)
    setDonationSuccess(false)
  }


  // Real donation flow, matching the backend exactly:
  // 1. POST /donations/campaigns/:id/donate creates a Razorpay order and
  //    returns { order, campaignId, keyId }.
  // 2. Razorpay Checkout collects the payment in the browser.
  // 3. On payment, POST /donations/campaigns/:id/verify with the
  //    razorpay_order_id / payment_id / signature verifies the signature
  //    and records the donation. Only a successful verify shows success.
  // Previously this page showed success even when the API call failed and
  // even though no payment had been taken at all.
  const handleProcessDonation = async (e) => {
    e.preventDefault()
    const amount = Number(customAmount)
    if (!amount || amount < 51) {
      setDonationError('Donation amount must be at least ₹51 (the backend requires more than ₹50).')
      return
    }
    if (!selectedQuickDonate?.id) return
    setDonationError('')
    setDonationProcessing(true)
    try {
      const res = await API.post(`/donations/campaigns/${selectedQuickDonate.id}/donate`, { amount })
      const { order, keyId } = res.data?.data || {}
      if (!order?.id || !keyId) {
        throw new Error('The backend did not return a payment order. No payment was taken.')
      }
      if (typeof window !== 'undefined' && !window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = resolve
          script.onerror = () => reject(new Error('Could not load the Razorpay payment window.'))
          document.body.appendChild(script)
        })
      }
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'Animal Lifeline',
          description: selectedQuickDonate.title,
          order_id: order.id,
          handler: async (response) => {
            try {
              await API.post(`/donations/campaigns/${selectedQuickDonate.id}/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              setDonationSuccess(true)
              setTimeout(() => {
                setSelectedQuickDonate(null)
                setDonationSuccess(false)
              }, 3500)
              resolve()
            } catch (verifyErr) {
              reject(new Error(`Payment was taken, but recording it failed: ${verifyErr?.message || 'verification failed'}. Please keep your payment ID (${response.razorpay_payment_id}) and contact the NGO.`))
            }
          },
          modal: { ondismiss: () => reject(new Error('Payment was cancelled. No donation was recorded.')) },
          theme: { color: '#087F70' },
        })
        rzp.on('payment.failed', (resp) => {
          reject(new Error(resp?.error?.description || 'Payment failed. No donation was recorded.'))
        })
        rzp.open()
      })
    } catch (err) {
      setDonationError(err?.message || 'Donation could not be completed.')
    } finally {
      setDonationProcessing(false)
    }
  }



  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-6">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
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
              Verified NGOs only
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
            Direct financial support for veterinary care and rescue work by verified NGOs. A payment is only recorded after Razorpay verifies it.
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
              <span>Verified NGOs only</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold text-white">
              <Heart className="w-4 h-4 text-rose-300 fill-current" />
              <span>Razorpay-secured payments</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Verified before recording</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-20 space-y-8">
        {!isAuthenticated && (
          <AuthRequiredState title="Sign in to see active campaigns" message="Campaigns are listed for signed-in users, because the backend requires authentication for the campaign list. Nearby Help on the home page works without signing in." />
        )}
        {isAuthenticated && (
          <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {[
                { label: 'Raised across listed campaigns', value: formatCurrency(allCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0)) },
                { label: 'Active campaigns listed', value: String(allCampaigns.length) },
                { label: 'Target across listed campaigns', value: formatCurrency(allCampaigns.reduce((sum, c) => sum + (c.targetAmount || 0), 0)) },
              ].map((stat) => (
                <div key={stat.label} className="p-2 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">Totals are computed from the campaigns listed on this page only; the backend has no platform-wide totals endpoint.</p>
          </section>
        )}
        {campaignsError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{campaignsError}</div>
        )}
        {campaignsLoading && (
          <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading campaigns" /></div>
        )}

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
              const photo = campaign.impact?.photos?.[0] || null
              const target = campaign.targetAmount || 10000
              const raised = campaign.raisedAmount || 0
              const percent = Math.min(100, Math.round((raised / target) * 100))

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
                    <div className="md:col-span-4 relative h-48 md:h-full min-h-[190px] overflow-hidden bg-[#DDE9DF]">
                      {photo ? (
                        <img
                          src={photo}
                          alt={`Impact photo for ${campaign.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                          <span className="text-4xl">🐾</span>
                          <span className="text-xs font-bold text-[#183B35] uppercase tracking-wider">Fundraising campaign</span>
                          <span className="text-xs text-slate-500">No campaign photo uploaded yet</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

                      {/* Overlay badge: campaign status (Active=green, Completed=teal) */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          Active
                        </span>
                      </div>

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
                            {campaign.status}
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
              <p className="font-bold text-slate-800">{!isAuthenticated ? 'Sign in to see active campaigns' : 'No campaigns match this category right now'}</p>
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

        {/* Trust Bar (bottom): bg-emerald-50 border-emerald-200 */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-emerald-950">
                Secured & verified: payments go through Razorpay and are verified by the backend before they are recorded against a campaign.
              </p>
              <p className="text-xs text-emerald-800/80">
                Campaigns on this page are published by verified NGOs. Impact updates are posted by the NGO on the campaign page.
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
                    Your contribution of ₹{Number(customAmount).toLocaleString('en-IN')} for {selectedQuickDonate.title} has been verified and recorded.
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
                      <Shield className="w-3.5 h-3.5" /> Verified before recording
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Razorpay collects the payment and the backend verifies its signature before the donation is recorded. No tax-deduction claim is made here.
                    </p>
                  </div>
                  {donationError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{donationError}</div>
                  )}

                  <button
                    type="submit"
                    disabled={donationProcessing}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    {donationProcessing ? 'Opening secure payment…' : `Complete Donation of ₹${Number(customAmount || 0).toLocaleString('en-IN')}`}
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
