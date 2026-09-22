import { usePortfolioStats, useRatingData, useAvgPrice, useVintageSpread } from '../hooks/useChartData'

export default function KpiCards() {
  const { totalProjects } = usePortfolioStats()
  const ratingData = useRatingData()
  const avgPrice   = useAvgPrice()
  const vintage    = useVintageSpread()

  return (
    <div className="stats-row">

      <div className="stat-card accent-navy">
        <span className="num">{totalProjects}</span>
        <span className="lbl">Total Projects</span>
        <div className="risk-row">
          {ratingData.map(row => (
            <div key={row.label} className="risk-row-item">
              <span className="risk-dot" style={{ background: row.color }} />
              <span className="risk-count" style={{ color: row.color }}>{row.count}</span>
              <span className="risk-label">{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-card accent-teal">
        <span className="num">${avgPrice.avg}</span>
        <span className="lbl">Avg Price / tCO₂e</span>
        <div className="price-range">
          <div className="price-range-item">
            <span className="price-range-tag high">Premium</span>
            <span className="price-range-name">{avgPrice.highest.name}</span>
            <span className="price-range-val">${avgPrice.highest.usd}</span>
          </div>
          <div className="price-range-item">
            <span className="price-range-tag low">Floor</span>
            <span className="price-range-name">{avgPrice.lowest.name}</span>
            <span className="price-range-val">${avgPrice.lowest.usd}</span>
          </div>
        </div>
      </div>

      <div className="stat-card accent-amber">
        <span className="num">{vintage.spread}</span>
        <span className="lbl">Vintage Spread</span>
        <div className="price-range">
          <div className="price-range-item">
            <span className="price-range-tag low">Oldest</span>
            <span className="price-range-name">{vintage.oldest.name}</span>
            <span className="price-range-val">{vintage.oldest.year}</span>
          </div>
          <div className="price-range-item">
            <span className="price-range-tag high">Newest</span>
            <span className="price-range-name">{vintage.newest.name}</span>
            <span className="price-range-val">{vintage.newest.year}</span>
          </div>
        </div>
      </div>

    </div>
  )
}
