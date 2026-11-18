import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {handleMaintenance, privateResponse} from '../worker/maintenance.ts';
const html='<html>Wartung</html>';
const auth='Basic '+Buffer.from('test-user:test-password-not-production').toString('base64');
const env={MAINTENANCE_MODE:'on',MAINTENANCE_AUTH_HASH:createHash('sha256').update(auth).digest('hex')};
for(const path of ['/','/leistungen','/api/enquiries','/api/bookings/availability','/api/bookings/confirm?id=x','/assets/a.js','/rebranding/index.html','/favicon.png','/_vinext/image','/sitemap.xml']) {
 test(`unauthenticated ${path} closed`,async()=>{const r=await handleMaintenance(new Request('https://pichler-advisory.ch'+path),env,html);assert.equal(r.status,503);assert.match(r.headers.get('cache-control'),/no-store/)});
 test(`authenticated ${path} passes`,async()=>{assert.equal(await handleMaintenance(new Request('https://pichler-advisory.ch'+path,{headers:{authorization:auth}}),env,html),null)});
}
test('missing secret stays closed',async()=>assert.equal((await handleMaintenance(new Request('https://example.com/',{headers:{authorization:auth}}),{MAINTENANCE_MODE:'on'},html)).status,503));
test('wrong password refused and rate limited',async()=>{const r=await handleMaintenance(new Request('https://example.com/login',{headers:{authorization:'Basic wrong'}}),{...env,ENQUIRY_LIMITER:{limit:async()=>({success:false})}},html);assert.equal(r.status,429)});
test('valid auth does not consume rate limit per asset',async()=>assert.equal(await handleMaintenance(new Request('https://example.com/assets/x.js',{headers:{authorization:auth}}),{...env,ENQUIRY_LIMITER:{limit:async()=>{throw Error('must not call')}}},html),null));
test('login challenge',async()=>assert.equal((await handleMaintenance(new Request('https://example.com/login'),env,html)).status,401));
test('POST never reaches API unauthenticated',async()=>assert.equal((await handleMaintenance(new Request('https://example.com/api/enquiries',{method:'POST',body:'{}'}),env,html)).status,503));
test('authenticated responses private',()=>assert.match(privateResponse(new Response('secret')).headers.get('cache-control'),/no-store/));
test('off restores old behavior',async()=>assert.equal(await handleMaintenance(new Request('https://example.com/'),{},html),null));
