/* PSHO goal tracker: private, offline, no dependencies. */
(function(w){
'use strict';
var api=null, chosen={}, MAX_GOALS=60, MAX_MARKS=2500, DAY=86400000;
var strings={
ru:{empty:'Целей пока нет.',weekly:'раз в неделю',every:'раз в',days:'дн.',avoid:'ежедневное воздержание',done:'Выполнено',clean:'Удалось',lapse:'Был срыв',clear:'Снять отметку',archive:'В архив',restore:'Вернуть',rename:'Переименовать',remove:'Удалить',archived:'Архивные цели',date:'Дата отметки',progress:'Прогресс',week:'Текущая неделя',period:'Запланированные дни за 28 дней',observed:'Из отмеченных дней',coverage:'Отмечено дней',future:'Нельзя отмечать будущие даты или дни до начала цели',invalid:'Проверь название, расписание и дату',duplicate:'Такая цель уже есть',saved:'Цель добавлена',marked:'Отметка сохранена',unchanged:'Такая отметка уже есть',limit:'Достигнут лимит целей или отметок',deleteAsk:'Удалить цель и всю историю отметок безвозвратно?',renameAsk:'Новое название цели',template:'Шаблон заполнен. Сохрани цель, чтобы начать отслеживание.',hintWeek:'Счётчик недели начинается в понедельник. Можно отметить не более одного выполнения в день.',hintInterval:'Отсчёт ведётся от даты начала. Внеплановые занятия видны в календаре, но не меняют расписание.',hintAvoid:'Нет отметки — результат неизвестен, а не провал. Срывы и удачные дни отмечаются вручную.',notMarked:'Нет отметок',unknown:'Пропуски не оцениваются'},
en:{empty:'No goals yet.',weekly:'times weekly',every:'every',days:'days',avoid:'daily avoidance',done:'Completed',clean:'Stayed on track',lapse:'Lapse',clear:'Clear mark',archive:'Archive',restore:'Restore',rename:'Rename',remove:'Delete',archived:'Archived goals',date:'Date',progress:'Progress',week:'Current week',period:'Scheduled days in 28 days',observed:'Of recorded days',coverage:'Days logged',future:'Future and pre-start dates cannot be marked',invalid:'Check title, schedule and start date',duplicate:'This goal already exists',saved:'Goal added',marked:'Mark saved',unchanged:'Already marked',limit:'Goal or mark limit reached',deleteAsk:'Permanently delete this goal and its entire history?',renameAsk:'New goal title',template:'Example filled in. Save to start tracking.',hintWeek:'Weekly counting starts on Monday; at most one completion per day.',hintInterval:'Schedule is anchored to start date. Extra sessions are shown but do not move due days.',hintAvoid:'Unmarked days are unknown, not failures. Successes and lapses are recorded manually.',notMarked:'No marks yet',unknown:'Unmarked days remain unknown'}};
function lang(){return w.PSHO_I18N&&w.PSHO_I18N.getLanguage&&w.PSHO_I18N.getLanguage()==='en'?'en':'ru';}
function t(k){return strings[lang()][k]||k;}
function $(id){return document.getElementById(id);}
function node(tag,cls,value){var e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=String(value);return e;}
function cp(x){return JSON.parse(JSON.stringify(x));}
function eq(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function has(o,k){return Object.prototype.hasOwnProperty.call(o,k);}
function dayOK(s){if(typeof s!=='string'||!/^20\d\d-\d\d-\d\d$/.test(s))return false;var date=new Date(s+'T00:00:00Z');return !isNaN(date.getTime())&&date.toISOString().slice(0,10)===s;}
function num(s){return Date.parse(s+'T00:00:00Z')/DAY;}
function iso(n){return new Date(n*DAY).toISOString().slice(0,10);}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function valid(g){
 if(!g||typeof g!=='object'||Array.isArray(g)||typeof g.id!=='string'||!/^g-[a-z0-9-]{5,70}$/.test(g.id)||typeof g.name!=='string'||!g.name.trim()||g.name.length>80||/[\u0000-\u001f]/.test(g.name)||['weekly','interval','avoid'].indexOf(g.kind)<0||!Number.isInteger(g.target)||g.target<1||g.target>(g.kind==='weekly'?7:g.kind==='interval'?30:1)||!dayOK(g.start)||typeof g.archived!=='boolean'||!g.marks||typeof g.marks!=='object'||Array.isArray(g.marks))return false;
 var dates=Object.keys(g.marks);return dates.length<=MAX_MARKS&&dates.every(function(date){return dayOK(date)&&date>=g.start&&(g.marks[date]==='done'||g.kind==='avoid'&&g.marks[date]==='lapse');});
}
function attrs(g){return {name:g.name,kind:g.kind,target:g.target,start:g.start,archived:g.archived};}
function merge(current,base,changed){
 current=current||[];base=base||[];changed=changed||[];
 var out=cp(current),before=new Map(base.map(function(g){return[g.id,g];})),after=new Map(changed.map(function(g){return[g.id,g];}));
 base.forEach(function(g){if(after.has(g.id))return;var i=out.findIndex(function(x){return x.id===g.id;});if(i<0||!eq(out[i],g))throw Error('goal-delete-conflict');out.splice(i,1);});
 changed.forEach(function(g){var old=before.get(g.id),i=out.findIndex(function(x){return x.id===g.id;});if(!old){if(i>=0){if(!eq(out[i],g))throw Error('goal-create-conflict');}else out.push(cp(g));return;}
 if(i<0)throw Error('goal-missing');var live=out[i];
 if(!eq(attrs(old),attrs(g))){if(!eq(attrs(old),attrs(live))&&!eq(attrs(g),attrs(live)))throw Error('goal-edit-conflict');var a=attrs(g);Object.keys(a).forEach(function(k){live[k]=a[k];});}
 var dates=new Set(Object.keys(old.marks).concat(Object.keys(g.marks)));
 dates.forEach(function(date){var b=has(old.marks,date)?old.marks[date]:null,v=has(g.marks,date)?g.marks[date]:null;if(b===v)return;var now=has(live.marks,date)?live.marks[date]:null;if(now!==b&&now!==v)throw Error('goal-mark-conflict');if(v===null)delete live.marks[date];else live.marks[date]=v;});
 });return out;
}
function goals(){var data=api.getData();if(!Array.isArray(data.goals))data.goals=[];return data.goals;}
function change(fn){var old=cp(goals());fn(goals());if(!api.persist()){api.getData().goals=old;render();return false;}render();return true;}
function uid(){var id;if(w.crypto&&w.crypto.getRandomValues){var a=new Uint32Array(3);w.crypto.getRandomValues(a);id='g-'+Array.prototype.map.call(a,function(v){return v.toString(36);}).join('-');}else id='g-'+Date.now().toString(36)+'-'+Math.floor(Math.random()*1000000000).toString(36);return id;}
function due(g,date){return date>=g.start&&(g.kind!=='interval'||(num(date)-num(g.start))%g.target===0);}
function summary(g){
 var end=num(today()),start=Math.max(num(g.start),end-27),done=0,lapses=0,scheduled=0,observed=0,extra=0;
 if(g.kind==='weekly'){var first=end-(new Date(end*DAY).getUTCDay()+6)%7;for(var n=Math.max(first,num(g.start));n<=end;n++){if(g.marks[iso(n)]==='done')done++;}return {done:done,target:g.target,rate:Math.min(100,Math.round(done*100/g.target)),label:t('week'),other:''};}
 for(var n=start;n<=end;n++){var day=iso(n),v=g.marks[day];if(g.kind==='interval'&&!due(g,day)){if(v==='done')extra++;continue;}scheduled++;if(v){observed++;if(v==='done')done++;else lapses++;}}
 if(g.kind==='avoid')return {done:done,target:observed,rate:observed?Math.round(done*100/observed):null,label:t('observed'),other:t('coverage')+': '+observed+' / '+scheduled+(lapses?' · '+t('lapse')+': '+lapses:'')};
 return {done:done,target:scheduled,rate:scheduled?Math.round(done*100/scheduled):null,label:t('period'),other:extra?'+'+extra+' '+t('done').toLowerCase()+' ('+t('unknown')+')':t('unknown')};
}
function scheduleText(g){return g.kind==='weekly'?g.target+' '+t('weekly'):g.kind==='interval'?t('every')+' '+g.target+' '+t('days'):t('avoid');}
function kindChanged(){var k=$('goal-kind').value;$('goal-week-wrap').hidden=k!=='weekly';$('goal-interval-wrap').hidden=k!=='interval';$('goal-schedule-hint').textContent=t(k==='weekly'?'hintWeek':k==='interval'?'hintInterval':'hintAvoid');}
function render(){
 if(!api)return;var host=$('goal-list');if(!host)return;host.textContent='';var list=goals();if(!list.length){host.appendChild(node('div','empty',t('empty')));return;}
 var active=list.filter(function(g){return !g.archived;}),archived=list.filter(function(g){return g.archived;});
 function card(g){var s=summary(g),article=node('article','panel goal-card'),head=node('div','goal-head'),left=node('div'),title=node('h2','goal-title',g.name);
 left.appendChild(title);left.appendChild(node('p','hint',scheduleText(g)+' · '+g.start));head.appendChild(left);head.appendChild(node('strong','goal-rate',s.rate===null?'—':s.rate+'%'));article.appendChild(head);
 var prog=node('progress','goal-progress');prog.max=100;prog.value=s.rate===null?0:s.rate;prog.setAttribute('aria-label',t('progress')+': '+(s.rate===null?t('notMarked'):s.rate+'%'));article.appendChild(prog);
 var line=node('div','goal-progress-label');line.appendChild(node('span','',s.label));line.appendChild(node('strong','',s.done+' / '+s.target));article.appendChild(line);if(s.other)article.appendChild(node('p','hint',s.other));
 var calendar=node('div','goal-calendar'),end=num(today());for(var n=end-27;n<=end;n++){var date=iso(n),mark=g.marks[date],scheduled=due(g,date),cell=node('span','goal-day'+(scheduled?' is-due':'')+(mark==='done'?' is-done':mark==='lapse'?' is-lapse':''),date.slice(-2));cell.title=date+(mark?' · '+t(mark==='lapse'?'lapse':g.kind==='avoid'?'clean':'done'):'');cell.setAttribute('aria-label',cell.title);calendar.appendChild(cell);}article.appendChild(calendar);
 if(!g.archived){var dateLine=node('label','goal-date-line',t('date')),input=node('input');input.id='goal-date-'+g.id;input.type='date';input.dataset.selectGoal=g.id;input.min=g.start;input.max=today();var selected=chosen[g.id]||today();input.value=selected>=g.start&&selected<=today()?selected:today();dateLine.appendChild(input);article.appendChild(dateLine);}
 var actions=node('div','goal-actions');function button(action,label,cls){var b=node('button',cls||'soft-btn',label);b.type='button';b.dataset.action=action;b.dataset.goalId=g.id;actions.appendChild(b);}
 if(!g.archived){button('done',t(g.kind==='avoid'?'clean':'done'),'primary');if(g.kind==='avoid')button('lapse',t('lapse'));button('clear',t('clear'));}
 button('rename',t('rename'));button(g.archived?'restore':'archive',t(g.archived?'restore':'archive'));button('remove',t('remove'),'danger-btn');article.appendChild(actions);return article;}
 active.forEach(function(g){host.appendChild(card(g));});
 if(archived.length){host.appendChild(node('h2','goals-archived-title',t('archived')));archived.forEach(function(g){host.appendChild(card(g));});}
}
function mount(bridge){
 if(api)return;api=bridge;var start=$('goal-start');start.value=today();start.max=today();
 $('goal-kind').addEventListener('change',kindChanged);kindChanged();
 $('goal-presets').addEventListener('click',function(ev){var b=ev.target.closest('[data-goal-preset]');if(!b)return;var kind=b.dataset.goalPreset;$('goal-name').value=kind==='draw'?(lang()==='en'?'Draw':'Рисовать'):kind==='read'?(lang()==='en'?'Read':'Читать'):(lang()==='en'?'Do not smoke':'Не курить');$('goal-kind').value=kind==='draw'?'weekly':kind==='read'?'interval':'avoid';$('goal-week-target').value='2';$('goal-interval-target').value='2';kindChanged();api.toast(t('template'));});
 $('goal-form').addEventListener('submit',function(e){e.preventDefault();var k=$('goal-kind').value,name=$('goal-name').value.trim().replace(/\s+/g,' '),target=Number(k==='weekly'?$('goal-week-target').value:k==='interval'?$('goal-interval-target').value:1),g={id:uid(),name:name,kind:k,target:target,start:start.value,archived:false,marks:{}};
 if(!valid(g)||g.start>today()){api.toast(t('invalid'));return;}var list=goals();if(list.length>=MAX_GOALS){api.toast(t('limit'));return;}
 if(list.some(function(a){return !a.archived&&a.name.toLowerCase()===name.toLowerCase()&&a.kind===k})){api.toast(t('duplicate'));return;}
 while(list.some(function(a){return a.id===g.id}))g.id=uid();if(change(function(items){items.push(g);})){ $('goal-name').value='';api.toast(t('saved'));}});
 $('goal-list').addEventListener('change',function(e){var f=e.target.closest('[data-select-goal]');if(f)chosen[f.dataset.selectGoal]=f.value;});
 $('goal-list').addEventListener('click',function(e){var b=e.target.closest('[data-action]');if(!b)return;var id=b.dataset.goalId,action=b.dataset.action,g=goals().find(function(x){return x.id===id;});if(!g)return;
 if(action==='remove'){if(!w.confirm(t('deleteAsk')))return;change(function(items){items.splice(items.findIndex(function(x){return x.id===id;}),1);});delete chosen[id];return;}
 if(action==='archive'||action==='restore'){change(function(){g.archived=action==='archive';});return;}
 if(action==='rename'){var name=w.prompt(t('renameAsk'),g.name);if(name===null)return;name=name.trim().replace(/\s+/g,' ');if(!name||name.length>80||/[\u0000-\u001f]/.test(name)){api.toast(t('invalid'));return;}if(goals().some(function(x){return x.id!==id&&!x.archived&&x.name.toLowerCase()===name.toLowerCase()})){api.toast(t('duplicate'));return;}change(function(){g.name=name;});return;}
 if(g.archived)return;var f=$('goal-date-'+g.id),date=f?f.value:today();if(!dayOK(date)||date<g.start||date>today()){api.toast(t('future'));return;}
 var v=action==='clear'?null:action==='lapse'?'lapse':'done';if(v==='lapse'&&g.kind!=='avoid')return;if((g.marks[date]||null)===v){api.toast(t('unchanged'));return;}
 if(v&&!has(g.marks,date)&&Object.keys(g.marks).length>=MAX_MARKS){api.toast(t('limit'));return;}
 if(change(function(){if(v===null)delete g.marks[date];else g.marks[date]=v;}))api.toast(t('marked'));
 });render();
}
w.PSHO_GOALS={valid:valid,merge:merge,mount:mount,render:render,summary:summary};
})(window);
