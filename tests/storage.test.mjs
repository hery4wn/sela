import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readAccount,appendOperations,acknowledge,putMedia,getMedia} from '../lib/storage.mjs';
import {newOp} from '../lib/engine.mjs';
const operation=()=>newOp([],'entry.delete',crypto.randomUUID());
test('account data and cached images remain separate',async()=>{
 const a=crypto.randomUUID(),b=crypto.randomUUID(),op=operation();
 await appendOperations(a,[op]);await putMedia(a,'image','data');
 assert.equal((await readAccount(a)).operations.length,1);
 assert.equal((await readAccount(b)).operations.length,0);
 assert.equal(await getMedia(b,'image'),undefined);
});
test('concurrent IndexedDB writes preserve both operations',async()=>{
 const key=crypto.randomUUID(),a=operation(),b=operation();
 await Promise.all([appendOperations(key,[a]),appendOperations(key,[b])]);
 assert.equal((await readAccount(key)).operations.length,2);
});
test('acknowledging a snapshot preserves newer pending work',async()=>{
 const key=crypto.randomUUID(),a=operation(),b=operation();
 await appendOperations(key,[a,b]);await acknowledge(key,[a]);
 const record=await readAccount(key);
 assert.equal(record.operations.length,2);assert.deepEqual(record.acked,[a.id]);
 await appendOperations(key,[a]);assert.equal((await readAccount(key)).operations.length,2);
});
import {commitOperation} from '../lib/storage.mjs';
test('atomic commits preserve concurrent ratings with distinct logical order',async()=>{const key=crypto.randomUUID(),entity=crypto.randomUUID();await Promise.all([commitOperation(key,'review',entity,{direction:'en',rating:3,generation:null}),commitOperation(key,'review',entity,{direction:'id',rating:4,generation:null})]);const state=await readAccount(key);assert.deepEqual(state.operations.map(o=>o.seq),[1,2]);assert.equal(state.operations.length,2);});
