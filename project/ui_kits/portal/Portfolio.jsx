// Portfolio.jsx
function Portfolio({ onOpen }) {
  const { holdings } = window.PORTAL;
  const [filter, setFilter] = React.useState('All');
  const tabs = ['All', 'Core', 'Selective'];
  const rows = filter === 'All' ? holdings : holdings.filter((h) => h.tag === filter);
  return (
    <div className="view">
      <div className="filter-bar">
        {tabs.map((t) => (
          <button key={t} className={'filter-chip' + (filter === t ? ' is-on' : '')} onClick={() => setFilter(t)}>{t}</button>
        ))}
        <span className="filter-count">{rows.length} positions</span>
      </div>
      <section className="panel">
        <HoldingsTable rows={rows} onOpen={onOpen} />
      </section>
    </div>
  );
}
window.Portfolio = Portfolio;
