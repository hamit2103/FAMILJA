const root=document.getElementById("sportRoot");

const TODAY_API="https://sportscore.com/api/widget/matches/?sport=football&limit=50&src=pajaziti-app";
let matches=[];
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

function formatKickoff(value){
  if(!value) return "";
  const d=new Date(value);
  if(Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(d);
}

function formatUpdated(value){
  if(!value) return "";
  const d=new Date(value);
  if(Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(d);
}

function statusText(m){
  if(isLive(m)) return "LIVE";
  if(isFinished(m)) return "Përfundoi";
  const time=formatKickoff(m?.time);
  return time ? "Ora "+time : "Sot";
}

function scoreText(m){
  const hasHome=m?.home_score!==null && m?.home_score!==undefined;
  const hasAway=m?.away_score!==null && m?.away_score!==undefined;
  return hasHome && hasAway ? esc(m.home_score)+" : "+esc(m.away_score) : "–";
}

function competitionPriority(name){
  const n=String(name||"").toLocaleLowerCase();
  const rules=[
    [0,/(world cup|fifa world cup|uefa euro|european championship|nations league|world championship)/],
    [10,/champions league/],
    [20,/europa league/],
    [30,/conference league/],
    [100,/(premier league|england.*premier|english premier)/],
    [110,/(la liga|primera division|spain.*liga)/],
    [120,/(serie a|italy.*serie)/],
    [130,/(bundesliga|germany.*bundesliga)/],
    [140,/(ligue 1|france.*ligue)/],
    [150,/(super lig|süper lig|turkey.*super)/],
    [210,/(kosovo.*super|superliga.*kosov)/]
  ];
  for(const [priority,rx] of rules){
    if(rx.test(n)) return priority;
  }
  return 500;
}

function sortMatches(list){
  return [...list].sort((a,b)=>{
    const liveDiff=Number(isLive(b))-Number(isLive(a));
    if(liveDiff) return liveDiff;
    const ta=new Date(a?.time||0).getTime()||0;
    const tb=new Date(b?.time||0).getTime()||0;
    if(ta!==tb) return ta-tb;
    return String(a?.competition||"").localeCompare(String(b?.competition||""),"sq");
  });
}

function groupByCompetition(list){
  const groups=new Map();
  for(const m of sortMatches(list)){
    const key=m?.competition||"Tjetër";
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(m);
  }
  return [...groups.entries()].sort((a,b)=>{
    const p=competitionPriority(a[0])-competitionPriority(b[0]);
    return p || String(a[0]).localeCompare(String(b[0]),"sq");
  });
}

function teamLogo(url){
  return url ? '<img src="'+esc(url)+'" alt="" loading="lazy">' : '<span class="sport-ball">⚽</span>';
}

function matchHtml(m){
  const live=isLive(m);
  return `
    <article class="sport-match-vertical ${live?"is-live":""}">
      <div class="sport-match-league">${esc(m?.competition||"Tjetër")}</div>
      <div class="sport-team-line">
        ${teamLogo(m?.home_logo)}
        <strong>${esc(m?.home||"—")}</strong>
        <span class="sport-team-score">${m?.home_score!==null && m?.home_score!==undefined ? esc(m.home_score) : ""}</span>
      </div>
      <div class="sport-team-line">
        ${teamLogo(m?.away_logo)}
        <strong>${esc(m?.away||"—")}</strong>
        <span class="sport-team-score">${m?.away_score!==null && m?.away_score!==undefined ? esc(m.away_score) : ""}</span>
      </div>
      <div class="sport-match-bottom">
        <span class="sport-status-pill ${live?"live":""}">${esc(statusText(m))}</span>
        <strong class="sport-main-score">${scoreText(m)}</strong>
      </div>
    </article>`;
}

function sectionHtml(title,list,live=false){
  if(!list.length){
    return live ? `
      <section class="sport-section">
        <div class="sport-section-title"><span class="live-dot"></span><strong>LIVE TANI</strong></div>
        <div class="sport-no-live">Nuk ka ndeshje live për momentin.</div>
      </section>` : "";
  }

  const groups=groupByCompetition(list);
  return `
    <section class="sport-section">
      <div class="sport-section-title">${live?'<span class="live-dot"></span>':"⚽"}<strong>${esc(title)}</strong></div>
      <div class="sport-vertical-list">
        ${groups.map(([name,items])=>`
          <div class="sport-competition-block">
            <div class="sport-competition-title">${esc(name)}</div>
            ${items.map(matchHtml).join("")}
          </div>
        `).join("")}
      </div>
    </section>`;
}

function render(){
  if(!root) return;
  const live=matches.filter(isLive);
  const rest=matches.filter(m=>!isLive(m));

  root.innerHTML=`
    <div class="sport-simple-shell">
      <section class="card sport-simple-head">
        <div>
          <h2>⚽ Sport</h2>
          <p class="muted">Ndeshjet e sotme dhe rezultatet LIVE. Live rifreskohet automatikisht çdo 10 sekonda.</p>
        </div>
        <button id="sportRefresh" class="secondary sport-refresh" type="button">${loading?"Po rifreskon…":"Rifresko"}</button>
        <div class="sport-auto-info">
          <span class="live-dot"></span>
          <span>Auto refresh: 10 sekonda</span>
          ${lastUpdated?'<span class="muted">· '+esc(formatUpdated(lastUpdated))+'</span>':""}
        </div>
      </section>

      ${sectionHtml("LIVE TANI",live,true)}
      ${sectionHtml("NDESHJET E SOTME",rest,false)}

      ${!matches.length && !loading?'<section class="card sport-empty"><strong>Nuk u gjetën ndeshje për sot.</strong></section>':""}

      <div class="sport-source"><a href="https://sportscore.com/" rel="dofollow" target="_blank" title="Sports data by SportScore">Powered by SportScore</a></div>
    </div>`;

  document.getElementById("sportRefresh")?.addEventListener("click",()=>loadMatches(true,false));
}

async function loadMatches(force=false,silent=false){
  if(loading) return;
  if(!force && matches.length){render();return;}
  loading=true;
  if(!silent) render();

  try{
    const response=await fetch(TODAY_API+"&t="+Date.now(),{cache:"no-store"});
    if(!response.ok) throw new Error("HTTP "+response.status);
    const data=await response.json();
    matches=Array.isArray(data?.matches)?data.matches:[];
    lastUpdated=data?.updated||new Date().toISOString();
  }catch(error){
    console.warn("Sport results",error);
    if(!matches.length && !silent){
      root.innerHTML=`
        <section class="card sport-empty">
          <h2>⚽ Sport</h2>
          <p>Nuk u ngarkuan rezultatet. Provo përsëri pas pak.</p>
          <button id="sportRetry" class="primary" type="button">Provo përsëri</button>
        </section>`;
      document.getElementById("sportRetry")?.addEventListener("click",()=>loadMatches(true,false));
      loading=false;
      return;
    }
  }

  loading=false;
  render();
}

function activate(){
  loadMatches(true,false);
  if(autoTimer) clearInterval(autoTimer);
  autoTimer=setInterval(()=>{
    if(document.getElementById("sportView")?.classList.contains("hidden")) return;
    loadMatches(true,true);
  },10000);
}

function reloadLanguage(){render();}

window.PajazitiSports={activate,refresh:()=>loadMatches(true,false),reloadLanguage};

render();
document.getElementById("sportTab")?.addEventListener("click",()=>{
  if(!loading) activate();
});
