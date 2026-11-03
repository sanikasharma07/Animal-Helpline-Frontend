import { useSelector, useDispatch } from 'react-redux'
import { loginUser, logoutUser } from '@/store/slices/authSlice'

// Roles come only from the authenticated backend user. The old
// switchRole helper (which signed the user in as a mock account of any
// role) has been removed: it bypassed authentication entirely.
export function useAuth() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth)

  const handleLogin = (credentials) => {
    return dispatch(loginUser(credentials))
  }

  const handleLogout = () => {
    return dispatch(logoutUser())
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    role: user?.role || null,
    isUser: user?.role === 'user',
    isNGO: user?.role === 'ngo',
    isVet: user?.role === 'vet',
    isAdmin: user?.role === 'admin',
    login: handleLogin,
    logout: handleLogout,
  }
}
