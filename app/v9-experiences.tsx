'use client';
import {useEffect,useRef,useState} from 'react';
import {Arrow,Icon} from './ui';

const phoneStates=[
 {state:'Erfasst',title:'Vor Ort erledigt.',text:'Zeit und Material direkt im Auftrag erfassen.',action:'Angaben prüfen',rows:[['Arbeitszeit','2 Std. 30 Min.'],['Material','3 Positionen']]},
 {state:'Geprüft',title:'Alles vollständig.',text:'Das Büro sieht sofort, was geleistet wurde.',action:'Auftrag freigeben',rows:[['Leistung','Geprüft'],['Material','Geprüft']]},
 {state:'Freigegeben',title:'Bereit fürs Büro.',text:'Die Angaben sind für die Abrechnung bereit.',action:'Beispiel neu starten',rows:[['Übergabe','Erledigt'],['Erneut erfassen','Nicht nötig']]}
];
export function IPhoneDemo(){
 const [step,setStep]=useState(0);const state=phoneStates[step];
 return <div className="service-visual visual-digital v9-phone-visual"><div className="visual-orbit"/><div className="v9-phone-shadow" aria-hidden="true"/><div className="v9-iphone" aria-label="Interaktives App-Beispiel in einem iPhone-Rahmen">
  <span className="v9-phone-side side-action" aria-hidden="true"/><span className="v9-phone-side side-volume-one" aria-hidden="true"/><span className="v9-phone-side side-volume-two" aria-hidden="true"/><span className="v9-phone-side side-power" aria-hidden="true"/>
  <div className="v9-iphone-bezel"><div className="v9-iphone-screen"><div className="v9-phone-status" aria-hidden="true"><span>9:41</span><span className="v9-status-icons"><svg viewBox="0 0 18 12"><path d="M1 11V8h2v3M5 11V6h2v5M9 11V3h2v8M13 11V0h2v11" fill="currentColor"/></svg><svg viewBox="0 0 16 12"><path d="M1 4C5 0 11 0 15 4M4 7c2-2 6-2 8 0M7 10h2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg><span className="v9-battery"/></span></div><div className="v9-dynamic-island" aria-hidden="true"><span/></div>
   <div className="v9-phone-app"><div className="v9-app-nav"><span className="v9-app-mark">P<span/></span><span>Betrieb<span>Alles an einem Ort.</span></span><span className="v9-app-avatar">MP</span></div>
    <div className="v9-app-content" aria-live="polite" aria-atomic="true"><div className="v9-app-order"><span>AUFTRAG 1042</span><span className={step===2?'is-done':''}>{state.state}</span></div><h4>{state.title}</h4><p>{state.text}</p><div className="v9-app-record"><div className="v9-record-heading"><Icon name={step===2?'check':'file'}/><span>Serviceauftrag<span>Beispielbetrieb</span></span></div>{state.rows.map(([key,value])=><div className="v9-record-row" key={key}><span>{key}</span><strong>{value}</strong></div>)}<div className="v9-record-foot"><span/>{step===0?'Vor Ort gespeichert':step===1?'Angaben vollständig':'Für die Abrechnung freigegeben'}</div></div></div>
    <ol className="v9-phone-steps" aria-label="Beispielschritte">{['Erfassen','Prüfen','Freigeben'].map((label,i)=><li className={step>=i?'is-done':''} key={label} aria-current={step===i?'step':undefined}><span/><span>{label}</span></li>)}</ol>
    <button className="v9-phone-action" onClick={()=>setStep((step+1)%3)}>{state.action}<Arrow/></button><span className="v9-phone-demo-note">Interaktives Gestaltungsbeispiel</span>
   </div><span className="v9-home-indicator" aria-hidden="true"/>
  </div></div></div><span className="v6-visual-hint">Tippen Sie sich durch den Auftrag.</span></div>;
}

const islandLabels=['Zeit','Kosten','Wachstum'];
export function IslandPlatform({selected,onSelect}:{selected:number;onSelect:(index:number)=>void}){
 const platform=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);
 useEffect(()=>{const el=platform.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});observer.observe(el);return()=>observer.disconnect()},[]);
 return <div ref={platform} className={`v10-landscape ${visible?'is-inview':''}`}>
  <div className="v10-landscape-scene" role="group" aria-label="Ziel auf der Landschaft wählen">
   <img src="/planning-landscape-v10.png" width="1536" height="1024" alt="Zusammenhängende Landschaft mit einer Uhr für Zeit, Münzen für Kosten und einer Pflanze für Wachstum" loading="lazy"/>
   {islandLabels.map((label,i)=><button key={label} className={`v10-island-zone zone-${i} ${selected===i?'is-active':''}`} onClick={()=>onSelect(i)} aria-pressed={selected===i} aria-label={`${label}-Insel auswählen`} aria-controls="opportunity-answer"><span className="v10-island-label"><span className="v10-island-dot"/>{label}<Arrow/></span></button>)}
  </div>
  <p className="v10-landscape-caption" aria-hidden="true"><span>0{selected+1}</span><span key={selected}>{['Zeit zurückgewinnen.','Kosten senken.','Wachstum ermöglichen.'][selected]}</span></p>
 </div>;
}
