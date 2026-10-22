/* Ordinary Day: pure data model. No external APIs, credentials or requests. */
(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 if(root)root.EverydayModel=api;
})(typeof window!=="undefined"?window:undefined,function(){
"use strict";
const VERSION=1;
const STORE="ordinary-day-state-v1", RECOVERY="ordinary-day-recovery-v1";
const builtin=["planner","money","shopping","home"];
const dayNames=["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
function uid(){
 if(typeof crypto!=="undefined"&&crypto.randomUUID)return crypto.randomUUID();
 if(typeof crypto!=="undefined"&&crypto.getRandomValues){
   const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
   return Array.from(bytes,n=>n.toString(16).padStart(2,"0")).join("");
 }
 return "id-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
}
function blank(){
 return {
 version:VERSION,currency:"RUB",theme:"dark",
 sections:[
 {id:"planner",title:"Календарь",kind:"builtin",visible:true},
 {id:"money",title:"Финансы",kind:"builtin",visible:true},
 {id:"shopping",title:"Покупки",kind:"builtin",visible:true},
 {id:"home",title:"Дом",kind:"builtin",visible:true}
 ],
 items:[],done:{},tasks:[],transactions:[],subscriptions:[],shopping:[],pantry:[],plants:[],
 expenseCats:[
 {id:"food",title:"Продукты",limit:0},{id:"transport",title:"Транспорт",limit:0},
 {id:"housing",title:"Жильё",limit:0},{id:"health",title:"Здоровье",limit:0},
 {id:"shopping",title:"Покупки",limit:0},{id:"entertainment",title:"Досуг",limit:0},
 {id:"other",title:"Другое",limit:0}
 ],
 incomeCats:[{id:"salary",title:"Зарплата"},{id:"side",title:"Дополнительный доход"},{id:"incomeother",title:"Другое"}],
 shopCats:[{id:"food",title:"Продукты"},{id:"house",title:"Для дома"},{id:"other",title:"Другое"}]
 };
}
function txt(v,max=200){
 if(typeof v!=="string")throw Error("Некорректное текстовое поле");
 return v.trim().slice(0,max);
}
function identifier(v){if(typeof v!=="string"||v.length<1||v.length>100||!/^[a-zA-Z0-9_-]+$/.test(v))throw Error("Некорректный идентификатор");return v}
function number(v){if(!Number.isSafeInteger(v)||v<0||v>9999999999)throw Error("Некорректная сумма");return v}
function arr(v,max=15000){if(!Array.isArray(v)||v.length>max)throw Error("Некорректный или слишком длинный список");return v}
function isoDate(v){
 if(typeof v!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error("Некорректная дата");
 const d=new Date(v+"T12:00:00Z");
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==v)throw Error("Некорректная дата");
 return v;
}
function tm(v){if(v==="")return "";if(typeof v!=="string"||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v))throw Error("Некорректное время");return v}
function unique(xs){const found=new Set();for(const x of xs){if(found.has(x.id))throw Error("Повторяется идентификатор: "+x.id);found.add(x.id)}return xs}
function allowed(v,values){if(!values.includes(v))throw Error("Неизвестный тип данных");return v}
function validate(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==VERSION)throw Error("Неподдерживаемый формат базы данных");
 const d=blank(),out={version:VERSION};
 out.currency=allowed(raw.currency,["RUB","EUR","USD","BYN"]);
 out.theme=allowed(raw.theme,["dark","light"]);
 const sec=unique(arr(raw.sections,50).map(s=>({
  id:identifier(s.id),title:txt(s.title,36),kind:allowed(s.kind,["builtin","custom"]),visible:Boolean(s.visible)
 })));
 if(sec.some(s=>!s.title))throw Error("Пустое название раздела");
 for(const id of builtin)if(!sec.some(s=>s.id===id&&s.kind==="builtin"))throw Error("Удалён обязательный раздел "+id);
 if(sec.some(s=>s.kind==="builtin"&&!builtin.includes(s.id)))throw Error("Неизвестный встроенный раздел");
 out.sections=sec;
 const secIds=new Set(sec.map(s=>s.id));
 out.items=unique(arr(raw.items,3000).map(i=>({
  id:identifier(i.id),title:txt(i.title,150),section:identifier(i.section),
  repeat:allowed(i.repeat,["daily","weekly","once"]),time:tm(i.time||"")
 })));
 if(out.items.some(i=>!i.title||!secIds.has(i.section)||["money","shopping"].includes(i.section)))throw Error("Неверный пункт в настройках");
 out.tasks=unique(arr(raw.tasks,10000).map(t=>({
  id:identifier(t.id),title:txt(t.title,160),date:isoDate(t.date),
  section:identifier(t.section),time:tm(t.time||""),done:Boolean(t.done)
 })));
 if(out.tasks.some(t=>!t.title||!secIds.has(t.section)||["money","shopping"].includes(t.section)))throw Error("Неверная задача");
 out.expenseCats=unique(arr(raw.expenseCats,100).map(c=>({id:identifier(c.id),title:txt(c.title,40),limit:number(c.limit)})));
 out.incomeCats=unique(arr(raw.incomeCats,100).map(c=>({id:identifier(c.id),title:txt(c.title,40)})));
 out.shopCats=unique(arr(raw.shopCats,100).map(c=>({id:identifier(c.id),title:txt(c.title,40)})));
 for(const k of ["expenseCats","incomeCats","shopCats"])if(!out[k].length||out[k].some(c=>!c.title))throw Error("В настройках нет категорий");
 const expIds=new Set(out.expenseCats.map(x=>x.id)),incIds=new Set(out.incomeCats.map(x=>x.id)),shIds=new Set(out.shopCats.map(x=>x.id));
 out.transactions=unique(arr(raw.transactions,30000).map(t=>({
  id:identifier(t.id),kind:allowed(t.kind,["income","expense"]),date:isoDate(t.date),
  amount:number(t.amount),category:identifier(t.category),note:txt(t.note||"",160),subscriptionId:t.subscriptionId?identifier(t.subscriptionId):""
 })));
 if(out.transactions.some(t=>!t.amount||!(t.kind==="income"?incIds:expIds).has(t.category)))throw Error("Отсутствует категория у операции или сумма равна нулю");
 out.subscriptions=unique(arr(raw.subscriptions||[],1000).map(v=>({
  id:identifier(v.id),title:txt(v.title,100),amount:number(v.amount),category:identifier(v.category),
  day:v.day,active:v.active!==false
 })));
 if(out.subscriptions.some(v=>!v.title||!v.amount||!expIds.has(v.category)||!Number.isInteger(v.day)||v.day<1||v.day>31))throw Error("Некорректный регулярный платёж");
 if(out.transactions.some(t=>t.subscriptionId&&(!out.subscriptions.some(x=>x.id===t.subscriptionId)||t.kind!=="expense")))throw Error("Связанный платеж отсутствует");
 out.shopping=unique(arr(raw.shopping,10000).map(v=>({
  id:identifier(v.id),title:txt(v.title,140),qty:txt(v.qty||"",40),category:identifier(v.category),done:Boolean(v.done)
 })));
 if(out.shopping.some(v=>!v.title||!shIds.has(v.category)))throw Error("Некорректный список покупок");
 out.pantry=unique(arr(raw.pantry,10000).map(v=>({id:identifier(v.id),title:txt(v.title,140),qty:txt(v.qty||"",40)})));
 out.plants=unique(arr(raw.plants,3000).map(v=>({
  id:identifier(v.id),title:txt(v.title,140),note:txt(v.note||"",200),
  watered:v.watered?isoDate(v.watered):""
 })));
 if(out.pantry.some(v=>!v.title)||out.plants.some(v=>!v.title))throw Error("Пустые записи");
 if(!raw.done||typeof raw.done!=="object"||Array.isArray(raw.done))throw Error("Некорректные отметки");
 const done=Object.create(null),ids=new Set(out.items.map(i=>i.id));
 for(const [key,value] of Object.entries(raw.done)){
  if(key.length>120||!/^[a-zA-Z0-9_-]+@(?:\d{4}-\d{2}-\d{2}(?:-weekly)?|once)$/.test(key))throw Error("Некорректная отметка");
  if(value!==true)continue;
  const id=key.split("@")[0];
  if(ids.has(id))done[key]=true;
 }
 out.done=done;
 return out;
}
function localDate(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
function addDays(date,n){const d=new Date(date+"T12:00:00");d.setDate(d.getDate()+n);return localDate(d)}
function monday(date){
 const d=new Date(date+"T12:00:00"),index=(d.getDay()+6)%7;
 d.setDate(d.getDate()-index);return localDate(d);
}
function monthOf(date){return date.slice(0,7)}
function shiftMonth(month,diff){const [year,m]=month.split("-").map(Number);const d=new Date(year,m-1+diff,1,12);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0")].join("-")}
function keyFor(item,date){
 if(item.repeat==="once")return item.id+"@once";
 if(item.repeat==="weekly")return item.id+"@"+monday(date)+"-weekly";
 return item.id+"@"+date;
}
function parseMinor(value){
 if(typeof value!=="string")throw Error("Укажи сумму");
 const s=value.trim().replace(/[\s\u00a0\u202f]/g,"");
 if(!/^(?:0|[1-9]\d{0,7})(?:[.,]\d{1,2})?$/.test(s))throw Error("Сумма должна быть положительным числом с максимум двумя знаками после запятой");
 const p=s.replace(",",".").split("."),cents=Number(p[0])*100+Number((p[1]||"").padEnd(2,"0"));
 if(!Number.isSafeInteger(cents)||cents<1||cents>9999999999)throw Error("Сумма слишком большая или равна нулю");
 return cents;
}
function money(value,currency){
 return new Intl.NumberFormat("ru-RU",{style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value/100);
}
function monthTotals(state,month){
 let income=0,expense=0;
 const spent=Object.create(null);
 for(const t of state.transactions)if(monthOf(t.date)===month){
  if(t.kind==="income")income+=t.amount;
  else{expense+=t.amount;spent[t.category]=(spent[t.category]||0)+t.amount}
 }
 return {income,expense,balance:income-expense,spent};
}
function dueDate(month,day){
 const [year,m]=month.split("-").map(Number);
 if(!Number.isInteger(year)||!Number.isInteger(m)||year<2000||year>9999||m<1||m>12)throw Error("Некорректный месяц");
 const last=new Date(year,m,0,12).getDate();
 return month+"-"+String(Math.min(day,last)).padStart(2,"0");
}
function csvField(value){
 let s=String(value??"");
 // Neutralise CSV formula execution in spreadsheet software.
 if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function csvTransactions(state,month){
 const rows=[["Дата","Тип","Категория","Сумма","Валюта","Описание"]];
 const names={
  expense:Object.fromEntries(state.expenseCats.map(c=>[c.id,c.title])),
  income:Object.fromEntries(state.incomeCats.map(c=>[c.id,c.title]))
 };
 for(const t of state.transactions.filter(t=>monthOf(t.date)===month).sort((a,b)=>a.date.localeCompare(b.date))){
  rows.push([t.date,t.kind==="income"?"Доход":"Расход",names[t.kind][t.category]||"Без категории",(t.amount/100).toFixed(2).replace(".",","),state.currency,t.note]);
 }
 return "\ufeff"+rows.map(r=>r.map(csvField).join(";")).join("\r\n")+"\r\n";
}
return {VERSION,STORE,RECOVERY,builtin,dayNames,uid,blank,validate,localDate,addDays,monday,monthOf,shiftMonth,keyFor,parseMinor,money,monthTotals,csvTransactions,dueDate};
});