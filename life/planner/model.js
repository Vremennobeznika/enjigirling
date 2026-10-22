/* Model shared by two independent distributions; no network, no dependencies. */
(function(root,factory){'use strict';const api=factory(); if(typeof module==='object'&&module.exports)module.exports=api;root.LifeModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const DAY_NAMES=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const safeString=(v,max=120)=>String(v??'').trim().slice(0,max);
const validTime=t=>typeof t==='string'&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(t);
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&localDate(new Date(s+'T12:00:00'))===s;
const validDays=v=>Array.isArray(v)?[...new Set(v.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<=6))].sort():[0,1,2,3,4,5,6];
const uid=()=>('id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10));
const localDate=(date)=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
const mondayDay=(date)=>(date.getDay()+6)%7;
const dateFromKey=(key)=>{const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d,12,0,0,0);};
const addDays=(date,days)=>{const d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);d.setDate(d.getDate()+days);return d};
const emptyState=()=>({version:2,sections:[],tasks:[],shopping:[],ledger:[],completions:{},sent:{},snoozes:{},legacyIndex:{},preferences:{quietStart:'23:00',quietEnd:'07:00',currency:'₽',sound:false}});
const safeSections=v=>Array.isArray(v)?v.slice(0,100).filter(x=>x&&typeof x==='object').map(x=>({id:safeString(x.id,64)||uid(),title:safeString(x.title,80)||'Без названия',type:x.type==='shopping'?'shopping':'routine',visible:x.visible!==false})):[];
const safeTasks=v=>Array.isArray(v)?v.slice(0,1000).filter(x=>x&&typeof x==='object'&&safeString(x.title)).map(x=>({id:safeString(x.id,64)||uid(),sectionId:safeString(x.sectionId,64),title:safeString(x.title),time:validTime(x.time)?x.time:'09:00',days:validDate(x.date)?[]:validDays(x.days),date:validDate(x.date)?x.date:'',remind:x.remind===true,active:x.active!==false,note:safeString(x.note,360)})):[];
const safeShopping=v=>Array.isArray(v)?v.slice(0,2000).filter(x=>x&&typeof x==='object'&&safeString(x.title)).map(x=>({id:safeString(x.id,64)||uid(),sectionId:safeString(x.sectionId,64),title:safeString(x.title),qty:safeString(x.qty,30),done:x.done===true,time:validTime(x.time)?x.time:'',remind:x.remind===true&&validTime(x.time)})):[];
const safeLedger=v=>Array.isArray(v)?v.slice(0,10000).filter(x=>x&&typeof x==='object'&&Number.isFinite(Number(x.amount))&&Number(x.amount)>0&&validDate(x.date)).map(x=>({id:safeString(x.id,64)||uid(),date:x.date,kind:x.kind==='income'?'income':'expense',amount:Math.round(Number(x.amount)*100)/100,category:safeString(x.category,80),note:safeString(x.note,160)})):[];
const safeMap=(m,kind='boolean')=>{const o={};if(m&&typeof m==='object'&&!Array.isArray(m))for(const [k,v] of Object.entries(m).slice(-12000)){if(k.length>180)continue;if(kind==='boolean'){if(v===true)o[k]=true;}else if(Number.isFinite(Number(v))&&Number(v)>0)o[k]=Number(v);}return o;};
const safeLegacyIndex=v=>{const out={};if(v&&typeof v==='object')for(const d of DAY_NAMES)if(Array.isArray(v[d]))out[d]=v[d].slice(0,150).map(x=>safeString(x,64));return out;};
function normalize(raw,defaults){const base=defaults?JSON.parse(JSON.stringify(defaults)):emptyState();if(!raw||typeof raw!=='object'||Array.isArray(raw))return base;
const out={version:2,sections:safeSections(raw.sections),tasks:safeTasks(raw.tasks),shopping:safeShopping(raw.shopping),ledger:safeLedger(raw.ledger),completions:safeMap(raw.completions),sent:safeMap(raw.sent),snoozes:safeMap(raw.snoozes,'number'),legacyIndex:safeLegacyIndex(raw.legacyIndex),preferences:{quietStart:validTime(raw.preferences?.quietStart)?raw.preferences.quietStart:'23:00',quietEnd:validTime(raw.preferences?.quietEnd)?raw.preferences.quietEnd:'07:00',currency:safeString(raw.preferences?.currency,8)||'₽',sound:raw.preferences?.sound===true}};
// Preserve usable data but drop records whose section is gone.
const ids=new Set(out.sections.map(s=>s.id));out.tasks=out.tasks.filter(t=>ids.has(t.sectionId)&&out.sections.find(s=>s.id===t.sectionId)?.type==='routine');out.shopping=out.shopping.filter(t=>ids.has(t.sectionId)&&out.sections.find(s=>s.id===t.sectionId)?.type==='shopping');
return out;}
const taskOccurs=(task,date)=>task.active!==false&&(task.date?task.date===localDate(date):Array.isArray(task.days)&&task.days.includes(mondayDay(date)));
function progress(tasks,completions,date){const day=localDate(date);const active=tasks.filter(t=>taskOccurs(t,date));return{done:active.filter(t=>completions[day+'::'+t.id]).length,total:active.length};}
function inQuiet(time,start,end){if(!validTime(start)||!validTime(end)||start===end)return false;return start<end?time>=start&&time<end:time>=start||time<end;}
/* Grace allows a short catch-up after sleep or tab throttling; no browser can promise background alarms. */
function dueTasks(state,when){const today=localDate(when),events=[];const visible=new Map(state.sections.filter(s=>s.visible).map(s=>[s.id,s]));
 const localNow=String(when.getHours()).padStart(2,'0')+':'+String(when.getMinutes()).padStart(2,'0');
 if(inQuiet(localNow,state.preferences.quietStart,state.preferences.quietEnd))return [];
 for(const date of [localDate(addDays(when,-1)),today]){
  const day=dateFromKey(date),yesterday=date!==today;
  for(const task of state.tasks){if(!visible.get(task.sectionId)||!task.remind||!taskOccurs(task,day)||state.completions[date+'::'+task.id])continue;
   const key=date+'::task::'+task.id;const snooze=state.snoozes[key];if(yesterday&&!snooze)continue;
   const planned=snooze?new Date(snooze):new Date(day.getFullYear(),day.getMonth(),day.getDate(),Number(task.time.slice(0,2)),Number(task.time.slice(3)));
   const delta=(when.getTime()-planned.getTime())/60000;
   if(delta>=0&&delta<=(snooze?15:60)&&!state.sent[key])events.push({key,dateKey:date,id:task.id,title:task.title,time:task.time,type:'task',late:delta>15});
  }
  for(const item of state.shopping){if(!visible.get(item.sectionId)||!item.remind||item.done||!validTime(item.time))continue;
   const key=date+'::shopping::'+item.id;const snooze=state.snoozes[key];if(yesterday&&!snooze)continue;
   const planned=snooze?new Date(snooze):new Date(day.getFullYear(),day.getMonth(),day.getDate(),Number(item.time.slice(0,2)),Number(item.time.slice(3)));
   const delta=(when.getTime()-planned.getTime())/60000;
   if(delta>=0&&delta<=(snooze?15:60)&&!state.sent[key])events.push({key,dateKey:date,id:item.id,title:'Купить: '+item.title,time:item.time,type:'shopping',late:delta>15});
  }
 }
 return events;
}
function monthStats(ledger,date){const ym=localDate(date).slice(0,7);const entries=ledger.filter(t=>t.date.startsWith(ym));const income=entries.filter(t=>t.kind==='income').reduce((a,x)=>a+x.amount,0);const expense=entries.filter(t=>t.kind==='expense').reduce((a,x)=>a+x.amount,0);return{income:Math.round(income*100)/100,expense:Math.round(expense*100)/100,balance:Math.round((income-expense)*100)/100};}
const icsEscape=s=>String(s??'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const icsStamp=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('')+'T'+[d.getHours(),d.getMinutes(),d.getSeconds()].map(v=>String(v).padStart(2,'0')).join('');
function foldIcs(line){const out=[];let current='',bytes=0;for(const ch of line){const n=new TextEncoder().encode(ch).length;if(bytes+n>75&&current){out.push(current);current=' '+ch;bytes=1+n}else{current+=ch;bytes+=n}}out.push(current);return out.join('\r\n');}
function icsExport(state,start,days=30){const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Local Life//Personal Reminder//RU','CALSCALE:GREGORIAN','METHOD:PUBLISH'];const visible=new Set(state.sections.filter(s=>s.visible).map(s=>s.id));const count=Math.min(90,Math.max(1,days));
 const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 function event(title,note,id,date,time){const [h,m]=time.split(':').map(Number),begin=new Date(date.getFullYear(),date.getMonth(),date.getDate(),h,m,0),end=new Date(begin.getTime()+5*60000);lines.push('BEGIN:VEVENT','UID:'+icsEscape(id+'-'+localDate(date))+'@local-life','DTSTAMP:'+stamp,'DTSTART:'+icsStamp(begin),'DTEND:'+icsStamp(end),'SUMMARY:'+icsEscape(title),'DESCRIPTION:'+icsEscape(note||'Локальное напоминание'),'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEscape(title),'TRIGGER:PT0S','END:VALARM','END:VEVENT')}
 for(let n=0;n<count;n++){const date=addDays(start,n);for(const t of state.tasks){if(!t.remind||!visible.has(t.sectionId)||!taskOccurs(t,date))continue;event(t.title,t.note,'task-'+t.id,date,t.time);}}
 // A shopping reminder is exported once, not 30 copies of the same unpurchased item.
 for(const item of state.shopping){if(!item.remind||item.done||!validTime(item.time)||!visible.has(item.sectionId))continue;let date=addDays(start,0);const [h,m]=item.time.split(':').map(Number);if(new Date(date.getFullYear(),date.getMonth(),date.getDate(),h,m)<start)date=addDays(date,1);event('Купить: '+item.title,item.qty,'shopping-'+item.id,date,item.time)}
 lines.push('END:VCALENDAR');return lines.map(foldIcs).join('\r\n')+'\r\n';}
function ledgerCSV(ledger){const escape=value=>{let s=String(value??'').replace(/\r?\n/g,' ');if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};return '\ufeff'+[['Дата','Тип','Сумма','Категория','Комментарий'],...ledger.map(x=>[x.date,x.kind==='income'?'Доход':'Расход',x.amount.toFixed(2),x.category,x.note])].map(x=>x.map(escape).join(';')).join('\r\n')+'\r\n'}
function parseLegacyHTML(source){if(typeof source!=='string'||source.length>2000000)throw Error('Недопустимый HTML');const match=/const\s+schedule\s*=\s*\{/g.exec(source);if(!match)throw Error('В файле нет расписания прежнего календаря');const start=source.indexOf('{',match.index),str=source.slice(start);let inString=false,escaped=false,depth=0,end=-1;for(let i=0;i<str.length;i++){const c=str[i];if(inString){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')inString=false;}else if(c==='"')inString=true;else if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){end=i+1;break}}}if(end<0)throw Error('Не найден конец расписания');let raw=JSON.parse(str.slice(0,end));const clean={};for(const day of DAY_NAMES){if(!Array.isArray(raw[day]))throw Error('Нет дня недели '+day);clean[day]=raw[day].slice(0,150).filter(x=>x&&validTime(x.time)&&safeString(x.task)).map(x=>({time:x.time,title:safeString(x.task)}));}return clean;}
function trimHistory(state,today){const horizon=localDate(addDays(today,-45));for(const k of Object.keys(state.sent))if(k.slice(0,10)<horizon)delete state.sent[k];for(const k of Object.keys(state.snoozes))if(k.slice(0,10)<horizon)delete state.snoozes[k];for(const k of Object.keys(state.completions))if(k.slice(0,10)<localDate(addDays(today,-400)))delete state.completions[k];}
return{DAY_NAMES,safeString,validTime,validDate,localDate,dateFromKey,addDays,mondayDay,uid,emptyState,normalize,taskOccurs,progress,inQuiet,dueTasks,monthStats,icsExport,ledgerCSV,trimHistory,parseLegacyHTML};
});
