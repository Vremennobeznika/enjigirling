/* Standalone interactive calipers, depth gauge, ruler; not real-world measurements. */
(() => {
'use strict';
const root=document.getElementById('embeddedInstruments');
if(!root)return;
const $=id=>document.getElementById(id);
const fmt=(n,d=2)=>Number(n).toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d});
const num=x=>{const s=String(x).trim().replace(',','.');return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s)?Number(s):NaN;};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const line=(x,y,u,v,c='meter-tick')=>'<line x1="'+x+'" y1="'+y+'" x2="'+u+'" y2="'+v+'" class="'+c+'"/>';
const label=(x,y,t,c='meter-number')=>'<text x="'+x+'" y="'+y+'" class="'+c+'" text-anchor="middle">'+t+'</text>';
const circle=(x,y,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="meter-dial"/>';
const defs=[
 {id:'vernier',name:'Нониусный штангенциркуль',kind:'ШТАНГЕНЦИРКУЛИ',desc:'Выберите цену деления и совместите показания главной шкалы и нониуса.',spec:'0,1 / 0,05 / 0,02 мм',max:50,step:.05,value:23.45,vb:'0 0 800 255'},
 {id:'dialcal',name:'Штангенциркуль с круговой шкалой',kind:'ШТАНГЕНЦИРКУЛИ',desc:'Целые миллиметры по штанге, 50 делений циферблата по 0,02 мм.',spec:'0,02 мм',max:150,step:.02,value:37.68,vb:'0 0 800 255'},
 {id:'digital',name:'Цифровой штангенциркуль',kind:'ШТАНГЕНЦИРКУЛИ',desc:'Кнопка установки нуля, относительные измерения, перевод миллиметров в дюймы.',spec:'0,01 мм',max:150,step:.01,value:48.65,vb:'0 0 800 255'},
 {id:'depth',name:'Штангенглубиномер',kind:'ГЛУБИНА',desc:'Схематичный стержень с опорной площадкой и отсчётом глубины.',spec:'0,05 мм',max:150,step:.05,value:27.35,vb:'0 0 650 290'},
 {id:'ruler',name:'Миллиметровая линейка',kind:'ЛИНЕЙНЫЕ РАЗМЕРЫ',desc:'Передвижной указатель на виртуальной шкале. Не физическая линейка экрана.',spec:'1 мм',max:150,step:1,value:73,vb:'0 0 800 225'}
];
function template(def,index){
const id=def.id;
return '<section class="instrument-card embedded-meter" id="'+id+'" aria-labelledby="'+id+'Heading">'+
'<header><div><p class="measurement-index">'+(index+4)+' / '+def.kind+'</p><h2 id="'+id+'Heading">'+def.name+'</h2><p>'+def.desc+'</p></div><span class="measurement-spec">'+def.spec+'</span></header>'+
'<div class="instrument-svg-wrap"><svg id="'+id+'Svg" viewBox="'+def.vb+'" role="img" aria-label="Учебная шкала: '+def.name+'"></svg></div>'+
(id==='vernier'?'<div class="built-in-option"><label for="vernierStep">Цена деления нониуса</label><select id="vernierStep"><option value="0.1">0,1 мм (10 штрихов)</option><option value="0.05" selected>0,05 мм (20 штрихов)</option><option value="0.02">0,02 мм (50 штрихов)</option></select></div>':'')+
'<div class="instrument-fields"><div><label for="'+id+'Range">Передвинуть прибор, мм</label><input id="'+id+'Range" type="range" min="0" max="'+def.max+'" step="'+def.step+'" value="'+def.value+'"></div><div><label for="'+id+'Value">Положение, мм</label><input id="'+id+'Value" type="number" min="0" max="'+def.max+'" step="'+def.step+'" value="'+def.value+'" inputmode="decimal"></div></div>'+
(id==='digital'?'<div class="instrument-actions"><button id="digitalZero" type="button">Установить ноль</button><button id="digitalUnit" type="button">Единицы: мм</button><button id="digitalReset" type="button">Сбросить ноль</button></div>':'')+
'<output id="'+id+'Output" class="instrument-reading" aria-live="polite">—</output><p class="instrument-hint" id="'+id+'Details"></p>'+
'<div class="instrument-actions"><button id="'+id+'Random" type="button">Случайное положение</button><button id="'+id+'Reveal" type="button" aria-pressed="true">Скрыть ответ</button></div>'+
'<div class="instrument-practice"><label for="'+id+'Guess">Самопроверка: мой отсчёт</label><div><input type="text" inputmode="decimal" id="'+id+'Guess" autocomplete="off" placeholder="Например: 23,45"><button id="'+id+'Check" type="button">Проверить</button></div><p id="'+id+'Feedback" aria-live="polite"></p></div></section>';
}
root.innerHTML=defs.map(template).join('');
function mainScale(max,px,x0,y,tick=1,number=10){
let s='';
for(let i=0;i<=max;i+=tick){const x=x0+i*px;
s+=line(x,y,x,y+(i%number===0?25:i%(number/2)===0?17:9));
if(i%number===0)s+=label(x,y+39,i,'meter-small');
}return s;
}
function drawVernier(v,step){
 const x0=55,px=12.1,n=Math.round(1/step),jaw=x0+v*px;
 const camera=Math.max(0,jaw+n*px*.99-760);
 let s='<rect x="25" y="35" width="730" height="75" rx="8" class="instrument-fill"/>';
 s+='<g transform="translate('+(-camera)+' 0)">'+mainScale(50,px,x0,62,1,5);
 s+=line(x0,80,x0,212,'meter-axis')+line(jaw,91,jaw,215,'meter-pointer');
 s+='<rect x="'+jaw+'" y="113" width="'+(n*px+20)+'" height="76" rx="6" class="instrument-fill"/>';
 const k=Math.round((v-Math.floor(v+1e-9))/step);
 for(let i=0;i<=n;i++){
  const x=jaw+i*px*(n-1)/n;
  s+=line(x,122,x,i===k?174:i%5===0?153:143,i===k?'meter-pointer':'meter-tick');
  if(i%5===0)s+=label(x,180,i,'meter-small');
 }
 s+='</g>'+label(397,242,'Схематичная шкала; совпадение штриха отмечено линией','meter-label');
 return s;
}
function drawDial(v){
 const x0=48,p=3.1,jaw=x0+v*p;
 let s='<rect x="25" y="36" width="530" height="110" rx="9" class="instrument-fill"/>';
 s+=mainScale(150,p,x0,68,5,25)+line(x0,87,x0,196,'meter-axis')+
 line(jaw,87,jaw,193,'meter-pointer')+
 '<rect x="'+jaw+'" y="112" width="35" height="72" rx="5" class="instrument-fill"/>';
 const cx=663,cy=119,r=85,k=(Math.round(v/.02)%50);
 s+=circle(cx,cy,r);
 for(let i=0;i<50;i++){
  const a=-Math.PI/2+i*2*Math.PI/50;
  s+=line((cx+Math.cos(a)*(r-(i%5===0?15:6))).toFixed(1),(cy+Math.sin(a)*(r-(i%5===0?15:6))).toFixed(1),(cx+Math.cos(a)*r).toFixed(1),(cy+Math.sin(a)*r).toFixed(1));
  if(i%10===0)s+=label((cx+Math.cos(a)*50).toFixed(1),(cy+Math.sin(a)*50+5).toFixed(1),i,'meter-small');
 }
 const a=-Math.PI/2+k*2*Math.PI/50;
 s+=line(cx,cy,(cx+Math.cos(a)*67).toFixed(1),(cy+Math.sin(a)*67).toFixed(1),'meter-pointer')+label(cx,233,'0,02 мм / деление','meter-label');
 return s;
}
function drawDigital(v,zero,unit){
const x0=54,px=3.45,jaw=x0+v*px,read=(v-zero)/(unit==='in'?25.4:1);
let s='<rect x="23" y="50" width="597" height="78" rx="7" class="instrument-fill"/>'+
 mainScale(150,px,x0,67,5,25)+line(x0,102,x0,208,'meter-axis')+
 line(jaw,103,jaw,208,'meter-pointer')+
 '<rect x="'+jaw+'" y="113" width="43" height="91" rx="6" class="instrument-fill"/>';
 s+='<rect x="555" y="92" width="216" height="88" rx="9" class="instrument-fill"/>';
 s+=label(662,129,fmt(read,unit==='in'?4:2),'meter-center')+
 label(662,160,unit==='in'?'in':'мм','meter-small')+
 label(400,237,'Показания относительно выбранного нуля','meter-label');return s;
}
function drawDepth(v){
const x=219,start=47,p=1.24,y=start+v*p;
let s='<rect x="74" y="28" width="335" height="20" rx="7" class="instrument-fill"/>';
s+='<rect x="208" y="48" width="22" height="218" rx="5" class="instrument-fill"/>';
for(let i=0;i<=150;i+=5){
const yy=start+i*p;s+=line(232,yy,i%25===0?270:i%10===0?254:243,yy);
if(i%25===0)s+=label(297,yy+4,i,'meter-small');
}
s+=line(x,47,x,y,'meter-pointer')+
 '<rect x="190" y="'+(y-7)+'" width="59" height="15" rx="4" class="meter-moving"/>'+
 line(423,47,534,47,'meter-axis')+line(423,y,534,y,'meter-axis')+
 label(479,111,'ГЛУБИНА','meter-label')+label(479,146,fmt(v)+' мм','meter-center');
return s;
}
function drawRuler(v){
const x0=47,p=4.6;
let s='<rect x="29" y="66" width="729" height="112" rx="9" class="instrument-fill"/>';
for(let i=0;i<=150;i++){
 const x=x0+i*p;
 s+=line(x,66,x,66+(i%10===0?38:i%5===0?26:14));
 if(i%10===0)s+=label(x,133,i,'meter-small');
}
const at=x0+v*p;s+=line(at,32,at,185,'meter-pointer')+
 label(402,207,'Учебная шкала; не предназначена для измерения предметов на экране','meter-label');
return s;
}
for(const def of defs){
 const id=def.id,range=$(id+'Range'),field=$(id+'Value');
 let val=def.value,step=def.step,visible=true,zero=0,units='mm';
 const read=()=>id==='digital'?(val-zero)/(units==='in'?25.4:1):val;
 const digits=()=>id==='ruler'?0:id==='digital'&&units==='in'?4:2;
 function draw(){
  const svg=id==='vernier'?drawVernier(val,step):id==='dialcal'?drawDial(val):id==='digital'?drawDigital(val,zero,units):id==='depth'?drawDepth(val):drawRuler(val);
  $(id+'Svg').innerHTML=svg;
  $(id+'Output').textContent=visible?fmt(read(),digits())+(id==='digital'&&units==='in'?' in':' мм'):'Ответ скрыт';
  const whole=Math.floor(val+1e-8);
  const suffix=id==='vernier'?'Основная шкала: '+whole+' мм; деление №'+Math.round((val-whole)/step)+' × '+fmt(step)+' мм':
               id==='dialcal'?'Основная шкала: '+whole+' мм; циферблат №'+Math.round((val-whole)/.02)+' × 0,02 мм':
               id==='digital'?'Установленный ноль: '+fmt(zero)+' мм; положение: '+fmt(val)+' мм':
               id==='depth'?'Отсчёт глубины: '+fmt(val)+' мм; опора соответствует нулю.':
               'Положение указателя: '+fmt(val,0)+' мм.';
  $(id+'Details').textContent=visible?suffix:'Попробуйте определить значение без подсказки.';
 }
 function change(raw){
 const n=num(raw);if(!Number.isFinite(n))return;
 val=Math.round((Math.round(clamp(n,0,def.max)/step)*step)*100)/100;
 range.step=String(step);field.step=String(step);range.value=String(val);field.value=String(val);
 $(id+'Feedback').textContent='';draw();
 }
 range.addEventListener('input',()=>change(range.value));
 field.addEventListener('input',()=>{const n=num(field.value);if(Number.isFinite(n)&&n>=0&&n<=def.max)change(n);});
 field.addEventListener('change',()=>change(field.value||range.value));
 $(id+'Random').addEventListener('click',()=>change(Math.floor(Math.random()*(Math.round(def.max/step)+1))*step));
 $(id+'Reveal').addEventListener('click',()=>{
   visible=!visible;$(id+'Reveal').textContent=visible?'Скрыть ответ':'Показать ответ';
   $(id+'Reveal').setAttribute('aria-pressed',String(visible));draw();
 });
 $(id+'Check').addEventListener('click',()=>{
  const guess=num($(id+'Guess').value);
  if(!Number.isFinite(guess)){$(id+'Feedback').textContent='Введите числовой отсчёт.';return;}
  const tolerance=id==='digital'&&units==='in'?.00005:step/2+1e-9;
  $(id+'Feedback').textContent=Math.abs(guess-read())<=tolerance?'Верно. Отсчёт: '+fmt(read(),digits()):'Не совпало. Проверьте отсчёт по шкале или положение нуля.';
 });
 $(id+'Guess').addEventListener('keydown',e=>{if(e.key==='Enter')$(id+'Check').click();});
 if(id==='vernier')$('vernierStep').addEventListener('change',e=>{step=Number(e.target.value);change(val);});
 if(id==='digital'){
   $('digitalZero').addEventListener('click',()=>{zero=val;draw();});
   $('digitalUnit').addEventListener('click',()=>{units=units==='mm'?'in':'mm';$('digitalUnit').textContent='Единицы: '+(units==='mm'?'мм':'дюймы');draw();});
   $('digitalReset').addEventListener('click',()=>{zero=0;units='mm';$('digitalUnit').textContent='Единицы: мм';draw();});
 }
 change(def.value);
}
})();