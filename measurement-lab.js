/* ENJIGIRLING: educational metrology visualizations. Not physical measurements. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
if(!$('micRange')||!$('dialRange')||!$('angleRange'))return;
const pi=Math.PI;
const fixed2=n=>(Math.round((n+Number.EPSILON)*100)/100).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2});
const svgLine=(x1,y1,x2,y2,other='')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" '+other+'/>';
const text=(x,y,t,other='')=>'<text x="'+x+'" y="'+y+'" '+other+'>'+t+'</text>';
const circ=(x,y,r,other='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" '+other+'/>';
const clamp=(v,min,max,step)=>Math.round(Math.max(min,Math.min(max,v))/step)*step;
function readInput(s){const raw=String(s).trim().replace(',','.');return raw&&/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(raw)?Number(raw):NaN;}
function setText(id,value){$(id).textContent=value;}
function bindRange(prefix,min,max,step,onChange){
 const range=$(prefix+'Range'),number=$(prefix+'Value');
 const change=(raw)=>{
  const v=readInput(raw);
  if(!Number.isFinite(v))return;
  const valid=clamp(v,min,max,step);
  range.value=String(valid);
  number.value=String(valid);
  onChange(valid);
 };
 range.addEventListener('input',()=>change(range.value));
 number.addEventListener('input',()=>{const v=readInput(number.value);if(Number.isFinite(v)&&v>=min&&v<=max)change(number.value);});
 number.addEventListener('change',()=>change(number.value||range.value));
 change(range.value);
 return change;
}
function bindReveal(prefix,render){
 const button=$(prefix+'Reveal');let visible=true;
 button.addEventListener('click',()=>{
  visible=!visible;
  button.setAttribute('aria-pressed',String(visible));
  button.textContent=visible?'Скрыть ответ':'Показать ответ';
  render();
 });
 return ()=>visible;
}
function bindPractice(prefix,getValue,tol,formatter){
 $(prefix+'Check').addEventListener('click',()=>{
  const value=readInput($(prefix+'Guess').value);
  if(!Number.isFinite(value)){setText(prefix+'Feedback','Введите числовой отсчёт.');return;}
  const difference=Math.abs(value-getValue());
  setText(prefix+'Feedback',difference<=tol+1e-9?'Верно. Отсчёт: '+formatter(getValue()):'Не совпало. Проверьте основную шкалу, деления и направление.');
 });
 $(prefix+'Guess').addEventListener('keydown',e=>{if(e.key==='Enter'){$(prefix+'Check').click();}});
}
function randomHundredths(max){return Math.floor(Math.random()*(max*100+1))/100;}
function clearFeedback(prefix){setText(prefix+'Feedback','');$(prefix+'Guess').value='';}
let mic=7.28;
let micVisible=()=>true;
function renderMic(){
 const value=Math.round(mic*100)/100;
 const sleeve=Math.floor(Math.round(value*100)/50)*.5;
 const div=Math.round((value-sleeve)*100);
 const r=64,cx=531,cy=112,x0=44,sx=13.5,boundary=x0+Math.min(value,25)*sx;
 let v='<rect x="26" y="49" width="404" height="123" rx="12" class="instrument-fill"/>';
 v+=svgLine(x0,100,430,100,'class="meter-axis"');
 for(let i=0;i<=25;i++){
   const x=x0+i*sx;
   v+=svgLine(x,100,x,i%5===0?74:85,'class="meter-tick"');
   if(i%5===0)v+=text(x,65,i,'class="meter-number" text-anchor="middle"');
   if(i<25)v+=svgLine(x+sx/2,100,x+sx/2,111,'class="meter-minor"');
 }
 v+='<rect x="'+boundary+'" y="94" width="22" height="75" rx="4" class="meter-moving"/>';
 v+=svgLine(boundary+11,170,boundary+11,182,'class="meter-axis"');
 v+=text(30,207,'ГИЛЬЗА · миллиметры / половины','class="meter-label"');
 v+=circ(cx,cy,r,'class="meter-dial"');
 for(let i=0;i<50;i++){
   const a=-pi/2+(i-div)*pi*2/50;
   const len=i%5===0?12:6;
   v+=svgLine((cx+Math.cos(a)*(r-len)).toFixed(2),(cy+Math.sin(a)*(r-len)).toFixed(2),(cx+Math.cos(a)*(r-2)).toFixed(2),(cy+Math.sin(a)*(r-2)).toFixed(2),'class="meter-tick"');
   if(i%10===0)v+=text((cx+Math.cos(a)*(r-24)).toFixed(2),(cy+Math.sin(a)*(r-24)+4).toFixed(2),i,'class="meter-small" text-anchor="middle"');
 }
 v+=svgLine(cx,23,cx,40,'class="meter-pointer"');
 v+=text(cx,116,'50','class="meter-center" text-anchor="middle"');
 v+=text(cx,133,'делений','class="meter-small" text-anchor="middle"');
 v+=text(cx,207,'БАРАБАН · 0,01 мм','class="meter-label" text-anchor="middle"');
 $('micSvg').innerHTML=v;
 setText('micOutput',micVisible()?fixed2(value)+' мм':'Ответ скрыт');
 setText('micBreakdown',micVisible()?'Гильза: '+fixed2(sleeve)+' мм · барабан: '+div+' × 0,01 мм = '+fixed2(value-sleeve)+' мм':'Прочитайте основные деления гильзы и барабана, затем сложите.');
}
micVisible=bindReveal('mic',renderMic);
const micSet=bindRange('mic',0,25,.01,n=>{mic=n;renderMic();clearFeedback('mic');});
$('micRandom').addEventListener('click',()=>micSet(randomHundredths(25)));
bindPractice('mic',()=>mic,.005,n=>fixed2(n)+' мм');

let dial=3.45,dialZero=3.45;
let dialVisible=()=>true;
function renderDial(){
 const diff=Math.round((dial-dialZero)*100)/100;
 const theta=-pi/2+diff*2*pi;
 const cx=210,cy=141,r=103;
 let svg='<rect x="182" y="247" width="56" height="48" rx="7" class="meter-moving"/>';
 svg+=circ(cx,cy,r+12,'class="meter-dial"');
 for(let i=0;i<100;i++){
  const a=-pi/2+i*pi*2/100;
  const len=i%10===0?17:i%5===0?11:6;
  svg+=svgLine((cx+Math.cos(a)*(r-len)).toFixed(2),(cy+Math.sin(a)*(r-len)).toFixed(2),(cx+Math.cos(a)*r).toFixed(2),(cy+Math.sin(a)*r).toFixed(2),'class="meter-tick"');
  if(i%10===0)svg+=text((cx+Math.cos(a)*(r-32)).toFixed(2),(cy+Math.sin(a)*(r-32)+5).toFixed(2),i,'class="meter-small" text-anchor="middle"');
 }
 svg+=svgLine(cx,cy,(cx+Math.cos(theta)*79).toFixed(2),(cy+Math.sin(theta)*79).toFixed(2),'class="meter-pointer"');
 svg+=circ(cx,cy,6,'class="meter-moving"');
 svg+=text(cx,169,'0,01 мм / дел.','class="meter-label" text-anchor="middle"');
 svg+=text(210,304,'Индикатор измеряет ОТКЛОНЕНИЕ от установленного нуля','class="meter-label" text-anchor="middle"');
 $('dialSvg').innerHTML=svg;
 setText('dialOutput',dialVisible()?(diff>0?'+':'')+fixed2(diff)+' мм':'Ответ скрыт');
 const turns=Math.trunc(Math.abs(diff)), divisions=Math.round((Math.abs(diff)-turns)*100);
 setText('dialBreakdown',dialVisible()?'Ноль: '+fixed2(dialZero)+' мм · перемещение: '+fixed2(dial)+' мм · полных оборотов: '+turns+' · делений: '+divisions:'Ноль задаётся отдельно. Учитывайте направление и число полных оборотов.');
}
dialVisible=bindReveal('dial',renderDial);
const dialSet=bindRange('dial',0,10,.01,n=>{dial=n;renderDial();clearFeedback('dial');});
$('dialZero').addEventListener('click',()=>{dialZero=dial;renderDial();clearFeedback('dial');});
$('dialRandom').addEventListener('click',()=>dialSet(randomHundredths(10)));
bindPractice('dial',()=>Math.round((dial-dialZero)*100)/100,.005,n=>(n>0?'+':'')+fixed2(n)+' мм');

let angle=48;
let angleVisible=()=>true;
function renderAngle(){
 const cx=240,cy=213,r=155;
 let svg='<path d="M 85 213 A 155 155 0 0 1 395 213" class="meter-arc" />';
 svg+=svgLine(70,213,410,213,'class="meter-axis"');
 for(let i=0;i<=180;i+=2){
  const a=pi-i*pi/180;
  const outer=r,inner=r-(i%10===0?15:i%5===0?10:5);
  svg+=svgLine((cx+Math.cos(a)*inner).toFixed(2),(cy-Math.sin(a)*inner).toFixed(2),(cx+Math.cos(a)*outer).toFixed(2),(cy-Math.sin(a)*outer).toFixed(2),'class="meter-tick"');
  if(i%30===0)svg+=text((cx+Math.cos(a)*(r-30)).toFixed(2),(cy-Math.sin(a)*(r-30)+4).toFixed(2),i+'°','class="meter-small" text-anchor="middle"');
 }
 const a=pi-angle*pi/180;
 svg+=svgLine(cx,cy,(cx+Math.cos(a)*r).toFixed(2),(cy-Math.sin(a)*r).toFixed(2),'class="meter-pointer"');
 svg+=circ(cx,cy,5,'class="meter-moving"');
 svg+=text(cx,251,'Отсчёт от левого горизонтального луча','class="meter-label" text-anchor="middle"');
 $('angleSvg').innerHTML=svg;
 setText('angleOutput',angleVisible()?angle+'°':'Ответ скрыт');
}
angleVisible=bindReveal('angle',renderAngle);
const angleSet=bindRange('angle',0,180,1,n=>{angle=n;renderAngle();clearFeedback('angle');});
$('angleRandom').addEventListener('click',()=>angleSet(Math.floor(Math.random()*181)));
bindPractice('angle',()=>angle,.001,n=>n+'°');

})();