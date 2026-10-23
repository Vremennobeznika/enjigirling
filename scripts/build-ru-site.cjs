#!/usr/bin/env node
'use strict';
// Build a PUBLIC, standalone static website for a Russian host.
// This does not change the original GitHub Pages site or any source files.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '_site-ru');
const OLD = 'https://vremennobeznika.github.io/enjigirling/';
const BASE = process.env.SITE_BASE_URL || 'https://enjigirling.ru/';
const STAGING = process.env.STAGING === '1';
const REQUIRED_PAGES = [
  'index.html','compare.html','map.html','processes.html','materials.html',
  'calculator.html','dictionary.html','calendar.html','resources.html'
];
const EXTRA_FILES = new Set([
  'ai.html','ai-training.html','calculator-atlas.html','measurement-lab.html',
  'favicon.svg','knowledge-base.md','knowledge-manifest.json','llms.txt',
  'sitemap.xml','robots.txt'
]);
const EXTRA_DIRECTORIES = {
  knowledge: new Set(['.json','.md']),
  articles: new Set(['.html','.md'])
};

assert.match(BASE, /^https:\/\/[a-z0-9.-]+\/$/i, 'SITE_BASE_URL must be HTTPS origin ending in / (no path)');
assert.equal(path.basename(output), '_site-ru', 'unsafe output path');
assert.notEqual(output, root, 'unsafe output root');

function mustBeRegular(file) {
  const st = fs.lstatSync(file);
  if (st.isSymbolicLink()) throw new Error('Symlinks are forbidden in public build: '+file);
  if (!st.isFile()) throw new Error('Non-regular file: '+file);
}
function walk(dir, extensions, acc=[]) {
  if (!fs.existsSync(dir)) throw new Error('Missing required directory: '+dir);
  for (const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
    const absolute = path.join(dir,item.name);
    if (item.isSymbolicLink()) throw new Error('Symlink in public directory: '+absolute);
    if (item.isDirectory()) walk(absolute,extensions,acc);
    else if (item.isFile() && extensions.has(path.extname(item.name).toLowerCase())) acc.push(path.relative(root,absolute));
  }
  return acc;
}
const files=[];
for (const name of fs.readdirSync(root)) {
  const abs=path.join(root,name);
  if(!fs.lstatSync(abs).isFile()) continue;
  // Root CSS and JS are the shared runtime, not build/test scripts.
  const ext=path.extname(name).toLowerCase();
  if(REQUIRED_PAGES.includes(name)||EXTRA_FILES.has(name)||
     ((ext==='.js'||ext==='.css'||ext==='.csv')&&name!=='life-pwa-sw.js')) files.push(name);
}
for (const [dir,extensions] of Object.entries(EXTRA_DIRECTORIES))
  files.push(...walk(path.join(root,dir),extensions));
for(const required of [...REQUIRED_PAGES,'knowledge-manifest.json','sitemap.xml','robots.txt',
   'knowledge/professions.json','knowledge/sections/index.json'])
  if(!files.includes(required)) throw new Error('Required generated asset missing: '+required);

if(fs.existsSync(output)) fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
const manifest=[];
function removeGoogleFontTags(html){
  return html
    .replace(/<link\b(?=[^>]*\bhref\s*=\s*["']https:\/\/fonts\.googleapis\.com(?:\/[^"']*)?["'])[^>]*>\s*/gi,'')
    .replace(/<link\b(?=[^>]*\bhref\s*=\s*["']https:\/\/fonts\.gstatic\.com\/?["'])[^>]*>\s*/gi,'');
}
try{
  for(const relative of files.sort()){
    const source=path.join(root,relative),dest=path.join(output,relative);
    mustBeRegular(source);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    let value=fs.readFileSync(source,'utf8');
    value=value.split(OLD).join(BASE);
    if(relative.endsWith('.html')){
      value=removeGoogleFontTags(value);
      if(STAGING) value=value.replace(/<head(\s[^>]*)?>/i,tag=>tag+'\n<meta name="robots" content="noindex,nofollow">');
    }
    if(STAGING&&relative==='robots.txt')value='User-agent: *\nDisallow: /\n';
    fs.writeFileSync(dest,value,'utf8');
    manifest.push({file:relative,sha256:crypto.createHash('sha256').update(value).digest('hex'),bytes:Buffer.byteLength(value)});
  }
  fs.writeFileSync(path.join(output,'.nojekyll'),'');
  fs.writeFileSync(path.join(output,'build-integrity.json'),JSON.stringify({baseUrl:BASE,staging:STAGING,files:manifest},null,2)+'\n');
  console.log('BUILT',files.length,'public files,',manifest.reduce((n,x)=>n+x.bytes,0),'bytes into _site-ru');
} catch(error){
  fs.rmSync(output,{recursive:true,force:true});
  throw error;
}
