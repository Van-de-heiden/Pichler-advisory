import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { handleRebranding, isRebrandingEnabled } from '../worker/rebranding.ts';

const html = readFileSync(new URL('../public/rebranding/index.html', import.meta.url), 'utf8');
const enabled = { REBRANDING_MODE: 'on' };
const request = (path, method = 'GET') => new Request('https://pichler-advisory.ch' + path, { method });

test('rebranding is opt-in and immediately reversible without changing old routes', () => {
  for (const value of [undefined, '', 'off', 'ON', 'true']) {
    const env = { REBRANDING_MODE: value };
    assert.equal(isRebrandingEnabled(env), false);
    for (const path of ['/', '/leistungen/websites', '/kontakt']) assert.equal(handleRebranding(request(path), env, html), null);
  }
  assert.equal(isRebrandingEnabled(enabled), true);
});

test('holding page is self-contained presentation with correct contact and security headers', async () => {
  const response = handleRebranding(request('/?leistung=websites'), enabled, html);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=60');
  assert.match(response.headers.get('content-security-policy'), /script-src 'none'.*frame-ancestors 'none'/);
  const body = await response.text();
  assert.equal(body, html);
  assert.match(body, /Neuer Auftritt/);
  assert.match(body, /mailto:info@pichler-advisory.ch/);
  assert.doesNotMatch(body, /<script|<form|<iframe/);
  const head = handleRebranding(request('/', 'HEAD'), enabled, html);
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal(head.headers.get('content-type'), response.headers.get('content-type'));
});

test('known marketing URLs use reversible redirects and contact anchors remain usable', () => {
  for (const path of ['/leistungen', '/leistungen/websites', '/leistungen/websites/', '/branchen/sanitaer', '/branchen/handwerk-bau', '/ueber-mich', '/ueber-uns']) {
    const response = handleRebranding(request(path), enabled, html);
    assert.equal(response.status, 302, path);
    assert.equal(response.headers.get('location'), 'https://pichler-advisory.ch/');
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal(handleRebranding(request('/kontakt/?leistung=websites'), enabled, html).headers.get('location'), 'https://pichler-advisory.ch/#anfrage');
  assert.match(html, /id="anfrage"/);
});

test('APIs, legal pages, confirmation links, assets and unknown paths are never intercepted', () => {
  for (const path of ['/api/enquiries', '/api/bookings/123/details', '/termine/bestaetigen?token=example', '/impressum', '/impressum/', '/datenschutz', '/agb', '/rebranding/style.css', '/assets/example.js', '/_vinext/image', '/robots.txt', '/sitemap.xml', '/unbekannt', '/leistungen/constructor', '/branchen/unknown']) {
    for (const method of ['GET', 'HEAD', 'POST', 'OPTIONS']) assert.equal(handleRebranding(request(path, method), enabled, html), null, `${method} ${path}`);
  }
  for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS']) assert.equal(handleRebranding(request('/', method), enabled, html), null);
});

test('www retains canonical hostname and does not rewrite a confirmation link', () => {
  const response = handleRebranding(new Request('https://www.pichler-advisory.ch/?leistung=websites'), enabled, html);
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://pichler-advisory.ch/?leistung=websites');
  assert.equal(handleRebranding(new Request('https://www.pichler-advisory.ch/termine/bestaetigen?token=example'), enabled, html), null);
});

test('Vinext transport URLs redirect to clean holding documents without caching Flight data', () => {
  for (const method of ['GET', 'HEAD']) {
    for (const path of ['/.rsc?_rsc=stale&utm_source=test', '/leistungen/websites.rsc?_rsc=stale', '/ueber-mich.rsc/', '/kontakt.rsc?_rsc=stale']) {
      const response = handleRebranding(request(path, method), enabled, html);
      assert.equal(response.status, 302, path);
      const target = new URL(response.headers.get('location'));
      assert.equal(target.pathname, '/');
      assert.equal(target.searchParams.has('_rsc'), false);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      if (path.startsWith('/.rsc')) assert.equal(target.searchParams.get('utm_source'), 'test');
      if (path.startsWith('/kontakt')) assert.equal(target.hash, '#anfrage');
    }
  }
  for (const path of ['/.rsc', '/ueber-mich.rsc', '/leistungen/websites.rsc']) {
    assert.equal(handleRebranding(request(path), {}, html), null);
    assert.equal(handleRebranding(request(path, 'POST'), enabled, html), null);
  }
  for (const path of ['/impressum.rsc', '/datenschutz.rsc', '/agb.rsc', '/termine/bestaetigen.rsc', '/api/enquiries.rsc', '/unknown.rsc']) {
    assert.equal(handleRebranding(request(path), enabled, html), null, path);
  }
  const canonical = handleRebranding(new Request('https://www.pichler-advisory.ch/.rsc?_rsc=x'), enabled, html);
  assert.equal(canonical.headers.get('location'), 'https://pichler-advisory.ch/');
  assert.equal(canonical.status, 302);
  assert.equal(canonical.headers.get('cache-control'), 'no-store');
});
