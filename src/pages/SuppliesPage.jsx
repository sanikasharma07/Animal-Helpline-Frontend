import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import { 
  Package, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Heart, 
  Truck, 
  Box, 
  Utensils, 
  Pill, 
  Shirt, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  X,
  Clock,
  Send,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { mockCampaigns } from '@/data/mockCampaigns'

const SUPPLY_TYPES = [
  { id: 'all', label: 'All Requests', emoji: '📦' },
  { id: 'food', label: 'Food', emoji: '🍚' },
  { id: 'medicine', label: 'Medicines', emoji: '💊' },
  { id: 'bedding', label: 'Bedding', emoji: '🛏️' },
  { id: 'equipment', label: 'Equipment', emoji: '🔧' },
]

// Extend mockCampaigns supply data with supply type for filtering
const getSupplyType = (title) => {
  if (title.toLowerCase().includes('food')) return 'food'
  if (title.toLowerCase().includes('blanket') || title.toLowerCase().includes('bed')) return 'bedding'
  if (title.toLowerCase().includes('medicine') || title.toLowerCase().includes('medical')) return 'medicine'
  return 'equipment'
}

// Supplemental verified requests to ensure all categories (medicines, equipment) have rich active/fulfilled listings
const SUPPLEMENTAL_SUPPLIES = [
  {
    id: 'camp-sup-01',
    ngoId: 'ngo-002',
    ngoName: 'Mumbai Animal Rescue League',
    city: 'Mumbai',
    type: 'supply',
    title: 'Emergency Trauma & Surgical Medicine Drive',
    description: 'Post-operative antibiotics, Betadine antiseptic wash, pain relief injections, and sterile surgical bandages for 45 street animals undergoing emergency surgeries.',
    status: 'active',
    urgency: 'Critical',
    targetQuantity: 140,
    fulfilledQuantity: 82,
    unit: 'packs',
    items: [
      { item: 'Betadine 500ml & Sterile Gauze', required: 50, received: 38, unit: 'packs' },
      { item: 'Amoxicillin & Meloxicam Vials', required: 50, received: 32, unit: 'vials' },
      { item: 'Wound Spray & Cotton Swabs', required: 40, received: 12, unit: 'sets' },
    ],
  },
  {
    id: 'camp-sup-02',
    ngoId: 'ngo-004',
    ngoName: 'Bangalore Compassion Trust',
    city: 'Bangalore',
    type: 'supply',
    title: 'Kennel Recovery Equipment & Steel Feeders',
    description: 'Upgrading kennel dividers, durable slip leashes, and rust-free heavy steel bowls to safeguard recovering rescue patients from contamination.',
    status: 'active',
    urgency: 'Moderate',
    targetQuantity: 95,
    fulfilledQuantity: 58,
    unit: 'pcs',
    items: [
      { item: 'Heavy Stainless Steel Bowls', required: 45, received: 34, unit: 'pcs' },
      { item: 'Reflective Safety Leashes', required: 30, received: 18, unit: 'pcs' },
      { item: 'Isolation Partition Panels', required: 20, received: 6, unit: 'panels' },
    ],
  },
  {
    id: 'camp-sup-03',
    ngoId: 'ngo-005',
    ngoName: 'Delhi Stray Friends',
    city: 'Delhi',
    type: 'supply',
    title: 'Puppy & Kitten Weaning Nutrition Drive',
    description: 'Newborn orphaned puppies and kittens require specialized weaning formula milk, nutritional pastes, and digestible puppy kibble for healthy survival.',
    status: 'active',
    urgency: 'High',
    targetQuantity: 160,
    fulfilledQuantity: 110,
    unit: 'kg',
    items: [
      { item: 'Esbilac Starter Formula', required: 50, received: 40, unit: 'cans' },
      { item: 'Starter Weaning Mousse Cans', required: 60, received: 48, unit: 'tins' },
      { item: 'High-Protein Puppy Kibble', required: 50, received: 22, unit: 'kg' },
    ],
  },
  {
    id: 'camp-sup-04',
    ngoId: 'ngo-006',
    ngoName: 'Chennai Animal Aid',
    city: 'Chennai',
    type: 'supply',
    title: 'Monsoon Waterproof Bedding & Dry Pallets',
    description: 'Elevated pet cots and dry water-resistant bedding mats to protect injured animals from monsoon ground moisture and cold damp shelter floors.',
    status: 'completed',
    urgency: 'Fulfilled',
    targetQuantity: 120,
    fulfilledQuantity: 120,
    unit: 'pieces',
    items: [
      { item: 'Elevated Waterproof Cots', required: 50, received: 50, unit: 'pieces' },
      { item: 'Heavy Insulated Jute Blankets', required: 70, received: 70, unit: 'pieces' },
    ],
  },
]

// Normalizing all supply campaigns with fallback items, cities, and status
const ALL_SUPPLY_CAMPAIGNS = [
  ...mockCampaigns.filter(c => c.type === 'supply').map(c => ({
    ...c,
    city: c.city || (c.ngoName?.includes('Prani') ? 'Kota' : 'Jaipur'),
    urgency: c.status === 'completed' ? 'Fulfilled' : 'High Urgency',
    items: c.items && c.items.length > 0 ? c.items : [
      {
        item: c.title.toLowerCase().includes('blanket') ? 'Fleece Winter Blankets' : 'Standard Supplies',
        required: c.targetQuantity || 150,
        received: c.fulfilledQuantity || (c.status === 'completed' ? 150 : 80),
        unit: c.unit || 'pieces',
      }
    ]
  })),
  ...SUPPLEMENTAL_SUPPLIES
]

export default function SuppliesPage() {
  const [activeType, setActiveType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [pledgeForm, setPledgeForm] = useState({
    selectedItem: '',
    quantity: '5',
    method: 'pickup',
    donorName: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [pledgeSubmitted, setPledgeSubmitted] = useState(false)

  // Filter campaigns
  const filteredCampaigns = ALL_SUPPLY_CAMPAIGNS.filter(campaign => {
    const supplyType = getSupplyType(campaign.title)
    const matchesType = activeType === 'all' || supplyType === activeType
    const matchesSearch = searchQuery.trim() === '' || 
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.ngoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.items?.some(i => i.item.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  // Open Pledge Modal
  const handleOpenPledge = (campaign) => {
    setSelectedCampaign(campaign)
    setPledgeForm({
      selectedItem: campaign.items?.[0]?.item || 'General Supplies',
      quantity: '5',
      method: 'pickup',
      donorName: '',
      phone: '',
      address: '',
      notes: '',
    })
    setPledgeSubmitted(false)
  }

  // Handle Pledge Submit
  const handlePledgeSubmit = (e) => {
    e.preventDefault()
    setPledgeSubmitted(true)
  }

  // Helper to get emoji for a supply type
  const getCardEmoji = (title) => {
    const type = getSupplyType(title)
    const found = SUPPLY_TYPES.find(t => t.id === type)
    return found ? found.emoji : '📦'
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased pb-20 md:pb-6">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-tight">
                Animal Lifeline
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest block">
                Supply Drives
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/nearby-ngos" className="hover:text-blue-600 transition-colors">
              Find NGOs
            </Link>
            <Link to="/foster" className="hover:text-blue-600 transition-colors">
              Foster & Adopt
            </Link>
            <Link to="/supplies" className="text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5">
              Donate Supplies
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              Join Us
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-14 px-6 text-white relative overflow-hidden shadow-lg">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-blue-100 text-xs md:text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Direct NGO Supply Fulfillment</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-sm"
          >
            Donate Supplies 📦
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            NGOs need more than money. Food, medicines, and shelter gear save lives.
          </motion.p>

          {/* 3 Pills */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm">
              <Box className="w-4 h-4 text-amber-300" />
              <span>48 Open Requests</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>12 Cities</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm">
              <Truck className="w-4 h-4 text-sky-200" />
              <span>Delivered in 48h</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 space-y-12">
        {/* How It Works (3 steps, horizontal on desktop, vertical on mobile) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              How Donating Supplies Works
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your physical donations directly empower animal shelters and emergency ambulances.
            </p>
          </div>

          <div className="relative">
            {/* Dashed Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-7 left-[18%] right-[18%] h-0.5 border-t-2 border-dashed border-blue-300 -z-0" />

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-600/30 border-4 border-white mb-4 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  Browse open requests
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed">
                  Explore verified urgent needs for food, medicines, bedding, and rescue equipment from registered NGOs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-600/30 border-4 border-white mb-4 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  Pledge what you can give
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed">
                  Select the exact items and quantity you wish to contribute, matching immediate shelter requirements.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-600/30 border-4 border-white mb-4 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  Drop off or schedule pick-up
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed">
                  Drop your items off at the NGO shelter or let Animal Lifeline dispatch a courier partner to collect from your door.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Pills and Search */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Active Supply Requests
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Showing {filteredCampaigns.length} verified drives currently accepting supplies
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items, city, NGO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills (horizontal scroll) */}
          <div className="flex items-center gap-2.5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 pt-1 scrollbar-none flex-nowrap scroll-smooth">
            {SUPPLY_TYPES.map((type) => {
              const isActive = activeType === type.id
              const count = type.id === 'all' 
                ? ALL_SUPPLY_CAMPAIGNS.length 
                : ALL_SUPPLY_CAMPAIGNS.filter(c => getSupplyType(c.title) === type.id).length

              return (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-sm shrink-0 border',
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  )}
                >
                  <span className="text-base">{type.emoji}</span>
                  <span>{type.label}</span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Supply Request Cards Grid */}
        <section>
          {filteredCampaigns.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
              <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Supply Requests Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
                We couldn't find any drives matching your selected filter or search term.
              </p>
              <button
                onClick={() => { setActiveType('all'); setSearchQuery('') }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => {
                const isCompleted = campaign.status === 'completed'
                const items = campaign.items || []

                // Calculate total received and required
                const totalRequired = items.reduce((acc, curr) => acc + (Number(curr.required) || 0), 0) || campaign.targetQuantity || 100
                const totalReceived = items.reduce((acc, curr) => acc + (Number(curr.received) || 0), 0) || campaign.fulfilledQuantity || (isCompleted ? totalRequired : 0)
                const overallPercent = Math.min(100, Math.round((totalReceived / totalRequired) * 100))

                return (
                  <motion.div
                    key={campaign.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={cn(
                      'bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-blue-200',
                      isCompleted && 'bg-slate-50/70 border-slate-200/90 opacity-90'
                    )}
                  >
                    <div>
                      {/* Top: Emoji, NGO Name + City Badge, Urgency Badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="text-[2.5rem] leading-none shrink-0"
                            role="img"
                            aria-label="supply emoji"
                          >
                            {getCardEmoji(campaign.title)}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate">
                              {campaign.ngoName}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {campaign.city}
                            </span>
                          </div>
                        </div>

                        {/* Urgency / Fulfilled Badge */}
                        <div className="shrink-0">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Fulfilled ✓
                            </span>
                          ) : (
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border',
                              campaign.urgency === 'Critical'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            )}>
                              <span className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                campaign.urgency === 'Critical' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                              )} />
                              {campaign.urgency || 'Urgent'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Short Description */}
                      <div className="space-y-1.5 mb-4">
                        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                          {campaign.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {campaign.description}
                        </p>
                      </div>

                      {/* Item-Level Progress Bars */}
                      <div className="space-y-2.5 py-3 border-t border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Required Supplies Breakdown
                        </span>
                        {items.map((item, idx) => {
                          const itemPct = Math.min(100, Math.round(((Number(item.received) || 0) / (Number(item.required) || 1)) * 100))
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 truncate max-w-[65%]">
                                  {item.item}
                                </span>
                                <span className="text-slate-500 text-[11px] shrink-0 font-medium">
                                  {item.received}/{item.required} {item.unit}
                                </span>
                              </div>
                              {/* Thin teal progress bar */}
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                  style={{ width: `${itemPct}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Total Progress Bar (Overall %) */}
                      <div className="pt-3 pb-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-700">Total Fulfillment</span>
                          <span className={cn(isCompleted ? 'text-emerald-600' : 'text-blue-600')}>
                            {overallPercent}% ({totalReceived}/{totalRequired} {campaign.unit || 'units'})
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-700',
                              isCompleted
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            )}
                            style={{ width: `${overallPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Button */}
                    <div className="pt-4 mt-auto">
                      {isCompleted ? (
                        <button
                          disabled
                          className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Drive Fulfilled & Delivered
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenPledge(campaign)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                          <span>Pledge Supplies</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* Impact Section */}
        <section className="bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 shrink-0">
              <Truck className="w-8 h-8 md:w-10 md:h-10 text-white animate-bounce" />
            </div>

            <div className="space-y-1 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100/70 px-2.5 py-0.5 rounded-full mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                Verified Supply Impact
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-snug">
                "Last month, <span className="text-blue-600 underline decoration-blue-300 underline-offset-4 font-black">2,340 kg</span> of food was delivered to <span className="text-blue-600 font-black">18 NGOs</span> across India through Animal Lifeline supply drives."
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                100% of physical donations are inspected, audited, and transported with live tracking directly to verified shelters.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
              <Link
                to="/nearby-ngos"
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs sm:text-sm rounded-xl border border-blue-200 transition-colors shadow-sm text-center"
              >
                View Recipient Shelters
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Pledge Supplies Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCampaign(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!pledgeSubmitted ? (
                <form onSubmit={handlePledgeSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Pledge Physical Supplies
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedCampaign.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Recipient: <strong className="text-slate-700">{selectedCampaign.ngoName}</strong> ({selectedCampaign.city})
                    </p>
                  </div>

                  {/* Item selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Select Item to Pledge
                    </label>
                    <select
                      value={pledgeForm.selectedItem}
                      onChange={(e) => setPledgeForm({ ...pledgeForm, selectedItem: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {selectedCampaign.items?.map((item, idx) => (
                        <option key={idx} value={item.item}>
                          {item.item} (Need: {item.required - item.received} {item.unit} remaining)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Pledge Quantity (Units / Kg / Packs)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={pledgeForm.quantity}
                      onChange={(e) => setPledgeForm({ ...pledgeForm, quantity: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Fulfillment Method */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Delivery / Handover Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPledgeForm({ ...pledgeForm, method: 'pickup' })}
                        className={cn(
                          'p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all text-center',
                          pledgeForm.method === 'pickup'
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <Truck className="w-4 h-4" />
                        <span>Schedule Pick-up</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPledgeForm({ ...pledgeForm, method: 'dropoff' })}
                        className={cn(
                          'p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all text-center',
                          pledgeForm.method === 'dropoff'
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Direct Drop-off</span>
                      </button>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohan Roy"
                        value={pledgeForm.donorName}
                        onChange={(e) => setPledgeForm({ ...pledgeForm, donorName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={pledgeForm.phone}
                        onChange={(e) => setPledgeForm({ ...pledgeForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {pledgeForm.method === 'pickup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Pick-up Address & Landmark
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Street, Building, City, Pincode"
                        value={pledgeForm.address}
                        onChange={(e) => setPledgeForm({ ...pledgeForm, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirm & Register My Pledge</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Verified NGO handover receipt provided upon receipt
                    </p>
                  </div>
                </form>
              ) : (
                /* Success View */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">
                      Pledge Confirmed! 🎉
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                      Thank you <strong className="text-slate-800">{pledgeForm.donorName || 'Kind Donor'}</strong>! Your pledge of{' '}
                      <span className="font-bold text-blue-600">
                        {pledgeForm.quantity} {pledgeForm.selectedItem}
                      </span>{' '}
                      for <strong className="text-slate-800">{selectedCampaign.ngoName}</strong> has been logged.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2">
                    <p className="font-bold text-slate-800">Next Steps:</p>
                    <p>• Our coordination volunteer will contact you on <strong>{pledgeForm.phone || 'your phone'}</strong>.</p>
                    <p>• {pledgeForm.method === 'pickup' ? 'Our courier partner will pick up the package within 48 hours.' : `You may drop off at the shelter at ${selectedCampaign.city}. Address details will be sent via SMS.`}</p>
                  </div>

                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 mt-16 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Package className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">Animal Lifeline Supply Drives</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/nearby-ngos" className="hover:text-white transition-colors">Shelters</Link>
            <Link to="/foster" className="hover:text-white transition-colors">Foster & Adoption</Link>
            <Link to="/supplies" className="hover:text-white transition-colors">Donate Supplies</Link>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Animal Lifeline India. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
