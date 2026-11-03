import { useState, useEffect, useCallback } from 'react'
import API from '@/api/axios'

/**
 * Nearby Help — public endpoint, same for logged-out and logged-in users.
 * Backend: GET /api/v1/nearby/help?lng=X&lat=Y&radiusKm=N
 * (default radius 25 km, capped at 100 km by the backend).
 *
 * Response data shape (backend, HEAD 80378a9, OSM enhancement):
 *   verified:    registered verified NGOs + approved vets, sorted by distance
 *   nonVerified: external OSM listings, sorted by distance, distance-less last
 *   ngos, vets:  legacy arrays (unchanged shape, extra fields added)
 *   attribution: OSM ODbL attribution string
 *   osmStatus:   "available" | "unavailable" (external results failed, registered only)
 *
 * Verified entries carry source "animal_lifeline" and
 * registrationStatus "Verified on Animal Lifeline". External entries carry
 * source "openstreetmap" and "Not registered on Animal Lifeline" and must
 * never be presented as verified, never linked to a platform profile, and
 * never offered rescue-accept actions. When coordinates are missing,
 * distanceKm is null and distanceLabel is "Distance unavailable" — the
 * distance is never invented.
 *
 * No mock fallback: if the backend is unreachable the hook reports an
 * error and empty lists, instead of showing invented organisations.
 *
 * @param {[number, number] | null} center - [latitude, longitude] array
 * @param {number} radiusKm - search radius in km
 * @returns {{ verified, nonVerified, loading, error, attribution, osmStatus, total }}
 */
export function useNearbyNGOs(center, radiusKm = 25) {
  const [verified, setVerified] = useState([])
  const [nonVerified, setNonVerified] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attribution, setAttribution] = useState('')
  const [osmStatus, setOsmStatus] = useState('unavailable')
  const [total, setTotal] = useState(0)

  const fetchNearby = useCallback(async () => {
    if (
      !center ||
      !Array.isArray(center) ||
      center.length < 2 ||
      !isFinite(center[0]) ||
      !isFinite(center[1])
    ) {
      setVerified([])
      setNonVerified([])
      return
    }

    const [lat, lng] = center
    setLoading(true)
    setError(null)

    try {
      const response = await API.get('/nearby/help', {
        params: { lat, lng, radiusKm },
      })
      const data = response.data?.data || {}
      setVerified(Array.isArray(data.verified) ? data.verified : [])
      setNonVerified(Array.isArray(data.nonVerified) ? data.nonVerified : [])
      setAttribution(data.attribution || '')
      setOsmStatus(data.osmStatus || 'unavailable')
      setTotal(
        typeof data.total === 'number'
          ? data.total
          : (data.verified?.length || 0) + (data.nonVerified?.length || 0)
      )
    } catch (err) {
      setVerified([])
      setNonVerified([])
      setError(err?.message || 'Failed to load nearby help')
    } finally {
      setLoading(false)
    }
  }, [center?.[0], center?.[1], radiusKm])

  useEffect(() => {
    fetchNearby()
  }, [fetchNearby])

  return { verified, nonVerified, loading, error, attribution, osmStatus, total }
}
