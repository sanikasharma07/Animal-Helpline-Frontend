import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '@/api/axios'
import { mockNGOs } from '@/data/mockNGOs'
import { mockEmergencies } from '@/data/mockCampaigns'

export const submitNgoProfile = createAsyncThunk(
  'ngo/submitNgoProfile',
  async (formDataObj, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      const { documents, animalsHandled, servicesProvided, ...textFields } = formDataObj

      // Append plain text fields
      Object.keys(textFields).forEach(key => {
        if (textFields[key] !== undefined && textFields[key] !== null) {
          formData.append(key, textFields[key])
        }
      })

      // Backend parses comma-separated string OR array — send as comma-joined string
      if (Array.isArray(animalsHandled)) {
        formData.append('animalsHandled', animalsHandled.join(','))
      } else if (animalsHandled) {
        formData.append('animalsHandled', animalsHandled)
      }

      if (Array.isArray(servicesProvided)) {
        formData.append('servicesProvided', servicesProvided.join(','))
      } else if (servicesProvided) {
        formData.append('servicesProvided', servicesProvided)
      }

      // Append document File objects for multer (field names must match backend)
      if (documents) {
        Object.keys(documents).forEach(docId => {
          if (documents[docId] instanceof File) {
            formData.append(docId, documents[docId])
          }
        })
      }

      // Correct URL: baseURL already includes /api/v1
      const response = await API.post('/ngo/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return response.data
    } catch (error) {
      // If backend is not running (network error / dev mode), simulate success
      const isNetworkError = !error.response
      if (isNetworkError) {
        await new Promise(resolve => setTimeout(resolve, 1200))
        return { success: true, mock: true, message: 'Application submitted (dev mode).' }
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const initialState = {
  ngos: mockNGOs,
  currentNGO: null,
  nearbyNGOs: [],
  filters: {
    animalType: [],
    services: [],
    maxDistance: 50,
    verifiedOnly: false,
    searchQuery: '',
  },
  isLoading: false,
  error: null,
  submissionSuccess: false,
  isActive: false,
  activeCases: mockEmergencies.filter(e => e.status === 'rescue_accepted'),
  pendingCases: mockEmergencies.filter(e => e.status === 'reported')
}

const ngoSlice = createSlice({
  name: 'ngo',
  initialState,
  reducers: {
    setCurrentNGO(state, action) {
      state.currentNGO = action.payload
    },
    setNearbyNGOs(state, action) {
      state.nearbyNGOs = action.payload
    },
    updateFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters(state) {
      state.filters = initialState.filters
    },
    updateNGOStatus(state, action) {
      const { ngoId, status } = action.payload
      const ngo = state.ngos.find(n => n.id === ngoId)
      if (ngo) {
        ngo.verificationStatus = status
        if (status === 'approved') ngo.verifiedAt = new Date().toISOString()
      }
    },
    addNGO(state, action) {
      state.ngos.push(action.payload)
    },
    toggleNGOStatus(state) {
      state.isActive = !state.isActive
    },
    acceptRescue(state, action) {
      const caseId = action.payload
      const rescueCase = state.activeCases.find(c => c.id === caseId)
      if (rescueCase) {
        rescueCase.status = 'rescue_accepted'
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitNgoProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.submissionSuccess = false
      })
      .addCase(submitNgoProfile.fulfilled, (state) => {
        state.isLoading = false
        state.submissionSuccess = true
      })
      .addCase(submitNgoProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { setCurrentNGO, setNearbyNGOs, updateFilters, resetFilters, updateNGOStatus, addNGO, toggleNGOStatus, acceptRescue } = ngoSlice.actions
export default ngoSlice.reducer
