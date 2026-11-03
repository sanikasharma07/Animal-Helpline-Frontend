import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '@/api/axios'

// Authentication is real only: login and registration call the backend
// (POST /users/login, POST /users/register). There is deliberately no
// mock or demo login — a failed request surfaces its error instead of
// signing the user in as a fake account.

// ===== Async Thunks =====

// POST /users/register → { name, email, password, phone }
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })
      const { user, accessToken } = response.data.data
      localStorage.setItem('al_access_token', accessToken)
      localStorage.setItem('al_user', JSON.stringify(user))
      return { user, accessToken }
    } catch (error) {
      return rejectWithValue(error?.message || 'Registration failed. Please check your connection and try again.')
    }
  }
)

// POST /users/login → { email, password }
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/users/login', {
        email: credentials.email,
        password: credentials.password,
      })
      const { user, accessToken } = response.data.data
      localStorage.setItem('al_access_token', accessToken)
      localStorage.setItem('al_user', JSON.stringify(user))
      return { user, accessToken }
    } catch (error) {
      return rejectWithValue(error?.message || 'Login failed. Please check your credentials and try again.')
    }
  }
)

// POST /users/logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await API.post('/users/logout')
    } catch (_) {
      // Ignore — always clear local state
    }
    localStorage.removeItem('al_access_token')
    localStorage.removeItem('al_user')
    return null
  }
)

// ===== Rehydrate from localStorage =====
const savedUser = localStorage.getItem('al_user')
const savedToken = localStorage.getItem('al_access_token')

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: savedToken || null,
  isAuthenticated: !!(savedUser && savedToken),
  isLoading: false,
  error: null,
}

// ===== Slice =====
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
    // Kept for DevToolbar role switching during development
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      if (action.payload) {
        localStorage.setItem('al_user', JSON.stringify(action.payload))
      } else {
        localStorage.removeItem('al_user')
        localStorage.removeItem('al_access_token')
      }
    },
  },
  extraReducers: (builder) => {
    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Registration failed'
      })

    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Login failed'
      })

    // ── Logout ──
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
