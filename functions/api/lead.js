/**
 * POST /api/lead — zentraler Lead-Endpoint (Cloudflare Pages Function).
 *
 * Aufgaben:
 *  1. Validiert und normalisiert das Formular-Payload (Schema: docs/LEAD-SCHEMA.md).
 *  2. Leitet den Lead optional an einen Make-Webhook weiter (env.MAKE_WEBHOOK_URL).
 *     Von dort aus erfolgt später Routing/Kontaktanlage in Bexio — nie aus dem Frontend.
 *  3. Versendet eine E-Mail-Benachrichtigung über Web3Forms (env.WEB3FORMS_ACCESS_KEY).
 *
 * Secrets ausschliesslich über Cloudflare-Umgebungsvariablen. Keine Keys im Code.
 * Hinweis: Der Web3Forms Access Key ist per Design öffentlich (identifiziert nur das
 * Empfängerpostfach), wird hier aber trotzdem serverseitig gehalten.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v, max = 500) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: 'Ungültige Anfrage.' }, 400);
  }

  // Honeypot: still & leise "Erfolg" melden, nichts weiterleiten.
  if (str(body.website)) return json({ success: true });

  const lead = body.lead ?? {};
  const meta = body.meta ?? {};

  const data = {
    // Kontakt
    name: str(lead.name, 120),
    firma: str(lead.firma, 160),
    email: str(lead.email, 200),
    telefon: str(lead.telefon, 40),
    // Qualifizierung
    branche: str(lead.branche, 80),
    betriebsgroesse: str(lead.betriebsgroesse, 40),
    hauptproblem: str(lead.hauptproblem, 120),
    tools: str(lead.tools, 200),
    dringlichkeit: str(lead.dringlichkeit, 60),
    nachricht: str(lead.nachricht, 3000),
    einwilligung: lead.einwilligung === true,
    // Meta (für Routing & Auswertung in Make/Bexio)
    lead_source: str(meta.lead_source, 60) || 'unbekannt',
    page: str(meta.page, 200),
    submitted_at: str(meta.submitted_at, 40) || new Date().toISOString(),
    user_agent: request.headers.get('User-Agent') ?? '',
    country: request.headers.get('CF-IPCountry') ?? '',
  };

  if (!data.name || !data.firma || !data.branche || !EMAIL_RE.test(data.email) || !data.einwilligung) {
    return json({ success: false, message: 'Bitte Pflichtfelder prüfen.' }, 422);
  }

  const results = [];

  // 1) Make-Webhook (falls konfiguriert) — Quelle der Wahrheit für Automatisierung
  if (env.MAKE_WEBHOOK_URL) {
    results.push(
      fetch(env.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    );
  }

  // 2) E-Mail-Benachrichtigung über Web3Forms (falls konfiguriert)
  if (env.WEB3FORMS_ACCESS_KEY) {
    const lines = [
      `Name: ${data.name}`,
      `Firma: ${data.firma}`,
      `E-Mail: ${data.email}`,
      data.telefon && `Telefon: ${data.telefon}`,
      `Branche: ${data.branche}`,
      data.betriebsgroesse && `Betriebsgrösse: ${data.betriebsgroesse}`,
      data.hauptproblem && `Hauptproblem: ${data.hauptproblem}`,
      data.tools && `Heutige Tools: ${data.tools}`,
      data.dringlichkeit && `Zeithorizont: ${data.dringlichkeit}`,
      data.nachricht && `\nNachricht:\n${data.nachricht}`,
      `\n— Quelle: ${data.lead_source} (${data.page}) · ${data.submitted_at}`,
    ].filter(Boolean);

    results.push(
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: env.WEB3FORMS_ACCESS_KEY,
          subject: `Neue Anfrage: ${data.firma} (${data.branche})`,
          from_name: 'Pichler Advisory Website',
          name: data.name,
          email: data.email,
          message: lines.join('\n'),
        }),
      })
    );
  }

  if (results.length === 0) {
    // Weder Make noch Web3Forms konfiguriert — Fehler sichtbar machen statt Erfolg vortäuschen.
    return json({ success: false, message: 'Lead-Weiterleitung ist nicht konfiguriert.' }, 500);
  }

  const settled = await Promise.allSettled(results);
  const anyOk = settled.some((r) => r.status === 'fulfilled' && r.value.ok);

  return anyOk
    ? json({ success: true })
    : json({ success: false, message: 'Weiterleitung fehlgeschlagen.' }, 502);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
