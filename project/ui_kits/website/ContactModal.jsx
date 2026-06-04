// ContactModal.jsx — confidential enquiry, interactive (fake submit)
function ContactModal({ open, onClose }) {
  const [sent, setSent] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  React.useEffect(() => { if (open) { setSent(false); setAgreed(false); } }, [open]);
  if (!open) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        {!sent ? (
          <React.Fragment>
            <span className="eyebrow">Confidential enquiry</span>
            <h2 className="modal-title">Start a conversation</h2>
            <p className="modal-lede">We reply to every serious enquiry. Nothing is shared.</p>
            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); if (agreed) setSent(true); }}>
              <div className="field-row">
                <label className="field"><span>Name</span><input type="text" placeholder="Your name" required /></label>
                <label className="field"><span>Email</span><input type="email" placeholder="you@firm.com" required /></label>
              </div>
              <label className="field"><span>Enquiry</span><textarea rows="3" placeholder="A few words on what you have in mind." /></label>
              <label className="check" onClick={() => setAgreed(!agreed)}>
                <span className={'check-box' + (agreed ? ' is-on' : '')}>{agreed && <Icon name="check" size={13} />}</span>
                I have read the risk considerations.
              </label>
              <button type="submit" className={'btn-primary btn-block' + (agreed ? '' : ' is-disabled')}>Send enquiry</button>
            </form>
          </React.Fragment>
        ) : (
          <div className="modal-sent">
            <span className="sent-mark"><Icon name="check" size={26} /></span>
            <h2 className="modal-title">Received, with discretion.</h2>
            <p className="modal-lede">Thank you. A partner will be in touch shortly.</p>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
window.ContactModal = ContactModal;
