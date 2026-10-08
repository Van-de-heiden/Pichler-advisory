"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Enquiry } from '../../../lib/enquiry';
import './confirmation.css';

type BookingView = { id: string; enquiry: Enquiry; status: 'pending' | 'creating' | 'uncertain' | 'confirmed'; configured: boolean; selected?: number; eventId?: string; meetingUrl?: string | null; calendarName?: string; error?: string };
const formatSlot = (slot: { date: string; time: string }) => `${slot.date.split('-').reverse().join('.')} · ${slot.time} Uhr`;

export function BookingConfirmation() {
  const [booking, setBooking] = useState<BookingView | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const credentials = useRef({ id: '', token: '' });
  const inflight = useRef(false);
  const result = useRef<HTMLDivElement>(null);
  async function api(action: 'details' | 'confirm', body: object = {}) {
    const response = await fetch(`/api/bookings/${credentials.current.id}/${action}`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-booking-token': credentials.current.token }, body: JSON.stringify(body), cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Die Anfrage konnte nicht verarbeitet werden.');
    return data as BookingView;
  }
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    credentials.current = { id: fragment.get('id') || '', token: fragment.get('token') || '' };
    if (!credentials.current.id || !credentials.current.token) { setError('Bitte den persönlichen Bestätigungslink aus der Anfrage-Mail öffnen.'); setBusy(false); return; }
    let active = true;
    api('details').then(data => { if (active) setBooking(data); }).catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Die Anfrage konnte nicht geladen werden.'); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  async function confirm() {
    if (selected === null || inflight.current) return;
    inflight.current = true; setBusy(true); setError('');
    try { const data = await api('confirm', { selected }); setBooking(data); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Die Bestätigung konnte nicht geprüft werden. Bitte die Seite neu öffnen.'); }
    finally { inflight.current = false; setBusy(false); requestAnimationFrame(() => result.current?.focus()); }
  }

  return <main id="inhalt" className="booking-page"><Link href="/" className="booking-wordmark">Pichler Advisory</Link><section className="booking-panel" aria-busy={busy}>
    <p className="overline">Persönliche Terminbestätigung</p><h1>{booking?.status === 'confirmed' ? 'Der Termin steht.' : 'Welche Zeit passt dir?'}</h1>
    {busy && !booking && <p role="status">Anfrage wird geladen …</p>}
    {error && <div className="booking-alert" role="alert" ref={result} tabIndex={-1}>{error}</div>}
    {booking && <>
      <div className="booking-customer"><strong>{booking.enquiry.name}</strong>{booking.enquiry.company && <span>{booking.enquiry.company}</span>}<a href={`mailto:${booking.enquiry.email}`}>{booking.enquiry.email}</a>{booking.enquiry.phone && <span>{booking.enquiry.phone}</span>}<p>{booking.enquiry.format === 'video' ? 'Videogespräch mit kMeet' : 'Telefon · Du rufst den Kunden an'} · 30 Minuten</p></div>
      {booking.enquiry.topic && <p className="booking-topic">{booking.enquiry.topic}</p>}
      {booking.enquiry.message && <p className="booking-message">{booking.enquiry.message}</p>}
      {booking.status === 'confirmed' ? <div className="booking-result" ref={result} tabIndex={-1} role="status"><h2>{formatSlot(booking.enquiry.slots[booking.selected!])}</h2><p>Schweizer Zeit · 30 Minuten</p><p>Der Termin wurde in deinem Kalender „{booking.calendarName}“ erstellt. Infomaniak wurde mit dem Versand der Einladung an {booking.enquiry.email} beauftragt.</p>{booking.meetingUrl ? <a className="button" href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">kMeet öffnen</a> : <p><strong>Du rufst an: {booking.enquiry.phone}</strong></p>}<a className="booking-calendar-link" href="https://ksuite.infomaniak.com/calendar" target="_blank" rel="noopener noreferrer">Im Infomaniak-Kalender ansehen</a><p className="booking-secondary">Änderungen oder Absagen anschliessend direkt im Kalender vornehmen und die Teilnehmer benachrichtigen.</p></div>
      : booking.status === 'uncertain' || booking.status === 'creating' ? <div className="booking-alert" ref={result} tabIndex={-1} role="alert"><strong>Kalender bitte prüfen</strong><p>{booking.error || 'Die Erstellung konnte nicht abschliessend geprüft werden. Zur Vermeidung eines doppelten Termins wird kein weiterer Eintrag erstellt.'}</p><a href="https://ksuite.infomaniak.com/calendar" target="_blank" rel="noopener noreferrer">Infomaniak-Kalender öffnen</a></div>
      : <form onSubmit={event => { event.preventDefault(); void confirm(); }}>
        <fieldset disabled={busy || !booking.configured} className="booking-slots"><legend>Wunschzeiten · Schweizer Zeit</legend>{booking.enquiry.slots.map((slot, index) => <label key={index}><input type="radio" name="slot" value={index} checked={selected === index} required onChange={() => setSelected(index)} /><span>{formatSlot(slot)}</span></label>)}</fieldset>
        {!booking.configured && <p className="booking-alert">Die Infomaniak-Kalenderverbindung muss vor der ersten Bestätigung eingerichtet werden. Es wurde noch keine Einladung gesendet.</p>}
        <p className="booking-action-note">Mit deiner Bestätigung werden der Kalendereintrag und die Einladung an <strong>{booking.enquiry.email}</strong> erstellt.{booking.enquiry.format === 'video' ? ' Der persönliche kMeet-Link ist direkt im Termin und in der Einladung enthalten.' : ` Der Kunde erfährt, dass du ihn unter ${booking.enquiry.phone} anrufst.`}</p>
        <button className="button" type="submit" disabled={busy || selected === null || !booking.configured}>{busy ? 'Kalender wird aktualisiert …' : 'Termin bestätigen & Einladung senden'}</button>
      </form>}
      <p className="booking-reference">Referenz: {booking.id}</p>
    </>}
  </section><p className="booking-private-note">Dieser persönliche Link gibt Zugriff auf die Anfrage. Bitte nicht weiterleiten.</p></main>;
}
