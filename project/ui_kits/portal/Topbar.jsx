// Topbar.jsx
function Topbar({ title, subtitle }) {
  return (
    <header className="topbar">
      <div className="tb-titles">
        <h1 className="tb-title">{title}</h1>
        <span className="tb-sub">{subtitle}</span>
      </div>
      <div className="tb-actions">
        <div className="tb-search">
          <Icon name="search" size={16} />
          <input placeholder="Search positions, documents…" />
        </div>
        <button className="tb-icon" aria-label="Notifications"><Icon name="bell" size={18} /><span className="tb-dot" /></button>
      </div>
    </header>
  );
}
window.Topbar = Topbar;
