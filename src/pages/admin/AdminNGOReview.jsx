import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import { Link, useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { 
  ChevronLeft, Building, MapPin, Phone, Mail, Globe, 
  FileText, CheckCircle2, XCircle, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { approveVerification, rejectVerification, updateChecklistItem } from '@/store/slices/adminSlice';

export default function AdminNGOReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Mock data for a single application
  const app = {
    id,
    name: 'Paws & Care Foundation',
    regNumber: 'MH/2023/84912',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '123 Animal Rescuers Lane, Bandra West, Mumbai, 400050',
    phone: '+91 9876543210',
    email: 'contact@pawsandcare.org',
    website: 'www.pawsandcare.org',
    submittedAt: '2023-10-24T10:00:00Z',
    status: 'pending',
    documents: [
      { id: 'doc1', name: 'NGO_Registration_Certificate.pdf', type: 'Registration' },
      { id: 'doc2', name: 'PAN_Card_Copy.pdf', type: 'Tax Document' },
      { id: 'doc3', name: 'Bank_Statement_3Months.pdf', type: 'Financial' },
    ],
    notes: [
      { author: 'Admin Sarah', date: '2023-10-25T14:20:00Z', content: 'Documents look good, just waiting on address verification.' }
    ]
  };

  const [checklist, setChecklist] = useState({
    regValid: false,
    panVerified: false,
    bankConfirmed: false,
    addressVerified: false,
    repIdentity: false,
    webSocial: false,
  });

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const toggleChecklist = (key) => {
    const newVal = !checklist[key];
    setChecklist(prev => ({ ...prev, [key]: newVal }));
    // In real app, dispatch to redux
    // dispatch(updateChecklistItem({ verificationId: id, key, value: newVal }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleApprove = () => {
    // dispatch(approveVerification({ id, note: "Approved after complete review." }));
    navigate('/admin/verifications');
  };

  const handleReject = () => {
    if (!rejectReason) return;
    // dispatch(rejectVerification({ id, reason: rejectReason }));
    setRejectModalOpen(false);
    navigate('/admin/verifications');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link to="/admin/verifications" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Review Application: {app.name}</h2>
          <p className="text-slate-500 mt-1 text-sm">Submitted on {formatDate(app.submittedAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info & Docs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Building className="h-5 w-5 text-slate-500" />
              <h3 className="font-semibold text-slate-800">Organization Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Registration Number</p>
                <p className="font-medium text-slate-900">{app.regNumber}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 font-medium mb-1">Registered Address</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                  <p className="font-medium text-slate-900">{app.address}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Contact Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="font-medium text-slate-900">{app.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Contact Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <p className="font-medium text-slate-900">{app.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Website</p>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <a href={`https://${app.website}`} target="_blank" rel="noreferrer" className="font-medium text-teal-600 hover:underline">
                    {app.website}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <FileText className="h-5 w-5 text-slate-500" />
              <h3 className="font-semibold text-slate-800">Uploaded Documents</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {app.documents.map((doc) => (
                  <div key={doc.id} className="border border-slate-200 rounded-lg p-4 flex items-start gap-4 hover:border-teal-300 transition-colors cursor-pointer group">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{doc.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Checklist & Actions */}
        <div className="space-y-6">
          {/* Verification Checklist */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-slate-500" />
              <h3 className="font-semibold text-slate-800">Verification Checklist</h3>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: 'regValid', label: 'Registration Valid & Active' },
                { key: 'panVerified', label: 'PAN Card Verified' },
                { key: 'bankConfirmed', label: 'Bank Details Confirmed' },
                { key: 'addressVerified', label: 'Address Physically Verified' },
                { key: 'repIdentity', label: 'Representative Identity Checked' },
                { key: 'webSocial', label: 'Website & Social Media Checked' },
              ].map((item) => (
                <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors",
                    checklist[item.key] ? "bg-teal-500 border-teal-500" : "border-slate-300 group-hover:border-teal-400 bg-white"
                  )}>
                    {checklist[item.key] && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    checklist[item.key] ? "text-slate-800" : "text-slate-600"
                  )}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Decision Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Final Decision</h3>
            </div>
            <div className="p-5 space-y-3">
              {!allChecked && (
                <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg text-sm mb-4">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>Complete the checklist to enable approval.</p>
                </div>
              )}
              
              <button 
                disabled={!allChecked}
                onClick={handleApprove}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" /> Approve Verification
              </button>
              
              <button 
                onClick={() => setRejectModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <XCircle className="h-5 w-5" /> Reject Application
              </button>
            </div>
          </div>

          {/* Notes History */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Admin Notes</h3>
            </div>
            <div className="p-5 space-y-4">
              {app.notes.map((note, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-700">{note.author}</span>
                    <span className="text-xs text-slate-400">{formatDate(note.date)}</span>
                  </div>
                  <p className="text-slate-600">{note.content}</p>
                </div>
              ))}
              <textarea 
                placeholder="Add a new note..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none h-20"
              ></textarea>
              <button className="text-sm font-medium text-teal-600 hover:text-teal-700">Add Note</button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reject Application</h3>
              <p className="text-sm text-slate-500 mb-4">Please provide a reason for rejecting this NGO application. This will be sent to the applicant.</p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none h-32 mb-4"
              />
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReject}
                  disabled={!rejectReason}
                  className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
