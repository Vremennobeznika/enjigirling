/* Offline-capable AI packages for the two engineering atlases. No API or tracking. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.AtlasAICore=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const sectors={
  metals:'Металлы и машиностроение',polymers:'Полимеры',food:'Пищевая промышленность',
  textiles:'Текстиль и швейное производство',wood:'Деревообработка',
  electronics:'Электроника',chemicals:'Химическое производство',
  general:'Межотраслевые процессы',composites:'Композиты',
  construction:'Строительство и дороги',energy:'Энергетика и теплообмен',
  water:'Водоподготовка и очистка',ceramics:'Керамика, цемент и стекло',
  pharma:'Фармацевтическое производство',printing:'Полиграфия',mining:'Горное производство'
 };
 const base='https://vremennobeznika.github.io/enjigirling/';
 const disclaimer='Это редакционные данные, НЕ сертификат, стандарт, технологическая инструкция или доказательство применимости к изделию. Наличие URL не означает, что вся запись проверена. Проверяйте точную марку, состояние, режимы и первичные документы.';
 const notice='Не выдумывай свойства и численные характеристики; различай источник найден, узкий проверенный тезис и непроверенный текст. Ссылайся на URL источников рядом с утверждениями, проверяй редакции стандартов.';
 const ordered=(rows)=>rows.slice().sort((a,b)=>a.name.localeCompare(b.name,'ru'));
 function ensureData(materials,processes){
  if(!Array.isArray(materials)||!Array.isArray(processes)||!materials.length||!processes.length)
   throw Error('Данные обоих справочников ещё не загрузились.');
  for(const rows of [materials,processes]){
   if(new Set(rows.map(x=>x.id)).size!==rows.length)throw Error('Найдены дублирующиеся идентификаторы.');
  }
  return {materials,processes};
 }
 function build(materials,processes,sector,scope='both'){
  ensureData(materials,processes);
  if(!(sector==='all'||Object.prototype.hasOwnProperty.call(sectors,sector)))
   throw Error('Выберите отрасль или явный вариант «Все отрасли».');
  if(!['both','materials','processes'].includes(scope))throw Error('Неверный состав пакета.');
  const selectedProcesses=scope==='materials'?[]:ordered(processes.filter(x=>sector==='all'||x.industry===sector));
  const selectedMaterials=scope==='processes'?[]:ordered(materials.filter(x=>sector==='all'||(x.industries||[]).includes(sector)));
  const uniqueMaterialIds=new Set(selectedMaterials.map(x=>x.id));
  const uniqueProcessIds=new Set(selectedProcesses.map(x=>x.id));
  if(uniqueMaterialIds.size!==selectedMaterials.length||uniqueProcessIds.size!==selectedProcesses.length)throw Error('Дубли в пакете.');
  if(sector!=='all'&&!selectedMaterials.length&&!selectedProcesses.length)throw Error('Отрасль не содержит записей.');
  return {
   schemaVersion:'2.0',dataset:'engineering-atlas',language:'ru',
   sector:{id:sector,name:sector==='all'?'Все отрасли':sectors[sector]},
   scope,source:base,quality:'editorial_not_independently_verified',
   notice:disclaimer,aiInstructions:notice,
   counts:{processes:selectedProcesses.length,materials:selectedMaterials.length,total:selectedProcesses.length+selectedMaterials.length},
   selectionRule:sector==='all'?'Уникальные записи без отраслевых дублей':'Процессы с основной отраслью и материалы, включающие выбранную отрасль; материалы могут входить в несколько отраслевых пакетов.',
   processes:selectedProcesses,materials:selectedMaterials
  };
 }
 function markdown(bundle){
  const mNames=new Map(bundle.materials.map(x=>[x.id,x.name]));
  const pNames=new Map(bundle.processes.map(x=>[x.id,x.name]));
  const lines=['# ENJIGIRLING — атлас для ИИ: '+bundle.sector.name,'',
   'Разделы: '+({both:'процессы и материалы',processes:'процессы',materials:'материалы'})[bundle.scope],
   'Процессов: '+bundle.counts.processes+'; материалов: '+bundle.counts.materials+'.',
   'Источник: '+bundle.source,'', '> '+bundle.notice,'','Инструкция модели: '+bundle.aiInstructions,'',
   'Принцип отбора: '+bundle.selectionRule,''];
  if(bundle.scope!=='materials'){
   lines.push('## Производственные процессы','');
   for(const x of bundle.processes){
    lines.push('### '+x.name+' ['+x.id+']','','Отрасль: '+(sectors[x.industry]||x.industry),
     'Класс операции: '+x.category,'','Описание: '+x.description,'',
     'Последовательность: '+x.steps,'','Контроль: '+x.checks,
     'Связанные материалы: '+((x.materials||[]).map(id=>mNames.get(id)||id).join(', ')||'Не определены'),
     'Профессия: '+(x.profession||'не указана'),
     ...(x.parentId?['Семейство: '+x.parentId]:[]),
     'Статус редакционной проверки: '+(x.evidence?.verificationStatus||x.reviewStatus||'ограниченный'),
     'Тезис: '+(x.evidence?.verifiedClaim||'не указан'),
     'Предел проверки: '+(x.evidence?.reviewScope||'не указан'),
     'Дата просмотра: '+(x.evidence?.checkedAt||'не указана'),
     'Ссылка на карточку: '+base+'processes.html#'+encodeURIComponent(x.id),
     'Источники:');
    for(const s of x.sources||[])lines.push('- '+s.title+' — '+s.url);
    lines.push('');
   }
  }
  if(bundle.scope!=='processes'){
   lines.push('## Инженерные материалы','');
   for(const x of bundle.materials){
    lines.push('### '+x.name+' ['+x.id+']','','Класс: '+x.family,
     'Отрасли: '+(x.industries||[]).map(k=>sectors[k]||k).join(', '),
     'Описание: '+x.detail,'','Применение: '+x.uses,'','Что уточнять: '+x.note,
     'Связанные процессы: '+((x.process||[]).map(id=>pNames.get(id)||id).join(', ')||'Без установленной связи'),
     'Статус редакционной проверки: '+(x.evidence?.verificationStatus||'не указан'),
     'Тезис: '+(x.evidence?.verifiedClaim||'не указан'),
     'Предел проверки: '+(x.evidence?.reviewScope||'не указан'),
     'Дата просмотра: '+(x.evidence?.checkedAt||'не указана'),
     'Ссылка на карточку: '+base+'materials.html#'+encodeURIComponent(x.id),
     'Источники:');
    for(const s of x.sources||[])lines.push('- '+s.title+' — '+s.url);
    lines.push('');
   }
  }
  return lines.join('\n').trim()+'\n';
 }
 function json(bundle){return JSON.stringify(bundle,null,2)+'\n';}
 function jsonl(bundle){
  const rows=[];
  for(const x of bundle.processes)rows.push(JSON.stringify({recordType:'process',sector:bundle.sector.id,recordUrl:base+'processes.html#'+encodeURIComponent(x.id),notice:bundle.notice,...x}));
  for(const x of bundle.materials)rows.push(JSON.stringify({recordType:'material',sector:bundle.sector.id,recordUrl:base+'materials.html#'+encodeURIComponent(x.id),notice:bundle.notice,...x}));
  return rows.join('\n')+(rows.length?'\n':'');
 }
 const utf8=text=>new TextEncoder().encode(String(text));
 function crc(bytes){
  let c=0xffffffff;
  for(const b of bytes){c^=b;for(let j=0;j<8;j++)c=(c&1)?(c>>>1)^0xedb88320:c>>>1;}
  return (c^0xffffffff)>>>0;
 }
 function zipFiles(files){
  // ZIP STORE: no compression, no dependencies, each member has a verified CRC32.
  const locals=[],centrals=[];let offset=0;
  function u16(v){return [v&255,(v>>>8)&255];}
  function u32(v){return [v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];}
  for(const file of files){
   const name=utf8(file.name),payload=utf8(file.text),checksum=crc(payload);
   if(name.length>65535||payload.length>0xffffffff)throw Error('Файл слишком велик для ZIP.');
   const local=Uint8Array.from([
    0x50,0x4b,0x03,0x04,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),
    ...u32(checksum),...u32(payload.length),...u32(payload.length),...u16(name.length),...u16(0),...name
   ]);
   const central=Uint8Array.from([
    0x50,0x4b,0x01,0x02,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),
    ...u32(checksum),...u32(payload.length),...u32(payload.length),...u16(name.length),
    ...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name
   ]);
   locals.push(local,payload);centrals.push(central);offset+=local.length+payload.length;
  }
  const centerSize=centrals.reduce((n,x)=>n+x.length,0);
  if(files.length>65535||offset>0xffffffff||centerSize>0xffffffff)throw Error('Архив слишком велик.');
  const end=Uint8Array.from([
   0x50,0x4b,0x05,0x06,...u16(0),...u16(0),...u16(files.length),...u16(files.length),
   ...u32(centerSize),...u32(offset),...u16(0)
  ]);
  return new Blob([...locals,...centrals,end],{type:'application/zip'});
 }
 function archive(materials,processes){
  const all=build(materials,processes,'all');
  const readme='# ENJIGIRLING — инструкция к выгрузке\n\n'+
   'Все файлы содержат редакционные сведения, а не технические разрешения.\n\n'+
   'Если нейросеть принимает ZIP — прикрепите этот архив. Иначе извлеките из папки sectors нужный *.md и прикрепите его.\n\n'+
   'all.md / all.json / all.jsonl: обе базы целиком без дубликатов.\n'+
   'sectors/<отрасль>.md и .json: полный отраслевой пакет с обоими каталогами.\n'+
   'Материал может законно повторяться в разных отраслях. Источники и ограничения включены.\n';
  const files=[{name:'README.md',text:readme},{name:'all.md',text:markdown(all)},
   {name:'all.json',text:json(all)},{name:'all.jsonl',text:jsonl(all)}];
  const manifest={schemaVersion:'2.0',total:all.counts,industries:[]};
  for(const id of Object.keys(sectors)){
   const b=build(materials,processes,id);
   files.push({name:'sectors/'+id+'.md',text:markdown(b)},{name:'sectors/'+id+'.json',text:json(b)});
   manifest.industries.push({id,name:sectors[id],...b.counts,markdown:'sectors/'+id+'.md',json:'sectors/'+id+'.json'});
  }
  files.push({name:'manifest.json',text:JSON.stringify(manifest,null,2)+'\n'});
  return {blob:zipFiles(files),files:files.length,manifest};
 }
 return {sectors,build,markdown,json,jsonl,zipFiles,archive,disclaimer};
});