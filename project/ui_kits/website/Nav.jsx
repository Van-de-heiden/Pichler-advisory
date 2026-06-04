// Nav.jsx
function Nav({ onContact, onLogin, scrolled }) {
  const links = ['Approach', 'Thesis', 'Focus areas', 'Stewardship'];
  return (
    <header className={'site-nav' + (scrolled ? ' is-scrolled' : '')}>
      <div className="nav-inner">
        <a className="nav-brand" href="#top">
          <img src="../../assets/pcg-shield.png" alt="" className="nav-shield" />
          <span className="nav-word">PICHLER CAPITAL GROUP</span>
        </a>
        <nav className="nav-links">
          {links.map((l, i) => (
            <a key={l} className={'nav-link' + (i === 0 ? ' is-active' : '')}
               href={'#' + l.toLowerCase().replace(' ', '-')}>{l}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="nav-login" onClick={onLogin}>
            <Icon name="lock" size={15} /> Investor login
          </button>
          <button className="btn-primary nav-cta" onClick={onContact}>Start a conversation</button>
        </div>
      </div>
    </header>
  );
}
window.Nav = Nav;
