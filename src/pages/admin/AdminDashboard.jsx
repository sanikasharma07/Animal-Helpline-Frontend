import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';
import { Link, Outlet, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { ADMIN_NAV_ITEMS } from '@/lib/constants';
import { 
  ShieldCheck, LayoutDashboard, Building, Users, AlertTriangle, 
  DollarSign, Activity, Bell, Menu, X, FileText, ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Using some mock data for dashboard home or outlet
  const isIndex = location.pathname === '/admin' || location.pathname === '/admin/';
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900">
      {/* Mobile backdrop overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer (fixed, z-50, w-64) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <ShieldCheck className="h-8 w-8 text-teal-400 shrink-0" />
            <span className="font-bold text-lg whitespace-nowrap">Admin Panel</span>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)} 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon || FileText;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-teal-500/10 text-teal-400 font-medium" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-teal-400" : "text-slate-400 group-hover:text-white")} />
                <span className="whitespace-nowrap">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-teal-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Collapsible Sidebar */}
      <motion.aside
        initial={{ width: 256 }}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="hidden md:flex bg-slate-900 text-white flex-col h-full shrink-0 shadow-xl z-20 relative"
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <ShieldCheck className="h-8 w-8 text-teal-400 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, w: 0 }} 
                  animate={{ opacity: 1, w: 'auto' }} 
                  exit={{ opacity: 0, w: 0 }}
                  className="font-bold text-lg whitespace-nowrap"
                >
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded-lg" aria-label="Toggle sidebar">
            <Menu className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon || FileText;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-teal-500/10 text-teal-400 font-medium" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-teal-400" : "text-slate-400 group-hover:text-white")} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {isActive && sidebarOpen && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-teal-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">Welcome, Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isIndex ? <DashboardHome /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

function DashboardHome() {
  const stats = [
    { label: "Pending Verifications", value: "12", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50", trend: "+2 today" },
    { label: "Active NGOs", value: "148", icon: Building, color: "text-teal-500", bg: "bg-teal-50", trend: "+5 this week" },
    { label: "Active Cases", value: "45", icon: AlertTriangle, color: "text-blue-500", bg: "bg-blue-50", trend: "-3 from yesterday" },
    { label: "Total Donations", value: formatCurrency(1240500), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50", trend: "+12% this month" },
    { label: "Platform GMV", value: formatCurrency(4500000), icon: Activity, color: "text-purple-500", bg: "bg-purple-50", trend: "+8% this month" },
  ];

  return (
    <div className="space-y-6">
      {/* Urgent Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm flex items-start gap-4"
      >
        <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-rose-800">Urgent: Orphaned Emergencies Detected</h3>
          <p className="text-rose-600 text-sm mt-1">3 emergency cases have been reported for over 48 hours without any NGO response. Immediate manual intervention required.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className={cn("p-2 sm:p-2.5 rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1 truncate">{stat.label}</p>
              <h4 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{stat.value}</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2 font-medium truncate">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Pending Verifications</h3>
            <Link to="/admin/verifications" className="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider whitespace-nowrap">
                  <th className="px-5 py-3 font-medium">Organization</th>
                  <th className="px-5 py-3 font-medium">City</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3].map((_, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">Paws & Care Foundation</div>
                      <div className="text-xs text-slate-500">NGO • Reg: MH/2023/849</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">Mumbai</td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">Oct 24, 2023</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link to="/admin/verifications/1" className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="relative border-l border-slate-200 ml-3 space-y-6">
              {[
                { title: "Approved Verification", desc: "Hope Animal Trust", time: "2 hours ago", color: "text-emerald-500", bg: "bg-emerald-100" },
                { title: "Flagged Campaign", desc: "Suspicious activity detected in fund 'Street Dogs Rescue'", time: "5 hours ago", color: "text-rose-500", bg: "bg-rose-100" },
                { title: "Warned User", desc: "User #8492 violation of terms", time: "Yesterday", color: "text-amber-500", bg: "bg-amber-100" },
              ].map((action, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={cn("absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm", action.bg)}></div>
                  <div className="mb-1">
                    <span className={cn("font-semibold text-sm", action.color)}>{action.title}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{action.desc}</p>
                  <p className="text-xs text-slate-400 font-medium">{action.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
