import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
export const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store, private'}});
export class ApiError extends Error {constructor(message,status=400){super(message);this.status=status;}}
export async function authenticate(request) {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)throw new ApiError('Layanan akun belum dikonfigurasi. Gunakan penyimpanan lokal dahulu.',503);
  const authorization=request.headers.get('authorization');if(!authorization?.startsWith('Bearer '))throw new ApiError('Silakan masuk untuk menggunakan layanan ini.',401);
  const db=createClient(url,key,{global:{headers:{Authorization:authorization}},auth:{persistSession:false}});
  const {data,error}=await db.auth.getUser(authorization.slice(7));if(error||!data.user)throw new ApiError('Sesi berakhir. Silakan masuk kembali.',401);
  return {db,user:data.user};
}
export function adminDb(){if(!process.env.SUPABASE_SERVICE_ROLE_KEY)throw new ApiError('Layanan AI belum dikonfigurasi.',503);return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});}
export async function body(request,max=1500000){const raw=await request.text();if(Buffer.byteLength(raw)>max)throw new ApiError('Permintaan terlalu besar.',413);try{return JSON.parse(raw);}catch{throw new ApiError('Format JSON tidak valid.');}}
export function failure(error){return json({error:error instanceof ApiError?error.message:error?.name==='ZodError'?'Data belum lengkap atau tidak valid.':'Layanan belum berhasil memproses permintaan. Coba lagi nanti.'},error.status||400);}
export async function reserve(userId,requestId,kind,input) {
  const admin=adminDb(),hash=createHash('sha256').update(JSON.stringify(input)).digest('hex');
  const {data,error}=await admin.rpc('reserve_ai_request',{p_user:userId,p_request:requestId,p_kind:kind,p_hash:hash,p_user_limit:Number(process.env.AI_DAILY_LIMIT||20),p_global_limit:Number(process.env.AI_GLOBAL_DAILY_LIMIT||200)});
  if(error)throw new ApiError('Penyimpanan kuota belum siap. Jalankan migrasi Supabase.',503);
  if(data.status==='quota')throw new ApiError('Kuota AI hari ini habis. Kartu tersimpan tetap bisa dipelajari.',429);
  if(data.status==='mismatch')throw new ApiError('ID permintaan sudah dipakai untuk masukan lain.',409);
  if(data.status==='pending')throw new ApiError('Permintaan ini masih diproses. Tunggu sebelum mencoba kembali.',409);
  if(data.status==='failed')throw new ApiError('Permintaan sebelumnya gagal. Tekan Buat ulang untuk permintaan baru.',409);
  return {admin,cached:data.status==='success'?data.result:null};
}
export async function finish(admin,user,id,status,result=null){const {error}=await admin.from('ai_requests').update({status,result}).eq('user_id',user).eq('id',id);if(error)throw new ApiError('Hasil belum dapat disimpan. Jangan kirim ulang sebelum memeriksa koneksi.',503);}
export async function openRouter(path,payload,timeout=60000){
  if(!process.env.OPENROUTER_API_KEY)throw new ApiError('OpenRouter belum dikonfigurasi. Isi kartu secara manual atau simpan draf.',503);
  let response;try {response=await fetch('https://openrouter.ai/api/v1/'+path,{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,'Content-Type':'application/json','X-Title':'Sela'},body:JSON.stringify(payload),signal:AbortSignal.timeout(timeout)});}catch{throw new ApiError('Layanan AI tidak merespons tepat waktu. Drafmu tetap tersimpan.',504);}
  if(!response.ok){
   const messages={402:'Kredit OpenRouter belum tersedia atau tidak cukup. Isi kredit di openrouter.ai/settings/credits, lalu coba lagi. Model teks gratis tetap dapat digunakan.',401:'Kunci OpenRouter tidak valid. Periksa konfigurasi API key.',403:'Akses model ditolak. Periksa izin key dan kebijakan akun OpenRouter.',404:'Model atau endpoint tidak tersedia. Periksa konfigurasi model.',429:'Penyedia AI sedang membatasi permintaan. Coba lagi nanti.'};
   throw new ApiError(messages[response.status]||'Penyedia AI gagal memproses permintaan. Coba lagi nanti.',messages[response.status]?response.status:502);
  }
  return response.json();
}

export function textModel(){
 if(process.env.GEMINI_API_KEY)return process.env.GEMINI_TEXT_MODEL||'gemini-3.5-flash-lite';
 const model=process.env.OPENROUTER_TEXT_MODEL;
 if(!model||!process.env.OPENROUTER_API_KEY)throw new ApiError('AI teks belum diaktifkan.',503);
 if(process.env.ALLOW_PAID_TEXT!=='true'&&model!=='openrouter/free'&&!model.endsWith(':free'))throw new ApiError('Model berbayar belum diizinkan.',503);
 return model;
}
export function geminiPayload(payload,model){
 const system=payload.messages.filter(m=>m.role==='system').map(m=>m.content).join('\n');
 const generationConfig={maxOutputTokens:payload.max_tokens||3000,thinkingConfig:model.startsWith('gemini-2.5')?{thinkingBudget:0}:{thinkingLevel:model.includes('lite')?'minimal':'low'}};
 if(payload.response_format){generationConfig.responseMimeType='application/json';if(payload.response_format.json_schema?.schema)generationConfig.responseJsonSchema=payload.response_format.json_schema.schema;}
 return {systemInstruction:{parts:[{text:system||'Answer helpfully and accurately.'}]},contents:payload.messages.filter(m=>m.role!=='system').map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig};
}
export async function textCompletion(payload){
 if(!process.env.GEMINI_API_KEY)return openRouter('chat/completions',payload);
 const primary=textModel(),fallback=process.env.GEMINI_FALLBACK_MODEL||'gemini-3.8-flash';
 const models=[...new Set([primary,fallback])];let lastError;
 for(const model of models){
  const started=Date.now();
  try{
   const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent',{method:'POST',headers:{'x-goog-api-key':process.env.GEMINI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify(geminiPayload(payload,model)),signal:AbortSignal.timeout(20000)});
   if(!response.ok){
    const messages={400:'Format permintaan Google AI ditolak. Periksa konfigurasi model.',401:'Kunci Google AI tidak valid.',403:'Google AI menolak akses. Periksa izin API key dan proyek.',404:'Model Gemini tidak tersedia.',429:'Kuota Google AI habis atau permintaan terlalu cepat. Periksa kuota di AI Studio.',503:'Google AI sedang sibuk. Draf tetap aman; coba lagi sebentar.'};
    throw new ApiError(messages[response.status]||'Google AI sedang bermasalah. Draf tetap aman.',response.status>=500?503:response.status);
   }
   const result=await response.json();
   const candidate=result.candidates?.[0];
   const content=candidate?.content?.parts?.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');
   if(!content||candidate.finishReason==='MAX_TOKENS')throw new ApiError('Jawaban Google AI belum lengkap. Draf tetap aman.',502);
   return {choices:[{message:{content}}]};
  }catch(error){
   lastError=error instanceof ApiError?error:new ApiError('Koneksi Google AI terputus atau melewati batas waktu. Draf tetap tersimpan.',504);
   console.warn('gemini_request_failed',JSON.stringify({model,status:lastError.status,durationMs:Date.now()-started}));
   if(![404,502,503,504].includes(lastError.status))throw lastError;
  }
 }
 throw lastError;
}
