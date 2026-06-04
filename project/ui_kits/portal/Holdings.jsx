// Holdings.jsx — shared table + opportunity detail drawer
function HoldingsTable({ rows, onOpen }) {
  return (
    <table className="holdings">
      <thead>
        <tr>
          <th>Position</th><th>Focus area</th><th className="num">Committed</th>
          <th className="num">Value</th><th className="num">Net IRR</th><th>Status</th><th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((h) => (
          <tr key={h.id} onClick={() => onOpen(h)} className="holding-row">
            <td className="h-name">{h.name}</td>
            <td className="h-area">{h.area}</td>
            <td className="num">€{h.committed.toFixed(1)}M</td>
            <td className="num">€{h.value.toFixed(1)}M</td>
            <td className={'num ' + (h.up ? 'pos' : 'neg')}>
              {h.up ? '+' : ''}{h.irr.toFixed(1)}%
            </td>
            <td><span className={'pill pill-' + (h.status === 'Held' ? 'held' : 'review')}>{h.status}</span></td>
            <td className="h-arrow"><Icon name="chevron-right" size={16} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
window.HoldingsTable = HoldingsTable;

function OpportunityDrawer({ holding, onClose }) {
  if (!holding) return null;
  const moic = (holding.value / holding.committed).toFixed(2);
  return (
    <div className="drawer-scrim" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        <span className={'pill pill-' + (holding.status === 'Held' ? 'held' : 'review')}>{holding.status}</span>
        <h2 className="drawer-title">{holding.name}</h2>
        <span className="drawer-area"><Icon name="briefcase" size={14} /> {holding.area} · since {holding.since}</span>

        <div className="drawer-stats">
          <div><span className="ds-num">€{holding.committed.toFixed(1)}M</span><span className="ds-lbl">Committed</span></div>
          <div><span className="ds-num">€{holding.value.toFixed(1)}M</span><span className="ds-lbl">Current value</span></div>
          <div><span className={'ds-num ' + (holding.up ? 'pos' : 'neg')}>{holding.up ? '+' : ''}{holding.irr.toFixed(1)}%</span><span className="ds-lbl">Net IRR</span></div>
          <div><span className="ds-num">{moic}×</span><span className="ds-lbl">MOIC</span></div>
        </div>

        <div className="drawer-block">
          <span className="db-label">Investment thesis</span>
          <p className="db-text">{holding.thesis}</p>
        </div>
        <div className="drawer-block">
          <span className="db-label">Risk profile · {holding.risk}</span>
          <p className="db-text">{holding.risklbl}</p>
        </div>

        <div className="drawer-actions">
          <button className="btn-primary btn-block"><Icon name="file-text" size={15} /> Open thesis memo</button>
        </div>
        <p className="drawer-risk">Target returns are not guarantees. All positions carry risk.</p>
      </aside>
    </div>
  );
}
window.OpportunityDrawer = OpportunityDrawer;
