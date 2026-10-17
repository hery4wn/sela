import {POST as progress} from '../app/api/progress/route.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {POST as generate} from '../app/api/generate/route.js';
import {POST as image} from '../app/api/image/route.js';
import {GET as sync} from '../app/api/sync/route.js';
test('AI and cloud fail closed without configuration or authentication',async()=>{const old=process.env.NEXT_PUBLIC_SUPABASE_URL;delete process.env.NEXT_PUBLIC_SUPABASE_URL;for(const handler of [generate,image,sync,progress]){const response=await handler(new Request('http://localhost/api/test'));assert.equal(response.status,503);assert.match((await response.json()).error,/belum dikonfigurasi/)}if(old)process.env.NEXT_PUBLIC_SUPABASE_URL=old;});
