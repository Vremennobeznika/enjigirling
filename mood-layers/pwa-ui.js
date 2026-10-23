/* PSHO install/update interface: never reads diary values or makes network requests. */
(function(){
'use strict';
var I=window.PSHO_I18N||{t:function(s){return s;}};var tr=function(s){return I.t(s);};
var box=document.getElementById('pwa-panel');
if(!box)return;
var action=document.getElementById('pwa-install');
var info=document.getElementById('pwa-howto');
var conn=document.getElementById('pwa-connection');
var update=document.getElementById('pwa-update');
var installEvent=null, registration=null, updating=false;
var ua=(navigator.userAgent||'').toLowerCase();
var isIOS=/iphone|ipad|ipod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
var isAndroid=/android/.test(ua);
var isStandalone=window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||!!navigator.standalone;
function instruction(){
 if(isIOS)return 'iPhone / iPad: открой эту страницу в Safari, нажми «Поделиться» → «На экран Домой» → «Добавить». Затем запускай PSHO с иконки. Если Safari предлагает «Открыть как веб-приложение», включи этот пункт.';
 if(isAndroid)return 'Android: открой эту страницу в Chrome или поддерживающем PWA браузере. Меню ⋮ → «Установить приложение» либо «Добавить на главный экран». Подтверди установку.';
 return 'Компьютер: открой страницу в Chrome или Edge и используй значок установки в адресной строке либо пункт «Установить приложение» в меню браузера. В Safari на macOS может быть пункт «Добавить в Dock». В других браузерах можно сохранить ссылку в закладки.';
}
function showHelp(){info.textContent=tr(instruction());info.hidden=false;action.setAttribute('aria-expanded','true');}
function updateConnection(){
 var online=navigator.onLine!==false;
 if(!('serviceWorker' in navigator))conn.textContent=tr('Этот браузер не поддерживает автономную установку. Записи можно вести через веб-страницу.');
 else if(!online)conn.textContent=tr('Нет подключения. Офлайн-запуск доступен после первой успешной загрузки приложения.');
 else if(navigator.serviceWorker.controller)conn.textContent=tr('Приложение подготовлено к офлайн-запуску. Записи — только на устройстве.');
 else conn.textContent=tr('При первой загрузке нужно подключение. Подготавливаем офлайн-режим…');
}
if(isStandalone){action.hidden=true;box.querySelector('.pwa-copy strong').textContent=tr('PSHO установлено');}
action.addEventListener('click',function(){
 if(installEvent){var e=installEvent;installEvent=null;e.prompt();Promise.resolve(e.userChoice).then(function(x){if(x&&x.outcome==='accepted'){action.hidden=true;}else showHelp();},showHelp);return;}
 if(info.hidden)showHelp();else{info.hidden=true;action.setAttribute('aria-expanded','false');}
});
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();installEvent=e;if(!isStandalone)action.textContent=tr('Установить PSHO');});
window.addEventListener('appinstalled',function(){action.hidden=true;info.hidden=true;box.querySelector('.pwa-copy strong').textContent=tr('PSHO установлено');});
window.addEventListener('online',updateConnection);
window.addEventListener('offline',updateConnection);
function pendingUpdate(){
 if(registration&&registration.waiting&&navigator.serviceWorker.controller){update.hidden=false;}
}
update.addEventListener('click',function(){
 if(!registration||!registration.waiting)return;
 var note=document.getElementById('note');
 if(note&&note.value.trim()&&!window.confirm(I.getLanguage&&I.getLanguage()==='en'?'There is unsaved text in the form. Save your entry first. Continue reloading?':'В форме есть текст. Перед обновлением сохрани запись. Продолжить с перезагрузкой страницы?'))return;
 updating=true;
 registration.waiting.postMessage({type:'SKIP_WAITING'});
});
if('serviceWorker' in navigator){
 navigator.serviceWorker.addEventListener('controllerchange',function(){updateConnection();if(updating)window.location.reload();});
 navigator.serviceWorker.getRegistration('./').then(function(reg){if(!reg)return;registration=reg;pendingUpdate();reg.addEventListener('updatefound',function(){var worker=reg.installing;if(worker)worker.addEventListener('statechange',function(){if(worker.state==='installed')pendingUpdate();});});}).catch(function(){});
 window.addEventListener('load',function(){navigator.serviceWorker.ready.then(function(reg){registration=reg;pendingUpdate();updateConnection();}).catch(function(){});});
}
window.addEventListener('psho-language-changed',function(){if(!isStandalone)action.textContent=tr(installEvent?'Установить PSHO':'Установить приложение');updateConnection();if(!info.hidden)info.textContent=tr(instruction());if(isStandalone)box.querySelector('.pwa-copy strong').textContent=tr('PSHO установлено');});
updateConnection();
})();
