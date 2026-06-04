// TrackRecord.jsx — founder statement band (honest first-generation framing)
function TrackRecord() {
  const markers = [
    { f: '2026', l: 'Founding year' },
    { f: '01', l: 'First generation' },
    { f: '17', l: 'Building since age' },
    { f: '100%', l: 'Founder-owned' },
  ];
  return (
    <section className="section-dark stewardship" id="stewardship">
      <div className="dark-wash" />
      <div className="dark-inner">
        <div className="dark-lead reveal">
          <span className="eyebrow eyebrow-gold">The founder</span>
          <h2 className="dark-title">Not an inherited fortune. A deliberate beginning.</h2>
          <p className="dark-lede">
            Pichler Capital Group is founded by Maurus Nic Ramon Pichler — a young entrepreneur
            and developer, building from the first stone. Entrepreneurial since seventeen and
            fluent in modern technology, the intent is singular: to be the first generation,
            and to build enduring value the disciplined way.
          </p>
        </div>
        <div className="figures">
          {markers.map((x, i) => (
            <div className="figure reveal" key={x.l} style={{ transitionDelay: (i * 70) + 'ms' }}>
              <span className="figure-num">{x.f}</span>
              <span className="figure-rule" />
              <span className="figure-label">{x.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.TrackRecord = TrackRecord;
