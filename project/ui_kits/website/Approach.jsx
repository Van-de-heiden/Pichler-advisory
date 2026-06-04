// Approach.jsx
function Approach() {
  const pillars = [
    { icon: 'compass', t: 'Conviction', d: 'We commit when judgment, timing and structure converge — not before. Patience is a position.' },
    { icon: 'scale', t: 'Judgment', d: 'Every opportunity is weighed on its thesis, risk profile and execution path. We do not dress uncertainty as certainty.' },
    { icon: 'shield', t: 'Discretion', d: 'Confidential by default. Relationships and information are held with the care they deserve.' },
    { icon: 'landmark', t: 'Stewardship', d: 'Capital is allocated to endure. Every position is built to compound patiently — a foundation laid to outlast the generation that begins it.' },
  ];
  return (
    <section className="section approach" id="approach">
      <div className="section-head reveal">
        <span className="eyebrow">The approach</span>
        <h2 className="section-title">Measured conviction, expressed with precision.</h2>
        <p className="section-lede">
          We approach capital allocation with restraint, conviction and commercial realism.
          Four principles govern every decision.
        </p>
      </div>
      <div className="pillars">
        {pillars.map((p, i) => (
          <article className="pillar reveal" key={p.t} style={{ transitionDelay: (i * 70) + 'ms' }}>
            <span className="pillar-icon"><Icon name={p.icon} size={22} /></span>
            <h3 className="pillar-title">{p.t}</h3>
            <p className="pillar-desc">{p.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
window.Approach = Approach;
