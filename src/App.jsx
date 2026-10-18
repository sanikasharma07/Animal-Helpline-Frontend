import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { PawPrint } from 'lucide-react'
import ToastContainer from '@/components/common/ToastContainer'
import BottomNav from '@/components/common/BottomNav'

// Core pages
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const UserDashboard = lazy(() => import('@/pages/UserDashboard'))
const NearbyNGOs = lazy(() => import('@/pages/NearbyNGOs'))
const NGOPublicProfile = lazy(() => import('@/pages/NGOPublicProfile'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Phase 4 pages
const ActiveRescueTracker = lazy(() => import('@/pages/ActiveRescueTracker'))
const CampaignDetails = lazy(() => import('@/pages/campaigns/CampaignDetails'))

// Phase 5 pages
const UserImpactProfile = lazy(() => import('@/pages/UserImpactProfile'))

// Phase 6 — User Feature Pages
const VolunteerHub = lazy(() => import('@/pages/VolunteerHub'))
const DonatePage = lazy(() => import('@/pages/DonatePage'))
const SuppliesPage = lazy(() => import('@/pages/SuppliesPage'))
const FosterPage = lazy(() => import('@/pages/FosterPage'))

// NGO pages
const NGOOnboarding = lazy(() => import('@/pages/ngo/NGOOnboarding'))
const NGODashboard = lazy(() => import('@/pages/ngo/NGODashboard'))
const NGOProfile = lazy(() => import('@/pages/ngo/NGOProfile'))
const NGODocuments = lazy(() => import('@/pages/ngo/NGODocuments'))
const NGOPastCampaigns = lazy(() => import('@/pages/ngo/NGOPastCampaigns'))
const NGOSettings = lazy(() => import('@/pages/ngo/NGOSettings'))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminVerifications = lazy(() => import('@/pages/admin/AdminVerifications'))
const AdminNGOReview = lazy(() => import('@/pages/admin/AdminNGOReview'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminEmergencies = lazy(() => import('@/pages/admin/AdminEmergencies'))
const AdminCampaigns = lazy(() => import('@/pages/admin/AdminCampaigns'))

// ProtectedRoute — role enforcement via Redux auth state only
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />
    if (user?.role === 'ngo') return <Navigate to="/ngo/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <PawPrint className="text-teal-600" size={20} />
      </div>
    </div>
    <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading...</p>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/nearby-ngos" element={<NearbyNGOs />} />
          <Route path="/ngo/:id" element={<NGOPublicProfile />} />
          <Route path="/ngo/onboarding" element={<NGOOnboarding />} />

          {/* Phase 4: Campaign Details & Rescue Tracker */}
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route
            path="/tracker/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'ngo', 'admin']}>
                <ActiveRescueTracker />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'ngo', 'admin']}>
                <UserImpactProfile />
              </ProtectedRoute>
            }
          />

          {/* Phase 6: User Feature Pages */}
          <Route path="/volunteer" element={<VolunteerHub />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/supplies" element={<SuppliesPage />} />
          <Route path="/donate-supplies" element={<SuppliesPage />} />
          <Route path="/foster" element={<FosterPage />} />
          <Route path="/adopt" element={<FosterPage />} />

          {/* NGO Routes */}
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NGODashboard />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<NGOProfile />} />
            <Route path="documents" element={<NGODocuments />} />
            <Route path="campaigns" element={<NGOPastCampaigns />} />
            <Route path="settings" element={<NGOSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="verifications" element={<AdminVerifications />} />
            <Route path="verifications/:id" element={<AdminNGOReview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="emergencies" element={<AdminEmergencies />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Global UI: Toast notifications + Mobile bottom nav */}
      <ToastContainer />
      <BottomNav />
    </BrowserRouter>
  )
}
