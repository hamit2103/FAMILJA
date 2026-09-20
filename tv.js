const root = document.getElementById("tvRoot");
const tabLabel = document.getElementById("tvTabLabel");
const LANG_KEY = "pajaziti-language";
const TV_URL_KEY = "pajaziti-tv-url";
const TV_NAME_KEY = "pajaziti-tv-last-name";

const TXT = {
  sq:{
    tv:"TV", title:"📺 TV / M3U Player", url:"M3U ose URL", urlPlaceholder:"Ngjit M3U, M3U8 ose URL direkte të videos",
    loadUrl:"Hape URL", file:"Ngarko skedar M3U", chooseFile:"Zgjidh .m3u / .m3u8", channels:"Kanale",
    search:"Kërko kanal", noChannels:"Nuk ka kanale.", direct:"Stream direkt", loading:"Po ngarkohet…",
    cors:"Kjo URL nuk lejon lexim direkt nga aplikacioni (CORS). Provo skedarin M3U ose një URL tjetër.",
    invalid:"URL ose lista nuk u lexua.", play:"Luaj", stop:"Ndalo", playlist:"Lista M3U"
  },
  de:{
    tv:"TV", title:"📺 TV / M3U Player", url:"M3U oder URL", urlPlaceholder:"M3U-, M3U8- oder direkte Video-URL einfügen",
    loadUrl:"URL öffnen", file:"M3U-Datei laden", chooseFile:".m3u / .m3u8 auswählen", channels:"Sender",
    search:"Sender suchen", noChannels:"Keine Sender.", direct:"Direkter Stream", loading:"Wird geladen…",
    cors:"Diese URL erlaubt keinen direkten Zugriff aus der App (CORS). Verwende die M3U-Datei oder eine andere URL.",
    invalid:"URL oder Liste konnte nicht gelesen werden.", play:"Abspielen", stop:"Stoppen", playlist:"M3U-Liste"
  },
  tr:{
    tv:"TV", title:"📺 TV / M3U Player", url:"M3U veya URL", urlPlaceholder:"M3U, M3U8 veya doğrudan video URL'si yapıştır",
    loadUrl:"URL'yi aç", file:"M3U dosyası yükle", chooseFile:".m3u / .m3u8 seç", channels:"Kanallar",
    search:"Kanal ara", noChannels:"Kanal yok.", direct:"Doğrudan yayın", loading:"Yükleniyor…",
    cors:"Bu URL uygulamadan doğrudan erişime izin vermiyor (CORS). M3U dosyası veya başka URL dene.",
    invalid:"URL veya liste okunamadı.", play:"Oynat", stop:"Durdur", playlist:"M3U listesi"
  }
};

function lang(){ const l=localStorage.getItem(LANG_KEY)||"sq"; return TXT[l]?l:"sq"; }
function tr(k){ return TXT[lang()][k] || TXT.sq[k] || k; }
function esc(v=""){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}

let channels=[];
let currentFilter="";
let hls=null;

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
        <div id="tvStatus" class="message"></div>
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
  document.getElementById("tvStop").onclick=destroyPlayer;
  document.getElementById("tvSearch").oninput=e=>{currentFilter=e.target.value;renderChannels();};
  renderChannels();
}

function activate(){ render(); }

window.PajazitiTV={activate};
if(tabLabel) tabLabel.textContent=tr("tv");
