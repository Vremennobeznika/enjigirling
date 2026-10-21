const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const src=fs.readFileSync('resources-data.js','utf8');
const ctx={};vm.runInNewContext(src+';globalThis.__items=resources;',ctx,{timeout:5000});
const items=JSON.parse(JSON.stringify(ctx.__items));
const types=new Map();const ids=new Set();const urls=new Set();
for(const item of items){
 assert.ok(item.id&&item.name&&item.desc&&item.type&&item.link,'incomplete resource entry');
 assert.ok(!ids.has(item.id),'duplicate resource id: '+item.id);ids.add(item.id);
 assert.ok(/^https?:\/\//.test(item.link),'invalid resource URL: '+item.link);
 const url=new URL(item.link);
 assert.ok(url.hostname.includes('.'),'URL missing valid host: '+item.link);
 assert.ok(!urls.has(url.href),'duplicate resource link: '+url.href);urls.add(url.href);
 types.set(item.type,(types.get(item.type)||0)+1);
}
assert.ok(items.length>=100,'resource catalog unexpectedly small');
assert.equal(types.get('Чаты в Telegram'),12,'curated Telegram chats must remain unchanged');
assert.equal(types.get('Дружественные каналы'),11,'curated friendly channels must remain unchanged');
for(const cat of ['Журналы','Форумы','Платформы для разработок','Инструменты и симуляторы','Научные базы и справочники','Стандарты и метрология','Обучение и курсы'])assert.ok(types.get(cat)>=4,'missing category: '+cat);
for(const id of ['platform-cyberleninka','platform-elibrary','platform-zhurnalivak'])assert.equal(items.find(x=>x.id===id).type,'Научные базы и справочники',id+' wrong group');
const html=fs.readFileSync('resources.html','utf8'),js=fs.readFileSync('resources.js','utf8');
for(const id of ['resourceSearch','resourceSort','resourceGridView','resourceListView','resourcesGrid','resourcesFilter','resourcesStatus','resourceReset'])assert.ok(html.includes('id="'+id+'"'),id+' UI missing');
assert.ok(js.includes('new Intl.Collator'),'alphabetical sorting missing');
console.log('PASS: '+items.length+' engineering resources, '+types.size+' types, preserved curated chats and channels');
