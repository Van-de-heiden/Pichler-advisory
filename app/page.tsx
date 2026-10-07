/* eslint-disable @next/next/no-img-element */
import { BrandReveal } from './brand-reveal';
import { SiteHeader, SiteFooter, SummitVisual, ProcessStory, BusinessSelector, Enquiry, PageMotion, SavingsExample } from './new-site';
import { Arrow } from './ui';
import { offerings, enquiryTopics } from './new-content';

export default async function Home({ searchParams }: { searchParams: Promise<{ leistung?: string }> }) {
  const query = await searchParams;
  const topic = query.leistung && Object.prototype.hasOwnProperty.call(enquiryTopics, query.leistung) ? enquiryTopics[query.leistung] : undefined;
  return <>
    <BrandReveal /><PageMotion /><SiteHeader />
    <main id="inhalt">
      <section className="hero hero-advisory hero-summit" id="top" aria-labelledby="hero-title">
        <div className="wrap hero-summit-inner"><div className="hero-copy">
          <p className="overline">Beratung & Umsetzung für Schweizer Unternehmen</p>
          <h1 id="hero-title"><span className="hero-cause">Was jeden Tag Zeit kostet,</span><span className="hero-effect">kostet jedes Jahr Geld.</span></h1>
          <p className="hero-lead">Doppelte Arbeit. Ständige Rückfragen. Büroarbeit nach Feierabend. Wir bringen Ordnung in Ihre Abläufe und bauen die Lösungen, die Ihrem Team Zeit zurückgeben.</p>
          <div className="hero-actions"><a className="button" href="#anfrage">Kostenloses Erstgespräch</a><a className="quiet-link" href="#leistungen">Was wir für Sie tun <span aria-hidden="true">↓</span></a></div>
          <p className="hero-meeting-note">Ca. 30 Minuten · Unverbindlich · Persönlich mit Maurus Pichler</p>
        </div>
        </div><div className="hero-landscape"><SummitVisual priority /></div>
        <div className="hero-personal wrap" aria-labelledby="personal-title">
          <a className="personal-identity" href="/ueber-mich" aria-label="Mehr über Maurus Pichler">
            <span className="personal-portrait"><img src="/maurus-portrait.jpg" width="1200" height="1600" alt="Maurus Pichler" loading="lazy" /></span>
            <span className="personal-name"><strong>Maurus Pichler</strong><span>Inhaber · Ihr Ansprechpartner</span><span className="personal-more">Lernen Sie mich kennen <Arrow /></span></span>
          </a>
          <div className="personal-promise">
            <h2 id="personal-title">Ihr Betrieb ist Chefsache.<br /><span>Auch bei mir.</span></h2>
            <p>Ich komme persönlich vorbei, schaue genau hin und kümmere mich selbst um Ihr Projekt. Vom ersten Gespräch bis ins letzte Detail.</p>
          </div>
        </div>
      </section>
      <section className="offering-section wrap" id="leistungen">
        <div className="section-heading" data-enter><p className="overline">Was wir für Sie tun</p><h2>Was Sie weiterbringt,<br />setzen wir um.</h2></div>
        <div className="offerings">{offerings.map(service => <a className="offering" href={`/leistungen/${service.slug}`} key={service.slug} data-enter><span className="offering-number">{service.number}</span><h3>{service.name}</h3><p>{service.short}</p><span className="round-arrow"><Arrow /></span></a>)}</div>
        <div className="direct-note"><p><strong>Sie wissen schon, was Sie brauchen?</strong><br />Dann setzen wir direkt um. Ohne vorgängige Betriebsanalyse.</p><a href="#anfrage" className="text-link">Projekt besprechen <Arrow /></a></div>
      </section>
      <section className="business-section wrap" id="branchen"><BusinessSelector /></section>
      <ProcessStory />
      <SavingsExample />
      <section className="founder-section wrap" id="maurus">
        <div className="founder-image founder-image-onsite" data-enter><img src="/hero-consultation-authentic.jpeg" width="1086" height="1448" alt="Maurus Pichler bei der Arbeit vor Ort am Besprechungstisch" loading="lazy" /></div>
        <div className="founder-text" data-enter><p className="overline">Maurus Pichler · Gründer & Inhaber</p><h2>Sie wollen weiterkommen.<br />Dafür bin ich da.</h2><p>Mein beruflicher Hintergrund liegt am Schweizer Finanzplatz. Hohe Ansprüche an Tempo, Präzision und verlässliche Abläufe prägen meine Arbeit.</p><p>Mit Pichler Advisory bringe ich diesen Anspruch in Ihren Betrieb. Ich hinterfrage, was Sie ausbremst, entwickle die Lösung und setze sie mit Ihnen um.</p><a href="/ueber-mich" className="text-link">Was mich antreibt <Arrow /></a></div>
      </section>
      <Enquiry initialTopic={topic} />
    </main><SiteFooter />
  </>;
}
