import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Building, MapPin, Save, AlertTriangle, Shield } from 'lucide-react'

// Real own profile: GET /ngo/profile. Editing uses the same combined
// endpoint as onboarding (POST /ngo/profile): documents not re-uploaded
// are kept, location is only overwritten when coordinates are sent, and
// — importantly — any update resets verificationStatus to pending for
// admin re-review. The old page showed the first invented NGO and its
// Save button did nothing at all.
export default function NGOProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ description: '', city: '', state: '', lng: '', lat: '' })
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  // Location edits come only from the device's current location — no
  // typed coordinates. Saving sends coordinates only when both are set;
  // restoring the saved values therefore keeps the stored location.
  const { location: geo, error: geoError, isLoading: geoLoading, requestLocation } = useGeolocation()
  useEffect(() => {
    if (geo?.lat != null && geo?.lng != null) {
      setFormData((f) => ({ ...f, lng: String(geo.lng), lat: String(geo.lat) }))
    }
  }, [geo])
  const savedLng = profile?.location?.coordinates?.[0] ?? ''
  const savedLat = profile?.location?.coordinates?.[1] ?? ''
  const locationChanged = formData.lng !== String(savedLng) || formData.lat !== String(savedLat)

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.get('/ngo/profile')
      const p = res.data?.data || null
      setProfile(p)
      if (p) {
        setFormData({
          description: p.description || '',
          city: p.address?.city || '',
          state: p.address?.state || '',
          lng: p.location?.coordinates?.[0] ?? '',
          lat: p.location?.coordinates?.[1] ?? '',
        })
      }
    } catch (err) {
      setError(err?.message || 'Could not load your NGO profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleSave = async () => {
    setSaveError('')
    setSaving(true)
    try {
      const form = new FormData()
      form.append('organizationName', profile.organizationName)
      form.append('registrationNumber', profile.registrationNumber)
      form.append('description', formData.description)
      form.append('street', profile.address?.street || '')
      form.append('city', formData.city)
      form.append('state', formData.state)
      form.append('pinCode', profile.address?.pinCode || '')
      form.append('animalsHandled', (profile.animalsHandled || []).join(','))
      form.append('servicesProvided', (profile.servicesProvided || []).join(','))
      if (formData.lng !== '' && formData.lat !== '') {
        form.append('lng', formData.lng)
        form.append('lat', formData.lat)
      }
      await API.post('/ngo/profile', form)
      setSaveSuccess(true)
      setIsEditing(false)
      fetchProfile()
    } catch (err) {
      setSaveError(err?.message || 'Profile could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading profile" /></div>
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Organization Profile</h1>
        <p className="text-sm text-slate-600 bg-white border rounded-2xl p-5">You have no NGO profile yet. Create one from the onboarding page — it is what lets verified NGOs accept emergencies, publish campaigns and post opportunities.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#183B35]">Organization Profile</h1>
        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-[#087F70] hover:bg-[#183B35] text-white disabled:opacity-50">
          <Save className="w-4 h-4" /> {isEditing ? (saving ? 'Saving…' : 'Save Changes') : 'Edit Profile'}
        </button>
      </div>

      {saveSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl p-4">Saved. Your verification status is now pending again, because the backend resets it on every profile update for admin re-review.</div>}
      {saveError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{saveError}</div>}
      {isEditing && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4">
          Saving this form resets your verification to pending, even if you only changed the description. Documents you do not re-upload here are kept.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDE9DF] flex items-center justify-center text-[#087F70] shrink-0"><Building className="w-7 h-7" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile.organizationName}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1"><Shield className="w-4 h-4 text-[#087F70]" /> Verification: {profile.verificationStatus}</p>
              <p className="text-sm text-slate-500">Registration: {profile.registrationNumber}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Description
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-700">City
                  <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </label>
                <label className="block text-xs font-bold text-slate-700">State
                  <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </label>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-700">Location (optional)</p>
                <button type="button" onClick={requestLocation} disabled={geoLoading} className="px-4 py-2.5 bg-white border border-teal-200 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-50 disabled:opacity-50">
                  {geoLoading ? 'Locating…' : 'Capture device location'}
                </button>
                {formData.lng !== '' && formData.lat !== '' && (
                  <p className="text-xs text-slate-600">{locationChanged ? 'New device location captured — saving will update it.' : 'Location saved for Nearby Help.'}
                    {locationChanged && (
                      <button type="button" onClick={() => setFormData({ ...formData, lng: String(savedLng), lat: String(savedLat) })} className="ml-2 font-bold text-teal-700 hover:underline">Keep saved location</button>
                    )}
                  </p>
                )}
                {formData.lng === '' && formData.lat === '' && <p className="text-xs text-slate-500">No location saved yet. Capturing sets it from this device — coordinates are never typed.</p>}
                {geoError && <p className="text-xs text-rose-600">{geoError}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-slate-600">
              <p>{profile.description}</p>
              <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {[profile.address?.street, profile.address?.city, profile.address?.state, profile.address?.pinCode].filter(Boolean).join(', ') || 'No address on file'}</p>
              {profile.location?.coordinates && <p>Location saved for Nearby Help</p>}
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Animals handled</h3>
            <div className="flex flex-wrap gap-1.5">{(profile.animalsHandled || []).map((a) => <span key={a} className="text-xs px-2 py-1 bg-slate-100 rounded-full">{a}</span>)}</div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Services provided</h3>
            <div className="flex flex-wrap gap-1.5">{(profile.servicesProvided || []).map((s) => <span key={s} className="text-xs px-2 py-1 bg-slate-100 rounded-full">{s}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
