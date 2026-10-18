import { useSelector, useDispatch } from 'react-redux'
import { loginUser, logoutUser, setUser } from '@/store/slices/authSlice'
import { mockUsers } from '@/data/mockUsers'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth)

  const handleLogin = (credentials) => {
    return dispatch(loginUser(credentials))
  }

  const handleLogout = () => {
    return dispatch(logoutUser())
  }

  const handleSwitchRole = (role) => {
    const mockUser = mockUsers.find((u) => u.role === role) || {
      _id: 'mock-id',
      name: `Mock ${role.toUpperCase()}`,
      email: `${role}@example.com`,
      role: role,
    }
    dispatch(setUser(mockUser))
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    role: user?.role || null,
    isUser: user?.role === 'user',
    isNGO: user?.role === 'ngo',
    isAdmin: user?.role === 'admin',
    login: handleLogin,
    logout: handleLogout,
    switchRole: handleSwitchRole,
  }
}
