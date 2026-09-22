import React from 'react'
import { ratingBand } from '../utils/parse'
import { projects as allProjects } from '../data/projects'

const COLS = [
  { key: 'name',     label: 'Project'  },
  { key: 'rating',   label: 'Rating'   },
  { key: 'type',     label: 'Type'     },
  { key: 'country',  label: 'Country'  },
  { key: 'registry', label: 'Registry' },
  { key: 'vintage',  label: 'Vintage'  },
  { key: 'volume',   label: 'Volume'   },
  { key: 'price',    label: 'Price'    },
  { key: 'updated',  label: 'Updated'  },
]

function RatingBadge({ rating }) {
  if (rating === null)      return <span className="badge badge-unrated">Unrated</span>
  if (rating === 'pending') return <span className="badge badge-pending">Pending</span>
  const band  = ratingBand(rating)
  const label = band === 'low' ? 'Low' : band === 'medium' ? 'Med' : 'High'
  return <span className={`badge badge-${band}`}>{label} · {rating}</span>
}

export default function ProjectTable({ projects, selectedId, setSelectedId }) {
  function toggleRow(id) {
    setSelectedId(prev => prev === id ? null : id)
  }

  const sorted = [...projects].sort((a, b) =>
    new Date(b.updated) - new Date(a.updated)
  )

  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2>All projects</h2>
        <span className="count">Showing {projects.length} of {allProjects.length}</span>
      </div>
      <table>
        <thead>
          <tr>
            {COLS.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <React.Fragment key={p.id}>
              <tr
                className={`data-row${selectedId === p.id ? ' selected' : ''}`}
                onClick={() => toggleRow(p.id)}
                title="Click to expand"
              >
                <td className="name-cell">{p.name}</td>
                <td><RatingBadge rating={p.rating} /></td>
                <td>{p.type}</td>
                <td>{p.country}</td>
                <td>{p.registry}</td>
                <td>{p.vintage}</td>
                <td>{p.volume}</td>
                <td>{p.price}</td>
                <td>{p.updated}</td>
              </tr>
              {selectedId === p.id && (
                <tr className="detail-row">
                  <td colSpan={COLS.length}>
                    <div className="project-detail">
                      <span className="detail-id">{p.id}</span>
                      <p className="detail-notes">{p.notes || 'No notes recorded.'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
