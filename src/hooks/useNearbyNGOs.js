import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { calculateDistance } from '@/lib/utils'

export function useNearbyNGOs(userLocation, maxDistanceKm = 50) {
  const { ngos, filters } = useSelector(state => state.ngo)

  const nearbyNGOs = useMemo(() => {
    if (!userLocation) return ngos.filter(n => n.verificationStatus === 'approved')

    return ngos
      .map(ngo => ({
        ...ngo,
        distance: calculateDistance(
          userLocation.lat, userLocation.lng,
          ngo.coordinates.lat, ngo.coordinates.lng
        ),
      }))
      .filter(ngo => {
        // Distance filter
        if (ngo.distance > (filters.maxDistance || maxDistanceKm)) return false
        // Verified only filter
        if (filters.verifiedOnly && ngo.verificationStatus !== 'approved') return false
        // Animal type filter
        if (filters.animalType?.length > 0) {
          if (!filters.animalType.some(type => ngo.animalsHandled.includes(type))) return false
        }
        // Services filter
        if (filters.services?.length > 0) {
          if (!filters.services.some(svc => ngo.services.includes(svc))) return false
        }
        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase()
          if (
            !ngo.name.toLowerCase().includes(q) &&
            !ngo.city.toLowerCase().includes(q) &&
            !ngo.description.toLowerCase().includes(q)
          ) return false
        }
        return true
      })
      .sort((a, b) => a.distance - b.distance)
  }, [ngos, userLocation, filters, maxDistanceKm])

  return nearbyNGOs
}
