import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { Search, Filter, Eye, ChevronRight } from 'lucide-react';

// Using mock verifications to substitute for real redux state if empty
const MOCK_VERIFICATIONS = [
  { id: '1', name: 'Paws & Care Foundation', type: 'NGO', city: 'Mumbai', submittedAt: '2023-10-24T10:00:00Z', status: 'pending' },
  { id: '2', name: 'Stray Helpers Delhi', type: 'NGO', city: 'Delhi', submittedAt: '2023-10-23T14:30:00Z', status: 'under_review' },
  { id: '3', name: 'Blue Cross Bangalore', type: 'NGO', city: 'Bangalore', submittedAt: '2023-10-20T09:15:00Z', status: 'approved' },
  { id: '4', name: 'Fake Shelter', type: 'NGO', city: 'Pune', submittedAt: '2023-10-18T16:45:00Z', status: 'rejected' },
];

const TABS = [
  { id: 'all', label: 'All Applications' },
  { id: 'pending', label: 'Pending' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export default function AdminVerifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use mock data for display
  const verifications = MOCK_VERIFICATIONS;

  const filteredVerifications = verifications.filter(v => {
    if (activeTab !== 'all' && v.status !== activeTab) return false;
    if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase()) && !v.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'under_review': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Under Review</span>;
      case 'approved': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'rejected': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      default: return null;
    }
  };

  const getTabCount = (tabId) => {
    if (tabId === 'all') return verifications.length;
    return verifications.filter(v => v.status === tabId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Verification Queue</h2>
          <p className="text-slate-500 mt-1 text-sm">Manage and review NGO onboarding applications</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search NGOs or cities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-full sm:w-64 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const count = getTabCount(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2",
                activeTab === tab.id 
                  ? "border-teal-500 text-teal-700" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                activeTab === tab.id ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVerifications.length > 0 ? (
                filteredVerifications.map((v) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={v.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{v.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{v.type} Application</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.city}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(v.submittedAt)}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(v.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/verifications/${v.id}`} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" /> Review
                      </Link>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
