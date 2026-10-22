/* Active-page reminders shared by the personal dashboard, calendar, shopping and plants.
 * Never starts in the flexible editor, which already has its own reminder UI.
 * No background alarms are claimed; closed iPhone apps cannot run this loop.
 */
(()=>{
'use strict';
const M=window.LifeModel,C=window.LIFE_CONFIG;
if(!M||!C)return;
const CAL='week-check-v2',SHOP='supermarket-shopping-list-v1',NESTED='__planner_v3';
let queue=[],active=null;
const get=k=>{const raw=localStorage.getItem(k);return raw===null?null:JSON.parse(raw)};
const isObject=x=>x&&typeof x==='object'&&!Array.isArray(x);
const sectionFor=cat=>['home','hygiene','baby','pets'].includes(cat)?'household':cat==='other'?'other':'groceries';
function read(){
 try{
  const calendar=get(CAL)||{},shop=get(SHOP)||[];
  if(!isObject(calendar)||!Array.isArray(shop))return null;
  const raw=calendar[NESTED];
  const state=isObject(raw)?M.normalize(raw):M.normalize({
    version:2,sections:C.sections,tasks:[],shopping:[],ledger:[],completions:{},sent:{},snoozes:{},
    preferences:{quietStart:'23:00',quietEnd:'07:00',currency:'₽',sound:false}
  });
  const valid=new Set(state.sections.filter(s=>s.type==='shopping'&&s.visible!==false).map(s=>s.id));
  state.shopping=shop.filter(x=>x&&typeof x.name==='string'&&x.remind&&!x.done&&M.validTime(x.time))
   .map(x=>({id:String(x.id),title:x.name,sectionId:valid.has(sectionFor(x.cat))?sectionFor(x.cat):valid.has('other')?'other':'',time:x.time,done:false,remind:true}));
  return {calendar,state,shop};
 }catch{return null}
}
function pending(now=new Date()){
 const data=read();
 if(!data)return [];
 return M.dueTasks(data.state,now);
}
function save(event,mode){
 try{
  const data=read();if(!data)return false;
  const {calendar,state,shop}=data;
  if(mode==='claim'&&state.sent[event.key])return false;
  if(mode==='claim'){state.sent[event.key]=true;delete state.snoozes[event.key]}
  else if(mode==='snooze'){delete state.sent[event.key];state.snoozes[event.key]=Date.now()+600000}
  else{
   delete state.snoozes[event.key];
   if(mode==='done'){
    if(event.type==='task')state.completions[event.dateKey+'::'+event.id]=true;
    else{
     const item=shop.find(x=>String(x.id)===String(event.id));
     if(item)item.done=true;
    }
   }
  }
  const next={...state,shopping:[]};
  calendar[NESTED]=next;
  if(mode==='done'&&event.type==='shopping')localStorage.setItem(SHOP,JSON.stringify(shop));
  localStorage.setItem(CAL,JSON.stringify(calendar));
  window.dispatchEvent(new Event('life-data-changed'));
  if(mode==='done')window.dispatchEvent(new Event('life-sync-applied'));
  return true;
 }catch{return false}
}
function panel(){
 let box=document.getElementById('life-active-reminder');
 if(box)return box;
 box=document.createElement('aside');box.id='life-active-reminder';box.hidden=true;
 box.setAttribute('role','alertdialog');box.setAttribute('aria-label','Напоминание');
 box.style.cssText='position:fixed;bottom:calc(12px + env(safe-area-inset-bottom));left:12px;right:12px;z-index:1500;max-width:590px;margin:auto;background:#1b1b1b;color:#fff;border:2px solid #ddd;border-radius:14px;padding:14px 15px;box-shadow:0 6px 20px #000a;font:14px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;';
 const title=document.createElement('strong');title.className='reminder-title';title.style.cssText='display:block;margin:0 0 12px;font-size:16px;overflow-wrap:anywhere';
 const actions=document.createElement('div');actions.style.cssText='display:flex;flex-wrap:wrap;gap:8px';
 for(const [label,mode] of [['Готово','done'],['Через 10 минут','snooze'],['Закрыть','dismiss']]){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.action=mode;
  b.style.cssText='border:1px solid #777;border-radius:10px;background:#333;color:#fff;padding:10px 12px;min-height:44px;font:inherit;cursor:pointer';
  b.onclick=()=>{if(!active)return;save(active,mode);active=null;box.hidden=true;showNext()};
  actions.append(b);
 }
 box.append(title,actions);document.body.append(box);return box;
}
async function systemNotice(event){
 if(!('Notification' in window)||Notification.permission!=='granted')return;
 try{
  const target=new URL('life/planner/',selfOrigin());
  target.searchParams.set('item',event.type+':'+event.id);
  const reg='serviceWorker' in navigator?await navigator.serviceWorker.getRegistration():null;
  if(reg?.active)await reg.showNotification(event.title,{body:'Время: '+event.time,tag:'personal-'+event.key,icon:new URL('life/icon-192.png',selfOrigin()).href,data:{url:target.href}});
 }catch{}
}
function selfOrigin(){
 const main=new URL(document.currentScript?.src||location.href,location.href);
 const base=main.pathname.includes('/life/')?main.pathname.split('/life/')[0]+'/':location.pathname.split(/\/(?:calendar|shopping|plants)\//)[0]+'/';
 return new URL(base,location.origin);
}
function showNext(){
 if(active||!queue.length)return;
 active=queue.shift();
 const box=panel();box.querySelector('.reminder-title').textContent=active.title+' · '+active.time;
 box.hidden=false;
 void systemNotice(active);
}
function tick(){
 if(document.hidden||active)return;
 for(const event of pending(new Date()).slice(0,20))if(save(event,'claim'))queue.push(event);
 showNext();
}
function init(){
 panel();
 tick();
 setInterval(tick,30000);
 window.addEventListener('focus',tick);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
 window.addEventListener('online',tick);
}
window.LifeReminderAgent={pending,tick};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();