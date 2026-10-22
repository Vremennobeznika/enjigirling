const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const model=require('../life/planner/model.js');
const agent=fs.readFileSync('life/active-reminders.js','utf8');
const pwa=fs.readFileSync('life-pwa-sw.js','utf8');
new vm.Script(agent);
new vm.Script(pwa);
const c={window:{}};vm.runInNewContext(fs.readFileSync('life/planner/config.js','utf8'),c);
const oldDate=new Date(2026,9,23,12,10);
const day=model.mondayDay(oldDate);
const fixture={version:2,sections:c.window.LIFE_CONFIG.sections,tasks:[{id:'t',sectionId:'personal',title:'Тестовая задача',time:'12:00',days:[day],remind:true,active:true}],shopping:[],ledger:[],completions:{},sent:{},snoozes:{},preferences:{quietStart:'23:00',quietEnd:'07:00',currency:'₽',sound:false}};
const memory=new Map([
 ['week-check-v2',JSON.stringify({__planner_v3:fixture,'2026-10-22-0':true})],
 ['supermarket-shopping-list-v1',JSON.stringify([{id:'bread',name:'Хлеб',cat:'bakery',qty:'1',time:'12:05',remind:true,done:false}])]
]);
const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
class Element{constructor(tag){this.tag=tag;this.style={};this.dataset={};this.children=[];this.hidden=false}setAttribute(){}append(...children){this.children.push(...children)}all(){return [this,...this.children.flatMap(c=>typeof c.all==='function'?c.all():[c])]}querySelector(sel){return this.all().find(c=>c.className===sel.slice(1))}}
const nodes=[],events=[];
const document={readyState:'loading',hidden:false,getElementById:id=>nodes.find(n=>n.id===id)||null,createElement:t=>new Element(t),body:{append:n=>nodes.push(n)},addEventListener(){}};
class FixedDate extends Date{constructor(...a){if(a.length)super(...a);else super(2026,9,23,12,10)}static now(){return oldDate.valueOf()}}
const window={LIFE_CONFIG:c.window.LIFE_CONFIG,LifeModel:model,dispatchEvent:e=>events.push(e.type)};
const ctx={window,document,localStorage:storage,navigator:{},location:{href:'https://test.example/enjigirling/life/',origin:'https://test.example',pathname:'/enjigirling/life/'},Date:FixedDate,Event:class{constructor(type){this.type=type}},setInterval:()=>1,URL,console};
vm.runInNewContext(agent,ctx);
const alerts=window.LifeReminderAgent.pending(oldDate);
assert.equal(alerts.length,2,'both editor tasks and canonical shopping reminders are due');
window.LifeReminderAgent.tick();
const box=nodes[0],buttons=box.all().filter(el=>el.dataset&&el.dataset.action);
assert.equal(box.hidden,false,'a reminder is shown while the app is open');
const claimed=JSON.parse(memory.get('week-check-v2')).__planner_v3.sent;
assert.equal(Object.keys(claimed).length,2,'reminders are claimed exactly once');
buttons.find(b=>b.dataset.action==='done').onclick();
const updated=JSON.parse(memory.get('week-check-v2'));
assert.equal(updated['2026-10-22-0'],true,'original pill marks remain unchanged');
assert.equal(Object.keys(updated.__planner_v3.completions).length,1,'done task is recorded');
buttons.find(b=>b.dataset.action==='done').onclick();
assert.equal(JSON.parse(memory.get('supermarket-shopping-list-v1'))[0].done,true,'purchase completion is written to the original shopping list');
assert.ok(events.includes('life-data-changed'));
assert.match(pwa,/notificationclick/,'installed PWA opens a notification target');
console.log('PASS: reminders across personal pages, task/purchase completion, untouched pill marks, PWA notification clicks');
