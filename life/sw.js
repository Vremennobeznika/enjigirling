const CACHE = 'life-dashboard-v3';
const SHELL = ['./','./index.html','./manifest.webmanifest','./icon.svg','../calendar/household.js','./auto-sync.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('life-dashboard-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const planPath=new URL('../calendar/household.js',self.registration.scope).pathname;
  if (event.request.method!=='GET' || url.origin!==self.location.origin || (!url.pathname.startsWith(new URL(self.registration.scope).pathname) && url.pathname!==planPath)) return;
  // Scope only applies to pages under /life/. Do not intercept the cloud API.
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
    return response;
  }).catch(async()=>{
    const cache=await caches.open(CACHE);
    return await cache.match(event.request) || await cache.match('./index.html') || Response.error();
  }));
});
