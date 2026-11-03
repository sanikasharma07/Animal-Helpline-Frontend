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
      // Never invent a location for an emergency: without real coordinates
      // the backend cannot find nearby help, and a wrong pin sends rescuers
      // to the wrong place. The caller must supply device or manual coordinates.
      const lng = emergencyData.longitude ?? emergencyData.location?.lng
      const lat = emergencyData.latitude ?? emergencyData.location?.lat
      if (!Number.isFinite(Number(lng)) || !Number.isFinite(Number(lat))) {
        return rejectWithValue('Location is required to report an emergency. Please allow location access or enter coordinates.')
      }
      formData.append('longitude', String(lng))
      formData.append('latitude', String(lat))

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
      return rejectWithValue(error?.message || 'Failed to report the emergency. Please try again.')
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
        // Honest wording: reporting does not notify or assign any NGO.
        // Assignment happens only when a verified NGO accepts the case.
        state.successMessage = 'Emergency reported. A verified NGO can now accept it, and you can track it from your dashboard.'
      })
      .addCase(reportEmergency.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to report the emergency.'
      })
  },
})

export const { openSOSModal, closeSOSModal, clearEmergencyError } = emergencySlice.actions
export default emergencySlice.reducer
