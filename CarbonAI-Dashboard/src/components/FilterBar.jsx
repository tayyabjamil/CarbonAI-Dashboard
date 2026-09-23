const TYPES      = ['All types', 'REDD+', 'ARR', 'Biochar', 'Mangrove', 'Soil C', 'DAC']
const COUNTRIES  = ['All countries', 'Bangladesh', 'Brazil', 'Chile', 'Ghana', 'Iceland', 'Indonesia', 'Mexico', 'Nepal', 'Nigeria', 'Peru', 'Senegal', 'United States', 'Zimbabwe']
const REGISTRIES = ['All registries', 'ACR', 'American Carbon Registry', 'CAR', 'Gold Standard', 'VCS', 'Verra']
const RATINGS    = ['All ratings', 'Low risk', 'Medium risk', 'High risk', 'Unrated']

export default function FilterBar({ search, setSearch, type, setType, country, setCountry, registry, setRegistry, rating, setRating }) {
  const activeFilters = [
    search   && { label: `"${search}"`,  clear: () => setSearch('')             },
    type     !== 'All types'      && { label: type,     clear: () => setType('All types')      },
    country  !== 'All countries'  && { label: country,  clear: () => setCountry('All countries')  },
    registry !== 'All registries' && { label: registry, clear: () => setRegistry('All registries') },
    rating   !== 'All ratings'    && { label: rating,   clear: () => setRating('All ratings')    },
  ].filter(Boolean)

  return (
    <div className="filter-bar">
      <div className="filter-bar-controls">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={registry} onChange={e => setRegistry(e.target.value)}>
          {REGISTRIES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={rating} onChange={e => setRating(e.target.value)}>
          {RATINGS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {activeFilters.length > 0 && (
        <div className="filter-chips">
          {activeFilters.map(f => (
            <span key={f.label} className="filter-chip">
              {f.label}
              <button className="filter-chip-clear" onClick={f.clear}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
