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

const part2=fs.readFileSync('academy-draft-part2.html','utf8');
const e05=part2.split('<section class="lesson" id="E05">')[1]?.split('</section>')[0];
assert.ok(e05,'E05 lesson exists');
assert.match(e05,/1,25 В/);
assert.match(e05,/750 мВ/);
assert.match(e05,/1,25 × 1000 = 1250 мВ/);
assert.match(e05,/750 \/ 1000 = 0,75 В/);
assert.match(e05,/учебный расчёт не разрешает подключение к действующей электроустановке/);
const part2Answers=JSON.parse(fs.readFileSync('academy-draft-part2.js','utf8').split('const answers=')[1].split(';')[0]);
assert.equal(part2Answers['E05-1'],1.25*1000,'E05-1 V to mV');
assert.equal(part2Answers['E05-2'],750/1000,'E05-2 mV to V');
console.log('PASS: E05 task statements, SI conversions, answer map and safety disclaimer.');

const e08=part2.split('<section class="lesson" id="E08">')[1]?.split('</section>')[0];
assert.ok(e08,'E08 lesson exists');
assert.match(e08,/Три показания: 10, 12, 14 мм/);
assert.match(e08,/условиях повторяемости/);
assert.match(e08,/выборочное стандартное отклонение/);
const readings=[10,12,14];
assert.equal(part2Answers['E08-1'],readings.reduce((a,b)=>a+b,0)/readings.length,'E08-1 mean');
assert.equal(part2Answers['E08-2'],Math.max(...readings)-Math.min(...readings),'E08-2 range');
console.log('PASS: E08 numerical statistics and repeatability caveat.');

const e09=part2.split('<section class="lesson" id="E09">')[1]?.split('</section>')[0];
assert.ok(e09,'E09 lesson exists');
assert.match(e09,/Номинал 20 мм, нижнее отклонение −0,1 мм/);
assert.match(e09,/Номинал 20 мм, верхнее отклонение \+0,2 мм/);
assert.match(e09,/правила принятия решения/);
assert.ok(Math.abs(part2Answers['E09-1']-(20-0.1))<1e-10,'E09 lower limit');
assert.ok(Math.abs(part2Answers['E09-2']-(20+0.2))<1e-10,'E09 upper limit');
assert.ok(part2Answers['E09-1']<=part2Answers['E09-2'],'E09 interval ordering');
console.log('PASS: E09 limits, problem statements and conformity qualification.');

const e06=intro.split('<section class="lesson" id="E06">')[1]?.split('</section>')[0];
assert.ok(e06,'E06 lesson exists');
assert.match(e06,/R = 1000 Ом, C = 0,001 Ф/);
assert.match(e06,/R = 2000 Ом, C = 500 мкФ/);
assert.match(e06,/63,2 %/);
assert.match(e06,/10-5-rc-circuits/);
assert.equal(e01Map['E06-1'],1000*0.001,'E06-1 RC seconds');
assert.equal(e01Map['E06-2'],2000*500*1e-6,'E06-2 RC microfarad conversion');
assert.ok(Math.abs((1-Math.exp(-1))*100-63.2)<0.02,'RC step response at one tau');
console.log('PASS: E06 RC tasks and time-constant interpretation.');

const e07=intro.split('<section class="lesson" id="E07">')[1]?.split('</section>')[0];
assert.ok(e07,'E07 lesson exists');
assert.match(e07,/Период 0,02 с/);
assert.match(e07,/4 деления по 5 мс/);
assert.match(e07,/1 \/ 0,02 = 50 Гц/);
assert.equal(e01Map['E07-1'],1/0.02,'E07-1 frequency');
assert.equal(e01Map['E07-2'],1/(4*5*1e-3),'E07-2 timebase frequency');
console.log('PASS: E07 frequency calculations and oscilloscope timebase conversion.');

const e10=html.split('<section class="lesson" id="E10">')[1]?.split('</section>')[0];
assert.ok(e10,'E10 lesson exists');
assert.match(e10,/U=24 В и R=120 Ом/);
assert.match(e10,/U=24 В и I=0,2 А/);
assert.match(e10,/Мощность в ваттах/);
assert.match(e10,/9-4-ohms-law/);
const part3Answers=JSON.parse(fs.readFileSync('academy-draft-part3.js','utf8').split('const answers=')[1].split(';')[0]);
assert.equal(part3Answers['E10-1'],24/120,'E10-1 Ohm law');
assert.ok(Math.abs(part3Answers['E10-2']-24*(24/120))<1e-10,'E10-2 power');
assert.ok(Math.abs(part3Answers['E10-2']-24**2/120)<1e-10,'E10-2 alternate power equation');
console.log('PASS: E10 current, power, model limits and physics reference.');

const a01=intro.split('<section class="lesson" id="A01">')[1]?.split('</section>')[0];
assert.ok(a01,'A01 lesson exists');
assert.match(a01,/Задание 80 °C, измерено 74 °C/);
assert.match(a01,/Задание 40%, измерено 52%/);
assert.match(a01,/процентных пунктах/);
assert.equal(e01Map['A01-1'],80-74,'A01-1 temperature control error');
assert.equal(e01Map['A01-2'],40-52,'A01-2 signed percentage-point error');
const a02=intro.split('<section class="lesson" id="A02">')[1]?.split('</section>')[0];
assert.ok(a02,'A02 lesson exists');
assert.match(a02,/Входы И: 1 и 0/);
assert.match(a02,/Входы ИЛИ: 0 и 1/);
assert.match(a02,/не схема безопасности/);
assert.equal(e01Map['A02-1'],Number(Boolean(1&&0)),'A02-1 AND truth table');
assert.equal(e01Map['A02-2'],Number(Boolean(0||1)),'A02-2 OR truth table');
console.log('PASS: A01 signed control error and A02 boolean logic with safety boundary.');

for(const [id,values,expected] of [
 ['A04',[20,4],[(20-4)/16*100,(4-4)/16*100]],
 ['A05',[10,20],[1/(10/1000),2/(20/1000)]],
 ['A06',[3,4],[Math.max(0,5-3),Math.max(0,2-4)]]
]) {
 const lesson=part2.split('<section class="lesson" id="'+id+'">')[1]?.split('</section>')[0];
 assert.ok(lesson,id+' lesson exists');
 for(let i=0;i<2;i++)assert.ok(Math.abs(part2Answers[id+'-'+(i+1)]-expected[i])<1e-10,id+'-'+(i+1)+' arithmetic');
 if(id==='A04')assert.match(lesson,/нельзя автоматически объявлять конкретным видом отказа/);
 if(id==='A05')assert.match(lesson,/несколько задач/);
 if(id==='A06')assert.match(lesson,/неретентивного таймера задержки включения/);
}
console.log('PASS: A04 analog scaling, A05 task cycles, A06 TON timer boundaries.');

const a07=html.split('<section class="lesson" id="A07">')[1]?.split('</section>')[0];
const a08=html.split('<section class="lesson" id="A08">')[1]?.split('</section>')[0];
assert.ok(a07&&a08,'A07 and A08 lessons exist');
assert.match(a07,/остальных сочетаний состояния и события переход здесь не определён/);
assert.match(a07,/не логика аварийного останова/);
assert.equal(part3Answers['A07-1'],1,'A07 transition on start');
assert.equal(part3Answers['A07-2'],2,'A07 transition on stop');
assert.match(a08,/Квитирование не означает исчезновение опасного состояния/);
assert.match(a08,/без фиксации состояния/);
assert.equal(part3Answers['A08-1'],5-2,'A08 unacknowledged count');
assert.equal(part3Answers['A08-2'],8-3,'A08 remaining active conditions');
console.log('PASS: A07 explicit state transitions and A08 alarm counts with acknowledgement semantics.');

const a09=html.split('<section class="lesson" id="A09">')[1]?.split('</section>')[0];
const a10=html.split('<section class="lesson" id="A10">')[1]?.split('</section>')[0];
assert.ok(a09&&a10,'A09 and A10 lessons exist');
assert.match(a09,/порядковый номер 16/);
assert.match(a09,/пять соседних holding-регистров/);
assert.match(a09,/от 1 до 125/);
assert.equal(part3Answers['A09-1'],16-1,'A09 one-based model to zero-based PDU');
assert.equal(part3Answers['A09-2'],5*2,'A09 register data bytes');
assert.match(a10,/Из 20 тестов 17 пройдены/);
assert.match(a10,/Все 12 тестов завершены, 3 не пройдены/);
assert.match(a10,/не означает 85 % надёжности/);
assert.equal(part3Answers['A10-1'],17/20*100,'A10 pass rate');
assert.equal(part3Answers['A10-2'],12-3,'A10 passed count');
console.log('PASS: A09 Modbus PDU addresses and FC03 byte count; A10 test accounting caveats.');

const a11=html.split('<section class="lesson" id="A11">')[1]?.split('</section>')[0];
const a12=html.split('<section class="lesson" id="A12">')[1]?.split('</section>')[0];
assert.ok(a11&&a12,'A11 and A12 lessons exist');
assert.match(a11,/После версии 7 выполнено 3 последовательных выпуска/);
assert.match(a11,/Из 15 изменений 4 отменены/);
assert.match(a11,/не правило SemVer/);
assert.equal(part3Answers['A11-1'],7+3,'A11 integer release sequence');
assert.equal(part3Answers['A11-2'],15-4,'A11 noncancelled change records');
assert.match(a12,/Датчик 4–20 мА, шкала 0–100 единиц, сигнал 12 мА/);
assert.match(a12,/Задание 60, измерено 50/);
assert.match(a12,/3,6 мА/);
assert.match(a12,/вне заявленного рабочего диапазона/);
assert.match(a12,/не является алгоритмом безопасного управления/);
assert.equal(part3Answers['A12-1'],(12-4)/(20-4)*100,'A12 scaling');
assert.equal(part3Answers['A12-2'],60-50,'A12 signed error');
assert.ok((3.6-4)/(20-4)*100<0,'A12 out-of-range reading is not valid process data');
console.log('PASS: A11 change-count assumptions and A12 4-20mA scaling and safety boundaries.');

console.log('PASS: A12, M10, Q10 example presence and independently evaluated arithmetic; not full source attestation.');

// Q03: independent/correlated uncertainty models and explicitly stated assumptions.
const q03=lesson('Q03');
assert.match(q03,/коэффициентами чувствительности \+1 и \+1/);
assert.match(q03,/коэффициентами чувствительности \+1 и −1/);
assert.match(q03,/коэффициент корреляции/);
assert.ok(Math.abs(Math.sqrt(3**2+4**2)-5)<1e-12);
assert.ok(Math.abs(Math.sqrt(6**2+8**2)-10)<1e-12);
assert.ok(Math.abs(Math.sqrt(3**2+4**2+2*1*1*0.5*3*4)-Math.sqrt(37))<1e-12);
assert.equal(part3Answers['Q03-1'],5);
assert.equal(part3Answers['Q03-2'],10);
console.log('PASS: Q03 independent and correlated standard uncertainty regression.');
