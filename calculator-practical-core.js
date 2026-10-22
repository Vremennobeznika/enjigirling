/* Practical engineering estimates. Pure functions, no network or storage. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.PracticalMath=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function positive(n,name){if(!Number.isFinite(n)||n<=0)throw Error(name+': требуется число больше нуля.');return n;}
function nonnegative(n,name){if(!Number.isFinite(n)||n<0)throw Error(name+': требуется число от нуля.');return n;}
function factor(n){if(!Number.isFinite(n)||n<0||n>1)throw Error('cos φ: допустимый диапазон 0–1.');return n;}
function checked(values){if(values.some(n=>!Number.isFinite(n)))throw Error('Результат выходит за диапазон вычислений.');}
function threePhase(voltageLineV,currentA,powerFactor){
 positive(voltageLineV,'Линейное напряжение');nonnegative(currentA,'Линейный ток');factor(powerFactor);
 const apparentKVA=Math.sqrt(3)*voltageLineV*currentA/1000;
 const activeKW=apparentKVA*powerFactor;
 const reactiveKVAR=apparentKVA*Math.sqrt(Math.max(0,1-powerFactor*powerFactor));
 checked([apparentKVA,activeKW,reactiveKVAR]);return {apparentKVA,activeKW,reactiveKVAR};
}
function cableDrop(system,voltageV,currentA,lengthM,sectionMM2,resistivity,powerFactor){
 if(!['dc','single','three'].includes(system))throw Error('Неизвестная система.');
 positive(voltageV,'Номинальное напряжение');nonnegative(currentA,'Ток нагрузки');nonnegative(lengthM,'Длина линии');positive(sectionMM2,'Сечение');
 positive(resistivity,'Удельное сопротивление');factor(powerFactor);
 const multiplier=system==='three'?Math.sqrt(3):2;
 const resistanceOhm=resistivity*lengthM/sectionMM2;
 const dropV=multiplier*currentA*resistanceOhm*(system==='dc'?1:powerFactor);
 const percent=100*dropV/voltageV;checked([resistanceOhm,dropV,percent]);
 if(percent>=100)throw Error('Расчётное падение ≥ 100 %; проверьте данные и применимость модели.');
 return {resistanceOhm,dropV,percent,loadVoltageV:voltageV-dropV};
}
function cylinderMass(densityKgM3,outerDiameterMM,innerDiameterMM,lengthMM){
 positive(densityKgM3,'Плотность');positive(outerDiameterMM,'Внешний диаметр');nonnegative(innerDiameterMM,'Внутренний диаметр');positive(lengthMM,'Длина');
 if(innerDiameterMM>=outerDiameterMM)throw Error('Внутренний диаметр должен быть меньше наружного.');
 const volumeM3=Math.PI/4*(outerDiameterMM-innerDiameterMM)*(outerDiameterMM+innerDiameterMM)*lengthMM*1e-9;
 const massKg=volumeM3*densityKgM3;checked([volumeM3,massKg]);if(massKg<=0)throw Error('Результат слишком мал для точного расчёта.');
 return {volumeM3,massKg};
}
return {threePhase,cableDrop,cylinderMass};
});