'use client';
import {useLayoutEffect,useState} from 'react';
import {CiHeader,CiFooter,CiQuestions} from './ci-site';
import {Enquiry} from './enquiry';
import {Arrow,Icon} from './ui';
import {enquiryTopics} from './new-content';
import {Services,OpportunityMap,Journey,Founder} from './v6-sections';
import {HeroAtmosphere} from './v8-experiences';
import './recovered-sections.css';
import './v5-design.css';
import './v6-design.css';
import './v7-hero.css';
import './v8-design.css';
import './v9-design.css';
import './v10-design.css';
import './v11-hero.css';
import './v12-hero.css';

export function goTo(id:string){document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
const pains=[
 {icon:'clock',title:'Der Arbeitstag endet.\nDie Büroarbeit nicht.',text:'Offerten, Rapporte und Rechnungen warten, wenn der eigentliche Auftrag längst erledigt ist.',link:'Zeit zurückgewinnen',service:1},
 {icon:'process',title:'Sie zahlen für Arbeit,\ndie doppelt passiert.',text:'Daten übertragen, Angaben suchen, immer wieder nachfragen. Kleine Umwege werden zu laufenden Kosten.',link:'Unnötigen Aufwand senken',service:1},
 {icon:'leaf',title:'Der Betrieb soll wachsen.\nDer Tag wird nicht länger.',text:'Sie haben Ideen und Chancen. Im Tagesgeschäft fehlen die Zeit und ein klarer Plan, sie anzupacken.',link:'Den nächsten Schritt planen',service:0}
];
const serviceTabs: Record<string,number> = { unternehmensberatung:0, 'prozesse-automatisierung':1, 'apps-it-projekte':2, websites:3, 'betrieb-betreuung':3 };
export default function Home({searchParams}:{searchParams:{leistung?:string}}){
 const slug=searchParams.leistung || '';
 const [service,setService]=useState(Object.prototype.hasOwnProperty.call(serviceTabs,slug)?serviceTabs[slug]:0);
 const [serviceJump,setServiceJump]=useState<{index:number}|null>(null);
 const initial=searchParams.leistung&&Object.prototype.hasOwnProperty.call(enquiryTopics,searchParams.leistung)?enquiryTopics[searchParams.leistung]:undefined;
 const [topic,setTopic]=useState(initial);
 const [paused,setPaused]=useState(false);
 function discover(n:number){setService(n);setServiceJump({index:n})}
 useLayoutEffect(()=>{if(!serviceJump)return;const frame=requestAnimationFrame(()=>{document.getElementById(`tab-${['beratung','prozesse','digital','websites'][serviceJump.index]}`)?.focus({preventScroll:true});goTo('leistungsdetails')});return()=>cancelAnimationFrame(frame)},[serviceJump]);
 function enquire(value?:string){if(value){setTopic(value)}goTo('anfrage')}
 return <><CiHeader light/><main id="inhalt" className={`ci-home v5 v6 v8-home v9-home v10-home v11-home v12-home ${paused?'motion-paused':''}`}>
  <section className="v7-hero" aria-labelledby="hero-heading">
   <HeroAtmosphere paused={paused}/>
   <div className="v6-wrap v7-hero-content">
     <p className="v6-eyebrow"><span/>Für Schweizer KMU · Beratung & Umsetzung</p>
     <h1 id="hero-heading"><span className="v12-headline-line">Was jeden Tag{' '}<span className="v12-headline-tail">Zeit kostet,</span></span>{' '}<span className="v12-headline-line">kostet jedes Jahr <span className="v7-hero-word">Geld.</span></span></h1>
     <ul className="v11-hero-outcomes" aria-label="Ihr Nutzen">
       <li className="v11-outcome outcome-time"><Icon name="clock"/><span><strong>Zeit</strong> <span>zurückgewinnen</span></span></li>
       <li className="v11-outcome outcome-cost"><Icon name="coins"/><span><strong>Kosten</strong> <span>senken</span></span></li>
       <li className="v11-outcome outcome-growth"><Icon name="leaf"/><span><strong>Wachstum</strong> <span>ermöglichen</span></span></li>
     </ul>
     <p className="v7-description">Wir finden, wo Ihr Betrieb unnötig Zeit und Geld verliert, entwickeln die passende Lösung und setzen sie gemeinsam mit Ihnen um.</p>
     <div className="v6-actions"><a href="#anfrage" className="v6-button">Kostenloses Erstgespräch<Arrow/></a></div>
     <p className="v6-reassurance"><Icon name="check"/>Unverbindlich · Ca. 30 Minuten · Direkt mit Maurus Pichler</p>
     <button className="v8-motion-control" aria-pressed={paused} onClick={()=>setPaused(!paused)}><Icon name={paused?'play':'pause'}/>{paused?'Bewegung fortsetzen':'Bewegung pausieren'}</button>
   </div>
  </section>
  <section className="v6-pains v6-wrap" aria-labelledby="pain-title">
   <div className="v6-section-heading"><div><p className="v6-eyebrow">Kommt Ihnen das bekannt vor?</p><h2 id="pain-title">Ihr Betrieb läuft.<br/><span>Aber zu viel läuft über Sie.</span></h2></div><p>Sie tragen die Verantwortung. Nicht jede Rückfrage, jeder Umweg und jede Routineaufgabe muss deshalb bei Ihnen landen.</p></div>
   <div className="v6-pain-grid">{pains.map((p,i)=><button className="v6-pain" key={p.title} onClick={()=>discover(p.service)} aria-controls="leistungsdetails"><span className="v6-pain-top"><Icon name={p.icon}/><span>0{i+1}</span></span><h3>{p.title.split('\n').map((line,j)=><span key={line}>{j>0&&<><br/>{' '}</>}{line}</span>)}</h3><p>{p.text}</p><span className="v6-card-link">{p.link}<Arrow/></span></button>)}</div>
  </section>
  <Services selected={service} onSelect={setService} onEnquire={enquire}/>
  <section className="v9-potential v6-wrap" aria-labelledby="example-heading"><div className="v9-potential-number"><span>In einzelnen Bereichen</span><div><span>Bis zu</span><strong>80<span>%</span></strong></div><p>Kostenreduktion möglich.</p></div><div className="v9-potential-copy"><p className="v6-eyebrow">Ihr Potenzial beginnt mit einem genauen Blick</p><h2 id="example-heading">Wie viel steckt<br/>in Ihrem Betrieb?</h2><p>Wo lässt sich unnötiger Aufwand vermeiden? Welche Kosten können sinken? Genau das finde ich in der Analyse heraus – und zeige Ihnen, welche Verbesserung sich für Ihren Betrieb lohnt.</p><button className="v6-button" onClick={()=>enquire('Unternehmensberatung')}>Kostenloses Erstgespräch<Arrow/></button><span className="v9-potential-next">Wir besprechen, wo sich eine Analyse lohnt.</span><p className="v9-potential-note">Die Grössenordnung von 80 % stammt aus einer anonymisierten Projektprognose für einen abgegrenzten Bereich, nicht aus einem gemessenen Ergebnis. Ihr Einsparpotenzial ergibt sich aus der Analyse.</p></div></section>
  <OpportunityMap paused={paused} onPause={()=>setPaused(!paused)} onDiscover={discover}/>
  <Journey/>
  <Founder/>
  <CiQuestions/>
  <Enquiry topic={topic || ''} onTopicChange={setTopic}/>
 </main><CiFooter/></>;
}
