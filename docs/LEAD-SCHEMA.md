# Lead-Schema — Pichler Advisory

Alle Formulare der Website (Modal + Kontaktseite) senden dasselbe JSON-Payload an
`POST /api/lead` (Cloudflare Pages Function, `functions/api/lead.js`).
Von dort geht der Lead weiter an einen **Make-Webhook** und/oder als E-Mail über **Web3Forms**.
**Es gibt keinen direkten Bexio-Aufruf aus dem Frontend und keine Secrets im Frontend.**

## Payload (Frontend → /api/lead)

```json
{
  "lead": {
    "name": "Hans Muster",
    "firma": "Muster Gartenbau GmbH",
    "email": "hans@muster-gartenbau.ch",
    "telefon": "+41 79 000 00 00",
    "branche": "Gartenbau / Landschaftsbau",
    "betriebsgroesse": "6–15 Mitarbeitende",
    "hauptproblem": "Kein Nachfassen nach Offerten",
    "tools": "Bexio, Excel, WhatsApp",
    "dringlichkeit": "In den nächsten 3 Monaten",
    "nachricht": "Freitext…",
    "einwilligung": true
  },
  "meta": {
    "lead_source": "modal | kontaktseite | cta_banner | hero | leistungen_betriebscheck",
    "page": "/kontakt",
    "submitted_at": "2026-07-02T09:41:00.000Z"
  },
  "website": ""   // Honeypot — muss leer sein
}
```

## Weitergeleitetes Objekt (an Make-Webhook, flach)

`/api/lead` normalisiert, validiert und reicht ein **flaches** Objekt weiter —
zusätzlich mit `user_agent` und `country` (aus Cloudflare-Header `CF-IPCountry`).

| Feld | Typ | Pflicht | Zweck / spätere Bexio-Zuordnung |
|---|---|---|---|
| `name` | string | ja | Bexio-Kontakt: Vor-/Nachname |
| `firma` | string | ja | Bexio-Kontakt: Firma |
| `email` | string | ja | Bexio-Kontakt: E-Mail |
| `telefon` | string | nein | Bexio-Kontakt: Telefon |
| `branche` | enum | ja | **Routing** (z. B. Kontaktgruppe/Tag in Bexio) |
| `betriebsgroesse` | enum | nein | Qualifizierung / Segmentierung |
| `hauptproblem` | enum | nein | **Routing** (z. B. Aufgabentyp in Make) |
| `tools` | string | nein | Gesprächsvorbereitung |
| `dringlichkeit` | enum | nein | **Priorität** (z. B. Aufgaben-Fälligkeit in Make) |
| `nachricht` | string | nein | Notiz am Bexio-Kontakt |
| `einwilligung` | bool | ja (true) | Nachweis Einwilligung (Datenschutz) |
| `lead_source` | string | ja | Auswertung: welcher CTA konvertiert |
| `page` | string | — | Auswertung: welche Seite |
| `submitted_at` | ISO-8601 | ja | Timestamp für Dedupe/Reporting |
| `user_agent` | string | — | Spam-/Geräteanalyse |
| `country` | string | — | Plausibilisierung (CH-Fokus) |

### Enum-Werte

- `branche`: Gartenbau / Landschaftsbau · Sanitär / Heizung · Elektro · Schreinerei / Holzbau · Malerei / Gipserei · Bau / Baunebengewerbe · Anderes Handwerk · Andere Branche
- `betriebsgroesse`: 1–2 · 3–5 · 6–15 · über 15 Mitarbeitende
- `hauptproblem`: Anfragen gehen unter · Offerten dauern zu lange · Kein Nachfassen · Zu viel Büroarbeit von Hand · Keine Übersicht über Zahlen · Veralteter Auftritt · Etwas anderes
- `dringlichkeit`: So bald wie möglich · In den nächsten 3 Monaten · Ich informiere mich erst

## Konfiguration (Cloudflare Pages → Settings → Environment Variables)

| Variable | Zweck |
|---|---|
| `MAKE_WEBHOOK_URL` | Ziel-Webhook in Make (optional; sobald gesetzt, laufen Leads dorthin) |
| `WEB3FORMS_ACCESS_KEY` | Web3Forms-Key für E-Mail-Benachrichtigung |
| `AUTH_USERNAME` / `AUTH_PASSWORD` / `SESSION_SECRET` | Optionaler Site-Passwortschutz (Staging) |

Ist **keine** der beiden Weiterleitungen konfiguriert, meldet `/api/lead` bewusst
einen Fehler statt Erfolg vorzutäuschen.

## Geplantes Make-Szenario (später)

1. Webhook empfängt Lead.
2. Router nach `dringlichkeit` → «So bald wie möglich» erzeugt sofortige Benachrichtigung (z. B. SMS/Push).
3. Bexio-Modul: Kontakt suchen/anlegen (`email` als Schlüssel), `branche` als Kontaktgruppe, `nachricht` + Qualifizierung als Notiz.
4. Aufgabe in Bexio/Kalender: «Nachfassen» mit Fälligkeit gemäss `dringlichkeit`.
5. Ablage des Roh-Leads (z. B. Google Sheet) für Reporting nach `lead_source`.

## Hinweis für lokale Entwicklung

`astro dev` bedient `/api/lead` nicht (Pages Functions laufen nur auf Cloudflare).
Lokal testen mit `npx wrangler pages dev dist` nach `npm run build`.
