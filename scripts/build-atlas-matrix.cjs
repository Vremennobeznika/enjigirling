#!/usr/bin/env node
/* Complete, reproducible accounting: never count an unimplemented topic as ready. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'calculator-atlas-data.js'),'utf8'),context);
const {definitions,calculate}=require('../atlas-tools.js');
const baseExpected={gsm:500,'fabric-mass':6,tex:20,'roll-length':20,transfer:8.388608,pcm:10584000,timber:.9,glue:1.65};
const byTopic=new Map(),referenceResults=new Map();
for(const d of definitions){
 if(byTopic.has(d.topic))throw Error('Duplicate implemented topic '+d.topic);
 const expected=d.expected??baseExpected[d.id];
 if(expected===undefined)throw Error('Missing independent reference answer for '+d.id);
 const result=calculate(d.id,Object.fromEntries(d.fields.map(f=>[f.key,f.value])));
 if(Math.abs(result.value-expected)>(d.tolerance??1e-8*Math.max(1,Math.abs(expected))))throw Error('Reference test failed for '+d.id);
 // Serialize 12 significant digits: V8 math differs in trailing bits across Node releases.
 // The full-precision result has already passed its reference tolerance above.
 referenceResults.set(d.topic,{actual:Number(result.value.toPrecision(12)),unit:result.unit,tolerance:d.tolerance??1e-8*Math.max(1,Math.abs(expected))});
 byTopic.set(d.topic,d);
}
const needsReference={
 'AQL — подбор объёма выборки':'Нужны применимая редакция стандарта, таблицы планов контроля и правила переключения; таблицы нельзя заменять приблизительной формулой.',
 'Посадка отверстие–вал H7/g6':'Нужна проверенная таблица ISO 286/ГОСТ для выбранного диапазона номинальных размеров.',
 'Жёсткость изгиба ткани':'Требуется выбранная методика испытания, геометрия образца и проверенные условия измерения.',
 'Условный балл пиллингуемости':'Оценка по эталонам и выбранному методу испытания, а не произвольная арифметическая шкала.',
 'Техническая карта запуска изделия':'Нужны маршрут изделия, операции и утверждённая структура карты; одной универсальной формулы нет.'
};
const matrix=context.window.calculatorAtlasGroups.flatMap(g=>g.items.map((topic,i)=>{
 const d=byTopic.get(topic);return {id:g.id+'-'+(i+1),group:g.id,groupTitle:g.title,topic,status:d?'implemented':needsReference[topic]?'needs_method':'planned',calculatorId:d?.id??null,href:d?'calculator.html?atlasTool='+d.id+'#labAtlasTools':null,formula:d?.formula??null,outputUnit:d?referenceResults.get(d.topic).unit:null,trigger:d?.manual?'submit':'live',inputs:d?.fields.map(f=>({key:f.key,label:f.label,example:f.value,positive:!!f.positive,integer:!!f.integer,signed:!!f.signed,list:!!f.list,matrix:!!f.matrix,text:!!f.text,pattern:f.pattern??null,min:f.min??null,max:f.max??null,choices:f.choices??null}))??[],limits:d?.note??needsReference[topic]??'Методика, реализация и проверки ещё не подготовлены.',reference:d?{expected:d.expected??baseExpected[d.id],...referenceResults.get(d.topic),status:'passed'}:null,researchSource:g.source};
}));
if(matrix.length!==734||new Set(matrix.map(x=>x.id)).size!==734)throw Error('Incomplete atlas matrix');
const stats={total:matrix.length,implemented:matrix.filter(x=>x.status==='implemented').length,needsMethod:matrix.filter(x=>x.status==='needs_method').length,planned:matrix.filter(x=>x.status==='planned').length};
const json=JSON.stringify({schemaVersion:1,stats,items:matrix},null,2)+'\n';
const quote=s=>'"'+String(s).replace(/"/g,'""')+'"';
const csv='\ufeff'+[['Отрасль','Калькулятор / тема','Статус','Каталог-источник'],...matrix.map(x=>[x.groupTitle,x.topic,x.href?'Работает; '+x.href:x.status==='needs_method'?'Требует методики; '+x.limits:'Идея; требует формулы и проверки',x.researchSource])].map(row=>row.map(quote).join(';')).join('\n')+'\n';
let bad=false;
for(const [file,data] of [['knowledge/atlas-implementation-matrix.json',json],['calculator-atlas.csv',csv]]){
 const dest=path.join(root,file);
 if(process.argv.includes('--check')){if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8')!==data){console.error('STALE '+file);bad=true;}}
 else {fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);}
}
console.log('ATLAS MATRIX: '+JSON.stringify(stats));if(bad)process.exitCode=1;
