const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const events={},precache=[],removed=[];
const caches={open:async()=>({addAll:async p=>precache.push(...p)}),keys:async()=>['sloi-v1.1.2','sloi-pwa-v1.2.0'],delete:async k=>{removed.push(k);return true;},match:async()=>null};
let skip=0,claim=0;const self={location:{origin:'https://example.org'},registration:{scope:'https://example.org/enjigirling/mood-layers/'},clients:{claim:async()=>claim++},skipWaiting:()=>skip++,addEventListener:(n,fn)=>events[n]=fn};
vm.runInNewContext(fs.readFileSync('mood-layers/sw.js','utf-8'),{self,caches,Promise,URL,Response});
async function trigger(n){let p;events[n]({waitUntil:x=>p=x});await p;}
(async()=>{
 await trigger('install');
 assert(precache.includes('./pwa-ui.js'));
 assert(precache.includes('./pwa-style.css'));
 assert.equal(skip,0,'installation must not force activation without user action');
 await trigger('activate');
 assert.equal(claim,1);
 assert(removed.includes('sloi-v1.1.2'));
 assert(removed.includes('sloi-pwa-v1.2.0'));
 events.message({data:{type:'SKIP_WAITING'}});
 assert.equal(skip,1,'explicit update request should call skipWaiting once');
 console.log('PASS Service Worker install/migrate/offline assets/manual update');
})().catch(e=>{console.error(e);process.exit(1)});
