/* Athlete Alphabet MLB V3.4 — July 31, 2026 active-roster snapshot overlay.
   Source: https://github.com/eliaszeller/mlb-2026-data-model (StatsAPI-derived active_rosters.csv)
   The overlay intentionally uses the 2026-07-31 snapshot agreed for V3.4. */
(function(){
  const SNAPSHOT_URL='https://raw.githubusercontent.com/eliaszeller/mlb-2026-data-model/main/data/processed/active_rosters.csv';
  const TEAM={AZ:'ARI',ATH:'OAK',ATL:'ATL',BAL:'BAL',BOS:'BOS',CHC:'CHC',CWS:'CHW',CIN:'CIN',CLE:'CLE',COL:'COL',DET:'DET',HOU:'HOU',KC:'KCR',LAA:'ANA',LAD:'LAD',MIA:'FLA',MIL:'MIL',MIN:'MIN',NYM:'NYM',NYY:'NYY',PHI:'PHI',PIT:'PIT',SD:'SDP',SEA:'SEA',SF:'SFG',STL:'STL',TB:'TBD',TEX:'TEX',TOR:'TOR',WSH:'WSN'};
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const base=s=>norm(String(s||'').replace(/(?:,?\s+)(?:jr\.?|sr\.?|ii|iii|iv|v)\s*$/i,''));
  function initials(name){let a=String(name||'').trim().replace(/(?:,?\s+)(?:Jr\.?|Sr\.?|II|III|IV|V)\s*$/i,'').split(/\s+/);return a.length>1?(a[0][0]+a[a.length-1][0]).toUpperCase():''}
  function csv(line){let out=[],cur='',q=false;for(let i=0;i<line.length;i++){let c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){cur+='"';i++}else q=!q}else if(c===','&&!q){out.push(cur);cur=''}else cur+=c}out.push(cur);return out}
  function merge(text){
    let lines=text.trim().split(/\r?\n/),head=csv(lines.shift()),ix=Object.fromEntries(head.map((x,i)=>[x,i]));
    let P=window.ATHLETE_PLAYERS||[], byName=new Map();
    for(let p of P){let k=base(p.n);if(!byName.has(k))byName.set(k,[]);byName.get(k).push(p)}
    let added=0,updated=0,rows=0;
    for(let line of lines){let r=csv(line);if(r[ix.season]!=='2026'||r[ix.active]!=='True'||!String(r[ix.retrieved_at_utc]||'').startsWith('2026-07-31'))continue;let team=TEAM[r[ix.team_abbreviation]];if(!team)continue;rows++;
      let name=r[ix.player_name], key=base(name), candidates=byName.get(key)||[], p=candidates.length===1?candidates[0]:candidates.find(x=>norm(x.n)===norm(name));
      if(!p){p={id:'mlbapi_'+r[ix.player_id],n:name,i:initials(name),teams:{},p:r[ix.position_abbreviation]||'',career:[]};P.push(p);if(!byName.has(key))byName.set(key,[]);byName.get(key).push(p);added++}
      if(!p.teams[team]){p.teams[team]=[2026,2026];updated++}else{p.teams[team][1]=Math.max(p.teams[team][1],2026);p.teams[team][0]=Math.min(p.teams[team][0],2026)}
      if(!p.career.includes(team))p.career.push(team);if(!p.i)p.i=initials(name);if(!p.p)p.p=r[ix.position_abbreviation]||'';
    }
    window.AA_ROSTER_STATUS={ok:true,date:'2026-07-31',rows,added,updated};
  }
  window.AA_ROSTER_READY=fetch(SNAPSHOT_URL,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('snapshot '+r.status);return r.text()}).then(merge).catch(e=>{window.AA_ROSTER_STATUS={ok:false,date:'2026-07-31',error:String(e)};console.warn('V3.4 roster snapshot unavailable; using bundled player data.',e)});
})();
