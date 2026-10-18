import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Heart, Package, Eye, ChevronRight, CheckCircle2, Users, Calendar } from 'lucide-react';
import { mockCampaigns } from '@/data/mockCampaigns';

export default function NGOPastCampaigns() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const completedCampaigns = mockCampaigns.filter(c => c.status === 'completed' || c.status === 'urgent');

  const filteredCampaigns = completedCampaigns.filter(c => {
    if (activeTab === 'donation') return c.type === 'donation';
    if (activeTab === 'supply') return c.type === 'supply';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Past Campaigns</h1>
          <p className="text-slate-500 text-sm mt-1">Review the impact of your previous initiatives.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['all', 'donation', 'supply'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md capitalize transition-all",
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-teal-300 transition-colors">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <img src={campaign.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80'} alt={campaign.title} className="w-full h-full object-cover grayscale-[30%]" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{campaign.title}</h3>
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1",
                      campaign.type === 'donation' ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {campaign.type === 'donation' ? <Heart className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                      {campaign.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{campaign.description}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {campaign.type === 'donation' ? 'Goal Reached: ' + formatCurrency(campaign.raised) : 'Supplies Fulfilled'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Ended {formatDate(campaign.createdAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> {Math.floor(Math.random() * 50) + 10} Supporters
                  </div>
                  
                  <button 
                    onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
                    className="ml-auto text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight className={cn("w-4 h-4 transition-transform", expandedId === campaign.id && "rotate-90")} />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === campaign.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-50 border-t border-slate-200"
                >
                  <div className="p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Impact Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-teal-500 shrink-0 shadow-[0_0_0_4px_#ccfbf1]" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Funds Disbursed & Utilized</p>
                          <p className="text-xs text-slate-500 mt-1">All raised items have been successfully allocated to the animals in need.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-teal-500 shrink-0 shadow-[0_0_0_4px_#ccfbf1]" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Campaign Goal Reached</p>
                          <p className="text-xs text-slate-500 mt-1">Thanks to our generous donors, we hit 100% of our target.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No campaigns found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
