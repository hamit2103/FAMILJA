const root=document.getElementById("sportRoot");
const LANG_KEY="pajaziti-language";
const API_BASE="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-football";
let matches=[];
let selectedDate=0;
let loading=false;
let lastUpdated="";

const T={
  sq:{today:"Sot",tomorrow:"Nesër",dayAfter:"Pasnesër",refresh:"Rifresko",loading:"Po ngarkohet…",none:"Nuk u gjetën ndeshje për këtë ditë.",match:"ndeshje",updated:"Përditësuar",finished:"Përfundoi",scheduled:"Planifikuar",desc:"Champions League dhe garat kryesore dalin të parat, pastaj ligat më të forta."},
  de:{today:"Heute",tomorrow:"Morgen",dayAfter:"Übermorgen",refresh:"Aktualisieren",loading:"Wird geladen…",none:"Keine Spiele an diesem Tag.",match:"Spiele",updated:"Aktualisiert",finished:"Beendet",scheduled:"Geplant",desc:"Champions League und die wichtigsten Wettbewerbe erscheinen zuerst, danach die stärksten Ligen."},
  tr:{today:"Bugün",tomorrow:"Yarın",dayAfter:"Öbür gün",refresh:"Yenile",loading:"Yükleniyor…",none:"Bu gün için maç bulunamadı.",match:"maç",updated:"Güncellendi",finished:"Bitti",scheduled:"Planlandı",desc:"Önce Şampiyonlar Ligi ve en önemli turnuvalar, sonra en güçlü ligler gösterilir."},
  it:{today:"Oggi",tomorrow:"Domani",dayAfter:"Dopodomani",refresh:"Aggiorna",loading:"Caricamento…",none:"Nessuna partita per questo giorno.",match:"partite",updated:"Aggiornato",finished:"Terminata",scheduled:"Programmata",desc:"Prima Champions League e le competizioni principali, poi i campionati più forti."},
  hr:{today:"Danas",tomorrow:"Sutra",dayAfter:"Prekosutra",refresh:"Osvježi",loading:"Učitavanje…",none:"Nema utakmica za taj dan.",match:"utakmica",updated:"Ažurirano",finished:"Završeno",scheduled:"Zakazano",desc:"Prvo Liga prvaka i najvažnija natjecanja, zatim najjače lige."},
  ar:{today:"اليوم",tomorrow:"غدًا",dayAfter:"بعد غد",refresh:"تحديث",loading:"جارٍ التحميل…",none:"لا توجد مباريات لهذا اليوم.",match:"مباريات",updated:"تم التحديث",finished:"انتهت",scheduled:"مجدولة",desc:"تظهر دوري الأبطال وأهم البطولات أولاً، ثم أقوى الدوريات."},
  en:{today:"Today",tomorrow:"Tomorrow",dayAfter:"Day after",refresh:"Refresh",loading:"Loading…",none:"No matches for this day.",match:"matches",updated:"Updated",finished:"Finished",scheduled:"Scheduled",desc:"Champions League and the main competitions appear first, followed by the strongest leagues."},
  fr:{today:"Aujourd’hui",tomorrow:"Demain",dayAfter:"Après-demain",refresh:"Actualiser",loading:"Chargement…",none:"Aucun match pour ce jour.",match:"matchs",updated:"Mis à jour",finished:"Terminé",scheduled:"Prévu",desc:"La Ligue des champions et les principales compétitions apparaissent d'abord, puis les meilleurs championnats."}
};

function lang(){const l=localStorage.getItem(LANG_KEY)||"sq";return T[l]?l:"sq";}
function tr(k){return T[lang()][k]||T.en[k]||k;}
function esc(v=""){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function dateKey(offset){const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10);}
function niceDate(offset){
  const d=new Date();d.setDate(d.getDate()+offset);
  return new Intl.DateTimeFormat(lang()==="ar"?"ar":lang(),{weekday:"short",day:"2-digit",month:"2-digit"}).format(d);
}
function statusText(m){if(m.status==="live")return "LIVE";if(m.status==="finished")return tr("finished");return tr("scheduled");}
function group(rows){
  const map=new Map();
  for(const m of rows){const k=m.competition||"Other";if(!map.has(k))map.set(k,[]);map.get(k).push(m);}
  return [...map.entries()];
}
function render(){
  if(!root)return;
  const groups=group(matches);
  root.innerHTML=`
  <div class="sport-shell">
    <section class="card sport-top">
      <div class="sport-head">
        <div><h2>⚽ Sport</h2><p class="muted">${tr("desc")}</p></div>
        <button id="sportRefresh" class="secondary" type="button">${loading?tr("loading"):tr("refresh")}</button>
      </div>
      <div class="sport-day-tabs">
        ${[0,1,2,3,4,5,6].map((n)=>`<button class="sport-day ${selectedDate===n?"active":""}" data-day="${n}">
          <strong>${n===0?tr("today"):n===1?tr("tomorrow"):n===2?tr("dayAfter"):niceDate(n)}</strong>
          <small>${niceDate(n)}</small>
        </button>`).join("")}
      </div>
      <div class="sport-meta">${matches.length} ${tr("match")}${lastUpdated?" · "+tr("updated")+": "+new Intl.DateTimeFormat(lang(),{hour:"2-digit",minute:"2-digit"}).format(new Date(lastUpdated)):""}</div>
    </section>
    <section class="sport-list">
      ${groups.length?groups.map(([name,list])=>`
        <div class="sport-league">
          <div class="sport-league-title">🏆 <span>${esc(name)}</span></div>
          ${list.map(m=>`<article class="sport-match">
            <div class="sport-team">${m.home_logo?'<img src="'+esc(m.home_logo)+'" alt="">':"⚽"}<span>${esc(m.home)}</span></div>
            <div class="sport-score">
              <strong>${m.home_score!=null&&m.away_score!=null?esc(m.home_score)+" : "+esc(m.away_score):new Intl.DateTimeFormat(lang(),{hour:"2-digit",minute:"2-digit"}).format(new Date(m.time))}</strong>
              <div class="sport-status ${m.status==="live"?"live":""}">${statusText(m)}</div>
            </div>
            <div class="sport-team away"><span>${esc(m.away)}</span>${m.away_logo?'<img src="'+esc(m.away_logo)+'" alt="">':"⚽"}</div>
          </article>`).join("")}
        </div>`).join(""):`<section class="card sport-empty"><strong>${tr("none")}</strong></section>`}
    </section>
  </div>`;
  document.getElementById("sportRefresh")?.addEventListener("click",()=>load(true));
  root.querySelectorAll("[data-day]").forEach(b=>b.addEventListener("click",()=>{selectedDate=Number(b.dataset.day);load(true);}));
}
async function load(){
  if(loading)return;
  loading=true;render();
  try{
    const res=await fetch(API_BASE+"?date="+dateKey(selectedDate),{cache:"no-store"});
    if(!res.ok)throw new Error("HTTP "+res.status);
    const data=await res.json();
    matches=Array.isArray(data.matches)?data.matches:[];
    lastUpdated=data.updated||new Date().toISOString();
  }catch(e){
    console.warn("football",e);matches=[];
  }
  loading=false;render();
}
function activate(){load();}
function reloadLanguage(){render();}
window.PajazitiSports={activate,refresh:load,reloadLanguage};
