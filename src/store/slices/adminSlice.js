import { createSlice } from '@reduxjs/toolkit'
import { mockVerifications } from '@/data/mockVerifications'
import { mockEmergencies } from '@/data/mockCampaigns'

const initialState = {
  verifications: mockVerifications,
  emergencies: mockEmergencies,
  stats: {
    pendingVerifications: mockVerifications.filter(v => v.status === 'pending').length,
    activeNGOs: 6,
    activeCases: mockEmergencies.filter(e => !['resolved', 'flagged_spam'].includes(e.status)).length,
    totalDonations: 18500000,
    platformGMV: 24200000,
    totalUsers: 1245,
    flaggedItems: 2,
  },
  bannedUsers: [],
  suspendedCampaigns: [],
  actionLog: [
    { id: 'log-001', action: 'approve_ngo', target: 'Stray Haven', by: 'Admin', at: '2024-06-18T14:30:00', details: 'All documents verified.' },
    { id: 'log-002', action: 'reject_ngo', target: 'Wildlife Warriors India', by: 'Admin', at: '2022-10-05T11:00:00', details: 'Document authenticity concerns.' },
    { id: 'log-003', action: 'flag_spam', target: 'Emergency EM-1027', by: 'Admin', at: '2024-08-29T08:00:00', details: 'Fake emergency report detected.' },
    { id: 'log-004', action: 'approve_ngo', target: 'Helping Paws Foundation', by: 'Admin', at: '2019-04-20T10:00:00', details: 'Approved after thorough review.' },
  ],
  currentReview: null,
  isLoading: false,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setCurrentReview(state, action) {
      state.currentReview = action.payload
    },
    approveVerification(state, action) {
      const { id, note } = action.payload
      const ver = state.verifications.find(v => v.id === id)
      if (ver) {
        ver.status = 'approved'
        ver.notes.push({ text: note || 'Application approved.', by: 'Admin', at: new Date().toISOString() })
        state.stats.pendingVerifications = state.verifications.filter(v => v.status === 'pending').length
        state.stats.activeNGOs += 1
      }
    },
    rejectVerification(state, action) {
      const { id, reason } = action.payload
      const ver = state.verifications.find(v => v.id === id)
      if (ver) {
        ver.status = 'rejected'
        ver.notes.push({ text: reason, by: 'Admin', at: new Date().toISOString() })
        state.stats.pendingVerifications = state.verifications.filter(v => v.status === 'pending').length
      }
    },
    updateChecklistItem(state, action) {
      const { verificationId, key, value } = action.payload
      const ver = state.verifications.find(v => v.id === verificationId)
      if (ver) {
        ver.checklist[key] = value
      }
    },
    flagEmergencyAsSpam(state, action) {
      const emergency = state.emergencies.find(e => e.id === action.payload)
      if (emergency) {
        emergency.status = 'flagged_spam'
        emergency.updates.push({ text: 'Flagged as spam by admin.', at: new Date().toISOString() })
      }
    },
    deleteEmergency(state, action) {
      state.emergencies = state.emergencies.filter(e => e.id !== action.payload)
    },
    addActionLog(state, action) {
      state.actionLog.unshift(action.payload)
    },
    banUser(state, action) {
      if (!state.bannedUsers) state.bannedUsers = []
      if (!state.bannedUsers.includes(action.payload)) {
        state.bannedUsers.push(action.payload)
      }
      state.stats.totalUsers = (state.stats.totalUsers || 1245) - 1
      state.actionLog.unshift({
        id: `log-${Date.now()}`,
        action: 'ban_user',
        target: `User #${action.payload}`,
        by: 'Admin',
        at: new Date().toISOString(),
        details: 'User banned for platform violations.'
      })
    },
    suspendCampaign(state, action) {
      if (!state.suspendedCampaigns) state.suspendedCampaigns = []
      if (!state.suspendedCampaigns.includes(action.payload)) {
        state.suspendedCampaigns.push(action.payload)
      }
      state.actionLog.unshift({
        id: `log-${Date.now()}`,
        action: 'suspend_campaign',
        target: `Campaign ${action.payload}`,
        by: 'Admin',
        at: new Date().toISOString(),
        details: 'Campaign suspended pending compliance review.'
      })
    }
  },
})

export const {
  setCurrentReview, approveVerification, rejectVerification,
  updateChecklistItem, flagEmergencyAsSpam, deleteEmergency, addActionLog,
  banUser, suspendCampaign
} = adminSlice.actions
export default adminSlice.reducer
