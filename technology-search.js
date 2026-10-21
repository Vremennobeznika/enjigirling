/* Search both engineering catalogs without network requests or a separate backend. */
(function(){
'use strict';
const input=document.getElementById('technologySearch');
const results=document.getElementById('technologySearchResults');
const status=document.getElementById('technologySearchStatus');
if(!input||!results||!status)return;
const normalize=value=>String(value??'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
const types=[
 {name:'Процессы',records:window.engineeringProcesses||[],url:'processes.html#',details:x=>[x.category,x.description,x.steps,x.checks].join(' ')},
 {name:'Материалы',records:window.engineeringMaterials||[],url:'materials.html#',details:x=>[x.family,x.group,x.detail,x.uses,x.note].join(' ')}
];
const groups=types.map(type=>({
 name:type.name,
 records:type.records.map(x=>({id:x.id,title:String(x.name||''),url:type.url+encodeURIComponent(x.id),terms:normalize(x.name+' '+type.details(x))}))
}));
function render(){
 const query=normalize(input.value.trim());
 results.replaceChildren();
 if(query.length<2){status.textContent='Введите не менее двух символов.';results.hidden=true;return;}
 let found=0,shown=0;
 for(const group of groups){
  const matches=group.records.filter(x=>x.terms.includes(query));
  if(!matches.length)continue;
  found+=matches.length;
  matches.sort((a,b)=>Number(normalize(b.title).startsWith(query))-Number(normalize(a.title).startsWith(query)));
  const section=document.createElement('section');
  section.className='technology-search-group';
  const heading=document.createElement('h3');
  heading.textContent=group.name+' — '+matches.length;
  section.append(heading);
  const links=document.createElement('div');
  links.className='technology-search-links';
  for(const item of matches.slice(0,8)){
   const anchor=document.createElement('a');
   anchor.href=item.url;anchor.textContent=item.title;anchor.className='technology-search-result';
   links.append(anchor);
   shown++;
  }
  section.append(links);
  results.append(section);
 }
 status.textContent=found?'Найдено: '+found+'. Показано: '+shown+(found>shown?' (до восьми записей на раздел)':''):'Совпадений нет.';
 results.hidden=!found;
}
input.addEventListener('input',render);
input.addEventListener('keydown',event=>{
 if(event.key==='Escape'){input.value='';render();}
});
render();
})();
