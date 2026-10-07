import assert from 'node:assert/strict';
import test from 'node:test';
import { BookingDesk, handleBooking, registerBooking } from '../worker/bookings.ts';
import { InfomaniakCalendar, CalendarError } from '../worker/calendar.ts';
import { handleEnquiry } from '../worker/enquiries.ts';
import { zurichDate, slotInstant } from '../lib/enquiry.ts';

const enquiry = () => ({ kind: 'meeting', name: 'Test Kunde', email: 'kunde@example.ch', company: 'Beispiel AG', phone: '+41 79 123 45 67', message: 'Rapporte vereinfachen.', topic: 'Abläufe verbessern', format: 'video', slots: [{ date: zurichDate(new Date(Date.now() + 3 * 86400000)), time: '10:00' }, { date: zurichDate(new Date(Date.now() + 4 * 86400000)), time: '14:00' }] });
function harness() {
  const values = new Map(); let alarm = null, queue = Promise.resolve();
  const state = { storage: {
    get: async key => structuredClone(values.get(key)), put: async (key, value) => { values.set(key, structuredClone(value)); },
    delete: async key => values.delete(key), list: async () => structuredClone(values),
    getAlarm: async () => alarm, setAlarm: async value => { alarm = value; },
  }, blockConcurrencyWhile: callback => { const next = queue.then(callback); queue = next.catch(() => {}); return next; } };
  const env = { INFOMANIAK_CALENDAR_TOKEN: 'test-token' };
  const desk = new BookingDesk(state, env);
  env.BOOKINGS = { idFromName: name => name, get: () => ({ fetch: request => desk.fetch(request) }) };
  let creates = 0;
  desk.calendar = {
    target: async () => ({ id: '7', name: 'Pichler Advisory', organizer: { email: 'info@example.ch', name: 'Maurus' } }),
    available: async () => true,
    create: async () => { creates++; return 'event-1'; },
  };
  return { env, desk, state, values, creates: () => creates };
}
async function setup(h, data = enquiry()) {
  const id = crypto.randomUUID(); const link = await registerBooking(h.env, data, id);
  const token = new URLSearchParams(new URL(link).hash.slice(1)).get('token');
  const call = (action, body = {}, overrideToken = token, method = 'POST') => handleBooking(new Request(`https://pichler-advisory.ch/api/bookings/${id}/${action}`, { method, headers: { origin: 'https://pichler-advisory.ch', 'content-type': 'application/json', 'x-booking-token': overrideToken }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) }), h.env);
  return { id, token, link, call };
}

test('owner link secret is fragment-only, hashed at rest and never returned to visitor', async () => {
  const h = harness(), b = await setup(h);
  assert.equal(new URL(b.link).search, ''); assert.equal(b.token.length, 64);
  assert.notEqual(h.values.get('booking:' + b.id).tokenHash, b.token);
  assert.doesNotMatch(JSON.stringify([...h.values]), new RegExp(b.token));
  assert.equal((await b.call('details', {}, 'a'.repeat(64))).status, 403);
  assert.equal((await b.call('confirm', {}, b.token, 'GET')).status, 405);
  assert.equal((await (await b.call('details')).json()).status, 'pending'); assert.equal(h.creates(), 0);
  assert.doesNotMatch(await (await b.call('details')).text(), /tokenHash|test-token/);
});
test('confirmation persists and duplicate or concurrent clicks create one event only', async () => {
  const h = harness(), b = await setup(h);
  const results = await Promise.all([b.call('confirm', { selected: 0 }), b.call('confirm', { selected: 0 })]);
  for (const result of results) assert.equal((await result.json()).status, 'confirmed');
  assert.equal(h.creates(), 1);
  const saved = h.values.get('booking:' + b.id); assert.match(saved.meetingUrl, /^https:\/\/kmeet.infomaniak.com\/[a-f0-9]{64}$/);
  const restored = new BookingDesk(h.state, h.env); restored.calendar = { create: () => assert.fail('no duplicate after restart') };
  h.env.BOOKINGS.get = () => ({ fetch: req => restored.fetch(req) });
  assert.equal((await (await b.call('confirm', { selected: 1 })).json()).selected, 0);
});
test('phone appointments have no video link; conflicts and expired slots do not create events', async () => {
  const h = harness(), b = await setup(h, { ...enquiry(), format: 'phone' });
  h.desk.calendar.available = async () => false;
  assert.equal((await b.call('confirm', { selected: 0 })).status, 409); assert.equal(h.creates(), 0);
  h.desk.calendar.available = async () => true;
  assert.equal((await (await b.call('confirm', { selected: 1 })).json()).meetingUrl, null);
  const old = await setup(h, { ...enquiry(), slots: [{ date: '2026-01-01', time: '10:00' }, enquiry().slots[1]] });
  assert.equal((await old.call('confirm', { selected: 0 })).status, 409);
});
test('ambiguous provider failures never cause automatic duplicate invitations', async () => {
  const h = harness(), b = await setup(h); let attempts = 0;
  h.desk.calendar.create = async () => { attempts++; throw new CalendarError('Unklar', true); };
  assert.equal((await (await b.call('confirm', { selected: 0 })).json()).status, 'uncertain');
  assert.equal((await (await b.call('confirm', { selected: 1 })).json()).status, 'uncertain'); assert.equal(attempts, 1);
  const restart = h.values.get('booking:' + b.id); restart.status = 'creating'; h.values.set('booking:' + b.id, restart);
  assert.equal((await (await b.call('confirm', { selected: 0 })).json()).status, 'uncertain'); assert.equal(attempts, 1);
});
test('explicit provider rejection permits retry; automatic retention removes expired records', async () => {
  const h = harness(), b = await setup(h);
  h.desk.calendar.create = async () => { throw new CalendarError('Token ungültig'); };
  assert.equal((await b.call('confirm', { selected: 0 })).status, 502);
  assert.equal(h.values.get('booking:' + b.id).status, 'pending');
  const record = h.values.get('booking:' + b.id); record.expiresAt = Date.now() - 1; h.values.set('booking:' + b.id, record);
  assert.equal((await b.call('details')).status, 410); await h.desk.alarm(); assert.equal(h.values.size, 0);
});
test('calendar request carries Zurich instants, kMeet link and actionable attendee invitation', async () => {
  const calls = []; const e = enquiry();
  const calendar = new InfomaniakCalendar({ INFOMANIAK_CALENDAR_TOKEN: 'test' }, async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith('/pim/calendar')) return Response.json({ result: 'success', data: { calendars: [{ id: 4, name: 'PA', default: true }, { id: 6, name: 'Privat' }] } });
    if (url.endsWith('/2/profile')) return Response.json({ data: { email: 'maurus@example.ch', display_name: 'Maurus Pichler' } });
    if (init.method === 'POST') return Response.json({ result: 'success', data: { id: 42 } });
    return Response.json({ data: [] });
  });
  const target = await calendar.target(); assert.equal(target.id, '4');
  assert.equal(await calendar.available(target.id, e.slots[0]), true);
  const link = 'https://kmeet.infomaniak.com/private-room';
  assert.equal(await calendar.create(target, e, e.slots[0], 'ref-42', link), '42');
  const payload = JSON.parse(calls.at(-1).init.body);
  assert.equal(payload.notifyAttendees, true); assert.equal(payload.meet_room_url, link); assert.equal(payload.location, link);
  assert.equal(payload.attendees[0].address, e.email); assert.equal(payload.attendees[1].organizer, true);
  assert.equal(payload.timezone_start, 'Europe/Zurich'); assert.equal(Date.parse(payload.start.replace(' ', 'T') + 'Z'), slotInstant(e.slots[0]));
  assert.match(payload.description, /ref-42/); assert.match(payload.description, /Kostenloses und unverbindliches/);
});
test('calendar cannot silently choose an arbitrary calendar, ignores free events, and preserves uncertainty', async () => {
  const calendar = new InfomaniakCalendar({ INFOMANIAK_CALENDAR_TOKEN: 'test' }, async url => Response.json({ data: url.endsWith('/2/profile') ? { email: 'maurus@example.ch' } : { calendars: [{ id: 1 }, { id: 2 }] } }));
  await assert.rejects(() => calendar.target(), /Standardkalender/);
  calendar.request = async () => { throw new Error('Network failure'); };
  await assert.rejects(() => calendar.api('/1/calendar/pim/event', {}), e => e.uncertain === true);
  calendar.request = async () => new Response('', { status: 401 });
  await assert.rejects(() => calendar.api('/1/calendar/pim/event', {}), e => e.uncertain === false);
  calendar.request = async () => Response.json({ data: [{ freebusy: 'free' }] });
  assert.equal(await calendar.available('1', enquiry().slots[0]), true);
});
test('public enquiry emails the approval link only to the owner and returns just a reference', async () => {
  const h = harness(); const env = { ...h.env, MAIL_PASSWORD: 'test', ENQUIRY_LIMITER: { limit: async () => ({ success: true }) }, ENQUIRY_TOTAL_LIMITER: { limit: async () => ({ success: true }) } };
  let mail;
  const response = await handleEnquiry(new Request('https://pichler-advisory.ch/api/enquiries', { method: 'POST', headers: { origin: 'https://pichler-advisory.ch', 'content-type': 'application/json' }, body: JSON.stringify({ ...enquiry(), privacy: true, website: '' }) }), env, async value => { mail = value; });
  assert.equal(response.status, 200); assert.equal(mail.to, 'info@pichler-advisory.ch'); assert.match(mail.text, /termine\/bestaetigen#id=/); assert.doesNotMatch(await response.text(), /token=|tokenHash/); assert.equal(h.creates(), 0);
});
