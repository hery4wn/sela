// Leave headroom below the API's 1.5 MB body limit, including UTF-8 text.
export function syncBatches(operations){
 const batches=[];let batch=[],size=20;const encoder=new TextEncoder();
 for(const op of operations){const bytes=encoder.encode(JSON.stringify(op)).length+1;if(bytes>1000000)throw new Error('Satu catatan memiliki riwayat terlalu besar untuk sinkronisasi.');if(batch.length>=100||size+bytes>1000000){batches.push(batch);batch=[];size=20;}batch.push(op);size+=bytes;}
 if(batch.length)batches.push(batch);return batches;
}
