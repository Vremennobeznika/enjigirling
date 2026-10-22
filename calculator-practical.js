/* Live results for the practical calculator panels. */
(()=>{'use strict';const M=window.PracticalMath;if(!M)return;const $=id=>document.getElementById(id);
const fmt=(v,d=4)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:d}).format(v);
function number(id){const el=$(id),raw=el.value.trim().replace(/[\s\u00a0]/g,'').replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw))throw Error('Проверьте поле «'+(el.getAttribute('aria-label')||el.previousElementSibling?.textContent||id)+'».');
 const n=Number(raw);if(!Number.isFinite(n))throw Error('Число вне диапазона: '+id);return n;
}
function bind(ids,output,make){const result=$(output);if(!result)return;let plain='';
 const update=()=>{try{plain=make();result.textContent=plain;result.dataset.valid='true'}catch(e){plain='';result.dataset.valid='false';result.textContent=e.message}};
 ids.forEach(id=>{const e=$(id);if(e)e.addEventListener(e.tagName==='SELECT'?'change':'input',update)});
 const copy=document.querySelector('[data-copy-for="'+output+'"]');
 if(copy)copy.addEventListener('click',async()=>{if(!plain)return;try{if(!navigator.clipboard||!window.isSecureContext)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(plain);copy.textContent='Скопировано'}catch{copy.textContent='Выделите результат и скопируйте'}setTimeout(()=>copy.textContent='Копировать результат',2500)});
 update();
}
function updatePF(){const mode=$('voltageSystem').value;$('voltagePF').disabled=mode==='dc';$('voltagePFLabel').textContent=mode==='dc'?'cos φ (для DC не используется)':'cos φ нагрузки'}
bind(['threeVoltage','threeCurrent','threePF'],'threeOutput',()=>{const r=M.threePhase(number('threeVoltage'),number('threeCurrent'),number('threePF'));return 'S = '+fmt(r.apparentKVA)+' кВА · P = '+fmt(r.activeKW)+' кВт · Q = '+fmt(r.reactiveKVAR)+' квар'});
bind(['voltageSystem','voltageNominal','voltageCurrent','voltageLength','voltageSection','voltageRho','voltagePF'],'voltageOutput',()=>{updatePF();const mode=$('voltageSystem').value;const r=M.cableDrop(mode,number('voltageNominal'),number('voltageCurrent'),number('voltageLength'),number('voltageSection'),number('voltageRho'),mode==='dc'?1:number('voltagePF'));return 'ΔU = '+fmt(r.dropV)+' В ('+fmt(r.percent,3)+' %) · U нагрузки ≈ '+fmt(r.loadVoltageV)+' В'});
bind(['cylDensity','cylOuter','cylInner','cylLength'],'cylOutput',()=>{const r=M.cylinderMass(number('cylDensity'),number('cylOuter'),number('cylInner'),number('cylLength'));return 'Масса = '+fmt(r.massKg,5)+' кг · Объём = '+fmt(r.volumeM3,8)+' м³'});
})();