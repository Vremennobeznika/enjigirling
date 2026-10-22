// Personal planner parity and safe shared storage. No Yandex credentials/network.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const model=fs.readFileSync('life/planner/model.js','utf8');
const config=fs.readFileSync('life/planner/config.js','utf8');
const app=fs.readFileSync('life/planner/app.js','utf8');
const home=fs.readFileSync('life/index.html','utf8');
const pwa=fs.readFileSync('life-pwa-sw.js','utf8');
const oldCalendar=fs.readFileSync('calendar/index.html','utf8');
const plantPage=fs.readFileSync('plants/index.html','utf8');
const check=()=>{new Function(model);new Function(config);new Function(app);new Function(pwa)};
check();
assert.match(app,/SHARED_KEY='week-check-v2'/,'personal app uses shared calendar storage');
assert.match(app,/PERSONAL_KEY='__planner_v3'/,'separate, non-destructive namespaced flexible plan');
assert.match(home,/Гибкий планировщик/);
assert.match(home,/гибкий планировщик \(включая финансы/);
assert.match(pwa,/\.\/life\/planner\/model\.js/);
assert.match(oldCalendar,/week-check-v2/);
assert.match(plantPage,/life-plants-v1/);
const configContext={window:{}};
vm.runInNewContext(config,configContext);
const cfg=configContext.window.LIFE_CONFIG;
const defaultState=()=>({
 version:2,sections:cfg.sections,tasks:cfg.tasks,shopping:[],ledger:[],completions:{},sent:{},snoozes:{},
 preferences:{quietStart:'23:00',quietEnd:'07:00',currency:'₽',sound:false}
});
const memory=new Map(),signals=[];
const localStorage={
 getItem:k=>memory.has(k)?memory.get(k):null,
 setItem:(k,v)=>memory.set(k,String(v)),
 removeItem:k=>memory.delete(k)
};
const ctx={
 window:{LIFE_CONFIG:cfg,LifeModel:{normalize:x=>x},dispatchEvent:e=>signals.push(e.type)},
 localStorage,document:{getElementById:()=>null},
 Event:class{constructor(type){this.type=type}},
 setTimeout(){return 1},notice(){},console,Date,JSON,crypto:require('node:crypto').webcrypto
};
const start=app.indexOf('const M='),stop=app.indexOf('const el=');
assert.ok(start>=0&&stop>start);
vm.createContext(ctx);
vm.runInContext(app.slice(start,stop),ctx);
const mark='2026-10-22-0';
const oldMarks={[mark]:true,'2026-10-22-home-plant-1-18':true};
memory.set('week-check-v2',JSON.stringify(oldMarks));
vm.runInContext('state=load();',ctx);
assert.equal(vm.runInContext('state.tasks.length',ctx),0,'start with no duplicated tablet schedule');
vm.runInContext('state.tasks.push({id:"custom",title:"Тестовая встреча",time:"11:00",days:[0],active:true,remind:true});state.ledger.push({id:"money",kind:"expense",amount:12,category:"Test",date:"2026-10-22"});persist();',ctx);
const persisted=JSON.parse(memory.get('week-check-v2'));
assert.equal(persisted[mark],true);
assert.equal(persisted['2026-10-22-home-plant-1-18'],true);
assert.equal(persisted.__planner_v3.tasks[0].title,'Тестовая встреча');
assert.equal(persisted.__planner_v3.ledger.length,1);
assert.equal(signals.includes('life-data-changed'),true);
const writeCount=signals.length;
vm.runInContext('persist()',ctx);
assert.equal(signals.length,writeCount,'unchanged state must not trigger redundant cloud writes');
const validator=home.slice(home.indexOf('function validCalendar(o)'),home.indexOf('function snapshot()'));
vm.runInContext(validator+';globalThis.validate=validCalendar;',ctx);
assert.equal(ctx.validate(persisted).__planner_v3.ledger[0].amount,12,'dashboard backup includes finance and flexible tasks');
assert.equal(ctx.validate(persisted)[mark],true,'dashboard backup keeps original tablet checkboxes');
const newer={...persisted,__planner_v3:{...persisted.__planner_v3,ledger:[...persisted.__planner_v3.ledger,{id:'money2',amount:5}]}};
memory.set('week-check-v2',JSON.stringify(newer));
vm.runInContext('state=load()',ctx);
assert.equal(vm.runInContext('state.ledger.length',ctx),2,'cloud-applied snapshot loads correctly');
const damaged='{not-json';
memory.set('week-check-v2',damaged);
vm.runInContext('state=load()',ctx);
assert.equal(vm.runInContext('persist()',ctx),false);
assert.equal(memory.get('week-check-v2'),damaged,'damaged original calendar is not overwritten');
console.log('PASS: personal full planner parity, schedule preservation, ledger export, cloud namespace, corruption guard, PWA syntax');
