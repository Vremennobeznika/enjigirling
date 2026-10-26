const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const pages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html','ai.html','ai-training.html','measurement-lab.html','calculator-atlas.html','robotics.html','coding.html'];
const originalNine=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
const all=[...originalNine,'robotics.html','coding.html','ai.html'];
for(const file of pages){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const shell=html.match(/<nav id="site-main-navigation"[^>]*>([\s\S]*?)<\/nav>/);
 assert.ok(shell,file+' nav missing');
 const hrefs=[...shell[1].matchAll(/<a href="([^"]+)" class="eng-tab(?: active)?"/g)].map(m=>m[1]);
 assert.equal(hrefs.length,12,file+' link count');
 assert.deepEqual(new Set(hrefs),new Set(all),file+' leaked/duplicated nav target');
 const active=[...shell[1].matchAll(/<a href="([^"]+)" class="eng-tab active"/g)].map(m=>m[1]);
 assert.ok(active.length<=1,file+' multiple active navigation tabs');
 if(all.includes(file))assert.deepEqual(active,[file],file+' incorrect selected tab');
 assert.ok(!html.includes('class="site-ai-link"'),file+' duplicated topbar AI button');
 assert.ok(!html.includes('https://robodienst.com/'),file+' third-party content embed');
}
const home=fs.readFileSync('index.html','utf8');
assert.ok(!home.includes('class="robotics-launch"'),'redundant home robotics panel');
assert.ok(!home.includes('class="ai-knowledge-entry"'),'redundant home AI panel');
const community=fs.readFileSync('resources.html','utf8');
assert.ok(!community.includes('id="ai-library"')&&!community.includes('downloads/ai-'),'coding PDF duplicated on resources');
const ctx={};
vm.runInNewContext(fs.readFileSync('resources-data.js','utf8')+';globalThis.items=resources;',ctx);
const items=JSON.parse(JSON.stringify(ctx.items));
const codeCtx={};
vm.runInNewContext(fs.readFileSync('coding-data.js','utf8')+';globalThis.docs=codingResources;globalThis.platforms=codingPlatforms;',codeCtx);
const docs=JSON.parse(JSON.stringify(codeCtx.docs)),platforms=JSON.parse(JSON.stringify(codeCtx.platforms));
assert.equal(docs.length,25,'lost coded education links');
assert.equal(platforms.length,15,'lost developer platforms');
assert.ok(items.every(x=>x.type!=='Разработка ПО'&&x.type!=='Библиотека программирования для ИИ'),'duplicate coding links in community resources');
assert.ok([...docs,...platforms].every(x=>!items.some(y=>y.id===x.id)),'duplicated resource ID');
assert.ok(new Set([...docs,...platforms].map(x=>x.link)).size===40,'duplicate coding URLs');
const coding=fs.readFileSync('coding.html','utf8');
for(const download of ['ai-llm-guide.pdf','ai-qa-engineering.pdf','ai-library-documents.zip']){
 assert.ok(coding.includes('href="downloads/'+download+'"'),'missing PDF '+download);
}
const hub=fs.readFileSync('ai.html','utf8');
assert.ok(!hub.includes('id="pack-ai-code-library"'),'coding content duplicated on AI export page');
assert.ok(hub.includes('knowledge/sections/all.md'),'AI data hub missing');
assert.ok(fs.readFileSync('scripts/build-ai-packs.cjs','utf8').includes("jsArray('coding-data.js','codingResources')"),'AI exporter not migrated to coding');
for(const name of ['coding','robotics']){
 const html=fs.readFileSync(name+'.html','utf8');
 let bytes=Buffer.byteLength(html);
 for(const m of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)){
  const file=m[1];
  const target=path.join(root,file);
  assert.ok(fs.existsSync(target),name+' missing '+file);
  bytes+=fs.statSync(target).size;
 }
 assert.ok(bytes<=160*1024,name+' requires too much initial source '+bytes);
 console.log('BUDGET '+name+': '+Math.round(bytes/1024)+' KiB static HTML/CSS/JS');
}
console.log('PASS 15 static routes, 12 destinations, 40 coding sources, no duplicates, budget cap');
