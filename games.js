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
const TETRIS_NAME_KEY = "pajaziti-tetris-name";
const TETRIS_SOUND_KEY = "pajaziti-tetris-sound";
const WAR_SOUND_KEY = "pajaziti-war-sound";
const WAR_WINS_KEY = "pajaziti-war-wins";
const WAR_GAMES_KEY = "pajaziti-war-games";
const WAR_BONUS_HEARTS_KEY = "pajaziti-war-bonus-hearts";
const WAR_NAME_KEY = "pajaziti-war-name";

let deviceId = localStorage.getItem(DEVICE_KEY);
if (!deviceId) {
  deviceId = globalThis.crypto?.randomUUID?.() || ("device_" + Date.now() + Math.random().toString(36).slice(2));
  localStorage.setItem(DEVICE_KEY, deviceId);
}

const TXT = {
  sq:{games:"Lojëra",online:"Luaj online",computer:"Luaj me kompjuter",computerName:"Kompjuteri",computerThinking:"Kompjuteri po mendon…",newGame:"Lojë e re",chess:"Shah",morris:"Degërxhik",timer:"Kral i Sekondave",tetris:"Blloqe",war:"Luftra",choose:"Zgjidh lojën",playerName:"Emri yt",needName:"Shkruaj emrin tënd.",needPlayers:"Duhet të jenë së paku 2 lojtarë.",ready:"Bëhu gati…",hiddenTime:"Sekondat janë të fshehura",stop:"STOP",stopped:"E ndale! Prit lojtarët e tjerë…",round:"Raundi",startRound:"Fillo raundin",eliminated:"u eliminua",king:"Kral i lojës",power:"Fuqi",weekly:"Renditja javore",lastChampion:"Kampioni i javës së kaluar",wins:"Fitore",players:"Lojtarë",maxPlayers:"2–8 lojtarë",roomLocked:"Loja ka filluar; nuk mund të hyjnë lojtarë të rinj.",youEliminated:"Je eliminuar. Shiko deri në fund.",backGames:"Kthehu te lojërat",soloTimer:"🤖 Luaj vetë",practiceOnly:"Stërvitje kundër kompjuterit — nuk hyn në renditjen javore.",you:"Ti",opponents:"Kundërshtarët",active:"Në lojë",soundOn:"🔊 Zëri ON",soundOff:"🔇 Zëri OFF",create:"Krijo dhomë",code:"Kodi i dhomës",join:"Hyr në dhomë",waiting:"Duke pritur lojtarin e dytë…",yourTurn:"Radha jote",opponentTurn:"Radha e kundërshtarit",white:"Bardhë",black:"Zi",leave:"Dil nga loja",room:"Dhoma",copy:"Kopjo kodin",copied:"Kodi u kopjua",invalid:"Kodi nuk u gjet.",full:"Dhoma është e mbushur.",gameOver:"Loja përfundoi",winner:"Fituesi",helpChess:"Prek figurën tënde, pastaj katrorin ku dëshiron ta lëvizësh.",helpMorris:"Në fillim vendos 9 gurët. Kur krijon treshe, hiq një gur të kundërshtarit.",error:"Gabim"},
  de:{games:"Spiele",online:"Online spielen",computer:"Gegen Computer",computerName:"Computer",computerThinking:"Computer denkt…",newGame:"Neues Spiel",chess:"Schach",morris:"Degërxhik",timer:"Sekundenkönig",tetris:"Blloqe",war:"Krieg",choose:"Spiel wählen",playerName:"Dein Name",needName:"Gib deinen Namen ein.",needPlayers:"Mindestens 2 Spieler sind nötig.",ready:"Mach dich bereit…",hiddenTime:"Die Sekunden sind verborgen",stop:"STOP",stopped:"Gestoppt! Warte auf die anderen…",round:"Runde",startRound:"Runde starten",eliminated:"ist ausgeschieden",king:"König des Spiels",power:"Stärke",weekly:"Wochenrangliste",lastChampion:"Champion der letzten Woche",wins:"Siege",players:"Spieler",maxPlayers:"2–8 Spieler",roomLocked:"Das Spiel hat begonnen; neue Spieler können nicht mehr beitreten.",youEliminated:"Du bist ausgeschieden. Schau bis zum Ende zu.",backGames:"Zurück zu den Spielen",soloTimer:"🤖 Alleine spielen",practiceOnly:"Training gegen den Computer — zählt nicht für die Wochenrangliste.",you:"Du",opponents:"Gegner",active:"Im Spiel",soundOn:"🔊 Ton AN",soundOff:"🔇 Ton AUS",create:"Raum erstellen",code:"Raumcode",join:"Raum beitreten",waiting:"Warte auf den zweiten Spieler…",yourTurn:"Du bist am Zug",opponentTurn:"Gegner ist am Zug",white:"Weiß",black:"Schwarz",leave:"Spiel verlassen",room:"Raum",copy:"Code kopieren",copied:"Code kopiert",invalid:"Code nicht gefunden.",full:"Raum ist voll.",gameOver:"Spiel beendet",winner:"Gewinner",helpChess:"Tippe deine Figur an und danach das Zielfeld.",helpMorris:"Setze zuerst deine 9 Steine. Bei einer Dreierreihe darfst du einen gegnerischen Stein entfernen.",error:"Fehler"},
  tr:{games:"Oyunlar",online:"Çevrimiçi oyna",computer:"Bilgisayara karşı oyna",computerName:"Bilgisayar",computerThinking:"Bilgisayar düşünüyor…",newGame:"Yeni oyun",chess:"Satranç",morris:"Dokuz Taş",timer:"Saniye Kralı",tetris:"Blloqe",war:"Savaş",choose:"Oyun seç",playerName:"Adın",needName:"Adını yaz.",needPlayers:"En az 2 oyuncu gerekli.",ready:"Hazır ol…",hiddenTime:"Saniyeler gizli",stop:"STOP",stopped:"Durdurdun! Diğer oyuncuları bekle…",round:"Tur",startRound:"Turu başlat",eliminated:"elendi",king:"Oyunun kralı",power:"Güç",weekly:"Haftalık sıralama",lastChampion:"Geçen haftanın şampiyonu",wins:"Galibiyet",players:"Oyuncular",maxPlayers:"2–8 oyuncu",roomLocked:"Oyun başladı; yeni oyuncu katılamaz.",youEliminated:"Elendin. Sonuna kadar izleyebilirsin.",backGames:"Oyunlara dön",soloTimer:"🤖 Tek başına oyna",practiceOnly:"Bilgisayara karşı antrenman — haftalık sıralamaya sayılmaz.",you:"Sen",opponents:"Rakipler",active:"Oyunda",soundOn:"🔊 Ses AÇIK",soundOff:"🔇 Ses KAPALI",create:"Oda oluştur",code:"Oda kodu",join:"Odaya katıl",waiting:"İkinci oyuncu bekleniyor…",yourTurn:"Sıra sende",opponentTurn:"Sıra rakipte",white:"Beyaz",black:"Siyah",leave:"Oyundan çık",room:"Oda",copy:"Kodu kopyala",copied:"Kod kopyalandı",invalid:"Kod bulunamadı.",full:"Oda dolu.",gameOver:"Oyun bitti",winner:"Kazanan",helpChess:"Kendi taşına, sonra gitmek istediğin kareye dokun.",helpMorris:"Önce 9 taşını yerleştir. Üçlü yaptığında rakibin bir taşını kaldırabilirsin.",error:"Hata"}
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
let tetrisSoundEnabled=localStorage.getItem(TETRIS_SOUND_KEY)!=="off";
let warSoundEnabled=localStorage.getItem(WAR_SOUND_KEY)!=="off";

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

function tetrisTone(frequency,duration=0.08,delay=0,type="square",gainValue=0.07){
  if(!tetrisSoundEnabled) return;
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

function playTetrisSound(kind){
  if(!tetrisSoundEnabled) return;
  if(kind==="move"){
    tetrisTone(180,0.035,0,"square",0.03);
  }else if(kind==="rotate"){
    tetrisTone(300,0.05,0,"square",0.04);
    tetrisTone(420,0.05,0.04,"square",0.035);
  }else if(kind==="drop"){
    tetrisTone(150,0.05,0,"sawtooth",0.05);
    tetrisTone(110,0.07,0.04,"sawtooth",0.045);
  }else if(kind==="line"){
    tetrisTone(523,0.08,0,"square",0.06);
    tetrisTone(659,0.08,0.08,"square",0.06);
    tetrisTone(784,0.12,0.16,"square",0.07);
  }else if(kind==="gameover"){
    tetrisTone(330,0.12,0,"sawtooth",0.06);
    tetrisTone(247,0.15,0.12,"sawtooth",0.06);
    tetrisTone(165,0.24,0.27,"sawtooth",0.06);
  }else if(kind==="start"){
    tetrisTone(440,0.07,0,"square",0.05);
    tetrisTone(660,0.07,0.08,"square",0.05);
    tetrisTone(880,0.12,0.16,"square",0.06);
  }
}

function setTetrisSound(enabled){
  tetrisSoundEnabled=!!enabled;
  localStorage.setItem(TETRIS_SOUND_KEY,tetrisSoundEnabled?"on":"off");
  if(tetrisSoundEnabled){
    ensureGameAudio();
    playTetrisSound("rotate");
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

root?.addEventListener("pointerdown",(event)=>{
  if(timerSoundEnabled) ensureGameAudio();
  if(warSoundEnabled && event.target?.closest?.(".war-shell")){
    // Android/PWA: audio must be unlocked directly from a user gesture.
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(AudioCtx && !gameAudioContext) gameAudioContext=new AudioCtx();
      if(gameAudioContext?.state==="suspended") gameAudioContext.resume().catch(()=>{});
    }catch(_){}
  }
},{passive:true,capture:true});

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



let warProfile=null;
let warLeaderboardRows=[];
let warChampion=null;

async function loadWarProfileAndLeaderboard(){
  const info=document.getElementById("warNameInfo");
  const board=document.getElementById("warLeaderboard");
  try{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return;

    const {data:profile}=await supabase
      .from("war_profiles")
      .select("device_id,display_name,rename_count")
      .eq("device_id",deviceId)
      .maybeSingle();

    if(profile){
      warProfile=profile;
      localStorage.setItem(WAR_NAME_KEY,profile.display_name);
      const input=document.getElementById("warPlayerName");
      if(input) input.value=profile.display_name;
      if(info) info.textContent="Emrin mund ta ndryshosh edhe "+Math.max(0,2-Number(profile.rename_count||0))+" herë.";
    }else if(info){
      info.textContent="Vendose emrin. Pas krijimit mund ta ndryshosh vetëm 2 herë.";
    }

    const {data:weekKey}=await supabase.rpc("war_week_key",{});
    if(!weekKey) return;

    const previous=new Date(String(weekKey)+"T00:00:00Z");
    previous.setUTCDate(previous.getUTCDate()-7);
    const prevKey=previous.toISOString().slice(0,10);

    const [{data:rows},{data:previousRows}]=await Promise.all([
      supabase.from("war_weekly_scores")
        .select("display_name,points,device_id")
        .eq("week_key",weekKey)
        .order("points",{ascending:false})
        .order("updated_at",{ascending:true})
        .limit(10),
      supabase.from("war_weekly_scores")
        .select("display_name,points")
        .eq("week_key",prevKey)
        .order("points",{ascending:false})
        .order("updated_at",{ascending:true})
        .limit(1)
    ]);

    warLeaderboardRows=rows||[];
    warChampion=previousRows?.[0]||null;

    if(board){
      board.innerHTML=`
        <h3>🏆 Rekordi javor</h3>
        <div class="war-week-note">Fituesi shpallet çdo të diel në ora 23:00.</div>
        ${warChampion?`<div class="war-champion">👑 Fituesi i javës së kaluar: <strong>${escapeHtml(warChampion.display_name)}</strong> — ${warChampion.points} pikë</div>`:""}
        <div class="war-ranking">
          ${warLeaderboardRows.length?warLeaderboardRows.map((row,i)=>`
            <div class="war-rank-row">
              <span>${i+1}. ${escapeHtml(row.display_name)}</span>
              <strong>${row.points} pikë</strong>
            </div>`).join(""):'<div class="muted">Ende nuk ka fitore këtë javë.</div>'}
        </div>`;
    }
  }catch(error){
    console.warn("War profile/leaderboard",error);
    if(board) board.innerHTML='<div class="muted">Rekordi javor nuk u ngarkua.</div>';
  }
}

async function saveWarProfile(){
  const input=document.getElementById("warPlayerName");
  const name=(input?.value||localStorage.getItem(WAR_NAME_KEY)||"").trim().slice(0,20);
  if(name.length<2){
    throw new Error("Emri duhet të ketë së paku 2 shkronja.");
  }
  const {data,error}=await supabase.rpc("war_set_profile",{p_device:deviceId,p_name:name});
  if(error){
    const raw=String(error.message||error);
    if(raw.includes("RENAME_LIMIT")) throw new Error("Emrin e ke ndryshuar 2 herë. Nuk mund ta ndryshosh më.");
    throw error;
  }
  warProfile=data?.[0]||warProfile;
  localStorage.setItem(WAR_NAME_KEY,name);
  return warProfile;
}

async function awardWarWeeklyPoint(){
  try{
    const {error}=await supabase.rpc("war_award_win",{p_device:deviceId});
    if(error) throw error;
    loadWarProfileAndLeaderboard().catch(()=>{});
  }catch(error){
    console.warn("War weekly point",error);
  }
}

let warGameState=null;

const WAR_SPECIALS=[
  {key:"bomb",label:"Bombë",icon:"💣",weight:50,small:"2 sulme"},
  {key:"heart",label:"Zemër",icon:"❤️",weight:20,small:"+2 ty · +1 kundërshtarit"},
  {key:"helicopter",label:"Helikopter",icon:"🚁",weight:1,small:"−2 ❤️ · gjuan prapë"},
  {key:"atom",label:"Atom",icon:"☢️",weight:2,small:"−3 ❤️"},
  {key:"protect",label:"Mbrojtje",icon:"🛡️",weight:5,small:"mbron 2 herë"},
  {key:"azrael",label:"Melaqja Asrail",icon:"👼",weight:1,small:"KO pa mbrojtje"},
  {key:"ice",label:"Akull",icon:"🧊",weight:26,small:"arma tjetër bëhet Sulm"}
];

function warWins(){
  const value=Number(localStorage.getItem(WAR_WINS_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}

function warGames(){
  const value=Number(localStorage.getItem(WAR_GAMES_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}

function warBonusExpiries(){
  let list=[];
  try{
    const raw=JSON.parse(localStorage.getItem(WAR_BONUS_HEARTS_KEY)||"[]");
    if(Array.isArray(raw)) list=raw.map(Number).filter(Number.isFinite);
  }catch(_){}
  const now=Date.now();
  const active=list.filter(expiry=>expiry>now);
  if(active.length!==list.length){
    localStorage.setItem(WAR_BONUS_HEARTS_KEY,JSON.stringify(active));
  }
  return active;
}

function warBonusHeartCount(){
  return warBonusExpiries().length;
}

function warAdd24HourHeart(){
  const list=warBonusExpiries();
  list.push(Date.now()+24*60*60*1000);
  localStorage.setItem(WAR_BONUS_HEARTS_KEY,JSON.stringify(list));
}

function warRollSpecial(){
  const total=WAR_SPECIALS.reduce((sum,item)=>sum+item.weight,0);
  let roll=Math.random()*total;
  for(const item of WAR_SPECIALS){
    roll-=item.weight;
    if(roll<0) return item.key;
  }
  return "bomb";
}

function warSpecial(key){
  return WAR_SPECIALS.find(item=>item.key===key)||WAR_SPECIALS[0];
}

function warInitialState(){
  const bonus=warBonusHeartCount();
  const maxHp=5+bonus;
  const playerName=warProfile?.display_name||localStorage.getItem(WAR_NAME_KEY)||tr("you");
  return {
    player:{name:playerName,hp:maxHp,maxHp,protect:0,frozen:false,special:warRollSpecial()},
    enemy:{name:tr("computerName"),hp:5,maxHp:5,protect:0,frozen:false,special:warRollSpecial()},
    turn:"player",
    over:false,
    gameCounted:false,
    message:bonus>0
      ? "Ke "+bonus+" zemër bonus aktive për 24 orë."
      : "Zgjidh njërën nga 2 armët."
  };
}

function warHearts(current,max=5){
  const full=Math.max(0,Math.min(max,Math.round(current)));
  return Array.from({length:max},(_,i)=>
    `<span class="war-heart ${i<full?"full":"empty"}" aria-hidden="true">${i<full?"❤️":"🖤"}</span>`
  ).join("");
}

function warBlockWeapon(target){
  if((target.protect||0)<=0) return false;
  target.protect=Math.max(0,target.protect-1);
  return true;
}

function warDamage(target,hearts,{bypassProtection=false}={}){
  if(!bypassProtection && warBlockWeapon(target)){
    return {damage:0,blocked:true};
  }
  const damage=Math.max(0,Math.min(target.hp,Math.round(hearts)));
  target.hp=Math.max(0,target.hp-damage);
  return {damage,blocked:false};
}

function warBombDamage(target){
  let total=0;
  let blocked=0;
  for(let i=0;i<2;i++){
    const hit=warDamage(target,1);
    if(hit.blocked) blocked++;
    total+=hit.damage;
    if(target.hp<=0) break;
  }
  return {damage:total,blocked};
}

function warRecordCompletedGame(won){
  const s=warGameState;
  if(!s || s.gameCounted) return {games:warGames(),bonusAdded:false};
  s.gameCounted=true;

  const games=warGames()+1;
  localStorage.setItem(WAR_GAMES_KEY,String(games));

  if(won){
    localStorage.setItem(WAR_WINS_KEY,String(warWins()+1));
  }

  let bonusAdded=false;
  if(games%20===0){
    warAdd24HourHeart();
    bonusAdded=true;
  }
  return {games,bonusAdded};
}

function warActionCard(action){
  if(action==="attack"){
    return '<button data-war-action="attack" type="button">🔫<strong>Sulm</strong><small>−1 ❤️</small></button>';
  }
  const item=warSpecial(action);
  return `<button data-war-action="${item.key}" type="button">${item.icon}<strong>${item.label}</strong><small>${item.small}</small></button>`;
}

function renderWarGame(){
  if(!warGameState) warGameState=warInitialState();
  const s=warGameState;
  const p=s.player;
  const e=s.enemy;
  const games=warGames();
  const wins=warWins();
  const activeBonus=warBonusHeartCount();

  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena">
        <div class="war-topbar">
          <button id="warBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>⚔️ ${tr("war")}</strong>
          <span class="war-turn">${s.over?"FUND":(s.turn==="player"?"RADHA JOTE":"KUNDËRSHTARI")}</span>
          <button id="warSoundToggle" class="war-sound-toggle" type="button">${warSoundEnabled?"🔊 Zëri ON":"🔇 Zëri OFF"}</button>
          <span id="warAudioStatus" class="war-audio-status"></span>
        </div>

        <article class="war-fighter war-enemy-card">
          <div class="war-fighter-head">
            <div>
              <span class="war-side-label">KUNDËRSHTARI</span>
              <h2>🤖 ${escapeHtml(e.name)}</h2>
            </div>
            <div class="war-status-icons">
              ${e.protect>0?`<span>🛡️×${e.protect}</span>`:""}
              ${e.frozen?"<span>🧊</span>":""}
            </div>
          </div>
          <div class="war-hearts" aria-label="${e.hp} zemra">${warHearts(e.hp,e.maxHp)}</div>
        </article>

        <div class="war-middle">
          <div id="warBattleScene" class="war-battle-scene" aria-hidden="true">
            <div class="war-shooter war-shooter-enemy">
              <span class="war-person">🧍</span>
              <span class="war-gun">🔫</span>
            </div>
            <div class="war-shot-lane">
              <span id="warProjectile" class="war-projectile">•</span>
              <span id="warExplosion" class="war-explosion">💥</span>
            </div>
            <div class="war-shooter war-shooter-player">
              <span class="war-person">🧍</span>
              <span class="war-gun">🔫</span>
            </div>
          </div>
          <div class="war-vs">VS</div>
          <p id="warMessage" class="war-message">${escapeHtml(s.message)}</p>
        </div>

        <article class="war-fighter war-player-card">
          <div class="war-fighter-head">
            <div>
              <span class="war-side-label">TI</span>
              <h2>🇦🇱 ${escapeHtml(p.name)}</h2>
            </div>
            <div class="war-progress">
              <strong>🏆 ${wins} fitore</strong>
              <small>🎮 ${games} lojëra · ❤️ bonus: ${activeBonus}</small>
            </div>
          </div>
          <div class="war-hearts" aria-label="${p.hp} zemra">${warHearts(p.hp,p.maxHp)}</div>
          <div class="war-status-icons">
            ${p.protect>0?`<span>🛡️ Mbrojtje ×${p.protect}</span>`:""}
            ${p.frozen?"<span>🧊 Akull: arma tjetër bëhet Sulm</span>":""}
          </div>
        </article>

        <div class="war-actions">
          ${warActionCard("attack")}
          ${warActionCard(p.special)}
        </div>

        ${s.over?'<button id="warRestart" class="primary war-restart" type="button">🔄 Luaj përsëri</button>':""}
      </section>
    </div>`;

  document.getElementById("warSoundToggle")?.addEventListener("click",async()=>{
    warSoundEnabled=!warSoundEnabled;
    localStorage.setItem(WAR_SOUND_KEY,warSoundEnabled?"on":"off");
    if(warSoundEnabled){
      await ensureWarAudio();
      playWarSound("attack");
    }
    renderWarGame();
  });

  document.getElementById("warBack").onclick=()=>{
    warGameState=null;
    renderLobby();
  };

  document.getElementById("warRestart")?.addEventListener("click",()=>{
    warGameState=warInitialState();
    renderWarGame();
  });

  root.querySelectorAll("[data-war-action]").forEach(btn=>{
    btn.disabled=s.over||s.turn!=="player";
    btn.onclick=()=>warPlayerAction(btn.dataset.warAction);
  });
}

async function startWarGame(){
  const button=document.getElementById("warGame");
  if(button) button.disabled=true;
  try{
    await saveWarProfile();
    warGameState=warInitialState();
    renderWarGame();
  }catch(error){
    const info=document.getElementById("warNameInfo");
    if(info){
      info.textContent=error?.message||"Nuk u ruajt useri.";
      info.classList.add("error");
    }
  }finally{
    if(button) button.disabled=false;
  }
}

function warFinishIfNeeded(){
  const s=warGameState;
  if(!s) return false;

  if(s.enemy.hp<=0){
    s.over=true;
    s.turn="none";
    const result=warRecordCompletedGame(true);
    awardWarWeeklyPoint();
    s.message="🏆 Fitove luftën! +1 pikë në rekordin javor.";
    if(result.bonusAdded){
      s.message+=" ❤️ Arrite "+result.games+" lojëra: fitove +1 zemër për 24 orë.";
    }
    return true;
  }

  if(s.player.hp<=0){
    s.over=true;
    s.turn="none";
    const result=warRecordCompletedGame(false);
    s.message="💥 Kundërshtari fitoi.";
    if(result.bonusAdded){
      s.message+=" ❤️ Arrite "+result.games+" lojëra: fitove +1 zemër për 24 orë.";
    }
    return true;
  }

  return false;
}

async function ensureWarAudio(){
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

function warNoise(ctx,{delay=0,duration=.12,gain=.5,filterType="lowpass",frequency=1800}={}){
  const start=ctx.currentTime+delay;
  const length=Math.max(1,Math.floor(ctx.sampleRate*duration));
  const buffer=ctx.createBuffer(1,length,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<length;i++){
    const decay=1-(i/length);
    data[i]=(Math.random()*2-1)*decay;
  }
  const src=ctx.createBufferSource();
  const filter=ctx.createBiquadFilter();
  const amp=ctx.createGain();
  src.buffer=buffer;
  filter.type=filterType;
  filter.frequency.setValueAtTime(frequency,start);
  amp.gain.setValueAtTime(.0001,start);
  amp.gain.exponentialRampToValueAtTime(Math.max(.001,gain),start+.004);
  amp.gain.exponentialRampToValueAtTime(.0001,start+duration);
  src.connect(filter);
  filter.connect(amp);
  amp.connect(ctx.destination);
  src.start(start);
  src.stop(start+duration+.02);
}

function warLowBoom(ctx,{delay=0,duration=.28,startFreq=120,endFreq=42,gain=.55}={}){
  const start=ctx.currentTime+delay;
  const osc=ctx.createOscillator();
  const amp=ctx.createGain();
  osc.type="sine";
  osc.frequency.setValueAtTime(startFreq,start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),start+duration);
  amp.gain.setValueAtTime(.0001,start);
  amp.gain.exponentialRampToValueAtTime(gain,start+.008);
  amp.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(start);
  osc.stop(start+duration+.03);
}

const warMediaUrls={};

function warWavUrl(kind){
  if(warMediaUrls[kind]) return warMediaUrls[kind];

  const sampleRate=22050;
  const duration=kind==="rocket" ? .85 : kind==="tank" ? .62 : kind==="attack" ? .18 : .24;
  const samples=Math.floor(sampleRate*duration);
  const bytes=new ArrayBuffer(44+samples*2);
  const view=new DataView(bytes);

  function text4(offset,text){
    for(let i=0;i<4;i++) view.setUint8(offset+i,text.charCodeAt(i));
  }
  text4(0,"RIFF");
  view.setUint32(4,36+samples*2,true);
  text4(8,"WAVE");
  text4(12,"fmt ");
  view.setUint32(16,16,true);
  view.setUint16(20,1,true);
  view.setUint16(22,1,true);
  view.setUint32(24,sampleRate,true);
  view.setUint32(28,sampleRate*2,true);
  view.setUint16(32,2,true);
  view.setUint16(34,16,true);
  text4(36,"data");
  view.setUint32(40,samples*2,true);

  for(let i=0;i<samples;i++){
    const t=i/sampleRate;
    const x=i/samples;
    let v=0;

    if(kind==="attack"){
      const crack=(Math.random()*2-1)*Math.pow(1-x,5);
      const boom=Math.sin(2*Math.PI*(115-65*x)*t)*Math.exp(-28*t);
      v=.86*crack+.52*boom;
    }else if(kind==="tank"){
      const blast=(Math.random()*2-1)*Math.exp(-7*t);
      const low=Math.sin(2*Math.PI*(82-42*x)*t)*Math.exp(-4.5*t);
      const metal=Math.sin(2*Math.PI*420*t)*Math.exp(-10*t);
      v=.48*blast+.78*low+.12*metal;
    }else if(kind==="rocket"){
      if(t<.24){
        const launch=(Math.random()*2-1)*(.3+.5*(t/.24));
        const whine=Math.sin(2*Math.PI*(260+900*t)*t);
        v=.34*launch+.18*whine;
      }else{
        const bt=t-.24;
        const blast=(Math.random()*2-1)*Math.exp(-5*bt);
        const low=Math.sin(2*Math.PI*(72-35*(bt/.61))*bt)*Math.exp(-3.2*bt);
        v=.62*blast+.82*low;
      }
    }else if(kind==="defend"){
      v=.28*Math.sin(2*Math.PI*(260+520*x)*t)*Math.exp(-5*t);
    }else if(kind==="medkit"){
      const f=x<.33?520:x<.66?660:820;
      v=.22*Math.sin(2*Math.PI*f*t)*Math.exp(-2.5*t);
    }

    v=Math.max(-1,Math.min(1,v));
    view.setInt16(44+i*2,Math.round(v*32767),true);
  }

  const blob=new Blob([bytes],{type:"audio/wav"});
  warMediaUrls[kind]=URL.createObjectURL(blob);
  return warMediaUrls[kind];
}

function playWarWebAudio(kind){
  ensureWarAudio().then(ctx=>{
    if(!ctx) return;
    if(kind==="attack"){
      warNoise(ctx,{duration:.075,gain:.72,filterType:"highpass",frequency:900});
      warLowBoom(ctx,{duration:.11,startFreq:150,endFreq:58,gain:.42});
      warNoise(ctx,{delay:.055,duration:.055,gain:.28,filterType:"bandpass",frequency:2200});
    }else if(kind==="tank"){
      warNoise(ctx,{duration:.18,gain:.75,filterType:"lowpass",frequency:1500});
      warLowBoom(ctx,{duration:.48,startFreq:105,endFreq:30,gain:.78});
      warNoise(ctx,{delay:.08,duration:.30,gain:.30,filterType:"lowpass",frequency:650});
    }else if(kind==="rocket"){
      warNoise(ctx,{duration:.28,gain:.38,filterType:"bandpass",frequency:1100});
      warLowBoom(ctx,{delay:.23,duration:.58,startFreq:92,endFreq:24,gain:.86});
      warNoise(ctx,{delay:.23,duration:.38,gain:.82,filterType:"lowpass",frequency:1200});
    }else if(kind==="defend"){
      const now=ctx.currentTime;
      const osc=ctx.createOscillator();
      const amp=ctx.createGain();
      osc.type="triangle";
      osc.frequency.setValueAtTime(260,now);
      osc.frequency.exponentialRampToValueAtTime(780,now+.16);
      amp.gain.setValueAtTime(.0001,now);
      amp.gain.exponentialRampToValueAtTime(.18,now+.02);
      amp.gain.exponentialRampToValueAtTime(.0001,now+.20);
      osc.connect(amp); amp.connect(ctx.destination);
      osc.start(now); osc.stop(now+.22);
    }else if(kind==="medkit"){
      const now=ctx.currentTime;
      [520,660,820].forEach((f,i)=>{
        const osc=ctx.createOscillator();
        const amp=ctx.createGain();
        osc.type="sine";
        osc.frequency.value=f;
        const t=now+i*.07;
        amp.gain.setValueAtTime(.0001,t);
        amp.gain.exponentialRampToValueAtTime(.12,t+.01);
        amp.gain.exponentialRampToValueAtTime(.0001,t+.08);
        osc.connect(amp); amp.connect(ctx.destination);
        osc.start(t); osc.stop(t+.10);
      });
    }
  });
}

function playWarSound(kind){
  if(!warSoundEnabled) return;
  try{
    const audio=new Audio(warWavUrl(kind));
    audio.preload="auto";
    audio.volume=1;
    audio.muted=false;
    audio.playsInline=true;
    const promise=audio.play();
    if(promise?.catch){
      promise.catch(error=>{
        console.warn("War HTMLAudio blocked, using WebAudio fallback",error);
        playWarWebAudio(kind);
        const status=document.getElementById("warAudioStatus");
        if(status) status.textContent="⚠️ Audio u bllokua nga telefoni — po përdor fallback.";
      });
    }
  }catch(error){
    console.warn("War audio failed",error);
    playWarWebAudio(kind);
  }

  if(kind==="attack" && navigator.vibrate) navigator.vibrate(28);
  if(kind==="tank" && navigator.vibrate) navigator.vibrate([55,25,85]);
  if(kind==="rocket" && navigator.vibrate) navigator.vibrate([45,120,110]);
}

function warSoundForAction(action){
  if(action==="bomb"||action==="atom"||action==="azrael") return "rocket";
  if(action==="helicopter") return "attack";
  if(action==="heart") return "medkit";
  if(action==="protect"||action==="ice") return "defend";
  return "attack";
}

function warExecuteAction(actor,target,action,isPlayer){
  if(actor.frozen){
    actor.frozen=false;
    action="attack";
  }

  playWarSound(warSoundForAction(action));
  let extraTurn=false;
  let text="";

  if(action==="attack"){
    const hit=warDamage(target,1);
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Sulmin."
      : "🔫 Sulm: −"+hit.damage+" ❤️.";
  }else if(action==="bomb"){
    const hit=warBombDamage(target);
    text=hit.damage>0
      ? "💣 Bombë: "+hit.damage+" zemra u humbën."
      : "🛡️ Mbrojtja bllokoi Bombën.";
  }else if(action==="heart"){
    actor.hp=Math.min(actor.maxHp,actor.hp+2);
    target.hp=Math.min(target.maxHp,target.hp+1);
    text="❤️ Zemër: +2 ty dhe +1 kundërshtarit.";
  }else if(action==="helicopter"){
    const hit=warDamage(target,2);
    extraTurn=true;
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Helikopterin, por ti gjuan përsëri."
      : "🚁 Helikopter: −"+hit.damage+" ❤️ dhe ti gjuan përsëri.";
  }else if(action==="atom"){
    const hit=warDamage(target,3);
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Atomin."
      : "☢️ Atom: −"+hit.damage+" ❤️.";
  }else if(action==="protect"){
    actor.protect=2;
    text="🛡️ Mbrojtje aktive për 2 armë.";
  }else if(action==="azrael"){
    if(warBlockWeapon(target)){
      text="🛡️ Mbrojtja të shpëtoi nga Melaqja Asrail.";
    }else{
      target.hp=0;
      text="👼 Melaqja Asrail: kundërshtari u eliminua menjëherë.";
    }
  }else if(action==="ice"){
    target.frozen=true;
    text="🧊 Akull: në radhën tjetër, çfarëdo arme që zgjedh bëhet vetëm Sulm.";
  }

  return {extraTurn,text};
}


function warAnimateAction(action,fromPlayer,done){
  const scene=document.getElementById("warBattleScene");
  const projectile=document.getElementById("warProjectile");
  const explosion=document.getElementById("warExplosion");
  if(!scene||!projectile||!explosion){
    done();
    return;
  }

  const shooter=scene.querySelector(fromPlayer?".war-shooter-player":".war-shooter-enemy");
  const target=scene.querySelector(fromPlayer?".war-shooter-enemy":".war-shooter-player");
  const visualAction=(action==="heart"||action==="protect"||action==="ice")?action:
    (action==="helicopter"?"helicopter":
    (action==="atom"?"atom":
    (action==="bomb"?"bomb":
    (action==="azrael"?"azrael":"attack"))));

  shooter?.classList.add("firing");
  target?.classList.remove("hit");
  projectile.className="war-projectile";
  explosion.className="war-explosion";
  projectile.textContent=visualAction==="helicopter"?"🚁":
    visualAction==="atom"?"☢️":
    visualAction==="bomb"?"💣":
    visualAction==="azrael"?"👼":
    visualAction==="ice"?"🧊":
    visualAction==="heart"?"❤️":
    visualAction==="protect"?"🛡️":"•";

  if(visualAction==="heart"||visualAction==="protect"){
    shooter?.classList.add(visualAction==="heart"?"healing":"guarding");
    setTimeout(()=>{
      shooter?.classList.remove("firing","healing","guarding");
      done();
    },420);
    return;
  }

  projectile.classList.add(fromPlayer?"fly-up":"fly-down",visualAction);
  setTimeout(()=>{
    explosion.textContent=visualAction==="ice"?"❄️":
      visualAction==="azrael"?"✨":
      visualAction==="helicopter"?"💥":
      visualAction==="atom"?"☢️":
      visualAction==="bomb"?"💥":"✴️";
    explosion.classList.add(fromPlayer?"at-top":"at-bottom","show");
    target?.classList.add("hit");
  },300);

  setTimeout(()=>{
    shooter?.classList.remove("firing");
    target?.classList.remove("hit");
    projectile.className="war-projectile";
    explosion.className="war-explosion";
    done();
  },620);
}

function warPlayerAction(action){
  const s=warGameState;
  if(!s||s.over||s.turn!=="player") return;

  s.turn="animating";
  root.querySelectorAll("[data-war-action]").forEach(btn=>btn.disabled=true);

  warAnimateAction(action,true,()=>{
    if(!warGameState||warGameState.over) return;
    const p=warGameState.player;
    const e=warGameState.enemy;
    const wasFrozen=p.frozen;
    const result=warExecuteAction(p,e,action,true);

    if(wasFrozen){
      warGameState.message="🧊 Ishe i ngrirë: arma u kthye në Sulm. "+result.text;
    }else{
      warGameState.message=result.text;
    }

    if(warFinishIfNeeded()) return renderWarGame();

    p.special=warRollSpecial();

    if(result.extraTurn){
      warGameState.turn="player";
      renderWarGame();
      return;
    }

    warGameState.turn="enemy";
    renderWarGame();
    setTimeout(warEnemyTurn,650);
  });
}

function warEnemyTurn(){
  const s=warGameState;
  if(!s||s.over||s.turn!=="enemy") return;

  const e=s.enemy;
  const p=s.player;
  const wasFrozen=e.frozen;
  const special=e.special||warRollSpecial();
  const chosen=Math.random()<.5?"attack":special;

  s.turn="animating";
  renderWarGame();

  setTimeout(()=>{
    warAnimateAction(chosen,false,()=>{
      if(!warGameState||warGameState.over) return;
      const result=warExecuteAction(e,p,chosen,false);

      if(wasFrozen){
        warGameState.message="🧊 Kundërshtari ishte i ngrirë: arma e tij u kthye në Sulm. "+result.text;
      }else{
        warGameState.message="🤖 "+result.text;
      }

      if(warFinishIfNeeded()) return renderWarGame();

      e.special=warRollSpecial();

      if(result.extraTurn){
        warGameState.turn="enemy";
        renderWarGame();
        setTimeout(warEnemyTurn,650);
        return;
      }

      warGameState.turn="player";
      renderWarGame();
    });
  },80);
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
          <button class="game-choice ${selectedType==="morris"?"active":""}" data-game="morris">🟣 ${tr("morris")}</button>
          <button class="game-choice ${selectedType==="timer"?"active":""}" data-game="timer">⏱️ ${tr("timer")}</button>
          <button class="game-choice ${selectedType==="tetris"?"active":""}" data-game="tetris">🧱 ${tr("tetris")}</button>
          <button class="game-choice ${selectedType==="war"?"active":""}" data-game="war">⚔️ ${tr("war")}</button>
        </div>

        ${selectedType==="timer" ? `
          <input id="timerPlayerName" type="text" maxlength="24" placeholder="${tr("playerName")}" value="${escapeHtml(localStorage.getItem(TIMER_NAME_KEY)||"")}">
          <button id="timerSoloGame" class="primary" type="button">${tr("soloTimer")}</button>
          <div class="game-help">👥 ${tr("maxPlayers")} · 🔒 ${tr("hiddenTime")}</div>
        ` : selectedType==="war" ? `
          <div class="war-user-setup">
            <label for="warPlayerName"><strong>👤 User</strong></label>
            <input id="warPlayerName" type="text" maxlength="20" placeholder="Emri i userit" value="${escapeHtml(localStorage.getItem(WAR_NAME_KEY)||"")}">
            <div id="warNameInfo" class="game-help">Emri mund të ndryshohet maksimum 2 herë.</div>
            <button id="warGame" class="primary" type="button">⚔️ Hyr në Luftra</button>
          </div>
          <section id="warLeaderboard" class="war-leaderboard"><div class="muted">🏆 Po ngarkohet rekordi javor…</div></section>
        ` : selectedType==="tetris" ? `
          <input id="tetrisPlayerName" type="text" maxlength="24" placeholder="${tr("playerName")}" value="${escapeHtml(localStorage.getItem(TETRIS_NAME_KEY)||"")}">
          <button id="tetrisGame" class="primary" type="button">🧱 ${tr("tetris")}</button>
          <div class="game-help">👆 Prek një herë ekranin = rrotullo · ✋ Mbaje të shtypur dhe tërhiqe = lëvize ku dëshiron</div>
          <section id="tetrisLobbyLeaderboard" class="tetris-leaderboard-mini"><div class="muted">🏆 Po ngarkohet renditja…</div></section>
        ` : `<button id="computerGame" class="primary" type="button">🤖 ${tr("computer")}</button>`}

        ${(selectedType==="tetris" || selectedType==="war") ? "" : `
          <div class="game-help">🌐 ${tr("online")}</div>
          <button id="createGame" class="secondary" type="button">${tr("create")}</button>
          <div class="game-join-row">
            <input id="joinCode" type="text" maxlength="8" placeholder="${tr("code")}">
            <button id="joinGame" class="secondary" type="button">${tr("join")}</button>
          </div>
        `}
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

  const tetrisNameInput=document.getElementById("tetrisPlayerName");
  if(tetrisNameInput){
    tetrisNameInput.addEventListener("input",()=>localStorage.setItem(TETRIS_NAME_KEY,tetrisNameInput.value.trim().slice(0,24)));
  }

  const tetrisButton=document.getElementById("tetrisGame");
  if(tetrisButton) tetrisButton.onclick=startTetrisGame;

  const warNameInput=document.getElementById("warPlayerName");
  if(warNameInput){
    warNameInput.addEventListener("input",()=>localStorage.setItem(WAR_NAME_KEY,warNameInput.value.trim().slice(0,20)));
  }
  const warButton=document.getElementById("warGame");
  if(warButton) warButton.onclick=startWarGame;
  if(selectedType==="war") loadWarProfileAndLeaderboard();

  const createButton=document.getElementById("createGame");
  if(createButton) createButton.onclick=createRoom;

  const joinButton=document.getElementById("joinGame");
  if(joinButton) joinButton.onclick=joinRoom;

  if(selectedType==="tetris") loadTetrisLeaderboard("tetrisLobbyLeaderboard");
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
    <div class="games-shell ${room.game_type==="morris"?"morris-game-shell":""}">
      <section class="card ${room.game_type==="morris"?"morris-player-card":""}">
        <div class="game-room-head">
          <div>
            <div class="muted small">${local ? "🤖 "+tr("computerName") : tr("room")}</div>
            <div class="game-room-code">${local ? (room.game_type==="chess"?"♟️ "+tr("chess"):"🟣 "+tr("morris")) : room.code}</div>
          </div>
          ${local ? "" : `<button id="copyRoom" class="secondary" type="button">${tr("copy")}</button>`}
        </div>
        <div class="game-status">${waiting?tr("waiting"):statusText()}</div>
        <div class="game-meta-grid">
          <div class="game-meta-box ${room.game_type==="morris"?"morris-player-white":""}">⚪ ${tr("white")}: ✓</div>
          <div class="game-meta-box ${room.game_type==="morris"?"morris-player-black":""}">⚫ ${tr("black")}: ${local ? "🤖 "+tr("computerName") : (room.player2_device===deviceId?"✓":room.player2_device?"●":"…")}</div>
        </div>
      </section>
      <section class="card ${room.game_type==="morris"?"morris-board-card":""}">
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
  wrap.classList.add("morris-board-wrap");
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


const TETRIS_COLS=10;
const TETRIS_ROWS=20;
const TETRIS_HIGH_KEY="pajaziti-tetris-high";
const TETROMINOES=[
  {name:"I",m:[[1,1,1,1]]},
  {name:"O",m:[[1,1],[1,1]]},
  {name:"T",m:[[0,1,0],[1,1,1]]},
  {name:"S",m:[[0,1,1],[1,1,0]]},
  {name:"Z",m:[[1,1,0],[0,1,1]]},
  {name:"J",m:[[1,0,0],[1,1,1]]},
  {name:"L",m:[[0,0,1],[1,1,1]]}
];
let tetris=null;
let tetrisTimer=null;
let tetrisKeyHandler=null;
let tetrisScoresChannel=null;

function startTetrisScoreRealtime(){
  if(tetrisScoresChannel) return;
  tetrisScoresChannel=supabase
    .channel("tetris-scores-live")
    .on("postgres_changes",{event:"*",schema:"public",table:"tetris_scores"},()=>{
      if(document.getElementById("tetrisLeaderboard")) loadTetrisLeaderboard();
      if(document.getElementById("tetrisLobbyLeaderboard")) loadTetrisLeaderboard("tetrisLobbyLeaderboard");
    })
    .subscribe();
}

function stopTetris(){
  if(tetrisTimer){ clearInterval(tetrisTimer); tetrisTimer=null; }
  if(tetrisKeyHandler){ document.removeEventListener("keydown",tetrisKeyHandler); tetrisKeyHandler=null; }
}

function tetrisPiece(){
  const p=TETROMINOES[Math.floor(Math.random()*TETROMINOES.length)];
  return {
    name:p.name,
    m:p.m.map(row=>row.slice()),
    x:Math.floor((TETRIS_COLS-p.m[0].length)/2),
    y:-1
  };
}

function tetrisRotate(matrix){
  return matrix[0].map((_,i)=>matrix.map(row=>row[i]).reverse());
}

function tetrisCollides(piece,dx=0,dy=0,matrix=piece.m){
  for(let r=0;r<matrix.length;r++){
    for(let c=0;c<matrix[r].length;c++){
      if(!matrix[r][c]) continue;
      const x=piece.x+c+dx;
      const y=piece.y+r+dy;
      if(x<0||x>=TETRIS_COLS||y>=TETRIS_ROWS) return true;
      if(y>=0 && tetris.board[y][x]) return true;
    }
  }
  return false;
}

function tetrisMerge(){
  const p=tetris.current;
  p.m.forEach((row,r)=>row.forEach((v,c)=>{
    if(!v) return;
    const y=p.y+r;
    const x=p.x+c;
    if(y>=0 && y<TETRIS_ROWS) tetris.board[y][x]=p.name;
  }));
}

function tetrisClearLines(){
  let cleared=0;
  for(let r=TETRIS_ROWS-1;r>=0;r--){
    if(tetris.board[r].every(Boolean)){
      tetris.board.splice(r,1);
      tetris.board.unshift(Array(TETRIS_COLS).fill(null));
      cleared++;
      r++;
    }
  }
  if(!cleared) return;
  playTetrisSound("line");
  const points=[0,100,300,500,800][cleared]||1200;
  tetris.lines+=cleared;
  tetris.score+=points*tetris.level;
  tetris.level=1+Math.floor(tetris.lines/10);
  const high=Math.max(Number(localStorage.getItem(TETRIS_HIGH_KEY)||0),tetris.score);
  localStorage.setItem(TETRIS_HIGH_KEY,String(high));
  tetrisRestartTimer();
}

function tetrisSpawn(){
  tetris.current=tetrisPiece();
  if(tetrisCollides(tetris.current,0,0)){
    tetris.gameOver=true;
    stopTetris();
    setTimeout(saveTetrisScore,0);
  }
}

function tetrisStep(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  if(!tetrisCollides(tetris.current,0,1)){
    tetris.current.y++;
  }else{
    tetrisMerge();
    tetrisClearLines();
    tetrisSpawn();
  }
  renderTetrisBoard();
}

function tetrisRestartTimer(){
  if(tetrisTimer) clearInterval(tetrisTimer);
  if(!tetris || tetris.paused || tetris.gameOver) return;
  const speed=Math.max(110,700-(tetris.level-1)*55);
  tetrisTimer=setInterval(tetrisStep,speed);
}

function tetrisMove(dx){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  if(!tetrisCollides(tetris.current,dx,0)) { tetris.current.x+=dx; playTetrisSound("move"); }
  renderTetrisBoard();
}

function tetrisSoftDrop(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  if(!tetrisCollides(tetris.current,0,1)){
    tetris.current.y++;
    tetris.score+=1;
  }else{
    tetrisStep();
    return;
  }
  renderTetrisBoard();
}

function tetrisHardDrop(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  let n=0;
  while(!tetrisCollides(tetris.current,0,1)){
    tetris.current.y++;
    n++;
  }
  tetris.score+=n*2;
  playTetrisSound("drop");
  tetrisMerge();
  tetrisClearLines();
  tetrisSpawn();
  renderTetrisBoard();
}

function tetrisTurn(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  const rotated=tetrisRotate(tetris.current.m);
  for(const kick of [0,-1,1,-2,2]){
    if(!tetrisCollides(tetris.current,kick,0,rotated)){
      tetris.current.x+=kick;
      tetris.current.m=rotated;
      playTetrisSound("rotate");
      break;
    }
  }
  renderTetrisBoard();
}

function tetrisPause(){
  if(!tetris || tetris.gameOver) return;
  tetris.paused=!tetris.paused;
  if(tetris.paused){
    if(tetrisTimer){clearInterval(tetrisTimer);tetrisTimer=null;}
  }else{
    tetrisRestartTimer();
  }
  renderTetrisBoard();
}

function renderTetrisBoard(){
  if(!tetris) return;
  const boardEl=document.getElementById("tetrisBoard");
  if(!boardEl) return;

  const visible=tetris.board.map(row=>row.slice());
  const p=tetris.current;
  if(p && !tetris.gameOver){
    p.m.forEach((row,r)=>row.forEach((v,c)=>{
      if(!v) return;
      const y=p.y+r,x=p.x+c;
      if(y>=0&&y<TETRIS_ROWS&&x>=0&&x<TETRIS_COLS) visible[y][x]=p.name;
    }));
  }

  boardEl.innerHTML=visible.flatMap((row,r)=>row.map((v,c)=>
    `<div class="tetris-cell${v?" filled piece-"+v:""}"></div>`
  )).join("");

  const score=document.getElementById("tetrisScore");
  const lines=document.getElementById("tetrisLines");
  const level=document.getElementById("tetrisLevel");
  const high=document.getElementById("tetrisHigh");
  if(score) score.textContent=String(tetris.score);
  if(lines) lines.textContent=String(tetris.lines);
  if(level) level.textContent=String(tetris.level);
  if(high) high.textContent=String(Math.max(Number(localStorage.getItem(TETRIS_HIGH_KEY)||0),tetris.score));

  const pause=document.getElementById("tetrisPause");
  if(pause) pause.textContent=tetris.paused?"▶️ Vazhdo":"⏸️ Pauzë";

  const overlay=document.getElementById("tetrisOverlay");
  if(overlay){
    overlay.classList.toggle("hidden",!tetris.gameOver&&!tetris.paused);
    overlay.innerHTML=tetris.gameOver
      ? `<div><strong>Game Over</strong><br><span>Score: ${tetris.score}</span></div>`
      : tetris.paused ? "<strong>Pauzë</strong>" : "";
  }
}

async function loadTetrisLeaderboard(targetId="tetrisLeaderboard"){
  const el=document.getElementById(targetId);
  if(!el) return;
  try{
    const {data,error}=await supabase
      .from("tetris_scores")
      .select("device_id,display_name,best_score,best_lines,updated_at")
      .order("best_score",{ascending:false})
      .order("best_lines",{ascending:false})
      .limit(20);
    if(error) throw error;
    if(!document.getElementById(targetId)) return;

    const rows=(data||[]).map((r,i)=>`
      <div class="tetris-rank-row">
        <span>${i===0?"👑":(i+1)+"."} ${escapeHtml(r.display_name)}</span>
        <strong>${r.best_score} pts · ${r.best_lines} lines</strong>
      </div>`).join("");

    el.innerHTML=`
      <h3>🏆 Rekordet Blloqe</h3>
      <div class="tetris-ranking">${rows || '<div class="muted">Ende nuk ka rezultate.</div>'}</div>`;
  }catch(error){
    console.warn("Blloqe leaderboard",error);
    if(document.getElementById(targetId)) el.innerHTML='<div class="muted">Renditja nuk u ngarkua.</div>';
  }
}

async function saveTetrisScore(){
  if(!tetris || !tetris.gameOver) return;

  const name=(localStorage.getItem(TETRIS_NAME_KEY)||"").trim().slice(0,24);
  if(!name) return;

  try{
    const {data:existing}=await supabase
      .from("tetris_scores")
      .select("best_score,best_lines")
      .eq("device_id",deviceId)
      .maybeSingle();

    const bestScore=Math.max(Number(existing?.best_score||0),Number(tetris.score||0));
    const bestLines=Math.max(
      Number(existing?.best_score||0)===bestScore ? Number(existing?.best_lines||0) : 0,
      Number(tetris.lines||0)
    );

    await supabase.from("tetris_scores").upsert({
      device_id:deviceId,
      display_name:name,
      best_score:bestScore,
      best_lines:bestLines,
      updated_at:new Date().toISOString()
    },{onConflict:"device_id"});

    await loadTetrisLeaderboard();
  }catch(error){
    console.warn("Blloqe score save",error);
  }
}

function setupTetrisTouchControls(){
  const board=document.getElementById("tetrisBoard");
  if(!board) return;

  let holdTimer=null;
  let holding=false;
  let moved=false;
  let startX=0;
  let startY=0;
  let lastX=0;
  let lastY=0;
  let activePointer=null;

  const clearHold=()=>{
    if(holdTimer){ clearTimeout(holdTimer); holdTimer=null; }
  };

  const movePieceToward=(clientX,clientY)=>{
    if(!tetris || tetris.paused || tetris.gameOver || !tetris.current) return;

    const rect=board.getBoundingClientRect();
    const cellW=rect.width/TETRIS_COLS;
    const cellH=rect.height/TETRIS_ROWS;
    const pieceWidth=tetris.current.m[0].length;

    const targetCol=Math.max(
      0,
      Math.min(
        TETRIS_COLS-pieceWidth,
        Math.round((clientX-rect.left)/cellW-pieceWidth/2)
      )
    );

    while(tetris.current.x<targetCol && !tetrisCollides(tetris.current,1,0)){
      tetris.current.x++;
      playTetrisSound("move");
    }
    while(tetris.current.x>targetCol && !tetrisCollides(tetris.current,-1,0)){
      tetris.current.x--;
      playTetrisSound("move");
    }

    const deltaY=clientY-lastY;
    if(deltaY>cellH*0.55){
      const steps=Math.min(6,Math.max(1,Math.floor(deltaY/cellH)));
      for(let i=0;i<steps;i++){
        if(tetrisCollides(tetris.current,0,1)) break;
        tetris.current.y++;
        tetris.score+=1;
      }
      lastY=clientY;
    }

    renderTetrisBoard();
  };

  board.addEventListener("pointerdown",(event)=>{
    if(!tetris || tetris.paused || tetris.gameOver) return;
    event.preventDefault();

    activePointer=event.pointerId;
    startX=lastX=event.clientX;
    startY=lastY=event.clientY;
    holding=false;
    moved=false;

    try{ board.setPointerCapture(event.pointerId); }catch(_){}

    clearHold();
    holdTimer=setTimeout(()=>{
      holding=true;
      board.classList.add("tetris-dragging");
      playTetrisSound("move");
      movePieceToward(lastX,lastY);
    },260);
  });

  board.addEventListener("pointermove",(event)=>{
    if(activePointer!==event.pointerId) return;
    lastX=event.clientX;

    if(Math.abs(event.clientX-startX)>8 || Math.abs(event.clientY-startY)>8){
      moved=true;
    }

    if(holding){
      event.preventDefault();
      movePieceToward(event.clientX,event.clientY);
    }
  });

  const finish=(event)=>{
    if(activePointer!==event.pointerId) return;
    event.preventDefault();
    clearHold();

    if(holding){
      movePieceToward(event.clientX,event.clientY);
    }else if(!moved){
      tetrisTurn();
    }

    holding=false;
    moved=false;
    activePointer=null;
    board.classList.remove("tetris-dragging");

    try{ board.releasePointerCapture(event.pointerId); }catch(_){}
  };

  board.addEventListener("pointerup",finish);
  board.addEventListener("pointercancel",(event)=>{
    if(activePointer!==event.pointerId) return;
    clearHold();
    holding=false;
    moved=false;
    activePointer=null;
    board.classList.remove("tetris-dragging");
  });

  board.addEventListener("contextmenu",(event)=>event.preventDefault());
}

async function enterTetrisFullscreen(){
  document.body.classList.add("tetris-fullscreen-active");
  try{
    const el=document.documentElement;
    if(!document.fullscreenElement && el.requestFullscreen){
      await el.requestFullscreen();
    }
  }catch(_){
    // CSS fullscreen fallback remains active when browser fullscreen is blocked.
  }
}

async function exitTetrisFullscreen(){
  document.body.classList.remove("tetris-fullscreen-active");
  try{
    if(document.fullscreenElement && document.exitFullscreen){
      await document.exitFullscreen();
    }
  }catch(_){}
}

function startTetrisGame(){
  enterTetrisFullscreen();
  const playerName=(document.getElementById("tetrisPlayerName")?.value || localStorage.getItem(TETRIS_NAME_KEY) || "").trim().slice(0,24);
  if(!playerName){ exitTetrisFullscreen(); renderLobby(tr("needName")); return; }
  localStorage.setItem(TETRIS_NAME_KEY,playerName);
  if(channel){supabase.removeChannel(channel);channel=null;}
  if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}
  stopTetris();
  room=null;
  selected=null;

  tetris={
    board:Array.from({length:TETRIS_ROWS},()=>Array(TETRIS_COLS).fill(null)),
    current:null,
    score:0,
    lines:0,
    level:1,
    paused:false,
    gameOver:false
  };
  tetrisSpawn();

  root.innerHTML=`
    <div class="games-shell tetris-shell">
      <section class="card tetris-card">
        <div class="game-room-head">
          <div>
            <div class="muted small">🧱</div>
            <div class="game-room-code">Blloqe</div>
          </div>
          <button id="tetrisBack" class="secondary" type="button">${tr("backGames")}</button>
        </div>

        <div class="tetris-stats">
          <div><span>Score</span><strong id="tetrisScore">0</strong></div>
          <div><span>Lines</span><strong id="tetrisLines">0</strong></div>
          <div><span>Level</span><strong id="tetrisLevel">1</strong></div>
          <div><span>Best</span><strong id="tetrisHigh">${localStorage.getItem(TETRIS_HIGH_KEY)||0}</strong></div>
        </div>

        <div class="tetris-board-wrap">
          <div id="tetrisBoard" class="tetris-board"></div>
          <div id="tetrisOverlay" class="tetris-overlay hidden"></div>
        </div>

        <div class="tetris-touch-help">👆 Prek 1 herë = rrotullo · ✋ Mbaje dhe tërhiqe = lëvize</div>\n\n        <div class="tetris-controls">
          <button type="button" data-tetris="left">⬅️</button>
          <button type="button" data-tetris="rotate">⤾</button>
          <button type="button" data-tetris="right">➡️</button>
          <button type="button" data-tetris="down">⬇️</button>
          <button type="button" data-tetris="drop">⏬</button>
        </div>

        <div class="tetris-actions">
          <button id="tetrisPause" class="secondary" type="button">⏸️ Pauzë</button>
          <button id="tetrisSound" class="secondary" type="button">${tetrisSoundEnabled?"🔊 Zëri ON":"🔇 Zëri OFF"}</button>
          <button id="tetrisNew" class="primary" type="button">🔄 ${tr("newGame")}</button>
        </div>

        <section id="tetrisLeaderboard" class="tetris-leaderboard">
          <div class="muted">🏆 Po ngarkohet renditja…</div>
        </section>
      </section>
    </div>`;

  document.getElementById("tetrisBack").onclick=async()=>{stopTetris();tetris=null;await exitTetrisFullscreen();renderLobby();};
  document.getElementById("tetrisPause").onclick=tetrisPause;
  const tetrisSoundBtn=document.getElementById("tetrisSound");
  if(tetrisSoundBtn) tetrisSoundBtn.onclick=()=>{ setTetrisSound(!tetrisSoundEnabled); tetrisSoundBtn.textContent=tetrisSoundEnabled?"🔊 Zëri ON":"🔇 Zëri OFF"; };
  document.getElementById("tetrisNew").onclick=startTetrisGame;
  root.querySelectorAll("[data-tetris]").forEach(btn=>{
    const action=btn.dataset.tetris;
    const run=()=>{
      if(action==="left")tetrisMove(-1);
      else if(action==="right")tetrisMove(1);
      else if(action==="rotate")tetrisTurn();
      else if(action==="down")tetrisSoftDrop();
      else if(action==="drop")tetrisHardDrop();
    };
    btn.addEventListener("click",run);
  });

  tetrisKeyHandler=(event)=>{
    if(!root.contains(document.getElementById("tetrisBoard"))) return;
    if(["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," ","p","P"].includes(event.key)) event.preventDefault();
    if(event.key==="ArrowLeft")tetrisMove(-1);
    else if(event.key==="ArrowRight")tetrisMove(1);
    else if(event.key==="ArrowDown")tetrisSoftDrop();
    else if(event.key==="ArrowUp")tetrisTurn();
    else if(event.key===" ")tetrisHardDrop();
    else if(event.key==="p"||event.key==="P")tetrisPause();
  };
  document.addEventListener("keydown",tetrisKeyHandler);
  setupTetrisTouchControls();

  renderTetrisBoard();
  loadTetrisLeaderboard();
  playTetrisSound("start");
  tetrisRestartTimer();
}


function activate(){
  startTetrisScoreRealtime();
  if(tabLabel)tabLabel.textContent=tr("games");
  if(room)renderRoom();else renderLobby();
}

document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement && !document.getElementById("tetrisBoard")){
    document.body.classList.remove("tetris-fullscreen-active");
  }
});

window.PajazitiGames={activate};
if(tabLabel)tabLabel.textContent=tr("games");
