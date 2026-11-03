import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { Bell, CheckCheck } from 'lucide-react'

// In-app notifications only (Batch 5). Backend:
//   GET /notifications — own notifications, newest first, ?unreadOnly=true
//   GET /notifications/unread-count
//   PATCH /notifications/:id/read — only the recipient's own (404 otherwise)
//   PATCH /notifications/read-all
// No email, SMS or push notifications exist in the backend.
export function useUnreadCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let cancelled = false
    API.get('/notifications/unread-count')
      .then((res) => { if (!cancelled) setCount(res.data?.data?.unreadCount ?? 0) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])
  return count
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unread, setUnread] = useState(0)

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [list, count] = await Promise.all([
        API.get('/notifications'),
        API.get('/notifications/unread-count'),
      ])
      setNotifications(list.data?.data || [])
      setUnread(count.data?.data?.unreadCount ?? 0)
    } catch (err) {
      setError(err?.message || 'Could not load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const markRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
      setUnread((c) => Math.max(0, c - 1))
    } catch { /* keep the item unread; the list still shows it */ }
  }

  const markAllRead = async () => {
    try {
      await API.patch('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnread(0)
    } catch { /* no-op */ }
  }

  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-teal-600" />
          Notifications
          {unread > 0 && <span className="text-xs font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">{unread} unread</span>}
        </h3>
        {unread > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Loading notifications…</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-slate-500">No notifications yet. You will see emergency updates, donation and volunteer decisions, verification results and moderation notices here.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.slice(0, 10).map((n) => (
            <li key={n._id} className={`rounded-xl border px-4 py-3 ${n.isRead ? 'border-slate-100 bg-white' : 'border-teal-100 bg-teal-50/60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{n.title}</p>
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                </div>
                {!n.isRead && (
                  <button onClick={() => markRead(n._id)} className="text-xs font-bold text-teal-700 hover:underline shrink-0">Mark read</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
