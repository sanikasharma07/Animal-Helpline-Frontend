import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import API from '@/api/axios'
import { 
  Home, 
  Heart, 
  CheckCircle2, 
  MapPin, 
  Star, 
  ChevronRight, 
  PawPrint, 
  ArrowRight,
  ShieldCheck,
  Search,
  X,
  Sparkles,
  Calendar,
  Building2,
  Clock,
  Send,
  AlertCircle,
  Share2
} from 'lucide-react'

// Mock animal data (defined directly inline)
const MOCK_ANIMALS = [
  { 
    id: 'a-001', 
    name: 'Bruno', 
    species: 'dog', 
    breed: 'Labrador Mix', 
    age: '3 years', 
    gender: 'Male', 
    city: 'Jaipur', 
    ngo: 'Helping Paws Foundation', 
    status: 'needs_foster', 
    health: 'Recovering from surgery', 
    vaccinated: true, 
    sterilized: true, 
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&auto=format&fit=crop&q=70' 
  },
  { 
    id: 'a-002', 
    name: 'Mitthu', 
    species: 'bird', 
    breed: 'Indian Ringneck', 
    age: '2 years', 
    gender: 'Male', 
    city: 'Mumbai', 
    ngo: 'Mumbai Animal Rescue League', 
    status: 'for_adoption', 
    health: 'Fully recovered', 
    vaccinated: false, 
    sterilized: false, 
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400&auto=format&fit=crop&q=70' 
  },
  { 
    id: 'a-003', 
    name: 'Coco', 
    species: 'cat', 
    breed: 'Domestic Shorthair', 
    age: '1 year', 
    gender: 'Female', 
    city: 'Bangalore', 
    ngo: 'Bangalore Compassion Trust', 
    status: 'for_adoption', 
    health: 'Healthy', 
    vaccinated: true, 
    sterilized: true, 
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=70' 
  },
  { 
    id: 'a-004', 
    name: 'Sheru', 
    species: 'dog', 
    breed: 'Indian Pariah', 
    age: '5 years', 
    gender: 'Male', 
    city: 'Delhi', 
    ngo: 'Delhi Stray Friends', 
    status: 'needs_foster', 
    health: 'Healthy, high energy', 
    vaccinated: true, 
    sterilized: true, 
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&auto=format&fit=crop&q=70' 
  },
  { 
    id: 'a-005', 
    name: 'Gauri', 
    species: 'cattle', 
    breed: 'Desi Cow', 
    age: '4 years', 
    gender: 'Female', 
    city: 'Chennai', 
    ngo: 'Chennai Animal Aid', 
    status: 'needs_foster', 
    health: 'Post-surgery recovery', 
    vaccinated: true, 
    sterilized: false, 
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400&auto=format&fit=crop&q=70' 
  },
  { 
    id: 'a-006', 
    name: 'Luna', 
    species: 'cat', 
    breed: 'Persian Mix', 
    age: '8 months', 
    gender: 'Female', 
    city: 'Mumbai', 
    ngo: 'Mumbai Animal Rescue League', 
    status: 'for_adoption', 
    health: 'Healthy, playful', 
    vaccinated: true, 
    sterilized: true, 
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&auto=format&fit=crop&q=70' 
  },
]

const SPECIES_FILTERS = ['All', 'Dogs', 'Cats', 'Birds', 'Cattle']
const STATUS_FILTERS = ['All', 'For Adoption', 'Needs Foster']

export default function FosterPage() {
  const [activeSpecies, setActiveSpecies] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [actionType, setActionType] = useState('adopt') // 'foster' or 'adopt'
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [applicantForm, setApplicantForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    housingType: 'Apartment',
    hasPets: 'Yes, experienced pet parent',
    message: '',
  })
  // Live animal data from backend — falls back to MOCK_ANIMALS
  const [animals, setAnimals] = useState(MOCK_ANIMALS)
  const [animalsLoading, setAnimalsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchAnimals = async () => {
      setAnimalsLoading(true)
      try {
        // GET /api/v1/animals/available
        const res = await API.get('/animals/available')
        if (!cancelled && res.data?.data) {
          const mapped = res.data.data.map((a) => ({
            id: a._id,
            name: a.name || 'Unknown',
            species: (a.species || 'dog').toLowerCase(),
            breed: a.breed || 'Mixed Breed',
            age: a.age || 'Unknown',
            gender: a.gender || 'Unknown',
            city: a.ngo?.address?.city || a.city || '',
            ngo: a.ngo?.organizationName || 'Animal NGO',
            status: a.availabilityStatus === 'Available For Adoption' ? 'for_adoption' : 'needs_foster',
            health: a.healthStatus || 'Healthy',
            vaccinated: a.isVaccinated || false,
            sterilized: a.isSterilized || false,
            image: (a.photos && a.photos[0]) || MOCK_ANIMALS[0].image,
          }))
          setAnimals(mapped)
        }
      } catch {
        // Network error or backend offline — keep MOCK_ANIMALS
      } finally {
        if (!cancelled) setAnimalsLoading(false)
      }
    }
    fetchAnimals()
    return () => { cancelled = true }
  }, [])

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Filter animals (uses live data if available, otherwise mock)
  const filteredAnimals = animals.filter((animal) => {
    // Species filter
    let matchSpecies = true
    if (activeSpecies === 'Dogs') matchSpecies = animal.species === 'dog'
    else if (activeSpecies === 'Cats') matchSpecies = animal.species === 'cat'
    else if (activeSpecies === 'Birds') matchSpecies = animal.species === 'bird'
    else if (activeSpecies === 'Cattle') matchSpecies = animal.species === 'cattle'

    // Status filter
    let matchStatus = true
    if (activeStatus === 'For Adoption') matchStatus = animal.status === 'for_adoption'
    else if (activeStatus === 'Needs Foster') matchStatus = animal.status === 'needs_foster'

    // Search query
    const matchSearch = searchQuery.trim() === '' || 
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.ngo.toLowerCase().includes(searchQuery.toLowerCase())

    return matchSpecies && matchStatus && matchSearch
  })

  // Open Application Modal
  const handleOpenModal = (animal, type) => {
    setSelectedAnimal(animal)
    setActionType(type)
    setApplicationSubmitted(false)
    setApplicantForm({
      fullName: '',
      phone: '',
      email: '',
      city: animal.city || '',
      housingType: 'Apartment',
      hasPets: 'Yes, experienced pet parent',
      message: '',
    })
  }

  const handleSubmitApplication = (e) => {
    e.preventDefault()
    setApplicationSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased pb-20 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-tight">
                Animal Lifeline
              </span>
              <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-widest block">
                Foster & Adoption
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/nearby-ngos" className="hover:text-purple-600 transition-colors">
              Find NGOs
            </Link>
            <Link to="/supplies" className="hover:text-purple-600 transition-colors">
              Donate Supplies
            </Link>
            <Link to="/foster" className="text-purple-600 font-bold border-b-2 border-purple-600 pb-0.5">
              Foster & Adopt
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-purple-600 transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-teal-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero (purple gradient from-purple-600 via-violet-600 to-teal-600, py-14 px-6) */}
      <section className="bg-gradient-to-r from-purple-600 via-violet-600 to-teal-600 py-14 px-6 text-white relative overflow-hidden shadow-lg">
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Large Home icon with animated heart pulse */}
          <div className="inline-flex items-center justify-center">
            <div className="relative w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-xl">
              <Home className="w-10 h-10 text-white drop-shadow-sm" />
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center shadow-md"
              >
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </motion.div>
            </div>
          </div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-sm"
          >
            Give a Home, Change a Life 🏠
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Every animal deserves a safe space. Foster temporarily or adopt forever.
          </motion.p>

          {/* 3 Stats: "1,240 Animals Placed", "Foster Available", "Adoption Ready" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-2"
          >
            <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-sm flex items-center gap-2 sm:gap-2.5">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              <div className="text-left">
                <span className="block text-sm font-black leading-none">1,240</span>
                <span className="text-[11px] text-purple-100 font-medium leading-none">Animals Placed</span>
              </div>
            </div>

            <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-sm flex items-center gap-2 sm:gap-2.5">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="text-left">
                <span className="block text-sm font-black leading-none">
                  {animals.filter(a => a.status === 'needs_foster').length} Needed
                </span>
                <span className="text-[11px] text-purple-100 font-medium leading-none">Foster Available</span>
              </div>
            </div>


            <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-sm flex items-center gap-2 sm:gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <div className="text-left">
                <span className="block text-sm font-black leading-none">
                  {animals.filter(a => a.status === 'for_adoption').length} Ready
                </span>
                <span className="text-[11px] text-purple-100 font-medium leading-none">Adoption Ready</span>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 space-y-12">
        {/* Foster vs Adopt Explainer (2 cards side by side, bg-purple-50 / bg-teal-50) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Foster */}
          <div className="bg-purple-50 rounded-2xl p-6 sm:p-7 border border-purple-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-purple-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-200/60 text-purple-800">
                  Temporary Love & Care
                </span>
                <span className="text-2xl" role="img" aria-label="foster heart">
                  🩺
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Foster: Healing Bridge
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                Temporary care. You keep the animal while it heals. NGO covers vet costs.
              </p>

              <ul className="space-y-2 pt-1 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Full Veterinary Care:</strong> Medical procedures, vaccinations, and recovery medicines are 100% NGO-sponsored.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Flexible Duration:</strong> Typically 2 weeks to 3 months while the animal recovers from surgery or trauma.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Frees Shelter Space:</strong> Fostering opens a shelter spot for another critical rescue on the streets.</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-purple-200/60 flex items-center justify-between text-xs text-purple-800 font-bold">
              <span>Ideal for compassionate homes wanting to help without a 15-year commitment</span>
            </div>
          </div>

          {/* Card 2: Adopt */}
          <div className="bg-teal-50 rounded-2xl p-6 sm:p-7 border border-teal-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-teal-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-200/60 text-teal-800">
                  Forever Companion
                </span>
                <span className="text-2xl" role="img" aria-label="adopt home">
                  🏡
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Adopt: A Forever Home
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                Permanent home. Full responsibility. Tax benefits may apply.
              </p>

              <ul className="space-y-2 pt-1 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Lifetime Bond:</strong> Welcome a loyal companion into your family with complete legal adoption certification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Healthy & Vaccinated:</strong> Animals are vetted, vaccinated, dewormed, and behaviorally assessed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Ongoing NGO Support:</strong> Community helpline access and behavioral tips whenever you need guidance.</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-teal-200/60 flex items-center justify-between text-xs text-teal-800 font-bold">
              <span>Best for individuals and families ready for a permanent, loving furry family member</span>
            </div>
          </div>
        </section>

        {/* Filter Row: Species and Status Filter Groups Side-by-Side */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Find Your Rescue Match</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Showing {filteredAnimals.length} animal companions available for foster or adoption
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, breed, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
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

          {/* Two filter groups side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Group 1: Species */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Filter by Species
              </span>
              <div className="flex flex-wrap gap-2">
                {SPECIES_FILTERS.map((species) => {
                  const isActive = activeSpecies === species
                  return (
                    <button
                      key={species}
                      onClick={() => setActiveSpecies(species)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0',
                        isActive
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/25'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      )}
                    >
                      {species}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Group 2: Status */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Filter by Status
              </span>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((status) => {
                  const isActive = activeStatus === status
                  return (
                    <button
                      key={status}
                      onClick={() => setActiveStatus(status)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0',
                        isActive
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/25'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      )}
                    >
                      {status}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Animal Cards Grid (grid-cols-2 gap-4 on mobile, grid-cols-3 on desktop) */}
        <section>
          {filteredAnimals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
              <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Animals Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
                No rescue animals matched your current species or status filters.
              </p>
              <button
                onClick={() => { setActiveSpecies('All'); setActiveStatus('All'); setSearchQuery('') }}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredAnimals.map((animal) => {
                const isFavorite = favorites.includes(animal.id)
                const isFoster = animal.status === 'needs_foster'

                return (
                  <motion.div
                    key={animal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Header with status overlay & favorite button */}
                      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
                        <img
                          src={animal.image}
                          alt={animal.name}
                          className="h-36 sm:h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Status badge overlay (absolute top-2 right-2): For Adoption (emerald) or Needs Foster (amber) */}
                        <div className="absolute top-2 right-2 z-10">
                          {isFoster ? (
                            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="hidden xs:inline">Needs</span> Foster
                            </span>
                          ) : (
                            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="hidden xs:inline">For</span> Adopt
                            </span>
                          )}
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={() => toggleFavorite(animal.id)}
                          className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                          aria-label="Add to favorites"
                        >
                          <Heart
                            className={cn(
                              'w-4 h-4 transition-colors',
                              isFavorite ? 'text-rose-500 fill-rose-500' : 'text-white'
                            )}
                          />
                        </button>
                      </div>

                      {/* Padding p-3 sm:p-4 */}
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        {/* Name (font-bold text-base), breed + age (text-xs text-slate-500) */}
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                              {animal.name}
                            </h3>
                            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 shrink-0 ml-1">
                              {animal.gender}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                            {animal.breed} • {animal.age}
                          </p>
                        </div>

                        {/* City with MapPin icon */}
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-600 font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{animal.city}</span>
                        </div>

                        {/* Health status chip */}
                        <div>
                          <span className="text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium block truncate">
                            🩺 {animal.health}
                          </span>
                        </div>

                        {/* Two badges: vaccinated ✓ / sterilized ✓ in green pills */}
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          <span
                            className={cn(
                              'text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1',
                              animal.vaccinated
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500'
                            )}
                          >
                            Vaccinated {animal.vaccinated ? '✓' : '—'}
                          </span>
                          <span
                            className={cn(
                              'text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1',
                              animal.sterilized
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500'
                            )}
                          >
                            Sterilized {animal.sterilized ? '✓' : '—'}
                          </span>
                        </div>

                        {/* NGO name (text-xs text-slate-400) */}
                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate pt-1 border-t border-slate-100">
                          Rescued by {animal.ngo}
                        </p>
                      </div>
                    </div>

                    {/* Two full-width buttons stacked: "Foster" (teal outline) + "Adopt" (teal filled) */}
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 space-y-1.5 sm:space-y-2 mt-auto">
                      <button
                        onClick={() => handleOpenModal(animal, 'foster')}
                        className="w-full py-1.5 sm:py-2 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer truncate"
                      >
                        <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">Foster {animal.name}</span>
                      </button>

                      <button
                        onClick={() => handleOpenModal(animal, 'adopt')}
                        className="w-full py-1.5 sm:py-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-teal-600/20 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer truncate"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                        <span className="truncate">Adopt {animal.name}</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* Process Steps: How to Apply → Meet the Animal → Home Check → Welcome Home! */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              Seamless Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Our 4-Step Placement Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ensuring happy, safe, and compatible lifelong bonds between animals and their humans.
            </p>
          </div>

          <div className="relative">
            {/* Desktop horizontal connecting dashed line */}
            <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-teal-300 -z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="w-14 h-14 rounded-full bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-teal-600/30 border-4 border-white mb-3">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  How to Apply
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  Submit an online foster or adoption application with your lifestyle & accommodation details.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="w-14 h-14 rounded-full bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-teal-600/30 border-4 border-white mb-3">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  Meet the Animal
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  Schedule an in-person or video meet-and-greet with the shelter or current foster caregiver.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="w-14 h-14 rounded-full bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-teal-600/30 border-4 border-white mb-3">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  Home Check
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  A quick friendly safety check to verify secure balconies, yard gates, and peaceful resting spots.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center p-3">
                <div className="w-14 h-14 rounded-full bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-teal-600/30 border-4 border-white mb-3">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  Welcome Home!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  Receive vaccination records, starter guidelines, and welcome your new friend into their sanctuary.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Application Modal */}
      <AnimatePresence>
        {selectedAnimal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAnimal(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!applicationSubmitted ? (
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Top animal summary */}
                  <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
                    <img
                      src={selectedAnimal.image}
                      alt={selectedAnimal.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1',
                        actionType === 'foster' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                      )}>
                        {actionType === 'foster' ? 'Foster Request' : 'Permanent Adoption'}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">
                        Apply to {actionType === 'foster' ? 'Foster' : 'Adopt'} {selectedAnimal.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedAnimal.breed} • {selectedAnimal.ngo} ({selectedAnimal.city})
                      </p>
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sanika Sharma"
                        value={applicantForm.fullName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                        value={applicantForm.phone}
                        onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={applicantForm.email}
                        onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Your City & Area
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indiranagar, Bangalore"
                        value={applicantForm.city}
                        onChange={(e) => setApplicantForm({ ...applicantForm, city: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Housing Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Type of Residence
                    </label>
                    <select
                      value={applicantForm.housingType}
                      onChange={(e) => setApplicantForm({ ...applicantForm, housingType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Apartment">Apartment / Flat (Pet-friendly society)</option>
                      <option value="Independent House">Independent Villa / House with Yard</option>
                      <option value="Farm / Goshala">Farm / Goshala / Open Land</option>
                    </select>
                  </div>

                  {/* Notes / Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Tell us briefly about your home environment
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. We have a quiet balcony, someone is always at home, experienced with rescue dogs."
                      value={applicantForm.message}
                      onChange={(e) => setApplicantForm({ ...applicantForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit {actionType === 'foster' ? 'Foster' : 'Adoption'} Application</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      Directly routed to {selectedAnimal.ngo} adoption coordinator
                    </p>
                  </div>
                </form>
              ) : (
                /* Success Confirmation View */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">
                      Application Received! 🐾
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                      Thank you <strong className="text-slate-800">{applicantForm.fullName || 'Kind Friend'}</strong>! Your{' '}
                      <span className="font-bold text-teal-600">
                        {actionType === 'foster' ? 'foster inquiry' : 'adoption application'}
                      </span>{' '}
                      for <strong className="text-slate-800">{selectedAnimal.name}</strong> has reached{' '}
                      <strong className="text-slate-800">{selectedAnimal.ngo}</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2">
                    <p className="font-bold text-slate-800">What happens next:</p>
                    <p>• The shelter team will review your contact info ({applicantForm.phone || 'provided phone'}).</p>
                    <p>• Expect a call or WhatsApp message within 24–48 hours to schedule a meet-and-greet.</p>
                  </div>

                  <button
                    onClick={() => setSelectedAnimal(null)}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
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
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <PawPrint className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">Animal Lifeline Foster & Adoption</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/nearby-ngos" className="hover:text-white transition-colors">Shelters</Link>
            <Link to="/supplies" className="hover:text-white transition-colors">Donate Supplies</Link>
            <Link to="/foster" className="hover:text-white transition-colors">Foster & Adoption</Link>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Animal Lifeline India. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
