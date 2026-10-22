# Website → PA OS

Die Website speichert validierte Anfragen über die private Service-Bindung `PA_OS` im benannten OS-Entrypoint `IntakeService`. Eine Erfolgsmeldung bedeutet, dass ein dauerhafter Eingang mit Referenz existiert. Eine wiederholte Anfrage mit gleicher Referenz und gleichem Inhalt wird nicht erneut angelegt. Die Referenz und ein SHA-256-Inhaltshash bleiben im Browser-Session-Speicher für Wiederholungen; die Formulardaten werden dort nicht gespeichert.

Mail ist eine separate Benachrichtigung. Der OS-Eingang bleibt bei einem SMTP-Problem sichtbar. Unklare Zustellungen werden nicht automatisch wiederholt. Bei Terminanfragen bleiben zwei bis drei Wunschzeiten, Schweizer Zeit, das tägliche Zeitfenster und die persönliche Bestätigung unverändert. Vor dem Bestätigen wird kein Kalenderereignis erzeugt.

## Veröffentlichung

Zuerst das zugehörige PA-OS-Update inklusive additiver Datenbankmigration und `IntakeService` bereitstellen. Danach die Website mit `wrangler.jsonc` veröffentlichen. Die Bindung zeigt auf `pichler-advisory-os`, Entrypoint `IntakeService`. Ein fehlendes OS oder eine nicht bestätigte Speicherung führt zu einer Fehlermeldung; die Website behauptet keinen erfolgreichen Eingang. Vorhandene Mail-/Kalender-Geheimnisse bleiben extern und werden nicht ins Repository geschrieben.

Diese Sitzung hat keine Live-Veröffentlichung vorgenommen. Nach dem Deployment eine gekennzeichnete eigene Testanfrage bis zum OS-Eingang und seiner Zuordnung prüfen.

## Teststand 19. Oktober 2026

- 24 API-/Kalendertests bestanden, darunter dauerhafte Speicherung, Fehler vor der Speicherung, konkurrierende Wiederholungen und unklare Mailzustellung.
- 6 HTML-/Routingtests bestanden.
- 3 echte Browserdurchläufe bestanden: Desktop 1440 px, Mobil 390 px, Eingaben bei Fehler erhalten, gleiche Referenz beim erneuten Absenden, Bestätigungsanzeige und fehlende Terminangaben.
- TypeScript, Build und Lint bestanden. Lint weist bei bestehenden statischen Bildern auf mögliche Bildoptimierung hin.
- Die private Worker-RPC wird zusätzlich im OS-Repository mit echter lokaler D1 geprüft. Öffentliche UI-Tests simulieren die Antwort; sie senden keine Mails oder Einladungen.

```sh
npm ci
npx tsc --noEmit
npm run lint
npm test
npx playwright install --with-deps chromium
npm run test:ui
```
