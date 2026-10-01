/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { SiteHeader, SiteFooter, PageMotion } from '../../new-site';
import { ServiceExample } from '../../new-service-visuals';
import { serviceCopy } from '../../service-copy';
import { offerings } from '../../new-content';
import { Arrow, Icon } from '../../ui';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const s=Object.prototype.hasOwnProperty.call(serviceCopy,slug)?serviceCopy[slug]:undefined; return {title:s?`${s.label} | Pichler Advisory`:'Seite nicht gefunden', description:s?.lead}; }
export default async function ServicePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const s=Object.prototype.hasOwnProperty.call(serviceCopy,slug)?serviceCopy[slug]:undefined; if(!s)notFound();
  const enquiry=`/?leistung=${slug}#anfrage`;
  return <><PageMotion /><SiteHeader /><main id="inhalt"><section className={`service-hero wrap${slug === 'websites' ? ' service-hero-websites' : ''}`}><a href="/#leistungen" className="breadcrumb">Leistungen <span>/</span> {s.label}</a><div className="service-hero-grid"><div><p className="overline">{s.label}</p><h1>{s.title.split('\n').map((line,i)=><span key={line}>{line}{i===0&&<br/>}</span>)}</h1><p className="service-lead">{s.lead}</p><a className="button" href={enquiry}>Vorhaben besprechen <Arrow /></a></div><ServiceExample slug={slug} /></div><nav className="page-jumps" aria-label="Auf dieser Seite"><a href="#ansatzpunkte">Ansatzpunkte</a><a href="#ergebnis">Die Veränderung</a><a href="#umfang">Umfang & Kosten</a><a href="#vorgehen">Zusammenarbeit</a></nav></section>
  <section className="service-situations wrap" id="ansatzpunkte"><div className="section-heading" data-enter><p className="overline">Wo wir ansetzen</p><h2>Kommt Ihnen das<br />bekannt vor?</h2></div><div className="situation-grid">{s.situations.map((c,i)=><article key={c.title} data-enter><span className="small-number">0{i+1}</span><h3>{c.title}</h3><p>{c.text}</p></article>)}</div></section>
  <section className="service-result" id="ergebnis"><div className="wrap"><div className="result-heading" data-enter><p className="overline">Was sich ändern kann</p><h2>{s.resultTitle.split('\n').map((line,i)=><span key={line}>{line}{i===0&&<br/>}</span>)}</h2><p>{s.resultText}</p></div><div className="before-after"><article><span>Die Ausgangslage</span><p>{s.before}</p></article><div className="change-arrow"><Arrow /></div><article><span>Der bessere Ablauf</span><p>{s.after}</p></article></div><p className="example-disclaimer">Illustratives Beispiel. Die konkrete Lösung entwickeln wir für Ihre Ausgangslage.</p></div></section>
  <section className="scope-section wrap" id="umfang"><div className="scope-included" data-enter><p className="overline">Was Sie erhalten</p><h2>Ein klarer Auftrag.<br />Ein greifbares Ergebnis.</h2><ul>{s.included.map(v=><li key={v}><Icon name="check" /><span>{v}</span></li>)}</ul></div><div className="scope-cost" data-enter><h3>Sie bestimmen den Umfang.</h3><p>{s.scope}</p><h3>Was bestimmt die Kosten?</h3><p>{s.cost}</p><ul>{s.factors.map(f=><li key={f}>{f}</li>)}</ul>{slug==='websites'&&<a href="/leistungen/betrieb-betreuung" className="text-link">Mehr zu Betrieb & Betreuung <Arrow /></a>}</div></section>
  <section className="working-section wrap" id="vorgehen"><div className="section-heading" data-enter><p className="overline">Die Zusammenarbeit</p><h2>Vom Gespräch<br />in Ihren Alltag.</h2></div><div className="working-steps">{s.steps.map((step,i)=><article key={step.title} data-enter><span className="small-number">0{i+1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
  {slug==='prozesse-automatisierung' ? <section className="service-onsite" aria-labelledby="onsite-title">
    <img className="service-onsite-photo" src="/sme-environment.webp" width="1672" height="941" alt="" loading="lazy" decoding="async" />
    <div className="service-onsite-shade" aria-hidden="true" />
    <div className="wrap service-onsite-content"><div>
      <p className="overline">Persönlich in Ihrem Betrieb</p>
      <h2 id="onsite-title">Der bessere Ablauf<br />beginnt vor Ort.</h2>
      <p>Ich schaue mir an, wie Ihr Team tatsächlich arbeitet. Gemeinsam lösen wir, was Sie jeden Tag Zeit kostet.</p>
      <a className="button light" href={enquiry}>Schauen wir uns Ihren Ablauf an <Arrow /></a>
    </div></div>
  </section> : <section className="closing-section"><div className="wrap closing-row"><h2>{s.closing}</h2><a className="button light" href={enquiry}>Sprechen wir darüber <Arrow /></a></div></section>}
  <section className="related-section wrap"><p className="overline">Weitere Möglichkeiten</p><div>{offerings.filter(o=>o.slug!==slug).map(o=><a href={`/leistungen/${o.slug}`} key={o.slug}>{o.name}<Arrow /></a>)}</div></section></main><SiteFooter /></>;
}
