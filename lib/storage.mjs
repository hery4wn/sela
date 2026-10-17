import { openDB } from 'idb';
import { unionOps,newOp } from './engine.mjs';
const database=()=>openDB('sela-v1',1,{upgrade(db){db.createObjectStore('accounts');db.createObjectStore('media');}});
export async function readAccount(key) {return (await (await database()).get('accounts',key))||{operations:[],acked:[],lastSync:null};}
export async function writeAccount(key,value) {await (await database()).put('accounts',value,key);}
export async function appendOperations(key,operations) {
  const db=await database(),tx=db.transaction('accounts','readwrite'),old=(await tx.store.get(key))||{operations:[],acked:[],lastSync:null};
  const next={...old,operations:unionOps(old.operations,operations)};await tx.store.put(next,key);await tx.done;return next;
}
export async function acknowledge(key,remote) {
  const db=await database(),tx=db.transaction('accounts','readwrite'),old=await tx.store.get(key)||{operations:[],acked:[]};
  const next={operations:unionOps(old.operations,remote),acked:[...new Set([...old.acked,...remote.map(o=>o.id)])],lastSync:new Date().toISOString()};await tx.store.put(next,key);await tx.done;return next;
}
export async function getMedia(key,path) {return (await database()).get('media',`${key}:${path}`);}
export async function putMedia(key,path,data) {await (await database()).put('media',data,`${key}:${path}`);}
export async function exportMedia(key) {const db=await database(),keys=await db.getAllKeys('media'),media={};for(const k of keys)if(k.startsWith(key+':'))media[k.slice(key.length+1)]=await db.get('media',k);return media;}

export async function commitOperation(key,type,entity,fields){
 const db=await database(),tx=db.transaction('accounts','readwrite'),old=(await tx.store.get(key))||{operations:[],acked:[],lastSync:null};
 const op=newOp(old.operations,type,entity,fields),next={...old,operations:[...old.operations,op]};
 await tx.store.put(next,key);await tx.done;return {op,next};
}
