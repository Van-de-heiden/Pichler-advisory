import { slotInstant, TIME_ZONE, type Enquiry, type Slot } from '../lib/enquiry.ts';

export type CalendarEnv = { INFOMANIAK_CALENDAR_TOKEN?: string; INFOMANIAK_CALENDAR_ID?: string };
export class CalendarError extends Error {
  uncertain: boolean;
  constructor(message: string, uncertain = false) { super(message); this.uncertain = uncertain; }
}
type Calendar = { id: string; name: string; organizer: { email: string; name: string } };
type Event = { id: string | number; start: string; end: string; freebusy?: string; status?: string; description?: string };
const API = 'https://api.infomaniak.com';
const utc = (instant: number) => new Date(instant).toISOString().slice(0, 19).replace('T', ' ');
const time = (value: string) => Date.parse(/[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : value.replace(' ', 'T') + 'Z');

// Calendar request/attendee contract follows Infomaniak's official client:
// https://github.com/Infomaniak/mcp-server-calendar/blob/main/src/calendar-client.ts
export class InfomaniakCalendar {
  env: CalendarEnv;
  request: typeof fetch;
  constructor(env: CalendarEnv, request: typeof fetch = fetch) {
    this.env = env;
    // Workers' native fetch rejects a CalendarClient instance as its receiver.
    // Node-based mocks do not expose this runtime constraint.
    this.request = request.bind(globalThis);
  }

  async api(path: string, body?: object): Promise<Record<string, unknown>> {
    if (!this.env.INFOMANIAK_CALENDAR_TOKEN) throw new CalendarError('Der Kalenderzugang ist noch nicht eingerichtet.');
    let response: Response;
    try {
      response = await this.request(API + path, { method: body ? 'POST' : 'GET',
        headers: { authorization: `Bearer ${this.env.INFOMANIAK_CALENDAR_TOKEN}`, 'content-type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(7000), redirect: 'manual' });
    } catch { throw new CalendarError(body ? 'Das Ergebnis der Kalendererstellung ist unklar. Bitte den Kalender prüfen, bevor ein weiterer Termin erstellt wird.' : 'Der Kalender ist momentan nicht erreichbar.', !!body); }
    // This Workers runtime supports manual/follow, but not redirect: 'error'.
    // Reject redirects explicitly so the token is never forwarded elsewhere.
    if (response.status >= 300 && response.status < 400) throw new CalendarError('Infomaniak hat die Kalenderanfrage umgeleitet. Die Verbindung muss geprüft werden; Zugangsdaten wurden nicht weitergeleitet.', !!body);
    if (!response.ok) throw new CalendarError(response.status === 401 || response.status === 403 ? 'Der Kalenderzugang fehlt oder hat nicht die nötigen Rechte.' : 'Infomaniak konnte die Kalenderanfrage nicht bestätigen.', !!body && (response.status >= 500 || response.status === 408));
    try {
      const result = await response.json() as Record<string, unknown>;
      if (result.result && result.result !== 'success') throw new Error('Unexpected result');
      if (!result.data) throw new Error('Missing result');
      return result;
    } catch { throw new CalendarError('Die Antwort des Kalenders konnte nicht eindeutig geprüft werden.', !!body); }
  }

  async target(): Promise<Calendar> {
    const [calendarsResult, profileResult] = await Promise.all([this.api('/1/calendar/pim/calendar'), this.api('/2/profile')]);
    const calendars = (calendarsResult.data as { calendars?: { id: string | number; name?: string; default?: boolean }[] }).calendars;
    if (!Array.isArray(calendars) || !calendars.length) throw new CalendarError('Es wurde kein verfügbarer Kalender gefunden.');
    const selected = this.env.INFOMANIAK_CALENDAR_ID
      ? calendars.find(c => String(c.id) === this.env.INFOMANIAK_CALENDAR_ID)
      : calendars.find(c => c.default) || (calendars.length === 1 ? calendars[0] : undefined);
    if (!selected) throw new CalendarError('Bitte einen Standardkalender festlegen oder INFOMANIAK_CALENDAR_ID konfigurieren.');
    const profile = profileResult.data as { email?: string; display_name?: string };
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) throw new CalendarError('Die Kalenderidentität konnte nicht geprüft werden.');
    return { id: String(selected.id), name: selected.name || 'Infomaniak-Kalender', organizer: { email: profile.email, name: profile.display_name || 'Maurus Pichler' } };
  }

  async available(calendarId: string, slot: Slot): Promise<boolean> {
    const start = slotInstant(slot), end = start + 30 * 60000;
    const query = new URLSearchParams({ calendar_id: calendarId, from: utc(start), to: utc(end) });
    const result = await this.api('/1/calendar/pim/event?' + query);
    if (!Array.isArray(result.data)) throw new CalendarError('Die Belegung des Kalenders konnte nicht geprüft werden.');
    for (const value of result.data) {
      const event = value as Event;
      if (event.freebusy === 'free' || event.status?.toLowerCase() === 'cancelled') continue;
      const from = typeof event.start === 'string' ? time(event.start) : NaN;
      const to = typeof event.end === 'string' ? time(event.end) : NaN;
      if (!Number.isFinite(from) || !Number.isFinite(to)) throw new CalendarError('Ein bestehender Kalendereintrag konnte zeitlich nicht eingeordnet werden. Bitte im Kalender prüfen.');
      if (from < end && to > start) return false;
    }
    return true;
  }

  async create(calendar: Calendar, enquiry: Enquiry, slot: Slot, reference: string, meetingUrl: string | null): Promise<string> {
    const start = slotInstant(slot);
    const title = `Erstgespräch · ${enquiry.company || enquiry.name}`.slice(0, 150);
    const description = [
      'Kostenloses und unverbindliches Erstgespräch mit Maurus Pichler · Pichler Advisory', '',
      meetingUrl ? `Videogespräch mit kMeet. Beitreten: ${meetingUrl}` : `Telefontermin: Maurus Pichler ruft Sie zur vereinbarten Zeit unter ${enquiry.phone} an.`, '',
      `Kontakt: ${enquiry.name} · ${enquiry.email}`, `Telefon: ${enquiry.phone || '–'}`,
      `Unternehmen: ${enquiry.company || '–'}`, `Thema: ${enquiry.topic || 'Erstgespräch'}`, '',
      enquiry.message, '', 'Dauer: 30 Minuten. Uhrzeiten: Europe/Zurich.',
      'Bei Änderungswünschen: info@pichler-advisory.ch · +41 77 538 30 64',
      `Buchungsreferenz: ${reference}`,
    ].join('\n');
    const result = await this.api('/1/calendar/pim/event', {
      title, start: utc(start), end: utc(start + 30 * 60000), description,
      calendar_id: calendar.id, freebusy: 'busy', type: 'event', fullday: false, private: true,
      timezone_start: TIME_ZONE, timezone_end: TIME_ZONE,
      location: meetingUrl || `Telefon: ${enquiry.phone}`, meet_room_url: meetingUrl || '',
      attendees: [
        { className: 'Attendee', address: enquiry.email, name: enquiry.name, organizer: false, state: 'NEEDS-ACTION' },
        { className: 'Attendee', address: calendar.organizer.email, name: calendar.organizer.name, organizer: true, state: 'ACCEPTED' },
      ], notifyAttendees: true,
    });
    const event = result.data as { id?: string | number };
    if (event.id === undefined || event.id === null) throw new CalendarError('Infomaniak hat keine eindeutige Terminbestätigung zurückgegeben. Bitte den Kalender prüfen.', true);
    return String(event.id);
  }
}

// Documented by the kMeet API: unique room URLs require no separate API call.
// A separate unpredictable link is generated for every booking; no shared room.
export function createMeetingUrl() { return `https://kmeet.infomaniak.com/${crypto.randomUUID().replaceAll('-', '')}${crypto.randomUUID().replaceAll('-', '')}`; }
