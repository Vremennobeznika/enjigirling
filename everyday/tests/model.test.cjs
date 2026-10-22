const assert=require('node:assert/strict');
const M=require('../model.js');
const blank=M.blank();
assert.equal(blank.sections.length,4);
assert.equal(blank.transactions.length,0);
assert.equal(blank.subscriptions.length,0);
assert.equal(M.validate(blank).sections.length,4);
assert.deepEqual(M.validate(JSON.parse(JSON.stringify(blank))).transactions,[]);
assert.equal(M.parseMinor('15,27'),1527);
assert.equal(M.parseMinor('1 234,56'),123456);
assert.equal(M.parseMinor('0,01'),1);
assert.throws(()=>M.parseMinor('0,00'),/нулю|положительным/);
assert.throws(()=>M.parseMinor('1,234'),/двумя знаками/);
assert.throws(()=>M.parseMinor('1e8'),/Сумма/);
assert.throws(()=>M.parseMinor('=100'),/Сумма/);
assert.equal(M.dueDate('2026-02',31),'2026-02-28');
assert.equal(M.dueDate('2028-02',31),'2028-02-29');
assert.equal(M.monday('2026-10-22'),'2026-10-19');
assert.equal(M.keyFor({id:'p1',repeat:'daily'},'2026-10-22'),'p1@2026-10-22');
assert.equal(M.keyFor({id:'p1',repeat:'weekly'},'2026-10-22'),'p1@2026-10-19-weekly');
assert.equal(M.keyFor({id:'p1',repeat:'once'},'2026-10-22'),'p1@once');
const state=M.blank();
state.items.push({id:'p1',title:'Спорт',section:'home',repeat:'weekly',time:'08:00'});
state.done['p1@2026-10-19-weekly']=true;
state.transactions.push(
 {id:'t1',kind:'income',date:'2026-10-21',amount:200000,category:'salary',note:'Зарплата',subscriptionId:''},
 {id:'t2',kind:'expense',date:'2026-10-22',amount:40099,category:'food',note:'Продукты',subscriptionId:''}
);
state.expenseCats[0].limit=50000;
state.subscriptions.push({id:'net',title:'Интернет',amount:75000,category:'housing',day:31,active:true});
state.transactions.push({id:'t3',kind:'expense',date:'2026-10-22',amount:75000,category:'housing',note:'Интернет',subscriptionId:'net'});
const valid=M.validate(state);
assert.equal(valid.done['p1@2026-10-19-weekly'],true);
assert.equal(valid.transactions[2].subscriptionId,'net');
const summary=M.monthTotals(valid,'2026-10');
assert.equal(summary.income,200000);
assert.equal(summary.expense,115099);
assert.equal(summary.balance,84901);
assert.equal(summary.spent.food,40099);
assert.equal(summary.spent.housing,75000);
assert.equal(M.monthTotals(valid,'2026-09').expense,0);
const csv=M.csvTransactions({...valid,transactions:[
 {id:'x',kind:'expense',date:'2026-10-22',amount:200,category:'food',note:'=HYPERLINK("url")'}
]},'2026-10');
assert.match(csv,/'=HYPERLINK/);
assert.match(csv,/^\ufeff/);
function invalid(mutator,rx){
 const candidate=JSON.parse(JSON.stringify(valid));mutator(candidate);
 assert.throws(()=>M.validate(candidate),rx);
}
invalid(d=>{d.sections.push({...d.sections[0]})},/Повторяется/);
invalid(d=>{d.sections=d.sections.filter(s=>s.id!=='home')},/обязательный/);
invalid(d=>{d.expenseCats=d.expenseCats.filter(x=>x.id!=='housing')},/категория|Категория/i);
invalid(d=>{d.subscriptions[0].day=32},/платёж/);
invalid(d=>{d.transactions[0].amount=Infinity},/сумма/);
invalid(d=>{d.tasks=[{id:'bad',title:'Недопустимо',date:'2026-02-30',section:'planner',time:'',done:false}]},/дата/);
invalid(d=>{d.tasks=[{id:'bad',title:'Недопустимо',date:'2026-10-22',section:'absent',time:'',done:false}]},/задач/);
invalid(d=>{d.transactions[2].subscriptionId='missing'},/Связанный/);
invalid(d=>{d.done['__proto__@once']=true},/отметка|отметк/i);
// Older backups made before subscriptions were introduced should still load.
const older=JSON.parse(JSON.stringify(valid));
delete older.subscriptions;
older.transactions=older.transactions.filter(t=>!t.subscriptionId);
assert.equal(M.validate(older).subscriptions.length,0);
console.log('PASS: general local organizer model — amounts, dates, monthly bills, categories, import validation, CSV safety and backwards compatibility');
