'use client';
import {useEffect,useRef,useState} from 'react';
import {Icon} from './ui';

/** Decorative parallax is scoped to the landing-page opening. */
export function HeroAtmosphere({paused}:{paused:boolean}){
 const field=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=field.current,hero=el?.parentElement;
  if(!el||!hero)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,x=0,y=0;
  const reset=()=>{cancelAnimationFrame(frame);frame=0;el.style.setProperty('--drift-x','0px');el.style.setProperty('--drift-y','0px')};
  const move=(e:PointerEvent)=>{if(paused||motion.matches||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();x=(e.clientX-r.left-r.width/2)/r.width*26;y=(e.clientY-r.top-r.height/2)/r.height*20;if(!frame)frame=requestAnimationFrame(()=>{el.style.setProperty('--drift-x',`${x}px`);el.style.setProperty('--drift-y',`${y}px`);frame=0})};
  hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',reset);motion.addEventListener('change',reset);
  return()=>{reset();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);motion.removeEventListener('change',reset)};
 },[paused]);
 return <div ref={field} className="v8-atmosphere" aria-hidden="true"><div className="v8-ambient-halo halo-sage"/><div className="v8-ambient-halo halo-lavender"/><div className="v8-ambient-layer"><svg className="v8-ambient-lines" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice"><path d="M-170 590C130 710 50 120 235 130S270 510 20 370"/><path d="M1520 150C1230 0 1140 235 1250 360S1510 490 1380 680"/></svg></div></div>;
}

const processSteps=[
 {before:'Notizen übertragen',after:'Einmal erfassen',beforeIcon:'file',afterIcon:'file'},
 {before:'Fehlendes nachfragen',after:'Gemeinsam nutzen',beforeIcon:'clock',afterIcon:'process'},
 {before:'Erneut eingeben',after:'Direkt abrechnen',beforeIcon:'file',afterIcon:'check'}
];
export function ProcessVisual(){
 const [clear,setClear]=useState(false);
 return <div className="service-visual visual-prozesse v8-process"><div className="visual-orbit"/>
  <div className="v6-demo-switch" role="group" aria-label="Beispielablauf vergleichen"><button aria-pressed={!clear} onClick={()=>setClear(false)}>Heute</button><button aria-pressed={clear} onClick={()=>setClear(true)}>Einfacher</button></div>
  <div className={`v8-process-stage ${clear?'is-clear':'is-busy'}`} aria-label={clear?'Geordneter Ablauf':'Verstreuter Ablauf'}>
   <svg className="v8-process-routes" viewBox="0 0 420 340" aria-hidden="true"><path className="route-busy" d="M200 60C365 15 350 280 107 280S370 85 270 160S70 225 200 60"/><path className="route-clear" d="M210 76V267"/></svg>
   <span className="v8-loose-note loose-a" aria-hidden="true">E-Mail</span><span className="v8-loose-note loose-b" aria-hidden="true">Rückfrage</span><span className="v8-loose-note loose-c" aria-hidden="true">Liste</span>
   {processSteps.map((s,i)=><div className={`v8-process-card process-card-${i}`} key={i}><span className="v8-process-number">0{i+1}</span><Icon name={clear?s.afterIcon:s.beforeIcon}/><span className="v8-process-label"><span className="label-before" aria-hidden={clear}>{s.before}</span><span className="label-after" aria-hidden={!clear}>{s.after}</span></span><span className="v8-process-tick" aria-hidden="true"><Icon name="check"/></span></div>)}
  </div>
  <div className="v8-process-caption" aria-live="polite"><strong>{clear?'Ein klarer Ablauf. Ohne Umwege.':'Dieselben Angaben. An zu vielen Orten.'}</strong><span>{clear?'Mit «Heute» können Sie nochmals vergleichen.':'Mit «Einfacher» bringen Sie Ordnung hinein.'}</span></div>
  <span className="v6-visual-hint">Illustratives Beispiel · Auftrag bis Rechnung</span>
 </div>;
}

const pillars=[
 {label:'Zuhören',icon:'process',title:'Ihr Betrieb zuerst.',text:'Ich beginne mit Ihrer Situation und Ihren Zielen. Was gut funktioniert, darf bleiben. Wir verändern dort etwas, wo es Ihnen wirklich hilft.',practice:'Erst verstehen, wo es hakt. Dann über Lösungen sprechen.'},
 {label:'Klartext',icon:'file',title:'Ein ehrlicher Blick.',text:'Sie bekommen eine verständliche Einschätzung und klare Prioritäten. Auch dann, wenn sich eine Idee nicht lohnt. Leistung, Aufwand und Kosten klären wir vor dem Auftrag.',practice:'Sie wissen, was Sie erhalten. Und worüber Sie entscheiden.'},
 {label:'Dranbleiben',icon:'check',title:'Bis es im Alltag ankommt.',text:'Ich begleite die vereinbarten Schritte bis zur Umsetzung. Gemeinsam mit Ihnen und Ihrem Team prüfe ich, ob die Verbesserung bei der täglichen Arbeit funktioniert.',practice:'Die Arbeit ist erst sinnvoll, wenn sie bei Ihnen etwas verbessert.'}
];
export function FounderPillars(){
 const [built,setBuilt]=useState<number[]>([]);const [active,setActive]=useState(-1);
 function build(i:number){setBuilt(prev=>prev.includes(i)?prev:[...prev,i]);setActive(i)}
 return <section className="v8-values v6-wrap" aria-labelledby="pillars-heading"><div className="v8-values-heading"><div><p className="v6-eyebrow">Meine Grundpfeiler</p><h2 id="pillars-heading">Gute Zusammenarbeit<br/><span>hat ein Fundament.</span></h2></div><p id="pillar-help">Drei Dinge, auf die Sie sich verlassen können.<br/>Klicken Sie die Bausteine an und bauen Sie mit.</p></div>
  <div className="v8-values-layout"><div className="v8-foundation-art"><div className={`v8-foundation ${built.length===3?'is-complete':''}`}><div className="v8-foundation-beam" aria-hidden="true"><span>Verlässliche Zusammenarbeit</span><Icon name="check"/></div><div className="v8-pillar-grid">{pillars.map((p,i)=><button key={p.label} className={`v8-pillar pillar-${i} ${built.includes(i)?'is-built':''} ${active===i?'is-selected':''}`} aria-expanded={active===i} aria-controls="pillar-detail" aria-describedby="pillar-help" aria-label={`${p.label}: ${built.includes(i)?'Grundpfeiler ansehen':'Grundpfeiler aufbauen'}`} onClick={()=>build(i)}><span className="v8-pillar-ghost"/><span className="v8-pillar-stone"><span className="v8-stone-number">0{i+1}</span><Icon name={p.icon}/><span className="v8-stone-name">{p.label}</span><span className="v8-stone-add" aria-hidden="true"><Icon name={built.includes(i)?'check':'plus'}/></span></span></button>)}</div><div className="v8-foundation-floor"/></div><div className="v8-foundation-controls"><span aria-live="polite">{built.length===3?'Alle drei Grundpfeiler stehen.':`${built.length} von 3 Grundpfeilern aufgebaut`}</span><button onClick={()=>{setBuilt([]);setActive(-1)}} disabled={built.length===0}>Zurücksetzen<span aria-hidden="true">↺</span></button></div></div>
   <div id="pillar-detail" className="v8-pillar-detail" aria-live="polite" aria-atomic="true">{active<0?<><span className="v8-detail-label">WORAUF ES MIR ANKOMMT</span><h3>Persönlich.<br/>Verständlich.<br/>Verbindlich.</h3><p>Wählen Sie einen Grundpfeiler. Dahinter steckt, wie ich mit Ihnen arbeite.</p><span className="v8-detail-bottom"><span aria-hidden="true">←</span> Mit einem Baustein beginnt es.</span></>:<div key={active}><span className="v8-detail-label">0{active+1} / {pillars[active].label.toUpperCase()}</span><h3>{pillars[active].title}</h3><p>{pillars[active].text}</p><div className="v8-pillar-practice"><Icon name="check"/><span>{pillars[active].practice}</span></div><span className="v8-detail-bottom">{built.length===3?'Das ist mein Anspruch an unsere Zusammenarbeit.':'Der nächste Baustein macht das Fundament stärker.'}</span></div>}</div>
  </div>
 </section>;
}

const background=[
 {icon:'building',tag:'01 / PERSÖNLICH',title:'Ein direkter Ansprechpartner.',short:'Von Ernetschwil aus. Für KMU in der Deutschschweiz.',detail:'Ich führe Pichler Advisory persönlich. Vom ersten Gespräch bis zur vereinbarten Umsetzung arbeiten Sie direkt mit mir.'},
 {icon:'process',tag:'02 / HINTERGRUND',title:'Sorgfalt aus dem Finanzumfeld.',short:'Klare Abläufe. Saubere Informationen. Verbindliche Absprachen.',detail:'Mein beruflicher Hintergrund liegt am Schweizer Finanzplatz. Dort erlebe ich, wie wichtig Verlässlichkeit und eine klare Zusammenarbeit sind. Diesen Anspruch bringe ich in Ihre Projekte ein.'},
 {icon:'wrench',tag:'03 / ARBEITSWEISE',title:'Denken und Machen gehören zusammen.',short:'Vom Blick auf das Ganze bis zur konkreten Umsetzung.',detail:'Je nach Aufgabe bereite ich eine Entscheidung vor, vereinfache einen Ablauf, entwickle eine Anwendung oder gestalte einen Auftritt. Die Aufgabe bestimmt die passende Lösung.'}
];
export function FounderBackground(){return <section className="v8-background v6-wrap" aria-labelledby="background-heading"><div><p className="v6-eyebrow">Ein wenig mehr über mich</p><h2 id="background-heading">Was ich mitbringe.</h2><p>Kein langer Lebenslauf.<br/>Das, was für unsere Arbeit zählt.</p></div><div className="v8-background-list">{background.map(b=><details key={b.tag}><summary><span className="v8-background-icon"><Icon name={b.icon}/></span><span><small>{b.tag}</small><strong>{b.title}</strong><span>{b.short}</span></span><Icon name="plus"/></summary><p>{b.detail}</p></details>)}</div></section>}
