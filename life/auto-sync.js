/* Shared opt-in synchronization for the personal pages.
 * Never sync without a key explicitly stored by the owner.
 * Server uses compare-and-swap revision; local snapshots use three-way merging.
 */
(()=>{
"use strict";
const DATA_KEYS={calendar:"week-check-v2",shopping:"supermarket-shopping-list-v1",tasks:"life-inbox-v1",pantry:"life-pantry-v1",plants:"life-plants-v1"};
const SECTIONS=Object.keys(DATA_KEYS);
const SECRET_KEY="life-sync-secret-saved-v1",URL_KEY="life-sync-endpoint-v1",AUTO_KEY="life-sync-auto-v1",BASE_KEY="life-sync-state-v2",BACKUPS_KEY="life-sync-recovery-v1";
const DEFAULT_ENDPOINT="https://functions.yandexcloud.net/d4ed26vrlmb1uk22m3b7";
const EMPTY={calendar:{},shopping:[],tasks:[],pantry:[],plants:[]};
let processing=false,again=false,applying=false,timer=null,conflict=false,lastMessage="";
const RETRY_KEY="life-sync-retry-v1";
function retryInfo(){try{const v=JSON.parse(sessionStorage.getItem(RETRY_KEY)||"null");return v&&Number.isFinite(v.until)&&Number.isInteger(v.errors)?v:{until:0,errors:0}}catch{return {until:0,errors:0}}}
function clearRetry(){try{sessionStorage.removeItem(RETRY_KEY)}catch{}}
function recordFailure(){
 const old=retryInfo(),errors=Math.min(old.errors+1,6);
 const pause=Math.min(600000,60000*Math.pow(2,errors-1)),until=Date.now()+pause;
 try{sessionStorage.setItem(RETRY_KEY,JSON.stringify({errors,until}))}catch{}
 return Math.ceil(pause/60000);
}


const parse=(s,fallback)=>{try{return JSON.parse(s)??fallback}catch{return fallback}};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const readData=()=>Object.fromEntries(SECTIONS.map(section=>{
 const fallback=EMPTY[section],value=parse(localStorage.getItem(DATA_KEYS[section]),fallback);
 return [section,section==="calendar"&&value&&!Array.isArray(value)&&typeof value==="object"?value:Array.isArray(fallback)&&Array.isArray(value)?value:fallback];
}));
function validateData(data){
 if(!data||typeof data!=="object"||Array.isArray(data)||!data.calendar||typeof data.calendar!=="object"||Array.isArray(data.calendar))throw Error("Некорректный формат календаря");
 for(const section of SECTIONS.slice(1))if(!Array.isArray(data[section]))throw Error("Некорректный раздел: "+section);
 return data;
}
function isEmpty(data){
 return SECTIONS.every(section=>{
  if(section==="calendar")return !Object.keys(data.calendar).length;
  if(section!=="plants")return !data[section].length;
  return data.plants.every(p=>p&&Number.isInteger(p.id)&&p.id>=1&&p.id<=72&&(!p.name||p.name==="Горшок "+p.id)&&!p.note&&!p.checked&&!p.watered&&!p.attention);
 });
}
function enabled(){return Boolean(localStorage.getItem(SECRET_KEY))&&localStorage.getItem(AUTO_KEY)==="on"}
function config(){return {token:localStorage.getItem(SECRET_KEY)||"",url:localStorage.getItem(URL_KEY)||DEFAULT_ENDPOINT}}
function getBase(){
 const obj=parse(localStorage.getItem(BASE_KEY),null);
 return obj&&Number.isSafeInteger(obj.revision)&&obj.revision>=0&&obj.data?obj:null;
}
function setBase(revision,data){
 localStorage.setItem(BASE_KEY,JSON.stringify({revision,data,at:Date.now()}));
 sessionStorage.setItem("life-sync-revision-v1",String(revision));
}
function backup(data,label,revision){
 let old=parse(localStorage.getItem(BACKUPS_KEY),[]);
 if(!Array.isArray(old))old=[];
 old.unshift({savedAt:new Date().toISOString(),reason:label,revision,data});
 try{localStorage.setItem(BACKUPS_KEY,JSON.stringify(old.slice(0,2)))}
 catch{try{localStorage.setItem(BACKUPS_KEY,JSON.stringify(old.slice(0,1)))}catch{throw Error("Не удалось сохранить защитную копию. Автоматическая замена данных остановлена.")}}
}
function updateIndicator(kind,message){
 if(!enabled())return;
 let node=document.getElementById("life-auto-health");
 if(!node&&typeof document.querySelector==="function"){
  const header=document.querySelector("header");
  if(header&&typeof header.insertAdjacentElement==="function"){
   node=document.createElement("p");
   node.id="life-auto-health";
   node.setAttribute("role","status");
   node.setAttribute("aria-live","polite");
   node.style.cssText="border:1px solid #555;background:#191919;color:#ddd;border-radius:10px;padding:8px 12px;margin:8px 0 14px;font:12px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;overflow-wrap:anywhere";
   header.insertAdjacentElement("afterend",node);
  }
 }
 if(node){
  node.textContent=message;
  node.style.borderColor=kind==="conflict"||kind==="error"?"#999":"#555";
 }
}
function notify(kind,message,revision){
 if(message===lastMessage&&kind!=="success")return;
 lastMessage=message;
 updateIndicator(kind,message);
 window.dispatchEvent(new CustomEvent("life-sync-status",{detail:{kind,message,revision}}));
 if(kind==="conflict"||kind==="error"){
  const alert=document.getElementById("life-auto-alert");
  if(alert){alert.hidden=false;alert.querySelector("span").textContent=message}
 }else{
  const alert=document.getElementById("life-auto-alert");
  if(alert)alert.hidden=true;
 }
}
function applyRemote(data,revision,previous,reason,markSynced=true){
 validateData(data);
 if(!same(data,previous))backup(previous,reason,revision);
 applying=true;
 try{for(const section of SECTIONS)localStorage.setItem(DATA_KEYS[section],JSON.stringify(data[section]))}
 finally{applying=false}
 if(markSynced)setBase(revision,data);
 window.dispatchEvent(new Event("life-sync-applied"));
}
async function request(method,payload){
 const {token,url}=config();
 if(!token||!/^https:\/\//.test(url))throw Error("Нужно запомнить ключ и HTTPS-адрес");
 const options={method,headers:{"X-Sync-Token":token},mode:"cors",credentials:"omit",cache:"no-store"};
 if(method==="PUT"){options.headers["Content-Type"]="application/json";options.body=JSON.stringify(payload)}
 const ctrl=new AbortController();options.signal=ctrl.signal;const timeout=setTimeout(()=>ctrl.abort(),25000);let response;
 try{response=await fetch(url,options)}catch(err){if(err?.name==="AbortError")throw Error("тайм-аут соединения (25 секунд). Открой «Сегодня» → «Проверить соединение»");if(err instanceof TypeError)throw Error("браузер не получил ответ (сеть, CORS или доступ функции). Открой «Сегодня» → «Проверить соединение»");throw err}finally{clearTimeout(timeout)}
 let value;try{value=await response.json()}catch{throw Error("Облачная функция вернула ответ, отличный от JSON")}
 if(response.status===409){const err=Error("Конфликт версий");err.code=409;throw err}
 if(!response.ok)throw Error(value.error||"HTTP "+response.status);
 return value;
}
const own=(obj,key)=>obj!=null&&Object.prototype.hasOwnProperty.call(obj,key);
function mergeValue(b,l,r){
 if(same(l,r))return {ok:true,value:l};
 if(same(l,b))return {ok:true,value:r};
 if(same(r,b))return {ok:true,value:l};
 if(b&&l&&r&&!Array.isArray(b)&&!Array.isArray(l)&&!Array.isArray(r)&&typeof b==="object"&&typeof l==="object"&&typeof r==="object"){
  const result={};for(const k of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){
   const merged=mergeValue(own(b,k)?b[k]:undefined,own(l,k)?l[k]:undefined,own(r,k)?r[k]:undefined);
   if(!merged.ok)return {ok:false};
   if(merged.value!==undefined)result[k]=merged.value;
  }
  return {ok:true,value:result};
 }
 return {ok:false};
}
function mergeList(b,l,r){
 const byId=xs=>new Map(xs.map(x=>[String(x.id),x]));
 if([...b,...l,...r].some(x=>!x||x.id===undefined||x.id===null))return {ok:false};
 const base=byId(b),left=byId(l),right=byId(r),order=[...new Set([...r,...l,...b].map(x=>String(x.id)))],value=[];
 for(const id of order){
  const v=mergeValue(base.get(id),left.get(id),right.get(id));
  if(!v.ok)return {ok:false};
  if(v.value!==undefined)value.push(v.value);
 }
 return {ok:true,value};
}
function mergeData(base,local,remote){
 const result={};
 for(const section of SECTIONS){
  const b=base[section],l=local[section],r=remote[section];
  const merged=section==="calendar"?mergeValue(b,l,r):mergeList(b,l,r);
  if(!merged.ok)return {ok:false,section};
  result[section]=merged.value;
 }
 return {ok:true,data:result};
}
function schedule(delay=1300){
 if(!enabled()||applying)return;
 clearTimeout(timer);timer=setTimeout(()=>{void cycle()},Math.max(delay,retryInfo().until-Date.now()));
}
async function runOnce(){
 if(!enabled())return;
 if(navigator.onLine===false){notify("offline","Нет сети. Изменения остаются на устройстве.");return}
 const answer=await request("GET"),revision=Number(answer.revision)||0,remote=answer.data?validateData(answer.data):JSON.parse(JSON.stringify(EMPTY));
 const local=readData(),stored=getBase();
 // First activation: never destroy a separately populated device.
 if(!stored){
  if(same(local,remote)){setBase(revision,remote);notify("success","Облако и устройство совпадают · версия "+revision,revision);return}
  if(isEmpty(local)){applyRemote(remote,revision,local,"Первая синхронизация");notify("success","Данные из облака загружены · версия "+revision,revision);return}
  if(revision===0&&isEmpty(remote)){await upload(0,local);return}
  conflict=true;notify("conflict","На устройстве и в облаке разные данные. Автоматическая замена остановлена. Открой панель «Сегодня» и выбери «Получить» или проверь резервную копию.",revision);return;
 }
 // The shared base is the last known common version; changes can be merged.
 const b=validateData(stored.data);
 if(same(local,remote)){setBase(revision,remote);conflict=false;notify("success","Синхронизировано · версия "+revision,revision);return}
 if(same(local,b)){applyRemote(remote,revision,local,"Загружена более новая версия");conflict=false;notify("success","Получены изменения · версия "+revision,revision);return}
 if(same(remote,b)){await upload(revision,local);return}
 const merged=mergeData(b,local,remote);
 if(!merged.ok){
  conflict=true;
  notify("conflict","Конфликт в разделе «"+merged.section+"»: на двух устройствах изменена одна запись. Данные сохранены; автоматическая перезапись остановлена. Открой панель «Сегодня».",revision);
  return;
 }
 if(same(merged.data,remote)){applyRemote(remote,revision,local,"Объединение изменений");conflict=false;notify("success","Изменения объединены · версия "+revision,revision);return}
 if(!same(local,merged.data)){applyRemote(merged.data,revision,local,"Объединение независимых изменений",false)}
 await upload(revision,merged.data);
}
async function upload(revision,data){
 const result=await request("PUT",{revision,data});
 const next=Number(result.revision)||revision+1;
 setBase(next,data);conflict=false;notify("success","Изменения сохранены в облаке · версия "+next,next);
}
async function cycle(){
 if(processing){again=true;return}
 if(!enabled())return;
 if(retryInfo().until>Date.now())return;
 processing=true;
 try{await runOnce();clearRetry()}
 catch(err){
  if(err.code===409){again=true;notify("info","Другая версия появилась в облаке. Проверяю объединение изменений.")}
  else{
   const minutes=recordFailure();
   notify("error","Облако недоступно: "+err.message+". Записи сохранены на устройстве. Автоматическая повторная попытка — не раньше чем через "+minutes+" мин.");
  }
 }finally{
  processing=false;
  if(again){again=false;schedule(1300)}
 }
}
async function pull(manual=false){
 if(processing)throw Error("Синхронизация уже выполняется");
 processing=true;
 try{
  const a=await request("GET"),revision=Number(a.revision)||0;clearRetry();
  if(!a.data){notify("info","База пуста. Сначала отправь данные из браузера.",revision);return}
  const remote=validateData(a.data),local=readData();
  if(manual&&!same(remote,local)&&!confirm("Заменить данные этого устройства облачной копией? Перед заменой сохранится защитная локальная копия.")){notify("info","Получение отменено.");return}
  applyRemote(remote,revision,local,"Ручное получение из облака");
  conflict=false;notify("success","Облачная копия получена · версия "+revision,revision);
 }finally{processing=false}
}
async function push(manual=false){
 if(processing)throw Error("Синхронизация уже выполняется");
 processing=true;
 try{
  const a=await request("GET"),rev=Number(a.revision)||0,local=readData(),remote=a.data?validateData(a.data):JSON.parse(JSON.stringify(EMPTY)),stored=getBase();
  if(!same(local,remote)&&rev!==0&&(!stored||rev!==stored.revision)){
   throw Error("В облаке другая версия. Для защиты данных сначала «Получить из облака» или разреши конфликт");
  }
  if(manual&&!confirm("Отправить данные этого устройства в облако?"))return;
  if(same(local,remote)){setBase(rev,remote);notify("success","Данные уже совпадают · версия "+rev,rev);return}
  await upload(rev,local);
 }finally{processing=false}
}
function refresh(force=false){
 if(force)clearRetry();
 clearTimeout(timer);again=false;
 if(!enabled()){
  const indicator=document.getElementById("life-auto-health");
  if(indicator&&typeof indicator.remove==="function")indicator.remove();
  notify("info","Автосинхронизация выключена. Чтобы включить, запомни ключ в панели «Сегодня».");return
 }
 notify("info",retryInfo().until>Date.now()?"Облако временно недоступно. Работаю локально, следующая проверка запланирована.":"Облачная синхронизация: проверяю данные…");
 schedule(200);
}
function init(){
 if(!document.getElementById("life-auto-alert")){
  const alert=document.createElement("div");alert.id="life-auto-alert";alert.hidden=true;alert.setAttribute("role","alert");
  alert.style.cssText="box-sizing:border-box;position:fixed;bottom:8px;left:8px;right:8px;max-width:650px;margin:auto;z-index:1000;border:1px solid #777;border-radius:12px;background:#171717;color:#f0f0f0;padding:12px 15px;font:13px/1.45 sans-serif;box-shadow:0 3px 15px #0008";
  const label=document.createElement("span"),link=document.createElement("a");link.href=new URL("../life/",location.href).href;link.textContent=" Открыть панель →";link.style.cssText="color:#fff;text-decoration:underline;margin-left:6px";
  const dismiss=document.createElement("button");dismiss.type="button";dismiss.textContent="×";dismiss.setAttribute("aria-label","Скрыть уведомление");dismiss.style.cssText="float:right;background:transparent;color:#fff;border:0;font-size:22px;cursor:pointer";
  dismiss.onclick=()=>alert.hidden=true;
  alert.append(dismiss,label,link);document.body.append(alert);
 }
 window.addEventListener("life-data-changed",()=>{if(enabled())notify("info","Изменения пока только на устройстве. Сохраняю в облако…");schedule()});
 window.addEventListener("storage",e=>{
  if(e.key===AUTO_KEY||e.key===SECRET_KEY||e.key===URL_KEY){refresh();return}
  if(e.key===BASE_KEY){schedule(1300);return}
  if(Object.values(DATA_KEYS).includes(e.key)){if(enabled())notify("info","Обнаружены локальные изменения. Сохраняю в облако…");schedule(1400)}
 });
 window.addEventListener("focus",()=>schedule(150));
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)schedule(150)});
 window.addEventListener("online",()=>{clearRetry();schedule(300)});
 setInterval(()=>{if(!document.hidden)schedule(1000)},120000);
 refresh();
}
function downloadBackup(){
 const backups=parse(localStorage.getItem(BACKUPS_KEY),[]);
 if(!Array.isArray(backups)||!backups.length)throw Error("Защитных копий пока нет");
 const blob=new Blob([JSON.stringify({version:1,backups},null,2)],{type:"application/json"});
 const link=document.createElement("a"),url=URL.createObjectURL(blob);
 link.href=url;link.download="life-recovery-"+new Date().toISOString().slice(0,10)+".json";link.click();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
}
window.LifeAutoSync={refresh,pull,push,sync:cycle,downloadBackup,isEnabled:enabled,isConflicted:()=>conflict};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();