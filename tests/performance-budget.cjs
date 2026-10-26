#!/usr/bin/env node
// Deterministic zero-dependency resource-budget gate for the static site's startup.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pages=['index','calendar','resources','dictionary','map','calculator','compare','processes','materials','ai','ai-training','measurement-lab','calculator-atlas','coding','robotics'];
let routes=0;
for(const name of pages){
 const file=name+'.html'; if(!fs.existsSync(path.join(root,file)))continue;
 const html=read(file);
 const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1].split(/[?#]/)[0]);
 const styles=[...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)].map(m=>(m[0].match(/\bhref=["']([^"']+)["']/i)||[])[1]).filter(Boolean);
 const local=[...scripts,...styles].filter(x=>!/^https?:|^\/\//i.test(x));
 assert.equal(new Set(local).size,local.length,file+': duplicate initial asset request');
 let bytes=Buffer.byteLength(html);
 for(const asset of local){
  const target=path.resolve(root,asset);
  assert.ok(fs.existsSync(target),file+': missing initial asset '+asset);
  bytes+=fs.statSync(target).size;
 }
 // Budgets refer to uncompressed source bytes, not network transfer.
 assert.ok(bytes<=1100*1024,file+': startup source budget exceeded '+bytes+' bytes');
 if(name==='coding'||name==='robotics') assert.ok(bytes<=160*1024,file+': standalone lab too heavy for low-end devices '+bytes+' bytes');
 console.log('PERF '+file+': '+Math.round(bytes/1024)+' KiB initial local source, '+local.length+' assets');
 routes++;
}
const home=read('index.html');
for(const file of ['materials-data.js','processes-data.js','dictionary-data.js']){
 assert.ok(!new RegExp('<script\\s[^>]*src=["\\x27]'+file.replace('.','\\.')+'["\\x27]').test(home),'Home eagerly loads '+file);
}
const search=read('global-search.js');
assert.match(search,/Promise\.all\(/,'Global search should load datasets concurrently');
assert.match(search,/loadScript\('materials-data\.js'/);
assert.match(search,/loadScript\('processes-data\.js'/);
assert.match(search,/loadScript\('dictionary-data\.js'/);
console.log('PASS static start-up budgets for '+routes+' routes and lazy global search');
