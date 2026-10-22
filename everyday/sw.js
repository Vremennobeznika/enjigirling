/* Offline cache contains static app code only. Personal user data lives in localStorage. */
const CACHE="ordinary-day-static-v1-20261022";
const SHELL=["./","./index.html","./style.css","./model.js","./app.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("ordinary-day-static-")&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET"||new URL(req.url).origin!==self.location.origin)return;
 const scope=new URL(self.registration.scope);
 const url=new URL(req.url);
 if(!url.pathname.startsWith(scope.pathname))return;
 event.respondWith(
  fetch(req).then(resp=>{
   if(resp.ok){const cloned=resp.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,cloned)))}
   return resp;
  }).catch(()=>caches.match(req).then(cached=>cached||new Response("Нет подключения к сети. Открой приложение после первого онлайн-визита.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}})))
 );
});