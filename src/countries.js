/**
 * Country catalog for grouping, labels, and mock data.
 * ISO-style codes used in activation payloads.
 */
export const COUNTRIES = [
  { code: 'US', name: 'United States', region: 'Americas' },
  { code: 'CA', name: 'Canada', region: 'Americas' },
  { code: 'MX', name: 'Mexico', region: 'Americas' },
  { code: 'BR', name: 'Brazil', region: 'Americas' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'PL', name: 'Poland', region: 'Europe' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East & Africa' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East & Africa' },
  { code: 'ZA', name: 'South Africa', region: 'Middle East & Africa' },
  { code: 'NG', name: 'Nigeria', region: 'Middle East & Africa' },
  { code: 'JP', name: 'Japan', region: 'Asia Pacific' },
  { code: 'SG', name: 'Singapore', region: 'Asia Pacific' },
  { code: 'AU', name: 'Australia', region: 'Asia Pacific' },
  { code: 'IN', name: 'India', region: 'Asia Pacific' },
  { code: 'HK', name: 'Hong Kong SAR', region: 'Asia Pacific' },
  { code: 'KR', name: 'South Korea', region: 'Asia Pacific' },
  { code: 'PH', name: 'Philippines', region: 'Asia Pacific' },
  { code: 'ID', name: 'Indonesia', region: 'Asia Pacific' },
  { code: 'TH', name: 'Thailand', region: 'Asia Pacific' },
  { code: 'VN', name: 'Vietnam', region: 'Asia Pacific' },
  { code: 'MY', name: 'Malaysia', region: 'Asia Pacific' },
  { code: 'NZ', name: 'New Zealand', region: 'Asia Pacific' },
  { code: 'AR', name: 'Argentina', region: 'Americas' },
  { code: 'CO', name: 'Colombia', region: 'Americas' },
  { code: 'CL', name: 'Chile', region: 'Americas' },
]

const byCode = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]))

export function countryName(code) {
  if (!code) return '—'
  return byCode[code]?.name ?? code
}

export function regionForCountry(code) {
  if (!code) return ''
  return byCode[code]?.region ?? ''
}

export const COUNTRY_SELECT_OPTIONS = COUNTRIES.map((c) => ({
  value: c.code,
  label: c.name,
}))
