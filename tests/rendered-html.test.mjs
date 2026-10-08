import assert from 'node:assert/strict';
import test from 'node:test';
const {default:worker}=await import('../dist/server/index.js');
async function render(path){return worker.fetch(new Request('https://test.example'+path,{headers:{accept:'text/html'}}),{ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},{waitUntil(){},passThroughOnException(){}})}
const clean=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const routes=['/','/leistungen/prozesse-automatisierung','/leistungen/apps-it-projekte','/leistungen/websites','/leistungen/betrieb-betreuung','/branchen/handwerk-bau','/branchen/handel-logistik','/branchen/dienstleistungen','/branchen/immobilien-bewirtschaftung','/branchen/produktion-gewerbe','/branchen/weitere-betriebe','/ueber-mich','/impressum','/datenschutz','/agb'];
test('owner confirmation page is not indexable and reveals no booking without its secret link', async () => {
 const response=await render('/termine/bestaetigen');assert.equal(response.status,200);
 const html=clean(await response.text());assert.match(html,/<meta name="robots" content="noindex, nofollow"/);
 assert.match(html,/<meta name="referrer" content="no-referrer"/);
 assert.doesNotMatch(html,/token=|tokenHash|kunde@example/);
});
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

test('every sitemap URL is indexable and has its own canonical and sharing metadata',async()=>{
 const sitemap=await render('/sitemap.xml');assert.equal(sitemap.status,200);assert.match(sitemap.headers.get('content-type'),/application\/xml/);
 const locations=[...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(new Set(locations).size,routes.length);
 assert.deepEqual(new Set(locations),new Set(routes.map(path=>'https://pichler-advisory.ch'+path)));
 const titles=new Set();
 for(const url of locations){
  const path=new URL(url).pathname;const response=await render(path);assert.equal(response.status,200,path);
  const raw=await response.text();const html=clean(raw);
  assert.match(html,/<html[^>]*lang="de-CH"/);assert.doesNotMatch(html,/<meta[^>]+content="[^"]*noindex/i,path);
  assert.ok(html.includes(`rel="canonical" href="${url}"`),path);
  assert.ok(html.includes(`property="og:url" content="${url}"`),path);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title,path);assert.ok(!titles.has(title),'duplicate title: '+path);titles.add(title);
  const schema=[...raw.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
  assert.ok(schema.some(v=>v['@type']==='Organization'&&v.identifier.some(i=>i.value==='CHE-441.807.781')),path);
  if(path.startsWith('/leistungen/')){
   const service=schema.find(v=>v['@type']==='Service');assert.equal(service.url,url);assert.equal(service.provider['@id'],'https://pichler-advisory.ch/#organization');
  }
  if(path==='/ueber-mich')assert.ok(schema.some(v=>v['@type']==='ProfilePage'&&v.mainEntity['@id']==='https://pichler-advisory.ch/ueber-mich#person'));
 }
 const queried=clean(await(await render('/?leistung=websites')).text());assert.ok(queried.includes('rel="canonical" href="https://pichler-advisory.ch/"'));
});

test('search crawler policy and legacy search-result URLs stay usable',async()=>{
 const robots=await render('/robots.txt');assert.equal(robots.status,200);assert.match(robots.headers.get('content-type'),/text\/plain/);
 const text=await robots.text();
 for(const agent of ['OAI-SearchBot','Googlebot','Bingbot','*'])assert.ok(text.includes('User-agent: '+agent+'\n'));
 assert.match(text,/Allow: \/\n/);assert.match(text,/Disallow: \/api\/\n/);assert.match(text,/Sitemap: https:\/\/pichler-advisory.ch\/sitemap.xml/);
 for(const [old,target] of Object.entries({'/kontakt':'/#anfrage','/ueber-uns':'/ueber-mich','/leistungen':'/#leistungen'})){
  for(const suffix of ['', '/']){const r=await render(old+suffix);assert.equal(r.status,308);assert.equal(r.headers.get('location'),'https://test.example'+target);}
 }
 for(const path of routes.filter(p=>p!=='/')){const r=await render(path+'/');assert.equal(r.status,308);assert.equal(r.headers.get('location'),'https://test.example'+path);}
 const query=await render('/kontakt/?leistung=websites');assert.equal(query.headers.get('location'),'https://test.example/?leistung=websites#anfrage');
 const home=clean(await(await render('/')).text());
 for(const path of routes.filter(p=>p.startsWith('/branchen/')))assert.ok(home.includes(`href="${path}"`),'missing server-rendered link: '+path);
 assert.match(home,/kostenlosen und unverbindlichen Erstgespräch/);
 assert.match(home,/Gemeinde <!-- -->Gommiswald/);
});
