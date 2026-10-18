import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Building, MapPin, Check, Shield, Camera, Save } from 'lucide-react';
import { mockNGOs } from '@/data/mockNGOs';
import { NGO_SERVICES, ANIMAL_TYPES } from '@/lib/constants';

export default function NGOProfile() {
  const ngo = mockNGOs[0];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: ngo.description || '',
    phone: ngo.contactNumber || '',
    email: ngo.email || '',
    website: ngo.website || '',
    address: ngo.address || '',
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, dispatch to redux/api
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Organization Profile</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
            isEditing ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          )}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cover & Avatar */}
        <div className="h-48 bg-gradient-to-r from-teal-500 to-emerald-600 relative">
          <button className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-lg backdrop-blur-sm transition-all text-sm flex items-center gap-2">
            <Camera className="w-4 h-4" /> Change Cover
          </button>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden relative bg-slate-100 flex items-center justify-center shrink-0">
              {ngo.logo ? (
                <img src={ngo.logo} alt={ngo.name} className="w-full h-full object-cover" />
              ) : (
                <Building className="w-12 h-12 text-slate-300" />
              )}
              <button className="absolute inset-0 bg-black/40 text-white opacity-0 hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-xs font-medium">
                <Camera className="w-6 h-6 mb-1" /> Update
              </button>
            </div>
            
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {ngo.name}
                {ngo.isVerified && <Shield className="w-5 h-5 text-teal-500" />}
              </h2>
              <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4" /> {ngo.city}, {ngo.state}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">About Organization</label>
                {isEditing ? (
                  <textarea 
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none min-h-[120px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                ) : (
                  <p className="text-slate-600 text-sm leading-relaxed">{formData.description || 'No description provided.'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Contact Information</label>
                <div className="space-y-3">
                  {['phone', 'email', 'website', 'address'].map(field => (
                    <div key={field} className="flex gap-2">
                      <span className="text-sm font-medium text-slate-500 w-20 capitalize">{field}:</span>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                          value={formData[field]}
                          onChange={e => setFormData({...formData, [field]: e.target.value})}
                        />
                      ) : (
                        <span className="text-sm text-slate-900">{formData[field] || '-'}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Services Provided</label>
                <div className="flex flex-wrap gap-2">
                  {ngo.services.map(serviceId => {
                    const service = NGO_SERVICES?.find(s => s.id === serviceId);
                    return service ? (
                      <span key={serviceId} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg flex items-center gap-1.5 border border-teal-100">
                        {service.emoji} {service.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Animals Handled</label>
                <div className="flex flex-wrap gap-2">
                  {ngo.animalsHandled.map(animalId => {
                    const animal = ANIMAL_TYPES?.find(a => a.id === animalId);
                    return animal ? (
                      <span key={animalId} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-1.5 border border-slate-200">
                        {animal.emoji} {animal.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
