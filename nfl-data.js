// Athlete Alphabet NFL loader — nflverse season-level rosters, 1920–2026.
// The compact derived player index is cached in IndexedDB after the first successful load.
(function(){
const DB='athlete-alphabet-nfl-v1',STORE='cache',KEY='players-1920-2026';
const URL=y=>`https://github.com/nflverse/nflverse-data/releases/download/rosters/roster_${y}.csv`;
function db(){return new Promise((res,rej)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getCache(){try{let d=await db();return await new Promise((res,rej)=>{let t=d.transaction(STORE),r=t.objectStore(STORE).get(KEY);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}catch{return null}}
async function putCache(v){try{let d=await db();await new Promise((res,rej)=>{let t=d.transaction(STORE,'readwrite');t.objectStore(STORE).put(v,KEY);t.oncomplete=res;t.onerror=()=>rej(t.error)})}catch{}}
function csvLine(s){let out=[],v='',q=false;for(let i=0;i<s.length;i++){let c=s[i];if(c==='"'){if(q&&s[i+1]==='"'){v+='"';i++}else q=!q}else if(c===','&&!q){out.push(v);v=''}else v+=c}out.push(v);return out}
function initials(name){let x=name.replace(/\s+(Jr\.?|Sr\.?|II|III|IV|V)$/i,'').trim().split(/\s+/);return x.length>1?(x[0][0]+x[x.length-1][0]).toUpperCase():''}
function cleanName(s){return (s||'').trim()}
function keyFor(row,name){return row.pfr_id||row.gsis_id||('name:'+name.toLowerCase().replace(/[^a-z0-9]/g,'')+':'+(row.birth_date||''))}
function parse(text,year,map){let lines=text.split(/\r?\n/);if(lines.length<2)return;let h=csvLine(lines[0]),ix={};h.forEach((x,i)=>ix[x]=i);let wanted=['team','position','full_name','football_name','gsis_id','pfr_id','birth_date'];for(let z of wanted)if(ix[z]==null&&z!=='football_name'&&z!=='birth_date')return;
 for(let i=1;i<lines.length;i++){if(!lines[i])continue;let a=csvLine(lines[i]),row={};for(let z of wanted)row[z]=ix[z]==null?'':a[ix[z]];let name=cleanName(row.full_name||row.football_name);if(!name||!row.team)continue;let ini=initials(name);if(!/^[A-Z]{2}$/.test(ini))continue;let raw=keyFor(row,name),id='nfl:'+raw,p=map.get(id);if(!p){p={id,n:name,i:ini,p:row.position||'',teams:{},career:[],sport:'NFL'};map.set(id,p)}let t=row.team;if(!p.teams[t])p.teams[t]=[year,year];else{p.teams[t][0]=Math.min(p.teams[t][0],year);p.teams[t][1]=Math.max(p.teams[t][1],year)}if(!p.career.includes(t))p.career.push(t);if(!p.p&&row.position)p.p=row.position}
}
async function load(){let cached=await getCache();if(cached&&cached.length){window.NFL_PLAYERS=cached;return cached}let map=new Map(),years=Array.from({length:107},(_,i)=>1920+i),done=0;window.dispatchEvent(new CustomEvent('aa-nfl-progress',{detail:{done,total:years.length}}));
 async function one(y){let r=await fetch(URL(y),{cache:'force-cache'});if(!r.ok)throw new Error('NFL '+y+' '+r.status);parse(await r.text(),y,map);done++;window.dispatchEvent(new CustomEvent('aa-nfl-progress',{detail:{done,total:years.length}}))}
 for(let i=0;i<years.length;i+=8)await Promise.all(years.slice(i,i+8).map(one));let arr=[...map.values()];await putCache(arr);window.NFL_PLAYERS=arr;return arr}
window.NFL_PLAYERS=[];window.loadNFLPlayers=load;
})();
