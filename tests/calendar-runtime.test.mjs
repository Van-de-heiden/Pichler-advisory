import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { Miniflare } from 'miniflare';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
const entry = `import { InfomaniakCalendar } from './worker/calendar.ts';
export default { async fetch(request, env) {
  const calendar = new InfomaniakCalendar(env);
  try {
    const mode = new URL(request.url).pathname;
    if (mode === '/read') return Response.json(await calendar.api('/2/profile'));
    if (mode === '/write') return Response.json(await calendar.api('/1/calendar/pim/event', {title: 'Test'}));
    const target = await calendar.target();
    const slot = {date:'2026-11-02',time:'14:00'};
    const available = await calendar.available(target.id, slot);
    const enquiry = {kind:'meeting',name:'Test',email:'visitor@example.ch',company:'',phone:'',topic:'',message:'',format:'video',slots:[slot]};
    const eventId = await calendar.create(target, enquiry, slot, 'runtime-test', 'https://kmeet.infomaniak.com/test-only');
    return Response.json({calendarId:target.id, available, eventId});
  } catch (error) { return Response.json({error:error.message,uncertain:error.uncertain}, {status:502}); }
} }`;

async function runtime(outboundService) {
  // Real workerd request construction and native fetch. Only the external
  // service is simulated; no Infomaniak account or invitations are touched.
  const modules = [{ type: 'ESModule', path: root + 'calendar-runtime-entry.mjs', contents: entry }];
  for (const path of ['worker/calendar.ts', 'lib/enquiry.ts']) {
    modules.push({ type: 'ESModule', path: root + path, contents: stripTypeScriptTypes(await readFile(root + path, 'utf8')) });
  }
  return new Miniflare({ modules, modulesRoot: root, cf: false,
    compatibilityDate: config.compatibility_date, compatibilityFlags: config.compatibility_flags,
    bindings: { INFOMANIAK_CALENDAR_TOKEN: 'runtime-test-token' }, outboundService,
  });
}

test('native Workers fetch can read the calendar and profile, check a slot and create its event', async () => {
  const calls = [];
  const mf = await runtime(async request => {
    const url = new URL(request.url);
    assert.equal(url.origin, 'https://api.infomaniak.com');
    assert.equal(request.headers.get('authorization'), 'Bearer runtime-test-token');
    calls.push({ path: url.pathname, method: request.method });
    if (url.pathname === '/2/profile') return Response.json({ data: { email: 'owner@example.ch', display_name: 'Owner' } });
    if (url.pathname === '/1/calendar/pim/calendar') return Response.json({ data: { calendars: [{ id: 7, name: 'Business', default: true }] } });
    assert.equal(url.pathname, '/1/calendar/pim/event');
    if (request.method === 'POST') {
      const body = await request.json();
      assert.equal(body.start, '2026-11-02 13:00:00');
      assert.equal(body.end, '2026-11-02 13:30:00');
      assert.equal(body.timezone_start, 'Europe/Zurich');
      assert.equal(body.notifyAttendees, true);
      return Response.json({ data: { id: 42 } });
    }
    return Response.json({ data: [] });
  });
  try {
    const response = await mf.dispatchFetch('https://test.example/flow');
    const result = await response.json();
    assert.equal(response.status, 200, JSON.stringify(result));
    assert.deepEqual(result, { calendarId: '7', available: true, eventId: '42' });
    assert.equal(calls.length, 4);
    assert.equal(calls.filter(call => call.method === 'POST').length, 1);
  } finally { await mf.dispose(); }
});

test('Workers rejects redirects without forwarding credentials or retrying event creation', async () => {
  let calls = 0;
  const mf = await runtime(request => {
    assert.equal(new URL(request.url).origin, 'https://api.infomaniak.com');
    calls++;
    return new Response(null, { status: 307, headers: { location: 'https://unexpected.example/collect' } });
  });
  try {
    for (const mode of ['read', 'write']) {
      const response = await mf.dispatchFetch('https://test.example/' + mode);
      const result = await response.json();
      assert.equal(response.status, 502);
      assert.match(result.error, /umgeleitet/);
      assert.equal(result.uncertain, mode === 'write');
    }
    assert.equal(calls, 2);
  } finally { await mf.dispose(); }
});
