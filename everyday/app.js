/* Ordinary Day: private, local-first browser application.
 * No fetch(), telemetry, external fonts, cloud keys or backend dependencies.
 * All mutable section structures are configured in the Settings page.
 */
(()=>{
"use strict";
const M=window.EverydayModel;
if(!M)throw Error("Data model was not loaded");
const $=id=>document.getElementById(id);
const clone=value=>JSON.parse(JSON.stringify(value));
const lbl=(tag,text,css)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(css)n.className=css;return n};
const catName=(type,id)=>{const list=type==="expense"?state.expenseCats:type==="income"?state.incomeCats:state.shopCats;return list.find(c=>c.id===id)?.title||"Категория удалена"};
const secName=id=>state.sections.find(s=>s.id===id)?.title||"Раздел";
const hiddenSec=id=>state.sections.find(s=>s.id===id)?.visible===false;
let state,broken=false;
try{const old=localStorage.getItem(M.STORE);state=old?M.validate(JSON.parse(old)):M.blank()}
catch(err){state=M.blank();broken=true;setTimeout(()=>toast("Сохранённые данные повреждены или недоступны. Новые записи заблокированы до восстановления копии.",9000),400)}
let view="overview",customSection="",selected=M.localDate(),month=M.monthOf(selected),editingTx=null,editingItem=null,editingSubscription=null,toastTimer;
function toast(message,ms=4500){
 const node=$("toast");node.textContent=String(message);node.hidden=false;clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>{node.hidden=true},ms);
}
function change(callback){
 if(broken){toast("Данные недоступны для безопасной записи. Восстанови сохранённую JSON-копию через настройки.");return false}
 try{
  const next=clone(state);callback(next);
  const checked=M.validate(next);
  localStorage.setItem(M.STORE,JSON.stringify(checked));
  state=checked;render();return true;
 }catch(err){toast("Не удалось сохранить: "+err.message,6500);return false}
}
function ask(message){return window.confirm(message)}
function removeButton(text,fn){
 const btn=lbl("button",text,"delete-btn");btn.type="button";btn.setAttribute("aria-label",text);btn.addEventListener("click",fn);return btn;
}
function actionButton(text,fn,css="btn small"){
 const btn=lbl("button",text,css);btn.type="button";btn.addEventListener("click",fn);return btn;
}
function empty(target,message){target.replaceChildren(lbl("p",message,"empty"))}
function row(title,sub="",opts={}){
 const node=lbl("div",undefined,"row"+(opts.checked?" completed":""));
 const main=lbl("div",undefined,"row-main");
 if(opts.checkbox){
  const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.className="tick";
  checkbox.checked=Boolean(opts.checked);checkbox.setAttribute("aria-label",title);checkbox.addEventListener("change",()=>opts.checkbox(checkbox.checked));
  main.appendChild(checkbox);
 }
 if(opts.time)main.appendChild(lbl("span",opts.time,"time-chip"));
 const stack=lbl("div",undefined,"name-stack");
 stack.append(lbl("strong",title));
 if(sub)stack.append(lbl("p",sub,"secondary"));
 main.appendChild(stack);node.appendChild(main);
 if(opts.actions?.length){const actions=lbl("div",undefined,"row-actions");for(const action of opts.actions)actions.append(action);node.append(actions)}
 return node;
}
function sectionOptions(select,exclude=[]){
 const chosen=select.value;select.replaceChildren();
 for(const s of state.sections){
  if(exclude.includes(s.id)||!s.title)continue;
  const option=lbl("option",s.title);option.value=s.id;select.append(option);
 }
 if([...select.options].some(x=>x.value===chosen))select.value=chosen;
}
function categoryOptions(select,list){
 const chosen=select.value;select.replaceChildren();
 for(const c of list){const option=lbl("option",c.title);option.value=c.id;select.append(option)}
 if([...select.options].some(x=>x.value===chosen))select.value=chosen;
}
function setView(next){
 if(next.startsWith("custom:")){
  const id=next.slice(7),sec=state.sections.find(s=>s.id===id&&s.kind==="custom"&&s.visible);
  if(!sec)next="overview";
 }
 if(!["overview","settings","planner","money","shopping","home"].includes(next)&&!next.startsWith("custom:"))next="overview";
 if(["planner","money","shopping","home"].includes(next)&&hiddenSec(next))next="overview";
 view=next;
 for(const page of document.querySelectorAll("main .page"))page.hidden=true;
 const activePage=next.startsWith("custom:")?"custom":next;
 $("page-"+activePage).hidden=false;
 for(const button of $("mainNav").querySelectorAll(".nav-btn")){
  const active=button.dataset.view===next;button.classList.toggle("active",active);
  if(active)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");
 }
 if(next.startsWith("custom:")){customSection=next.slice(7);renderCustom()}
 if(next==="money")renderMoney();
 if(next==="settings")renderSettings();
 history.replaceState(null,"","#"+encodeURIComponent(next));
 window.scrollTo({top:0,behavior:"instant"});
}
function renderNav(){
 const nav=$("mainNav");nav.replaceChildren();
 const entries=[{id:"overview",title:"Обзор"},...state.sections.filter(s=>s.visible).map(s=>({id:s.kind==="custom"?"custom:"+s.id:s.id,title:s.title})),{id:"settings",title:"Настройки"}];
 for(const entry of entries){
  const button=lbl("button",entry.title,"nav-btn");button.type="button";button.dataset.view=entry.id;
  button.addEventListener("click",()=>setView(entry.id));nav.appendChild(button);
 }
 const visibleEntries=new Set(entries.map(x=>x.id));
 if(!visibleEntries.has(view))view="overview";
 const active=view.startsWith("custom:")?"custom":view;
 for(const el of document.querySelectorAll("main .page"))el.hidden=el.id!=="page-"+active;
 for(const el of nav.querySelectorAll(".nav-btn")){const current=el.dataset.view===view;el.classList.toggle("active",current);if(current)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current")}
}
function activeItems(section,date){
 return state.items.filter(item=>item.section===section&&(item.repeat!=="weekly"||M.addDays(M.monday(date),item.weekday)===date)).map(item=>({...item,key:M.keyFor(item,date),checked:!!state.done[M.keyFor(item,date)]}));
}
function templateRows(where,section,date){
 const items=activeItems(section,date).sort((a,b)=>(a.time||"99:99").localeCompare(b.time||"99:99")||a.title.localeCompare(b.title,"ru"));
 for(const item of items){
  where.append(row(item.title,item.repeat==="daily"?"Каждый день":item.repeat==="weekly"?"Еженедельно · "+["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][item.weekday]:"До выполнения",
   {time:item.time,checked:item.checked,checkbox:checked=>change(s=>{if(checked)s.done[item.key]=true;else delete s.done[item.key]})}));
 }
 return items.length;
}
function renderOverview(){
 const today=M.localDate(),list=$("overviewTasks");list.replaceChildren();
 const all=state.tasks.filter(t=>t.date===today&&state.sections.find(s=>s.id===t.section)?.visible)
  .map(t=>({title:t.title,sub:secName(t.section),time:t.time,checked:t.done,kind:"task",obj:t}));
 for(const i of state.items)if(!hiddenSec(i.section))all.push({title:i.title,sub:secName(i.section),time:i.time,checked:!!state.done[M.keyFor(i,today)],kind:"item",obj:i});
 all.sort((a,b)=>(a.time||"99:99").localeCompare(b.time||"99:99"));
 const done=all.filter(x=>x.checked).length;
 $("todayMetric").textContent=done+" / "+all.length;
 $("todayMetricNote").textContent=all.length?"Выполнено сегодня":"Создай свои пункты в настройках";
 if(!all.length)empty(list,"Пока ничего не запланировано. Пункты можно создать в настройках.");
 for(const task of all.slice(0,7))list.append(row(task.title,task.sub,{time:task.time,checked:task.checked,checkbox:checked=>change(s=>{
  if(task.kind==="task")s.tasks.find(x=>x.id===task.obj.id).done=checked;
  else{const key=M.keyFor(task.obj,today);if(checked)s.done[key]=true;else delete s.done[key]}
 })}));
 if(all.length>7)list.append(lbl("p","Ещё "+(all.length-7)+" пунктов…","muted tiny"));
 const totals=M.monthTotals(state,M.monthOf(today));
 $("spendMetric").textContent=M.money(totals.expense,state.currency);
 const lim=state.expenseCats.reduce((sum,x)=>sum+x.limit,0);
 $("spendMetricNote").textContent=lim?"Общий лимит категорий: "+M.money(lim,state.currency):"Месячные лимиты — в настройках";
 $("shopMetric").textContent=state.shopping.filter(x=>!x.done).length;
 const recent=$("overviewMoney");recent.replaceChildren();
 const tx=state.transactions.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).slice(0,6);
 if(!tx.length)empty(recent,"Операций пока нет. Добавь первый доход или расход.");
 for(const t of tx)recent.append(row(t.note||catName(t.kind,t.category),t.date+" · "+catName(t.kind,t.category),{
  actions:[lbl("span",(t.kind==="income"?"+":"−")+M.money(t.amount,state.currency),"row-amount")]
 }));
 // Hidden sections should disappear from overview as well, not only the navigation.
 $("spendMetric").closest(".stat").hidden=hiddenSec("money");
 $("overviewMoney").closest(".panel").hidden=hiddenSec("money");
 $("todayMetric").closest(".stat").hidden=hiddenSec("planner");
 $("overviewTasks").closest(".panel").hidden=hiddenSec("planner");
 $("shopMetric").closest(".stat").hidden=hiddenSec("shopping");
 $("overviewTasks").closest(".panel").querySelector("[data-go=planner]").disabled=hiddenSec("planner");
 $("overviewMoney").closest(".panel").querySelector("[data-go=money]").disabled=hiddenSec("money");
}
function renderPlanner(){
 const start=M.monday(selected),first=new Date(start+"T12:00:00"),last=M.addDays(start,6);
 $("weekLabel").textContent=new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long"}).format(first)+" — "+new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric"}).format(new Date(last+"T12:00:00"));
 const days=$("weekDays");days.replaceChildren();
 for(let i=0;i<7;i++){const date=M.addDays(start,i),d=new Date(date+"T12:00:00");const btn=lbl("button",undefined,"day"+(date===selected?" active":""));btn.type="button";
 btn.append(lbl("span",["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][i]),lbl("small",String(d.getDate())));
 btn.setAttribute("aria-label",new Intl.DateTimeFormat("ru-RU",{weekday:"long",day:"numeric",month:"long"}).format(d));btn.setAttribute("aria-pressed",date===selected?"true":"false");
 btn.addEventListener("click",()=>{selected=date;renderPlanner()});days.append(btn)}
 sectionOptions($("taskSection"),["money","shopping"]);
 const tasks=state.tasks.filter(t=>t.date===selected);
 const templates=activeItems("planner",selected).map(i=>({...i,isTemplate:true}));
 const mixed=[...tasks.map(t=>({...t,isTemplate:false})),...templates].sort((a,b)=>(a.time||"99:99").localeCompare(b.time||"99:99")||a.title.localeCompare(b.title,"ru"));
 const completed=mixed.filter(t=>t.isTemplate?t.checked:t.done).length;
 $("plannerCount").textContent=completed+" из "+mixed.length;
 const target=$("plannerRows");target.replaceChildren();
 if(!mixed.length)empty(target,"Пока нет дел на этот день.");
 for(const t of mixed){
  if(t.isTemplate){
   target.append(row(t.title,"Повтор: "+(t.repeat==="daily"?"ежедневно":t.repeat==="weekly"?"еженедельно":"однократно"),{
    time:t.time,checked:t.checked,checkbox:v=>change(s=>{if(v)s.done[t.key]=true;else delete s.done[t.key]})
   }));
  }else{
   target.append(row(t.title,secName(t.section),{time:t.time,checked:t.done,checkbox:checked=>change(s=>{s.tasks.find(x=>x.id===t.id).done=checked}),
    actions:[removeButton("Удалить задачу",()=>{if(ask("Удалить дело «"+t.title+"»?"))change(s=>{s.tasks=s.tasks.filter(x=>x.id!==t.id)})})]}));
  }
 }
}
function renderMoney(){
 const [year,m]=month.split("-").map(Number);
 $("monthTitle").textContent=new Intl.DateTimeFormat("ru-RU",{month:"long",year:"numeric"}).format(new Date(year,m-1,1));
 const totals=M.monthTotals(state,month);
 $("incomeTotal").textContent=M.money(totals.income,state.currency);
 $("expenseTotal").textContent=M.money(totals.expense,state.currency);
 $("balanceTotal").textContent=M.money(totals.balance,state.currency);
 categoryOptions($("txCategory"),$("txType").value==="income"?state.incomeCats:state.expenseCats);
 const bars=$("categoryBars");bars.replaceChildren();
 const cats=state.expenseCats.filter(c=>totals.spent[c.id]||c.limit),max=Math.max(1,...cats.map(c=>totals.spent[c.id]||0));
 if(!cats.length)empty(bars,"Пока нет расходов и настроенных лимитов.");
 for(const c of cats){
  const amount=totals.spent[c.id]||0,ratio=c.limit?amount/c.limit:amount/max;
  const block=lbl("div",undefined,"bar-item"+(c.limit&&amount>c.limit?" over":""));
  const summary=lbl("div",undefined,"bar-details");summary.append(lbl("strong",c.title));
  summary.append(lbl("small",M.money(amount,state.currency)+(c.limit?" / "+M.money(c.limit,state.currency):"")));
  const track=lbl("div",undefined,"bar-track"),fill=lbl("div",undefined,"bar-fill");
  fill.style.width=Math.min(100,Math.round(ratio*100))+"%";track.append(fill);block.append(summary,track);bars.append(block);
 }
 renderSubscriptions();
 const target=$("txRows");target.replaceChildren();
 const q=$("txSearch").value.trim().toLocaleLowerCase("ru"),type=$("txFilter").value;
 const data=state.transactions.filter(t=>M.monthOf(t.date)===month&&(type==="all"||t.kind===type)&&(!q||[t.note,catName(t.kind,t.category)].some(v=>v.toLocaleLowerCase("ru").includes(q)))).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
 $("txCount").textContent=data.length+" операций";
 if(!data.length)empty(target,"Операций за выбранный месяц нет.");
 for(const t of data){
  const edit=actionButton("Изменить",()=>editTransaction(t.id),"btn small");
  const del=removeButton("Удалить операцию",()=>{
   if(ask("Удалить запись «"+(t.note||catName(t.kind,t.category))+"» на "+M.money(t.amount,state.currency)+"?")){
    change(s=>{s.transactions=s.transactions.filter(x=>x.id!==t.id)});
    if(editingTx===t.id)cancelTxEdit();
   }
  });
  target.append(row(t.note||catName(t.kind,t.category),t.date+" · "+catName(t.kind,t.category),{
   actions:[lbl("span",(t.kind==="income"?"+":"−")+M.money(t.amount,state.currency),"row-amount"),edit,del]
  }));
 }
}
function renderSubscriptions(){
 const out=$("subscriptionRows");out.replaceChildren();
 const data=state.subscriptions.filter(s=>s.active).slice().sort((a,b)=>a.day-b.day||a.title.localeCompare(b.title,"ru"));
 if(!data.length)empty(out,"Счета и подписки ещё не настроены. Создай их в настройках.");
 for(const sub of data){
  const paid=state.transactions.find(t=>t.kind==="expense"&&t.subscriptionId===sub.id&&M.monthOf(t.date)===month);
  const date=M.dueDate(month,sub.day);
  const btn=actionButton(paid?"Оплачено":"Записать оплату",()=>{
   if(paid)return;
   if(!ask("Добавить платёж «"+sub.title+"» на "+M.money(sub.amount,state.currency)+" в журнал "+month+"?"))return;
   const actual=M.monthOf(M.localDate())===month?M.localDate():date;
   if(change(s=>{
    if(s.transactions.some(t=>t.subscriptionId===sub.id&&M.monthOf(t.date)===month))throw Error("Уже есть оплата за этот месяц");
    s.transactions.push({id:M.uid(),kind:"expense",date:actual,amount:sub.amount,category:sub.category,note:sub.title,subscriptionId:sub.id});
   }))toast("Оплата записана в расходы");
  },paid?"btn small":"btn small primary");
  if(paid)btn.disabled=true;
  out.append(row(sub.title,M.money(sub.amount,state.currency)+" · до "+date+" · "+catName("expense",sub.category),{actions:[btn]}));
 }
}
function editTransaction(id){
 const t=state.transactions.find(x=>x.id===id);if(!t)return;
 editingTx=id;$("txFormTitle").textContent="Редактирование операции";$("txSubmit").textContent="Сохранить изменения";$("txCancel").hidden=false;
 $("txType").value=t.kind;categoryOptions($("txCategory"),t.kind==="income"?state.incomeCats:state.expenseCats);
 $("txDate").value=t.date;$("txAmount").value=(t.amount/100).toFixed(2).replace(".",",");
 $("txCategory").value=t.category;$("txNote").value=t.note;
 $("txForm").scrollIntoView({block:"center",behavior:"smooth"});
}
function cancelTxEdit(){
 editingTx=null;$("txForm").reset();$("txFormTitle").textContent="Новая операция";$("txSubmit").textContent="Записать";$("txCancel").hidden=true;
 $("txDate").value=M.localDate();categoryOptions($("txCategory"),state.expenseCats);
}
function renderShopping(){
 categoryOptions($("shopCategory"),state.shopCats);
 const list=$("shopRows");list.replaceChildren();
 const rows=state.shopping.slice().sort((a,b)=>Number(a.done)-Number(b.done));
 $("shopCount").textContent=rows.filter(x=>!x.done).length+" купить / "+rows.length+" всего";
 if(!rows.length)empty(list,"Список пуст.");
 for(const it of rows){
  list.append(row(it.title,[it.qty,catName("shopping",it.category)].filter(Boolean).join(" · "),{
   checked:it.done,checkbox:v=>change(s=>{s.shopping.find(x=>x.id===it.id).done=v}),
   actions:[removeButton("Удалить товар",()=>{if(ask("Удалить «"+it.title+"»?"))change(s=>{s.shopping=s.shopping.filter(x=>x.id!==it.id)})})]
  }));
 }
 $("clearPurchased").disabled=!state.shopping.some(x=>x.done);
}
function renderHome(){
 const home=$("homeRoutineRows");home.replaceChildren();
 const count=templateRows(home,"home",M.localDate());
 $("homeRoutinePanel").hidden=!count;
 const pantry=$("pantryRows");pantry.replaceChildren();
 $("pantryCount").textContent=state.pantry.length+" позиций";
 if(!state.pantry.length)empty(pantry,"Запасов пока нет.");
 for(const i of state.pantry)pantry.append(row(i.title,i.qty,{actions:[removeButton("Удалить из запасов",()=>{if(ask("Удалить «"+i.title+"» из запасов?"))change(s=>{s.pantry=s.pantry.filter(x=>x.id!==i.id)})})]}));
 const plants=$("plantRows");plants.replaceChildren();
 $("plantCount").textContent=state.plants.length+" растений";
 if(!state.plants.length)empty(plants,"Добавь растения, если они есть.");
 for(const p of state.plants){
  const edit=actionButton("Изменить",()=>{const name=prompt("Название растения",p.title);if(name===null)return;
   const note=prompt("Заметка об уходе",p.note);if(note===null)return;
   change(s=>{const x=s.plants.find(z=>z.id===p.id);x.title=name.trim().slice(0,140);x.note=note.trim().slice(0,200)});
  },"btn small");
  const water=actionButton("Полито сегодня",()=>change(s=>{s.plants.find(x=>x.id===p.id).watered=M.localDate()}));
  const del=removeButton("Удалить растение",()=>{if(ask("Удалить запись «"+p.title+"»?"))change(s=>{s.plants=s.plants.filter(x=>x.id!==p.id)})});
  plants.append(row(p.title,[p.note,p.watered?"Последний полив: "+p.watered:""].filter(Boolean).join(" · "),{actions:[water,edit,del]}));
 }
}
function renderCustom(){
 const s=state.sections.find(x=>x.id===customSection);
 if(!s)return;const target=$("customRows");target.replaceChildren();
 $("customTitle").textContent=s.title;
 const c=templateRows(target,s.id,M.localDate());
 const tasks=state.tasks.filter(t=>t.section===s.id&&t.date===M.localDate());
 for(const t of tasks)target.append(row(t.title,"Разовое дело",{checked:t.done,checkbox:v=>change(d=>{d.tasks.find(x=>x.id===t.id).done=v})}));
 if(!c&&!tasks.length)empty(target,"Здесь ещё нет пунктов. Открой «Настройки», чтобы создать их.");
}
function settingRow(title,description,actions){
 const rowEl=lbl("div",undefined,"settings-row"),head=lbl("div");
 head.append(lbl("div",title,"labeltext"));if(description)head.append(lbl("div",description,"description"));
 const controls=lbl("div",undefined,"controls");
 for(const a of actions)controls.append(a);
 rowEl.append(head,controls);return rowEl;
}
function configureRename(kind,id){
 const lists={sections:"sections",expenses:"expenseCats",incomes:"incomeCats",shops:"shopCats"};
 const key=lists[kind],obj=state[key].find(x=>x.id===id);
 if(!obj)return;
 const value=window.prompt("Новое название",obj.title);
 if(value===null)return;
 const title=value.trim().slice(0,kind==="sections"?36:40);
 if(!title){toast("Название не может быть пустым.");return}
 if(state[key].some(x=>x.id!==id&&x.title.toLocaleLowerCase("ru")===title.toLocaleLowerCase("ru"))){toast("Такое название уже есть.");return}
 change(s=>{s[key].find(x=>x.id===id).title=title});
}
function renderSettings(){
 const target=$("settingsSections");target.replaceChildren();
 for(const s of state.sections){
  const visibility=document.createElement("input");visibility.type="checkbox";visibility.checked=s.visible;
  visibility.setAttribute("aria-label","Показывать раздел "+s.title);
  visibility.addEventListener("change",()=>change(doc=>{doc.sections.find(x=>x.id===s.id).visible=visibility.checked}));
  const options=[visibility,actionButton("Название",()=>configureRename("sections",s.id))];
  if(s.kind==="custom")options.push(removeButton("Удалить раздел",()=>{
   const itemCount=state.items.filter(x=>x.section===s.id).length,taskCount=state.tasks.filter(x=>x.section===s.id).length;
   if(!ask("Удалить раздел «"+s.title+"» и его "+itemCount+" пунктов? "+taskCount+" разовых дел перейдут в Календарь."))return;
   change(doc=>{
    const remove=doc.items.filter(x=>x.section===s.id).map(x=>x.id);
    doc.sections=doc.sections.filter(x=>x.id!==s.id);
    doc.items=doc.items.filter(x=>x.section!==s.id);
    for(const key of Object.keys(doc.done))if(remove.some(id=>key.startsWith(id+"@")))delete doc.done[key];
    for(const task of doc.tasks)if(task.section===s.id)task.section="planner";
   });
  }));
  target.append(settingRow(s.title,s.kind==="builtin"?"Стандартный раздел":"Свой раздел",options));
 }
 const items=$("settingsItems");items.replaceChildren();
 for(const item of state.items){
  items.append(settingRow(item.title,secName(item.section)+" · "+(item.repeat==="daily"?"каждый день":item.repeat==="weekly"?"по "+["пн","вт","ср","чт","пт","сб","вс"][item.weekday]:"однократно")+(item.time?" · "+item.time:""),[
   actionButton("Изменить",()=>{editingItem=item.id;$("itemName").value=item.title;$("itemSection").value=item.section;$("itemRepeat").value=item.repeat;$("itemWeekday").value=String(item.weekday);$("itemWeekdayField").hidden=item.repeat!=="weekly";$("itemTime").value=item.time;$("itemForm button[type=submit]").textContent="Сохранить изменения";$("itemName").focus()}),
   removeButton("Удалить пункт",()=>{if(ask("Удалить пункт «"+item.title+"» и его отметки?"))change(doc=>{doc.items=doc.items.filter(x=>x.id!==item.id);for(const k of Object.keys(doc.done))if(k.startsWith(item.id+"@"))delete doc.done[k]})})
  ]));
 }
 if(!state.items.length)empty(items,"Пунктов нет. Создай ежедневные, еженедельные или разовые записи.");
 sectionOptions($("itemSection"),["money","shopping"]);
 for(const [key,id,kind] of [["expenseCats","settingsExpenses","expenses"],["incomeCats","settingsIncomes","incomes"],["shopCats","settingsShopCats","shops"]]){
  const div=$(id);div.replaceChildren();
  for(const c of state[key]){
   const actions=[actionButton("Переименовать",()=>configureRename(kind,c.id))];
   if(key==="expenseCats"){
    const group=lbl("form",undefined,"limit-form"),label=lbl("label");
    const inp=document.createElement("input");inp.type="text";inp.inputMode="decimal";inp.maxLength=18;inp.value=c.limit?(c.limit/100).toFixed(2).replace(".",","):"";
    inp.setAttribute("aria-label","Месячный лимит: "+c.title);
    const save=actionButton("Лимит",()=>{try{const val=inp.value.trim()?M.parseMinor(inp.value):0;change(doc=>{doc.expenseCats.find(x=>x.id===c.id).limit=val});toast("Лимит категории сохранён")}catch(err){toast(err.message)}});
    save.className="btn small";group.append(inp,save);actions.unshift(group);
   }
   actions.push(removeButton("Удалить категорию",()=>{
    if(state[key].length===1){toast("Нельзя удалить последнюю категорию.");return}
    const used=key==="expenseCats"?(state.transactions.some(t=>t.kind==="expense"&&t.category===c.id)||state.subscriptions.some(t=>t.category===c.id)):key==="incomeCats"?state.transactions.some(t=>t.kind==="income"&&t.category===c.id):state.shopping.some(v=>v.category===c.id);
    if(used){toast("Категория используется в записях. Переименуй её, чтобы сохранить историю.");return}
    if(ask("Удалить категорию «"+c.title+"»?"))change(doc=>{doc[key]=doc[key].filter(x=>x.id!==c.id)});
   }));
   div.append(settingRow(c.title,key==="expenseCats"?"Бюджет действует каждый месяц":"",actions));
  }
 }
 const subscriptions=$("settingsSubscriptions");subscriptions.replaceChildren();
 for(const sub of state.subscriptions){
  const toggle=document.createElement("input");toggle.type="checkbox";toggle.checked=sub.active;
  toggle.setAttribute("aria-label","Регулярный платёж включён: "+sub.title);
  toggle.addEventListener("change",()=>change(s=>{s.subscriptions.find(x=>x.id===sub.id).active=toggle.checked}));
  subscriptions.append(settingRow(sub.title,M.money(sub.amount,state.currency)+" · "+sub.day+"-го числа · "+catName("expense",sub.category),[
   toggle,
   actionButton("Изменить",()=>{
    editingSubscription=sub.id;$("subscriptionName").value=sub.title;$("subscriptionAmount").value=(sub.amount/100).toFixed(2).replace(".",",");
    $("subscriptionDay").value=sub.day;$("subscriptionCategory").value=sub.category;
    $("subscriptionSave").textContent="Сохранить изменения";$("subscriptionCancel").hidden=false;$("subscriptionName").focus();
   }),
   removeButton("Удалить регулярный платёж",()=>{
    if(!ask("Удалить шаблон «"+sub.title+"»? Уже записанные расходы останутся в журнале."))return;
    change(s=>{s.subscriptions=s.subscriptions.filter(x=>x.id!==sub.id);for(const t of s.transactions)if(t.subscriptionId===sub.id)t.subscriptionId=""});
   })
  ]));
 }
 if(!state.subscriptions.length)empty(subscriptions,"Регулярных платежей нет.");
 categoryOptions($("subscriptionCategory"),state.expenseCats);
 $("currencySetting").value=state.currency;$("themeSetting").value=state.theme;
 $("restorePrevious").disabled=!localStorage.getItem(M.RECOVERY);
}
function render(){
 document.body.dataset.theme=state.theme;
 $("themeToggle").textContent=state.theme==="dark"?"☼":"☾";
 renderNav();renderOverview();renderPlanner();renderMoney();renderShopping();renderHome();renderSettings();
 if(view.startsWith("custom:")){customSection=view.slice(7);renderCustom()}
 $("todayText").textContent=new Intl.DateTimeFormat("ru-RU",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
}
function download(name,content,type="application/json"){
 const file=new Blob([content],{type}),link=document.createElement("a"),url=URL.createObjectURL(file);
 link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),15000);
}
function exportBackup(){const value={format:"ordinary-day-backup",version:1,exportedAt:new Date().toISOString(),data:state};
 download("ordinary-day-"+M.localDate()+".json",JSON.stringify(value,null,2));toast("Резервная копия сохранена в файл.");}
function restoreDocument(next){
 // The current user data is retained as an emergency backup before replacing it.
 const checked=M.validate(next),before=localStorage.getItem(M.STORE);
 if(before!==null)localStorage.setItem(M.RECOVERY,before);
 localStorage.setItem(M.STORE,JSON.stringify(checked));
 state=checked;broken=false;editingTx=null;editingItem=null;
 selected=M.localDate();month=M.monthOf(selected);render();setView("overview");
 toast("Копия восстановлена. Предыдущие записи сохранены для отмены.",7000);
}
function safeRestore(input){const parsed=JSON.parse(input);if(parsed?.format!=="ordinary-day-backup"||parsed.version!==1||!parsed.data)throw Error("Это не резервная копия приложения «Обычный день»");restoreDocument(parsed.data)}
function bind(){
 for(const btn of document.querySelectorAll("[data-go]"))btn.addEventListener("click",()=>setView(btn.dataset.go));
 $("themeToggle").onclick=()=>change(s=>{s.theme=s.theme==="dark"?"light":"dark"});
 $("themeSetting").onchange=e=>change(s=>{s.theme=e.target.value});
 $("currencySetting").onchange=e=>{
  if(state.transactions.length||state.subscriptions.length||state.expenseCats.some(c=>c.limit)){e.target.value=state.currency;toast("Валюта зафиксирована: уже есть операции, лимиты или регулярные платежи. Суммы не пересчитываются автоматически.");return}
  change(s=>{s.currency=e.target.value});
 };
 $("prevWeek").onclick=()=>{selected=M.addDays(selected,-7);renderPlanner()};
 $("nextWeek").onclick=()=>{selected=M.addDays(selected,7);renderPlanner()};
 $("todayWeek").onclick=()=>{selected=M.localDate();renderPlanner()};
 $("taskForm").onsubmit=e=>{
  e.preventDefault();const title=$("taskTitle").value.trim();if(!title)return;
  if(change(s=>s.tasks.push({id:M.uid(),title: title.slice(0,160),date:selected,section:$("taskSection").value,time:$("taskTime").value||"",done:false}))){
   $("taskForm").reset();toast("Дело добавлено");
  }
 };
 $("prevMonth").onclick=()=>{month=M.shiftMonth(month,-1);renderMoney()};
 $("nextMonth").onclick=()=>{month=M.shiftMonth(month,1);renderMoney()};
 $("txType").onchange=()=>categoryOptions($("txCategory"),$("txType").value==="expense"?state.expenseCats:state.incomeCats);
 $("txSearch").oninput=()=>renderMoney();
 $("txFilter").onchange=()=>renderMoney();
 $("txForm").onsubmit=e=>{
  e.preventDefault();
  try{
   const t={id:editingTx||M.uid(),kind:$("txType").value,date:$("txDate").value,
    amount:M.parseMinor($("txAmount").value),category:$("txCategory").value,note:$("txNote").value.trim().slice(0,160),subscriptionId:editingTx?(state.transactions.find(x=>x.id===editingTx)?.subscriptionId||""):""};
   const successful=change(s=>{if(editingTx){const i=s.transactions.findIndex(x=>x.id===editingTx);if(i<0)throw Error("Операция не найдена");s.transactions[i]=t}else s.transactions.push(t)});
   if(successful){cancelTxEdit();toast("Операция сохранена")}
  }catch(err){toast(err.message)}
 };
 $("txCancel").onclick=cancelTxEdit;
 $("subscriptionForm").onsubmit=e=>{
  e.preventDefault();
  try{
   const entry={id:editingSubscription||M.uid(),title:$("subscriptionName").value.trim().slice(0,100),
    amount:M.parseMinor($("subscriptionAmount").value),day:Number($("subscriptionDay").value),
    category:$("subscriptionCategory").value,active:editingSubscription?state.subscriptions.find(x=>x.id===editingSubscription)?.active!==false:true};
   if(!Number.isInteger(entry.day)||entry.day<1||entry.day>31)throw Error("Число месяца должно быть от 1 до 31");
   if(change(s=>{
    if(editingSubscription){const i=s.subscriptions.findIndex(x=>x.id===editingSubscription);if(i<0)throw Error("Платёж не найден");s.subscriptions[i]=entry}
    else s.subscriptions.push(entry);
   })){editingSubscription=null;$("subscriptionForm").reset();$("subscriptionSave").textContent="Добавить платёж";$("subscriptionCancel").hidden=true;toast("Регулярный платёж сохранён")}
  }catch(err){toast(err.message)}
 };
 $("itemRepeat").onchange=()=>{$("itemWeekdayField").hidden=$("itemRepeat").value!=="weekly"};
 $("subscriptionCancel").onclick=()=>{editingSubscription=null;$("subscriptionForm").reset();$("subscriptionSave").textContent="Добавить платёж";$("subscriptionCancel").hidden=true};
 $("exportCsv").onclick=()=>download("expenses-"+month+".csv",M.csvTransactions(state,month),"text/csv;charset=utf-8");
 $("shopForm").onsubmit=e=>{
  e.preventDefault();const title=$("shopName").value.trim();if(!title)return;
  if(change(s=>{s.shopping.push({id:M.uid(),title,qty:$("shopQty").value.trim(),category:$("shopCategory").value,done:false})})){$("shopForm").reset();toast("Товар добавлен")}
 };
 $("clearPurchased").onclick=()=>{
  const count=state.shopping.filter(x=>x.done).length;
  if(count&&ask("Удалить "+count+" купленных товаров?"))change(s=>{s.shopping=s.shopping.filter(x=>!x.done)});
 };
 $("pantryForm").onsubmit=e=>{
  e.preventDefault();const title=$("pantryName").value.trim();if(!title)return;
  if(change(s=>{s.pantry.push({id:M.uid(),title,qty:$("pantryQty").value.trim()})})){$("pantryForm").reset();toast("Запас добавлен")}
 };
 $("plantForm").onsubmit=e=>{
  e.preventDefault();const title=$("plantName").value.trim();if(!title)return;
  if(change(s=>{s.plants.push({id:M.uid(),title,note:$("plantNote").value.trim(),watered:""})})){$("plantForm").reset();toast("Растение добавлено")}
 };
 $("sectionForm").onsubmit=e=>{
  e.preventDefault();const title=$("sectionName").value.trim().slice(0,36);
  if(!title)return;
  if(state.sections.some(x=>x.title.toLocaleLowerCase("ru")===title.toLocaleLowerCase("ru"))){toast("Раздел с таким названием уже существует.");return}
  if(change(s=>{s.sections.push({id:M.uid(),title,kind:"custom",visible:true})})){$("sectionForm").reset();toast("Новый раздел создан")}
 };
 $("itemForm").onsubmit=e=>{
  e.preventDefault();const title=$("itemName").value.trim();if(!title)return;
  const updated={id:editingItem||M.uid(),title,section:$("itemSection").value,repeat:$("itemRepeat").value,weekday:Number($("itemWeekday").value),time:$("itemTime").value||""};
  if(change(s=>{if(editingItem){const i=s.items.findIndex(v=>v.id===editingItem);if(i<0)throw Error("Пункт не найден");s.items[i]=updated}else s.items.push(updated)})){
   editingItem=null;$("itemForm").reset();$("itemWeekdayField").hidden=true;$("itemForm button[type=submit]").textContent="Добавить пункт";toast("Пункт сохранён")}
 };
 for(const [form,id,key] of [["expenseCatForm","expenseCatName","expenseCats"],["incomeCatForm","incomeCatName","incomeCats"],["shopCatForm","shopCatName","shopCats"]]){
  $(form).onsubmit=e=>{
   e.preventDefault();const title=$(id).value.trim().slice(0,40);if(!title)return;
   if(state[key].some(c=>c.title.toLocaleLowerCase("ru")===title.toLocaleLowerCase("ru"))){toast("Такая категория уже существует");return}
   if(change(s=>{const entry={id:M.uid(),title};if(key==="expenseCats")entry.limit=0;s[key].push(entry)})){
    $(form).reset();toast("Категория добавлена")}
  };
 }
 $("backupDownload").onclick=exportBackup;
 $("backupUpload").onchange=async event=>{
  const file=event.target.files?.[0];event.target.value="";if(!file)return;
  if(file.size>5*1024*1024){toast("Файл слишком большой (не больше 5 МБ)");return}
  try{
   const raw=await file.text(),parsed=JSON.parse(raw);
   if(parsed?.format!=="ordinary-day-backup"||parsed.version!==1||!parsed.data)throw Error("Неверный формат файла");
   const checked=M.validate(parsed.data);
   if(!ask("Заменить все данные этого браузера содержимым выбранной копии? Предыдущие записи будут сохранены для отмены."))return;
   restoreDocument(checked);
  }catch(err){toast("Копия не восстановлена: "+err.message,7500)}
 };
 $("restorePrevious").onclick=()=>{
  const old=localStorage.getItem(M.RECOVERY);if(!old){toast("Предыдущей копии нет");return}
  if(!ask("Вернуть данные, сохранённые до последнего восстановления? Текущие данные станут аварийной копией."))return;
  try{restoreDocument(JSON.parse(old))}catch(err){toast("Не удалось отменить восстановление: "+err.message)}
 };
 $("deleteAll").onclick=()=>{
  if(!ask("Удалить ВСЕ данные этого устройства? Сначала скачай резервную копию. Отменить удаление без файла нельзя."))return;
  const word=prompt("Для подтверждения введи УДАЛИТЬ","");
  if(word!=="УДАЛИТЬ"){toast("Удаление отменено");return}
  try{localStorage.removeItem(M.STORE);localStorage.removeItem(M.RECOVERY);state=M.blank();broken=false;selected=M.localDate();month=M.monthOf(selected);render();setView("overview");toast("Данные удалены с этого устройства")}
  catch(err){toast("Ошибка удаления: "+err.message)}
 };
 if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{}));
}
$("txDate").value=M.localDate();render();bind();
const target=decodeURIComponent(location.hash.slice(1));
if(target)setView(target);else setView("overview");
if(broken)toast("Сохранённые данные повреждены или недоступны. Импортируй копию из настроек.",9000);
})();