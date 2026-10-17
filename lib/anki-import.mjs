import {unzipSync} from 'fflate';
import {Decompress} from 'fzstd';
import {newOp} from './engine.mjs';
import {scheduleFromAnki,timezoneOffset} from './anki-schedule.mjs';
import {entrySchema} from './schema.mjs';

const LIMIT=80*1024*1024;
export function databaseFromPackage(bytes){
 if(bytes.length>50*1024*1024)throw new Error('Paket maksimal 50 MB. Ekspor deck yang lebih kecil.');
 let total=0;
 const files=unzipSync(bytes,{filter:file=>{
  if(!['collection.anki2','collection.anki21','collection.anki21b'].includes(file.name))return false;
  total+=file.originalSize;if(total>LIMIT)throw new Error('Database Anki terlalu besar.');return true;
 }});
 let data=files['collection.anki21b']||files['collection.anki21']||files['collection.anki2'];
 if(!data)throw new Error('Paket tidak memiliki database Anki.');
 if(data[0]===0x28&&data[1]===0xb5&&data[2]===0x2f&&data[3]===0xfd){
  const chunks=[];let size=0;const decoder=new Decompress(chunk=>{size+=chunk.length;if(size>LIMIT)throw new Error('Database Anki terlalu besar.');chunks.push(chunk)});
  decoder.push(data,true);data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}
 }
 if(new TextDecoder().decode(data.slice(0,15))!=='SQLite format 3')throw new Error('Format database Anki tidak dikenali.');
 return data;
}
let sqlLoader;
function loadSql(){
 if(!sqlLoader)sqlLoader=new Promise((resolve,reject)=>{
  if(window.initSqlJs){resolve(window.initSqlJs);return;}
  const script=document.createElement('script');script.src='/vendor/sql-asm.js';
  script.onload=()=>resolve(window.initSqlJs);script.onerror=()=>{script.remove();sqlLoader=null;reject(new Error('Pembaca Anki gagal dimuat. Coba saat online.'))};document.head.append(script);
 });
 return sqlLoader;
}
function templateQuestion(bytes){
 let pos=0;const read=()=>{let n=0,shift=0;while(pos<bytes.length){const b=bytes[pos++];n+=(b&127)*2**shift;if(!(b&128))return n;shift+=7;if(shift>49)throw new Error('Template tidak valid.')}throw new Error('Template terpotong.')};
 while(pos<bytes.length){const tag=read(),field=Math.floor(tag/8),wire=tag%8;if(wire===2){const size=read(),end=pos+size;if(end>bytes.length)throw new Error('Template terpotong.');if(field===1)return new TextDecoder().decode(bytes.slice(pos,end));pos=end;}else if(wire===0)read();else if(wire===1)pos+=8;else if(wire===5)pos+=4;else throw new Error('Template tidak didukung.');}
 return '';
}
export async function readAnki(bytes,initializer){
 const init=initializer||await loadSql(),SQL=await init();let db=new SQL.Database(databaseFromPackage(bytes));
 try{
  // Anki uses unicase on non-key name columns. Adapt only the in-memory copy,
  // then reopen it; no SQL is run against the user's file or names/index keys.
  db.run("PRAGMA writable_schema=ON; UPDATE sqlite_master SET sql=replace(sql,'COLLATE unicase','COLLATE BINARY') WHERE type='table' AND name IN ('fields','templates'); PRAGMA writable_schema=OFF;");
  const adapted=db.export();db.close();db=new SQL.Database(adapted);
  const query=sql=>{const result=db.exec(sql)[0];return result?result.values.map(v=>Object.fromEntries(result.columns.map((c,i)=>[c,v[i]]))):[]};
  const rows=query('SELECT id,guid,mid,flds FROM notes LIMIT 2001');
  if(rows.length>2000)throw new Error('Maksimal 2.000 catatan per impor. Ekspor deck lebih kecil.');
  if(!rows.length)throw new Error('Tidak ada catatan di paket ini.');
  const tables=new Set(query("SELECT name FROM sqlite_master WHERE type='table'").map(t=>t.name));
  const col=query('SELECT * FROM col')[0]||{};
  const models=JSON.parse(col.models||'{}'),decks=JSON.parse(col.decks||'{}'),config=JSON.parse(col.conf||'{}');
  if(tables.has('config'))for(const row of query('SELECT * FROM config')){try{config[row.KEY||row.key]=JSON.parse(new TextDecoder().decode(row.val));}catch{}}
  if(tables.has('decks'))for(const d of query('SELECT id,name FROM decks'))decks[d.id]={name:d.name.replaceAll('\x1f','::')};
  const fieldNames=tables.has('fields')?query('SELECT ntid,ord,name FROM fields'):[];
  const templates=tables.has('templates')?query('SELECT ntid,ord,name,config FROM templates').map(t=>({...t,qfmt:templateQuestion(t.config)})):Object.entries(models).flatMap(([id,m])=>(m.tmpls||[]).map(t=>({...t,ntid:Number(id)})));
  const allCards=query('SELECT * FROM cards'),allReviews=tables.has('revlog')?query('SELECT id,cid,usn,ease,ivl,lastIvl,factor,time,type FROM revlog ORDER BY id'):[];
  if(allReviews.length>100000)throw new Error('Riwayat melebihi 100.000 review per paket.');
  const byCard=new Map(),byNote=new Map();for(const r of allReviews){if(!byCard.has(r.cid))byCard.set(r.cid,[]);byCard.get(r.cid).push([r.id,r.cid,r.usn,r.ease,r.ivl,r.lastIvl,r.factor,r.time,r.type]);}
  for(const c of allCards){if(!byNote.has(c.nid))byNote.set(c.nid,[]);byNote.get(c.nid).push({...c,history:byCard.get(c.id)||[],deck:decks[c.odid||c.did]?.name||'Impor Anki'});}
  return rows.map(n=>({guid:n.guid,model:n.mid,deck:byNote.get(n.id)?.[0]?.deck||'Impor Anki',fields:n.flds.split('\x1f'),names:models[n.mid]?.flds?.map(f=>f.name)||fieldNames.filter(f=>f.ntid===n.mid).sort((a,b)=>a.ord-b.ord).map(f=>f.name),cards:byNote.get(n.id)||[],templates:templates.filter(t=>t.ntid===n.mid).map(t=>({ord:t.ord,qfmt:t.qfmt})),timing:{crt:col.crt||0,creationOffset:config.creationOffset,rollover:config.rollover??4}}));
 }finally{db.close();}
}
export function ankiText(html){
 const doc=new DOMParser().parseFromString(html,'text/html');
 doc.querySelectorAll('script,style,iframe,object').forEach(n=>n.remove());
 doc.querySelectorAll('br').forEach(n=>n.replaceWith('\n'));
 doc.querySelectorAll('div,p,li').forEach(n=>n.append('\n'));
 return (doc.body.textContent||'').replace(/\[sound:[^\]]*\]/g,'').trim();
}
async function stableId(value){const bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('sela-anki:'+value)));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const h=Array.from(bytes.slice(0,16),b=>b.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}
export async function planAnkiImport(rows,mapping,state,clean=ankiText,options={}){
 const operations=[],known=new Set(state.ops.filter(o=>o.type==='entry.put'||o.type==='entry.delete').map(o=>o.entity)),decks=new Set(state.decks.map(d=>d.id));
 let duplicates=0,skipped=0,drafts=0,schedules=0,reviews=0,unsupported=0,seq=state.ops.reduce((n,o)=>Math.max(n,o.seq),0);const importedAt=Date.now();
 const add=(type,entity,fields)=>{const op=newOp([],type,entity,fields);op.seq=++seq;operations.push(op)};
 const deckFor=async name=>{const id=await stableId('deck:'+name);if(!decks.has(id)){add('deck.put',id,{base:null,data:{name:name.slice(0,60),color:'mint'}});decks.add(id);}return id;};
 for(const row of rows){
  if(row.fields.some(f=>/\{\{c\d+::/i.test(f))){skipped++;continue;}
  const m=mapping[row.model],field=k=>m[k]===undefined||m[k]===''?'':clean(row.fields[Number(m[k])]||'');
  const en=field('en'),idn=field('idn');if(!en||!idn){skipped++;continue;}
  const id=await stableId('note:'+row.guid+':'+row.model);if(known.has(id)){duplicates++;continue;}
  const mapped=[];
  for(const c of row.cards||[]){
   const q=row.templates?.find(t=>t.ord===c.ord)?.qfmt?.replace(/<[^>]*>/g,'').trim();
   let direction=q==='{{'+row.names?.[Number(m.en)]+'}}'?'en':q==='{{'+row.names?.[Number(m.idn)]+'}}'?'id':null;
   if(!direction&&!row.templates?.length)direction=c.ord===1?'id':'en';
   if(!direction||mapped.some(x=>x.direction===direction)){unsupported++;continue;}mapped.push({card:c,direction});
  }
  if(row.cards?.length&&!mapped.length){skipped++;continue;}
  const deckId=await stableId('deck:'+row.deck),directions=mapped.length?mapped.map(x=>x.direction):['en'];
  const parsed=entrySchema.safeParse({id,deckId,word:en.slice(0,100),source:'en',context:'',en,idn,explanation:field('explanation'),example:field('example'),translation:field('translation'),phonetic:field('phonetic'),status:'ready',star:false,basic:true,directions});
  if(!parsed.success){skipped++;continue;}
  const cards=[];
  for(const {card,direction}of mapped){
   if(options.preserve!==false&&card.id&&row.timing?.crt){
    const cardDeck=await deckFor(card.deck||row.deck),timing={...row.timing,timezone:options.timezone||state.prefs.timezone,rollover:options.rollover??row.timing.rollover,currentOffset:timezoneOffset(options.timezone||state.prefs.timezone,new Date(row.timing.crt*1000)),importedAt};
    cards.push(scheduleFromAnki(card,card.history||[],direction,cardDeck,timing));
   }
  }
  await deckFor(row.deck);add('entry.put',id,{base:null,data:parsed.data,reset:false});known.add(id);
  if(cards.length){add('anki.schedule',id,{data:{version:1,entryDeckId:deckId,timezone:options.timezone||state.prefs.timezone,rollover:options.rollover??row.timing.rollover,cards}});schedules+=cards.length;reviews+=cards.reduce((n,c)=>n+c.history.length,0);}
 }
 return {operations,count:operations.filter(o=>o.type==='entry.put').length,duplicates,skipped,drafts,schedules,reviews,unsupported};
}
