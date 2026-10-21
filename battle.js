'use strict';
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),heroes=window.CHARACTERS||[];
const msg=document.querySelector('#msg');
const partyRoot=document.querySelector('#party-selects');
const roster=[0,1,2,3],selectors=[];
let turnIndex=0;
for(let slot=0;slot<4;slot++){
 const select=document.createElement('select');
 select.setAttribute('aria-label','編成'+(slot+1)+'人目');
 heroes.forEach((c,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(slot+1)+'：'+c.name;select.append(o)});
 select.value=String(Math.min(slot,heroes.length-1));
 select.addEventListener('change',()=>{if(running){select.value=String(roster[slot]);return}roster[slot]=Number(select.value);setText()});
 selectors.push(select);partyRoot.append(select);
}
function currentHero(){return heroes[roster[turnIndex]]||heroes[0]||{icon:'✦',name:'主人公',color:'#fbbf24'}}
function nextTurn(){turnIndex=(turnIndex+1)%4;setText()}
const W=680,H=820,base={x:340,y:730};let stage=1,shots=0,angle=-Math.PI/2,drag=null,ball=null,enemies=[],particles=[],running=false,won=false,last=0;
const radius=20;function setText(){document.querySelector('#stage').textContent=stage;document.querySelector('#remaining').textContent=enemies.filter(e=>e.hp>0).length;document.querySelector('#shots').textContent=shots;document.querySelector('#turn').textContent=turnIndex+1;document.querySelector('#active-hero').textContent=currentHero().name}
function reset(s=1){stage=s;turnIndex=0;shots=0;won=false;running=false;ball=null;drag=null;msg.textContent='キャラを引っ張って離してね！';enemies=[];const count=2+stage;for(let i=0;i<count;i++){enemies.push({x:100+(i%3)*235+(stage%2)*10,y:145+Math.floor(i/3)*155,r:29,hp:1+(stage===3?1:0),color:['#f87171','#c084fc','#4ade80'][i%3]})}setText()}
function launch(vx,vy){if(running||won)return;const power=Math.hypot(vx,vy);if(power<1)return;let scale=Math.min(18,power);ball={x:base.x,y:base.y,vx:vx/power*scale,vy:vy/power*scale,r:radius,life:0};running=true;shots++;msg.textContent='ショット！ 敵に当てよう';setText()}
function pos(e){const rect=canvas.getBoundingClientRect();return{x:(e.clientX-rect.left)*W/rect.width,y:(e.clientY-rect.top)*H/rect.height}}
canvas.addEventListener('pointerdown',e=>{if(running||won)return;const p=pos(e);if(Math.hypot(p.x-base.x,p.y-base.y)<125){drag=p;canvas.setPointerCapture(e.pointerId)}});
canvas.addEventListener('pointermove',e=>{if(drag)drag=pos(e)});
canvas.addEventListener('pointerup',e=>{if(!drag)return;const p=pos(e);drag=null;launch(base.x-p.x,base.y-p.y)});
canvas.addEventListener('pointercancel',()=>drag=null);
document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='ArrowLeft')angle-=.12;if(e.code==='ArrowRight')angle+=.12;if(e.code==='Space')launch(Math.cos(angle)*14,Math.sin(angle)*14)});
document.querySelector('#restart').onclick=()=>reset(1);
function tick(dt){if(!ball)return;for(let k=0;k<Math.min(3,Math.max(1,Math.ceil(dt/10)));k++){let t=dt/Math.min(3,Math.max(1,Math.ceil(dt/10)))/16.67;ball.x+=ball.vx*t;ball.y+=ball.vy*t;ball.life+=t;if(ball.x<radius||ball.x>W-radius){ball.x=Math.max(radius,Math.min(W-radius,ball.x));ball.vx*=-1}if(ball.y<radius||ball.y>H-radius){ball.y=Math.max(radius,Math.min(H-radius,ball.y));ball.vy*=-1}for(const en of enemies){if(en.hp<1)continue;let dx=ball.x-en.x,dy=ball.y-en.y,d=Math.hypot(dx,dy);if(d<ball.r+en.r){en.hp--;particles.push({x:en.x,y:en.y,t:25});const nx=dx/(d||1),ny=dy/(d||1),dot=ball.vx*nx+ball.vy*ny;ball.vx-=2*dot*nx;ball.vy-=2*dot*ny;ball.x=en.x+nx*(ball.r+en.r+2);ball.y=en.y+ny*(ball.r+en.r+2);setText()}}if(ball.life>320){ball=null;running=false;nextTurn();msg.textContent='次の手番：'+currentHero().name+'！';break}}if(enemies.every(e=>e.hp<1)){ball=null;running=false;if(stage<3){msg.textContent='ステージクリア！ 次のステージへ！';reset(stage+1)}else{won=true;msg.textContent='🎉 全3ステージクリア！ おめでとう！'}}particles=particles.filter(p=>--p.t>0)}
function draw(){ctx.clearRect(0,0,W,H);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#243d61');g.addColorStop(1,'#102038');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
ctx.strokeStyle='rgba(255,255,255,.07)';for(let x=50;x<W;x+=68){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=60;y<H;y+=68){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
enemies.forEach(e=>{if(e.hp<1)return;ctx.fillStyle=e.color;ctx.shadowColor=e.color;ctx.shadowBlur=20;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#13233d';ctx.font='bold 21px system-ui';ctx.textAlign='center';ctx.fillText('✹',e.x,e.y+8);if(e.hp>1){ctx.fillStyle='#fff';ctx.font='bold 14px system-ui';ctx.fillText('HP '+e.hp,e.x,e.y-42)}});
particles.forEach(p=>{ctx.strokeStyle='rgba(251,191,36,'+(p.t/25)+')';ctx.lineWidth=5;ctx.beginPath();ctx.arc(p.x,p.y,(26-p.t)*2,0,Math.PI*2);ctx.stroke()});
const c=currentHero();const x=ball?ball.x:base.x,y=ball?ball.y:base.y;ctx.shadowBlur=30;ctx.shadowColor=c.color||'#fbbf24';ctx.fillStyle=c.color||'#fbbf24';ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 23px system-ui';ctx.fillText(c.icon||'✦',x,y+8);if(drag){ctx.setLineDash([10,8]);ctx.strokeStyle='#fcd34d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(base.x,base.y);ctx.lineTo(base.x+(base.x-drag.x)*1.6,base.y+(base.y-drag.y)*1.6);ctx.stroke();ctx.setLineDash([])}else if(!running){ctx.strokeStyle='#fde68a88';ctx.lineWidth=3;ctx.beginPath();ctx.arc(base.x,base.y,45,0,Math.PI*2);ctx.stroke()}}
function frame(now){const dt=Math.min(34,now-(last||now));last=now;if(running)tick(dt);draw();requestAnimationFrame(frame)}reset();requestAnimationFrame(frame);
