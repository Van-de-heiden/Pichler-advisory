export const TIME_ZONE = 'Europe/Zurich';
export const ENQUIRY_EMAIL = 'info@pichler-advisory.ch';
export type Slot = { date: string; time: string };
export type Enquiry = {
  kind: 'meeting' | 'message'; name: string; email: string; company: string;
  phone: string; topic: string; message: string; format: 'video' | 'phone'; slots: Slot[];
};
export class EnquiryError extends Error {}

export function zurichDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

// Resolve the customer's wall-clock choice explicitly in Zurich, independent of
// the browser/server timezone. Reject missing or ambiguous DST times.
export function slotInstant(slot: Slot): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slot.date) || !/^\d{2}:\d{2}$/.test(slot.time)) return NaN;
  const [year, month, day] = slot.date.split('-').map(Number);
  const [hour, minute] = slot.time.split(':').map(Number);
  if (year < 2026 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return NaN;
  const nominal = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat('sv-SE', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const candidates = [1, 2].map(offset => nominal - offset * 3600000)
    .filter(value => formatter.format(value) === `${slot.date} ${slot.time}`);
  return candidates.length === 1 ? candidates[0] : NaN;
}

function field(data: Record<string, unknown>, key: string, max: number, required = false, multiline = false) {
  const raw = data[key];
  if (raw !== undefined && typeof raw !== 'string') throw new EnquiryError('Bitte prüfen Sie Ihre Angaben.');
  const value = typeof raw === 'string' ? raw.trim() : '';
  if ((required && !value) || value.length > max || (multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(value)) {
    throw new EnquiryError('Bitte füllen Sie die Pflichtfelder aus und prüfen Sie die Länge Ihrer Angaben.');
  }
  return value;
}

export function validateEnquiry(input: unknown, now = Date.now()): Enquiry {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new EnquiryError('Ungültige Anfrage.');
  const data = input as Record<string, unknown>;
  if (data.website) throw new EnquiryError('Die Anfrage konnte nicht angenommen werden.');
  if (data.kind !== 'meeting' && data.kind !== 'message') throw new EnquiryError('Bitte wählen Sie die Art Ihrer Anfrage.');
  if (data.privacy !== true) throw new EnquiryError('Bitte nehmen Sie den Datenschutzhinweis zur Kenntnis.');
  const email = field(data, 'email', 254, true).toLowerCase();
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email)) throw new EnquiryError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
  const kind = data.kind;
  const phone = field(data, 'phone', 60, kind === 'meeting' && data.format === 'phone');
  const message = field(data, 'message', 3000, kind === 'message', true);
  if (kind === 'message' && message.length < 10) throw new EnquiryError('Bitte beschreiben Sie Ihr Anliegen mit mindestens 10 Zeichen.');
  let slots: Slot[] = [];
  if (kind === 'meeting') {
    if (data.format !== 'video' && data.format !== 'phone') throw new EnquiryError('Bitte wählen Sie Video oder Telefon.');
    if (!Array.isArray(data.slots) || data.slots.length < 2 || data.slots.length > 3) throw new EnquiryError('Bitte geben Sie zwei oder drei Wunschtermine an.');
    slots = data.slots.map(value => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new EnquiryError('Bitte prüfen Sie Ihre Wunschtermine.');
      const slot = { date: field(value as Record<string, unknown>, 'date', 10, true), time: field(value as Record<string, unknown>, 'time', 5, true) };
      const instant = slotInstant(slot);
      if (!Number.isFinite(instant) || instant <= now || instant > now + 180 * 86400000) throw new EnquiryError('Bitte wählen Sie gültige, zukünftige Termine innerhalb der nächsten sechs Monate (Schweizer Zeit).');
      return slot;
    });
    if (new Set(slots.map(s => `${s.date}T${s.time}`)).size !== slots.length) throw new EnquiryError('Bitte wählen Sie unterschiedliche Wunschtermine.');
  }
  return { kind, email, phone, message, slots, name: field(data, 'name', 100, true), company: field(data, 'company', 150), topic: field(data, 'topic', 100), format: data.format === 'phone' ? 'phone' : 'video' };
}

export function enquiryMail(enquiry: Enquiry, reference: string) {
  const meeting = enquiry.kind === 'meeting';
  const when = new Intl.DateTimeFormat('de-CH', { timeZone: TIME_ZONE, weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return {
    from: { name: 'Pichler Advisory · Website', address: ENQUIRY_EMAIL },
    to: ENQUIRY_EMAIL,
    replyTo: { name: enquiry.name, address: enquiry.email },
    subject: `${meeting ? 'Terminanfrage · kostenloses Erstgespräch' : 'Website-Anfrage'} – ${enquiry.name}`,
    text: [meeting ? 'NEUE TERMINANFRAGE – NOCH NICHT BESTÄTIGT' : 'NEUE NACHRICHT VON DER WEBSITE', '',
      `Name: ${enquiry.name}`, `E-Mail: ${enquiry.email}`, `Unternehmen: ${enquiry.company || '–'}`, `Telefon: ${enquiry.phone || '–'}`, `Thema: ${enquiry.topic || '–'}`, '',
      ...(meeting ? [`Gespräch: ${enquiry.format === 'phone' ? 'Telefon' : 'Video'} · ca. 30 Minuten`, 'Wunschtermine (Europe/Zurich, Schweizer Zeit):', ...enquiry.slots.map((slot, i) => `${i + 1}. ${when.format(slotInstant(slot))}`), '', 'Kostenlos und unverbindlich. Bitte einen Wunschtermin über den persönlichen Bestätigungslink unten bestätigen. Es wurde noch kein Kalendereintrag erstellt.', 'Nach Bestätigung werden Kalender und Einladung automatisch erstellt; bei Video mit einem eigenen kMeet-Link.', ''] : []),
      'Anliegen:', enquiry.message || '(Kein zusätzliches Anliegen angegeben)', '', `Referenz: ${reference}`,
      'Datenschutzhinweis zur Kenntnis genommen.',
    ].join('\n'),
    messageId: `<${reference}@pichler-advisory.ch>`,
    disableFileAccess: true, disableUrlAccess: true,
  };
}
