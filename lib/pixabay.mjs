import {ApiError} from './server.mjs';
export function pixabayUrl(value){
 const u=new URL(value);
 if(u.protocol!=='https:'||!['pixabay.com','cdn.pixabay.com'].includes(u.hostname)||u.username||u.password||u.port)throw new ApiError('Alamat gambar tidak valid.',502);
 return u.href;
}
export async function searchPixabay(params){
 if(!process.env.PIXABAY_API_KEY)throw new ApiError('Isi PIXABAY_API_KEY di konfigurasi server untuk mengaktifkan pencarian gambar.',503);
 const url=new URL('https://pixabay.com/api/');
 url.search=new URLSearchParams({key:process.env.PIXABAY_API_KEY,safesearch:'true',per_page:'12',...params}).toString();
 let r;try{r=await fetch(url,{next:{revalidate:86400},signal:AbortSignal.timeout(15000)});}catch{throw new ApiError('Pixabay belum dapat dihubungi. Coba lagi.',503);}
 if(!r.ok)throw new ApiError(r.status===429?'Batas pencarian Pixabay tercapai. Coba lagi nanti.':'Pixabay menolak permintaan. Periksa API key server.',r.status===429?429:502);
 return (await r.json()).hits||[];
}
export async function downloadPixabay(url){
 let current=pixabayUrl(url);
 for(let i=0;i<4;i++){
  const r=await fetch(current,{redirect:'manual',signal:AbortSignal.timeout(20000)});
  if([301,302,303,307,308].includes(r.status)){current=pixabayUrl(new URL(r.headers.get('location'),current).href);continue;}
  const mime=r.headers.get('content-type')?.split(';')[0];
  if(!r.ok||!['image/jpeg','image/png','image/webp'].includes(mime))throw new ApiError('Gambar tidak tersedia dalam format yang didukung.',502);
  const chunks=[];let size=0;
  for await(const chunk of r.body){size+=chunk.length;if(size>10000000)throw new ApiError('Gambar terlalu besar.',413);chunks.push(chunk);}
  return {buffer:Buffer.concat(chunks),mime};
 }
 throw new ApiError('Pengalihan gambar tidak valid.',502);
}
