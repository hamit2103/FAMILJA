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
const ADMIN_EMAIL = "admin@familja.local";

const FREE_TV_PLAYLISTS = [
  { title:"🇩🇪 Gjermani", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/de.m3u" },
  { title:"🇦🇱 Shqipëri", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/al.m3u" },
  { title:"🇽🇰 Kosovë", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/xk.m3u" },
  { title:"🇹🇷 Turqi", source_type:"url", source_value:"https://iptv-org.github.io/iptv/countries/tr.m3u" }
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
  }
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
  return clean.endsWith(".m3u") || clean.endsWith(".m3u8") || url.toLowerCase().includes("type=m3u");
}

async function sourceToChannels(source){
  if(!source) return [];
  if(source.source_type==="m3u") return parseM3U(source.source_value);

  const url=source.source_value;
  if(!url) return [];
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
  const group=(ch.group||"").toLowerCase();
  const name=(ch.name||"").toLowerCase();
  const hay=group+" "+name;
  if(ch.catchup && !["","none","0","false"].includes(String(ch.catchup).toLowerCase())) return "replay";
  if(/\b(movie|movies|film|films|filma|kino|cinema|vod)\b/i.test(hay)) return "movies";
  if(/\b(series|serial|seriale|serie|serien|dizi|diziler)\b/i.test(hay)) return "series";
  return "live";
}

function channelsForMode(){
  if(currentMode==="home") return [];
  let list=channels.filter(ch=>classifyChannel(ch)===currentMode);
  if(currentGroup) list=list.filter(ch=>(ch.group||"")===currentGroup);
  const q=currentFilter.trim().toLowerCase();
  if(q) list=list.filter(ch=>(ch.name+" "+ch.group).toLowerCase().includes(q));
  return list;
}

function groupsForMode(){
  const set=new Set();
  for(const ch of channels){
    if(classifyChannel(ch)===currentMode && ch.group) set.add(ch.group);
  }
  return [...set].sort((a,b)=>a.localeCompare(b));
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
  for(const ch of shown.slice(0,1500)){
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="tv-channel";
    const logo=ch.logo
      ? '<img src="'+esc(ch.logo)+'" alt="">'
      : '<div class="tv-channel-icon">'+(currentMode==="movies"?"🎬":currentMode==="series"?"🎞️":currentMode==="replay"?"↩️":"📺")+'</div>';
    btn.innerHTML=logo+
      '<div class="tv-channel-text"><strong>'+esc(ch.name)+'</strong>'+
      (ch.group?'<span>'+esc(ch.group)+'</span>':"")+'</div>'+
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

  return `
    <section class="tv-hero-real">
      <div class="tv-brand-real">
        <div class="tv-brand-main">shtime tv</div>
        <div class="tv-brand-subtitle">SMART IPTV</div>
      </div>
      <div class="tv-top-menu">
        <button type="button">⚽ ${tr("sports")}</button>
        <button type="button">🗄️ ${tr("server")}</button>
        <button type="button">⚙️ ${tr("settings")}</button>
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

    <section class="card tv-list-card">
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

  root.innerHTML=`
    <div class="tv-app-real">
      ${currentMode==="home" ? renderHome() : renderCategory()}

      <section id="tvPlayerCard" class="card tv-player-card tv-player-real">
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
      </section>

      ${isAdmin() ? `
      <section class="card tv-control-card tv-admin-only">
        <h2>${tr("title")}</h2>
        <div class="tv-admin-private-note">🔒 Vetëm administratori i sheh dhe i ndryshon linkat.</div>
        <label for="tvUrl">${tr("url")}</label>
        <div class="tv-url-row">
          <input id="tvUrl" type="password" inputmode="url" autocomplete="off" placeholder="${tr("urlPlaceholder")}" value="${esc(localStorage.getItem(TV_URL_KEY)||"")}">
          <button id="tvLoadUrl" class="primary" type="button">${tr("loadUrl")}</button>
        </div>

        <label for="tvFile">${tr("file")}</label>
        <input id="tvFile" type="file" accept=".m3u,.m3u8,application/x-mpegURL,audio/mpegurl">

        <div class="tv-share-actions">
          <button id="tvSaveLocal" class="secondary" type="button">${tr("saveLocal")}</button>
          <button id="tvPublishAll" class="primary" type="button">${tr("publish")}</button>
        </div>
        <div id="tvStatus" class="message"></div>
      </section>` : ""}

      <section class="card">
        <div id="tvSources" class="tv-sources"></div>
      </section>

      <section class="tv-bottom-info">
        <div>📱 ${tr("source")}: ${pendingSource===sharedRecord?tr("shared"):tr("local")}</div>
        <div>📺 ${channels.length} ${tr("channels")}</div>
      </section>
    </div>`;

  document.querySelectorAll("[data-tv-mode]").forEach(btn=>{
    btn.addEventListener("click",()=>openMode(btn.dataset.tvMode));
  });

  document.getElementById("tvBackHome")?.addEventListener("click",()=>openMode("home"));

  document.getElementById("tvSearch")?.addEventListener("input",e=>{
    currentFilter=e.target.value;
    renderChannels();
  });

  document.getElementById("tvGroupSelect")?.addEventListener("change",e=>{
    currentGroup=e.target.value;
    renderChannels();
  });

  const tvLoadUrlBtn=document.getElementById("tvLoadUrl");
  if(tvLoadUrlBtn) tvLoadUrlBtn.onclick=loadFromUrl;
  const tvFileInput=document.getElementById("tvFile");
  if(tvFileInput) tvFileInput.onchange=e=>loadFromFile(e.target.files?.[0]);

  const tvSaveLocalBtn=document.getElementById("tvSaveLocal");
  if(tvSaveLocalBtn) tvSaveLocalBtn.onclick=()=>{
    if(pendingSource){
      saveLocalSource(pendingSource);
      document.getElementById("tvStatus").textContent=tr("savedLocal");
      renderSourceCards();
    }
  };

  const publish=document.getElementById("tvPublishAll");
  if(publish) publish.onclick=publishPendingForAll;

  document.getElementById("tvFullscreen").onclick=toggleTvFullscreen;
  document.getElementById("tvStop").onclick=()=>{
    destroyPlayer();
    document.body.classList.remove("tv-fullscreen-fallback");
    document.getElementById("tvPlayerCard")?.classList.remove("tv-fullscreen-card");
    setPlayerStatus("");
    showRetry(null);
  };
  const retry=document.getElementById("tvRetry");
  if(retry) retry.onclick=()=>{ if(lastTriedChannel) playChannel(lastTriedChannel); };
  renderSourceCards();
  if(currentMode!=="home") renderChannels();
}

async function activate(){
  await refreshUser();
  await loadSharedRecord();

  if(!pendingSource){
    const local=getLocalSource();
    if(sharedRecord){
      pendingSource=sharedRecord;
      channels=await sourceToChannels(sharedRecord);
    }else if(local){
      pendingSource=local;
      channels=await sourceToChannels(local);
    }
  }
  render();
}

window.PajazitiTV={activate};
if(tabLabel) tabLabel.textContent=tr("tv");
