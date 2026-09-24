const NEWS_LANG_KEY="pajaziti-language";
const NEWS_API_ORIGIN="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/diamond-news-refresh";
const COUNTRIES={
  de:{flag:"🇩🇪",nameKey:"germany"},
  xk:{flag:"🇽🇰",nameKey:"kosovo"},
  tr:{flag:"🇹🇷",nameKey:"turkey"}
};
const NT={
  sq:{tab:"Lajme",title:"Lajme",subtitle:"Gjermani · Kosovë · Turqi · përditësohen çdo orë",pick:"Zgjidh vendin",refresh:"Rifresko",loading:"Po ngarkohen lajmet…",empty:"Nuk ka lajme të reja për momentin.",open:"Hap lajmin",ago:"më parë",now:"tani",back:"← Folderat",germany:"Lajme nga Gjermania",kosovo:"Lajme nga Kosova",turkey:"Lajme nga Turqia"},
  de:{tab:"Nachrichten",title:"Nachrichten",subtitle:"Deutschland · Kosovo · Türkei · stündlich aktualisiert",pick:"Land auswählen",refresh:"Aktualisieren",loading:"Nachrichten werden geladen…",empty:"Zurzeit keine neuen Nachrichten.",open:"Artikel öffnen",ago:"vor",now:"jetzt",back:"← Ordner",germany:"Nachrichten aus Deutschland",kosovo:"Nachrichten aus Kosovo",turkey:"Nachrichten aus der Türkei"},
  tr:{tab:"Haberler",title:"Haberler",subtitle:"Almanya · Kosova · Türkiye · her saat güncellenir",pick:"Ülke seç",refresh:"Yenile",loading:"Haberler yükleniyor…",empty:"Şu anda yeni haber yok.",open:"Haberi aç",ago:"önce",now:"şimdi",back:"← Klasörler",germany:"Almanya'dan haberler",kosovo:"Kosova'dan haberler",turkey:"Türkiye'den haberler"},
  en:{tab:"News",title:"News",subtitle:"Germany · Kosovo · Turkey · updated every hour",pick:"Choose a country",refresh:"Refresh",loading:"Loading news…",empty:"No recent news right now.",open:"Open article",ago:"ago",now:"now",back:"← Folders",germany:"News from Germany",kosovo:"News from Kosovo",turkey:"News from Turkey"},
  it:{tab:"Notizie",title:"Notizie",subtitle:"Germania · Kosovo · Turchia · aggiornate ogni ora",pick:"Scegli un paese",refresh:"Aggiorna",loading:"Caricamento notizie…",empty:"Nessuna notizia recente.",open:"Apri articolo",ago:"fa",now:"ora",back:"← Cartelle",germany:"Notizie dalla Germania",kosovo:"Notizie dal Kosovo",turkey:"Notizie dalla Turchia"},
  hr:{tab:"Vijesti",title:"Vijesti",subtitle:"Njemačka · Kosovo · Turska · ažuriranje svaki sat",pick:"Odaberi zemlju",refresh:"Osvježi",loading:"Učitavanje vijesti…",empty:"Trenutačno nema novih vijesti.",open:"Otvori vijest",ago:"prije",now:"sada",back:"← Mape",germany:"Vijesti iz Njemačke",kosovo:"Vijesti s Kosova",turkey:"Vijesti iz Turske"},
  fr:{tab:"Actualités",title:"Actualités",subtitle:"Allemagne · Kosovo · Turquie · mises à jour chaque heure",pick:"Choisir un pays",refresh:"Actualiser",loading:"Chargement des actualités…",empty:"Aucune actualité récente.",open:"Ouvrir l’article",ago:"il y a",now:"maintenant",back:"← Dossiers",germany:"Actualités d'Allemagne",kosovo:"Actualités du Kosovo",turkey:"Actualités de Turquie"},
  ar:{tab:"أخبار",title:"الأخبار",subtitle:"ألمانيا · كوسوفو · تركيا · تحديث كل ساعة",pick:"اختر البلد",refresh:"تحديث",loading:"جارٍ تحميل الأخبار…",empty:"لا توجد أخبار حديثة حالياً.",open:"فتح الخبر",ago:"منذ",now:"الآن",back:"← المجلدات",germany:"أخبار من ألمانيا",kosovo:"أخبار من كوسوفو",turkey:"أخبار من تركيا"}
};

function nl(){const l=localStorage.getItem(NEWS_LANG_KEY)||"sq";return NT[l]?l:"en";}
function nt(k){return NT[nl()]?.[k]??NT.en[k]??k;}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function relativeTime(iso){
  const d=new Date(iso);
  const diff=Math.max(0,Date.now()-d.getTime());
  const mins=Math.floor(diff/60000);
  const lang=nl();
  if(mins<1)return nt("now");
  if(lang==="sq"){
    if(mins<60)return mins+" min "+nt("ago");
    const h=Math.floor(mins/60); if(h<24)return h+" orë "+nt("ago");
    return Math.floor(h/24)+" ditë "+nt("ago");
  }
  if(lang==="de"){
    if(mins<60)return nt("ago")+" "+mins+" Min.";
    const h=Math.floor(mins/60); if(h<24)return nt("ago")+" "+h+" Std.";
    return nt("ago")+" "+Math.floor(h/24)+" T.";
  }
  if(lang==="tr"){
    if(mins<60)return mins+" dk "+nt("ago");
    const h=Math.floor(mins/60); if(h<24)return h+" sa "+nt("ago");
    return Math.floor(h/24)+" gün "+nt("ago");
  }
  if(mins<60)return mins+" min "+nt("ago");
  const h=Math.floor(mins/60); if(h<24)return h+" h "+nt("ago");
  return Math.floor(h/24)+" d "+nt("ago");
}
function newsRoot(){return document.getElementById("newsRoot");}
function countryTitle(code){const c=COUNTRIES[code];return c?c.flag+" "+nt(c.nameKey):"";}
function apiUrl(country){return NEWS_API_ORIGIN+"?country="+encodeURIComponent(country);}

let activeCountry=null;
let refreshTimer=null;
let loading=false;
let lastFetchAt=0;

function renderShell(){
  const root=newsRoot(); if(!root)return;
  root.innerHTML=
    '<section class="card news-head-card">'+
      '<div><h2>📰 <span id="newsTitle">'+esc(nt("title"))+'</span></h2>'+
      '<p id="newsSubtitle" class="muted small">'+esc(nt("subtitle"))+'</p></div>'+
    '</section>'+
    '<section id="newsFolderSection" class="card">'+
      '<h3 style="margin-top:0">'+esc(nt("pick"))+'</h3>'+
      '<div class="radio-folder-grid">'+
        '<button class="radio-folder-card" type="button" data-news-country="de"><span class="radio-folder-flag">🇩🇪</span><strong>'+esc(nt("germany"))+'</strong></button>'+
        '<button class="radio-folder-card" type="button" data-news-country="xk"><span class="radio-folder-flag">🇽🇰</span><strong>'+esc(nt("kosovo"))+'</strong></button>'+
        '<button class="radio-folder-card" type="button" data-news-country="tr"><span class="radio-folder-flag">🇹🇷</span><strong>'+esc(nt("turkey"))+'</strong></button>'+
      '</div>'+
    '</section>'+
    '<section id="newsCountryView" class="hidden">'+
      '<div class="radio-folder-head">'+
        '<button id="newsBackBtn" class="secondary" type="button">'+esc(nt("back"))+'</button>'+
        '<strong id="newsCountryTitle"></strong>'+
      '</div>'+
      '<section class="card news-head-card">'+
        '<div><p class="muted small">'+esc(nt("subtitle"))+'</p></div>'+
        '<button id="newsRefreshBtn" class="secondary" type="button">↻ '+esc(nt("refresh"))+'</button>'+
      '</section>'+
      '<div id="newsStatus" class="message"></div>'+
      '<section id="newsList" class="news-list"></section>'+
    '</section>';

  root.querySelectorAll("[data-news-country]").forEach(btn=>{
    btn.addEventListener("click",()=>openCountry(btn.dataset.newsCountry,true));
  });
  document.getElementById("newsBackBtn")?.addEventListener("click",closeCountry);
  document.getElementById("newsRefreshBtn")?.addEventListener("click",()=>loadNews(true));
}

function renderItems(items){
  const list=document.getElementById("newsList"); if(!list)return;
  if(!items.length){
    list.innerHTML='<section class="card"><p class="muted">'+esc(nt("empty"))+'</p></section>';
    return;
  }
  list.innerHTML=items.map(item=>
    '<article class="card news-item">'+
      '<div class="news-item-top"><span class="news-source">'+esc(item.source||"")+'</span>'+
      '<time datetime="'+esc(item.published_at||"")+'">'+esc(relativeTime(item.published_at))+'</time></div>'+
      '<h3>'+esc(item.title||"")+'</h3>'+
      '<button class="primary news-open-btn" type="button" data-news-url="'+esc(item.url||"")+'">'+esc(nt("open"))+' →</button>'+
    '</article>'
  ).join("");
  list.querySelectorAll("[data-news-url]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const url=btn.dataset.newsUrl;
      if(url)window.open(url,"_blank","noopener");
    });
  });
}

async function loadNews(manual=false){
  if(!activeCountry||loading)return;
  loading=true;
  const status=document.getElementById("newsStatus");
  if(status)status.textContent=nt("loading");
  try{
    const response=await fetch(apiUrl(activeCountry),{cache:"no-store"});
    if(!response.ok)throw new Error("News "+response.status);
    const payload=await response.json();
    renderItems(Array.isArray(payload.items)?payload.items:[]);
    lastFetchAt=Date.now();
    if(status)status.textContent="";
  }catch(error){
    console.warn("News load",error);
    if(status)status.textContent=nt("empty");
    renderItems([]);
  }finally{
    loading=false;
  }
}

function openCountry(country,load=true){
  if(!COUNTRIES[country])country="de";
  activeCountry=country;
  document.getElementById("newsFolderSection")?.classList.add("hidden");
  document.getElementById("newsCountryView")?.classList.remove("hidden");
  const title=document.getElementById("newsCountryTitle");
  if(title)title.textContent=countryTitle(country);
  if(load)loadNews(false);
}

function closeCountry(){
  activeCountry=null;
  document.getElementById("newsCountryView")?.classList.add("hidden");
  document.getElementById("newsFolderSection")?.classList.remove("hidden");
}

function activate(){
  if(!newsRoot()?.children.length)renderShell();
  if(refreshTimer)clearInterval(refreshTimer);
  refreshTimer=setInterval(()=>{
    if(activeCountry)loadNews(false);
  },60*60*1000);
}

function reloadLanguage(){
  const tab=document.getElementById("newsTabLabel");if(tab)tab.textContent=nt("tab");
  const root=newsRoot();
  if(root&&root.children.length){
    const current=activeCountry;
    renderShell();
    if(current)openCountry(current,false);
  }
}

document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible"&&activeCountry&&Date.now()-lastFetchAt>=60*60*1000)loadNews(false);
});

reloadLanguage();
window.DiamondNews={activate,reloadLanguage,refresh:()=>loadNews(true)};
