import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { banUser } from '@/store/slices/adminSlice';
import { Search, Filter, ShieldCheck, Users, Ban, Eye, AlertTriangle } from 'lucide-react';


const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', city: 'Mumbai', role: 'user', joinedAt: '2023-01-15T10:00:00Z', status: 'active' },
  { id: '2', name: 'Paws & Care', email: 'contact@pawsandcare.org', phone: '+91 9988776655', city: 'Mumbai', role: 'ngo', joinedAt: '2023-10-25T14:20:00Z', status: 'active' },
  { id: '3', name: 'Admin Sarah', email: 'sarah@animallifeline.com', phone: '+91 8877665544', city: 'Delhi', role: 'admin', joinedAt: '2022-11-01T09:00:00Z', status: 'active' },
  { id: '4', name: 'Spam User', email: 'spammy@fake.com', phone: '+91 1122334455', city: 'Pune', role: 'user', joinedAt: '2023-11-20T16:45:00Z', status: 'banned' },
];

export default function AdminUsers() {
  const dispatch = useDispatch();
  const bannedUsers = useSelector(s => s.admin?.bannedUsers || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmBan, setConfirmBan] = useState(null);
  const [localBanned, setLocalBanned] = useState(['4']); // seed from mock
  const users = MOCK_USERS;


  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: "2,451", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Active NGOs", value: "148", icon: ShieldCheck, color: "text-teal-500", bg: "bg-teal-50" },
    { label: "Banned Users", value: "34", icon: Ban, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Admin</span>;
      case 'ngo': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">NGO</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">User</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500 mt-1 text-sm">Monitor and manage platform users and their roles</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors shrink-0">
          <Filter className="h-4 w-4" /> Filter Users
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className={cn("font-medium", u.status === 'banned' ? "text-slate-400 line-through" : "text-slate-900")}>
                            {u.name}
                          </div>
                          {u.status === 'banned' && <span className="text-[10px] uppercase font-bold text-rose-500">Banned</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{u.email}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{u.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.city}</td>
                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(u.joinedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors" title="View Profile">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-1.5 transition-colors" title="Warn User">
                          <AlertTriangle className="h-3.5 w-3.5" /> Warn
                        </button>
                        {u.status !== 'banned' && !localBanned.includes(u.id) && u.role !== 'admin' && (
                          confirmBan === u.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  dispatch(banUser(u.id));
                                  setLocalBanned(prev => [...prev, u.id]);
                                  setConfirmBan(null);
                                }}
                                className="px-3 py-1.5 text-xs font-black rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                              >
                                Confirm Ban
                              </button>
                              <button onClick={() => setConfirmBan(null)} className="px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmBan(u.id)}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
                            >
                              <Ban className="h-3.5 w-3.5" /> Ban User
                            </button>
                          )
                        )}
                        {(localBanned.includes(u.id) || u.status === 'banned') && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-600 uppercase tracking-wider">Banned</span>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No users found.
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
