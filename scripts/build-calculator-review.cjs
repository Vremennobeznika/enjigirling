#!/usr/bin/env node
/* Audit artifact only; never loaded by the website. Inspection is not certification. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const {definitions,calculate}=require('../atlas-tools.js');
const fixture=require('../tests/fixtures/calculator-domain-reference.json');
const defaults=JSON.parse(fs.readFileSync(path.join(root,'knowledge/atlas-implementation-matrix.json')));
const renamed=require('../docs/calculators/domain-scope-corrections.json');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
function checked(command,args){const r=spawnSync(command,args,{cwd:root,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||r.stdout||'Failed '+command);return r.stdout;}
checked('node',['tests/calculator-domain-reference.cjs']);
checked('node',['tests/calculator-domain-boundaries.cjs']);
const si=JSON.parse(checked('python3',['tests/atlas-independent-si.py','--json']));
const inspection=require('../docs/calculators/domain-inspection-record.json');
for(const [file,digest] of Object.entries(inspection.sourceHashes))if(hash(fs.readFileSync(path.join(root,file)))!==digest)throw Error('Source changed since formula inspection: '+file);
if(inspection.reviewedIds.length!==definitions.length||definitions.some(d=>!inspection.reviewedIds.includes(d.id)))throw Error('Model missing from manual inspection record');
const casesByModel=new Map();for(const c of fixture.cases)casesByModel.set(c.model,(casesByModel.get(c.model)||0)+1);
const changes=new Map(renamed.map(c=>[c.id,c]));
const safetyGroups=new Set(['g7','g9','g13','g14','g18','g19','g20','g21','g25','g30','g31']);
const items=definitions.map(d=>{
 const row=defaults.items.find(r=>r.calculatorId===d.id);if(!row)throw Error('Missing '+d.id);
 const result=calculate(d.id,Object.fromEntries(d.fields.map(f=>[f.key,f.value])));
 if(Math.abs(result.value-row.reference.expected)>row.reference.tolerance)throw Error('Default reference changed '+d.id);
 const independent=(casesByModel.get(d.id)||0)+(si.byModel[d.id]||0);
 return {id:d.id,topic:d.topic,group:d.group,formula:d.formula,outputUnit:result.unit,applicability:d.note,
  inspection:{formulaVsCode:'inspected',unitsAndConventions:'inspected',scope:'limited_to_stated_model'},
  numericalEvidence:{savedExample:'passed',independentCases:independent,independentStatus:independent?'passed':'not_crosschecked'},
  use:safetyGroups.has(d.group)?'requires_task_specific_engineering_validation':'requires_stated_assumptions',
  certification:'not_performed',scopeCorrection:changes.get(d.id)?.before??null,
  definitionHash:hash(JSON.stringify({topic:d.topic,formula:d.formula,fields:d.fields,note:d.note}))};
});
if(items.length!==734||new Set(items.map(d=>d.id)).size!==734||items.some(d=>!d.applicability))throw Error('Incomplete review');
const independent=items.filter(d=>d.numericalEvidence.independentCases>0);
const data={schemaVersion:1,reviewDate:'2026-10-26',method:'Code/formula/unit/scope inspection of all entries; independent numerical crosschecks only where explicitly counted. No normative certification.',
 sourceHashes:Object.fromEntries(['atlas-extended.js','atlas-tools.js','calculator-atlas-data.js','tests/fixtures/calculator-domain-reference.json','tests/atlas-independent-si.py'].map(p=>[p,hash(fs.readFileSync(path.join(root,p)))])),
 summary:{inspected:items.length,groups:new Set(items.map(d=>d.group)).size,independentlyCrosscheckedModels:independent.length,independentCases:fixture.cases.length+si.cases,formulaInspectionOnly:items.length-independent.length,scopeTitlesCorrected:renamed.length},items};
const file=path.join(root,'docs/calculators/domain-review-matrix.json'),text=JSON.stringify(data)+'\n';
if(process.argv.includes('--check')){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==text)throw Error('STALE docs/calculators/domain-review-matrix.json');}
else fs.writeFileSync(file,text);
console.log('DOMAIN REVIEW: '+JSON.stringify(data.summary));
