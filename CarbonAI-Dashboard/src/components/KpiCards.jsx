import { usePortfolioStats } from '../hooks/useChartData'

export default function KpiCards() {
  const { totalProjects, totalVolume, pendingOrUnrated, countries, registries, projectTypes } = usePortfolioStats()

  const volumeLabel = totalVolume >= 1000
    ? `${(totalVolume / 1000).toFixed(1)}k tCO₂e`
    : `${totalVolume} tCO₂e`

  return (
    <div className="stats-row">
      <div className="stat-card accent-navy">
        <span className="num">{totalProjects}</span>
        <span className="lbl">Total Projects</span>
      </div>
      <div className="stat-card accent-teal">
        <span className="num">{volumeLabel}</span>
        <span className="lbl">Total Credit Volume</span>
      </div>
      <div className="stat-card accent-amber">
        <span className="num">{countries}</span>
        <span className="lbl">Countries Covered</span>
        <span className="sub">{registries} registries · {projectTypes} project types</span>
      </div>
    </div>
  )
}
