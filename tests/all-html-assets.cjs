#!/usr/bin/env node
// Verify every static HTML entrypoint, including nested standalone applications.
// Ignore URLs generated at runtime and network-dependent external resources.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const omit=new Set(['.git','node_modules','_site','test-results','playwright-report','visual-review','audit']);
const pages=[];
function visit(dir){
 for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  if(item.isDirectory()){if(!omit.has(item.name))visit(path.join(dir,item.name));}
  else if(item.isFile()&&item.name.endsWith('.html'))pages.push(path.join(dir,item.name));
 }
}
visit(root);
assert.ok(pages.length>=22,'Expected every published HTML document, including standalone apps');
let references=0,invalid=[],badPage=[];
for(const filename of pages){
 const html=fs.readFileSync(filename,'utf8');
 if(!/<html\b/i.test(html)||!/<title\b[^>]*>[^<]+<\/title>/i.test(html))
  badPage.push(path.relative(root,filename)+' lacks HTML root or title');
 // Strip inline JavaScript templates but retain script src attributes.
 const markup=html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi,(_,attrs)=>'<script '+attrs+'></script>');
 for(const element of markup.matchAll(/<(?:a|link|script|img|source|iframe|audio|video|form)\b[^>]*>/gi)){
  for(const attr of element[0].matchAll(/\b(?:href|src|poster|action)\s*=\s*(["'])(.*?)\1/gi)){
   const original=attr[2].replace(/&amp;/g,'&');
   if(!original||/^(?:https?:|mailto:|tel:|data:|blob:|javascript:|\/\/|#|\?)/i.test(original))continue;
   const clean=original.split(/[?#]/,1)[0];
   if(!clean)continue;
   let dest;
   try{
    dest=clean.startsWith('/')
      ?path.resolve(root,'.'+decodeURIComponent(clean))
      :path.resolve(path.dirname(filename),decodeURIComponent(clean));
   }catch{invalid.push(path.relative(root,filename)+' invalid URL '+original);continue;}
   if(!dest.startsWith(root+path.sep)&&dest!==root)continue; // Absolute URLs beyond published tree.
   references++;
   if(!fs.existsSync(dest))invalid.push(path.relative(root,filename)+' -> '+original);
  }
 }
}
assert.deepEqual(badPage,[],'Broken HTML metadata');
assert.deepEqual(invalid,[],'Unresolved local references');
console.log('PASS '+pages.length+' HTML entrypoints, '+references+' local attributes, including nested paths');
