import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      // Fallback to Kota, Rajasthan
      setLocation({ lat: 25.2138, lng: 75.8648 })
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoading(false)
      },
      (err) => {
        setError(err.message)
        // Fallback to Kota, Rajasthan
        setLocation({ lat: 25.2138, lng: 75.8648 })
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return { location, error, isLoading, requestLocation }
}
