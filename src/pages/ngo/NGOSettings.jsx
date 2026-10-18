import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Settings, Bell, Lock, Shield, AlertTriangle, Save } from 'lucide-react';

export default function NGOSettings() {
  const [notifications, setNotifications] = useState({
    donations: true,
    campaigns: true,
    volunteers: false,
    system: true
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid gap-8">
        {/* Notifications */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'donations', label: 'New Donations', desc: 'Get notified when you receive a donation' },
              { id: 'campaigns', label: 'Campaign Updates', desc: 'Alerts about your active campaigns' },
              { id: 'volunteers', label: 'Volunteer Applications', desc: 'When someone applies to volunteer' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">{item.label}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications[item.id]} onChange={() => setNotifications(prev => ({...prev, [item.id]: !prev[item.id]}))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Security & Privacy</h2>
          </div>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Update Password
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-xl border border-rose-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-rose-600">Danger Zone</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">Deactivating your account will remove your NGO profile from public view and pause all active campaigns. This action can be undone by contacting support.</p>
          <button className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Deactivate Account
          </button>
        </section>
      </div>
    </div>
  );
}
