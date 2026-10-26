#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const paths=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html','ai.html','ai-training.html','calculator-atlas.html','measurement-lab.html','coding.html','robotics.html'];
for(const path of paths){
 const s=fs.readFileSync(path,'utf8');
 const pre=s.indexOf('data-theme-bootstrap');
 const externalStyles=s.search(/<link[^>]+rel=["']stylesheet["']/i);
 const body=s.search(/<body(?:\s|>)/i);
 assert.ok(pre>0&&pre<body,path+': early theme bootstrap missing');
 assert.ok(externalStyles>pre,path+': styles may paint before theme initializes');
 assert.equal((s.match(/<style data-theme-bootstrap>/g)||[]).length,1,path+': duplicate theme style');
 assert.equal((s.match(/<script data-theme-bootstrap>/g)||[]).length,1,path+': duplicate theme logic');
 assert.match(s,/localStorage\.getItem\('theme'\)/,path+': saved theme preference unavailable');
 assert.match(s,/html\.theme-light\{background:#fff/,path+': light background not initialized');
 assert.match(s,/html\.theme-dark\{background:#101010/,path+': dark background not initialized');
 assert.ok(s.includes('src="theme.js"'),path+': theme controls missing');
}
const script=fs.readFileSync('theme.js','utf8');
assert.ok(script.includes("classList.toggle('theme-light', !dark)"),'theme toggle must clear early opposite-class');
assert.ok(script.includes("classList.toggle('theme-dark', dark)"),'dark mode toggle missing');
console.log('PASS: '+paths.length+' engineering pages initialize saved dark/light theme before CSS and body');
