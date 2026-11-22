'use strict';
// Structural content gate: proves presence and consistency, NOT factual attestation.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const pages=[['engineering-lessons.html',3,false],['academy-draft.html',13,true],['academy-draft-part2.html',12,true],['academy-draft-part3.html',24,true]];
const ids=new Set();
let lessons=0,forms=0,examples=0;
for(const [file,expected,isDraft] of pages){
 const html=fs.readFileSync(file,'utf8');
 const sections=[...html.matchAll(/<section\b[^>]*\bclass="lesson"[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)];
 assert.equal(sections.length,expected,file+' lesson count');
 for(const [,id,body] of sections){
  assert.ok(!ids.has(id),'duplicate lesson ID '+id);ids.add(id);
  const taskIds=[...body.matchAll(isDraft ? /<form\b[^>]*data-id="([^"]+)"/g : /<form\b[^>]*data-task="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(taskIds,isDraft ? [id+'-1',id+'-2'] : ({ohm:['ohm','ohm2'],signal:['signal','signal2'],tolerance:['tolerance','tolerance2']})[id],id+' task IDs');
  assert.equal((body.match(/<\/form>/g)||[]).length,2,id+' form balance');
  const solutions=(body.match(/<details\b/g)||[]).length;
  assert.ok(solutions>=2,id+' missing worked solutions');
  if(isDraft){
   assert.equal((body.match(/class="learning-check"/g)||[]).length,1,id+' learning objective');
   assert.ok(body.includes('После урока вы сможете:'),id+' objective missing');
   assert.match(body,/типичная ошибка:/i,id+' misconception missing');
   assert.ok((body.match(/class="worked-example"/g)||[]).length>=1,id+' no worked example');
   examples++;
  }
  forms+=taskIds.length;lessons++;
 }
}
assert.equal(lessons,52);
assert.equal(forms,104);
assert.equal(examples,49);
console.log('PASS academy content structure: 52 lessons, 104 exercises, 49 draft worked examples; factual review remains separate.');
