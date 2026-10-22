/* Browser downloads of offline combined atlas packages. No external service. */
(function(){
'use strict';
const core=window.AtlasAICore;
const panel=document.getElementById('atlasAiPackage');
if(!panel||!core)return;
const selector=panel.querySelector('#atlasAiSector');
const mode=panel.querySelector('#atlasAiScope');
const status=panel.querySelector('#atlasAiStatus');
const downloadMd=panel.querySelector('#atlasAiMd');
const downloadJson=panel.querySelector('#atlasAiJson');
const downloadJsonl=panel.querySelector('#atlasAiJsonl');
const downloadZip=panel.querySelector('#atlasAiZip');
const copy=panel.querySelector('#atlasAiCopy');
const buttons=[downloadMd,downloadJson,downloadJsonl,copy];
const filter=document.getElementById('processIndustry')||document.getElementById('materialIndustry');
for(const [id,name] of Object.entries(core.sectors))selector.add(new Option(name,id));
const materials=window.engineeringMaterials||[];
const processes=window.engineeringProcesses||[];
const validKey=v=>v==='all'||Object.prototype.hasOwnProperty.call(core.sectors,v);
function getBundle(){return core.build(materials,processes,selector.value,mode.value);}
function update(){
 const ready=validKey(selector.value)&&materials.length>0&&processes.length>0;
 buttons.forEach(b=>b.disabled=!ready);
 downloadZip.disabled=!(materials.length&&processes.length);
 if(!ready){status.textContent='Выберите отрасль или «Все отрасли», чтобы получить файлы.';return;}
 const b=getBundle();
 status.textContent=b.sector.name+': '+b.counts.processes+' процессов и '+b.counts.materials+' материалов; выгружаются все записи без ограничений фильтров.';
}
function save(text,file,contentType){
 const blob=text instanceof Blob?text:new Blob([text],{type:contentType});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=file;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}
function run(action){
 try{
  const b=getBundle(),name='enjigirling-atlas-'+b.sector.id+'-'+b.scope;
  const value=action==='md'?core.markdown(b):action==='json'?core.json(b):core.jsonl(b);
  const ext=action==='md'?'md':action==='json'?'json':'jsonl';
  save(value,name+'.'+ext,action==='md'?'text/markdown;charset=utf-8':'application/json;charset=utf-8');
  status.textContent='Сформирован '+name+'.'+ext+' ('+b.counts.total+' записей); источники и ограничения включены.';
 }catch(e){status.textContent='Ошибка выгрузки: '+e.message;}
}
selector.addEventListener('change',update);
mode.addEventListener('change',update);
if(filter){
 filter.addEventListener('change',()=>{
  if(validKey(filter.value)){selector.value=filter.value;update();}
 });
 if(validKey(filter.value)){selector.value=filter.value;}
}
downloadMd.addEventListener('click',()=>run('md'));
downloadJson.addEventListener('click',()=>run('json'));
downloadJsonl.addEventListener('click',()=>run('jsonl'));
downloadZip.addEventListener('click',()=>{
 try{
  status.textContent='Создаётся ZIP с 16 отраслевыми пакетами…';
  const pack=core.archive(materials,processes);
  save(pack.blob,'enjigirling-atlas-16-sectors.zip','application/zip');
  status.textContent='ZIP создан: '+pack.manifest.industries.length+' отраслей, '+pack.files+' файлов; также полные каталоги без дублей.';
 }catch(e){status.textContent='Ошибка архива: '+e.message;}
});
copy.addEventListener('click',async()=>{
 try{
  const b=getBundle(),content=core.markdown(b);
  if(!navigator.clipboard?.writeText)throw Error('Буфер обмена недоступен — скачайте Markdown.');
  await navigator.clipboard.writeText(content);
  status.textContent='Скопировано '+b.counts.total+' записей; при большом объёме удобнее прикреплять файл.';
 }catch(e){status.textContent='Не удалось скопировать: '+e.message;}
});
update();
})();