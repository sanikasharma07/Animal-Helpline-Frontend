import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatTimeAgo } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { 
  AlertTriangle, Filter, Eye, Flag, Trash2, Ban, 
  Clock, Activity, PieChart
} from 'lucide-react';
import { flagEmergencyAsSpam, deleteEmergency } from '@/store/slices/adminSlice';

const MOCK_EMERGENCIES = [
  { id: 'CASE-1029', animalType: '🐕', location: 'Andheri West, Mumbai', reporter: 'Rahul Sharma', assignedNGO: 'Paws & Care', status: 'reported', ageHours: 50, severity: 'critical' },
  { id: 'CASE-1030', animalType: '🐈', location: 'Bandra, Mumbai', reporter: 'Anita K', assignedNGO: 'Pending', status: 'reported', ageHours: 2, severity: 'moderate' },
  { id: 'CASE-1031', animalType: '🐄', location: 'Borivali, Mumbai', reporter: 'Suresh D', assignedNGO: 'Gau Seva Trust', status: 'rescue_accepted', ageHours: 24, severity: 'high' },
  { id: 'CASE-1032', animalType: '🐦', location: 'Dadar, Mumbai', reporter: 'Priya M', assignedNGO: 'Avian Rescue', status: 'resolved', ageHours: 120, severity: 'low' },
];

export default function AdminEmergencies() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const emergencies = MOCK_EMERGENCIES;
  
  // Find orphaned cases
  const orphanedCases = emergencies.filter(e => e.status === 'reported' && e.ageHours >= 48);

  const getSeverityBadge = (severity) => {
    const styles = {
      low: "bg-slate-100 text-slate-700 border-slate-200",
      moderate: "bg-amber-100 text-amber-800 border-amber-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", styles[severity] || styles.low)}>{severity.toUpperCase()}</span>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      reported: "bg-amber-50 text-amber-700 border-amber-200",
      rescue_accepted: "bg-blue-50 text-blue-700 border-blue-200",
      resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      flagged_spam: "bg-rose-50 text-rose-700 border-rose-200",
    };
    const labels = {
      reported: "Reported", rescue_accepted: "In Progress", resolved: "Resolved", flagged_spam: "Spam"
    };
    return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", styles[status] || styles.reported)}>{labels[status] || status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Emergency Oversight</h2>
          <p className="text-slate-500 mt-1 text-sm">Monitor live cases, detect spam, and track NGO responsiveness</p>
        </div>
      </div>

      {/* Analytics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Active Cases</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">1,245</h4>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
            <Activity className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Response Time</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">2.4 hrs</h4>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <Clock className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
          <div className="w-full">
            <p className="text-sm font-medium text-slate-500 mb-3">Cases by Severity</p>
            <div className="flex h-3 w-full rounded-full overflow-hidden">
              <div className="bg-rose-500 w-[15%]" title="Critical: 15%"></div>
              <div className="bg-orange-400 w-[25%]" title="High: 25%"></div>
              <div className="bg-amber-400 w-[40%]" title="Moderate: 40%"></div>
              <div className="bg-slate-300 w-[20%]" title="Low: 20%"></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium">
              <span>Crit</span><span>High</span><span>Mod</span><span>Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orphaned Cases Alert */}
      {orphanedCases.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-4"
        >
          <div className="p-2 bg-rose-100 rounded-full shrink-0">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-rose-800">Attention Required: Orphaned Cases</h3>
            <p className="text-rose-600 text-sm mt-1">
              {orphanedCases.length} cases have been pending for over 48 hours. Please review and reassign or contact nearby NGOs directly.
            </p>
          </div>
        </motion.div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">Case Directory</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Case Info</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Reporter</th>
                <th className="px-6 py-4 font-medium">Assigned NGO</th>
                <th className="px-6 py-4 font-medium">Status & Age</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emergencies.map((e) => (
                <React.Fragment key={e.id}>
                <tr className={cn("hover:bg-slate-50/50 transition-colors", e.ageHours >= 48 && e.status === 'reported' ? 'bg-rose-50/30' : '')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{e.animalType}</span>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{e.id}</div>
                        <div className="mt-1">{getSeverityBadge(e.severity)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{e.location}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{e.reporter}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{e.assignedNGO}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      {getStatusBadge(e.status)}
                      {e.status === 'reported' && (
                        <div className={cn("text-xs font-medium flex items-center gap-1", e.ageHours >= 48 ? "text-rose-600" : "text-slate-500")}>
                          <Clock className="h-3 w-3" /> {e.ageHours}h ago
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => dispatch(flagEmergencyAsSpam(e.id))}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 border-amber-300 text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Flag className="h-4 w-4" /> Flag Spam
                      </button>
                      {e.ageHours >= 48 && e.status === 'reported' ? (
                        <button 
                          onClick={() => setConfirmDelete(e.id)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 flex items-center gap-1.5 border-rose-500 text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                        >
                          <Trash2 className="h-4 w-4" /> Delete Fake SOS
                        </button>
                      ) : (
                        <button 
                          onClick={() => setConfirmDelete(e.id)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" /> Delete SOS
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {confirmDelete === e.id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-amber-50"
                  >
                    <td colSpan="6" className="px-6 py-3 text-center border-t border-amber-100">
                      <div className="flex items-center justify-center gap-4 text-amber-800 text-sm font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        Are you sure? This is irreversible.
                        <button 
                          onClick={() => { dispatch(deleteEmergency(e.id)); setConfirmDelete(null); }}
                          className="px-3 py-1 bg-rose-600 text-white rounded shadow-sm hover:bg-rose-700 transition-colors text-xs font-bold"
                        >
                          Confirm Delete
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded shadow-sm hover:bg-slate-50 transition-colors text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
