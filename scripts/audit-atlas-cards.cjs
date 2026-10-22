#!/usr/bin/env node
'use strict';
// Automated per-record editorial audit. Does not certify individual technical claims.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const getJSON=p=>JSON.parse(read(p));
const sandbox={window:{}};
for(const p of ['materials-data.js','processes-data.js','data.js'])vm.runInNewContext(read(p),sandbox,{timeout:10000});
const materials=JSON.parse(JSON.stringify(sandbox.window.engineeringMaterials));
const processes=JSON.parse(JSON.stringify(sandbox.window.engineeringProcesses));
const reg=getJSON('knowledge/source-registry.json'),src=new Map(reg.sources.map(s=>[s.sourceId,s]));
const entries=new Map(),matIds=new Set(materials.map(x=>x.id)),procIds=new Set(processes.map(x=>x.id));
for(const link of reg.recordEvidence){const k=link.recordType+':'+link.recordId;if(!entries.has(k))entries.set(k,[]);entries.get(k).push(link);}
const primaryRe=/usgs\.gov|iso\.org|epa\.gov|nist\.gov|fda\.gov|osha\.gov|fao\.org|ipc\.org|asnt\.org|fs\.usda\.gov|ams\.usda\.gov/;
const broadRules=[
 ['R01',/usgs\.gov\/centers\/national-minerals-information-center\/commodity-statistics-and-information/],
 ['R02',/iso\.org\/(?:ru\/)?standard\/50590\.html/],
 ['R03',/nist\.gov\/publications\/current-state-and-emerging-trends-advanced-manufacturing-process-technologies/],
 ['R04',/osha\.gov\/data\/sic-manual\/major-group-(22|23)/],
 ['R05',/asnt\.org\/what-is-nondestructive-testing\/methods/],
 ['R06',/ipc\.org\/news-release\/ipc-releases-j-revisions-two-leading-standards-electronics-assembly/],
 ['R07',/fao\.org\/4\/x0209e\/x0209e06\.htm/],
 ['R08',/epa\.gov\/sdwa\/overview-drinking-water-treatment-technologies/]
];
const details={
 metal:'проверить марку, состав, состояние, стандарт полуфабриката и паспорт партии',
 organic:'проверить полимер/волокно, рецептуру, физические свойства и ограничения марки',
 inorganic:'проверить минералогию, примеси, фракционный состав и стандарт сырья',
 composite:'проверить состав матрицы, армирование, технологию отверждения и свойства готового изделия',
 functional:'проверить рецептуру, совместимость, паспорт безопасности и рабочую среду'
};
function audit(x,kind){
 const process=kind==='processes',urlBase=process?'processes':'materials';
 const linked=entries.get(kind+':'+x.id)||[];
 const missing=(process?['id','name','industry','description','steps','checks','category','profession']:['id','name','group','family','detail','uses','note']).filter(k=>typeof x[k]!=='string'||!x[k].trim());
 const problems=[],add=(code,level,details)=>problems.push({code,level,details});
 if(missing.length)add('F01','P0','Отсутствуют поля: '+missing.join(', '));
 const broken=(process?(x.materials||[]).filter(id=>!matIds.has(id)):(x.process||[]).filter(id=>!procIds.has(id)));
 if(broken.length)add('L01','P0','Битые связи: '+broken.join(', '));
 const sourceList=x.sources||[],displayURLs=new Set(sourceList.map(s=>s.url));
 if(!sourceList.length)add('S01','P0','Не указан источник');
 if(!linked.length)add('S02','P0','Нет реестровой записи доказательств');
 if(!x.evidence?.reviewScope)add('S03','P0','Нет границ проверки');
 const offCard=[...new Set(linked.map(e=>src.get(e.sourceId)?.url).filter(url=>url&&!displayURLs.has(url)))];
 if(offCard.length)add('S04','P1','Зарегистрировано дополнительных ссылок, не показанных в карточке: '+offCard.length);
 const missingSourceIds=linked.map(e=>e.sourceId).filter(id=>!src.has(id));
 if(missingSourceIds.length)add('S05','P0','Битые sourceId: '+missingSourceIds.join(', '));
 const unregistered=sourceList.filter(s=>!reg.sources.some(z=>z.url===s.url));
 if(unregistered.length)add('S06','P1','Нет реестровой записи для '+unregistered.length+' URL карточки');
 const broad=[...new Set(sourceList.flatMap(s=>broadRules.filter(v=>v[1].test(s.url||'')).map(v=>v[0])))];
 if(broad.length)add('S07','P1','Общие источники ('+broad.join(', ')+'); они не подтверждают параметры конкретного процесса/марки');
 const claims=linked.filter(x=>x.verificationStatus==='claim_checked');
 if(!claims.length)add('E01','P1','Частный проверенный тезис в реестре отсутствует; нужна предметная проверка первоисточника');
 else add('E02','P2','Проверка отдельных тезисов не подтверждает всю карточку');
 if(process){
  if(!(x.materials||[]).length)add('L02','P2','Нет конкретных материалов: не добавлять неподтверждённых связей');
  if(x.steps.split(/\s*→\s*/).length<3)add('T01','P1','Недостаточно этапов технологического маршрута');
  if(x.checks.length<80)add('T02','P2','Уточнить методы контроля и критерии дефектов');
 }else{
  if(!(x.process||[]).length)add('L03','P2','Нет достоверно связанного процесса; не подставлять неподходящий');
  if(x.detail.length<100)add('T03','P2','Описание поверхностное; нужны инженерные различия и ограничения');
 }
 const priority=problems.find(z=>z.level==='P0')?'P0':problems.find(z=>z.level==='P1')?'P1':'P2';
 return {id:x.id,name:x.name,type:kind,industry:process?x.industry:x.industries,page:'https://vremennobeznika.github.io/enjigirling/'+urlBase+'.html#'+encodeURIComponent(x.id),priority,technicalVerification:'не завершена',
  sourceCount:sourceList.length,primaryAuthorityLinks:sourceList.filter(s=>primaryRe.test(s.url)).length,
  sourceUrls:sourceList.map(s=>s.url),additionalRegistryUrls:offCard,
  claimCheckedInRegistry:claims.length,issues:problems,
  nextAction:process?'Сверить «'+x.name+'»: входы/выходы, оборудование, порядок операций, возможные дефекты, контроль и применимые нормативные документы.':'Сверить «'+x.name+'»: '+(details[x.group]||'точную спецификацию и свойства материала')+'; найти точный первоисточник вместо одного общего каталога.'};
}
const records=[...processes.map(x=>audit(x,'processes')),...materials.map(x=>audit(x,'materials'))];
assert.equal(new Set(records.map(x=>x.type+':'+x.id)).size,records.length);
const levels=Object.fromEntries(['P0','P1','P2'].map(k=>[k,records.filter(x=>x.priority===k).length]));
const codes={};for(const x of records)for(const p of x.issues)codes[p.code]=(codes[p.code]||0)+1;
const report={schemaVersion:'1.0',date:'2026-10-22',purpose:'per-card editorial triage; NOT a scientific verification of all claims',
 scope:{processes:processes.length,materials:materials.length,total:records.length,...levels,claimCheckedEntries:records.filter(x=>x.claimCheckedInRegistry).length},
 methodology:['обязательные поля и терминология','взаимные ссылки и ID','содержание этапов/описаний','источники карточки и реестра','границы доказательств','отрасль и класс','достоверность отраслевой ссылки','пригодность для отраслевой выгрузки в ИИ'],
 disclaimers:['URL может вести на общий индекс, а не на подтверждение отдельной технической характеристики','Статус claim_checked относится к узкому тезису','Все карточки требуют индивидуальной предметной проверки содержимого документов'],
 issueCounts:codes,records};
const escape=s=>String(s||'').replace(/\|/g,'/').replace(/\n/g,' ');
const md=['# Поимённый аудит процессов и материалов — 22.10.2026','',
'> Это автоматизированная индивидуальная проверка каждой карточки по базовой матрице. Научная экспертиза полной карточки НЕ подтверждена. Наличие источника и статус частного тезиса не означают проверки её технических свойств.','',
'## Сводка','','Всего: '+records.length+'; процессы: '+processes.length+'; материалы: '+materials.length+'. Приоритеты P0: '+levels.P0+', P1: '+levels.P1+', P2: '+levels.P2+'.','',
'P0 — битый ID или обязательные поля; P1 — недостаточная доказательная база/спорная полнота; P2 — уточнения. P1 НЕ значит, что запись обязательно неверна.','',
'## Замечания по типам','','| Код | Количество | Описание |','|---|---:|---|',
...Object.entries(codes).sort((a,b)=>b[1]-a[1]).map(([k,n])=>'| '+k+' | '+n+' | '+escape(records.flatMap(x=>x.issues).find(q=>q.code===k)?.details)+' |'),
'','## Процессы — каждая карточка','','| Карточка | Отрасль | Статус доказательств | Очередь | Проблемы |','|---|---|---|---|---|'];
for(const x of records.filter(r=>r.type==='processes'))md.push('| ['+escape(x.name)+' ('+x.id+')](../processes.html#'+x.id+') | '+escape(x.industry)+' | '+(x.claimCheckedInRegistry?'частный тезис':'только источник')+' | '+x.priority+' | '+x.issues.map(v=>v.code).join(', ')+' |');
md.push('','## Материалы — каждая карточка','','| Карточка | Отрасли | Статус доказательств | Очередь | Проблемы |','|---|---|---|---|---|');
for(const x of records.filter(r=>r.type==='materials'))md.push('| ['+escape(x.name)+' ('+x.id+')](../materials.html#'+x.id+') | '+escape(x.industry.join(', '))+' | '+(x.claimCheckedInRegistry?'частный тезис':'только источник')+' | '+x.priority+' | '+x.issues.map(v=>v.code).join(', ')+' |');
md.push('','## Индивидуальные рекомендации и источники','','Подробные замечания, URL источников из карточки и дополнительные ссылки реестра, следующий индивидуальный шаг для каждого ID: knowledge/atlas-card-audit.json. После исправления регенерировать командой node scripts/audit-atlas-cards.cjs --write и выполнить --check.','','### Что остаётся неисполненным','','Проверка каждого инженерного тезиса по методологии первичного документа, действующим нормативам, сорту, марке, применимым условиям, протоколам и ограничениям — ручная содержательная работа. Её нельзя выдавать за выполненную потому, что прошли 380 программных проверок.');
const output={'knowledge/atlas-card-audit.json':JSON.stringify(report,null,2)+'\n','docs/atlas-card-audit.md':md.join('\n')+'\n'};
if(process.argv[2]==='--write'){for(const [p,v] of Object.entries(output)){fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v);}console.log('WROTE all '+records.length+' card audit results');}
else if(process.argv[2]==='--check'){for(const [p,v] of Object.entries(output))assert.equal(read(p),v,'Outdated '+p);console.log('PASS '+records.length+' per-card audit records');}
else throw Error('Use --write or --check');
