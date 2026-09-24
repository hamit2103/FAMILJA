const root=document.getElementById("sportRoot");

const API="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-football";
const SPORT_LANG_KEY="pajaziti-language";
const SPORT_TXT={
  sq:{todayLive:"Sot / Live",sevenDays:"7 ditë",historyMonth:"1 muaj mbrapa",yesterday:"Dje",leaguesTables:"Ligat & tabelat",other:"Tjetër",noMatches:"Nuk ka ndeshje.",finished:"Përfundoi",time:"Ora",today:"Sot",tomorrow:"Nesër",allLeagues:"Të gjitha ligat",loadingTable:"Po ngarkohet tabela…",team:"Ekipi",played:"L",wins:"F",draws:"B",losses:"H",goalDiff:"Gola +/-",points:"Pikë",noData:"Nuk ka të dhëna",tableMissing:"Tabela nuk u gjet për këtë ligë.",searchLeague:"Kërko ligë…",majorLeagues:"⭐ Ligat kryesore",kosovoLeagues:"🇽🇰 Ligat e Kosovës",otherLeagues:"🌍 Ligat tjera",liveNow:"LIVE TANI",todayMatches:"NDESHJET E SOTME",sport:"Sport",liveRefresh:"Live rifreskohet automatikisht çdo 3 sekonda.",refreshing:"Po rifreskon…",refresh:"Rifresko",autoRefresh:"Auto refresh: 3 sekonda",goalAlert:"Njoftim për gol",zones:"Zonat e tabelës",zoneNote:"ℹ️ Vendet europiane tregojnë qasjen bazë. Kupa kombëtare dhe UEFA EPS mund t'i zhvendosin disa vende në fund të sezonit.",cl:"Champions League",clq:"Champions kualifikime",el:"Europa League",elq:"Europa kualifikime",eclq:"Conference kualifikime",playoff:"Playoff",relegation:"Rënie nga liga"},
  de:{todayLive:"Heute / Live",sevenDays:"7 Tage",historyMonth:"1 Monat zurück",yesterday:"Gestern",leaguesTables:"Ligen & Tabellen",other:"Sonstige",noMatches:"Keine Spiele.",finished:"Beendet",time:"Uhr",today:"Heute",tomorrow:"Morgen",allLeagues:"Alle Ligen",loadingTable:"Tabelle wird geladen…",team:"Team",played:"Sp",wins:"S",draws:"U",losses:"N",goalDiff:"Tore +/-",points:"Pkt",noData:"Keine Daten",tableMissing:"Für diese Liga wurde keine Tabelle gefunden.",searchLeague:"Liga suchen…",majorLeagues:"⭐ Top-Ligen",kosovoLeagues:"🇽🇰 Kosovo-Ligen",otherLeagues:"🌍 Weitere Ligen",liveNow:"JETZT LIVE",todayMatches:"HEUTIGE SPIELE",sport:"Sport",liveRefresh:"Live wird automatisch alle 3 Sekunden aktualisiert.",refreshing:"Wird aktualisiert…",refresh:"Aktualisieren",autoRefresh:"Auto-Aktualisierung: 3 Sekunden",goalAlert:"Torbenachrichtigung",zones:"Tabellenzonen",zoneNote:"ℹ️ Die europäischen Plätze zeigen die Grundzuordnung. Nationale Pokale und UEFA-EPS können Plätze am Saisonende verschieben.",cl:"Champions League",clq:"Champions-League-Qualifikation",el:"Europa League",elq:"Europa-League-Qualifikation",eclq:"Conference-League-Qualifikation",playoff:"Relegation/Playoff",relegation:"Abstieg"},
  tr:{todayLive:"Bugün / Canlı",sevenDays:"7 gün",historyMonth:"1 ay geçmiş",yesterday:"Dün",leaguesTables:"Ligler & puan durumu",other:"Diğer",noMatches:"Maç yok.",finished:"Bitti",time:"Saat",today:"Bugün",tomorrow:"Yarın",allLeagues:"Tüm ligler",loadingTable:"Puan durumu yükleniyor…",team:"Takım",played:"O",wins:"G",draws:"B",losses:"M",goalDiff:"Averaj",points:"Puan",noData:"Veri yok",tableMissing:"Bu lig için puan durumu bulunamadı.",searchLeague:"Lig ara…",majorLeagues:"⭐ Önemli ligler",kosovoLeagues:"🇽🇰 Kosova ligleri",otherLeagues:"🌍 Diğer ligler",liveNow:"ŞİMDİ CANLI",todayMatches:"BUGÜNÜN MAÇLARI",sport:"Spor",liveRefresh:"Canlı sonuçlar her 3 saniyede otomatik yenilenir.",refreshing:"Yenileniyor…",refresh:"Yenile",autoRefresh:"Otomatik yenileme: 3 saniye",goalAlert:"Gol bildirimi",zones:"Puan durumu bölgeleri",zoneNote:"ℹ️ Avrupa kupası sıraları temel dağılımı gösterir. Ulusal kupalar ve UEFA EPS sezon sonunda bazı sıraları değiştirebilir.",cl:"Şampiyonlar Ligi",clq:"Şampiyonlar Ligi elemeleri",el:"Avrupa Ligi",elq:"Avrupa Ligi elemeleri",eclq:"Konferans Ligi elemeleri",playoff:"Playoff",relegation:"Küme düşme"},
  en:{todayLive:"Today / Live",sevenDays:"7 days",historyMonth:"Past month",yesterday:"Yesterday",leaguesTables:"Leagues & tables",other:"Other",noMatches:"No matches.",finished:"Finished",time:"Time",today:"Today",tomorrow:"Tomorrow",allLeagues:"All leagues",loadingTable:"Loading table…",team:"Team",played:"P",wins:"W",draws:"D",losses:"L",goalDiff:"Goals +/-",points:"Pts",noData:"No data",tableMissing:"No table was found for this league.",searchLeague:"Search league…",majorLeagues:"⭐ Major leagues",kosovoLeagues:"🇽🇰 Kosovo leagues",otherLeagues:"🌍 Other leagues",liveNow:"LIVE NOW",todayMatches:"TODAY'S MATCHES",sport:"Sport",liveRefresh:"Live scores refresh automatically every 3 seconds.",refreshing:"Refreshing…",refresh:"Refresh",autoRefresh:"Auto refresh: 3 seconds",goalAlert:"Goal notification",zones:"Table zones",zoneNote:"ℹ️ European places show the base allocation. Domestic cups and UEFA EPS can shift places at the end of the season.",cl:"Champions League",clq:"Champions League qualifying",el:"Europa League",elq:"Europa League qualifying",eclq:"Conference League qualifying",playoff:"Playoff",relegation:"Relegation"},
  it:{todayLive:"Oggi / Live",sevenDays:"7 giorni",historyMonth:"Ultimo mese",yesterday:"Ieri",leaguesTables:"Campionati e classifiche",other:"Altro",noMatches:"Nessuna partita.",finished:"Finita",time:"Ora",today:"Oggi",tomorrow:"Domani",allLeagues:"Tutti i campionati",loadingTable:"Classifica in caricamento…",team:"Squadra",played:"G",wins:"V",draws:"N",losses:"P",goalDiff:"Gol +/-",points:"Pt",noData:"Nessun dato",tableMissing:"Classifica non trovata per questo campionato.",searchLeague:"Cerca campionato…",majorLeagues:"⭐ Campionati principali",kosovoLeagues:"🇽🇰 Campionati del Kosovo",otherLeagues:"🌍 Altri campionati",liveNow:"LIVE ORA",todayMatches:"PARTITE DI OGGI",sport:"Sport",liveRefresh:"I risultati live si aggiornano automaticamente ogni 3 secondi.",refreshing:"Aggiornamento…",refresh:"Aggiorna",autoRefresh:"Aggiornamento automatico: 3 secondi",goalAlert:"Notifica gol",zones:"Zone classifica",zoneNote:"ℹ️ I posti europei mostrano l'assegnazione di base. Coppe nazionali e UEFA EPS possono spostare alcuni posti a fine stagione.",cl:"Champions League",clq:"Qualificazioni Champions",el:"Europa League",elq:"Qualificazioni Europa League",eclq:"Qualificazioni Conference League",playoff:"Playoff",relegation:"Retrocessione"},
  hr:{todayLive:"Danas / Uživo",sevenDays:"7 dana",historyMonth:"Prošli mjesec",yesterday:"Jučer",leaguesTables:"Lige i tablice",other:"Ostalo",noMatches:"Nema utakmica.",finished:"Završeno",time:"Vrijeme",today:"Danas",tomorrow:"Sutra",allLeagues:"Sve lige",loadingTable:"Tablica se učitava…",team:"Momčad",played:"O",wins:"P",draws:"N",losses:"I",goalDiff:"Golovi +/-",points:"Bod",noData:"Nema podataka",tableMissing:"Tablica nije pronađena za ovu ligu.",searchLeague:"Traži ligu…",majorLeagues:"⭐ Glavne lige",kosovoLeagues:"🇽🇰 Kosovske lige",otherLeagues:"🌍 Ostale lige",liveNow:"UŽIVO SADA",todayMatches:"DANAŠNJE UTAKMICE",sport:"Sport",liveRefresh:"Rezultati uživo osvježavaju se automatski svake 3 sekunde.",refreshing:"Osvježavanje…",refresh:"Osvježi",autoRefresh:"Automatsko osvježavanje: 3 sekunde",goalAlert:"Obavijest o golu",zones:"Zone tablice",zoneNote:"ℹ️ Europska mjesta prikazuju osnovnu raspodjelu. Domaći kupovi i UEFA EPS mogu promijeniti mjesta na kraju sezone.",cl:"Liga prvaka",clq:"Kvalifikacije Lige prvaka",el:"Europska liga",elq:"Kvalifikacije Europske lige",eclq:"Kvalifikacije Konferencijske lige",playoff:"Doigravanje",relegation:"Ispadanje"},
  fr:{todayLive:"Aujourd'hui / Direct",sevenDays:"7 jours",historyMonth:"Mois précédent",yesterday:"Hier",leaguesTables:"Ligues et classements",other:"Autre",noMatches:"Aucun match.",finished:"Terminé",time:"Heure",today:"Aujourd'hui",tomorrow:"Demain",allLeagues:"Toutes les ligues",loadingTable:"Classement en cours de chargement…",team:"Équipe",played:"J",wins:"V",draws:"N",losses:"D",goalDiff:"Buts +/-",points:"Pts",noData:"Aucune donnée",tableMissing:"Aucun classement trouvé pour cette ligue.",searchLeague:"Rechercher une ligue…",majorLeagues:"⭐ Ligues principales",kosovoLeagues:"🇽🇰 Ligues du Kosovo",otherLeagues:"🌍 Autres ligues",liveNow:"EN DIRECT",todayMatches:"MATCHS DU JOUR",sport:"Sport",liveRefresh:"Les scores en direct s'actualisent automatiquement toutes les 3 secondes.",refreshing:"Actualisation…",refresh:"Actualiser",autoRefresh:"Actualisation auto : 3 secondes",goalAlert:"Notification de but",zones:"Zones du classement",zoneNote:"ℹ️ Les places européennes indiquent l'attribution de base. Les coupes nationales et l'UEFA EPS peuvent déplacer certaines places en fin de saison.",cl:"Ligue des champions",clq:"Qualifications Ligue des champions",el:"Ligue Europa",elq:"Qualifications Ligue Europa",eclq:"Qualifications Ligue Conférence",playoff:"Barrage",relegation:"Relégation"},
  ar:{todayLive:"اليوم / مباشر",sevenDays:"7 أيام",historyMonth:"الشهر الماضي",yesterday:"أمس",leaguesTables:"الدوريات والترتيب",other:"أخرى",noMatches:"لا توجد مباريات.",finished:"انتهت",time:"الوقت",today:"اليوم",tomorrow:"غداً",allLeagues:"كل الدوريات",loadingTable:"جارٍ تحميل الترتيب…",team:"الفريق",played:"ل",wins:"ف",draws:"ت",losses:"خ",goalDiff:"الأهداف +/-",points:"نقاط",noData:"لا توجد بيانات",tableMissing:"لم يتم العثور على ترتيب لهذا الدوري.",searchLeague:"ابحث عن دوري…",majorLeagues:"⭐ الدوريات الرئيسية",kosovoLeagues:"🇽🇰 دوريات كوسوفو",otherLeagues:"🌍 دوريات أخرى",liveNow:"مباشر الآن",todayMatches:"مباريات اليوم",sport:"الرياضة",liveRefresh:"يتم تحديث النتائج المباشرة تلقائياً كل 3 ثوانٍ.",refreshing:"جارٍ التحديث…",refresh:"تحديث",autoRefresh:"تحديث تلقائي: 3 ثوانٍ",goalAlert:"تنبيه هدف",zones:"مناطق الترتيب",zoneNote:"ℹ️ المراكز الأوروبية تعرض التوزيع الأساسي. قد تغيّر الكؤوس المحلية ونقاط UEFA EPS بعض المراكز في نهاية الموسم.",cl:"دوري أبطال أوروبا",clq:"تصفيات دوري الأبطال",el:"الدوري الأوروبي",elq:"تصفيات الدوري الأوروبي",eclq:"تصفيات دوري المؤتمر",playoff:"ملحق",relegation:"هبوط"}
};
function sportLang(){const l=localStorage.getItem(SPORT_LANG_KEY)||"sq";return SPORT_TXT[l]?l:"en";}
function st(k){return SPORT_TXT[sportLang()]?.[k]??SPORT_TXT.en[k]??k;}
function sportLocale(){return {sq:"sq-AL",de:"de-DE",tr:"tr-TR",en:"en-GB",it:"it-IT",hr:"hr-HR",fr:"fr-FR",ar:"ar"}[sportLang()]||"en-GB";}

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
function niceDate(offset){const d=new Date();d.setDate(d.getDate()+offset);return new Intl.DateTimeFormat(sportLocale(),{weekday:"long",day:"2-digit",month:"2-digit"}).format(d);}
function formatTime(value){if(!value)return "";const d=new Date(value);if(Number.isNaN(d.getTime()))return "";return new Intl.DateTimeFormat(sportLocale(),{hour:"2-digit",minute:"2-digit"}).format(d);}
function formatUpdated(value){if(!value)return "";const d=new Date(value);if(Number.isNaN(d.getTime()))return "";return new Intl.DateTimeFormat(sportLocale(),{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(d);}
function liveClockText(m){
 const raw=String(m?.status_text||"").trim();
 if(!raw)return "LIVE";
 const short=raw.length>18?raw.slice(0,18):raw;
 return "LIVE · "+short;
}
function statusText(m){if(isLive(m))return liveClockText(m);if(isFinished(m))return st("finished");const t=formatTime(m?.time);return t?st("time")+" "+t:st("today");}
function scoreText(m){const h=m?.home_score,a=m?.away_score;return h!=null&&a!=null?esc(h)+" : "+esc(a):"–";}
function eventKey(m){return String(m?.id||[m?.home,m?.away,m?.time].join("|"));}
function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"")||fallback;}catch{return fallback;}}
function writeJson(key,v){localStorage.setItem(key,JSON.stringify(v));}
function alerts(){return readJson(GOAL_ALERTS_KEY,{});}
function alertOn(m){return !!alerts()[eventKey(m)];}

function teamLogo(url){return url?'<img src="'+esc(url)+'" alt="" loading="lazy">':'<span class="sport-ball">⚽</span>';}
function flagEmoji(code){
 const c=String(code||"").trim().toUpperCase();
 if(!/^[A-Z]{2}$/.test(c))return "";
 return String.fromCodePoint(...[...c].map(ch=>127397+ch.charCodeAt(0)));
}
function teamNameHtml(name,countryCode){
 const flag=flagEmoji(countryCode);
 return '<span class="sport-team-name-wrap"><strong>'+esc(name||"—")+'</strong>'+(flag?'<span class="sport-team-flag" aria-label="'+esc(countryCode)+'">'+flag+'</span>':'')+'</span>';
}

function matchHtml(m){
 const live=isLive(m),key=eventKey(m),on=alertOn(m);
 return `<article class="sport-match-vertical ${live?"is-live":""}" id="sport-match-${esc(key).replace(/[^a-zA-Z0-9_-]/g,"-")}">
   <div class="sport-team-line">${teamLogo(m?.home_logo)}${teamNameHtml(m?.home,m?.home_country_code)}<span class="sport-team-score">${m?.home_score??""}</span></div>
   <div class="sport-team-line">${teamLogo(m?.away_logo)}${teamNameHtml(m?.away,m?.away_country_code)}<span class="sport-team-score">${m?.away_score??""}</span></div>
   <div class="sport-match-bottom">
     <span class="sport-status-pill ${live?"live":""}">${esc(statusText(m))}</span>
     <strong class="sport-main-score">${scoreText(m)}</strong>
     <button class="goal-bell ${on?"active":""}" type="button" data-goal-bell="${esc(key)}" title="${esc(st("goalAlert"))}">${on?"🔔":"🔕"}</button>
   </div>
 </article>`;
}

function groupRows(list){
 const map=new Map();
 for(const m of list){const k=m?.competition||st("other");if(!map.has(k))map.set(k,[]);map.get(k).push(m);}
 return [...map.entries()];
}
function matchesSection(_title,list){
 if(!list.length)return '<div class="sport-no-live">'+esc(st("noMatches"))+'</div>';
 return groupRows(list).map(([name,rows])=>{
   const first=rows[0],key=eventKey(first);
   return `<div class="sport-competition-block"><button class="sport-competition-title sport-competition-button" type="button" data-competition-match="${esc(key)}" title="${esc(st("leaguesTables"))}"><span>${esc(name)}</span><span class="sport-competition-arrow">›</span></button>${rows.map(matchHtml).join("")}</div>`;
 }).join("");
}

function mainButtons(){
 return `<div class="sport-main-actions">
   <button class="secondary sport-main-btn ${mode==="today"?"active":""}" data-sport-mode="today">⚽ ${esc(st("todayLive"))}</button>
   <button class="secondary sport-main-btn ${mode==="days"?"active":""}" data-sport-mode="days">📅 ${esc(st("sevenDays"))}</button>
   <button class="secondary sport-main-btn ${mode==="history"?"active":""}" data-sport-mode="history">↩️ ${esc(st("historyMonth"))}</button>
   <button class="secondary sport-main-btn ${mode==="leagues"?"active":""}" data-sport-mode="leagues">🏆 ${esc(st("leaguesTables"))}</button>
 </div>`;
}

const ZONE_LABEL_KEYS={
 "zone-cl":"cl","zone-clq":"clq","zone-el":"el","zone-elq":"elq",
 "zone-eclq":"eclq","zone-playoff":"playoff","zone-relegation":"relegation"
};
const LEAGUE_ZONE_RULES={
 "eng.1":[[1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[18,20,"zone-relegation"]],
 "esp.1":[[1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[18,20,"zone-relegation"]],
 "ita.1":[[1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[18,20,"zone-relegation"]],
 "ger.1":[[1,4,"zone-cl"],[5,5,"zone-el"],[6,6,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]],
 "fra.1":[[1,3,"zone-cl"],[4,4,"zone-clq"],[5,5,"zone-el"],[6,6,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]],
 "ned.1":[[1,2,"zone-cl"],[3,3,"zone-clq"],[4,4,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]],
 "por.1":[[1,2,"zone-cl"],[3,3,"zone-elq"],[4,4,"zone-eclq"],[16,16,"zone-playoff"],[17,18,"zone-relegation"]],
 "bel.1":[[1,1,"zone-cl"],[2,2,"zone-clq"],[3,3,"zone-elq"],[4,4,"zone-eclq"]],
 "tur.1":[[1,1,"zone-cl"],[2,2,"zone-clq"],[3,3,"zone-elq"],[4,4,"zone-eclq"],[16,18,"zone-relegation"]],
 "sco.1":[[1,1,"zone-clq"],[2,2,"zone-elq"],[3,3,"zone-eclq"],[11,11,"zone-playoff"],[12,12,"zone-relegation"]],
 "ger.2":[[16,16,"zone-playoff"],[17,18,"zone-relegation"]],
 "eng.2":[[22,24,"zone-relegation"]],
 "kosovo":[[1,1,"zone-clq"],[2,3,"zone-eclq"]]
};

function leagueRuleKey(league){
 const slug=String(league?.slug||"").toLowerCase();
 if(slug&&LEAGUE_ZONE_RULES[slug])return slug;
 if(league?.group==="Kosovë"||String(league?.country||"").toLowerCase().includes("kosov"))return "kosovo";
 return "";
}
function standingZoneClass(league,rank,totalTeams){
 const key=leagueRuleKey(league);if(!key)return "";
 const pos=Number(rank),rules=LEAGUE_ZONE_RULES[key]||[];
 const found=rules.find(([from,to])=>pos>=from&&pos<=Math.min(to,totalTeams));
 return found?found[2]:"";
}
function standingsLegendHtml(league,totalTeams){
 const key=leagueRuleKey(league);if(!key)return "";
 const seen=new Set(),items=[];
 for(const [from,to,cls] of LEAGUE_ZONE_RULES[key]||[]){
   if(from>totalTeams||seen.has(cls))continue;
   seen.add(cls);
   items.push(`<span class="legend-item ${cls}">${esc(st(ZONE_LABEL_KEYS[cls]||cls))}</span>`);
 }
 return items.length?`<div class="standings-legend" aria-label="${esc(st("zones"))}">${items.join("")}</div>`:"";
}
function standingsZoneNoteHtml(league){
 const key=leagueRuleKey(league);
 if(!key||key==="ger.2"||key==="eng.2")return "";
 return `<p class="standings-zone-note">${esc(st("zoneNote"))}</p>`;
}

function render(){
 if(!root)return;
 let body="";
 if(mode==="days"){
   body=`<section class="sport-days-layout">
     <div class="sport-days-vertical">${[0,1,2,3,4,5,6].map(n=>`<button class="sport-day-vertical ${selectedDay===n?"active":""}" data-sport-day="${n}"><strong>${n===0?esc(st("today")):n===1?esc(st("tomorrow")):esc(niceDate(n).split(",")[0])}</strong><small>${esc(niceDate(n))}</small></button>`).join("")}</div>
     <div class="sport-day-content"><div class="sport-section-title"><strong>${esc(niceDate(selectedDay))}</strong></div>${matchesSection("",matches)}</div>
   </section>`;
 } else if(mode==="history"){
   const historyDays=Array.from({length:31},(_,i)=>-i);
   body=`<section class="sport-days-layout sport-history-layout">
     <div class="sport-days-vertical sport-history-days">${historyDays.map(n=>`<button class="sport-day-vertical ${selectedDay===n?"active":""}" data-sport-day="${n}"><strong>${n===0?esc(st("today")):n===-1?esc(st("yesterday")):esc(niceDate(n).split(",")[0])}</strong><small>${esc(niceDate(n))}</small></button>`).join("")}</div>
     <div class="sport-day-content"><div class="sport-section-title"><strong>${esc(niceDate(selectedDay))}</strong></div>${matchesSection("",matches)}</div>
   </section>`;
 } else if(mode==="leagues"){
   if(selectedLeague){
     body=`<section class="card sport-standings-card">
       <button class="secondary" id="leagueBack">← ${esc(st("allLeagues"))}</button>
       <h2>🏆 ${esc(selectedLeague.name)}</h2>
       ${standingsLoading?`<p>${esc(st("loadingTable"))}</p>`:standings.length?`${standingsLegendHtml(selectedLeague,standings.length)}${standingsZoneNoteHtml(selectedLeague)}<div class="standings-wrap"><table class="standings-table"><thead><tr><th>#</th><th>${esc(st("team"))}</th><th>${esc(st("played"))}</th><th>${esc(st("wins"))}</th><th>${esc(st("draws"))}</th><th>${esc(st("losses"))}</th><th>${esc(st("goalDiff"))}</th><th>${esc(st("points"))}</th></tr></thead><tbody>${standings.map(r=>{const rowClass=standingZoneClass(selectedLeague,r.rank,standings.length);return `<tr class="${rowClass}"><td class="rank-cell"><span class="rank-badge">${esc(r.rank??"")}</span></td><td class="standing-team">${r.logo?'<img class="standing-team-logo" src="'+esc(r.logo)+'" alt="" loading="lazy">':'<span class="standing-team-logo placeholder">⚽</span>'}<span>${esc(r.team||st("team"))}</span></td><td>${esc(r.played??0)}</td><td>${esc(r.wins??0)}</td><td>${esc(r.draws??0)}</td><td>${esc(r.losses??0)}</td><td class="goal-diff-cell"><strong>${Number(r.gd)>0?"+"+esc(r.gd):esc(r.gd??0)}</strong></td><td class="points-cell"><strong>${esc(r.points??0)}</strong></td></tr>`;}).join("")}</tbody></table></div>`:`<div class="sports-empty-card"><h3>${esc(st("noData"))}</h3><p>${esc(st("tableMissing"))}</p></div>`}
     </section>`;
   }else{
     const q=leagueSearch.trim().toLocaleLowerCase();
     const filtered=leagues.filter(l=>!q||[l.name,l.country,l.group].some(v=>String(v||"").toLocaleLowerCase().includes(q)));
     const kosovo=filtered.filter(l=>l.group==="Kosovë");
     const major=filtered.filter(l=>l.group==="Kryesore");
     const other=filtered.filter(l=>l.group!=="Kosovë"&&l.group!=="Kryesore");
     const list=(title,arr)=>arr.length?`<div class="league-group"><h3>${title}</h3>${arr.map(l=>`<button class="league-row" data-league-id="${esc(l.id)}"><span>🏆</span><strong>${esc(l.name)}</strong><small>${esc(l.country||"")}</small><span>›</span></button>`).join("")}</div>`:"";
     body=`<section class="card league-browser"><input id="leagueSearch" class="sport-search" placeholder="${esc(st("searchLeague"))}" value="${esc(leagueSearch)}">${list(st("majorLeagues"),major)}${list(st("kosovoLeagues"),kosovo)}${list(st("otherLeagues"),other)}</section>`;
   }
 }else{
   const live=matches.filter(isLive),rest=matches.filter(m=>!isLive(m));
   body=`<section class="sport-section"><div class="sport-section-title"><span class="live-dot"></span><strong>${esc(st("liveNow"))}</strong></div>${matchesSection("",live)}</section>
   <section class="sport-section"><div class="sport-section-title">⚽ <strong>${esc(st("todayMatches"))}</strong></div>${matchesSection("",rest)}</section>`;
 }
 root.innerHTML=`<div class="sport-simple-shell">
   <section class="card sport-simple-head"><div><h2>⚽ ${esc(st("sport"))}</h2><p class="muted">${esc(st("liveRefresh"))}</p></div><button id="sportRefresh" class="secondary sport-refresh" type="button">${loading?esc(st("refreshing")):esc(st("refresh"))}</button><div class="sport-auto-info"><span class="live-dot"></span><span>${esc(st("autoRefresh"))}</span>${lastUpdated?'<span class="muted">· '+esc(formatUpdated(lastUpdated))+'</span>':""}</div>${mainButtons()}</section>
   ${body}
 </div>`;
 bind();
}

function bind(){
 document.getElementById("sportRefresh")?.addEventListener("click",()=>mode==="leagues"?loadLeagues(true):loadMatches(true,false));
 root.querySelectorAll("[data-sport-mode]").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.sportMode;selectedLeague=null;if(mode==="days"||mode==="history"){selectedDay=0;loadMatches(true,false);}else if(mode==="leagues"){loadLeagues();}else{selectedDay=0;loadMatches(true,false);}render();}));
 root.querySelectorAll("[data-sport-day]").forEach(b=>b.addEventListener("click",()=>{selectedDay=Number(b.dataset.sportDay);loadMatches(true,false);}));
 root.querySelectorAll("[data-competition-match]").forEach(b=>b.addEventListener("click",()=>{const m=matches.find(x=>eventKey(x)===b.dataset.competitionMatch);if(m)openCompetitionTable(m);}));
 root.querySelectorAll("[data-goal-bell]").forEach(b=>b.addEventListener("click",()=>toggleGoalAlert(b.dataset.goalBell)));
 document.getElementById("leagueSearch")?.addEventListener("input",e=>{leagueSearch=e.target.value;render();});
 root.querySelectorAll("[data-league-id]").forEach(b=>b.addEventListener("click",()=>{selectedLeague=leagues.find(l=>l.id===b.dataset.leagueId)||null;if(selectedLeague)loadStandings(selectedLeague);}));
 document.getElementById("leagueBack")?.addEventListener("click",()=>{selectedLeague=null;standings=[];render();});
}
async function openCompetitionTable(m){
 const name=String(m?.competition||st("other"));
 const leagueId=String(m?.league_id||"");
 const slug=String(m?.league_slug||"")||(leagueId.startsWith("espn:")?leagueId.slice(5):"");
 if(slug){
   selectedLeague={id:"espn:"+slug,source:"espn",slug,name,country:"",group:"Kryesore"};
   mode="leagues";
   await loadStandings(selectedLeague);
   return;
 }
 if(leagueId && !leagueId.startsWith("espn:")){
   selectedLeague={id:"sdb:"+leagueId,source:"sportsdb",league_id:leagueId,name,country:"",group:"Të tjera"};
   mode="leagues";
   await loadStandings(selectedLeague);
   return;
 }
 if(!leagues.length)await loadLeagues();
 const needle=name.toLocaleLowerCase();
 selectedLeague=leagues.find(l=>String(l.name||"").toLocaleLowerCase()===needle)
   ||leagues.find(l=>String(l.name||"").toLocaleLowerCase().includes(needle)||needle.includes(String(l.name||"").toLocaleLowerCase()))
   ||null;
 if(selectedLeague){mode="leagues";await loadStandings(selectedLeague);}
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
 autoTimer=setInterval(()=>{if(document.getElementById("sportView")?.classList.contains("hidden"))return;if(mode==="today"||(mode==="days"&&selectedDay===0))loadMatches(true,true);},3000);
}
window.PajazitiSports={activate,refresh:()=>loadMatches(true,false),reloadLanguage:render,openMatch:(key)=>{mode="today";selectedDay=0;loadMatches(true,false).then(()=>setTimeout(()=>document.getElementById("sport-match-"+String(key).replace(/[^a-zA-Z0-9_-]/g,"-"))?.scrollIntoView({behavior:"smooth",block:"center"}),400));}};
render();
document.getElementById("sportTab")?.addEventListener("click",()=>{if(!loading)activate();});
