import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, MapPin, Phone, MessageCircle, CheckCircle2, Clock, AlertTriangle, Zap, Shield, Truck } from 'lucide-react';

const statuses = [
  'Rescue Accepted',
  'Rescuer Dispatched',
  'Rescuer En Route',
  '15 min away',
  '10 min away',
  '5 min away',
  'Animal Picked Up',
  'En Route to Vet',
  'At Veterinary Facility'
];

export default function ActiveRescueTracker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cases = useSelector((state) => state.emergency?.cases || []);
  const rescueCase = cases.find((c) => c.id === id);

  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!rescueCase) return;
    
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 8000);
    
    return () => clearInterval(interval);
  }, [rescueCase]);

  if (!rescueCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-semibold text-slate-800">Case Not Found</h2>
        <p className="text-slate-600">The emergency case you're looking for does not exist or has been resolved.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg shadow font-medium">Go Back</button>
      </div>
    );
  }

  const currentStatus = statuses[statusIndex];
  const ngoName = rescueCase.assignedNgoName || 'Local Animal Rescue';
  
  const getFirstAidTips = (species) => {
    const s = (species || '').toLowerCase();
    if (s.includes('dog') || s.includes('cat')) {
      return [
        'Keep the animal calm and do not attempt to move it.',
        'If bleeding, apply gentle pressure with clean cloth.',
        'Do not offer food or water.',
        'Keep it shaded and away from traffic.'
      ];
    } else if (s.includes('bird')) {
      return [
        'Gently place in a ventilated cardboard box.',
        'Keep it in a dark, quiet, and warm place.',
        'Do not try to feed or give water.',
        'Do not use wire cages.'
      ];
    } else if (s.includes('cattle') || s.includes('cow')) {
      return [
        'Do not approach from behind; approach slowly from the side.',
        'Ensure the area is secure to prevent further injury.',
        'Do not force the animal to stand if it is lying down.',
        'Provide shade if possible.'
      ];
    }
    return [
      'Keep your distance and do not panic the animal.',
      'Ensure the area is secure.',
      'Wait for trained professionals to arrive.',
      'Do not offer food or water unless instructed.'
    ];
  };

  const firstAidTips = getFirstAidTips(rescueCase.species || rescueCase.animalType);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-stretch max-w-4xl mx-auto">
      {/* 1. Header / Case Banner */}
      <div className="bg-white p-4 sm:p-6 shadow-sm border-b border-slate-200 flex flex-col gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Live Rescue Tracking
            </h1>
          </div>
          <div className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-sm">
            {rescueCase.id}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 font-medium rounded-full border border-slate-200 capitalize">
            {rescueCase.species || rescueCase.animalType || 'Animal'}
          </span>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 font-medium rounded-full border border-amber-200 capitalize flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {rescueCase.severity || 'Urgent'}
          </span>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 font-semibold rounded-full border border-teal-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
            </span>
            {currentStatus}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* 2. Map Placeholder */}
        <div className="relative w-full h-64 sm:h-80 bg-slate-200 rounded-2xl border border-slate-300 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Dot pattern background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Tracking — GPS Active
          </div>

          <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-mono text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            Lat: {rescueCase.location?.lat?.toFixed(4) || '19.0760'} | Lng: {rescueCase.location?.lng?.toFixed(4) || '72.8777'}
          </div>

          {/* Map Elements Simulation */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Dashed line */}
            <svg className="absolute w-48 h-32 text-teal-600 opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 20,80 C 40,20 60,80 80,20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            
            {/* Rescuer Pin */}
            <motion.div 
              className="absolute top-1/3 right-1/3 flex flex-col items-center z-10"
              animate={{ x: [0, -10, -20], y: [0, 10, 20] }}
              transition={{ duration: 16, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="bg-teal-600 p-2 rounded-full shadow-lg text-white">
                <Truck className="w-5 h-5" />
              </div>
              <div className="mt-1 px-2 py-0.5 bg-white text-[10px] font-bold text-teal-700 rounded shadow border border-teal-100">
                Rescuer
              </div>
            </motion.div>
            
            {/* Emergency Pin */}
            <div className="absolute bottom-1/3 left-1/3 flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-2 bg-rose-500/20 rounded-full animate-ping"></div>
                <div className="bg-rose-500 p-2 rounded-full shadow-lg text-white relative z-10">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-1 px-2 py-0.5 bg-white text-[10px] font-bold text-rose-700 rounded shadow border border-rose-100 relative z-10">
                Emergency
              </div>
            </div>
          </div>
        </div>

        {/* 3. Rescuer Contact Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <img 
              src={`https://i.pravatar.cc/80?u=${encodeURIComponent(ngoName)}`} 
              alt="Rescuer avatar" 
              className="w-14 h-14 rounded-full border-2 border-teal-100 shadow-sm object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-800 truncate">{ngoName}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Truck className="w-3.5 h-3.5" /> Rescue Van
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">ETA</div>
              <div className="text-lg font-bold text-teal-700">
                {currentStatus.includes('min') ? currentStatus.split(' ')[0] + 'm' : '~'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex-1 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
              <Phone className="w-4 h-4" /> Call Rescuer
            </button>
            <button className="flex-1 bg-white hover:bg-slate-50 active:bg-slate-100 text-teal-700 border border-teal-600 py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" /> Message
            </button>
          </div>
        </div>

        {/* 4. Live Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" /> Activity Log
          </h3>
          <div className="flex flex-col relative">
            <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-slate-100 z-0"></div>
            {statuses.map((status, index) => {
              const isCompleted = index < statusIndex;
              const isCurrent = index === statusIndex;
              
              return (
                <div key={status} className="flex gap-4 relative z-10 mb-4 last:mb-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    ) : isCurrent ? (
                      <span className="relative flex h-3.5 w-3.5 mt-1 ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-600 ring-4 ring-teal-50"></span>
                      </span>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 ml-1.5"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className={cn(
                      "text-sm font-medium",
                      isCompleted ? "text-slate-800" : isCurrent ? "text-teal-700 font-bold" : "text-slate-400"
                    )}>
                      {status}
                    </p>
                    {(isCompleted || isCurrent) && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(Date.now() - (statusIndex - index) * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. AI First-Aid Card */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex flex-col gap-4">
          <h3 className="text-amber-800 font-bold flex items-center gap-2 text-base">
            <span className="text-xl">🤖</span> AI First-Aid Assistant
          </h3>
          <ul className="flex flex-col gap-3">
            {firstAidTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-amber-900 font-medium">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-3 border-t border-amber-200/60 text-xs text-amber-700/80 font-medium italic">
            Disclaimer: These are general guidelines. A trained rescuer is on the way.
          </div>
        </div>

      </div>
    </div>
  );
}
