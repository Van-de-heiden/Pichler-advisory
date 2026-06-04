// Thesis.jsx — editorial split with a measured statement + numbered points
function Thesis() {
  const points = [
    { n: '01', t: 'Thesis before capital', d: 'No position is taken without a written, defensible investment thesis.' },
    { n: '02', t: 'Downside first', d: 'We size every commitment against its liquidity profile and downside exposure.' },
    { n: '03', t: 'Aligned execution', d: 'We invest alongside operators whose interests are structurally aligned with ours.' },
  ];
  return (
    <section className="section thesis" id="thesis">
      <div className="thesis-grid">
        <div className="thesis-media reveal">
          <ImagePlate tone="bordeaux" ratio="4 / 5" label="Marble · the long view" />
        </div>
        <div className="thesis-copy reveal">
          <span className="eyebrow">Investment thesis</span>
          <h2 className="section-title">Capital is not moved by noise.</h2>
          <p className="section-lede">
            It moves when judgment, timing and structure converge. Each opportunity is
            assessed through its thesis, risk profile, capital requirement and execution path.
          </p>
          <ul className="thesis-points">
            {points.map((p) => (
              <li className="thesis-point" key={p.n}>
                <span className="tp-num">{p.n}</span>
                <div>
                  <h3 className="tp-title">{p.t}</h3>
                  <p className="tp-desc">{p.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
window.Thesis = Thesis;
