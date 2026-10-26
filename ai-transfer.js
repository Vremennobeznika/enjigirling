(function(){'use strict';const btn=document.getElementById('aiCopyPrompt'),t=document.getElementById('aiPrompt'),status=document.getElementById('aiCopyStatus');if(btn&&t)btn.addEventListener('click',async()=>{try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(t.value);else{t.select();if(!document.execCommand('copy'))throw Error('copy');}status.textContent='Скопировано';}catch{status.textContent='Выделите и скопируйте вручную';}});const section=new URLSearchParams(location.search).get('section');if(section&&/^[a-z]+$/.test(section)){const el=document.getElementById('pack-'+section);if(el){el.style.outline='2px solid var(--text-primary)';el.scrollIntoView({block:'nearest'});}}})();
(function(){
 'use strict';
 const button=document.getElementById('resourceCopyAiLinks');
 const status=document.getElementById('resourceCopyAiStatus');
 if(!button||!status)return;
 button.addEventListener('click',async()=>{
  button.disabled=true;
  try{
   const response=await fetch('knowledge/ai-code-library-links.txt');
   if(!response.ok)throw Error('Не удалось загрузить список ссылок.');
   const content=(await response.text()).trim();
   await navigator.clipboard.writeText(content);
   status.textContent='Все 25 ссылок скопированы.';
  }catch{status.textContent='Копирование недоступно. Скачайте TXT рядом.';}
  finally{button.disabled=false;}
 });
})();
