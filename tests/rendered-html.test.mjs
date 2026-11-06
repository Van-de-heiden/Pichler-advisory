import assert from 'node:assert/strict';
import test from 'node:test';
import {existsSync} from 'node:fs';
const {default:worker}=await import('../dist/server/index.js');
async function render(path,method='GET',host='test.example') {return worker.fetch(new Request('https://'+host+path,{method,headers:{accept:'text/html'}}),{ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},{waitUntil(){},passThroughOnException(){}})}
const clean=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const routes=['/','/ueber-mich','/impressum','/datenschutz','/agb'];

test('Sites v14 renders on the server without preview scaffolding or obsolete pages',async()=>{
 for(const path of routes){const response=await render(path);assert.equal(response.status,200,path);
  const html=clean(await response.text());assert.equal((html.match(/<h1\b/g)||[]).length,1,path);
  assert.doesNotMatch(html,/Private Entwurfsvorschau|Versand deaktiviert|Vorschau sendet nichts|ChatGPT Sites|shield\.png|matterhorn-cutout/);
  for(const match of html.matchAll(/<img\b[^>]*\bsrc="(\/[^"]+)"/g))assert.ok(existsSync(new URL('../public'+match[1],import.meta.url)),match[1]);
 }
 const home=clean(await(await render('/')).text());
 for(const text of ['Zeit kostet','Geld.','hero-heading','leistungsdetails','spielraum','zusammenarbeit','anfrage','Kostenloses Erstgespräch','Wunschtermine','planning-landscape-v10.png'])assert.ok(home.includes(text),text);
 assert.match(home,/type="submit"/);assert.doesNotMatch(home,/href="\/branchen\/|href="\/leistungen\//);
 for(const path of ['/unknown','/blog','/leistungen/unknown','/branchen/unknown','/leistungen/constructor','/branchen/__proto__'])assert.equal((await render(path)).status,404,path);
});

test('public pages have canonical, sharing, organization and indexable search metadata',async()=>{
 const response=await render('/sitemap.xml');assert.equal(response.status,200);
 const xml=await response.text();const locations=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.deepEqual(new Set(locations),new Set(routes.map(p=>'https://pichler-advisory.ch'+p)));
 const titles=new Set();
 for(const path of routes){const raw=await(await render(path)).text();const html=clean(raw);
  assert.match(html,/<html[^>]*lang="de-CH"/);assert.doesNotMatch(html,/<meta[^>]+content="[^"]*noindex/i,path);
  assert.ok(html.includes(`rel="canonical" href="https://pichler-advisory.ch${path}"`),path);
  assert.ok(html.includes(`property="og:url" content="https://pichler-advisory.ch${path}"`),path);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title);assert.ok(!titles.has(title));titles.add(title);
  const schema=[...raw.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
  assert.ok(schema.some(v=>v['@type']==='Organization'&&v.identifier.some(i=>i.value==='CHE-441.807.781')),path);
 }
 const robots=await(await render('/robots.txt')).text();
 for(const agent of ['OAI-SearchBot','Googlebot','Bingbot','*'])assert.ok(robots.includes('User-agent: '+agent+'\n'));
 assert.match(robots,/Allow: \/\n/);assert.match(robots,/Disallow: \/api\/\n/);assert.match(robots,/Disallow: \/termine\/\n/);
 assert.doesNotMatch(xml,/\/termine\/|\/blog|\/branchen\/|\/leistungen\//);
});

test('old links redirect to useful sections and preserve campaign data and correct service',async()=>{
 const map={'/kontakt':'/#anfrage','/ueber-uns':'/ueber-mich','/leistungen':'/#leistungen'};
 for(const slug of ['prozesse-automatisierung','apps-it-projekte','websites','betrieb-betreuung'])map['/leistungen/'+slug]=`/?leistung=${slug}#leistungen`;
 for(const slug of ['handwerk-bau','handel-logistik','dienstleistungen','immobilien-bewirtschaftung','produktion-gewerbe','weitere-betriebe','sanitaer','heizung','gartenbau','immobilien','coiffeur','grosshandel','detailhandel','transport'])map['/branchen/'+slug]='/#spielraum';
 for(const [old,target] of Object.entries(map))for(const slash of ['','/'])for(const method of ['GET','HEAD']){const r=await render(old+slash,method);assert.equal(r.status,308,old);assert.equal(r.headers.get('location'),'https://test.example'+target,old);}
 assert.equal((await render('/leistungen/websites/?utm_source=old&leistung=apps-it-projekte')).headers.get('location'),'https://test.example/?leistung=websites&utm_source=old#leistungen');
 assert.equal((await render('/kontakt/?utm_source=old')).headers.get('location'),'https://test.example/?utm_source=old#anfrage');
 for(const path of routes.filter(p=>p!=='/'))assert.equal((await render(path+'/')).headers.get('location'),'https://test.example'+path);
 assert.equal((await render('/ueber-mich','GET','www.pichler-advisory.ch')).headers.get('location'),'https://pichler-advisory.ch/ueber-mich');
});

test('query topics select the correct service and ignore unknown or prototype keys',async()=>{
 const entries=[['unternehmensberatung','Unternehmensberatung','beratung'],['prozesse-automatisierung','Abläufe verbessern','prozesse'],['apps-it-projekte','Apps & IT-Projekte','digital'],['websites','Websites & Betrieb','websites'],['betrieb-betreuung','Betrieb & Betreuung','websites']];
 for(const [slug,label,id] of entries){const html=clean(await(await render('/?leistung='+slug)).text()).replace(/&amp;/g,'&');assert.ok(html.includes('value="'+label+'" selected=""'),slug);assert.match(html,new RegExp(`id="tab-${id}"[^>]*aria-selected="true"`));}
 for(const key of ['unknown','constructor','__proto__']){const html=clean(await(await render('/?leistung='+key)).text());assert.match(html,/value="" selected=""/);assert.match(html,/id="tab-beratung"[^>]*aria-selected="true"/);}
});

test('existing confirmation stays private and APIs do not fall into page redirects',async()=>{
 const response=await render('/termine/bestaetigen');assert.equal(response.status,200);
 const html=clean(await response.text());assert.match(html,/<meta name="robots" content="noindex, nofollow"/);assert.match(html,/<meta name="referrer" content="no-referrer"/);assert.doesNotMatch(html,/token=|tokenHash|kunde@example/);
 assert.equal((await render('/api/enquiries')).status,405);assert.equal((await render('/api/bookings/test/details')).status,405);
});

test('privacy text explains durable intake, repeat protection and separate booking retention',async()=>{
 const html=clean(await(await render('/datenschutz')).text());
 for(const text of ['Anfrageregister','kryptografischer Fingerabdruck','Sitzungsspeicher','30 Tage','nicht das interne Anfrageregister','Infomaniak Calendar'])assert.ok(html.includes(text),text);
 assert.doesNotMatch(html,/Zur privaten Vorschau|Formular dieser Vorschau/);
});
