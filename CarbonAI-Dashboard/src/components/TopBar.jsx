export default function TopBar({ onExport }) {
  return (
    <div className="top-bar">
      <div>
        <h1>Carbon Project Portfolio</h1>
        <p>Internal review build — data refreshed on file open</p>
      </div>
      <button className="btn-export" onClick={onExport}>Export CSV</button>
    </div>
  )
}
