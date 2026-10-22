// Regression tests for the owner's personal dashboard. No network, YDB or credentials.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const syncJs = fs.readFileSync('life/auto-sync.js', 'utf8');
const lifeHtml = fs.readFileSync('life/index.html', 'utf8');
const calendarHtml = fs.readFileSync('calendar/index.html', 'utf8');
const KEYS = {calendar:'week-check-v2',shopping:'supermarket-shopping-list-v1',tasks:'life-inbox-v1',pantry:'life-pantry-v1',plants:'life-plants-v1'};
const blank = () => ({calendar:{},shopping:[],tasks:[],pantry:[],plants:[]});
const item = (id,name) => ({id,name,cat:'bakery',qty:'',done:false});
const task = (id,name) => ({id,name,category:'Дела',priority:'normal',done:false});
function storage(map) {
  return {
    getItem:k=>map.has(k)?map.get(k):null,
    setItem:(k,v)=>{map.set(k,String(v))},
    removeItem:k=>map.delete(k)
  };
}
function device({local=blank(),remote=blank(),revision=0,base=null}={}) {
  const items = new Map([
    ['life-sync-secret-saved-v1','TEST-ONLY-NOT-A-REAL-KEY'],
    ['life-sync-auto-v1','on'],
    ['life-sync-endpoint-v1','https://functions.yandexcloud.net/test']
  ]);
  const session = new Map(), events = [], calls=[];
  Object.entries(KEYS).forEach(([section,key])=>items.set(key,JSON.stringify(local[section])));
  if(base)items.set('life-sync-state-v2',JSON.stringify(base));
  let remoteData=remote,remoteRevision=revision;
  const fetch=async(_url,request)=>{
    calls.push(request.method);
    if(request.method==='GET')
      return {ok:true,status:200,json:async()=>({revision:remoteRevision,data:remoteRevision?remoteData:null})};
    const payload=JSON.parse(request.body);
    if(payload.revision!==remoteRevision)
      return {ok:false,status:409,json:async()=>({revision:remoteRevision,error:'revision conflict'})};
    remoteData=payload.data;remoteRevision++;
    return {ok:true,status:200,json:async()=>({revision:remoteRevision,saved:true})};
  };
  const window = {dispatchEvent:e=>events.push({name:e.type,detail:e.detail})};
  const document = {readyState:'loading',addEventListener(){},getElementById(){return null}};
  const ctx = {
    window,document,localStorage:storage(items),sessionStorage:storage(session),
    fetch,navigator:{onLine:true},location:{href:'https://example.org/life/'},
    setTimeout:()=>1,clearTimeout(){},setInterval(){},
    AbortController:class {signal={};abort(){}},
    CustomEvent:class {constructor(type,opts){this.type=type;this.detail=opts?.detail}},
    Event:class {constructor(type){this.type=type}},
    confirm:()=>true,
    console,Date,URL,JSON
  };
  vm.runInNewContext(syncJs,ctx,{filename:'life/auto-sync.js',timeout:5000});
  function current(){
    return Object.fromEntries(Object.entries(KEYS).map(([section,key])=>
      [section,JSON.parse(items.get(key)||JSON.stringify(section==='calendar'?{}:[]))]));
  }
  return {api:window.LifeAutoSync,items,session,events,calls,current,remote:()=>remoteData,remoteRevision:()=>remoteRevision};
}
async function checkSync() {
  const source=blank();source.shopping=[item('a','Хлеб')];
  let d=device({remote:source,revision:2});
  await d.api.sync();
  assert.equal(d.current().shopping[0].name,'Хлеб','a clean third device receives cloud records');
  assert.equal(d.items.has('life-sync-state-v2'),true);
  assert.equal(d.calls.join(','),'GET');

  const own=blank();own.tasks=[task('t','Локальная задача')];
  d=device({local:own,remote:source,revision:2});
  await d.api.sync();
  assert.equal(d.api.isConflicted(),true,'do not destroy previously edited third device');
  assert.equal(d.current().tasks.length,1);
  assert.equal(d.calls.join(','),'GET','no remote overwrite on first-time conflict');

  const left=blank(),right=blank();
  left.tasks=[task('t','Локальная задача')];right.shopping=[item('a','Хлеб')];
  d=device({local:left,remote:right,revision:3,base:{revision:2,data:blank()}});
  await d.api.sync();
  assert.equal(d.remote().tasks.length,1,'merge distinct records from devices');
  assert.equal(d.remote().shopping.length,1);
  assert.equal(d.remoteRevision(),4);
  assert.equal(d.current().shopping.length,1);

  const common=blank(),left2=blank(),right2=blank();
  common.tasks=[task('t','Было')];
  left2.tasks=[task('t','На телефоне')];right2.tasks=[task('t','На компьютере')];
  d=device({local:left2,remote:right2,revision:4,base:{revision:3,data:common}});
  await d.api.sync();
  assert.equal(d.api.isConflicted(),true,'do not overwrite simultaneous edits to one field');
  assert.equal(d.remoteRevision(),4);
  assert.equal(d.current().tasks[0].name,'На телефоне');
  assert.equal(d.calls.join(','),'GET');

  const offlineLocal=blank();offlineLocal.calendar['2026-10-22-home-plant-37-54']=true;
  d=device({local:offlineLocal});
  await d.api.sync();
  assert.equal(d.remoteRevision(),1,'upload first snapshot into empty database');
  assert.equal(d.remote().calendar['2026-10-22-home-plant-37-54'],true);
}
function checkRecovery(){
  const begin=lifeHtml.indexOf('const KEYS='),end=lifeHtml.indexOf('function draw(){',begin);
  assert.ok(begin>0&&end>begin,'dashboard exposes its data validation functions');
  const items=new Map(),session=new Map(),views=new Map([['autoSync',{checked:true}]]);
  const before=blank();before.tasks=[task('a','До восстановления')];
  Object.entries(KEYS).forEach(([section,key])=>items.set(key,JSON.stringify(before[section])));
  items.set('life-sync-auto-v1','on');
  items.set('life-sync-state-v2',JSON.stringify({revision:8,data:before}));
  session.set('life-sync-revision-v1','8');
  let refreshed=0;
  const ctx={
    document:{getElementById:id=>views.get(id)||{}},
    window:{LifeAutoSync:{refresh:()=>refreshed++},dispatchEvent(){}},
    localStorage:storage(items),sessionStorage:storage(session),
    crypto:{randomUUID:crypto.randomUUID},Event:class{constructor(type){this.type=type}},
    alert:()=>{},Date,JSON
  };
  vm.runInNewContext(lifeHtml.slice(begin,end)+'\nlet revision=8; function draw(){};globalThis.__restore=restore;',ctx,{timeout:5000});
  const restored=blank();restored.tasks=[task('b','После восстановления')];
  const info=ctx.__restore({version:1,backups:[{savedAt:'2026-10-22T11:00:00Z',data:restored}]});
  assert.match(info,/Защитная копия восстановлена/);
  assert.equal(JSON.parse(items.get(KEYS.tasks))[0].name,'После восстановления');
  assert.equal(JSON.parse(items.get('life-sync-recovery-v1'))[0].data.tasks[0].name,'До восстановления');
  assert.equal(items.get('life-sync-auto-v1'),'off','restoring must pause automatic cloud overwrites');
  assert.equal(items.has('life-sync-state-v2'),false,'old common revision is invalid after restore');
  assert.equal(session.has('life-sync-revision-v1'),false);
  assert.equal(refreshed,1);
  assert.throws(()=>ctx.__restore({data:{calendar:{},tasks:{},shopping:[],pantry:[]}}),/Некорректный раздел/);
  assert.equal(JSON.parse(items.get(KEYS.tasks))[0].name,'После восстановления','invalid import must leave data untouched');
}
function checkRoutine(){
  const match=calendarHtml.match(/const wd=(\[[\s\S]*?\]),we=(\[[\s\S]*?\]),names=/);
  assert.ok(match,'calendar schedules must be statically inspectable');
  const work=JSON.parse(match[1]),weekend=JSON.parse(match[2]);
  assert.equal(work.length,28);assert.equal(weekend.length,25);
  for(const [rows,morning] of [[work,'07:40'],[weekend,'08:40']]){
    assert.equal(rows.filter(x=>x[1].includes('NOW B1')).length,1);
    assert.equal(rows.filter(x=>x[1].includes('NOW фолиевая')).length,1);
    assert.equal(rows.filter(x=>x[1].includes('Летолек')).length,1);
    const magnesium=rows.filter(x=>x[1].includes('VitaMeal'));
    assert.equal(magnesium.length,2);
    assert.ok(magnesium.some(x=>x[0]===morning));
    assert.ok(magnesium.some(x=>x[0]==='18:30'));
    assert.ok(magnesium.every(x=>x[1].includes('после согласования дозы')));
  }
  assert.match(calendarHtml,/350 мг\/сут/,'magnesium safety note must be visible');
  assert.match(calendarHtml,/только по подтверждённым показаниям/,'iron caution must be visible');
  assert.match(lifeHtml,/mainTotal=day<5\?28:25/,'dashboard counter and calendars must agree');
}
async function main() {
  await checkSync();
  checkRecovery();
  checkRoutine();
  console.log('PASS: life app — third-device pull, conflict protection, merge, upload, backup recovery, calendar safety (3 groups)');
}
main().catch(err=>{console.error(err);process.exitCode=1});
