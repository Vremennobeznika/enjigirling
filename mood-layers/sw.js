/* Static app shell only. Diary entries never enter CacheStorage. */
var CACHE='sloi-pwa-v1.2.0';
var STATIC=['./','./index.html','./style.css','./pwa-style.css','./app.js','./pwa-ui.js','./manifest.webmanifest','./assets/icon.svg','./assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(STATIC);}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k.indexOf('sloi-')===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('message',function(e){if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;var u=new URL(e.request.url);if(u.origin!==self.location.origin||u.pathname.indexOf(new URL(self.registration.scope).pathname)!==0)return;if(e.request.mode!=='navigate'&&STATIC.indexOf('./'+u.pathname.slice(new URL(self.registration.scope).pathname.length))<0)return;e.respondWith(caches.match(e.request).then(function(cached){if(cached)return cached;return fetch(e.request).catch(function(){return e.request.mode==='navigate'?caches.match('./index.html'):Response.error();});}));});
