const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('measurement-lab.html','utf8');
const js=fs.readFileSync('measurement-lab.js','utf8');
const css=fs.readFileSync('measurement-lab.css','utf8');
const built=fs.readFileSync('measurement-builtins.js','utf8');
const electronics=fs.readFileSync('measurement-electronics.js','utf8');
const calculator=fs.readFileSync('calculator.html','utf8');
const resourcesHtml=fs.readFileSync('resources.html','utf8');
const ids=['vernier','dialcal','digital','depth','ruler','micrometer','dial-indicator','protractor','multimeter','oscilloscope'];
for(const id of ids){
 assert.ok(html.includes('id="'+id+'"')||built.includes("id:'"+id+"'")||electronics.includes('id="'+id+'"'),id+' simulator missing');
 assert.ok(html.includes('href="#'+id+'"'),id+' nav link missing');
}
assert.ok(!html.includes('measurementExternalGrid'),'third-party link grid must not replace instruments');
assert.ok(!html.includes('src="resources-data.js"'),'embedded instruments must run without catalog download');
assert.ok(!html.includes('<iframe'),'do not embed uncontrolled third-party frames');
assert.equal((html.match(/class="eng-tab"/g)||[]).length,9,'nine primary nav links preserved');
for(const file of ['measurement-lab.css','measurement-lab.js','measurement-builtins.js','measurement-electronics.js','site-shell.js','navigation.js','theme.js']){
 assert.ok(html.includes('src="'+file+'"')||html.includes('href="'+file+'"'),'missing dependency '+file);
}
for(const id of ['micRange','micValue','dialZero','angleRange','micGuess','dialGuess','angleGuess'])assert.ok(html.includes('id="'+id+'"'),'existing controls lost: '+id);
for(const id of ['digitalZero','digitalUnit','digitalReset','vernierStep','vernierRange','depthRange','rulerRange','meterVoltage','meterResistance','meterMode','oscFrequency','oscAmplitude','oscShape','oscTimebase'])assert.ok(built.includes(id)||electronics.includes(id),'new controls lost: '+id);
assert.ok(js.includes('dialZero')&&js.includes('Math.random'),'old training controls must remain');
assert.ok(built.includes('Math.random')&&built.includes('digitalZero'),'new interactive controls absent');
assert.ok(electronics.includes('Math.sin')&&electronics.includes('meterResistance'),'waveform or Ohm model missing');
assert.ok(html.includes('не средства измерений'),'physical-measurement disclaimer missing');
assert.ok(calculator.includes('href="measurement-lab.html"'),'calculator section missing workshop');
assert.ok(resourcesHtml.includes('href="measurement-lab.html"'),'resource section missing workshop');
assert.ok(css.includes('max-width:560px'),'narrow viewport layout missing');
console.log('PASS: ten locally embedded training instruments, zero external frames, original site and calculator routes preserved');
