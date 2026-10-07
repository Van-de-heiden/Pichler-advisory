import assert from 'node:assert/strict';
import test from 'node:test';
const {default:worker}=await import('../dist/server/index.js');
async function render(path){return worker.fetch(new Request('https://test.example'+path,{headers:{accept:'text/html'}}),{ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},{waitUntil(){},passThroughOnException(){}})}
const clean=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const routes=['/','/leistungen/prozesse-automatisierung','/leistungen/apps-it-projekte','/leistungen/websites','/leistungen/betrieb-betreuung','/branchen/handwerk-bau','/branchen/handel-logistik','/branchen/dienstleistungen','/branchen/immobilien-bewirtschaftung','/branchen/produktion-gewerbe','/branchen/weitere-betriebe','/ueber-mich','/impressum','/datenschutz','/agb'];
test('complete new site renders, has a unique main heading, and all internal destinations resolve',async()=>{
 const destinations=new Set();
 for(const path of routes){const response=await render(path);assert.equal(response.status,200,path);const html=clean(await response.text());assert.equal((html.match(/<h1\b/g)||[]).length,1,path);assert.doesNotMatch(html,/Geschützter Zugang/);for(const match of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)/g)){destinations.add(match[1].replace(/&amp;/g,'&'));}}
 for(const path of destinations){const response=await render(path);assert.equal(response.status,200,path);}
 const home=clean(await (await render('/')).text());assert.match(home,/Was jeden Tag Zeit kostet/);assert.match(home,/kostet jedes Jahr Geld/);assert.match(home,/Ohne vorgängige Betriebsanalyse/);assert.match(home,/matterhorn-cutout.webp/);assert.match(home,/Kostenloses Erstgespräch/);assert.match(home,/Wunschtermine/);assert.doesNotMatch(home,/Anfrage vorbereiten|E-Mail-Entwurf öffnen/);assert.doesNotMatch(home,/p(?:·|<!-- -->·<!-- -->)work/);
 for(const path of ['/leistungen/unknown','/branchen/unknown','/leistungen/constructor','/branchen/constructor']){const r=await render(path);assert.equal(r.status,404,path);}
});
test('previous industry URLs redirect to the right broader business world',async()=>{
 const mappings={sanitaer:'handwerk-bau',heizung:'handwerk-bau',gartenbau:'handwerk-bau',immobilien:'immobilien-bewirtschaftung',coiffeur:'dienstleistungen',grosshandel:'handel-logistik',detailhandel:'handel-logistik',transport:'handel-logistik'};
 for(const [old,target] of Object.entries(mappings)){const r=await render('/branchen/'+old);assert.ok([307,308].includes(r.status),old);const destination=new URL(r.headers.get('location'),'https://test.example');assert.equal(destination.origin,'https://test.example',old);assert.equal(destination.pathname,'/branchen/'+target,old);}
});
test('recognized service enquiries preselect a useful topic; unknown and prototype keys are ignored',async()=>{
 const entries=[['prozesse-automatisierung','Abläufe verbessern'],['apps-it-projekte','Apps & IT-Projekte'],['websites','Websites & Betrieb'],['betrieb-betreuung','Betrieb & Betreuung']];
 for(const [slug,label] of entries){const response=await render('/?leistung='+slug);assert.equal(response.status,200);const html=clean(await response.text()).replace(/&amp;/g,'&');assert.ok(html.includes('value="'+label+'" selected=""'),slug);}
 for(const key of ['unknown','constructor','__proto__']){const response=await render('/?leistung='+key);assert.equal(response.status,200);assert.match(clean(await response.text()),/value="" selected=""/);}
});
