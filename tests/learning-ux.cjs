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
assert.equal(entries.filter(x=>x.item.sourceStatus==='official_source_located').length,2);
assert.ok(html.includes('Схема условная'),'schematic map not labelled');
assert.ok(html.includes('aria-current="page"'),'current learning tab must be announced');
const aiBuilder=fs.readFileSync('scripts/build-ai-packs.cjs','utf8');
assert.ok(aiBuilder.includes("if(slug==='learning')"),'AI export must include school records');
