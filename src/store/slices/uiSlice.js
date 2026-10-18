import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  mobileMenuOpen: false,
  activeModal: null,
  notifications: [
    { id: 'notif-1', title: 'Emergency Accepted', message: 'Prani Seva Sansthan accepted your emergency report.', read: false, at: '2024-08-30T20:45:00', type: 'emergency' },
    { id: 'notif-2', title: 'Donation Successful', message: 'Your ₹500 donation to Bruno\'s Surgery was successful.', read: true, at: '2024-08-28T10:30:00', type: 'donation' },
    { id: 'notif-3', title: 'New Verification', message: 'New NGO application from Happy Tails Foundation.', read: false, at: '2024-08-28T14:00:00', type: 'admin' },
  ],
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setMobileMenuOpen(state, action) {
      state.mobileMenuOpen = action.payload
    },
    openModal(state, action) {
      state.activeModal = action.payload
    },
    closeModal(state) {
      state.activeModal = null
    },
    markNotificationRead(state, action) {
      const notif = state.notifications.find(n => n.id === action.payload)
      if (notif) notif.read = true
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach(n => { n.read = true })
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload)
    },
    addToast(state, action) {
      state.toasts.push({ id: Date.now().toString(), ...action.payload })
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
  },
})

export const {
  toggleSidebar, setSidebarOpen, toggleMobileMenu, setMobileMenuOpen,
  openModal, closeModal, markNotificationRead, markAllNotificationsRead,
  addNotification, addToast, removeToast
} = uiSlice.actions
export default uiSlice.reducer
