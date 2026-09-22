import { useState, useMemo } from 'react'
import { projects, ratingBand } from './data/projects'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import KpiCards from './components/KpiCards'
import FilterBar from './components/FilterBar'
import Charts from './components/Charts'
import ProjectTable from './components/ProjectTable'

export default function App() {
  const [search, setSearch]     = useState('')
  const [type, setType]         = useState('All types')
  const [country, setCountry]   = useState('All countries')
  const [registry, setRegistry] = useState('All registries')
  const [rating, setRating]     = useState('All ratings')

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (search) {
        const hay = `${p.name} ${p.registry} ${p.country} ${p.type} ${p.notes}`.toLowerCase()
        if (!hay.includes(search.toLowerCase())) return false
      }
      if (type !== 'All types' && p.type !== type) return false
      if (country !== 'All countries' && p.country !== country) return false
      if (registry !== 'All registries' && p.registry.toLowerCase() !== registry.toLowerCase()) return false
      if (rating !== 'All ratings') {
        const band = ratingBand(p.rating)
        if (rating === 'Low risk'    && band !== 'low')     return false
        if (rating === 'Medium risk' && band !== 'medium')  return false
        if (rating === 'High risk'   && band !== 'high')    return false
        if (rating === 'Unrated'     && band !== 'unrated') return false
      }
      return true
    })
  }, [search, type, country, registry, rating])

  function handleExport() {
    const header = ['ID', 'Name', 'Registry', 'Country', 'Type', 'Vintage', 'Volume', 'Price', 'Rating', 'Updated']
    const rows = filtered.map(p =>
      [p.id, p.name, p.registry, p.country, p.type, p.vintage, p.volume, p.price, p.rating ?? '', p.updated]
    )
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'carbonai-portfolio.csv'
    a.click()
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar onExport={handleExport} />
        <KpiCards />
        <FilterBar
          search={search}   setSearch={setSearch}
          type={type}       setType={setType}
          country={country} setCountry={setCountry}
          registry={registry} setRegistry={setRegistry}
          rating={rating}   setRating={setRating}
        />
        <Charts />
        <ProjectTable projects={filtered} />
        <footer>
          <span>© 2026 CarbonAI. Internal use only.</span>
          <span><a href="#">carbonai.eco</a></span>
        </footer>
      </main>
    </div>
  )
}
