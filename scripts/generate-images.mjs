#!/usr/bin/env node
/**
 * Lokales Bild-Generierungs-Script (optional).
 *
 * Sicherheit:
 *  - Liest OPENAI_API_KEY ausschliesslich aus der Umgebung oder aus .env.local
 *    (.env* ist in .gitignore — niemals committen).
 *  - Der Key wird nie geloggt und taucht nie im Frontend oder im Build auf.
 *
 * Verwendung:
 *    echo 'OPENAI_API_KEY=sk-…' > .env.local     # einmalig, lokal
 *    node scripts/generate-images.mjs            # generiert alle definierten Bilder
 *    node scripts/generate-images.mjs prozess    # nur ein bestimmtes Bild
 *
 * Grundsatz Bildwelt (siehe docs/REDESIGN.md):
 *  - Keine fotorealistischen KI-Bilder, die sich als Fotos ausgeben.
 *  - Nur klar stilisierte Illustrationen oder es bleibt bei echten Fotos / codierten UIs.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const envFile = resolve(root, '.env.local');
  if (existsSync(envFile)) {
    const line = readFileSync(envFile, 'utf8')
      .split('\n')
      .find((l) => l.startsWith('OPENAI_API_KEY='));
    if (line) return line.slice('OPENAI_API_KEY='.length).trim();
  }
  console.error('Kein OPENAI_API_KEY gefunden (Umgebung oder .env.local). Abbruch.');
  process.exit(1);
}

/** Bilddefinitionen: sprechende Namen, stilisierte (nicht fotorealistische) Prompts. */
const images = {
  prozess: {
    file: 'public/assets/illu-prozess.png',
    size: '1536x1024',
    prompt:
      'Minimalist editorial line illustration: tangled chaotic lines on the left resolving into clean, ' +
      'parallel organized lines on the right, symbolizing a business process being structured. ' +
      'Deep bordeaux (#5A0F1B) lines on warm ivory (#F8F5EF) background, generous negative space, ' +
      'Swiss graphic design style, no text, no people, no photorealism.',
  },
  werkbank: {
    file: 'public/assets/illu-werkbank.png',
    size: '1536x1024',
    prompt:
      'Calm, muted illustration in a flat editorial style: a tidy carpenter workbench seen from above, ' +
      'tools neatly arranged, a tablet showing a simple checklist lying among them. ' +
      'Warm neutral palette (charcoal, taupe, ivory) with a single deep bordeaux accent. ' +
      'Swiss design restraint, soft grain, no text on screens, no people, clearly an illustration, not a photo.',
  },
};

const key = loadKey();
const only = process.argv[2];

for (const [name, def] of Object.entries(images)) {
  if (only && only !== name) continue;
  process.stdout.write(`Generiere «${name}» → ${def.file} … `);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt: def.prompt, size: def.size, n: 1 }),
  });
  if (!res.ok) {
    console.error(`Fehler ${res.status} — Antwort wird nicht geloggt (könnte Details enthalten).`);
    process.exitCode = 1;
    continue;
  }
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) { console.error('Keine Bilddaten erhalten.'); continue; }
  const out = resolve(root, def.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log('ok');
}
console.log('Fertig. Bilder vor Verwendung prüfen und mit `convert`/`squoosh` komprimieren.');
