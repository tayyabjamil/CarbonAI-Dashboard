const GBP_TO_USD = 1.27
const EUR_TO_USD = 1.10
const KT_TO_T    = 1000

const LETTER_SCORE = { A: 90, B: 75, C: 55 }
const RATING_LOW_THRESHOLD    = 80
const RATING_MEDIUM_THRESHOLD = 60

export function parseVolume(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  const match = s.match(/^[\d,]+(\.\d+)?/)
  if (!match) return null
  const num = parseFloat(match[0].replace(/,/g, ''))
  if (isNaN(num)) return null
  if (s.toLowerCase().includes('kt')) return num * KT_TO_T
  return num
}

export function parsePrice(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  const currency = s.includes('£') ? 'GBP' : s.includes('€') ? 'EUR' : 'USD'
  const match = s.match(/[\d,]+(\.\d+)?/)
  if (!match) return null
  const num = parseFloat(match[0].replace(/,/g, ''))
  if (isNaN(num)) return null
  if (currency === 'GBP') return +(num * GBP_TO_USD).toFixed(2)
  if (currency === 'EUR') return +(num * EUR_TO_USD).toFixed(2)
  return num
}

export function ratingToScore(r) {
  if (typeof r === 'number') return r
  const letter = r?.charAt(0).toUpperCase()
  return LETTER_SCORE[letter] ?? 40
}

export function ratingBand(r) {
  if (r === null || r === 'pending') return 'unrated'
  const n = ratingToScore(r)
  if (n >= RATING_LOW_THRESHOLD)    return 'low'
  if (n >= RATING_MEDIUM_THRESHOLD) return 'medium'
  return 'high'
}
