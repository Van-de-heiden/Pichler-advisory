// Hero.jsx
function Hero({ onContact }) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow hero-eyebrow">Private capital, allocated with discipline</span>
          <h1 className="hero-title">Capital deserves <em>discipline</em>.</h1>
          <p className="hero-lede">
            Pichler Capital Group is a private investment and advisory house built for
            measured opportunities, entrepreneurial execution and long-term value creation.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onContact}>Review opportunities <Icon name="arrow-right" size={17} /></button>
            <a className="btn-ghost" href="#thesis">Explore the thesis</a>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item"><span className="hm-figure">2026</span><span className="hm-label">Founding year</span></div>
            <span className="hero-meta-rule" />
            <div className="hero-meta-item"><span className="hm-figure">First</span><span className="hm-label">Generation</span></div>
            <span className="hero-meta-rule" />
            <div className="hero-meta-item"><span className="hm-figure">Independent</span><span className="hm-label">Founder-led house</span></div>
          </div>
        </div>
        <div className="hero-image reveal">
          <ImagePlate tone="charcoal" ratio="3 / 4" label="Switzerland · built by hand" />
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
