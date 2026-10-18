import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '@/api/axios'
import { mockEmergencies } from '@/data/mockCampaigns'

// ===== Async Thunk for Reporting Emergency =====
export const reportEmergency = createAsyncThunk(
  'emergency/reportEmergency',
  async (emergencyData, { rejectWithValue }) => {
    try {
      // In production, this hits: POST /api/v1/emergencies (matching backend EmergencyCase schema)
      // const response = await API.post('/emergencies', emergencyData)
      // return response.data.data

      // Simulated network request for demo/production readiness
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const newCase = {
        _id: `sos-${Date.now()}`,
        species: emergencyData.species || 'Dog',
        condition: emergencyData.condition || 'Injured animal requiring immediate rescue',
        severity: emergencyData.severity || 'high',
        location: {
          address: emergencyData.location?.address || 'Near City Center, Main Street',
          lat: emergencyData.location?.lat || 26.9124,
          lng: emergencyData.location?.lng || 75.7873,
        },
        image: emergencyData.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
        reporterName: emergencyData.reporterName || 'Animal Lifeline User',
        reporterPhone: emergencyData.reporterPhone || '9876543210',
        status: 'reported', // 'reported' | 'rescue_accepted' | 'resolved'
        createdAt: new Date().toISOString(),
      }

      return newCase
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to dispatch SOS emergency')
    }
  }
)

const initialState = {
  cases: mockEmergencies || [],
  activeCase: null,
  isSOSModalOpen: false,
  isLoading: false,
  error: null,
  successMessage: null,
}

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    openSOSModal(state) {
      state.isSOSModalOpen = true
      state.error = null
      state.successMessage = null
    },
    closeSOSModal(state) {
      state.isSOSModalOpen = false
      state.error = null
      state.successMessage = null
    },
    clearEmergencyError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reportEmergency.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(reportEmergency.fulfilled, (state, action) => {
        state.isLoading = false
        state.cases.unshift(action.payload)
        state.activeCase = action.payload
        state.successMessage = '🚨 SOS Broadcast Successful! Nearby NGOs & Rescue Teams Notified.'
      })
      .addCase(reportEmergency.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to dispatch SOS alert.'
      })
  },
})

export const { openSOSModal, closeSOSModal, clearEmergencyError } = emergencySlice.actions
export default emergencySlice.reducer
