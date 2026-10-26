/* Original, zero-dependency calculators promoted from the atlas. */
(function(){
'use strict';
const field=(key,label,value,extra={})=>({key,label,value,...extra});
const definitions=[
 {id:'gsm',topic:'Плотность ткани GSM по образцу',fields:[field('mass','Масса образца, г',5),field('width','Ширина образца, см',10,{positive:true}),field('length','Длина образца, см',10,{positive:true})],formula:'GSM = масса, г × 10 000 / (ширина, см × длина, см).',note:'Образец без упаковки; результат — поверхностная плотность, а не объёмная плотность.',run:x=>({value:x.mass*10000/(x.width*x.length),unit:'г/м²'})},
 {id:'fabric-mass',topic:'Масса ткани по метражу',fields:[field('gsm','Поверхностная плотность, г/м²',200,{positive:true}),field('width','Ширина полотна, м',1.5,{positive:true}),field('length','Длина полотна, м',20)],formula:'m, кг = GSM × ширина, м × длина, м / 1000.',note:'Без массы втулки и упаковки. Ширину задавайте для всего взвешиваемого полотна.',run:x=>({value:x.gsm*x.width*x.length/1000,unit:'кг'})},
 {id:'tex',topic:'Линейная плотность нити tex',fields:[field('mass','Масса нити, г',2),field('length','Длина нити, м',100,{positive:true})],formula:'tex = масса, г × 1000 / длина, м.',note:'1 tex = 1 г/км. Взвешивайте саму нить без бобины.',run:x=>({value:x.mass*1000/x.length,unit:'tex'})},
 {id:'roll-length',topic:'Длина рулона по массе GSM',fields:[field('mass','Масса полотна без втулки, кг',6),field('gsm','Поверхностная плотность, г/м²',200,{positive:true}),field('width','Ширина полотна, м',1.5,{positive:true})],formula:'L, м = масса, кг × 1000 / (GSM × ширина, м).',note:'Оценка для постоянных ширины и поверхностной плотности; исключите упаковку и втулку.',run:x=>({value:x.mass*1000/(x.gsm*x.width),unit:'м'})},
 {id:'transfer',topic:'Время передачи файла',fields:[field('size','Размер файла, МиБ (1 МиБ = 1 048 576 байт)',100),field('rate','Скорость канала, Мбит/с',100,{positive:true}),field('efficiency','Доля скорости для полезных данных, %',100,{positive:true,max:100})],formula:'t, с = МиБ × 1 048 576 × 8 / (Мбит/с × 1 000 000 × доля/100).',note:'Постоянная полезная скорость. Не учитывает установку соединения, паузы и повторные передачи; 100% — идеальная граница.',run:x=>({value:x.size*1048576*8/(x.rate*1000000*x.efficiency/100),unit:'с'})},
 {id:'pcm',topic:'Размер PCM-аудио',fields:[field('rate','Частота дискретизации, Гц',44100,{positive:true,integer:true,max:1000000}),field('bits','Разрядность отсчёта, бит',16,{choices:[8,16,24,32]}),field('channels','Каналов',2,{positive:true,integer:true,max:64}),field('duration','Длительность, с',60)],formula:'Байты = ceil(частота × длительность) × разрядность/8 × число каналов.',note:'Несжатый PCM, без заголовка WAV и метаданных. Число отсчётов на канал округляется вверх до целого.',run:x=>({value:sampleCount(x.rate,x.duration)*x.bits/8*x.channels,unit:'байт'})},
 {id:'timber',topic:'Объём древесины в брусе',fields:[field('length','Длина одного бруса, м',6,{positive:true}),field('width','Ширина сечения, мм',100,{positive:true}),field('height','Высота сечения, мм',150,{positive:true}),field('quantity','Количество одинаковых брусьев, шт',10,{positive:true,integer:true,max:1000000})],formula:'V, м³ = длина, м × ширина, мм × высота, мм × количество / 1 000 000.',note:'Прямоугольное постоянное сечение. Без припусков, отходов, усушки и поправок на влажность.',run:x=>({value:x.length*x.width*x.height*x.quantity/1000000,unit:'м³'})},
 {id:'glue',topic:'Расход клея г/м²',fields:[field('area','Суммарная площадь нанесения всех слоёв, м²',10),field('rate','Норма расхода на слой, г/м²',150,{positive:true}),field('reserve','Дополнительный запас, %',10,{max:1000})],formula:'m, кг = площадь всех слоёв, м² × норма, г/м² × (1 + запас/100) / 1000.',note:'Норму берите из паспорта выбранного клея для вашего основания. При нанесении с двух сторон учитывайте обе площади.',run:x=>({value:x.area*x.rate*(1+x.reserve/100)/1000,unit:'кг'})}
];
// The extended models share this validation and rendering path.
if(typeof module!=='undefined'&&module.exports){
 require('./engineering-lab-core.js');
 const fs=require('node:fs'),vm=require('node:vm'),context={window:{}};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'calculator-atlas-data.js'),'utf8'),context);
 definitions.push(...require('./atlas-extended.js').build(context.window.calculatorAtlasGroups));
}else if(window.AtlasExtended){definitions.push(...window.AtlasExtended.build(window.calculatorAtlasGroups));}
function sampleCount(rate,duration){
 const [mantissa,exponent='0']=String(duration).split('e');
 const places=(mantissa.split('.')[1]||'').length-Number(exponent);
 const scale=10n**BigInt(Math.max(0,places));
 const numerator=BigInt(rate)*BigInt(mantissa.replace('.',''))*10n**BigInt(Math.max(0,-places));
 return Number((numerator+scale-1n)/scale);
}
function parse(raw,f){
 if(f.matrix){
  if(!Array.isArray(raw)&&String(raw??'').length>200000)throw Error('Матрица слишком велика.');
  const rows=Array.isArray(raw)?raw:String(raw??'').trim().split(/\n+/).filter(x=>x.trim());
  if(rows.length<2||rows.length>50)throw Error('Введите от 2 до 50 строк наблюдений.');
  const matrix=rows.map(row=>parse(row,{...f,matrix:false,list:true}));if(matrix.reduce((n,r)=>n+r.length,0)>10000)throw Error('Не более 10 000 элементов матрицы.');return matrix;
 }

 if(f.text){const text=String(raw??'').trim();if(typeof raw==='boolean'||text.length>256||!new RegExp(f.pattern).test(text))throw Error('Проверьте код: '+f.label);return text;}
 if(f.list){
  if(!Array.isArray(raw)&&String(raw??'').length>200000)throw Error('Список слишком велик.');
  const parts=Array.isArray(raw)?raw:String(raw??'').trim().split(/[;\n]+/).map(x=>x.trim()).filter(Boolean);
  if(!parts.length||parts.length>10000)throw Error('Введите от 1 до 10 000 значений через ; или с новой строки.');
  return parts.map(v=>parse(v,{...f,list:false}));
 }
 const text=String(raw??'').trim().replace(',','.');
 if(typeof raw==='boolean'||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text))throw Error('Проверьте поле «'+f.label+'».');
 const n=Number(text);
 if(!Number.isFinite(n)||n<(f.min??(f.signed?-1e12:0))||(f.positive&&n===0)||n>(f.max??1e12)||(f.integer&&!Number.isSafeInteger(n))||(f.choices&&!f.choices.includes(n)))throw Error('Недопустимое значение: «'+f.label+'».');
 return n;
}
function calculate(id,values){
 const definition=definitions.find(d=>d.id===id);if(!definition)throw Error('Неизвестный калькулятор.');
 const x=Object.fromEntries(definition.fields.map(f=>[f.key,parse(values[f.key],f)]));
 if(definition.validate)definition.validate(x);
 const result=definition.run(x);
 if(!Number.isFinite(result.value)||Math.abs(result.value)>Number.MAX_SAFE_INTEGER)throw Error('Результат вне поддерживаемого диапазона.');
 return result;
}
const baseGroups={gsm:'g2','fabric-mass':'g2',tex:'g2','roll-length':'g2',transfer:'g33',pcm:'g33',timber:'g34',glue:'g34'};for(const d of definitions)if(!d.group)d.group=baseGroups[d.id];
const api={definitions,calculate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof window!=='undefined')window.AtlasTools=api;
if(typeof document==='undefined')return;
const form=document.getElementById('atlasToolForm');if(!form)return;
const select=document.getElementById('atlasToolSelect'),fields=document.getElementById('atlasToolFields'),output=document.getElementById('atlasToolResult');
for(const d of definitions){const o=document.createElement('option');o.value=d.id;o.textContent=d.topic;select.append(o);}
function update(){form.querySelector('[data-atlas-plot]')?.remove();try{const raw=Object.fromEntries(Array.from(fields.querySelectorAll('input,select,textarea'),e=>[e.name,e.value]));const r=calculate(select.value,raw);output.textContent=new Intl.NumberFormat('ru-RU',{maximumSignificantDigits:10}).format(r.value)+' '+r.unit+(r.details?' · '+r.details.map(([label,value])=>label+': '+(typeof value==='number'?new Intl.NumberFormat('ru-RU',{maximumSignificantDigits:10}).format(value):String(value))).join(' · '):'');output.dataset.valid='true';if(r.plot)drawPlot(r.plot);}catch(error){output.textContent=error.message;output.dataset.valid='false';}}
function drawPlot(plot){
 const n=Math.min(plot.x.length,plot.y.length);if(!n)return;
 const x=plot.x.slice(0,Math.min(n,200)),y=plot.y.slice(0,Math.min(n,200));
 if(![...x,...y].every(Number.isFinite))return;
 const figure=document.createElement('figure');figure.dataset.atlasPlot='';figure.style.margin='16px 0';
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 640 280');svg.style.width='100%';svg.setAttribute('role','img');svg.setAttribute('aria-label','График: '+plot.xLabel+' / '+plot.yLabel);
 const el=(tag,attrs,text)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!=null)n.textContent=text;svg.append(n);return n;};
 const lowX=Math.min(...x),highX=Math.max(...x),lowY=Math.min(...y,...(plot.limits||[])),highY=Math.max(...y,...(plot.limits||[]));
 const px=v=>55+(v-lowX)/(highX-lowX||1)*560,py=v=>225-(v-lowY)/(highY-lowY||1)*195;
 el('path',{d:'M55 20 V225 H620',fill:'none',stroke:'currentColor'});
 for(const limit of plot.limits||[])el('path',{d:'M55 '+py(limit)+' H620',fill:'none',stroke:'currentColor','stroke-dasharray':'6 4',opacity:'.6'});
 el('polyline',{points:x.map((v,i)=>px(v)+','+py(y[i])).join(' '),fill:'none',stroke:'currentColor','stroke-width':'2'});
 if(x.length<=100)for(let i=0;i<x.length;i++)el('circle',{cx:px(x[i]),cy:py(y[i]),r:'3',fill:'currentColor'});
 const fmt=v=>new Intl.NumberFormat('ru-RU',{maximumSignificantDigits:4}).format(v);
 el('text',{x:'55',y:'247',fill:'currentColor','font-size':'12'},fmt(lowX));el('text',{x:'620',y:'247',fill:'currentColor','text-anchor':'end','font-size':'12'},fmt(highX));
 el('text',{x:'50',y:'30',fill:'currentColor','text-anchor':'end','font-size':'12'},fmt(highY));el('text',{x:'50',y:'225',fill:'currentColor','text-anchor':'end','font-size':'12'},fmt(lowY));
 el('text',{x:'330',y:'274',fill:'currentColor','text-anchor':'middle','font-size':'14'},plot.xLabel);
 const caption=document.createElement('figcaption');caption.className='calc-lab-note';caption.textContent=plot.yLabel+' по '+plot.xLabel+(n>200?'. Показаны первые 200 точек.':'');figure.append(svg,caption);form.append(figure);
}
function choose(){
 const d=definitions.find(d=>d.id===select.value);fields.replaceChildren();
 document.querySelector('#labAtlasTools > summary strong').textContent=d.topic;
 for(const f of d.fields){
  const wrap=document.createElement('div');wrap.className='calc-lab-field';
  const label=document.createElement('label');label.htmlFor='atlasInput-'+f.key;label.textContent=f.label;
  const input=document.createElement(f.choices?'select':f.list||f.matrix?'textarea':'input');input.id=label.htmlFor;input.name=f.key;
  if(f.choices)for(const v of f.choices){const o=document.createElement('option');o.value=v;o.textContent=v;input.append(o);}
  else if(f.list||f.matrix){input.rows=f.matrix?4:3;input.placeholder='Значения через ; или с новой строки';}else {input.type='text';input.inputMode=f.text?'text':f.integer?'numeric':'decimal';input.autocomplete='off';}
  input.value=String(f.value);wrap.append(label,input);fields.append(wrap);
 }
 document.getElementById('atlasToolFormula').textContent=d.formula;
 document.getElementById('atlasToolNote').textContent=d.note;
 update();
}
select.addEventListener('change',choose);form.addEventListener('input',event=>{if(event.target.closest('#atlasToolChooser'))return;if(definitions.find(d=>d.id===select.value)?.manual){form.querySelector('[data-atlas-plot]')?.remove();output.textContent='Данные изменены. Нажмите «Рассчитать».';output.dataset.valid='pending';}else update();});form.addEventListener('submit',e=>{e.preventDefault();update();});
const requested=new URLSearchParams(location.search).get('atlasTool');if(definitions.some(d=>d.id===requested))select.value=requested;
const search=document.getElementById('atlasToolSearch'),groupSelect=document.getElementById('atlasToolGroup');
if(search&&groupSelect){
 const all=document.createElement('option');all.value='';all.textContent='Все отрасли';groupSelect.append(all);
 for(const g of window.calculatorAtlasGroups){const option=document.createElement('option');option.value=g.id;option.textContent=g.title;groupSelect.append(option);}
 function filter(){
  const current=select.value,q=search.value.trim().toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
  const matches=definitions.filter(d=>(!groupSelect.value||d.group===groupSelect.value)&&d.topic.toLocaleLowerCase('ru-RU').replace(/ё/g,'е').includes(q));
  select.replaceChildren();for(const d of matches){const option=document.createElement('option');option.value=d.id;option.textContent=d.topic;select.append(option);}
  select.disabled=!matches.length;
  if(!matches.length){fields.replaceChildren();output.textContent='По запросу ничего не найдено.';output.dataset.valid='false';document.getElementById('atlasToolFormula').textContent='';document.getElementById('atlasToolNote').textContent='';form.querySelector('[data-atlas-plot]')?.remove();return;}
  if(matches.some(d=>d.id===current))select.value=current;choose();
 }
 search.addEventListener('input',filter);groupSelect.addEventListener('change',filter);
}
choose();
})();
