import nodemailer from 'nodemailer';
import { registerBooking, type BookingEnv } from './bookings.ts';
import { ENQUIRY_EMAIL, EnquiryError, enquiryMail, validateEnquiry } from '../lib/enquiry.ts';

type Limiter = { limit(input: { key: string }): Promise<{ success: boolean }> };
export type EnquiryEnv = BookingEnv & { MAIL_PASSWORD?: string; ENQUIRY_LIMITER?: Limiter; ENQUIRY_TOTAL_LIMITER?: Limiter };
type Mail = ReturnType<typeof enquiryMail>;
type Send = (mail: Mail, env: EnquiryEnv) => Promise<void>;
const MAX_BYTES = 20000;
const unavailable = 'Der Versand ist momentan nicht verfügbar. Ihre Angaben wurden nicht bestätigt. Bitte kontaktieren Sie uns direkt per E-Mail oder Telefon.';

function json(data: object, status = 200, extra: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra } });
}

export async function sendEnquiryMail(mail: Mail, env: EnquiryEnv) {
  const transport = nodemailer.createTransport({
    host: 'mail.infomaniak.com', port: 465, secure: true,
    auth: { user: ENQUIRY_EMAIL, pass: env.MAIL_PASSWORD },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    logger: false, debug: false,
  });
  try {
    const result = await transport.sendMail(mail);
    if (!result.accepted.some(address => String(address).toLowerCase() === ENQUIRY_EMAIL)) throw new Error('Recipient not accepted');
  } finally { transport.close(); }
}

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new EnquiryError('Die Anfrage enthält keine Angaben.');
  let length = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); throw new EnquiryError('Die Anfrage ist zu lang.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new EnquiryError('Die Anfrage konnte nicht gelesen werden.'); }
}

export async function handleEnquiry(request: Request, env: EnquiryEnv, send: Send = sendEnquiryMail) {
  if (request.method !== 'POST') return json({ error: 'Nur POST ist erlaubt.' }, 405, { allow: 'POST' });
  const url = new URL(request.url);
  if (request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'Bitte senden Sie Ihre Anfrage über das Formular auf unserer Website.' }, 403);
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'Ungültiges Anfrageformat.' }, 415);
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return json({ error: 'Die Anfrage ist zu lang.' }, 413);
  try {
    if (!env.MAIL_PASSWORD || !env.ENQUIRY_LIMITER || !env.ENQUIRY_TOTAL_LIMITER) return json({ error: unavailable }, 503);
    // A public form has no account identifier; use Cloudflare's trusted client IP.
    // These bindings limit per location; they are spam mitigation, not exact quotas.
    const limited = await env.ENQUIRY_LIMITER.limit({ key: `enquiry:ip:${request.headers.get('cf-connecting-ip') || 'local'}` });
    if (!limited.success) return json({ error: 'Zu viele Anfragen. Bitte warten Sie eine Minute und versuchen Sie es erneut.' }, 429, { 'retry-after': '60' });
    const enquiry = validateEnquiry(await readBody(request));
    const total = await env.ENQUIRY_TOTAL_LIMITER.limit({ key: 'pichler-advisory:enquiries' });
    if (!total.success) return json({ error: 'Der Versand ist gerade ausgelastet. Bitte versuchen Sie es in einer Minute erneut.' }, 429, { 'retry-after': '60' });
    const reference = crypto.randomUUID();
    // Await SMTP acceptance before reporting success. Never automatically retry
    // an ambiguous SMTP failure; there is no durable outbox in this simple form.
    const mail = enquiryMail(enquiry, reference);
    if (enquiry.kind === 'meeting') {
      const approvalLink = await registerBooking(env, enquiry, reference);
      mail.text += `\n\nTERMIN BESTÄTIGEN\n${approvalLink}\n\nDiesen persönlichen Link nicht weiterleiten. Eine Wunschzeit auswählen und bestätigen; danach erstellt Infomaniak den Kalendereintrag und versendet die Einladung. Bei Video wird ein eigener kMeet-Link ergänzt, bei Telefon die Kundennummer. Beim blossen Öffnen des Links wird nichts gebucht.`;
    }
    await send(mail, env);
    return json({ ok: true, reference });
  } catch (error) {
    if (error instanceof EnquiryError) return json({ error: error.message }, 400);
    // Do not expose provider responses, credentials or submitted personal data.
    return json({ error: unavailable }, 502);
  }
}
