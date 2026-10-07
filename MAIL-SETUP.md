# Kontaktformular und kostenlose Erstgespräche

## Vor der Veröffentlichung

Im Cloudflare-Dashboard beim **öffentlichen Worker `pichler-advisory`** unter
**Settings → Variables and Secrets → Add** ein Secret anlegen:

- Type: **Secret**
- Name: **`MAIL_PASSWORD`**
- Value: gültiges Infomaniak-Geräte-/Mailpasswort für `info@pichler-advisory.ch`

Anschliessend **Deploy** wählen. Das Secret vom separaten Worker
`pichler-advisory-os` wird nicht automatisch übernommen. Keine Passwörter in Git,
öffentliche Frontend-Variablen oder Chat-Nachrichten schreiben.

Danach diese Änderung in `main` übernehmen. Die bestehende Cloudflare-Build-Anbindung
veröffentlicht den öffentlichen Worker. Sie übernimmt auch die beiden in
`wrangler.jsonc` definierten Rate-Limit-Bindings. Keine DNS-Änderung und keine
Datenbankmigration erforderlich.

Alternativ im passenden Checkout und angemeldeten Cloudflare-Konto:

```sh
npx wrangler secret put MAIL_PASSWORD
```

## Was Kunden sehen

- **Erstgespräch anfragen:** kostenlos, unverbindlich, ca. 30 Minuten; Video oder
  Telefon; zwei unterschiedliche Wunschzeiten, optional eine dritte.
- **Nachricht senden:** direkte Übermittlung ohne E-Mail-Entwurf.
- Zeiten werden ausdrücklich als **Schweizer Zeit / Europe/Zurich** behandelt.
- Erst nach Annahme der Mail durch Infomaniak erscheint die Erfolgsmeldung.
- Terminwünsche sind keine bestätigten Buchungen. Maurus bestätigt persönlich
  per Antwort auf die Mail und ergänzt bei Video einen Gesprächslink.

## Mailversand

Der Worker sendet über `mail.infomaniak.com:465` mit implizitem TLS und Nodemailer.
Absender und Empfänger sind fest `info@pichler-advisory.ch`. `Reply-To` enthält die
validierte Kundenadresse. Der öffentliche Endpunkt kann keine beliebigen
Empfänger anschreiben. Es gibt keine automatische Kundenmail, keine automatische
Kalendereinladung und keine zusätzliche Speicherung in einer Website-Datenbank.

In der Mail stehen Kontaktdaten, Anliegen, Gesprächsform und alle Wunschzeiten.
Eine eindeutige Referenz erleichtert die Zuordnung. Es wird direkt in den
Posteingang gesendet; eine zusätzliche IMAP-Kopie in Gesendet wird nicht angelegt.

## Schutz und Fehlerfälle

Serverseitige Feld- und Terminprüfung, strikte Origin-Prüfung, 20-kB-Limit,
Honeypot, 5 Anfragen pro IP/Minute und 30 Anfragen insgesamt pro Minute je
Cloudflare-Standort. Die Cloudflare-Limits sind bewusst keine exakten globalen
Quoten. Bei Missbrauch können im bestehenden Cloudflare-Konto weitere
WAF-/Bot-Regeln ergänzt werden.

Fehlende Konfiguration oder SMTP-Fehler führen zu einer Fehlermeldung mit direkten
Kontaktmöglichkeiten; Eingaben bleiben erhalten. Die Anwendung protokolliert
keine Formulardaten oder SMTP-Fehlerdetails. Der Browser verhindert parallele
Übermittlungen. Es gibt keine automatische Wiederholung und keine persistente
Versandwarteschlange. Bei einem Verbindungsabbruch nach SMTP-Annahme kann eine Mail
bereits angekommen sein; ein manueller Wiederholungsversand kann ein Duplikat
erzeugen. Die Oberfläche behauptet in diesem Fall keinen bestätigten Versand.

## Abnahme

`npm test` prüft Eingabevalidierung, Zürich-Sommer-/Winterzeit, Missbrauchsschutz,
Mail-Inhalt, Fehlerfälle und die bestehenden Seiten nach einem vollständigen Build.
Der SMTP-Transport wird in Funktionstests ersetzt. Diese Tests belegen keine
produktive Postfachverbindung.

Nach Einrichtung auf der Website eine klar bezeichnete Testnachricht und eine
Terminanfrage absenden. Im echten Infomaniak-Posteingang Empfang, Wunschzeiten und
Antwortadresse kontrollieren. Die zwei Testmails nur an das eigene Postfach senden.
Erst damit ist der produktive Versand abschliessend geprüft.
