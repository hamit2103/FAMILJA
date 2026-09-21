const root=document.getElementById("sportRoot");
const LANG_KEY="pajaziti-language";
const SPORT_TXT={
  sq:{finished:"Përfundoi",other:"Tjetër",desc:"${st("desc")}",refresh:"Rifresko",refreshing:"Po rifreskon…",search:"Kërko ekip ose ligë…",all:"Të gjitha",finishedBtn:"Përfunduara",matches:"ndeshje",updated:"Përditësuar",none:"Nuk u gjetën ndeshje.",loadError:"Nuk u ngarkuan rezultatet. Provo përsëri pas pak.",retry:"Provo përsëri"},
  de:{finished:"Beendet",other:"Andere",desc:"Die wichtigsten Wettbewerbe erscheinen zuerst, danach die führenden nationalen Ligen.",refresh:"Aktualisieren",refreshing:"Wird aktualisiert…",search:"Team oder Liga suchen…",all:"Alle",finishedBtn:"Beendet",matches:"Spiele",updated:"Aktualisiert",none:"Keine Spiele gefunden.",loadError:"Ergebnisse konnten nicht geladen werden. Versuche es später erneut.",retry:"Erneut versuchen"},
  tr:{finished:"Bitti",other:"Diğer",desc:"Önce en önemli turnuvalar, ardından ülkelerin önde gelen ligleri gösterilir.",refresh:"Yenile",refreshing:"Yenileniyor…",search:"Takım veya lig ara…",all:"Tümü",finishedBtn:"Bitenler",matches:"maç",updated:"Güncellendi",none:"Maç bulunamadı.",loadError:"Sonuçlar yüklenemedi. Biraz sonra tekrar dene.",retry:"Tekrar dene"},
  it:{finished:"Terminata",other:"Altro",desc:"Prima le competizioni più importanti, poi i principali campionati nazionali.",refresh:"Aggiorna",refreshing:"Aggiornamento…",search:"Cerca squadra o campionato…",all:"Tutte",finishedBtn:"Terminate",matches:"partite",updated:"Aggiornato",none:"Nessuna partita trovata.",loadError:"Impossibile caricare i risultati. Riprova tra poco.",retry:"Riprova"},
  hr:{finished:"Završeno",other:"Ostalo",desc:"Najvažnija natjecanja prikazuju se prva, zatim najbolje nacionalne lige.",refresh:"Osvježi",refreshing:"Osvježavanje…",search:"Traži momčad ili ligu…",all:"Sve",finishedBtn:"Završene",matches:"utakmica",updated:"Ažurirano",none:"Nema pronađenih utakmica.",loadError:"Rezultati se nisu učitali. Pokušaj ponovno kasnije.",retry:"Pokušaj ponovno"},
  ar:{finished:"انتهت",other:"أخرى",desc:"تظهر أهم البطولات أولاً، ثم أقوى الدوريات المحلية.",refresh:"تحديث",refreshing:"جارٍ التحديث…",search:"ابحث عن فريق أو دوري…",all:"الكل",finishedBtn:"المنتهية",matches:"مباريات",updated:"تم التحديث",none:"لم يتم العثور على مباريات.",loadError:"تعذر تحميل النتائج. حاول مرة أخرى بعد قليل.",retry:"حاول مرة أخرى"},
  en:{finished:"Finished",other:"Other",desc:"The most important competitions appear first, followed by the leading national leagues.",refresh:"Refresh",refreshing:"Refreshing…",search:"Search team or league…",all:"All",finishedBtn:"Finished",matches:"matches",updated:"Updated",none:"No matches found.",loadError:"Results could not be loaded. Try again shortly.",retry:"Try again"},
  fr:{finished:"Terminé",other:"Autre",desc:"Les compétitions les plus importantes apparaissent d'abord, puis les principaux championnats nationaux.",refresh:"Actualiser",refreshing:"Actualisation…",search:"Rechercher une équipe ou un championnat…",all:"Tous",finishedBtn:"Terminés",matches:"matchs",updated:"Mis à jour",none:"Aucun match trouvé.",loadError:"Les résultats n'ont pas pu être chargés. Réessayez plus tard.",retry:"Réessayer"}
};
function sportLang(){const l=localStorage.getItem(LANG_KEY)||"sq";return SPORT_TXT[l]?l:"sq";}
function st(k){return SPORT_TXT[sportLang()]?.[k]||SPORT_TXT.en[k]||k;}

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
  return new Intl.DateTimeFormat(sportLang()==="ar"?"ar":sportLang(),{
    day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"
  }).format(d);
}

function translatedStatus(m){
  if(isLive(m)) return "LIVE";
  if(isFinished(m)) return st("finished");
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
    const key=m.competition||st("other");
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
            <p class="muted">Garat më të rëndësishme shfaqen të parat, pastaj ligat kryesore të shteteve.</p>
          </div>
          <button id="sportRefresh" class="secondary sport-refresh" type="button">${loading?st("refreshing"):st("refresh")}</button>
        </div>

        <div class="sport-controls">
          <input id="sportSearch" class="sport-search" type="search" placeholder="${esc(st("search"))}" value="${esc(search)}">
          <div class="sport-filters">
            <button class="sport-filter ${filter==="all"?"active":""}" data-sport-filter="all">${st("all")}</button>
            <button class="sport-filter ${filter==="live"?"active":""}" data-sport-filter="live">🔴 Live</button>
            <button class="sport-filter ${filter==="finished"?"active":""}" data-sport-filter="finished">✅ ${st("finishedBtn")}</button>
          </div>
          <div class="muted sport-meta">
            ${rows.length} ${st("matches")}${lastUpdated?" · "+st("updated")+": "+esc(formatTime(lastUpdated)):""}
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
        `).join("") : '<section class="card sport-empty"><strong>${st("none")}</strong></section>'}
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
          <p>${st("loadError")}</p>
          <button id="sportRetry" class="primary" type="button">${st("retry")}</button>
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

window.PajazitiSports={activate,refresh:()=>loadMatches(true),reloadLanguage:render};
