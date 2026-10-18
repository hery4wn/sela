import test from 'node:test';
import assert from 'node:assert/strict';
import {textModel,textCompletion,geminiPayload} from '../lib/server.mjs';
const input={messages:[{role:'system',content:'Teach vocabulary'},{role:'user',content:'Treatise'}],max_tokens:3000,response_format:{json_schema:{schema:{type:'object'}}},provider:{require_parameters:true}};
test('native Gemini retains instructions and JSON schema without router fields',()=>{const p=geminiPayload(input,'gemini-3.5-flash-lite');assert.equal(p.systemInstruction.parts[0].text,'Teach vocabulary');assert.equal(p.contents[0].parts[0].text,'Treatise');assert.equal(p.generationConfig.responseMimeType,'application/json');assert.deepEqual(p.generationConfig.responseJsonSchema,{type:'object'});assert.equal(p.generationConfig.thinkingConfig.thinkingLevel,'minimal');assert.equal(p.provider,undefined);});
test('Gemini fails over once on timeout or busy response, but never retries quota errors',async()=>{
 const saved={key:process.env.GEMINI_API_KEY,model:process.env.GEMINI_TEXT_MODEL,fallback:process.env.GEMINI_FALLBACK_MODEL,fetch:globalThis.fetch};
 process.env.GEMINI_API_KEY='test-only';delete process.env.GEMINI_TEXT_MODEL;delete process.env.GEMINI_FALLBACK_MODEL;
 try{assert.equal(textModel(),'gemini-3.5-flash-lite');
 for(const failure of ['timeout','busy']){let calls=0;globalThis.fetch=async(url,options)=>{calls++;assert.equal(options.headers['x-goog-api-key'],'test-only');assert.ok(options.signal);if(calls===1){if(failure==='timeout')throw new DOMException('timeout','TimeoutError');return new Response('',{status:503});}assert.match(url,/gemini-3.8-flash:generateContent$/);return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{thought:true,text:'private thought'},{text:'result'}]}}]});};assert.equal((await textCompletion(input)).choices[0].message.content,'result');assert.equal(calls,2);}
 let calls=0;globalThis.fetch=async()=>{calls++;return new Response('',{status:429});};await assert.rejects(textCompletion(input),e=>e.status===429);assert.equal(calls,1);
 calls=0;globalThis.fetch=async()=>{calls++;return Response.json({candidates:[{finishReason:'MAX_TOKENS',content:{parts:[{text:'partial'}]}}]});};await assert.rejects(textCompletion(input),e=>e.status===502);assert.equal(calls,2);
 }finally{globalThis.fetch=saved.fetch;for(const [env,value] of [['GEMINI_API_KEY',saved.key],['GEMINI_TEXT_MODEL',saved.model],['GEMINI_FALLBACK_MODEL',saved.fallback]]){if(value===undefined)delete process.env[env];else process.env[env]=value;}}
});
