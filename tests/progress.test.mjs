import test from 'node:test';
import assert from 'node:assert/strict';
import {materialize,newOp,DEFAULT_DECK} from '../lib/engine.mjs';
import {progressContext} from '../lib/progress-context.mjs';
test('AI context distinguishes vocabulary from directional reviews and omits secrets',()=>{const id=crypto.randomUUID(),put=newOp([],'entry.put',id,{base:null,data:{id,deckId:DEFAULT_DECK,word:'break a leg',source:'en',en:'break a leg',idn:'semoga berhasil',context:'private context excluded',explanation:'',example:'',translation:'',basic:true,status:'ready',star:false}});const r=newOp([put],'review',id,{direction:'en',rating:3,generation:null});const state=materialize([put,r]);const result=progressContext(state);assert.equal(result.stats.total,1);assert.equal(result.stats.trained,1);assert.equal(result.entries[0].reviews,1);assert.ok(result.limitations.some(s=>s.includes('estimates')));assert.ok(!JSON.stringify(result).includes('private context excluded'));});
