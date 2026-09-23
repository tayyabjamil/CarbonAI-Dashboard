const GBP_TO_USD = 1.27
const EUR_TO_USD = 1.10
const KT_TO_T    = 1000

const LETTER_SCORE = { A: 90, B: 75, C: 55 }
const RATING_LOW_THRESHOLD    = 80
const RATING_MEDIUM_THRESHOLD = 60

// Pulls the number out of messy volume strings like "120,000 tCO2e" or "85 kt"
// and always returns it in tonnes. Returns null if there's no number to find.
export function parseVolume(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  const match = s.match(/^[\d,]+(\.\d+)?/)  // grab only the number at the start, ignore anything after
  if (!match) return null
  const num = parseFloat(match[0].replace(/,/g, ''))  // remove commas so "120,000" becomes 120000
  if (isNaN(num)) return null
  if (s.toLowerCase().includes('kt')) return num * KT_TO_T  // "85 kt" means 85,000 tonnes
  return num
}

// Pulls the number out of messy price strings like "$12.50", "£9.80", "€11.00/tCO2e", or just "18"
// and always returns it converted to USD. Returns null if there's no number to find.
export function parsePrice(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  const currency = s.includes('£') ? 'GBP' : s.includes('€') ? 'EUR' : 'USD'  // detect currency from symbol
  const match = s.match(/[\d,]+(\.\d+)?/)           // grab the number, ignore symbols and unit text
  if (!match) return null
  const num = parseFloat(match[0].replace(/,/g, ''))  // remove commas, then parse
  if (isNaN(num)) return null
  if (currency === 'GBP') return +(num * GBP_TO_USD).toFixed(2)  // £ → $
  if (currency === 'EUR') return +(num * EUR_TO_USD).toFixed(2)  // € → $
  return num  // already USD
}

// Converts any rating format to a numeric score so they can all be compared the same way.
// Numeric ratings (82, 67) pass through as-is. Letter grades (A, B+, C) map to a fixed score via LETTER_SCORE.
export function ratingToScore(r) {
  if (typeof r === 'number') return r
  const letter = r?.charAt(0).toUpperCase()  // "B+" → "B", "A-" → "A"
  return LETTER_SCORE[letter] ?? 40          // unknown letter falls back to 40 (high risk territory)
}

// Converts each column's raw value to a plain number so rows can be sorted correctly.
// Without this, "120,000 tCO2e" and "$12.50" would sort alphabetically instead of numerically.
function toSortable(col, raw) {
  if (col === 'price')   return parsePrice(raw)  ?? 0
  if (col === 'volume')  return parseVolume(raw) ?? 0
  if (col === 'vintage') {
    const s  = String(raw).replace(/'/g, '').trim()  // strip apostrophe, e.g. "'23" → "23"
    const yr = parseInt(s.split('-')[0])              // take first year from ranges like "2021-2023"
    return isNaN(yr) ? 0 : yr < 100 ? yr + 2000 : yr // "23" → 2023
  }
  return raw ?? ''
}

// Sorts a copy of the projects array by the given column and direction (1 = asc, -1 = desc).
export function sortProjects(projects, col, dir) {
  if (!col) return projects
  return [...projects].sort((a, b) => {
    const va = toSortable(col, a[col])
    const vb = toSortable(col, b[col])
    return va > vb ? dir : va < vb ? -dir : 0
  })
}

// Buckets a rating into "low", "medium", "high", or "unrated" for badges and map colours.
// Converts to a score first so numeric and letter ratings go through the same thresholds.
export function ratingBand(r) {
  if (r === null || r === 'pending') return 'unrated'
  const n = ratingToScore(r)
  if (n >= RATING_LOW_THRESHOLD)    return 'low'     // score ≥ 80
  if (n >= RATING_MEDIUM_THRESHOLD) return 'medium'  // score ≥ 60
  return 'high'                                      // score < 60
}
