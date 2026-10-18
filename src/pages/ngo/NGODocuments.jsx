import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import { FileText, Upload, CheckCircle2, Clock, AlertTriangle, Download, Plus } from 'lucide-react';
import { mockNGODocuments } from '@/data/mockNGOs';
import { DOCUMENT_TYPES } from '@/lib/constants';

export default function NGODocuments() {
  const documents = mockNGODocuments['ngo1'] || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and update your organization's official documents.</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
          const docTypeInfo = DOCUMENT_TYPES?.find(t => t.id === doc.type) || { label: doc.type };
          
          return (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1",
                  doc.status === 'verified' && "bg-emerald-100 text-emerald-700",
                  doc.status === 'pending' && "bg-amber-100 text-amber-700",
                  doc.status === 'rejected' && "bg-rose-100 text-rose-700"
                )}>
                  {doc.status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                  {doc.status === 'pending' && <Clock className="w-3 h-3" />}
                  {doc.status === 'rejected' && <AlertTriangle className="w-3 h-3" />}
                  <span className="capitalize">{doc.status}</span>
                </span>
              </div>
              
              <h3 className="font-bold text-slate-900 mb-1">{docTypeInfo.label}</h3>
              <p className="text-sm text-slate-500 truncate mb-4" title={doc.fileName}>{doc.fileName}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-400 mb-5">
                <span>Uploaded on {formatDate(doc.uploadedAt)}</span>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button className="flex-1 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Update
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
