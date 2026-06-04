// FocusAreas.jsx — selectable cards (interactive)
function FocusAreas() {
  const areas = [
    { k: 'holdings', icon: 'landmark', t: 'Private holdings', d: 'Long-term ownership in resilient, cash-generative businesses with disciplined governance.', stat: '€240M', statlbl: 'Committed', tag: 'Core' },
    { k: 'realassets', icon: 'globe', t: 'Real assets', d: 'Tangible value: prime real estate, infrastructure and assets that endure cycles.', stat: '€110M', statlbl: 'Committed', tag: 'Core' },
    { k: 'ventures', icon: 'trending-up', t: 'Selective ventures', d: 'Concentrated, late-stage positions in companies with proven commercial substance.', stat: '€48M', statlbl: 'Committed', tag: 'Selective' },
    { k: 'partnerships', icon: 'users', t: 'Co-investment', d: 'Partnering with operators and families whose interests are structurally aligned.', stat: '€22M', statlbl: 'Committed', tag: 'Selective' },
  ];
  const [active, setActive] = React.useState('holdings');
  return (
    <section className="section focus" id="focus-areas">
      <div className="section-head reveal">
        <span className="eyebrow">Focus areas</span>
        <h2 className="section-title">Where we allocate.</h2>
        <p className="section-lede">Four disciplines, one standard: every opportunity must justify its place.</p>
      </div>
      <div className="focus-grid">
        {areas.map((a, i) => (
          <div className="focus-cell reveal" key={a.k} style={{ transitionDelay: (i * 60) + 'ms' }}>
            <article
              className={'focus-card' + (active === a.k ? ' is-active' : '')}
              onMouseEnter={() => setActive(a.k)}
              onClick={() => setActive(a.k)}
            >
              <div className="fc-top">
                <span className="fc-icon"><Icon name={a.icon} size={22} /></span>
                <span className={'fc-tag fc-tag-' + a.tag.toLowerCase()}>{a.tag}</span>
              </div>
              <h3 className="fc-title">{a.t}</h3>
              <p className="fc-desc">{a.d}</p>
              <div className="fc-foot">
                <div className="fc-stat"><span className="fc-figure">{a.stat}</span><span className="fc-statlbl">{a.statlbl}</span></div>
                <span className="fc-arrow"><Icon name="arrow-up-right" size={18} /></span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
window.FocusAreas = FocusAreas;
