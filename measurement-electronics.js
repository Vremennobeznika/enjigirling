/* Embedded educational multimeter and oscilloscope, idealized circuit models. */
(() => {
'use strict';
const mount=document.getElementById('embeddedElectronics');
if(!mount)return;
const $=id=>document.getElementById(id);
const fmt=(v,d=2)=>Number(v).toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d});
const number=(raw,min,max)=>{
 const s=String(raw).trim().replace(',','.');
 const n=/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s)?Number(s):NaN;
 return Number.isFinite(n)&&n>=min&&n<=max?n:null;
};
const line=(x,y,x2,y2,cls='meter-tick')=>'<line x1="'+x+'" y1="'+y+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
const text=(x,y,s,cls='meter-label')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" class="'+cls+'">'+s+'</text>';
mount.innerHTML=[
'<section class="instrument-card embedded-meter" id="multimeter" aria-labelledby="meterHeading">',
'<header><div><p class="measurement-index">09 / ЭЛЕКТРИЧЕСКИЕ ИЗМЕРЕНИЯ</p><h2 id="meterHeading">Виртуальный мультиметр</h2><p>Учебная идеальная цепь: источник DC и резистор. Выбирайте режим измерения, меняйте напряжение и сопротивление.</p></div><span class="measurement-spec">Модель цепи</span></header>',
'<div class="instrument-svg-wrap"><svg id="meterSvg" viewBox="0 0 760 242" role="img" aria-label="Схема цепи с мультиметром"></svg></div>',
'<div class="instrument-fields"><div><label for="meterVoltage">Источник, В (0–24)</label><input type="number" id="meterVoltage" min="0" max="24" step="0.1" value="12"></div>',
'<div><label for="meterResistance">Резистор, Ом (1–10 000)</label><input type="number" id="meterResistance" min="1" max="10000" step="1" value="1000"></div>',
'<div><label for="meterMode">Режим измерения</label><select id="meterMode"><option value="voltage">DC V — напряжение</option><option value="current">DC mA — ток</option><option value="ohms">Ω — сопротивление</option></select></div></div>',
'<output id="meterOutput" class="instrument-reading" aria-live="polite">—</output><p id="meterDetails" class="instrument-hint"></p>',
'<p class="measurement-limit">Это вычислительная модель, а не управление измерительным прибором. Сопротивление в режиме Ω определяется при условно отключённом источнике. Реальные измерения требуют правильного выбора разъёмов, категории защиты и инструкции прибора.</p>',
'</section>',
'<section class="instrument-card embedded-meter" id="oscilloscope" aria-labelledby="scopeHeading">',
'<header><div><p class="measurement-index">10 / ЭЛЕКТРИЧЕСКИЕ СИГНАЛЫ</p><h2 id="scopeHeading">Виртуальный осциллограф</h2><p>Синусоидальный, прямоугольный и треугольный сигналы: измените амплитуду, частоту, смещение и временную развёртку.</p></div><span class="measurement-spec">2 В/дел.</span></header>',
'<div class="instrument-svg-wrap instrument-scope"><svg id="oscSvg" viewBox="0 0 800 330" role="img" aria-label="Интерактивная осциллограмма"></svg></div>',
'<div class="instrument-fields"><div><label for="oscShape">Форма сигнала</label><select id="oscShape"><option value="sine">Синус</option><option value="square">Прямоугольный</option><option value="triangle">Треугольный</option></select></div>',
'<div><label for="oscFrequency">Частота, Гц</label><input type="number" id="oscFrequency" min="1" max="10000" step="1" value="1000"></div>',
'<div><label for="oscAmplitude">Амплитуда (пик), В</label><input type="number" id="oscAmplitude" min="0.1" max="8" step="0.1" value="2"></div>',
'<div><label for="oscOffset">Смещение, В</label><input type="number" id="oscOffset" min="-6" max="6" step="0.1" value="0"></div>',
'<div><label for="oscTimebase">Развёртка, мс/дел.</label><select id="oscTimebase"><option value="0.1">0,1</option><option value="0.2">0,2</option><option value="0.5" selected>0,5</option><option value="1">1</option><option value="2">2</option><option value="5">5</option><option value="10">10</option></select></div></div>',
'<output id="oscOutput" class="instrument-reading" aria-live="polite">—</output><p id="oscDetails" class="instrument-hint"></p>',
'<p class="measurement-limit">Шкалы виртуальные: десять делений по времени и восемь по вертикали. При выходе сигнала за пределы ±8 В график обрезается. Подключения к реальному оборудованию нет.</p>',
'</section>'
].join('');
function renderMeter(){
 const u=number($('meterVoltage').value,0,24),r=number($('meterResistance').value,1,10000),mode=$('meterMode').value;
 let s='<rect x="42" y="40" width="465" height="155" rx="15" class="instrument-fill"/>';
 s+=line(110,72,401,72,'meter-axis')+line(401,72,401,167,'meter-axis')+line(401,167,110,167,'meter-axis');
 s+=line(110,72,110,105,'meter-axis')+line(110,132,110,167,'meter-axis');
 s+=line(94,105,126,105,'meter-axis')+line(101,115,119,115,'meter-axis')+line(97,125,123,125,'meter-axis');
 s+='<rect x="228" y="59" width="67" height="27" rx="5" class="instrument-fill"/>';
 s+=text(260,55,'R')+text(110,212,'Источник DC')+
 '<rect x="534" y="53" width="190" height="124" rx="13" class="instrument-fill"/>'+
 text(630,87,'МУЛЬТИМЕТР');
 if(u===null||r===null){
  $('meterOutput').textContent='Проверьте числовые параметры цепи';
  $('meterDetails').textContent='Допустимый диапазон: 0–24 В и 1–10 000 Ом.';
  s+=text(630,145,'—','meter-center');
 }else{
  const current=u/r*1000;
  const reading=mode==='voltage'?fmt(u)+' В':mode==='current'?fmt(current,3)+' мА':fmt(r,0)+' Ω';
  $('meterOutput').textContent=reading;
  $('meterDetails').textContent=mode==='current'?'I = U / R = '+fmt(u)+' В / '+fmt(r,0)+' Ом = '+fmt(current,3)+' мА':mode==='ohms'?'В режиме Ω источник питания условно отключён.':'Идеальный резистор подключён к источнику: падение напряжения равно '+fmt(u)+' В.';
  s+=text(630,139,mode==='voltage'?fmt(u):mode==='current'?fmt(current,3):fmt(r,0),'meter-center');
  s+=text(630,160,mode==='voltage'?'В':mode==='current'?'мА':'Ω');
 }
 $('meterSvg').innerHTML=s;
}
['meterVoltage','meterResistance','meterMode'].forEach(id=>$(id).addEventListener('input',renderMeter));
renderMeter();
function wave(t,type){
 const phase=((t%1)+1)%1;
 if(type==='sine')return Math.sin(2*Math.PI*t);
 if(type==='square')return phase<.5?1:-1;
 return 4*Math.abs(phase-.5)-1;
}
function renderScope(){
 const kind=$('oscShape').value;
 const f=number($('oscFrequency').value,1,10000),
       amp=number($('oscAmplitude').value,.1,8),
       offset=number($('oscOffset').value,-6,6),
       tb=Number($('oscTimebase').value);
 let s='<rect x="28" y="20" width="744" height="276" rx="10" class="instrument-fill"/>';
 for(let i=0;i<=10;i++)s+=line(40+72*i,25,40+72*i,281,'meter-minor');
 for(let i=0;i<=8;i++)s+=line(40,25+32*i,760,25+32*i,'meter-minor');
 s+=line(40,153,760,153,'meter-axis');
 if(f===null||amp===null||offset===null||!Number.isFinite(tb)){
  $('oscOutput').textContent='Проверьте частоту, амплитуду и смещение';
  $('oscDetails').textContent='Частота 1–10 000 Гц, амплитуда 0,1–8 В, смещение от −6 до +6 В.';
 }else{
  // With 1000 screen intervals, >125 cycles are too poorly sampled to draw accurately.
  const cycles=f*tb/100;
  if(cycles<=125){
  const path=[];
  for(let i=0;i<=1000;i++){
   const x=40+.72*i,t=i/1000*10*tb/1000,v=offset+amp*wave(f*t,kind);
   const y=153-16*v;
   path.push((i===0?'M':'L')+x.toFixed(2)+' '+Math.max(26,Math.min(281,y)).toFixed(2));
  }
  s+='<path d="'+path.join(' ')+'" stroke="var(--text-primary)" stroke-width="2.8" fill="none" stroke-linejoin="round"/>';
  }
  const rms=amp*(kind==='sine'?Math.SQRT1_2:kind==='triangle'?1/Math.sqrt(3):1);
  $('oscOutput').textContent='Период '+fmt(1000/f,3)+' мс · Vpp '+fmt(amp*2)+' В';
  $('oscDetails').textContent='Амплитуда '+fmt(amp)+' В · смещение '+fmt(offset)+' В · RMS '+fmt(Math.hypot(rms,offset),3)+' В · '+fmt(tb)+' мс/дел.'+(cycles>125?' График скрыт: недостаточно отсчётов на период при этой развёртке. Уменьшите мс/дел.':'');
 }
 s+=text(400,314,'10 × 8 делений · горизонталь: время · вертикаль: 2 В/дел.');
 $('oscSvg').innerHTML=s;
}
['oscShape','oscFrequency','oscAmplitude','oscOffset','oscTimebase'].forEach(id=>$(id).addEventListener('input',renderScope));
renderScope();
})();