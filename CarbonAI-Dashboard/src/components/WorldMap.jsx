import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { useCountryProjects } from '../hooks/useChartData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const COUNTRY_COORDS = {
  PER: [-75.0, -9.2],   IDN: [113.9, -0.8],  GHA: [-1.0, 7.9],
  MEX: [-102.6, 23.6],  BGD: [90.4, 23.7],   BRA: [-51.9, -14.2],
  ISL: [-19.0, 64.9],   ZWE: [29.2, -19.0],  NGA: [8.7, 9.1],
  NPL: [84.1, 28.4],    CHL: [-71.5, -35.7], USA: [-95.7, 37.1],
  SEN: [-14.5, 14.5],
}

const MIN_SCALE = 100
const MAX_SCALE = 600
const STEP      = 20

export default function WorldMap() {
  const countryData  = useCountryProjects()
  const [scale, setScale]     = useState(160)
  const [center, setCenter]   = useState([10, 5])
  const [tooltip, setTooltip] = useState(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useState(null)

  const activeISOs = new Set(countryData.map(c => c.iso))

  function onMouseDown(e) {
    setDragging(true)
    dragStart[1]({ x: e.clientX, y: e.clientY })
  }

  function onMouseMove(e) {
    if (!dragging || !dragStart[0]) return
    const factor = 80 / scale
    const dx = e.clientX - dragStart[0].x
    const dy = e.clientY - dragStart[0].y
    setCenter(([lng, lat]) => [
      Math.max(-180, Math.min(180, lng - dx * factor)),
      Math.max(-80,  Math.min(80,  lat + dy * factor)),
    ])
    dragStart[1]({ x: e.clientX, y: e.clientY })
  }

  function onMouseUp() {
    setDragging(false)
    dragStart[1](null)
  }

  return (
    <div
      className={`world-map-wrap${dragging ? ' dragging' : ''}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div className="map-zoom-controls">
        <button
          className="map-zoom-btn"
          onClick={() => setScale(s => Math.min(s + STEP, MAX_SCALE))}
          disabled={scale >= MAX_SCALE}
        >+</button>
        <button
          className="map-zoom-btn"
          onClick={() => setScale(s => Math.max(s - STEP, MIN_SCALE))}
          disabled={scale <= MIN_SCALE}
        >−</button>
      </div>

      <ComposableMap
        projectionConfig={{ scale, center }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const iso    = geo.properties.ADM0_A3 || geo.id
              const active = activeISOs.has(iso)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={active ? 'var(--teal)' : 'var(--surface-alt)'}
                  stroke="var(--border)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none', opacity: active ? 1 : 0.6 },
                    hover:   { outline: 'none', opacity: active ? 0.8 : 0.6 },
                    pressed: { outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>
        {countryData.map(c => {
          const coords = COUNTRY_COORDS[c.iso]
          if (!coords) return null
          return (
            <Marker
              key={c.iso}
              coordinates={coords}
              onMouseEnter={() => setTooltip(c)}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle r={c.count > 1 ? 10 : 7} fill={c.color} stroke="#fff" strokeWidth={1.5} />
              {c.count > 1 && (
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fontSize: 9, fill: '#fff', fontWeight: 700, pointerEvents: 'none' }}
                >
                  {c.count}
                </text>
              )}
            </Marker>
          )
        })}
      </ComposableMap>

      <div className="map-legend">
        {[
          { label: 'Low risk',    color: '#397f86' },
          { label: 'Medium risk', color: '#e8a020' },
          { label: 'High risk',   color: '#de7777' },
          { label: 'Unrated',     color: '#909ca3' },
        ].map(item => (
          <div key={item.label} className="map-legend-item">
            <span className="map-legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {tooltip && (
        <div className="map-tooltip">
          <div className="map-tooltip-header">
            <strong>{tooltip.name}</strong>
            <span className="map-tooltip-count">{tooltip.count} project{tooltip.count > 1 ? 's' : ''}</span>
          </div>
          <div className="map-tooltip-projects">
            {tooltip.projects.map((p, i) => (
              <div key={i} className="map-tooltip-project">
                <span className="map-tooltip-name">{p.name}</span>
                <span className="map-tooltip-meta">{p.type} · {p.volume} · {p.rating ?? 'Unrated'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
