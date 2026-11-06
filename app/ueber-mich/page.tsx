import Link from 'next/link';
import {CiHeader,CiFooter} from '../ci-site';
import {Arrow,Icon} from '../ui';
import {FounderPillars,FounderBackground} from '../v8-experiences';
import {pageMetadata,pageSchema,breadcrumbSchema,organizationId,personId} from '../seo';
import {StructuredData} from '../structured-data';
import {company} from '../company';
import '../recovered-sections.css';
import '../v5-design.css';
import '../v6-design.css';
import '../v8-design.css';

export const metadata=pageMetadata('/ueber-mich','Maurus Pichler | Der Mensch hinter Pichler Advisory','Warum ich Pichler Advisory gegründet habe: mehr Zeit, weniger unnötiger Aufwand und Raum für die Entwicklung Ihres Unternehmens. Persönliche Beratung und Umsetzung.');
export default function About(){return <><StructuredData data={[
 {...pageSchema('/ueber-mich','Maurus Pichler','ProfilePage'),mainEntity:{'@id':personId}},
 {'@context':'https://schema.org','@type':'Person','@id':personId,name:company.contactName,url:`${company.url}/ueber-mich`,image:`${company.url}/maurus-portrait-20261025.webp`,jobTitle:'Gründer und Inhaber',worksFor:{'@id':organizationId}},
 breadcrumbSchema('/ueber-mich','Maurus Pichler')
 ]}/><CiHeader light/><main id="inhalt" className="ci-home v5 v6 v6-about v8-about">
  <section className="v6-about-hero v6-wrap"><div><Link href="/" className="v6-about-back"><Arrow/>Zur Startseite</Link><p className="v6-eyebrow"><span/>Der Mensch hinter Pichler Advisory</p><h1>Ich bin Maurus.<br/><span>Und ich möchte<br/>etwas bewegen.</span></h1><p className="v6-about-intro">Mich interessiert, was Ihren Betrieb ausmacht. Was Sie bremst. Und was möglich wird, wenn wir die richtigen Dinge verändern.</p><Link href="/#anfrage" className="v6-button">Lernen wir uns kennen<Arrow/></Link></div><figure><img src="/maurus-portrait-20261025.webp" width="1254" height="1254" alt="Maurus Pichler, Gründer und Inhaber von Pichler Advisory" fetchPriority="high"/><figcaption>Maurus Pichler · Gründer & Inhaber</figcaption></figure></section>
  <section className="v6-about-mission v8-mission"><div className="v6-wrap v6-about-two-col"><div><p className="v6-eyebrow">Mein Antrieb</p><h2>Gute Ideen verdienen<br/>mehr als einen Platz<br/>auf der To-do-Liste.</h2></div><div><p>Im Tagesgeschäft bleibt oft zu wenig Zeit für das, was den Betrieb voranbringt. Deshalb habe ich Pichler Advisory aufgebaut: um mit Ihnen Spielraum zu schaffen und Vorhaben umzusetzen.</p><div className="v8-mission-outcomes"><span><Icon name="clock"/>Zeit zurückgewinnen</span><span><Icon name="leaf"/>Wachstum ermöglichen</span><span><Icon name="check"/>Etwas bewegen</span></div></div></div></section>
  <FounderPillars/>
  <FounderBackground/>
  <section className="v6-about-close"><div className="v6-wrap"><div><h2>Erzählen Sie mir,<br/>was Sie beschäftigt.</h2><p>Ein erstes Gespräch. Kostenlos und ohne Verpflichtung.</p></div><Link href="/#anfrage" className="v6-button">Erstgespräch anfragen<Arrow/></Link></div></section>
 </main><CiFooter/></>}
