/* Planner-only PWA cache. Cloud requests and private data are never cached. */
const PREFIX='personal-planner-ios-',CACHE=PREFIX+'v4';
const ASSETS=['./life/','./life/index.html','./life/manifest.webmanifest','./life/icon.svg','./life/apple-touch-icon.png','./life/icon-192.png','./life/icon-512.png','./life/auto-sync.js','./calendar/','./calendar/index.html','./calendar/household.js','./plants/','./plants/index.html','./shopping/','./shopping/index.html','./life/planner/','./life/planner/index.html','./life/planner/model.js','./life/planner/config.js','./life/planner/app.js','./life/planner/styles.css','./life/active-reminders.js'];
const URLS=ASSETS.map(p=>new URL(p,self.registration.scope).href);
const PATHS=new Set(URLS.map(u=>new URL(u).pathname));
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith(PREFIX)||k.startsWith('life-dashboard-'))&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin||!PATHS.has(u.pathname))return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{const response=await fetch(r);if(response.ok)await cache.put(new Request(u.origin+u.pathname),response.clone());return response;}
  catch(err){const stored=await cache.match(new Request(u.origin+u.pathname));if(stored)return stored;
   if(r.mode==='navigate'){const page=u.pathname.includes('/calendar/')?'./calendar/index.html':u.pathname.includes('/plants/')?'./plants/index.html':u.pathname.includes('/shopping/')?'./shopping/index.html':'./life/index.html';return await cache.match(new URL(page,self.registration.scope))||Response.error();}
   return Response.error();}
 })());
});

self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const href=event.notification.data?.url||new URL('./life/planner/',self.registration.scope).href;
 if(!href.startsWith(self.registration.scope))return;
 event.waitUntil((async()=>{
  const clientsList=await clients.matchAll({type:'window',includeUncontrolled:true});
  const match=clientsList.find(c=>c.url.split('?')[0]===href.split('?')[0]);
  if(match){await match.focus();return match.navigate(href)}
  return clients.openWindow(href);
 })());
});
