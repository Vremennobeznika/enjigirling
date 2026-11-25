'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'ai-toolkit','iishnitsa-public-starter');
const archive=path.join(root,'ai-toolkit','iishnitsa-public-starter.zip');
const names=['00_START_HERE.md','01_CORE_RULES.md','02_QA_AND_HANDOFF.md'];
const page=fs.readFileSync(path.join(root,'iishnitsa.html'),'utf8');
const section=page.match(/<section class="ai-hub-header" id="iishnitsa"[^>]*>([\s\S]*?)<\/section>/);
assert(section,'IISHNITSA section absent');
assert(!fs.readFileSync(path.join(root,'ai.html'),'utf8').includes('id="iishnitsa"'),'duplicate toolkit in AI hub');
assert(section[1].includes('iishnitsa-public-starter.zip'),'download link missing');
const links=[...section[1].matchAll(/href="([^"]+)"/g)].map(x=>x[1]).filter(x=>!x.startsWith("#"));
assert.deepEqual(links.sort(),[
 'ai-toolkit/iishnitsa-public-starter.zip',
 ...names.map(n=>'ai-toolkit/iishnitsa-public-starter/'+n)
].sort());
for(const href of links)assert(fs.existsSync(path.join(root,href)),'broken relative link: '+href);
const forbid=(s,label)=>{
 assert(!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(s),'Email in '+label);
 assert(!/(?:\+7|8)[\s()\-]*\d(?:[\s()\-]*\d){9}/.test(s),'Phone in '+label);
 assert(!/https?:\/\/(?:drive|docs)\.google\.com\//i.test(s),'Private Drive link in '+label);
};
forbid(section[1],'new section');
const expected=new Map();
for(const name of names){const text=fs.readFileSync(path.join(dir,name),'utf8');assert(text.length>400,name+' appears empty');forbid(text,name);expected.set(name,Buffer.from(text,'utf8'));}
const b=fs.readFileSync(archive);let pos=0;const actual=new Map();
while(pos+30<b.length&&b.readUInt32LE(pos)===0x04034b50){
 const flags=b.readUInt16LE(pos+6),method=b.readUInt16LE(pos+8);
 assert.equal(flags&8,0,'data descriptor unsupported');
 assert.equal(method,0,'archive should use STORED entries');
 const length=b.readUInt32LE(pos+18),original=b.readUInt32LE(pos+22);
 assert.equal(length,original);
 const nameLength=b.readUInt16LE(pos+26),extra=b.readUInt16LE(pos+28);
 const name=b.subarray(pos+30,pos+30+nameLength).toString('utf8');
 const start=pos+30+nameLength+extra;
 assert(start+length<=b.length,'bad ZIP entry bounds');
 assert(!actual.has(name),'duplicate ZIP entry '+name);
 actual.set(name,b.subarray(start,start+length));
 pos=start+length;
}
assert.equal(b.readUInt32LE(pos),0x02014b50,'ZIP central directory missing');
assert.deepEqual([...actual.keys()].sort(),names.slice().sort(),'unexpected ZIP contents');
for(const [name,data] of actual)assert(data.equals(expected.get(name)),'ZIP member differs from published text: '+name);
console.log('PASS: 3 exact ZIP entries, no unexpected private files, correct links and basic privacy scans');
