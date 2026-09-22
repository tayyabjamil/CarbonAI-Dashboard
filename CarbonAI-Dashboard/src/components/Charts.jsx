import { useState } from 'react'
import { useVolumeByType, useVolumeByRegistry, usePortfolioStats } from '../hooks/useChartData'
import WorldMap from './WorldMap'

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

function Toggle({ options, active, onChange }) {
  return (
    <div className="chart-toggle">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`toggle-btn${active === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function Charts() {
  const [volumeView, setVolumeView] = useState('type')

  const volumeByType     = useVolumeByType()
  const volumeByRegistry = useVolumeByRegistry()
  const { totalVolume }  = usePortfolioStats()

  const volumeData = volumeView === 'type' ? volumeByType : volumeByRegistry
  const totalLabel = totalVolume >= 1000
    ? `${(totalVolume / 1000).toFixed(1)}k tCO₂e total`
    : `${totalVolume} tCO₂e total`

  return (
    <div className="charts-row">
      <div className="chart-card" style={{ flex: 1 }}>
        <div className="chart-card-header">
          <h3>Volume by</h3>
          <Toggle
            options={[
              { value: 'type',     label: 'Project Type' },
              { value: 'registry', label: 'Registry'     },
            ]}
            active={volumeView}
            onChange={setVolumeView}
          />
          <span className="chart-total">{totalLabel}</span>
        </div>
        <HBarChart data={volumeData} />
      </div>
      <div className="chart-card" style={{ flex: 1 }}>
        <h3>Geographic Coverage</h3>
        <WorldMap />
      </div>
    </div>
  )
}
