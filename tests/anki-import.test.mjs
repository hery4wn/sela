import test from 'node:test';
import assert from 'node:assert/strict';
import init from 'sql.js/dist/sql-asm.js';
import {zipSync} from 'fflate';
import {zstdCompressSync} from 'node:zlib';
import {readAnki,planAnkiImport,databaseFromPackage} from '../lib/anki-import.mjs';
import {materialize} from '../lib/engine.mjs';
const SQL=await init();
function fixture(modern){const db=new SQL.Database();db.run('CREATE TABLE notes (id integer,guid text,mid integer,flds text);CREATE TABLE cards (nid integer,did integer);CREATE TABLE col (models text,decks text)');db.run('INSERT INTO col VALUES (?,?)',[JSON.stringify({1:{flds:[{name:'Front'},{name:'Back'}]}}),JSON.stringify({2:{name:'English'}})]);db.run('INSERT INTO notes VALUES (1,?,?,?)',['stable-note',1,'flower\x1fbunga']);db.run('INSERT INTO cards VALUES (1,2);INSERT INTO cards VALUES(1,2)');const bytes=db.export();db.close();return zipSync({[modern?'collection.anki21b':'collection.anki2']:modern?zstdCompressSync(bytes):bytes});}
for(const modern of [false,true])test(`reads ${modern?'zstd':'legacy'} package and imports note once`,async()=>{const rows=await readAnki(fixture(modern),init);assert.equal(rows.length,1);assert.equal(rows[0].deck,'English');const mapping={1:{en:'0',idn:'1'}};const plan=await planAnkiImport(rows,mapping,materialize([]),s=>s);assert.equal(plan.count,1);assert.equal(plan.drafts,0);const state=materialize(plan.operations);assert.equal(state.entries[0].idn,'bunga');assert.equal((await planAnkiImport(rows,mapping,state,s=>s)).duplicates,1);});
test('rejects non-Anki archives',()=>assert.throws(()=>databaseFromPackage(zipSync({junk:new Uint8Array([1])})),/database/));
test('cloze is reported as skipped',async()=>{const plan=await planAnkiImport([{guid:'cloze',model:1,deck:'test',fields:['{{c1::flower}}','bunga']}],{1:{en:'0',idn:'1'}},materialize([]),s=>s);assert.equal(plan.skipped,1);assert.equal(plan.count,0);});
