const PLAYERS=window.ATHLETE_PLAYERS||[];
const L='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),ALL=L.flatMap(a=>L.map(b=>a+b)),DOUB=L.map(x=>x+x);
let saved=JSON.parse(localStorage.getItem('aa-v2-progress')||'{"solved":{},"deferred":[],"mode":"alphabet","era":"modern"}');
if(!saved.era)saved.era='modern';
let current='AA',idx=0,lastRandom=null,hintLevel=0;
const $=x=>document.getElementById(x);
function save(){localStorage.setItem('aa-v2-progress',JSON.stringify(saved))}
function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function inEra(p){
 const a=+p.y1||0,b=+p.y2||a;
 if(saved.era==='current')return b>=2020;
 if(saved.era==='modern')return b>=2000;
 if(saved.era==='classic')return a<2000;
 return true;
}
function poolPlayers(){return PLAYERS.filter(inEra)}
function buildByI(){const b={};for(const p of poolPlayers())(b[p.i]??=[]).push(p);return b}
function found(i){return saved.solved[i]||[]}
function viable(){const b=buildByI();return ALL.filter(i=>b[i]?.length)}
function seq(){const b=buildByI();return (saved.mode==='double'?DOUB:ALL).filter(i=>b[i]?.length)}
function pick(){
 hintLevel=0;const b=buildByI(),v=viable();
 if(!v.length){current='--';render();return}
 if(saved.mode==='random'){
  let pool=v.filter(i=>found(i).filter(id=>b[i].some(p=>p.id===id)).length<(b[i]?.length||0)&&i!==lastRandom);
  if(!pool.length)pool=v.filter(i=>i!==lastRandom);
  current=pool[Math.floor(Math.random()*pool.length)]||v[0];lastRandom=current;
 }else{const s=seq();current=s[idx%s.length]}
 render();
}
function setMode(m){saved.mode=m;idx=0;lastRandom=null;save();pick()}
function setEra(e){saved.era=e;idx=0;lastRandom=null;save();pick()}
function advance(){if(saved.mode==='random')pick();else{idx++;pick()}}
function eraLabel(){return {current:'Current: 2020–present',modern:'Modern: 2000–present',classic:'Classic: before 2000',all:'All-Time: entire White Sox database'}[saved.era]}
function stats(){
 const b=buildByI(),v=viable();let combos=v.filter(i=>found(i).some(id=>b[i].some(p=>p.id===id))).length;
 let fp=0;for(const i of v)fp+=found(i).filter(id=>b[i].some(p=>p.id===id)).length;
 const total=poolPlayers().length;
 $('comboPct').textContent=(v.length?Math.round(combos/v.length*100):0)+'%';
 $('comboSmall').textContent=combos+'/'+v.length+' combos started';
 $('playerPct').textContent=(total?Math.round(fp/total*100):0)+'%';
 $('playerSmall').textContent=fp+'/'+total+' players found';
}
function render(){
 const b=buildByI(),arr=b[current]||[],ids=new Set(found(current)),f=arr.filter(p=>ids.has(p.id)).length,t=arr.length;
 $('initials').textContent=current;$('possible').textContent=t+' possible White Sox player'+(t===1?'':'s');
 $('found').textContent=f+' of '+t+' found · '+(t?Math.round(f/t*100):0)+'%';$('comboBar').style.width=(t?f/t*100:0)+'%';
 document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x.dataset.mode===saved.mode));
 document.querySelectorAll('[data-era]').forEach(x=>x.classList.toggle('active',x.dataset.era===saved.era));
 $('eraNote').textContent=eraLabel();$('message').textContent='';$('hint').hidden=true;$('guess').value='';stats();
}
function check(){
 const q=$('guess').value.trim();if(!q)return;const b=buildByI(),arr=b[current]||[];
 const p=arr.find(x=>norm(x.n)===norm(q));
 if(!p){$('message').textContent='Not one we have for '+current+' in this era — try someone else, or take a hint.';return}
 const a=found(current);if(a.includes(p.id)){$('message').textContent='You already found '+p.n+'.';return}
 saved.solved[current]=[...a,p.id];save();
 const remaining=arr.filter(x=>!saved.solved[current].includes(x.id)).length;
 $('guess').value='';stats();
 if(remaining>0){
   $('message').textContent='✓ '+p.n+' — nice! '+remaining+' more possible for '+current+'. Keep guessing, or tap Come Back Later.';
   renderCurrentCounts();
 }else{
   $('message').textContent='✓ '+p.n+' — you found everyone for '+current+'!';
   renderCurrentCounts();setTimeout(advance,1200);
 }
}
function renderCurrentCounts(){
 const b=buildByI(),arr=b[current]||[],ids=new Set(found(current)),f=arr.filter(p=>ids.has(p.id)).length,t=arr.length;
 $('found').textContent=f+' of '+t+' found · '+(t?Math.round(f/t*100):0)+'%';$('comboBar').style.width=(t?f/t*100:0)+'%';
}
function hint(){
 const b=buildByI(),r=(b[current]||[]).filter(p=>!found(current).includes(p.id));$('hint').hidden=false;
 if(!r.length){$('hint').textContent='You found everyone we have for this combination.';return}
 const p=r[0];hintLevel++;$('hint').textContent=hintLevel===1?'Position: '+(p.p||'Unknown'):hintLevel===2?'White Sox years: '+p.y1+(p.y2!==p.y1?'–'+p.y2:''):'Name starts: '+p.n.split(' ').map(x=>x[0]+'…').join(' ');
}
function defer(){if(!saved.deferred.includes(current))saved.deferred.push(current);save();advance()}
$('submit').onclick=check;$('hintBtn').onclick=hint;$('later').onclick=defer;
$('guess').addEventListener('keydown',e=>{if(e.key==='Enter')check()});
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.querySelectorAll('[data-era]').forEach(b=>b.onclick=()=>setEra(b.dataset.era));
$('reset').onclick=()=>{if(confirm('Reset all White Sox progress?')){localStorage.removeItem('aa-v2-progress');location.reload()}};
pick();