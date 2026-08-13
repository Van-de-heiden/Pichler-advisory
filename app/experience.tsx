"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

const processSteps = [
  { title: "Eingang", text: "Die Anfrage wird einmal erfasst – vollständig und am richtigen Ort.", benefit: "Kein Abtippen aus E-Mail oder Notiz" },
  { title: "Prüfung", text: "Pflichtangaben werden geprüft, bevor der Vorgang weiterläuft.", benefit: "Fehlende Angaben werden sofort sichtbar" },
  { title: "Zuweisung", text: "Die zuständige Person erhält automatisch den nächsten Schritt.", benefit: "Keine mündliche Übergabe nötig" },
  { title: "Bearbeitung", text: "Status und Unterlagen bleiben für alle Beteiligten nachvollziehbar.", benefit: "Weniger Rückfragen und Sucharbeit" },
  { title: "Abschluss", text: "Dokumentation und Folgeaufgaben werden sauber ausgelöst und abgelegt.", benefit: "Nichts bleibt im Kopf oder Postfach hängen" },
];

const methodSteps = [
  { number: "01", title: "Kurz kennenlernen", kicker: "Ein konkretes Problem statt Verkaufspräsentation", text: "Sie zeigen mir den Ablauf, der regelmässig Zeit oder Nerven kostet. Wir grenzen gemeinsam ein, worüber wir tatsächlich sprechen – ohne schon eine Lösung zu verkaufen.", result: "Nach 30 Minuten ist klar, ob eine vertiefte Analyse überhaupt sinnvoll ist." },
  { number: "02", title: "Vorgang ansehen", kicker: "Die Realität ist wichtiger als das Organigramm", text: "Wir verfolgen einen echten Fall vom Eingang bis zum Abschluss. Dabei werden Übergaben, Rückfragen, Wartezeiten, Dateien und Systemwechsel sichtbar.", result: "Sie sehen, wo der Ablauf wirklich stockt – nicht nur, wo es vermutet wird." },
  { number: "03", title: "Potenzial beziffern", kicker: "Erst rechnen, dann verändern", text: "Häufigkeit, Zeitverlust, Fehler- und Umsatzrisiko werden dem Umsetzungsaufwand gegenübergestellt. Kleine Hebel dürfen klein bleiben.", result: "Eine nüchterne Priorität statt einer langen Wunschliste." },
  { number: "04", title: "Erst dann entscheiden", kicker: "Sie behalten jederzeit die Kontrolle", text: "Sie erhalten eine klare Empfehlung mit dem sinnvollsten nächsten Schritt. Umsetzung gibt es nur, wenn Nutzen, Aufwand und Alltagstauglichkeit zusammenpassen.", result: "Kein Verkaufsritual – sondern eine belastbare Entscheidungsgrundlage." },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const swissNumber = (value: number) => Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’");
const swissDecimal = (value: number) => value.toFixed(1);

type LeakResult = { cost: number; hours: number; days: number };

export function LeakCalculator() {
  const [people, setPeople] = useState(4);
  const [hoursPerWeek, setHoursPerWeek] = useState(3);
  const [hourlyCost, setHourlyCost] = useState(65);
  const [weeks, setWeeks] = useState(46);
  const annualHours = people * hoursPerWeek * weeks;
  const annualCost = annualHours * hourlyCost;
  const annualDays = annualHours / 8;
  const target = { cost: annualCost, hours: annualHours, days: annualDays };
  const current = useRef<LeakResult>(target);
  const [displayed, setDisplayed] = useState<LeakResult>(target);

  useEffect(() => {
    const next = { cost: annualCost, hours: annualHours, days: annualDays };
    if (prefersReducedMotion()) {
      const reducedFrame = requestAnimationFrame(() => {
        current.current = next;
        setDisplayed(next);
      });
      return () => cancelAnimationFrame(reducedFrame);
    }
    const start = current.current;
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / 520, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = {
        cost: start.cost + (next.cost - start.cost) * eased,
        hours: start.hours + (next.hours - start.hours) * eased,
        days: start.days + (next.days - start.days) * eased,
      };
      current.current = value;
      setDisplayed(value);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [annualCost, annualDays, annualHours]);

  const rangeStyle = (value: number, min: number, max: number) => ({
    "--range-progress": `${((value - min) / (max - min)) * 100}%`,
  } as CSSProperties);

  return (
    <section className="leak-section" aria-labelledby="leak-title">
      <div className="shell leak-shell">
        <div className="leak-intro" data-reveal>
          <div>
            <p className="eyebrow">Interaktiver Leckrechner</p>
            <h2 id="leak-title">Was kostet ein Ablauf,<br /><em>der jede Woche klemmt?</em></h2>
          </div>
          <div className="leak-intro-copy">
            <p>Der teuerste Ablauf ist oft nicht der offensichtlich kaputte – sondern der, an den sich alle gewöhnt haben.</p>
            <span>Ihre Werte. Transparent gerechnet. Keine versprochene Einsparung.</span>
          </div>
        </div>

        <div className="leak-calculator" data-reveal>
          <div className="leak-controls">
            <div className="leak-controls-heading">
              <span>01 · Ihre Realität</span>
              <strong>Ein wiederkehrender Ablauf</strong>
              <p>Denken Sie an Offerten, Rapporte, Rechnungen oder eine Übergabe, die regelmässig Nacharbeit auslöst.</p>
            </div>

            <label className="leak-control">
              <span><strong>Betroffene Personen</strong><output>{people}</output></span>
              <input type="range" min="1" max="20" step="1" value={people} onChange={(event) => setPeople(Number(event.target.value))} style={rangeStyle(people, 1, 20)} />
              <small>Wie viele Personen verlieren in diesem Ablauf Zeit?</small>
            </label>

            <label className="leak-control">
              <span><strong>Verlust pro Person und Woche</strong><output>{swissDecimal(hoursPerWeek)} Std.</output></span>
              <input type="range" min="0.5" max="10" step="0.5" value={hoursPerWeek} onChange={(event) => setHoursPerWeek(Number(event.target.value))} style={rangeStyle(hoursPerWeek, .5, 10)} />
              <small>Nachfragen, Übertragen, Warten, Korrigieren oder Nacharbeiten.</small>
            </label>

            <label className="leak-control">
              <span><strong>Interne Vollkosten pro Stunde</strong><output>CHF {hourlyCost}</output></span>
              <input type="range" min="35" max="150" step="5" value={hourlyCost} onChange={(event) => setHourlyCost(Number(event.target.value))} style={rangeStyle(hourlyCost, 35, 150)} />
              <small>Lohn plus Arbeitgeberkosten und betrieblicher Overhead.</small>
            </label>

            <label className="leak-control leak-control-compact">
              <span><strong>Aktive Arbeitswochen</strong><output>{weeks} pro Jahr</output></span>
              <input type="range" min="40" max="48" step="1" value={weeks} onChange={(event) => setWeeks(Number(event.target.value))} style={rangeStyle(weeks, 40, 48)} />
            </label>
          </div>

          <div className="leak-result" aria-live="polite">
            <div className="leak-result-kicker"><span aria-hidden="true" /> 02 · Heute gebundener Aufwand</div>
            <div className="leak-result-main">
              <small>Hochgerechnet pro Jahr</small>
              <strong><i>CHF</i> {swissNumber(displayed.cost)}</strong>
              <p>Dieses Geld erscheint auf keiner einzelnen Rechnung. Es verteilt sich auf viele kleine Reibungsverluste im Alltag.</p>
            </div>

            <div className="leak-result-metrics">
              <div><strong>{swissNumber(displayed.hours)}</strong><span>Stunden gebunden</span></div>
              <div><strong>{swissNumber(displayed.days)}</strong><span>Arbeitstage à 8 Std.</span></div>
            </div>

            <div className="leak-flow" aria-hidden="true">
              <span className="leak-flow-dot" />
              <span className="leak-flow-line"><i /></span>
              <span className="leak-flow-stop">sichtbar</span>
            </div>

            <div className="leak-cta">
              <p><strong>Nicht alles davon ist vermeidbar.</strong> Entscheidend ist, welcher Anteil sich mit einem besseren Ablauf wirtschaftlich zurückholen lässt.</p>
              <a className="button button-light" href="#kontakt">Mein grösstes Leck prüfen <span aria-hidden="true">→</span></a>
              <small>Unverbindlich. Ein echter Vorgang. Wenn das Potenzial nicht trägt, sage ich es.</small>
            </div>
          </div>
        </div>

        <details className="leak-method">
          <summary>Wie wird gerechnet – und warum diese Startwerte?</summary>
          <div>
            <p><strong>Formel:</strong> Personen × verlorene Stunden pro Woche × aktive Wochen × interne Vollkosten. Das Ergebnis zeigt gebundenen Aufwand, nicht eine garantierte Einsparung.</p>
            <p>Die 46 Wochen orientieren sich an einer SECO-Auswertung der effektiven Arbeitswochen. Zur Einordnung der Stundenkosten: Das BFS weist für 2024 einen Schweizer Bruttomedianlohn von CHF 7’024 pro Monat aus. Der Startwert von CHF 65 ist eine frei änderbare Vollkostenannahme inklusive Arbeitgeberkosten und Overhead – kein offizieller Branchentarif.</p>
            <div><a href="https://www.seco.admin.ch/dam/fr/sd-web/zvumojVBVQRz/Grundlagen-Wirtschaftspolitik-045-SECO-2024-DE.pdf" target="_blank" rel="noreferrer">SECO · Arbeitswochen ↗</a><a href="https://www.bfs.admin.ch/bfs/de/home.assetdetail.36195861.html" target="_blank" rel="noreferrer">BFS · Lohnstruktur 2024 ↗</a></div>
          </div>
        </details>
      </div>
    </section>
  );
}

export function MotionLayer() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();
    root.classList.add("motion-ready");
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-counter]"));
    const stories = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-story]"));

    if (reduced) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      counters.forEach((counter) => {
        counter.textContent = Number(counter.dataset.counter ?? 0).toLocaleString("de-CH", { minimumFractionDigits: Number(counter.dataset.decimals ?? 0), maximumFractionDigits: Number(counter.dataset.decimals ?? 0) });
      });
      stories.forEach((story) => {
        story.style.setProperty("--story-progress", "1");
        story.querySelectorAll<HTMLElement>("[data-scroll-word]").forEach((word) => word.classList.add("is-active"));
      });
      return () => root.classList.remove("motion-ready");
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6%" });
    revealElements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
      revealObserver.observe(element);
    });

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target as HTMLElement;
        const target = Number(counter.dataset.counter ?? 0);
        const decimals = Number(counter.dataset.decimals ?? 0);
        const duration = 1350;
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = Math.min((now - start) / duration, 1);
          const value = target * (1 - Math.pow(1 - elapsed, 4));
          counter.textContent = value.toLocaleString("de-CH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
          if (elapsed < 1) requestAnimationFrame(tick);
        };
        counter.textContent = (0).toLocaleString("de-CH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        requestAnimationFrame(tick);
        counterObserver.unobserve(counter);
      });
    }, { threshold: 0.55 });
    counters.forEach((counter) => counterObserver.observe(counter));

    let frame = 0;
    const updateScrollMotion = () => {
      frame = 0;
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
      stories.forEach((story) => {
        const rect = story.getBoundingClientRect();
        const start = window.innerHeight * 0.72;
        const finish = -window.innerHeight * 0.06;
        const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - finish)));
        story.style.setProperty("--story-progress", progress.toFixed(3));
        const words = Array.from(story.querySelectorAll<HTMLElement>("[data-scroll-word]"));
        const activeWords = Math.floor(progress * (words.length + 4));
        words.forEach((word, index) => word.classList.toggle("is-active", index < activeWords));
      });
    };
    const requestScrollUpdate = () => { if (!frame) frame = requestAnimationFrame(updateScrollMotion); };
    updateScrollMotion();
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, []);
  return null;
}

export function ProcessRunner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion] = useState(() => prefersReducedMotion());
  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % processSteps.length), 1800);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);
  const selectStep = (index: number) => { setActive(index); setPaused(true); };
  const progress = `${(active / (processSteps.length - 1)) * 100}%`;
  const step = processSteps[active];
  return (
    <div className="process-demo" data-reveal>
      <div className="process-toolbar">
        <div className="process-live"><span aria-hidden="true" /> Beispiel: Neue Kundenanfrage</div>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Animation fortsetzen" : "Animation pausieren"}</button>
      </div>
      <div className="legacy-strip">
        <span>Heute häufig</span>
        <div className="legacy-steps" aria-label="Vier manuelle Übergaben"><i>E-Mail</i><b>→</b><i>Notiz</i><b>→</b><i>Excel</i><b>→</b><i>Fachsoftware</i></div>
        <strong>4 manuelle Übergaben</strong>
      </div>
      <div className="process-lane" style={{ "--lane-progress": progress } as CSSProperties}>
        <div className="process-track" aria-hidden="true"><span /></div>
        <div className="process-nodes">
          {processSteps.map((item, index) => (
            <button type="button" className={`${index === active ? "is-active" : ""} ${index < active ? "is-complete" : ""}`} key={item.title} onClick={() => selectStep(index)} aria-current={index === active ? "step" : undefined}>
              <span>{index < active ? "✓" : index + 1}</span><strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="process-feedback" key={active} aria-live="polite">
        <div className="process-feedback-copy"><span>0{active + 1}</span><div><small>Gerade aktiv</small><strong>{step.title}</strong><p>{step.text}</p></div></div>
        <div className="process-benefit"><small>Was dadurch entfällt</small><strong>{step.benefit}</strong></div>
        <div className="process-next"><span aria-hidden="true" /> Danach startet der nächste Schritt automatisch.</div>
      </div>
    </div>
  );
}

export function MethodExplorer() {
  const [selected, setSelected] = useState(0);
  const step = methodSteps[selected];
  return (
    <div className="method-explorer" data-reveal>
      <div className="method-tabs" role="tablist" aria-label="Schritte der Zusammenarbeit">
        {methodSteps.map((item, index) => (
          <button key={item.number} type="button" role="tab" aria-selected={selected === index} aria-controls="method-detail" id={`method-tab-${index}`} className={selected === index ? "is-active" : ""} onClick={() => setSelected(index)}>
            <span>{item.number}</span><strong>{item.title}</strong><i aria-hidden="true">↗</i>
          </button>
        ))}
      </div>
      <div className="method-detail" id="method-detail" role="tabpanel" aria-labelledby={`method-tab-${selected}`} key={selected}>
        <span className="method-detail-number">{step.number}</span><p>{step.kicker}</p><h3>{step.title}</h3><div className="method-detail-copy">{step.text}</div>
        <div className="method-outcome"><span>Das Ergebnis</span><strong>{step.result}</strong></div>
      </div>
    </div>
  );
}

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const company = String(form.get("company") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const topic = String(form.get("topic") ?? "");
    const process = String(form.get("process") ?? "");
    const subject = `Unverbindliche Prozessanfrage – ${company || name}`;
    const body = [
      `Guten Tag Maurus`,
      "",
      `ich möchte folgenden Ablauf unverbindlich prüfen lassen:`,
      process,
      "",
      `Bereich: ${topic}`,
      `Name: ${name}`,
      `Unternehmen: ${company || "–"}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone || "–"}`,
    ].join("\n");

    setPrepared(true);
    window.location.href = `mailto:info@pichler-advisory.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="contact-form" onSubmit={submit} data-reveal>
      <div className="form-row">
        <label><span>Ihr Name *</span><input name="name" autoComplete="name" required placeholder="Max Muster" /></label>
        <label><span>Unternehmen</span><input name="company" autoComplete="organization" placeholder="Muster GmbH" /></label>
      </div>
      <div className="form-row">
        <label><span>E-Mail *</span><input name="email" type="email" autoComplete="email" required placeholder="max@muster.ch" /></label>
        <label><span>Telefon</span><input name="phone" type="tel" autoComplete="tel" placeholder="+41 79 000 00 00" /></label>
      </div>
      <label>
        <span>Wo drückt es am stärksten?</span>
        <select name="topic" defaultValue="Offerten und Kalkulation">
          <option>Offerten und Kalkulation</option>
          <option>Rapporte und Rechnungen</option>
          <option>Einsatz- und Auftragsplanung</option>
          <option>Übergaben und Zuständigkeiten</option>
          <option>Ein anderer wiederkehrender Ablauf</option>
        </select>
      </label>
      <label>
        <span>Welcher Ablauf kostet Sie regelmässig Zeit? *</span>
        <textarea name="process" required rows={5} placeholder="Zum Beispiel: Bis alle Stunden und Materialien zusammen sind, kann ich die Rechnung oft erst am Wochenende erstellen …" />
      </label>
      <label className="form-consent">
        <input type="checkbox" name="privacy" required />
        <span>Ich habe die <a href="/datenschutz" target="_blank" rel="noreferrer">Datenschutzerklärung</a> zur Kenntnis genommen.</span>
      </label>
      <div className="form-submit">
        <button className="button" type="submit">{prepared ? "E-Mail ist vorbereitet" : "Anfrage vorbereiten"}<span aria-hidden="true">→</span></button>
        <p>Es öffnet sich Ihr E-Mail-Programm mit den ausgefüllten Angaben. Die Website speichert keine Formulardaten.</p>
      </div>
    </form>
  );
}
