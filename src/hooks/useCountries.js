import { useEffect, useState } from 'react'
import { getCountries } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

// The list rarely changes, so it is fetched once and shared by every caller.
let cache = null

export function useCountries() {
  const { token } = useAuth()
  const [countries, setCountries] = useState(cache ?? [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    getCountries(token)
      .then((data) => {
        cache = Array.isArray(data) ? data : []
        if (!cancelled) setCountries(cache)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  return { countries, loading, error }
}
