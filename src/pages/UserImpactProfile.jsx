import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import {
  Shield, Award, Heart, Package, Users, Siren,
  DollarSign, Star, CheckCircle2, ChevronLeft, PawPrint, Calendar
} from 'lucide-react'

const AnimatedCounter = ({ target, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      setCount(Math.floor(target * percentage));
      
      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [target, duration]);

  return <>{count}</>;
};

const TIMELINE_EVENTS = [
  { type: 'emergency', date: 'Sep 13, 2026', title: 'Reported Injured Dog', desc: 'Dispatched SOS for a stray near MG Road. Rescue completed in 22 minutes.', color: 'bg-rose-500', pill: 'Emergency', pillColor: 'bg-rose-100 text-rose-700' },
  { type: 'supply', date: 'Sep 10, 2026', title: 'Donated 5kg Dog Food', desc: 'Contributed food supplies to Prani Seva Sansthan for their shelter animals.', color: 'bg-blue-500', pill: 'Supply Drop', pillColor: 'bg-blue-100 text-blue-700' },
  { type: 'volunteer', date: 'Sep 5, 2026', title: 'Volunteered at Shelter', desc: '4 hours at Helping Paws Foundation — assisted with feeding and grooming sessions.', color: 'bg-teal-500', pill: 'Volunteer', pillColor: 'bg-teal-100 text-teal-700' },
  { type: 'donation', date: 'Aug 28, 2026', title: "Donated ₹500 to Bruno's Surgery", desc: "Contributed to Bruno's emergency surgery fund. Fully funded in 3 days!", color: 'bg-emerald-500', pill: 'Donation', pillColor: 'bg-emerald-100 text-emerald-700' },
  { type: 'emergency', date: 'Aug 20, 2026', title: 'Reported Trapped Kitten', desc: 'Kitten rescued from storm drain in Koramangala. NGO responded in 35 minutes.', color: 'bg-rose-500', pill: 'Emergency', pillColor: 'bg-rose-100 text-rose-700' },
  { type: 'volunteer', date: 'Aug 15, 2026', title: 'Joined Vaccination Drive', desc: 'Helped vaccinate 12 stray dogs in the neighborhood during a community drive.', color: 'bg-teal-500', pill: 'Volunteer', pillColor: 'bg-teal-100 text-teal-700' }
];

export default function UserImpactProfile() {
  const navigate = useNavigate();
  const userId = "u10293"; // Mock user id
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Section 1: HEADER CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative pt-12 text-center">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-4 left-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="mx-auto w-24 h-24 rounded-full border-4 border-teal-200 overflow-hidden mb-4">
            <img 
              src={`https://i.pravatar.cc/200?u=${userId}`} 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 mb-2">Sanika Desai</h1>
          
          <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black border border-amber-300">
              <Shield className="h-3.5 w-3.5" />
              Verified Helper
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              Member since September 2026
            </span>
          </div>
          
          <div className="flex justify-center gap-4 text-sm font-semibold text-slate-700">
            <span className="bg-slate-100 px-3 py-1 rounded-full">🚨 3 Rescues</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">🤝 12 Hrs Volunteered</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">📦 5 Supplies</span>
          </div>
        </div>

        {/* Section 2: LIFETIME STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-full mb-3">
              <Siren className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              <AnimatedCounter target={3} duration={1000} />
            </h3>
            <p className="text-xs font-semibold text-slate-500">Rescues Assisted</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-full mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              <AnimatedCounter target={12} duration={1000} />
            </h3>
            <p className="text-xs font-semibold text-slate-500">Hours Volunteered</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              <AnimatedCounter target={5} duration={1000} />
            </h3>
            <p className="text-xs font-semibold text-slate-500">Supplies Given</p>
          </div>
        </div>

        {/* Section 3: IMPACT TIMELINE */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-teal-500" />
            My Impact Timeline
          </h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 z-0"></div>
            
            <div className="space-y-6">
              {TIMELINE_EVENTS.map((event, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12"
                >
                  <div className={cn("absolute left-2.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow flex items-center justify-center z-10", event.color)}>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", event.pillColor)}>
                        {event.pill}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{event.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{event.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: CTA CARD */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-sm text-center">
          <h2 className="text-xl font-black mb-6">Keep Making a Difference 🐾</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors shadow-sm">
              Report Emergency
            </button>
            <button className="px-6 py-3 bg-white hover:bg-slate-50 text-teal-700 rounded-xl font-bold transition-colors shadow-sm">
              Explore NGOs
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
