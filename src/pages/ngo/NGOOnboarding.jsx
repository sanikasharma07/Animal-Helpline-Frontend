import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router';
import { Building, MapPin, Check, ChevronRight, ChevronLeft, Upload, FileText, CheckCircle2, Heart, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { submitNgoProfile } from '@/store/slices/ngoSlice';
import { ANIMAL_TYPES, NGO_SERVICES, ORG_TYPES, INDIAN_STATES, MAJOR_CITIES, DOCUMENT_TYPES } from '@/lib/constants';

const steps = [
  { id: 1, title: 'Organization Details', icon: Building },
  { id: 2, title: 'Operational Info', icon: MapPin },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Review & Submit', icon: CheckCircle2 }
];

export default function NGOOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: ngoError } = useSelector(state => state.ngo);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', type: '', regNumber: '', regDate: '', address: '', city: '', state: '', phone: '', email: '', website: '',
    operatingCities: [], animalsHandled: [], servicesProvided: [],
    documents: {}
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(c => c + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleDocumentUpload = (docId, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, [docId]: file }
      }));
    }
  };

  const handleSubmit = async () => {
    const resultAction = await dispatch(submitNgoProfile(formData));
    if (submitNgoProfile.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      setTimeout(() => navigate('/ngo/dashboard'), 2000);
    }
  };

  const toggleArrayItem = (field, value) => {
    setFormData(prev => {
      const arr = prev[field] || [];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value] };
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-600 mb-6">Your NGO application has been received. Our team will review your documents and get back to you within 48 hours.</p>
          <div className="animate-pulse flex justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full delay-75"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full delay-150"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 rounded-full">
              <motion.div 
                className="h-full bg-teal-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map(step => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                    isActive ? "bg-white border-teal-600 text-teal-600 shadow-lg" : 
                    isCompleted ? "bg-teal-600 border-teal-600 text-white" : "bg-slate-100 border-slate-300 text-slate-400"
                  )}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={cn(
                    "absolute -bottom-6 text-xs font-medium whitespace-nowrap",
                    isActive ? "text-teal-700" : isCompleted ? "text-slate-700" : "text-slate-400"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-12">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 1: Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Organization Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Official NGO Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Organization Type</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="">Select Type</option>
                          {ORG_TYPES?.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Registration Date</label>
                        <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={formData.regDate} onChange={e => setFormData({...formData, regDate: e.target.value})} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}>
                          <option value="">Select State</option>
                          {INDIAN_STATES?.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                          <option value="">Select City</option>
                          {MAJOR_CITIES?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Operational Info */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Operational Information</h2>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Animals Handled</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ANIMAL_TYPES?.map(animal => (
                          <button key={animal.id} onClick={() => toggleArrayItem('animalsHandled', animal.id)} className={cn("flex flex-col items-center p-3 border rounded-xl transition-all", formData.animalsHandled.includes(animal.id) ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white hover:border-teal-200")}>
                            <span className="text-2xl mb-1">{animal.emoji}</span>
                            <span className="text-sm font-medium">{animal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Services Provided</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {NGO_SERVICES?.map(service => (
                          <button key={service.id} onClick={() => toggleArrayItem('servicesProvided', service.id)} className={cn("flex items-center p-3 border rounded-xl transition-all text-left", formData.servicesProvided.includes(service.id) ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:border-teal-200")}>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center mr-3 border", formData.servicesProvided.includes(service.id) ? "bg-teal-600 border-teal-600" : "border-slate-300")}>
                              {formData.servicesProvided.includes(service.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{service.label} {service.emoji}</div>
                              <div className="text-xs text-slate-500">{service.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Documents */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Document Upload</h2>
                    <p className="text-sm text-slate-600 mb-4">Please upload clear, legible copies of your organization's documents. PDF, JPG, or PNG formats accepted.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {DOCUMENT_TYPES?.map(doc => (
                        <div key={doc.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative group hover:border-teal-300 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                                {doc.label} 
                                {doc.required && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">Required</span>}
                              </h4>
                              <p className="text-xs text-slate-500">{doc.description}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 relative">
                            {formData.documents[doc.id] ? (
                              <div className="flex items-center gap-2 bg-white border border-teal-200 p-2 rounded-lg text-sm text-teal-700">
                                <FileText className="w-4 h-4 text-teal-500" />
                                <span className="truncate flex-1">{formData.documents[doc.id].name}</span>
                                <button onClick={() => {
                                  const docs = {...formData.documents};
                                  delete docs[doc.id];
                                  setFormData({...formData, documents: docs});
                                }} className="text-slate-400 hover:text-rose-500">
                                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                                </button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white group-hover:border-teal-400 transition-colors">
                                <Upload className="w-6 h-6 text-slate-400 mb-2 group-hover:text-teal-500" />
                                <span className="text-xs text-slate-500 font-medium">Click to upload</span>
                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleDocumentUpload(doc.id, e)} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Review & Submit</h2>
                    {ngoError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg mb-6">
                        {typeof ngoError === 'string' ? ngoError : 'Failed to submit application. Please try again.'}
                      </div>
                    )}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Building className="w-4 h-4 text-teal-600"/> Organization Details</h3>
                        <button onClick={() => setCurrentStep(1)} className="text-sm text-teal-600 hover:underline">Edit</button>
                      </div>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-900">{formData.name || 'Not provided'}</dd>
                        <dt className="text-slate-500">Location</dt><dd className="font-medium text-slate-900">{formData.city}, {formData.state}</dd>
                      </dl>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Heart className="w-4 h-4 text-teal-600"/> Services & Animals</h3>
                        <button onClick={() => setCurrentStep(2)} className="text-sm text-teal-600 hover:underline">Edit</button>
                      </div>
                      <p className="text-sm text-slate-600"><span className="font-medium">Services:</span> {formData.servicesProvided.length} selected</p>
                      <p className="text-sm text-slate-600"><span className="font-medium">Animals:</span> {formData.animalsHandled.length} selected</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                       <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Shield className="w-4 h-4 text-teal-600"/> Documents</h3>
                        <button onClick={() => setCurrentStep(3)} className="text-sm text-teal-600 hover:underline">Edit</button>
                      </div>
                      <p className="text-sm text-slate-600">{Object.keys(formData.documents).length} documents uploaded</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 sm:px-8 border-t border-slate-200 flex justify-between items-center">
            <button 
              onClick={handleBack} 
              className={cn("px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors", currentStep === 1 ? "opacity-0 pointer-events-none" : "text-slate-600 hover:bg-slate-200")}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {currentStep < 4 ? (
              <button 
                onClick={handleNext}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span> Submitting...</span>
                ) : (
                  <span className="flex items-center gap-2">Submit Application <Check className="w-4 h-4" /></span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
