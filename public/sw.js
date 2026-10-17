const CACHE='sela-shell-v2';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['/','/icon.svg','/manifest.webmanifest','/art/sela-sprites.png'])));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sela-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{
 if(e.data==='ACTIVATE')self.skipWaiting();
 if(e.data?.type==='CACHE_SHELL'){
  const urls=(e.data.urls||[]).filter(value=>{try{const u=new URL(value);return u.origin===self.location.origin&&u.pathname.startsWith('/_next/static/')}catch{return false}});
  e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(urls)).then(()=>e.ports[0]?.postMessage({ready:true})).catch(()=>e.ports[0]?.postMessage({ready:false})));
 }
});
self.addEventListener('fetch',event=>{
  const {request}=event,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||request.headers.get('RSC'))return;
  if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(c=>c.put('/',response.clone()));return response;}).catch(()=>caches.match('/')));return;}
  if(url.pathname.startsWith('/_next/static/')||url.pathname.startsWith('/art/')||url.pathname.startsWith('/icon'))event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(request,res.clone()));return res;})));
});
