import { useState, useEffect, useCallback } from 'react'
import API from '@/api/axios'
import { mockNGOs } from '@/data/mockNGOs'

/**
 * Fetches nearby verified NGOs from the real backend.
 * Backend endpoint: GET /api/v1/ngo/nearby?lat=X&lng=Y
 *
 * Falls back to filtered mock data when the backend is unreachable.
 *
 * @param {[number, number] | null} center - [latitude, longitude] array
 * @param {object} filters - filter object from Redux ngo slice
 * @returns {{ ngos, loading, error }}
 */
export function useNearbyNGOs(center, filters = {}) {
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNearby = useCallback(async () => {
    // Wait until we have valid coordinates
    if (
      !center ||
      !Array.isArray(center) ||
      center.length < 2 ||
      !isFinite(center[0]) ||
      !isFinite(center[1])
    ) {
      return
    }

    const [lat, lng] = center

    setLoading(true)
    setError(null)

    try {
      // Backend expects: GET /api/v1/ngo/nearby?lat=X&lng=Y
      const response = await API.get('/ngo/nearby', {
        params: { lat, lng },
      })

      // Backend response shape: { statusCode, data: [...], message }
      const data = response.data?.data || []

      // Map backend field names to frontend shape
      const mapped = data.map((ngo) => ({
        id: ngo._id,
        name: ngo.organizationName,
        city: ngo.address?.city || '',
        state: ngo.address?.state || '',
        description: ngo.description || '',
        animalsHandled: ngo.animalsHandled || [],
        services: ngo.servicesProvided || [],
        verificationStatus: ngo.verificationStatus,
        isVerified: ngo.verificationStatus === 'verified',
        contact: {
          phone: ngo.user?.phone || '',
          email: ngo.user?.email || '',
        },
        // Coordinates from GeoJSON: [lng, lat]
        coordinates: {
          lat: ngo.location?.coordinates?.[1],
          lng: ngo.location?.coordinates?.[0],
        },
        _raw: ngo,
      }))

      // Apply client-side filters (search query, animal type, services)
      const filtered = mapped.filter((ngo) => {
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase()
          if (
            !ngo.name.toLowerCase().includes(q) &&
            !ngo.city.toLowerCase().includes(q) &&
            !ngo.description.toLowerCase().includes(q)
          ) return false
        }
        if (filters.animalType?.length > 0) {
          if (!filters.animalType.some((t) => ngo.animalsHandled.includes(t))) return false
        }
        if (filters.services?.length > 0) {
          if (!filters.services.some((s) => ngo.services.includes(s))) return false
        }
        return true
      })

      setNgos(filtered)
    } catch (err) {
      // Network error → fall back to mock NGO data filtered by verificationStatus
      const isNetworkError = !err.response
      if (isNetworkError) {
        const fallback = mockNGOs
          .filter((n) => n.verificationStatus === 'approved' || n.isVerified)
          .filter((ngo) => {
            if (filters.searchQuery) {
              const q = filters.searchQuery.toLowerCase()
              if (
                !ngo.name.toLowerCase().includes(q) &&
                !(ngo.city || '').toLowerCase().includes(q)
              ) return false
            }
            if (filters.animalType?.length > 0) {
              if (!filters.animalType.some((t) => (ngo.animalsHandled || []).includes(t)))
                return false
            }
            if (filters.services?.length > 0) {
              if (!filters.services.some((s) => (ngo.services || []).includes(s))) return false
            }
            return true
          })
        setNgos(fallback)
      } else {
        setError(err?.message || 'Failed to load nearby NGOs')
      }
    } finally {
      setLoading(false)
    }
  }, [center?.[0], center?.[1], filters.searchQuery, filters.animalType?.join(','), filters.services?.join(',')])

  useEffect(() => {
    fetchNearby()
  }, [fetchNearby])

  return { ngos, loading, error }
}
