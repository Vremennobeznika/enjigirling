#!/usr/bin/env node
'use strict';
// Real Chromium screenshots, not mockups. Run: node scripts/capture-screenshots.cjs
const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const pages=['index','compare','map','processes','materials','calculator','dictionary','calendar','resources'];
const sizes=[{label:'tiny-320',width:320,height:740,mobile:true},{label:'mobile-375',width:375,height:812,mobile:true},{label:'desktop-1440',width:1440,height:900,mobile:false}];
const output=path.resolve('screenshots');
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const matrix=[];
 try{
  for(const size of sizes){
   const context=await browser.newContext({viewport:{width:size.width,height:size.height},deviceScaleFactor:1,isMobile:size.mobile,hasTouch:size.mobile,reducedMotion:'reduce'});
   for(const name of pages){
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.setDefaultTimeout(12000);
    const url='http://127.0.0.1:8765/'+name+'.html';
    try{
     const response=await page.goto(url,{waitUntil:'load',timeout:45000});
     await page.evaluate(async()=>{if(document.fonts?.ready)await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]);});
     await page.waitForTimeout(350);
     const metrics=await page.evaluate(()=>({
       documentWidth:document.documentElement.scrollWidth,
       viewportWidth:document.documentElement.clientWidth,
       documentHeight:document.documentElement.scrollHeight,
       title:document.title
     }));
     const prefix=size.label+'-'+name;
     await page.screenshot({path:path.join(output,prefix+'.png'),fullPage:true,animations:'disabled',timeout:45000});
     matrix.push({page:name,viewport:size.label,status:response?.status(),...metrics,horizontalOverflow:metrics.documentWidth>metrics.viewportWidth+2,errors});
     console.log('CAPTURE '+prefix+' '+response?.status()+' overflow='+matrix.at(-1).horizontalOverflow+' errors='+errors.length);
    }catch(err){
     matrix.push({page:name,viewport:size.label,error:String(err),errors});
     console.error('FAILED '+name+' '+size.label+': '+err.message);
    }finally{await page.close();}
   }
   await context.close();
  }
 }finally{
   fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(matrix,null,2));
   await browser.close();
 }
 const failed=matrix.filter(x=>x.error||x.status!==200||x.horizontalOverflow||x.errors?.length);
 console.log('Captured '+matrix.filter(x=>!x.error).length+' / '+matrix.length+' screenshots; '+failed.length+' audit warnings');
 if(failed.length) console.log(JSON.stringify(failed,null,2));
 if(matrix.some(x=>x.error))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
