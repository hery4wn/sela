import {createEmptyCard,fsrs} from 'ts-fsrs';
const scheduler=fsrs({request_retention:.9,enable_fuzz:false});
const DAY=86400000;
export function timezoneOffset(timezone,date){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
 return (Math.floor(date.getTime()/1000)*1000-Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute,+parts.second))/60000;
}
export function ankiDueDate(card,timing){
 const due=card.odid&&card.odue?card.odue:card.due;
 if(card.type===0)return new Date(timing.importedAt).toISOString();
 if(due>1000000000)return new Date(due*1000).toISOString();
 // Anki's day zero is the creation calendar date in the original UTC offset.
 const created=new Date(timing.crt*1000-(timing.creationOffset??timing.currentOffset)*60000);
 const civil=Date.UTC(created.getUTCFullYear(),created.getUTCMonth(),created.getUTCDate()+due,timing.rollover);
 const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:timing.timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 let instant=civil;
 for(let i=0;i<3;i++){
  const p=Object.fromEntries(formatter.formatToParts(new Date(instant)).map(x=>[x.type,x.value]));
  const rendered=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
  instant+=civil-rendered;
 }
 return new Date(instant).toISOString();
}
export function scheduleFromAnki(card,history,direction,deckId,timing){
 const sorted=[...history].sort((a,b)=>a[0]-b[0]);
 const reviews=sorted.filter(r=>r[3]>=1&&r[3]<=4&&r[8]>=0&&r[8]<=3);
 let seed=createEmptyCard(new Date(reviews[0]?.[0]||timing.importedAt));
 for(const r of reviews)seed=scheduler.next(seed,new Date(r[0]),r[3]).card;
 let extra={};try{extra=JSON.parse(card.data||'{}')}catch{}
 let last=extra.lrt?new Date(extra.lrt*1000):reviews.length?new Date(reviews.at(-1)[0]):null;
 const interval=Math.max(0,card.ivl),state=card.type===0?0:card.type===2?2:card.type===3?3:1;
 if(!last&&state!==0)last=new Date(new Date(ankiDueDate(card,timing)).getTime()-interval*DAY);
 return {direction,deckId,ankiId:String(card.id),due:ankiDueDate(card,timing),lastReview:last?.toISOString()||null,state,reps:card.reps,lapses:card.lapses,interval,
  stability:Number.isFinite(extra.s)&&extra.s>0?extra.s:seed.stability||Math.max(.1,interval),difficulty:Number.isFinite(extra.d)&&extra.d>=1&&extra.d<=10?extra.d:seed.difficulty||5,
  suspended:card.queue<0,raw:Object.fromEntries(['due','ivl','factor','reps','lapses','type','queue','left','odue','odid'].map(k=>[k,card[k]||0]).concat([['data',card.data||'']])),history:sorted};
}
export function importedHistory(snapshot,entity){
 return snapshot.history.filter(r=>r[3]>=1&&r[3]<=4&&r[8]>=0&&r[8]<=3).map(r=>({id:`anki:${r[1]}:${r[0]}`,entity,direction:snapshot.direction,at:new Date(r[0]).toISOString(),rating:r[3],generation:null,imported:true}));
}
export function importedCard(snapshot,entity){
 return {...createEmptyCard(new Date(snapshot.due)),entryId:entity,direction:snapshot.direction,deckId:snapshot.deckId,due:new Date(snapshot.due),last_review:snapshot.lastReview?new Date(snapshot.lastReview):undefined,state:snapshot.state,reps:snapshot.reps,lapses:snapshot.lapses,scheduled_days:snapshot.interval,elapsed_days:snapshot.lastReview?Math.max(0,(new Date(snapshot.due)-new Date(snapshot.lastReview))/DAY):0,stability:snapshot.stability,difficulty:snapshot.difficulty,suspended:snapshot.suspended,history:importedHistory(snapshot,entity)};
}
