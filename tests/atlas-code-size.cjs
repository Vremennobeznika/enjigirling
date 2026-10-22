#!/usr/bin/env node
// Scope: executable atlas code, not the growing knowledge datasets.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const baseline={'materials.js':11486,'processes.js':12268,'atlas-ai-core.js':9703,'atlas-ai-download.js':3823};
const now=Object.fromEntries(Object.keys(baseline).map(p=>[p,read(p).length]));
const total=o=>Object.values(o).reduce((n,x)=>n+x,0);
const oldTotal=total(baseline),newTotal=total(now);
assert.ok(newTotal<=Math.ceil(oldTotal*1.10),'Atlas JS grew over 10% from reviewed baseline');
for(const [file,base] of Object.entries(baseline))
 assert.ok(now[file]<=Math.ceil(base*1.20),file+' grew over 20% without budget review');
for(const page of ['materials.html','processes.html']){
 const html=read(page),shared=(html.match(/id="atlasAiPackage"/g)||[]).length;
 const legacy=page==='materials.html'?(html.match(/class="material-export"/g)||[]).length:(html.match(/class="process-export"/g)||[]).length;
 assert.equal(shared,1,page+' must have exactly one common export panel');
 assert.equal(legacy,0,page+' must not duplicate the common export panel');
 assert.ok(html.includes('src="atlas-ai-core.js"')&&html.includes('src="atlas-ai-download.js"'),page+' must reuse common exporter');
 assert.ok(!/<script[^>]+src=["']https?:\/\//i.test(html),page+' introduces remote script');
}
for(const page of ['materials.html','processes.html']){
 const html=read(page);
 const scripts=[...html.matchAll(/<script\\s+[^>]*src="([^"]+)"[^>]*>/g)];
 const atlas=['materials-data.js','processes-data.js','data.js',page==='materials.html'?'materials.js':'processes.js','atlas-ai-core.js','atlas-ai-download.js'];
 for(const file of atlas){
  const tag=scripts.find(m=>m[1]===file)?.[0];
  assert.ok(tag&&/\\sdefer(?:\\s|>)/.test(tag),page+' must defer '+file+' without reordering dependent scripts');
 }
 const positions=atlas.map(file=>scripts.findIndex(m=>m[1]===file));
 assert.deepEqual(positions,positions.slice().sort((a,b)=>a-b),page+' script dependency order changed');
}
const dataCount=read('materials-data.js').length+read('processes-data.js').length;
console.log('PASS code-size budget: '+newTotal+' / '+Math.ceil(oldTotal*1.10)+' JS characters; knowledge data '+dataCount+' characters tracked separately');
