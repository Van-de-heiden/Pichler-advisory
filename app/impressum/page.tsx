import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";
import { LegalContact } from "../legal-company";

export const metadata: Metadata = {
  title: "Impressum – Pichler Advisory",
  description: "Impressum und Anbieterangaben von Pichler Advisory.",
};

export default function ImpressumPage() {
  return (
    <LegalShell eyebrow="Rechtliches" title="Impressum" current="/impressum">
      <section>
        <h2>Anbieter und inhaltlich verantwortlich</h2>
        <LegalContact />
      </section>

      <section>
        <h2>Tätigkeit</h2>
        <p>Pichler Advisory ist ein Einzelunternehmen von Maurus Nic Ramon Pichler. Das Angebot umfasst Beratung und Prozessoptimierung, Automatisierung, Apps und IT-Projekte sowie die Erstellung, den Betrieb und die Betreuung von Websites und Anwendungen.</p>
      </section>

      <section>
        <h2>Inhalte und externe Links</h2>
        <p>Diese Website informiert über die Leistungen von Pichler Advisory. Massgebend für einen Auftrag sind das vereinbarte Angebot und die einbezogenen <a href="/agb">AGB</a>. Die interaktiven Beispiele veranschaulichen mögliche Lösungen; der Rechner zeigt den Gegenwert von Arbeitszeit anhand der gewählten Angaben.</p>
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
        <p>
          Matterhorn: <a href="https://commons.wikimedia.org/wiki/File:Matterhorn_Monte_Cervino.jpg" target="_blank" rel="noreferrer">«Matterhorn Monte Cervino»</a> von Belappetit / Rene Reichelt, Wikimedia Commons.
          {' '}Lizenz: <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>.
          {' '}Bearbeitung für diese Website: Hintergrund mithilfe von KI freigestellt, Bildausschnitt angepasst und als WebP ausgegeben. Die bearbeitete Bilddatei steht ebenfalls unter CC BY-SA 3.0.
        </p>
      </section>

      <section>
        <h2>Anwendbares Recht</h2>
        <p>Es gilt schweizerisches Recht, soweit keine zwingenden gesetzlichen Bestimmungen entgegenstehen.</p>
      </section>
    </LegalShell>
  );
}
