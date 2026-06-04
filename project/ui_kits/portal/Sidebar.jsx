// Sidebar.jsx
function Sidebar({ tab, setTab, onLogout }) {
  const items = [
    { k: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { k: 'portfolio', label: 'Portfolio', icon: 'briefcase' },
    { k: 'documents', label: 'Documents', icon: 'folder' },
    { k: 'settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <img src="../../assets/pcg-shield.png" alt="" className="sb-shield" />
        <div className="sb-brand-text">
          <span className="sb-name">PICHLER</span>
          <span className="sb-sub">Capital Group</span>
        </div>
      </div>
      <nav className="sb-nav">
        {items.map((it) => (
          <button key={it.k} className={'sb-item' + (tab === it.k ? ' is-active' : '')} onClick={() => setTab(it.k)}>
            <Icon name={it.icon} size={19} />
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <span className="sb-avatar">MP</span>
          <div className="sb-user-text">
            <span className="sb-user-name">M. Pichler</span>
            <span className="sb-user-role">Founder</span>
          </div>
        </div>
        <button className="sb-logout" onClick={onLogout} aria-label="Sign out"><Icon name="log-out" size={17} /></button>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
