import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '@/store/slices/authSlice'
import { PawPrint, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'ngo') navigate('/ngo/dashboard')
      else navigate('/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    const resultAction = await dispatch(loginUser({ email, password }))
    if (loginUser.fulfilled.match(resultAction)) {
      const loggedUser = resultAction.payload.user
      if (loggedUser?.role === 'admin') navigate('/admin')
      else if (loggedUser?.role === 'ngo') navigate('/ngo/dashboard')
      else navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      {/* Left side - Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[60%] gradient-hero relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Animated Background Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-white/10 blur-2xl" 
        />
        <motion.div 
          animate={{ x: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-white/10 blur-3xl" 
        />
        
        <div className="z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl glass">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Animal Lifeline</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Every life deserves a second chance.
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Join thousands of animal lovers, volunteers, and NGOs working together to rescue, rehabilitate, and rehome animals in need across the country.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="z-10 flex items-center gap-4 p-5 rounded-2xl bg-black/20 backdrop-blur-md w-max border border-white/10"
        >
          <div className="text-sm font-medium">
            <span className="block text-xl font-bold text-teal-300">Sign in to help</span>
            <span className="text-white/80">Report and track emergencies, donate, pledge supplies and volunteer.</span>
          </div>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 sm:p-12 bg-background relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="p-3 bg-primary rounded-2xl text-white">
              <PawPrint className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-foreground">Animal Lifeline</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-8 sm:p-10 shadow-xl shadow-teal-900/5 border border-slate-100"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Sign in to your Animal Lifeline account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-slate-50 px-4 py-3">
                  <Mail className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) dispatch(clearError())
                    }}
                    className="flex-1 w-full bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
                    placeholder="name@example.com"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-slate-50 px-4 py-3">
                  <Lock className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) dispatch(clearError())
                    }}
                    className="flex-1 w-full bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || !password || isLoading}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                  email && password && !isLoading
                    ? "bg-primary text-white hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-900/20 active:scale-[0.98]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center">
            <Link to="/ngo/onboarding" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              <Shield className="w-4 h-4" />
              Register as NGO
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
