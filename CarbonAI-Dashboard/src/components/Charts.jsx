/* Volume pre-computed from dataset: REDD+ 513k, ARR 99k, Mangrove 69k, Soil C 15k, Biochar 12k, DAC 6k */
const volumeData = [
  { label: 'REDD+',   pct: 100,  val: '513k tCO₂e', color: '#397f86' },
  { label: 'ARR',     pct: 19.4, val: '99k tCO₂e',  color: '#de7777' },
  { label: 'Mangrove',pct: 13.4, val: '69k tCO₂e',  color: '#386694' },
  { label: 'Soil C',  pct: 3.0,  val: '15k tCO₂e',  color: '#88b2b7' },
  { label: 'Biochar', pct: 2.4,  val: '12k tCO₂e',  color: '#e7a33c' },
  { label: 'DAC',     pct: 1.2,  val: '6k tCO₂e',   color: '#ffb547' },
]

/* Risk counts from ratingColor thresholds (≥80 low, ≥60 medium, <60 high): Low 5, Med 5, High 2, Unrated 2 */
const riskData = [
  { label: 'Low risk',    pct: 100, val: '5 projects', color: '#397f86' },
  { label: 'Medium risk', pct: 100, val: '5 projects', color: '#e7a33c' },
  { label: 'High risk',   pct: 40,  val: '2 projects', color: '#de7777' },
  { label: 'Unrated',     pct: 40,  val: '2 projects', color: '#cccccc' },
]

function HBarChart({ data }) {
  return (
    <div className="h-bars">
      {data.map(row => (
        <div key={row.label} className="h-bar-row">
          <div className="h-bar-label">{row.label}</div>
          <div className="h-bar-track">
            <div className="h-bar-fill" style={{ width: `${row.pct}%`, background: row.color }} />
          </div>
          <div className="h-bar-val">{row.val}</div>
        </div>
      ))}
    </div>
  )
}

export default function Charts() {
  return (
    <div className="charts-row">
      <div className="chart-card a">
        <h3>Volume By Project Type</h3>
        <HBarChart data={volumeData} />
      </div>
      <div className="chart-card b">
        <h3>Risk Rating Distribution</h3>
        <HBarChart data={riskData} />
      </div>
    </div>
  )
}
