/* Small UI initialized only when a calculator's <details> is opened. */
(function(){
'use strict';
const math=window.EngineeringMath;
if(!math)return;
const by=id=>document.getElementById(id);
const val=id=>by(id).value;
const numberFormatter=new Intl.NumberFormat('ru-RU',{maximumSignificantDigits:12});
const fmt=n=>Number.isFinite(n)?numberFormatter.format(n):String(n);
function message(node,text,error){node.textContent=text;node.classList.toggle('calc-lab-error',!!error);}
function later(fn){
 let pending=false;
 return ()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;fn();});};
}
function attach(ids,fn){
 const update=later(fn);
 ids.forEach(id=>{const el=by(id);el.addEventListener(el.tagName==='SELECT'?'change':'input',update);});
 fn();
}
function text(id,value){by(id).textContent=value;}
const copy=async(value,button)=>{
 try{
  if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);
  else{const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();if(!document.execCommand('copy'))throw Error('copy');ta.remove();}
  const before=button.textContent;button.textContent='Скопировано';setTimeout(()=>button.textContent=before,1200);
 }catch{button.textContent='Выделите значение вручную';}
};
function floatInit(){
 const format=by('ieeeFormat'),mode=by('ieeeMode'),input=by('ieeeInput'),bits=by('ieeeBits'),status=by('ieeeStatus');
 function render(){
  const f=format.value,src=input.value.trim();
  if(!src){message(status,'Введите значение');bits.replaceChildren();return;}
  try{
   const item=mode.value==='decimal'?math.encode(f,src):math.decode(f,src,mode.value);
   message(status,'Формат '+f.toUpperCase()+' · '+item.kind,false);
   text('ieeeStored',Object.is(item.stored,-0)?'-0':String(item.stored));
   text('ieeeHex',item.hex);
   text('ieeeBinary',item.bin);
   text('ieeeSign',item.sign==='1'?'1 (−)':'0 (+)');
   text('ieeeExponent',item.exponent+' (поле '+item.biased+', степень '+(item.unbiased===null?'—':item.unbiased)+')');
   text('ieeeMantissa',item.mantissa);
   text('ieeeError',mode.value==='decimal'?math.exactError(f,item.hex,src):'— (обратное преобразование)');
   const part=document.createDocumentFragment();
   for(let i=0;i<item.bin.length;i++){
    const kind=i===0?'Знак':i<=item.exponentBits?'Порядок':'Мантисса';
    const b=document.createElement('button');b.type='button';b.className='ieee-bit ieee-bit-'+(i===0?'sign':i<=item.exponentBits?'exponent':'fraction');
    b.textContent=item.bin[i];b.title=kind+' — бит '+i+' (нажмите для инверсии)';
    b.setAttribute('aria-label',kind+', бит '+i+', значение '+item.bin[i]+'. Изменить');
    b.dataset.index=String(i);part.appendChild(b);
   }
   bits.replaceChildren(part);
  }catch(error){
   message(status,error.message,true);bits.replaceChildren();
   for(const id of ['ieeeStored','ieeeHex','ieeeBinary','ieeeSign','ieeeExponent','ieeeMantissa','ieeeError'])text(id,'—');
  }
 }
 attach(['ieeeFormat','ieeeMode','ieeeInput'],render);
 bits.addEventListener('click',e=>{
  const b=e.target.closest('button[data-index]');if(!b)return;
  const current=by('ieeeBinary').textContent;
  if(!/^[01]+$/.test(current))return;
  const i=Number(b.dataset.index);
  input.value=current.slice(0,i)+(current[i]==='0'?'1':'0')+current.slice(i+1);
  mode.value='binary';render();
 });
 by('ieeeExamples').addEventListener('click',e=>{
  const btn=e.target.closest('button[data-example]');if(!btn)return;
  mode.value='decimal';input.value=btn.dataset.example;render();
 });
 by('ieeeCopyHex').addEventListener('click',e=>copy(by('ieeeHex').textContent,e.currentTarget));
 by('ieeeCopyBits').addEventListener('click',e=>copy(by('ieeeBinary').textContent,e.currentTarget));
}
function extraInit(){
 const status=(id,fn)=>{try{message(by(id),fn(),false);}catch(e){message(by(id),e.message,true);}};
 attach(['ohmMode','ohmA','ohmB'],()=>{
  const mode=val('ohmMode');
  const labels={ur:['Напряжение U (В)','Сопротивление R (Ом)'],ui:['Напряжение U (В)','Ток I (А)'],ir:['Ток I (А)','Сопротивление R (Ом)']}[mode];
  by('ohmALabel').textContent=labels[0];by('ohmBLabel').textContent=labels[1];
  status('ohmOutput',()=>{
   const a=math.number(val('ohmA')),b=math.number(val('ohmB'));const x=math.ohm(mode,a,b);
   return 'U = '+fmt(x.u)+' В · I = '+fmt(x.i)+' А · R = '+fmt(x.r)+' Ом · P = '+fmt(x.p)+' Вт';
  });
 });
 attach(['dividerU','dividerR1','dividerR2'],()=>status('dividerOutput',()=>{
  const x=math.divider(...['dividerU','dividerR1','dividerR2'].map(k=>math.number(val(k))));
  return 'Uвых = '+fmt(x.v)+' В · Ток = '+fmt(x.i)+' А · P1 = '+fmt(x.p1)+' Вт · P2 = '+fmt(x.p2)+' Вт';
 }));
 attach(['rcR','rcC'],()=>status('rcOutput',()=>{
  const x=math.rc(math.number(val('rcR')),math.number(val('rcC')));
  return 'τ = '+fmt(x.seconds*1000)+' мс · fср = '+fmt(x.frequency)+' Гц · 5τ = '+fmt(x.seconds*5000)+' мс';
 }));
 attach(['toleranceRows'],()=>status('toleranceOutput',()=>{
  const x=math.tolerance(val('toleranceRows'));
  return 'Номинал = '+fmt(x.nominal)+' · предельный допуск ±'+fmt(x.worst)+' · RSS ±'+fmt(x.rss)+' (те же единицы)';
 }));
 attach(['modbusFirst','modbusSecond','modbusOrder'],()=>status('modbusOutput',()=>{
  const x=math.modbus(val('modbusFirst'),val('modbusSecond'),val('modbusOrder'));
  return 'Float32 = '+(Object.is(x.value,-0)?'-0':String(x.value))+' · Биты = 0x'+x.hex;
 }));
}

function productionInit(){
 const status=(id,fn)=>{try{message(by(id),fn(),false);}catch(e){message(by(id),e.message,true);}};
 attach(['taktAvailable','taktDemand'],()=>status('taktOutput',()=>{
  const x=math.takt(math.number(val('taktAvailable')),math.number(val('taktDemand')));
  return 'Расчётный такт '+fmt(x.seconds)+' с/шт · темп '+fmt(x.perHour)+' шт/ч';
 }));
 attach(['oeePlan','oeeRun','oeeTotal','oeeGood','oeeIdeal'],()=>status('oeeOutput',()=>{
  const x=math.oee(...['oeePlan','oeeRun','oeeTotal','oeeGood','oeeIdeal'].map(id=>math.number(val(id))));
  const pct=n=>fmt(n*100)+' %';
  return 'OEE '+pct(x.oee)+' · доступность '+pct(x.availability)+' · производительность '+pct(x.performance)+' · качество '+pct(x.quality);
 }));
 attach(['massDensity','massLength','massWidth','massHeight'],()=>status('massOutput',()=>{
  const x=math.billetMass(...['massDensity','massLength','massWidth','massHeight'].map(id=>math.number(val(id))));
  return 'Расчётная масса '+fmt(x.kilograms)+' кг · объём '+fmt(x.cubicMeters)+' м³';
 }));
 attach(['thermalLength','thermalAlpha','thermalDelta'],()=>status('thermalOutput',()=>{
  const x=math.thermalLength(...['thermalLength','thermalAlpha','thermalDelta'].map(id=>math.number(val(id))));
  return 'Изменение длины '+fmt(x.deltaMM)+' мм · итоговая длина '+fmt(x.finalMM)+' мм';
 }));
 attach(['cutMode','cutDiameter','cutQuantity'],()=>{
  const mode=val('cutMode');
  by('cutQuantityLabel').textContent=mode==='rpm'?'Частота, об/мин':'Скорость резания, м/мин';
  status('cutOutput',()=>{
   const x=math.cutSpeed(mode,math.number(val('cutDiameter')),math.number(val('cutQuantity')));
   return 'Скорость '+fmt(x.mPerMin)+' м/мин · вращение '+fmt(x.rpm)+' об/мин';
  });
 });
 attach(['flowDiameter','flowSpeed'],()=>status('flowOutput',()=>{
  const x=math.pipeFlow(math.number(val('flowDiameter')),math.number(val('flowSpeed')));
  return 'Расход '+fmt(x.m3Hour)+' м³/ч · '+fmt(x.litersMinute)+' л/мин';
 }));
}


function sewingInit(){
 const status=(id,fn)=>{try{message(by(id),fn(),false);}catch(error){message(by(id),error.message,true);}};
 attach(['markerArea','markerLength','markerWidth'],()=>status('markerOutput',()=>{
  const x=math.markerEfficiency(...['markerArea','markerLength','markerWidth'].map(id=>math.number(val(id))));
  return 'КПД '+fmt(x.percent)+' % · межлекальные отходы '+fmt(x.wastePercent)+' % ('+fmt(x.wasteM2)+' м²)';
 }));
 attach(['fabricLength','fabricPieces','fabricAllowance','fabricOrder'],()=>status('fabricOutput',()=>{
  const x=math.fabricBooking(...['fabricLength','fabricPieces','fabricAllowance','fabricOrder'].map(id=>math.number(val(id))));
  return 'На изделие '+fmt(x.perPiece)+' м · на заказ '+fmt(x.totalM)+' м';
 }));
 attach(['threadSeam','threadRatio','threadLoss','threadOrder'],()=>status('threadOutput',()=>{
  const x=math.threadBooking(...['threadSeam','threadRatio','threadLoss','threadOrder'].map(id=>math.number(val(id))));
  return 'На изделие '+fmt(x.perPieceM)+' м · на партию '+fmt(x.totalM)+' м';
 }));
 attach(['lineGood','lineSmv','lineStaff','lineMinutes'],()=>status('lineOutput',()=>{
  const x=math.sewingEfficiency(...['lineGood','lineSmv','lineStaff','lineMinutes'].map(id=>math.number(val(id))));
  return 'Эффективность '+fmt(x.percent)+' % · выработано '+fmt(x.earnedMin)+' нормо-мин · доступно '+fmt(x.availableMin)+' чел·мин';
 }));
}
function marineInit(){
 const status=(id,fn)=>{try{message(by(id),fn(),false);}catch(error){message(by(id),error.message,true);}};
 attach(['passageNm','passageKn'],()=>status('passageOutput',()=>{
  const x=math.marinePassage(math.number(val('passageNm')),math.number(val('passageKn')));
  return 'В пути '+fmt(x.hours)+' ч ('+fmt(x.minutes)+' мин) · '+fmt(x.distanceKm)+' км · скорость '+fmt(x.speedKmh)+' км/ч';
 }));
 attach(['fuelNm','fuelKn','fuelRate','fuelMargin'],()=>status('fuelOutput',()=>{
  const x=math.marineFuel(...['fuelNm','fuelKn','fuelRate','fuelMargin'].map(id=>math.number(val(id))));
  return 'На переход '+fmt(x.usedL)+' л · добавлено '+fmt(x.extraL)+' л · всего '+fmt(x.totalL)+' л';
 }));
 attach(['hullLwl'],()=>status('hullOutput',()=>{
  const x=math.hullSpeed(math.number(val('hullLwl')));
  return 'Эмпирический ориентир '+fmt(x.knots)+' уз · '+fmt(x.kilometresHour)+' км/ч';
 }));
 attach(['draftMass','draftArea','draftDensity'],()=>status('draftOutput',()=>{
  const x=math.draftByTPC(...['draftMass','draftArea','draftDensity'].map(id=>math.number(val(id))));
  return 'TPC '+fmt(x.tpc)+' т/см · изменение средней осадки '+fmt(x.deltaCm)+' см ('+fmt(x.deltaM)+' м)';
 }));
}


function moreSewingInit(){
 const safe=(id,fn)=>{try{message(by(id),fn(),false);}catch(e){message(by(id),e.message,true);}};
 attach(['shrinkBefore','shrinkAfter'],()=>safe('shrinkOutput',()=>{const x=math.shrinkage(math.number(val('shrinkBefore')),math.number(val('shrinkAfter')));return 'Усадка '+fmt(x.percent)+' % · изменение '+fmt(x.change)+' см';}));
 attach(['layPieces','layPlies','layLength','layAllowance'],()=>safe('layOutput',()=>{const x=math.layLength(...['layPieces','layPlies','layLength','layAllowance'].map(id=>math.number(val(id))));return 'Изделий '+fmt(x.output)+' · материал '+fmt(x.consumption)+' м · на изделие '+fmt(x.perPiece)+' м';}));
 attach(['balanceOps','balanceTakt'],()=>safe('balanceOutput',()=>{const x=math.lineBalance(val('balanceOps'),math.number(val('balanceTakt')));return 'Всего '+fmt(x.sum)+' с · минимум постов '+x.theoretical+' · самая длинная операция '+fmt(x.bottleneck)+' с · '+(x.withinTakt?'все операции укладываются в такт':'есть операция длиннее такта');}));
}
function moreMarineInit(){
 const safe=(id,fn)=>{try{message(by(id),fn(),false);}catch(e){message(by(id),e.message,true);}};
 attach(['dispLength','dispBeam','dispDraft','dispCb','dispDensity'],()=>safe('dispOutput',()=>{const x=math.displacement(...['dispLength','dispBeam','dispDraft','dispCb','dispDensity'].map(id=>math.number(val(id))));return 'Объём '+fmt(x.volume)+' м³ · водоизмещение '+fmt(x.tonnes)+' т';}));
 attach(['currentShip','currentCourse','currentKnots','currentDir'],()=>safe('currentOutput',()=>{const x=math.currentVector(...['currentShip','currentCourse','currentKnots','currentDir'].map(id=>math.number(val(id))));return 'Скорость по грунту '+fmt(x.sog)+' уз · курс относительно грунта '+(x.cog===null?'не определяется (судно не перемещается)':fmt(x.cog)+'°');}));
}
const initialized=new Set();
window.initEngineeringLab=function(which){
 if(initialized.has(which))return;
 if(which==='ieee')floatInit();
 if(which==='extra')extraInit();
 if(which==='production')productionInit();
 if(which==='sewing')sewingInit();
 if(which==='marine')marineInit();
 if(which==='moreSewing')moreSewingInit();
 if(which==='moreMarine')moreMarineInit();

 initialized.add(which);
};
})();