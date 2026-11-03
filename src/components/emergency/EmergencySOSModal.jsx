import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { reportEmergency, closeSOSModal } from '@/store/slices/emergencySlice'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Siren, Upload, MapPin, X, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle } from 'lucide-react'

// Emergency reporting, rewritten honestly. The previous modal:
//  - pre-filled a Delhi location (Connaught Place, 28.6315/77.2167) and a
//    fake phone number, so a case could be filed at the wrong place;
//  - offered a "simulated camera" that attached a stock photo from
//    Unsplash as if it were evidence of the animal;
//  - called itself "Broadcaster Mode" / "Dispatch", implying NGOs were
//    alerted. The backend report only creates a case: no NGO is notified
//    or assigned until a verified NGO accepts it.
// This version: no default location at all — the case location comes
// only from the device's current location via useGeolocation (no typed
// coordinates anywhere; if location access is denied, the user cannot
// submit until they allow it). Only real photos the user uploads
// (optional, max 3, as the backend allows),
// species + description only (the backend has no severity field), and
// copy that says exactly what reporting does and does not do.
const SPECIES = ['Dog', 'Cat', 'Cow', 'Bird', 'Horse', 'Other']

export default function EmergencySOSModal() {
  const dispatch = useDispatch()
  const { isSOSModalOpen, isLoading, error, successMessage, activeCase } = useSelector((state) => state.emergency)
  const { location: geo, error: geoError, isLoading: geoLoading, requestLocation } = useGeolocation()

  const [step, setStep] = useState(1)
  const [species, setSpecies] = useState('Dog')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [localError, setLocalError] = useState('')

  if (!isSOSModalOpen) return null

  const handleClose = () => {
    setStep(1)
    setPhotos([])
    setDescription('')
    setLocalError('')
    dispatch(closeSOSModal())
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    setPhotos(files)
  }

  // Device location only — no typed coordinates exist in this modal.
  const resolvedLat = geo?.lat ?? null
  const resolvedLng = geo?.lng ?? null
  const hasLocation = Number.isFinite(resolvedLat) && Number.isFinite(resolvedLng)
    && resolvedLat >= -90 && resolvedLat <= 90 && resolvedLng >= -180 && resolvedLng <= 180

  const handleSubmit = () => {
    if (!description.trim()) { setLocalError('Please describe what is wrong with the animal.'); return }
    if (!hasLocation) { setLocalError('Location is required. Allow location access and tap “Use my device location” — coordinates are never typed in this app.'); return }
    setLocalError('')
    dispatch(reportEmergency({ species, quickDescription: description.trim(), longitude: resolvedLng, latitude: resolvedLat, mediaFiles: photos }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Report an animal emergency">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Siren className="w-5 h-5 text-rose-600" /> Report an emergency</h2>
          <button onClick={handleClose} aria-label="Close" className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>

        {successMessage ? (
          <div className="p-6 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Emergency reported</h3>
            <p className="text-sm text-slate-600">{successMessage}</p>
            <p className="text-xs text-slate-500">Reporting does not dispatch anyone automatically. A verified NGO must accept the case first; its progress updates will appear on the case page.</p>
            {activeCase?._id && <Link to={`/tracker/${activeCase._id}`} onClick={handleClose} className="inline-block px-6 py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl">Track this case</Link>}
            <button onClick={handleClose} className="block mx-auto text-sm font-semibold text-slate-600 hover:text-slate-900">Close</button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {(error || localError || geoError) && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-3 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" /><span>{localError || error || geoError}</span></div>
            )}
            <p className="text-xs text-slate-500">Step {step} of 3. Keep it simple: a photo helps, but the location and a clear description are what a rescuer needs.</p>

            {step === 1 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900">Photo (optional, up to 3)</h3>
                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-teal-300">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">Upload photos of the animal</span>
                  <span className="text-xs text-slate-400">Only photos you take or upload are attached. No stock photos.</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                </label>
                {photos.length > 0 && <p className="text-sm text-slate-600">{photos.length} photo{photos.length > 1 ? 's' : ''} selected: {photos.map((f) => f.name).join(', ')}</p>}
                <button onClick={() => setStep(2)} className="w-full py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-1">Continue <ChevronRight className="w-4 h-4" /></button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900">What animal is it, and what is wrong?</h3>
                <div className="flex flex-wrap gap-2">
                  {SPECIES.map((s) => (
                    <button key={s} onClick={() => setSpecies(s)} className={`px-4 py-2 rounded-full text-sm font-semibold border ${species === s ? 'bg-[#087F70] text-white border-[#087F70]' : 'bg-white text-slate-700 border-slate-200'}`}>{s}</button>
                  ))}
                </div>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Example: Injured street dog near the market gate, unable to walk, bleeding from a hind leg." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl flex items-center justify-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
                  <button onClick={() => setStep(3)} disabled={!description.trim()} className="flex-1 py-3 bg-[#087F70] text-white text-sm font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-1">Continue <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#087F70]" /> Where is the animal?</h3>
                <p className="text-sm text-slate-600">The case location comes from your device’s current location. Tap below and allow location access — there is no way to type coordinates.</p>
                <button onClick={requestLocation} disabled={geoLoading} className="w-full py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl disabled:opacity-50">{geoLoading ? 'Locating…' : 'Use my device location'}</button>
                {geo && <p className="text-sm text-emerald-700">Device location captured. A verified NGO will see this location when it accepts the case.</p>}
                {geoError && <p className="text-sm text-rose-600">{geoError} Reporting needs location access, so please allow it in your browser and try again.</p>}
                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl flex items-center justify-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
                  <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-3 bg-[#C96A4A] text-white text-sm font-bold rounded-xl disabled:opacity-50">{isLoading ? 'Reporting…' : 'Report emergency'}</button>
                </div>
                <p className="text-xs text-slate-400">Submitting creates a case that verified NGOs can accept. It does not automatically notify or dispatch anyone.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
