# Redesign 2026 — Masterplan & Entscheidungen

Stand: Juli 2026. Grundlage: Audit (siehe Chat/Bericht), komplett neu gedachte Struktur.

## Positionierung

**Digitale Betriebsstruktur für Schweizer KMU** — insbesondere Handwerks- und Gewerbebetriebe
mit 3–15 Mitarbeitenden (Gartenbau, Sanitär, Elektro, Schreinerei u. ä.).
Nicht: KI-Agentur, Automationsbastler, generische Unternehmensberatung.

## Erzähllogik der Startseite (60-Sekunden-Test)

1. **Hero** — Das Leck benennen: «Aufträge gehen selten auf der Baustelle verloren. Sondern im Büro.»
   Rechts: codierte Beispielansicht des Zielzustands (ehrlich als solche deklariert), auch mobil sichtbar.
2. **Problem** — Vier konkrete Alltagsszenen (verpasste Anfrage, liegengebliebene Offerte,
   fehlendes Nachfassen, Büro am Feierabend). Verlust-Framing, sachlich.
3. **Structure (dunkel)** — Die Lösung als Kette: Anfrage → Erfassung → Offerte → Nachfassen →
   Auftrag/Rechnung → Übersicht. Drei Prinzipien (verbinden statt ersetzen, bedienbar, betreibbar).
4. **Services** — Drei aufeinander aufbauende Angebote statt sechs generischer Kacheln:
   Betriebscheck (Einstieg, fixer Rahmen) → Betriebsstruktur & Automatisierung (Kernprojekt) →
   Laufender Betrieb (Monatsmodell).
5. **Process** — Vier Phasen mit klarem Ergebnis pro Phase.
6. **Cockpit** — Beweis-Sektion: codiertes Dashboard, klar als «Beispielansicht» gelabelt.
7. **Founder (dunkel)** — Echtes Portrait, Alter als Stärke («Jahrgang 2006 — und ja, das steht
   hier bewusst»), EFZ Entwickler digitales Business als Kernkompetenz.
8. **FAQ** — Einwände des skeptischen 50-jährigen Inhabers vorweggenommen (inkl. «Sie sind jung»).
9. **CTA** — Risikosenkung + ein einziger Primär-CTA.
10. SEO-Block (Für wen / Probleme / Ansatz), visuell integriert.

## Wichtigste Entscheidungen

- **Ein CTA-Wortlaut sitewide:** «Betriebscheck anfragen» (Sekundär: Kontakt/Schreiben).
  Auf Seiten ohne Modal führt der CTA automatisch auf /kontakt.
- **Bildehrlichkeit:** Alle KI-Fake-«Fotos» entfernt. Es gibt nur noch: das echte Portrait
  (optimiert, 248 KB), codierte UI-Beispielansichten (gelabelt) und das Logo. Optionales
  Script `scripts/generate-images.mjs` erzeugt bewusst *stilisierte Illustrationen* —
  nie Fotorealismus. Key nur via `.env.local`/Env, nie im Repo.
- **Design entschärft Richtung «präzise» statt «Private Banking»:** Buttons mit 8-px-Radius
  statt Pill, Gold praktisch eliminiert, Diamond-Divider durch schlichte Linie ersetzt,
  weniger Kursiv-Schnörkel. Bordeaux/Ivory/Anthrazit-Palette bleibt.
- **Animationen:** Reveal-System beibehalten, ergänzt um Linien-Draw (`.reveal-line`),
  gestaffelte Karten (`.stagger`), Ketten-Animation in der Structure-Sektion.
  Alles respektiert `prefers-reduced-motion`.
- **Formular:** Eine gemeinsame Komponente (`ContactForm.astro`), zweistufig
  (Pflichtfelder + optionale Qualifizierung), Einwilligung, Honeypot, Lead-Quelle,
  Timestamp. Versand über `POST /api/lead` (Cloudflare Function) → Make-Webhook und/oder
  Web3Forms. Schema: `docs/LEAD-SCHEMA.md`. Keine Secrets im Frontend.
- **Technik:** `@astrojs/sitemap` aktiviert (robots.txt → sitemap-index.xml), og-image.png
  erstellt, Session-Secret-Fallback entfernt, doppelter (fake-Erfolg-)Submit-Handler entfernt.

## Bildstrategie (nächste Ausbaustufe)

Stärkstes fehlendes Asset sind **echte Fotos**: Maurus bei der Arbeit, ein echtes gebautes
Cockpit, Notizen/Prozess-Skizzen. Handykamera reicht. Erst wenn das nicht möglich ist,
stilisierte Illustrationen über das Script generieren (Prompts dort definiert).

## Offene Punkte / manuell prüfen

- Cloudflare-Env-Variablen setzen: `WEB3FORMS_ACCESS_KEY` (bisheriger Key), optional
  `MAKE_WEBHOOK_URL`; bei aktivem Staging-Schutz zwingend `SESSION_SECRET`.
- Privatadresse in Impressum/JSON-LD: bewusst öffentlich lassen oder auf Ort/Kanton reduzieren?
- `project/`- und `chats/`-Ordner (Design-Handoff) sind Referenzmaterial — bei Gelegenheit
  aus dem Produktions-Repo archivieren.
- Echte Referenz/Fallstudie ergänzen, sobald erstes Kundenprojekt abgeschlossen ist.
