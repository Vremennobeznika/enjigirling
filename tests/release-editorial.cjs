const fs=require('node:fs');
const assert=require('node:assert/strict');
const base='https://vremennobeznika.github.io/enjigirling/';
const pages=['index','calendar','resources','dictionary','map','calculator','compare','processes','materials'];
const preview='social-preview.webp';
assert.ok(fs.existsSync(preview)&&fs.statSync(preview).size>=10000,'public social preview image is missing or empty');
function attr(html,name,kind='property'){
 const pattern=new RegExp('<meta\\s+'+kind+'="'+name+'"\\s+content="([^"]+)"','i');
 const match=html.match(pattern);
 assert.ok(match,'missing '+kind+'='+name);
 assert.equal([...html.matchAll(new RegExp('<meta\\s+'+kind+'="'+name+'"','gi'))].length,1,'duplicate '+name);
 return match[1];
}
for(const page of pages){
 const html=fs.readFileSync(page+'.html','utf8');
 const charset=html.match(/<meta\\s+charset=["'][^"']+["']\\s*\\/?>/i);
 assert.ok(charset&&Buffer.byteLength(html.slice(0,charset.index))<=512,page+': charset must precede long social metadata');
 const title=html.match(/<title>([^<]+)<\/title>/i)?.[1];
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
 assert.ok(title&&canonical,page+': missing title or canonical URL');
 assert.ok(attr(html,'og:title').replace(/&amp;/g,'&')===title,page+': social title differs');
 assert.equal(attr(html,'og:url'),canonical,page+': social canonical differs');
 assert.equal(attr(html,'og:locale'),'ru_RU');
 assert.equal(attr(html,'og:image'),base+preview);
 assert.equal(attr(html,'twitter:image','name'),base+preview);
 assert.equal(attr(html,'twitter:card','name'),'summary_large_image');
 assert.match(attr(html,'og:description'),/инженер|Инженер|калькулятор|Калькулятор|сообщест|материал|технолог|професс|справочник|информац|образован|календар|журнал/i,page+': empty/generic social description');
 assert.equal(attr(html,'author','name'),'Редакция ENJIGIRLING');
 assert.ok(!/name="robots"\s+content="noindex"/i.test(html),page+': accidentally blocked indexing');
}
const home=fs.readFileSync('index.html','utf8');
assert.match(home,/>208 процессов<\/a>/,'homepage process count outdated');
assert.match(home,/>172 материала<\/a>/,'homepage material count outdated');
assert.doesNotMatch(home,/>12 процессов<\/a>|>12 групп материалов<\/a>/,'legacy catalog statistics');
assert.match(home,/t\.me\/enjigirling/,'editorial Telegram contact missing');
assert.match(home,/cons_doc_LAW_34683\/e76d6076/,'precise labor code article link missing');
const calc=fs.readFileSync('calculator.html','utf8');
for(const url of ['www.modbus.org/introduction-to-modbus','docs.nvidia.com/cuda/cuda-math-api/','knowledge.ni.com/KnowledgeArticleDetails','www.iso.org/standard/54497.html','web.mit.edu/2.810/'])
 assert.ok(calc.includes(url),'missing source adjacent to calculator '+url);
assert.ok(fs.existsSync('audit/release-engineering-and-links-2026-10-25.md'),'release evidence matrix missing');
console.log('PASS release editorial: 9 social/author heads, screenshot, current counts, calculator sources and audit');
