/* Lightweight catalogue: calculation engines load only after a tool is selected. */
(function(){
'use strict';
const input=document.getElementById('atlasQuery'),select=document.getElementById('atlasCategory'),result=document.getElementById('atlasResults'),count=document.getElementById('atlasCount');
const all=window.calculatorAtlasGroups;
if(!input||!select||!result||!count||!all)return;
const base={"Плотность ткани GSM по образцу":"gsm","Масса ткани по метражу":"fabric-mass","Линейная плотность нити tex":"tex","Длина рулона по массе GSM":"roll-length","Время передачи файла":"transfer","Размер PCM-аудио":"pcm","Объём древесины в брусе":"timber","Расход клея г/м²":"glue"};
const normalize=s=>s.toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
const groups=all.map(g=>({...g,entries:g.items.map((topic,i)=>({topic,id:base[topic]||g.id+'-'+(i+1),search:normalize(topic)}))}));
for(const g of groups){const o=document.createElement('option');o.value=g.id;o.textContent=g.title;select.append(o);}
const params=new URLSearchParams(location.search);
if(groups.some(g=>g.id===params.get('industry')))select.value=params.get('industry');
function refresh(){
 const q=normalize(input.value.trim()),category=select.value;
 result.replaceChildren();
 if(!q&&!category){count.textContent='734 расчёта в 34 отраслях. Введите название или выберите отрасль.';return;}
 const fragment=document.createDocumentFragment();let total=0,shown=0;
 for(const g of groups){
  if(category&&category!==g.id)continue;
  const entries=g.entries.filter(e=>!q||e.search.includes(q));total+=entries.length;
  if(!entries.length||shown>=80)continue;
  const section=document.createElement('section'),heading=document.createElement('h3'),list=document.createElement('ul');
  section.className='atlas-group';heading.className='atlas-group-head';heading.textContent=g.title;
  list.className='atlas-topic-list';
  for(const entry of entries){
   if(shown>=80)break;
   const li=document.createElement('li'),a=document.createElement('a');li.className='atlas-topic';a.className='atlas-ready-link';
   a.textContent=entry.topic;a.href='?atlasTool='+encodeURIComponent(entry.id)+'#labAtlasTools';
   a.addEventListener('click',e=>{
    if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();
    const panel=document.getElementById('labAtlasTools');
    history.replaceState(null,'',a.href);
    const picker=document.getElementById('atlasToolSelect');
    // A loaded form can be reused without reloading the page or the engine.
    if(window.AtlasTools&&picker){
     document.getElementById('atlasToolSearch').value='';
     const filter=document.getElementById('atlasToolGroup');filter.value='';filter.dispatchEvent(new Event('change'));
     picker.value=entry.id;picker.dispatchEvent(new Event('change'));
    }
    panel.open=true;panel.querySelector('summary').focus({preventScroll:true});panel.scrollIntoView({block:'start'});
   });
   li.append(a);list.append(li);shown++;
  }
  section.append(heading,list);fragment.append(section);
 }
 result.append(fragment);
 count.textContent=total?'Найдено: '+total+(shown<total?'. Показаны первые '+shown+'; уточните запрос.':'. Выберите расчёт.'):'Ничего не найдено. Измените запрос или выберите другую отрасль.';
}
let frame=0;input.addEventListener('input',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(refresh);});select.addEventListener('change',refresh);
refresh();
})();
