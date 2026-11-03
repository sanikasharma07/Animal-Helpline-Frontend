import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react'

// Documents are part of the NGO's own profile (GET /ngo/profile). The
// verified-NGO list deliberately excludes documents, so this page must
// use the own-profile endpoint. There is no per-document status in the
// backend — verification applies to the NGO profile as a whole — so the
// old page's per-document verified/pending/rejected badges were invented.
// Uploading or replacing a document goes through the profile update
// (POST /ngo/profile), which resets verification to pending.
const DOC_LABELS = {
  registrationCertificate: 'Registration Certificate',
  panCard: 'PAN Card',
  twelveACertificate: '12A Certificate',
  eightyGCertificate: '80G Certificate',
}

export default function NGODocuments() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    API.get('/ngo/profile')
      .then((res) => { if (!cancelled) setProfile(res.data?.data || null) })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Could not load your documents.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const documents = profile?.documents || {}

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#183B35]">Document Management</h1>
        <p className="text-slate-500 text-sm mt-1">Documents on file for your NGO profile. Verification applies to your profile as a whole — currently <strong>{profile?.verificationStatus || 'unknown'}</strong> — not to individual documents.</p>
      </div>

      {loading && <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" role="status" aria-label="Loading documents" /></div>}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
      {!loading && !error && !profile && (
        <p className="text-sm text-slate-600 bg-white border rounded-2xl p-5">You have no NGO profile yet, so there are no documents on file. Create a profile from the onboarding page.</p>
      )}
      {!loading && profile && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(DOC_LABELS).map(([key, label]) => {
              const url = documents[key]
              return (
                <div key={key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#DDE9DF] flex items-center justify-center text-[#087F70] shrink-0"><FileText className="w-5 h-5" /></div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900">{label}</h3>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" className="text-sm text-[#087F70] font-semibold hover:underline inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Uploaded — view file</a>
                      ) : (
                        <p className="text-sm text-slate-500">Not uploaded.</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-500 bg-white border rounded-2xl p-4">To upload or replace a document, use the profile update flow: re-submitting your profile keeps documents you do not re-upload, but resets verification to pending for admin re-review.</p>
        </>
      )}
    </div>
  )
}
