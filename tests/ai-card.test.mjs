import test from 'node:test';
import assert from 'node:assert/strict';
import {combineMeanings} from '../lib/ai-card.mjs';
import {entrySchema} from '../lib/schema.mjs';
import {DEFAULT_DECK} from '../lib/engine.mjs';
test('all generated meanings, aligned examples and pronunciations survive saving',()=>{
 const meanings=[{en:'bank',idn:'bank',explanation:'Lembaga keuangan.',example:'I went to the bank.',translation:'Saya pergi ke bank.',phonetic:'/bæŋk/ — kira-kira baengk'},{en:'bank',idn:'tepi sungai',explanation:'Tanah di sisi sungai.',example:'They sat on the bank.',translation:'Mereka duduk di tepi sungai.',phonetic:'/bæŋk/ — kira-kira baengk'}];
 const card=combineMeanings({meanings},'en','bank');
 assert.match(card.explanation,/1\. bank — bank/);assert.match(card.explanation,/2\. bank — tepi sungai/);
 assert.match(card.example,/2\. tepi sungai: They sat/);assert.match(card.translation,/2\. Mereka/);
 assert.equal(card.phonetic,'/bæŋk/');
 const saved=entrySchema.parse({...card,id:crypto.randomUUID(),deckId:DEFAULT_DECK,source:'en',word:'bank',context:'',status:'ready',star:false});
 assert.equal(saved.example,card.example);
});
test('Indonesian input keeps English pronunciation for each distinct translation',()=>{
 const base={idn:'bisa',explanation:'Penjelasan.',example:'Example.',translation:'Contoh.'};
 const card=combineMeanings({meanings:[{...base,en:'can',phonetic:'/kæn/'},{...base,en:'venom',phonetic:'/ˈvenəm/'}]},'id','bisa');
 assert.equal(card.en,'can');assert.equal(card.phonetic,'/kæn/');assert.match(card.explanation,/venom — bisa/);
});
