import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNGOStatus, acceptRescue } from '@/store/slices/ngoSlice'
import { mockNGOs } from '@/data/mockNGOs'
import { mockEmergencies } from '@/data/mockCampaigns'
import {
  LayoutDashboard, History, FileText, Settings, Building,
  AlertTriangle, Shield, CheckCircle2, PawPrint, Users, Heart,
  Package, Clock, ChevronRight, Menu, X, Radio, MapPin,
  Siren, Home, Activity, Zap, Bell, LogOut
} from 'lucide-react'


const NGODashboard = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  
  // Use local state for the toggle visually, and sync with Redux
  const [isActive, setIsActive] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isRoot = location.pathname === '/ngo/dashboard' || location.pathname === '/ngo/dashboard/'

  const handleToggle = () => {
    setIsActive(!isActive)
    dispatch(toggleNGOStatus())
  }

  // Filter alerts for the radar section
  const alerts = mockEmergencies.filter(e => e.status === 'reported' || e.status === 'rescue_accepted')

  // Calculate stats
  const urgentCasesCount = mockEmergencies.filter(e => e.severity === 'critical').length
  const ongoingRescuesCount = mockEmergencies.filter(e => e.status === 'rescue_accepted').length

  const navLinks = [
    { name: 'Overview', path: '/ngo/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/ngo/dashboard/profile', icon: Building },
    { name: 'Campaigns', path: '/ngo/dashboard/campaigns', icon: Zap },
    { name: 'Documents', path: '/ngo/dashboard/documents', icon: FileText },
    { name: 'Settings', path: '/ngo/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden md:flex bg-slate-50 text-slate-900 font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar (overlay) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-xl transition-transform duration-300 md:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 relative shrink-0">
              <Shield className="w-6 h-6 fill-current opacity-20 absolute" />
              <Shield className="w-6 h-6 absolute" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-slate-800 leading-tight truncate">Animal Lifeline</h2>
              <div className="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </div>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navLinks.map(link => {
            const active = location.pathname === link.path || (link.path === '/ngo/dashboard' && isRoot)
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <link.icon className={cn("w-5 h-5", active ? "text-teal-600" : "text-slate-400")} />
                {link.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 h-full flex-col sticky left-0 top-0 shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 relative shrink-0">
            <Shield className="w-6 h-6 fill-current opacity-20 absolute" />
            <Shield className="w-6 h-6 absolute" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-800 leading-tight truncate">Animal Lifeline</h2>
            <div className="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navLinks.map(link => {
            const active = location.pathname === link.path || (link.path === '/ngo/dashboard' && isRoot)
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <link.icon className={cn("w-5 h-5", active ? "text-teal-600" : "text-slate-400")} />
                {link.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 w-full transition-colors">
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:h-full md:overflow-hidden relative min-w-0 w-full">
        {/* Top Header */}
        <header className="sticky top-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">
              {isRoot ? "Command Center" : navLinks.find(l => l.path === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-2 sm:px-3 py-1.5 rounded-full border border-slate-200">
              <span className={cn("hidden sm:inline text-sm font-bold tracking-wide", isActive ? "text-emerald-500" : "text-slate-500")}>
                {isActive ? "● Active" : "Off Duty"}
              </span>
              <button
                onClick={handleToggle}
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner",
                  isActive ? "bg-emerald-500" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow",
                    isActive ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
              <img src="https://ui-avatars.com/api/?name=NGO&background=0D8B93&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {isRoot ? (
            <div className="pb-8">
              {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-6">
                <MetricCard title="Urgent Cases" value={urgentCasesCount} icon={Siren} color="text-rose-500" bg="bg-rose-50" />
                <MetricCard title="Ongoing Rescues" value={ongoingRescuesCount} icon={Activity} color="text-teal-600" bg="bg-teal-50" />
                <MetricCard title="Pending Adoptions" value={12} icon={Home} color="text-purple-600" bg="bg-purple-50" />
                <MetricCard title="Open Supply Requests" value={8} icon={Package} color="text-blue-600" bg="bg-blue-50" />
              </div>

              {/* Dispatch Radar Section */}
              <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6">
                {/* LEFT: Map Container */}
                <div className="flex-1 relative h-[420px] bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] shadow-inner">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm border border-slate-200/50 z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Dispatch Map — Jaipur Region
                  </div>
                  
                  {/* Emergency Pins */}
                  <MapPinItem top="30%" left="25%" id="#EM-102" emoji="🐕" />
                  <MapPinItem top="65%" left="45%" id="#EM-103" emoji="🐄" />
                  <MapPinItem top="40%" left="75%" id="#EM-104" emoji="🐈" />
                  <MapPinItem top="75%" left="80%" id="#EM-105" emoji="🦅" />

                  {/* NGO Vehicle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
                    <div className="relative flex h-9 w-9 rounded-full bg-teal-600 items-center justify-center shadow-lg border-2 border-white">
                      <TruckIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* RIGHT: SOS Alert Feed */}
                <div className="w-full lg:w-[340px] shrink-0 flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <Radio className="w-5 h-5 text-rose-500" /> Incoming SOS Alerts
                    </h4>
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{alerts.length}</span>
                  </div>
                  
                  <div className="overflow-y-auto max-h-[400px] space-y-3 pr-1 pb-4 custom-scrollbar">
                    {alerts.map(emergency => (
                      <div key={emergency.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl drop-shadow-sm">{emergency.species === 'Dog' ? '🐕' : emergency.species === 'Cow' ? '🐄' : '🐈'}</span>
                            <div>
                              <div className="font-bold text-slate-900">{emergency.id || '#EM-101'}</div>
                              <div className="text-xs font-medium text-slate-500">{emergency.species} Rescue</div>
                            </div>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            emergency.severity === 'critical' ? "bg-rose-100 text-rose-700" :
                            emergency.severity === 'high' ? "bg-orange-100 text-orange-700" :
                            "bg-amber-100 text-amber-700"
                          )}>
                            {emergency.severity}
                          </span>
                        </div>
                        
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                            <span className="line-clamp-2">{emergency.location?.address || 'Jaipur, Rajasthan'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>15 mins ago</span>
                          </div>
                        </div>

                        {emergency.status === 'rescue_accepted' ? (
                          <div className="w-full bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 border border-emerald-100">
                            <CheckCircle2 className="w-4 h-4" /> Accepted ✓
                          </div>
                        ) : (
                          <button 
                            onClick={() => dispatch(acceptRescue(emergency.id))}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
                          >
                            Accept Rescue <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {alerts.length === 0 && (
                      <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-600">No active alerts</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <Outlet />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
      <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0", bg, color)}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="min-w-0">
        <div className="text-xs sm:text-sm font-medium text-slate-500 mb-0.5 truncate">{title}</div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  )
}

function MapPinItem({ top, left, id, emoji }) {
  return (
    <div className="absolute group cursor-pointer z-0" style={{ top, left }}>
      <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-rose-400 opacity-75"></span>
      <span className="relative flex h-5 w-5 rounded-full bg-rose-600 items-center justify-center shadow-md">
        <MapPin className="w-3 h-3 text-white fill-current" />
      </span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-white text-slate-900 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100 flex items-center gap-1.5 z-20">
        <span className="text-base">{emoji}</span> 
        <span className="tracking-wide">{id}</span>
      </div>
    </div>
  )
}

function TruckIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-9h-4V5h-4v12h3" />
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
    </svg>
  )
}

export default NGODashboard
