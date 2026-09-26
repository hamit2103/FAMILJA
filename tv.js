import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

const root = document.getElementById("tvRoot");
const tabLabel = document.getElementById("tvTabLabel");
const LANG_KEY = "pajaziti-language";
const TV_URL_KEY = "pajaziti-tv-url";
const TV_NAME_KEY = "pajaziti-tv-last-name";
const TV_LOCAL_PLAYLIST_KEY = "pajaziti-tv-local-playlist";
const TV_PRIVATE_SERVER_ID = "local-private-server";
const ADMIN_EMAIL = "admin@familja.local";

const FREE_TV_PLAYLISTS = [
  { title:"🇦🇱 Shqipëri", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/al.m3u" },
  { title:"🇽🇰 Kosovë", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/xk.m3u" },
  { title:"🇩🇪 Gjermani", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/de.m3u" },
  { title:"🇹🇷 Turqi", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/tr.m3u" }
];

const BUILTIN_TURKISH_SERIES = [
  {
    name:"Vatanım Sensin",
    countryGroup:"Turke",
    sourceGroup:"Kanal D · Zyrtare · FREE",
    mediaType:"series",
    officialPage:true,
    url:"https://www.kanald.com.tr/vatanim-sensin/bolumler",
    logo:""
  }
];

const BUILTIN_FREE_SERVERS = [
  {
    id:"free-shqip",
    title:"🇦🇱🇽🇰 Shqip FREE",
    countryGroup:"Shqiptare",
    playlistUrls:[
      "https://iptv-org.github.io/iptv/countries/al.m3u",
      "https://iptv-org.github.io/iptv/countries/xk.m3u"
    ]
  },
  {
    id:"free-germany",
    title:"🇩🇪 Gjermani FREE",
    countryGroup:"Gjermane",
    playlistUrls:["https://iptv-org.github.io/iptv/countries/de.m3u"]
  },
  {
    id:"free-turkiye",
    title:"🇹🇷 Turqi FREE",
    countryGroup:"Turke",
    playlistUrls:["https://iptv-org.github.io/iptv/countries/tr.m3u"]
  },
  {
    id:"free-exyu",
    title:"🌍 EX-YU FREE",
    countryGroup:"EX-YU",
    playlistUrls:[
      "https://iptv-org.github.io/iptv/countries/ba.m3u",
      "https://iptv-org.github.io/iptv/countries/hr.m3u",
      "https://iptv-org.github.io/iptv/countries/me.m3u",
      "https://iptv-org.github.io/iptv/countries/mk.m3u",
      "https://iptv-org.github.io/iptv/countries/rs.m3u",
      "https://iptv-org.github.io/iptv/countries/si.m3u"
    ]
  }
];

const TXT = {
  sq:{
    tv:"TV", brand:"Shtime TV", live:"Live TV", movies:"Filmat", series:"Serialet", replay:"Përsëritje",
    sports:"Sports guide", server:"Change Server", settings:"Cilësimet",
    title:"📺 TV / M3U Player", url:"M3U ose URL", urlPlaceholder:"Ngjit M3U, M3U8 ose URL direkte të videos",
    loadUrl:"Hape URL", file:"Ngarko skedar M3U", channels:"Kanale", search:"Kërko kanal",
    noChannels:"Nuk ka kanale në këtë kategori.", direct:"Stream direkt", loading:"Po ngarkohet…",
    cors:"Kjo URL nuk lejon lexim direkt nga aplikacioni (CORS). Provo skedarin M3U ose një URL tjetër.",
    invalid:"URL ose lista nuk u lexua.", stop:"Ndalo", shared:"Lista e përbashkët",
    local:"Lista ime në këtë telefon", publish:"Publiko për të gjithë", published:"U publikua për të gjithë.",
    adminOnly:"Vetëm administratori mund ta publikojë për të gjithë.", noShared:"Nuk ka ende listë të përbashkët.",
    saveLocal:"Ruaje vetëm në këtë telefon", savedLocal:"U ruajt vetëm në këtë telefon.",
    useShared:"Hap listën e përbashkët", useLocal:"Hap listën time", back:"Kthehu te menuja TV",
    replayInfo:"Shfaqen vetëm kanalet që lista M3U i shënon me catch-up/replay.",
    source:"Burimi", allGroups:"Të gjitha grupet", playerLoading:"Po provoj stream-in…", playerReady:"Stream-i është gati.", playerNetworkError:"Stream-i nuk po përgjigjet ose është bllokuar nga serveri.", playerMediaError:"Player-i pati problem me videon. Po provoj përsëri…", playerFailed:"Ky stream nuk po hapet në këtë pajisje.", retry:"Provo përsëri", fullscreen:"Ekran i plotë", exitFullscreen:"Dil nga ekrani i plotë"
  },
  de:{
    tv:"TV", brand:"Shtime TV", live:"Live TV", movies:"Filme", series:"Serien", replay:"Replay",
    sports:"Sportguide", server:"Server wechseln", settings:"Einstellungen",
    title:"📺 TV / M3U Player", url:"M3U oder URL", urlPlaceholder:"M3U-, M3U8- oder direkte Video-URL einfügen",
    loadUrl:"URL öffnen", file:"M3U-Datei laden", channels:"Sender", search:"Sender suchen",
    noChannels:"Keine Sender in dieser Kategorie.", direct:"Direkter Stream", loading:"Wird geladen…",
    cors:"Diese URL erlaubt keinen direkten Zugriff aus der App (CORS). Verwende die M3U-Datei oder eine andere URL.",
    invalid:"URL oder Liste konnte nicht gelesen werden.", stop:"Stoppen", shared:"Gemeinsame Liste",
    local:"Meine Liste auf diesem Gerät", publish:"Für alle veröffentlichen", published:"Für alle veröffentlicht.",
    adminOnly:"Nur der Administrator kann für alle veröffentlichen.", noShared:"Noch keine gemeinsame Liste.",
    saveLocal:"Nur auf diesem Gerät speichern", savedLocal:"Nur auf diesem Gerät gespeichert.",
    useShared:"Gemeinsame Liste öffnen", useLocal:"Meine Liste öffnen", back:"Zurück zum TV-Menü",
    replayInfo:"Es werden nur Sender angezeigt, die in der M3U-Liste Catch-up/Replay unterstützen.",
    source:"Quelle", allGroups:"Alle Gruppen", playerLoading:"Stream wird getestet…", playerReady:"Stream ist bereit.", playerNetworkError:"Der Stream antwortet nicht oder wird vom Server blockiert.", playerMediaError:"Der Player hat ein Medienproblem. Erneuter Versuch…", playerFailed:"Dieser Stream kann auf diesem Gerät nicht geöffnet werden.", retry:"Erneut versuchen", fullscreen:"Vollbild", exitFullscreen:"Vollbild beenden"
  },
  tr:{
    tv:"TV", brand:"Shtime TV", live:"Canlı TV", movies:"Filmler", series:"Diziler", replay:"Tekrar",
    sports:"Spor rehberi", server:"Sunucu değiştir", settings:"Ayarlar",
    title:"📺 TV / M3U Player", url:"M3U veya URL", urlPlaceholder:"M3U, M3U8 veya doğrudan video URL'si yapıştır",
    loadUrl:"URL'yi aç", file:"M3U dosyası yükle", channels:"Kanallar", search:"Kanal ara",
    noChannels:"Bu kategoride kanal yok.", direct:"Doğrudan yayın", loading:"Yükleniyor…",
    cors:"Bu URL uygulamadan doğrudan erişime izin vermiyor (CORS). M3U dosyası veya başka URL dene.",
    invalid:"URL veya liste okunamadı.", stop:"Durdur", shared:"Ortak liste",
    local:"Bu telefondaki listem", publish:"Herkes için yayınla", published:"Herkes için yayınlandı.",
    adminOnly:"Herkes için yalnızca yönetici yayınlayabilir.", noShared:"Henüz ortak liste yok.",
    saveLocal:"Yalnızca bu telefona kaydet", savedLocal:"Yalnızca bu telefona kaydedildi.",
    useShared:"Ortak listeyi aç", useLocal:"Listemi aç", back:"TV menüsüne dön",
    replayInfo:"Yalnızca M3U listesinde catch-up/replay olarak işaretlenen kanallar gösterilir.",
    source:"Kaynak", allGroups:"Tüm gruplar", playerLoading:"Yayın deneniyor…", playerReady:"Yayın hazır.", playerNetworkError:"Yayın yanıt vermiyor veya sunucu tarafından engelleniyor.", playerMediaError:"Oynatıcı video hatası verdi. Tekrar deneniyor…", playerFailed:"Bu yayın bu cihazda açılamıyor.", retry:"Tekrar dene", fullscreen:"Tam ekran", exitFullscreen:"Tam ekrandan çık"
  },
  en:{tv:"TV",brand:"Shtime TV",live:"Live TV",movies:"Movies",series:"Series",replay:"Replay",sports:"Sports guide",server:"Change server",settings:"Settings",title:"📺 TV / M3U Player",url:"M3U or URL",urlPlaceholder:"Paste M3U, M3U8 or direct video URL",loadUrl:"Open URL",file:"Load M3U file",channels:"Channels",search:"Search channel",noChannels:"No channels in this category.",direct:"Direct stream",loading:"Loading…",cors:"This URL does not allow direct access from the app (CORS). Try an M3U file or another URL.",invalid:"URL or list could not be read.",stop:"Stop",shared:"Shared list",local:"My list on this device",publish:"Publish for everyone",published:"Published for everyone.",adminOnly:"Only the administrator can publish for everyone.",noShared:"No shared list yet.",saveLocal:"Save only on this device",savedLocal:"Saved only on this device.",useShared:"Open shared list",useLocal:"Open my list",back:"Back to TV menu",replayInfo:"Only channels marked with catch-up/replay in the M3U list are shown.",source:"Source",allGroups:"All groups",playerLoading:"Testing stream…",playerReady:"Stream is ready.",playerNetworkError:"The stream is not responding or is blocked by the server.",playerMediaError:"The player had a video problem. Retrying…",playerFailed:"This stream cannot be opened on this device.",retry:"Try again",fullscreen:"Fullscreen",exitFullscreen:"Exit fullscreen"},
  it:{tv:"TV",brand:"Shtime TV",live:"TV in diretta",movies:"Film",series:"Serie",replay:"Replay",sports:"Guida sport",server:"Cambia server",settings:"Impostazioni",title:"📺 TV / Player M3U",url:"M3U o URL",urlPlaceholder:"Incolla M3U, M3U8 o URL video diretto",loadUrl:"Apri URL",file:"Carica file M3U",channels:"Canali",search:"Cerca canale",noChannels:"Nessun canale in questa categoria.",direct:"Stream diretto",loading:"Caricamento…",cors:"Questo URL non consente accesso diretto dall'app (CORS). Prova un file M3U o un altro URL.",invalid:"URL o lista non leggibile.",stop:"Ferma",shared:"Lista condivisa",local:"La mia lista su questo dispositivo",publish:"Pubblica per tutti",published:"Pubblicato per tutti.",adminOnly:"Solo l'amministratore può pubblicare per tutti.",noShared:"Nessuna lista condivisa.",saveLocal:"Salva solo su questo dispositivo",savedLocal:"Salvato solo su questo dispositivo.",useShared:"Apri lista condivisa",useLocal:"Apri la mia lista",back:"Torna al menu TV",replayInfo:"Vengono mostrati solo i canali con catch-up/replay nella lista M3U.",source:"Fonte",allGroups:"Tutti i gruppi",playerLoading:"Prova dello stream…",playerReady:"Stream pronto.",playerNetworkError:"Lo stream non risponde o è bloccato dal server.",playerMediaError:"Problema video. Nuovo tentativo…",playerFailed:"Questo stream non si apre su questo dispositivo.",retry:"Riprova",fullscreen:"Schermo intero",exitFullscreen:"Esci dallo schermo intero"},
  hr:{tv:"TV",brand:"Shtime TV",live:"TV uživo",movies:"Filmovi",series:"Serije",replay:"Ponovno",sports:"Sportski vodič",server:"Promijeni server",settings:"Postavke",title:"📺 TV / M3U Player",url:"M3U ili URL",urlPlaceholder:"Zalijepi M3U, M3U8 ili izravni video URL",loadUrl:"Otvori URL",file:"Učitaj M3U datoteku",channels:"Kanali",search:"Traži kanal",noChannels:"Nema kanala u ovoj kategoriji.",direct:"Izravni stream",loading:"Učitavanje…",cors:"Ovaj URL ne dopušta izravan pristup iz aplikacije (CORS). Pokušaj M3U datoteku ili drugi URL.",invalid:"URL ili popis nije moguće pročitati.",stop:"Zaustavi",shared:"Zajednički popis",local:"Moj popis na ovom uređaju",publish:"Objavi svima",published:"Objavljeno svima.",adminOnly:"Samo administrator može objaviti svima.",noShared:"Još nema zajedničkog popisa.",saveLocal:"Spremi samo na ovom uređaju",savedLocal:"Spremljeno samo na ovom uređaju.",useShared:"Otvori zajednički popis",useLocal:"Otvori moj popis",back:"Natrag na TV izbornik",replayInfo:"Prikazuju se samo kanali označeni catch-up/replay u M3U popisu.",source:"Izvor",allGroups:"Sve grupe",playerLoading:"Testiranje streama…",playerReady:"Stream je spreman.",playerNetworkError:"Stream ne odgovara ili ga server blokira.",playerMediaError:"Player ima problem s videom. Pokušavam ponovno…",playerFailed:"Ovaj stream se ne može otvoriti na ovom uređaju.",retry:"Pokušaj ponovno",fullscreen:"Cijeli zaslon",exitFullscreen:"Izađi iz cijelog zaslona"},
  ar:{tv:"TV",brand:"Shtime TV",live:"بث مباشر",movies:"أفلام",series:"مسلسلات",replay:"إعادة",sports:"دليل الرياضة",server:"تغيير الخادم",settings:"الإعدادات",title:"📺 TV / مشغل M3U",url:"M3U أو URL",urlPlaceholder:"الصق M3U أو M3U8 أو رابط فيديو مباشر",loadUrl:"فتح الرابط",file:"تحميل ملف M3U",channels:"القنوات",search:"بحث عن قناة",noChannels:"لا توجد قنوات في هذه الفئة.",direct:"بث مباشر",loading:"جارٍ التحميل…",cors:"هذا الرابط لا يسمح بالوصول المباشر من التطبيق (CORS). جرّب ملف M3U أو رابطًا آخر.",invalid:"تعذر قراءة الرابط أو القائمة.",stop:"إيقاف",shared:"القائمة المشتركة",local:"قائمتي على هذا الجهاز",publish:"نشر للجميع",published:"تم النشر للجميع.",adminOnly:"المشرف فقط يمكنه النشر للجميع.",noShared:"لا توجد قائمة مشتركة بعد.",saveLocal:"حفظ على هذا الجهاز فقط",savedLocal:"تم الحفظ على هذا الجهاز فقط.",useShared:"فتح القائمة المشتركة",useLocal:"فتح قائمتي",back:"العودة لقائمة TV",replayInfo:"تظهر فقط القنوات المعلّمة catch-up/replay في قائمة M3U.",source:"المصدر",allGroups:"كل المجموعات",playerLoading:"جارٍ اختبار البث…",playerReady:"البث جاهز.",playerNetworkError:"البث لا يستجيب أو محظور من الخادم.",playerMediaError:"حدثت مشكلة في الفيديو. إعادة المحاولة…",playerFailed:"لا يمكن فتح هذا البث على هذا الجهاز.",retry:"حاول مرة أخرى",fullscreen:"ملء الشاشة",exitFullscreen:"الخروج من ملء الشاشة"},
  fr:{tv:"TV",brand:"Shtime TV",live:"TV en direct",movies:"Films",series:"Séries",replay:"Replay",sports:"Guide sport",server:"Changer de serveur",settings:"Paramètres",title:"📺 TV / Lecteur M3U",url:"M3U ou URL",urlPlaceholder:"Collez M3U, M3U8 ou une URL vidéo directe",loadUrl:"Ouvrir URL",file:"Charger fichier M3U",channels:"Chaînes",search:"Rechercher une chaîne",noChannels:"Aucune chaîne dans cette catégorie.",direct:"Flux direct",loading:"Chargement…",cors:"Cette URL n'autorise pas l'accès direct depuis l'application (CORS). Essayez un fichier M3U ou une autre URL.",invalid:"Impossible de lire l'URL ou la liste.",stop:"Arrêter",shared:"Liste partagée",local:"Ma liste sur cet appareil",publish:"Publier pour tous",published:"Publié pour tous.",adminOnly:"Seul l'administrateur peut publier pour tous.",noShared:"Aucune liste partagée pour l'instant.",saveLocal:"Enregistrer uniquement sur cet appareil",savedLocal:"Enregistré uniquement sur cet appareil.",useShared:"Ouvrir la liste partagée",useLocal:"Ouvrir ma liste",back:"Retour au menu TV",replayInfo:"Seules les chaînes marquées catch-up/replay dans la liste M3U sont affichées.",source:"Source",allGroups:"Tous les groupes",playerLoading:"Test du flux…",playerReady:"Flux prêt.",playerNetworkError:"Le flux ne répond pas ou est bloqué par le serveur.",playerMediaError:"Le lecteur a rencontré un problème vidéo. Nouvel essai…",playerFailed:"Ce flux ne peut pas être ouvert sur cet appareil.",retry:"Réessayer",fullscreen:"Plein écran",exitFullscreen:"Quitter le plein écran"}
};

function lang(){ const l=localStorage.getItem(LANG_KEY)||"sq"; return TXT[l]?l:"sq"; }
function tr(k){ return TXT[lang()][k] || TXT.sq[k] || k; }
function esc(v=""){ return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }

let channels=[];
let currentFilter="";
let currentMode="home";
let currentGroup="";
let hls=null;
let currentUser=null;
let sharedRecord=null;
let pendingSource=null;
let lastTriedChannel=null;
let hlsRecoveryCount=0;
const TV_CATALOG_KIND="angel-tv-v2";
const TV_ACTIVE_SERVER_KEY="angel-tv-active-server";
let serverCatalog=[];
let activeServerId=localStorage.getItem(TV_ACTIVE_SERVER_KEY)||"";

async function refreshUser(){
  const {data}=await supabase.auth.getUser();
  currentUser=data?.user||null;
  return currentUser;
}
function isAdmin(){ return currentUser?.email===ADMIN_EMAIL; }

function saveLocalSource(source){
  localStorage.setItem(TV_LOCAL_PLAYLIST_KEY, JSON.stringify(source));
}
function getLocalSource(){
  try{return JSON.parse(localStorage.getItem(TV_LOCAL_PLAYLIST_KEY)||"null");}
  catch(_){return null;}
}

async function loadSharedRecord(){
  const {data,error}=await supabase
    .from("tv_shared_playlist")
    .select("id,title,source_type,source_value,updated_at")
    .eq("id",1)
    .maybeSingle();
  if(error){ console.warn("shared TV load",error); return null; }
  sharedRecord=data||null;
  return sharedRecord;
}

function attr(line,name){
  const m=line.match(new RegExp(name+'="([^"]*)"','i'));
  return m?.[1]||"";
}

function parseM3U(text){
  const lines=String(text||"").replace(/\r/g,"").split("\n");
  const out=[];
  let meta=null;

  for(const raw of lines){
    const line=raw.trim();
    if(!line) continue;

    if(line.startsWith("#EXTINF")){
      const comma=line.indexOf(",");
      const name=comma>=0?line.slice(comma+1).trim():"Kanal";
      meta={
        name,
        logo:attr(line,"tvg-logo"),
        group:attr(line,"group-title"),
        tvgId:attr(line,"tvg-id"),
        catchup:attr(line,"catchup") || attr(line,"catchup-type"),
        catchupSource:attr(line,"catchup-source"),
        catchupDays:attr(line,"catchup-days")
      };
    }else if(line.startsWith("#EXTGRP:")){
      if(meta && !meta.group) meta.group=line.slice(8).trim();
    }else if(!line.startsWith("#")){
      out.push({
        name:meta?.name || line,
        logo:meta?.logo || "",
        group:meta?.group || "",
        tvgId:meta?.tvgId || "",
        catchup:meta?.catchup || "",
        catchupSource:meta?.catchupSource || "",
        catchupDays:meta?.catchupDays || "",
        url:line
      });
      meta=null;
    }
  }
  return out;
}

function isLikelyPlaylistUrl(url){
  const clean=url.split("?")[0].toLowerCase();
  return clean.endsWith(".m3u") || url.toLowerCase().includes("type=m3u");
}

async function sourceToChannels(source){
  if(!source) return [];
  if(source.source_type==="m3u") return parseM3U(source.source_value);

  const url=source.source_value;
  if(!url) return [];
  const clean=url.split("?")[0].toLowerCase();
  if(clean.endsWith(".m3u8")) return [{name:tr("direct"),logo:"",group:"",url,catchup:"",mime:"application/vnd.apple.mpegurl"}];
  if(!isLikelyPlaylistUrl(url)) return [{name:tr("direct"),logo:"",group:"",url,catchup:""}];

  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    const text=await res.text();
    const parsed=parseM3U(text);
    return parsed.length ? parsed : [{name:tr("direct"),logo:"",group:"",url,catchup:""}];
  }catch(_){
    return [{name:tr("direct"),logo:"",group:"",url,catchup:""}];
  }
}

async function useSource(source){
  pendingSource=source;
  channels=await sourceToChannels(source);
  currentMode="home";
  currentFilter="";
  currentGroup="";
  render();
}

function m3uAttr(value=""){
  return String(value||"").replace(/"/g,"'");
}

function channelsToM3U(list=[]){
  const lines=["#EXTM3U"];
  for(const ch of list){
    if(!ch?.url) continue;
    const attrs=[
      ch.tvgId ? `tvg-id="${m3uAttr(ch.tvgId)}"` : "",
      ch.logo ? `tvg-logo="${m3uAttr(ch.logo)}"` : "",
      ch.group ? `group-title="${m3uAttr(ch.group)}"` : "",
      ch.catchup ? `catchup="${m3uAttr(ch.catchup)}"` : "",
      ch.catchupSource ? `catchup-source="${m3uAttr(ch.catchupSource)}"` : "",
      ch.catchupDays ? `catchup-days="${m3uAttr(ch.catchupDays)}"` : ""
    ].filter(Boolean).join(" ");
    const name=String(ch.name||tr("direct")).replace(/[\r\n]+/g," ").trim();
    lines.push(`#EXTINF:-1${attrs?" "+attrs:""},${name}`);
    lines.push(String(ch.url).trim());
  }
  return lines.join("\n");
}

function mergeChannels(existing=[],incoming=[]){
  const byUrl=new Map();
  for(const ch of [...existing,...incoming]){
    const url=String(ch?.url||"").trim();
    if(!url) continue;
    const prev=byUrl.get(url)||{};
    byUrl.set(url,{...prev,...ch,url});
  }
  return [...byUrl.values()];
}

async function publishPendingForAll(){
  const status=document.getElementById("tvStatus");
  if(!isAdmin()){
    if(status) status.textContent=tr("adminOnly");
    return;
  }
  if(!pendingSource){
    const local=getLocalSource();
    if(local) pendingSource=local;
  }
  if(!pendingSource){
    if(status) status.textContent=tr("invalid");
    return;
  }

  if(status) status.textContent=tr("loading");

  const existingChannels=sharedRecord ? await sourceToChannels(sharedRecord) : [];
  const incomingChannels=await sourceToChannels(pendingSource);
  const mergedChannels=mergeChannels(existingChannels,incomingChannels);

  if(!mergedChannels.length){
    if(status) status.textContent=tr("invalid");
    return;
  }

  const payload={
    id:1,
    title:"Shtime TV",
    source_type:"m3u",
    source_value:channelsToM3U(mergedChannels),
    updated_at:new Date().toISOString(),
    updated_by:currentUser?.id||null
  };

  const {error}=await supabase.from("tv_shared_playlist").upsert(payload,{onConflict:"id"});
  if(error){
    if(status) status.textContent=error.message;
    return;
  }

  sharedRecord=payload;
  pendingSource=payload;
  channels=mergedChannels;
  currentMode="home";
  currentFilter="";
  currentGroup="";
  render();
  const nextStatus=document.getElementById("tvStatus");
  if(nextStatus) nextStatus.textContent=tr("published")+" "+mergedChannels.length+" "+tr("channels")+".";
}

function renderSourceCards(){
  const wrap=document.getElementById("tvSources");
  if(!wrap) return;
  const local=getLocalSource();
  const freeCards=FREE_TV_PLAYLISTS.map((source,index)=>`
    <div class="tv-source-card tv-free-source">
      <div>
        <strong>${esc(source.title)}</strong>
        <div class="muted small">Free / publik</div>
      </div>
      <button class="secondary" type="button" data-free-tv="${index}">Hape</button>
    </div>`).join("");

  wrap.innerHTML=`
    <div class="tv-source-card">
      <div><strong>🌐 ${tr("shared")}</strong><div class="muted small">${sharedRecord ? new Date(sharedRecord.updated_at).toLocaleString() : tr("noShared")}</div></div>
      <button id="tvUseShared" class="secondary" type="button" ${sharedRecord?"":"disabled"}>${tr("useShared")}</button>
    </div>
    <div class="tv-source-card">
      <div><strong>📱 ${tr("local")}</strong><div class="muted small">${local ? "✓" : "—"}</div></div>
      <button id="tvUseLocal" class="secondary" type="button" ${local?"":"disabled"}>${tr("useLocal")}</button>
    </div>
    <div class="tv-free-source-title"><strong>🌍 Kanale free sipas shtetit</strong></div>
    ${freeCards}`;

  document.getElementById("tvUseShared")?.addEventListener("click",()=>useSource(sharedRecord));
  document.getElementById("tvUseLocal")?.addEventListener("click",()=>useSource(local));
  wrap.querySelectorAll("[data-free-tv]").forEach((button)=>{
    button.addEventListener("click",()=>{
      const source=FREE_TV_PLAYLISTS[Number(button.dataset.freeTv)];
      if(source) useSource(source);
    });
  });
}


function makeServerId(){
  return "srv_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8);
}

function normalizeCountryGroup(value=""){
  const v=String(value||"").trim();
  return v || "Tjera";
}

function catalogChannel(ch,countryGroup){
  return {
    name:String(ch?.name||tr("direct")),
    logo:String(ch?.logo||""),
    url:String(ch?.url||""),
    countryGroup:normalizeCountryGroup(countryGroup),
    sourceGroup:String(ch?.group||ch?.sourceGroup||""),
    mediaType:classifyChannel(ch),
    catchup:String(ch?.catchup||""),
    catchupSource:String(ch?.catchupSource||""),
    catchupDays:String(ch?.catchupDays||"")
  };
}

function appendBuiltInFreeServers(){
  const known=new Set(serverCatalog.map(s=>s.id));
  for(const def of BUILTIN_FREE_SERVERS){
    if(known.has(def.id)) continue;
    serverCatalog.push({
      id:def.id,
      title:def.title,
      countryGroup:def.countryGroup,
      playlistUrls:[...def.playlistUrls],
      builtIn:true,
      channels:[]
    });
  }
}

async function loadBuiltInServer(server){
  if(!server?.builtIn || server.channels?.length) return server;
  server.loading=true;
  try{
    const batches=await Promise.all((server.playlistUrls||[]).map(async url=>{
      try{
        const res=await fetch(url,{cache:"no-store"});
        if(!res.ok) return [];
        const text=await res.text();
        return parseM3U(text).map(ch=>catalogChannel(ch,server.countryGroup));
      }catch(_){
        return [];
      }
    }));
    server.channels=mergeChannels([],batches.flat());
  }finally{
    server.loading=false;
  }
  return server;
}

function activeServer(){
  return serverCatalog.find(s=>s.id===activeServerId)||serverCatalog[0]||null;
}

function syncActiveChannels(){
  const server=activeServer();
  if(server){
    activeServerId=server.id;
    localStorage.setItem(TV_ACTIVE_SERVER_KEY,server.id);
    channels=(server.channels||[]).map(ch=>({...ch}));
  }else{
    activeServerId="";
    localStorage.removeItem(TV_ACTIVE_SERVER_KEY);
    channels=[];
  }
}

async function loadCatalog(){
  serverCatalog=[];
  let importedLegacy=false;

  if(sharedRecord){
    try{
      const parsed=JSON.parse(sharedRecord.source_value||"");
      if(parsed?.kind===TV_CATALOG_KIND && Array.isArray(parsed.servers)){
        serverCatalog=parsed.servers
          .filter(s=>s && s.id && Array.isArray(s.channels))
          .map(s=>({
            id:String(s.id),
            title:String(s.title||"Server"),
            countryGroup:normalizeCountryGroup(s.countryGroup),
            channels:s.channels.map(ch=>({
              ...ch,
              countryGroup:normalizeCountryGroup(ch.countryGroup||s.countryGroup),
              sourceGroup:String(ch.sourceGroup||ch.group||""),
              mediaType:["live","movies","series","replay"].includes(ch.mediaType)?ch.mediaType:classifyChannel(ch)
            }))
          }));
      }
    }catch(_){}

    if(!serverCatalog.length){
      const legacy=await sourceToChannels(sharedRecord);
      if(legacy.length){
        serverCatalog=[{
          id:makeServerId(),
          title:sharedRecord.title||"Lista kryesore",
          countryGroup:"Tjera",
          channels:legacy.map(ch=>catalogChannel(ch,"Tjera"))
        }];
        importedLegacy=true;
      }
    }
  }

  const privateSource=getLocalSource();
  if(privateSource){
    try{
      const privateChannels=await sourceToChannels(privateSource);
      serverCatalog.unshift({
        id:TV_PRIVATE_SERVER_ID,
        title:"📱 Lista ime private",
        countryGroup:"Private",
        localOnly:true,
        channels:privateChannels.map(ch=>catalogChannel(ch,"Tjera"))
      });
    }catch(_){}
  }

  appendBuiltInFreeServers();
  let selected=activeServer();
  if(selected?.builtIn) await loadBuiltInServer(selected);
  syncActiveChannels();

  if(importedLegacy && isAdmin()) await persistCatalog();
}

async function persistCatalog(){
  if(!isAdmin()) return false;
  const payload={
    id:1,
    title:"ANGEL TV",
    source_type:"m3u",
    source_value:JSON.stringify({
      kind:TV_CATALOG_KIND,
      updatedAt:new Date().toISOString(),
      servers:serverCatalog
        .filter(server=>!server.builtIn && !server.localOnly)
        .map(({builtIn,playlistUrls,loading,...server})=>server)
    }),
    updated_at:new Date().toISOString(),
    updated_by:currentUser?.id||null
  };
  const {error}=await supabase.from("tv_shared_playlist").upsert(payload,{onConflict:"id"});
  if(error){
    console.warn("TV catalog save",error);
    const status=document.getElementById("tvServerStatus");
    if(status) status.textContent=error.message;
    return false;
  }
  sharedRecord=payload;
  return true;
}

async function addM3UServerFromText(text,title,countryGroup){
  const parsed=parseM3U(text);
  if(!parsed.length) throw new Error(tr("invalid"));
  const server={
    id:makeServerId(),
    title:String(title||"Server "+(serverCatalog.length+1)).trim(),
    countryGroup:normalizeCountryGroup(countryGroup),
    channels:parsed.map(ch=>catalogChannel(ch,countryGroup))
  };
  serverCatalog.push(server);
  activeServerId=server.id;
  syncActiveChannels();
  await persistCatalog();
  return server;
}

async function savePrivateM3U(){
  const status=document.getElementById("tvPrivateM3UStatus");
  const input=document.getElementById("tvPrivateM3UUrl");
  const url=(input?.value||"").trim();
  if(!url){
    if(status) status.textContent="Shkruaj linkun M3U.";
    return;
  }

  if(status) status.textContent=tr("loading");
  try{
    const source={source_type:"url",source_value:url};
    // Device-local only: no Supabase/database write.
    saveLocalSource(source);
    const privateChannels=await sourceToChannels(source);

    serverCatalog=serverCatalog.filter(s=>s.id!==TV_PRIVATE_SERVER_ID);
    serverCatalog.unshift({
      id:TV_PRIVATE_SERVER_ID,
      title:"📱 Lista ime private",
      countryGroup:"Private",
      localOnly:true,
      channels:privateChannels.map(ch=>catalogChannel(ch,"Tjera"))
    });

    activeServerId=TV_PRIVATE_SERVER_ID;
    localStorage.setItem(TV_ACTIVE_SERVER_KEY,activeServerId);
    syncActiveChannels();
    currentMode="home";
    currentFilter="";
    currentGroup="";
    render();
  }catch(error){
    console.warn("Private M3U load",error);
    if(status) status.textContent="Lista private nuk u lexua.";
  }
}

function deletePrivateM3U(){
  localStorage.removeItem(TV_LOCAL_PLAYLIST_KEY);
  if(activeServerId===TV_PRIVATE_SERVER_ID){
    activeServerId="";
    localStorage.removeItem(TV_ACTIVE_SERVER_KEY);
  }
  serverCatalog=serverCatalog.filter(s=>s.id!==TV_PRIVATE_SERVER_ID);
  syncActiveChannels();
  currentMode="servers";
  render();
}

async function adminAddM3U(){
  if(!isAdmin()) return;
  const title=(document.getElementById("tvServerTitle")?.value||"").trim()||("Server "+(serverCatalog.length+1));
  const country=normalizeCountryGroup(document.getElementById("tvServerCountry")?.value||"Tjera");
  const url=(document.getElementById("tvServerUrl")?.value||"").trim();
  const status=document.getElementById("tvServerStatus");
  if(!url){ if(status) status.textContent="Shkruaj linkun M3U."; return; }
  if(status) status.textContent=tr("loading");
  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    const text=await res.text();
    const server=await addM3UServerFromText(text,title,country);
    currentMode="home";
    render();
    const next=document.getElementById("tvServerStatus");
    if(next) next.textContent="U shtua "+server.channels.length+" kanale.";
  }catch(error){
    console.warn(error);
    if(status) status.textContent="Lista M3U nuk u lexua. Provo skedarin M3U.";
  }
}

async function adminAddM3UFile(file){
  if(!isAdmin() || !file) return;
  const status=document.getElementById("tvServerStatus");
  try{
    if(status) status.textContent=tr("loading");
    const text=await file.text();
    const title=(document.getElementById("tvServerTitle")?.value||file.name||"Server").trim();
    const country=normalizeCountryGroup(document.getElementById("tvServerCountry")?.value||"Tjera");
    const server=await addM3UServerFromText(text,title,country);
    currentMode="home";
    render();
    const next=document.getElementById("tvServerStatus");
    if(next) next.textContent="U shtua "+server.channels.length+" kanale.";
  }catch(error){
    console.warn(error);
    if(status) status.textContent=tr("invalid");
  }
}

async function adminAddDirectChannel(){
  if(!isAdmin()) return;
  const name=(document.getElementById("tvDirectName")?.value||"").trim();
  const url=(document.getElementById("tvDirectUrl")?.value||"").trim();
  const mediaType=document.getElementById("tvDirectType")?.value||"live";
  const country=normalizeCountryGroup(document.getElementById("tvDirectCountry")?.value||"Tjera");
  const target=document.getElementById("tvDirectServer")?.value||"";
  const status=document.getElementById("tvServerStatus");
  if(!name || !url){ if(status) status.textContent="Shkruaj emrin dhe linkun e kanalit."; return; }

  let server=serverCatalog.find(s=>s.id===target);
  if(!server){
    server={
      id:makeServerId(),
      title:"Kanale direkte",
      countryGroup:country,
      channels:[]
    };
    serverCatalog.push(server);
  }
  server.channels.push({
    name,logo:"",url,
    countryGroup:country,
    sourceGroup:"",
    mediaType:["live","movies","series","replay"].includes(mediaType)?mediaType:"live",
    catchup:"",catchupSource:"",catchupDays:""
  });
  activeServerId=server.id;
  syncActiveChannels();
  await persistCatalog();
  render();
  const next=document.getElementById("tvServerStatus");
  if(next) next.textContent="Kanali u shtua.";
}

async function adminDeleteServer(id){
  if(!isAdmin()) return;
  const server=serverCatalog.find(s=>s.id===id);
  if(!server || server.builtIn) return;
  if(!confirm("Ta fshij listën "+server.title+"?")) return;
  serverCatalog=serverCatalog.filter(s=>s.id!==id);
  if(activeServerId===id) activeServerId=serverCatalog[0]?.id||"";
  syncActiveChannels();
  await persistCatalog();
  render();
}

async function useServer(id){
  const server=serverCatalog.find(s=>s.id===id);
  if(!server) return;
  activeServerId=server.id;
  localStorage.setItem(TV_ACTIVE_SERVER_KEY,server.id);
  if(server.localOnly){
    syncActiveChannels();
    currentMode="home";
    currentFilter="";
    currentGroup="";
    destroyPlayer();
    render();
    return;
  }
  if(server.builtIn && !server.channels?.length){
    server.loading=true;
    render();
    await loadBuiltInServer(server);
  }
  syncActiveChannels();
  currentMode="home";
  currentFilter="";
  currentGroup="";
  destroyPlayer();
  render();
}

function countrySelect(id,selected="Shqiptare"){
  const groups=["Shqiptare","Gjermane","Turke","EX-YU","Italiane","Franceze","Arabe","Tjera"];
  return '<select id="'+id+'" class="tv-server-select">'+groups.map(g=>'<option value="'+esc(g)+'" '+(g===selected?"selected":"")+'>'+esc(g)+'</option>').join("")+'</select>';
}

function renderServers(){
  const cards=serverCatalog.length
    ? serverCatalog.map(server=>`
      <article class="tv-server-card ${server.id===activeServerId?"active":""}">
        <button type="button" class="tv-server-open" data-tv-server="${esc(server.id)}">
          <span class="tv-server-icon">🗄️</span>
          <span><strong>${esc(server.title)}</strong><small>${server.builtIn?"FREE · ":""}${esc(server.countryGroup)} · ${server.loading?"…":(server.channels?.length||0)} ${tr("channels")}</small></span>
        </button>
        ${server.localOnly?'<button type="button" class="tv-server-delete-local" data-tv-delete-local="1">🗑️</button>':(isAdmin() && !server.builtIn?'<button type="button" class="tv-server-delete" data-tv-delete-server="'+esc(server.id)+'">🗑️</button>':"")}
      </article>`).join("")
    : '<div class="tv-empty-server">Ende nuk ka listë TV.</div>';

  const localPrivate=`
    <section class="tv-server-admin tv-local-private">
      <h3>📱 Lista ime private M3U</h3>
      <p class="tv-admin-private-note">Ky link ruhet vetëm në këtë telefon. Nuk dërgohet në databazën e DIAMOND dhe nuk i shfaqet askujt tjetër.</p>
      <div class="tv-server-form-grid">
        <input id="tvPrivateM3UUrl" type="password" inputmode="url" autocomplete="off" placeholder="Linku M3U privat">
        <button id="tvSavePrivateM3U" class="primary" type="button">📱 Ruaj vetëm në këtë telefon</button>
      </div>
      <div id="tvPrivateM3UStatus" class="message"></div>
    </section>`;

  const admin=isAdmin()?`
    <section class="tv-server-admin">
      <h3>🔒 Admin – shto listë M3U</h3>
      <p class="tv-admin-private-note">Linkat nuk shfaqen në menunë e përdoruesve.</p>
      <div class="tv-server-form-grid">
        <input id="tvServerTitle" type="text" placeholder="Emri i listës, p.sh. Shqip TV">
        ${countrySelect("tvServerCountry","Shqiptare")}
        <input id="tvServerUrl" type="password" inputmode="url" autocomplete="off" placeholder="Linku M3U">
        <button id="tvAddM3U" class="primary" type="button">+ Shto M3U</button>
        <label class="tv-file-button">📁 Zgjidh skedar M3U<input id="tvServerFile" type="file" accept=".m3u,.m3u8,application/x-mpegURL,audio/mpegurl"></label>
      </div>

      <h3>➕ Shto kanal direkt</h3>
      <div class="tv-server-form-grid">
        <input id="tvDirectName" type="text" placeholder="Emri i kanalit">
        <input id="tvDirectUrl" type="password" inputmode="url" autocomplete="off" placeholder="Linku i kanalit">
        ${countrySelect("tvDirectCountry","Shqiptare")}
        <select id="tvDirectType" class="tv-server-select">
          <option value="live">Live TV</option>
          <option value="movies">Film / Video</option>
          <option value="series">Serial</option>
          <option value="replay">Replay</option>
        </select>
        <select id="tvDirectServer" class="tv-server-select">
          <option value="">Server i ri / Kanale direkte</option>
          ${serverCatalog.filter(s=>!s.builtIn).map(s=>'<option value="'+esc(s.id)+'">'+esc(s.title)+'</option>').join("")}
        </select>
        <button id="tvAddDirect" class="primary" type="button">+ Shto kanal</button>
      </div>
      <div id="tvServerStatus" class="message"></div>
    </section>`:"";

  return `
    <section class="tv-servers-view">
      <div class="tv-category-head">
        <button id="tvBackHome" class="tv-back-btn" type="button">← ${tr("back")}</button>
        <h2>🗄️ ${tr("server")}</h2>
      </div>
      <div class="tv-server-grid">${cards}</div>
      ${localPrivate}
      ${admin}
    </section>`;
}

function exitTvShell(target="galleryTab"){
  destroyPlayer();
  document.body.classList.remove("angel-tv-open");
  root?.classList.remove("angel-tv-fullscreen");
  document.getElementById(target)?.click();
}

function setPlayerStatus(text="",kind=""){
  const el=document.getElementById("tvPlayerStatus");
  if(!el) return;
  el.textContent=text;
  el.className="message tv-player-status"+(kind?" "+kind:"");
}

function showRetry(channel){
  if(channel) lastTriedChannel=channel;
  const btn=document.getElementById("tvRetry");
  if(btn) btn.classList.toggle("hidden",!channel);
}

async function toggleTvFullscreen(){
  const video=document.getElementById("tvPlayer");
  const card=document.getElementById("tvPlayerCard");
  const button=document.getElementById("tvFullscreen");
  if(!video || !card) return;

  const inNativeFullscreen=!!document.fullscreenElement;
  const inFallback=document.body.classList.contains("tv-fullscreen-fallback");

  if(inNativeFullscreen){
    try{ await document.exitFullscreen(); }catch(_){}
    return;
  }

  if(inFallback){
    document.body.classList.remove("tv-fullscreen-fallback");
    card.classList.remove("tv-fullscreen-card");
    if(button) button.textContent="⛶ "+tr("fullscreen");
    return;
  }

  try{
    if(video.requestFullscreen){
      await video.requestFullscreen();
      return;
    }
    if(video.webkitRequestFullscreen){
      video.webkitRequestFullscreen();
      return;
    }
    if(video.webkitEnterFullscreen){
      video.webkitEnterFullscreen();
      return;
    }
  }catch(_){}

  document.body.classList.add("tv-fullscreen-fallback");
  card.classList.add("tv-fullscreen-card");
  if(button) button.textContent="✕ "+tr("exitFullscreen");
}

document.addEventListener("fullscreenchange",()=>{
  const button=document.getElementById("tvFullscreen");
  if(button){
    button.textContent=document.fullscreenElement
      ? "✕ "+tr("exitFullscreen")
      : "⛶ "+tr("fullscreen");
  }
  if(!document.fullscreenElement){
    document.body.classList.remove("tv-fullscreen-fallback");
    document.getElementById("tvPlayerCard")?.classList.remove("tv-fullscreen-card");
  }
});

function destroyPlayer(){
  if(hls){ try{hls.destroy();}catch(_){} hls=null; }
  const video=document.getElementById("tvPlayer");
  if(video){
    try{ video.pause(); video.removeAttribute("src"); video.load(); }catch(_){}
  }
}

function classifyChannel(ch){
  if(["live","movies","series","replay"].includes(ch?.mediaType)) return ch.mediaType;
  const group=(ch?.group||ch?.sourceGroup||"").toLowerCase();
  const name=(ch?.name||"").toLowerCase();
  const hay=group+" "+name;
  if(ch?.catchup && !["","none","0","false"].includes(String(ch.catchup).toLowerCase())) return "replay";
  if(/\b(movie|movies|film|films|filma|kino|cinema|vod)\b/i.test(hay)) return "movies";
  if(/\b(series|serial|seriale|serie|serien|dizi|diziler)\b/i.test(hay)) return "series";
  return "live";
}

function channelsForMode(){
  if(currentMode==="home" || currentMode==="servers") return [];
  let base=[...channels];
  if(currentMode==="series"){
    const seen=new Set(base.map(ch=>String(ch?.url||"").trim()));
    for(const item of BUILTIN_TURKISH_SERIES){
      if(!seen.has(item.url)) base.push({...item});
    }
  }
  let list=base.filter(ch=>classifyChannel(ch)===currentMode);
  if(currentGroup) list=list.filter(ch=>(ch.countryGroup||ch.group||"Tjera")===currentGroup);
  const q=currentFilter.trim().toLowerCase();
  if(q) list=list.filter(ch=>((ch.name||"")+" "+(ch.countryGroup||"")+" "+(ch.sourceGroup||ch.group||"")).toLowerCase().includes(q));
  return list;
}

function groupsForMode(){
  const set=new Set();
  for(const ch of channels){
    if(classifyChannel(ch)===currentMode) set.add(ch.countryGroup||ch.group||"Tjera");
  }
  return [...set].filter(Boolean).sort((a,b)=>a.localeCompare(b));
}

async function loadFromUrl(){
  if(!isAdmin()) return;
  const input=document.getElementById("tvUrl");
  const status=document.getElementById("tvStatus");
  const url=(input?.value||"").trim();
  if(!url) return;

  localStorage.setItem(TV_URL_KEY,url);
  pendingSource={source_type:"url",source_value:url};
  saveLocalSource(pendingSource);
  if(status) status.textContent=tr("loading");

  channels=await sourceToChannels(pendingSource);
  currentMode="home";
  currentFilter="";
  currentGroup="";
  render();
}

async function loadFromFile(file){
  if(!isAdmin() || !file) return;
  const status=document.getElementById("tvStatus");
  if(status) status.textContent=tr("loading");
  try{
    const text=await file.text();
    pendingSource={source_type:"m3u",source_value:text};
    saveLocalSource(pendingSource);
    channels=parseM3U(text);
    if(!channels.length) throw new Error("empty");
    currentMode="home";
    currentFilter="";
    currentGroup="";
    render();
  }catch(error){
    console.warn(error);
    if(status) status.textContent=tr("invalid");
  }
}

function loadHlsJs(){
  return new Promise((resolve,reject)=>{
    if(window.Hls) return resolve(window.Hls);
    const existing=document.querySelector('script[data-shtime-hls="1"]');
    if(existing){
      existing.addEventListener("load",()=>resolve(window.Hls),{once:true});
      existing.addEventListener("error",reject,{once:true});
      return;
    }
    const s=document.createElement("script");
    s.dataset.shtimeHls="1";
    s.src="https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
    s.crossOrigin="anonymous";
    const timer=setTimeout(()=>reject(new Error("HLS loader timeout")),10000);
    s.onload=()=>{clearTimeout(timer);resolve(window.Hls);};
    s.onerror=(e)=>{clearTimeout(timer);reject(e);};
    document.head.appendChild(s);
  });
}

async function playChannel(channel){
  if(!channel?.url) return;

  if(channel.officialPage){
    localStorage.setItem(TV_NAME_KEY,channel.name||"");
    try{
      window.location.href=channel.url;
    }catch(_){
      window.open(channel.url,"_self");
    }
    return;
  }

  const video=document.getElementById("tvPlayer");
  const title=document.getElementById("tvNow");
  if(!video) return;

  destroyPlayer();
  lastTriedChannel=channel;
  hlsRecoveryCount=0;
  if(title) title.textContent=channel.name || tr("direct");
  localStorage.setItem(TV_NAME_KEY,channel.name||"");
  setPlayerStatus(tr("playerLoading"));
  showRetry(null);

  const url=channel.url.trim();
  const isHls=/\.m3u8(?:$|\?)/i.test(url) || /mpegurl/i.test(channel.mime||"");

  const markReady=()=>{
    setPlayerStatus(tr("playerReady"),"success");
    showRetry(null);
    document.getElementById("tvPlayerCard")?.scrollIntoView({behavior:"smooth",block:"center"});
  };

  const markFailed=(message=tr("playerFailed"))=>{
    setPlayerStatus(message,"error");
    showRetry(channel);
  };

  video.onerror=()=>{
    if(!hls && !isHls) markFailed(tr("playerFailed"));
  };
  video.oncanplay=markReady;
  video.onplaying=markReady;

  try{
    // Prefer native HLS when the device supports it.
    if(isHls && video.canPlayType("application/vnd.apple.mpegurl")){
      video.src=url;
      video.load();
      const p=video.play();
      if(p?.catch) p.catch(()=>{});
      setTimeout(()=>{
        if(video.readyState===0) markFailed(tr("playerNetworkError"));
      },9000);
      return;
    }

    if(isHls){
      const Hls=await loadHlsJs();
      if(Hls?.isSupported()){
        hls=new Hls({
          enableWorker:true,
          lowLatencyMode:false,
          backBufferLength:30,
          manifestLoadingTimeOut:12000,
          levelLoadingTimeOut:12000,
          fragLoadingTimeOut:15000,
          manifestLoadingMaxRetry:2,
          levelLoadingMaxRetry:2,
          fragLoadingMaxRetry:2
        });

        hls.on(Hls.Events.MEDIA_ATTACHED,()=>hls.loadSource(url));
        hls.on(Hls.Events.MANIFEST_PARSED,()=>{
          const p=video.play();
          if(p?.catch) p.catch(()=>{});
        });
        hls.on(Hls.Events.ERROR,(_event,data)=>{
          console.warn("HLS error",data?.type,data?.details,data);
          if(!data?.fatal) return;

          if(data.type===Hls.ErrorTypes.NETWORK_ERROR && hlsRecoveryCount<2){
            hlsRecoveryCount++;
            setPlayerStatus(tr("playerNetworkError"));
            setTimeout(()=>{ try{hls?.startLoad();}catch(_){} },700);
            return;
          }

          if(data.type===Hls.ErrorTypes.MEDIA_ERROR && hlsRecoveryCount<2){
            hlsRecoveryCount++;
            setPlayerStatus(tr("playerMediaError"));
            try{hls?.recoverMediaError();}catch(_){}
            return;
          }

          markFailed(
            data.type===Hls.ErrorTypes.NETWORK_ERROR
              ? tr("playerNetworkError")
              : tr("playerFailed")
          );
          try{hls?.destroy();}catch(_){}
          hls=null;
        });

        hls.attachMedia(video);
        setTimeout(()=>{
          if(video.readyState===0 && hls){
            markFailed(tr("playerNetworkError"));
          }
        },14000);
        return;
      }
    }

    // Non-HLS or browsers where hls.js is unavailable.
    video.src=url;
    video.load();
    const p=video.play();
    if(p?.catch) p.catch(()=>{});
    setTimeout(()=>{
      if(video.readyState===0) markFailed(tr("playerFailed"));
    },10000);
  }catch(error){
    console.warn("TV play failed",error);
    markFailed(tr("playerFailed"));
  }
}

function renderChannels(){
  const list=document.getElementById("tvChannels");
  const count=document.getElementById("tvChannelCount");
  if(!list) return;

  const shown=channelsForMode();
  if(count) count.textContent=String(shown.length);
  list.innerHTML="";

  if(!shown.length){
    list.innerHTML='<div class="tv-empty">'+esc(tr("noChannels"))+'</div>';
    return;
  }

  const frag=document.createDocumentFragment();
  for(const ch of shown.slice(0,2500)){
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="tv-channel";
    const logo=ch.logo
      ? '<img src="'+esc(ch.logo)+'" alt="">'
      : '<div class="tv-channel-icon">'+(currentMode==="movies"?"🎬":currentMode==="series"?"🎞️":currentMode==="replay"?"↩️":"📺")+'</div>';
    const groupText=[ch.countryGroup||"",ch.sourceGroup||ch.group||""].filter(Boolean).join(" · ");
    btn.innerHTML=logo+
      '<div class="tv-channel-text"><strong>'+esc(ch.name)+'</strong>'+
      (groupText?'<span>'+esc(groupText)+'</span>':"")+'</div>'+
      (ch.catchup?'<span class="tv-replay-badge">↩️</span>':"");
    btn.addEventListener("click",()=>playChannel(ch));
    frag.appendChild(btn);
  }
  list.appendChild(frag);
}

function modeTitle(){
  return currentMode==="movies"?tr("movies"):
    currentMode==="series"?tr("series"):
    currentMode==="replay"?tr("replay"):tr("live");
}

function openMode(mode){
  currentMode=mode;
  currentFilter="";
  currentGroup="";
  render();
}

function renderHome(){
  const liveCount=channels.filter(ch=>classifyChannel(ch)==="live").length;
  const movieCount=channels.filter(ch=>classifyChannel(ch)==="movies").length;
  const seriesCount=channels.filter(ch=>classifyChannel(ch)==="series").length;
  const replayCount=channels.filter(ch=>classifyChannel(ch)==="replay").length;
  const server=activeServer();

  return `
    <section class="tv-hero-real">
      <div class="tv-brand-real">
        <div class="tv-brand-main">ANGEL TV</div>
        <div class="tv-brand-subtitle">${server?esc(server.title):"SMART IPTV"}</div>
      </div>
      <div class="tv-top-menu">
        <button id="tvSportsGuide" type="button">⚽ ${tr("sports")}</button>
        <button id="tvChangeServer" type="button">🗄️ ${tr("server")}</button>
        <button id="tvSettingsBtn" type="button">⚙️ ${tr("settings")}</button>
      </div>
    </section>

    <section class="tv-home-grid">
      <button class="tv-home-tile" data-tv-mode="live" type="button">
        <span class="tv-home-icon">📺</span>
        <strong>${tr("live")}</strong>
        <small>${liveCount}</small>
      </button>
      <button class="tv-home-tile" data-tv-mode="movies" type="button">
        <span class="tv-home-icon">🎬</span>
        <strong>${tr("movies")}</strong>
        <small>${movieCount}</small>
      </button>
      <button class="tv-home-tile" data-tv-mode="series" type="button">
        <span class="tv-home-icon">🎞️</span>
        <strong>${tr("series")}</strong>
        <small>${seriesCount}</small>
      </button>
      <button class="tv-home-tile" data-tv-mode="replay" type="button">
        <span class="tv-home-icon">↩️</span>
        <strong>${tr("replay")}</strong>
        <small>${replayCount}</small>
      </button>
    </section>

    <section class="tv-home-foot">
      <span>${server?"🗄️ "+esc(server.title):"🗄️ "+tr("noShared")}</span>
      <span>📺 ${channels.length} ${tr("channels")}</span>
    </section>`;
}

function renderCategory(){
  const groups=groupsForMode();
  const options=['<option value="">'+esc(tr("allGroups"))+'</option>']
    .concat(groups.map(g=>'<option value="'+esc(g)+'" '+(g===currentGroup?"selected":"")+'>'+esc(g)+'</option>'))
    .join("");

  return `
    <section class="tv-category-head">
      <button id="tvBackHome" class="tv-back-btn" type="button">← ${tr("back")}</button>
      <h2>${modeTitle()}</h2>
      ${currentMode==="replay"?'<p>'+esc(tr("replayInfo"))+'</p>':""}
    </section>

    <section class="tv-list-card">
      <div class="tv-list-head tv-list-tools">
        <div><strong>${tr("channels")}: </strong><span id="tvChannelCount">0</span></div>
        <select id="tvGroupSelect" class="tv-group-select">${options}</select>
        <input id="tvSearch" type="text" placeholder="${tr("search")}" value="${esc(currentFilter)}">
      </div>
      <div id="tvChannels" class="tv-channels"></div>
    </section>`;
}

function render(){
  if(tabLabel) tabLabel.textContent=tr("tv");
  if(!root) return;

  const categoryMode=["live","movies","series","replay"].includes(currentMode);
  const body=currentMode==="home"
    ? renderHome()
    : currentMode==="servers"
      ? renderServers()
      : renderCategory();

  root.innerHTML=`
    <div class="tv-app-real">
      <button id="tvExitApp" class="tv-exit-app" type="button" aria-label="Back">‹</button>
      ${body}

      ${categoryMode?`
      <section id="tvPlayerCard" class="tv-player-card tv-player-real">
        <div class="tv-now-row">
          <strong id="tvNow">${esc(localStorage.getItem(TV_NAME_KEY)||tr("direct"))}</strong>
          <div class="tv-player-actions">
            <button id="tvFullscreen" class="secondary" type="button">⛶ ${tr("fullscreen")}</button>
            <button id="tvStop" class="secondary" type="button">${tr("stop")}</button>
          </div>
        </div>
        <video id="tvPlayer" class="tv-player" controls playsinline preload="metadata"></video>
        <div class="tv-player-feedback">
          <div id="tvPlayerStatus" class="message tv-player-status"></div>
          <button id="tvRetry" class="secondary hidden" type="button">${tr("retry")}</button>
        </div>
      </section>`:""}
    </div>`;

  document.getElementById("tvExitApp")?.addEventListener("click",()=>exitTvShell("galleryTab"));
  document.getElementById("tvSportsGuide")?.addEventListener("click",()=>exitTvShell("sportTab"));
  document.getElementById("tvChangeServer")?.addEventListener("click",()=>{currentMode="servers";render();});
  document.getElementById("tvSettingsBtn")?.addEventListener("click",()=>{currentMode="servers";render();});

  document.querySelectorAll("[data-tv-mode]").forEach(btn=>{
    btn.addEventListener("click",()=>openMode(btn.dataset.tvMode));
  });
  document.getElementById("tvBackHome")?.addEventListener("click",()=>openMode("home"));

  document.querySelectorAll("[data-tv-server]").forEach(btn=>{
    btn.addEventListener("click",()=>useServer(btn.dataset.tvServer));
  });
  document.querySelectorAll("[data-tv-delete-server]").forEach(btn=>{
    btn.addEventListener("click",()=>adminDeleteServer(btn.dataset.tvDeleteServer));
  });
  document.getElementById("tvSavePrivateM3U")?.addEventListener("click",savePrivateM3U);
  document.querySelectorAll("[data-tv-delete-local]").forEach(btn=>{
    btn.addEventListener("click",deletePrivateM3U);
  });
  document.getElementById("tvAddM3U")?.addEventListener("click",adminAddM3U);
  document.getElementById("tvServerFile")?.addEventListener("change",e=>adminAddM3UFile(e.target.files?.[0]));
  document.getElementById("tvAddDirect")?.addEventListener("click",adminAddDirectChannel);

  document.getElementById("tvSearch")?.addEventListener("input",e=>{
    currentFilter=e.target.value;
    renderChannels();
  });
  document.getElementById("tvGroupSelect")?.addEventListener("change",e=>{
    currentGroup=e.target.value;
    renderChannels();
  });

  if(categoryMode){
    document.getElementById("tvFullscreen")?.addEventListener("click",toggleTvFullscreen);
    document.getElementById("tvStop")?.addEventListener("click",()=>{
      destroyPlayer();
      document.body.classList.remove("tv-fullscreen-fallback");
      document.getElementById("tvPlayerCard")?.classList.remove("tv-fullscreen-card");
      setPlayerStatus("");
      showRetry(null);
    });
    const retry=document.getElementById("tvRetry");
    if(retry) retry.onclick=()=>{ if(lastTriedChannel) playChannel(lastTriedChannel); };
    renderChannels();
  }
}

async function activate(){
  document.body.classList.add("angel-tv-open");
  root?.classList.add("angel-tv-fullscreen");
  await refreshUser();
  await loadSharedRecord();
  await loadCatalog();
  currentMode="home";
  currentFilter="";
  currentGroup="";
  render();
}

window.PajazitiTV={activate,reloadLanguage:()=>render(),exit:()=>exitTvShell("galleryTab")};
if(tabLabel) tabLabel.textContent=tr("tv");
