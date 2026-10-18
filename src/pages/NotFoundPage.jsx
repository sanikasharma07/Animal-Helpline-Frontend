import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { PawPrint, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-teal-900/5 border border-teal-50 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-50 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <motion.div 
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <PawPrint size={48} />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            404
            <span className="block text-xl md:text-2xl font-bold text-slate-700 mt-2">
              Lost like a stray
            </span>
          </h1>
          
          <p className="text-slate-500 mb-8 leading-relaxed">
            The page you are looking for has wandered off and couldn't be found. Let's get you back to familiar territory.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
