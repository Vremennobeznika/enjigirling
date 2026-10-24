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
assert.ok(items.length>=148,'resource catalog unexpectedly small');
assert.ok(types.get('Чаты в Telegram')>=12,'Telegram chat category unexpectedly shrank');
assert.equal(types.get('Дружественные каналы'),11,'curated friendly channels must remain unchanged');
assert.ok(types.get('Онлайн-измерения')>=12,'measurement resources unexpectedly shrank');
for(const cat of ['Журналы','Форумы','Разработка ПО','САПР и конструирование','Научные базы и справочники','Стандарты и метрология','Обучение и курсы'])assert.ok(types.get(cat)>=3,'missing category: '+cat);
for(const id of ['platform-cyberleninka','platform-elibrary','platform-zhurnalivak'])assert.equal(items.find(x=>x.id===id).type,'Научные базы и справочники',id+' wrong group');
assert.ok(types.get('Журналы')>=48,'journals catalog too sparse');
const asuIds=['forum-asutpforum','forum-proasutp','forum-asu-tp-community','forum-cyberforum','forum-delta-electronics','ref-siemens-sieportal'];
const relatedAsuForumIds=['forum-metrologu','forum-electronix','forum-robotics-se','forum-cadcam','forum-opennet'];
assert.equal(types.has('АСУ ТП'),false,'ASU TP must be a subsection within Forums, not a category');
for(const id of [...asuIds,...relatedAsuForumIds]){
 const item=items.find(item=>item.id===id);
 assert.ok(item&&item.type==='Форумы'&&item.topic==='АСУ ТП','forum not in ASU TP subsection: '+id);
}
assert.equal(items.filter(x=>x.type==='Форумы'&&x.topic==='АСУ ТП').length,11,'unexpected ASU TP subsection count');
const forumTopics={'АСУ ТП':11,'САПР и конструирование':7,'Электроника и микроконтроллеры':4,'ИТ и технологии':2,'Общая инженерия':3};
const forumItems=items.filter(x=>x.type==='Форумы');
assert.equal(forumItems.length,27,'unexpected forum catalog size');
for(const [topic,expected] of Object.entries(forumTopics))
 assert.equal(forumItems.filter(x=>x.topic===topic).length,expected,'wrong forum grouping: '+topic);
assert.ok(forumItems.every(x=>Object.hasOwn(forumTopics,x.topic)),'unclassified forum or unknown subsection');
assert.equal(types.has('Платформы для разработок'),false,'code and CAD still merged');
for(const id of ['dev-github','dev-gitlab','dev-gitverse','dev-gitflic'])assert.equal(items.find(x=>x.id===id).type,'Разработка ПО',id+' wrong category');
for(const id of ['dev-grabcad','dev-onshape','dev-freecad','cad-kompas','cad-nanocad','cad-tflex'])assert.equal(items.find(x=>x.id===id).type,'САПР и конструирование',id+' wrong category');
assert.ok(items.filter(x=>x.type==='Журналы' && x.topic).length>=48,'journal topics incomplete');
const html=fs.readFileSync('resources.html','utf8'),js=fs.readFileSync('resources.js','utf8');
for(const id of ['resourceSearch','resourceSort','resourceGridView','resourceListView','resourcesGrid','resourcesFilter','resourcesStatus','resourceReset','resourceShowMore'])assert.ok(html.includes('id="'+id+'"'),id+' UI missing');
assert.ok(js.includes('new Intl.Collator'),'alphabetical sorting missing');
assert.ok(html.includes('class="resource-secondary-controls"'),'toolbar left-alignment missing');
assert.ok(js.includes('resource-topic-header'),'journal topical grouping missing');
assert.ok(js.includes("type === 'Журналы' || type === 'Форумы'")&&js.includes("type === 'Форумы' ? forumTopics"),'forum subsection headings missing');
assert.ok(js.includes("forumTopics.indexOf(a.topic)-forumTopics.indexOf(b.topic)"),'forum category order missing');
assert.ok(js.includes("activeType === 'Форумы' ? 32"),'forum filter must show all 27 without pagination');
const declared=js.match(/const forumTopics = \[([^\]]+)\]/);
assert.ok(declared,'forum headings configuration missing');
const forumOrder=[...declared[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
assert.deepEqual(forumOrder,['САПР и конструирование','Электроника и микроконтроллеры','ИТ и технологии','Общая инженерия'],'forum order after ASU TP is incorrect');
assert.ok(js.includes('nextRendered')&&js.includes('more.addEventListener'),'progressive rendering missing');
assert.ok(js.includes('searchTimer = setTimeout'),'search debounce missing');
assert.ok(!/fonts\\.(?:googleapis|gstatic)\\.com/.test(html),'resource page must not require remote fonts');
assert.ok(Buffer.byteLength(js)<=9000,'resource controller exceeds lightweight 9 KB budget');
assert.ok(Buffer.byteLength(src)<=81920,'resource dataset exceeds lightweight 80 KiB budget');
assert.ok(!/<script[^>]*src=["']https?:/i.test(html),'external scripts are forbidden for resource directory');
assert.ok(html.indexOf('src="resources-data.js"')<html.indexOf('src="resources.js"'),'dataset must load before controller');
console.log('PASS: '+items.length+' engineering resources, '+types.size+' types, preserved curated chats and channels');
