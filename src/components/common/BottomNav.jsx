import React from 'react'
import { Link, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { openSOSModal } from '@/store/slices/emergencySlice'
import { LayoutDashboard, MapPin, Siren, UserCircle, Heart } from 'lucide-react'

export default function BottomNav() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const location = useLocation()
  const dispatch = useDispatch()

  // Only show for authenticated users on mobile
  if (!isAuthenticated) return null

  // Hide on NGO/Admin dashboards (they have their own sidebars)
  const hiddenPaths = ['/ngo/dashboard', '/admin']
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null

  // The old nav always linked Home to /dashboard, which is user-only:
  // NGO and vet users were bounced by ProtectedRoute.
  const homePath =
    user?.role === 'ngo' ? '/ngo/dashboard'
    : user?.role === 'admin' ? '/admin'
    : user?.role === 'vet' ? '/vet/dashboard'
    : '/dashboard'

  const isActive = (path) => location.pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around px-1 pt-1 pb-2 max-w-lg mx-auto relative">

        {/* Home */}
        <Link
          to={homePath}
          className={cn(
            'flex flex-col items-center gap-0.5 min-w-[48px] px-2 py-1.5 rounded-xl transition-all',
            isActive(homePath) ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <LayoutDashboard className={cn('w-5 h-5', isActive(homePath) && 'stroke-[2.5px]')} />
          <span className="text-[10px] font-bold leading-tight">Home</span>
        </Link>

        {/* Explore */}
        <Link
          to="/nearby-ngos"
          className={cn(
            'flex flex-col items-center gap-0.5 min-w-[48px] px-2 py-1.5 rounded-xl transition-all',
            isActive('/nearby-ngos') ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <MapPin className={cn('w-5 h-5', isActive('/nearby-ngos') && 'stroke-[2.5px]')} />
          <span className="text-[10px] font-bold leading-tight">Explore</span>
        </Link>

        {/* CENTER SOS BUTTON */}
        <div className="flex flex-col items-center -mt-4 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(openSOSModal())}
            className="w-14 h-14 bg-rose-500 hover:bg-rose-600 active:scale-95 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40 border-4 border-white transition-all animate-pulse-soft"
            aria-label="Report Emergency SOS"
          >
            <Siren className="w-6 h-6 text-white" />
          </button>
          <span className="text-[10px] font-black text-rose-600 mt-0.5">SOS</span>
        </div>

        {/* Donate */}
        <Link
          to="/donate"
          className={cn(
            'flex flex-col items-center gap-0.5 min-w-[48px] px-2 py-1.5 rounded-xl transition-all',
            isActive('/donate') ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <Heart className={cn('w-5 h-5', isActive('/donate') && 'stroke-[2.5px]')} />
          <span className="text-[10px] font-bold leading-tight">Donate</span>
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className={cn(
            'flex flex-col items-center gap-0.5 min-w-[48px] px-2 py-1.5 rounded-xl transition-all',
            isActive('/profile') ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <UserCircle className={cn('w-5 h-5', isActive('/profile') && 'stroke-[2.5px]')} />
          <span className="text-[10px] font-bold leading-tight">Profile</span>
        </Link>

      </div>
    </nav>
  )
}
