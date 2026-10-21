/* ENJIGIRLING calculator atlas — grouped backlog, not a library of executable calculators. */
(function(){
'use strict';
const input=document.getElementById('atlasQuery');
const select=document.getElementById('atlasCategory');
const result=document.getElementById('atlasResults');
const count=document.getElementById('atlasCount');
const copy=document.getElementById('atlasCopy');
const all=Array.isArray(window.calculatorAtlasGroups)?window.calculatorAtlasGroups:[];
if(!input||!select||!result||!count||!copy||!all.length)return;
const normalize=s=>String(s).toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
const groups=all.map(group=>({...group,entries:group.items.map(name=>({name,search:normalize(name)}))}));
const total=groups.reduce((sum,g)=>sum+g.items.length,0);
const existing=11;let matched=[];
const label=(tag,className,txt)=>{const n=document.createElement(tag);if(className)n.className=className;if(txt)n.textContent=txt;return n;};
for(const group of groups){const option=document.createElement('option');option.value=group.id;option.textContent=group.title+' ('+group.items.length+')';select.appendChild(option);}
function makeSection(group,entries,filtering){
 const details=document.createElement('details');details.className='atlas-group';details.id=group.id;
 const summary=label('summary','atlas-group-head',group.title+' — '+entries.length);
 details.append(summary);
 const content=label('div','atlas-group-body');
 const source=label('p','atlas-source','Источник для изучения формул: ');
 const a=document.createElement('a');a.href=group.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent=new URL(group.source).hostname;source.append(a);
 content.append(source);
 const list=document.createElement('ol');list.className='atlas-topic-list';
 const short=filtering&&entries.length>80?entries.slice(0,80):entries;
 for(const entry of short){const item=label('li','atlas-topic',entry.name);list.append(item);}
 content.append(list);
 if(short.length!==entries.length)content.append(label('p','atlas-more','Показаны первые 80 совпадений группы. Уточните запрос.'));
 details.append(content);
 if(filtering)details.open=true;
 return details;
}
function refresh(){
 const q=normalize(input.value.trim()),cat=select.value;
 matched=[];
 const fragment=document.createDocumentFragment();
 let visibleGroups=0;
 for(const group of groups){
  if(cat&&cat!==group.id)continue;
  const entries=q?group.entries.filter(x=>x.search.includes(q)):group.entries;
  if(!entries.length)continue;
  visibleGroups++;
  matched.push(...entries.map(x=>group.title+': '+x.name));
  if(q||cat){
   fragment.append(makeSection(group,entries,true));
  }else{
   // Only render child items on demand, not all 734 at startup.
   const details=document.createElement('details');details.className='atlas-group';details.id=group.id;
   details.append(label('summary','atlas-group-head',group.title+' — '+entries.length));
   details.addEventListener('toggle',()=>{
    if(details.open&&!details.querySelector('.atlas-group-body')){
     const rendered=makeSection(group,entries,false);
     details.append(rendered.querySelector('.atlas-group-body'));
    }
   },{once:false});
   fragment.append(details);
  }
 }
 result.replaceChildren(fragment);
 count.textContent='Найдено '+matched.length+' из '+total+' тем в '+visibleGroups+' группах. Готовые мастерские на основном сайте — '+existing+' точек входа.';
 copy.disabled=!matched.length;
}
let raf=0;
input.addEventListener('input',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(refresh);});
select.addEventListener('change',refresh);
copy.addEventListener('click',()=>{
 const str=matched.join('\n');
 if(navigator.clipboard&&window.isSecureContext){
  navigator.clipboard.writeText(str).then(()=>{copy.textContent='Скопировано';}).catch(()=>{copy.textContent='Не удалось скопировать';});
 }else{
  const box=document.createElement('textarea');box.value=str;document.body.append(box);box.select();
  try{document.execCommand('copy');copy.textContent='Скопировано';}catch{copy.textContent='Выделите вручную';}
  box.remove();
 }
});
const requested=location.hash.slice(1);
if(requested&&groups.some(x=>x.id===requested)){select.value=requested;}
refresh();
})();