import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Required to send/receive httpOnly cookies (jwt_refresh)
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== Request Interceptor =====
// Attaches the JWT access token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('al_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ===== Response Interceptor =====
// Extracts clean error messages from the backend's ApiError format
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // The backend sends: { statusCode, message, success: false }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'

    return Promise.reject({ message, statusCode: error.response?.status })
  }
)

export default API
