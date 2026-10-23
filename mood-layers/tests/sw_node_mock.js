const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const handlers={}, adds=[], deletes=[];
const cache={addAll:async arr=>adds.push(...arr)};
const caches={open:async()=>cache,keys:async()=>['sloi-pwa-v1.2.0','psho-pwa-v1.3.0','another-app-cache'],delete:async k=>{deletes.push(k);return true;},match:async r=>({status:200})};
const scope='https://example.org/enjigirling/mood-layers/';let skips=0,claims=0, networkCalls=0;
const context={URL,Response,Promise,caches,fetch:async()=>{networkCalls++;return new Response('NETWORK')},self:{location:{origin:'https://example.org'},registration:{scope},clients:{claim:async()=>{claims++;}},skipWaiting:()=>{skips++;},addEventListener:(k,h)=>handlers[k]=h}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'..','sw.js'),'utf8'),context);
function wait(type,req){let task;handlers[type]({request:req,waitUntil:p=>task=p,respondWith:p=>task=p});return task;}
(async()=>{
 await wait('install');assert(adds.includes('./pwa-ui.js'));assert(adds.includes('./i18n.js'),'offline install must include translation dictionary');assert(adds.includes('./pwa-style.css'));assert(adds.includes('./index.html'));assert.equal(skips,0,'do not force update over unsaved drafts');
 await wait('activate');assert.equal(claims,1);assert.deepEqual(deletes,['sloi-pwa-v1.2.0','psho-pwa-v1.3.0']);
 handlers.message({data:{type:'SKIP_WAITING'}});assert.equal(skips,1);
 await wait('fetch',{method:'GET',url:scope+'index.html',mode:'navigate'});
 await wait('fetch',{method:'GET',url:scope+'app.js',mode:'same-origin'});
 await wait('fetch',{method:'POST',url:scope+'index.html',mode:'same-origin'});
 assert.equal(networkCalls,0);
 console.log('PASS SW cache, old-version cleanup, no force-update, update by confirmation, no diary cache');
})().catch(e=>{console.error(e);process.exit(1)});
