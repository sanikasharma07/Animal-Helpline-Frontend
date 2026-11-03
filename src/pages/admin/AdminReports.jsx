import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { Flag, AlertTriangle } from 'lucide-react'

// Reports & investigation. Backend (admin only):
//   GET /admin/reports (?status, ?targetType) — with target summary,
//     previous reports against the same target, and previous actions.
//   GET /admin/reports/:id — full detail.
//   PATCH /admin/reports/:id { status, adminNote, actionTaken } —
//     Pending → Under Review / Resolved / Dismissed, Under Review →
//     Resolved / Dismissed. Resolving or dismissing requires an admin note.
//     actionTaken is only a summary: enforcement itself happens through
//     the moderation endpoints (warn / suspend / remove / escalate),
//     which create the AdminAction audit records.
//   POST /admin/moderation/escalate { targetType, targetId, reason, reportId? }
// Report reasons (backend enum): Fake NGO, Fake fundraising campaign,
// Misleading information, Suspicious donation activity, False emergency,
// Misuse of platform, Animal welfare concern, Other. The reporter is
// never exposed to the reported party.
const STATUSES = ['', 'Pending', 'Under Review', 'Resolved', 'Dismissed']
const ACTION_TAKEN = ['None', 'Warning', 'Temporary Suspension', 'Indefinite Suspension', 'Campaign Removal', 'Content Removal', 'Escalation']

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [note, setNote] = useState('')
  const [taken, setTaken] = useState('None')

  const fetchReports = async () => {
    setLoading(true)
    setError('')
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const res = await API.get('/admin/reports', { params })
      setReports(res.data?.data || [])
    } catch (err) {
      setError(err?.message || 'Could not load reports.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [statusFilter])

  const openDetail = async (report) => {
    setSelected(report)
    setNote('')
    setTaken(report.actionTaken || 'None')
    try {
      const res = await API.get(`/admin/reports/${report._id}`)
      setDetail(res.data?.data || null)
    } catch {
      setDetail(null)
    }
  }

  const decide = async (status) => {
    setActionError('')
    try {
      await API.patch(`/admin/reports/${selected._id}`, { status, adminNote: note.trim(), actionTaken: taken })
      setSelected(null)
      setDetail(null)
      fetchReports()
    } catch (err) {
      setActionError(err?.message || 'Report could not be decided. A note is required for Resolved/Dismissed.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Flag className="w-6 h-6 text-teal-600" /> Reports &amp; investigation</h1>
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button key={s || 'all'} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${statusFilter === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}>{s || 'All statuses'}</button>
        ))}
      </div>
      {loading && <p className="text-sm text-slate-500">Loading reports…</p>}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4 flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0" />{error}</div>}
      <div className="space-y-3">
        {reports.map((r) => (
          <article key={r._id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-bold text-slate-900">{r.reason} <span className="font-normal text-slate-500">• {r.targetType}</span></h3>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">{r.status}</span>
            </div>
            <p className="text-sm text-slate-600">{r.explanation}</p>
            <p className="text-xs text-slate-500">Reporter: {r.reporter?.name || 'Unknown'} • Previous reports against this target: {r.previousReportCount ?? '—'}{r.createdAt ? ` • ${new Date(r.createdAt).toLocaleString()}` : ''}</p>
            <button onClick={() => openDetail(r)} className="text-xs font-bold text-teal-700 hover:underline">Investigate →</button>
          </article>
        ))}
        {!loading && reports.length === 0 && <p className="text-sm text-slate-500 bg-white border rounded-2xl p-5">No reports in this view.</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => { setSelected(null); setDetail(null) }} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg text-slate-900">Investigate report</h2>
            <p className="text-sm text-slate-600">{selected.explanation}</p>
            {detail?.targetSummary && <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">{JSON.stringify(detail.targetSummary)}</p>}
            {detail?.previousReports?.length > 0 && <p className="text-xs text-slate-500">{detail.previousReports.length} previous report(s) against this target.</p>}
            {detail?.previousActions?.length > 0 && (
              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-900">Previous admin actions</p>
                {detail.previousActions.map((a) => <p key={a._id}>{a.actionType} — {a.reason}</p>)}
              </div>
            )}
            {actionError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">{actionError}</div>}
            <label className="block text-xs font-bold text-slate-700">Admin note (required to resolve or dismiss)
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </label>
            <label className="block text-xs font-bold text-slate-700">Action taken (summary — enforcement is via the moderation endpoints)
              <select value={taken} onChange={(e) => setTaken(e.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm">
                {ACTION_TAKEN.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              {selected.status !== 'Under Review' && <button onClick={() => decide('Under Review')} className="px-4 py-2.5 bg-white border border-slate-200 text-sm font-bold rounded-xl">Mark under review</button>}
              <button onClick={() => decide('Resolved')} className="px-4 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl">Resolve</button>
              <button onClick={() => decide('Dismissed')} className="px-4 py-2.5 bg-white border border-slate-200 text-sm font-bold rounded-xl">Dismiss</button>
              <button onClick={() => { setSelected(null); setDetail(null) }} className="px-4 py-2.5 text-sm font-bold text-slate-500">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
