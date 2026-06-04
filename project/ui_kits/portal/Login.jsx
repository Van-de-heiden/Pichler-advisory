// Login.jsx
function Login({ onEnter }) {
  const [email, setEmail] = React.useState('maurus@pichlercapital.ch');
  const [pw, setPw] = React.useState('••••••••••');
  return (
    <div className="login-screen">
      <div className="login-card">
        <img src="../../assets/pcg-shield.png" alt="" className="login-shield" />
        <span className="eyebrow login-eyebrow">Investor access</span>
        <h1 className="login-title">The portal</h1>
        <p className="login-lede">A confidential view of your capital account, positions and documents.</p>
        <form className="login-form" onSubmit={(e) => { e.preventDefault(); onEnter(); }}>
          <label className="field"><span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field"><span>Password</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </label>
          <button type="submit" className="btn-primary btn-block">
            <Icon name="lock" size={15} /> Enter portal
          </button>
        </form>
        <p className="login-note">Protected access. Sessions are encrypted and confidential.</p>
      </div>
      <a className="login-back" href="../website/index.html"><Icon name="arrow-right" size={14} style={{ transform: 'rotate(180deg)' }} /> Return to pichlercapital.com</a>
    </div>
  );
}
window.Login = Login;
