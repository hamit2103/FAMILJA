import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const sb=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{
  auth:{persistSession:true,autoRefreshToken:true}
});

const NEWS_LANG_KEY="pajaziti-language";
const NT={
  sq:{tab:"Lajme",title:"Lajmet e botës",subtitle:"Përditësohen çdo orë · ruhen 48 orë",refresh:"Rifresko",loading:"Po ngarkohen lajmet…",empty:"Nuk ka lajme të reja për momentin.",open:"Hap lajmin",ago:"më parë",now:"tani"},
  de:{tab:"Nachrichten",title:"Weltnachrichten",subtitle:"Stündlich aktualisiert · 48 Stunden gespeichert",refresh:"Aktualisieren",loading:"Nachrichten werden geladen…",empty:"Zurzeit keine neuen Nachrichten.",open:"Artikel öffnen",ago:"vor",now:"jetzt"},
  tr:{tab:"Haberler",title:"Dünya Haberleri",subtitle:"Her saat güncellenir · 48 saat saklanır",refresh:"Yenile",loading:"Haberler yükleniyor…",empty:"Şu anda yeni haber yok.",open:"Haberi aç",ago:"önce",now:"şimdi"},
  en:{tab:"News",title:"World News",subtitle:"Updated every hour · kept for 48 hours",refresh:"Refresh",loading:"Loading news…",empty:"No recent news right now.",open:"Open article",ago:"ago",now:"now"},
  it:{tab:"Notizie",title:"Notizie dal mondo",subtitle:"Aggiornate ogni ora · conservate 48 ore",refresh:"Aggiorna",loading:"Caricamento notizie…",empty:"Nessuna notizia recente.",open:"Apri articolo",ago:"fa",now:"ora"},
  hr:{tab:"Vijesti",title:"Svjetske vijesti",subtitle:"Ažuriraju se svaki sat · čuvaju se 48 sati",refresh:"Osvježi",loading:"Učitavanje vijesti…",empty:"Trenutačno nema novih vijesti.",open:"Otvori vijest",ago:"prije",now:"sada"},
  fr:{tab:"Actualités",title:"Actualités du monde",subtitle:"Mises à jour chaque heure · conservées 48 heures",refresh:"Actualiser",loading:"Chargement des actualités…",empty:"Aucune actualité récente.",open:"Ouvrir l’article",ago:"il y a",now:"maintenant"},
  ar:{tab:"أخبار",title:"أخبار العالم",subtitle:"تُحدَّث كل ساعة · تُحفظ لمدة 48 ساعة",refresh:"تحديث",loading:"جارٍ تحميل الأخبار…",empty:"لا توجد أخبار حديثة حالياً.",open:"فتح الخبر",ago:"منذ",now:"الآن"}
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
    if(mins<60)return `${mins} min ${nt("ago")}`;
    const h=Math.floor(mins/60); if(h<24)return `${h} orë ${nt("ago")}`;
    return `${Math.floor(h/24)} ditë ${nt("ago")}`;
  }
  if(lang==="de"){
    if(mins<60)return `${nt("ago")} ${mins} Min.`;
    const h=Math.floor(mins/60); if(h<24)return `${nt("ago")} ${h} Std.`;
    return `${nt("ago")} ${Math.floor(h/24)} T.`;
  }
  if(lang==="tr"){
    if(mins<60)return `${mins} dk ${nt("ago")}`;
    const h=Math.floor(mins/60); if(h<24)return `${h} sa ${nt("ago")}`;
    return `${Math.floor(h/24)} gün ${nt("ago")}`;
  }
  if(mins<60)return `${mins} min ${nt("ago")}`;
  const h=Math.floor(mins/60); if(h<24)return `${h} h ${nt("ago")}`;
  return `${Math.floor(h/24)} d ${nt("ago")}`;
}
function newsRoot(){return document.getElementById("newsRoot");}
let channel=null;
let refreshTimer=null;
let loading=false;

function renderShell(){
  const root=newsRoot(); if(!root)return;
  root.innerHTML=`
    <section class="card news-head-card">
      <div>
        <h2>📰 <span id="newsTitle">${esc(nt("title"))}</span></h2>
        <p id="newsSubtitle" class="muted small">${esc(nt("subtitle"))}</p>
      </div>
      <button id="newsRefreshBtn" class="secondary" type="button">↻ ${esc(nt("refresh"))}</button>
    </section>
    <div id="newsStatus" class="message"></div>
    <section id="newsList" class="news-list"></section>
  `;
  document.getElementById("newsRefreshBtn")?.addEventListener("click",()=>loadNews(true));
}
function renderItems(items){
  const list=document.getElementById("newsList"); if(!list)return;
  if(!items.length){
    list.innerHTML=`<section class="card"><p class="muted">${esc(nt("empty"))}</p></section>`;
    return;
  }
  list.innerHTML=items.map((item,index)=>`
    <article class="card news-item">
      <div class="news-item-top">
        <span class="news-source">${esc(item.source||"")}</span>
        <time datetime="${esc(item.published_at)}">${esc(relativeTime(item.published_at))}</time>
      </div>
      <h3>${esc(item.title||"")}</h3>
      <button class="primary news-open-btn" type="button" data-news-url="${esc(item.url||"")}">${esc(nt("open"))} →</button>
    </article>
  `).join("");
  list.querySelectorAll("[data-news-url]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const url=btn.dataset.newsUrl;
      if(url) window.open(url,"_blank","noopener");
    });
  });
}
async function loadNews(manual=false){
  if(loading)return;
  loading=true;
  const status=document.getElementById("newsStatus");
  if(status && manual)status.textContent=nt("loading");
  try{
    const cutoff=new Date(Date.now()-48*60*60*1000).toISOString();
    const {data,error}=await sb
      .from("world_news")
      .select("id,title,source,url,published_at")
      .gte("published_at",cutoff)
      .order("published_at",{ascending:false})
      .limit(250);
    if(error)throw error;
    renderItems(data||[]);
    if(status)status.textContent="";
  }catch(error){
    console.warn("News load",error);
    if(status)status.textContent=nt("empty");
  }finally{
    loading=false;
  }
}
function ensureRealtime(){
  if(channel)return;
  channel=sb.channel("diamond-world-news")
    .on("postgres_changes",{event:"*",schema:"public",table:"world_news"},()=>loadNews(false))
    .subscribe();
}
function activate(){
  if(!newsRoot()?.children.length)renderShell();
  reloadLanguage();
  loadNews(false);
  ensureRealtime();
  if(refreshTimer)clearInterval(refreshTimer);
  refreshTimer=setInterval(()=>loadNews(false),5*60*1000);
}
function reloadLanguage(){
  const tab=document.getElementById("newsTabLabel");if(tab)tab.textContent=nt("tab");
  const title=document.getElementById("newsTitle");if(title)title.textContent=nt("title");
  const subtitle=document.getElementById("newsSubtitle");if(subtitle)subtitle.textContent=nt("subtitle");
  const btn=document.getElementById("newsRefreshBtn");if(btn)btn.textContent="↻ "+nt("refresh");
  if(document.getElementById("newsList"))loadNews(false);
}
reloadLanguage();
window.DiamondNews={activate,reloadLanguage,refresh:()=>loadNews(true)};
