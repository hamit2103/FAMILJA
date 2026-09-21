const root=document.getElementById("sportRoot");

const API="https://sportscore.com/api/widget/matches/?sport=football&limit=50&src=pajaziti-app";
let matches=[];
let filter="all";
let search="";
let loading=false;
let lastUpdated="";
let autoTimer=null;

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

function translatedStatus(m){
  if(isLive(m)) return "LIVE";
  if(isFinished(m)) return "Përfundoi";
  const raw=String(m?.status_text||m?.status||"").trim();
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

function groupByCompetition(rows){
  const groups=new Map();
  for(const m of rows){
    const key=m.competition||"Tjetër";
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(m);
  }
  return [...groups.entries()];
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
            <p class="muted">Futboll real — rezultate dhe ndeshje live.</p>
          </div>
          <button id="sportRefresh" class="secondary sport-refresh" type="button">${loading?"Po rifreskon…":"Rifresko"}</button>
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

      <div class="sport-source">
        <a href="https://sportscore.com/" rel="dofollow" target="_blank" title="Sports data by SportScore">Powered by SportScore</a>
      </div>
    </div>`;

  document.getElementById("sportRefresh")?.addEventListener("click",()=>loadMatches(true));
  document.getElementById("sportSearch")?.addEventListener("input",(e)=>{search=e.target.value;render();});
  root.querySelectorAll("[data-sport-filter]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      filter=btn.dataset.sportFilter;
      render();
    });
  });
}

async function loadMatches(force=false){
  if(loading) return;
  if(!force && matches.length) { render(); return; }
  loading=true;
  render();

  try{
    const response=await fetch(API,{cache:"no-store"});
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
        </section>
        <div class="sport-source"><a href="https://sportscore.com/" rel="dofollow" target="_blank">Powered by SportScore</a></div>`;
      document.getElementById("sportRetry")?.addEventListener("click",()=>loadMatches(true));
      loading=false;
      return;
    }
  }

  loading=false;
  render();
}

function activate(){
  loadMatches(matches.length===0);
  if(autoTimer) clearInterval(autoTimer);
  autoTimer=setInterval(()=>{
    if(document.getElementById("sportView")?.classList.contains("hidden")) return;
    loadMatches(true);
  },60000);
}

window.PajazitiSports={activate,refresh:()=>loadMatches(true)};
