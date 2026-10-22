const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={window:{},Date};vm.runInNewContext(fs.readFileSync('calendar-data.js','utf8'),sandbox,{timeout:5000});
const c=sandbox.window.engineeringCalendar,records=c.holidays,exported=JSON.parse(fs.readFileSync('knowledge/sections/calendar.json','utf8')).records;
assert.deepEqual(JSON.parse(JSON.stringify(records)),exported,'JSON export differs');
const ids=new Set([...fs.readFileSync('data.js','utf8').matchAll(/\bid:\s*"([^"]+)"/g)].map(m=>m[1]));
const unique=new Set();
for(const e of records){
 assert.ok(c.monthNames.includes(e.month),e.name);
 assert.ok(['documented','editorial'].includes(e.kind),e.name);
 assert.ok(e.ids.length>0,e.name);
 for(const id of e.ids)assert.ok(ids.has(id),e.name+' bad ID '+id);
 if(e.kind==='documented')assert.match(e.source,/^https:\/\/www\.consultant\.ru\//,e.name);
 const key=e.month+'|'+e.name;assert.ok(!unique.has(key),'duplicate '+key);unique.add(key);
 for(const year of [2024,2025,2026,2027,2028,2035]){
  const date=c.resolveDate(year,e),dt=new Date(date.time);
  assert.equal(dt.getUTCFullYear(),year,e.name);
  assert.equal(dt.getUTCMonth(),date.monthIndex,e.name);
  assert.equal(dt.getUTCDate(),date.day,e.name);
  assert.ok(date.day>0&&date.day<=31,e.name);
 }
}
function day(n,year){const e=records.find(x=>x.name.includes(n));assert.ok(e,'missing '+n);const d=c.resolveDate(year,e);return d.day+'-'+(d.monthIndex+1)}
const expected=[["День программиста",2024,"12-9"],["День программиста",2025,"13-9"],["День программиста",2028,"12-9"],["День строителя",2026,"9-8"],["День сварщика",2026,"29-5"],["День работников нефтяной",2026,"6-9"],["День работников атомной",2026,"28-9"],["День работников дорожного",2026,"18-10"],["День архитектора (Россия)",2026,"6-7"]];
for(const [name,year,want] of expected)assert.equal(day(name,year),want,name);
assert.equal(day('радиоэлектронной борьбе',2026),'15-4');
assert.equal(records.find(x=>x.name==='День сварщика').since,2025);
assert.equal(records.find(x=>x.name==='День архитектора (Россия)').since,2025);
const page=fs.readFileSync('calendar.html','utf8');
for(const token of ['src="calendar-data.js"','id="yearFilter"','aria-live="polite"','aria-pressed'])assert.ok(page.includes(token),token);
assert.ok(records.length>=55,'event loss');
console.log('PASS CALENDAR: '+records.length+' events, dynamic dates, valid IDs, JSON, evidence.');
