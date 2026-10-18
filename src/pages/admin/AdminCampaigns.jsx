import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { suspendCampaign } from '@/store/slices/adminSlice';
import { 
  TrendingUp, Users, DollarSign, Activity, ChevronDown, 
  Eye, Ban, Lock, FileText, AlertTriangle, CheckCircle2
} from 'lucide-react';


const MOCK_CAMPAIGNS = [
  { id: 'CAMP-01', name: 'Save the Street Dogs', ngo: 'Paws & Care', type: 'donation', target: 500000, raised: 320000, status: 'active', flagged: false },
  { id: 'CAMP-02', name: 'Winter Blankets for Cows', ngo: 'Gau Seva Trust', type: 'supply', target: 1000, raised: 450, status: 'active', flagged: false },
  { id: 'CAMP-03', name: 'Urgent Surgery Fund', ngo: 'Suspicious NGO', type: 'donation', target: 200000, raised: 180000, status: 'suspended', flagged: true },
  { id: 'CAMP-04', name: 'Bird Feeder Drive', ngo: 'Avian Rescue', type: 'supply', target: 500, raised: 500, status: 'completed', flagged: false },
];

export default function AdminCampaigns() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('active');
  const [expandedLog, setExpandedLog] = useState(null);
  const [localSuspended, setLocalSuspended] = useState(['CAMP-03']);
  const [confirmSuspend, setConfirmSuspend] = useState(null);


  const stats = [
    { label: "Total GMV", value: "₹2.42Cr", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50", trend: "+12.5%" },
    { label: "Total Campaigns", value: "4,521", icon: Activity, color: "text-blue-500", bg: "bg-blue-50", trend: "+5.2%" },
    { label: "Active Campaigns", value: "342", icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-50", trend: "-2.1%" },
    { label: "Total Donors", value: "18,290", icon: Users, color: "text-purple-500", bg: "bg-purple-50", trend: "+18.4%" },
  ];

  const campaigns = MOCK_CAMPAIGNS.filter(c => {
    if (activeTab === 'flagged') return c.flagged;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Campaign Fraud & Compliance</h2>
        <p className="text-slate-500 mt-1 text-sm">Monitor fundraising activities, review flagged campaigns, and ensure compliance.</p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-start mb-2">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <span className={cn("text-xs font-bold", stat.trend.startsWith('+') ? "text-emerald-600" : "text-rose-600")}>
                {stat.trend}
              </span>
            </div>
            <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
            <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {['active', 'suspended', 'completed', 'flagged'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap",
              activeTab === tab 
                ? "border-teal-500 text-teal-700" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300",
              tab === 'flagged' && activeTab === tab ? "border-rose-500 text-rose-700" : ""
            )}
          >
            {tab} Campaigns
          </button>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Campaign Name</th>
                <th className="px-6 py-4 font-medium">NGO</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.length > 0 ? (
                campaigns.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          {c.name}
                          {c.flagged && <AlertTriangle className="h-4 w-4 text-rose-500" title="Flagged for review" />}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{c.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{c.ngo}</td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-[200px]">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-slate-700">
                              {c.type === 'donation' ? formatCurrency(c.raised) : `${c.raised} items`}
                            </span>
                            <span className="text-slate-500">
                              / {c.type === 'donation' ? formatCurrency(c.target) : `${c.target} items`}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", c.type === 'donation' ? "bg-teal-500" : "bg-blue-500")}
                              style={{ width: `${Math.min(100, (c.raised / c.target) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium border",
                          c.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          c.status === 'suspended' ? "bg-rose-50 text-rose-700 border-rose-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setExpandedLog(expandedLog === c.id ? null : c.id)}
                            className={cn("p-1.5 rounded transition-colors", expandedLog === c.id ? "bg-slate-200 text-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100")}
                            title="View Transactions"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          {c.status !== 'suspended' && !localSuspended.includes(c.id) ? (
                            confirmSuspend === c.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    dispatch(suspendCampaign(c.id));
                                    setLocalSuspended(prev => [...prev, c.id]);
                                    setConfirmSuspend(null);
                                  }}
                                  className="px-3 py-1.5 text-xs font-black rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                                >
                                  Confirm Suspend
                                </button>
                                <button onClick={() => setConfirmSuspend(null)} className="px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmSuspend(c.id)}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-1.5 transition-colors"
                              >
                                <Ban className="h-3.5 w-3.5" /> Suspend
                              </button>
                            )
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 uppercase tracking-wider border border-rose-200">Suspended</span>
                          )}

                          <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Freeze NGO Account">
                            <Lock className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Transaction Log */}
                    <AnimatePresence>
                      {expandedLog === c.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-50 border-b border-slate-200"
                        >
                          <td colSpan="5" className="px-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-semibold text-slate-800 text-sm mb-3">Recent Transactions</h5>
                                <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                                  <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                      <tr>
                                        <th className="px-4 py-2 font-medium text-slate-500 text-left">Donor</th>
                                        <th className="px-4 py-2 font-medium text-slate-500 text-left">Amount</th>
                                        <th className="px-4 py-2 font-medium text-slate-500 text-left">Date</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {[1, 2, 3].map((tx) => (
                                        <tr key={tx}>
                                          <td className="px-4 py-2 text-slate-900">Anonymous</td>
                                          <td className="px-4 py-2 text-emerald-600 font-medium">₹5,000</td>
                                          <td className="px-4 py-2 text-slate-500">Oct 26, 2023</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-slate-800 text-sm mb-3">Dispute / Resolution Notes</h5>
                                <textarea 
                                  placeholder="Add admin notes regarding this campaign's compliance..."
                                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none h-24 mb-2 bg-white"
                                ></textarea>
                                <div className="flex justify-end">
                                  <button className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 transition-colors">
                                    Save Note
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No campaigns found in this category.
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
