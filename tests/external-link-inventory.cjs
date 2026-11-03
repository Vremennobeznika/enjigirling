const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const inventory=JSON.parse(execFileSync(process.execPath,['tests/external-links.cjs','--inventory'],{encoding:'utf8',maxBuffer:8*1024*1024}));
const urls=new Map(inventory.map(row=>[row.url,row.sources]));
const districts=vm.runInNewContext(fs.readFileSync('map-data.js','utf8')+';federalDistricts',{}, {timeout:3000});
const schools=districts.flatMap(d=>[...(d.universities||[]),...(d.colleges||[])]);
assert.equal(schools.length,80);
let count=0;
function check(value){
 if(typeof value==='string'&&/^https?:\/\//.test(value)){
  assert.ok(urls.get(value)?.includes('map-data.js'),'education URL omitted from audit: '+value);count++;
 }else if(Array.isArray(value))value.forEach(check);
 else if(value&&typeof value==='object')Object.values(value).forEach(check);
}
schools.forEach(check);
console.log('PASS: all '+count+' education URL occurrences across 80 schools are included in the external-link inventory; no HTTP requests made.');
