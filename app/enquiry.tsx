"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { company } from './company';
import './enquiry.css';
import { Icon } from './ui';
import { zurichDate, type Slot } from '../lib/enquiry';

export function Enquiry({ initialTopic }: { initialTopic?: string }) {
  const [kind, setKind] = useState<'meeting' | 'message'>('meeting');
  const [topic, setTopic] = useState(initialTopic || '');
  const [format, setFormat] = useState<'video' | 'phone'>('video');
  const [slots, setSlots] = useState<Slot[]>([{ date: '', time: '' }, { date: '', time: '' }]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [bounds, setBounds] = useState({ min: '', max: '' });
  const result = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const meeting = kind === 'meeting';
  useEffect(() => {
    // Resolve date limits after hydration: a cached/server render may be from a previous day.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBounds({ min: zurichDate(), max: zurichDate(new Date(Date.now() + 179 * 86400000)) });
  }, []);
  useEffect(() => { if (status === 'success' || status === 'error') result.current?.focus(); }, [status]);
  const updateSlot = (index: number, key: keyof Slot, value: string) => setSlots(current => current.map((slot, i) => i === index ? { ...slot, [key]: value } : slot));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = new FormData(event.currentTarget);
    inFlight.current = true; setStatus('sending'); setError('');
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, topic, format, slots: meeting ? slots : [], name: data.get('name'), email: data.get('email'), company: data.get('company'), phone: data.get('phone'), message: data.get('message'), website: data.get('website'), privacy: data.get('privacy') === 'on' }),
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error(typeof body.error === 'string' ? body.error : 'Der Versand konnte nicht bestätigt werden. Bitte kontaktieren Sie mich direkt.');
      setReference(body.reference); setStatus('success');
    } catch (cause) {
      setError(cause instanceof Error && !(cause instanceof TypeError) ? cause.message : 'Der Versand konnte nicht bestätigt werden. Ihre Eingaben bleiben erhalten. Bitte prüfen Sie Ihre Verbindung oder kontaktieren Sie mich direkt.');
      setStatus('error');
    } finally { inFlight.current = false; }
  }

  return <section className="enquiry-section" id="anfrage" aria-labelledby="enquiry-title"><div className="wrap enquiry-grid">
    <div className="enquiry-copy">
      <p className="overline">Ihr erster Schritt. Ohne Verpflichtung.</p>
      <h2 id="enquiry-title">Ein Gespräch.<br /><span>Mehr Klarheit.</span></h2>
      <p>Was bremst Ihren Betrieb? Wir besprechen Ihre Situation und schauen, wo sich etwas verbessern lässt. Persönlich mit mir, ohne Vorbereitung Ihrerseits.</p>
      <div className="meeting-promise"><span><Icon name="check" />Kostenlos</span><span><Icon name="check" />Unverbindlich</span><span><Icon name="clock" />Ca. 30 Minuten</span></div>
      <ol className="meeting-steps"><li><span>01</span><div><strong>Wunschzeiten vorschlagen</strong><p>Zwei Termine reichen. Eine dritte Option ist willkommen.</p></div></li><li><span>02</span><div><strong>Persönliche Bestätigung erhalten</strong><p>Nach meiner Bestätigung erhalten Sie eine Kalendereinladung. Bei Video ist der kMeet-Link direkt dabei.</p></div></li><li><span>03</span><div><strong>In Ruhe kennenlernen</strong><p>Wir klären Ihr Anliegen. Sie entscheiden danach, ob Sie weitergehen möchten.</p></div></li></ol>
      <div className="enquiry-person"><strong>{company.contactName}</strong><span>Inhaber · Ihr direkter Ansprechpartner</span></div>
      <a className="contact-mail" href={`mailto:${company.email}`}>{company.email}</a><a className="contact-phone" href={company.phoneHref}>{company.phone}</a>
      <a className="contact-company-link" href="/impressum">Firmen- und Registerangaben</a>
    </div>
    <div className="enquiry-card">
      {status === 'success' ? <div ref={result} tabIndex={-1} className="enquiry-success" role="status"><span className="success-icon"><Icon name="check" /></span><p className="overline">Vielen Dank für Ihr Vertrauen</p><h3>{meeting ? 'Ihre Terminanfrage ist gesendet.' : 'Ihre Nachricht ist gesendet.'}</h3><p>{meeting ? 'Nach meiner Bestätigung erhalten Sie Ihre Kalendereinladung per E-Mail. Bei Video enthält sie den kMeet-Link; bei Telefon rufe ich Sie zur bestätigten Zeit an.' : 'Ich melde mich persönlich bei Ihnen über die angegebene E-Mail-Adresse.'}</p>{meeting && <div className="submitted-slots"><strong>Ihre Wunschzeiten · Schweizer Zeit</strong>{slots.map((slot, i) => <span key={i}>{slot.date.split('-').reverse().join('.')} · {slot.time} Uhr</span>)}</div>}<p className="form-note">{meeting ? 'Das Erstgespräch ist kostenlos und unverbindlich.' : 'Ihre Anfrage ist unverbindlich.'}</p><p className="enquiry-reference">Referenz: {reference}</p></div> : <>
        <div className="enquiry-choice" role="group" aria-label="Art der Kontaktaufnahme"><button type="button" aria-pressed={meeting} disabled={status === 'sending'} onClick={() => { setKind('meeting'); setStatus('idle'); }}>Erstgespräch anfragen</button><button type="button" aria-pressed={!meeting} disabled={status === 'sending'} onClick={() => { setKind('message'); setStatus('idle'); }}>Nachricht senden</button></div>
        <div className="enquiry-form-heading"><h3>{meeting ? 'Wann passt es Ihnen?' : 'Was haben Sie vor?'}</h3><p>{meeting ? 'Schlagen Sie zwei oder drei Zeiten vor. Ich bestätige Ihren Termin persönlich.' : 'Ein konkretes Problem oder eine Idee genügt.'}</p></div>
        <form className="enquiry-form" onSubmit={submit} aria-busy={status === 'sending'}>
          <fieldset className="enquiry-fields" disabled={status === 'sending'}>
            {meeting && <>
              <fieldset className="slot-picker"><legend>Ihre Wunschtermine <span>· Schweizer Zeit</span></legend>{slots.map((slot, i) => <div className="slot-row" key={i}><span className="slot-number" aria-hidden="true">0{i + 1}</span><label>Datum {i + 1}<input type="date" name={`date-${i}`} required value={slot.date} min={bounds.min} max={bounds.max} onChange={e => updateSlot(i, 'date', e.target.value)} /></label><label>Uhrzeit {i + 1}<input type="time" name={`time-${i}`} required step="900" value={slot.time} onChange={e => updateSlot(i, 'time', e.target.value)} /></label>{i === 2 && <button type="button" className="remove-slot" aria-label="Dritten Wunschtermin entfernen" onClick={() => setSlots(current => current.slice(0, 2))}><Icon name="close" />Entfernen</button>}</div>)}{slots.length < 3 && <button type="button" className="add-slot" onClick={() => setSlots(current => [...current, { date: '', time: '' }])}>+ Dritte Wunschzeit hinzufügen</button>}</fieldset>
              <label>Wie möchten Sie sprechen?<select name="format" value={format} onChange={e => setFormat(e.target.value as 'video' | 'phone')}><option value="video">Video · Link folgt mit der Einladung</option><option value="phone">Telefon · Ich rufe Sie an</option></select></label>
            </>}
            <div className="form-pair"><label>Ihr Name *<input name="name" autoComplete="name" required maxLength={100} /></label><label>E-Mail *<input name="email" type="email" autoComplete="email" required maxLength={254} /></label></div>
            <div className="form-pair"><label><span>Unternehmen <span className="optional">(optional)</span></span><input name="company" autoComplete="organization" maxLength={150} /></label><label><span>Telefon {meeting && format === 'phone' ? '*' : <span className="optional">(optional)</span>}</span><input name="phone" type="tel" autoComplete="tel" required={meeting && format === 'phone'} maxLength={60} /></label></div>
            <label><span>Worum geht es? <span className="optional">(optional)</span></span><select name="topic" value={topic} onChange={e => setTopic(e.target.value)}><option value="">Bitte auswählen</option>{['Abläufe verbessern', 'Einen einzelnen Prozess vereinfachen', 'Apps & IT-Projekte', 'Websites & Betrieb', 'Betrieb & Betreuung', 'Ein anderes Vorhaben'].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
            <label>{meeting ? 'Was sollte ich vorab wissen? (optional)' : 'Ihre Nachricht *'}<textarea name="message" required={!meeting} minLength={meeting ? undefined : 10} maxLength={3000} rows={3} placeholder="Ein konkretes Problem oder eine Idee genügt." /></label>
            <div className="enquiry-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <label className="enquiry-consent"><input name="privacy" type="checkbox" required /><span>Ich habe die <a href="/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> zur Kenntnis genommen. Meine Angaben werden zur Bearbeitung dieser Anfrage übermittelt.</span></label>
            <button className="button enquiry-submit" type="submit">{status === 'sending' ? 'Wird gesendet …' : meeting ? 'Kostenloses Erstgespräch anfragen' : 'Nachricht senden'}</button>
          </fieldset>
          <p className="form-note">{meeting ? 'Kostenlos und unverbindlich. Der Termin gilt erst nach meiner persönlichen Bestätigung. Es entsteht kein kostenpflichtiger Auftrag.' : 'Ihre Nachricht wird direkt an Pichler Advisory gesendet.'}</p>
          {status === 'error' && <div ref={result} tabIndex={-1} role="alert" className="enquiry-error"><strong>Versand nicht bestätigt</strong><p>{error}</p><a href={`mailto:${company.email}`}>{company.email}</a><a href={company.phoneHref}>{company.phone}</a></div>}
          <noscript><p>Bitte aktivieren Sie JavaScript, um das Formular zu senden, oder kontaktieren Sie mich unter {company.email}.</p></noscript>
        </form>
      </>}
    </div>
  </div></section>;
}
