import { z } from 'zod';
import { operationSchema } from '../../../lib/schema.mjs';
import { authenticate,json,body,failure,ApiError } from '../../../lib/server.mjs';
export async function POST(request){try{
  const {db,user}=await authenticate(request),{operations}=z.object({operations:z.array(operationSchema).max(100)}).parse(await body(request));
  if(operations.length){const rows=operations.map(op=>({id:op.id,user_id:user.id,payload:op}));const {error}=await db.from('sela_operations').upsert(rows,{onConflict:'user_id,id',ignoreDuplicates:true});if(error)throw new ApiError('Sinkronisasi belum tersimpan. Periksa migrasi database dan koneksi.',503);}
  return json({acked:operations.map(o=>o.id)});
}catch(error){return failure(error);}}
export async function GET(request){try{
  const {db,user}=await authenticate(request),after=new URL(request.url).searchParams.get('after');
  let query=db.from('sela_operations').select('id,payload').eq('user_id',user.id).order('id').limit(500);
  if(after){z.string().uuid().parse(after);query=query.gt('id',after);}
  const {data,error}=await query;if(error)throw new ApiError('Data cloud belum dapat dibaca. Data lokal tetap tersedia.',503);
  return json({operations:data.map(r=>r.payload),next:data.length===500?data.at(-1).id:null});
}catch(error){return failure(error);}}
