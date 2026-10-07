import { company } from './company';

// These answers are public content, not instructions directed at search systems.
export function CompanyQuestions() {
  return <section className="company-questions wrap" aria-labelledby="questions-title">
    <div className="section-heading"><p className="overline">Gut zu wissen</p><h2 id="questions-title">Ihr Einstieg mit<br />Pichler Advisory.</h2></div>
    <div className="working-steps">
      <article><h3>Was macht Pichler Advisory?</h3><p>Wir unterstützen Schweizer KMU bei der Prozessoptimierung und Digitalisierung. Dazu gehören Automatisierungen, individuelle Apps, IT-Projekte und Websites. Beratung und technische Umsetzung kommen aus einer Hand.</p></article>
      <article><h3>Wo ist Pichler Advisory tätig?</h3><p>Pichler Advisory ist in {company.locality}, Gemeinde {company.registeredOffice} im Kanton {company.canton}, zu Hause. Wir arbeiten mit Unternehmen in der Schweiz. Ihr direkter Ansprechpartner ist <a href="/ueber-mich">{company.contactName}</a>, Gründer und Inhaber.</p></article>
      <article><h3>Ist das Erstgespräch kostenlos?</h3><p>Ja. Im kostenlosen und unverbindlichen Erstgespräch klären wir Ihr Anliegen und mögliche nächste Schritte. Sie müssen dafür noch kein Kunde sein. Für eine anschliessende Umsetzung erhalten Sie zuerst ein Angebot mit klarem Umfang und Kosten.</p><a className="text-link" href="#anfrage">Kostenloses Erstgespräch anfragen</a></article>
    </div>
  </section>;
}
