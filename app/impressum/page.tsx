import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";

export const metadata: Metadata = {
  title: "Impressum – Pichler Advisory",
  description: "Impressum und Anbieterangaben von Pichler Advisory.",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <LegalShell eyebrow="Rechtliches" title="Impressum">
      <section>
        <h2>Verantwortliche Person</h2>
        <p>
          Maurus Nic Ramon Pichler<br />
          Pichler Advisory<br />
          Häberlibodenstrasse 17<br />
          8725 Ernetschwil<br />
          Schweiz
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href="mailto:info@pichler-advisory.ch">info@pichler-advisory.ch</a><br />
          Telefon: <a href="tel:+41775383064">+41 77 538 30 64</a>
        </p>
      </section>

      <section>
        <h2>Unternehmensangaben</h2>
        <p>
          Einzelunternehmen, nicht im Handelsregister eingetragen.<br />
          Pichler Advisory ist nicht mehrwertsteuerpflichtig.
        </p>
      </section>

      <section>
        <h2>Haftung</h2>
        <p>
          Die Inhalte dieser Website werden sorgfältig erstellt und laufend gepflegt. Trotzdem kann Pichler Advisory keine Gewähr für Richtigkeit, Vollständigkeit und Aktualität übernehmen. Verlinkte externe Angebote liegen ausserhalb des Einflussbereichs von Pichler Advisory; für deren Inhalte sind die jeweiligen Betreiber verantwortlich.
        </p>
      </section>

      <section>
        <h2>Urheberrecht</h2>
        <p>
          Inhalte, Gestaltung, Texte und Bilder dieser Website sind urheberrechtlich geschützt. Eine Nutzung ausserhalb der gesetzlichen Schranken ist nur mit vorheriger schriftlicher Zustimmung von Pichler Advisory zulässig.
        </p>
      </section>

      <section>
        <h2>Anwendbares Recht</h2>
        <p>Es gilt schweizerisches Recht, soweit keine zwingenden gesetzlichen Bestimmungen entgegenstehen.</p>
      </section>
    </LegalShell>
  );
}
