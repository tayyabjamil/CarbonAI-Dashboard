export const projects = [
  {
    id: 'PRJ-014', name: 'Cordillera Azul REDD+ Extension', registry: 'Verra',
    country: 'Peru', type: 'REDD+', vintage: '2022', volume: '120,000 tCO2e',
    price: '$12.50', rating: 82, updated: '2024-03-01',
    notes: 'Reassessed following registry methodology update (VM0007 rev.); leakage buffer revised upward after community land-use survey flagged encroachment risk in northern buffer zone. Additionality still considered strong given baseline deforestation trend.',
  },
  {
    id: 'PRJ-021', name: 'Rimba Raya Peat Forest', registry: 'Verra',
    country: 'Indonesia', type: 'REDD+', vintage: '2021-2023', volume: '85 kt',
    price: '£9.80', rating: 'B+', updated: '03/14/2024',
    notes: 'Long-running project, well documented. Some community benefit-sharing disputes reported in local press, unresolved as of last review.',
  },
  {
    id: 'PRJ-007', name: 'Acacia ARR Ghana', registry: 'Gold Standard',
    country: 'Ghana', type: 'ARR', vintage: '2023', volume: '45000',
    price: '€11.00/tCO2e', rating: 67, updated: '14 Mar 2024',
    notes: 'Early-stage plantation, permanence risk elevated (species monoculture, fire exposure).',
  },
  {
    id: 'PRJ-002', name: 'Sonora Biochar Facility', registry: 'ACR',
    country: 'Mexico', type: 'Biochar', vintage: '2024', volume: '12,400',
    price: '18', rating: 'A', updated: 'March 2024',
    notes: 'Engineered removal, high durability. MRV pending third-party verification, expected Q3.',
  },
  {
    id: 'PRJ-033', name: 'Sundarbans Mangrove Restoration', registry: 'Gold Standard',
    country: 'Bangladesh', type: 'Mangrove', vintage: '2020', volume: '61,200 tCO2e',
    price: '$14.20', rating: 91, updated: '2024-01-19',
    notes: 'Strong co-benefits for coastal protection. One of the highest-confidence permanence scores in portfolio.',
  },
  {
    id: 'PRJ-041', name: 'Cerrado Soil Carbon Programme', registry: 'CAR',
    country: 'Brazil', type: 'Soil C', vintage: "'23", volume: '9800',
    price: '$8.00', rating: 'pending', updated: '2024-02-28',
    notes: '',
  },
  {
    id: 'PRJ-018', name: 'Climeworks Orca DAC', registry: 'Gold Standard',
    country: 'Iceland', type: 'DAC', vintage: '2023', volume: '4,000 tCO2e',
    price: '$650.00', rating: 88, updated: '2024-03-10',
    notes: 'Premium removal credit, small volume relative to portfolio but high durability weighting.',
  },
  {
    id: 'PRJ-009', name: 'Kariba REDD+', registry: 'Verra',
    country: 'Zimbabwe', type: 'REDD+', vintage: '2019-2021', volume: '210,000',
    price: '$7.10', rating: 54, updated: '12/02/2023',
    notes: 'Subject to ongoing methodology dispute following third-party over-crediting analysis; rating under active review, treat current score as provisional pending registry response.',
  },
  {
    id: 'PRJ-026', name: 'Adamigbe ARR Nigeria', registry: 'American Carbon Registry',
    country: 'Nigeria', type: 'ARR', vintage: '2022', volume: '31,500 tCO2e',
    price: '£10.40', rating: 'C', updated: '2024-03-05',
    notes: 'New entrant, limited track record.',
  },
  {
    id: 'PRJ-045', name: 'Trishuli Mangrove Belt', registry: 'Gold Standard',
    country: 'Nepal', type: 'Mangrove', vintage: '2024', volume: '7,300',
    price: '9.50', rating: null, updated: '2024-03-16',
    notes: 'Not yet rated — awaiting baseline validation.',
  },
  {
    id: 'PRJ-011', name: 'Katingan Peatland Protection', registry: 'VCS',
    country: 'Indonesia', type: 'REDD+', vintage: '2020', volume: '98,000 tCO2e',
    price: '$13.75', rating: 76, updated: '2024-01-30',
    notes: 'Solid MRV history. Recent independent audit raised minor flags on leakage accounting methodology, response from developer satisfactory.',
  },
  {
    id: 'PRJ-030', name: 'Andes Soil Regeneration', registry: 'CAR',
    country: 'Chile', type: 'Soil C', vintage: '2023', volume: '5,600',
    price: '€6.20', rating: 71, updated: '05/22/2024',
    notes: 'Pilot-scale, methodology still maturing across the sector.',
  },
  {
    id: 'PRJ-016', name: 'Heirloom DAC Pilot', registry: 'ACR',
    country: 'United States', type: 'DAC', vintage: '2024', volume: '2,100 tCO2e',
    price: '$580.00', rating: 'A-', updated: '2024-03-12',
    notes: 'Early commercial deployment, strong monitoring transparency.',
  },
  {
    id: 'PRJ-037', name: 'Casamance ARR Senegal', registry: 'Gold Standard',
    country: 'Senegal', type: 'ARR', vintage: '2021', volume: '22,900',
    price: '8.90', rating: 63, updated: '2024-02-14',
    notes: 'Community-led, moderate permanence risk given regional land-tenure uncertainty; additionality considered credible against regional baseline.',
  },
]

export function parseVolume(raw) {
  if (!raw) return null
  const s = String(raw).toLowerCase()
  const num = parseFloat(s.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return null
  if (s.includes('kt')) return num * 1000
  return num
}

export function parsePrice(raw) {
  if (!raw) return null
  const s = String(raw)
  const currency = s.includes('£') ? 'GBP' : s.includes('€') ? 'EUR' : 'USD'
  const num = parseFloat(s.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return null
  if (currency === 'GBP') return +(num * 1.27).toFixed(2)
  if (currency === 'EUR') return +(num * 1.10).toFixed(2)
  return num
}

export function getVolumeByType(TYPE_COLORS) {
  const VOLUME_ORDER = ['REDD+', 'ARR', 'Mangrove', 'Soil C', 'Biochar', 'DAC']
  const byType = {}
  projects.forEach(p => {
    const vol = parseVolume(p.volume)
    if (vol !== null) byType[p.type] = (byType[p.type] || 0) + vol
  })
  const rows = VOLUME_ORDER
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

export function getVolumeByRegistry(REGISTRY_COLORS) {
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

export function getPriceByType(TYPE_COLORS) {
  const PRICE_ORDER = ['DAC', 'Biochar', 'Mangrove', 'ARR', 'REDD+', 'Soil C']
  const byType = {}
  projects.forEach(p => {
    const usd = parsePrice(p.price)
    if (usd !== null) {
      if (!byType[p.type]) byType[p.type] = []
      byType[p.type].push(usd)
    }
  })
  const rows = PRICE_ORDER.map(t => {
    const vals = byType[t] || []
    const avg  = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { label: t, avg: +avg.toFixed(2), color: TYPE_COLORS[t] }
  }).filter(r => r.avg > 0)
  const max = Math.max(...rows.map(r => r.avg))
  return rows.map(r => ({
    label: r.label,
    pct:   +(r.avg / max * 100).toFixed(1),
    val:   `$${Math.round(r.avg)} avg`,
    color: r.color,
  }))
}

export function getRatingDistribution(T) {
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
    pct:   +(r.count / max * 100).toFixed(1),
    val:   `${r.count} project${r.count !== 1 ? 's' : ''}`,
    color: r.color,
  }))
}

export function getPortfolioStats() {
  return {
    totalProjects:    projects.length,
    totalVolume:      projects.reduce((sum, p) => sum + (parseVolume(p.volume) || 0), 0),
    pendingOrUnrated: projects.filter(p => p.rating === null || p.rating === 'pending').length,
    highRisk:         projects.filter(p => ratingBand(p.rating) === 'high').length,
    countries:        new Set(projects.map(p => p.country)).size,
    registries:       new Set(projects.map(p => p.registry)).size,
    projectTypes:     new Set(projects.map(p => p.type)).size,
  }
}

export function ratingColor(r) {
  if (r === null || r === 'pending') return '#cccccc'
  const n = typeof r === 'number' ? r : (r.startsWith('A') ? 90 : r.startsWith('B') ? 75 : r.startsWith('C') ? 55 : 40)
  if (n >= 80) return '#397f86'
  if (n >= 60) return '#e7a33c'
  return '#de7777'
}

export function ratingBand(r) {
  if (r === null || r === 'pending') return 'unrated'
  const n = typeof r === 'number' ? r : (r.startsWith('A') ? 90 : r.startsWith('B') ? 75 : r.startsWith('C') ? 55 : 40)
  if (n >= 80) return 'low'
  if (n >= 60) return 'medium'
  return 'high'
}
