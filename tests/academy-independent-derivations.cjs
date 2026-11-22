'use strict';
/**
 * Independent reconstructions from problem statements, 2026-11-22.
 * Checks NUMERICAL KEYS only — NOT engineering applicability, normative
 * validity, measurement uncertainty, safety, or training completeness.
 * This test does not use the hardcoded reference tables of previous tests.
 * Models: ideal ohmic circuits; linear 4–20mA; ideal timing/averages;
 * specified textbook ranges; independent standard uncertainties for Q03.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');

const calculated = {
  ohm:8/400*1000,
  ohm2:0.03*400,
  signal:(8-4)/(20-4)*200,
  signal2:4+(100-(-50))/(150-(-50))*(20-4),
  tolerance:25+0.15,
  tolerance2:(25-0.15)-24.82,
  'E01-1':2.5*1000,
  'E01-2':4700/1000,
  'E03-1':120+330,
  'E03-2':1/(1/200+1/200),
  'E04-1':Math.abs(50.2-50),
  'E04-2':Math.abs(99-100)/100*100,
  'E06-1':1000*0.001,
  'E06-2':2000*(500*1e-6),
  'E07-1':1/0.02,
  'E07-2':1/(4*5e-3),
  'A01-1':80-74,
  'A01-2':40-52,
  'A02-1':Number(Boolean(1)&&Boolean(0)),
  'A02-2':Number(Boolean(0)||Boolean(1)),
  'C01-1':30*2,
  'C01-2':20*2,
  'C05-1':100-35,
  'C05-2':(80+0.2)-(30-0.1),
  'M02-1':1000/100,
  'M02-2':(2*1000)/50,
  'M09-1':190/200*100,
  'M09-2':(80-6)/80*100,
  'Q01-1':Number(11>=10&&11<=12),
  'Q01-2':Number(12.1>=10&&12.1<=12),
  'Q04-1':7/100*100,
  'Q04-2':5/250*100,
  'E05-1':1.25*1000,
  'E05-2':750/1000,
  'E08-1':(10+12+14)/3,
  'E08-2':Math.max(10,12,14)-Math.min(10,12,14),
  'E09-1':20+(-0.1),
  'E09-2':20+0.2,
  'A04-1':(20-4)/(20-4)*100,
  'A04-2':(4-4)/(20-4)*100,
  'A05-1':1/(10e-3),
  'A05-2':2/(20e-3),
  'A06-1':Math.max(0,5-3),
  'A06-2':Math.max(0,2-4),
  'C02-1':3+2,
  'C02-2':12-3,
  'C06-1':Math.abs(10.3-10),
  'C06-2':Math.abs(14.8-15),
  'M01-1':2.7*10,
  'M01-2':7.8*5,
  'M03-1':15+30+45,
  'M03-2':3*40,
  'Q02-1':100-102,
  'Q02-2':50-49.5,
  'Q05-1':20-17,
  'Q05-2':30-2,
  'E10-1':24/120,
  'E10-2':24*0.2,
  'A07-1':1,
  'A07-2':2,
  'A08-1':5-2,
  'A08-2':8-3,
  'A09-1':16-1,
  'A09-2':5*2,
  'A10-1':17/20*100,
  'A10-2':12-3,
  'A11-1':7+3,
  'A11-2':15-4,
  'A12-1':(12-4)/(20-4)*100,
  'A12-2':60-50,
  'C04-1':20.1-20.0,
  'C04-2':19.9-20.0,
  'C07-1':(1+2+3+2)/4,
  'C07-2':(0.5+1.5)/2,
  'C08-1':12-9,
  'C08-2':2/20*100,
  'C09-1':8*2,
  'C09-2':6/24*100,
  'C10-1':40+0.3,
  'C10-2':40-0.3,
  'M04-1':80-(-20),
  'M04-2':80-60,
  'M05-1':0.4/2,
  'M05-2':0.1*3,
  'M06-1':65/100*100,
  'M06-2':80-60,
  'M07-1':120/60,
  'M07-2':150/50,
  'M08-1':20*100,
  'M08-2':(20*100)*5,
  'M10-1':8*15,
  'M10-2':3*40,
  'Q03-1':Math.hypot(3,4),
  'Q03-2':Math.hypot(6,8),
  'Q06-1':20-6,
  'Q06-2':5/50*100,
  'Q07-1':8-3,
  'Q07-2':9/12*100,
  'Q08-1':20-12,
  'Q08-2':(20-12)/20*100,
  'Q09-1':25/500*100,
  'Q09-2':10/200*100,
  'Q10-1':6/120*100,
  'Q10-2':120-6
};

function readAnswers(file, mapName) {
  const source = fs.readFileSync(file, 'utf8');
  const escaped = mapName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp('const '+escaped+'=(\\{[^;]+\\});'));
  assert.ok(match, 'answer map not found: '+file);
  if (file === 'engineering-lessons.js') {
    const entries = match[1].replace(/(\w+):/g, '"$1":');
    return JSON.parse(entries);
  }
  return JSON.parse(match[1]);
}

const actual = Object.assign(
  {},
  readAnswers('engineering-lessons.js', 'expected'),
  readAnswers('academy-draft.js', 'answers'),
  readAnswers('academy-draft-part2.js', 'answers'),
  readAnswers('academy-draft-part3.js', 'answers')
);
assert.deepEqual(Object.keys(actual).sort(), Object.keys(calculated).sort());
for (const [id, reference] of Object.entries(calculated)) {
  const tolerance = Math.max(1e-9, Math.abs(reference)*1e-10);
  assert.ok(Number.isFinite(reference), id+' nonfinite');
  assert.ok(Math.abs(actual[id]-reference) <= tolerance,
    id+': code '+actual[id]+' versus independent '+reference);
}
assert.equal(Object.keys(calculated).length, 104);
console.log('PASS: 104/104 academy keys independently recomputed from conditions');
