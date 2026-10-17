import {statsFor,dayKey} from './engine.mjs';
export function progressContext(state,now=new Date()){
 const stats=statsFor(state,now),byEntry=new Map();
 for(const c of state.cards){const item=byEntry.get(c.entryId)||{reviews:0,lapses:0,due:null};item.reviews+=c.reps;item.lapses+=c.lapses;if(!c.suspended&&(!item.due||c.due<new Date(item.due)))item.due=c.due.toISOString();byEntry.set(c.entryId,item);}
 const daily={};for(const r of state.reviews){const day=dayKey(r.at,state.prefs.timezone);daily[day]=(daily[day]||0)+1;}
 return {asOf:now.toISOString(),timezone:state.prefs.timezone,stats:{...stats,activityDays:stats.activityDays.size},daily,deckNames:Object.fromEntries(state.decks.map(d=>[d.id,d.name])),totalEntries:state.entries.length,entriesIncluded:Math.min(state.entries.length,3000),entries:state.entries.slice(0,3000).map(e=>({en:e.en,id:e.idn.slice(0,200),deck:e.deckId,status:e.status,...byEntry.get(e.id)})),limitations:['Idiom/phrase labels have not been classified; semantic counts are estimates, not stored facts.','No prediction of exact future learning outcomes.','Review counts are per card; trained vocabulary counts distinct entries.']};
}
