# Reversibel online gehen

## Empfehlung: öffentliche Hülle ändern, bestehenden Dienst erhalten

Die aktuelle Website ist nicht nur statisches HTML. `worker/index.ts` verarbeitet Anfragen und Buchungen; `wrangler.jsonc` bindet PA OS und BookingDesk an. Deshalb keinen reinen Asset-Worker unter demselben Namen als vollständigen Ersatz deployen.

1. Den **tatsächlich aktiven** Cloudflare-Deploymentstand, die zugehörige Commit-ID und aktuelle Worker-Konfiguration feststellen und als Rollback dokumentieren. `main` allein beweist nicht den aktuell laufenden Stand. Einen unveränderten Quellcode-Backupstand behalten. Datenbestände und Durable-Object-Migrationen nicht ändern.
2. Eine eigene Rebranding-Änderung vom verifizierten Produktionsstand anlegen, nicht vom noch ungeprüften neuen Designstand. Statische Dateien unter einem kollisionsfreien Pfad wie `/rebranding/` hinzufügen. `index.html` dabei z. B. als `/rebranding/index.html` speichern.
3. Im bestehenden Worker eine klar begrenzte, abschaltbare Rebranding-Verzweigung ergänzen. Die bestehenden API-Handler laufen **vor** dieser Verzweigung weiter. Die bestehende Weiterleitung von `www` auf die Hauptdomain bleibt erhalten.
4. Die folgenden Routen erhalten:
   - `/api/enquiries` mit unverändertem Transport und Schutz
   - `/api/bookings/*` mit unveränderten Handlern
   - `/termine/bestaetigen` und vorsorglich der ganze `/termine/`-Bereich für bereits versandte Bestätigungslinks
   - `/impressum`, `/datenschutz`, `/agb` und deren benötigte Assets
   - PA OS auf der getrennten Domain sowie bestehende Service-Bindings, Secrets, Ratelimits, Durable Objects und Migrationen
5. Nur normale `GET`/`HEAD`-Aufrufe der bekannten Marketingseiten ändern:
   - `/`: Rebranding-Seite mit Status 200 und kurzem Cache, z. B. `Cache-Control: public, max-age=60`.
   - Bekannte bisherige Leistungs-, Branchen- und Über-mich-Seiten: zeitlich begrenzte 302-Weiterleitung auf `/`, keine permanente 301/308 für diese Rebranding-Pause.
   - Alte Kontakt-Links dürfen zur vorhandenen `#anfrage`-Marke auf dieser Seite führen.
   - Unbekannte Pfade weiter als echte 404 behandeln, nicht pauschal jede URL mit derselben Seite als 200 beantworten.
6. Sitemap für die tatsächlich erreichbaren öffentlichen Seiten anpassen. Die Hauptdomain nicht pauschal auf `noindex` oder `Disallow: /` setzen. Eine private oder gesonderte Staging-Vorschau hingegen vor öffentlicher Indexierung schützen.
7. Sämtliche Repository-Checks und gezielte Tests durchführen. Vor Veröffentlichung zusätzlich die bestehende Cloudflare-Assets-Konfiguration prüfen: Asset-Routing darf den neuen HTML-Guard nicht umgehen und die bisherigen App-Assets müssen weiter auflösbar sein.
8. Erst nach geprüfter Vorschau und Freigabe den kleinen Rebranding-Stand veröffentlichen. Die bestehende Repository-Anleitung verbindet `main` mit Cloudflare Workers Builds; ein Merge dort kann bereits die Veröffentlichung auslösen. Nicht vorher auf `main` pushen.
9. Unmittelbar nach dem Umschalten Homepage, `www`, Rechtsseiten, Buchungsbestätigungsansicht ohne gültigen Token, CSS/Schriften/Logo und die temporären Marketing-Weiterleitungen prüfen. Keine echten Nachrichten oder Buchungen zum Test senden, sofern nicht separat autorisiert.

## Rollback

Den aufgezeichneten vorherigen Cloudflare-Deploymentstand wieder aktivieren oder die klar begrenzte Rebranding-Verzweigung deaktivieren und das **unveränderte** ursprüngliche Routing wiederherstellen. Verifizieren, dass die ursprünglich erwartete Version tatsächlich wieder läuft. Eine neue Konfigurationsvariable allein ist kein Rollback, solange ihre Wirkung und der zugehörige Deployweg nicht getestet wurden. Kurze Cache-Zeiten verwenden und bei Bedarf nur betroffene HTML-URLs leeren.

## Alternative: eigene Rebranding-Frontend-Route

Eine separate statische Hülle kann vor dem bestehenden Worker stehen. Dafür müssen Routing und Proxying für APIs, Rechtsseiten, Buchungslinks und Assets ausdrücklich korrekt eingerichtet werden. Das isoliert die Gestaltung stärker, bringt aber zusätzliche Fehlerquellen mit sich. Eine neue Domain oder ein privater Vorschau-Link eignet sich zuerst zum Prüfen, ersetzt jedoch nicht die öffentliche Hauptdomain.

**Nicht empfohlen:** DNS auf einen fremden statischen Host umbiegen, den alten Worker löschen, alle Pfade pauschal abfangen oder Daten/Secrets/Bindings während dieser Umstellung entfernen. Das erschwert Rollback und kann laufende Buchungen oder PA OS beeinträchtigen.

## Danach in Ruhe entwickeln

Den neuen vollständigen Auftritt in einem gesonderten, geschützten Staging-Stand entwickeln und validieren. Erst beim geprüften Release die Rebranding-Verzweigung zurücknehmen und die neue Oberfläche aktivieren. Nicht mehr benötigte Dateien danach in einem eigenen, überprüfbaren Schritt bereinigen. Historische Versionen und produktive Daten nicht in die Bereinigung einbeziehen.

## Implementierter Stand dieses Branches

- Basis: `61003aa142bd90176ab9fe049b5731e21665177f`.
- `REBRANDING_MODE=on` aktiviert die Hülle. Nicht gesetzt, `off` oder jeder andere Wert lassen die bisherige Website unverändert. Die Produktionskonfiguration wurde nicht auf `on` gestellt.
- `worker/rebranding.ts` begrenzt die Änderung auf GET/HEAD für die Startseite und ausdrücklich aufgezählte Marketingrouten. Nicht bekannte URLs, APIs, Rechtsseiten und Buchungsansichten bleiben beim bisherigen Worker.
- Die Homepage wird aus `public/rebranding/index.html?raw` in das Worker-Bundle eingebettet. Dafür wird **keine neue ASSETS-Bindung** benötigt. Bestehende statische Asset-Auslieferung bleibt erhalten.
- Das echte bisherige Schild und die neue v14-Wortmarke werden unverändert nebeneinander gezeigt. Das kompakte Impressum enthält verifizierte Anbieter-, Kontakt- und Registerangaben. Die ausführlichen bestehenden Rechtsseiten bleiben erhalten.
- Keine Änderungen an `wrangler.jsonc`, bestehenden Intake-/Booking-Dateien, Bindings, Migrationen oder Geheimnissen. Default-Modus und alter Seitenbestand werden durch die bisherigen Tests weiterhin abgedeckt.
- Prüfung: `npm test` (29 Unit-/Vertragstests, Produktionsbuild, 9 Tests am gebauten Worker), `npm run lint` (0 Fehler, 4 bestehende Bild-Warnungen), `tsc --noEmit` und `git diff --check` bestanden. Zusätzlich statische Seite bei Desktop-/390-/320-Pixel-Breiten geprüft.
- Aktivierung erst nach Freigabe: Die Flag-Konfiguration muss über den bestätigten Cloudflare-Deployweg gesetzt werden. Den aktiven Deploymentstand vorher sichern. Bei späterem Ausschalten muss der getestete Produktionsstand samt bisheriger Konfiguration erhalten bleiben.
