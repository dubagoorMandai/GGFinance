import { useState, useCallback } from 'react'
import { fetchInflationRate } from '../utils/inflation'

/**
 * Custom hook to fetch and cache inflation rates by country code.
 * Caches results in memory to avoid redundant API calls.
 */
const cache = {}

export function useInflationRate() {
  const [rate, setRate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null) // 'api' | 'manual'

  const fetchRate = useCallback(async (countryCode) => {
    if (!countryCode) return
    setLoading(true)
    setError(null)

    if (cache[countryCode] !== undefined) {
      setRate(cache[countryCode])
      setSource('api')
      setLoading(false)
      return
    }

    const result = await fetchInflationRate(countryCode)
    if (result !== null) {
      cache[countryCode] = result
      setRate(result)
      setSource('api')
    } else {
      setError('Could not fetch official rate. Please enter manually.')
      setRate(null)
      setSource(null)
    }
    setLoading(false)
  }, [])

  const setManualRate = useCallback((value) => {
    setRate(value)
    setSource('manual')
    setError(null)
  }, [])

  return { rate, loading, error, source, fetchRate, setManualRate }
}
