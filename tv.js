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

const TXT = {
  sq:{
    tv:"TV", title:"📺 TV / M3U Player", url:"M3U ose URL", urlPlaceholder:"Ngjit M3U, M3U8 ose URL direkte të videos",
    loadUrl:"Hape URL", file:"Ngarko skedar M3U", chooseFile:"Zgjidh .m3u / .m3u8", channels:"Kanale",
    search:"Kërko kanal", noChannels:"Nuk ka kanale.", direct:"Stream direkt", loading:"Po ngarkohet…",
    cors:"Kjo URL nuk lejon lexim direkt nga aplikacioni (CORS). Provo skedarin M3U ose një URL tjetër.",
    invalid:"URL ose lista nuk u lexua.", play:"Luaj", stop:"Ndalo", playlist:"Lista M3U", shared:"Lista e përbashkët", local:"Lista ime në këtë telefon", publish:"Publiko për të gjithë", published:"U publikua për të gjithë.", adminOnly:"Vetëm administratori mund ta publikojë për të gjithë.", noShared:"Nuk ka ende listë të përbashkët.", saveLocal:"Ruaje vetëm në këtë telefon", savedLocal:"U ruajt vetëm në këtë telefon.", useShared:"Hap listën e përbashkët", useLocal:"Hap listën time"
  },
  de:{
    tv:"TV", title:"📺 TV / M3U Player", url:"M3U oder URL", urlPlaceholder:"M3U-, M3U8- oder direkte Video-URL einfügen",
    loadUrl:"URL öffnen", file:"M3U-Datei laden", chooseFile:".m3u / .m3u8 auswählen", channels:"Sender",
    search:"Sender suchen", noChannels:"Keine Sender.", direct:"Direkter Stream", loading:"Wird geladen…",
    cors:"Diese URL erlaubt keinen direkten Zugriff aus der App (CORS). Verwende die M3U-Datei oder eine andere URL.",
    invalid:"URL oder Liste konnte nicht gelesen werden.", play:"Abspielen", stop:"Stoppen", playlist:"M3U-Liste", shared:"Gemeinsame Liste", local:"Meine Liste auf diesem Gerät", publish:"Für alle veröffentlichen", published:"Für alle veröffentlicht.", adminOnly:"Nur der Administrator kann für alle veröffentlichen.", noShared:"Noch keine gemeinsame Liste.", saveLocal:"Nur auf diesem Gerät speichern", savedLocal:"Nur auf diesem Gerät gespeichert.", useShared:"Gemeinsame Liste öffnen", useLocal:"Meine Liste öffnen"
  },
  tr:{
    tv:"TV", title:"📺 TV / M3U Player", url:"M3U veya URL", urlPlaceholder:"M3U, M3U8 veya doğrudan video URL'si yapıştır",
    loadUrl:"URL'yi aç", file:"M3U dosyası yükle", chooseFile:".m3u / .m3u8 seç", channels:"Kanallar",
    search:"Kanal ara", noChannels:"Kanal yok.", direct:"Doğrudan yayın", loading:"Yükleniyor…",
    cors:"Bu URL uygulamadan doğrudan erişime izin vermiyor (CORS). M3U dosyası veya başka URL dene.",
    invalid:"URL veya liste okunamadı.", play:"Oynat", stop:"Durdur", playlist:"M3U listesi", shared:"Ortak liste", local:"Bu telefondaki listem", publish:"Herkes için yayınla", published:"Herkes için yayınlandı.", adminOnly:"Herkes için yalnızca yönetici yayınlayabilir.", noShared:"Henüz ortak liste yok.", saveLocal:"Yalnızca bu telefona kaydet", savedLocal:"Yalnızca bu telefona kaydedildi.", useShared:"Ortak listeyi aç", useLocal:"Listemi aç"
  }
};

function lang(){ const l=localStorage.getItem(LANG_KEY)||"sq"; return TXT[l]?l:"sq"; }
function tr(k){ return TXT[lang()][k] || TXT.sq[k] || k; }
function esc(v=""){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}

let channels=[];
let currentFilter="";
let hls=null;
let currentUser=null;
let sharedRecord=null;
let pendingSource=null;

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

async function sourceToChannels(source){
  if(!source) return [];
  if(source.source_type==="m3u"){
    return parseM3U(source.source_value);
  }
  const url=source.source_value;
  if(!url) return [];
  if(!isLikelyPlaylistUrl(url)) return [{name:tr("direct"),logo:"",group:"",url}];
  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    const text=await res.text();
    const parsed=parseM3U(text);
    if(parsed.length) return parsed;
    return [{name:tr("direct"),logo:"",group:"",url}];
  }catch(_){
    return [{name:tr("direct"),logo:"",group:"",url}];
  }
}

async function useSource(source){
  pendingSource=source;
  channels=await sourceToChannels(source);
  renderChannels();
  if(channels.length===1 && channels[0].name===tr("direct")) playChannel(channels[0]);
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
  const payload={
    id:1,
    title:"TV",
    source_type:pendingSource.source_type,
    source_value:pendingSource.source_value,
    updated_at:new Date().toISOString(),
    updated_by:currentUser?.id||null
  };
  const {error}=await supabase.from("tv_shared_playlist").upsert(payload,{onConflict:"id"});
  if(error){
    console.warn(error);
    if(status) status.textContent=error.message;
    return;
  }
  sharedRecord=payload;
  if(status) status.textContent=tr("published");
  renderSourceCards();
}

function renderSourceCards(){
  const wrap=document.getElementById("tvSources");
  if(!wrap) return;
  const local=getLocalSource();
  wrap.innerHTML=`
    <div class="tv-source-card">
      <div><strong>🌐 ${tr("shared")}</strong><div class="muted small">${sharedRecord ? new Date(sharedRecord.updated_at).toLocaleString() : tr("noShared")}</div></div>
      <button id="tvUseShared" class="secondary" type="button" ${sharedRecord?"":"disabled"}>${tr("useShared")}</button>
    </div>
    <div class="tv-source-card">
      <div><strong>📱 ${tr("local")}</strong><div class="muted small">${local ? "✓" : "—"}</div></div>
      <button id="tvUseLocal" class="secondary" type="button" ${local?"":"disabled"}>${tr("useLocal")}</button>
    </div>`;
  const a=document.getElementById("tvUseShared");
  if(a) a.onclick=()=>useSource(sharedRecord);
  const b=document.getElementById("tvUseLocal");
  if(b) b.onclick=()=>useSource(local);
}

function destroyPlayer(){
  if(hls){ try{hls.destroy();}catch(_){} hls=null; }
  const video=document.getElementById("tvPlayer");
  if(video){
    try{ video.pause(); video.removeAttribute("src"); video.load(); }catch(_){}
  }
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
      const logo=(line.match(/tvg-logo="([^"]*)"/i)||[])[1]||"";
      const group=(line.match(/group-title="([^"]*)"/i)||[])[1]||"";
      meta={name,logo,group};
    } else if(!line.startsWith("#")){
      out.push({
        name:meta?.name || line,
        logo:meta?.logo || "",
        group:meta?.group || "",
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

async function loadFromUrl(){
  const input=document.getElementById("tvUrl");
  const status=document.getElementById("tvStatus");
  const url=(input?.value||"").trim();
  if(!url) return;
  localStorage.setItem(TV_URL_KEY,url);
  pendingSource={source_type:"url",source_value:url};
  saveLocalSource(pendingSource);
  status.textContent=tr("loading");

  if(!isLikelyPlaylistUrl(url)){
    channels=[{name:tr("direct"),logo:"",group:"",url}];
    renderChannels();
    playChannel(channels[0]);
    status.textContent="";
    return;
  }

  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    const text=await res.text();
    const parsed=parseM3U(text);
    if(parsed.length){
      channels=parsed;
      renderChannels();
      status.textContent="";
      return;
    }

    // Treat standalone m3u8 as a playable HLS stream.
    channels=[{name:tr("direct"),logo:"",group:"",url}];
    renderChannels();
    playChannel(channels[0]);
    status.textContent="";
  }catch(error){
    console.warn("TV URL load failed",error);
    // m3u8 URLs may fail fetch because of CORS but can still be playable by media stack.
    if(url.toLowerCase().includes(".m3u8")){
      channels=[{name:tr("direct"),logo:"",group:"",url}];
      renderChannels();
      playChannel(channels[0]);
      status.textContent="";
    }else{
      status.textContent=tr("cors");
    }
  }
}

async function loadFromFile(file){
  if(!file) return;
  const status=document.getElementById("tvStatus");
  status.textContent=tr("loading");
  try{
    const text=await file.text();
    pendingSource={source_type:"m3u",source_value:text};
    saveLocalSource(pendingSource);
    channels=parseM3U(text);
    if(!channels.length) throw new Error("empty");
    renderChannels();
    status.textContent="";
  }catch(error){
    console.warn(error);
    status.textContent=tr("invalid");
  }
}

function loadHlsJs(){
  return new Promise((resolve,reject)=>{
    if(window.Hls) return resolve(window.Hls);
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
    s.onload=()=>resolve(window.Hls);
    s.onerror=reject;
    document.head.appendChild(s);
  });
}

async function playChannel(channel){
  if(!channel?.url) return;
  const video=document.getElementById("tvPlayer");
  const title=document.getElementById("tvNow");
  if(!video) return;

  destroyPlayer();
  if(title) title.textContent=channel.name || tr("direct");
  localStorage.setItem(TV_NAME_KEY,channel.name||"");

  const url=channel.url;
  const isHls=url.toLowerCase().includes(".m3u8");

  try{
    if(isHls && !video.canPlayType("application/vnd.apple.mpegurl")){
      const Hls=await loadHlsJs();
      if(Hls?.isSupported()){
        hls=new Hls({enableWorker:true,lowLatencyMode:true});
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,()=>video.play().catch(()=>{}));
        return;
      }
    }

    video.src=url;
    await video.play().catch(()=>{});
  }catch(error){
    console.warn("TV play failed",error);
    const status=document.getElementById("tvStatus");
    if(status) status.textContent=tr("invalid");
  }
}

function renderChannels(){
  const list=document.getElementById("tvChannels");
  const count=document.getElementById("tvChannelCount");
  if(!list) return;
  const q=currentFilter.trim().toLowerCase();
  const shown=channels.filter(ch=>{
    if(!q) return true;
    return (ch.name+" "+ch.group).toLowerCase().includes(q);
  });
  if(count) count.textContent=String(shown.length);
  list.innerHTML="";
  if(!shown.length){
    list.innerHTML='<div class="card empty">'+esc(tr("noChannels"))+'</div>';
    return;
  }
  const frag=document.createDocumentFragment();
  for(const ch of shown.slice(0,1000)){
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="tv-channel";
    const logo=ch.logo ? '<img src="'+esc(ch.logo)+'" alt="">' : '<div class="tv-channel-icon">📺</div>';
    btn.innerHTML=logo+'<div class="tv-channel-text"><strong>'+esc(ch.name)+'</strong>'+(ch.group?'<span>'+esc(ch.group)+'</span>':"")+'</div>';
    btn.addEventListener("click",()=>playChannel(ch));
    frag.appendChild(btn);
  }
  list.appendChild(frag);
}

function render(){
  if(tabLabel) tabLabel.textContent=tr("tv");
  root.innerHTML=`
    <div class="tv-shell">
      <section class="card tv-control-card">
        <h2>${tr("title")}</h2>
        <label for="tvUrl">${tr("url")}</label>
        <div class="tv-url-row">
          <input id="tvUrl" type="text" inputmode="url" placeholder="${tr("urlPlaceholder")}" value="${esc(localStorage.getItem(TV_URL_KEY)||"")}">
          <button id="tvLoadUrl" class="primary" type="button">${tr("loadUrl")}</button>
        </div>

        <label for="tvFile">${tr("file")}</label>
        <input id="tvFile" type="file" accept=".m3u,.m3u8,application/x-mpegURL,audio/mpegurl">
        <div class="tv-share-actions">
          <button id="tvSaveLocal" class="secondary" type="button">${tr("saveLocal")}</button>
          ${isAdmin() ? `<button id="tvPublishAll" class="primary" type="button">${tr("publish")}</button>` : ""}
        </div>
        <div id="tvStatus" class="message"></div>
      </section>

      <section class="card">
        <div id="tvSources" class="tv-sources"></div>
      </section>

      <section class="card tv-player-card">
        <div class="tv-now-row">
          <strong id="tvNow">${esc(localStorage.getItem(TV_NAME_KEY)||tr("direct"))}</strong>
          <button id="tvStop" class="secondary" type="button">${tr("stop")}</button>
        </div>
        <video id="tvPlayer" class="tv-player" controls playsinline preload="metadata"></video>
      </section>

      <section class="card">
        <div class="tv-list-head">
          <div><strong>${tr("channels")}: </strong><span id="tvChannelCount">0</span></div>
          <input id="tvSearch" type="text" placeholder="${tr("search")}">
        </div>
        <div id="tvChannels" class="tv-channels"></div>
      </section>
    </div>`;

  document.getElementById("tvLoadUrl").onclick=loadFromUrl;
  document.getElementById("tvFile").onchange=e=>loadFromFile(e.target.files?.[0]);
  document.getElementById("tvSaveLocal").onclick=()=>{
    if(pendingSource){
      saveLocalSource(pendingSource);
      document.getElementById("tvStatus").textContent=tr("savedLocal");
      renderSourceCards();
    }
  };
  const publish=document.getElementById("tvPublishAll");
  if(publish) publish.onclick=publishPendingForAll;
  document.getElementById("tvStop").onclick=destroyPlayer;
  document.getElementById("tvSearch").oninput=e=>{currentFilter=e.target.value;renderChannels();};
  renderChannels();
  renderSourceCards();
}

async function activate(){
  await refreshUser();
  await loadSharedRecord();
  render();
  const local=getLocalSource();
  if(sharedRecord) await useSource(sharedRecord);
  else if(local) await useSource(local);
}

window.PajazitiTV={activate};
if(tabLabel) tabLabel.textContent=tr("tv");
