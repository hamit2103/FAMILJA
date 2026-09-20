import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

const root = document.getElementById("gamesRoot");
const tabLabel = document.getElementById("gamesTabLabel");
const DEVICE_KEY = "pajaziti-presence-device";
const LANG_KEY = "pajaziti-language";
const TIMER_NAME_KEY = "pajaziti-timer-name";
const TIMER_SOUND_KEY = "pajaziti-timer-sound";

let deviceId = localStorage.getItem(DEVICE_KEY);
if (!deviceId) {
  deviceId = globalThis.crypto?.randomUUID?.() || ("device_" + Date.now() + Math.random().toString(36).slice(2));
  localStorage.setItem(DEVICE_KEY, deviceId);
}

const TXT = {
  sq:{games:"Lojëra",online:"Luaj online",computer:"Luaj me kompjuter",computerName:"Kompjuteri",computerThinking:"Kompjuteri po mendon…",newGame:"Lojë e re",chess:"Shah",morris:"Mühle",timer:"Kral i Sekondave",choose:"Zgjidh lojën",playerName:"Emri yt",needName:"Shkruaj emrin tënd.",needPlayers:"Duhet të jenë së paku 2 lojtarë.",ready:"Bëhu gati…",hiddenTime:"Sekondat janë të fshehura",stop:"STOP",stopped:"E ndale! Prit lojtarët e tjerë…",round:"Raundi",startRound:"Fillo raundin",eliminated:"u eliminua",king:"Kral i lojës",power:"Fuqi",weekly:"Renditja javore",lastChampion:"Kampioni i javës së kaluar",wins:"Fitore",players:"Lojtarë",maxPlayers:"2–8 lojtarë",roomLocked:"Loja ka filluar; nuk mund të hyjnë lojtarë të rinj.",youEliminated:"Je eliminuar. Shiko deri në fund.",backGames:"Kthehu te lojërat",soloTimer:"🤖 Luaj vetë",practiceOnly:"Stërvitje kundër kompjuterit — nuk hyn në renditjen javore.",you:"Ti",opponents:"Kundërshtarët",active:"Në lojë",soundOn:"🔊 Zëri ON",soundOff:"🔇 Zëri OFF",create:"Krijo dhomë",code:"Kodi i dhomës",join:"Hyr në dhomë",waiting:"Duke pritur lojtarin e dytë…",yourTurn:"Radha jote",opponentTurn:"Radha e kundërshtarit",white:"Bardhë",black:"Zi",leave:"Dil nga loja",room:"Dhoma",copy:"Kopjo kodin",copied:"Kodi u kopjua",invalid:"Kodi nuk u gjet.",full:"Dhoma është e mbushur.",gameOver:"Loja përfundoi",winner:"Fituesi",helpChess:"Prek figurën tënde, pastaj katrorin ku dëshiron ta lëvizësh.",helpMorris:"Në fillim vendos 9 gurët. Kur krijon treshe (mühle), hiq një gur të kundërshtarit.",error:"Gabim"},
  de:{games:"Spiele",online:"Online spielen",computer:"Gegen Computer",computerName:"Computer",computerThinking:"Computer denkt…",newGame:"Neues Spiel",chess:"Schach",morris:"Mühle",timer:"Sekundenkönig",choose:"Spiel wählen",playerName:"Dein Name",needName:"Gib deinen Namen ein.",needPlayers:"Mindestens 2 Spieler sind nötig.",ready:"Mach dich bereit…",hiddenTime:"Die Sekunden sind verborgen",stop:"STOP",stopped:"Gestoppt! Warte auf die anderen…",round:"Runde",startRound:"Runde starten",eliminated:"ist ausgeschieden",king:"König des Spiels",power:"Stärke",weekly:"Wochenrangliste",lastChampion:"Champion der letzten Woche",wins:"Siege",players:"Spieler",maxPlayers:"2–8 Spieler",roomLocked:"Das Spiel hat begonnen; neue Spieler können nicht mehr beitreten.",youEliminated:"Du bist ausgeschieden. Schau bis zum Ende zu.",backGames:"Zurück zu den Spielen",soloTimer:"🤖 Alleine spielen",practiceOnly:"Training gegen den Computer — zählt nicht für die Wochenrangliste.",you:"Du",opponents:"Gegner",active:"Im Spiel",soundOn:"🔊 Ton AN",soundOff:"🔇 Ton AUS",create:"Raum erstellen",code:"Raumcode",join:"Raum beitreten",waiting:"Warte auf den zweiten Spieler…",yourTurn:"Du bist am Zug",opponentTurn:"Gegner ist am Zug",white:"Weiß",black:"Schwarz",leave:"Spiel verlassen",room:"Raum",copy:"Code kopieren",copied:"Code kopiert",invalid:"Code nicht gefunden.",full:"Raum ist voll.",gameOver:"Spiel beendet",winner:"Gewinner",helpChess:"Tippe deine Figur an und danach das Zielfeld.",helpMorris:"Setze zuerst deine 9 Steine. Bei einer Mühle darfst du einen gegnerischen Stein entfernen.",error:"Fehler"},
  tr:{games:"Oyunlar",online:"Çevrimiçi oyna",computer:"Bilgisayara karşı oyna",computerName:"Bilgisayar",computerThinking:"Bilgisayar düşünüyor…",newGame:"Yeni oyun",chess:"Satranç",morris:"Dokuz Taş",timer:"Saniye Kralı",choose:"Oyun seç",playerName:"Adın",needName:"Adını yaz.",needPlayers:"En az 2 oyuncu gerekli.",ready:"Hazır ol…",hiddenTime:"Saniyeler gizli",stop:"STOP",stopped:"Durdurdun! Diğer oyuncuları bekle…",round:"Tur",startRound:"Turu başlat",eliminated:"elendi",king:"Oyunun kralı",power:"Güç",weekly:"Haftalık sıralama",lastChampion:"Geçen haftanın şampiyonu",wins:"Galibiyet",players:"Oyuncular",maxPlayers:"2–8 oyuncu",roomLocked:"Oyun başladı; yeni oyuncu katılamaz.",youEliminated:"Elendin. Sonuna kadar izleyebilirsin.",backGames:"Oyunlara dön",soloTimer:"🤖 Tek başına oyna",practiceOnly:"Bilgisayara karşı antrenman — haftalık sıralamaya sayılmaz.",you:"Sen",opponents:"Rakipler",active:"Oyunda",soundOn:"🔊 Ses AÇIK",soundOff:"🔇 Ses KAPALI",create:"Oda oluştur",code:"Oda kodu",join:"Odaya katıl",waiting:"İkinci oyuncu bekleniyor…",yourTurn:"Sıra sende",opponentTurn:"Sıra rakipte",white:"Beyaz",black:"Siyah",leave:"Oyundan çık",room:"Oda",copy:"Kodu kopyala",copied:"Kod kopyalandı",invalid:"Kod bulunamadı.",full:"Oda dolu.",gameOver:"Oyun bitti",winner:"Kazanan",helpChess:"Kendi taşına, sonra gitmek istediğin kareye dokun.",helpMorris:"Önce 9 taşını yerleştir. Üçlü yaptığında rakibin bir taşını kaldırabilirsin.",error:"Hata"}
};

function lang(){ const l=localStorage.getItem(LANG_KEY)||"sq"; return TXT[l]?l:"sq"; }
function tr(k){ return TXT[lang()][k] || TXT.sq[k] || k; }

let selectedType="chess";
let room=null;
let channel=null;
let selected=null;
let aiTimer=null;
let timerPlayers=[];
let timerPhaseTimeout=null;
let gameAudioContext=null;
let lastTimerSoundKey="";
let timerSoundEnabled=localStorage.getItem(TIMER_SOUND_KEY)!=="off";

async function ensureGameAudio(){
  if(!timerSoundEnabled) return null;
  try{
    if(!gameAudioContext){
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx) return null;
      gameAudioContext=new AudioCtx();
    }
    if(gameAudioContext.state==="suspended") await gameAudioContext.resume();
    return gameAudioContext;
  }catch(_){
    return null;
  }
}

function soundTone(frequency,duration=0.12,delay=0,type="sine",gainValue=0.16){
  if(!timerSoundEnabled) return;
  ensureGameAudio().then(ctx=>{
    if(!ctx) return;
    const start=ctx.currentTime+delay;
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type=type;
    osc.frequency.setValueAtTime(frequency,start);
    gain.gain.setValueAtTime(0.0001,start);
    gain.gain.exponentialRampToValueAtTime(gainValue,start+0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start+duration+0.02);
  });
}

function playTimerSound(kind){
  if(!timerSoundEnabled) return;
  if(kind==="start"){
    soundTone(660,0.12,0);
    soundTone(880,0.18,0.14);
  }else if(kind==="stop"){
    soundTone(440,0.09,0,"square",0.10);
  }else if(kind==="win"){
    soundTone(523,0.12,0);
    soundTone(659,0.12,0.13);
    soundTone(784,0.24,0.26);
  }else if(kind==="lose"){
    soundTone(330,0.16,0);
    soundTone(220,0.30,0.17);
  }else{
    soundTone(520,0.12,0);
  }
}

function setTimerSound(enabled){
  timerSoundEnabled=!!enabled;
  localStorage.setItem(TIMER_SOUND_KEY,timerSoundEnabled?"on":"off");
  if(timerSoundEnabled){
    ensureGameAudio();
    playTimerSound("stop");
  }
}

function timerInitials(name=""){
  const parts=String(name).trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return "?";
  return parts.slice(0,2).map(p=>p[0]?.toUpperCase()||"").join("");
}

function maybePlayTimerStateSound(st,started){
  if(!room || room.game_type!=="timer" || !timerSoundEnabled) return;

  let key="";
  let kind="";

  if(st.phase==="countdown" && started){
    key="start:"+room.id+":"+(st.round||0);
    kind="start";
  }else if(st.phase==="results"){
    key="result:"+room.id+":"+(st.round||0)+":"+(st.eliminated_device||"");
    kind=st.eliminated_device===deviceId?"lose":"win";
  }else if(st.phase==="finished"){
    key="finished:"+room.id+":"+(st.round||0)+":"+(st.winner_device||"");
    kind=st.winner_device===deviceId?"win":"lose";
  }

  if(key && key!==lastTimerSoundKey){
    lastTimerSoundKey=key;
    playTimerSound(kind);
  }
}

root?.addEventListener("pointerdown",()=>{
  if(timerSoundEnabled) ensureGameAudio();
},{passive:true});

function escapeHtml(value=""){
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

function timerName(){
  const input=document.getElementById("timerPlayerName");
  const name=(input?.value || localStorage.getItem(TIMER_NAME_KEY) || "").trim().slice(0,24);
  if(name) localStorage.setItem(TIMER_NAME_KEY,name);
  return name;
}

async function fetchRoomById(id){
  const {data,error}=await supabase.from("game_rooms").select("*").eq("id",id).single();
  if(error) throw error;
  return data;
}

async function loadTimerPlayers(){
  if(!room || room.game_type!=="timer" || room.localTimer) return;
  const {data,error}=await supabase.from("timer_players")
    .select("room_id,device_id,display_name,eliminated,stop_ms,joined_at")
    .eq("room_id",room.id)
    .order("joined_at",{ascending:true});
  if(!error) timerPlayers=data||[];
}

function timerPlayer(device){
  return timerPlayers.find(p=>p.device_id===device);
}

function timerActivePlayers(){
  return timerPlayers.filter(p=>!p.eliminated);
}

function timerMs(ms){
  return Number.isFinite(Number(ms)) ? (Number(ms)/1000).toFixed(3)+" s" : "—";
}

async function loadTimerLeaderboard(){
  const el=document.getElementById("timerLeaderboard");
  if(!el) return;
  try{
    const {data:week}=await supabase.rpc("timer_current_week_start");
    const current=String(week);
    const prevDate=new Date(current+"T00:00:00Z");
    prevDate.setUTCDate(prevDate.getUTCDate()-7);
    const previous=prevDate.toISOString().slice(0,10);

    const [{data:rows},{data:last},{data:kings}]=await Promise.all([
      supabase.from("timer_weekly_scores").select("display_name,wins,best_ms,week_start").eq("week_start",current).order("wins",{ascending:false}).order("best_ms",{ascending:true}).limit(8),
      supabase.from("timer_weekly_scores").select("display_name,wins,week_start").eq("week_start",previous).order("wins",{ascending:false}).order("best_ms",{ascending:true}).limit(1),
      supabase.from("timer_profiles").select("display_name,power,crowns").order("power",{ascending:false}).limit(3)
    ]);

    const ranking=(rows||[]).map((r,i)=>`<div class="timer-rank-row"><span>${i+1}. ${escapeHtml(r.display_name)}</span><strong>🏆 ${r.wins}</strong></div>`).join("");
    const lastChampion=last?.[0] ? `<div class="timer-champion">🏆 ${tr("lastChampion")}: <strong>${escapeHtml(last[0].display_name)}</strong></div>` : "";
    const kingRows=(kings||[]).map((r,i)=>`<div class="timer-rank-row"><span>${i===0?"👑":"⚡"} ${escapeHtml(r.display_name)}</span><strong>${tr("power")}: ${r.power}</strong></div>`).join("");

    el.innerHTML=`
      <h3>🏆 ${tr("weekly")}</h3>
      ${lastChampion}
      <div class="timer-ranking">${ranking || "—"}</div>
      <h3>👑 ${tr("king")}</h3>
      <div class="timer-ranking">${kingRows || "—"}</div>`;
  }catch(error){
    console.warn("Timer leaderboard",error);
  }
}

function roomCode(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}

function chessInitial(){
  return {board:[
    ["br","bn","bb","bq","bk","bb","bn","br"],
    ["bp","bp","bp","bp","bp","bp","bp","bp"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["wp","wp","wp","wp","wp","wp","wp","wp"],
    ["wr","wn","wb","wq","wk","wb","wn","wr"]
  ],turn:"w",winner:null};
}

const M_POS=[[.08,.08],[.5,.08],[.92,.08],[.22,.22],[.5,.22],[.78,.22],[.36,.36],[.5,.36],[.64,.36],[.08,.5],[.22,.5],[.36,.5],[.64,.5],[.78,.5],[.92,.5],[.36,.64],[.5,.64],[.64,.64],[.22,.78],[.5,.78],[.78,.78],[.08,.92],[.5,.92],[.92,.92]];
const M_LINES=[[0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]];
const M_EDGES=[[0,1],[1,2],[0,9],[2,14],[3,4],[4,5],[3,10],[5,13],[6,7],[7,8],[6,11],[8,12],[9,10],[10,11],[12,13],[13,14],[15,16],[16,17],[15,11],[17,12],[18,19],[19,20],[18,10],[20,13],[21,22],[22,23],[21,9],[23,14],[7,4],[4,1],[16,19],[19,22]];
function morrisInitial(){ return {board:Array(24).fill(null),turn:"w",placed:{w:0,b:0},winner:null,mustRemove:false}; }

function myColor(){
  if(!room) return null;
  return room.player1_device===deviceId ? "w" : room.player2_device===deviceId ? "b" : null;
}

function renderLobby(msg=""){
  if(aiTimer){ clearTimeout(aiTimer); aiTimer=null; }
  room=null; selected=null;
  root.innerHTML=`
    <div class="games-shell">
      <section class="card games-lobby">
        <h2>🎮 ${tr("games")}</h2>
        <p class="muted">${tr("choose")}</p>
        <div class="games-choice">
          <button class="game-choice ${selectedType==="chess"?"active":""}" data-game="chess">♟️ ${tr("chess")}</button>
          <button class="game-choice ${selectedType==="morris"?"active":""}" data-game="morris">⭕ ${tr("morris")}</button>
          <button class="game-choice ${selectedType==="timer"?"active":""}" data-game="timer">⏱️ ${tr("timer")}</button>
        </div>

        ${selectedType==="timer" ? `
          <input id="timerPlayerName" type="text" maxlength="24" placeholder="${tr("playerName")}" value="${escapeHtml(localStorage.getItem(TIMER_NAME_KEY)||"")}">
          <button id="timerSoloGame" class="primary" type="button">${tr("soloTimer")}</button>
          <div class="game-help">👥 ${tr("maxPlayers")} · 🔒 ${tr("hiddenTime")}</div>
        ` : `<button id="computerGame" class="primary" type="button">🤖 ${tr("computer")}</button>`}

        <div class="game-help">🌐 ${tr("online")}</div>
        <button id="createGame" class="secondary" type="button">${tr("create")}</button>
        <div class="game-join-row">
          <input id="joinCode" type="text" maxlength="8" placeholder="${tr("code")}">
          <button id="joinGame" class="secondary" type="button">${tr("join")}</button>
        </div>
        <div id="gameMessage" class="message">${msg}</div>
      </section>
      ${selectedType==="timer" ? `<section id="timerLeaderboard" class="card timer-leaderboard"><div class="muted">${tr("weekly")}…</div></section>` : ""}
    </div>`;
  if(selectedType==="timer") loadTimerLeaderboard();
  root.querySelectorAll("[data-game]").forEach(btn=>btn.onclick=()=>{selectedType=btn.dataset.game;renderLobby();});
  const computerButton=document.getElementById("computerGame");
  if(computerButton) computerButton.onclick=startComputerGame;
  const timerName=document.getElementById("timerPlayerName");
  if(timerName) timerName.addEventListener("input",()=>localStorage.setItem(TIMER_NAME_KEY,timerName.value.trim()));
  const timerSoloButton=document.getElementById("timerSoloGame");
  if(timerSoloButton) timerSoloButton.onclick=startTimerSoloGame;
  document.getElementById("createGame").onclick=createRoom;
  document.getElementById("joinGame").onclick=joinRoom;
}

function startTimerSoloGame(){
  const name=timerName();
  lastTimerSoundKey="";
  if(!name){ renderLobby(tr("needName")); return; }

  if(channel){ supabase.removeChannel(channel); channel=null; }
  clearTimerPhaseTimeout();

  room={
    id:"local-timer",
    code:"AI",
    game_type:"timer",
    player1_device:deviceId,
    player2_device:"computer",
    state:{
      phase:"lobby",
      round:0,
      start_at:null,
      eliminated_device:null,
      winner_device:null,
      bot_stop_ms:null
    },
    status:"active",
    localTimer:true
  };

  timerPlayers=[
    {
      room_id:"local-timer",
      device_id:deviceId,
      display_name:name,
      eliminated:false,
      stop_ms:null,
      joined_at:new Date().toISOString()
    },
    {
      room_id:"local-timer",
      device_id:"computer",
      display_name:tr("computerName"),
      eliminated:false,
      stop_ms:null,
      joined_at:new Date(Date.now()+1).toISOString()
    }
  ];

  renderTimerRoom();
}

function startComputerGame(){
  if(selectedType==="timer") return;
  if(channel){ supabase.removeChannel(channel); channel=null; }
  if(aiTimer){ clearTimeout(aiTimer); aiTimer=null; }
  room={
    id:"local-computer",
    code:"AI",
    game_type:selectedType,
    player1_device:deviceId,
    player2_device:"computer",
    state:selectedType==="chess"?chessInitial():morrisInitial(),
    status:"active",
    local:true
  };
  selected=null;
  renderRoom();
}

function scheduleComputerTurn(){
  if(!room?.local || room.state?.winner || room.state?.turn!=="b") return;
  if(aiTimer) clearTimeout(aiTimer);
  aiTimer=setTimeout(()=>{
    aiTimer=null;
    if(!room?.local || room.state?.winner || room.state?.turn!=="b") return;
    if(room.game_type==="chess") computerChessMove();
    else computerMorrisMove();
  },650);
}

async function createRoom(){
  if(selectedType==="timer"){
    const name=timerName();
    if(!name){ renderLobby(tr("needName")); return; }
    for(let i=0;i<5;i++){
      const code=roomCode();
      const {data,error}=await supabase.rpc("timer_create_room",{p_code:code,p_device:deviceId,p_name:name});
      if(!error && data){
        const created=await fetchRoomById(data);
        await openRoom(created);
        return;
      }
    }
    renderLobby(tr("error"));
    return;
  }

  const state=selectedType==="chess"?chessInitial():morrisInitial();
  for(let i=0;i<5;i++){
    const code=roomCode();
    const {data,error}=await supabase.from("game_rooms").insert({code,game_type:selectedType,player1_device:deviceId,state,status:"waiting"}).select().single();
    if(!error){openRoom(data);return;}
  }
  renderLobby(tr("error"));
}

async function joinRoom(){
  const code=(document.getElementById("joinCode").value||"").trim().toUpperCase();
  if(!code)return;
  const {data,error}=await supabase.from("game_rooms").select("*").eq("code",code).maybeSingle();
  if(error||!data){document.getElementById("gameMessage").textContent=tr("invalid");return;}

  if(data.game_type==="timer"){
    const name=timerName();
    if(!name){ document.getElementById("gameMessage").textContent=tr("needName"); return; }
    const {data:roomId,error:joinError}=await supabase.rpc("timer_join_room",{p_code:code,p_device:deviceId,p_name:name});
    if(joinError){
      const raw=String(joinError.message||"");
      document.getElementById("gameMessage").textContent=
        raw.includes("ROOM_FULL") ? tr("full") :
        raw.includes("ROOM_LOCKED") ? tr("roomLocked") : tr("invalid");
      return;
    }
    const joined=await fetchRoomById(roomId);
    await openRoom(joined);
    return;
  }

  if(data.player1_device!==deviceId&&data.player2_device&&data.player2_device!==deviceId){document.getElementById("gameMessage").textContent=tr("full");return;}
  if(!data.player2_device&&data.player1_device!==deviceId){
    const {data:updated,error:uerr}=await supabase.from("game_rooms").update({player2_device:deviceId,status:"active",updated_at:new Date().toISOString()}).eq("id",data.id).select().single();
    if(uerr)return; openRoom(updated); return;
  }
  openRoom(data);
}

async function openRoom(r){
  room=r; selected=null;
  if(room.game_type==="timer") lastTimerSoundKey="";
  if(room.game_type==="timer") await loadTimerPlayers();
  subscribeRoom();
  renderRoom();
}

function subscribeRoom(){
  if(room?.localTimer) return;
  if(channel)supabase.removeChannel(channel);
  channel=supabase.channel("game-"+room.id)
    .on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_rooms",filter:"id=eq."+room.id},async payload=>{
      room=payload.new; selected=null;
      if(room.game_type==="timer") await loadTimerPlayers();
      renderRoom();
    })
    .on("postgres_changes",{event:"*",schema:"public",table:"timer_players",filter:"room_id=eq."+room.id},async ()=>{
      if(room?.game_type!=="timer") return;
      await loadTimerPlayers();
      renderRoom();
    })
    .subscribe();
}

async function saveState(state,status=room.status){
  room.state=state; room.status=status;

  if(room.local){
    renderRoom();
    scheduleComputerTurn();
    return;
  }

  const {data,error}=await supabase.from("game_rooms").update({state,status,updated_at:new Date().toISOString()}).eq("id",room.id).select().single();
  if(!error)room=data;
}

function statusText(){
  const s=room.state||{};
  if(s.winner){ const name=s.winner==="w"?tr("white"):tr("black"); return `${tr("gameOver")} · ${tr("winner")}: ${name}`; }
  if(room.local && s.turn==="b") return tr("computerThinking");
  return s.turn===myColor()?tr("yourTurn"):tr("opponentTurn");
}

function renderRoom(){
  if(!room)return renderLobby();
  if(room.game_type==="timer"){ renderTimerRoom(); return; }
  const waiting=!room.player2_device;
  const local=!!room.local;
  root.innerHTML=`
    <div class="games-shell">
      <section class="card">
        <div class="game-room-head">
          <div>
            <div class="muted small">${local ? "🤖 "+tr("computerName") : tr("room")}</div>
            <div class="game-room-code">${local ? (room.game_type==="chess"?"♟️ "+tr("chess"):"⭕ "+tr("morris")) : room.code}</div>
          </div>
          ${local ? "" : `<button id="copyRoom" class="secondary" type="button">${tr("copy")}</button>`}
        </div>
        <div class="game-status">${waiting?tr("waiting"):statusText()}</div>
        <div class="game-meta-grid">
          <div class="game-meta-box">⚪ ${tr("white")}: ✓</div>
          <div class="game-meta-box">⚫ ${tr("black")}: ${local ? "🤖 "+tr("computerName") : (room.player2_device===deviceId?"✓":room.player2_device?"●":"…")}</div>
        </div>
      </section>
      <section class="card">
        <div class="game-board-wrap" id="gameBoard"></div>
        <div class="game-help">${room.game_type==="chess"?tr("helpChess"):tr("helpMorris")}</div>
        <div class="game-actions">
          ${local ? `<button id="newComputerGame" class="primary" type="button">${tr("newGame")}</button>` : ""}
          <button id="leaveGame" class="secondary" type="button">${tr("leave")}</button>
        </div>
      </section>
    </div>`;
  const copyButton=document.getElementById("copyRoom");
  if(copyButton) copyButton.onclick=async()=>{await navigator.clipboard.writeText(room.code);copyButton.textContent=tr("copied");};
  const newButton=document.getElementById("newComputerGame");
  if(newButton) newButton.onclick=startComputerGame;
  document.getElementById("leaveGame").onclick=()=>{if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}if(channel)supabase.removeChannel(channel);channel=null;renderLobby();};
  if(room.game_type==="chess")renderChess(myColor());else renderMorris(myColor());
  scheduleComputerTurn();
}

function clearTimerPhaseTimeout(){
  if(timerPhaseTimeout){ clearTimeout(timerPhaseTimeout); timerPhaseTimeout=null; }
}

function scheduleTimerPhaseRender(){
  clearTimerPhaseTimeout();
  const start=room?.state?.start_at ? new Date(room.state.start_at).getTime() : 0;
  if(!start) return;
  const delay=start-Date.now();
  if(delay>0 && delay<15000){
    timerPhaseTimeout=setTimeout(()=>{
      timerPhaseTimeout=null;
      if(room?.game_type==="timer"){
        playTimerSound("start");
        lastTimerSoundKey="start:"+room.id+":"+(room.state?.round||0);
        renderTimerRoom();
      }
    },delay+30);
  }
}

function renderTimerRoom(){
  clearTimerPhaseTimeout();
  const st=room.state||{};
  const phase=st.phase||"lobby";
  const active=timerActivePlayers();
  const me=timerPlayer(deviceId);
  const host=room.player1_device===deviceId;
  const localTimer=!!room.localTimer;
  const startAt=st.start_at ? new Date(st.start_at).getTime() : 0;
  const started=startAt && Date.now()>=startAt;
  const canStop=phase==="countdown" && started && me && !me.eliminated && me.stop_ms==null;
  const waitingForStart=phase==="countdown" && !started;
  const opponents=timerPlayers.filter(p=>p.device_id!==deviceId);

  const meCard=me ? `
    <div class="timer-face-card me ${me.eliminated?"eliminated":""}">
      <div class="timer-avatar">${escapeHtml(timerInitials(me.display_name))}</div>
      <div class="timer-face-name">${escapeHtml(me.display_name)}</div>
      <div class="timer-face-label">👤 ${tr("you")}</div>
    </div>` : "";

  const opponentCards=opponents.map(p=>`
    <div class="timer-face-card opponent ${p.eliminated?"eliminated":""}">
      <div class="timer-avatar">${p.device_id==="computer"?"🤖":escapeHtml(timerInitials(p.display_name))}</div>
      <div class="timer-face-name">${escapeHtml(p.display_name)}</div>
      <div class="timer-face-label">${p.eliminated?"❌ "+tr("eliminated"):"🟢 "+tr("active")}</div>
    </div>`).join("");

  const versusHtml=`
    <div class="timer-versus">
      <div class="timer-versus-side">${meCard}</div>
      <div class="timer-vs">VS</div>
      <div class="timer-opponents">
        <div class="timer-opponents-title">${tr("opponents")}</div>
        <div class="timer-opponent-grid">${opponentCards || "—"}</div>
      </div>
    </div>`;

  let center="";
  if(phase==="lobby"){
    center=`
      <div class="secret-clock">🔒 ---.--- s</div>
      <div class="timer-big-message">${active.length<2 ? tr("needPlayers") : tr("hiddenTime")}</div>
      ${host && active.length>=2 ? `<button id="startTimerRound" class="timer-start-button" type="button">▶️ ${tr("startRound")}</button>` : ""}
    `;
  }else if(phase==="countdown"){
    center=`
      <div class="secret-clock">🔒 ---.--- s</div>
      <div class="timer-big-message">${waitingForStart ? tr("ready") : (me?.eliminated ? tr("youEliminated") : me?.stop_ms!=null ? tr("stopped") : tr("hiddenTime"))}</div>
      ${canStop ? `<button id="timerStopButton" class="timer-stop-button" type="button">${tr("stop")}</button>` : ""}
    `;
  }else if(phase==="results"){
    const out=timerPlayer(st.eliminated_device);
    center=`
      <div class="timer-big-message">❌ ${out ? escapeHtml(out.display_name)+" "+tr("eliminated") : tr("gameOver")}</div>
      ${host && active.length>=2 ? `<button id="startTimerRound" class="timer-start-button" type="button">▶️ ${tr("startRound")}</button>` : ""}
    `;
  }else if(phase==="finished"){
    const winner=timerPlayer(st.winner_device);
    center=`
      <div class="timer-crown">👑</div>
      <div class="timer-big-message">${tr("king")}</div>
      <div class="timer-winner-name">${winner ? escapeHtml(winner.display_name) : ""}</div>
      ${localTimer ? `<div class="game-help">${tr("practiceOnly")}</div>` : `<div class="timer-power-win">⚡ +10 ${tr("power")}</div>`}
      <button id="timerBackGames" class="secondary" type="button">${tr("backGames")}</button>
    `;
  }

  const revealTimes=phase==="results" || phase==="finished";
  const playersHtml=timerPlayers.map((p,i)=>{
    const eliminated=p.eliminated;
    const time=revealTimes && p.stop_ms!=null ? `<span class="timer-result-time">${timerMs(p.stop_ms)}</span>` : "";
    return `<div class="timer-player-row ${eliminated?"eliminated":""}">
      <span><strong>${i+1}. ${escapeHtml(p.display_name)}</strong> ${p.device_id===deviceId?"👤":""}</span>
      <span>${eliminated?"❌":"🟢"} ${time}</span>
    </div>`;
  }).join("");

  root.innerHTML=`
    <div class="games-shell">
      <section class="card timer-room-card">
        <div class="game-room-head">
          <div>
            <div class="muted small">${localTimer ? "🤖 "+tr("computerName") : tr("room")+" · "+tr("players")+" "+timerPlayers.length+"/8"}</div>
            <div class="game-room-code">${localTimer ? "⏱️ "+tr("timer") : room.code}</div>
          </div>
          ${localTimer ? "" : `<button id="copyRoom" class="secondary" type="button">${tr("copy")}</button>`}
        </div>
        <div class="timer-round-line">
          <div class="timer-round-label">⏱️ ${tr("timer")} · ${tr("round")} ${st.round||0}</div>
          <button id="timerSoundButton" class="secondary timer-sound-button" type="button">${timerSoundEnabled?tr("soundOn"):tr("soundOff")}</button>
        </div>
        ${versusHtml}
        <div class="timer-center">${center}</div>
      </section>

      <section class="card">
        <h3>👥 ${tr("players")}</h3>
        <div class="timer-player-list">${playersHtml}</div>
      </section>

      ${localTimer ? `<section class="card"><div class="game-help">${tr("practiceOnly")}</div></section>` : `<section id="timerRoomLeaderboard" class="card timer-leaderboard"></section>`}

      <div class="game-actions">
        <button id="leaveGame" class="secondary" type="button">${tr("leave")}</button>
      </div>
    </div>`;

  const soundButton=document.getElementById("timerSoundButton");
  if(soundButton) soundButton.onclick=async()=>{
    setTimerSound(!timerSoundEnabled);
    renderTimerRoom();
  };

  const copy=document.getElementById("copyRoom");
  if(copy) copy.onclick=async()=>{ await navigator.clipboard.writeText(room.code); copy.textContent=tr("copied"); };

  const start=document.getElementById("startTimerRound");
  if(start) start.onclick=startTimerRound;

  const stop=document.getElementById("timerStopButton");
  if(stop) stop.onclick=stopTimer;

  const back=document.getElementById("timerBackGames");
  if(back) back.onclick=()=>{ if(channel)supabase.removeChannel(channel); channel=null; room=null; renderLobby(); };

  const leave=document.getElementById("leaveGame");
  if(leave) leave.onclick=()=>{ clearTimerPhaseTimeout(); if(channel)supabase.removeChannel(channel); channel=null; room=null; renderLobby(); };

  if(waitingForStart) scheduleTimerPhaseRender();
  maybePlayTimerStateSound(st,started);
  if(!localTimer) loadTimerLeaderboardInto("timerRoomLeaderboard");
}

async function startTimerRound(){
  const button=document.getElementById("startTimerRound");
  if(button) button.disabled=true;
  await ensureGameAudio();

  if(room?.localTimer){
    const delay=1800+Math.floor(Math.random()*3200);
    const startAt=Date.now()+delay;
    const botStop=650+Math.floor(Math.random()*2850);

    for(const player of timerPlayers){
      player.eliminated=false;
      player.stop_ms=null;
    }

    room.state={
      phase:"countdown",
      round:(room.state?.round||0)+1,
      start_at:new Date(startAt).toISOString(),
      eliminated_device:null,
      winner_device:null,
      bot_stop_ms:botStop
    };
    renderTimerRoom();
    return;
  }

  try{
    const {error}=await supabase.rpc("timer_start_round",{p_room:room.id,p_device:deviceId});
    if(error) throw error;
    room=await fetchRoomById(room.id);
    await loadTimerPlayers();
    renderTimerRoom();
  }catch(error){
    console.warn("timer start",error);
    if(button) button.disabled=false;
  }
}

async function stopTimer(){
  const button=document.getElementById("timerStopButton");
  if(button) button.disabled=true;
  playTimerSound("stop");

  if(room?.localTimer){
    const startAt=new Date(room.state.start_at).getTime();
    if(!startAt || Date.now()<startAt){
      if(button) button.disabled=false;
      return;
    }

    const human=Math.max(0,Date.now()-startAt);
    const bot=Number(room.state.bot_stop_ms)||1500;
    const me=timerPlayer(deviceId);
    const computer=timerPlayer("computer");

    if(me) me.stop_ms=human;
    if(computer) computer.stop_ms=bot;

    const humanWins=human<=bot;
    const winner=humanWins?deviceId:"computer";
    const loser=humanWins?"computer":deviceId;

    if(me) me.eliminated=!humanWins;
    if(computer) computer.eliminated=humanWins;

    room.state={
      ...room.state,
      phase:"finished",
      eliminated_device:loser,
      winner_device:winner
    };
    renderTimerRoom();
    return;
  }

  try{
    const {error}=await supabase.rpc("timer_submit_stop",{p_room:room.id,p_device:deviceId});
    if(error) throw error;
    room=await fetchRoomById(room.id);
    await loadTimerPlayers();
    renderTimerRoom();
  }catch(error){
    console.warn("timer stop",error);
    if(button) button.disabled=false;
  }
}

async function loadTimerLeaderboardInto(id){
  const el=document.getElementById(id);
  if(!el) return;
  try{
    const {data:kings}=await supabase.from("timer_profiles").select("display_name,power,crowns").order("power",{ascending:false}).limit(5);
    if(!document.getElementById(id)) return;
    el.innerHTML=`<h3>👑 ${tr("king")}</h3><div class="timer-ranking">${(kings||[]).map((r,i)=>`
      <div class="timer-rank-row"><span>${i===0?"👑":"⚡"} ${escapeHtml(r.display_name)}</span><strong>${tr("power")}: ${r.power}</strong></div>`).join("") || "—"}</div>`;
  }catch(error){ console.warn(error); }
}

const C_SYM={wp:"♙",wr:"♖",wn:"♘",wb:"♗",wq:"♕",wk:"♔",bp:"♟",br:"♜",bn:"♞",bb:"♝",bq:"♛",bk:"♚"};

function chessMoves(board,r,c){
  const p=board[r][c]; if(!p)return [];
  const col=p[0],type=p[1],out=[];
  const add=(rr,cc)=>{if(rr<0||rr>7||cc<0||cc>7)return false;const q=board[rr][cc];if(!q){out.push([rr,cc]);return true;}if(q[0]!==col)out.push([rr,cc]);return false;};
  if(type==="p"){
    const d=col==="w"?-1:1,start=col==="w"?6:1;
    if(r+d>=0&&r+d<8&&!board[r+d][c]){out.push([r+d,c]);if(r===start&&!board[r+2*d][c])out.push([r+2*d,c]);}
    for(const dc of [-1,1]){const rr=r+d,cc=c+dc;if(rr>=0&&rr<8&&cc>=0&&cc<8&&board[rr][cc]&&board[rr][cc][0]!==col)out.push([rr,cc]);}
  } else if(type==="n"){
    for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])add(r+dr,c+dc);
  } else if(type==="k"){
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc)add(r+dr,c+dc);
  } else {
    const dirs=type==="b"?[[-1,-1],[-1,1],[1,-1],[1,1]]:type==="r"?[[-1,0],[1,0],[0,-1],[0,1]]:[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
    for(const [dr,dc] of dirs){let rr=r+dr,cc=c+dc;while(add(rr,cc)){rr+=dr;cc+=dc;}}
  }
  return out;
}

function renderChess(color){
  const wrap=document.getElementById("gameBoard"),st=room.state;
  const board=document.createElement("div");board.className="chess-board";
  const targets=selected?chessMoves(st.board,...selected):[];
  for(let vr=0;vr<8;vr++)for(let vc=0;vc<8;vc++){
    const r=color==="b"?7-vr:vr,c=color==="b"?7-vc:vc;
    const sq=document.createElement("button");sq.className="chess-square "+((r+c)%2?"dark":"light");
    if(selected&&selected[0]===r&&selected[1]===c)sq.classList.add("selected");
    if(targets.some(x=>x[0]===r&&x[1]===c))sq.classList.add("target");
    const p=st.board[r][c];
    if(p){const span=document.createElement("span");span.className="chess-piece "+(p[0]==="w"?"white":"black");span.textContent=C_SYM[p];sq.appendChild(span);}
    sq.onclick=()=>chessClick(r,c);board.appendChild(sq);
  }
  wrap.innerHTML="";wrap.appendChild(board);
}

async function chessClick(r,c){
  if(!room.player2_device||room.state.winner)return;
  const color=myColor();if(room.state.turn!==color)return;
  const b=room.state.board;
  if(!selected){if(b[r][c]&&b[r][c][0]===color){selected=[r,c];renderRoom();}return;}
  if(b[r][c]&&b[r][c][0]===color){selected=[r,c];renderRoom();return;}
  const moves=chessMoves(b,...selected);
  if(!moves.some(x=>x[0]===r&&x[1]===c)){selected=null;renderRoom();return;}
  const nb=b.map(row=>row.slice());
  let piece=nb[selected[0]][selected[1]],captured=nb[r][c];
  nb[selected[0]][selected[1]]=null;if(piece[1]==="p"&&(r===0||r===7))piece=piece[0]+"q";nb[r][c]=piece;
  const ns={...room.state,board:nb,turn:color==="w"?"b":"w"};if(captured&&captured[1]==="k")ns.winner=color;
  selected=null;await saveState(ns,"active");if(!room.local)renderRoom();
}

function computerChessMove(){
  if(!room?.local || room.game_type!=="chess" || room.state.turn!=="b" || room.state.winner) return;

  const st=structuredClone(room.state);
  const candidates=[];
  const values={p:1,n:3,b:3,r:5,q:9,k:50};

  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=st.board[r][c];
    if(!p || p[0]!=="b") continue;
    for(const [rr,cc] of chessMoves(st.board,r,c)){
      const captured=st.board[rr][cc];
      let score=(captured ? (values[captured[1]]||0)*20 : 0);
      score += (3.5-Math.abs(3.5-rr)) + (3.5-Math.abs(3.5-cc));
      score += Math.random()*3;
      candidates.push({r,c,rr,cc,score});
    }
  }

  if(!candidates.length){
    st.winner="w";
    room.state=st;
    renderRoom();
    return;
  }

  candidates.sort((a,b)=>b.score-a.score);
  const pick=candidates[Math.floor(Math.random()*Math.min(3,candidates.length))];
  let piece=st.board[pick.r][pick.c];
  const captured=st.board[pick.rr][pick.cc];
  st.board[pick.r][pick.c]=null;
  if(piece[1]==="p" && pick.rr===7) piece="bq";
  st.board[pick.rr][pick.cc]=piece;
  if(captured && captured[1]==="k") st.winner="b";
  st.turn="w";
  room.state=st;
  renderRoom();
}

function adjacent(a,b){return M_EDGES.some(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));}
function formsMill(board,pos,color){return M_LINES.some(line=>line.includes(pos)&&line.every(i=>board[i]===color));}
function allInMill(board,color){const ps=board.map((v,i)=>v===color?i:-1).filter(i=>i>=0);return ps.length&&ps.every(i=>formsMill(board,i,color));}
function countPieces(board,color){return board.filter(x=>x===color).length;}

function renderMorris(){
  const wrap=document.getElementById("gameBoard"),st=room.state,board=document.createElement("div");board.className="morris-board";
  for(const [a,b] of M_EDGES){
    const [x1,y1]=M_POS[a],[x2,y2]=M_POS[b],dx=(x2-x1)*100,dy=(y2-y1)*100,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;
    const line=document.createElement("div");line.className="morris-line";line.style.left=(x1*100)+"%";line.style.top=(y1*100)+"%";line.style.width=len+"%";line.style.transform=`rotate(${ang}deg)`;board.appendChild(line);
  }
  for(let i=0;i<24;i++){
    const btn=document.createElement("button");btn.className="morris-point";if(st.board[i])btn.classList.add(st.board[i]==="w"?"white":"black");if(selected===i)btn.classList.add("selected");
    btn.style.left=(M_POS[i][0]*100)+"%";btn.style.top=(M_POS[i][1]*100)+"%";btn.onclick=()=>morrisClick(i);board.appendChild(btn);
  }
  wrap.innerHTML="";wrap.appendChild(board);
}

async function morrisClick(pos){
  if(!room.player2_device||room.state.winner)return;
  const color=myColor(),other=color==="w"?"b":"w",st=structuredClone(room.state);if(st.turn!==color)return;
  if(st.mustRemove){
    if(st.board[pos]!==other)return;if(formsMill(st.board,pos,other)&&!allInMill(st.board,other))return;
    st.board[pos]=null;st.mustRemove=false;st.turn=other;if(st.placed[other]>=9&&countPieces(st.board,other)<3)st.winner=color;
    selected=null;await saveState(st,"active");if(!room.local)renderRoom();return;
  }
  if(st.placed[color]<9){
    if(st.board[pos])return;st.board[pos]=color;st.placed[color]++;if(formsMill(st.board,pos,color))st.mustRemove=true;else st.turn=other;
    await saveState(st,"active");if(!room.local)renderRoom();return;
  }
  if(selected===null){if(st.board[pos]===color){selected=pos;renderRoom();}return;}
  if(st.board[pos]===color){selected=pos;renderRoom();return;}
  if(st.board[pos]!==null){selected=null;renderRoom();return;}
  const flying=countPieces(st.board,color)===3;if(!flying&&!adjacent(selected,pos))return;
  st.board[selected]=null;st.board[pos]=color;if(formsMill(st.board,pos,color))st.mustRemove=true;else st.turn=other;
  selected=null;await saveState(st,"active");if(!room.local)renderRoom();
}

function bestMorrisPlacement(st,color){
  const other=color==="w"?"b":"w";
  const empty=st.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);

  for(const pos of empty){
    const b=st.board.slice(); b[pos]=color;
    if(formsMill(b,pos,color)) return pos;
  }
  for(const pos of empty){
    const b=st.board.slice(); b[pos]=other;
    if(formsMill(b,pos,other)) return pos;
  }
  return empty[Math.floor(Math.random()*empty.length)];
}

function computerMorrisMove(){
  if(!room?.local || room.game_type!=="morris" || room.state.turn!=="b" || room.state.winner) return;

  const st=structuredClone(room.state);
  const color="b", other="w";

  if(st.mustRemove){
    let targets=st.board.map((v,i)=>v===other?i:-1).filter(i=>i>=0);
    const nonMill=targets.filter(i=>!formsMill(st.board,i,other));
    if(nonMill.length) targets=nonMill;
    const pos=targets[Math.floor(Math.random()*targets.length)];
    if(pos!==undefined) st.board[pos]=null;
    st.mustRemove=false;
    st.turn=other;
    if(st.placed[other]>=9 && countPieces(st.board,other)<3) st.winner=color;
    room.state=st;
    renderRoom();
    return;
  }

  if(st.placed[color]<9){
    const pos=bestMorrisPlacement(st,color);
    if(pos===undefined) return;
    st.board[pos]=color;
    st.placed[color]++;
    if(formsMill(st.board,pos,color)){
      st.mustRemove=true;
      room.state=st;
      renderRoom();
      scheduleComputerTurn();
      return;
    }
    st.turn=other;
    room.state=st;
    renderRoom();
    return;
  }

  const pieces=st.board.map((v,i)=>v===color?i:-1).filter(i=>i>=0);
  const flying=pieces.length===3;
  const moves=[];

  for(const from of pieces){
    const targets=st.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0 && (flying || adjacent(from,i)));
    for(const to of targets){
      const b=st.board.slice();
      b[from]=null; b[to]=color;
      let score=formsMill(b,to,color)?100:0;
      score+=Math.random()*5;
      moves.push({from,to,score});
    }
  }

  if(!moves.length){
    st.winner="w";
    room.state=st;
    renderRoom();
    return;
  }

  moves.sort((a,b)=>b.score-a.score);
  const pick=moves[0];
  st.board[pick.from]=null;
  st.board[pick.to]=color;

  if(formsMill(st.board,pick.to,color)){
    st.mustRemove=true;
    room.state=st;
    renderRoom();
    scheduleComputerTurn();
    return;
  }

  st.turn=other;
  room.state=st;
  renderRoom();
}

function activate(){
  if(tabLabel)tabLabel.textContent=tr("games");
  if(room)renderRoom();else renderLobby();
}

window.PajazitiGames={activate};
if(tabLabel)tabLabel.textContent=tr("games");
