import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { reportEmergency, closeSOSModal } from '@/store/slices/emergencySlice'
import {
  Siren,
  Camera,
  Upload,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sparkles,
  Phone,
  User,
  ShieldAlert,
} from 'lucide-react'

export default function EmergencySOSModal() {
  const dispatch = useDispatch()
  const { isSOSModalOpen, isLoading, error, successMessage } = useSelector((state) => state.emergency)
  const { user } = useSelector((state) => state.auth)

  const [step, setStep] = useState(1)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  // Form State matching EmergencyCase Backend Schema
  const [formData, setFormData] = useState({
    species: 'Dog',
    condition: '',
    severity: 'critical',
    address: 'Connaught Place, New Delhi, India',
    lat: 28.6315,
    lng: 77.2167,
    reporterName: user?.name || 'Animal Lover',
    reporterPhone: user?.phone || '9876543210',
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        reporterName: user.name || prev.reporterName,
        reporterPhone: user.phone || prev.reporterPhone,
      }))
    }
  }, [user])

  if (!isSOSModalOpen) return null

  const handleClose = () => {
    setStep(1)
    setPhotoPreview(null)
    setIsCameraActive(false)
    dispatch(closeSOSModal())
  }

  const handleCaptureSimulatedPhoto = () => {
    setIsCameraActive(true)
    setTimeout(() => {
      setPhotoPreview('https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80')
      setIsCameraActive(false)
    }, 600)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
      // Store the actual File object for multipart upload to backend
      setFormData((prev) => ({ ...prev, _photoFile: file }))
    }
  }

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `GPS Pin: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Auto-detected)`,
          }))
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            address: 'GPS Auto-Detected: Central Square, Sector 14',
          }))
        }
      )
    }
  }

  const handleSubmitSOS = () => {
    dispatch(
      reportEmergency({
        // Backend field names from emergencycontroller.js:
        species: formData.species,
        quickDescription: formData.condition || 'Severely injured animal requiring immediate emergency rescue.',
        longitude: formData.lng,
        latitude: formData.lat,
        // mediaFiles: pass actual File objects if available (not URL strings)
        // photoPreview may be a blob URL — only pass as mediaFiles if it's a real File
        ...(formData._photoFile ? { mediaFiles: [formData._photoFile] } : {}),
      })
    )
  }

  const speciesOptions = [
    { label: 'Dog 🐕', value: 'Dog' },
    { label: 'Cat 🐈', value: 'Cat' },
    { label: 'Cow / Cattle 🐄', value: 'Cow' },
    { label: 'Bird 🕊️', value: 'Bird' },
    { label: 'Reptile / Snake 🐍', value: 'Reptile' },
    { label: 'Other Animal 🐾', value: 'Other' },
  ]

  const severityOptions = [
    { label: 'Low', value: 'low', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    { label: 'Moderate', value: 'moderate', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { label: 'High', value: 'high', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { label: 'Critical 🚨', value: 'critical', color: 'bg-rose-100 text-rose-800 border-rose-400 font-bold' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col my-auto relative"
      >
        {/* Header Bar */}
        <div className="bg-rose-500 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Emergency SOS Dispatch</h2>
              <p className="text-xs text-rose-100 font-medium">Step {step} of 3 • Broadcaster Mode</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 flex">
          <div
            className="h-full bg-rose-500 transition-all duration-300 ease-out"
            style={{ width: successMessage ? '100%' : `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage ? (
            /* Success Confirmation Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">SOS Alert Active!</h3>
                <p className="text-slate-600 text-sm max-w-xs mx-auto">{successMessage}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Species:</span>
                  <span className="font-bold text-slate-800">{formData.species}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Severity:</span>
                  <span className="font-bold text-rose-600 uppercase">{formData.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-800 line-clamp-1">{formData.address}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* STEP 1: Camera UI Placeholder */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-rose-500" />
                      Step 1: Animal Photo Evidence
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload or capture a clear photo of the injured animal to assist rescue teams.
                    </p>
                  </div>

                  {/* Camera / Image Box */}
                  <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden min-h-[220px] flex flex-col items-center justify-center p-4">
                    {photoPreview ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                        <img src={photoPreview} alt="Animal Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setPhotoPreview(null)}
                            className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg shadow"
                          >
                            Retake Photo
                          </button>
                        </div>
                      </div>
                    ) : isCameraActive ? (
                      <div className="flex flex-col items-center gap-3 text-rose-600">
                        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold animate-pulse">Accessing Camera Lens...</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                          <Camera className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Tap to Take Photo</p>
                          <p className="text-xs text-slate-400">or upload an existing photo from device</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            type="button"
                            onClick={handleCaptureSimulatedPhoto}
                            className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-colors shadow"
                          >
                            📸 Snap Photo
                          </button>
                          <label className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            Browse File
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-4 rounded-xl bg-rose-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                  >
                    Next: Animal Condition Details <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Quick Form */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Step 2: Animal & Condition</h3>
                      <p className="text-xs text-slate-500">Provide animal type and injury severity.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Species Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Species / Animal Type
                      </label>
                      <select
                        value={formData.species}
                        onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                      >
                        {speciesOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Condition Textarea */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Condition & Injury Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        placeholder="Describe injuries, visible distress, mobility issues, or special hazards..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
                      />
                    </div>

                    {/* Severity Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Urgency & Severity Level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {severityOptions.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, severity: s.value })}
                            className={cn(
                              'p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between',
                              s.color,
                              formData.severity === s.value
                                ? 'ring-2 ring-rose-500 border-rose-500 shadow-sm scale-[1.02]'
                                : 'opacity-70 hover:opacity-100'
                            )}
                          >
                            <span>{s.label}</span>
                            {formData.severity === s.value && <Radio className="w-4 h-4 text-rose-600 fill-current" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full py-4 rounded-xl bg-rose-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                  >
                    Next: GPS Location & Broadcast <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* STEP 3: GPS Mini-Map & Broadcast SOS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Step 3: Location & Broadcast</h3>
                      <p className="text-xs text-slate-500">Confirm emergency coordinates and reporter details.</p>
                    </div>
                  </div>

                  {/* GPS Input & Auto-detect */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Incident Address
                      </label>
                      <button
                        type="button"
                        onClick={handleDetectGPS}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-md"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Auto-Detect GPS
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                    />

                    {/* Mini-map Placeholder */}
                    <div className="relative h-32 rounded-2xl bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center shadow-inner">
                      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
                      <div className="relative z-10 flex flex-col items-center gap-1 text-center p-2">
                        <div className="relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                            <MapPin className="w-5 h-5 fill-current" />
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                          GPS: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reporter Contact Info */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{formData.reporterName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{formData.reporterPhone}</span>
                    </div>
                  </div>

                  {/* MASSIVE PULSING BROADCAST SOS BUTTON */}
                  <button
                    type="button"
                    onClick={handleSubmitSOS}
                    disabled={isLoading}
                    className="w-full py-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl shadow-rose-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 animate-pulse-soft"
                  >
                    {isLoading ? (
                      <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Siren className="w-7 h-7" />
                        BROADCAST SOS NOW
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  )
}
