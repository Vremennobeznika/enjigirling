/* Original ENJIGIRLING female android. Dependency-free shaded 3D surface renderer.
   Mesh geometry, perspective, orbit, picking and lighting are computed locally.
   This is a real triangulated 3D scene (not a billboard or flat SVG). */
(function(){
'use strict';
const svg=document.getElementById('roboticsDrawing'),slider=document.getElementById('roboticsYaw');
if(!svg||!slider)return;
const canvas=document.createElement('canvas');canvas.id='robotics3d';canvas.setAttribute('role','img');
canvas.setAttribute('aria-label','Трёхмерная модель оригинального женского андроида. Перетаскивайте для поворота, колесо для масштаба; выбирайте системы кнопками справа.');
const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
svg.parentNode.insertBefore(canvas,svg);svg.hidden=true;
let yaw=22,pitch=6,zoom=1,active='frame',drag=null,raf=0,hit=[];
const parts=[
 ['frame',0,2.31,0,.37,.43,.23,'torso'],['frame',0,1.91,0,.39,.21,.25,'pelvis'],
 ['sensor',0,3.12,0,.225,.295,.19,'head'],['frame',0,2.78,0,.085,.14,.09,'neck'],
 ['compute',0,2.36,.235,.22,.15,.045,'plate'],['battery',0,1.91,.25,.24,.12,.05,'plate'],
 ['joint',-.49,2.62,0,.16,.16,.16,'joint'],['joint',.49,2.62,0,.16,.16,.16,'joint'],
 ['frame',-.57,2.31,0,.135,.30,.13,'limb'],['frame',.57,2.31,0,.135,.30,.13,'limb'],
 ['joint',-.62,2.00,0,.125,.12,.13,'joint'],['joint',.62,2.00,0,.125,.12,.13,'joint'],
 ['frame',-.65,1.76,0,.105,.245,.105,'limb'],['frame',.65,1.76,0,.105,.245,.105,'limb'],
 ['hand',-.65,1.48,.03,.11,.145,.105,'hand'],['hand',.65,1.48,.03,.11,.145,.105,'hand'],
 ['drive',-.245,1.69,0,.17,.17,.17,'joint'],['drive',.245,1.69,0,.17,.17,.17,'joint'],
 ['frame',-.255,1.32,0,.18,.34,.18,'thigh'],['frame',.255,1.32,0,.18,.34,.18,'thigh'],
 ['joint',-.255,.94,.01,.16,.15,.17,'joint'],['joint',.255,.94,.01,.16,.15,.17,'joint'],
 ['frame',-.255,.54,-.03,.125,.34,.14,'limb'],['frame',.255,.54,-.03,.125,.34,.14,'limb'],
 ['joint',-.255,.20,0,.12,.11,.13,'joint'],['joint',.255,.20,0,.12,.11,.13,'joint'],
 ['frame',-.255,.09,.18,.19,.09,.36,'foot'],['frame',.255,.09,.18,.19,.09,.36,'foot']
];
const extras=[
 ['frame',-.19,2.38,.17,.19,.22,.095,'chest'],['frame',.19,2.38,.17,.19,.22,.095,'chest'],
 ['frame',0,2.12,.22,.13,.13,.065,'waist'],
 ['sensor',-.093,3.16,.174,.052,.027,.025,'eye'],['sensor',.093,3.16,.174,.052,.027,.025,'eye'],
 ['sensor',0,3.025,.177,.075,.035,.027,'mouth'],
 ['sensor',-.20,3.12,0,.047,.095,.065,'ear'],['sensor',.20,3.12,0,.047,.095,.065,'ear']
];
for(let i=0;i<9;i++){const x=(i-4)*.045;extras.push(['sensor',x,3.36-Math.abs(x)*.30,-.02-(i%3)*.018,.045,.12+(i%3)*.04,.15,'hair']);}
for(const sign of [-1,1])for(let i=0;i<3;i++){extras.push(['hand',sign*(.65+(i-1)*.045),1.34,.055,.023,.095,.025,'finger']);}
const all=parts.concat(extras);
const mesh=[];
function material(type,key){
 if(type==='eye')return [128,199,217];
 if(type==='mouth')return [65,82,94];
 if(type==='hair')return [31,41,49];
 if(type==='joint')return [57,70,80];
 if(type==='plate')return [65,82,94];
 if(type==='ear')return [58,79,92];
 if(type==='finger')return [133,150,160];
 if(type==='chest')return [188,200,209];
 if(type==='head')return [198,207,214];
 if(type==='foot')return [135,148,157];
 return [148,164,176];
}
function build(){
 mesh.length=0;
 for(let n=0;n<all.length;n++){
  const p=all[n],type=p[7],segments=type==='head'?18:12,rings=type==='head'?12:8;
  const v=[];
  for(let j=0;j<=rings;j++){
   const theta=Math.PI*j/rings;
   for(let i=0;i<=segments;i++){
    const phi=2*Math.PI*i/segments;
    let x=p[1]+p[4]*Math.sin(theta)*Math.cos(phi);
    let y=p[2]+p[5]*Math.cos(theta);
    let z=p[3]+p[6]*Math.sin(theta)*Math.sin(phi);
    if(type==='torso'){const t=(y-p[2])/p[5];x=p[1]+(x-p[1])*(.82+.17*Math.max(0,t));}
    if(type==='head'){const t=(y-p[2])/p[5];x=p[1]+(x-p[1])*(t<0?1+t*.19:1);z+=.018;}
    if(type==='thigh'){const t=(y-p[2])/p[5];x=p[1]+(x-p[1])*(1+.12*t);}
    v.push([x,y,z]);
   }
  }
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){
   const a=j*(segments+1)+i,b=a+segments+1;
   mesh.push({v:[v[a],v[b],v[a+1]],n,key:p[0],base:material(type,p[0])});
   mesh.push({v:[v[a+1],v[b],v[b+1]],n,key:p[0],base:material(type,p[0])});
  }
 }
}
build();
function camera(v){
 const a=yaw*Math.PI/180,b=pitch*Math.PI/180;
 const x=v[0]*Math.cos(a)+v[2]*Math.sin(a);
 const z=-v[0]*Math.sin(a)+v[2]*Math.cos(a);
 return [x,(v[1]-1.72)*Math.cos(b)-z*Math.sin(b),(v[1]-1.72)*Math.sin(b)+z*Math.cos(b)];
}
function project(v,w,h){
 const d=5.6-v[2],scale=Math.min(w*.68,h*.90)*zoom*1.28/d;
 return [w/2+v[0]*scale,h/2-v[1]*scale,d];
}
function render(){
 raf=0;const w=canvas.clientWidth||640,h=canvas.clientHeight||560;
 const dpr=Math.min(devicePixelRatio||1,2),pw=Math.round(w*dpr),ph=Math.round(h*dpr);
 if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
 ctx.setTransform(dpr,0,0,dpr,0,0);
 const dark=document.documentElement.classList.contains('theme-dark');
 ctx.fillStyle=dark?'#14191e':'#e9edef';ctx.fillRect(0,0,w,h);
 ctx.strokeStyle=dark?'#29323a':'#c8d0d5';ctx.lineWidth=1;
 for(let i=-5;i<=5;i++){
  const lineA=project(camera([i*.3,0,-1.2]),w,h),lineB=project(camera([i*.3,0,1.2]),w,h);
  ctx.beginPath();ctx.moveTo(lineA[0],lineA[1]);ctx.lineTo(lineB[0],lineB[1]);ctx.stroke();
  const lineC=project(camera([-1.2,0,i*.3]),w,h),lineD=project(camera([1.2,0,i*.3]),w,h);
  ctx.beginPath();ctx.moveTo(lineC[0],lineC[1]);ctx.lineTo(lineD[0],lineD[1]);ctx.stroke();
 }
 const triangles=[];
 for(const face of mesh){
  const v=face.v.map(camera);
  const u=[v[1][0]-v[0][0],v[1][1]-v[0][1],v[1][2]-v[0][2]];
  const t=[v[2][0]-v[0][0],v[2][1]-v[0][1],v[2][2]-v[0][2]];
  const n=[u[1]*t[2]-u[2]*t[1],u[2]*t[0]-u[0]*t[2],u[0]*t[1]-u[1]*t[0]];
  const norm=Math.hypot(...n)||1;
  const light=Math.max(.23,Math.min(1.05,.54+(n[0]*-.42+n[1]*.64+n[2]*.65)/norm*.44));
  triangles.push({points:v.map(p=>project(p,w,h)),depth:v.reduce((s,p)=>s+p[2],0)/3,light,face});
 }
 triangles.sort((a,b)=>a.depth-b.depth);
 hit=[];
 for(const tr of triangles){
  const p=tr.points,base=tr.face.base;
  const tint=tr.face.key===active?1.13:1;
  const rgb=base.map(c=>Math.min(255,Math.round(c*tr.light*tint)));
  ctx.fillStyle='rgb('+rgb.join(',')+')';
  ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[1][0],p[1][1]);ctx.lineTo(p[2][0],p[2][1]);ctx.closePath();ctx.fill();
  if(tr.face.key===active&&tr.light>.7){ctx.strokeStyle='rgba(184,223,237,.14)';ctx.lineWidth=.45;ctx.stroke();}
  hit.push({p,key:tr.face.key});
 }
 ctx.fillStyle=dark?'#9aaab5':'#536674';ctx.font='11px system-ui';ctx.fillText('ENJIGIRLING / ANDROID STUDY · 3D',14,22);
 ctx.fillText('YAW '+Math.round(yaw)+'°  /  ZOOM '+Math.round(zoom*100)+'%',14,h-14);
}
function schedule(){if(!raf)raf=requestAnimationFrame(render);}
function setYaw(v){yaw=Math.max(-180,Math.min(180,v));slider.value=String(Math.round(yaw));const out=document.getElementById('roboticsYawValue');if(out){out.value=Math.round(yaw)+'°';out.textContent=out.value;}schedule();}
slider.addEventListener('input',()=>{yaw=Number(slider.value);schedule();});
document.querySelectorAll('[data-robotics-part]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.roboticsPart;schedule();}));
document.getElementById('roboticsReset').addEventListener('click',()=>{pitch=6;zoom=1;active='frame';setYaw(22);});
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw,pitch,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;setYaw(drag.yaw+dx*.65);pitch=Math.max(-30,Math.min(30,drag.pitch+dy*.25));schedule();});
canvas.addEventListener('pointerup',e=>{
 if(!drag)return;
 if(!drag.moved){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
  for(let i=hit.length-1;i>=0;i--){const t=hit[i].p,sg=(a,b,c)=>(x-c[0])*(a[1]-c[1])-(a[0]-c[0])*(y-c[1]);
   const d1=sg(t[0],t[1],t[2]),d2=sg(t[1],t[2],t[0]),d3=sg(t[2],t[0],t[1]);
   if(!((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0))){
    const button=document.querySelector('[data-robotics-part="'+hit[i].key+'"]');if(button)button.click();break;
   }
  }
 }drag=null;
});
canvas.addEventListener('pointercancel',()=>{drag=null;});
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.7,Math.min(1.75,zoom*(e.deltaY>0?.92:1.08)));schedule();},{passive:false});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(canvas);
else window.addEventListener('resize',schedule);
schedule();
})();
