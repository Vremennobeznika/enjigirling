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
  // Proportioned industrial humanoid study: tapered body silhouette, articulated
  // upper/lower limbs, ankle assemblies and a broad load-bearing foot platform.
  // Units are schematic; every solid remains a selectable subsystem.
  const blocks=[
    ['frame',0,2.48,-.01,.76,.64,.39],
    ['frame',0,2.11,0,.48,.34,.35],
    ['frame',0,1.83,0,.75,.32,.43],
    ['frame',0,2.91,0,.17,.18,.17],
    ['sensor',0,3.22,0,.43,.48,.36],
    ['compute',0,2.51,.225,.42,.29,.11],
    ['battery',0,2.05,.22,.44,.24,.13],
    ['frame',-.50,2.72,0,.29,.17,.34],
    ['frame',.50,2.72,0,.29,.17,.34],
    ['drive',-.64,2.57,0,.29,.27,.32],
    ['drive',.64,2.57,0,.29,.27,.32],
    ['frame',-.66,2.30,0,.24,.43,.27],
    ['frame',.66,2.30,0,.24,.43,.27],
    ['joint',-.67,2.04,0,.26,.23,.30],
    ['joint',.67,2.04,0,.26,.23,.30],
    ['frame',-.68,1.80,0,.20,.37,.25],
    ['frame',.68,1.80,0,.20,.37,.25],
    ['hand',-.68,1.51,.025,.26,.25,.28],
    ['hand',.68,1.51,.025,.26,.25,.28],
    ['drive',-.27,1.64,0,.31,.27,.37],
    ['drive',.27,1.64,0,.31,.27,.37],
    ['frame',-.28,1.27,0,.30,.61,.34],
    ['frame',.28,1.27,0,.30,.61,.34],
    ['joint',-.28,.92,.02,.31,.23,.36],
    ['joint',.28,.92,.02,.31,.23,.36],
    ['frame',-.28,.53,-.035,.26,.65,.30],
    ['frame',.28,.53,-.035,.26,.65,.30],
    ['joint',-.28,.19,0,.25,.20,.30],
    ['joint',.28,.19,0,.25,.20,.30],
    ['frame',-.28,.09,.19,.39,.15,.70],
    ['frame',.28,.09,.19,.39,.15,.70]
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
    // Chamfered housings: unlike simple cubes, each part has bevelled corners
    // and an inset central panel. The geometry rotates with the 3D projection.
    const k=Math.min(w*.20,h*.20,.065);
    const ring=(depth)=>[
      [x-w+k,y-h,z+depth],[x+w-k,y-h,z+depth],
      [x+w,y-h+k,z+depth],[x+w,y+h-k,z+depth],
      [x+w-k,y+h,z+depth],[x-w+k,y+h,z+depth],
      [x-w,y+h-k,z+depth],[x-w,y-h+k,z+depth]
    ];
    const verts=ring(-d).concat(ring(d));
    const pts=verts.map(v=>projected(v[0],v[1],v[2],angle));
    const polygons=[{ids:[0,1,2,3,4,5,6,7],tone:'#6b7983'},
      {ids:[8,9,10,11,12,13,14,15],tone:'#d5dce0'}];
    for(let i=0;i<8;i++){
      polygons.push({ids:[i,(i+1)%8,(i+1)%8+8,i+8],
        tone:i===0||i===4?'#b3bec5':i===2||i===6?'#7b8a94':'#9daab3'});
    }
    return polygons.map(face=>({
      points:face.ids.map(i=>pts[i].x.toFixed(1)+','+pts[i].y.toFixed(1)).join(' '),
      depth:face.ids.reduce((v,i)=>v+pts[i].depth,0)/face.ids.length,
      tone:face.tone
    }));
  }

  // Lightweight projected mechanical details: no textures, external assets or WebGL.
  function mechanicalDetail(group,block,key,selected){
    const x=block[1],y=block[2],z=block[3],w=block[4],h=block[5],d=block[6];
    const front=z+d/2+.008;
    const P=(dx,dy,dz)=>projected(x+dx,y+dy,front+(dz||0),angle);
    const stroke=selected?'#f5f5f5':'#59626a';
    const bright=selected?'#ffffff':'#a8b7bf';
    function line(a,b,color,width,dash){
      const p=P(a[0],a[1]),q=P(b[0],b[1]);
      group.appendChild(el('line',{x1:p.x,y1:p.y,x2:q.x,y2:q.y,stroke:color||stroke,'stroke-width':width||1.4,'stroke-linecap':'round',...(dash?{'stroke-dasharray':dash}:{})}));
    }
    function circle(dx,dy,r,color,fill){
      const p=P(dx,dy);
      group.appendChild(el('circle',{cx:p.x,cy:p.y,r:r,fill:fill||'#1b2329',stroke:color||bright,'stroke-width':1.5}));
    }
    // Recessed face panels with fine structural seams.
    // Ribbed actuator sleeves and inset central torso armour.
    if(key==='frame'&&h>.35&&w<.35){
      for(let i=-2;i<=2;i++)line([-w*.30,i*h*.12],[w*.30,i*h*.12],i%2===0?bright:stroke,1.4);
    }
    if(key==='frame'&&w>.55&&y>2.2){
      // Anatomically shaped armour, divided into curved independent plates.
      const p=P(0,0);
      for(const side of [-1,1]){
        group.appendChild(el('path',{d:`M ${p.x+side*3} ${p.y-20} Q ${p.x+side*29} ${p.y-26} ${p.x+side*32} ${p.y-4} Q ${p.x+side*28} ${p.y+14} ${p.x+side*8} ${p.y+13} L ${p.x+side*2} ${p.y+3} Z`,fill:'#c7d2d9',stroke:'#354752','stroke-width':2}));
      }
      group.appendChild(el('path',{d:`M ${p.x-11} ${p.y+17} L ${p.x} ${p.y+25} L ${p.x+11} ${p.y+17}`,fill:'none',stroke:'#93aab7','stroke-width':2}));
    }

    if(false&&key==='frame'&&w>.55&&y>2.2){
      const p=P(0,0);
      group.appendChild(el('polygon',{points:[
        [p.x-22,p.y-21],[p.x+22,p.y-21],[p.x+30,p.y+6],
        [p.x+16,p.y+25],[p.x-16,p.y+25],[p.x-30,p.y+6]
      ].map(v=>v.join(',')).join(' '),fill:'#40535e',stroke:bright,'stroke-width':1.6}));
      group.appendChild(el('rect',{x:p.x-9,y:p.y-4,width:18,height:8,rx:2,fill:'#8daebd'}));
    }
    if(key==='frame'&&y<.2){
      const p=P(0,0);
      group.appendChild(el('line',{x1:p.x-19,y1:p.y-4,x2:p.x+19,y2:p.y-4,stroke:bright,'stroke-width':2}));
    }
    if(key==='frame'&&h>.25){
      const inset=Math.min(.055,w*.17);
      line([-w/2+inset,h*.35],[w/2-inset,h*.35],stroke,1.3);
      line([-w/2+inset,-h*.35],[w/2-inset,-h*.35],stroke,1.3);
      line([-w*.25,-h*.30],[-w*.25,h*.30],stroke,1);
      line([w*.25,-h*.30],[w*.25,h*.30],stroke,1);
      if(w>.4){circle(-w*.34,h*.35,1.8);circle(w*.34,h*.35,1.8);}
    }
    if(key==='joint'||key==='drive'){
      const center=P(0,0),r=Math.max(5,Math.min(16,w*150*.24));
      group.appendChild(el('circle',{cx:center.x,cy:center.y,r:r+3,fill:'#303a42',stroke:bright,'stroke-width':2}));
      group.appendChild(el('circle',{cx:center.x,cy:center.y,r:r*.64,fill:selected?'#9eacb6':'#667985',stroke:'#202a31','stroke-width':2}));
      circle(0,0,2.6,'#e1e7eb','#dce5eb');
      for(let i=0;i<4;i++){const t=i*Math.PI/2;group.appendChild(el('circle',{cx:center.x+Math.cos(t)*(r+1),cy:center.y+Math.sin(t)*(r+1),r:1.5,fill:'#d9e3e8'}));}
    }
    if(key==='sensor'){
      // Original synthetic face, with camera optics, articulated jaw and
      // asymmetric swept-back fibre-optic hair. No character/asset copying.
      const p=P(0,0),eyeY=p.y-3;
      group.appendChild(el('path',{d:`M ${p.x-24} ${p.y-16} Q ${p.x-24} ${p.y-29} ${p.x-6} ${p.y-32} Q ${p.x+18} ${p.y-32} ${p.x+25} ${p.y-13} L ${p.x+22} ${p.y+13} Q ${p.x+4} ${p.y+30} ${p.x-18} ${p.y+12} Z`,fill:'#aab7c0',stroke:'#25353f','stroke-width':2}));
      group.appendChild(el('path',{d:`M ${p.x-21} ${eyeY} Q ${p.x} ${eyeY-10} ${p.x+21} ${eyeY} L ${p.x+18} ${eyeY+10} Q ${p.x} ${eyeY+13} ${p.x-19} ${eyeY+10} Z`,fill:'#16232c',stroke:bright,'stroke-width':1.6}));
      for(const dx of [-10,10]){
        group.appendChild(el('ellipse',{cx:p.x+dx,cy:eyeY+3,rx:4.2,ry:2.7,fill:'#9ec8d6'}));
        group.appendChild(el('circle',{cx:p.x+dx,cy:eyeY+3,r:1.3,fill:'#f1fbff'}));
      }
      group.appendChild(el('path',{d:`M ${p.x-7} ${p.y+17} Q ${p.x} ${p.y+21} ${p.x+7} ${p.y+17}`,fill:'none',stroke:'#41525c','stroke-width':1.6,'stroke-linecap':'round'}));
      // Layered sculpted hair follows the head rather than a flat decal.
      for(let i=0;i<7;i++){
        const shift=i*3.6;
        group.appendChild(el('path',{d:`M ${p.x-25+shift} ${p.y-18} Q ${p.x-30+shift} ${p.y-44-i%2*3} ${p.x+3+shift*.35} ${p.y-38} Q ${p.x+26+shift*.25} ${p.y-34} ${p.x+28+shift*.35} ${p.y-10+i*2}`,fill:'none',stroke:i%2?'#263740':'#dae0e2','stroke-width':i%2?3.5:4.5,'stroke-linecap':'round'}));
      }
      for(const side of [-1,1]){
        const x=p.x+side*24;
        group.appendChild(el('circle',{cx:x,cy:p.y+2,r:6,fill:'#24343e',stroke:bright,'stroke-width':2}));
        group.appendChild(el('circle',{cx:x,cy:p.y+2,r:2.5,fill:'#9ec8d6'}));
      }
    }
    if(key==='compute'){
      const p=P(0,0);
      group.appendChild(el('rect',{x:p.x-16,y:p.y-10,width:32,height:20,rx:2,fill:'#26363f',stroke:bright,'stroke-width':1.4}));
      for(let i=-2;i<=2;i++){const a=p.x+i*5;group.appendChild(el('line',{x1:a,y1:p.y-13,x2:a,y2:p.y-10,stroke:bright,'stroke-width':1.2}));}
      circle(0,0,3,'#a6d5df','#a6d5df');
    }
    if(key==='battery'){
      const p=P(0,0);
      group.appendChild(el('rect',{x:p.x-21,y:p.y-8,width:42,height:16,rx:2,fill:'#26363f',stroke:bright,'stroke-width':1.4}));
      for(let i=0;i<4;i++)group.appendChild(el('rect',{x:p.x-16+i*9,y:p.y-4,width:6,height:8,rx:1,fill:i===3?'#9db9c5':'#617b89'}));
    }
    if(key==='hand'){
      for(let i=-1;i<=1;i++)line([i*w*.20,-h*.07],[i*w*.25,-h*.43],bright,2.2);
      line([-w*.32,h*.15],[w*.32,h*.15],stroke,2);
    }
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
    // Subtle technical reference axes reinforce the engineering-lab aesthetic.
    for(let n=-3;n<=3;n++){
      const a=projected(n*.36,0,-.9,angle),b=projected(n*.36,0,.9,angle);
      model.appendChild(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'currentColor','stroke-opacity':.075,'stroke-width':1}));
      const c=projected(-1.1,0,n*.28,angle),d=projected(1.1,0,n*.28,angle);
      model.appendChild(el('line',{x1:c.x,y1:c.y,x2:d.x,y2:d.y,stroke:'currentColor','stroke-opacity':.075,'stroke-width':1}));
    }
    const sortable=blocks.map((block,index)=>({block:block,index:index,depth:projected(block[1],block[2],block[3],angle).depth}));
    sortable.sort((a,b)=>b.depth-a.depth);
    for(const entry of sortable){
      const block=entry.block,key=block[0],selected=key===active;
      const group=el('g',{'data-robotics-box':key,tabindex:0,role:'button','aria-label':parts[key].title,'aria-pressed':String(selected)});
      const faces=boxFaces(block).sort((a,b)=>b.depth-a.depth);
      for(const face of faces){
        group.appendChild(el('polygon',{points:face.points,fill:selected?'#344650':face.tone,stroke:selected?'#e7f1f5':'#34434d','stroke-width':selected?2:1.5,'stroke-linejoin':'round'}));
      }
      mechanicalDetail(group,block,key,selected);
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
  // Coalesce drag events into one SVG update per animation frame on low-end CPUs.
  let queuedAngle=null,dragFrame=0;
  const scheduleDrag=value=>{
    queuedAngle=value;
    if(dragFrame)return;
    dragFrame=requestAnimationFrame(()=>{dragFrame=0;changeAngle(queuedAngle);});
  };
  model.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;startX=event.clientX;startAngle=angle;moved=false;});
  model.addEventListener('pointermove',event=>{
    if(startX===null)return;
    const delta=event.clientX-startX;
    if(Math.abs(delta)>7)moved=true;
    if(moved)scheduleDrag(startAngle+delta*.8);
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
