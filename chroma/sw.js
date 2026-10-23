/* Versioned cache with offline fallback; same-origin requests only. */
var CACHE='chroma-v4';
var PRE=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(PRE)}).then(function(){return self.skipWaiting()}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(names){return Promise.all(names.filter(function(x){return x.indexOf('chroma-')===0&&x!==CACHE}).map(function(x){return caches.delete(x)}));}).then(function(){return self.clients.claim()}));});
self.addEventListener('fetch',function(e){
 if(e.request.method!=='GET')return;
 var url=new URL(e.request.url);if(url.origin!==self.location.origin)return;
 e.respondWith(caches.match(e.request).then(function(hit){
   if(hit)return hit;
   return fetch(e.request).catch(function(){if(e.request.mode==='navigate')return caches.match('./index.html');return Response.error();});
 }));
});
