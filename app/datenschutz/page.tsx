import type { Metadata } from 'next';
import { LegalShell } from '../legal-shell';
import { LegalContact } from '../legal-company';

export const metadata: Metadata = {
  title: 'Datenschutz – Pichler Advisory',
  description: 'Wie Pichler Advisory Personendaten auf dieser Website und bei Anfragen bearbeitet.',
};

export default function DatenschutzPage() {
  return <LegalShell eyebrow="Rechtliches" title="Datenschutzerklärung" current="/datenschutz">
    <section>
      <h2>1. Verantwortlich für die Datenbearbeitung</h2>
      <LegalContact />
      <p>Diese Erklärung beschreibt die Bearbeitung von Personendaten beim Besuch dieser Website und bei der Kontaktaufnahme mit Pichler Advisory. Massgebend ist insbesondere das Schweizer Datenschutzgesetz (DSG). Für die Bearbeitung von Kundendaten im Rahmen eines Projekts werden die jeweiligen Aufgaben und Datenschutzpflichten zusätzlich vertraglich geregelt.</p>
    </section>
    <section>
      <h2>2. Websitebesuch und Hosting</h2>
      <p>Diese Website wird über Cloudflare Workers bereitgestellt. Beim Abruf können insbesondere IP-Adresse, Zeitpunkt, angeforderte Seite, übertragene Datenmenge, Browser- und Geräteinformationen sowie technische Fehler- und Sicherheitsdaten bearbeitet werden. Das dient der Auslieferung der Website, der Fehlerbehebung und dem Schutz vor Missbrauch.</p>
      <p>Cloudflare, Inc. hat ihren Sitz in den USA. Weitere Angaben zu den Datenbearbeitungen des Hosting-Anbieters finden Sie in der <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Cloudflare</a>.</p>
    </section>
    <section>
      <h2>3. Rechner, Beispiele und Anfrageformular</h2>
      <p>Der Zeit- und Kostenrechner und die interaktive Rapport-Demo laufen im Browser. Die eingegebenen Werte werden durch diese Funktionen weder an Pichler Advisory übermittelt noch in einer Datenbank oder im lokalen Browserspeicher abgelegt. Sie bleiben nur im laufenden Seitenaufruf erhalten. Die Demo ist für Beispieldaten gedacht.</p>
      <p>Auch das Anfrageformular sendet die Angaben nicht an einen Website-Server. Es erstellt aus Name, E-Mail-Adresse, ausgewähltem Thema und Nachricht einen lokalen Entwurf. Sie können diesen in Ihrem E-Mail-Programm öffnen oder den Text per Schaltfläche in Ihre Zwischenablage kopieren. Erst wenn Sie die E-Mail selbst absenden, erhält Pichler Advisory Ihre Anfrage über die beteiligten E-Mail-Dienste.</p>
    </section>
    <section>
      <h2>4. Anfragen und Geschäftsbeziehungen</h2>
      <p>Wenn Sie uns per E-Mail oder Telefon kontaktieren, bearbeiten wir die von Ihnen mitgeteilten Kontakt-, Unternehmens- und Kommunikationsdaten, um Ihre Anfrage zu beantworten, ein Angebot zu erstellen und einen vereinbarten Auftrag abzuwickeln. Bei einem Auftrag kommen die erforderlichen Vertrags-, Projekt- und Rechnungsdaten hinzu.</p>
      <p>Zugriff erhalten die Personen und Dienstleister, die diese Angaben für die jeweilige Aufgabe benötigen, etwa für Kommunikation, technische Bereitstellung oder Abrechnung. Eine Bekanntgabe an Behörden erfolgt, wenn eine gesetzliche Pflicht besteht. Für die eigentliche Projektbearbeitung legen wir erforderliche Zugriffe, eingesetzte Dienste und Verantwortlichkeiten im Auftrag fest.</p>
    </section>
    <section>
      <h2>5. Browserspeicher, Cookies und Zugangsschutz</h2>
      <p>Die Schriftarten und Bilder werden zusammen mit dieser Website ausgeliefert. Pichler Advisory hat im Seitencode keine Werbepixel, Besucheranalyse oder eingebetteten Social-Media-Dienste eingerichtet. Die Website verwendet keinen eigenen lokalen Speicher für die Eingaben im Formular, Rechner oder in der Demo.</p>
      <p>Für die Einstiegsanimation wird im Sitzungsspeicher des Browsers lediglich vermerkt, ob sie bereits angezeigt wurde. Dadurch erscheint sie beim Seitenwechsel oder Neuladen nicht erneut. Der Vermerk gilt nur für die laufende Tabsitzung, enthält keine Besucherkennung und wird nicht an Pichler Advisory übermittelt.</p>
      <p>Die öffentliche Website benötigt keine Anmeldung. Der Hosting-Anbieter kann für technische Sicherheitsfunktionen notwendige Cookies einsetzen. Cookies lassen sich über die Einstellungen Ihres Browsers verwalten. Für den separat verlinkten internen OS-Zugang gelten dessen Zugangsregeln und Datenschutzhinweise.</p>
    </section>
    <section>
      <h2>6. Datenbearbeitung im Ausland</h2>
      <p>Der Hosting-Anbieter bearbeitet Daten auch ausserhalb der Schweiz. Nach seinen Datenschutzhinweisen gehören dazu die USA und weitere Länder, in denen Cloudflare oder seine Dienstleister tätig sind. Die verlinkten Hinweise erläutern die Bearbeitungsorte und Übermittlungsmechanismen.</p>
      <p>Cloudflare nennt für Übermittlungen aus der Schweiz in die USA seine Zertifizierung unter dem Swiss–U.S. Data Privacy Framework und für weitere Übermittlungen insbesondere Standardvertragsklauseln. Auskünfte zur Bearbeitung Ihrer Daten können Sie jederzeit bei uns anfordern.</p>
    </section>
    <section>
      <h2>7. Aufbewahrung und Datensicherheit</h2>
      <p>Wir bewahren Personendaten so lange auf, wie sie für den jeweiligen Zweck, die Abwicklung eines Auftrags, gesetzliche Pflichten oder die Wahrung von Rechtsansprüchen erforderlich sind. Danach werden sie gelöscht oder anonymisiert. Für technische Protokolle der Plattformanbieter gelten deren dokumentierte Aufbewahrungsregeln. Browser-Eingaben in den Beispielen und im Formular werden von Pichler Advisory nicht dauerhaft gespeichert.</p>
      <p>Wir setzen dem jeweiligen Risiko angemessene technische und organisatorische Schutzmassnahmen ein. Die Website wird verschlüsselt über HTTPS ausgeliefert; interne Anwendungen sind zugangsbeschränkt. Falls für ein Projekt besonders schützenswerte oder vertrauliche Daten benötigt werden, vereinbaren wir dafür einen geeigneten Übermittlungsweg.</p>
    </section>
    <section>
      <h2>8. Ihre Rechte</h2>
      <p>Sie können nach Massgabe des anwendbaren Rechts Auskunft über die Bearbeitung Ihrer Personendaten verlangen sowie unrichtige Daten berichtigen lassen. Unter den gesetzlichen Voraussetzungen bestehen weitere Rechte, insbesondere auf Löschung, Widerspruch gegen eine Bearbeitung sowie Herausgabe oder Übertragung von Daten. Eine erteilte Einwilligung können Sie für die Zukunft widerrufen.</p>
      <p>Richten Sie Ihr Anliegen an <a href="mailto:info@pichler-advisory.ch">info@pichler-advisory.ch</a>. Für eine sichere Bearbeitung können wir einen angemessenen Identitätsnachweis verlangen. Sie können sich auch an den <a href="https://www.edoeb.admin.ch/de/kontakt" target="_blank" rel="noopener noreferrer">Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)</a> wenden.</p>
    </section>
    <section>
      <h2>9. Externe Links und Änderungen</h2>
      <p>Externe Links, einschliesslich des internen OS-Zugangs, öffnen eigenständige Angebote. Es werden dadurch keine Formular- oder Rechnerangaben mitgegeben. Für die Nutzung des jeweiligen Angebots gelten dessen Zugangsregeln und Datenschutzhinweise.</p>
      <p>Wir passen diese Erklärung an, wenn sich die eingesetzten Funktionen oder Datenbearbeitungen ändern. Das Fassungsdatum steht am Anfang dieser Seite.</p>
    </section>
  </LegalShell>;
}
