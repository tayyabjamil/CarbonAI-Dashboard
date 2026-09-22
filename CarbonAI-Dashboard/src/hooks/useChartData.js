import { projects } from '../data/projects'
import { parseVolume, parsePrice, ratingBand } from '../utils/parse'
import { TYPE_COLORS, REGISTRY_COLORS, T } from '../utils/tokens'

// ── Aggregation functions ─────────────────────────────────────────

function getVolumeByType() {
  const ORDER = ['REDD+', 'ARR', 'Mangrove', 'Soil C', 'Biochar', 'DAC']
  const byType = {}
  projects.forEach(p => {
    const vol = parseVolume(p.volume)
    if (vol !== null) byType[p.type] = (byType[p.type] || 0) + vol
  })
  const rows = ORDER
    .map(t => ({ label: t, total: byType[t] || 0, color: TYPE_COLORS[t] }))
    .filter(r => r.total > 0)
  const max = Math.max(...rows.map(r => r.total))
  return rows.map(r => ({
    label: r.label,
    pct:   +(r.total / max * 100).toFixed(1),
    val:   r.total >= 1000 ? `${Math.round(r.total / 1000)}k tCO₂e` : `${r.total} tCO₂e`,
    color: r.color,
  }))
}

function getVolumeByRegistry() {
  const byRegistry = {}
  projects.forEach(p => {
    const vol = parseVolume(p.volume)
    if (vol !== null) byRegistry[p.registry] = (byRegistry[p.registry] || 0) + vol
  })
  const rows = Object.entries(byRegistry)
    .map(([label, total]) => ({ label, total, color: REGISTRY_COLORS[label] || '#c0c8cc' }))
    .sort((a, b) => b.total - a.total)
  const max = Math.max(...rows.map(r => r.total))
  return rows.map(r => ({
    label: r.label,
    pct:   +(r.total / max * 100).toFixed(1),
    val:   r.total >= 1000 ? `${Math.round(r.total / 1000)}k tCO₂e` : `${r.total} tCO₂e`,
    color: r.color,
  }))
}


function getRatingDistribution() {
  const counts = { low: 0, medium: 0, high: 0, unrated: 0 }
  projects.forEach(p => { counts[ratingBand(p.rating)]++ })
  const rows = [
    { label: 'Low risk',    count: counts.low,     color: T.teal  },
    { label: 'Medium risk', count: counts.medium,  color: T.amber },
    { label: 'High risk',   count: counts.high,    color: T.coral },
    { label: 'Unrated',     count: counts.unrated, color: T.muted },
  ].filter(r => r.count > 0)
  const max = Math.max(...rows.map(r => r.count))
  return rows.map(r => ({
    label: r.label,
    count: r.count,
    pct:   +(r.count / max * 100).toFixed(1),
    val:   `${r.count} project${r.count !== 1 ? 's' : ''}`,
    color: r.color,
  }))
}

const TOP_TIER = ['Verra', 'VCS', 'Gold Standard']

const COUNTRY_ISO = {
  'Peru': 'PER', 'Indonesia': 'IDN', 'Ghana': 'GHA', 'Mexico': 'MEX',
  'Bangladesh': 'BGD', 'Brazil': 'BRA', 'Iceland': 'ISL', 'Zimbabwe': 'ZWE',
  'Nigeria': 'NGA', 'Nepal': 'NPL', 'Chile': 'CHL', 'United States': 'USA',
  'Senegal': 'SEN',
}

const RISK_PRIORITY = { high: 3, medium: 2, low: 1, unrated: 0 }
const RISK_COLOR    = { high: '#de7777', medium: '#e8a020', low: '#397f86', unrated: '#909ca3' }

function getCountryProjects() {
  const byCountry = {}
  projects.forEach(p => {
    if (!byCountry[p.country]) byCountry[p.country] = { iso: COUNTRY_ISO[p.country], projects: [] }
    byCountry[p.country].projects.push({ name: p.name, type: p.type, rating: p.rating, volume: p.volume })
  })
  return Object.entries(byCountry).map(([name, { iso, projects: ps }]) => {
    const dominantBand = ps.reduce((worst, p) => {
      const band = ratingBand(p.rating)
      return RISK_PRIORITY[band] > RISK_PRIORITY[worst] ? band : worst
    }, 'unrated')
    return { name, iso, count: ps.length, projects: ps, color: RISK_COLOR[dominantBand], band: dominantBand }
  })
}

function getAvgPrice() {
  const priced = projects
    .map(p => ({ name: p.name, usd: parsePrice(p.price) }))
    .filter(p => p.usd !== null)
  const avg     = priced.reduce((s, p) => s + p.usd, 0) / priced.length
  const highest = priced.reduce((a, b) => b.usd > a.usd ? b : a)
  const lowest  = priced.reduce((a, b) => b.usd < a.usd ? b : a)
  return {
    avg:         Math.round(avg),
    highest:     { name: highest.name, usd: Math.round(highest.usd) },
    lowest:      { name: lowest.name,  usd: Math.round(lowest.usd)  },
  }
}

function getRegistryConfidence() {
  const totalVol = projects.reduce((sum, p) => sum + (parseVolume(p.volume) || 0), 0)
  const topVol   = projects
    .filter(p => TOP_TIER.includes(p.registry))
    .reduce((sum, p) => sum + (parseVolume(p.volume) || 0), 0)
  return {
    pct:      Math.round(topVol / totalVol * 100),
    topTier:  TOP_TIER.join(' · '),
  }
}

function getVintageSpread() {
  const scored = projects.map(p => {
    const raw = String(p.vintage).replace(/'/g, '').trim()
    const year = parseInt(raw.split('-')[0])
    return { name: p.name, year: isNaN(year) ? null : year }
  }).filter(p => p.year !== null)

  const oldest  = scored.reduce((a, b) => b.year < a.year ? b : a)
  const newest  = scored.reduce((a, b) => b.year > a.year ? b : a)
  return {
    oldest:  { year: oldest.year,  name: oldest.name  },
    newest:  { year: newest.year,  name: newest.name  },
    spread:  `${oldest.year} – ${newest.year}`,
  }
}

function getPortfolioStats() {
  return {
    totalProjects: projects.length,
    totalVolume:   projects.reduce((sum, p) => sum + (parseVolume(p.volume) || 0), 0),
  }
}

// ── Hooks ─────────────────────────────────────────────────────────

export const useVintageSpread       = () => getVintageSpread()
export const useCountryProjects     = () => getCountryProjects()
export const useVolumeByType        = () => getVolumeByType()
export const useVolumeByRegistry    = () => getVolumeByRegistry()
export const useRatingData          = () => getRatingDistribution()
export const usePortfolioStats      = () => getPortfolioStats()
export const useAvgPrice            = () => getAvgPrice()
export const useRegistryConfidence  = () => getRegistryConfidence()
