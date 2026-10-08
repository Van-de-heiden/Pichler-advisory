import assert from 'node:assert/strict';
import test from 'node:test';
import { EventEmitter } from 'node:events';
import { smtpSocket } from '../worker/smtp-socket.ts';
import nodemailer from 'nodemailer';
import { validateEnquiry, enquiryMail, slotInstant, ENQUIRY_EMAIL } from '../lib/enquiry.ts';
import { handleEnquiry } from '../worker/enquiries.ts';

const now = Date.UTC(2026, 9, 7, 9);
const message = { kind: 'message', name: 'Max Muster', email: 'max@example.ch', company: 'Muster AG', phone: '', topic: '', message: 'Wir möchten die Rapporte vereinfachen.', privacy: true, website: '' };
const meeting = { ...message, kind: 'meeting', message: '', format: 'video', slots: [{ date: '2026-10-20', time: '10:00' }, { date: '2026-11-02', time: '14:00' }] };
const env = () => ({ MAIL_PASSWORD: 'test-only-not-a-secret', ENQUIRY_LIMITER: { limit: async () => ({ success: true }) }, ENQUIRY_TOTAL_LIMITER: { limit: async () => ({ success: true }) } });
const request = (data = message, headers = {}) => new Request('https://pichler-advisory.ch/api/enquiries', { method: 'POST', headers: { origin: 'https://pichler-advisory.ch', 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.1', ...headers }, body: JSON.stringify(data) });

test('Zurich wall-clock times survive summer/winter change and reject invalid/ambiguous dates', () => {
  assert.equal(slotInstant(meeting.slots[0]), Date.UTC(2026, 9, 20, 8));
  assert.equal(slotInstant(meeting.slots[1]), Date.UTC(2026, 10, 2, 13));
  assert.ok(Number.isNaN(slotInstant({ date: '2026-02-30', time: '10:00' })));
  assert.ok(Number.isNaN(slotInstant({ date: '2026-10-25', time: '02:30' })));
  assert.ok(Number.isNaN(slotInstant({ date: '2027-03-28', time: '02:30' })));
  assert.ok(Number.isNaN(slotInstant({ date: '2026-10-20', time: '25:00' })));
});
test('meeting requires 2–3 distinct future slots and phone for phone calls', () => {
  assert.equal(validateEnquiry(meeting, now).slots.length, 2);
  for (const slots of [[], [meeting.slots[0]], [...meeting.slots, ...meeting.slots], [meeting.slots[0], meeting.slots[0]], [{ date: '2026-10-01', time: '10:00' }, meeting.slots[1]]]) assert.throws(() => validateEnquiry({ ...meeting, slots }, now));
  assert.throws(() => validateEnquiry({ ...meeting, format: 'phone' }, now));
  assert.equal(validateEnquiry({ ...meeting, format: 'phone', phone: '+41 79 123 45 67' }, now).format, 'phone');
});
test('appointments fit 07:00–19:00 Zurich time on every weekday, including weekends', () => {
  for (let day = 12; day <= 18; day++) {
    const date = `2026-10-${day}`;
    const slots = [{ date, time: '07:00' }, { date, time: '18:30' }];
    assert.deepEqual(validateEnquiry({ ...meeting, slots }, now).slots, slots);
  }
  for (const time of ['00:00', '06:45', '07:01', '10:07', '18:31', '18:45', '19:00', '23:45', '7:00']) {
    assert.throws(() => validateEnquiry({ ...meeting, slots: [{ date: '2026-10-20', time }, meeting.slots[1]] }, now), /15-Minuten-Takt/, time);
  }
  for (const time of ['07:15', '07:30', '07:45', '12:00', '18:15']) {
    assert.equal(validateEnquiry({ ...meeting, slots: [{ date: '2026-10-20', time }, meeting.slots[1]] }, now).slots[0].time, time);
  }
});
test('rejects header injection, bad address, honeypot, missing consent and oversized input', () => {
  for (const change of [{ name: 'Max\r\nBcc: other@example.com' }, { email: 'max@example.ch,other@example.com' }, { website: 'spam' }, { privacy: false }, { kind: 'other' }, { message: 'x'.repeat(3001) }, { name: {} }]) assert.throws(() => validateEnquiry({ ...message, ...change }, now));
});
test('mail always goes to the owner, replies go to visitor, times and manual confirmation are explicit', async () => {
  const mail = enquiryMail(validateEnquiry(meeting, now), 'request-test');
  assert.equal(mail.to, ENQUIRY_EMAIL); assert.equal(mail.from.address, ENQUIRY_EMAIL); assert.equal(mail.replyTo.address, message.email);
  assert.match(mail.text, /NOCH NICHT BESTÄTIGT/); assert.match(mail.text, /20.10.2026, 10:00/); assert.match(mail.text, /02.11.2026, 14:00/); assert.match(mail.text, /noch kein Kalendereintrag/);
  const composer = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const result = await composer.sendMail(mail);
  const mime = result.message.toString();
  assert.match(mime, /Reply-To: Max Muster <max@example.ch>/); assert.match(mime, /To: info@pichler-advisory.ch/);
});
test('API awaits acceptance, never reports success on transport failure and reveals no secrets', async () => {
  let sends = 0; let release;
  const pending = handleEnquiry(request(), env(), async mail => { sends++; assert.equal(mail.to, ENQUIRY_EMAIL); await new Promise(resolve => { release = resolve; }); });
  while (!release) await new Promise(resolve => setTimeout(resolve, 0));
  let settled = false; pending.then(() => { settled = true; });
  await Promise.resolve(); assert.equal(settled, false); release();
  const success = await pending; assert.equal(success.status, 200); assert.equal((await success.json()).ok, true); assert.equal(sends, 1);
  const failure = await handleEnquiry(request(), env(), async () => { throw new Error('provider error with secret'); });
  assert.equal(failure.status, 502); assert.doesNotMatch(await failure.text(), /provider error|secret|"ok":true/);
});
test('API rejects cross-origin, wrong method, oversized/chunked requests, missing setup and rate limits without sending', async () => {
  const send = async () => assert.fail('must not send');
  assert.equal((await handleEnquiry(request(message, { origin: 'https://evil.example' }), env(), send)).status, 403);
  assert.equal((await handleEnquiry(new Request('https://pichler-advisory.ch/api/enquiries'), env(), send)).status, 405);
  assert.equal((await handleEnquiry(request(message, { 'content-type': 'text/plain' }), env(), send)).status, 415);
  assert.equal((await handleEnquiry(request(message, { 'content-length': '20001' }), env(), send)).status, 413);
  assert.equal((await handleEnquiry(request({ ...message, message: 'x'.repeat(20001) }), env(), send)).status, 400);
  assert.equal((await handleEnquiry(request(), {}, send)).status, 503);
  assert.equal((await handleEnquiry(request({ ...message, privacy: false }), env(), send)).status, 400);
  const limited = env(); limited.ENQUIRY_LIMITER.limit = async () => ({ success: false });
  const response = await handleEnquiry(request(), limited, send); assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '60');
});

test('SMTP hands off only a verified TLS socket for the fixed Infomaniak hostname',async()=>{
  class Socket extends EventEmitter {authorized=true;destroyed=false;destroy(){this.destroyed=true;}}
  const socket=new Socket();let options;let calls=0;
  const result=new Promise((resolve,reject)=>smtpSocket({host:'untrusted.example'},(error,value)=>{calls++;if(error)reject(error);else resolve(value);},given=>{options=given;queueMicrotask(()=>socket.emit('secureConnect'));return socket;}));
  assert.deepEqual(await result,{connection:socket,secured:true});
  assert.deepEqual(options,{host:'mail.infomaniak.com',port:465,servername:'mail.infomaniak.com',rejectUnauthorized:true});
  assert.equal(calls,1);assert.equal(socket.destroyed,false);
});
test('SMTP rejects unverified TLS and preserves network errors without duplicate completion',async()=>{
  class Socket extends EventEmitter {authorized=false;destroyed=false;destroy(){this.destroyed=true;}}
  for(const mode of ['unverified','error','close']){
    const socket=new Socket();let calls=0;const original=Object.assign(new Error('connection refused'),{code:'ECONNREFUSED'});
    const outcome=await new Promise(resolve=>smtpSocket({},(error,value)=>{calls++;resolve({error,value});},()=>{
      queueMicrotask(()=>{socket.emit(mode==='unverified'?'secureConnect':mode,original);socket.emit('error',original);});return socket;
    }));
    assert.equal(outcome.value,undefined);assert.equal(calls,1);assert.equal(socket.destroyed,true);
    assert.equal(outcome.error.code,mode==='unverified'?'ETLS':mode==='close'?'ECONNRESET':'ECONNREFUSED');
  }
});
