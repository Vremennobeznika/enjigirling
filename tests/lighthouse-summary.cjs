const fs=require('node:fs');
for(const file of fs.readdirSync('lighthouse-results').filter(f=>f.endsWith('.json'))){
 const data=JSON.parse(fs.readFileSync('lighthouse-results/'+file,'utf8'));
 const scores=Object.fromEntries(Object.entries(data.categories).map(([k,v])=>[k,Math.round(v.score*100)]));
 const issues=Object.entries(data.audits).filter(([id,a])=>a.score!==null&&a.score<0.9&&!['informative','manual','notApplicable'].includes(a.scoreDisplayMode)).map(([id,a])=>({id,title:a.title,score:a.score,savingsMs:a.details?.overallSavingsMs||0,display:a.displayValue||''})).sort((a,b)=>b.savingsMs-a.savingsMs).slice(0,12);
 console.log(JSON.stringify({page:file,scores,issues}));
}