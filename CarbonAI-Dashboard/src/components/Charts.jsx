import { useState } from 'react'
import { useVolumeByType, useVolumeByRegistry, useRatingData } from '../hooks/useChartData'

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

function VBarChart({ data }) {
  return (
    <div className="v-bars">
      {data.map(row => (
        <div key={row.label} className="v-bar-col">
          <span className="v-bar-val">{row.val}</span>
          <div className="v-bar-track">
            <div className="v-bar-fill" style={{ height: `${row.pct}%`, background: row.color }} />
          </div>
          <span className="v-bar-label">{row.label}</span>
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
  const ratingData       = useRatingData()

  const volumeData = volumeView === 'type' ? volumeByType : volumeByRegistry

  return (
    <div className="charts-row">
      <div className="chart-card" style={{ flex: 7 }}>
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
        </div>
        <HBarChart data={volumeData} />
      </div>
      <div className="chart-card" style={{ flex: 3 }}>
        <h3>Rating Distribution</h3>
        <VBarChart data={ratingData} />
      </div>
    </div>
  )
}
