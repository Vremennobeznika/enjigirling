/* ENJIGIRLING independent educational robot schematic. No external dependencies/assets. */
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
  function projected(x,y,z,angle){
    const r=angle*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
    const sx=x*c+z*s,depth=-x*s+z*c;
    return {x:320+sx*150,y:516-y*137-depth*33,depth:depth};
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={torque:torque,idealHours:idealHours,projected:projected};}
  if(typeof document==='undefined')return;
  const model=document.getElementById('roboticsDrawing');
  if(!model)return;
  const NS='http://www.w3.org/2000/svg';
  const yaw=document.getElementById('roboticsYaw');
  const yawValue=document.getElementById('roboticsYawValue');
  const reset=document.getElementById('roboticsReset');
  const partButtons=Array.from(document.querySelectorAll('[data-robotics-part]'));
  const partTitle=document.getElementById('roboticsPartTitle');
  const partDetail=document.getElementById('roboticsPartDetail');
  const partCheck=document.getElementById('roboticsPartCheck');
  const parts={
    frame:{title:'Несущая конструкция',detail:'Каркас соединяет узлы и передаёт силы. Для разных задач возможны разные сплавы, композиты и соединения.',check:'жёсткость, прочность, усталость, масса, монтажные допуски'},
    drive:{title:'Электроприводы',detail:'Электродвигатель и передача создают механическое движение. Энкодер может измерять положение ротора или выходного звена.',check:'постоянный и пиковый момент, скорость, КПД, нагрев'},
    joint:{title:'Кинематические соединения',detail:'Шарниры ограничивают и направляют движение звеньев. У условной модели число осей не соответствует реальному роботу.',check:'степени свободы, диапазоны поворота, люфт, усилия'},
    sensor:{title:'Датчики',detail:'Датчики положения и движения позволяют оценить состояние робота. Камеры и IMU — возможные, но не обязательные элементы.',check:'точность, калибровка, частота данных, задержка'},
    compute:{title:'Система управления',detail:'Контроллер обрабатывает сигналы датчиков и выдаёт команды приводам. Реальная архитектура может быть распределённой.',check:'задержка, ошибки, отказобезопасность, питание'},
    battery:{title:'Электропитание',detail:'Источник энергии и аппаратура питания обеспечивают нагрузку. Защита и мониторинг батареи — отдельная часть проекта.',check:'полезная энергия, пики тока, тепловой режим, BMS'},
    hand:{title:'Рабочий орган',detail:'Захват или инструмент обеспечивает взаимодействие со средой. Он может отличаться от антропоморфной кисти.',check:'допустимое усилие, геометрия, захват и защита'}
  };
  const blocks=[
    ['frame',0,2.3,0,.78,1.02,.45],['frame',0,1.72,0,.76,.30,.44],
    ['sensor',0,3.18,0,.39,.48,.34],['compute',0,2.49,.30,.37,.36,.15],
    ['battery',0,2.00,.30,.40,.26,.15],['frame',-.62,2.56,0,.30,.28,.31],
    ['frame',.62,2.56,0,.30,.28,.31],['drive',-.66,2.27,0,.34,.34,.34],
    ['drive',.66,2.27,0,.34,.34,.34],
    ['frame',-.69,1.84,0,.21,.51,.25],['frame',.69,1.84,0,.21,.51,.25],
    ['hand',-.69,1.43,0,.30,.28,.28],['hand',.69,1.43,0,.30,.28,.28],
    ['joint',-.24,1.48,0,.27,.24,.33],['joint',.24,1.48,0,.27,.24,.33],
    ['frame',-.24,1.09,0,.30,.66,.35],['frame',.24,1.09,0,.30,.66,.35],
    ['joint',-.24,.73,0,.30,.21,.34],['joint',.24,.73,0,.30,.21,.34],
    ['frame',-.24,.38,0,.26,.61,.33],['frame',.24,.38,0,.26,.61,.33],
    ['frame',-.24,.08,.17,.36,.14,.62],['frame',.24,.08,.17,.36,.14,.62]
  ];
  let active='frame',angle=22;
  function el(tag,attrs,text){
    const node=document.createElementNS(NS,tag);
    for(const key in attrs)node.setAttribute(key,String(attrs[key]));
    if(text!==undefined)node.textContent=text;
    return node;
  }
  function boxFaces(block){
    const x=block[1],y=block[2],z=block[3],w=block[4]/2,h=block[5]/2,d=block[6]/2;
    const xyz=[
      [x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y+h,z-d],[x-w,y+h,z-d],
      [x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]
    ];
    const pts=xyz.map(v=>projected(v[0],v[1],v[2],angle));
    return [
      [0,1,2,3],[4,5,6,7],[0,4,7,3],[1,5,6,2],[3,2,6,7],[0,1,5,4]
    ].map((ids,n)=>({points:ids.map(i=>pts[i].x.toFixed(1)+','+pts[i].y.toFixed(1)).join(' '),depth:ids.reduce((s,i)=>s+pts[i].depth,0)/4,tone:n===4?'#dedede':n===2||n===3?'#bfbfbf':'#f1f1f1'}));
  }
  function selectPart(name){
    if(!parts[name])return;
    active=name;
    partTitle.textContent=parts[name].title;
    partDetail.textContent=parts[name].detail;
    partCheck.textContent='Что проверять: '+parts[name].check+'.';
    partButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.roboticsPart===active)));
    draw();
  }
  function draw(){
    model.replaceChildren();
    model.appendChild(el('rect',{x:0,y:0,width:640,height:560,fill:'transparent'}));
    const plane=el('ellipse',{cx:320,cy:525,rx:195,ry:18,fill:'none',stroke:'currentColor','stroke-opacity':.23,'stroke-dasharray':'6 6'});
    model.appendChild(plane);
    const sortable=blocks.map((block,index)=>({block:block,index:index,depth:projected(block[1],block[2],block[3],angle).depth}));
    sortable.sort((a,b)=>b.depth-a.depth);
    for(const entry of sortable){
      const block=entry.block,key=block[0],selected=key===active;
      const group=el('g',{'data-robotics-box':key,tabindex:0,role:'button','aria-label':parts[key].title,'aria-pressed':String(selected)});
      const faces=boxFaces(block).sort((a,b)=>b.depth-a.depth);
      for(const face of faces){
        group.appendChild(el('polygon',{points:face.points,fill:selected?'#333333':face.tone,stroke:selected?'#ffffff':'#555555','stroke-width':selected?2:1.5,'stroke-linejoin':'round'}));
      }
      group.appendChild(el('title',{},parts[key].title));
      group.addEventListener('click',()=>selectPart(key));
      group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectPart(key);}});
      model.appendChild(group);
    }
  }
  function changeAngle(value){
    const next=Math.max(-180,Math.min(180,Number(value)));
    if(!Number.isFinite(next))return;
    angle=next;yaw.value=String(Math.round(next));yawValue.value=Math.round(next)+'°';yawValue.textContent=Math.round(next)+'°';draw();
  }
  yaw.addEventListener('input',()=>changeAngle(yaw.value));
  reset.addEventListener('click',()=>{changeAngle(22);selectPart('frame');});
  partButtons.forEach(button=>button.addEventListener('click',()=>selectPart(button.dataset.roboticsPart)));
  let startX=null,startAngle=0,moved=false;
  model.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;startX=event.clientX;startAngle=angle;moved=false;});
  model.addEventListener('pointermove',event=>{
    if(startX===null)return;
    const delta=event.clientX-startX;
    if(Math.abs(delta)>7)moved=true;
    if(moved)changeAngle(startAngle+delta*.8);
  });
  const endDrag=()=>{startX=null;};
  model.addEventListener('pointerup',endDrag);
  model.addEventListener('pointercancel',endDrag);
  model.addEventListener('pointerleave',endDrag);
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
  selectPart('frame');
})();
