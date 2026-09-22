import { useState } from 'react'
import { ratingColor } from '../data/projects'

const COLS = [
  { key: 'id',       label: 'ID' },
  { key: 'name',     label: 'Project name', sortable: true },
  { key: 'registry', label: 'Registry',     sortable: true },
  { key: 'country',  label: 'Country',      sortable: true },
  { key: 'rating',   label: 'Rating',       sortable: true },
  { key: 'vintage',  label: 'Vintage',      sortable: true },
  { key: 'type',     label: 'Type' },
  { key: 'volume',   label: 'Volume',       sortable: true },
  { key: 'price',    label: 'Price',        sortable: true },
  { key: 'updated',  label: 'Last updated', sortable: true },
  { key: 'notes',    label: 'Notes' },
]

export default function ProjectTable({ projects }) {
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState(1)

  const sorted = sortCol
    ? [...projects].sort((a, b) => {
        const va = a[sortCol] ?? ''
        const vb = b[sortCol] ?? ''
        return va > vb ? sortDir : va < vb ? -sortDir : 0
      })
    : projects

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => -d)
    else { setSortCol(col); setSortDir(1) }
  }

  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2>All projects</h2>
        <span className="count">Showing {projects.length} of 14</span>
      </div>
      <table>
        <thead>
          <tr>
            {COLS.map(col => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={col.sortable ? () => toggleSort(col.key) : undefined}
              >
                {col.label}
                {col.sortable && <span className="arrows"> &#9650;&#9660;</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <tr key={p.id}>
              <td className="id-cell">{p.id}</td>
              <td className="name-cell">{p.name}</td>
              <td>{p.registry}</td>
              <td>{p.country}</td>
              <td className="rating-cell">
                <span className="risk-dot" style={{ background: ratingColor(p.rating) }} />{' '}
                {p.rating === null ? '—' : p.rating}
              </td>
              <td>{p.vintage}</td>
              <td>{p.type}</td>
              <td>{p.volume}</td>
              <td>{p.price}</td>
              <td>{p.updated}</td>
              <td className="notes-cell">{p.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
