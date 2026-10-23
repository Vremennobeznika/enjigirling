/* Offline-first, strictly same-origin; avoid caching sensitive exports. */
var CACHE='sloi-v1.1.1';
var STATIC=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./assets/icon.svg','./assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',function(ev){ev.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(STATIC);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(ev){ev.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k.indexOf('sloi-')===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(ev){if(ev.request.method!=='GET')return;var url=new URL(ev.request.url);if(url.origin!==self.location.origin)return;ev.respondWith(caches.match(ev.request).then(function(hit){return hit||fetch(ev.request).catch(function(){return ev.request.mode==='navigate'?caches.match('./index.html'):Response.error();});}));});
