import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
const { default: worker } = await import('../dist/server/index.js');
const env = { REBRANDING_MODE: 'on', ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const render = (path, method = 'GET', mode = 'on') => worker.fetch(new Request('https://pichler-advisory.ch' + path, { method, headers: { accept: 'text/html' } }), { ...env, REBRANDING_MODE: mode }, { waitUntil() {}, passThroughOnException() {} });

test('built Worker serves exactly the validated static page when enabled, old homepage when disabled', async () => {
  const page = readFileSync(new URL('../public/rebranding/index.html', import.meta.url), 'utf8');
  assert.equal(await (await render('/')).text(), page);
  assert.match(await (await render('/', 'GET', 'off')).text(), /Was jeden Tag Zeit kostet/);
  assert.equal(await (await render('/', 'HEAD')).text(), '');
  for (const asset of [...page.matchAll(/(?:src|href)="(\/rebranding\/[^"#]+)"/g)].map(m => m[1])) {
    assert.ok(existsSync(new URL('../dist/client' + asset, import.meta.url)), asset);
  }
});

test('built Worker keeps legal and booking pages, API method handling and real 404 responses', async () => {
  for (const path of ['/impressum', '/datenschutz', '/agb', '/termine/bestaetigen']) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.doesNotMatch(html, /Neuer Auftritt\.<br>/, path);
    if (path.startsWith('/termine/')) assert.match(html, /noindex, nofollow/);
  }
  for (const path of ['/api/enquiries', '/api/bookings/123/details']) assert.equal((await render(path)).status, 405, path);
  for (const path of ['/unknown', '/leistungen/unknown', '/branchen/constructor']) assert.equal((await render(path)).status, 404, path);
});

test('active sitemap contains only holding and legal pages, robots policy stays unchanged', async () => {
  const response = await render('/sitemap.xml');
  assert.equal(response.status, 200);
  const urls = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(urls, ['https://pichler-advisory.ch/', 'https://pichler-advisory.ch/impressum', 'https://pichler-advisory.ch/datenschutz', 'https://pichler-advisory.ch/agb']);
  const robots = await (await render('/robots.txt')).text();
  assert.match(robots, /Allow: \/\n/);
  assert.match(robots, /Disallow: \/api\/\n/);
  assert.doesNotMatch(robots, /Disallow: \/\n/);
});
