import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '@/store/slices/uiSlice'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const STYLES = {
  success: 'bg-white border-l-4 border-emerald-500 text-slate-800',
  error: 'bg-white border-l-4 border-rose-500 text-slate-800',
  warning: 'bg-white border-l-4 border-amber-500 text-slate-800',
  info: 'bg-white border-l-4 border-teal-500 text-slate-800',
}

const ICON_STYLES = {
  success: 'text-emerald-500',
  error: 'text-rose-500',
  warning: 'text-amber-500',
  info: 'text-teal-500',
}

function Toast({ toast }) {
  const dispatch = useDispatch()
  const Icon = ICONS[toast.type] || Info

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id))
    }, toast.duration || 3500)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, dispatch])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl shadow-slate-900/10 min-w-[280px] max-w-sm w-full',
        STYLES[toast.type] || STYLES.info
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', ICON_STYLES[toast.type] || ICON_STYLES.info)} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-bold text-sm text-slate-900 leading-tight">{toast.title}</p>
        )}
        <p className="text-sm text-slate-600 leading-snug">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => dispatch(removeToast(toast.id))}
        className="shrink-0 p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui?.toasts || [])

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
