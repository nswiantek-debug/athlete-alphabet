// Athlete Alphabet NFL loader — nflverse season-level rosters, 1920–2026.
// V4.0.1: resilient browser loading. A missing/blocked season no longer aborts the whole NFL database.
(function(){
const DB='athlete-alphabet-nfl-v2',STORE='cache',KEY='players-1920-2026-v401';
const URL=y=>`https://github.com/nflverse/nflverse-data/releases/download/rosters/roster_${y}.csv`;
function db(){return new Promise((res,rej)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getCache(){try{let d=await db();return await new Promise((res,rej)=>{let t=d.transaction(STORE),r=t.objectStore(STORE).get(KEY);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}catch{return null}}
async function putCache(v){try{let d=await db();await new Promise((res,rej)=>{let t=d.transaction(STORE,'readwrite');t.objectStore(STORE).put(v,KEY);t.oncomplete=res;t.onerror=()=>rej(t.error)})}catch{}}
function csvLine(s){let out=[],v='',q=false;for(let i=0;i<s.length;i++){let c=s[i];if(c==='"'){if(q&&s[i+1]==='"'){v+='"';i++}else q=!q}else if(c===','&&!q){out.push(v);v=''}else v+=c}out.push(v);return out}
function initials(name){let x=name.replace(/\s+(Jr\.?|Sr\.?|II|III|IV|V)$/i,'').trim().split(/\s+/);return x.length>1?(x[0][0]+x[x.length-1][0]).toUpperCase():''}
function keyFor(row,name){return row.pfr_id||row.gsis_id||('name:'+name.toLowerCase().replace(/[^a-z0-9]/g,'')+':'+(row.birth_date||''))}
function parse(text,year,map){let lines=text.split(/\r?\n/);if(lines.length<2)return 0;let h=csvLine(lines[0]),ix={};h.forEach((x,i)=>ix[x]=i);let wanted=['team','position','full_name','football_name','gsis_id','pfr_id','birth_date'];if(ix.team==null||ix.full_name==null)return 0;let added=0;
for(let i=1;i<lines.length;i++){if(!lines[i])continue;let a=csvLine(lines[i]),row={};for(let z of wanted)row[z]=ix[z]==null?'':a[ix[z]];let name=(row.full_name||row.football_name||'').trim();if(!name||!row.team)continue;let ini=initials(name);if(!/^[A-Z]{2}$/.test(ini))continue;let id='nfl:'+keyFor(row,name),p=map.get(id);if(!p){p={id,n:name,i:ini,p:row.position||'',teams:{},career:[],sport:'NFL'};map.set(id,p);added++}let t=row.team;if(!p.teams[t])p.teams[t]=[year,year];else{p.teams[t][0]=Math.min(p.teams[t][0],year);p.teams[t][1]=Math.max(p.teams[t][1],year)}if(!p.career.includes(t))p.career.push(t);if(!p.p&&row.position)p.p=row.position}return added}
async function fetchSeason(y){let last;for(let n=0;n<3;n++){try{let r=await fetch(URL(y),{cache:n?'reload':'force-cache',mode:'cors'});if(!r.ok)throw new Error(String(r.status));return await r.text()}catch(e){last=e;await new Promise(r=>setTimeout(r,250*(n+1)))}}throw last}
async function load(){let cached=await getCache();if(cached&&cached.length>1000){window.NFL_PLAYERS=cached;return cached}let map=new Map(),years=Array.from({length:107},(_,i)=>1920+i),done=0,failed=[];window.dispatchEvent(new CustomEvent('aa-nfl-progress',{detail:{done,total:years.length,failed:0}}));
for(let i=0;i<years.length;i+=4){let batch=years.slice(i,i+4);let results=await Promise.allSettled(batch.map(async y=>[y,await fetchSeason(y)]));for(let j=0;j<results.length;j++){let r=results[j],y=batch[j];if(r.status==='fulfilled')parse(r.value[1],y,map);else failed.push(y);done++;window.dispatchEvent(new CustomEvent('aa-nfl-progress',{detail:{done,total:years.length,failed:failed.length}}))}}
let arr=[...map.values()];if(arr.length<1000)throw new Error('NFL roster source unavailable: only '+arr.length+' players loaded; failed seasons '+failed.join(','));await putCache(arr);window.NFL_PLAYERS=arr;window.NFL_LOAD_WARNINGS=failed;return arr}
window.NFL_PLAYERS=[];window.loadNFLPlayers=load;
})();
