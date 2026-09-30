"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from 'react';
import { Arrow, Icon } from './ui';
import { businessWorlds, offerings } from './new-content';
import { BusinessFlow } from './business-flow';
import { company } from './company';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const serviceButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const outside = (e: PointerEvent) => { if (!header.current?.contains(e.target as Node)) { setOpen(false); setServicesOpen(false); } };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (servicesOpen) { setServicesOpen(false); serviceButton.current?.focus(); } else if (open) { setOpen(false); menuButton.current?.focus(); } } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [servicesOpen, open]);
  const close = () => { setOpen(false); setServicesOpen(false); };
  return <><a className="skip-link" href="#inhalt">Zum Inhalt</a><header className="new-header" ref={header}><div className="wrap header-row"><a className="wordmark" href="/" aria-label="Pichler Advisory – Startseite"><img src="/shield.png" width="24" height="29" alt="" /><span>Pichler Advisory</span></a><nav id="navigation" className={open ? 'navigation open' : 'navigation'} aria-label="Hauptnavigation"><div className="nav-offerings"><button ref={serviceButton} aria-expanded={servicesOpen} aria-controls="service-navigation" onClick={() => setServicesOpen(!servicesOpen)}>Leistungen <span className="chevron" aria-hidden="true" /></button><div className="service-navigation" id="service-navigation" hidden={!servicesOpen}>{offerings.map(s => <a key={s.slug} href={`/leistungen/${s.slug}`} onClick={close}>{s.name}<Arrow /></a>)}<a href="/leistungen/betrieb-betreuung" onClick={close}>Betrieb & Betreuung<Arrow /></a></div></div><a href="/#branchen" onClick={close}>Für Ihren Betrieb</a><a href="/ueber-mich" onClick={close}>Über Pichler</a><a href="/#anfrage" className="nav-cta" onClick={close}>Kontakt <Arrow /></a></nav><button ref={menuButton} className="menu-button" aria-label={open ? 'Menü schliessen' : 'Menü öffnen'} aria-expanded={open} aria-controls="navigation" onClick={() => { setOpen(!open); setServicesOpen(false); }}><Icon name={open ? 'close' : 'menu'} /></button></div></header></>;
}

export function SiteFooter() {
  return <footer className="new-footer wrap">
    <div className="footer-company">
      <a className="wordmark" href="/">{company.name}</a>
      <p>{company.legalForm} · Sitz {company.registeredOffice}</p>
      <p><a href="/impressum">UID {company.uid}</a></p>
    </div>
    <p>© {new Date().getFullYear()} {company.name}</p>
    <nav aria-label="Rechtliches"><a href="/agb">AGB</a><a href="/datenschutz">Datenschutz</a><a href="/impressum">Impressum</a></nav>
    <div className="footer-tools">
      <a className="internal-access" href="https://os.pichler-advisory.ch" target="_blank" rel="noopener noreferrer" aria-label="Intern: Pichler Advisory OS öffnen (neuer Tab)" title="Intern · Pichler Advisory OS">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>
        <span className="internal-label" aria-hidden="true">Intern</span>
      </a>
      <a className="to-top" href="#inhalt" aria-label="Nach oben">↑</a>
    </div>
  </footer>;
}

export function PageMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nodes = document.querySelectorAll<HTMLElement>('[data-enter]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('entered'); observer.unobserve(entry.target); } }), { threshold: .08 });
    nodes.forEach(node => { node.classList.add('enter-ready'); observer.observe(node); });
    return () => { observer.disconnect(); nodes.forEach(node => node.classList.remove('enter-ready')); };
  }, []);
  return null;
}

type Phase = 0 | 1 | 2;
export function OrderInterface({ phase = 2, world = 0, minimal = false }: { phase?: Phase; world?: number; minimal?: boolean }) {
  const item = businessWorlds[world];
  return <div className={`order-interface ${minimal ? 'minimal' : ''}`}><div className="order-top"><span className="interface-title"><Icon name="file" />Rapporterfassung</span><span className="interface-label">Beispiel</span></div><div className="order-main"><div className="order-heading"><div><p>{item.task} #024</p><h3>{phase === 0 ? 'Einmal erfassen.' : phase === 1 ? 'Alles an einem Ort.' : 'Bereit für die Rechnung.'}</h3></div><span className={`order-status phase-${phase}`}>{['Erfasst', 'Zur Prüfung', 'Freigegeben'][phase]}</span></div><div className="order-record"><div className="record-title"><Icon name={item.icon} /><div><strong>{item.object}</strong><span>Heute · Beispieldaten</span></div></div><div className="record-values"><div><span>{item.field}</span><strong>{item.value}</strong></div><div><span>{item.second}</span><strong>{item.secondValue}</strong></div><div><span>Dokumentation</span><strong>{phase === 0 ? 'Erfasst' : 'Vollständig'}</strong></div></div></div><div className="record-progress"><span className="complete"><Icon name="check" />Erfasst</span><i /><span className={phase > 0 ? 'complete' : ''}><Icon name={phase > 0 ? 'check' : 'clock'} />Geprüft</span><i /><span className={phase > 1 ? 'complete' : ''}><Icon name={phase > 1 ? 'check' : 'clock'} />Freigegeben</span></div><div className="order-notice"><Icon name={phase === 2 ? 'check' : 'file'} /><span>{['Stunden, Material und Notizen sind am Auftrag gespeichert.', 'Alle Angaben sind im Büro verfügbar.', 'Der Rapport kann jetzt für die Abrechnung verwendet werden.'][phase]}</span></div></div></div>;
}

export function SummitVisual({ priority = false }: { priority?: boolean }) {
  return <figure className="summit-visual"><img src="/matterhorn-cutout.webp" width="1536" height="1024" alt="Matterhorn in den Walliser Alpen, freigestellt" fetchPriority={priority ? 'high' : undefined} loading={priority ? 'eager' : 'lazy'} /></figure>;
}

const phases = [{ title: 'Vor Ort erfassen.', text: 'Zeit, Material und Notizen direkt zum Auftrag hinzufügen.', gain: 'Kein Rapport aus dem Gedächtnis.' }, { title: 'Im Büro ist alles da.', text: 'Die Angaben stehen zur Prüfung bereit. Ohne Abschreiben.', gain: 'Keine doppelte Erfassung.' }, { title: 'Abrechnen statt nachfragen.', text: 'Der geprüfte Rapport ist vollständig und freigegeben.', gain: 'Keine Suche nach fehlenden Angaben.' }];

export function ProcessStory() {
  const [phase, setPhase] = useState<Phase>(0);
  const [manual, setManual] = useState(false);
  const area = useRef<HTMLElement>(null);
  const anchors = useRef<(HTMLDivElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (manual || !window.matchMedia('(min-width: 901px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const middle = window.innerHeight * .53; let closest = 0; let distance = Infinity; anchors.current.forEach((node, i) => { if (!node) return; const r = node.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - middle); if (d < distance) { closest = i; distance = d; } }); setPhase(closest as Phase); }); };
    window.addEventListener('scroll', update, { passive: true }); update();
    return () => { window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, [manual]);
  return <section className="process-story process-story-connected" id="einblick" ref={area} aria-labelledby="process-title">
    <div className="wrap">
      <div className="process-intro">
        <div><p className="overline">So sieht weniger Aufwand aus</p><h2 id="process-title">Feierabend soll<br /><span>Feierabend sein.</span></h2></div>
        <p>21 Uhr, noch Rapporte. Samstag Rechnungen, Sonntag Offerten. Wir vereinfachen die Abläufe, die Ihnen diese Zeit nehmen.</p>
      </div>
      <div className="process-example-heading"><span>Zum Beispiel: vom Einsatz zur Rechnung.</span><span>Einmal erfassen. Statt abends nacharbeiten.</span></div>
      <div className="story-layout">
        <div className="story-steps">{phases.map((p, i) => <div className={`story-step ${phase === i ? 'active' : ''}`} key={p.title} ref={el => { anchors.current[i] = el; }}>
          <button onClick={() => { setManual(true); setPhase(i as Phase); }} aria-pressed={phase === i} aria-controls="process-screen"><span className="step-number">0{i + 1}</span><span><strong>{p.title}</strong><span>{p.text}</span></span></button>
          <p className="step-gain"><Icon name="check" />{p.gain}</p>
        </div>)}</div>
        <div className="story-sticky">
          <div className="screen-stage" id="process-screen" aria-live={manual ? 'polite' : 'off'}><OrderInterface phase={phase} /></div>
          <div className="story-caption"><span>Individuelle Lösung · Funktionsbeispiel</span><button className="text-link" ref={trigger} onClick={() => dialog.current?.showModal()}>Selbst ausprobieren <Arrow /></button></div>
        </div>
      </div>
    </div>
    <dialog ref={dialog} className="demo-dialog" aria-labelledby="demo-title" onClose={() => trigger.current?.focus()} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-head"><span id="demo-title">Rapport ausprobieren</span><button className="icon-button" aria-label="Demo schliessen" onClick={() => dialog.current?.close()}><Icon name="close" /></button></div>
      <RapportPlayground onDone={() => dialog.current?.close()} />
    </dialog>
  </section>;
}

function RapportPlayground({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Phase>(0); const [hours, setHours] = useState('2.5'); const [note, setNote] = useState('Service ausgeführt. Funktion geprüft.');
  return <div className="playground"><p className="overline">Beispielauftrag · Serviceeinsatz</p>{stage === 0 ? <form onSubmit={e => { e.preventDefault(); setStage(1); }}><h2>Der Einsatz ist erledigt.</h2><label>Arbeitszeit in Stunden<input type="number" min="0.25" max="24" step="0.25" value={hours} required onChange={e => setHours(e.target.value)} /></label><label>Was wurde gemacht?<textarea value={note} required maxLength={1000} rows={3} onChange={e => setNote(e.target.value)} /></label><button className="button" type="submit">Zur Prüfung <Arrow /></button></form> : stage === 1 ? <div><h2>Alles da. Einmal prüfen.</h2><dl className="review-data"><div><dt>Arbeitszeit</dt><dd>{Number(hours).toLocaleString('de-CH')} Stunden</dd></div><div><dt>Dokumentation</dt><dd>{note}</dd></div></dl><div className="form-actions"><button className="text-link" onClick={() => setStage(0)}>Zurück zur Erfassung</button><button className="button" onClick={() => setStage(2)}>Rapport freigeben <Icon name="check" /></button></div></div> : <div className="demo-success" role="status"><span className="success-icon"><Icon name="check" /></span><h2>Bereit für die Rechnung.</h2><p>{Number(hours).toLocaleString('de-CH')} Stunden sind dokumentiert. Die Angaben müssen nicht erneut übertragen werden.</p><a className="button" href="/#anfrage" onClick={onDone}>So eine Lösung besprechen <Arrow /></a><button className="text-link" onClick={() => { setStage(0); setHours('2.5'); setNote('Service ausgeführt. Funktion geprüft.'); }}>Neu ausprobieren</button></div>}<p className="form-note">Demonstration mit Beispieldaten. Ihre Eingaben werden nicht gespeichert oder übermittelt.</p></div>;
}

function BusinessPanel({ world }: { world: number }) {
  const item = businessWorlds[world];
  return <><div className="world-copy"><p className="overline">{item.fullName}</p><h3>{item.heading}</h3><p>{item.description}</p><a href={`/branchen/${item.slug}`} className="text-link">Möglichkeiten entdecken <Arrow /></a></div><BusinessFlow world={world} /></>;
}

export function BusinessSelector() {
  const [selection, setSelection] = useState<{ world: number; previous: number | null; cycle: number; direction: number }>({ world: 0, previous: null, cycle: 0, direction: 1 });
  useEffect(() => {
    if (selection.previous === null) return;
    const timer = window.setTimeout(() => setSelection(current => ({ ...current, previous: null })), 720);
    return () => window.clearTimeout(timer);
  }, [selection.cycle, selection.previous]);
  const choose = (next: number) => setSelection(current => current.world === next ? current : { world: next, previous: current.world, cycle: current.cycle + 1, direction: next > current.world ? 1 : -1 });
  return <><div className="section-heading" data-enter><p className="overline">Für Ihren Betrieb</p><h2>Wo Ihr Betrieb<br />Zeit gewinnen kann.</h2></div><div className="world-tabs" role="group" aria-label="Unternehmenswelt auswählen">{businessWorlds.map((w, i) => <button key={w.slug} aria-pressed={selection.world === i} aria-controls="world-content" onClick={() => choose(i)}><Icon name={w.icon} />{w.name}</button>)}</div>
    <div className={`world-deck world-tone-${selection.world}`} id="world-content" style={{ '--switch-direction': selection.direction } as CSSProperties}>
      {selection.previous !== null && <div className="world-content world-leaving" key={`out-${selection.cycle}`} aria-hidden="true" inert><BusinessPanel world={selection.previous} /></div>}
      <div className={`world-content ${selection.cycle ? 'world-arriving' : ''}`} key={selection.cycle}><BusinessPanel world={selection.world} /></div>
    </div><p className="sr-only" aria-live="polite" aria-atomic="true">{businessWorlds[selection.world].fullName}: {businessWorlds[selection.world].heading}</p>
  </>;
}

export function SavingsExample() {
  const [people, setPeople] = useState(8);
  const [minutes, setMinutes] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [open, setOpen] = useState(false);
  const annualHours = people * minutes * 220 / 60;
  // Keep the Swiss thousands separator identical during server and browser rendering.
  const formatAmount = (value: number) => Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’');
  const hours = formatAmount(annualHours);
  const annualValue = formatAmount(annualHours * hourlyRate);

  return <section className="savings-section"><div className="wrap savings-grid">
    <div>
      <p className="overline">Kleine Umwege. Grosse Summe.</p>
      <h2>Was sich jeden Tag<br />aufsummiert.</h2>
      <p>{people} Mitarbeitende. Je {minutes} Minuten weniger Routinearbeit pro Arbeitstag.</p>
      <button className="text-link" aria-expanded={open} aria-controls="savings-inputs" onClick={() => setOpen(!open)}>
        {open ? 'Annahmen schliessen' : 'Mit Ihrem Betrieb rechnen'} <Icon name={open ? 'close' : 'plus'} />
      </button>
      <div className="savings-inputs" id="savings-inputs" hidden={!open}>
        <label>Mitarbeitende <output>{people}</output><input aria-label="Anzahl Mitarbeitende" type="range" min="1" max="50" value={people} onChange={e => setPeople(Number(e.target.value))} /></label>
        <label>Minuten pro Tag <output>{minutes}</output><input aria-label="Eingesparte Minuten pro Arbeitstag" type="range" min="5" max="60" step="5" value={minutes} onChange={e => setMinutes(Number(e.target.value))} /></label>
        <label>Stundensatz <output>CHF {hourlyRate}</output><input aria-label="Angenommener Stundensatz in CHF" type="range" min="30" max="200" step="5" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} /></label>
        <p className="savings-assumption">Auf Basis von 220 Arbeitstagen pro Jahr.</p>
      </div>
    </div>
    <div className="savings-result" aria-live="polite" aria-atomic="true">
      <span>{hours}</span><h3>Stunden im Jahr.<br />Für das, was zählt.</h3>
      <p className="savings-value">Das entspricht <strong>CHF {annualValue}</strong> pro Jahr bei einem Stundensatz von CHF {hourlyRate}.</p>
    </div>
  </div></section>;
}

export function Enquiry({ initialTopic }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic || ''); const [draft, setDraft] = useState(''); const [copied, setCopied] = useState(false); const [copyError, setCopyError] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); setDraft(`Guten Tag Maurus\n\n${data.get('message')}\n\n${topic ? `Thema: ${topic}\n` : ''}Name: ${data.get('name')}\nE-Mail: ${data.get('email')}`); setCopied(false); setCopyError(false); };
  return <section className="enquiry-section" id="anfrage"><div className="wrap enquiry-grid"><div className="enquiry-copy"><p className="overline">Bringen wir Ihren Betrieb weiter.</p><h2>Was kostet Sie<br />zu viel Zeit?</h2><p>Erzählen Sie mir davon. Wir besprechen, was sich ändern lässt. Danach erhalten Sie ein Angebot mit klarem Umfang und Kosten.</p><a className="contact-mail" href={`mailto:${company.email}`}>{company.email}</a><a className="contact-phone" href={company.phoneHref}>{company.phone}</a><p className="contact-person">Ihr Ansprechpartner: {company.contactName} · Inhaber</p><address className="contact-business"><strong>{company.name}</strong><br />{company.street}<br />{company.postalCode} {company.locality}, {company.country}</address><a className="contact-company-link" href="/impressum">Firmen- und Registerangaben <Arrow /></a></div><form className="enquiry-form" onSubmit={submit} onChange={() => setDraft('')}><label>Worum geht es?<select value={topic} onChange={e => setTopic(e.target.value)}><option value="">Bitte auswählen (optional)</option>{['Abläufe verbessern', 'Einen einzelnen Prozess vereinfachen', 'Apps & IT-Projekte', 'Websites & Betrieb', 'Betrieb & Betreuung', 'Ein anderes Vorhaben'].map(value => <option key={value} value={value}>{value}</option>)}</select></label><div className="form-pair"><label>Ihr Name<input name="name" autoComplete="name" required maxLength={100} /></label><label>E-Mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label></div><label>Was möchten Sie verändern?<textarea name="message" required minLength={10} maxLength={3000} rows={3} placeholder="Ein konkretes Problem oder eine Idee genügt." /></label><button className="button" type="submit">Anfrage vorbereiten <Arrow /></button><p className="form-note">Öffnet im nächsten Schritt einen Entwurf in Ihrem E-Mail-Programm. <a href="/datenschutz">Datenschutz</a></p>{draft && <div className="draft-ready" role="status"><strong>Ihre Anfrage ist vorbereitet.</strong><p>Öffnen Sie den Entwurf und senden Sie ihn in Ihrem E-Mail-Programm ab.</p><a className="button" href={`mailto:${company.email}?subject=${encodeURIComponent('Anfrage: '+(topic || 'Mein Vorhaben'))}&body=${encodeURIComponent(draft)}`}>E-Mail-Entwurf öffnen <Arrow /></a><button type="button" className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(draft); setCopied(true); setCopyError(false); } catch { setCopyError(true); } }}>{copied ? 'Anfragetext kopiert' : 'Text kopieren'}</button>{copyError && <div><p>Kopieren ist in diesem Browser nicht möglich. Sie können den Text hier markieren:</p><textarea readOnly value={draft} aria-label="Anfragetext zum Kopieren" rows={6} /></div>}</div>}</form></div></section>;
}
