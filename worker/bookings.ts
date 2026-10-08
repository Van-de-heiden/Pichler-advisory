import { isMeetingStartTime, slotInstant, type Enquiry } from '../lib/enquiry.ts';
import { CalendarError, InfomaniakCalendar, createMeetingUrl, type CalendarEnv } from './calendar.ts';

type Storage = {
  get<T>(key: string): Promise<T | undefined>; put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<boolean>; list<T>(options: { prefix: string }): Promise<Map<string, T>>;
  getAlarm(): Promise<number | null>; setAlarm(time: number): Promise<void>;
};
type State = { storage: Storage; blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T> };
export type BookingNamespace = { idFromName(name: string): unknown; get(id: unknown): { fetch(request: Request): Promise<Response> } };
export type BookingEnv = CalendarEnv & { BOOKINGS?: BookingNamespace };
export type Booking = {
  id: string; tokenHash: string; enquiry: Enquiry; createdAt: number; expiresAt: number;
  status: 'pending' | 'creating' | 'confirmed' | 'uncertain'; selected?: number;
  calendarId?: string; calendarName?: string; eventId?: string; meetingUrl?: string | null; error?: string;
};
const DAY = 86400000;
const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
const validToken = (token: string) => /^[0-9a-f]{64}$/.test(token);
const response = (data: object, status = 200) => Response.json(data, { status, headers: { 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-content-type-options': 'nosniff' } });
const hash = async (token: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))), n => n.toString(16).padStart(2, '0')).join('');
const stub = (env: BookingEnv) => env.BOOKINGS!.get(env.BOOKINGS!.idFromName('pichler-advisory-booking-desk'));

export async function registerBooking(env: BookingEnv, enquiry: Enquiry, id: string): Promise<string> {
  if (!env.BOOKINGS) throw new Error('Booking storage missing');
  const token = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
  const res = await stub(env).fetch(new Request('https://booking.internal/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, tokenHash: await hash(token), enquiry }) }));
  if (!res.ok) throw new Error('Could not store booking');
  // Fragment is only read by the approval page, never sent in URL/access logs.
  return `https://pichler-advisory.ch/termine/bestaetigen#id=${id}&token=${token}`;
}

export async function handleBooking(request: Request, env: BookingEnv): Promise<Response> {
  if (request.method !== 'POST') return response({ error: 'Nur POST ist erlaubt.' }, 405);
  const url = new URL(request.url);
  const route = url.pathname.match(/^\/api\/bookings\/([^/]+)\/(details|confirm)$/);
  if (!route || !validId(route[1])) return response({ error: 'Anfrage nicht gefunden.' }, 404);
  if (request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return response({ error: 'Bitte den Bestätigungslink in der Anfrage-Mail öffnen.' }, 403);
  const token = request.headers.get('x-booking-token') || '';
  if (!validToken(token)) return response({ error: 'Der Bestätigungslink ist ungültig.' }, 403);
  if (!env.BOOKINGS) return response({ error: 'Die Terminverwaltung ist noch nicht eingerichtet.' }, 503);
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return response({ error: 'Ungültiges Anfrageformat.' }, 415);
  // These owner requests contain only a slot index; bound the stream too.
  let bytes = 0; const chunks: Uint8Array[] = []; const reader = request.body?.getReader();
  if (reader) {
    try { while (true) { const part = await reader.read(); if (part.done) break; bytes += part.value.length; if (bytes > 1024) { await reader.cancel(); return response({ error: 'Anfrage zu lang.' }, 413); } chunks.push(part.value); } }
    finally { reader.releaseLock(); }
  }
  const data = new Uint8Array(bytes); let offset = 0; for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.length; }
  let body: unknown;
  try { body = JSON.parse(new TextDecoder().decode(data) || '{}'); } catch { return response({ error: 'Ungültige Angaben.' }, 400); }
  return stub(env).fetch(new Request(`https://booking.internal/${route[1]}/${route[2]}`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-booking-token': token }, body: JSON.stringify(body) }));
}

// One coordinator serializes confirmations across all website requests, so two
// concurrent selections cannot both pass the same calendar availability check.
export class BookingDesk {
  state: State; env: BookingEnv; calendar: InfomaniakCalendar;
  constructor(state: State, env: BookingEnv) { this.state = state; this.env = env; this.calendar = new InfomaniakCalendar(env); }

  fetch(request: Request): Promise<Response> {
    return this.state.blockConcurrencyWhile(async () => {
      try { return await this.handle(request); }
      catch (error) { return response({ error: error instanceof CalendarError ? error.message : 'Die Terminverwaltung ist momentan nicht erreichbar. Bitte später erneut öffnen.' }, 503); }
    });
  }

  async handle(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (request.method !== 'POST') return response({ error: 'Nicht erlaubt.' }, 405);
    if (path === '/create') {
      const input = await request.json() as { id: string; tokenHash: string; enquiry: Enquiry };
      if (!validId(input.id) || !validToken(input.tokenHash) || input.enquiry.kind !== 'meeting') return response({ error: 'Ungültig.' }, 400);
      if (await this.state.storage.get('booking:' + input.id)) return response({ error: 'Bereits vorhanden.' }, 409);
      const booking: Booking = { ...input, createdAt: Date.now(), expiresAt: Date.now() + 30 * DAY, status: 'pending' };
      await this.state.storage.put('booking:' + input.id, booking);
      if (!await this.state.storage.getAlarm()) await this.state.storage.setAlarm(Date.now() + DAY);
      return response({ ok: true });
    }
    const route = path.match(/^\/([^/]+)\/(details|confirm)$/);
    if (!route || !validId(route[1])) return response({ error: 'Nicht gefunden.' }, 404);
    const key = 'booking:' + route[1];
    const booking = await this.state.storage.get<Booking>(key);
    const token = request.headers.get('x-booking-token') || '';
    if (!booking || !validToken(token) || await hash(token) !== booking.tokenHash) return response({ error: 'Der Bestätigungslink ist ungültig oder abgelaufen.' }, 403);
    if (booking.expiresAt < Date.now()) return response({ error: 'Dieser Bestätigungslink ist abgelaufen. Bitte direkt Kontakt aufnehmen.' }, 410);
    const view = () => ({ id: booking.id, enquiry: booking.enquiry, status: booking.status, selected: booking.selected, calendarName: booking.calendarName, eventId: booking.eventId, meetingUrl: booking.meetingUrl, error: booking.error, configured: !!this.env.INFOMANIAK_CALENDAR_TOKEN });
    if (route[2] === 'details') return response(view());
    if (booking.status === 'confirmed') return response(view());
    if (booking.status === 'creating' || booking.status === 'uncertain') return response({ ...view(), status: 'uncertain', error: 'Die Kalendererstellung konnte nicht eindeutig bestätigt werden. Bitte den Infomaniak-Kalender anhand der Buchungsreferenz prüfen. Es wird kein zweiter Termin automatisch erstellt.' });
    const input = await request.json() as { selected?: unknown };
    if (!Number.isInteger(input.selected) || Number(input.selected) < 0 || Number(input.selected) >= booking.enquiry.slots.length) return response({ error: 'Bitte einen der Wunschtermine auswählen.' }, 400);
    const selected = Number(input.selected), slot = booking.enquiry.slots[selected];
    if (!isMeetingStartTime(slot.time) || !Number.isFinite(slotInstant(slot))) return response({ error: 'Bitte eine gültige Wunschzeit zwischen 07:00 und 18:30 Uhr im 15-Minuten-Takt auswählen (Schweizer Zeit).' }, 409);
    if (slotInstant(slot) <= Date.now()) return response({ error: 'Dieser Wunschtermin liegt bereits in der Vergangenheit.' }, 409);
    const calendar = await this.calendar.target();
    if (!await this.calendar.available(calendar.id, slot)) return response({ error: `Im Kalender „${calendar.name}“ liegt zu dieser Zeit bereits ein Termin. Bitte eine andere Wunschzeit wählen.` }, 409);
    booking.selected = selected; booking.calendarId = calendar.id; booking.calendarName = calendar.name;
    booking.meetingUrl = booking.enquiry.format === 'video' ? createMeetingUrl() : null;
    booking.status = 'creating';
    await this.state.storage.put(key, booking);
    try {
      booking.eventId = await this.calendar.create(calendar, booking.enquiry, slot, booking.id, booking.meetingUrl);
      booking.status = 'confirmed'; booking.error = undefined;
      booking.expiresAt = slotInstant(slot) + 30 * 60000 + 30 * DAY;
    } catch (error) {
      booking.status = error instanceof CalendarError && !error.uncertain ? 'pending' : 'uncertain';
      booking.error = error instanceof CalendarError ? error.message : 'Die Kalendererstellung konnte nicht bestätigt werden. Bitte den Kalender prüfen.';
    }
    await this.state.storage.put(key, booking);
    return response(view(), booking.status === 'pending' ? 502 : 200);
  }

  async alarm() {
    const bookings = await this.state.storage.list<Booking>({ prefix: 'booking:' });
    let remaining = false;
    for (const [key, booking] of bookings) {
      if (booking.expiresAt < Date.now()) await this.state.storage.delete(key); else remaining = true;
    }
    if (remaining) await this.state.storage.setAlarm(Date.now() + DAY);
  }
}
