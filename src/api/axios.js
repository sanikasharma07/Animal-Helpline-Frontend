import axios from 'axios'

// Backend default port is 5000 (backend/server.js: PORT || 5000).
// A deployment overrides this with VITE_API_BASE_URL; the previous
// default of localhost:8000 pointed at nothing the backend serves.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Required to send/receive httpOnly cookies (jwt_refresh)
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== Request Interceptor =====
// Attaches the JWT access token to every outgoing request.
// For FormData uploads the Content-Type header is removed so the browser
// sets it with the multipart boundary; sending a bare
// "multipart/form-data" header breaks uploads.
API.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    if (!config._isRefresh) {
      const token = localStorage.getItem('al_access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ===== Response Interceptor =====
// Access tokens live 15 minutes (backend). On a 401, try once to rotate
// the refresh token (POST /users/refresh, cookie-based, no access token
// needed) and retry the original request with the new token. If refresh
// fails, the session is genuinely over: clear local state and send the
// user to login instead of silently serving stale or mock data.
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const url = original?.url || ''
    const isAuthRoute =
      url.includes('/users/login') ||
      url.includes('/users/register') ||
      url.includes('/users/refresh') ||
      url.includes('/users/logout')

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true
      const hadToken = !!localStorage.getItem('al_access_token')
      try {
        const refresh = await API.post('/users/refresh', {}, { _isRefresh: true })
        const newToken = refresh.data?.data?.accessToken
        if (newToken) {
          localStorage.setItem('al_access_token', newToken)
          original.headers.Authorization = `Bearer ${newToken}`
          return API(original)
        }
      } catch {
        // Refresh failed: fall through to the session-expired handling below.
      }
      // Only a previously authenticated session expiring is a session event.
      // A public page fetching an auth-required endpoint for a logged-out
      // visitor (no token at all) must not force a redirect to login.
      if (hadToken) {
        localStorage.removeItem('al_access_token')
        localStorage.removeItem('al_user')
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('al:session-expired'))
        }
      }
    }

    // The backend sends: { statusCode, message, success: false }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'

    return Promise.reject({ message, statusCode: status })
  }
)

export default API
