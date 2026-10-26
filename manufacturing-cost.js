/* Original manufacturing cost estimates. No uploaded files or external services. */
(function(){
'use strict';
const processes={fdm:'FDM-печать',sla:'SLA / печать смолой',sls:'SLS-печать',mjf:'MJF-печать',polyjet:'PolyJet',metal:'Металлическая 3D-печать',milling:'Фрезерование ЧПУ',turning:'Точение ЧПУ',routing:'Фрезерование листовых материалов',laser:'Лазерная резка',bending:'Гибка',molding:'Литьё под давлением'};
function number(value){if(typeof value==='boolean'||value==null||String(value).trim()==='')throw Error('Заполните все исходные значения.');const n=Number(String(value).trim().replace(',','.'));if(!Number.isFinite(n)||n<0||n>1e12)throw Error('Введите конечные неотрицательные числа в допустимых пределах.');return n;}
function estimate(input){
 const x=Object.fromEntries(Object.entries(input).map(([k,v])=>[k,number(v)]));
 const required=['quantity','mass','priceTonne','minutes','machineRate','laborMinutes','laborRate','setup','tooling','reject','overhead','markup'];
 if(required.some(k=>x[k]===undefined))throw Error('Не хватает исходных данных.');
 if(!Number.isSafeInteger(x.quantity)||x.quantity<1||x.quantity>1000000)throw Error('Размер партии: целое число от 1 до 1 000 000.');
 if(x.reject>=100)throw Error('Плановый брак должен быть меньше 100%.');
 if(x.priceTonne<=0)throw Error('Укажите цену материала за тонну.');
 const blanks=Math.ceil(x.quantity/(1-x.reject/100));
 if(blanks>10000000)throw Error('Слишком много заготовок; проверьте процент брака.');
 const material=blanks*x.mass*x.priceTonne/1000;
 const machine=blanks*x.minutes*x.machineRate/60;
 const labor=blanks*x.laborMinutes*x.laborRate/60;
 const direct=material+machine+labor+x.setup+x.tooling;
 const overhead=direct*x.overhead/100,cost=direct+overhead;
 const quote=cost*(1+x.markup/100);
 const result={blanks,material,machine,labor,setup:x.setup,tooling:x.tooling,overhead,cost,unitCost:cost/x.quantity,quote,unitQuote:quote/x.quantity};
 if(Object.values(result).some(v=>!Number.isFinite(v)||Math.abs(v)>1e15))throw Error('Результат слишком велик; проверьте единицы и значения.');
 return result;
}
function stockMass(shape,raw){
 const density=number(raw.density),length=number(raw.length)/1000;
 if(density<=0||length<=0)throw Error('Плотность и длина должны быть больше нуля.');
 let area;
 if(shape==='round'||shape==='tube'){
  const diameter=number(raw.diameter)/1000;
  if(diameter<=0)throw Error('Диаметр должен быть больше нуля.');
  let inner=0;
  if(shape==='tube'){const wall=number(raw.wall)/1000;if(wall<=0||2*wall>=diameter)throw Error('Стенка должна быть больше нуля и меньше половины диаметра.');inner=diameter-2*wall;}
  area=Math.PI*(diameter*diameter-inner*inner)/4;
 }else if(shape==='sheet'||shape==='rectTube'){
  const width=number(raw.width)/1000,height=number(raw.height)/1000;
  if(width<=0||height<=0)throw Error('Ширина и высота должны быть больше нуля.');
  area=width*height;
  if(shape==='rectTube'){const wall=number(raw.wall)/1000;if(wall<=0||2*wall>=Math.min(width,height))throw Error('Стенка должна быть меньше половины меньшего размера.');area-=(width-2*wall)*(height-2*wall);}
 }else throw Error('Неизвестная форма проката.');
 const mass=area*length*density;if(!Number.isFinite(mass)||mass<=0||mass>1e9)throw Error('Проверьте размеры заготовки.');return mass;
}
if(typeof module!=='undefined'&&module.exports)module.exports={estimate,stockMass,processes};
if(typeof document==='undefined')return;
const form=document.getElementById('manufacturingForm');if(!form)return;
const fmt=n=>n.toLocaleString('ru-RU',{maximumFractionDigits:2});
const process=document.getElementById('manufacturingProcess');
for(const [value,label] of Object.entries(processes)){const option=document.createElement('option');option.value=value;option.textContent=label;process.appendChild(option);}
function calculate(){
 const out=document.getElementById('manufacturingResult');
 try{
  const input=Object.fromEntries(Array.from(form.querySelectorAll('input[name]'),el=>[el.name,el.value]));const r=estimate(input);
  out.textContent=processes[process.value]+': '+fmt(r.unitCost)+' ₽/шт себестоимость; '+fmt(r.unitQuote)+' ₽/шт с наценкой. Партия: '+fmt(r.quote)+' ₽. План заготовок: '+r.blanks+'. Материал: '+fmt(r.material)+' ₽; станок: '+fmt(r.machine)+' ₽; труд: '+fmt(r.labor)+' ₽; подготовка: '+fmt(r.setup)+' ₽; оснастка: '+fmt(r.tooling)+' ₽; накладные: '+fmt(r.overhead)+' ₽.';
 }catch(e){out.textContent=e.message;}
}
form.addEventListener('submit',e=>{e.preventDefault();calculate();});
const stock=document.getElementById('manufacturingStockForm'),shape=document.getElementById('stockShape');
function fields(){for(const el of stock.querySelectorAll('[data-shapes]')){const enabled=el.dataset.shapes.split(' ').includes(shape.value);el.hidden=!enabled;for(const input of el.querySelectorAll('input'))input.disabled=!enabled;}}
shape.addEventListener('change',fields);fields();
stock.addEventListener('submit',e=>{e.preventDefault();try{const data=Object.fromEntries(Array.from(stock.querySelectorAll('input[name]:not(:disabled)'),el=>[el.name,el.value]));const mass=stockMass(shape.value,data);form.elements.mass.value=String(Number(mass.toPrecision(10)));document.getElementById('manufacturingStockResult').textContent='Теоретическая масса одной заготовки: '+fmt(mass)+' кг. Подставлена в расчёт стоимости.';calculate();}catch(error){document.getElementById('manufacturingStockResult').textContent=error.message;}});
})();
