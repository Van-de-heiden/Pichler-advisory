/* eslint-disable @next/next/no-img-element */

import { ContactForm, LeakCalculator, MethodExplorer, MotionLayer, ProcessRunner } from "./experience";
import { cookies } from "next/headers";
import { AccessGate } from "./access-gate";
import { accessCookie, hasValidAccessToken } from "./access-control";

export const dynamic = "force-dynamic";

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
);

const signals = [
  ["Büroarbeit nach Feierabend", "Offerten, Rechnungen und Nachbearbeitung beginnen erst, wenn draussen längst Ruhe ist."],
  ["Offerten gehen zu spät raus", "Fehlende Angaben, Preise oder Freigaben bremsen – während der Kunde auf eine Antwort wartet."],
  ["Rechnungen warten auf Zettel", "Stunden, Material und Rapporte müssen zuerst zusammengesucht oder nachgefragt werden."],
  ["Alles läuft über den Inhaber", "Bei jeder Ausnahme braucht es Ihre Entscheidung. Ohne Sie bleibt der nächste Schritt stehen."],
];

const services = [
  {
    number: "01",
    label: "Der klare Einstieg",
    title: "Prozessdiagnose",
    text: "Ich verfolge mit Ihnen einen echten Vorgang durch den Betrieb. So wird sichtbar, wo Zeit verloren geht, Informationen doppelt erfasst werden und Arbeit liegen bleibt.",
    result: "Sie erhalten eine priorisierte, wirtschaftlich begründete Empfehlung – kein allgemeines Digitalisierungskonzept.",
  },
  {
    number: "02",
    label: "Die eigentliche Veränderung",
    title: "Prozessumbau",
    text: "Unnötige Schritte verschwinden, Zuständigkeiten werden klar und vorhandene Systeme werden so eingerichtet, dass sie sinnvoll zusammenspielen.",
    result: "Ein schlanker Soll-Ablauf, den Ihr Team versteht und im Tagesgeschäft tatsächlich verwenden kann.",
  },
  {
    number: "03",
    label: "Die technische Entlastung",
    title: "Automation & Betrieb",
    text: "Wiederkehrende Arbeit wird zuverlässig automatisiert. Danach messe ich nach, begleite die Einführung und passe an, bis der Ablauf stabil funktioniert.",
    result: "Weniger manuelle Arbeit, weniger Fehler und eine persönliche Ansprechperson statt einer anonymen Hotline.",
  },
];

const faqs = [
  {
    q: "Müssen wir dafür eine neue Software einführen?",
    a: "Nicht zwingend – und häufig gerade nicht. Zuerst wird geprüft, was Ihre bestehenden Systeme bereits können. Neue Software kommt nur hinzu, wenn sie einen klaren wirtschaftlichen Nutzen bringt.",
  },
  {
    q: "Unser Betrieb ist klein. Lohnt sich das überhaupt?",
    a: "Kleine Betriebe profitieren besonders, wenn wiederkehrende Administration am Inhaber hängen bleibt. Entscheidend ist nicht die Mitarbeiterzahl, sondern wie häufig ein Ablauf vorkommt und wie viel Zeit, Geld oder Nerven er bindet.",
  },
  {
    q: "Kennen Sie unsere Branche gut genug?",
    a: "Sie bleiben der Fachmann für Ihre Leistung. Meine Aufgabe ist der Blick auf Übergaben, Informationen, Zuständigkeiten und Systeme. Ich treffe keine fachlichen Annahmen, sondern arbeite mit realen Vorgängen aus Ihrem Betrieb.",
  },
  {
    q: "Was passiert im ersten Gespräch?",
    a: "Wir sprechen nicht abstrakt über Digitalisierung. Sie nennen mir einen Ablauf, der Sie regelmässig Zeit kostet. Gemeinsam prüfen wir, ob dort genügend Potenzial für eine vertiefte Diagnose besteht. Wenn nicht, sage ich das ebenso offen.",
  },
];

const manifesto = "Ein guter Prozess fällt nicht auf. Die Arbeit fliesst. Informationen werden einmal erfasst. Und der nächste Schritt beginnt, ohne dass der Inhaber nachfassen muss.";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(accessCookie.name)?.value;
  if (!(await hasValidAccessToken(token))) return <AccessGate />;

  return (
    <>
      <MotionLayer />
      <header className="site-header" data-site-header>
        <div className="shell nav-wrap">
          <a className="brand" href="#top" aria-label="Pichler Advisory – Startseite">
            <img src="/shield.png" alt="" width="32" height="39" />
            <span className="brand-name">Pichler Advisory</span>
          </a>
          <nav aria-label="Hauptnavigation">
            <a href="#ausgangslage">Ausgangslage</a>
            <a href="#ansatz">Mein Ansatz</a>
            <a href="#leistungen">Leistungen</a>
            <a href="#ueber-mich">Über mich</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
          <a className="button button-small" href="#kontakt">
            Erstgespräch anfragen
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy" data-reveal>
              <p className="eyebrow">Prozessoptimierung &amp; Automatisierung für Schweizer KMU</p>
              <h1>
                Weniger Arbeit drumherum.
                <em>Mehr Zeit fürs Geschäft.</em>
              </h1>
              <p className="hero-lede">
                Pichler Advisory vereinfacht gewachsene Abläufe, eliminiert Doppelerfassungen und verbindet Ihre bestehenden Systeme – damit weniger Büroarbeit am Abend und Wochenende liegen bleibt.
              </p>
              <div className="hero-actions">
                <a className="button" href="#kontakt">
                  Ablauf unverbindlich prüfen <Arrow />
                </a>
                <a className="text-link" href="#ansatz">Was genau ich mache <Arrow /></a>
              </div>
              <div className="hero-assurance">
                <span><Check /> Unabhängig von Softwareanbietern</span>
                <span><Check /> Analyse und Umsetzung aus einer Hand</span>
                <span><Check /> Keine neue Software ohne klaren Nutzen</span>
              </div>
            </div>

            <div className="hero-media" data-reveal="scale">
              <img
                src="/hero-consultation-authentic.jpeg"
                alt="Maurus Pichler prüft einen realen Betriebsablauf vor Ort in einem Schweizer KMU"
                width="1086"
                height="1448"
                loading="eager"
                fetchPriority="high"
              />
              <div className="hero-caption">
                <span className="caption-mark"><Check /></span>
                <div><strong>Persönlich vor Ort</strong><small>Am echten Ablauf – nicht in einer Softwaredemo.</small></div>
              </div>
              <div className="hero-stamp"><span>Ihr Ansprechpartner</span><strong>Maurus Pichler</strong></div>
            </div>
          </div>
        </section>

        <LeakCalculator />

        <section className="section section-soft" id="ausgangslage">
          <div className="shell">
            <div className="section-intro split-intro">
              <div>
                <p className="eyebrow">Wo im Alltag Zeit verloren geht</p>
                <h2>Tagsüber der Betrieb.<br /><em>Nach Feierabend das Büro.</em></h2>
              </div>
              <p>Das Muster aus meinen ersten Gesprächen mit lokalen Betrieben: Tagsüber läuft das operative Geschäft. Offerten, Rechnungen und Nachbearbeitung wandern in den Abend oder ins Wochenende.</p>
            </div>
            <div className="signals-grid">
              {signals.map(([title, text], index) => (
                <article className="signal" key={title} tabIndex={0} data-reveal>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>

            <div className="pain-stats-heading" data-reveal>
              <p className="eyebrow">Der administrative Preis</p>
              <h3>Was nicht sauber fliesst,<br /><em>landet bei Menschen.</em></h3>
              <p>Internationale Richtwerte – keine versprochene Einsparung. Im ersten Schritt wird deshalb immer gemessen, was in Ihrem Betrieb tatsächlich anfällt.</p>
            </div>
            <div className="pain-stats">
              <article className="pain-stat" data-reveal>
                <strong className="stat-value"><span data-counter="5" data-decimals="0">5</span><i>–</i><span data-counter="6" data-decimals="0">6</span><b>Std./Woche</b></strong>
                <p>verbringen Field-Service-Fachkräfte mehrheitlich mit Rapporten, Dateneingabe und administrativen Finanzaufgaben.</p>
                <a href="https://klipboard.io/how-much-time-service-businesses-spend-on-admin/" target="_blank" rel="noreferrer">Klipboard Field Service Survey · 2022 ↗</a>
              </article>
              <article className="pain-stat" data-reveal>
                <strong className="stat-value"><span data-counter="24">24</span><b>Tage/Jahr</b></strong>
                <p>verliert ein durchschnittliches Kleinunternehmen an Finanzadministration – etwa für Rechnungen, Mahnungen und Fehlerkorrekturen.</p>
                <a href="https://www.sage.com/en-gb/company/digital-newsroom/2025/05/09/the-hidden-admin-burden-on-small-businesses/" target="_blank" rel="noreferrer">Sage SMB Research · UK 2025 ↗</a>
              </article>
              <article className="pain-stat" data-reveal>
                <strong className="stat-value"><span data-counter="86">86</span><b>Std./Jahr</b></strong>
                <p>wenden von verspäteten Zahlungen betroffene Betriebe im Mittel allein für das Nachfassen auf.</p>
                <a href="https://www.smallbusinesscommissioner.gov.uk/late-payments-research-2/" target="_blank" rel="noreferrer">UK Small Business Commissioner · 2025 ↗</a>
              </article>
            </div>
          </div>
        </section>

        <section className="scroll-manifesto" data-scroll-story>
          <div className="scroll-manifesto-sticky">
            <div className="shell manifesto-inner">
              <p className="eyebrow eyebrow-light">Der Pichler-Advisory-Grundsatz</p>
              <p className="manifesto-copy" aria-label={manifesto}>
                {manifesto.split(" ").map((word, index) => <span data-scroll-word aria-hidden="true" key={`${word}-${index}`}>{word} </span>)}
              </p>
              <div className="manifesto-footer"><span>Scrollen, um den Gedanken sichtbar zu machen</span><i aria-hidden="true">↓</i></div>
            </div>
            <div className="story-progress" aria-hidden="true"><span /></div>
          </div>
        </section>

        <section className="section clarity-section" id="ansatz">
          <div className="shell clarity-grid">
            <div className="process-photo" data-reveal="scale">
              <img
                src="/process-workshop.webp"
                alt="Arbeitsunterlagen einer gemeinsamen Prozessanalyse"
                width="1500"
                height="1000"
                loading="lazy"
              />
              <div className="photo-label"><span>Der Ausgangspunkt</span><strong>Ein realer Vorgang aus Ihrem Betrieb.</strong></div>
            </div>
            <div className="clarity-copy" data-reveal>
              <p className="eyebrow">Was Pichler Advisory macht</p>
              <h2>Nicht mehr digitalisieren.<br /><em>Besser organisieren.</em></h2>
              <p className="large-copy">Ich schaue nicht zuerst auf Tools, sondern darauf, wie Arbeit tatsächlich durch Ihren Betrieb fliesst.</p>
              <ol className="clarity-list">
                <li><span>1</span><div><strong>Verstehen</strong><p>Wir verfolgen einen echten Auftrag, Fall oder Vorgang vom Eingang bis zum Abschluss.</p></div></li>
                <li><span>2</span><div><strong>Vereinfachen</strong><p>Unnötige Schritte verschwinden, Zuständigkeiten und Übergaben werden klar.</p></div></li>
                <li><span>3</span><div><strong>Verbinden &amp; automatisieren</strong><p>Bestehende Systeme spielen zusammen und übernehmen nur die Arbeit, die zuverlässig automatisierbar ist.</p></div></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="example-section section">
          <div className="shell">
            <div className="example-heading" data-reveal>
              <p className="eyebrow eyebrow-light">Ein einfaches Beispiel</p>
              <h2>Aus vier manuellen Übergaben<br /><em>wird ein sauberer Ablauf.</em></h2>
              <p>Keine neue App. Keine spektakuläre KI. Nur eine vernünftige Verbindung Ihrer bestehenden Arbeitsschritte.</p>
            </div>
            <ProcessRunner />
          </div>
        </section>

        <section className="section" id="leistungen">
          <div className="shell">
            <div className="section-intro">
              <p className="eyebrow">Leistungen</p>
              <h2>Von der ersten Beobachtung<br /><em>bis zum laufenden Betrieb.</em></h2>
              <p>Kein Beratungsbericht für die Schublade. Die drei Leistungen bauen aufeinander auf und jede Massnahme muss ihren Aufwand wirtschaftlich rechtfertigen.</p>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <article className="service" key={service.number} tabIndex={0} data-reveal>
                  <div className="service-meta"><span>{service.number}</span><small>{service.label}</small></div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <div className="service-result"><span><Check /></span><p><strong>Das Ergebnis</strong>{service.result}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="audience-section">
          <img
            src="/sme-environment.webp"
            alt="Arbeitsalltag in einem inhabergeführten Schweizer KMU"
            width="1800"
            height="1013"
            loading="lazy"
          />
          <div className="audience-overlay" />
          <div className="shell audience-content">
            <p className="eyebrow eyebrow-light">Für wen der Ansatz passt</p>
            <h2>Für Betriebe, die gewachsen sind –<br /><em>und deren Abläufe mitgewachsen sind.</em></h2>
            <p>Besonders sinnvoll für inhabergeführte Unternehmen mit mehreren Mitarbeitenden, Systemen und Übergaben: Handwerk, Bau, Planung, Immobilien, Treuhand und projektbasierte Dienstleistungen.</p>
            <div className="audience-proof" data-reveal>
              <div tabIndex={0}><span className="audience-number">01</span><strong>Wiederkehrende Abläufe</strong><span>Das Problem tritt nicht einmalig, sondern regelmässig auf.</span></div>
              <div tabIndex={0}><span className="audience-number">02</span><strong>Messbarer Verlust</strong><span>Zeit, Fehler, Wartezeit oder Umsatzrisiko lassen sich beziffern.</span></div>
              <div tabIndex={0}><span className="audience-number">03</span><strong>Bereitschaft zur Veränderung</strong><span>Das Team soll den neuen Ablauf im Alltag tatsächlich nutzen.</span></div>
            </div>
          </div>
        </section>

        <section className="section section-soft" id="vorgehen">
          <div className="shell method-grid">
            <div className="method-copy">
              <p className="eyebrow">So beginnt die Zusammenarbeit</p>
              <h2>Sie müssen nicht wissen,<br /><em>was automatisiert werden kann.</em></h2>
              <p>Zeigen Sie mir lediglich, wie es heute läuft. Im unverbindlichen Erstgespräch prüfen wir einen konkreten Ablauf und entscheiden, ob eine vertiefte Analyse überhaupt sinnvoll ist.</p>
              <div className="risk-reversal"><Check /><span><strong>Kein Verkaufsritual.</strong> Wenn das Potenzial zu klein ist oder Ihre bestehende Lösung bereits genügt, sage ich Ihnen das.</span></div>
            </div>
            <MethodExplorer />
          </div>
        </section>

        <section className="founder-section section" id="ueber-mich">
          <div className="shell founder-grid">
            <div className="founder-image" data-reveal="scale">
              <img src="/maurus-portrait.jpg" alt="Maurus Pichler, Gründer von Pichler Advisory" width="900" height="1200" loading="lazy" />
            </div>
            <div className="founder-copy" data-reveal>
              <p className="eyebrow eyebrow-light">Ihr persönlicher Ansprechpartner</p>
              <h2>Der Blick von aussen.<br /><em>Die Umsetzung aus einer Hand.</em></h2>
              <p>Ich bin Maurus Pichler. Mein Fachgebiet liegt genau zwischen Betriebsablauf und technischer Umsetzung: Prozesse verstehen, Datenflüsse strukturieren und daraus eine Lösung bauen, die im Alltag funktioniert.</p>
              <p>Sie kennen Ihr Geschäft. Ich hinterfrage die Übergaben dazwischen – frei von „Das haben wir schon immer so gemacht“ und ohne wirtschaftliches Interesse an einer bestimmten Software.</p>
              <div className="founder-values">
                <span><Check /> Unabhängig</span><span><Check /> Direkt erreichbar</span><span><Check /> Persönlich verantwortlich</span>
              </div>
              <div className="founder-signoff"><strong>Maurus Pichler</strong><span>Gründer · Entwickler Digitales Business</span></div>
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="shell faq-grid">
            <div><p className="eyebrow">Berechtigte Fragen</p><h2>Was Sie vermutlich<br /><em>noch wissen möchten.</em></h2></div>
            <div className="faq-list">
              {faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span>+</span></summary><p>{faq.a}</p></details>)}
            </div>
          </div>
        </section>

        <section className="contact-section section" id="kontakt">
          <div className="shell contact-grid">
            <div className="contact-copy" data-reveal>
              <p className="eyebrow">Unverbindlich anfragen</p>
              <h2>Welcher Ablauf verfolgt Sie<br /><em>bis in den Feierabend?</em></h2>
              <p>Beschreiben Sie ihn in zwei oder drei Sätzen. Ich prüfe zuerst, ob darin überhaupt genügend Potenzial steckt – ohne Softwaredemo und ohne Verkaufsritual.</p>
              <div className="contact-direct">
                <span>Lieber direkt?</span>
                <a href="tel:+41775383064">+41 77 538 30 64</a>
                <a href="mailto:info@pichler-advisory.ch">info@pichler-advisory.ch</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand"><img src="/shield.png" alt="" width="32" height="39" /><span>Pichler Advisory</span></div>
          <p>Schlankere Abläufe, sinnvoll verbundene Systeme und weniger administrative Arbeit für Schweizer KMU.</p>
          <div className="footer-contact"><a href="mailto:info@pichler-advisory.ch">info@pichler-advisory.ch</a><span>Ernetschwil SG · schweizweit tätig</span></div>
        </div>
        <div className="shell footer-base">
          <span>© 2026 Pichler Advisory</span>
          <span className="footer-legal"><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></span>
        </div>
      </footer>
    </>
  );
}
