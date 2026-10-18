import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import ngoReducer from './slices/ngoSlice'
import adminReducer from './slices/adminSlice'
import uiReducer from './slices/uiSlice'
import emergencyReducer from './slices/emergencySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ngo: ngoReducer,
    admin: adminReducer,
    ui: uiReducer,
    emergency: emergencyReducer,
  },
})
