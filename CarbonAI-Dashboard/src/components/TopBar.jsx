export default function TopBar({ onExport }) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <img src="/logo.png" alt="CarbonAI" className="top-bar-logo" />
        <nav className="top-bar-nav">
          <a href="#" className="active">Portfolio</a>
          <a href="#">Ratings</a>
          <a href="#">Reports</a>
        </nav>
      </div>
      <div className="top-bar-right">
        <div>
          <h1>Carbon Project Portfolio</h1>
          <p>Internal review build — data refreshed on file open</p>
        </div>
        <button className="btn-export" onClick={onExport}>Export CSV</button>
      </div>
    </header>
  )
}
