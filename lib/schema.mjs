import { z } from 'zod';

export const ID = z.string().uuid();
const text = (max = 1000) => z.string().trim().max(max);
export const entrySchema = z.object({
  id: ID, deckId: ID, source: z.enum(['en', 'id']), word: text(100), context: text(1500),
  en: text(2000), idn: text(800), explanation: text(8000), example: text(5000), translation: text(5000),
  phonetic: text(1000).default(''), status: z.enum(['draft', 'ready']), star: z.boolean(),
  art: z.enum(['bloom','cozy','serene','none']).default('none'),
  image: z.string().max(500).regex(/^$|^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(png|jpeg|webp)$/).default(''),
  imageAlt: text(500).default(''),
  basic: z.boolean().optional(),
  directions: z.array(z.enum(['en','id'])).min(1).max(2).optional(),
}).strict().superRefine((v, ctx) => {
  if(!v.basic&&v.en.length>100)ctx.addIssue({code:'custom',path:['en'],message:'Kata maksimal 100 karakter.'});
  if (v.status === 'ready') for (const key of (v.basic?['en','idn']:['en','idn','explanation','example','translation'])) {
    if (!v[key]) ctx.addIssue({ code:'custom', path:[key], message:'Isi kartu belum lengkap.' });
  }
});
export const prefsSchema = z.object({
  newLimit: z.number().int().min(0).max(50), sessionLimit: z.number().int().min(5).max(100),
  timezone: z.string().max(100).refine(v => {try {new Intl.DateTimeFormat('id', {timeZone:v});return true;}catch{return false;}}),
  name: text(60),
}).strict();
const common = {id:ID, at:z.string().datetime(), seq:z.number().int().min(1).max(Number.MAX_SAFE_INTEGER), entity:ID};
const num=z.number().finite();
export const ankiCardSchema=z.object({
 direction:z.enum(['en','id']),deckId:ID,ankiId:z.string().max(30),due:z.string().datetime(),lastReview:z.string().datetime().nullable(),
 state:z.number().int().min(0).max(3),reps:z.number().int().nonnegative(),lapses:z.number().int().nonnegative(),interval:num.nonnegative(),
 stability:num.nonnegative(),difficulty:num.min(0).max(10),suspended:z.boolean(),
 raw:z.object({due:num,ivl:num,factor:num,reps:num,lapses:num,type:num,queue:num,left:num,odue:num,odid:num,data:z.string().max(10000)}),
 // Original Anki revlog columns: id,cid,usn,ease,ivl,lastIvl,factor,time,type.
 history:z.array(z.tuple([num,num,num,num,num,num,num,num,num])).max(10000),
}).strict();
export const operationSchema = z.discriminatedUnion('type', [
  z.object({...common,type:z.literal('anki.schedule'),data:z.object({version:z.literal(1),entryDeckId:ID,timezone:z.string().max(100),rollover:z.number().int().min(0).max(23),cards:z.array(ankiCardSchema).min(1).max(2)}).strict()}),
  z.object({...common,type:z.literal('deck.put'), base:ID.nullable(), data:z.object({name:text(60).min(1),color:z.enum(['mint','peach','blue'])}).strict()}),
  z.object({...common,type:z.literal('deck.delete'), data:z.object({mode:z.enum(['move','delete']),target:ID.nullable()}).strict()}),
  z.object({...common,type:z.literal('entry.put'),base:ID.nullable(),data:entrySchema,reset:z.boolean().default(false)}),
  z.object({...common,type:z.literal('entry.delete')}),
  z.object({...common,type:z.literal('entry.star'),value:z.boolean()}),
  z.object({...common,type:z.literal('conflict.resolve'),target:ID}),
  z.object({...common,type:z.literal('review'),direction:z.enum(['en','id']),rating:z.number().int().min(1).max(4),generation:ID.nullable()}),
  z.object({...common,type:z.literal('prefs'),data:prefsSchema}),
]);
export const backupSchema = z.object({
  format:z.literal('sela-backup'),version:z.literal(1),exportedAt:z.string().datetime(),
  mediaIncluded:z.boolean(), operations:z.array(operationSchema).max(100000),
  media:z.record(z.string(),z.string().max(16000000)).optional(),
}).strict();
export const meaningSchema = z.object({en:text(100).min(1),idn:text(180).min(1),explanation:text(1000).min(1),example:text(1000).min(1),translation:text(1000).min(1),phonetic:text(100)}).strict();
export const aiResultSchema = z.object({meanings:z.array(meaningSchema).min(1).max(4),imageQuery:text(100).min(1).optional()}).strict();
export const normalize = s => s.trim().toLocaleLowerCase().replace(/\s+/g,' ');
