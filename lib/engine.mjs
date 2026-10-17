import {importedCard,importedHistory} from './anki-schedule.mjs';
import { createEmptyCard, fsrs } from 'ts-fsrs';
import { operationSchema, normalize, backupSchema } from './schema.mjs';

// Pin package-lock.json: the same deterministic replay runs on every device.
const scheduler = fsrs({request_retention:0.9,enable_fuzz:false});
export const DEFAULT_DECK = '00000000-0000-4000-8000-000000000001';
export const PREF_ID = '00000000-0000-4000-8000-000000000002';
export const compareOps = (a,b) => a.seq-b.seq || a.id.localeCompare(b.id);
export function unionOps(...sets) {
  const map=new Map();
  for(const op of sets.flat()) {const checked=operationSchema.parse(op);const existing=map.get(op.id);if(existing&&JSON.stringify(existing)!==JSON.stringify(checked))throw new Error('ID operasi bertabrakan. Impor dibatalkan.');map.set(op.id,checked);}
  return [...map.values()].sort(compareOps);
}
export function newOp(ops,type,entity,fields={}) {
  return operationSchema.parse({id:crypto.randomUUID(),at:new Date().toISOString(),seq:ops.reduce((n,o)=>Math.max(n,o.seq),0)+1,type,entity,...fields});
}
export function materialize(operations) {
  const ops=unionOps(operations), decks=new Map([[DEFAULT_DECK,{id:DEFAULT_DECK,name:'Kosakata Saya',color:'mint',version:null}]]),entries=new Map(), tombstones=new Set(),deckDeletions=new Map(),conflicts=[], reviewOps=[],imports=new Map();
  let prefs={newLimit:10,sessionLimit:20,timezone:'Asia/Makassar',name:'Teman belajar'};
  for(const o of ops) {
    if(o.type==='anki.schedule'&&!imports.has(o.entity))imports.set(o.entity,o.data);
    if(o.type==='prefs') {prefs=o.data;continue;}
    if(o.type==='deck.put') {if(tombstones.has(o.entity))continue;const old=decks.get(o.entity);if(old&&old.version!==o.base&&old.version!==null)conflicts.push({op:o,current:old});else decks.set(o.entity,{...o.data,id:o.entity,version:o.id});}
    if(o.type==='deck.delete'&&o.entity!==DEFAULT_DECK) {
      deckDeletions.set(o.entity,o.data);
      tombstones.add(o.entity);decks.delete(o.entity);
      for(const e of entries.values())if(e.deckId===o.entity){if(o.data.mode==='delete'){entries.delete(e.id);tombstones.add(e.id);}else e.deckId=decks.has(o.data.target)?o.data.target:DEFAULT_DECK;}
    }
    if(o.type==='entry.put') {
      if(tombstones.has(o.entity)) {conflicts.push({op:o,deleted:true});continue;}
      if(deckDeletions.get(o.data.deckId)?.mode==='delete'){tombstones.add(o.entity);conflicts.push({op:o,deleted:true});continue;}
      const old=entries.get(o.entity);
      if(old&&old.version!==o.base){conflicts.push({op:o,current:old});continue;}
      const movedTo=deckDeletions.get(o.data.deckId)?.target;
      entries.set(o.entity,{...o.data,id:o.entity,deckId:decks.has(o.data.deckId)?o.data.deckId:decks.has(movedTo)?movedTo:DEFAULT_DECK,version:o.id,generation:o.reset?o.id:(old?.generation||null),createdAt:old?.createdAt||o.at});
    }
    if(o.type==='entry.delete'){tombstones.add(o.entity);entries.delete(o.entity);}
    if(o.type==='entry.star'&&entries.has(o.entity))entries.get(o.entity).star=o.value;
    if(o.type==='review')reviewOps.push(o);
  }
  const cards=new Map(),reviews=[];
  for(const e of entries.values())if(e.status==='ready')for(const direction of (e.directions||['en','id']))cards.set(`${e.id}:${direction}`,{...createEmptyCard(new Date(e.createdAt)),entryId:e.id,direction,history:[]});
  for(const [entity,data]of imports){
    const e=entries.get(entity);if(!e)continue;
    for(const snapshot of data.cards){
      reviews.push(...importedHistory(snapshot,entity));
      const key=entity+':'+snapshot.direction;
      if(e.generation===null&&cards.has(key)){const card=importedCard(snapshot,entity);if(e.deckId!==data.entryDeckId)card.deckId=e.deckId;cards.set(key,card);}
    }
  }
  // Review histories merge by timestamp then operation id; schedules are replayed, never last-write-wins.
  for(const o of reviewOps.sort((a,b)=>a.at.localeCompare(b.at)||a.id.localeCompare(b.id))) {
    const e=entries.get(o.entity);if(!e)continue;
    reviews.push(o); if(o.generation!==e.generation)continue;
    const key=`${o.entity}:${o.direction}`,previous=cards.get(key);if(!previous)continue;
    const when=new Date(Math.max(new Date(o.at).getTime(),previous.last_review?.getTime()||0));
    const next=scheduler.next(previous,when,o.rating).card;
    cards.set(key,{...next,deckId:previous.deckId,suspended:previous.suspended,entryId:e.id,direction:o.direction,history:[...previous.history,o]});
  }
  // A newer explicit edit resolves older conflicts for that entity, retaining original ops in backup.
  const resolved=new Set(ops.filter(o=>o.type==='conflict.resolve').map(o=>o.target));
  const unresolved=conflicts.filter(c=>!resolved.has(c.op.id));
  return {decks:[...decks.values()],entries:[...entries.values()],cards:[...cards.values()],reviews,prefs,conflicts:unresolved,ops};
}
const dateFormatters=new Map(), dayKeys=new Map();
export function dayKey(value,timezone) {
 const time=new Date(value).getTime(),key=timezone+':'+Math.floor(time/60000);
 if(dayKeys.has(key))return dayKeys.get(key);
 if(!dateFormatters.has(timezone))dateFormatters.set(timezone,new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}));
 const result=dateFormatters.get(timezone).format(new Date(time));if(dayKeys.size>100000)dayKeys.clear();dayKeys.set(key,result);return result;
}
export function statsFor(state,now=new Date()) {
  const ready=state.entries.filter(e=>e.status==='ready'), today=dayKey(now,state.prefs.timezone), reviewed=new Set(state.reviews.map(o=>o.entity));
  const cardsByKey=new Map(state.cards.map(c=>[c.entryId+':'+c.direction,c]));
  const mastered=ready.filter(e=>(e.directions||['en','id']).every(d=>{const c=cardsByKey.get(e.id+':'+d);return c&&c.scheduled_days>=21&&c.history.length>=3&&c.history.slice(-3).every(h=>h.rating>=3);})).length;
  const activityDays=new Set(state.reviews.map(o=>dayKey(o.at,state.prefs.timezone)));
  return {activityDays,total:ready.length,drafts:state.entries.length-ready.length,trained:ready.filter(e=>reviewed.has(e.id)).length,mastered,due:state.cards.filter(c=>!c.suspended&&c.reps>0&&c.due<=now).length,newCards:state.cards.filter(c=>!c.suspended&&c.reps===0).length,todayReviews:state.reviews.filter(o=>dayKey(o.at,state.prefs.timezone)===today).length};
}
export function studyQueue(state,deckId='',direction='both',now=new Date()) {
  const eligible=new Set(state.entries.filter(e=>e.status==='ready').map(e=>e.id));
  const cards=state.cards.filter(c=>eligible.has(c.entryId)&&!c.suspended&&(!deckId||(c.deckId||state.entries.find(e=>e.id===c.entryId)?.deckId)===deckId)&&(direction==='both'||c.direction===direction));
  const due=cards.filter(c=>c.reps>0&&c.due<=now).sort((a,b)=>a.due-b.due);
  const introducedToday=state.cards.filter(c=>c.history[0]&&dayKey(c.history[0].at,state.prefs.timezone)===dayKey(now,state.prefs.timezone)).length;
  const fresh=cards.filter(c=>c.reps===0).slice(0,Math.max(0,state.prefs.newLimit-introducedToday));
  return [...due,...fresh].slice(0,state.prefs.sessionLimit).map(c=>({id:c.entryId,direction:c.direction}));
}
export function previewRatings(card,now=new Date()) {return [1,2,3,4].map(r=>({rating:r,...scheduler.next(card,now,r)}));}
export function intervalLabel(due,now=new Date()) {const m=Math.max(1,Math.round((due-now)/60000));return m<60?`${m} menit`:m<1440?`${Math.round(m/60)} jam`:`${Math.round(m/1440)} hari`;}
export function duplicateOf(entries,entry) {return entries.find(e=>e.id!==entry.id&&e.status==='ready'&&e.source===entry.source&&normalize(e.en)===normalize(entry.en)&&normalize(e.idn)===normalize(entry.idn));}
export function validateBackup(raw,current=[]) {
  const backup=backupSchema.parse(raw);const operations=unionOps(current,backup.operations);
  for(const o of operations)if(o.type==='entry.put'&&o.entity!==o.data.id)throw new Error('Hubungan entri tidak valid.');
  for(const [key,value]of Object.entries(backup.media||{}))if(!/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(png|jpeg|webp)$/.test(key)||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value))throw new Error('Media backup tidak valid.');
  materialize(operations);return {...backup,operations};
}
