#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const base='https://vremennobeznika.github.io/enjigirling/';
const sections=[
 ['professions','Профессии','index.html','knowledge/professions.json'],
 ['calendar','Календарь инженерных дат','calendar.html',null],
 ['resources','Инженерные ресурсы','resources.html',null],
 ['ai-code-library','Библиотека программирования для ИИ','resources.html',null],
 ['dictionary','Инженерный словарь','dictionary.html','knowledge/dictionary.json'],
 ['learning','Обучение','map.html',null],
 ['calculators','Инженерные калькуляторы','calculator.html',null],
 ['compare','Сравнение профессий','compare.html','knowledge/professions.json'],
 ['processes','Производственные процессы','processes.html','knowledge/processes.json'],
 ['materials','Инженерные материалы','materials.html','knowledge/materials.json']
];
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const decode=s=>String(s).replace(/&(?:amp|lt|gt|quot|apos|nbsp|#(?:x[0-9a-f]+|[0-9]+));/gi,m=>{
 const x=m.slice(1,-1).toLowerCase();
 if(x.startsWith('#')){let n=x[1]==='x'?parseInt(x.slice(2),16):parseInt(x.slice(1),10);return n>0&&n<=0x10ffff?String.fromCodePoint(n):m;}
 return {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[x]||m;
});
const inline=html=>decode(String(html).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim());
function humanMain(html){
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
 assert.ok(main,'page main landmark missing');
 let text=main[1].replace(/<(?:script|style|svg|template)\b[^>]*>[\s\S]*?<\/(?:script|style|svg|template)>/gi,'');
 text=text.replace(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,(_,href,inside)=>{
  if(!inline(inside))return '';
  const url=/^(?:https?:|mailto:)/i.test(href)||href.startsWith('#')?href:base+href;
  return '['+inline(inside)+']('+url+')';
 });
 text=text.replace(/<h([1-6])\b[^>]*>/gi,(_,n)=>'\n'+'#'.repeat(Math.min(Number(n)+1,6))+' ')
 .replace(/<li\b[^>]*>/gi,'\n- ')
 .replace(/<br\b[^>]*\/?>/gi,'\n')
 .replace(/<\/(?:h[1-6]|p|li|article|section|div|header|blockquote|details|summary|table|tr)>/gi,'\n')
 .replace(/<[^>]*>/g,' ');
 let lines=decode(text).split(/\r?\n/).map(s=>s.replace(/[ \t]+/g,' ').trim()).filter(Boolean);
 return lines.join('\n')+'\n';
}
function jsArray(file,variable){
 const ctx={window:{}};
 vm.runInNewContext(read(file)+';\nglobalThis.__aiExport='+variable,ctx,{timeout:5000,filename:file});
 const result=JSON.parse(JSON.stringify(ctx.__aiExport));
 assert.ok(Array.isArray(result)&&result.length,file+' did not produce records');
 return result;
}
const canonical={};
for(const [, , ,filename] of sections){
 if(filename&&!canonical[filename])canonical[filename]=JSON.parse(read(filename)).items;
}
function datasetFor(slug,dataset){
 if(slug==='learning'){
  const districts=jsArray('map-data.js','federalDistricts');
  return districts.flatMap(d=>[
   ...(d.universities||[]).map(item=>({...item,type:'university',district:d.name})),
   ...(d.colleges||[]).map(item=>({...item,type:'college',district:d.name}))
  ]);
 }
 if(slug==='calendar')return jsArray('calendar-data.js','window.engineeringCalendar.holidays');
 if(slug==='resources')return jsArray('resources-data.js','resources');
 if(slug==='ai-code-library')return jsArray('resources-data.js','resources').filter(x=>x.type==='Библиотека программирования для ИИ');
 if(slug==='calculators'){
  const topics=jsArray('calculator-atlas-data.js','window.calculatorAtlasGroups');
  return topics.map(({id,title,source,items})=>({id,title,source,ideasNotImplemented:items}));
 }
 return dataset?canonical[dataset]:[];
}
function markdownItems(slug,records){
 if(!records.length)return '';
 const title=slug==='calculators'?'Идеи будущих калькуляторов (не готовые инструменты)':'Полные записи справочника';
 let out='\n## '+title+' ('+records.length+' записей/групп)\n\n';
 for(const [i,record] of records.entries()){
  const item={...record};
  delete item.knowledgeMeta;
  const name=item.title||item.name||item.term||item.date||item.id||('Запись '+(i+1));
  out+='### '+inline(name)+'\n';
  for(const [key,value] of Object.entries(item)){
   if(value==null)continue;
   const v=typeof value==='string'?value:JSON.stringify(value);
   out+='- **'+key+':** '+String(v).replace(/[\r\n]+/g,' ').trim()+'\n';
  }
  out+='\n';
 }
 return out;
}
const json=s=>JSON.stringify(s,null,2)+'\n';
const outputs=new Map(),manifest=[];
for(const [slug,title,htmlPath,canonicalJson] of sections){
 const html=read(htmlPath);
 const records=datasetFor(slug,canonicalJson);
 const mdPath='knowledge/sections/'+slug+'.md',jsonPath='knowledge/sections/'+slug+'.json';
 const content='# ENJIGIRLING — '+title+'\n\n'
 +'**Исходная страница:** '+base+htmlPath+'\n\n'
 +'**Статус:** обзорные редакционные материалы; точность и актуальность технических утверждений не гарантированы. Если первичный источник не указан, считайте утверждение непроверенным. Не придумывайте стандарты, цифры и ссылки. Для инженерных решений сверяйтесь с действующими нормативами, методиками и паспортами.\n\n'
 +'**Что загружать в ИИ:** этот Markdown-файл или соответствующий JSON. Для вопросов о других разделах дополнительно используйте index.json и другие пакеты.\n\n'
 +'## Текст и описание раздела\n\n'+(slug==='ai-code-library'?'Это подборка ссылок на открытые учебные и справочные материалы по программированию. Пакет включает каталог и описания, но не полные тексты внешних источников.\n':humanMain(html))
 +markdownItems(slug,records)
 +'\n## Машиночитаемые исходники\n\n'
 +(canonicalJson?'- Стандартный JSON-справочник: '+base+canonicalJson+'\n':'')
 +'- Пакет JSON этого раздела: '+base+jsonPath+'\n'
 +'- Страница раздела: '+base+htmlPath+'\n';
 const payload={schemaVersion:'1.0',sectionId:slug,title,language:'ru',url:base+htmlPath,quality:'editorial_not_independently_verified',sourceHtml:htmlPath,canonicalDataset:canonicalJson||null,staticPageText:slug==='ai-code-library'?'Подборка ссылок и описаний, без полных текстов внешних учебников.':humanMain(html),recordsCount:records.length,records};
 outputs.set(mdPath,content);outputs.set(jsonPath,json(payload));
 manifest.push({id:slug,title,page:htmlPath,markdown:mdPath,json:jsonPath,canonicalDataset:canonicalJson||null,records:records.length});
}
outputs.set('knowledge/sections/index.json',json({schemaVersion:'1.0',quality:'editorial_not_independently_verified',howToUse:'Download a section Markdown or JSON and provide the file to a model; a bare URL may not be accessible to every model.',sections:manifest}));
const all='# ENJIGIRLING — полный контекст по разделам\n\nФайл большого объёма: для моделей с небольшим контекстом лучше загружать отдельные пакеты.\n\n'+sections.map(([slug])=>outputs.get('knowledge/sections/'+slug+'.md')).join('\n\n---\n\n');
outputs.set('knowledge/sections/all.md',all);
const check=process.argv.includes('--check');
let bad=0;
for(const [filename,content] of outputs){
 const dest=path.join(root,filename);
 if(check){
  if(!fs.existsSync(dest)||read(filename)!==content){console.error('STALE AI PACK '+filename);bad++;}
 }else{
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,content);
  console.log('GENERATED '+filename);
 }
}
if(bad)process.exitCode=1;
else console.log('AI packs: '+sections.length+' sections, '+outputs.size+' deterministic exports'+(check?', current':''));