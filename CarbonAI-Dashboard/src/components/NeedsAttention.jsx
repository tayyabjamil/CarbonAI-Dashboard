import { ratingBand } from '../data/projects'

function classify(p) {
  if (p.rating === 'pending') return { label: 'Pending rating',  cls: 'flag-pending' }
  if (p.rating === null)      return { label: 'Unrated',         cls: 'flag-unrated' }
  return                             { label: `High risk · ${p.rating}`, cls: 'flag-high' }
}

export default function NeedsAttention({ projects, onSelect }) {
  const flagged = projects.filter(p => {
    const band = ratingBand(p.rating)
    return band === 'high' || p.rating === null || p.rating === 'pending'
  })

  if (flagged.length === 0) return null

  return (
    <section className="attention-panel" aria-label="Projects needing attention">
      <header className="attention-header">
        <span className="attention-title">Needs attention</span>
        <span className="attention-count">{flagged.length} projects</span>
      </header>
      <ul className="attention-list">
        {flagged.map(p => {
          const { label, cls } = classify(p)
          const excerpt = p.notes ? p.notes.slice(0, 100) + (p.notes.length > 100 ? '…' : '') : null
          return (
            <li key={p.id} className="attention-item" onClick={() => onSelect(p.id)} role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelect(p.id)}>
              <span className={`attention-badge ${cls}`}>{label}</span>
              <span className="attention-name">{p.name}</span>
              {excerpt && <span className="attention-note">{excerpt}</span>}
              <span className="attention-cta">View ↓</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
