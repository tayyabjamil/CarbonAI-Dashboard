export default function KpiCards() {
  return (
    <div className="stats-row">
      <div className="stat-card accent-navy">
        <span className="num">14</span>
        <span className="lbl">Total Projects</span>
      </div>
      <div className="stat-card accent-teal">
        <span className="num">714.8k tCO₂e</span>
        <span className="lbl">Total Credit Volume</span>
      </div>
      <div className="stat-card accent-amber">
        <span className="num">2</span>
        <span className="lbl">Pending / Unrated</span>
      </div>
    </div>
  )
}
