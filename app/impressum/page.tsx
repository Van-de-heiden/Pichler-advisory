import { pageMetadata } from "../seo";
import { LegalShell } from "../legal-shell";
import { LegalContact } from "../legal-company";
import { company } from "../company";

export const metadata = pageMetadata('/impressum',
  "Impressum – Pichler Advisory",
  "Impressum und Anbieterangaben von Pichler Advisory.",
);

export default function ImpressumPage() {
  return (
    <LegalShell eyebrow="Rechtliches" title="Impressum" current="/impressum">
      <section>
        <h2>Anbieter und inhaltlich verantwortlich</h2>
        <LegalContact />
      </section>

      <section>
        <h2>Unternehmens- und Registerangaben</h2>
        <dl className="company-details">
          <div><dt>Eingetragene Firma</dt><dd>{company.name}</dd></div>
          <div><dt>Rechtsform</dt><dd>{company.legalForm}</dd></div>
          <div><dt>Inhaber</dt><dd>{company.owner}</dd></div>
          <div><dt>Sitz</dt><dd>{company.registeredOffice}, Kanton {company.canton}</dd></div>
          <div><dt>Handelsregister</dt><dd>Kanton {company.canton}</dd></div>
          <div><dt>Status</dt><dd>Im Handelsregister eingetragen · {company.status}</dd></div>
          <div><dt>UID</dt><dd>{company.uid}</dd></div>
          <div><dt>CH-ID</dt><dd>{company.commercialRegisterId}</dd></div>
          <div><dt>EHRA-ID</dt><dd>{company.ehraId}</dd></div>
        </dl>
      </section>

      <section>
        <h2>Tätigkeit</h2>
        <p>{company.name} ist das im Handelsregister des Kantons {company.canton} eingetragene Einzelunternehmen von {company.owner} mit Sitz in {company.registeredOffice}. Das Angebot umfasst Beratung und Prozessoptimierung, Automatisierung, Apps und IT-Projekte sowie die Erstellung, den Betrieb und die Betreuung von Websites und Anwendungen.</p>
      </section>

      <section>
        <h2>Inhalte und externe Links</h2>
        <p>Diese Website informiert über die Leistungen von Pichler Advisory. Massgebend für einen Auftrag sind das vereinbarte Angebot und die einbezogenen <a href="/agb">AGB</a>. Illustrative Ansichten im Leistungsbereich zeigen mögliche Lösungen und sind keine Kundenreferenzen.</p>
        <p>Externe Links führen zu eigenständigen Angeboten anderer Betreiber. Hinweise auf fehlerhafte Inhalte oder Links nehmen wir unter der oben angegebenen E-Mail-Adresse entgegen. Gesetzliche Haftungsansprüche bleiben unberührt.</p>
      </section>

      <section>
        <h2>Urheberrecht</h2>
        <p>
          Inhalte, Gestaltung, Texte und Bilder dieser Website sind urheberrechtlich geschützt. Für entsprechend gekennzeichnete Inhalte Dritter gelten die angegebenen Lizenzen. Im Übrigen ist eine Nutzung ausserhalb der gesetzlichen Schranken nur mit vorheriger schriftlicher Zustimmung von Pichler Advisory zulässig.
        </p>
      </section>

      <section id="bildnachweise">
        <h2>Bildnachweise</h2>
        <p>Porträt von Maurus Pichler: bereitgestelltes Bildmaterial von Pichler Advisory.</p>
        <p>Die Landschaftsillustration und die fiktiven Website-Beispiele wurden für diesen Auftritt mit KI-Unterstützung gestaltet. Die App- und Prozessansichten sind illustrative Gestaltungsbeispiele. Sie zeigen keine realen Kundenprojekte und sind keine Kundenreferenzen.</p>
        <p>Ein Teil der verwendeten Symbole basiert auf <a href="https://lucide.dev/license" target="_blank" rel="noreferrer">Lucide</a> (ISC-Lizenz). Die lokal bereitgestellten Schriften Manrope und Newsreader werden unter der SIL Open Font License verwendet; das P-Signet basiert auf Newsreader. Die <a href="/licenses/Newsreader-OFL.txt">Lizenz für Newsreader</a> und die <a href="/licenses/Manrope-OFL.txt">Lizenz für Manrope</a> sind hier abrufbar.</p>
      </section>

      <section>
        <h2>Anwendbares Recht</h2>
        <p>Es gilt schweizerisches Recht, soweit keine zwingenden gesetzlichen Bestimmungen entgegenstehen.</p>
      </section>
    </LegalShell>
  );
}
