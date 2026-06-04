// Documents.jsx
function Documents() {
  const { documents } = window.PORTAL;
  return (
    <div className="view">
      <section className="panel">
        <ul className="doc-list">
          {documents.map((d) => (
            <li className="doc-row" key={d.name}>
              <span className="doc-icon"><Icon name="file-text" size={20} /></span>
              <div className="doc-main">
                <span className="doc-name">{d.name}</span>
                <span className="doc-meta">{d.type} · {d.date} · {d.size}</span>
              </div>
              <button className="doc-dl" aria-label="Download"><Icon name="download" size={18} /></button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
window.Documents = Documents;

function Settings() {
  return (
    <div className="view">
      <section className="panel empty-panel">
        <span className="empty-icon"><Icon name="settings" size={26} /></span>
        <h2 className="empty-title">Settings</h2>
        <p className="empty-text">Profile, notifications and security preferences would appear here. Left intentionally minimal in this kit.</p>
      </section>
    </div>
  );
}
window.Settings = Settings;
