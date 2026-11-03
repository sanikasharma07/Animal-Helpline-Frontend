import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import API from '@/api/axios'
import AuthRequiredState from '@/components/common/AuthRequiredState'
import { PawPrint, Search, X, CheckCircle2, AlertCircle, Building2, Heart } from 'lucide-react'

// Foster & adoption are real only. Backend animal fields are:
// { name, species, breed, age, description, medicalHistory, media[],
//   status: "Available for Foster" | "Available for Adoption" | …,
//   ngo (populated: organizationName) }.
// There is no gender, vaccination, sterilisation or city field on the
// animal, and no rating — the old page invented all of them, plus six
// invented animals, and its application form never called any API while
// reporting success. Applying is:
//   POST /animals/:id/apply { applicationType: "Foster"|"Adoption",
//     experience, homeEnvironment } — both text fields are required by
//     the backend, and a duplicate application is refused.
const SPECIES_FILTERS = ['All', 'Dog', 'Cat', 'Bird', 'Cattle', 'Other']
const STATUS_FILTERS = ['All', 'Available for Foster', 'Available for Adoption']

export default function FosterPage() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeSpecies, setActiveSpecies] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [actionType, setActionType] = useState('Adoption')
  const [experience, setExperience] = useState('')
  const [homeEnvironment, setHomeEnvironment] = useState('')
  const [applyError, setApplyError] = useState('')
  const [applySuccess, setApplySuccess] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    const fetchAnimals = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await API.get('/animals/available')
        if (!cancelled) setAnimals(res.data?.data || [])
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Could not load available animals.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAnimals()
    return () => { cancelled = true }
  }, [isAuthenticated])

  const toggleFavorite = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const filtered = animals.filter((a) => {
    if (activeSpecies !== 'All') {
      const sp = (a.species || '').toLowerCase()
      if (activeSpecies === 'Other' ? ['dog', 'cat', 'bird', 'cattle'].includes(sp) : sp !== activeSpecies.toLowerCase()) return false
    }
    if (activeStatus !== 'All' && a.status !== activeStatus) return false
    const q = searchQuery.trim().toLowerCase()
    if (q && !`${a.name} ${a.breed} ${a.species} ${a.ngo?.organizationName || ''}`.toLowerCase().includes(q)) return false
    return true
  })

  const handleSubmitApplication = async (e) => {
    e.preventDefault()
    setApplyError('')
    setApplying(true)
    try {
      await API.post(`/animals/${selectedAnimal._id}/apply`, {
        applicationType: actionType,
        experience: experience.trim(),
        homeEnvironment: homeEnvironment.trim(),
      })
      setApplySuccess(true)
    } catch (err) {
      setApplyError(err?.message || 'Application could not be submitted.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-slate-800 pb-20 md:pb-6">
      <header className="sticky top-0 z-40 bg-[#F7F5EF]/90 backdrop-blur-md border-b border-[#DDE9DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#087F70] flex items-center justify-center text-white"><PawPrint className="w-5 h-5" /></div>
            <div>
              <span className="font-extrabold text-[#183B35] text-lg tracking-tight block leading-tight">Animal Lifeline</span>
              <span className="text-[10px] font-semibold text-[#087F70] uppercase tracking-widest block">Foster &amp; Adoption</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/nearby-ngos" className="hover:text-[#087F70]">Find NGOs</Link>
            <Link to="/supplies" className="hover:text-[#087F70]">Donate Supplies</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#183B35]">Foster &amp; adopt, for real</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">Animals listed by verified NGOs that are ready for a foster home or adoption. Applying sends a real application to the NGO, which approves or rejects it — this page never pretends an application was sent when it was not.</p>
        </div>

        {!isAuthenticated ? (
          <AuthRequiredState title="Sign in to see available animals" message="Available animals are listed for signed-in users, because the backend requires authentication for the animals list." />
        ) : loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading animals" /></div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search by name, breed or NGO…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {SPECIES_FILTERS.map((sp) => (
                  <button key={sp} onClick={() => setActiveSpecies(sp)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${activeSpecies === sp ? 'bg-[#087F70] text-white border-[#087F70]' : 'bg-white text-slate-600 border-slate-200'}`}>{sp}</button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {STATUS_FILTERS.map((st) => (
                  <button key={st} onClick={() => setActiveStatus(st)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${activeStatus === st ? 'bg-[#183B35] text-white border-[#183B35]' : 'bg-white text-slate-600 border-slate-200'}`}>{st === 'All' ? 'All statuses' : st}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-slate-500 text-sm">No animals match right now. When a verified NGO lists one, it appears here.</div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a) => (
                  <article key={a._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                    {a.media?.[0] ? (
                      <img src={a.media[0]} alt={a.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-[#DDE9DF] flex items-center justify-center text-[#183B35]"><PawPrint className="w-10 h-10" /></div>
                    )}
                    <div className="p-5 space-y-2 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-bold text-lg text-[#183B35]">{a.name}</h2>
                        <button onClick={() => toggleFavorite(a._id)} aria-label={favorites.includes(a._id) ? 'Remove from favourites' : 'Save as favourite'} className="p-1.5 rounded-full hover:bg-rose-50">
                          <Heart className={`w-5 h-5 ${favorites.includes(a._id) ? 'text-rose-500 fill-current' : 'text-slate-300'}`} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-600">{a.species} • {a.breed} • {a.age}</p>
                      <p className="text-sm text-slate-600 line-clamp-3">{a.description}</p>
                      {a.medicalHistory && <p className="text-xs text-slate-500">Medical notes: {a.medicalHistory}</p>}
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-auto pt-2"><Building2 size={13} /> {a.ngo?.organizationName || 'Verified NGO'}</p>
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#DDE9DF] text-[#183B35] self-start">{a.status}</span>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button onClick={() => { setSelectedAnimal(a); setActionType('Foster'); setExperience(''); setHomeEnvironment(''); setApplyError(''); setApplySuccess(false) }} className="py-2.5 bg-white border border-[#087F70] text-[#087F70] text-sm font-bold rounded-xl hover:bg-teal-50">Foster</button>
                        <button onClick={() => { setSelectedAnimal(a); setActionType('Adoption'); setExperience(''); setHomeEnvironment(''); setApplyError(''); setApplySuccess(false) }} className="py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl hover:bg-[#183B35]">Adopt</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setSelectedAnimal(null)} />
          <form onSubmit={handleSubmitApplication} className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#183B35]">{actionType} {selectedAnimal.name}</h3>
                <p className="text-xs text-slate-500">{selectedAnimal.ngo?.organizationName || 'Verified NGO'} will approve or reject this application.</p>
              </div>
              <button type="button" onClick={() => setSelectedAnimal(null)} aria-label="Close"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {applySuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-900">Application submitted</p>
                <p className="text-sm text-slate-600">The NGO has received it. If you already applied for this animal, the backend refuses duplicates — that error would have been shown instead.</p>
                <button type="button" onClick={() => setSelectedAnimal(null)} className="px-4 py-2.5 bg-[#087F70] text-white text-sm font-bold rounded-xl">Done</button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-slate-700">Your experience with animals (required)
                  <textarea required value={experience} onChange={(e) => setExperience(e.target.value)} rows={3} placeholder="Previous pets, fostering, handling experience…" className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </label>
                <label className="block text-xs font-bold text-slate-700">Home environment (required)
                  <textarea required value={homeEnvironment} onChange={(e) => setHomeEnvironment(e.target.value)} rows={3} placeholder="Housing type, space, other pets, who is at home…" className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </label>
                {applyError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{applyError}</div>}
                <button type="submit" disabled={applying} className="w-full py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl disabled:opacity-50">{applying ? 'Submitting…' : `Submit ${actionType} application`}</button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
