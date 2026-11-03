import { Link } from 'react-router'
import { Lock } from 'lucide-react'

// The backend requires authentication for almost every list/detail
// endpoint (campaigns, supplies, volunteer board, animals, NGO verified
// lists). Only Nearby Help is public. Pages that show such data must say
// so for logged-out visitors instead of showing invented data.
export default function AuthRequiredState({ title = 'Sign in to continue', message = 'This section is available to signed-in users.' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3">
      <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
        <Lock className="w-6 h-6" />
      </div>
      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{message}</p>
      <div className="flex items-center justify-center gap-3 pt-1">
        <Link to="/login" className="px-4 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700">Sign in</Link>
        <Link to="/signup" className="px-4 py-2.5 bg-white border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50">Create account</Link>
      </div>
    </div>
  )
}
