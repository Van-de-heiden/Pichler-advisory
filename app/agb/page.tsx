import type { Metadata } from 'next';
import { LegalShell } from '../legal-shell';
import { LegalContact } from '../legal-company';

export const metadata: Metadata = {
  title: 'AGB – Pichler Advisory',
  description: 'Allgemeine Geschäftsbedingungen für Beratung, Prozessoptimierung, IT-Projekte, Websites und Betreuung.',
};

export default function AgbPage() {
  return <LegalShell eyebrow="Rechtliches" title="AGB" current="/agb">
    <section>
      <h2>1. Anbieter und Geltungsbereich</h2>
      <LegalContact />
      <p>Diese Allgemeinen Geschäftsbedingungen (AGB) regeln Aufträge von Geschäftskunden an Pichler Advisory für Beratung, Prozessoptimierung, Automatisierung, Apps und IT-Projekte sowie Websites, Hosting, Wartung und Betreuung. Sie gelten, wenn sie vor Vertragsabschluss zur Verfügung gestellt und in die Vereinbarung einbezogen wurden.</p>
      <p>Individuelle Vereinbarungen im Angebot oder Projektvertrag gehen diesen AGB vor. Zwingende gesetzliche Vorschriften bleiben vorbehalten. Die blosse Nutzung dieser Website und eine unverbindliche Anfrage begründen noch keinen kostenpflichtigen Auftrag.</p>
    </section>
    <section>
      <h2>2. Angebot und Auftrag</h2>
      <p>Ein Auftrag kommt durch die Annahme eines konkreten Angebots oder eine entsprechende beidseitige Bestätigung zustande, beispielsweise per E-Mail. Massgebend sind die darin festgehaltenen Leistungen, Ergebnisse, Preise, Zuständigkeiten und Termine. Die Gültigkeitsdauer richtet sich nach dem Angebot; ohne besondere Angabe beträgt sie 14 Tage.</p>
      <p>Ein Auftrag kann einen ganzen Betrieb, einen einzelnen Prozess oder eine bereits definierte technische Umsetzung betreffen. Apps, IT-Projekte und Websites können direkt und ohne vorgängige Betriebsanalyse beauftragt werden. Eine Analyse ist nur Bestandteil des Auftrags, wenn sie vereinbart wurde.</p>
    </section>
    <section>
      <h2>3. Umfang, Änderungen und Zusammenarbeit</h2>
      <p>Pichler Advisory erbringt die vereinbarten Leistungen sorgfältig und fachgerecht. Der Kunde stellt die erforderlichen Informationen, Zugänge, Inhalte und Ansprechpartner bereit und trifft notwendige Entscheidungen rechtzeitig. Beide Seiten informieren einander frühzeitig über Umstände, die Kosten, Umfang oder Termine beeinflussen.</p>
      <p>Zusätzliche Funktionen, geänderte Anforderungen und weitere Arbeiten werden vor ihrer Umsetzung bezüglich Aufwand, Preis und Zeitplan abgestimmt. Sie werden erst nach Freigabe durch den Kunden kostenpflichtig ausgeführt. Bei Verzögerungen durch fehlende Mitwirkung wird ein angepasster Terminplan vereinbart; Mehrkosten werden vorab besprochen.</p>
    </section>
    <section>
      <h2>4. Preise und Zahlung</h2>
      <p>Alle Preise werden in Schweizer Franken vereinbart. Ob eine Leistung zum Festpreis oder nach Aufwand abgerechnet wird, ergibt sich aus dem Angebot. Eine anwendbare Mehrwertsteuer, wiederkehrende Kosten, Lizenzen und weitere Fremdkosten werden im Angebot ausgewiesen. Zusätzliche Fremdkosten werden nur nach vorgängiger Zustimmung ausgelöst.</p>
      <p>Ohne abweichende Vereinbarung sind Rechnungen innerhalb von 30 Tagen ab Rechnungsdatum zahlbar. Anzahlungen, Teilrechnungen und Ratenzahlungen werden im Angebot festgelegt. Bei Zahlungsrückständen erfolgt zunächst eine Mahnung mit angemessener Nachfrist. Weitere Schritte richten sich nach der Vereinbarung und dem anwendbaren Recht.</p>
    </section>
    <section>
      <h2>5. Termine, Prüfung und Übergabe</h2>
      <p>Verbindliche Fertigstellungstermine und Meilensteine werden ausdrücklich vereinbart. Zeichnen sich Abweichungen ab, informiert Pichler Advisory den Kunden über die Ursache und das weitere Vorgehen.</p>
      <p>Bei vereinbarten Arbeitsergebnissen erhält der Kunde Gelegenheit, diese anhand des festgelegten Umfangs zu prüfen. Festgestellte Mängel werden nachvollziehbar dokumentiert und innerhalb angemessener Frist bearbeitet. Für Prüfung, Mängelanzeige, Abnahme und Gewährleistung gelten die gesetzlichen Regeln der jeweiligen Vertragsart, soweit der Projektvertrag keine zulässige abweichende Regelung enthält. Eine Abnahme allein durch Schweigen wird durch diese AGB nicht vereinbart.</p>
    </section>
    <section>
      <h2>6. Nutzungsrechte und Inhalte</h2>
      <p>Nach vollständiger Zahlung erhält der Kunde an den für ihn erstellten Arbeitsergebnissen ein zeitlich unbeschränktes, nicht ausschliessliches Nutzungsrecht für den vereinbarten Zweck. Ein weitergehender oder ausschliesslicher Rechteübergang kann im Angebot vereinbart werden. Die Übergabe von Quellcode, Dokumentation, Konten und Zugangsdaten richtet sich nach dem vereinbarten Lieferumfang.</p>
      <p>Bereits bestehende Methoden, allgemeine Werkzeuge und wiederverwendbare Bausteine bleiben bei Pichler Advisory beziehungsweise ihren Rechteinhabern. Für Open-Source-Komponenten, Bilder, Schriften und andere Drittleistungen gelten deren Lizenzbedingungen; erforderliche Kosten und Nutzungseinschränkungen werden im Projekt offengelegt.</p>
      <p>Der Kunde stellt sicher, dass er die von ihm gelieferten Texte, Bilder, Marken und Daten für das Projekt verwenden darf. Kundennamen, Logos oder Projektergebnisse werden nur mit Zustimmung als Referenz veröffentlicht.</p>
    </section>
    <section>
      <h2>7. Betrieb, Hosting und Betreuung</h2>
      <p>Laufender Betrieb und Betreuung sind eigenständige Leistungen und werden ausdrücklich vereinbart. Das Angebot legt insbesondere Hosting, Wartung, Sicherheitsupdates, Datensicherung, Wiederherstellung und Supportumfang fest. Besondere Verfügbarkeiten, Reaktionszeiten oder Bereitschaftsdienste gelten nur, wenn sie vereinbart wurden.</p>
      <p>Geplante Wartungsarbeiten und erkennbare Störungen werden angemessen kommuniziert. Vor Änderungen an produktiven Systemen stimmen die Parteien die erforderlichen Freigaben und Sicherungsmassnahmen ab. Die Beauftragung von Drittanbietern entbindet Pichler Advisory nicht von den eigenen vereinbarten Pflichten.</p>
    </section>
    <section>
      <h2>8. Vertraulichkeit und Datenschutz</h2>
      <p>Beide Parteien behandeln nicht öffentlich bekannte geschäftliche und technische Informationen vertraulich und verwenden sie nur für die Zusammenarbeit. Das gilt auch nach Beendigung des Auftrags. Gesetzliche Offenlegungspflichten bleiben vorbehalten.</p>
      <p>Soweit Pichler Advisory Personendaten im Auftrag des Kunden bearbeitet, werden vor dem entsprechenden Zugriff die notwendigen Weisungen, Schutzmassnahmen, eingesetzten Dienstleister, Bearbeitungsorte und Regeln zur Rückgabe oder Löschung vereinbart. Weitere Auftragsbearbeiter werden nur mit der erforderlichen Genehmigung eingesetzt. Vertrauliche Kundendaten werden nicht ohne entsprechende Vereinbarung an externe KI-Dienste weitergegeben.</p>
      <p>Informationen zur Datenbearbeitung auf dieser Website und bei Anfragen stehen in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
    </section>
    <section>
      <h2>9. Verantwortung und Haftung</h2>
      <p>Für Pflichtverletzungen, Mängel und Schäden gelten die gesetzlichen Bestimmungen und die im jeweiligen Auftrag zulässig vereinbarten Regelungen. Diese AGB schliessen die Haftung für Absicht, grobe Fahrlässigkeit, Personenschäden oder andere zwingende Haftungstatbestände nicht aus.</p>
      <p>Vertraglich geschuldet sind die vereinbarten Leistungen und zugesicherten Eigenschaften. Wirtschaftliche Ziele und Messgrössen können im Projekt festgelegt werden. Rechenbeispiele auf der Website und allgemeine Leistungsbeschreibungen ersetzen keine solche individuelle Vereinbarung.</p>
    </section>
    <section>
      <h2>10. Laufzeit und Beendigung</h2>
      <p>Projektaufträge enden mit der Erbringung der vereinbarten Leistungen, soweit keine laufende Betreuung vereinbart ist. Für wiederkehrende Leistungen gelten die im Angebot festgehaltene Laufzeit und Kündigungsfrist. Ohne besondere Vereinbarung sind sie mit einer Frist von 30 Tagen auf das Ende eines Monats kündbar.</p>
      <p>Gesetzliche Rechte zur jederzeitigen Beendigung eines Auftrags und zur Beendigung aus wichtigem Grund bleiben vorbehalten. Bei vorzeitiger Beendigung werden die bis dahin erbrachten Leistungen und genehmigten, nicht mehr vermeidbaren Fremdkosten nach Massgabe des Vertrags und des Gesetzes abgerechnet. Bereits geleistete Zahlungen werden angerechnet; nicht geschuldete Vorauszahlungen werden erstattet.</p>
      <p>Eine erforderliche Übergabe von Daten, Zugängen und Arbeitsergebnissen wird rechtzeitig abgestimmt. Gesetzliche Aufbewahrungspflichten sowie vereinbarte Nutzungsrechte und Vertraulichkeitspflichten gelten weiter.</p>
    </section>
    <section>
      <h2>11. Änderungen dieser Bedingungen</h2>
      <p>Für einen Auftrag gilt die bei seinem Abschluss einbezogene Fassung dieser AGB. Eine spätere Veröffentlichung ändert bestehende Verträge nicht automatisch. Änderungen eines laufenden Vertrags werden gesondert vereinbart.</p>
    </section>
    <section>
      <h2>12. Recht und Gerichtsstand</h2>
      <p>Es gilt schweizerisches Recht. Soweit rechtlich zulässig, sind für Streitigkeiten die am Sitz von Pichler Advisory in Gommiswald zuständigen Gerichte vereinbart. Zwingende gesetzliche Gerichtsstände bleiben vorbehalten.</p>
    </section>
  </LegalShell>;
}
