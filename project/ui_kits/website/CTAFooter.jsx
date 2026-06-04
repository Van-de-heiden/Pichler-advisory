// CTAFooter.jsx — closing invitation + footer
function CTAFooter({ onContact }) {
  return (
    <React.Fragment>
      <section className="section closing">
        <div className="closing-inner reveal">
          <span className="diamond-divider"><span className="dd-rule" /><span className="dd-dia" /><span className="dd-rule" /></span>
          <h2 className="closing-title">Begin a confidential conversation.</h2>
          <p className="closing-lede">
            We work with a small, considered circle of principals and partners. If your capital
            warrants discipline, we should talk.
          </p>
          <button className="btn-primary btn-lg" onClick={onContact}>Start a conversation <Icon name="arrow-right" size={18} /></button>
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="../../assets/pcg-wordmark.png" alt="Pichler Capital Group" className="footer-word" />
            <p className="footer-tag">Private capital, allocated with discipline.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <span className="footer-h">Firm</span>
              <a href="#approach">Approach</a><a href="#thesis">Thesis</a><a href="#focus-areas">Focus areas</a><a href="#stewardship">Stewardship</a>
            </div>
            <div className="footer-col">
              <span className="footer-h">Contact</span>
              <a href="#"><Icon name="mail" size={14} /> info@pichlercapital.ch</a>
              <a href="#"><Icon name="map-pin" size={14} /> Switzerland</a>
            </div>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2026 Pichler Capital Group</span>
          <span className="footer-risk">All investments carry risk. Target returns are not guarantees.</span>
        </div>
      </footer>
    </React.Fragment>
  );
}
window.CTAFooter = CTAFooter;
