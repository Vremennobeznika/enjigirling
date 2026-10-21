/* Dependency-free engineering math. No requests, no timers, no global listeners. */
(function(global){
'use strict';
const bytes=new ArrayBuffer(8), view=new DataView(bytes);
const formats={fp16:{bits:16,e:5,m:10,bias:15},bf16:{bits:16,e:8,m:7,bias:127},tf32:{bits:19,e:8,m:10,bias:127},fp32:{bits:32,e:8,m:23,bias:127},fp64:{bits:64,e:11,m:52,bias:1023}};
const power=(n,p)=>Math.pow(n,p);
function roundEven(x){
 const down=Math.floor(x),fraction=x-down;
 return fraction>.5||(fraction===.5&&down%2!==0)?down+1:down;
}
function smallEncode(x,fmt){
 const sign=x<0||Object.is(x,-0)?1:0, top=(1<<fmt.e)-1;
 const head=sign<<(fmt.e+fmt.m);
 if(Number.isNaN(x))return head|(top<<fmt.m)|(1<<(fmt.m-1));
 if(!Number.isFinite(x))return head|(top<<fmt.m);
 const a=Math.abs(x);
 if(a===0)return head;
 const min=power(2,1-fmt.bias);
 let e=Math.floor(Math.log2(a));
 if(e>fmt.bias)return head|(top<<fmt.m);
 if(a<min){
  const fraction=roundEven(a/power(2,1-fmt.bias-fmt.m));
  if(fraction>=1<<fmt.m)return head|(1<<fmt.m);
  return head|fraction;
 }
 let fraction=roundEven((a/power(2,e)-1)*power(2,fmt.m));
 if(fraction===power(2,fmt.m)){fraction=0;e++;}
 if(e+fmt.bias>=top)return head|(top<<fmt.m);
 return head|((e+fmt.bias)<<fmt.m)|fraction;
}
function smallDecode(word,fmt){
 const sign=(word>>(fmt.e+fmt.m))&1,raw=(word>>fmt.m)&((1<<fmt.e)-1),m=word&((1<<fmt.m)-1),max=(1<<fmt.e)-1;
 if(raw===max)return m?NaN:(sign?-Infinity:Infinity);
 if(raw===0)return (sign?-1:1)*m*power(2,1-fmt.bias-fmt.m);
 const n=(1+m/power(2,fmt.m))*power(2,raw-fmt.bias);
 return sign?-n:n;
}
function hexOfFloat(value,format){
 const fmt=formats[format];if(!fmt)throw Error('Неизвестный формат');
 if(fmt.bits<32)return smallEncode(value,fmt).toString(16).toUpperCase().padStart(Math.ceil(fmt.bits/4),'0');
 if(fmt.bits===32){view.setFloat32(0,value,false);return view.getUint32(0,false).toString(16).toUpperCase().padStart(8,'0');}
 view.setFloat64(0,value,false);
 return view.getUint32(0,false).toString(16).toUpperCase().padStart(8,'0')+view.getUint32(4,false).toString(16).toUpperCase().padStart(8,'0');
}
function classify(format,hex){
 const fmt=formats[format],bin=BigInt('0x'+hex).toString(2).padStart(fmt.bits,'0');
 const sign=bin[0],exp=bin.slice(1,1+fmt.e),mantissa=bin.slice(1+fmt.e);
 const biased=parseInt(exp,2),max=power(2,fmt.e)-1;
 let kind,stored;
 if(fmt.bits<32){stored=smallDecode(parseInt(hex,16),fmt);}
 else if(fmt.bits===32){view.setUint32(0,parseInt(hex,16),false);stored=view.getFloat32(0,false);}
 else {view.setUint32(0,parseInt(hex.slice(0,8),16),false);view.setUint32(4,parseInt(hex.slice(8),16),false);stored=view.getFloat64(0,false);}
 if(biased===max)kind=/1/.test(mantissa)?'NaN':'Бесконечность';
 else if(biased===0)kind=/1/.test(mantissa)?'Субнормальное':'Нуль';
 else kind='Нормальное';
 return {format,hex:'0x'+hex,bin,sign,exponent:exp,mantissa,biased,unbiased:biased===0?1-fmt.bias:biased-max===0?null:biased-fmt.bias,kind,stored,exponentBits:fmt.e,mantissaBits:fmt.m};
}
function decimalInput(s){
 let val=String(s).trim().replace(',','.');
 if(/^[+-]?inf(?:inity)?$/i.test(val))return val[0]==='-'?-Infinity:Infinity;
 if(/^nan$/i.test(val))return NaN;
 if(!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d{1,3})?$/i.test(val)||val.length>90)throw Error('Введите десятичное число, Infinity, -Infinity или NaN');
 const n=Number(val);if(Number.isNaN(n))throw Error('Некорректное число');
 return n;
}
function encode(format,input){const x=decimalInput(input);return {...classify(format,hexOfFloat(x,format)),source:input,error:Number.isFinite(x)?(classify(format,hexOfFloat(x,format)).stored-x):NaN};}
function decode(format,text,base){
 const f=formats[format];if(!f)throw Error('Неизвестный формат');
 const input=String(text).trim().replace(/[\s_]/g,'').replace(base==='hex'?/^0x/i:/^0b/i,'');
 let hex;
 if(base==='hex'){if(!/^[\da-f]+$/i.test(input)||input.length!==Math.ceil(f.bits/4))throw Error('Ожидается '+Math.ceil(f.bits/4)+' HEX-символов');hex=input.toUpperCase();}
 else {if(!/^[01]+$/.test(input)||input.length!==f.bits)throw Error('Ожидается '+f.bits+' битов');hex=BigInt('0b'+input).toString(16).toUpperCase().padStart(Math.ceil(f.bits/4),'0');}
 if(BigInt('0x'+hex)>=(1n<<BigInt(f.bits)))throw Error('Код не помещается в '+f.bits+' бит');
 return classify(format,hex);
}
function exactError(format,hex,raw){
 try{
  const parsed=String(raw).trim().replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(parsed))return '—';
  const eNum=Number(parsed.split(/e/i)[1]||0),body=parsed.split(/e/i)[0],isNeg=body[0]==='-';
  const digits=body.replace(/^[-+]/,'').replace('.','').replace(/^0+/,'')||'0';
  const decimalPlaces=(body.split('.')[1]||'').length;
  const tenPower=eNum-decimalPlaces;
  if(Math.abs(tenPower)>340||digits.length>90)return 'Вне диапазона точного сравнения';
  let n=BigInt(digits)*(isNeg?-1n:1n),den=1n;
  if(tenPower>=0)n*=10n**BigInt(tenPower);else den=10n**BigInt(-tenPower);
  const f=formats[format],b=BigInt('0x'+hex.replace(/^0x/i,'')),all=BigInt(f.bits),m=BigInt(f.m),e=BigInt(f.e);
  const sign=(b>>(all-1n))&1n;
  const rawExp=Number((b>>m)&((1n<<e)-1n));
  const mant=b&((1n<<m)-1n);
  if(rawExp===(1<<f.e)-1)return '—';
  const exp2=(rawExp===0?1-f.bias:rawExp-f.bias)-f.m;
  let stored=(rawExp===0?mant:mant+(1n<<m))*(sign===1n?-1n:1n),storedDen=1n;
  if(exp2>=0)stored*=1n<<BigInt(exp2);else storedDen=1n<<BigInt(-exp2);
  let diff=stored*den-n*storedDen,div=storedDen*den;
  if(diff===0n)return '0 (точно)';
  const negative=diff<0n;if(negative)diff=-diff;
  let power10=diff.toString().length-div.toString().length;
  let scale=power10>=0?div*10n**BigInt(power10):div;
  let numerator=power10>=0?diff:diff*10n**BigInt(-power10);
  if(numerator<scale){power10--;numerator*=10n;}
  const precision=15,scaled=numerator*10n**BigInt(precision-1)/scale;
  const str=scaled.toString().padStart(precision,'0');
  return (negative?'-':'+')+str[0]+'.'+str.slice(1).replace(/0+$/,'')+' × 10^'+power10;
 }catch{return '—';}
}
function number(text){const normalized=String(text).trim().replace(/\s/g,'').replace(',','.');return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)?Number(normalized):NaN;}
function ohm(mode,x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<=0)throw Error('Введите допустимые положительные значения');
 let u,i,r;
 if(mode==='ur'){u=x;r=y;i=u/r;}
 else if(mode==='ui'){u=x;i=y;r=u/i;}
 else if(mode==='ir'){i=x;r=y;u=i*r;}
 else throw Error('Неизвестный режим');
 if(![u,i,r,u*i].every(Number.isFinite))throw Error('Результат за пределами диапазона');
 return {u,i,r,p:u*i};
}
function divider(u,r1,r2){
 if(![u,r1,r2].every(Number.isFinite)||r1<=0||r2<=0)throw Error('Сопротивления должны быть положительными');
 return {v:u*r2/(r1+r2),i:u/(r1+r2),p1:power(u/(r1+r2),2)*r1,p2:power(u/(r1+r2),2)*r2};
}
function rc(r,cMicro){
 if(!Number.isFinite(r)||!Number.isFinite(cMicro)||r<=0||cMicro<=0)throw Error('R и C должны быть больше нуля');
 const tau=r*cMicro*1e-6;
 return {seconds:tau,frequency:1/(2*Math.PI*tau)};
}
function tolerance(raw){
 const text=String(raw).trim();if(text.length>3000)throw Error('Слишком много данных');
 const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 if(!lines.length||lines.length>25)throw Error('От 1 до 25 размеров');
 let nominal=0,worst=0,sumSquares=0;
 for(const [idx,line] of lines.entries()){
  const cells=line.split(/[;\t]/).map(x=>number(x));
  if(cells.length!==2||!cells.every(Number.isFinite)||cells[1]<0)throw Error('Строка '+(idx+1)+': формат номинал;±допуск');
  nominal+=cells[0];worst+=cells[1];sumSquares+=cells[1]**2;
 }
 return {nominal,worst,rss:Math.sqrt(sumSquares),count:lines.length};
}
function modbus(register1,register2,order){
 const valid=x=>/^(?:0x)?[0-9a-f]{1,4}$/i.test(String(x).trim());
 if(!valid(register1)||!valid(register2))throw Error('Введите два HEX-регистра 0000–FFFF');
 const a=parseInt(String(register1).replace(/^0x/i,''),16),b=parseInt(String(register2).replace(/^0x/i,''),16);
 const ordered=[a>>8,a&255,b>>8,b&255];
 const pos={ABCD:[0,1,2,3],BADC:[1,0,3,2],CDAB:[2,3,0,1],DCBA:[3,2,1,0]}[order];
 if(!pos)throw Error('Неизвестный порядок байтов');
 pos.forEach((p,i)=>view.setUint8(i,ordered[p]));
 return {value:view.getFloat32(0,false),hex:view.getUint32(0,false).toString(16).toUpperCase().padStart(8,'0')};
}

/* Production quantities are standalone dimensioned calculations, not plant norms. */
function finitePositive(n,label){if(!Number.isFinite(n)||n<=0)throw Error(label+' должно быть положительным числом');return n;}
function finiteNonnegative(n,label){if(!Number.isFinite(n)||n<0)throw Error(label+' должно быть неотрицательным числом');return n;}
function finish(values){if(!values.every(Number.isFinite))throw Error('Результат вне диапазона вычислений');}
function takt(availableMinutes,requiredPieces){
 finitePositive(availableMinutes,'Доступное время');
 finitePositive(requiredPieces,'Потребность в выпуске');
 const seconds=availableMinutes*60/requiredPieces;
 finish([seconds]);if(seconds<=0)throw Error('Недопустимое время такта');
 return {seconds,perHour:3600/seconds};
}
function oee(plannedMinutes,runMinutes,total,good,idealSeconds){
 finitePositive(plannedMinutes,'Плановый фонд');
 finitePositive(runMinutes,'Фактическая работа');
 finitePositive(total,'Количество изделий');
 finiteNonnegative(good,'Годные изделия');
 finitePositive(idealSeconds,'Идеальный цикл');
 if(runMinutes>plannedMinutes)throw Error('Время работы больше планового фонда');
 if(good>total)throw Error('Годных изделий не может быть больше всего выпущенных');
 const availability=runMinutes/plannedMinutes;
 const performance=idealSeconds*total/(runMinutes*60);
 const quality=good/total;
 finish([availability,performance,quality]);
 if(performance>1+1e-9)throw Error('Производительность выше 100%: проверьте идеальный цикл или данные о выпуске');
 return {availability,performance,quality,oee:availability*performance*quality};
}
function billetMass(densityKgM3,lengthMM,widthMM,heightMM){
 for(const [v,name] of [[densityKgM3,'Плотность'],[lengthMM,'Длина'],[widthMM,'Ширина'],[heightMM,'Толщина']])finitePositive(v,name);
 const cubicMeters=lengthMM*widthMM*heightMM*1e-9;
 const kilograms=cubicMeters*densityKgM3;
 finish([cubicMeters,kilograms]);
 return {cubicMeters,kilograms};
}
function thermalLength(lengthMM,alphaPPM,deltaC){
 finitePositive(lengthMM,'Исходная длина');
 if(!Number.isFinite(alphaPPM))throw Error('Коэффициент расширения должен быть числом');
 if(!Number.isFinite(deltaC))throw Error('Изменение температуры некорректно');
 const deltaMM=lengthMM*alphaPPM*1e-6*deltaC,finalMM=lengthMM+deltaMM;
 finish([deltaMM,finalMM]);
 if(finalMM<0)throw Error('Расчётная длина отрицательна — проверьте допущения');
 return {deltaMM,finalMM};
}
function cutSpeed(mode,diameterMM,quantity){
 finitePositive(diameterMM,'Диаметр');
 finitePositive(quantity,'Частота или скорость');
 const constant=Math.PI*diameterMM/1000;
 const mPerMin=mode==='rpm'?constant*quantity:mode==='speed'?quantity:NaN;
 const rpm=mode==='rpm'?quantity:mode==='speed'?quantity/constant:NaN;
 finish([mPerMin,rpm]);
 return {mPerMin,rpm};
}
function pipeFlow(diameterMM,speedMS){
 finitePositive(diameterMM,'Диаметр проходного сечения');
 finiteNonnegative(speedMS,'Скорость потока');
 const areaM2=Math.PI*(diameterMM/1000)**2/4;
 const m3Hour=areaM2*speedMS*3600;
 finish([areaM2,m3Hour]);
 return {m3Hour,litersMinute:m3Hour*1000/60};
}

global.EngineeringMath={formats,encode,decode,exactError,number,ohm,divider,rc,tolerance,modbus,takt,oee,billetMass,thermalLength,cutSpeed,pipeFlow};
})(typeof window!=='undefined'?window:globalThis);
