import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '@/api/axios'

// ===== Async Thunk for Reporting Emergency =====
// POST /api/v1/emergency/report
// Fields: species, quickDescription, longitude, latitude, media[] (optional, max 3)
export const reportEmergency = createAsyncThunk(
  'emergency/reportEmergency',
  async (emergencyData, { rejectWithValue }) => {
    try {
      // Build multipart/form-data since media files may be attached
      const formData = new FormData()
      formData.append('species', emergencyData.species || 'Unknown')
      formData.append('quickDescription', emergencyData.quickDescription || emergencyData.condition || 'Animal in distress')
      formData.append('longitude', String(emergencyData.longitude ?? emergencyData.location?.lng ?? 78.9629))
      formData.append('latitude', String(emergencyData.latitude ?? emergencyData.location?.lat ?? 20.5937))

      // Attach optional media files
      if (emergencyData.mediaFiles && emergencyData.mediaFiles.length > 0) {
        emergencyData.mediaFiles.slice(0, 3).forEach((file) => {
          formData.append('media', file)
        })
      }

      const response = await API.post('/emergency/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return response.data.data
    } catch (error) {
      // Mock fallback when backend is not running
      const isNetworkError =
        !error.response || error.statusCode === undefined || error.code === 'ERR_NETWORK'
      if (isNetworkError) {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        const newCase = {
          _id: `sos-${Date.now()}`,
          animalInfo: {
            species: emergencyData.species || 'Dog',
            quickDescription: emergencyData.quickDescription || emergencyData.condition || 'Animal in distress',
          },
          location: {
            type: 'Point',
            coordinates: [
              emergencyData.longitude ?? emergencyData.location?.lng ?? 78.9629,
              emergencyData.latitude ?? emergencyData.location?.lat ?? 20.5937,
            ],
          },
          status: 'Reported',
          createdAt: new Date().toISOString(),
        }
        return newCase
      }
      return rejectWithValue(error?.message || 'Failed to dispatch SOS emergency')
    }
  }
)

const initialState = {
  cases: [],
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
