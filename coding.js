/* Standalone lightweight reader for 25 public coding reference links. */
(function(){
'use strict';
const root=document.getElementById('codingCatalog'),search=document.getElementById('codingSearch');
const clear=document.getElementById('codingClear'),status=document.getElementById('codingStatus');
const library=typeof codingResources!=='undefined'&&Array.isArray(codingResources)?codingResources:[];
const platforms=typeof codingPlatforms!=='undefined'&&Array.isArray(codingPlatforms)?codingPlatforms:[];
const list=[...library,...platforms.map(x=>({...x,topic:'Платформы разработки'}))];
if(!root||!search||!clear||!status)return;
const topics=['Python','Веб-разработка','Качество веба','Git и публикация','Тестирование и инфраструктура','Базы данных','Android','Безопасность','Платформы разработки'];
const normalized=v=>String(v||'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').trim();
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
const index=list.map(x=>({item:x,search:normalized([x.name,x.desc,x.topic,x.tags].join(' '))}));
function render(){
 const q=normalized(search.value),matches=index.filter(x=>x.search.includes(q)).map(x=>x.item),html=[];
 for(const topic of topics){
  const docs=matches.filter(x=>x.topic===topic);
  if(!docs.length)continue;
  const cards=docs.map(x=>{
   if(!/^https:\/\//i.test(x.link))return '';
   return '<a class="coding-card" href="'+esc(x.link)+'" target="_blank" rel="noopener noreferrer"><strong>'+esc(x.name)+'</strong><span>'+esc(x.desc)+'</span><small>'+esc(x.tags||'')+' · Открыть ↗</small></a>';
  }).join('');
  html.push('<details class="coding-topic" open><summary>'+esc(topic)+' · '+docs.length+'</summary><div class="coding-topic-list">'+cards+'</div></details>');
 }
 root.innerHTML=html.join('')||'<p>Ничего не найдено.</p>';
 root.dataset.ready='true';
 status.textContent='Показано '+matches.length+' из '+list.length;
}
search.addEventListener('input',render);
clear.addEventListener('click',()=>{search.value='';render();search.focus();});
render();
})();
