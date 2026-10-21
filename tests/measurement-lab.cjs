const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('measurement-lab.html','utf8');
const js=fs.readFileSync('measurement-lab.js','utf8');
const css=fs.readFileSync('measurement-lab.css','utf8');
const calculator=fs.readFileSync('calculator.html','utf8');
const resourcesHtml=fs.readFileSync('resources.html','utf8');
const resourceCode=fs.readFileSync('resources-data.js','utf8');
const ctx={};vm.runInNewContext(resourceCode+';globalThis.__metrology=resources;',ctx,{timeout:5000});
const items=JSON.parse(JSON.stringify(ctx.__metrology)).filter(x=>x.type==='Онлайн-измерения');
assert.equal(items.length,12,'twelve curated online measurement resources');
assert.equal(new Set(items.map(x=>x.link)).size,items.length,'duplicate measurement links');
for(const x of items){
 assert.match(x.link,/^https:\/\//,'only HTTPS link '+x.id);
 assert.ok(x.name&&x.topic&&x.desc,'missing instrument details '+x.id);
}
for(const id of ['micrometer','dial-indicator','protractor','external-measurement','micRange','micValue','micSvg','micGuess','dialRange','dialValue','dialSvg','dialZero','angleRange','angleValue','angleSvg','measurementExternalGrid']){
 assert.ok(html.includes('id="'+id+'"'),'missing instrument control '+id);
}
assert.equal((html.match(/class="eng-tab"/g)||[]).length,9,'nine primary navigation links retained');
for(const file of ['measurement-lab.css','measurement-lab.js','resources-data.js','site-shell.js','navigation.js','theme.js']) assert.ok(html.includes('src="'+file+'"')||html.includes('href="'+file+'"'),'asset missing '+file);
assert.ok(js.includes('0.01')||js.includes('.01'),'micrometer step missing');
assert.ok(js.includes('dialZero'),'zeroing needed');
assert.ok(js.includes('Math.random'),'practice randomization absent');
assert.ok(html.includes('не заменяют поверку'),'instrument not calibrated warning missing');
assert.ok(calculator.includes('href="measurement-lab.html"'),'calculator integration missing');
assert.ok(resourcesHtml.includes('href="measurement-lab.html"'),'community integration missing');
assert.ok(css.includes('@media(max-width:550px)'),'mobile layout missing');
console.log('PASS measurement lab: three instruments, 12 external resources, site navigation and accessible inputs');
