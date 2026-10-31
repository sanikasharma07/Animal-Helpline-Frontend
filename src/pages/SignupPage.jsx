import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '@/store/slices/authSlice'
import { ArrowRight, Shield, User, Mail, Phone, Lock, Eye, EyeOff, ChevronRight, CheckCircle2, AlertCircle, Check, X } from 'lucide-react'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isNgo, setIsNgo] = useState(false)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Password rules validation
  const passwordRules = [
    { id: 'length', label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { id: 'uppercase', label: 'At least 1 uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'At least 1 lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'At least 1 number (0-9)', test: (pwd) => /[0-9]/.test(pwd) },
    { id: 'symbol', label: 'At least 1 special character (!@#$%^&*)', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
  ]

  const isPasswordValid = passwordRules.every((rule) => rule.test(formData.password))
  const isPasswordMatching = formData.password.length > 0 && formData.password === formData.confirmPassword

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.phone.length === 10) {
      nextStep()
    }
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    if (isPasswordValid && isPasswordMatching) {
      nextStep()
    }
  }

  const handleFinalSubmit = async () => {
    if (!isPasswordValid || !isPasswordMatching) return

    const resultAction = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
    )

    if (registerUser.fulfilled.match(resultAction)) {
      if (isNgo) {
        navigate('/ngo/onboarding')
      } else {
        navigate('/dashboard')
      }
    }
  }

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 pb-24 sm:pb-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl z-10 mt-4 sm:mt-0">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Join Animal Lifeline</h1>
          <p className="text-slate-500 text-lg">Create your account to start saving lives.</p>
        </div>

        {/* Stepper Header */}
        <div className="relative flex items-center justify-between mb-8 px-4">
          {/* Track */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0 pointer-events-none" />
          {/* Progress fill */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ease-in-out pointer-events-none"
            style={{ width: `calc(${((step - 1) / 2) * 100}% * (100% - 2rem) / 100%)` }}
          />

          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                step === s
                  ? "bg-primary text-white shadow-lg shadow-teal-900/20 scale-110"
                  : step > s
                  ? "bg-primary text-white"
                  : "bg-white text-slate-400 border-2 border-slate-200"
              )}
            >
              {step > s ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 md:p-10 relative overflow-hidden min-h-[420px]">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Details</h2>
                <form onSubmit={handleStep1Submit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (error) dispatch(clearError())
                      }}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Jane Doe"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (error) dispatch(clearError())
                      }}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-slate-50">
                      <div className="flex items-center justify-center px-4 border-r border-slate-200 bg-slate-100/50 text-slate-500 font-medium">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                          if (error) dispatch(clearError())
                        }}
                        className="flex-1 w-full p-4 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
                        placeholder="Enter 10 digit number"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!formData.name || !formData.email || formData.phone.length !== 10}
                    className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-primary text-white hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all mt-4"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={prevStep} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <h2 className="text-2xl font-bold text-slate-900">Set Security Password</h2>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" /> Password
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 px-4 py-3">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value })
                          if (error) dispatch(clearError())
                        }}
                        className="flex-1 w-full bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
                        placeholder="Create a strong password"
                        autoFocus
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

                  {/* Password Rules Checklist */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
                    {passwordRules.map((rule) => {
                      const isMet = rule.test(formData.password)
                      return (
                        <div key={rule.id} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center text-[10px]",
                              isMet ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                            )}
                          >
                            {isMet ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3" />}
                          </div>
                          <span className={isMet ? "text-emerald-700 font-medium" : "text-slate-500"}>
                            {rule.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Re-enter your password"
                    />
                    {formData.confirmPassword && !isPasswordMatching && (
                      <p className="text-xs text-rose-600 font-medium">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!isPasswordValid || !isPasswordMatching}
                    className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-primary text-white hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all mt-4"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={prevStep} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <h2 className="text-2xl font-bold text-slate-900">Account Type & Review</h2>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-semibold text-slate-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-semibold text-slate-900">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-semibold text-slate-900">+91 {formData.phone}</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setIsNgo(!isNgo)}
                    className={cn(
                      "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                      isNgo ? "border-primary bg-teal-50/50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-md border-2 flex items-center justify-center mt-1 transition-colors",
                          isNgo ? "border-primary bg-primary" : "border-slate-300 bg-white"
                        )}
                      >
                        {isNgo && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Register as an NGO
                        </h3>
                        <p className="text-slate-500 text-sm">
                          I represent an animal welfare organization, shelter, or rescue group looking to onboard onto Animal Lifeline.
                        </p>
                      </div>
                    </div>
                  </div>

                  {isNgo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-200/50"
                    >
                      You will be registered and then redirected to the NGO Verification Portal to submit your organization details.
                    </motion.div>
                  )}

                  <button
                    onClick={handleFinalSubmit}
                    disabled={isLoading}
                    className="w-full py-4 mt-6 rounded-xl font-semibold flex items-center justify-center gap-2 bg-primary text-white hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isNgo ? (
                      "Complete & Go to NGO Onboarding"
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
