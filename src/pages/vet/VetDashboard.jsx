import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/store/slices/authSlice'
import API from '@/api/axios'
import NotificationsPanel from '@/components/common/NotificationsPanel'
import { Stethoscope, Shield, AlertTriangle, LogOut, MapPin } from 'lucide-react'

// Veterinary dashboard. The backend vet workflow is: register a profile
// (POST /vets/profile, multipart licence + degree documents), wait for
// admin approval (GET /admin/vet/pending, PATCH /admin/vet/:id/verify),
// then appear in verified/nearby lists. Vets are NOT assigned emergency
// cases in the backend — only verified NGOs accept cases — so this page
// does not pretend to show assigned rescues. It shows the vet's own
// profile and verification status, plus the discovery surface vets do
// appear in (Nearby Help). Updating the profile (PATCH /vets/profile)
// resets verification to pending, as with NGOs.
export default function VetDashboard() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    API.get('/vets/profile')
      .then((res) => { if (!cancelled) setProfile(res.data?.data || null) })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Could not load your vet profile.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-20 md:pb-6">
      <header className="bg-white border-b border-[#DDE9DF] px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DDE9DF] flex items-center justify-center text-[#087F70]"><Stethoscope className="w-5 h-5" /></div>
          <h1 className="font-display font-bold text-lg text-[#183B35]">Vet Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600"><LogOut className="w-4 h-4" /> Sign out</button>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <p className="text-sm text-slate-600">Welcome, {user?.name || 'veterinary professional'}. Your profile and verification status are below. Once approved, you appear in Nearby Help and the verified vets list for people near you.</p>

        {loading && <p className="text-sm text-slate-500">Loading profile…</p>}
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}

        {!loading && !profile && !error && (
          <div className="bg-white border rounded-2xl p-6 space-y-3">
            <h2 className="font-bold text-[#183B35]">No vet profile yet</h2>
            <p className="text-sm text-slate-600">Vet registration is not yet a page in this frontend: it requires licence and degree document uploads through POST /vets/profile. Until that form is added, registration happens through the API. This page will show your profile once one exists — it does not invent one.</p>
          </div>
        )}

        {profile && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#183B35]">{profile.clinicName}</h2>
                <p className="text-sm text-slate-500">{profile.specialization}{profile.qualifications ? ` • ${profile.qualifications}` : ''}</p>
                <p className="text-sm text-slate-500">Licence: {profile.licenseNumber}{profile.yearsExperience != null ? ` • ${profile.yearsExperience} years experience` : ''}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full self-start ${profile.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                {profile.verificationStatus}
              </span>
            </div>
            <p className="text-sm text-slate-600 flex items-center gap-1"><Shield className="w-4 h-4 text-[#087F70]" /> {profile.verificationStatus === 'verified' ? 'Approved vets appear in Nearby Help with contact details.' : profile.verificationStatus === 'rejected' ? `Rejected${profile.rejectionReason ? `: ${profile.rejectionReason}` : ''}. Updating your profile resets verification to pending.` : 'Pending admin review. You do not yet appear in Nearby Help.'}</p>
            <p className="text-sm text-slate-600">{[profile.address?.street, profile.address?.city, profile.address?.state, profile.address?.pinCode].filter(Boolean).join(', ')}</p>
            {profile.location?.coordinates && <p className="text-sm text-slate-600 flex items-center gap-1"><MapPin className="w-4 h-4" /> Coordinates on file: {profile.location.coordinates[1]}, {profile.location.coordinates[0]}</p>}
            {(profile.servicesProvided || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">{profile.servicesProvided.map((s) => <span key={s} className="text-xs px-2 py-1 bg-slate-100 rounded-full">{s}</span>)}</div>
            )}
            <Link to="/nearby-ngos" className="inline-flex text-sm font-bold text-[#087F70] hover:underline">See how you appear in Nearby Help →</Link>
          </div>
        )}

        <NotificationsPanel />
      </main>
    </div>
  )
}
