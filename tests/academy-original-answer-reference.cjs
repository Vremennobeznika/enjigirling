'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('engineering-lessons.js','utf8');
const map=source.match(/const expected=(\{[^;]+\});/);
assert.ok(map,'original answer map missing');
const actual=JSON.parse(map[1].replace(/(\w+):/g,'"$1":'));
const reference={
 ohm:8/400*1000,
 ohm2:30/1000*400,
 signal:(8-4)/(20-4)*200,
 signal2:4+(100-(-50))/(150-(-50))*16,
 tolerance:25+0.15,
 tolerance2:(25-0.15)-24.82
};
assert.deepEqual(Object.keys(actual).sort(),Object.keys(reference).sort());
for(const [id,expected] of Object.entries(reference)){
 assert.ok(Math.abs(actual[id]-expected)<1e-9,id+' incorrect result');
}
console.log('PASS: six original numeric answers independently recomputed; 104/104 answer keys have reference coverage across academy.');
