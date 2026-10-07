# Website: Direktversand, Kalender und kMeet

## Einmalige Einrichtung

### 1. Mailzugang beim Website-Worker

Im Cloudflare-Dashboard **Workers & Pages → pichler-advisory → Settings → Variables and Secrets → Add**:

- Typ **Secret**, Name **`MAIL_PASSWORD`**.
- Wert: gültiges Infomaniak-Geräte-/Mailpasswort für `info@pichler-advisory.ch`.
- **Deploy** wählen. Das Secret vom separaten OS-Worker wird nicht übernommen.

### 2. Infomaniak-Kalenderzugang

Im [Infomaniak Token Manager](https://manager.infomaniak.com/v3/ng/accounts/token/list)
einen Token für das Konto erstellen, dem der gewünschte Geschäftskalender gehört.
Name beispielsweise „Pichler Advisory Website – Termine“, Berechtigungen:

- `workspace:calendar`
- `user_info`

Den Token direkt als **Secret `INFOMANIAK_CALENDAR_TOKEN`** beim Website-Worker
hinterlegen und deployen. Weder Mailpasswort noch API-Token in Chat, Git oder
öffentliche Frontend-Variablen schreiben.

Standardmässig verwendet die Website den in Infomaniak als Standard markierten
Kalender. Bei genau einem verfügbaren Kalender wird dieser verwendet. Bei mehreren
Kalendern ohne Standard stoppt die Bestätigung, statt einen beliebigen auszuwählen.
Für einen ausdrücklich anderen Kalender dessen reale ID als normale Variable
`INFOMANIAK_CALENDAR_ID` hinterlegen. Den Kalendernamen und die Absenderidentität
bei der Zustellprobe kontrollieren: Einladungen verwenden die Infomaniak-
Kontenidentität aus dem API-Profil, die vom SMTP-Postfach abweichen kann.

Die `kmeet`-Berechtigung ist für diese Umsetzung nicht erforderlich. Gemäss
Infomaniaks Dokumentation kann ein eigener kMeet-Raum durch eine unvorhersagbare
URL erzeugt werden. Der Link wird als `meet_room_url`, Ort und in der Beschreibung
in den Kalender eingetragen. Keine gemeinsame wiederverwendete Meeting-Adresse,
keine automatische Aufzeichnung und keine speziell vorkonfigurierte Lobby.

### 3. Veröffentlichen und prüfen

Die vorbereitete Änderung in `main` übernehmen. Die bestehende Cloudflare-
Build-Anbindung veröffentlicht den Worker. Wrangler richtet die beiden
Rate-Limit-Bindings und den SQLite-basierten Durable Object `BookingDesk` über die
Migration `booking-desk-v1` ein. Keine separate D1-Datenbank oder DNS-Änderung nötig.
Die Binding-/Migrationsnamen bei späteren Veröffentlichungen beibehalten.

Vor Freigabe mit selbst kontrollierten Testadressen prüfen:

1. Nachricht absenden und Empfang im Infomaniak-Postfach kontrollieren.
2. Video-Terminanfrage absenden. Die Anfrage-Mail enthält einen persönlichen
   Bestätigungslink; die öffentliche Erfolgsmeldung enthält diesen nicht.
3. Link öffnen, Wunschzeit wählen und **Termin bestätigen & Einladung senden**.
4. Kalendereintrag, Schweizer Uhrzeit, Dauer, Einladungsadresse und kMeet-Link
   kontrollieren. Der Kunde bekommt eine Kalender-Einladung durch Infomaniak.
5. Link mit zwei Browsern öffnen und denselben Raum betreten. Mikrofon/Kamera
   werden vom Teilnehmer im Browser freigegeben.
6. Telefontermin prüfen: Einladung sagt, dass Maurus anruft; Nummer steht im
   Termin. Es wird kein Videolink erstellt.
7. Bestätigungslink erneut öffnen: derselbe Termin, kein weiterer Versand.

Die lokalen Tests ersetzen Infomaniak/SMTP durch Testadapter. Sie beweisen keine
produktive Postfach- oder Kalenderverbindung. Live-Zustellung, API-Zeitzonenvertrag,
Absenderidentität und die Nutzung des kMeet-Raums müssen mit dem echten Konto
abschliessend geprüft werden.

## Ablauf

Der Kunde schlägt zwei bis drei verschiedene zukünftige Termine in **Schweizer
Zeit / Europe/Zurich** vor und wählt Video oder Telefon. Telefon erfordert eine
Rufnummer. Erstgespräche dauern 30 Minuten, sind kostenlos und unverbindlich.

Die Website speichert die Terminanfrage und sendet sie direkt an
`info@pichler-advisory.ch`. Die Mail enthält einen geheimen Bestätigungslink für
Maurus. Das Öffnen allein versendet nichts. Nach der Auswahl und Bestätigung wird
die Belegung im Zielkalender geprüft, dann ein als belegt und privat markierter
Eintrag mit dem Kunden als eingeladenem Teilnehmer erstellt. `notifyAttendees`
veranlasst die Einladung durch Infomaniak. Zusätzliche SMTP-Bestätigungsmails
werden nicht gesendet, damit nicht zwei unterschiedliche Einladungen entstehen.

Für Video wird ein individueller kMeet-Link hinzugefügt. Bei Telefon steht
„Maurus Pichler ruft Sie an“ zusammen mit der angegebenen Nummer im Ereignis und
in der Einladung. Maurus führt das Gespräch zur bestätigten Zeit selbst.

Änderungen und Absagen nach der Bestätigung erfolgen direkt in Infomaniak Calendar
mit Benachrichtigung der Teilnehmer. Der Website-Link ist eine Bestätigung der
ursprünglichen Anfrage, kein laufend mit späteren Kalenderänderungen
synchronisiertes Verwaltungsportal.

## Sicherheit und Fehlerfälle

- Servervalidierung, Origin-Prüfung, 20-kB-Limit, Honeypot; 5 öffentliche Anfragen
  pro IP/Minute und 30 insgesamt/Minute je Cloudflare-Standort.
- Nachrichten können nur an das eigene Postfach gesendet werden. Die Kundenadresse
  ist `Reply-To`. Formulardaten, SMTP-Fehlerdetails und Geheimnisse werden nicht
  von der Anwendung protokolliert.
- Bestätigungslinks enthalten einen zufälligen geheimen Token im URL-Fragment.
  Er wird nur per Header an die API übertragen und im Datenspeicher ausschliesslich
  gehasht abgelegt. Wer diesen Link hat, kann die konkrete Anfrage bestätigen;
  deshalb nicht weiterleiten. Keine global öffentlich zugängliche Terminliste.
- Das Durable Object serialisiert Website-Bestätigungen und speichert deren
  Status dauerhaft. Doppelte Klicks, Neuladen und Neustarts erzeugen keinen
  zweiten Termin nach bestätigter oder unklarer Erstellung.
- Bei einem nicht eindeutig beantworteten Kalender-Schreibzugriff bleibt die
  Anfrage zur manuellen Prüfung gesperrt. Im Kalender nach der Buchungsreferenz
  suchen, gegebenenfalls persönlich klären. Kein automatischer Wiederholungsversand.
- Verfügbarkeit wird im **Zielkalender** geprüft. Andere Kalender und gleichzeitige
  manuelle Änderungen ausserhalb der Website sind nicht atomar gesperrt.
- Nicht bestätigte Anfragen/Links verfallen nach 30 Tagen. Bestätigte Einträge
  werden im Website-Speicher 30 Tage nach dem Gespräch gelöscht; tägliche
  Bereinigung per Alarm. Mails und der echte Kalendereintrag bleiben bei Infomaniak.
- Bei einem SMTP-Abbruch nach Annahme kann eine manuelle erneute Formulareingabe
  eine weitere Anfrage erzeugen. Es gibt keine automatische Wiederholung.

## Prüfung

`npm test` prüft die Eingaben, Sommer-/Winterzeit, Mail-Inhalte, API-Schutz,
Bestätigungsberechtigung, persistente Zustände, doppelte und parallele
Bestätigungen, Konflikte, Telefon/Video, Kalenderpayload und Fehlerfälle sowie
nach dem Produktionsbuild die bestehenden Seiten. `npx tsc --noEmit` prüft die
Typen. Zusätzliche lokale Runtime-/Browserprüfungen ersetzen keine Live-Abnahme.

Verwendete Protokollquellen:

- [Offizieller Infomaniak Calendar Client](https://github.com/Infomaniak/mcp-server-calendar/blob/main/src/calendar-client.ts)
- [Offizieller Calendar MCP Server: Scopes und Einladungen](https://github.com/Infomaniak/mcp-server-calendar)
- [kMeet API: eindeutige Raum-URLs](https://developer.infomaniak.com/docs/api/post/1/kmeet/rooms)
- [kMeet beitreten](https://www.infomaniak.com/en/support/faq/2473/join-a-kmeet-meeting)
