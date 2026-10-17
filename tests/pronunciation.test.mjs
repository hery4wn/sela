import test from 'node:test';
import assert from 'node:assert/strict';
import {openRouter} from '../lib/server.mjs';
import {shortPronunciation} from '../lib/ai-card.mjs';
test('legacy pronunciation becomes a single transcription',()=>{
 assert.equal(shortPronunciation('delicate: /ˈdelɪkət/ — dibaca deliket · delicate: /ˈdelɪkət/'),'/ˈdelɪkət/');
 assert.equal(shortPronunciation(''),'');
});
test('402 identifies missing credits without exposing provider payload',async()=>{
 const original=globalThis.fetch,key=process.env.OPENROUTER_API_KEY;
 process.env.OPENROUTER_API_KEY='test';globalThis.fetch=async()=>new Response('{}',{status:402});
 try{await assert.rejects(()=>openRouter('images',{}),e=>e.status===402&&e.message.includes('Kredit OpenRouter'));}
 finally{globalThis.fetch=original;if(key===undefined)delete process.env.OPENROUTER_API_KEY;else process.env.OPENROUTER_API_KEY=key;}
});
