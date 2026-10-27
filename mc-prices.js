/* Same-origin, dated supplier snapshots. No requests to MC from the visitor's browser. */
(function(){
'use strict';
const MAX_AGE=72*3600000;
function sourceURL(raw){
 const url=new URL(raw);
 if(!['http:','https:'].includes(url.protocol)||!['mc.ru','en.mc.ru'].includes(url.hostname)||!['','8080'].includes(url.port)||url.username||url.password||!/^\/prices\/[a-z]+\.zip$/.test(url.pathname))throw Error('Неверная ссылка на источник цен.');
 return url.href;
}
function ageCheck(date,now){const time=Date.parse(date);if(!Number.isFinite(time)||time>now+3600000||now-time>MAX_AGE)throw Error('Прайс старше 72 часов или имеет неверную дату. Автоподстановка остановлена.');}
function validate(data,now=Date.now()){
 if(!data||data.schemaVersion!==1||data.supplier!=='МЕТАЛЛСЕРВИС'||data.region!=='Москва — общий прайс'||data.vatIncluded!==true||!Array.isArray(data.documents)||data.documents.length!==4||!Array.isArray(data.items)||!data.items.length||data.items.length>20000)throw Error('Не удалось проверить структуру прайса.');
 sourceURL(data.sourceUrl);ageCheck(data.retrievedAt,now);
 const docs=new Map();
 for(const d of data.documents){if(typeof d.file!=='string'||docs.has(d.file)||typeof d.title!=='string'||!(d.minTonnes===null||typeof d.minTonnes==='number'&&Number.isFinite(d.minTonnes)&&d.minTonnes>=0))throw Error('Неверные условия прайса.');sourceURL(d.sourceUrl);ageCheck(d.publishedAt,now);docs.set(d.file,d);}
 const ids=new Set();
 for(const row of data.items){if(!row||typeof row.id!=='string'||ids.has(row.id)||!docs.has(row.document)||row.unit!=='т'||typeof row.priceRUBPerTonne!=='number'||!Number.isFinite(row.priceRUBPerTonne)||row.priceRUBPerTonne<=0||row.priceRUBPerTonne>=1e8||!['section','description','sizes'].every(k=>typeof row[k]==='string'&&row[k].length>0&&row[k].length<1000))throw Error('Неверные позиции прайса.');ids.add(row.id);}
 return data;
}
function guard(data,row,result,mass,now=Date.now()){
 if(!row||!data)throw Error('Выберите позицию из автоматически загруженного прайса mc.ru.');
 const doc=data.documents.find(d=>d.file===row.document);
 ageCheck(data.retrievedAt,now);ageCheck(doc.publishedAt,now);
 const tonnes=result.blanks*Number(mass)/1000;
 if(doc.minTonnes!==null&&tonnes<doc.minTonnes)throw Error('Эта цена mc.ru указана для объёма от '+doc.minTonnes+' т. Масса партии '+tonnes.toLocaleString('ru-RU',{maximumFractionDigits:4})+' т — условие цены не выполнено.');
 return row.priceRUBPerTonne;
}
const api={validate,guard};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof window==='undefined'||typeof document==='undefined')return;
window.MCPrices=api;
const mode=document.getElementById('mcPriceMode'),search=document.getElementById('mcPriceSearch'),group=document.getElementById('mcPriceGroup'),item=document.getElementById('mcPriceItem'),status=document.getElementById('mcPriceStatus'),details=document.getElementById('mcPriceDetails'),price=document.getElementById('manufacturingPrice'),link=document.getElementById('mcPriceSource');
if(!mode||!price)return;
let snapshot=null,selected=null;
const fmt=n=>n.toLocaleString('ru-RU',{maximumFractionDigits:2});
function clear(){selected=null;if(mode.value==='mc')price.value='';details.textContent='';document.getElementById('manufacturingResult').textContent='Выберите позицию прайса и выполните расчёт.';}
function render(){
 clear();item.replaceChildren(new Option('Выберите строку прайса…',''));
 if(!snapshot)return;
 const term=search.value.trim().toLocaleLowerCase('ru-RU');
 const rows=snapshot.items.filter(r=>(!group.value||r.document===group.value)&&[r.section,r.description,r.sizes].join(' ').toLocaleLowerCase('ru-RU').includes(term));
 for(const row of rows.slice(0,150)){const label=row.section+' · '+row.description+' · '+row.sizes+' · '+fmt(row.priceRUBPerTonne)+' ₽/т · строка '+row.sourceRow+'/'+row.sourceColumn;item.add(new Option(label,row.id));}
 status.textContent='Москва, общий прайс: '+snapshot.items.length+' ставок с НДС. Найдено '+rows.length+(rows.length>150?' — показаны первые 150, уточните поиск.':'. Выберите строку прайса.');
}
function changeMode(){
 clear();const auto=mode.value==='mc';price.readOnly=auto;search.disabled=!auto||!snapshot;group.disabled=!auto||!snapshot;item.disabled=!auto||!snapshot;
 if(!auto){price.value='';status.textContent='Собственная ставка. Она не относится к прайсу mc.ru.';link.hidden=true;}
 else{link.hidden=false;render();}
}
item.addEventListener('change',()=>{
 clear();selected=snapshot?.items.find(r=>r.id===item.value)||null;if(!selected)return;
 const doc=snapshot.documents.find(d=>d.file===selected.document);
 price.value=String(selected.priceRUBPerTonne);
 details.textContent=fmt(selected.priceRUBPerTonne)+' ₽/т с НДС. '+doc.title+'. Дата файла: '+new Date(doc.publishedAt).toLocaleString('ru-RU',{timeZone:'Europe/Moscow'})+' (Москва). '+(doc.minTonnes!==null?'Цена от '+doc.minTonnes+' т. ':'Порог объёма в файле не указан. ')+'Склад и полный типоразмер в этой строке не указаны. Ставка применяется к вашей массе; это не подтверждение наличия и условий поставки.';
 link.href=sourceURL(doc.sourceUrl);link.textContent='Оригинальный файл mc.ru ↗';
});
let timer;search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,120);});group.addEventListener('change',render);mode.addEventListener('change',changeMode);
api.beforeResult=(result,input)=>{if(mode.value==='mc'){const expected=guard(snapshot,selected,result,input.mass);if(Number(input.priceTonne)!==expected)throw Error('Цена не совпадает с выбранной строкой mc.ru. Выберите позицию заново.');}};
changeMode();status.textContent='Получаем автоматически обновляемый прайс mc.ru…';
const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
fetch('mc-prices.json',{cache:'no-cache',signal:controller.signal}).then(async response=>{if(!response.ok)throw Error('Прайс временно недоступен.');const text=await response.text();if(text.length>4000000)throw Error('Превышен размер прайса.');return validate(JSON.parse(text));}).then(data=>{
 snapshot=data;for(const d of data.documents)group.add(new Option(d.title,d.file));if(mode.value==='mc')changeMode();
}).catch(error=>{snapshot=null;if(mode.value==='mc'){price.value='';status.textContent='Автопрайс временно недоступен: '+(error.name==='AbortError'?'превышено время ожидания.':error.message)+' Сервер обновляет его по расписанию; загружать файл вручную не требуется.';}}).finally(()=>clearTimeout(timeout));
})();
