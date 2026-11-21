'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('academy-draft-part3.html','utf8');
function lesson(id){
 const match=html.match(new RegExp('<section class="lesson" id="'+id+'">([\\s\\S]*?)<\\/section>'));
 assert.ok(match,'missing lesson '+id);
 return match[1];
}
const a=lesson('A12'),m=lesson('M10'),q=lesson('Q10');
assert.match(a,/3,6 мА/);
assert.match(a,/вне заявленного рабочего диапазона 4–20 мА/);
assert.match(a,/не даёт команды увеличить выход/);
assert.match(m,/320 г/);
assert.match(m,/120 г/);
assert.match(m,/прочности, жёсткости/);
assert.match(m,/пока нельзя/);
assert.match(q,/Ac=2/);
assert.match(q,/Re=3/);
assert.match(q,/отклонить партию по заданному учебному правилу/);
assert.match(q,/не нормативная таблица/);
assert.equal((12-4)/(20-4)*100,50);
assert.ok(Math.abs((3.6-4)/(20-4)*100-(-2.5))<1e-10,'floating point signal extrapolation');
assert.equal(8*40,320);
assert.equal(3*40,120);
assert.equal(6/120*100,5);
assert.ok(3>=3&&2<=2,'conditional Ac/Re decision');
console.log('PASS: A12, M10, Q10 example presence and independently evaluated arithmetic; not full source attestation.');
