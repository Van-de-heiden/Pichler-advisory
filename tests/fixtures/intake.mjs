// Synthetic in-memory RPC contract; no external transport.
export function intakeMock() {
 const records=new Map();
 return {records, async receive({id,enquiry}) { const hash=JSON.stringify(enquiry), old=records.get(id);if(old&&old.hash!==hash)throw new Error('conflicting receipt');if(!old)records.set(id,{hash,notification:'pending'});return {ok:true,reference:id}; },
 async claimNotification(id) {const r=records.get(id);if(r.notification!=='pending')return false;r.notification='sending';return true;},
 async notification(id,status) {records.get(id).notification=status;} };
}
