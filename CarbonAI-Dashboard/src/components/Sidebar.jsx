export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo on white — matches the brand's light background */}
      <div className="sidebar-logo-wrap">
        <img src="/logo.png" alt="CarbonAI" className="sidebar-logo" />
      </div>
      <nav className="sidebar-nav">
        <a href="#" className="active">Portfolio</a>
        <a href="#">Ratings</a>
        <a href="#">Reports</a>
      </nav>
    </aside>
  )
}
