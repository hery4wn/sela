import test from 'node:test';
import assert from 'node:assert/strict';
import {pixabayUrl,searchPixabay} from '../lib/pixabay.mjs';
test('only HTTPS Pixabay image hosts are accepted',()=>{
 assert.equal(pixabayUrl('https://cdn.pixabay.com/photo/a.jpg'),'https://cdn.pixabay.com/photo/a.jpg');
 for(const url of ['http://pixabay.com/a','https://evil.com/a','https://pixabay.com.evil.com/a','https://user@pixabay.com/a','https://pixabay.com:444/a'])assert.throws(()=>pixabayUrl(url));
});
test('missing Pixabay key fails with setup instructions',async()=>{
 const old=process.env.PIXABAY_API_KEY;delete process.env.PIXABAY_API_KEY;
 try{await assert.rejects(()=>searchPixabay({q:'flower'}),e=>e.status===503&&e.message.includes('PIXABAY_API_KEY'));}finally{if(old!==undefined)process.env.PIXABAY_API_KEY=old;}
});
