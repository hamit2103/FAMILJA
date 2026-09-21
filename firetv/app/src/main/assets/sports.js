const root=document.getElementById("sportRoot");

const TODAY_API="https://sportscore.com/api/widget/matches/?sport=football&limit=50&src=pajaziti-app";
const DAY_API="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-football";
let matches=[];
let filter="all";
let search="";
let loading=false;
let lastUpdated="";
let autoTimer=null;
let selectedDay=0;

function esc(v=""){
  return String(v)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

function isLive(m){
  const s=String(m?.status||"").toLowerCase();
  return ["live","inprogress","in_progress","playing","1h","2h","ht"].some(x=>s.includes(x));
}

function isFinished(m){
  const s=String(m?.status||"").toLowerCase();
  return s==="finished" || s==="ft" || s.includes("finish");
}

function formatTime(value){
  if(!value) return "";
  const d=new Date(value);
  if(Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined,{
    day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"
  }).format(d);
}

function dateKey(offset){
  const d=new Date();
  d.setDate(d.getDate()+offset);
  return d.toISOString().slice(0,10);
}

function niceDate(offset){
  const d=new Date();
  d.setDate(d.getDate()+offset);
  return new Intl.DateTimeFormat("sq",{weekday:"short",day:"2-digit",month:"2-digit"}).format(d);
}

function dayLabel(n){
  if(n===0) return "Sot";
  if(n===1) return "Nesër";
  if(n===2) return "Pasnesër";
  return niceDate(n);
}

function translatedStatus(m){
  if(isLive(m)) return "LIVE";
  if(isFinished(m)) return "Përfundoi";
  const raw=String(m?.status_text||m?.status||"").trim();
  if(raw==="scheduled") return "Planifikuar";
  return raw || "—";
}

function selectedMatches(){
  const q=search.trim().toLocaleLowerCase();
  return matches.filter(m=>{
    if(filter==="live" && !isLive(m)) return false;
    if(filter==="finished" && !isFinished(m)) return false;
    if(!q) return true;
    return [m.home,m.away,m.competition].some(v=>String(v||"").toLocaleLowerCase().includes(q));
  });
}

function competitionPriority(name){
  const n=String(name||"").toLocaleLowerCase();
  const rules=[
    [0,/(world cup|fifa world cup|uefa euro|european championship|nations league|world championship)/],
    [10,/champions league/],
    [20,/europa league/],
    [30,/conference league/],
    [40,/(world cup qual|euro qual|qualification|qualifiers|international friendly|friendlies)/],
    [100,/(premier league|england.*premier|english premier)/],
    [110,/(la liga|primera division|spain.*liga)/],
    [120,/(serie a|italy.*serie)/],
    [130,/(bundesliga|germany.*bundesliga)/],
    [140,/(ligue 1|france.*ligue)/],
    [150,/(super lig|süper lig|turkey.*super)/],
    [160,/(primeira liga|portugal.*liga)/],
    [170,/(eredivisie|netherlands.*eredivisie)/],
    [180,/(pro league|belgium.*league)/],
    [190,/(austria.*bundesliga|austrian bundesliga)/],
    [200,/(swiss super league|switzerland.*super)/],
    [210,/(kosovo.*super|superliga.*kosov)/]
  ];
  for(const [priority,rx] of rules){
    if(rx.test(n)) return priority;
  }
  return 500;
}

function groupByCompetition(rows){
  const groups=new Map();
  for(const m of rows){
    const key=m.competition||"Tjetër";
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(m);
  }
  return [...groups.entries()]
    .map(([name,list])=>[
      name,
      [...list].sort((a,b)=>{
        const liveDiff=Number(isLive(b))-Number(isLive(a));
        if(liveDiff) return liveDiff;
        const ta=new Date(a.time||0).getTime()||0;
        const tb=new Date(b.time||0).getTime()||0;
        return ta-tb;
      })
    ])
    .sort((a,b)=>{
      const pa=competitionPriority(a[0]);
      const pb=competitionPriority(b[0]);
      if(pa!==pb) return pa-pb;
      return String(a[0]).localeCompare(String(b[0]),"sq");
    });
}

function matchHtml(m){
  const live=isLive(m);
  const score=(m.home_score!==null && m.home_score!==undefined && m.away_score!==null && m.away_score!==undefined)
    ? esc(m.home_score)+" : "+esc(m.away_score)
    : "–";
  const homeLogo=m.home_logo?'<img src="'+esc(m.home_logo)+'" alt="" loading="lazy">':"⚽";
  const awayLogo=m.away_logo?'<img src="'+esc(m.away_logo)+'" alt="" loading="lazy">':"⚽";

  return `
    <article class="sport-match">
      <div class="sport-team">
        ${homeLogo}
        <span class="sport-team-name">${esc(m.home||"—")}</span>
      </div>
      <div class="sport-score">
        <strong>${score}</strong>
        <div class="sport-status ${live?"live":""}">${esc(translatedStatus(m))}</div>
        <div class="muted small">${esc(formatTime(m.time))}</div>
      </div>
      <div class="sport-team away">
        <span class="sport-team-name">${esc(m.away||"—")}</span>
        ${awayLogo}
      </div>
    </article>`;
}

function render(){
  if(!root) return;
  const rows=selectedMatches();
  const groups=groupByCompetition(rows);

  root.innerHTML=`
    <div class="sport-shell">
      <section class="card">
        <div class="sport-head">
          <div>
            <h2>⚽ Sport</h2>
            <p class="muted">Live, rezultatet dhe ndeshjet e sotme si më parë. Tani mund të shohësh edhe ditët e ardhshme.</p>
          </div>
          <button id="sportRefresh" class="secondary sport-refresh" type="button">${loading?"Po rifreskon…":"Rifresko"}</button>
        </div>

        <div class="sport-day-tabs">
          ${[0,1,2,3,4,5,6].map(n=>`
            <button class="sport-day ${selectedDay===n?"active":""}" data-sport-day="${n}">
              <strong>${dayLabel(n)}</strong>
              <small>${niceDate(n)}</small>
            </button>
          `).join("")}
        </div>

        <div class="sport-controls">
          <input id="sportSearch" class="sport-search" type="search" placeholder="Kërko ekip ose ligë…" value="${esc(search)}">
          <div class="sport-filters">
            <button class="sport-filter ${filter==="all"?"active":""}" data-sport-filter="all">Të gjitha</button>
            <button class="sport-filter ${filter==="live"?"active":""}" data-sport-filter="live">🔴 Live</button>
            <button class="sport-filter ${filter==="finished"?"active":""}" data-sport-filter="finished">✅ Përfunduara</button>
          </div>
          <div class="muted sport-meta">
            ${rows.length} ndeshje${lastUpdated?" · Përditësuar: "+esc(formatTime(lastUpdated)):""}
          </div>
        </div>
      </section>

      <section class="sport-list">
        ${groups.length ? groups.map(([name,list])=>`
          <div class="sport-league">
            <div class="sport-league-title">
              ${list[0]?.competition_logo?'<img class="sport-league-logo" src="'+esc(list[0].competition_logo)+'" alt="" loading="lazy">':"🏆"}
              <span>${esc(name)}</span>
            </div>
            ${list.map(matchHtml).join("")}
          </div>
        `).join("") : '<section class="card sport-empty"><strong>Nuk u gjetën ndeshje.</strong></section>'}
      </section>

      ${selectedDay===0?'<div class="sport-source"><a href="https://sportscore.com/" rel="dofollow" target="_blank" title="Sports data by SportScore">Powered by SportScore</a></div>':""}
    </div>`;

  document.getElementById("sportRefresh")?.addEventListener("click",()=>loadMatches(true));
  document.getElementById("sportSearch")?.addEventListener("input",(e)=>{search=e.target.value;render();});
  root.querySelectorAll("[data-sport-filter]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      filter=btn.dataset.sportFilter;
      render();
    });
  });
  root.querySelectorAll("[data-sport-day]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      selectedDay=Number(btn.dataset.sportDay);
      filter="all";
      search="";
      loadMatches(true);
    });
  });
}

async function loadMatches(force=false){
  if(loading) return;
  if(!force && matches.length) { render(); return; }
  loading=true;
  render();

  try{
    const url=selectedDay===0
      ? TODAY_API+"&t="+Date.now()
      : DAY_API+"?date="+encodeURIComponent(dateKey(selectedDay))+"&t="+Date.now();
    const response=await fetch(url,{cache:"no-store"});
    if(!response.ok) throw new Error("HTTP "+response.status);
    const data=await response.json();
    matches=Array.isArray(data?.matches)?data.matches:[];
    lastUpdated=data?.updated||new Date().toISOString();
  }catch(error){
    console.warn("Sport results",error);
    if(!matches.length){
      root.innerHTML=`
        <section class="card sport-empty">
          <h2>⚽ Sport</h2>
          <p>Nuk u ngarkuan rezultatet. Provo përsëri pas pak.</p>
          <button id="sportRetry" class="primary" type="button">Provo përsëri</button>
        </section>`;
      document.getElementById("sportRetry")?.addEventListener("click",()=>loadMatches(true));
      loading=false;
      return;
    }
  }

  loading=false;
  render();
}

function activate(){
  loadMatches(true);
  if(autoTimer) clearInterval(autoTimer);
  autoTimer=setInterval(()=>{
    if(document.getElementById("sportView")?.classList.contains("hidden")) return;
    if(selectedDay===0) loadMatches(true);
  },60000);
}

function reloadLanguage(){ render(); }

window.PajazitiSports={activate,refresh:()=>loadMatches(true),reloadLanguage};

const SPORT_MODULE_READY=true;
render();
document.getElementById("sportTab")?.addEventListener("click",()=>{
  if(!loading) activate();
});
