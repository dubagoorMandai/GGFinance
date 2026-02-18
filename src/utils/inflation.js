/**
 * Fetch the latest official inflation rate for a country from the World Bank API.
 * Indicator: FP.CPI.TOTL.ZG  (Consumer price index – annual %)
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 code, e.g. "US"
 * @returns {Promise<number|null>} - inflation rate % or null on failure
 */
export async function fetchInflationRate(countryCode) {
  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?format=json&mrv=5&per_page=5`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Network response was not ok')
    const data = await res.json()

    // data[1] is the array of data points; find the most recent non-null value
    const points = data[1] || []
    const latest = points.find((p) => p.value !== null)
    if (latest) return parseFloat(latest.value.toFixed(2))
    return null
  } catch {
    return null
  }
}

/**
 * Popular countries list for the selector dropdown.
 * Each entry: { code, name }
 */
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PL', name: 'Poland' },
  { code: 'AR', name: 'Argentina' },
  { code: 'TR', name: 'Turkey' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
]
