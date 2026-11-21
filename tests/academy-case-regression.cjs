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

const intro=fs.readFileSync('academy-draft.html','utf8');
const e01=intro.match(new RegExp('<section class="lesson" id="E01">([\\s\\S]*?)<\\/section>'));
assert.ok(e01,'E01 lesson exists');
assert.match(e01[1],/2,5 А перевести в мА/);
assert.match(e01[1],/4700 Ом перевести в кОм/);
assert.match(e01[1],/2,5 × 1000 = 2500 мА/);
assert.match(e01[1],/4700 \/ 1000 = 4,7 кОм/);
const e01Map=JSON.parse(fs.readFileSync('academy-draft.js','utf8').split('const answers=')[1].split(';')[0]);
assert.equal(e01Map['E01-1'],2.5*10**3,'E01-1 SI milli conversion');
assert.equal(e01Map['E01-2'],4700/10**3,'E01-2 SI kilo conversion');
console.log('PASS: E01 problem statements, solutions and answer map cross-checked against BIPM SI prefixes.');

const e03=intro.split('<section class="lesson" id="E03">')[1]?.split('</section>')[0];
assert.ok(e03,'E03 lesson exists');
assert.match(e03,/120 Ом и 330 Ом последовательно/);
assert.match(e03,/Два резистора по 200 Ом параллельно/);
assert.match(e03,/120 \+ 330 = 450 Ом/);
assert.match(e03,/200 × 200 \/ 400 = 100 Ом/);
assert.match(e03,/openstax.org\/books\/university-physics-volume-2\/pages\/10-2-resistors-in-series-and-parallel/);
assert.equal(e01Map['E03-1'],120+330,'E03-1 series resistor calculation');
assert.equal(e01Map['E03-2'],1/(1/200+1/200),'E03-2 parallel resistor calculation');
assert.ok(e01Map['E03-2']<200,'parallel equivalent must be less than either positive branch');
console.log('PASS: E03 circuit model, worked examples and answer map.');

const e04=intro.split('<section class="lesson" id="E04">')[1]?.split('</section>')[0];
assert.ok(e04,'E04 lesson exists');
assert.match(e04,/Опорная длина 50 мм, показание 50,2 мм/);
assert.match(e04,/Опорное значение 100 мм, показание 99 мм/);
assert.match(e04,/При нулевом опорном значении эта формула не определена/);
assert.ok(Math.abs(e01Map['E04-1']-Math.abs(50.2-50))<1e-10,'E04-1 absolute deviation');
assert.equal(e01Map['E04-2'],Math.abs(99-100)/100*100,'E04-2 percent deviation');
assert.ok(!Number.isFinite(Math.abs(1-0)/Math.abs(0)*100),'zero reference is outside relative deviation domain');
console.log('PASS: E04 task data, answers and nonzero-reference domain.');

console.log('PASS: A12, M10, Q10 example presence and independently evaluated arithmetic; not full source attestation.');
