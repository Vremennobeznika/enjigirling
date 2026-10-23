/* ХРОМА — полностью самостоятельное упражнение. Без внешних библиотек и запросов. */
(function () {
  'use strict';
  var COLORS = [
    {id:'cloud', name:'Облачный', hex:'#B9C9CD', ink:'#202A30'},
    {id:'rose', name:'Терракот', hex:'#CC826F', ink:'#251A17'},
    {id:'fern', name:'Папоротник', hex:'#769E88', ink:'#13281C'},
    {id:'orchid', name:'Орхидея', hex:'#AD93C7', ink:'#24172F'},
    {id:'amber', name:'Янтарный', hex:'#D8AF68', ink:'#30210E'},
    {id:'ocean', name:'Прилив', hex:'#638FAD', ink:'#101F2A'},
    {id:'ink', name:'Графит', hex:'#585F70', ink:'#FFFFFF'},
    {id:'coral', name:'Коралловый', hex:'#E29E97', ink:'#3A1C1B'},
    {id:'lime', name:'Оливковый', hex:'#A7B67A', ink:'#242C14'}
  ];
  // Два различных порядка отображения: исходная позиция карточки не должна определять результат.
  var DISPLAYS = [
    ['orchid','lime','rose','cloud','ink','amber','fern','coral','ocean'],
    ['amber','ocean','fern','coral','cloud','rose','lime','orchid','ink']
  ];
  var PROGRESS_KEY = 'chroma.progress.v1';
  var BACKUP_KEY = 'chroma.progress.backup.v2';
  var CHECKPOINT_KEY = 'chroma.progress.checkpoint.v2';
  var revision = 0;
  var goodState = null;
  var recovering = false;
  var recoveryFailures = 0;
  var THEME_KEY = 'chroma.theme.v1';
  var stage = document.getElementById('stage-content');
  var title = document.getElementById('stage-title');
  var kicker = document.getElementById('stage-kicker');
  var counter = document.getElementById('stage-counter');
  var progress = document.getElementById('progress');
  var progressFill = document.getElementById('progress-fill');
  var announcer = document.getElementById('announcer');
  var modal = document.getElementById('modal-backdrop');
  var lastFocus = null;
  var deferredInstall = null;
  var state = {phase:'intro',round:0,rounds:[[],[]]};

  function storageGet(key){try{return window.localStorage.getItem(key);}catch(e){return null;}}
  function storageSet(key,value){try{window.localStorage.setItem(key,value);}catch(e){/* режим без хранения */}}
  function storageRemove(key){try{window.localStorage.removeItem(key);}catch(e){}}
  function ancestorWithAttribute(node,attribute){while(node&&node!==document){if(node.nodeType===1&&node.hasAttribute(attribute))return node;node=node.parentNode;}return null;}
  function colorById(id){for(var i=0;i<COLORS.length;i++){if(COLORS[i].id===id)return COLORS[i];}return null;}
  function isValidIds(list){if(!Array.isArray(list)||list.length>COLORS.length)return false;var seen={};for(var i=0;i<list.length;i++){if(typeof list[i]!=='string'||!colorById(list[i])||seen[list[i]])return false;seen[list[i]]=true;}return true;}
  function validateState(x){
    if(!x||!Array.isArray(x.rounds)||x.rounds.length!==2||!isValidIds(x.rounds[0])||!isValidIds(x.rounds[1]))return false;
    var a=x.rounds[0].length,b=x.rounds[1].length;
    return (x.phase==='intro'&&x.round===0&&a===0&&b===0)||
      (x.phase==='choose'&&x.round===0&&a<9&&b===0)||
      (x.phase==='pause'&&x.round===0&&a===9&&b===0)||
      (x.phase==='choose'&&x.round===1&&a===9&&b<9)||
      (x.phase==='results'&&x.round===1&&a===9&&b===9);
  }
  function canonical(x){return JSON.stringify({phase:x.phase,round:x.round,rounds:x.rounds});}
  // Checksum catches truncated writes/bit flips. It is not cryptographic authentication.
  function checksum(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=typeof Math.imul==='function'?(Math.imul(h,16777619)>>>0):((h*16777619)>>>0);}return ('00000000'+h.toString(16)).slice(-8);}
  function validRevision(x){return typeof x==='number'&&x>=1&&x<=2147483640&&x%1===0;}
  function readRecord(key){
    var raw=storageGet(key);if(!raw||raw.length>3500)return null;
    try{
      var x=JSON.parse(raw);if(!validateState(x))return null;
      var rev=0;
      if(key!==PROGRESS_KEY){
        if(!validRevision(x.rev)||typeof x.seal!=='string'||x.seal!==checksum(canonical(x)+'|'+x.rev))return null;
        rev=x.rev;
      } else if(x.rev!==undefined){
        if(!validRevision(x.rev)||x.seal!==checksum(canonical(x)+'|'+x.rev))return null;
        rev=x.rev;
      }
      return {rev:rev,state:JSON.parse(canonical(x))};
    }catch(e){return null;}
  }
  function restore(){
    var choices=[readRecord(PROGRESS_KEY),readRecord(BACKUP_KEY),readRecord(CHECKPOINT_KEY)].filter(Boolean);
    choices.sort(function(a,b){return b.rev-a.rev;});
    if(choices.length){revision=choices[0].rev;state=choices[0].state;}
    else {revision=0;state={phase:'intro',round:0,rounds:[[],[]]};}
    goodState=JSON.parse(canonical(state));
  }
  function save(){
    if(!validateState(state))throw Error('Invalid progress transition');
    revision=revision>=2147483640?1:revision+1;
    var payload=JSON.parse(canonical(state));payload.rev=revision;payload.seal=checksum(canonical(state)+'|'+revision);
    var data=JSON.stringify(payload);
    // Write different slots; after interrupted write choose the highest intact revision.
    storageSet(revision%2===0?BACKUP_KEY:CHECKPOINT_KEY,data);
    storageSet(PROGRESS_KEY,data);
    goodState=JSON.parse(canonical(state));
  }
  function fallbackScreen(){
    try{
      stage.innerHTML='<div class="recovery-panel" role="alert"><h3>Не удалось показать этот шаг</h3><p>Сохранённые данные не удалены. Перезапустите экран или начните новый выбор.</p><button type="button" class="btn btn-primary" data-action="retry">Повторить отображение</button><button type="button" class="btn btn-secondary" data-action="restart">Начать заново</button></div>';
    }catch(e){/* A fatal DOM failure cannot be recovered from within JS. */}
  }
  function recover(){
    if(recovering){fallbackScreen();return;}
    recovering=true;
    recoveryFailures++;
    try{
      if(goodState&&validateState(goodState))state=JSON.parse(canonical(goodState));
      else restore();
      if(recoveryFailures<=2){
        renderStage();
        speak('Экран восстановлен с последнего сохранённого шага.');
      }else fallbackScreen();
    }catch(e){fallbackScreen();}
    recovering=false;
  }
  function speak(message){announcer.textContent='';window.setTimeout(function(){announcer.textContent=message;},20);}
  function setHeader(small,heading){kicker.textContent=small;title.textContent=heading;}
  function setProgress(current){counter.textContent=(current<10?'0':'')+current+' / 18';progress.setAttribute('aria-valuenow',String(current));progressFill.style.width=(current/18*100)+'%';}
  function colorStyle(c){return '--color:'+c.hex+';--label:'+c.ink+';';}
  function chosenHtml(picks){if(!picks.length)return '<span class="empty-state">Здесь появится порядок выбора</span>';var html='';for(var i=0;i<picks.length;i++){var c=colorById(picks[i]);html+='<span class="chosen-chip"><b>'+(i+1)+'.</b><span class="mini-dot" style="--dot:'+c.hex+'"></span>'+c.name+'</span>';}return html;}
  function renderIntro(){setHeader('01 — ПЕРЕД НАЧАЛОМ','Простое упражнение на выбор');setProgress(0);stage.innerHTML='<div class="intro-grid"><div class="intro-item"><span class="intro-no">01 / 03</span><b>Выберите цвета по порядку</b></div><div class="intro-item"><span class="intro-no">02 / 03</span><b>Сделайте второй проход</b></div><div class="intro-item"><span class="intro-no">03 / 03</span><b>Сравните два списка</b></div></div><p class="workspace-note">Выбирайте оттенок, который нравится больше остальных <strong>в этот момент</strong>. Повторяйте, пока не останется ни одного. Правильных и неправильных ответов нет. Настройку темы лучше не менять между раундами. Если оттенки трудно различить, это упражнение можно пропустить.</p><div class="action-row"><button class="btn btn-primary" data-action="start">Начать выбор <span aria-hidden="true">↗</span></button></div>';}
  function renderChoose(){var round=state.round,picks=state.rounds[round],left=DISPLAYS[round].filter(function(id){return picks.indexOf(id)<0;});setHeader(round===0?'02 — ПЕРВЫЙ РАУНД':'04 — ВТОРОЙ РАУНД',round===0?'Какие цвета вам ближе?':'Выберите ещё раз');setProgress(state.rounds[0].length+state.rounds[1].length);var html='<p class="round-lede">'+(round===0?'Отметьте <strong>один оттенок</strong>, который хочется выбрать первым из оставшихся. Не анализируйте значение цветов.':'Повторите выбор без попытки воспроизвести первый список. Не ищите скрытого смысла в оттенках.')+'</p><p class="selection-tip">Осталось выбрать: <strong>'+left.length+' из 9</strong> · Нажимайте на цветные карточки</p><div class="palette" role="group" aria-label="Выберите предпочитаемый цвет">';for(var i=0;i<left.length;i++){var c=colorById(left[i]);html+='<button type="button" class="swatch" data-color="'+c.id+'" aria-label="Выбрать цвет '+c.name+'" style="'+colorStyle(c)+'"><span class="swatch-title">'+c.name+'</span><span class="swatch-index">'+('0'+(i+1)).slice(-2)+'</span></button>';}html+='</div><div class="small-heading">ВАШ ПОРЯДОК · '+picks.length+'/9</div><div class="chosen">'+chosenHtml(picks)+'</div><div class="divider-line"></div><div class="action-row"><button type="button" class="btn btn-secondary" data-action="undo" '+(!picks.length?'disabled':'')+'>← Отменить последний выбор</button><button type="button" class="btn btn-secondary" data-action="restart">Начать заново</button></div>';stage.innerHTML=html;}
  function renderPause(){setHeader('03 — ПЕРЕД ВТОРЫМ РАУНДОМ','Первый проход завершён');setProgress(9);stage.innerHTML='<div class="intermission"><div class="intermission-symbol" aria-hidden="true">◎</div><p class="round-lede">Первый порядок записан <strong>только на этом устройстве</strong>. Теперь пройдите ту же палитру ещё раз — карточки будут в другом расположении. Не пытайтесь повторить свой первый ответ.</p><div class="action-row"><button type="button" class="btn btn-primary" data-action="second">Перейти ко второму раунду <span aria-hidden="true">↗</span></button><button type="button" class="btn btn-secondary" data-action="restart">Начать заново</button></div></div>';}
  function rankingHtml(list,other){var html='<ol class="ranking">';for(var i=0;i<list.length;i++){var c=colorById(list[i]);var delta=other.indexOf(c.id)-i;var movement=delta===0?'—':delta>0?'↓'+delta:'↑'+Math.abs(delta);html+='<li class="rank-item"><span class="rank-number">'+(i+1)+'</span><span class="rank-color" style="--dot:'+c.hex+'"></span><span class="rank-name">'+c.name+'</span><span class="rank-movement" aria-label="Сдвиг '+delta+'">'+movement+'</span></li>';}return html+'</ol>';}
  function renderResults(){var a=state.rounds[0],b=state.rounds[1],same=0;for(var i=0;i<9;i++)if(a[i]===b[i])same++;setHeader('05 — ВАШИ РЕЗУЛЬТАТЫ','Два момента — два выбора');setProgress(18);stage.innerHTML='<p class="round-lede">Это только сравнение порядка выбора, <strong>не оценка личности</strong>. Стрелка в строке показывает, где этот цвет находится в другом раунде: ↑ выше, ↓ ниже, — та же позиция.</p><div class="comparison"><div class="rank-box"><h3>РАУНД 01</h3>'+rankingHtml(a,b)+'</div><div class="rank-box"><h3>РАУНД 02</h3>'+rankingHtml(b,a)+'</div></div><p class="insight">На одинаковых позициях осталось <strong>'+same+' из 9 оттенков</strong>. Первый выбор: <strong>'+colorById(a[0]).name+'</strong> → <strong>'+colorById(b[0]).name+'</strong>. Это описание текущих предпочтений, а не измерение состояния здоровья.</p><div class="action-row"><button type="button" class="btn btn-primary" data-action="copy">Скопировать результат <span aria-hidden="true">↗</span></button><button type="button" class="btn btn-secondary" data-action="download">Сохранить .txt</button><button type="button" class="btn btn-secondary" data-action="restart">Новый опыт</button></div>'}
  function renderStage(){if(state.phase==='intro')renderIntro();else if(state.phase==='choose')renderChoose();else if(state.phase==='pause')renderPause();else renderResults();}
  function render(){try{save();renderStage();recoveryFailures=0;}catch(e){recover();}}
  function clearState(){state={phase:'intro',round:0,rounds:[[],[]]};save();render();speak('Выбор начат заново');}
  function pick(id){if(state.phase!=='choose'||!colorById(id)||state.rounds[state.round].indexOf(id)!==-1)return;state.rounds[state.round].push(id);var count=state.rounds[state.round].length;if(count===9){if(state.round===0){state.phase='pause';speak('Первый раунд завершён');}else{state.phase='results';speak('Готово. Два раунда завершены.');}}else{speak('Добавлен цвет '+colorById(id).name+'. Осталось '+(9-count));}render();var next=stage.querySelector('.swatch')||stage.querySelector('[data-action="second"]')||stage.querySelector('[data-action="download"]');if(next)next.focus();}
  function summary(){var lines=['ХРОМА — цветовой выбор','Личный порядок предпочтений. Не является психологической диагностикой.',''];for(var r=0;r<2;r++){lines.push('Раунд 0'+(r+1)+':');for(var i=0;i<9;i++){var c=colorById(state.rounds[r][i]);lines.push((i+1)+'. '+c.name+' ('+c.hex+')');}lines.push('');}lines.push('Данные сформированы локально; передача на сервер не выполняется.');return lines.join('\n');}
  function fallbackCopy(str){var t=document.createElement('textarea');t.value=str;t.setAttribute('readonly','readonly');t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();var ok=false;try{ok=document.execCommand('copy');}catch(e){}document.body.removeChild(t);return ok;}
  function copyResult(){var str=summary();if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(str).then(function(){speak('Результат скопирован');},function(){speak(fallbackCopy(str)?'Результат скопирован':'Копирование недоступно. Воспользуйтесь сохранением файла.');});}else{speak(fallbackCopy(str)?'Результат скопирован':'Копирование недоступно. Воспользуйтесь сохранением файла.');}}
  function downloadResult(){if(window.CHROMA_NATIVE&&typeof window.CHROMA_NATIVE.saveTxt==='function'){try{window.CHROMA_NATIVE.saveTxt(unescape(encodeURIComponent(summary())));speak('Откройте выбор файла для сохранения результата');}catch(e){speak('Не удалось открыть сохранение. Попробуйте скопировать результат.');}return;}var blob=new Blob(['\ufeff'+summary()],{type:'text/plain;charset=utf-8'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='chroma-color-choice.txt';a.style.display='none';document.body.appendChild(a);a.click();document.body.removeChild(a);window.setTimeout(function(){URL.revokeObjectURL(url);},1000);speak('Сохранение файла запущено');}
  function applyTheme(name){document.documentElement.setAttribute('data-theme',name);storageSet(THEME_KEY,name);var light=name==='light';document.getElementById('theme-btn').setAttribute('aria-label','Переключить на '+(light?'тёмную':'светлую')+' тему');document.getElementById('theme-label').textContent=light?'Тёмная тема':'Светлая тема';document.getElementById('theme-color').setAttribute('content',light?'#f3f2ee':'#15171d');}
  function modalOpen(heading,html){lastFocus=document.activeElement;document.getElementById('modal-title').textContent=heading;document.getElementById('modal-body').innerHTML=html;modal.hidden=false;document.body.style.overflow='hidden';modal.querySelector('.modal-close').focus();}
  function modalClose(){modal.hidden=true;document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  function installHelp(){var ua=navigator.userAgent||'';var ios=/iPad|iPhone|iPod/.test(ua);var android=/Android/.test(ua);if(ios)modalOpen('Установка на iPhone','<p>Откройте эту страницу в Safari. Нажмите <strong>«Поделиться»</strong>, затем <strong>«На экран Домой»</strong> и <strong>«Добавить»</strong>. На новых версиях iOS включите «Открывать как веб-приложение», если этот пункт доступен.</p><p>После первого открытия с интернетом приложение можно использовать офлайн.</p>');else if(android)modalOpen('Установка на Android','<p>Откройте сайт в Chrome и выберите в меню <strong>«Установить приложение»</strong> или <strong>«Добавить на главный экран»</strong>. Наличие кнопки зависит от браузера и устройства.</p><p>После первого открытия с интернетом приложение может работать офлайн.</p>');else modalOpen('Установка приложения','<p>На iPhone в Safari: <strong>Поделиться → На экран Домой</strong>.</p><p>На Android в Chrome: <strong>меню → Установить приложение</strong> или <strong>Добавить на главный экран</strong>.</p><p>Установка требует публикации сайта по HTTPS. Из локального HTML-файла установить PWA нельзя.</p>');}
  function privacyHelp(){modalOpen('Данные и ограничения','<p><strong>Без регистрации, аналитики и рекламы.</strong> Выборы и настройка темы могут храниться только в браузере на вашем устройстве. Ничего не отправляется на сервер.</p><p>При очистке данных сайта результат исчезнет. Для сохранения используйте кнопку «Сохранить .txt». Цвета экрана не стандартизированы, а упражнение не предназначено для диагностики.</p><p>Используется собственная палитра и собственная система сравнения; приложение не является официальной версией какого-либо стороннего психологического теста.</p>');}
  document.addEventListener('click',function(event){var colorButton=ancestorWithAttribute(event.target,'data-color');if(colorButton){try{pick(colorButton.getAttribute('data-color'));}catch(e){recover();}return;}var btn=ancestorWithAttribute(event.target,'data-action');if(!btn)return;try{var action=btn.getAttribute('data-action');if(action==='theme'){applyTheme(document.documentElement.getAttribute('data-theme')==='light'?'dark':'light');}
    else if(action==='start'){state.phase='choose';state.round=0;state.rounds=[[],[]];render();}
    else if(action==='second'){state.phase='choose';state.round=1;render();}
    else if(action==='undo'){var picks=state.rounds[state.round];if(picks.length){picks.pop();render();speak('Последний выбор отменён');}}
    else if(action==='restart'){if(state.phase==='intro'||window.confirm('Удалить текущий результат и начать заново?'))clearState();}
    else if(action==='copy'&&state.phase==='results'){copyResult();}
    else if(action==='download'&&state.phase==='results'){downloadResult();}
    else if(action==='privacy'){privacyHelp();}
    else if(action==='retry'){recovering=false;recoveryFailures=0;render();}
    else if(action==='install'){if(deferredInstall){deferredInstall.prompt();deferredInstall.userChoice.then(function(){deferredInstall=null;},function(){deferredInstall=null;});}else installHelp();}
    else if(action==='close-modal'){modalClose();}
    }catch(e){recover();}
  });
  window.addEventListener('error',function(e){if(e&&e.error){recover();}});
  window.addEventListener('unhandledrejection',function(){recover();});
  document.addEventListener('keydown',function(e){if(modal.hidden)return;if(e.key==='Escape'){modalClose();return;}if(e.key==='Tab'){var els=modal.querySelectorAll('button:not([disabled])');if(!els.length)return;var first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  modal.addEventListener('click',function(e){if(e.target===modal)modalClose();});
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredInstall=e;});
  window.addEventListener('appinstalled',function(){deferredInstall=null;speak('Приложение установлено');});
  if(!window.CHROMA_NATIVE&&'serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){});});}
  try{applyTheme(storageGet(THEME_KEY)==='light'?'light':'dark');restore();render();}catch(e){recover();}
}());
