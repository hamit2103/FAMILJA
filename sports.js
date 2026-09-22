const root=document.getElementById("sportRoot");

const API="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-football";
let matches=[];
let loading=false;
let lastUpdated="";
let autoTimer=null;
let mode="today";
let selectedDay=0;
let leagues=[];
let leagueSearch="";
let selectedLeague=null;
let standings=[];
let standingsLoading=false;
const GOAL_ALERTS_KEY="diamond-goal-alerts-v1";
const GOAL_SCORE_KEY="diamond-goal-scores-v1";

function esc(v=""){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function isLive(m){const s=String(m?.status||"").toLowerCase();return ["live","inprogress","in_progress","playing","1h","2h","ht"].some(x=>s.includes(x));}
function isFinished(m){const s=String(m?.status||"").toLowerCase();return s==="finished"||s==="ft"||s.includes("finish");}
function dateKey(offset){const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10);}
function niceDate(offset){const d=new Date();d.setDate(d.getDate()+offset);return new Intl.DateTimeFormat("sq",{weekday:"long",day:"2-digit",month:"2-digit"}).format(d);}
function formatTime(value){if(!value)return "";const d=new Date(value);if(Number.isNaN(d.getTime()))return "";return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(d);}
function formatUpdated(value){if(!value)return "";const d=new Date(value);if(Number.isNaN(d.getTime()))return "";return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(d);}
function statusText(m){if(isLive(m))return "LIVE";if(isFinished(m))return "Përfundoi";const t=formatTime(m?.time);return t?"Ora "+t:"Sot";}
function scoreText(m){const h=m?.home_score,a=m?.away_score;return h!=null&&a!=null?esc(h)+" : "+esc(a):"–";}
function eventKey(m){return String(m?.id||[m?.home,m?.away,m?.time].join("|"));}
function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"")||fallback;}catch{return fallback;}}
function writeJson(key,v){localStorage.setItem(key,JSON.stringify(v));}
function alerts(){return readJson(GOAL_ALERTS_KEY,{});}
function alertOn(m){return !!alerts()[eventKey(m)];}

function teamLogo(url){return url?'<img src="'+esc(url)+'" alt="" loading="lazy">':'<span class="sport-ball">⚽</span>';}

function matchHtml(m){
 const live=isLive(m),key=eventKey(m),on=alertOn(m);
 return `<article class="sport-match-vertical ${live?"is-live":""}" id="sport-match-${esc(key).replace(/[^a-zA-Z0-9_-]/g,"-")}">
   <div class="sport-team-line">${teamLogo(m?.home_logo)}<strong>${esc(m?.home||"—")}</strong><span class="sport-team-score">${m?.home_score??""}</span></div>
   <div class="sport-team-line">${teamLogo(m?.away_logo)}<strong>${esc(m?.away||"—")}</strong><span class="sport-team-score">${m?.away_score??""}</span></div>
   <div class="sport-match-bottom">
     <span class="sport-status-pill ${live?"live":""}">${esc(statusText(m))}</span>
     <strong class="sport-main-score">${scoreText(m)}</strong>
     <button class="goal-bell ${on?"active":""}" type="button" data-goal-bell="${esc(key)}" title="Njoftim për gol">${on?"🔔":"🔕"}</button>
   </div>
 </article>`;
}

function groupRows(list){
 const map=new Map();
 for(const m of list){const k=m?.competition||"Tjetër";if(!map.has(k))map.set(k,[]);map.get(k).push(m);}
 return [...map.entries()];
}
function matchesSection(title,list){
 if(!list.length)return '<div class="sport-no-live">Nuk ka ndeshje.</div>';
 return groupRows(list).map(([name,rows])=>`<div class="sport-competition-block"><div class="sport-competition-title">${esc(name)}</div>${rows.map(matchHtml).join("")}</div>`).join("");
}

function mainButtons(){
 return `<div class="sport-main-actions">
   <button class="secondary sport-main-btn ${mode==="today"?"active":""}" data-sport-mode="today">⚽ Sot / Live</button>
   <button class="secondary sport-main-btn ${mode==="days"?"active":""}" data-sport-mode="days">📅 7 ditë</button>
   <button class="secondary sport-main-btn ${mode==="leagues"?"active":""}" data-sport-mode="leagues">🏆 Ligat & tabelat</button>
 </div>`;
}


const ZONE_LABELS={
 "zone-cl":"Champions League",
 "zone-clq":"Champions kualifikime",
 "zone-el":"Europa League",
 "zone-elq":"Europa kualifikime",
 "zone-eclq":"Conference kualifikime",
 "zone-playoff":"Playoff",
 "zone-relegation":"Rënie nga liga"
};

/*
 * Zonat europiane janë të lidhura me ligën, jo me numrin e ekipeve.
 * Këto janë vendet bazë sipas modelit aktual të UEFA-s; kupa kombëtare,
 * fituesit e kupave europiane dhe European Performance Spots mund t'i
 * zhvendosin disa vende Europa/Conference në fund të sezonit.
 */
const LEAGUE_ZONE_RULES={
 "eng.1":[
   [1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[18,20,"zone-relegation"]
 ],
 "esp.1":[
   [1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[18,20,"zone-relegation"]
 ],
 "ita.1":[
   [1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[18,20,"zone-relegation"]
 ],
 "ger.1":[
   [1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]
 ],
 "fra.1":[
   [1,3,"zone-cl"],[4,4,"zone-clq"],[5,5,"zone-el"],[6,6,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]
 ],
 "ned.1":[
   [1,2,"zone-cl"],[3,3,"zone-clq"],[4,4,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]
 ],
 "por.1":[
   [1,2,"zone-cl"],[3,3,"zone-elq"],[4,4,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]
 ],
 "bel.1":[
   [1,1,"zone-cl"],[2,2,"zone-clq"],[3,3,"zone-elq"],[4,4,"zone-eclq"]
 ],
 "tur.1":[
   [1,1,"zone-cl"],[2,2,"zone-clq"],[3,3,"zone-elq"],[4,4,"zone-eclq"],[16,18,"zone-relegation"]
 ],
 "sco.1":[
   [1,1,"zone-clq"],[2,2,"zone-elq"],[3,3,"zone-eclq"],[11,11,"zone-playoff"],[12,12,"zone-relegation"]
 ],
 "ger.2":[
   [16,16,"zone-playoff"],[17,18,"zone-relegation"]
 ],
 "eng.2":[
   [22,24,"zone-relegation"]
 ],
 "kosovo":[
   [1,1,"zone-clq"],[2,3,"zone-eclq"]
 ]
};

function leagueRuleKey(league){
 const slug=String(league?.slug||"").toLowerCase();
 if(slug&&LEAGUE_ZONE_RULES[slug])return slug;
 if(league?.group==="Kosovë"||String(league?.country||"").toLowerCase().includes("kosov"))return "kosovo";
 return "";
}

function standingZoneClass(league,rank,totalTeams){
 const key=leagueRuleKey(league);
 if(!key)return "";
 const pos=Number(rank);
 const rules=LEAGUE_ZONE_RULES[key]||[];
 const found=rules.find(([from,to])=>pos>=from&&pos<=Math.min(to,totalTeams));
 return found?found[2]:"";
}

function standingsLegendHtml(league,totalTeams){
 const key=leagueRuleKey(league);
 if(!key)return "";
 const seen=new Set();
 const items=[];
 for(const [from,to,cls] of LEAGUE_ZONE_RULES[key]||[]){
   if(from>totalTeams||seen.has(cls))continue;
   seen.add(cls);
   items.push(`<span class="legend-item ${cls}">${ZONE_LABELS[cls]||cls}</span>`);
 }
 return items.length?`<div class="standings-legend" aria-label="Zonat e tabelës">${items.join("")}</div>`:"";
}

function standingsZoneNoteHtml(league){
 const key=leagueRuleKey(league);
 if(!key||key==="ger.2"||key==="eng.2")return "";
 return `<p class="standings-zone-note">ℹ️ Vendet europiane tregojnë qasjen bazë. Kupa kombëtare dhe UEFA EPS mund t'i zhvendosin disa vende në fund të sezonit.</p>`;
}

function render(){
 if(!root)return;
 let body="";
 if(mode==="days"){
   body=`<section class="sport-days-layout">
     <div class="sport-days-vertical">${[0,1,2,3,4,5,6].map(n=>`<button class="sport-day-vertical ${selectedDay===n?"active":""}" data-sport-day="${n}"><strong>${n===0?"Sot":n===1?"Nesër":niceDate(n).split(",")[0]}</strong><small>${niceDate(n)}</small></button>`).join("")}</div>
     <div class="sport-day-content"><div class="sport-section-title"><strong>${esc(niceDate(selectedDay))}</strong></div>${matchesSection("Ndeshjet",matches)}</div>
   </section>`;
 } else if(mode==="leagues"){
   if(selectedLeague){
     body=`<section class="card sport-standings-card">
       <button class="secondary" id="leagueBack">← Të gjitha ligat</button>
       <h2>🏆 ${esc(selectedLeague.name)}</h2>
       ${standingsLoading?'<p>Po ngarkohet tabela…</p>':standings.length?`${standingsLegendHtml(selectedLeague,standings.length)}${standingsZoneNoteHtml(selectedLeague)}<div class="standings-wrap"><table class="standings-table"><thead><tr><th>#</th><th>Ekipi</th><th>L</th><th>F</th><th>B</th><th>H</th><th>Gola +/-</th><th>Pikë</th></tr></thead><tbody>${standings.map(r=>{const rowClass=standingZoneClass(selectedLeague,r.rank,standings.length);return `<tr class="${rowClass}"><td class="rank-cell"><span class="rank-badge">${esc(r.rank??"")}</span></td><td class="standing-team">${r.logo?'<img class="standing-team-logo" src="'+esc(r.logo)+'" alt="" loading="lazy">':'<span class="standing-team-logo placeholder">⚽</span>'}<span>${esc(r.team||"Ekipi")}</span></td><td>${esc(r.played??0)}</td><td>${esc(r.wins??0)}</td><td>${esc(r.draws??0)}</td><td>${esc(r.losses??0)}</td><td class="goal-diff-cell"><strong>${Number(r.gd)>0?"+"+esc(r.gd):esc(r.gd??0)}</strong></td><td class="points-cell"><strong>${esc(r.points??0)}</strong></td></tr>`;}).join("")}</tbody></table></div>`:'<div class="sports-empty-card"><h3>Nuk ka të dhëna</h3><p>Tabela nuk u gjet për këtë ligë.</p></div>'}
     </section>`;
   }else{
     const q=leagueSearch.trim().toLocaleLowerCase();
     const filtered=leagues.filter(l=>!q||[l.name,l.country,l.group].some(v=>String(v||"").toLocaleLowerCase().includes(q)));
     const kosovo=filtered.filter(l=>l.group==="Kosovë");
     const major=filtered.filter(l=>l.group==="Kryesore");
     const other=filtered.filter(l=>l.group!=="Kosovë"&&l.group!=="Kryesore");
     const list=(title,arr)=>arr.length?`<div class="league-group"><h3>${title}</h3>${arr.map(l=>`<button class="league-row" data-league-id="${esc(l.id)}"><span>🏆</span><strong>${esc(l.name)}</strong><small>${esc(l.country||"")}</small><span>›</span></button>`).join("")}</div>`:"";
     body=`<section class="card league-browser"><input id="leagueSearch" class="sport-search" placeholder="Kërko ligë…" value="${esc(leagueSearch)}">${list("⭐ Ligat kryesore",major)}${list("🇽🇰 Ligat e Kosovës",kosovo)}${list("🌍 Ligat tjera",other)}</section>`;
   }
 }else{
   const live=matches.filter(isLive),rest=matches.filter(m=>!isLive(m));
   body=`<section class="sport-section"><div class="sport-section-title"><span class="live-dot"></span><strong>LIVE TANI</strong></div>${matchesSection("Live",live)}</section>
   <section class="sport-section"><div class="sport-section-title">⚽ <strong>NDESHJET E SOTME</strong></div>${matchesSection("Sot",rest)}</section>`;
 }
 root.innerHTML=`<div class="sport-simple-shell">
   <section class="card sport-simple-head"><div><h2>⚽ Sport</h2><p class="muted">Live rifreskohet automatikisht çdo 10 sekonda.</p></div><button id="sportRefresh" class="secondary sport-refresh" type="button">${loading?"Po rifreskon…":"Rifresko"}</button><div class="sport-auto-info"><span class="live-dot"></span><span>Auto refresh: 10 sekonda</span>${lastUpdated?'<span class="muted">· '+esc(formatUpdated(lastUpdated))+'</span>':""}</div>${mainButtons()}</section>
   ${body}
 </div>`;
 bind();
}

function bind(){
 document.getElementById("sportRefresh")?.addEventListener("click",()=>mode==="leagues"?loadLeagues(true):loadMatches(true,false));
 root.querySelectorAll("[data-sport-mode]").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.sportMode;selectedLeague=null;if(mode==="days"){selectedDay=0;loadMatches(true,false);}else if(mode==="leagues"){loadLeagues();}else{selectedDay=0;loadMatches(true,false);}render();}));
 root.querySelectorAll("[data-sport-day]").forEach(b=>b.addEventListener("click",()=>{selectedDay=Number(b.dataset.sportDay);loadMatches(true,false);}));
 root.querySelectorAll("[data-goal-bell]").forEach(b=>b.addEventListener("click",()=>toggleGoalAlert(b.dataset.goalBell)));
 document.getElementById("leagueSearch")?.addEventListener("input",e=>{leagueSearch=e.target.value;render();});
 root.querySelectorAll("[data-league-id]").forEach(b=>b.addEventListener("click",()=>{selectedLeague=leagues.find(l=>l.id===b.dataset.leagueId)||null;if(selectedLeague)loadStandings(selectedLeague);}));
 document.getElementById("leagueBack")?.addEventListener("click",()=>{selectedLeague=null;standings=[];render();});
}

async function loadMatches(force=false,silent=false){
 if(loading)return;
 loading=true;if(!silent)render();
 try{
   const res=await fetch(API+"?date="+encodeURIComponent(dateKey(selectedDay))+"&t="+Date.now(),{cache:"no-store"});
   const data=await res.json();matches=Array.isArray(data?.matches)?data.matches:[];lastUpdated=data?.updated||new Date().toISOString();checkGoalChanges(matches);
 }catch(e){console.warn("sport",e);}
 loading=false;render();
}

async function loadLeagues(force=false){
 if(leagues.length&&!force){render();return;}
 try{const r=await fetch(API+"?action=leagues&t="+Date.now(),{cache:"no-store"});const d=await r.json();leagues=Array.isArray(d?.leagues)?d.leagues:[];}catch(e){console.warn(e);}
 render();
}
async function loadStandings(l){
 standingsLoading=true;standings=[];render();
 try{
  const source=l.source==="espn"?"espn":"sportsdb";
  const id=source==="espn"?l.slug:l.league_id;
  const r=await fetch(API+"?action=standings&source="+encodeURIComponent(source)+"&id="+encodeURIComponent(id)+"&name="+encodeURIComponent(l.name)+"&t="+Date.now(),{cache:"no-store"});
  const d=await r.json();standings=Array.isArray(d?.table)?d.table:[];
 }catch(e){console.warn(e);}
 standingsLoading=false;render();
}

function toggleGoalAlert(key){
 const map=alerts(),m=matches.find(x=>eventKey(x)===key);
 if(!m)return;
 if(map[key]){delete map[key];window.AndroidGoal?.removeGoalAlert?.(key);}
 else{
   map[key]={id:key,home:m.home,away:m.away,date:String(m.time||"").slice(0,10)};
   window.AndroidGoal?.addGoalAlert?.(key,String(m.home||""),String(m.away||""),String(m.time||""));
   window.AndroidGoal?.requestNotificationPermission?.();
 }
 writeJson(GOAL_ALERTS_KEY,map);render();
}

function checkGoalChanges(rows){
 const map=alerts(),scores=readJson(GOAL_SCORE_KEY,{});
 for(const m of rows){
  const key=eventKey(m);if(!map[key])continue;
  const h=m.home_score,a=m.away_score;if(h==null||a==null)continue;
  const old=scores[key];
  if(old && (Number(h)>Number(old.h)||Number(a)>Number(old.a))){
    const scorer=Number(h)>Number(old.h)?m.home:m.away;
    if(!window.AndroidGoal){try{new Notification("⚽ GOOOL",{body:scorer+" · "+m.home+" "+h+" - "+a+" "+m.away});}catch{}}
  }
  scores[key]={h,a};
 }
 writeJson(GOAL_SCORE_KEY,scores);
}

function activate(){
 mode="today";selectedDay=0;loadMatches(true,false);
 if(autoTimer)clearInterval(autoTimer);
 autoTimer=setInterval(()=>{if(document.getElementById("sportView")?.classList.contains("hidden"))return;if(mode==="today"||mode==="days"&&selectedDay===0)loadMatches(true,true);},10000);
}
window.PajazitiSports={activate,refresh:()=>loadMatches(true,false),reloadLanguage:render,openMatch:(key)=>{mode="today";selectedDay=0;loadMatches(true,false).then(()=>setTimeout(()=>document.getElementById("sport-match-"+String(key).replace(/[^a-zA-Z0-9_-]/g,"-"))?.scrollIntoView({behavior:"smooth",block:"center"}),400));}};
render();
document.getElementById("sportTab")?.addEventListener("click",()=>{if(!loading)activate();});
