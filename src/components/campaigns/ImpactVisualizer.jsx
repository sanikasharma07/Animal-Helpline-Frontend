import React from 'react'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import {
  CheckCircle2,
  Heart,
  Stethoscope,
  Package,
  Camera,
  Receipt,
  Users,
  Star,
  TrendingUp,
  Award,
} from 'lucide-react'

const DONOR_AVATARS = [
  'https://i.pravatar.cc/48?img=1',
  'https://i.pravatar.cc/48?img=5',
  'https://i.pravatar.cc/48?img=8',
  'https://i.pravatar.cc/48?img=12',
  'https://i.pravatar.cc/48?img=15',
  'https://i.pravatar.cc/48?img=20',
]

const RECEIPT_IMAGES = [
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=70',
]

const SUPPLY_IMAGES = [
  'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&auto=format&fit=crop&q=70',
]

export default function ImpactVisualizer({ campaign }) {
  if (!campaign) return null

  const totalSpent = (campaign.expenses || []).reduce((sum, e) => sum + e.amount, 0)
  const surplus = (campaign.raisedAmount || 0) - totalSpent

  return (
    <div className="space-y-6">
      {/* Impact Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-6 h-6 text-emerald-200" />
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-100">Mission Complete</span>
          </div>
          <h2 className="text-2xl font-black mb-1">
            {campaign.animalName ? `${campaign.animalName}'s Story` : 'Campaign Completed!'}
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Thanks to {campaign.donorsCount || 0} generous donors, this mission was fully funded and completed.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { label: 'Total Raised', value: formatCurrency(campaign.raisedAmount || 0), icon: TrendingUp },
              { label: 'Donors', value: campaign.donorsCount || 0, icon: Users },
              { label: 'Days Active', value: campaign.completedAt
                ? Math.ceil((new Date(campaign.completedAt) - new Date(campaign.createdAt)) / 86400000)
                : '—',
                icon: Star },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 text-emerald-200 mx-auto mb-1" />
                  <div className="text-xl font-black">{stat.value}</div>
                  <div className="text-[10px] font-semibold text-emerald-200 uppercase tracking-wider">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Financial Transparency — Expense Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Receipt className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base">Financial Transparency</h3>
          <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            100% Verified
          </span>
        </div>
        <p className="text-xs text-slate-500">Every rupee accounted for. All receipts verified by the platform.</p>

        <div className="space-y-3">
          {(campaign.expenses || []).map((expense, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{expense.item}</p>
                  {expense.receipt && (
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Receipt Uploaded
                    </p>
                  )}
                </div>
              </div>
              <span className="font-black text-slate-900 text-sm">{formatCurrency(expense.amount)}</span>
            </div>
          ))}

          {/* Totals */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Total Spent</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Total Raised</span>
              <span className="font-bold text-slate-900">{formatCurrency(campaign.raisedAmount || 0)}</span>
            </div>
            {surplus > 0 && (
              <div className="flex justify-between text-sm bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                <span className="text-emerald-700 font-semibold">Surplus → Next Case</span>
                <span className="font-black text-emerald-700">{formatCurrency(surplus)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Vet Bill / Receipt Images */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Uploaded Receipts</p>
          <div className="grid grid-cols-2 gap-3">
            {RECEIPT_IMAGES.map((src, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
                <img src={src} alt={`Receipt ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-black/40 px-2 py-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-white text-[10px] font-bold">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Delivered Supplies / Treatment Photos */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base">Treatment & Recovery Photos</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SUPPLY_IMAGES.map((src, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-100 group">
              <img src={src} alt={`Treatment photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
        {campaign.treatmentUpdates && campaign.treatmentUpdates.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Treatment Log</p>
            {campaign.treatmentUpdates.map((update, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <div className={cn(
                  'w-2 h-2 rounded-full mt-1.5 shrink-0',
                  update.type === 'rescue' ? 'bg-rose-500' :
                  update.type === 'medical' ? 'bg-teal-500' :
                  'bg-emerald-500'
                )} />
                <div>
                  <p className="text-slate-700 font-medium">{update.text}</p>
                  <p className="text-xs text-slate-400">{update.at}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Donor Wall */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
          <h3 className="font-bold text-slate-900 text-base">Wall of Gratitude</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          {campaign.donorsCount || 0} amazing people made this possible.
        </p>

        <div className="flex items-center gap-1 flex-wrap">
          {DONOR_AVATARS.map((src, idx) => (
            <div
              key={idx}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden -ml-2 first:ml-0"
            >
              <img src={src} alt={`Donor ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {(campaign.donorsCount || 0) > DONOR_AVATARS.length && (
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-black -ml-2">
              +{campaign.donorsCount - DONOR_AVATARS.length}
            </div>
          )}
        </div>

        <div className="mt-5 p-4 bg-teal-50 rounded-xl border border-teal-100 text-center">
          <p className="text-teal-800 text-sm font-semibold">
            🐾 Because of you, {campaign.animalName || 'this animal'} got a second chance at life.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
