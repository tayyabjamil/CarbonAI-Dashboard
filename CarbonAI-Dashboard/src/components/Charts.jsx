/* Design token mirrors — keeps chart colours in sync with design-system.css */
const T = {
  navy:    '#2e7575',
  teal:    '#397f86',
  tealLt:  '#88b5bb',
  amber:   '#e8a020',
  amberLt: '#f0b840',
  coral:   '#de7777',
  muted:   '#c0c8cc',
}

/* Volume pre-computed from dataset: REDD+ 513k, ARR 99k, Mangrove 69k, Soil C 15k, Biochar 12k, DAC 6k */
const volumeData = [
  { label: 'REDD+',   pct: 100,  val: '513k tCO₂e', color: T.teal    },
  { label: 'ARR',     pct: 19.4, val: '99k tCO₂e',  color: T.coral   },
  { label: 'Mangrove',pct: 13.4, val: '69k tCO₂e',  color: T.navy    },
  { label: 'Soil C',  pct: 3.0,  val: '15k tCO₂e',  color: T.tealLt  },
  { label: 'Biochar', pct: 2.4,  val: '12k tCO₂e',  color: T.amber   },
  { label: 'DAC',     pct: 1.2,  val: '6k tCO₂e',   color: T.amberLt },
]

/* Risk counts from ratingColor thresholds (≥80 low, ≥60 medium, <60 high): Low 5, Med 5, High 2, Unrated 2 */
const riskData = [
  { label: 'Low risk',    pct: 100, val: '5 projects', color: T.teal  },
  { label: 'Medium risk', pct: 100, val: '5 projects', color: T.amber },
  { label: 'High risk',   pct: 40,  val: '2 projects', color: T.coral },
  { label: 'Unrated',     pct: 40,  val: '2 projects', color: T.muted },
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
      <div className="chart-card">
        <h3>Volume By Project Type</h3>
        <HBarChart data={volumeData} />
      </div>
      <div className="chart-card">
        <h3>Risk Rating Distribution</h3>
        <HBarChart data={riskData} />
      </div>
    </div>
  )
}
