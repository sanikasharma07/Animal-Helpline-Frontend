import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { logoutUser } from '@/store/slices/authSlice'
import { Bell, Lock, LogOut, AlertTriangle } from 'lucide-react'

// Honest settings page. The backend has no password-change endpoint, no
// notification-preference storage, and no account-deactivation endpoint,
// so the old page's toggles, password form and Deactivate button did
// nothing at all while looking functional. They are removed and replaced
// with what actually exists: in-app notifications, your account details,
// and sign-out. Password reset and deactivation are not available in the
// backend — that is stated here instead of faked.
export default function NGOSettings() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#183B35]">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">What your account can actually do, without controls that only look functional.</p>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#DDE9DF] flex items-center justify-center text-[#087F70]"><Bell className="w-5 h-5" /></div>
          <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
        </div>
        <p className="text-sm text-slate-600">Notifications are in-app only (no email, SMS or push service exists in the backend). You receive them for emergency acceptances and updates, donations, campaign impact, supply pledge changes, volunteer decisions, verification results and moderation actions. They are shown on your dashboard and cannot currently be muted per type.</p>
        <Link to="/ngo/dashboard" className="inline-flex text-sm font-bold text-[#087F70] hover:underline">See notifications on your dashboard →</Link>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"><Lock className="w-5 h-5" /></div>
          <h2 className="text-lg font-bold text-slate-900">Account</h2>
        </div>
        <dl className="text-sm text-slate-600 space-y-1">
          <div className="flex gap-2"><dt className="font-bold text-slate-900 w-20">Name</dt><dd>{user?.name || '—'}</dd></div>
          <div className="flex gap-2"><dt className="font-bold text-slate-900 w-20">Email</dt><dd>{user?.email || '—'}</dd></div>
          <div className="flex gap-2"><dt className="font-bold text-slate-900 w-20">Role</dt><dd>{user?.role || '—'}</dd></div>
        </dl>
        <p className="text-sm text-slate-500 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" /> Password change, password reset and account deactivation are not implemented in the backend, so no form for them is shown here. Your session refreshes automatically while you are signed in and is revoked when you sign out.</p>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </section>
    </div>
  )
}
