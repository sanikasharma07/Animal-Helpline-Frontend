import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // No silent fallback location: silently substituting one city's
  // coordinates for the user's real location would send rescuers and
  // nearby results to the wrong place. Since the device-only change,
  // there is no manual-entry fallback anywhere — so failures must say
  // exactly what the user can do about them, not point at typing
  // coordinates that no longer exists.
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not available on this page. Location needs a secure connection — open the site over HTTPS (or on localhost). Plain HTTP pages cannot use device location.')
      return
    }

    setIsLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoading(false)
      },
      (err) => {
        // err.code: 1 = permission denied, 2 = position unavailable,
        // 3 = timeout. A denied permission is sticky: browsers will not
        // re-prompt from the button alone, so say so instead of letting
        // the button look dead on every tap.
        if (err.code === 1) {
          setError('Location permission is blocked for this site. Allow location access in your browser’s site settings, then tap the button again — the button alone cannot re-ask once access is blocked.')
        } else if (err.code === 3) {
          setError('Locating timed out. GPS can take a while on a first fix — please try again.')
        } else {
          setError('Your device could not determine its location. Check that location/GPS is switched on, then try again.')
        }
        setIsLoading(false)
      },
      // Fresh fix every time (maximumAge 0): a cached position up to
      // 5 minutes old is not "current device location". 30s timeout:
      // 10s was too short for a cold GPS fix on phones.
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return { location, error, isLoading, requestLocation }
}
