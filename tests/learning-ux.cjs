const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('map.html','utf8');
const js=fs.readFileSync('map.js','utf8');
const css=fs.readFileSync('learning-experience.css','utf8');
const raw=fs.readFileSync('map-data.js','utf8');
const data=vm.runInNewContext(raw+';federalDistricts;',{}, {timeout:5000});
assert.equal(data.length,8,'all eight districts retained');
const entries=data.flatMap(d=>[...(d.universities||[]).map(item=>({item,type:'uni',district:d})),...(d.colleges||[]).map(item=>({item,type:'college',district:d}))]);
assert.equal(entries.length,80,'institution catalog changed unexpectedly');
assert.ok(entries.filter(x=>x.type==='uni').length===51,'universities missing');
assert.ok(entries.filter(x=>x.type==='college').length>=24,'colleges missing');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'exactly one visible h1');
assert.equal((html.match(/class="eng-tab(?: active)?"/g)||[]).length,9,'nine navigation entries retained');
assert.equal((html.match(/class="learning-accordion"/g)||[]).length,4,'all optional sections kept');
const nodes=['education-directory','educationSearch','educationDistrict','educationType','educationSort','educationStatus','educationResults','educationMore','educationClear','education-map','education-calculators','education-benefits','education-courses','russiaMap','districtInfo','mapReset'];
for(const id of nodes)assert.ok(html.includes('id="'+id+'"'),'missing '+id);
for(const calculator of ['calcPath','calcAge','calcWork','salaryProfession','netGross','roiCost'])assert.ok(html.includes('id="'+calculator+'"'),'missing calculator '+calculator);
assert.ok(html.includes('src="salary-sources.js"'),'salary evidence script missing');
assert.ok(html.includes('src="engineer-calculators.js"'),'salary and tax formulas missing');
assert.ok((html.match(/class="benefit-card"/g)||[]).length>=26,'educational guidance or courses lost');
assert.ok(js.includes('scrollIntoView'),'map-directory navigation missing');
assert.ok(js.includes("e.key==='Enter'||e.key===' '"),'SVG keyboard activation missing');
assert.ok(js.includes('aria-pressed'),'district selection state missing');
assert.ok(js.includes('escapeHtml'),'dynamic content must be escaped');
assert.ok(js.includes('site')&&js.includes('noopener noreferrer'),'school external links must be isolated');
assert.ok(js.includes('pageSize=12'),'progressive listing missing');
assert.ok(css.includes('@media(max-width:430px)'),'small-screen layout missing');
console.log('PASS: '+entries.length+' education records across eight districts, search and accessibility controls, four accordions and existing calculators');

for(const {item} of entries){
 assert.ok(['official_source_located','editorial_not_verified'].includes(item.sourceStatus),item.name+': missing source status');
 for(const key of ['duration','cost','budget','admission','afterCollege'])
   assert.ok(!Object.hasOwn(item,key),item.name+': unsupported claim '+key);
}
assert.equal(entries.filter(x=>x.item.sourceStatus==='official_source_located').length,80);
assert.ok(html.includes('Схема условная'),'schematic map not labelled');
assert.ok(html.includes('aria-current="page"'),'current learning tab must be announced');
const aiBuilder=fs.readFileSync('scripts/build-ai-packs.cjs','utf8');
assert.ok(aiBuilder.includes("if(slug==='learning')"),'AI export must include school records');

const names=new Set(entries.map(x=>x.item.name));
for(const deprecated of ['Мурманский ГТУ','УГАТУ','Красноярский ГТУ (СФУ)']){
 assert.ok(!names.has(deprecated),'outdated institution label: '+deprecated);
}
for(const renamed of ['Мурманский арктический университет (МАУ)','Уфимский университет науки и технологий (УУНиТ)','Сибирский федеральный университет (СФУ)']){
 assert.ok(names.has(renamed),'missing successor institution '+renamed);
}
const bauman=entries.find(x=>x.item.name==='МГТУ им. Баумана').item;
assert.ok(bauman.verifiedPrograms.some(p=>p.code==='15.03.01'&&p.tuitionAnnualRub===529000&&p.year==='2026/27 учебный год'),'verified program-scoped fee was lost');
assert.ok(js.includes('item.verifiedPrograms'),'verified program should appear in card details');

assert.ok(entries.some(x=>x.item.name.includes('Международный центр компетенций')&&x.item.city==='Казань'),'2026 Kazan college name missing');
for(const value of ['Красноярский техникум промышленного сервиса','Волгоградский технический колледж']){
 const item=entries.find(x=>x.item.name===value)?.item;
 assert.ok(item&&item.site&&item.sourceUrl,value+': verified site missing');
}

const universityRows=entries.filter(x=>x.type==='uni');
assert.equal(universityRows.filter(x=>x.item.siteFetchStatus==='fetched').length,29,'URL retrieval evidence changed');
assert.equal(universityRows.filter(x=>x.item.siteFetchStatus==='not_retrieved').length,22,'uncertain URL failures changed');
assert.ok(js.includes('item.siteFetchStatus'),'network check evidence should be displayed without implying confirmation');

assert.ok(!entries.some(x=>x.item.name==='Калининградский технический колледж'),'closed Kaliningrad school must not be advertised');
assert.ok(entries.some(x=>x.item.name==='Прибалтийский судостроительный техникум'&&x.item.sourceUrl),'verified replacement school missing');

for(const resource of ['https://edu.itmo.ru/ru/edu_online/','https://education.yandex.ru/','https://www.autodesk.com/certification/overview'])
 assert.ok(html.includes(resource),'course provider source link missing '+resource);
for(const oldLink of ['https://openedu.ifmo.ru/','https://academy.autodesk.com/','https://academy.yandex.ru/'])
 assert.ok(!html.includes(oldLink),'stale course provider link '+oldLink);
assert.ok(!html.includes('Бесплатные обучающие материалы Autodesk'),'unverified Autodesk free access claim must not return');

for(const wrong of ['Политехнический колледж №8','Колледж СПбГУПТД','Политехнический колледж им. Годовикова']){
 assert.ok(!entries.some(x=>x.item.name===wrong),'ambiguous outdated college card '+wrong);
}
assert.ok(entries.some(x=>x.item.name==='Политехнический колледж городского хозяйства'&&x.item.city==='Санкт-Петербург'));
assert.ok(entries.some(x=>x.item.name.includes('Колледж технологии, моделирования и управления СПбГУПТД')));

assert.ok(entries.some(x=>x.item.name==='Ростовский-на-Дону колледж связи и информатики'&&x.item.sourceUrl),'Rostov successor name missing');
assert.ok(entries.some(x=>x.item.name==='Тюменский техникум строительной индустрии и городского хозяйства'&&x.item.sourceUrl),'Tyumen college official name missing');

assert.ok(entries.some(x=>x.item.name.includes('Новосибирский техникум железнодорожного транспорта СГУПС')&&x.item.sourceUrl),'Novosibirsk railway 2026 source missing');
assert.ok(entries.some(x=>x.item.name.includes('Хабаровский техникум транспортных технологий имени')&&x.item.sourceUrl),'Khabarovsk full school name missing');

const canonicalNames=entries.map(x=>x.item.name.trim().toLowerCase());
assert.equal(new Set(canonicalNames).size,80,'all institutions must have distinct names');
for(const row of entries){
 const item=row.item;
 assert.equal(item.sourceStatus,'official_source_located',item.name+': primary institution evidence missing');
 assert.match(item.sourceUrl,/^https:\/\/[^\s]+$/,item.name+': invalid source URL');
 assert.ok(item.verifiedScope&&item.verifiedScope.length>=40,item.name+': source scope and limitations missing');
 assert.ok(!/сокращ[её]нн(ая|ой) программа гарантирован|без ЕГЭ всем/i.test(JSON.stringify(item)),item.name+': universal guarantee');
}
for(const checkedName of ['Колледж «Коломна»','Челябинский механико-технологический техникум','Кемеровский горнотехнический техникум им. В. Г. Кожевина','Владивостокский судостроительный колледж','Губернаторский авиастроительный колледж г. Комсомольска-на-Амуре (МЦК)']){
 assert.ok(entries.some(x=>x.item.name===checkedName&&x.item.sourceUrl),checkedName+': verified college omitted');
}
for(const suspectName of ['Грозненский техникум','Уральский техникум металлообработки','Коломенский техникум','Комсомольский-на-Амуре авиастроительный техникум']){
 assert.ok(!entries.some(x=>x.item.name===suspectName),suspectName+': ambiguous original entry returned');
}

const verified=entries.filter(({item})=>Array.isArray(item.verifiedPrograms)&&item.verifiedPrograms.length);
assert.ok(verified.length>=75&&verified.length<=80,'programme evidence coverage outside expected bounds');
for(const {item} of verified){
 for(const p of item.verifiedPrograms){
  assert.match(p.code,/^\d{2}\.\d{2}\.\d{2}$/,'program code required');
  assert.ok(p.name&&p.year&&p.sourceUrl,'program data must include title, period and source');
  assert.match(p.sourceUrl,/^(https:\/\/|http:\/\/gaskk-mck\.ru\/)/,'program evidence must be HTTPS or labelled HTTP-only official GASKK source');
  for(const key of ['budgetPlaces','paidPlaces','tuitionAnnualRub'])if(p[key]!==undefined){
    assert.ok(Number.isSafeInteger(p[key])&&p[key]>=0,'places should be finite nonnegative integers');
  }
 }
}
assert.ok(js.includes('item.verifiedPrograms')&&js.includes('programDetails'),'program evidence is rendered');
assert.ok(js.includes('program_verified_with_access_limit'),'UI must disclose programme document fetch limitations');
assert.ok(js.includes('item.verifiedPrograms||[]'),'program codes included in search');
console.log('PASS: 80 programme leads structurally valid (not all independently verified)');

assert.equal(entries.filter(x=>x.item.sourceFetchStatus==='fetched').length,77,'77 evidence pages fetched after source URL repair');
assert.equal(entries.filter(x=>x.item.sourceFetchStatus==='fetch_failed').length,3,'3 links require retry, not deletion');
for(const row of entries)assert.equal(row.item.sourceFetchCheckedAt,'2026-10-22',row.item.name+': absent network audit date');
assert.ok(js.includes('item.sourceFetchStatus'),'UI must expose URL fetch result to readers');
