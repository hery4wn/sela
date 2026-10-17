import {z} from 'zod';
import {authenticate,adminDb,body,json,failure,ApiError} from '../../../lib/server.mjs';
import {searchPixabay,downloadPixabay,pixabayUrl} from '../../../lib/pixabay.mjs';
export async function GET(request){try{
 await authenticate(request);
 const q=z.string().trim().min(1).max(100).parse(new URL(request.url).searchParams.get('q'));
 const hits=await searchPixabay({q});
 return json({hits:hits.map(h=>({id:h.id,preview:pixabayUrl(h.previewURL),page:pixabayUrl(h.pageURL),tags:h.tags,author:h.user}))});
}catch(e){return failure(e);}}
export async function POST(request){try{
 const {user}=await authenticate(request);
 const {id}=z.object({id:z.number().int().positive()}).strict().parse(await body(request,1000));
 const hit=(await searchPixabay({id:String(id)})).find(h=>h.id===id);
 if(!hit)throw new ApiError('Gambar sudah tidak tersedia. Pilih gambar lain.',404);
 const {buffer,mime}=await downloadPixabay(hit.webformatURL);
 const path=`${user.id}/${crypto.randomUUID()}.${mime.split('/')[1]}`;
 const {error}=await adminDb().storage.from('sela-media').upload(path,buffer,{contentType:mime,upsert:false});
 if(error)throw new ApiError('Gambar gagal disimpan ke Supabase. Periksa bucket sela-media dan kuota Storage.',503);
 return json({path,alt:`${hit.tags} — ${hit.user} / Pixabay`.slice(0,500),page:pixabayUrl(hit.pageURL)});
}catch(e){return failure(e);}}
