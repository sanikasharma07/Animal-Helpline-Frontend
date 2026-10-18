import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { mockCampaigns } from '@/data/mockCampaigns'
import ImpactVisualizer from '@/components/campaigns/ImpactVisualizer'
import {
  ArrowLeft,
  Heart,
  Share2,
  Shield,
  TrendingUp,
  Users,
  Package,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  AlertTriangle,
} from 'lucide-react'

const ANIMAL_IMAGES = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
  bird: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=800&auto=format&fit=crop&q=80',
  cattle: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80',
}

function ActiveDonationPanel({ campaign }) {
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(null)
  const PRESETS = [200, 500, 1000, 2500]

  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100))
  const remaining = campaign.targetAmount - campaign.raisedAmount

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(campaign.raisedAmount)}</p>
            <p className="text-xs text-slate-500 mt-0.5">raised of {formatCurrency(campaign.targetAmount)} goal</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-teal-600">{percent}%</p>
            <p className="text-xs text-slate-500">funded</p>
          </div>
        </div>

        {/* Thick teal-500 progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200/60 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { label: 'Donors', value: campaign.donorsCount, icon: Users },
            { label: 'Still Needed', value: formatCurrency(remaining), icon: TrendingUp },
            { label: 'Days Left', value: '14', icon: Clock },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                <Icon className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <p className="font-black text-slate-900 text-sm">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Donation Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
          Make a Contribution
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setSelectedPreset(preset); setDonationAmount(String(preset)) }}
              className={cn(
                'py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                selectedPreset === preset
                  ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
              )}
            >
              ₹{preset.toLocaleString('en-IN')}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={donationAmount}
            onChange={(e) => { setDonationAmount(e.target.value); setSelectedPreset(null) }}
            className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none font-medium text-slate-900"
          />
        </div>

        <button
          type="button"
          disabled={!donationAmount || Number(donationAmount) <= 0}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5 fill-current" />
          Donate {donationAmount ? `₹${Number(donationAmount).toLocaleString('en-IN')}` : 'Now'}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% secure · Tax-deductible under 80G · Direct to NGO</span>
        </div>
      </div>

      {/* Supply Campaign Panel */}
      {campaign.type === 'supply' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Supply Request Details
          </h3>
          <div className="space-y-3">
            {(campaign.items || []).map((item, idx) => {
              const pct = Math.min(100, Math.round((item.received / item.required) * 100))
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.item}</span>
                    <span className="text-slate-500">{item.received}/{item.required} {item.unit}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
            Pledge Supplies
          </button>
        </div>
      )}
    </div>
  )
}

export default function CampaignDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find campaign in Redux state (campaigns) or fall back to mock data
  const campaignFromRedux = useSelector((state) =>
    state.admin?.verifications ? null : null
  )
  const campaign = mockCampaigns.find((c) => c.id === id) || mockCampaigns[0]

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Campaign Not Found</h2>
          <button onClick={() => navigate(-1)} className="text-teal-600 font-semibold hover:underline">
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  const isCompleted = campaign.status === 'completed'
  const imageSrc = ANIMAL_IMAGES[campaign.animalType] || ANIMAL_IMAGES.default

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-800">
        <img src={imageSrc} alt={campaign.animalName || 'Animal'} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2.5 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Share Button */}
        <button
          type="button"
          className="absolute top-4 right-4 p-2.5 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors border border-white/20"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2',
              isCompleted ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            )}>
              {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />}
              {isCompleted ? 'Completed' : 'Active · Needs Funding'}
            </span>
            <h1 className="text-2xl font-black text-white leading-tight drop-shadow-lg">
              {campaign.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* NGO + Meta */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-teal-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 truncate">{campaign.ngoName}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified NGO</span>
              <span>·</span>
              <span>Since {campaign.createdAt?.slice(0, 4)}</span>
            </div>
          </div>
          <div className="shrink-0 px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-200">
            {campaign.type === 'donation' ? 'Medical Fund' : 'Supply Drive'}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-2">About This Case</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{campaign.description}</p>
        </div>

        {/* CONDITIONAL: Active vs Completed */}
        {isCompleted ? (
          <ImpactVisualizer campaign={campaign} />
        ) : (
          <ActiveDonationPanel campaign={campaign} />
        )}
      </div>
    </div>
  )
}
