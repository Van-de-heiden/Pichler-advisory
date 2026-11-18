import { pageMetadata } from '../seo';
import { LegalShell } from '../legal-shell';
import { LegalContact } from '../legal-company';
import { company } from '../company';

export const metadata = pageMetadata('/datenschutz',
  'Datenschutz – Pichler Advisory',
  'Wie Pichler Advisory Personendaten auf dieser Website und bei Anfragen bearbeitet.',
);

export default function DatenschutzPage() {
  return <LegalShell eyebrow="Rechtliches" title="Datenschutzerklärung" current="/datenschutz">
    <section>
      <h2>1. Verantwortlich für die Datenbearbeitung</h2>
      <LegalContact />
      <p>Verantwortlich ist {company.owner} als Inhaber des eingetragenen Einzelunternehmens {company.name} mit Sitz in {company.registeredOffice}.</p>
      <p>Diese Erklärung beschreibt die Bearbeitung von Personendaten beim Besuch dieser Website und bei der Kontaktaufnahme mit Pichler Advisory. Massgebend ist insbesondere das Schweizer Datenschutzgesetz (DSG). Für die Bearbeitung von Kundendaten im Rahmen eines Projekts werden die jeweiligen Aufgaben und Datenschutzpflichten zusätzlich vertraglich geregelt.</p>
    </section>
    <section>
      <h2>2. Websitebesuch und Hosting</h2>
      <p>Diese Website wird über Cloudflare Workers bereitgestellt. Beim Abruf können insbesondere IP-Adresse, Zeitpunkt, angeforderte Seite, übertragene Datenmenge, Browser- und Geräteinformationen sowie technische Fehler- und Sicherheitsdaten bearbeitet werden. Das dient der Auslieferung der Website, der Fehlerbehebung und dem Schutz vor Missbrauch.</p>
      <p>Cloudflare, Inc. hat ihren Sitz in den USA. Weitere Angaben zu den Datenbearbeitungen des Hosting-Anbieters finden Sie in der <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Cloudflare</a>.</p>
    </section>
    <section>
      <h2>3. Anfrageformular und Bearbeitung der Anfrage</h2>
      <p>Wenn Sie eine Nachricht oder Terminanfrage absenden, werden Ihre Angaben verschlüsselt an den Website-Server bei Cloudflare übertragen und im geschützten internen Anfrageregister von Pichler Advisory auf Cloudflare gespeichert. Dazu gehören Name und E-Mail-Adresse sowie gegebenenfalls Unternehmen, Telefonnummer, Thema, Nachricht, gewünschte Gesprächsform und zwei oder drei Wunschtermine. Wir verwenden diese Angaben, um Ihre Anfrage zu beantworten und einen Termin mit Ihnen abzustimmen. Die bestätigte Erfassung erhält eine Referenznummer.</p>
      <p>Zusätzlich wird eine interne Benachrichtigung über den Schweizer E-Mail- und Kalenderanbieter Infomaniak an Pichler Advisory veranlasst. Die Eingangsbestätigung im Formular bestätigt die Erfassung im internen Anfrageregister; sie ist keine Zusage über die Zustellung dieser Benachrichtigung.</p>
      <p>Für Terminanfragen werden die Angaben zusätzlich für die geschützte persönliche Terminbestätigung bei Cloudflare gespeichert. Nach persönlicher Bestätigung werden Name, E-Mail-Adresse, gewählte Terminzeit und Gesprächsform sowie gegebenenfalls Unternehmen, Telefonnummer, Thema und der von Ihnen eingegebene Nachrichtentext an Infomaniak Calendar übermittelt. Diese Angaben werden in den Kalendereintrag aufgenommen; der Versand einer Einladung an Ihre E-Mail-Adresse wird veranlasst. Bei Video enthält der Termin einen individuellen kMeet-Link; bei Telefon die vereinbarte Rufnummer. Ein Termin steht erst nach persönlicher Bestätigung fest.</p>
      <p>Zum Schutz vor automatisierten Anfragen werden ein unsichtbares Zusatzfeld und eine zeitlich begrenzte Begrenzung von Anfragen anhand der IP-Adresse eingesetzt. Die Inhalte Ihrer Anfrage und Mailzugangsdaten werden vom Formular nicht in technische Fehlerprotokolle geschrieben. Weitere Informationen zum E-Mail-Anbieter finden Sie in der <a href="https://www.infomaniak.com/de/agb/datenschutzrichtlinien" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Infomaniak</a>.</p>
    </section>
    <section>
      <h2>4. Anfragen und Geschäftsbeziehungen</h2>
      <p>Wenn Sie uns über das Formular, per E-Mail oder Telefon kontaktieren, bearbeiten wir die von Ihnen mitgeteilten Kontakt-, Unternehmens- und Kommunikationsdaten, um Ihre Anfrage zu beantworten, ein Angebot zu erstellen und einen vereinbarten Auftrag abzuwickeln. Bei einem Auftrag kommen die erforderlichen Vertrags-, Projekt- und Rechnungsdaten hinzu.</p>
      <p>Zugriff erhalten die Personen und Dienstleister, die diese Angaben für die jeweilige Aufgabe benötigen, etwa für Kommunikation, technische Bereitstellung oder Abrechnung. Eine Bekanntgabe an Behörden erfolgt, wenn eine gesetzliche Pflicht besteht. Für die eigentliche Projektbearbeitung legen wir erforderliche Zugriffe, eingesetzte Dienste und Verantwortlichkeiten im Auftrag fest.</p>
    </section>
    <section>
      <h2>5. Browserspeicher, Cookies und Zugangsschutz</h2>
      <p>Die Schriftarten und Bilder werden zusammen mit dieser Website ausgeliefert. Pichler Advisory hat im Seitencode keine Werbepixel, Besucheranalyse oder eingebetteten Social-Media-Dienste eingerichtet. Die eigentlichen Formulareingaben werden nicht im lokalen Browserspeicher abgelegt. Für eine wiederholte Übermittlung derselben Anfrage werden jedoch eine zufällige Anfragereferenz und ein kryptografischer Fingerabdruck der Eingaben im Sitzungsspeicher des Browsers gespeichert. So kann eine Wiederholung derselben Anfrage erkannt werden, ohne die Formulardaten dort nochmals abzulegen. Die Referenz wird zur Zuordnung und zum Schutz vor doppelter Bearbeitung an den Server übermittelt. Der Eintrag dient nur der Wiederholung Ihrer Anfrage und bleibt während der Browser-Tabsitzung erhalten, auch beim Neuladen. Der im Browser berechnete Fingerabdruck wird nicht mit der Anfrage übertragen.</p>
      <p>Die öffentliche Website benötigt keine Anmeldung. Der Hosting-Anbieter kann für technische Sicherheitsfunktionen notwendige Cookies einsetzen. Cookies lassen sich über die Einstellungen Ihres Browsers verwalten.</p>
      <p>Die interaktiven App-, Prozess- und Website-Beispiele verwenden fiktive Beispieldaten. Ihre Auswahl in diesen Beispielen wird nicht an ein Anfrage- oder KI-System übermittelt. Für die Anzeige der mit KI-Unterstützung gestalteten Bilder wird keine Verbindung zu einem KI-Dienst aufgebaut.</p>
    </section>
    <section>
      <h2>6. Datenbearbeitung im Ausland</h2>
      <p>Der Hosting-Anbieter bearbeitet Daten auch ausserhalb der Schweiz. Nach seinen Datenschutzhinweisen gehören dazu die USA und weitere Länder, in denen Cloudflare oder seine Dienstleister tätig sind. Die verlinkten Hinweise erläutern die Bearbeitungsorte und Übermittlungsmechanismen.</p>
      <p>Cloudflare nennt für Übermittlungen aus der Schweiz in die USA seine Zertifizierung unter dem Swiss–U.S. Data Privacy Framework und für weitere Übermittlungen insbesondere Standardvertragsklauseln. Auskünfte zur Bearbeitung Ihrer Daten können Sie jederzeit bei uns anfordern.</p>
    </section>
    <section>
      <h2>7. Aufbewahrung und Datensicherheit</h2>
      <p>Wir bewahren Personendaten so lange auf, wie sie für den jeweiligen Zweck, die Abwicklung eines Auftrags, gesetzliche Pflichten oder die Wahrung von Rechtsansprüchen erforderlich sind. Danach werden sie gelöscht oder anonymisiert. Für technische Protokolle der Plattformanbieter gelten deren dokumentierte Aufbewahrungsregeln. </p>
      <p>Die Website selbst hält nicht abgesendete Formulareingaben nur im laufenden Seitenaufruf vor. Abgesendete Anfragen werden im internen Anfrageregister und gegebenenfalls im E-Mail-Postfach bearbeitet. Für diese Daten gelten die oben beschriebenen zweckgebundenen Aufbewahrungskriterien. </p>
      <p>Die folgende technische Löschfrist betrifft ausschliesslich den separaten Speicher für die Terminbestätigung, nicht das interne Anfrageregister, das E-Mail-Postfach oder den Kalender. Die Website speichert Terminanfragen für die geschützte Bestätigung und zur Vermeidung doppelter Kalendereinträge. Offene oder unklare Anfragen laufen in diesem separaten Speicher 30 Tage nach ihrer Anlage ab, bestätigte Termine 30 Tage nach dem Ende des Gesprächs. Abgelaufene Datensätze werden bei der täglichen Bereinigung gelöscht. Einträge und Einladungen im Infomaniak-Kalender sowie E-Mails unterliegen der oben beschriebenen zweckgebundenen Aufbewahrung.</p>
      <p>Wir setzen dem jeweiligen Risiko angemessene technische und organisatorische Schutzmassnahmen ein. Die Website wird verschlüsselt über HTTPS ausgeliefert; interne Anwendungen sind zugangsbeschränkt. Falls für ein Projekt besonders schützenswerte oder vertrauliche Daten benötigt werden, vereinbaren wir dafür einen geeigneten Übermittlungsweg.</p>
    </section>
    <section>
      <h2>8. Ihre Rechte</h2>
      <p>Sie können nach Massgabe des anwendbaren Rechts Auskunft über die Bearbeitung Ihrer Personendaten verlangen sowie unrichtige Daten berichtigen lassen. Unter den gesetzlichen Voraussetzungen bestehen weitere Rechte, insbesondere auf Löschung, Widerspruch gegen eine Bearbeitung sowie Herausgabe oder Übertragung von Daten. Eine erteilte Einwilligung können Sie für die Zukunft widerrufen.</p>
      <p>Richten Sie Ihr Anliegen an <a href="mailto:info@pichler-advisory.ch">info@pichler-advisory.ch</a>. Für eine sichere Bearbeitung können wir einen angemessenen Identitätsnachweis verlangen. Sie können sich auch an den <a href="https://www.edoeb.admin.ch/de/kontakt" target="_blank" rel="noopener noreferrer">Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)</a> wenden.</p>
    </section>
    <section>
      <h2>9. Externe Links und Änderungen</h2>
      <p>Externe Links öffnen eigenständige Angebote. Es werden dadurch keine Formularangaben mitgegeben. Für die Nutzung des jeweiligen Angebots gelten dessen Zugangsregeln und Datenschutzhinweise.</p>
      <p>Wir passen diese Erklärung an, wenn sich die eingesetzten Funktionen oder Datenbearbeitungen ändern. Das Fassungsdatum steht am Anfang dieser Seite.</p>
    </section>
  </LegalShell>;
}
