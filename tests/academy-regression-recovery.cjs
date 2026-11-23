'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const files=['academy-draft.html','academy-draft-part2.html','academy-draft-part3.html'];
const expected=[13,12,24];
for(let i=0;i<files.length;i++){
 const s=fs.readFileSync(files[i],'utf8');
 const lessons=[...s.matchAll(/<section class="lesson" id="([^"]+)">([\s\S]*?)(?=<\/section>)/g)];
 assert.equal(lessons.length,expected[i],files[i]+': lesson count');
 for(const lesson of lessons){
  const notes=(lesson[2].match(/class="academy-safety-boundary"/g)||[]).length;
  assert.equal(notes,1,files[i]+': '+lesson[1]+' must have one safety note');
 }
}
for(const file of ['academy-draft.js','academy-draft-part2.js','academy-draft-part3.js']){
 const s=fs.readFileSync(file,'utf8');
 assert.ok(s.includes("replace(/\\u2212/g,'-')"),file+': Unicode minus normalization');
}
const q=fs.readFileSync('academy-draft-part3.html','utf8');
for(const id of ['Q03-1','Q03-2']){
 const pos=q.indexOf('data-id="'+id+'"');
 assert.ok(pos>=0,id+': exercise exists');
 const prefix=q.slice(Math.max(0,pos-550),pos);
 assert.ok(prefix.includes('независимыми стандартными неопределённостями'),id+': independence explicit');
 assert.ok(prefix.includes('коэффициентами чувствительности +1 и +1'),id+': sensitivity explicit');
}
console.log('PASS: 49 lesson safety notes, three Unicode-minus parsers, Q03 task assumptions');
