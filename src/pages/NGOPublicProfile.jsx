import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockNGOs } from '@/data/mockNGOs';
import { mockCampaigns } from '@/data/mockCampaigns';
import { mockAnimals } from '@/data/mockAnimals';
import { 
  ArrowLeft, Shield, MapPin, Star, Phone, Mail, Globe, 
  Heart, Users, PawPrint, Calendar, Clock, ExternalLink 
} from 'lucide-react';

export default function NGOPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');

  // For real app, fetch NGO by ID. Using mock for now.
  const ngo = mockNGOs.find(n => n.id === id) || mockNGOs[0];
  const campaigns = mockCampaigns.filter(c => c.ngoId === id);
  const animals = mockAnimals.filter(a => a.ngoId === id);

  if (!ngo) {
    return <div className="p-8 text-center">NGO not found</div>;
  }

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
    { id: 'animals', label: 'Animals', count: animals.length },
    { id: 'heroes', label: 'Our Heroes' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-black/20" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all z-10"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold">{ngo.name}</h1>
                {ngo.isVerified && (
                  <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                    <Shield size={14} className="text-emerald-400" fill="currentColor" />
                    Verified
                  </div>
                )}
              </div>
              <p className="text-white/80 flex items-center gap-2 text-lg">
                <MapPin size={18} /> {ngo.city}, {ngo.state}
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Star size={20} className="text-amber-400" fill="currentColor" />
              <span className="text-xl font-bold">{ngo.rating || '4.8'}</span>
              <span className="text-white/60 text-sm">(124 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        {/* Quick Info & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <Heart size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Rescues</p>
              <p className="text-2xl font-bold text-slate-900">{ngo.stats?.rescues || '1,240+'}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <PawPrint size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Animals Under Care</p>
              <p className="text-2xl font-bold text-slate-900">{ngo.stats?.animals || '150+'}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Volunteers</p>
              <p className="text-2xl font-bold text-slate-900">{ngo.stats?.volunteers || '45'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id 
                  ? "border-teal-600 text-teal-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  "ml-2 py-0.5 px-2 rounded-full text-xs",
                  activeTab === tab.id ? "bg-teal-100" : "bg-gray-100"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'about' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About Us</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {ngo.description || `${ngo.name} is a dedicated animal welfare organization working tirelessly to rescue, rehabilitate, and rehome animals in need. Our mission is to create a compassionate world for all sentient beings through direct action, community education, and advocacy.`}
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Services Provided</h3>
                  <div className="flex flex-wrap gap-2">
                    {ngo.services?.map((service, i) => (
                      <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-slate-700 font-medium shadow-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-slate-600">
                      <MapPin size={20} className="text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{ngo.address || `${ngo.city}, ${ngo.state}`}</span>
                    </div>
                    {ngo.contact?.phone && (
                      <a href={`tel:${ngo.contact.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-teal-600 transition-colors">
                        <Phone size={20} className="text-teal-600 shrink-0" />
                        <span className="text-sm">{ngo.contact.phone}</span>
                      </a>
                    )}
                    {ngo.contact?.email && (
                      <a href={`mailto:${ngo.contact.email}`} className="flex items-center gap-3 text-slate-600 hover:text-teal-600 transition-colors">
                        <Mail size={20} className="text-teal-600 shrink-0" />
                        <span className="text-sm">{ngo.contact.email}</span>
                      </a>
                    )}
                    {ngo.contact?.website && (
                      <a href={ngo.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-teal-600 transition-colors">
                        <Globe size={20} className="text-teal-600 shrink-0" />
                        <span className="text-sm">{ngo.contact.website}</span>
                        <ExternalLink size={14} className="ml-auto" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'campaigns' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-40 bg-gradient-to-br from-teal-50 to-emerald-50 relative">
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-teal-700">
                          {campaign.type}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{campaign.title}</h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                        
                        {campaign.targetAmount && (
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-teal-600">₹{campaign.raisedAmount?.toLocaleString() || 0}</span>
                              <span className="text-slate-500">of ₹{campaign.targetAmount?.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div 
                                className="bg-teal-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(((campaign.raisedAmount || 0) / campaign.targetAmount) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                        <button className="w-full py-2 bg-gray-50 hover:bg-teal-50 text-teal-700 font-medium rounded-lg transition-colors text-sm">
                          Support Campaign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No Active Campaigns</h3>
                  <p className="text-slate-500">This NGO doesn't have any active campaigns at the moment.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'animals' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {animals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {animals.map(animal => (
                    <div key={animal.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="h-48 bg-gradient-to-br from-rose-50 to-amber-50 relative flex items-center justify-center text-6xl">
                        {animal.species === 'Dog' ? '🐕' : animal.species === 'Cat' ? '🐈' : '🐾'}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-900">{animal.name}</h3>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md",
                            animal.status === 'Ready for Adoption' ? "bg-emerald-100 text-emerald-700" :
                            animal.status === 'Needs Foster' ? "bg-amber-100 text-amber-700" :
                            "bg-rose-100 text-rose-700"
                          )}>
                            {animal.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mb-3">{animal.breed} • {animal.age}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <PawPrint size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No Animals Listed</h3>
                  <p className="text-slate-500">There are no animals currently listed for adoption or foster.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'heroes' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-teal-600">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We're building a space to celebrate the amazing volunteers and donors who make this NGO's work possible. Check back soon for inspiring stories!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
