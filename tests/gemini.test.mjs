import test from 'node:test';
import assert from 'node:assert/strict';
import {textModel,textCompletion} from '../lib/server.mjs';
test('Gemini text uses direct Google endpoint, removes router fields and limits reasoning',async()=>{
 const key=process.env.GEMINI_API_KEY,model=process.env.GEMINI_TEXT_MODEL,original=globalThis.fetch;
 process.env.GEMINI_API_KEY='test-only';delete process.env.GEMINI_TEXT_MODEL;
 try{assert.equal(textModel(),'gemini-3.8-flash');globalThis.fetch=async(url,options)=>{assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');const body=JSON.parse(options.body);assert.equal(body.provider,undefined);assert.equal(body.reasoning_effort,'low');assert.equal(body.model,'gemini-3.8-flash');return Response.json({choices:[{message:{content:'ok'}}]});};assert.equal((await textCompletion({messages:[],provider:{require_parameters:true}})).choices[0].message.content,'ok');globalThis.fetch=async()=>new Response('',{status:429});await assert.rejects(textCompletion({messages:[]}),e=>e.status===429&&/Kuota Google/.test(e.message));}
 finally{globalThis.fetch=original;if(key===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=key;if(model===undefined)delete process.env.GEMINI_TEXT_MODEL;else process.env.GEMINI_TEXT_MODEL=model;}
});
