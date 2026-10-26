/* ENJIGIRLING educational robotics calculations. No external dependencies/assets. */
(function(){
  'use strict';
  function finiteRange(value,min,max,allowZero){
    const n=Number(value);
    return typeof value!=='boolean' && value!=='' && Number.isFinite(n) && n<=max && (allowZero?n>=min:n>min);
  }
  function torque(force,lever){
    if(!finiteRange(force,0,1000000,true)||!finiteRange(lever,0,50,true)) return null;
    return Number(force)*Number(lever);
  }
  function idealHours(energy,power){
    if(!finiteRange(energy,0,10000000,true)||!finiteRange(power,0,10000000,false))return null;
    const result=Number(energy)/Number(power);
    return Number.isFinite(result)?result:null;
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={torque,idealHours};}
  if(typeof document==='undefined')return;
  function format(value){return value.toLocaleString('ru-RU',{maximumFractionDigits:3});}
  document.getElementById('roboticsTorqueForm').addEventListener('submit',event=>{
    event.preventDefault();
    const f=document.getElementById('roboticsForce').value;
    const r=document.getElementById('roboticsLever').value;
    const value=torque(f,r);
    document.getElementById('roboticsTorqueResult').textContent=value===null?'Проверьте исходные значения (неотрицательные числа в заданных пределах).':format(value)+' Н·м (статически, при перпендикулярном плече).';
  });
  document.getElementById('roboticsEnergyForm').addEventListener('submit',event=>{
    event.preventDefault();
    const e=document.getElementById('roboticsEnergy').value;
    const p=document.getElementById('roboticsPower').value;
    const value=idealHours(e,p);
    document.getElementById('roboticsEnergyResult').textContent=value===null?'Укажите неотрицательную энергию и мощность больше нуля.':format(value)+' ч (идеально; в реальности меньше из-за потерь и резерва).';
  });
})();
