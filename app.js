const PLAYERS=window.ATHLETE_PLAYERS||[], MLB=window.MLB_TEAMS||{};const CURRENT=2026,RECENT=6,L='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),ALL=L.flatMap(a=>L.map(b=>a+b)),DOUB=L.map(x=>x+x);

const TEAM_THEMES={
ANA:['#080b10','#121820','#19212b','#ba0021','#ffffff','#171d25','#0b162a'],
ARI:['#080b0e','#15191e','#20262d','#a71930','#ffffff','#1b2026','#e3d4ad'],
ATL:['#080b10','#111923','#182332','#ce1141','#ffffff','#17212d','#0c2340'],
BAL:['#080b0e','#14171b','#1d2126','#df4601','#ffffff','#191c20','#000000'],
BOS:['#080b10','#111923','#182332','#bd3039','#ffffff','#17212d','#0c2340'],
CHC:['#080b10','#111923','#182332','#0e3386','#ffffff','#17212d','#cc3433'],
CHW:['#080b0e','#14171a','#1d2125','#c4ced4','#080b0e','#191d21','#ffffff'],
CIN:['#080b0e','#15181c','#1e2227','#c6011f','#ffffff','#1a1e22','#000000'],
CLE:['#080b10','#111923','#182332','#e31937','#ffffff','#17212d','#0c2340'],
COL:['#090a0f','#17151d','#211e29','#6f42a1','#ffffff','#1d1a24','#c4ced4'],
DET:['#080b10','#111923','#182332','#0c2340','#ffffff','#17212d','#fa4616'],
FLA:['#080b0e','#13191c','#1b2428','#00a3e0','#ffffff','#182125','#ef3340'],
HOU:['#080b10','#111923','#182332','#eb6e1f','#ffffff','#17212d','#002d62'],
KCR:['#080b10','#111923','#182332','#004687','#ffffff','#17212d','#7ab2dd'],
LAD:['#080b10','#111923','#182332','#005a9c','#ffffff','#17212d','#ffffff'],
MIL:['#080b10','#121923','#192332','#ffc52f','#12284b','#17212d','#12284b'],
MIN:['#080b10','#111923','#182332','#d31145','#ffffff','#17212d','#002b5c'],
NYM:['#080b10','#111923','#182332','#ff5910','#ffffff','#17212d','#002d72'],
NYY:['#080b10','#111923','#182332','#0c2340','#ffffff','#17212d','#c4ced4'],
OAK:['#080d0b','#111c18','#182720','#efb21e','#10261d','#17231e','#003831'],
PHI:['#080b10','#111923','#182332','#e81828','#ffffff','#17212d','#003087'],
PIT:['#080b0e','#15191e','#20262d','#fdb827','#16130a','#1b2026','#000000'],
SDP:['#0b0907','#18140f','#231d16','#ffc425','#20180c','#1f1913','#2f241d'],
SEA:['#080b10','#111923','#182332','#005c5c','#ffffff','#17212d','#c4ced4'],
SFG:['#080b0e','#15191e','#20262d','#fd5a1e','#ffffff','#1b2026','#000000'],
STL:['#080b10','#111923','#182332','#c41e3a','#ffffff','#17212d','#0c2340'],
TBD:['#080b10','#111923','#182332','#8fbce6','#092c5c','#17212d','#f5d130'],
TEX:['#080b10','#111923','#182332','#c0111f','#ffffff','#17212d','#003278'],
TOR:['#080b10','#111923','#182332','#134a8e','#ffffff','#17212d','#e8291c'],
WSN:['#080b10','#111923','#182332','#ab0003','#ffffff','#17212d','#14225a']
};
function applyTheme(){
 const root=document.documentElement,m=meta();
 document.body.className='theme-'+m.theme;
 if(cfg.scope==='team'){
   const t=TEAM_THEMES[cfg.choice]||TEAM_THEMES.CHW;
   ['--bg','--panel','--panel2','--accent','--accentInk','--soft','--secondary'].forEach((v,i)=>{root.style.setProperty(v,t[i]);document.body.style.setProperty(v,t[i])});
   root.style.setProperty('--line',t[2]);
   document.body.style.setProperty('--line',t[2]);
 }else{
   ['--bg','--panel','--panel2','--accent','--accentInk','--soft','--secondary','--line'].forEach(v=>{root.style.removeProperty(v);document.body.style.removeProperty(v)});
 }
}

const LEGACY={whitesox:'CHW',cubs:'CHC',chicago:'chicago'};let cfg=JSON.parse(localStorage.getItem('aa-v33-config')||localStorage.getItem('aa-v31-config')||localStorage.getItem('aa-v30-config')||'{"scope":"team","choice":"CHW","era":"modern","mode":"alphabet"}');cfg.choice=LEGACY[cfg.choice]||cfg.choice;if(cfg.scope==='league')cfg.choice='MLB';
let current='AA',idx=0,lastRandom=null,hintLevel=0,hintPlayerId=null,firstNameShown=false,namedOpen=false;const $=x=>document.getElementById(x);
const NAMED_KEY='aa-v33-named-athletes',REVEALED_KEY='aa-v33-revealed-contexts',MIGRATED_KEY='aa-v33-migrated';
function readJSON(k,d){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}}
function namedSet(){return new Set(readJSON(NAMED_KEY,[]))}function putNamed(s){localStorage.setItem(NAMED_KEY,JSON.stringify([...s]))}
function revealMap(){return readJSON(REVEALED_KEY,{})}function putReveal(r){localStorage.setItem(REVEALED_KEY,JSON.stringify(r))}
function contextKey(){return `${cfg.scope}:${cfg.choice}:${cfg.era}:${current}`}
function isRevealed(id){return (revealMap()[contextKey()]||[]).includes(id)}
function migrateProgress(){if(localStorage.getItem(MIGRATED_KEY))return;let named=namedSet(),reveals=revealMap();for(let i=0;i<localStorage.length;i++){let k=localStorage.key(i);if(!k||!k.startsWith('aa-v31:'))continue;let pr=readJSON(k,null);if(!pr)continue;Object.values(pr.solved||{}).flat().forEach(id=>named.add(id));let parts=k.split(':');let scope=parts[1],choice=parts[2],era=parts[3];for(let [initial,ids] of Object.entries(pr.revealed||{})){let ck=`${scope}:${choice}:${era}:${initial}`;reveals[ck]=[...new Set([...(reveals[ck]||[]),...ids])]}}putNamed(named);putReveal(reveals);localStorage.setItem(MIGRATED_KEY,'1')}
function saveCfg(){localStorage.setItem('aa-v33-config',JSON.stringify(cfg))}
function meta(){if(cfg.scope==='league')return{name:'Major League Baseball',short:'MLB',first:1871,theme:'mlb'};if(cfg.scope==='region')return{name:'Chicago Region · MLB',short:'Chicago MLB',first:1876,theme:'chicago'};let m=MLB[cfg.choice]||MLB.CHW;return{name:m.name,short:m.short,first:m.first,theme:'team'}}
function teamYears(p){if(cfg.scope==='league'){let a=Object.values(p.teams);return a.length?[Math.min(...a.map(x=>x[0])),Math.max(...a.map(x=>x[1]))]:null}if(cfg.scope==='region'){let a=['CHC','CHW'].filter(k=>p.teams[k]).map(k=>p.teams[k]);return a.length?[Math.min(...a.map(x=>x[0])),Math.max(...a.map(x=>x[1]))]:null}return p.teams[cfg.choice]||null}
function eraRange(e){let f=meta().first;if(e==='current')return[Math.max(f,CURRENT-RECENT+1),CURRENT];if(e==='modern')return[Math.max(f,2000),CURRENT];if(e==='classic')return[f,Math.min(1999,CURRENT)];return[f,CURRENT]}
function pool(){let [s,e]=eraRange(cfg.era);return PLAYERS.filter(p=>{let y=teamYears(p);return y&&y[0]<=e&&y[1]>=s})}function byI(){let b={};for(let p of pool())(b[p.i]??=[]).push(p);return b}function found(i){let n=namedSet();return (byI()[i]||[]).filter(p=>n.has(p.id)).map(p=>p.id)}function viable(){let b=byI();return ALL.filter(i=>b[i]?.length)}function seq(){let b=byI();return (cfg.mode==='double'?DOUB:ALL).filter(i=>b[i]?.length)}
function resetHint(){hintLevel=0;hintPlayerId=null;firstNameShown=false}function pick(){resetHint();let b=byI(),v=viable();if(cfg.mode==='random'){let q=v.filter(i=>found(i).length<(b[i]?.length||0)&&i!==lastRandom);if(!q.length)q=v.filter(i=>i!==lastRandom);current=q[Math.floor(Math.random()*q.length)]||v[0]}else{let ss=seq();current=ss[idx%ss.length]||v[0]}lastRandom=current;render()}
function setScope(x){cfg.scope=x;cfg.choice=x==='region'?'chicago':x==='league'?'MLB':'CHW';saveCfg();idx=0;buildChoices();pick()}function setChoice(c){cfg.choice=c;saveCfg();idx=0;buildChoices();pick()}function setEra(e){cfg.era=e;saveCfg();idx=0;pick()}function setMode(m){cfg.mode=m;saveCfg();idx=0;pick()}function advance(){if(cfg.mode==='random')pick();else{idx++;pick()}}
function years(r){return r[0]+'–'+String(r[1]).slice(-2)}function updateEra(){for(let e of ['current','modern','classic','all'])$(e+'Years').textContent=years(eraRange(e));let r=eraRange(cfg.era);$('eraNote').textContent=`${r[0]}–${r[1]}: a player qualifies if any ${meta().short} season overlaps this range.`}
function buildChoices(){let box=$('scopeChoices');box.innerHTML='';let cs=[];if(cfg.scope==='region')cs=[['chicago','Chicago (Cubs + White Sox)']];else if(cfg.scope==='team')cs=Object.entries(MLB).sort((a,b)=>a[1].name.localeCompare(b[1].name)).map(([k,v])=>[k,v.name]);else cs=[['MLB','All MLB franchises']];for(let [k,n] of cs){let b=document.createElement('button');b.textContent=n;b.className=cfg.choice===k?'active':'';b.onclick=()=>setChoice(k);box.appendChild(b)}$('scopeNote').textContent=cfg.scope==='region'?'Chicago Region currently includes MLB only. Bears, Bulls and Blackhawks can join later.':cfg.scope==='league'?'Any player from the 30 current MLB franchise lineages qualifies.':'Choose any current MLB franchise. Historical names and relocations follow franchise lineage.'}
function stats(){let b=byI(),v=viable(),n=namedSet(),comb=v.filter(i=>(b[i]||[]).some(p=>n.has(p.id))).length,eligible=pool(),fp=eligible.filter(p=>n.has(p.id)).length,total=eligible.length;$('comboPct').textContent=(v.length?Math.round(comb/v.length*100):0)+'%';$('comboSmall').textContent=comb+'/'+v.length+' combos started';$('playerPct').textContent=(total?Math.round(fp/total*100):0)+'%';$('playerSmall').textContent=fp+'/'+total+' players named'}
const DISPLAY_OVERRIDES={griffke01:'Ken Griffey Sr.',griffke02:'Ken Griffey Jr.'};
function displayName(p){return DISPLAY_OVERRIDES[p.id]||p.n}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function careerRange(p){let a=Object.values(p.teams||{});return a.length?[Math.min(...a.map(x=>x[0])),Math.max(...a.map(x=>x[1]))]:null}
function disambigLabel(p){let r=careerRange(p),teams=(p.career||[]).map(x=>MLB[x]?.short||MLB[x]?.name||x).filter(Boolean);return [displayName(p),p.p||'position unknown',r?(r[0]+'–'+r[1]):'',teams.slice(0,4).join(', ')].filter(Boolean).join(' · ')}
function namedPlayersHere(){let n=namedSet();return (byI()[current]||[]).filter(p=>n.has(p.id)).sort((a,b)=>displayName(a).localeCompare(displayName(b)))}
function renderNamed(){let a=namedPlayersHere();$('namedInitials').textContent=current;$('namedCount').textContent=a.length;$('namedToggle').innerHTML=`Players Named for <span id="namedInitials">${current}</span> — <span id="namedCount">${a.length}</span> · ${namedOpen?'Hide players':'Show players'}`;$('namedList').hidden=!namedOpen;$('namedList').innerHTML=a.length?a.map(p=>`<div>${esc(displayName(p))}</div>`).join(''):'<div class="muted">None named yet.</div>'}
function counts(){let arr=byI()[current]||[],f=found(current).length,t=arr.length;$('possible').textContent=t+' possible '+meta().short+' player'+(t===1?'':'s');$('found').textContent=f+' of '+t+' named · '+(t?Math.round(f/t*100):0)+'%';$('comboBar').style.width=(t?f/t*100:0)+'%';renderNamed()}
function render(){resetHint();applyTheme();$('subtitle').textContent=meta().name+' · relaxed mode';$('challengeLabel').textContent=meta().name;$('guessLabel').textContent='Name a '+meta().short+' player';$('initials').textContent=current;counts();stats();updateEra();document.querySelectorAll('[data-scope]').forEach(b=>b.classList.toggle('active',b.dataset.scope===cfg.scope));document.querySelectorAll('[data-era]').forEach(b=>b.classList.toggle('active',b.dataset.era===cfg.era));document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===cfg.mode));$('message').textContent='';$('hint').hidden=true;$('guess').value=''}
function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function normAnswer(s){return norm(s.replace(/(?:,?\s+)(?:jr\.?|sr\.?|ii|iii|iv|v)\s*$/i,''))}
function award(p){let arr=byI()[current]||[],n=namedSet(),dn=displayName(p);if(n.has(p.id)){$('message').textContent='You already named '+dn+'.';return}if(isRevealed(p.id)){$('message').textContent=dn+' was already revealed in this challenge, so it cannot count toward Players Named.';return}n.add(p.id);putNamed(n);resetHint();$('hint').hidden=true;$('guess').value='';counts();stats();let remaining=arr.filter(x=>!n.has(x.id)&&!isRevealed(x.id)).length;if(remaining)$('message').textContent='✓ '+dn+' — '+remaining+' more unrevealed answer'+(remaining===1?'':'s')+' for '+current+'.';else{$('message').textContent='✓ '+dn+' — challenge cleared!';setTimeout(advance,1400)}}
function chooseAmbiguous(id){let p=(byI()[current]||[]).find(x=>x.id===id);if(p)award(p)}
function check(){let q=$('guess').value.trim();if(!q)return;let arr=byI()[current]||[],qn=norm(q),qb=normAnswer(q);
 let exactDisplay=arr.filter(x=>norm(displayName(x))===qn);if(exactDisplay.length===1){award(exactDisplay[0]);return}
 let matches=arr.filter(x=>norm(x.n)===qn||normAnswer(x.n)===qb||normAnswer(displayName(x))===qb);
 if(!matches.length){$('message').textContent='Not one we have for '+current+' in this challenge.';return}
 if(matches.length===1){award(matches[0]);return}
 $('message').innerHTML='<div class="ambiguityTitle">More than one player matches that name. Which one did you mean?</div><div class="ambiguityChoices">'+matches.map(x=>`<button type="button" class="ghost ambiguityChoice" data-player-id="${esc(x.id)}">${esc(disambigLabel(x))}</button>`).join('')+'</div>';
 $('message').querySelectorAll('[data-player-id]').forEach(b=>b.onclick=()=>chooseAmbiguous(b.dataset.playerId));}
function target(){let n=namedSet(),r=(byI()[current]||[]).filter(p=>!n.has(p.id)&&!isRevealed(p.id));if(!r.length)return null;let p=r.find(x=>x.id===hintPlayerId)||r[Math.floor(Math.random()*r.length)];hintPlayerId=p.id;return p}function eraName(p){let y=teamYears(p);if(y[0]<=1999&&y[1]>=2000)return'Classic / Modern';if(y[1]<=1999)return'Classic';if(y[1]>=CURRENT-RECENT+1)return'Current / Modern';return'Modern'}function otherTeams(p){let excluded=cfg.scope==='team'?[cfg.choice]:cfg.scope==='region'?['CHC','CHW']:[];return p.career.filter(x=>!excluded.includes(x)).map(x=>MLB[x]?.name).filter(Boolean)}
function hint(){let p=target(),box=$('hint');box.hidden=false;if(!p){box.innerHTML='No unrevealed players remain for this combination.';return}if(hintLevel<4)hintLevel++;let y=teamYears(p),lines=[];if(hintLevel>=1)lines.push(`<div class="hintLine"><strong>Position:</strong> ${p.p||'Unknown'}</div>`);if(hintLevel>=2)lines.push(`<div class="hintLine"><strong>Era:</strong> ${eraName(p)}</div>`);let oth=otherTeams(p);if(hintLevel>=3)lines.push(`<div class="hintLine"><strong>Other teams:</strong> ${oth.length?oth.slice(0,5).join(', '):'No other current-franchise lineage'}</div>`);if(hintLevel>=4)lines.push(`<div class="hintLine"><strong>${meta().short} years:</strong> ${y[0]}${y[1]!==y[0]?'–'+y[1]:''}</div>`);let c=hintLevel<4?'':`<div class="hintWarning"><strong>Strong hint ahead</strong><div>The next clue reveals this player's first name.</div><button id="firstNameHint" class="ghost hintStrong">⚠️ Reveal First Name</button></div>`;box.innerHTML=`<div class="hintTitle">Hints for one remaining ${current} player</div>`+lines.join('')+c;if(hintLevel>=4)$('firstNameHint').onclick=firstName}
function firstName(){let p=target(),y=teamYears(p);firstNameShown=true;$('hint').innerHTML=`<div class="hintTitle">Same mystery player</div><div class="hintLine"><strong>Position:</strong> ${p.p||'Unknown'}</div><div class="hintLine"><strong>${meta().short} years:</strong> ${y[0]}${y[1]!==y[0]?'–'+y[1]:''}</div><div class="hintLine"><strong>First name:</strong> ${p.n.split(/\s+/)[0]}</div><div class="hintWarning"><strong>Still stuck?</strong><div>Revealing the full player will make this answer ineligible for Players Named in this challenge.</div><button id="revealPlayer" class="ghost hintStrong">🏳️ Reveal Player</button></div>`;$('revealPlayer').onclick=revealPlayer}
function revealPlayer(){let p=target(),r=revealMap(),k=contextKey();r[k]=[...new Set([...(r[k]||[]),p.id])];putReveal(r);$('hint').innerHTML=`<div class="hintTitle">Revealed player</div><div class="revealed">${displayName(p)}</div><div class="revealNote">This answer cannot count toward Players Named in this challenge.</div>`;counts();stats()}
function defer(){advance()}function jump(){let t=$('firstLetter').value+$('lastLetter').value,b=byI();if(!b[t]?.length)return alert('No qualifying players for '+t+' in this challenge.');current=t;let ss=seq(),n=ss.indexOf(t);if(n>=0)idx=n;render();$('settingsModal').hidden=true}
for(let id of ['firstLetter','lastLetter'])for(let l of L){let o=document.createElement('option');o.value=o.textContent=l;$(id).appendChild(o)}$('firstLetter').value='N';$('lastLetter').value='S';$('jumpBtn').onclick=jump;$('submit').onclick=check;$('hintBtn').onclick=hint;$('later').onclick=defer;$('guess').onkeydown=e=>{if(e.key==='Enter')check()};$('namedToggle').onclick=()=>{namedOpen=!namedOpen;renderNamed()};document.querySelectorAll('[data-scope]').forEach(b=>b.onclick=()=>setScope(b.dataset.scope));document.querySelectorAll('[data-era]').forEach(b=>b.onclick=()=>setEra(b.dataset.era));document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$('settingsBtn').onclick=()=>$('settingsModal').hidden=false;$('closeSettings').onclick=()=>$('settingsModal').hidden=true;$('resetReveal').onclick=()=>$('resetConfirm').hidden=false;$('cancelReset').onclick=()=>$('resetConfirm').hidden=true;$('reset').onclick=()=>{localStorage.removeItem(NAMED_KEY);localStorage.setItem(MIGRATED_KEY,'1');location.reload()};$('settingsModal').onclick=e=>{if(e.target===$('settingsModal'))$('settingsModal').hidden=true};migrateProgress();buildChoices();pick();
