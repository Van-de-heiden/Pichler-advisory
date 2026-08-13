import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";

export const metadata: Metadata = {
  title: "Datenschutz – Pichler Advisory",
  description: "Datenschutzerklärung von Pichler Advisory.",
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
  return (
    <LegalShell eyebrow="Rechtliches" title="Datenschutzerklärung">
      <section>
        <h2>1. Verantwortlicher</h2>
        <p>
          Maurus Nic Ramon Pichler, Pichler Advisory<br />
          Häberlibodenstrasse 17, 8725 Ernetschwil, Schweiz<br />
          E-Mail: <a href="mailto:info@pichler-advisory.ch">info@pichler-advisory.ch</a>
        </p>
      </section>

      <section>
        <h2>2. Zweck und Umfang der Bearbeitung</h2>
        <p>
          Pichler Advisory bearbeitet Personendaten nur, soweit dies für den sicheren Betrieb dieser Website, die Kommunikation mit Interessenten und Kunden sowie die Anbahnung oder Abwicklung einer Geschäftsbeziehung erforderlich ist. Dazu können insbesondere Kontakt- und Kommunikationsdaten, Angaben zum Unternehmen sowie technische Zugriffsdaten gehören.
        </p>
      </section>

      <section>
        <h2>3. Zugriff auf die geschützte Website</h2>
        <p>
          Der eingegebene Zugangscode wird serverseitig geprüft und weder im Browser noch in einer Datenbank gespeichert. Nach erfolgreicher Prüfung setzt die Website ein technisch notwendiges, signiertes Sitzungs-Cookie. Es enthält keine Kontakt- oder Profildaten, ist für JavaScript nicht lesbar und endet grundsätzlich mit der Browsersitzung; unabhängig davon verliert der enthaltene Zugriffsnachweis spätestens nach zwölf Stunden seine Gültigkeit.
        </p>
      </section>

      <section>
        <h2>4. Kontaktaufnahme</h2>
        <p>
          Das Anfrageformular übermittelt keine Angaben an einen Website-Server. Es erstellt lokal eine vorbereitete E-Mail und öffnet dafür das auf Ihrem Gerät eingerichtete E-Mail-Programm. Erst wenn Sie diese E-Mail absenden, werden die darin enthaltenen Angaben über die beteiligten E-Mail-Anbieter an Pichler Advisory übermittelt und zur Bearbeitung Ihrer Anfrage verwendet.
        </p>
        <p>
          Kommunikations- und Geschäftsdaten werden so lange aufbewahrt, wie dies für den jeweiligen Zweck oder aufgrund gesetzlicher Aufbewahrungspflichten erforderlich ist.
        </p>
      </section>

      <section>
        <h2>5. Hosting und technische Protokolle</h2>
        <p>
          Diese Website wird über die Infrastruktur von Cloudflare bereitgestellt. Cloudflare kann dabei technische Daten wie IP-Adresse, Zeitpunkt, angeforderte Adresse, Browser- und Geräteinformationen sowie Sicherheitsereignisse verarbeiten. Diese Bearbeitung dient der Auslieferung, Stabilität und Sicherheit der Website.
        </p>
        <p>
          Cloudflare ist international tätig; eine Bearbeitung kann deshalb auch ausserhalb der Schweiz erfolgen. Dabei werden die nach anwendbarem Datenschutzrecht vorgesehenen Garantien eingesetzt. Weitere Informationen finden Sie in der <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Datenschutzerklärung von Cloudflare</a> und im <a href="https://www.cloudflare.com/cloudflare-customer-dpa/" target="_blank" rel="noreferrer">Data Processing Addendum</a>.
        </p>
      </section>

      <section>
        <h2>6. Schriftarten, Analyse und Marketing</h2>
        <p>
          Die verwendeten Schriftarten werden lokal von dieser Website ausgeliefert. Es werden keine Analyse-, Tracking- oder Marketingdienste eingesetzt und keine entsprechenden Cookies gesetzt.
        </p>
      </section>

      <section>
        <h2>7. Externe Links</h2>
        <p>
          Diese Website enthält Links zu Angeboten Dritter. Beim Aufruf gelten die Datenschutzbestimmungen der jeweiligen Betreiber. Pichler Advisory hat keinen Einfluss auf deren Datenbearbeitung.
        </p>
      </section>

      <section>
        <h2>8. Ihre Rechte</h2>
        <p>
          Betroffene Personen können im Rahmen des anwendbaren Schweizer Datenschutzrechts insbesondere Auskunft über bearbeitete Personendaten verlangen und unrichtige Daten berichtigen lassen. Soweit die gesetzlichen Voraussetzungen erfüllt sind, können weitere Ansprüche wie Löschung, Herausgabe oder Einschränkung einer Bearbeitung bestehen. Anfragen richten Sie bitte an <a href="mailto:info@pichler-advisory.ch">info@pichler-advisory.ch</a>.
        </p>
      </section>

      <section>
        <h2>9. Datensicherheit und Änderungen</h2>
        <p>
          Pichler Advisory trifft angemessene technische und organisatorische Massnahmen zum Schutz von Personendaten. Diese Datenschutzerklärung kann angepasst werden, wenn sich die Website, eingesetzte Dienste oder rechtliche Anforderungen ändern. Massgebend ist die jeweils hier veröffentlichte Fassung.
        </p>
      </section>

      <p className="legal-updated">Stand: August 2026</p>
    </LegalShell>
  );
}
