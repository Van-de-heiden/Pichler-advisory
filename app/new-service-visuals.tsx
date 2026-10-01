"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { OrderInterface } from './new-site';
import { Arrow, Icon } from './ui';

export function ServiceExample({ slug }: { slug: string }) {
  const [choice, setChoice] = useState(0);
  return <div className={`service-example example-${slug}`}>
    {slug === 'prozesse-automatisierung' ? <><div className="example-toolbar"><span>Ein Auftrag. Zwei mögliche Wege.</span><div className="segmented" role="group" aria-label="Ablauf vergleichen">{['Heute', 'Möglich'].map((s,i) => <button key={s} aria-pressed={choice===i} onClick={() => setChoice(i)}>{s}</button>)}</div></div><div className="workflow-example" key={choice}><h3>{choice ? 'Die Information arbeitet weiter.' : 'Die gleiche Arbeit. Immer wieder.'}</h3><div className="workflow-list">{(choice ? [['Einmal erfassen','Kunde, Auftrag und Leistung an einem Ort.'],['Gemeinsam bearbeiten','Ihr Team hat den aktuellen Stand.'],['Direkt weiterverwenden','Geprüfte Angaben für die Abrechnung.']] : [['E-Mail öffnen','Auftragsdetails in eine Liste übertragen.'],['Angaben zusammensuchen','Nachfragen und Notizen ergänzen.'],['Noch einmal eingeben','Für die Abrechnung erneut übertragen.']]).map(([title,text],i) => <div key={title}><span className={choice ? 'workflow-icon good' : 'workflow-icon'}><Icon name={choice ? 'check' : i===1?'clock':'file'} /></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></div><p className="example-caption">Illustrativer Ablauf. Die passende Umsetzung richtet sich nach Ihren Systemen.</p></> : slug === 'apps-it-projekte' ? <><div className="example-toolbar"><span>Digitale Rapporterfassung</span><span className="demo-label">Demo</span></div><OrderInterface phase={choice as 0|1|2} /><div className="example-controls" role="group" aria-label="Schritt der Beispielanwendung">{['Erfassen','Prüfen','Freigeben'].map((s,i)=><button key={s} aria-pressed={choice===i} onClick={()=>setChoice(i)}><span>0{i+1}</span>{s}</button>)}</div></> : slug === 'websites' ? <WebsiteStack /> : <><div className="example-toolbar"><span>Was eine Betreuung umfassen kann</span><Icon name="server" /></div><div className="care-example"><h3>Ein Ansprechpartner.<br />Ein klarer Umfang.</h3>{[['Betrieb','Hosting und technische Grundlagen'],['Pflege','Updates und vereinbarte Änderungen'],['Weiterentwicklung','Neue Anforderungen gemeinsam planen']].map(([h,p])=><div key={h}><Icon name="check" /><div><strong>{h}</strong><p>{p}</p></div></div>)}<a className="text-link" href="/?leistung=betrieb-betreuung#anfrage">Betreuung besprechen <Arrow /></a></div><p className="example-caption">Der konkrete Leistungsumfang wird vor dem Start vereinbart.</p></>}
  </div>;
}

function WebsiteStack() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) return;
    element.classList.add('is-pending');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.classList.remove('is-pending'); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className="website-showcase">
    <div className="example-toolbar"><span>Ein Auftritt mit Charakter.</span><span className="demo-label">Designkonzepte</span></div>
    <div className="website-stack" role="img" aria-label="Drei gestapelte Website-Designkonzepte für Architektur, Gartenbau und Beratung">
      <div className="concept-page concept-garden" aria-hidden="true">
        <div className="concept-browser"><i /><i /><i /><span>atelier-gruen.ch</span></div>
        <div className="concept-nav"><b>atelier grün.</b><span>Gärten &nbsp; Philosophie &nbsp; Kontakt</span></div>
        <div className="garden-hero"><span>LEBENSRÄUME IM FREIEN</span><h3>Ein Garten.<br />Ihr Rückzugsort.</h3><img src="/sme-environment.webp" alt="" /><b>Natürlich durchdacht.</b></div>
        <div className="concept-bottom"><span>Von der ersten Idee<br />bis zum letzten Blatt.</span><p>Gestaltung &nbsp; Pflege &nbsp; Begleitung</p></div>
      </div>
      <div className="concept-page concept-advisory" aria-hidden="true">
        <div className="concept-browser"><i /><i /><i /><span>pichler-advisory.ch</span></div>
        <div className="concept-nav"><b>Pichler Advisory</b><span>Beratung &nbsp; Umsetzung &nbsp; Kontakt</span></div>
        <div className="advisory-concept-hero"><span>BERATUNG & UMSETZUNG</span><h3>Mehr Raum<br />für das Wesentliche.</h3><img src="/matterhorn-cutout.webp" alt="" /></div>
        <div className="concept-bottom"><span>Klarheit schaffen.<br />Wirksam umsetzen.</span><p>Prozesse &nbsp; Apps &nbsp; Websites</p></div>
      </div>
      <div className="concept-page concept-architecture" aria-hidden="true">
        <div className="concept-browser"><i /><i /><i /><span>form-architektur.ch</span></div>
        <div className="concept-nav"><b>FORM<span>ARCHITEKTUR</span></b><span>Projekte &nbsp; Studio &nbsp; Kontakt</span></div>
        <div className="architecture-hero"><img src="/process-workshop.webp" alt="" /><div><span>ARCHITEKTUR MIT HALTUNG</span><h3>Räume, die<br />bleiben.</h3><p>Präzise geplant. Bewusst gestaltet.</p></div><b>01 / 03</b></div>
        <div className="concept-bottom"><span>Form folgt<br />Überzeugung.</span><p>Ausgewählte Arbeiten &nbsp; 2026</p></div>
      </div>
    </div>
    <p className="website-concept-note">Individuell gestaltet. Auf Ihr Unternehmen abgestimmt.</p>
  </div>;
}
