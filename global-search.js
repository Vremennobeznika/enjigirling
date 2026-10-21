(function(){
'use strict';
const input=document.getElementById('globalSearch');
const results=document.getElementById('globalSearchResults');
const status=document.getElementById('globalSearchStatus');
if(!input||!results||!status)return;
const normalize=s=>String(s||'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
const items=[
 ...(window.professionsData||[]).map(x=>({type:'Профессия',title:x.title,detail:x.shortDesc,url:'index.html#profession='+encodeURIComponent(x.id)})),
 ...(window.engineeringMaterials||[]).map(x=>({type:'Материал',title:x.name,detail:x.family+' '+x.detail,url:'materials.html#'+encodeURIComponent(x.id)})),
 ...(window.engineeringProcesses||[]).map(x=>({type:'Процесс',title:x.name,detail:x.description,url:'processes.html#'+encodeURIComponent(x.id)})),
 ...(typeof dictionary!=='undefined'?dictionary:[]).map(x=>({type:'Термин',title:x.term,detail:x.def,url:'dictionary.html?q='+encodeURIComponent(x.term)}))
].map(item=>({...item,normalizedTitle:normalize(item.title),searchText:normalize(item.title+' '+item.detail)}));
const types=['Профессия','Материал','Процесс','Термин'];
function search(){
 const q=normalize(input.value.trim());results.replaceChildren();
 if(q.length<2){status.textContent='Введите минимум 2 символа.';results.hidden=true;return;}
 const groups=new Map(types.map(type=>[type,[]]));
 let total=0;
 for(const item of items){
  if(!item.searchText.includes(q))continue;
  total++;
  const group=groups.get(item.type);
  if(group.length<5)group.push(item);
  else if(item.normalizedTitle.startsWith(q)&&!group.every(x=>x.normalizedTitle.startsWith(q))){
   group.splice(group.findIndex(x=>!x.normalizedTitle.startsWith(q)),1,item);
  }
 }
 const matches=types.flatMap(type=>groups.get(type).sort((a,b)=>Number(b.normalizedTitle.startsWith(q))-Number(a.normalizedTitle.startsWith(q))));
 status.textContent=total?'Найдено: '+total+'. Показано: '+matches.length+(total>matches.length?' (не более пяти на категорию)':''):'Ничего не найдено.';
 results.hidden=false;
 for(const item of matches){
  const a=document.createElement('a');a.href=item.url;a.className='global-result';
  const kind=document.createElement('small');kind.textContent=item.type;
  const name=document.createElement('strong');name.textContent=item.title;
  const detail=document.createElement('span');detail.textContent=item.detail;
  a.append(kind,name,detail);results.append(a);
 }
}
input.addEventListener('input',search);
input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';search();}});
search();
})();