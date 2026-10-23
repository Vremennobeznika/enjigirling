'use strict';
// Unit test of service worker event dispatch and offline fallback in Node (no real browser).
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const worker=fs.readFileSync(require('path').join(__dirname,'../sw.js'),'utf8');
const handlers={},entries=new Map(),shell={};
const cache={addAll:async arr=>{arr.forEach(x=>entries.set(x,'asset:'+x));},match:async req=>entries.get(typeof req==='string'?req:req.url)||null};
let claimed=false,skipped=false;
const ctx={
 self:{location:{origin:'https://example.org'},addEventListener:(event,fn)=>{handlers[event]=fn;},skipWaiting:()=>{skipped=true},clients:{claim:()=>{claimed=true}}},
 caches:{open:async()=>cache,keys:async()=>['chroma-v3','chroma-v4','unrelated-cache'],delete:async k=>{assert.equal(k,'chroma-v3');return true},match:async req=>cache.match(req)},
 Promise, URL,Response:{error:()=>null},fetch:async()=>{throw Error('offline')},
};
vm.runInNewContext(worker,ctx,{filename:'sw.js'});
const event=p=>({waitUntil:fn=>{p.task=fn},respondWith:fn=>{p.task=fn}});
(async()=>{
 let x={};handlers.install(event(x));await x.task;assert(skipped);assert(entries.has('./index.html'));assert(entries.has('./styles.css'));assert(entries.has('./app.js'));
 x={};handlers.activate(event(x));await x.task;assert(claimed);
 x={};handlers.fetch({...event(x),request:{method:'GET',url:'https://example.org/missing',mode:'navigate'}});
 assert.equal(await x.task,'asset:./index.html');
 x={};handlers.fetch({...event(x),request:{method:'GET',url:'https://example.org/missing',mode:'cors'}});
 assert.equal(await x.task,null);
 console.log('PASS SW install, cache, activation, navigation fallback and asset error');
})().catch(e=>{console.error(e);process.exitCode=1});
