// Overview.jsx
function Donut({ data }) {
  let acc = 0;
  const stops = data.map((d) => {
    const start = acc; acc += d.pct;
    return `${d.color} ${start}% ${acc}%`;
  }).join(', ');
  return (
    <div className="donut-wrap">
      <div className="donut" style={{ background: `conic-gradient(${stops})` }}>
        <div className="donut-hole">
          <span className="donut-num">€2.0M</span>
          <span className="donut-lbl">Committed</span>
        </div>
      </div>
      <ul className="donut-legend">
        {data.map((d) => (
          <li key={d.area}><span className="dl-dot" style={{ background: d.color }} /><span className="dl-area">{d.area}</span><span className="dl-pct">{d.pct}%</span></li>
        ))}
      </ul>
    </div>
  );
}

function Overview({ onOpen }) {
  const { holdings, alloc, documents } = window.PORTAL;
  const stats = [
    { l: 'Total committed', v: '€2.0M', d: 'Across 5 positions', tone: 'neutral' },
    { l: 'Current value', v: '€2.08M', d: '+4.0% net', tone: 'pos' },
    { l: 'Unrealised change', v: '+€0.08M', d: 'Since founding', tone: 'pos' },
    { l: 'Cash to deploy', v: '€0.6M', d: 'Available', tone: 'neutral' },
  ];
  return (
    <div className="view">
      <section className="stat-row">
        {stats.map((s) => (
          <div className="stat-tile" key={s.l}>
            <span className="st-label">{s.l}</span>
            <span className="st-value">{s.v}</span>
            <span className={'st-delta st-' + s.tone}>
              {s.tone === 'pos' && <Icon name="trending-up" size={14} />}{s.d}
            </span>
          </div>
        ))}
      </section>

      <section className="ov-grid">
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Allocation by focus area</h2>
            <span className="panel-meta">Q2 2026</span>
          </div>
          <Donut data={alloc} />
        </div>
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Capital account</h2>
            <span className="panel-meta">As of 30 Jun 2026</span>
          </div>
          <ul className="account-rows">
            <li><span>Opening balance</span><span>€1.92M</span></li>
            <li><span>Contributions</span><span>€0.10M</span></li>
            <li><span>Realised gains</span><span className="pos">+€0.02M</span></li>
            <li><span>Unrealised change</span><span className="pos">+€0.04M</span></li>
            <li className="account-total"><span>Current value</span><span>€2.08M</span></li>
          </ul>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Positions</h2>
          <button className="panel-link" onClick={() => onOpen(null)}>View portfolio <Icon name="chevron-right" size={15} /></button>
        </div>
        <HoldingsTable rows={holdings.slice(0, 4)} onOpen={onOpen} />
      </section>
    </div>
  );
}
window.Overview = Overview;
