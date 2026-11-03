import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import API from '@/api/axios'
import { ChevronLeft, AlertTriangle, Building } from 'lucide-react'

// Review detail for one pending NGO or vet. The backend has no single
// NGO/vet detail endpoint, so this page finds the entry in the pending
// queues — it does not invent a profile. If the id is not pending (for
// example it was already decided), that is stated plainly.
export default function AdminNGOReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [kind, setKind] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([API.get('/admin/ngo/pending'), API.get('/admin/vet/pending')])
      .then(([n, v]) => {
        if (cancelled) return
        const ngo = (n.data?.data || []).find((x) => String(x._id) === id)
        const vet = (v.data?.data || []).find((x) => String(x._id) === id)
        if (ngo) { setItem(ngo); setKind('ngo') }
        else if (vet) { setItem(vet); setKind('vet') }
        else setError('This application is not in the pending queues — it may already have been decided.')
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Could not load this application.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const decide = async (status) => {
    setActionError('')
    try {
      const body = { status }
      if (status === 'rejected') body.rejectionReason = rejectReason.trim()
      await API.patch(`/admin/${kind}/${id}/verify`, body)
      navigate('/admin/verifications')
    } catch (err) {
      setActionError(err?.message || 'Decision could not be saved. Rejection requires a reason.')
    }
  }

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading application…</div>
  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error || 'Application not found.'}</div>
        <Link to="/admin/verifications" className="text-sm font-bold text-teal-700 hover:underline">← Back to verification queues</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <Link to="/admin/verifications" className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-teal-700"><ChevronLeft className="w-4 h-4" /> Back to queues</Link>
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0"><Building className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{item.organizationName || item.clinicName}</h1>
            <p className="text-sm text-slate-500 capitalize">{kind} • verification {item.verificationStatus}</p>
          </div>
        </div>
        <dl className="text-sm text-slate-600 space-y-2">
          {item.description && <div><dt className="font-bold text-slate-900">Description</dt><dd>{item.description}</dd></div>}
          {item.specialization && <div><dt className="font-bold text-slate-900">Specialization</dt><dd>{item.specialization}</dd></div>}
          {item.licenseNumber && <div><dt className="font-bold text-slate-900">Licence</dt><dd>{item.licenseNumber}</dd></div>}
          {item.registrationNumber && <div><dt className="font-bold text-slate-900">Registration</dt><dd>{item.registrationNumber}</dd></div>}
          <div><dt className="font-bold text-slate-900">Location</dt><dd>{[item.address?.street, item.address?.city, item.address?.state, item.address?.pinCode].filter(Boolean).join(', ') || 'Not provided'}</dd></div>
          {item.user && <div><dt className="font-bold text-slate-900">Applicant</dt><dd>{item.user.name} • {item.user.email}{item.user.phone ? ` • ${item.user.phone}` : ''}</dd></div>}
          {(item.animalsHandled || []).length > 0 && <div><dt className="font-bold text-slate-900">Animals handled</dt><dd>{item.animalsHandled.join(', ')}</dd></div>}
          {(item.servicesProvided || []).length > 0 && <div><dt className="font-bold text-slate-900">Services</dt><dd>{item.servicesProvided.join(', ')}</dd></div>}
        </dl>
        <p className="text-xs text-slate-500">Documents are stored on the profile but are not returned by the pending-list endpoint, so they cannot be previewed from this page. Verify from the documents the applicant submitted through their profile.</p>
        {actionError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{actionError}</div>}
        <div className="space-y-2 pt-2">
          <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rejection reason (required if rejecting)" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
          <div className="flex gap-2">
            <button onClick={() => decide('verified')} className="px-4 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700">Approve</button>
            <button onClick={() => decide('rejected')} className="px-4 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700">Reject</button>
          </div>
        </div>
      </div>
    </div>
  )
}
