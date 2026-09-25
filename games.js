import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const GAMES_ADMIN_ONLY = document.querySelector('meta[name="diamond-mode"]')?.content === "admin";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: GAMES_ADMIN_ONLY ? "diamond-admin-auth" : "diamond-family-auth"
  }
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
const BOARD_NAME_KEY = "pajaziti-global-user-name";
const ADMIN_EMAIL = "admin@familja.local";
const GAME_ORDER_SETTING_KEY = "game_order";
const GAME_THEME_SETTING_KEY = "game_theme_defaults";
const GAME_CONTROL_LAYOUT_SETTING_KEY = "game_control_layout_defaults_v1";
const GAME_CONTROL_LAYOUT_USER_KEY = "diamond-game-control-layout-v1";
const GAME_SOUND_MASTER_KEY = "diamond-game-sound-master";
const GAME_MUSIC_KEY = "diamond-game-music";
const GAME_USER_THEME_KEY = "diamond-game-user-theme";
const BOARD_AI_LEVEL_KEY = "diamond-board-ai-level";
const COMPUTER_AI_LEVELS_KEY = "diamond-computer-ai-levels-v1";
const DEFAULT_GAME_ORDER = ["chess","morris","timer","tetris","war","kingdom","uck","diamondrun","diamondadventure"];
let gameOrder = [...DEFAULT_GAME_ORDER];
let gamesAdmin = false;
let masterSoundEnabled=localStorage.getItem(GAME_SOUND_MASTER_KEY)!=="off";
let gameMusicEnabled=localStorage.getItem(GAME_MUSIC_KEY)!=="off";
let gameMusicTimer=null;
let gameMusicGain=null;
let adminGameTheme={light:"#f0d9b5",dark:"#b58863",primary:"#ffffff",secondary:"#111827",arena:"#111827"};
let userGameTheme=null;
let computerAiLevels={};
try{computerAiLevels=JSON.parse(localStorage.getItem(COMPUTER_AI_LEVELS_KEY)||"{}")||{};}catch(_){computerAiLevels={};}
const legacyAiLevel=localStorage.getItem(BOARD_AI_LEVEL_KEY)||"medium";
for(const id of ["chess","morris","war","kingdom"]){
  if(!["weak","medium","strong","pro"].includes(computerAiLevels[id])) computerAiLevels[id]=legacyAiLevel;
}
let boardAiLevel=computerAiLevels.chess||"medium";
let gameThemePanelOpen=false;
let adminGameControlLayouts={};
let userGameControlLayouts={};
let controlLayoutEditActive=false;
let controlLayoutDraft={};
let controlLayoutGame=null;
let controlLayoutSyncRaf=0;

let quickChessTimer=null;
let quickChessDeadline=0;
let arcadeRoom=null;
let arcadePlayers=[];
let arcadePollTimer=null;
let arcadeMode=null;
let arcadeStarted=false;
let tetrisOnline=false;
let tetrisPractice=false;
let tetrisOnlineProgressTimer=null;
let boardProfile=null;
let boardLeaderboardRows=[];
let boardChampion=null;
let boardRoomNames={};
let boardRematchTimer=null;
let boardRematchRequested=false;
let arcadeClockTimer=null;
let timerVisibleClockTimer=null;
let gameBlocks={};
let practiceFallbackGame=null;

const UNIVERSAL_GAME_UI={
  sq:{again:"🔄 Përsëri luaj",leave:"🚪 Largohu",close:"Mbyll lojën"},
  de:{again:"🔄 Nochmal spielen",leave:"🚪 Verlassen",close:"Spiel schließen"},
  tr:{again:"🔄 Tekrar oyna",leave:"🚪 Ayrıl",close:"Oyunu kapat"},
  en:{again:"🔄 Play again",leave:"🚪 Leave",close:"Close game"},
  it:{again:"🔄 Gioca ancora",leave:"🚪 Esci",close:"Chiudi gioco"},
  hr:{again:"🔄 Igraj ponovno",leave:"🚪 Izađi",close:"Zatvori igru"},
  fr:{again:"🔄 Rejouer",leave:"🚪 Quitter",close:"Fermer le jeu"},
  ar:{again:"🔄 العب مجدداً",leave:"🚪 مغادرة",close:"إغلاق اللعبة"}
};
let universalGameFullscreen=false;
let universalGameSyncQueued=false;
function universalGameText(key){
  const l=localStorage.getItem(LANG_KEY)||"sq";
  return UNIVERSAL_GAME_UI[l]?.[key]||UNIVERSAL_GAME_UI.sq[key]||key;
}
function ensureUniversalGameStyle(){
  if(document.getElementById("diamondUniversalGameStyle"))return;
  const style=document.createElement("style");
  style.id="diamondUniversalGameStyle";
  style.textContent=`
    body.diamond-game-fullscreen-active{overflow:hidden!important;overscroll-behavior:none;background:#050816!important}
    body.diamond-game-fullscreen-active #gamesRoot{
      position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;
      max-width:none!important;margin:0!important;padding:48px 0 76px!important;box-sizing:border-box!important;
      z-index:2147483000!important;background:#050816!important;overflow:auto!important;
      -webkit-overflow-scrolling:touch;overscroll-behavior:contain
    }
    body.diamond-game-fullscreen-active #gamesRoot>.games-shell,
    body.diamond-game-fullscreen-active #gamesRoot>section,
    body.diamond-game-fullscreen-active #gamesRoot>div{
      width:100%!important;max-width:none!important;box-sizing:border-box!important;margin:0 auto!important
    }
    body.diamond-game-fullscreen-active #gamesRoot .card{max-width:min(100%,1100px);margin-left:auto!important;margin-right:auto!important}
    #diamondUniversalGameChrome{position:fixed;inset:0;z-index:2147483645;pointer-events:none;font-family:system-ui,sans-serif}
    #diamondUniversalGameClose{position:absolute;top:max(7px,env(safe-area-inset-top));right:8px;width:34px;height:34px;
      border-radius:50%;border:1px solid rgba(255,255,255,.32);background:rgba(5,8,22,.82);color:#fff;font-size:18px;
      font-weight:900;display:grid;place-items:center;pointer-events:auto;box-shadow:0 5px 18px rgba(0,0,0,.32)}
    #diamondUniversalGameActions{position:absolute;left:50%;bottom:max(7px,env(safe-area-inset-bottom));transform:translateX(-50%);
      width:min(94vw,560px);display:grid;grid-template-columns:1.2fr .8fr;gap:9px;pointer-events:auto}
    #diamondUniversalGameActions button{min-height:48px;border:1px solid rgba(255,255,255,.22);border-radius:15px;
      color:#fff;font-weight:900;font-size:15px;box-shadow:0 6px 18px rgba(0,0,0,.32)}
    #diamondUniversalGameAgain{background:linear-gradient(135deg,#7c3aed,#2563eb)}
    #diamondUniversalGameLeave{background:rgba(17,24,39,.94)}
    body.diamond-run-top-chrome #gamesRoot{padding-top:52px!important;padding-bottom:10px!important}
    #diamondUniversalGameChrome.diamond-run-chrome #diamondUniversalGameActions{top:max(7px,env(safe-area-inset-top));bottom:auto;left:8px;transform:none;width:min(calc(100vw - 108px),360px);grid-template-columns:1fr 1fr;gap:6px}
    #diamondUniversalGameChrome.diamond-run-chrome #diamondUniversalGameActions button{min-height:34px;border-radius:11px;font-size:11px;padding:5px 7px}
    @media (max-height:650px){body.diamond-game-fullscreen-active #gamesRoot{padding-top:42px!important;padding-bottom:66px!important}
      #diamondUniversalGameActions button{min-height:42px;font-size:13px}}
    #diamondControlLayoutBtn{position:absolute;top:max(48px,calc(env(safe-area-inset-top) + 41px));right:8px;width:38px;height:38px;
      border-radius:13px;border:1px solid rgba(255,255,255,.32);background:rgba(5,8,22,.88);color:#fff;font-size:20px;
      display:grid;place-items:center;pointer-events:auto;box-shadow:0 5px 18px rgba(0,0,0,.32);z-index:3}
    #diamondControlLayoutPanel{position:fixed;left:50%;bottom:max(78px,calc(env(safe-area-inset-bottom) + 70px));transform:translateX(-50%);
      width:min(94vw,560px);z-index:2147483647;background:linear-gradient(160deg,#07162e,#0b2445);color:#fff;
      border:1px solid rgba(56,189,248,.62);border-radius:20px;padding:14px;box-sizing:border-box;
      box-shadow:0 22px 60px rgba(0,0,0,.55);font-family:system-ui,sans-serif}
    #diamondControlLayoutPanel .dcl-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
    #diamondControlLayoutPanel .dcl-head strong{font-size:18px}
    #diamondControlLayoutPanel .dcl-note{font-size:12px;line-height:1.35;color:#dbeafe;margin:8px 0 10px}
    #diamondControlLayoutPanel .dcl-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    #diamondControlLayoutPanel .dcl-actions button{min-height:44px;border:1px solid rgba(255,255,255,.22);border-radius:13px;color:#fff;
      font-weight:900;background:#172554;padding:8px}
    #diamondControlLayoutPanel .dcl-actions .save{background:linear-gradient(135deg,#7c3aed,#2563eb)}
    #diamondControlLayoutPanel .dcl-actions .standard{background:#b91c1c}
    #diamondControlLayoutPanel .dcl-status{min-height:18px;margin-top:8px;font-size:12px;color:#bae6fd}
    .diamond-movable-control{box-sizing:border-box!important}
    body.diamond-control-layout-editing .diamond-movable-control{outline:3px dashed #ef4444!important;outline-offset:3px!important;
      touch-action:none!important;cursor:move!important;box-shadow:0 0 0 4px rgba(239,68,68,.16),0 10px 28px rgba(0,0,0,.35)!important}
  `;
  document.head.appendChild(style);
}
function universalExitSelector(){
  return "#drBack,#daBack,#uckBack,#kgbk,#warBack,#warMultiBack,#warRetryBack,#tetrisBack,#timerBackGames,#leaveGame,#arcadeLeave";
}
function visibleRootButton(selector){
  return [...root.querySelectorAll(selector)].find(el=>el&&el.offsetParent!==null&&!el.disabled)||null;
}
async function deactivateUniversalGameFullscreen(){
  if(!universalGameFullscreen&&!document.getElementById("diamondUniversalGameChrome"))return;
  universalGameFullscreen=false;
  document.body.classList.remove("diamond-game-fullscreen-active");
  document.body.classList.remove("diamond-run-top-chrome");
  document.getElementById("diamondUniversalGameChrome")?.remove();
  try{
    if(document.fullscreenElement&&document.exitFullscreen)await document.exitFullscreen();
  }catch(_){}
}
async function leaveUniversalGame(){
  const nativeExit=visibleRootButton(universalExitSelector());
  if(nativeExit){
    nativeExit.click();
    setTimeout(()=>{if(root&&!root.querySelector(".games-lobby"))renderLobby();},80);
    return;
  }
  clearQuickChess();
  clearArcadePolling();
  clearBoardRematchTimer();
  clearTimerPhaseTimeout();
  if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}
  if(channel){try{supabase.removeChannel(channel);}catch(_){}channel=null;}
  stopTetris();
  stopGameAudioForExit();
  room=null;
  renderLobby();
}
async function restartUniversalGame(){
  const nativeReplay=visibleRootButton("#warRestart,#warMultiAgain,#tetrisNew,#newComputerGame,#boardRematchBtn,#kgagain,#kgrs,#uckReset");
  if(nativeReplay){nativeReplay.click();return;}
  if(selectedType==="diamondrun"){
    const back=visibleRootButton("#drBack");if(back)back.click();
    setTimeout(()=>startDiamondRunGame(),20);return;
  }
  if(selectedType==="diamondadventure"){
    const back=visibleRootButton("#daBack");if(back)back.click();
    setTimeout(()=>startDiamondAdventureGame(),20);return;
  }
  if(selectedType==="uck"){startUckGame();return;}
  if(selectedType==="kingdom"){startKingdomGame();return;}
  if(selectedType==="war"){
    const multi=!!warMultiRoom||!!document.getElementById("warMultiBack")||!!document.getElementById("warRetryOnline");
    if(multi){
      const back=visibleRootButton("#warMultiBack,#warRetryBack");if(back)back.click();
      setTimeout(()=>startWarMultiSearch(),30);
    }else startWarGame();
    return;
  }
  if(selectedType==="tetris"){
    if(tetrisOnline||arcadeMode==="tetris"){
      try{await leaveArcade();}catch(_){}
      startArcadeQuick("tetris");
    }else startTetrisGame({practice:true});
    return;
  }
  if(selectedType==="timer"){
    if(arcadeMode==="timer"&&arcadeRoom){
      try{await leaveArcade();}catch(_){}
      startArcadeQuick("timer");
    }else startTimerSoloGame();
    return;
  }
  if(selectedType==="chess"||selectedType==="morris"){
    if(room?.local){startComputerGame();return;}
    const leave=visibleRootButton("#leaveGame,#timerBackGames");if(leave)leave.click();
    setTimeout(()=>startBoardQuickOnline(selectedType),30);
    return;
  }
  startPracticeForGame(selectedType);
}
function renderUniversalGameChrome(){
  let chrome=document.getElementById("diamondUniversalGameChrome");
  if(!chrome){
    chrome=document.createElement("div");
    chrome.id="diamondUniversalGameChrome";
    document.body.appendChild(chrome);
  }
  const diamondRunActive=selectedType==="diamondrun"&&!!root.querySelector(".diamond-run-shell");
  chrome.className=diamondRunActive?"diamond-run-chrome":"";
  document.body.classList.toggle("diamond-run-top-chrome",diamondRunActive);
  chrome.innerHTML=`<button id="diamondUniversalGameClose" type="button" aria-label="${universalGameText("close")}">✕</button>
    <button id="diamondControlLayoutBtn" type="button" aria-label="Rregullo pullat" title="Rregullo pullat">⚙️</button>
    <div id="diamondUniversalGameActions">
      <button id="diamondUniversalGameAgain" type="button">${universalGameText("again")}</button>
      <button id="diamondUniversalGameLeave" type="button">${universalGameText("leave")}</button>
    </div>`;
  document.getElementById("diamondUniversalGameClose").onclick=leaveUniversalGame;
  document.getElementById("diamondUniversalGameLeave").onclick=leaveUniversalGame;
  document.getElementById("diamondUniversalGameAgain").onclick=restartUniversalGame;
  document.getElementById("diamondControlLayoutBtn").onclick=openGameControlLayoutEditor;
}
async function activateUniversalGameFullscreen(){
  ensureUniversalGameStyle();
  renderUniversalGameChrome();
  if(universalGameFullscreen)return;
  universalGameFullscreen=true;
  document.body.classList.add("diamond-game-fullscreen-active");
  try{
    const el=document.documentElement;
    if(!document.fullscreenElement&&el.requestFullscreen)await el.requestFullscreen({navigationUI:"hide"});
  }catch(_){}
}
function syncUniversalGameFullscreen(){
  universalGameSyncQueued=false;
  if(!root)return;
  const lobby=!!root.querySelector(".games-lobby");
  const hasContent=!!root.firstElementChild;
  if(!hasContent||lobby)deactivateUniversalGameFullscreen();
  else activateUniversalGameFullscreen();
}
function scheduleUniversalGameFullscreenSync(){
  if(universalGameSyncQueued)return;
  universalGameSyncQueued=true;
  requestAnimationFrame(()=>{syncUniversalGameFullscreen();scheduleGameControlLayoutSync();});
}
if(root)new MutationObserver(scheduleUniversalGameFullscreenSync).observe(root,{childList:true,subtree:true});


const CONTROL_LAYOUT_TEXT={
  sq:{title:"⚙️ Rregullo pullat",note:"Mbaje pullën me gisht dhe tërhiqe ku të duash. Pozicioni ruhet vetëm në këtë telefon.",adminNote:"Lëvizi pullat. Kur i ruan si standard, ky bëhet pozicioni standard për të gjithë.",save:"💾 Ruaj në këtë telefon",saveAdmin:"👑 Ruaj si standard",standard:"↩️ Kthe standardin",close:"✕ Mbyll",saved:"✅ U ruajt në këtë telefon.",savedAdmin:"✅ Standardi i Adminit u ruajt për të gjithë.",reset:"✅ U kthye te standardi i Adminit.",none:"Kjo lojë nuk ka pulla kontrolli që mund të lëvizen."},
  de:{title:"⚙️ Tasten anordnen",note:"Taste gedrückt halten und an die gewünschte Stelle ziehen. Die Position bleibt nur auf diesem Gerät gespeichert.",adminNote:"Verschiebe die Tasten. Beim Speichern wird diese Anordnung zum Standard für alle.",save:"💾 Auf diesem Gerät speichern",saveAdmin:"👑 Als Standard speichern",standard:"↩️ Standard wiederherstellen",close:"✕ Schließen",saved:"✅ Auf diesem Gerät gespeichert.",savedAdmin:"✅ Admin-Standard für alle gespeichert.",reset:"✅ Admin-Standard wiederhergestellt.",none:"Dieses Spiel hat keine verschiebbaren Steuertasten."},
  tr:{title:"⚙️ Tuşları düzenle",note:"Tuşa basılı tutup istediğin yere sürükle. Konum yalnızca bu telefonda saklanır.",adminNote:"Tuşları taşı. Standart olarak kaydedince bu düzen herkes için varsayılan olur.",save:"💾 Bu telefona kaydet",saveAdmin:"👑 Standart olarak kaydet",standard:"↩️ Standarta dön",close:"✕ Kapat",saved:"✅ Bu telefona kaydedildi.",savedAdmin:"✅ Yönetici standardı herkes için kaydedildi.",reset:"✅ Yönetici standardına dönüldü.",none:"Bu oyunda taşınabilir kontrol tuşu yok."},
  en:{title:"⚙️ Arrange controls",note:"Hold a control and drag it where you want. Its position is saved only on this device.",adminNote:"Move the controls. Saving as standard makes this the default layout for everyone.",save:"💾 Save on this device",saveAdmin:"👑 Save as standard",standard:"↩️ Restore standard",close:"✕ Close",saved:"✅ Saved on this device.",savedAdmin:"✅ Admin standard saved for everyone.",reset:"✅ Restored the Admin standard.",none:"This game has no movable control buttons."},
  it:{title:"⚙️ Disponi i comandi",note:"Tieni premuto un comando e trascinalo dove vuoi. La posizione resta salvata solo su questo dispositivo.",adminNote:"Sposta i comandi. Salvando come standard, questa disposizione diventa quella predefinita per tutti.",save:"💾 Salva su questo dispositivo",saveAdmin:"👑 Salva come standard",standard:"↩️ Ripristina standard",close:"✕ Chiudi",saved:"✅ Salvato su questo dispositivo.",savedAdmin:"✅ Standard Admin salvato per tutti.",reset:"✅ Ripristinato lo standard Admin.",none:"Questo gioco non ha pulsanti di controllo spostabili."},
  hr:{title:"⚙️ Rasporedi tipke",note:"Drži tipku i povuci je gdje želiš. Položaj se sprema samo na ovom uređaju.",adminNote:"Pomakni tipke. Spremanjem kao standard ovo postaje zadani raspored za sve.",save:"💾 Spremi na ovom uređaju",saveAdmin:"👑 Spremi kao standard",standard:"↩️ Vrati standard",close:"✕ Zatvori",saved:"✅ Spremljeno na ovom uređaju.",savedAdmin:"✅ Admin standard spremljen za sve.",reset:"✅ Vraćen Admin standard.",none:"Ova igra nema pomične upravljačke tipke."},
  fr:{title:"⚙️ Disposer les commandes",note:"Maintiens une commande et fais-la glisser où tu veux. La position est enregistrée uniquement sur cet appareil.",adminNote:"Déplace les commandes. Enregistrer comme standard rend cette disposition par défaut pour tous.",save:"💾 Enregistrer sur cet appareil",saveAdmin:"👑 Enregistrer comme standard",standard:"↩️ Restaurer le standard",close:"✕ Fermer",saved:"✅ Enregistré sur cet appareil.",savedAdmin:"✅ Standard Admin enregistré pour tous.",reset:"✅ Standard Admin restauré.",none:"Ce jeu n’a pas de boutons de contrôle déplaçables."},
  ar:{title:"⚙️ ترتيب أزرار التحكم",note:"اضغط مطولاً على الزر واسحبه إلى المكان الذي تريده. يُحفظ موضعه على هذا الجهاز فقط.",adminNote:"حرّك الأزرار. عند الحفظ كإعداد قياسي يصبح هذا الترتيب الافتراضي للجميع.",save:"💾 حفظ على هذا الجهاز",saveAdmin:"👑 حفظ كإعداد قياسي",standard:"↩️ استعادة القياسي",close:"✕ إغلاق",saved:"✅ تم الحفظ على هذا الجهاز.",savedAdmin:"✅ تم حفظ إعداد المشرف للجميع.",reset:"✅ تمت استعادة إعداد المشرف.",none:"لا توجد أزرار تحكم قابلة للتحريك في هذه اللعبة."}
};
function clt(key){
  const l=localStorage.getItem(LANG_KEY)||"sq";
  return CONTROL_LAYOUT_TEXT[l]?.[key]||CONTROL_LAYOUT_TEXT.sq[key]||key;
}
const GAME_CONTROL_LAYOUT_TARGETS={
  diamondadventure:[
    {key:"left",selector:"#daLeft"},{key:"right",selector:"#daRight"},{key:"spin",selector:"#daSpin"},{key:"jump",selector:"#daJump"}
  ],
  diamondrun:[
    {key:"left",selector:"#drLeft"},{key:"right",selector:"#drRight"},{key:"jump",selector:"#drJump"},{key:"shoot",selector:"#drShoot"}
  ],
  tetris:[
    {key:"left",selector:'[data-tetris="left"]'},{key:"rotate",selector:'[data-tetris="rotate"]'},
    {key:"right",selector:'[data-tetris="right"]'},{key:"down",selector:'[data-tetris="down"]'},{key:"drop",selector:'[data-tetris="drop"]'}
  ],
  timer:[
    {key:"start",selector:"#startTimerRound"},{key:"stop",selector:"#timerStopButton"}
  ],
  war:[
    {key:"weapon1",selector:".war-player-weapons.mine button:nth-of-type(1)"},
    {key:"weapon2",selector:".war-player-weapons.mine button:nth-of-type(2)"},
    {key:"reroll",selector:"#warReroll,#warMultiReroll"}
  ],
  kingdom:[
    {key:"card",selector:".kgrow .kgp"}
  ],
  uck:[
    {key:"mission",selector:".uck-missions .uck-mission"},
    {key:"again",selector:"#uckAgain"},{key:"next",selector:"#uckNext"}
  ],
  chess:[
    {key:"new",selector:"#newComputerGame"},{key:"resign",selector:"#boardResignBtn"},{key:"rematch",selector:"#boardRematchBtn"}
  ],
  morris:[
    {key:"new",selector:"#newComputerGame"},{key:"resign",selector:"#boardResignBtn"},{key:"rematch",selector:"#boardRematchBtn"}
  ]
};
function normalizeControlLayoutMap(value){
  if(!value||typeof value!=="object"||Array.isArray(value))return {};
  const out={};
  for(const [game,layout] of Object.entries(value)){
    if(!layout||typeof layout!=="object"||Array.isArray(layout))continue;
    const clean={};
    for(const [key,pos] of Object.entries(layout)){
      const x=Number(pos?.x),y=Number(pos?.y);
      if(Number.isFinite(x)&&Number.isFinite(y))clean[key]={x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y))};
    }
    out[game]=clean;
  }
  return out;
}
async function loadGameControlLayouts(){
  try{
    const {data}=await supabase.from("app_settings").select("value").eq("key",GAME_CONTROL_LAYOUT_SETTING_KEY).maybeSingle();
    adminGameControlLayouts=normalizeControlLayoutMap(data?.value||{});
  }catch(_){adminGameControlLayouts={};}
  try{
    userGameControlLayouts=normalizeControlLayoutMap(JSON.parse(localStorage.getItem(GAME_CONTROL_LAYOUT_USER_KEY)||"{}"));
  }catch(_){userGameControlLayouts={};}
  scheduleGameControlLayoutSync();
}
function effectiveGameControlLayout(game=selectedType){
  if(gamesAdmin)return adminGameControlLayouts?.[game]||{};
  return userGameControlLayouts?.[game]||adminGameControlLayouts?.[game]||{};
}
function gameControlTargets(game=selectedType){
  if(!root||!game)return [];
  const specs=GAME_CONTROL_LAYOUT_TARGETS[game]||[];
  const out=[];
  for(const spec of specs){
    const nodes=[...root.querySelectorAll(spec.selector)];
    nodes.forEach((el,index)=>{
      if(!(el instanceof HTMLElement))return;
      const suffix=nodes.length>1?":"+index:"";
      out.push({el,key:spec.key+suffix});
    });
  }
  return out;
}
function clearManagedControlStyle(el){
  if(!el)return;
  el.classList.remove("diamond-movable-control");
  el.style.removeProperty("position");el.style.removeProperty("left");el.style.removeProperty("top");
  el.style.removeProperty("width");el.style.removeProperty("height");el.style.removeProperty("margin");
  el.style.removeProperty("z-index");el.style.removeProperty("transform");
  if(el.dataset.diamondWasDisabled==="1")el.disabled=true;
  delete el.dataset.diamondWasDisabled;
  delete el.dataset.diamondLayoutKey;
}
function placeControlAt(el,pos){
  if(!el||!pos)return;
  const rect=el.getBoundingClientRect();
  const width=Math.max(34,rect.width||el.offsetWidth||48);
  const height=Math.max(34,rect.height||el.offsetHeight||48);
  const maxX=Math.max(0,window.innerWidth-width);
  const maxY=Math.max(0,window.innerHeight-height);
  const left=Math.max(0,Math.min(maxX,Number(pos.x||0)*maxX));
  const top=Math.max(0,Math.min(maxY,Number(pos.y||0)*maxY));
  Object.assign(el.style,{position:"fixed",left:left+"px",top:top+"px",width:width+"px",height:height+"px",margin:"0",zIndex:"2147483300",transform:"none"});
  el.classList.add("diamond-movable-control");
}
function controlPositionFromPixels(el,left,top){
  const rect=el.getBoundingClientRect();
  const maxX=Math.max(1,window.innerWidth-rect.width);
  const maxY=Math.max(1,window.innerHeight-rect.height);
  return {x:Math.max(0,Math.min(1,left/maxX)),y:Math.max(0,Math.min(1,top/maxY))};
}
function bindControlDrag(el,key){
  if(el.dataset.diamondDragBound==="1")return;
  el.dataset.diamondDragBound="1";
  el.addEventListener("pointerdown",(event)=>{
    if(!controlLayoutEditActive||controlLayoutGame!==selectedType)return;
    event.preventDefault();event.stopPropagation();
    const rect=el.getBoundingClientRect();
    const sx=event.clientX,sy=event.clientY,startLeft=rect.left,startTop=rect.top;
    try{el.setPointerCapture(event.pointerId);}catch(_){}
    const move=(ev)=>{
      if(ev.pointerId!==event.pointerId)return;
      ev.preventDefault();ev.stopPropagation();
      const width=el.getBoundingClientRect().width,height=el.getBoundingClientRect().height;
      const left=Math.max(0,Math.min(window.innerWidth-width,startLeft+(ev.clientX-sx)));
      const top=Math.max(0,Math.min(window.innerHeight-height,startTop+(ev.clientY-sy)));
      el.style.left=left+"px";el.style.top=top+"px";
      controlLayoutDraft[key]=controlPositionFromPixels(el,left,top);
      setControlLayoutStatus("");
    };
    const end=(ev)=>{
      if(ev.pointerId!==event.pointerId)return;
      ev.preventDefault();ev.stopPropagation();
      try{el.releasePointerCapture(event.pointerId);}catch(_){}
      el.removeEventListener("pointermove",move);
      el.removeEventListener("pointerup",end);
      el.removeEventListener("pointercancel",end);
    };
    el.addEventListener("pointermove",move,{passive:false});
    el.addEventListener("pointerup",end,{passive:false});
    el.addEventListener("pointercancel",end,{passive:false});
  },{passive:false});
}
function freezeControlForEdit(el,key){
  const saved=controlLayoutDraft[key];
  if(saved){
    placeControlAt(el,saved);
  }else{
    const rect=el.getBoundingClientRect();
    const width=Math.max(34,rect.width||el.offsetWidth||48);
    const height=Math.max(34,rect.height||el.offsetHeight||48);
    const left=Math.max(0,Math.min(window.innerWidth-width,rect.left));
    const top=Math.max(0,Math.min(window.innerHeight-height,rect.top));
    Object.assign(el.style,{position:"fixed",left:left+"px",top:top+"px",width:width+"px",height:height+"px",margin:"0",zIndex:"2147483300",transform:"none"});
    controlLayoutDraft[key]=controlPositionFromPixels(el,left,top);
  }
  if(el.disabled){el.dataset.diamondWasDisabled="1";el.disabled=false;}
  el.dataset.diamondLayoutKey=key;
  el.classList.add("diamond-movable-control");
  bindControlDrag(el,key);
}
function syncGameControlLayout(){
  controlLayoutSyncRaf=0;
  if(!root||root.querySelector(".games-lobby"))return;
  const game=selectedType;
  const targets=gameControlTargets(game);
  const activeLayout=controlLayoutEditActive&&controlLayoutGame===game?controlLayoutDraft:effectiveGameControlLayout(game);
  for(const {el,key} of targets){
    if(controlLayoutEditActive&&controlLayoutGame===game)freezeControlForEdit(el,key);
    else if(activeLayout?.[key])placeControlAt(el,activeLayout[key]);
  }
}
function scheduleGameControlLayoutSync(){
  if(controlLayoutSyncRaf)return;
  controlLayoutSyncRaf=requestAnimationFrame(syncGameControlLayout);
}
function setControlLayoutStatus(message){
  const el=document.getElementById("diamondControlLayoutStatus");
  if(el)el.textContent=message||"";
}
function closeGameControlLayoutEditor({revert=true}={}){
  const game=controlLayoutGame;
  controlLayoutEditActive=false;controlLayoutGame=null;controlLayoutDraft={};
  document.body.classList.remove("diamond-control-layout-editing");
  document.getElementById("diamondControlLayoutPanel")?.remove();
  if(root){
    for(const {el} of gameControlTargets(game))clearManagedControlStyle(el);
  }
  if(revert)scheduleGameControlLayoutSync();
}
function renderGameControlLayoutPanel(){
  document.getElementById("diamondControlLayoutPanel")?.remove();
  const panel=document.createElement("div");
  panel.id="diamondControlLayoutPanel";
  panel.innerHTML='<div class="dcl-head"><strong>'+clt("title")+'</strong><button id="diamondControlLayoutClose" type="button">✕</button></div>'+
    '<div class="dcl-note">'+(gamesAdmin?clt("adminNote"):clt("note"))+'</div>'+
    '<div class="dcl-actions"><button id="diamondControlLayoutSave" class="save" type="button">'+(gamesAdmin?clt("saveAdmin"):clt("save"))+'</button>'+
    '<button id="diamondControlLayoutStandard" class="standard" type="button">'+clt("standard")+'</button></div>'+
    '<div id="diamondControlLayoutStatus" class="dcl-status"></div>';
  document.body.appendChild(panel);
  panel.querySelector("#diamondControlLayoutClose").onclick=()=>closeGameControlLayoutEditor({revert:true});
  panel.querySelector("#diamondControlLayoutSave").onclick=saveGameControlLayout;
  panel.querySelector("#diamondControlLayoutStandard").onclick=restoreAdminGameControlLayout;
}
function openGameControlLayoutEditor(){
  if(!selectedType||root?.querySelector(".games-lobby"))return;
  if(controlLayoutEditActive){closeGameControlLayoutEditor({revert:true});return;}
  controlLayoutGame=selectedType;
  controlLayoutDraft=JSON.parse(JSON.stringify(effectiveGameControlLayout(controlLayoutGame)||{}));
  controlLayoutEditActive=true;
  document.body.classList.add("diamond-control-layout-editing");
  renderGameControlLayoutPanel();
  const targets=gameControlTargets(controlLayoutGame);
  if(!targets.length)setControlLayoutStatus(clt("none"));
  for(const {el,key} of targets)freezeControlForEdit(el,key);
}
async function saveGameControlLayout(){
  if(!controlLayoutEditActive||!controlLayoutGame)return;
  const game=controlLayoutGame;
  const clean=normalizeControlLayoutMap({[game]:controlLayoutDraft})[game]||{};
  if(gamesAdmin){
    try{
      const {data:s}=await supabase.auth.getSession();
      const user=s?.session?.user;
      if(!user)throw new Error("AUTH_REQUIRED");
      const next={...adminGameControlLayouts,[game]:clean};
      const {error}=await supabase.from("app_settings").upsert({
        key:GAME_CONTROL_LAYOUT_SETTING_KEY,value:next,updated_at:new Date().toISOString(),updated_by:user.id
      },{onConflict:"key"});
      if(error)throw error;
      adminGameControlLayouts=next;
      setControlLayoutStatus(clt("savedAdmin"));
    }catch(error){
      setControlLayoutStatus("❌ "+(error?.message||"Gabim"));
      return;
    }
  }else{
    userGameControlLayouts={...userGameControlLayouts,[game]:clean};
    try{localStorage.setItem(GAME_CONTROL_LAYOUT_USER_KEY,JSON.stringify(userGameControlLayouts));}catch(_){}
    setControlLayoutStatus(clt("saved"));
  }
  setTimeout(()=>closeGameControlLayoutEditor({revert:true}),350);
}
function restoreAdminGameControlLayout(){
  if(!controlLayoutGame)return;
  const game=controlLayoutGame;
  if(!gamesAdmin){
    const next={...userGameControlLayouts};
    delete next[game];
    userGameControlLayouts=next;
    try{localStorage.setItem(GAME_CONTROL_LAYOUT_USER_KEY,JSON.stringify(next));}catch(_){}
  }
  controlLayoutDraft=JSON.parse(JSON.stringify(adminGameControlLayouts?.[game]||{}));
  for(const {el} of gameControlTargets(game))clearManagedControlStyle(el);
  for(const {el,key} of gameControlTargets(game)){
    if(controlLayoutDraft[key])placeControlAt(el,controlLayoutDraft[key]);
    if(controlLayoutEditActive)freezeControlForEdit(el,key);
  }
  setControlLayoutStatus(clt("reset"));
}
if(root){
  root.addEventListener("click",(event)=>{
    if(controlLayoutEditActive&&event.target?.closest?.(".diamond-movable-control")){
      event.preventDefault();event.stopImmediatePropagation();
    }
  },true);
}
window.addEventListener("resize",scheduleGameControlLayoutSync);

let deviceId = localStorage.getItem(DEVICE_KEY);
if (!deviceId) {
  deviceId = globalThis.crypto?.randomUUID?.() || ("device_" + Date.now() + Math.random().toString(36).slice(2));
  localStorage.setItem(DEVICE_KEY, deviceId);
}

const TXT = {
  sq:{games:"Lojëra",online:"Luaj online",computer:"Luaj me kompjuter",computerName:"Kompjuteri",computerThinking:"Kompjuteri po mendon…",newGame:"Lojë e re",chess:"Shah",morris:"Degërxhik",timer:"Kral i Sekondave",tetris:"Blloqe",war:"Luftra",choose:"Zgjidh lojën",playerName:"Emri yt",needName:"Shkruaj emrin tënd.",needPlayers:"Duhet të jenë së paku 2 lojtarë.",ready:"Bëhu gati…",hiddenTime:"Sekondat janë të fshehura",stop:"STOP",stopped:"E ndale! Prit lojtarët e tjerë…",round:"Raundi",startRound:"Fillo raundin",eliminated:"u eliminua",king:"Kral i lojës",power:"Fuqi",weekly:"Renditja javore",lastChampion:"Kampioni i javës së kaluar",wins:"Fitore",players:"Lojtarë",maxPlayers:"2–8 lojtarë",roomLocked:"Loja ka filluar; nuk mund të hyjnë lojtarë të rinj.",youEliminated:"Je eliminuar. Shiko deri në fund.",backGames:"Kthehu te lojërat",soloTimer:"🤖 Luaj vetë",practiceOnly:"Stërvitje kundër kompjuterit — nuk hyn në renditjen javore.",you:"Ti",opponents:"Kundërshtarët",active:"Në lojë",soundOn:"🔊 Zëri ON",soundOff:"🔇 Zëri OFF",create:"Krijo dhomë",code:"Kodi i dhomës",join:"Hyr në dhomë",waiting:"Duke pritur lojtarin e dytë…",yourTurn:"Radha jote",opponentTurn:"Radha e kundërshtarit",white:"Bardhë",black:"Zi",leave:"Dil nga loja",room:"Dhoma",copy:"Kopjo kodin",copied:"Kodi u kopjua",invalid:"Kodi nuk u gjet.",full:"Dhoma është e mbushur.",gameOver:"Loja përfundoi",winner:"Fituesi",helpChess:"Prek figurën tënde, pastaj katrorin ku dëshiron ta lëvizësh.",helpMorris:"Në fillim vendos 9 gurët. Kur krijon treshe, hiq një gur të kundërshtarit.",error:"Gabim"},
  de:{games:"Spiele",online:"Online spielen",computer:"Gegen Computer",computerName:"Computer",computerThinking:"Computer denkt…",newGame:"Neues Spiel",chess:"Schach",morris:"Degërxhik",timer:"Sekundenkönig",tetris:"Blloqe",war:"Krieg",choose:"Spiel wählen",playerName:"Dein Name",needName:"Gib deinen Namen ein.",needPlayers:"Mindestens 2 Spieler sind nötig.",ready:"Mach dich bereit…",hiddenTime:"Die Sekunden sind verborgen",stop:"STOP",stopped:"Gestoppt! Warte auf die anderen…",round:"Runde",startRound:"Runde starten",eliminated:"ist ausgeschieden",king:"König des Spiels",power:"Stärke",weekly:"Wochenrangliste",lastChampion:"Champion der letzten Woche",wins:"Siege",players:"Spieler",maxPlayers:"2–8 Spieler",roomLocked:"Das Spiel hat begonnen; neue Spieler können nicht mehr beitreten.",youEliminated:"Du bist ausgeschieden. Schau bis zum Ende zu.",backGames:"Zurück zu den Spielen",soloTimer:"🤖 Alleine spielen",practiceOnly:"Training gegen den Computer — zählt nicht für die Wochenrangliste.",you:"Du",opponents:"Gegner",active:"Im Spiel",soundOn:"🔊 Ton AN",soundOff:"🔇 Ton AUS",create:"Raum erstellen",code:"Raumcode",join:"Raum beitreten",waiting:"Warte auf den zweiten Spieler…",yourTurn:"Du bist am Zug",opponentTurn:"Gegner ist am Zug",white:"Weiß",black:"Schwarz",leave:"Spiel verlassen",room:"Raum",copy:"Code kopieren",copied:"Code kopiert",invalid:"Code nicht gefunden.",full:"Raum ist voll.",gameOver:"Spiel beendet",winner:"Gewinner",helpChess:"Tippe deine Figur an und danach das Zielfeld.",helpMorris:"Setze zuerst deine 9 Steine. Bei einer Dreierreihe darfst du einen gegnerischen Stein entfernen.",error:"Fehler"},
  tr:{games:"Oyunlar",online:"Çevrimiçi oyna",computer:"Bilgisayara karşı oyna",computerName:"Bilgisayar",computerThinking:"Bilgisayar düşünüyor…",newGame:"Yeni oyun",chess:"Satranç",morris:"Dokuz Taş",timer:"Saniye Kralı",tetris:"Blloqe",war:"Savaş",choose:"Oyun seç",playerName:"Adın",needName:"Adını yaz.",needPlayers:"En az 2 oyuncu gerekli.",ready:"Hazır ol…",hiddenTime:"Saniyeler gizli",stop:"STOP",stopped:"Durdurdun! Diğer oyuncuları bekle…",round:"Tur",startRound:"Turu başlat",eliminated:"elendi",king:"Oyunun kralı",power:"Güç",weekly:"Haftalık sıralama",lastChampion:"Geçen haftanın şampiyonu",wins:"Galibiyet",players:"Oyuncular",maxPlayers:"2–8 oyuncu",roomLocked:"Oyun başladı; yeni oyuncu katılamaz.",youEliminated:"Elendin. Sonuna kadar izleyebilirsin.",backGames:"Oyunlara dön",soloTimer:"🤖 Tek başına oyna",practiceOnly:"Bilgisayara karşı antrenman — haftalık sıralamaya sayılmaz.",you:"Sen",opponents:"Rakipler",active:"Oyunda",soundOn:"🔊 Ses AÇIK",soundOff:"🔇 Ses KAPALI",create:"Oda oluştur",code:"Oda kodu",join:"Odaya katıl",waiting:"İkinci oyuncu bekleniyor…",yourTurn:"Sıra sende",opponentTurn:"Sıra rakipte",white:"Beyaz",black:"Siyah",leave:"Oyundan çık",room:"Oda",copy:"Kodu kopyala",copied:"Kod kopyalandı",invalid:"Kod bulunamadı.",full:"Oda dolu.",gameOver:"Oyun bitti",winner:"Kazanan",helpChess:"Kendi taşına, sonra gitmek istediğin kareye dokun.",helpMorris:"Önce 9 taşını yerleştir. Üçlü yaptığında rakibin bir taşını kaldırabilirsin.",error:"Hata"},
  en:{games:"Games",online:"Play online",computer:"Play vs computer",computerName:"Computer",computerThinking:"Computer is thinking…",newGame:"New game",chess:"Chess",morris:"Nine Men's Morris",timer:"King of Seconds",tetris:"Blocks",war:"War",choose:"Choose a game",playerName:"Your name",needName:"Enter your name.",needPlayers:"At least 2 players are required.",ready:"Get ready…",hiddenTime:"Seconds are hidden",stop:"STOP",stopped:"Stopped! Wait for the others…",round:"Round",startRound:"Start round",eliminated:"eliminated",king:"King of the game",power:"Power",weekly:"Weekly ranking",lastChampion:"Last week's champion",wins:"Wins",players:"Players",maxPlayers:"2–8 players",roomLocked:"The game has started; new players cannot join.",youEliminated:"You are eliminated. Watch until the end.",backGames:"Back to games",soloTimer:"🤖 Play solo",practiceOnly:"Practice vs computer — does not count in weekly ranking.",you:"You",opponents:"Opponents",active:"Active",soundOn:"🔊 Sound ON",soundOff:"🔇 Sound OFF",create:"Create room",code:"Room code",join:"Join room",waiting:"Waiting for second player…",yourTurn:"Your turn",opponentTurn:"Opponent's turn",white:"White",black:"Black",leave:"Leave game",room:"Room",copy:"Copy code",copied:"Code copied",invalid:"Room not found.",full:"Room is full.",gameOver:"Game over",winner:"Winner",helpChess:"Tap your piece, then the destination square.",helpMorris:"Place your 9 stones first. When you make a row of three, remove one opponent stone.",error:"Error"},
  it:{games:"Giochi",online:"Gioca online",computer:"Gioca contro il computer",computerName:"Computer",computerThinking:"Il computer sta pensando…",newGame:"Nuova partita",chess:"Scacchi",morris:"Mulino",timer:"Re dei secondi",tetris:"Blocchi",war:"Guerra",choose:"Scegli il gioco",playerName:"Il tuo nome",needName:"Inserisci il tuo nome.",needPlayers:"Servono almeno 2 giocatori.",ready:"Preparati…",hiddenTime:"I secondi sono nascosti",stop:"STOP",stopped:"Fermato! Attendi gli altri…",round:"Round",startRound:"Avvia round",eliminated:"eliminato",king:"Re del gioco",power:"Potenza",weekly:"Classifica settimanale",lastChampion:"Campione della scorsa settimana",wins:"Vittorie",players:"Giocatori",maxPlayers:"2–8 giocatori",roomLocked:"La partita è iniziata; non possono entrare nuovi giocatori.",youEliminated:"Sei eliminato. Guarda fino alla fine.",backGames:"Torna ai giochi",soloTimer:"🤖 Gioca da solo",practiceOnly:"Allenamento contro il computer — non conta nella classifica.",you:"Tu",opponents:"Avversari",active:"In gioco",soundOn:"🔊 Audio ON",soundOff:"🔇 Audio OFF",create:"Crea stanza",code:"Codice stanza",join:"Entra",waiting:"In attesa del secondo giocatore…",yourTurn:"Il tuo turno",opponentTurn:"Turno avversario",white:"Bianco",black:"Nero",leave:"Esci dal gioco",room:"Stanza",copy:"Copia codice",copied:"Codice copiato",invalid:"Stanza non trovata.",full:"Stanza piena.",gameOver:"Partita finita",winner:"Vincitore",helpChess:"Tocca il tuo pezzo, poi la casella di destinazione.",helpMorris:"Posiziona prima 9 pedine. Quando crei una fila di tre, rimuovi una pedina avversaria.",error:"Errore"},
  hr:{games:"Igre",online:"Igraj online",computer:"Igraj protiv računala",computerName:"Računalo",computerThinking:"Računalo razmišlja…",newGame:"Nova igra",chess:"Šah",morris:"Mlin",timer:"Kralj sekundi",tetris:"Blokovi",war:"Rat",choose:"Odaberi igru",playerName:"Tvoje ime",needName:"Unesi svoje ime.",needPlayers:"Potrebna su najmanje 2 igrača.",ready:"Pripremi se…",hiddenTime:"Sekunde su skrivene",stop:"STOP",stopped:"Zaustavljeno! Pričekaj ostale…",round:"Runda",startRound:"Pokreni rundu",eliminated:"eliminiran",king:"Kralj igre",power:"Snaga",weekly:"Tjedna ljestvica",lastChampion:"Prošlotjedni prvak",wins:"Pobjede",players:"Igrači",maxPlayers:"2–8 igrača",roomLocked:"Igra je počela; novi igrači se ne mogu pridružiti.",youEliminated:"Eliminiran si. Gledaj do kraja.",backGames:"Natrag na igre",soloTimer:"🤖 Igraj sam",practiceOnly:"Vježba protiv računala — ne računa se u tjednu ljestvicu.",you:"Ti",opponents:"Protivnici",active:"U igri",soundOn:"🔊 Zvuk UKLJ",soundOff:"🔇 Zvuk ISKLJ",create:"Stvori sobu",code:"Kod sobe",join:"Uđi",waiting:"Čeka se drugi igrač…",yourTurn:"Tvoj potez",opponentTurn:"Potez protivnika",white:"Bijeli",black:"Crni",leave:"Napusti igru",room:"Soba",copy:"Kopiraj kod",copied:"Kod kopiran",invalid:"Soba nije pronađena.",full:"Soba je puna.",gameOver:"Igra završena",winner:"Pobjednik",helpChess:"Dodirni svoju figuru, zatim odredišno polje.",helpMorris:"Prvo postavi 9 kamenčića. Kad napraviš niz od tri, ukloni protivnički.",error:"Greška"},
  ar:{games:"الألعاب",online:"العب عبر الإنترنت",computer:"العب ضد الكمبيوتر",computerName:"الكمبيوتر",computerThinking:"الكمبيوتر يفكر…",newGame:"لعبة جديدة",chess:"الشطرنج",morris:"الطاحونة",timer:"ملك الثواني",tetris:"الكتل",war:"الحرب",choose:"اختر اللعبة",playerName:"اسمك",needName:"اكتب اسمك.",needPlayers:"يلزم لاعبان على الأقل.",ready:"استعد…",hiddenTime:"الثواني مخفية",stop:"إيقاف",stopped:"توقفت! انتظر الآخرين…",round:"الجولة",startRound:"ابدأ الجولة",eliminated:"تم إقصاؤه",king:"ملك اللعبة",power:"القوة",weekly:"الترتيب الأسبوعي",lastChampion:"بطل الأسبوع الماضي",wins:"انتصارات",players:"اللاعبون",maxPlayers:"2–8 لاعبين",roomLocked:"بدأت اللعبة؛ لا يمكن للاعبين جدد الانضمام.",youEliminated:"تم إقصاؤك. شاهد حتى النهاية.",backGames:"العودة للألعاب",soloTimer:"🤖 العب وحدك",practiceOnly:"تدريب ضد الكمبيوتر — لا يحتسب في الترتيب الأسبوعي.",you:"أنت",opponents:"الخصوم",active:"في اللعب",soundOn:"🔊 الصوت يعمل",soundOff:"🔇 الصوت متوقف",create:"إنشاء غرفة",code:"رمز الغرفة",join:"انضم",waiting:"بانتظار اللاعب الثاني…",yourTurn:"دورك",opponentTurn:"دور الخصم",white:"أبيض",black:"أسود",leave:"مغادرة اللعبة",room:"الغرفة",copy:"نسخ الرمز",copied:"تم النسخ",invalid:"الغرفة غير موجودة.",full:"الغرفة ممتلئة.",gameOver:"انتهت اللعبة",winner:"الفائز",helpChess:"اضغط قطعتك ثم مربع الوجهة.",helpMorris:"ضع أحجارك التسعة أولاً. عند تكوين ثلاثة في صف، أزل حجرًا للخصم.",error:"خطأ"},
  fr:{games:"Jeux",online:"Jouer en ligne",computer:"Jouer contre l'ordinateur",computerName:"Ordinateur",computerThinking:"L'ordinateur réfléchit…",newGame:"Nouvelle partie",chess:"Échecs",morris:"Moulin",timer:"Roi des secondes",tetris:"Blocs",war:"Guerre",choose:"Choisir un jeu",playerName:"Votre nom",needName:"Entrez votre nom.",needPlayers:"Au moins 2 joueurs sont requis.",ready:"Préparez-vous…",hiddenTime:"Les secondes sont cachées",stop:"STOP",stopped:"Arrêté ! Attendez les autres…",round:"Manche",startRound:"Démarrer la manche",eliminated:"éliminé",king:"Roi du jeu",power:"Puissance",weekly:"Classement hebdomadaire",lastChampion:"Champion de la semaine dernière",wins:"Victoires",players:"Joueurs",maxPlayers:"2–8 joueurs",roomLocked:"La partie a commencé ; aucun nouveau joueur ne peut rejoindre.",youEliminated:"Vous êtes éliminé. Regardez jusqu'à la fin.",backGames:"Retour aux jeux",soloTimer:"🤖 Jouer seul",practiceOnly:"Entraînement contre l'ordinateur — ne compte pas pour le classement.",you:"Vous",opponents:"Adversaires",active:"En jeu",soundOn:"🔊 Son ON",soundOff:"🔇 Son OFF",create:"Créer une salle",code:"Code de salle",join:"Rejoindre",waiting:"En attente du deuxième joueur…",yourTurn:"À vous de jouer",opponentTurn:"Tour de l'adversaire",white:"Blanc",black:"Noir",leave:"Quitter la partie",room:"Salle",copy:"Copier le code",copied:"Code copié",invalid:"Salle introuvable.",full:"Salle pleine.",gameOver:"Partie terminée",winner:"Gagnant",helpChess:"Touchez votre pièce puis la case de destination.",helpMorris:"Placez d'abord vos 9 pions. Quand vous formez une ligne de trois, retirez un pion adverse.",error:"Erreur"}
};
const KINGDOM_NAMES={sq:"Mbretëria e Fundit",de:"Das letzte Königreich",tr:"Son Krallık",en:"The Last Kingdom",it:"L'ultimo Regno",hr:"Posljednje Kraljevstvo",fr:"Le Dernier Royaume",ar:"المملكة الأخيرة"};
for(const [code,name] of Object.entries(KINGDOM_NAMES)){if(TXT[code])TXT[code].kingdom=name;}
const UCK_NAMES={sq:"UÇK – Rruga e Lirisë",de:"UÇK – Weg der Freiheit",tr:"UÇK – Özgürlük Yolu",en:"UÇK – Road to Freedom",it:"UÇK – Via della Libertà",hr:"UÇK – Put slobode",fr:"UÇK – Chemin de la liberté",ar:"UÇK – طريق الحرية"};
for(const [code,name] of Object.entries(UCK_NAMES)){if(TXT[code])TXT[code].uck=name;}
const DIAMOND_RUN_NAMES={sq:"Diamond Run",de:"Diamond Run",tr:"Diamond Run",en:"Diamond Run",it:"Diamond Run",hr:"Diamond Run",fr:"Diamond Run",ar:"Diamond Run"};
for(const [code,name] of Object.entries(DIAMOND_RUN_NAMES)){if(TXT[code])TXT[code].diamondrun=name;}

function lang(){ const l=localStorage.getItem(LANG_KEY)||"sq"; return TXT[l]?l:"sq"; }
function tr(k){ return TXT[lang()][k] || TXT.sq[k] || k; }

const GX={
  sq:{info:"ℹ️ INFO",close:"Mbylle",practice:"🤖 Stërvitje me kompjuter · pa pikë",noOnlineFound:"Nuk u gjet lojtar online.",practiceNote:"Kjo lojë është vetëm për stërvitje. Nuk jep pikë, medalje, fitore javore ose shpërblime.",musicOn:"🎵 Muzika ON",musicOff:"🎵 Muzika OFF",colors:"🎨 Ngjyrat",soundAllOn:"🔊 Tingulli ON",soundAllOff:"🔇 Tingulli OFF",adminColors:"Ngjyrat standarde të Adminit",saveAdminColors:"Ruaj ngjyrat për të gjithë",myColors:"Ngjyrat e mia",resetColors:"Kthe ngjyrat e Adminit",onlineWait:"Duke pritur lojtar online…",resign:"🏳️ Dorëzohu",rematch:"🔄 Luajmë përsëri?",pause:"⏸️ Pauzë",score:"Pikë",lines:"Rreshta",level:"Nivel",best:"Rekordi",loading:"Po ngarkohet…",blocked:"Kjo lojë është e bllokuar nga Admini",name:"Emri",online2to8:"🌐 Luaj Online · 2–8 veta",online2to4:"🌐 Blloqe Online · 2–4 veta"},
  de:{info:"ℹ️ INFO",close:"Schließen",practice:"🤖 Training gegen Computer · ohne Punkte",noOnlineFound:"Kein Online-Spieler gefunden.",practiceNote:"Dieses Spiel ist nur Training. Es gibt keine Punkte, Medaillen, Wochensiege oder Belohnungen.",musicOn:"🎵 Musik AN",musicOff:"🎵 Musik AUS",colors:"🎨 Farben",soundAllOn:"🔊 Ton AN",soundAllOff:"🔇 Ton AUS",adminColors:"Standardfarben des Admins",saveAdminColors:"Farben für alle speichern",myColors:"Meine Farben",resetColors:"Admin-Farben wiederherstellen",onlineWait:"Warte auf Online-Spieler…",resign:"🏳️ Aufgeben",rematch:"🔄 Nochmal spielen?",pause:"⏸️ Pause",score:"Punkte",lines:"Linien",level:"Level",best:"Rekord",loading:"Wird geladen…",blocked:"Dieses Spiel wurde vom Admin gesperrt",name:"Name",online2to8:"🌐 Online spielen · 2–8 Spieler",online2to4:"🌐 Blöcke Online · 2–4 Spieler"},
  tr:{info:"ℹ️ BİLGİ",close:"Kapat",practice:"🤖 Bilgisayara karşı antrenman · puansız",noOnlineFound:"Çevrimiçi oyuncu bulunamadı.",practiceNote:"Bu oyun sadece antrenmandır. Puan, madalya, haftalık galibiyet veya ödül vermez.",musicOn:"🎵 Müzik AÇIK",musicOff:"🎵 Müzik KAPALI",colors:"🎨 Renkler",soundAllOn:"🔊 Ses AÇIK",soundAllOff:"🔇 Ses KAPALI",adminColors:"Yönetici varsayılan renkleri",saveAdminColors:"Renkleri herkes için kaydet",myColors:"Renklerim",resetColors:"Yönetici renklerine dön",onlineWait:"Çevrimiçi oyuncu bekleniyor…",resign:"🏳️ Teslim ol",rematch:"🔄 Tekrar oynayalım?",pause:"⏸️ Duraklat",score:"Puan",lines:"Satır",level:"Seviye",best:"Rekor",loading:"Yükleniyor…",blocked:"Bu oyun yönetici tarafından kilitlendi",name:"Ad",online2to8:"🌐 Online Oyna · 2–8 kişi",online2to4:"🌐 Bloklar Online · 2–4 kişi"},
  en:{info:"ℹ️ INFO",close:"Close",practice:"🤖 Practice vs computer · no points",noOnlineFound:"No online player was found.",practiceNote:"This game is practice only. It gives no points, medals, weekly wins or rewards.",musicOn:"🎵 Music ON",musicOff:"🎵 Music OFF",colors:"🎨 Colors",soundAllOn:"🔊 Sound ON",soundAllOff:"🔇 Sound OFF",adminColors:"Admin default colors",saveAdminColors:"Save colors for everyone",myColors:"My colors",resetColors:"Restore Admin colors",onlineWait:"Waiting for online player…",resign:"🏳️ Resign",rematch:"🔄 Play again?",pause:"⏸️ Pause",score:"Score",lines:"Lines",level:"Level",best:"Best",loading:"Loading…",blocked:"This game is blocked by Admin",name:"Name",online2to8:"🌐 Play Online · 2–8 players",online2to4:"🌐 Blocks Online · 2–4 players"},
  it:{info:"ℹ️ INFO",close:"Chiudi",practice:"🤖 Allenamento contro computer · senza punti",noOnlineFound:"Nessun giocatore online trovato.",practiceNote:"Questa partita è solo allenamento. Non assegna punti, medaglie, vittorie settimanali o premi.",musicOn:"🎵 Musica ON",musicOff:"🎵 Musica OFF",colors:"🎨 Colori",soundAllOn:"🔊 Audio ON",soundAllOff:"🔇 Audio OFF",adminColors:"Colori predefiniti Admin",saveAdminColors:"Salva colori per tutti",myColors:"I miei colori",resetColors:"Ripristina colori Admin",onlineWait:"In attesa di un giocatore online…",resign:"🏳️ Arrenditi",rematch:"🔄 Giochiamo ancora?",pause:"⏸️ Pausa",score:"Punti",lines:"Linee",level:"Livello",best:"Record",loading:"Caricamento…",blocked:"Questo gioco è bloccato dall'Admin",name:"Nome",online2to8:"🌐 Gioca Online · 2–8 giocatori",online2to4:"🌐 Blocchi Online · 2–4 giocatori"},
  hr:{info:"ℹ️ INFO",close:"Zatvori",practice:"🤖 Vježba protiv računala · bez bodova",noOnlineFound:"Nije pronađen online igrač.",practiceNote:"Ova igra služi samo za vježbu. Ne donosi bodove, medalje, tjedne pobjede ni nagrade.",musicOn:"🎵 Glazba UKLJ",musicOff:"🎵 Glazba ISKLJ",colors:"🎨 Boje",soundAllOn:"🔊 Zvuk UKLJ",soundAllOff:"🔇 Zvuk ISKLJ",adminColors:"Zadane Admin boje",saveAdminColors:"Spremi boje za sve",myColors:"Moje boje",resetColors:"Vrati Admin boje",onlineWait:"Čeka se online igrač…",resign:"🏳️ Predaj se",rematch:"🔄 Igraj ponovno?",pause:"⏸️ Pauza",score:"Bodovi",lines:"Linije",level:"Razina",best:"Rekord",loading:"Učitavanje…",blocked:"Admin je blokirao ovu igru",name:"Ime",online2to8:"🌐 Igraj Online · 2–8 igrača",online2to4:"🌐 Blokovi Online · 2–4 igrača"},
  fr:{info:"ℹ️ INFO",close:"Fermer",practice:"🤖 Entraînement contre ordinateur · sans points",noOnlineFound:"Aucun joueur en ligne trouvé.",practiceNote:"Cette partie sert uniquement d’entraînement. Aucun point, médaille, victoire hebdomadaire ou récompense.",musicOn:"🎵 Musique ON",musicOff:"🎵 Musique OFF",colors:"🎨 Couleurs",soundAllOn:"🔊 Son ON",soundAllOff:"🔇 Son OFF",adminColors:"Couleurs par défaut Admin",saveAdminColors:"Enregistrer pour tous",myColors:"Mes couleurs",resetColors:"Restaurer les couleurs Admin",onlineWait:"En attente d’un joueur en ligne…",resign:"🏳️ Abandonner",rematch:"🔄 Rejouer ?",pause:"⏸️ Pause",score:"Score",lines:"Lignes",level:"Niveau",best:"Record",loading:"Chargement…",blocked:"Ce jeu est bloqué par l’Admin",name:"Nom",online2to8:"🌐 Jouer en ligne · 2–8 joueurs",online2to4:"🌐 Blocs Online · 2–4 joueurs"},
  ar:{info:"ℹ️ معلومات",close:"إغلاق",practice:"🤖 تدريب ضد الكمبيوتر · بدون نقاط",noOnlineFound:"لم يتم العثور على لاعب أونلاين.",practiceNote:"هذه اللعبة للتدريب فقط. لا تمنح نقاطًا أو ميداليات أو انتصارات أسبوعية أو مكافآت.",musicOn:"🎵 الموسيقى تعمل",musicOff:"🎵 الموسيقى متوقفة",colors:"🎨 الألوان",soundAllOn:"🔊 الصوت يعمل",soundAllOff:"🔇 الصوت متوقف",adminColors:"ألوان المشرف الافتراضية",saveAdminColors:"حفظ الألوان للجميع",myColors:"ألواني",resetColors:"استعادة ألوان المشرف",onlineWait:"بانتظار لاعب عبر الإنترنت…",resign:"🏳️ استسلام",rematch:"🔄 اللعب مجددًا؟",pause:"⏸️ إيقاف مؤقت",score:"النقاط",lines:"الخطوط",level:"المستوى",best:"الأفضل",loading:"جارٍ التحميل…",blocked:"هذه اللعبة محظورة من المشرف",name:"الاسم",online2to8:"🌐 لعب أونلاين · 2–8 لاعبين",online2to4:"🌐 الكتل أونلاين · 2–4 لاعبين"}
};
function gx(k){return GX[lang()]?.[k]||GX.sq[k]||k;}

const GAME_INFO={
  sq:{chess:["Shah","Lëviz figurat sipas rregullave të shahut dhe bëj mat mbretin kundërshtar. Online numëron për fitoret javore. Kundër kompjuterit është vetëm stërvitje pa pikë."],morris:["Degërxhik","Vendos 9 gurët. Kur formon treshe, hiq një gur të kundërshtarit. Pastaj lëviz gurët në pikat e lidhura. Online numëron; kundër kompjuterit është stërvitje pa pikë."],timer:["Kral i Sekondave","App-i cakton një kohë. Shtyp STOP sa më afër kohës së kërkuar. Online luan me usera të tjerë. Kundër kompjuterit është vetëm stërvitje pa pikë."],tetris:["Blloqe","Rrotullo dhe lëviz blloqet për të plotësuar rreshta. Online fiton lojtari i fundit që mbetet. Loja solo është stërvitje dhe nuk regjistron pikë në renditje."],war:["Luftra","Zgjidh një nga dy armët dhe sulmo kundërshtarin. Online mund të luajnë deri 8 veta. Kundër kompjuterit është vetëm stërvitje pa pikë, pa diamanta dhe pa shpërblime."]},
  de:{chess:["Schach","Ziehe die Figuren nach den Schachregeln und setze den gegnerischen König matt. Online zählt für Wochensiege. Gegen den Computer ist nur Training ohne Punkte."],morris:["Mühle","Setze 9 Steine. Bildest du eine Dreierreihe, entfernst du einen gegnerischen Stein. Danach bewegst du die Steine entlang der Linien. Online zählt; Computer ist Training ohne Punkte."],timer:["Sekundenkönig","Die App gibt eine Zielzeit vor. Drücke STOP möglichst nah an dieser Zeit. Online spielst du gegen andere User. Gegen den Computer ist nur Training ohne Punkte."],tetris:["Blöcke","Drehe und verschiebe die Blöcke, um Reihen zu füllen. Online gewinnt der letzte verbleibende Spieler. Solo ist Training und speichert keine Ranglistenpunkte."],war:["Krieg","Wähle eine von zwei Waffen und greife den Gegner an. Online können bis zu 8 Spieler teilnehmen. Gegen Computer ist nur Training: keine Punkte, Diamanten oder Belohnungen."]},
  tr:{chess:["Satranç","Taşları satranç kurallarına göre oynat ve rakip şahı mat et. Online oyun haftalık galibiyetlere sayılır. Bilgisayara karşı oyun yalnızca puansız antrenmandır."],morris:["Dokuz Taş","9 taşını yerleştir. Üçlü oluşturunca rakibin bir taşını kaldır. Sonra taşları bağlı noktalarda hareket ettir. Online sayılır; bilgisayar oyunu puansız antrenmandır."],timer:["Saniye Kralı","Uygulama bir hedef süre verir. STOP'a hedefe mümkün olduğunca yakın bas. Online başka kullanıcılarla oynarsın. Bilgisayara karşı yerel oyun puansız antrenmandır."],tetris:["Bloklar","Satırları tamamlamak için blokları döndür ve taşı. Online son kalan oyuncu kazanır. Solo oyun antrenmandır ve sıralamaya puan kaydetmez."],war:["Savaş","İki silahtan birini seçip rakibe saldır. Online en fazla 8 kişi oynayabilir. Bilgisayara karşı sadece antrenmandır; puan, elmas veya ödül yoktur."]},
  en:{chess:["Chess","Move the pieces by chess rules and checkmate the opponent king. Online games count toward weekly wins. Computer games are practice only with no points."],morris:["Nine Men's Morris","Place 9 stones. When you form a row of three, remove one opponent stone. Then move stones along connected points. Online counts; computer play is practice with no points."],timer:["King of Seconds","The app gives a target time. Press STOP as close to it as possible. Online is against other users. Computer play is practice only with no points."],tetris:["Blocks","Rotate and move blocks to complete rows. Online, the last remaining player wins. Solo play is practice and does not save ranking points."],war:["War","Choose one of two weapons and attack the opponent. Up to 8 players can play online. Computer play is practice only: no points, diamonds or rewards."]},
  it:{chess:["Scacchi","Muovi i pezzi secondo le regole degli scacchi e dai scacco matto al re avversario. L'online conta per le vittorie settimanali. Contro il computer è solo allenamento senza punti."],morris:["Mulino","Posiziona 9 pedine. Quando crei una fila di tre, rimuovi una pedina avversaria. Poi muovi le pedine sui punti collegati. Online conta; contro il computer è allenamento senza punti."],timer:["Re dei secondi","L'app assegna un tempo obiettivo. Premi STOP il più vicino possibile. Online giochi con altri utenti. Contro il computer è solo allenamento senza punti."],tetris:["Blocchi","Ruota e sposta i blocchi per completare le righe. Online vince l'ultimo giocatore rimasto. La modalità solo è allenamento e non salva punti in classifica."],war:["Guerra","Scegli una delle due armi e attacca l'avversario. Online possono giocare fino a 8 persone. Contro il computer è solo allenamento: niente punti, diamanti o premi."]},
  hr:{chess:["Šah","Pomiči figure po pravilima šaha i matiraj protivničkog kralja. Online se računa za tjedne pobjede. Protiv računala je samo vježba bez bodova."],morris:["Mlin","Postavi 9 kamenčića. Kad napraviš niz od tri, ukloni protivnički kamen. Zatim pomiči kamenje po povezanim točkama. Online se računa; računalo je vježba bez bodova."],timer:["Kralj sekundi","Aplikacija zada ciljno vrijeme. Pritisni STOP što bliže tom vremenu. Online igraš protiv drugih korisnika. Protiv računala je samo vježba bez bodova."],tetris:["Blokovi","Okreći i pomiči blokove kako bi popunio redove. Online pobjeđuje posljednji preostali igrač. Solo je vježba i ne sprema bodove ljestvice."],war:["Rat","Odaberi jedno od dva oružja i napadni protivnika. Online može igrati do 8 igrača. Protiv računala je samo vježba: bez bodova, dijamanata i nagrada."]},
  fr:{chess:["Échecs","Déplace les pièces selon les règles et mets le roi adverse échec et mat. Les parties en ligne comptent pour les victoires hebdomadaires. Contre l'ordinateur, c'est un entraînement sans points."],morris:["Moulin","Place 9 pions. Quand tu formes une ligne de trois, retire un pion adverse. Ensuite, déplace les pions sur les points reliés. L'online compte; l'ordinateur est un entraînement sans points."],timer:["Roi des secondes","L'app donne un temps cible. Appuie sur STOP le plus près possible. En ligne, tu joues contre d'autres utilisateurs. Contre l'ordinateur, c'est un entraînement sans points."],tetris:["Blocs","Fais pivoter et déplace les blocs pour compléter des lignes. En ligne, le dernier joueur restant gagne. Le mode solo est un entraînement et n'enregistre aucun point de classement."],war:["Guerre","Choisis une des deux armes et attaque l'adversaire. Jusqu'à 8 joueurs peuvent jouer en ligne. Contre l'ordinateur, c'est uniquement un entraînement: aucun point, diamant ou récompense."]},
  ar:{chess:["الشطرنج","حرّك القطع حسب قواعد الشطرنج وحاصر ملك الخصم. اللعب أونلاين يُحتسب ضمن انتصارات الأسبوع. اللعب ضد الكمبيوتر تدريب فقط بدون نقاط."],morris:["الطاحونة","ضع 9 أحجار. عند تكوين ثلاثة على خط واحد أزل حجرًا للخصم، ثم حرّك الأحجار بين النقاط المتصلة. الأونلاين يُحتسب؛ والكمبيوتر تدريب بدون نقاط."],timer:["ملك الثواني","يحدد التطبيق وقتًا مستهدفًا. اضغط إيقاف بأقرب وقت ممكن إليه. أونلاين تلعب ضد مستخدمين آخرين، وضد الكمبيوتر تدريب فقط بدون نقاط."],tetris:["الكتل","دوّر الكتل وحرّكها لإكمال الصفوف. أونلاين يفوز آخر لاعب يبقى. اللعب الفردي تدريب ولا يحفظ نقاطًا في الترتيب."],war:["الحرب","اختر واحدًا من سلاحين وهاجم الخصم. يمكن لما يصل إلى 8 لاعبين اللعب أونلاين. ضد الكمبيوتر تدريب فقط: بدون نقاط أو ألماس أو مكافآت."]}
};
const KINGDOM_INFO={
  sq:["Mbretëria e Fundit","Zgjero territorin, ndërto mure dhe ura, përdor ushtarë e fuqi të rralla dhe provo të pushtosh kështjellën kundërshtare. Çdo raund merr 2 fuqi rastësore; pas 24 raundeve fiton territori më i madh."],
  de:["Das letzte Königreich","Erweitere dein Gebiet, baue Mauern und Brücken und nutze Soldaten sowie seltene Kräfte, um die gegnerische Burg zu erobern. Jede Runde erhältst du 2 zufällige Kräfte; nach 24 Runden gewinnt das größere Gebiet."],
  tr:["Son Krallık","Bölgeni büyüt, duvarlar ve köprüler kur, askerleri ve nadir güçleri kullanarak rakibin kalesini ele geçir. Her turda 2 rastgele güç gelir; 24 turun sonunda daha büyük bölge kazanır."],
  en:["The Last Kingdom","Expand your territory, build walls and bridges, and use soldiers and rare powers to capture the enemy castle. Each round gives you 2 random powers; after 24 rounds the larger territory wins."],
  it:["L'ultimo Regno","Espandi il territorio, costruisci muri e ponti e usa soldati e poteri rari per conquistare il castello avversario. Ogni turno ricevi 2 poteri casuali; dopo 24 turni vince il territorio più grande."],
  hr:["Posljednje Kraljevstvo","Proširi teritorij, gradi zidove i mostove te koristi vojnike i rijetke moći kako bi osvojio protivnički dvorac. Svaku rundu dobivaš 2 nasumične moći; nakon 24 runde pobjeđuje veći teritorij."],
  fr:["Le Dernier Royaume","Agrandissez votre territoire, construisez des murs et des ponts et utilisez soldats et pouvoirs rares pour capturer le château adverse. Chaque tour donne 2 pouvoirs aléatoires; après 24 tours, le plus grand territoire gagne."],
  ar:["المملكة الأخيرة","وسّع أرضك وابنِ الجدران والجسور واستخدم الجنود والقوى النادرة للاستيلاء على قلعة الخصم. في كل جولة تحصل على قوتين عشوائيتين؛ بعد 24 جولة يفوز صاحب الأرض الأكبر."]
};
for(const [code,data] of Object.entries(KINGDOM_INFO)){if(GAME_INFO[code])GAME_INFO[code].kingdom=data;}
const UCK_INFO={
  sq:["UÇK – Rruga e Lirisë","Lojë misioni me ushtar UÇK: gjej rrugën e sigurt, dërgo furnizime, ndihmo të plagosurit, shoqëro civilët dhe mbro zonat e caktuara. Qëllimi është të përfundosh misionin me sa më shumë jetë dhe pikë."],
  de:["UÇK – Weg der Freiheit","Missionsspiel mit einem UÇK-Soldaten: finde sichere Wege, bringe Nachschub, leiste medizinische Hilfe, begleite Zivilisten und sichere markierte Zonen. Ziel ist es, die Mission mit möglichst viel Gesundheit und Punkten abzuschließen."],
  tr:["UÇK – Özgürlük Yolu","UÇK askeriyle görev oyunu: güvenli yolu bul, malzeme ulaştır, yaralılara yardım et, sivillere eşlik et ve belirlenen bölgeleri koru. Amaç görevi mümkün olduğunca yüksek sağlık ve puanla tamamlamaktır."],
  en:["UÇK – Road to Freedom","Mission game with a UÇK soldier: find safe routes, deliver supplies, provide medical aid, escort civilians and secure marked zones. Finish each mission with as much health and score as possible."],
  it:["UÇK – Via della Libertà","Gioco a missioni con un soldato UÇK: trova percorsi sicuri, consegna rifornimenti, presta soccorso medico, accompagna civili e proteggi le zone indicate. Completa la missione con più salute e punti possibile."],
  hr:["UÇK – Put slobode","Igra misija s vojnikom UÇK-a: pronađi sigurne putove, dostavi zalihe, pruži medicinsku pomoć, prati civile i osiguraj označene zone. Završi misiju sa što više zdravlja i bodova."],
  fr:["UÇK – Chemin de la liberté","Jeu de missions avec un soldat UÇK : trouvez des itinéraires sûrs, livrez du ravitaillement, apportez une aide médicale, escortez des civils et sécurisez les zones indiquées. Terminez avec le plus de santé et de points possible."],
  ar:["UÇK – طريق الحرية","لعبة مهام بجندي من UÇK: ابحث عن الطرق الآمنة، أوصل الإمدادات، قدّم المساعدة الطبية، رافق المدنيين وأمّن المناطق المحددة. أكمل المهمة بأكبر قدر ممكن من الصحة والنقاط."]
};
for(const [code,data] of Object.entries(UCK_INFO)){if(GAME_INFO[code])GAME_INFO[code].uck=data;}
const DIAMOND_RUN_INFO={
  sq:["Diamond Run","Lojë platformë origjinale DIAMOND: vrapo, kërce, mblidh diamante, shmang armiqtë dhe pengesat, aktivizo checkpoint-et dhe arrij flamurin. Ka 5 nivele që bëhen gjithnjë e më të vështira."],
  de:["Diamond Run","Originales DIAMOND-Plattformspiel: laufen, springen, Diamanten sammeln, Gegner und Hindernisse meiden, Checkpoints aktivieren und die Flagge erreichen. Es gibt 5 zunehmend schwierigere Level."],
  tr:["Diamond Run","Özgün DIAMOND platform oyunu: koş, zıpla, elmasları topla, düşmanlardan ve engellerden kaç, kontrol noktalarını etkinleştir ve bayrağa ulaş. Giderek zorlaşan 5 bölüm vardır."],
  en:["Diamond Run","Original DIAMOND platform game: run, jump, collect diamonds, avoid enemies and hazards, activate checkpoints and reach the flag. It has 5 increasingly difficult levels."],
  it:["Diamond Run","Platform originale DIAMOND: corri, salta, raccogli diamanti, evita nemici e ostacoli, attiva i checkpoint e raggiungi la bandiera. Ci sono 5 livelli sempre più difficili."],
  hr:["Diamond Run","Originalna DIAMOND platform igra: trči, skači, skupljaj dijamante, izbjegavaj neprijatelje i prepreke, aktiviraj kontrolne točke i dođi do zastave. Ima 5 sve težih razina."],
  fr:["Diamond Run","Jeu de plateforme DIAMOND original : courez, sautez, ramassez des diamants, évitez ennemis et dangers, activez les checkpoints et atteignez le drapeau. Il comporte 5 niveaux de difficulté croissante."],
  ar:["Diamond Run","لعبة منصات أصلية من DIAMOND: اركض واقفز واجمع الألماس وتجنب الأعداء والعوائق وفعّل نقاط الحفظ حتى تصل إلى العلم. تحتوي على 5 مستويات تزداد صعوبة."]
};
for(const [code,data] of Object.entries(DIAMOND_RUN_INFO)){if(GAME_INFO[code])GAME_INFO[code].diamondrun=data;}
const DIAMOND_ADVENTURE_INFO={
  sq:["Diamond Adventure","Vrapo në 5 botë, kërce, rrotullohu, thyej kuti, mblidh diamante, përdor mburojë dhe mposht Boss-in. Progresi ruhet automatikisht."],
  de:["Diamond Adventure","Laufe durch 5 Welten, springe, wirble, zerstöre Kisten, sammle Diamanten, nutze Schilde und besiege den Boss. Fortschritt wird automatisch gespeichert."],
  tr:["Diamond Adventure","5 dünyada koş, zıpla, dön, kutuları kır, elmas topla, kalkan kullan ve Boss’u yen. İlerleme otomatik kaydedilir."],
  en:["Diamond Adventure","Run through 5 worlds, jump, spin, break boxes, collect diamonds, use shields and defeat the boss. Progress saves automatically."],
  it:["Diamond Adventure","Corri in 5 mondi, salta, ruota, rompi casse, raccogli diamanti, usa scudi e sconfiggi il boss."],
  hr:["Diamond Adventure","Trči kroz 5 svjetova, skači, okreći se, razbijaj kutije, skupljaj dijamante i pobijedi bossa."],
  fr:["Diamond Adventure","Traverse 5 mondes, saute, tourne, casse des caisses, ramasse des diamants et bats le boss."],
  ar:["Diamond Adventure","اركض عبر 5 عوالم، اقفز ولف، اكسر الصناديق، اجمع الألماس واهزم الزعيم."]
};
for(const [code,data] of Object.entries(DIAMOND_ADVENTURE_INFO)){if(GAME_INFO[code])GAME_INFO[code].diamondadventure=data;}
function gameInfoData(){const d=GAME_INFO[lang()]?.[selectedType]||GAME_INFO.sq[selectedType]||GAME_INFO.sq.chess;return {title:d[0],body:d[1]};}
function closeGameInfo(){document.getElementById("gameInfoOverlay")?.remove();}
function openGameInfo(){
  closeGameInfo();
  const d=gameInfoData(),overlay=document.createElement("div");
  overlay.id="gameInfoOverlay";overlay.className="game-info-overlay";
  overlay.innerHTML='<section class="game-info-card"><button id="gameInfoClose" class="game-info-close" type="button">✕</button><h2>ℹ️ '+escapeHtml(d.title)+'</h2><p>'+escapeHtml(d.body)+'</p><div class="game-info-practice">'+escapeHtml(gx("practiceNote"))+'</div><button id="gameInfoCloseBottom" class="primary" type="button">'+escapeHtml(gx("close"))+'</button></section>';
  document.body.appendChild(overlay);
  document.getElementById("gameInfoClose")?.addEventListener("click",closeGameInfo);
  document.getElementById("gameInfoCloseBottom")?.addEventListener("click",closeGameInfo);
  overlay.addEventListener("click",e=>{if(e.target===overlay)closeGameInfo();});
}
function ensureGameInfoButton(){
  if(!root||!root.firstElementChild||document.getElementById("gameInfoButton"))return;
  const runningDiamond=selectedType==="diamondrun"&&!!root.querySelector(".diamond-run-shell");
  const btn=document.createElement("button");
  btn.id="gameInfoButton";
  btn.className="game-info-fab"+(runningDiamond?" diamond-run-info-mini":"");
  btn.type="button";
  btn.textContent=runningDiamond?"i":gx("info");
  btn.setAttribute("aria-label",gx("info"));
  btn.addEventListener("click",openGameInfo);
  root.firstElementChild.appendChild(btn);
}
function startPracticeForGame(game=selectedType){
  practiceFallbackGame=null;
  if(game==="chess"||game==="morris"){selectedType=game;startComputerGame();return;}
  if(game==="timer"){selectedType=game;startTimerSoloGame();return;}
  if(game==="tetris"){selectedType=game;startTetrisGame({practice:true});return;}
  if(game==="war"){selectedType=game;startWarGame(true);return;}
  if(game==="kingdom"){selectedType=game;startKingdomGame();return;}
  if(game==="uck"){selectedType=game;startUckGame();return;}
  if(game==="diamondrun"){selectedType=game;startDiamondRunGame();return;}
  if(game==="diamondadventure"){selectedType=game;startDiamondAdventureGame();return;}
}


const GAME_AUTO_TRANSLATE_CACHE_KEY="diamond-game-auto-translate-v1";
let gameAutoTranslateTimer=null;
let gameAutoTranslateBusy=false;
let gameAutoTranslateCache={};
try{gameAutoTranslateCache=JSON.parse(localStorage.getItem(GAME_AUTO_TRANSLATE_CACHE_KEY)||"{}")||{};}catch(_){gameAutoTranslateCache={};}
function likelyAlbanianGameUiText(value){
  const t=String(value||"").trim();
  if(t.length<3||t.length>600)return false;
  return /[ëçËÇ]|\b(loj|lojtar|fit|kundër|radha|prit|emr|ngarko|bllok|arm|zemr|mbrojt|sulm|bomb|akull|dron|helikopter|rreth|kral|sekond|përsëri|zgjedh|dërgo|larg|shpërbl|pik|jav|vazhdo|pauz|rekord|rresht|ngjyr|muzik|tingull|zëri|shah|degër|blloqe|luftra|admini|kompjuter|fitoi|humb|gjuan|dogj|përfund|bardh|zi|dhom|kodi|kopjo|dil|gabim)\w*/i.test(t);
}
function skipAutoTranslateNode(node){
  const el=node?.parentElement;
  if(!el)return true;
  return !!el.closest(".war-chat-list,.war-multi-name,.timer-face-name,.board-rank-row,.war-leaderboard,input,textarea,select,option,[data-no-game-translate]");
}
async function autoTranslateGameUI(){
  if(!root||lang()==="sq"||gameAutoTranslateBusy)return;
  const target=lang(),nodes=[],texts=[];
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let n;
  while((n=walker.nextNode())){
    const raw=n.nodeValue?.trim()||"";
    if(!raw||skipAutoTranslateNode(n)||!likelyAlbanianGameUiText(raw))continue;
    const key=target+"|"+raw;
    if(gameAutoTranslateCache[key]){
      n.nodeValue=n.nodeValue.replace(raw,gameAutoTranslateCache[key]);
    }else{
      nodes.push([n,raw,key]);texts.push(raw);
    }
  }
  const unique=[...new Set(texts)].slice(0,80);
  if(!unique.length)return;
  gameAutoTranslateBusy=true;
  try{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session?.access_token)return;
    const response=await fetch(SUPABASE_URL+"/functions/v1/diamond-game-translate",{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+session.access_token},
      body:JSON.stringify({target,texts:unique}),cache:"force-cache"
    });
    const result=await response.json();
    if(!response.ok)return;
    const map=result?.translations||{};
    for(const [node,raw,key] of nodes){
      const translated=map[raw];
      if(translated&&translated!==raw){
        gameAutoTranslateCache[key]=translated;
        if(node.isConnected)node.nodeValue=node.nodeValue.replace(raw,translated);
      }
    }
    try{localStorage.setItem(GAME_AUTO_TRANSLATE_CACHE_KEY,JSON.stringify(gameAutoTranslateCache));}catch(_){}
  }catch(error){console.warn("game auto translate",error);}
  finally{gameAutoTranslateBusy=false;}
}
function scheduleAutoTranslateGameUI(){
  if(gameAutoTranslateTimer)clearTimeout(gameAutoTranslateTimer);
  gameAutoTranslateTimer=setTimeout(autoTranslateGameUI,60);
}
const gameTranslateObserver=new MutationObserver(()=>{scheduleAutoTranslateGameUI();queueMicrotask(ensureGameInfoButton);});
if(root)gameTranslateObserver.observe(root,{subtree:true,childList:true,characterData:true});




function validGameColor(v){return typeof v==="string"&&/^#[0-9a-f]{6}$/i.test(v);}
function normalizeGameTheme(v={}){
  const out={...adminGameTheme};
  for(const k of Object.keys(out))if(validGameColor(v?.[k]))out[k]=v[k];
  return out;
}
function currentGameTheme(){
  if(userGameTheme)return normalizeGameTheme(userGameTheme);
  return normalizeGameTheme(adminGameTheme);
}
function applyGameTheme(){
  const t=currentGameTheme(),r=document.documentElement;
  r.style.setProperty("--game-light",t.light);r.style.setProperty("--game-dark",t.dark);
  r.style.setProperty("--game-primary",t.primary);r.style.setProperty("--game-secondary",t.secondary);
  r.style.setProperty("--game-arena",t.arena);
}
async function loadGameThemeDefaults(){
  try{
    const {data}=await supabase.from("app_settings").select("value").eq("key",GAME_THEME_SETTING_KEY).maybeSingle();
    if(data?.value)adminGameTheme=normalizeGameTheme(data.value);
  }catch(_){}
  try{const raw=JSON.parse(localStorage.getItem(GAME_USER_THEME_KEY)||"null");if(raw)userGameTheme=normalizeGameTheme(raw);}catch(_){userGameTheme=null;}
  applyGameTheme();
}
async function saveAdminGameTheme(){
  if(!gamesAdmin)return;
  const theme={light:document.getElementById("gameColorLight")?.value,dark:document.getElementById("gameColorDark")?.value,primary:document.getElementById("gameColorPrimary")?.value,secondary:document.getElementById("gameColorSecondary")?.value,arena:document.getElementById("gameColorArena")?.value};
  const normalized=normalizeGameTheme(theme);
  const {data:s}=await supabase.auth.getSession();const user=s?.session?.user;if(!user)return;
  const {error}=await supabase.from("app_settings").upsert({key:GAME_THEME_SETTING_KEY,value:normalized,updated_at:new Date().toISOString(),updated_by:user.id},{onConflict:"key"});
  if(!error){adminGameTheme=normalized;if(!userGameTheme)applyGameTheme();gameThemePanelOpen=false;renderLobby();}
}
function saveUserGameTheme(){
  const theme={light:document.getElementById("gameColorLight")?.value,dark:document.getElementById("gameColorDark")?.value,primary:document.getElementById("gameColorPrimary")?.value,secondary:document.getElementById("gameColorSecondary")?.value,arena:document.getElementById("gameColorArena")?.value};
  userGameTheme=normalizeGameTheme(theme);localStorage.setItem(GAME_USER_THEME_KEY,JSON.stringify(userGameTheme));applyGameTheme();
}
function resetUserGameTheme(){userGameTheme=null;localStorage.removeItem(GAME_USER_THEME_KEY);applyGameTheme();gameThemePanelOpen=false;renderLobby();}
function gameThemeControls(){
  const t=currentGameTheme();
  const panel=gameThemePanelOpen
    ? '<section class="game-theme-controls"><strong>'+gx(gamesAdmin?"adminColors":"myColors")+'</strong><div class="game-color-grid">'+
      '<label>1<input id="gameColorLight" type="color" value="'+t.light+'"></label>'+
      '<label>2<input id="gameColorDark" type="color" value="'+t.dark+'"></label>'+
      '<label>3<input id="gameColorPrimary" type="color" value="'+t.primary+'"></label>'+
      '<label>4<input id="gameColorSecondary" type="color" value="'+t.secondary+'"></label>'+
      '<label>◼<input id="gameColorArena" type="color" value="'+t.arena+'"></label></div>'+
      (gamesAdmin?'<button id="saveAdminGameTheme" class="secondary" type="button">'+gx("saveAdminColors")+'</button>':'<button id="resetUserGameTheme" class="secondary" type="button">'+gx("resetColors")+'</button>')+
      '</section>'
    : '';
  return '<div class="game-theme-dock"><button id="gameThemeToggle" class="game-theme-toggle" type="button" aria-label="'+gx("colors")+'" title="'+gx("colors")+'">🎨</button>'+panel+'</div>';
}
function setMasterSound(enabled){
  masterSoundEnabled=!!enabled;localStorage.setItem(GAME_SOUND_MASTER_KEY,masterSoundEnabled?"on":"off");
  setTimerSound(masterSoundEnabled);setTetrisSound(masterSoundEnabled);warSoundEnabled=masterSoundEnabled;localStorage.setItem(WAR_SOUND_KEY,masterSoundEnabled?"on":"off");
}
function orientalNote(freq,start,dur,gain=.025){
  if(!gameAudioContext||!gameMusicGain)return;
  const o=gameAudioContext.createOscillator(),g=gameAudioContext.createGain();
  o.type="sine";o.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(gain,start+.03);g.gain.exponentialRampToValueAtTime(.0001,start+dur);
  o.connect(g);g.connect(gameMusicGain);o.start(start);o.stop(start+dur+.03);
}
async function playOrientalPhrase(){
  if(!gameMusicEnabled)return;
  const ctx=await ensureGameAudio();if(!ctx)return;
  if(!gameMusicGain){gameMusicGain=ctx.createGain();gameMusicGain.gain.value=.75;gameMusicGain.connect(ctx.destination);}
  const base=220,ratio=[1,1.125,1.2,1.5,1.6,1.5,1.2,1.125];
  const now=ctx.currentTime+.03;ratio.forEach((r,i)=>orientalNote(base*r,now+i*.34,.30,.024));
}
function startGameMusic(){
  if(!gameMusicEnabled)return;
  playOrientalPhrase();
  if(gameMusicTimer)clearInterval(gameMusicTimer);
  gameMusicTimer=setInterval(playOrientalPhrase,3100);
}
function stopGameMusic(){if(gameMusicTimer){clearInterval(gameMusicTimer);gameMusicTimer=null;}if(gameMusicGain)gameMusicGain.gain.value=0;}
function stopGameAudioForExit(){
  stopGameMusic();
  try{
    if(gameAudioContext && gameAudioContext.state==="running") gameAudioContext.suspend().catch(()=>{});
  }catch(_){}
}
function setGameMusic(enabled){gameMusicEnabled=!!enabled;localStorage.setItem(GAME_MUSIC_KEY,gameMusicEnabled?"on":"off");if(enabled){if(gameMusicGain)gameMusicGain.gain.value=.75;startGameMusic();}else stopGameMusic();}
function genericGameTone(freq=420,dur=.06){
  if(!masterSoundEnabled)return;
  ensureGameAudio().then(ctx=>{if(!ctx)return;const o=ctx.createOscillator(),gn=ctx.createGain(),st=ctx.currentTime;o.frequency.value=freq;o.type="sine";gn.gain.setValueAtTime(.05,st);gn.gain.exponentialRampToValueAtTime(.0001,st+dur);o.connect(gn);gn.connect(ctx.destination);o.start(st);o.stop(st+dur+.02);});
}

const WAR_TXT={
  sq:{yourTurnCaps:"RADHA JOTE",opponent:"KUNDËRSHTARI",you:"TI",yourWeapons:"ARMËT E TUA",soundOn:"🔊 Zëri ON",soundOff:"🔇 Zëri OFF",changeWeapons:"🎲 Ndrysho armët",wins:"fitore",games:"lojëra",bonus:"bonus",chooseWeapon:"Zgjidh njërën nga 2 armët.",playAgain:"🔄 Luaj përsëri",weaponAttack:"Sulm",weaponBomb:"Bombë",weaponHeart:"Zemër",weaponHelicopter:"Helikopter",weaponAtom:"Atom",weaponProtect:"Mbrojtje",weaponAzrael:"Melaqja Asrail",weaponIce:"Akull",weaponDrone:"Droni",weaponFire:"Rreth i zjarrtë",twoAttacks:"2 sulme",shootAgain2:"−2 ❤️ · gjuan prapë",protect2:"mbron 2 herë",koNoDefense:"KO pa mbrojtje",nextAttack:"arma tjetër bëhet Sulm",shootAgain1:"−1 ❤️ · gjuan prapë",burnBlack:"−2 ❤️ · e bën të zi",finish:"FUND",warOnline:"Luftra Online",waitingPlayers:"Duke pritur lojtarët…",wait10:"Po presim deri në 10 sekonda që të hyjë së paku një lojtar tjetër.",noComputerNote:"Nëse askush nuk hyn, nuk luan kundër kompjuterit — del pulla “Provo përsëri”.",retry:"🔄 Provo përsëri",noPlayer:"Nuk u gjet lojtar tjetër.",noComputerSwitch:"Nuk kalon automatikisht te kompjuteri.",waitTurnCaps:"PRIT RADHËN",alive:"gjallë",players:"lojtarë",winner:"Fituesi",playOnlineAgain:"🌐 Përsëri luaj online",target:"Objektivi",tapTarget:"Prek lojtarin që dëshiron ta sulmosh.",waitYourTurn:"Prit deri sa të vijë radha jote.",eliminated:"Eliminuar",turn:"Radha",notEnough3:"Nuk ke 3 💎.",weaponsNotChanged:"Armët nuk u ndryshuan.",chooseTarget:"Zgjidh së pari cilin lojtar dëshiron ta godasësh."},
  de:{yourTurnCaps:"DU BIST DRAN",opponent:"GEGNER",you:"DU",yourWeapons:"DEINE WAFFEN",soundOn:"🔊 Ton AN",soundOff:"🔇 Ton AUS",changeWeapons:"🎲 Waffen wechseln",wins:"Siege",games:"Spiele",bonus:"Bonus",chooseWeapon:"Wähle eine deiner 2 Waffen.",playAgain:"🔄 Noch einmal spielen",weaponAttack:"Angriff",weaponBomb:"Bombe",weaponHeart:"Herz",weaponHelicopter:"Hubschrauber",weaponAtom:"Atom",weaponProtect:"Schutz",weaponAzrael:"Engel Azrael",weaponIce:"Eis",weaponDrone:"Drohne",weaponFire:"Feuerring",twoAttacks:"2 Angriffe",shootAgain2:"−2 ❤️ · nochmal schießen",protect2:"schützt 2-mal",koNoDefense:"KO ohne Schutz",nextAttack:"nächste Waffe wird Angriff",shootAgain1:"−1 ❤️ · nochmal schießen",burnBlack:"−2 ❤️ · verbrennt Gegner",finish:"ENDE",warOnline:"Krieg Online",waitingPlayers:"Warte auf Spieler…",wait10:"Wir warten bis zu 10 Sekunden auf mindestens einen weiteren Spieler.",noComputerNote:"Wenn niemand beitritt, spielst du nicht gegen den Computer — „Erneut versuchen“ erscheint.",retry:"🔄 Erneut versuchen",noPlayer:"Kein weiterer Spieler gefunden.",noComputerSwitch:"Es wird nicht automatisch auf den Computer gewechselt.",waitTurnCaps:"WARTE AUF DEINEN ZUG",alive:"am Leben",players:"Spieler",winner:"Gewinner",playOnlineAgain:"🌐 Erneut online spielen",target:"Ziel",tapTarget:"Tippe den Spieler an, den du angreifen willst.",waitYourTurn:"Warte, bis du an der Reihe bist.",eliminated:"Ausgeschieden",turn:"Zug",notEnough3:"Du hast keine 3 💎.",weaponsNotChanged:"Waffen wurden nicht geändert.",chooseTarget:"Wähle zuerst einen Spieler als Ziel."},
  tr:{yourTurnCaps:"SIRA SENDE",opponent:"RAKİP",you:"SEN",yourWeapons:"SİLAHLARIN",soundOn:"🔊 Ses AÇIK",soundOff:"🔇 Ses KAPALI",changeWeapons:"🎲 Silahları değiştir",wins:"galibiyet",games:"oyun",bonus:"bonus",chooseWeapon:"2 silahtan birini seç.",playAgain:"🔄 Tekrar oyna",weaponAttack:"Saldırı",weaponBomb:"Bomba",weaponHeart:"Kalp",weaponHelicopter:"Helikopter",weaponAtom:"Atom",weaponProtect:"Koruma",weaponAzrael:"Azrail Meleği",weaponIce:"Buz",weaponDrone:"Dron",weaponFire:"Ateş çemberi",twoAttacks:"2 saldırı",shootAgain2:"−2 ❤️ · tekrar ateş et",protect2:"2 kez korur",koNoDefense:"koruma yoksa KO",nextAttack:"sonraki silah Saldırı olur",shootAgain1:"−1 ❤️ · tekrar ateş et",burnBlack:"−2 ❤️ · rakibi yakar",finish:"BİTTİ",warOnline:"Çevrimiçi Savaş",waitingPlayers:"Oyuncular bekleniyor…",wait10:"En az bir oyuncunun daha katılması için 10 saniye bekliyoruz.",noComputerNote:"Kimse katılmazsa bilgisayara karşı başlamaz — “Tekrar dene” düğmesi çıkar.",retry:"🔄 Tekrar dene",noPlayer:"Başka oyuncu bulunamadı.",noComputerSwitch:"Otomatik olarak bilgisayara geçmez.",waitTurnCaps:"SIRANI BEKLE",alive:"hayatta",players:"oyuncu",winner:"Kazanan",playOnlineAgain:"🌐 Yeniden çevrimiçi oyna",target:"Hedef",tapTarget:"Saldırmak istediğin oyuncuya dokun.",waitYourTurn:"Sıranın gelmesini bekle.",eliminated:"Elendi",turn:"Sıra",notEnough3:"3 💎 yok.",weaponsNotChanged:"Silahlar değiştirilmedi.",chooseTarget:"Önce vurmak istediğin oyuncuyu seç."},
  en:{yourTurnCaps:"YOUR TURN",opponent:"OPPONENT",you:"YOU",yourWeapons:"YOUR WEAPONS",soundOn:"🔊 Sound ON",soundOff:"🔇 Sound OFF",changeWeapons:"🎲 Change weapons",wins:"wins",games:"games",bonus:"bonus",chooseWeapon:"Choose one of your 2 weapons.",playAgain:"🔄 Play again",weaponAttack:"Attack",weaponBomb:"Bomb",weaponHeart:"Heart",weaponHelicopter:"Helicopter",weaponAtom:"Atom",weaponProtect:"Protection",weaponAzrael:"Angel Azrael",weaponIce:"Ice",weaponDrone:"Drone",weaponFire:"Fire ring",twoAttacks:"2 attacks",shootAgain2:"−2 ❤️ · shoot again",protect2:"blocks 2 times",koNoDefense:"KO without protection",nextAttack:"next weapon becomes Attack",shootAgain1:"−1 ❤️ · shoot again",burnBlack:"−2 ❤️ · burns opponent",finish:"END",warOnline:"War Online",waitingPlayers:"Waiting for players…",wait10:"Waiting up to 10 seconds for at least one more player.",noComputerNote:"If nobody joins, you will not play the computer — “Try again” appears.",retry:"🔄 Try again",noPlayer:"No other player found.",noComputerSwitch:"It will not switch automatically to the computer.",waitTurnCaps:"WAIT FOR YOUR TURN",alive:"alive",players:"players",winner:"Winner",playOnlineAgain:"🌐 Play online again",target:"Target",tapTarget:"Tap the player you want to attack.",waitYourTurn:"Wait until it is your turn.",eliminated:"Eliminated",turn:"Turn",notEnough3:"You do not have 3 💎.",weaponsNotChanged:"Weapons were not changed.",chooseTarget:"Choose the player you want to hit first."},
  it:{yourTurnCaps:"TOCCA A TE",opponent:"AVVERSARIO",you:"TU",yourWeapons:"LE TUE ARMI",soundOn:"🔊 Audio ON",soundOff:"🔇 Audio OFF",changeWeapons:"🎲 Cambia armi",wins:"vittorie",games:"partite",bonus:"bonus",chooseWeapon:"Scegli una delle 2 armi.",playAgain:"🔄 Gioca ancora",weaponAttack:"Attacco",weaponBomb:"Bomba",weaponHeart:"Cuore",weaponHelicopter:"Elicottero",weaponAtom:"Atomica",weaponProtect:"Protezione",weaponAzrael:"Angelo Azrael",weaponIce:"Ghiaccio",weaponDrone:"Drone",weaponFire:"Cerchio di fuoco",twoAttacks:"2 attacchi",shootAgain2:"−2 ❤️ · spara di nuovo",protect2:"protegge 2 volte",koNoDefense:"KO senza protezione",nextAttack:"la prossima arma diventa Attacco",shootAgain1:"−1 ❤️ · spara di nuovo",burnBlack:"−2 ❤️ · brucia il nemico",finish:"FINE",warOnline:"Guerra Online",waitingPlayers:"In attesa dei giocatori…",wait10:"Attendiamo fino a 10 secondi per almeno un altro giocatore.",noComputerNote:"Se non entra nessuno, non giochi contro il computer — appare “Riprova”.",retry:"🔄 Riprova",noPlayer:"Nessun altro giocatore trovato.",noComputerSwitch:"Non passa automaticamente al computer.",waitTurnCaps:"ASPETTA IL TUO TURNO",alive:"vivi",players:"giocatori",winner:"Vincitore",playOnlineAgain:"🌐 Gioca di nuovo online",target:"Bersaglio",tapTarget:"Tocca il giocatore che vuoi attaccare.",waitYourTurn:"Aspetta il tuo turno.",eliminated:"Eliminato",turn:"Turno",notEnough3:"Non hai 3 💎.",weaponsNotChanged:"Le armi non sono state cambiate.",chooseTarget:"Scegli prima il giocatore da colpire."},
  hr:{yourTurnCaps:"TVOJ POTEZ",opponent:"PROTIVNIK",you:"TI",yourWeapons:"TVOJE ORUŽJE",soundOn:"🔊 Zvuk UKLJ.",soundOff:"🔇 Zvuk ISKLJ.",changeWeapons:"🎲 Promijeni oružje",wins:"pobjeda",games:"igara",bonus:"bonus",chooseWeapon:"Odaberi jedno od 2 oružja.",playAgain:"🔄 Igraj ponovno",weaponAttack:"Napad",weaponBomb:"Bomba",weaponHeart:"Srce",weaponHelicopter:"Helikopter",weaponAtom:"Atom",weaponProtect:"Zaštita",weaponAzrael:"Anđeo Azrael",weaponIce:"Led",weaponDrone:"Dron",weaponFire:"Vatreni krug",twoAttacks:"2 napada",shootAgain2:"−2 ❤️ · pucaj ponovno",protect2:"štiti 2 puta",koNoDefense:"KO bez zaštite",nextAttack:"sljedeće oružje postaje Napad",shootAgain1:"−1 ❤️ · pucaj ponovno",burnBlack:"−2 ❤️ · spaljuje protivnika",finish:"KRAJ",warOnline:"Rat Online",waitingPlayers:"Čekanje igrača…",wait10:"Čekamo do 10 sekundi da se pridruži barem još jedan igrač.",noComputerNote:"Ako se nitko ne pridruži, ne igraš protiv računala — pojavit će se “Pokušaj ponovno”.",retry:"🔄 Pokušaj ponovno",noPlayer:"Nije pronađen drugi igrač.",noComputerSwitch:"Ne prebacuje se automatski na računalo.",waitTurnCaps:"ČEKAJ SVOJ POTEZ",alive:"živih",players:"igrača",winner:"Pobjednik",playOnlineAgain:"🌐 Ponovno igraj online",target:"Meta",tapTarget:"Dodirni igrača kojeg želiš napasti.",waitYourTurn:"Čekaj svoj potez.",eliminated:"Eliminiran",turn:"Potez",notEnough3:"Nemaš 3 💎.",weaponsNotChanged:"Oružje nije promijenjeno.",chooseTarget:"Prvo odaberi igrača kojeg želiš pogoditi."},
  fr:{yourTurnCaps:"À TON TOUR",opponent:"ADVERSAIRE",you:"TOI",yourWeapons:"TES ARMES",soundOn:"🔊 Son ON",soundOff:"🔇 Son OFF",changeWeapons:"🎲 Changer les armes",wins:"victoires",games:"parties",bonus:"bonus",chooseWeapon:"Choisis une de tes 2 armes.",playAgain:"🔄 Rejouer",weaponAttack:"Attaque",weaponBomb:"Bombe",weaponHeart:"Cœur",weaponHelicopter:"Hélicoptère",weaponAtom:"Atome",weaponProtect:"Protection",weaponAzrael:"Ange Azraël",weaponIce:"Glace",weaponDrone:"Drone",weaponFire:"Cercle de feu",twoAttacks:"2 attaques",shootAgain2:"−2 ❤️ · tire encore",protect2:"protège 2 fois",koNoDefense:"KO sans protection",nextAttack:"la prochaine arme devient Attaque",shootAgain1:"−1 ❤️ · tire encore",burnBlack:"−2 ❤️ · brûle l'adversaire",finish:"FIN",warOnline:"Guerre en ligne",waitingPlayers:"En attente des joueurs…",wait10:"Nous attendons jusqu'à 10 secondes qu'un autre joueur arrive.",noComputerNote:"Si personne ne rejoint, tu ne joues pas contre l'ordinateur — « Réessayer » apparaît.",retry:"🔄 Réessayer",noPlayer:"Aucun autre joueur trouvé.",noComputerSwitch:"Pas de passage automatique à l'ordinateur.",waitTurnCaps:"ATTENDS TON TOUR",alive:"en vie",players:"joueurs",winner:"Gagnant",playOnlineAgain:"🌐 Rejouer en ligne",target:"Cible",tapTarget:"Touche le joueur que tu veux attaquer.",waitYourTurn:"Attends ton tour.",eliminated:"Éliminé",turn:"Tour",notEnough3:"Tu n'as pas 3 💎.",weaponsNotChanged:"Les armes n'ont pas été changées.",chooseTarget:"Choisis d'abord le joueur à frapper."},
  ar:{yourTurnCaps:"دورك",opponent:"الخصم",you:"أنت",yourWeapons:"أسلحتك",soundOn:"🔊 الصوت يعمل",soundOff:"🔇 الصوت متوقف",changeWeapons:"🎲 تغيير الأسلحة",wins:"انتصارات",games:"ألعاب",bonus:"إضافي",chooseWeapon:"اختر أحد السلاحين.",playAgain:"🔄 العب مرة أخرى",weaponAttack:"هجوم",weaponBomb:"قنبلة",weaponHeart:"قلب",weaponHelicopter:"مروحية",weaponAtom:"ذري",weaponProtect:"حماية",weaponAzrael:"ملك الموت عزرائيل",weaponIce:"جليد",weaponDrone:"طائرة مسيّرة",weaponFire:"حلقة نار",twoAttacks:"هجومان",shootAgain2:"−2 ❤️ · أطلق مجددًا",protect2:"يحمي مرتين",koNoDefense:"إقصاء بلا حماية",nextAttack:"السلاح التالي يصبح هجومًا",shootAgain1:"−1 ❤️ · أطلق مجددًا",burnBlack:"−2 ❤️ · يحرق الخصم",finish:"النهاية",warOnline:"الحرب أونلاين",waitingPlayers:"بانتظار اللاعبين…",wait10:"ننتظر حتى 10 ثوانٍ لانضمام لاعب آخر.",noComputerNote:"إذا لم ينضم أحد فلن تلعب ضد الكمبيوتر — سيظهر زر «حاول مجددًا».",retry:"🔄 حاول مجددًا",noPlayer:"لم يتم العثور على لاعب آخر.",noComputerSwitch:"لن يتم التحويل تلقائيًا إلى الكمبيوتر.",waitTurnCaps:"انتظر دورك",alive:"أحياء",players:"لاعبين",winner:"الفائز",playOnlineAgain:"🌐 العب أونلاين مرة أخرى",target:"الهدف",tapTarget:"اضغط على اللاعب الذي تريد مهاجمته.",waitYourTurn:"انتظر حتى يحين دورك.",eliminated:"تم الإقصاء",turn:"الدور",notEnough3:"ليس لديك 3 💎.",weaponsNotChanged:"لم يتم تغيير الأسلحة.",chooseTarget:"اختر أولًا اللاعب الذي تريد ضربه."}
};
function wtr(k){ return WAR_TXT[lang()]?.[k] || WAR_TXT.sq[k] || k; }


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
let warVictoryShownKey="";

async function ensureGameAudio(){
  if(!masterSoundEnabled && !gameMusicEnabled) return null;
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
  if(!timerSoundEnabled || !masterSoundEnabled) return;
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
  if(!tetrisSoundEnabled || !masterSoundEnabled) return;
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
  if(masterSoundEnabled||gameMusicEnabled) ensureGameAudio().then(()=>{if(gameMusicEnabled&&!gameMusicTimer)startGameMusic();});
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
  const name=(localStorage.getItem("pajaziti-global-user-name") || "").trim().slice(0,24);
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
let warRenameEditing=false;
let warLeaderboardRows=[];
let warChampion=null;
let warMultiRoom=null;
let warMultiPlayers=[];
let warMultiChannel=null;
let warMultiPollTimer=null;
let warMultiSelectedTarget=null;
let warChatOpen=false;
let warChatMessages=[];
let warChatDraft="";
let warChatFocused=false;
let warChatTimer=null;
let warActiveTimer=null;
let warAdminProfiles=[];

async function loadWarProfileAndLeaderboard(){
  const info=document.getElementById("warNameInfo");
  const board=document.getElementById("warLeaderboard");
  const diamondEl=document.getElementById("warDiamonds");
  const renameBtn=document.getElementById("warRenameBtn");
  const input=document.getElementById("warPlayerName");
  try{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return;

    const {data:profile,error:profileError}=await supabase.rpc("war_get_profile",{p_device:deviceId});
    if(profileError) throw profileError;

    if(profile){
      warProfile=profile;
      localStorage.setItem(WAR_NAME_KEY,profile.display_name);
      if(input){
        input.value=profile.display_name;
        input.readOnly=!warRenameEditing;
        input.classList.toggle("war-name-locked",!warRenameEditing);
      }
      if(diamondEl) diamondEl.textContent=String(Number(profile.diamonds||0));
      if(renameBtn){
        const renameCount=Number(profile.rename_count||0);
        renameBtn.hidden=renameCount>=2;
        renameBtn.textContent=warRenameEditing ? "💾 Ruaj emrin · 25 💎" : "✏️ Ndrysho emrin · 25 💎";
      }
      if(info){
        const renameCount=Number(profile.rename_count||0);
        info.textContent=renameCount>=2
          ? "🔒 Ke përdorur 2 ndryshimet e emrit. Emri nuk mund të ndryshohet më."
          : (warRenameEditing
              ? "Shkruaje emrin e ri. Ruajtja kushton 25 💎."
              : "🔒 Emri ruhet për këtë pajisje. Mund ta ndryshosh edhe "+(2-renameCount)+" herë me 25 💎.");
      }
    }else{
      warProfile=null;
      warRenameEditing=false;
      if(input){
        input.readOnly=false;
        input.classList.remove("war-name-locked");
      }
      if(diamondEl) diamondEl.textContent="200";
      if(renameBtn) renameBtn.hidden=true;
      if(info) info.textContent="Zgjidhe emrin e parë. Emri i ri ruhet përgjithmonë; më pas ndryshimi kushton 25 💎.";
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
        <h3>🏆 Renditja javore</h3>
        <div class="war-week-note">Shpërblimet: 🥇 500 💎 · 🥈 100 💎 · 🥉 50 💎</div>
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
    if(board) board.innerHTML='<div class="muted">Renditja javore nuk u ngarkua.</div>';
  }
}

async function saveWarProfile(){
  const input=document.getElementById("warPlayerName");
  const name=(localStorage.getItem("pajaziti-global-user-name")||input?.value||"").trim().slice(0,20);
  if(name.length<2){
    throw new Error("Emri duhet të ketë së paku 2 shkronja.");
  }
  const previousName=warProfile?.display_name||"";
  const {data,error}=await supabase.rpc("war_set_profile",{p_device:deviceId,p_name:name});
  if(error){
    const raw=String(error.message||error);
    if(raw.includes("NOT_ENOUGH_DIAMONDS")) throw new Error("Nuk ke 25 💎 për ta ndryshuar emrin.");
    if(raw.includes("RENAME_LIMIT")) throw new Error("Emrin mund ta ndryshosh maksimum 2 herë.");
    throw error;
  }
  localStorage.setItem(WAR_NAME_KEY,name);
  const {data:fresh,error:freshError}=await supabase.rpc("war_get_profile",{p_device:deviceId});
  if(!freshError && fresh) warProfile=fresh;
  else warProfile={...(warProfile||{}),...(data?.[0]||{}),display_name:name};

  if(previousName && previousName!==name) warRenameEditing=false;
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


async function refreshWarMultiLobbyCount(){
  const el=document.getElementById("warMultiCount");
  if(!el) return;
  try{
    const {data,error}=await supabase.rpc("war_multi_lobby_count");
    if(error) throw error;
    el.textContent="👥 Në pritje: "+Math.min(8,Number(data||0))+" / 8";
  }catch(_){
    el.textContent="👥 Në pritje: — / 8";
  }
}

function clearWarMultiPolling(){
  if(warMultiPollTimer){ clearInterval(warMultiPollTimer); warMultiPollTimer=null; }
  if(warActiveTimer){ clearInterval(warActiveTimer); warActiveTimer=null; }
  if(warChatTimer){ clearInterval(warChatTimer); warChatTimer=null; }
}

async function loadWarMultiState(roomId){
  const [{data:roomData,error:roomError},{data:playersData,error:playersError}]=await Promise.all([
    supabase.from("war_multi_rooms").select("*").eq("id",roomId).single(),
    supabase.from("war_multi_players")
      .select("room_id,device_id,display_name,hp,max_hp,protect,frozen,burned,special,special2,eliminated,turn_order,last_seen_at,kicked,kicked_at")
      .eq("room_id",roomId)
      .order("turn_order",{ascending:true})
  ]);
  if(roomError) throw roomError;
  if(playersError) throw playersError;
  warMultiRoom=roomData;
  warMultiPlayers=playersData||[];
}

function warMultiMe(){
  return warMultiPlayers.find(p=>p.device_id===deviceId)||null;
}

function warMultiAliveOpponents(){
  return warMultiPlayers.filter(p=>p.device_id!==deviceId && !p.eliminated && !p.kicked && p.hp>0);
}

function warMultiFlag(player){
  if(player?.device_id===deviceId) return "🇦🇱";
  const flags=["🇫🇷","🇷🇺","🇨🇳","🇮🇳","🇵🇰","🇹🇷","🇬🇧","🇺🇸"];
  const order=Math.max(0,Number(player?.turn_order||0));
  return flags[order%flags.length];
}

function warMultiPowerIcon(player){
  try{return warSpecial(player?.special||"attack")?.icon||"⚔️";}catch(_){return "⚔️";}
}

function warMultiPlayerCard(player){
  const isMe=player.device_id===deviceId;
  const isTurn=warMultiRoom?.turn_device===player.device_id;
  const selected=warMultiSelectedTarget===player.device_id;
  const offline=player.last_seen_at && (Date.now()-new Date(player.last_seen_at).getTime()>12000);
  return `
    <div class="war-room-player-wrap ${isMe?"me":""}">
      <button class="war-multi-player ${isMe?"me":""} ${isTurn?"turn":""} ${selected?"selected":""} ${player.eliminated?"eliminated":""} ${player.burned?"burned":""} ${offline?"offline":""}"
        type="button"
        data-war-target="${escapeHtml(player.device_id)}"
        ${isMe||player.eliminated||player.kicked?"disabled":""}>
        <span class="war-multi-name">${escapeHtml(player.display_name)} ${isMe?"(Ti)":""}</span>
        <span class="war-multi-hearts">${warHearts(player.hp,player.max_hp)}</span>
        <span class="war-multi-status">
          ${player.kicked?"🚫 Larguar nga admini":""}
          ${player.eliminated&&!player.kicked?"☠️ "+wtr("eliminated"):""}
          ${offline&&!player.eliminated&&!player.kicked?" 🤖 AUTO":""}
          ${player.protect>0?" 🛡️×"+player.protect:""}
          ${player.frozen?" 🧊":""}
          ${player.burned?" 🔥":""}
          ${isTurn&&!player.eliminated&&!player.kicked?" 🎯 "+wtr("turn"):""}
        </span>
        <span class="war-multi-flag-badge" aria-hidden="true">${warMultiFlag(player)}</span>
        <span class="war-multi-soldier ${isMe?"mine":"enemy"}" aria-hidden="true">
          <img src="./war-soldier.svg" alt="">
          <i class="war-multi-muzzle"></i>
        </span>
        <span class="war-multi-power-badge" aria-hidden="true">${warMultiPowerIcon(player)}</span>
      </button>
      <div class="war-player-weapons ${isMe?"mine":""}" aria-label="Armët">
        ${isMe
          ? `<button class="war-weapon-icon" data-war-action="${escapeHtml(player.special||"attack")}" type="button">${warSpecial(player.special||"attack").icon}</button>
             <button class="war-weapon-icon" data-war-action="${escapeHtml(player.special2||"attack")}" type="button">${warSpecial(player.special2||"attack").icon}</button>`
          : `<span class="war-weapon-icon static">${warSpecial(player.special||"attack").icon}</span>
             <span class="war-weapon-icon static">${warSpecial(player.special2||"attack").icon}</span>`}
      </div>
      ${gamesAdmin&&!isMe&&!player.kicked?`<label class="war-admin-kick-pick"><input type="checkbox" data-war-kick-device="${escapeHtml(player.device_id)}"> Largo</label>`:""}
    </div>`;
}


function warChatIsEditing(){
  const input=document.getElementById("warChatInput");
  return !!(warChatFocused || (input && document.activeElement===input));
}

async function loadWarChat(){
  if(!warMultiRoom?.id) return;
  const {data,error}=await supabase.from("war_room_messages")
    .select("id,device_id,display_name,body,created_at")
    .eq("room_id",warMultiRoom.id)
    .order("created_at",{ascending:true})
    .limit(80);
  if(error) return;
  warChatMessages=data||[];
  const list=document.getElementById("warChatList");
  if(list){
    list.innerHTML=warChatMessages.map(m=>`<div class="war-chat-line ${m.device_id===deviceId?"mine":""}"><strong>${escapeHtml(m.display_name)}</strong><span>${escapeHtml(m.body)}</span></div>`).join("") || '<div class="muted">—</div>';
    list.scrollTop=list.scrollHeight;
  }
}

async function sendWarChat(){
  const input=document.getElementById("warChatInput");
  if(input) warChatDraft=input.value.slice(0,300);
  const body=(warChatDraft||"").trim().slice(0,300);
  if(!body||!warMultiRoom?.id) return;
  const {error}=await supabase.rpc("war_room_send_message",{p_room:warMultiRoom.id,p_device:deviceId,p_body:body});
  if(!error){
    warChatDraft="";
    warChatFocused=false;
    if(input) input.value="";
  }
  await loadWarChat();
}

function startWarChatPolling(){
  if(warChatTimer) clearInterval(warChatTimer);
  loadWarChat().catch(()=>{});
  warChatTimer=setInterval(()=>loadWarChat().catch(()=>{}),2500);
}

function startWarActivePolling(roomId){
  if(warActiveTimer) clearInterval(warActiveTimer);
  let lastSig="";
  warActiveTimer=setInterval(async()=>{
    if(!warMultiRoom?.id || warMultiRoom.id!==roomId) return;
    try{
      const {data,error}=await supabase.rpc("war_multi_poll",{p_room:roomId,p_device:deviceId});
      if(error) throw error;
      if(data?.status==="kicked"){
        clearWarMultiPolling();
        warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;
        renderLobby("🚫 Admini të largoi nga loja.");
        return;
      }
      await supabase.rpc("war_multi_autoplay",{p_room:roomId});
      await loadWarMultiState(roomId);
      const me=warMultiMe();
      if(me?.kicked){
        clearWarMultiPolling();
        warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;
        renderLobby("🚫 Admini të largoi nga loja.");
        return;
      }
      const sig=[warMultiRoom.status,warMultiRoom.turn_device,warMultiRoom.action_seq,...warMultiPlayers.map(p=>p.device_id+":"+p.hp+":"+p.eliminated+":"+p.kicked)].join("|");
      if(sig!==lastSig){
        lastSig=sig;
        if(!warChatIsEditing()) renderWarMultiGame();
      }
    }catch(error){
      console.warn("war active poll",error);
    }
  },3500);
}

async function loadWarAdminPanel(){
  const box=document.getElementById("warAdminProfiles");
  if(!gamesAdmin||!box) return;
  const {data,error}=await supabase.rpc("war_admin_list_profiles");
  if(error){box.innerHTML='<div class="muted">Nuk u ngarkuan lojtarët.</div>';return;}
  warAdminProfiles=data||[];
  box.innerHTML=warAdminProfiles.map(p=>`
    <div class="war-admin-profile-row">
      <div><strong>${escapeHtml(p.display_name)}</strong><small>💎 ${p.diamonds} · emri ${p.rename_count}/2</small></div>
      <input type="number" min="1" max="1000000" value="50" data-war-gift-amount="${escapeHtml(p.device_id)}">
      <button class="secondary" type="button" data-war-gift="${escapeHtml(p.device_id)}">🎁 Jep 💎</button>
    </div>`).join("") || '<div class="muted">Nuk ka lojtarë.</div>';
  box.querySelectorAll("[data-war-gift]").forEach(btn=>{
    btn.onclick=async()=>{
      const dev=btn.dataset.warGift;
      const input=box.querySelector('[data-war-gift-amount="'+CSS.escape(dev)+'"]');
      const amount=Math.max(1,Math.min(1000000,Number(input?.value||0)));
      btn.disabled=true;
      const {error}=await supabase.rpc("war_admin_gift_diamonds",{p_device:dev,p_amount:amount});
      btn.disabled=false;
      if(error){alert("Nuk u dërguan diamantet.");return;}
      await loadWarAdminPanel();
    };
  });
}

async function adminKickSelected(){
  if(!gamesAdmin||!warMultiRoom?.id) return;
  const devices=[...document.querySelectorAll("[data-war-kick-device]:checked")].map(x=>x.dataset.warKickDevice);
  if(!devices.length) return;
  const {error}=await supabase.rpc("war_admin_kick_players",{p_room:warMultiRoom.id,p_devices:devices});
  if(error){alert("Nuk u larguan lojtarët.");return;}
  await loadWarMultiState(warMultiRoom.id);
  renderWarMultiGame();
}

function renderWarMultiWaiting(){
  if(!warMultiRoom) return;
  const starts=new Date(warMultiRoom.starts_at).getTime();
  const sec=Math.max(0,Math.ceil((starts-Date.now())/1000));

  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-multi-waiting">
        <div class="war-topbar">
          <button id="warMultiBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>🌐 ${wtr("warOnline")}</strong>
        </div>
        <div class="war-multi-wait-card">
          <div class="war-multi-count-big">${warMultiPlayers.length} / 8</div>
          <h2>👥 ${wtr("waitingPlayers")}</h2>
          <div class="war-multi-countdown">${sec}</div>
          <p>${wtr("wait10")}</p>
          <div class="war-multi-wait-list">
            ${warMultiPlayers.map((p,i)=>`<div><strong>${i+1}. ${escapeHtml(p.display_name)}</strong></div>`).join("")}
          </div>
          <p class="muted">${wtr("noComputerNote")}</p>
        </div>
      </section>
    </div>`;

  document.getElementById("warMultiBack").onclick=()=>{
    clearWarMultiPolling();
    if(warMultiChannel){
      supabase.removeChannel(warMultiChannel);
      warMultiChannel=null;
    }
    warMultiRoom=null;
    warMultiPlayers=[];
    renderLobby();
  };
}

function renderWarMultiRetry(){
  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-multi-waiting">
        <div class="war-topbar">
          <button id="warRetryBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>🌐 ${wtr("warOnline")}</strong>
        </div>
        <div class="war-multi-wait-card war-retry-card">
          <div class="war-retry-icon">⏱️</div>
          <h2>${wtr("noPlayer")}</h2>
          <p>${wtr("noComputerSwitch")}</p>
          <button id="warRetryOnline" class="primary" type="button">${wtr("retry")}</button><button id="warPracticeFallback" class="secondary" type="button">${gx("practice")}</button><small>${gx("practiceNote")}</small>
        </div>
      </section>
    </div>`;
  document.getElementById("warRetryBack").onclick=()=>renderLobby();
  document.getElementById("warRetryOnline").onclick=()=>startWarMultiSearch();
  document.getElementById("warPracticeFallback")?.addEventListener("click",()=>startPracticeForGame("war"));
}

function renderWarMultiGame(){
  if(!warMultiRoom) return;
  const previousChatInput=document.getElementById("warChatInput");
  if(previousChatInput) warChatDraft=previousChatInput.value.slice(0,300);
  const restoreChatFocus=warChatOpen && warChatIsEditing();
  const me=warMultiMe();
  if(me?.kicked){
    clearWarMultiPolling();
    warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;
    renderLobby("🚫 Admini të largoi nga loja.");
    return;
  }
  const alive=warMultiPlayers.filter(p=>!p.eliminated&&!p.kicked&&p.hp>0);
  const myTurn=warMultiRoom.status==="active" && warMultiRoom.turn_device===deviceId && me && !me.eliminated && !me.kicked;
  const opponents=warMultiAliveOpponents();

  if(warMultiSelectedTarget && !opponents.some(p=>p.device_id===warMultiSelectedTarget)) warMultiSelectedTarget=null;
  if(!warMultiSelectedTarget && opponents.length===1) warMultiSelectedTarget=opponents[0].device_id;

  const special=me?.special||"attack";
  const special2=me?.special2||"attack";
  const enemyPlayers=warMultiPlayers.filter(p=>p.device_id!==deviceId);
  const myPlayer=warMultiPlayers.find(p=>p.device_id===deviceId)||null;

  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-multi-arena">
        <div class="war-topbar">
          <button id="warMultiBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>🌐 ${wtr("warOnline")}</strong>
          <span class="war-turn">${warMultiRoom.status==="finished"?wtr("finish"):(myTurn?wtr("yourTurnCaps"):wtr("waitTurnCaps"))}</span>
        </div>

        <div class="war-shared-room war-online-shared-room">
          <div class="war-room-wall"><span>LUFTRA · BATTLE ROYALE</span></div>
          <div class="war-room-floor"></div>
          <div class="war-online-stage">
            <div class="war-online-opponents">${enemyPlayers.map(warMultiPlayerCard).join("")}</div>
            <div class="war-online-core" aria-hidden="true">
              <span class="war-online-crown">👑</span>
              <strong>LUFTRA</strong>
              <span>BATTLE ROYALE</span>
              <small>👥 ${alive.length}/${warMultiPlayers.length}</small>
            </div>
            <div class="war-online-me">${myPlayer?warMultiPlayerCard(myPlayer):""}</div>
          </div>
        </div>

        <div class="war-battle-footer">
          <div class="war-battle-meta"><strong>👥 ${alive.length}/${warMultiPlayers.length}</strong><span>💎 ${Number(warProfile?.diamonds||0)}</span></div>
          <p class="war-message">${escapeHtml(warMultiRoom.message||"")}</p>
        </div>

        <div class="war-room-tools">
          <button id="warChatToggle" class="secondary" type="button">💬 Chat ${warChatOpen?"▲":"▼"}</button>
          ${gamesAdmin?'<button id="warAdminKickBtn" class="danger" type="button">🚫 Largo të zgjedhurit</button>':""}
        </div>

        <section id="warChatPanel" class="war-chat-panel ${warChatOpen?"":"hidden"}">
          <div id="warChatList" class="war-chat-list">${warChatMessages.map(m=>`<div class="war-chat-line ${m.device_id===deviceId?"mine":""}"><strong>${escapeHtml(m.display_name)}</strong><span>${escapeHtml(m.body)}</span></div>`).join("")}</div>
          <div class="war-chat-compose">
            <input id="warChatInput" type="text" maxlength="300" autocomplete="off" enterkeyhint="send" placeholder="Shkruaj mesazh…" value="${escapeHtml(warChatDraft)}">
            <button id="warChatSend" class="primary" type="button">Dërgo</button>
          </div>
        </section>

        ${warMultiRoom.status==="finished"?`
          <div class="war-multi-winner">🏆 ${wtr("winner")}: <strong>${escapeHtml(warMultiPlayers.find(p=>p.device_id===warMultiRoom.winner_device)?.display_name||"—")}</strong></div>
          <button id="warMultiAgain" class="primary" type="button">${wtr("playOnlineAgain")}</button>
        `:`
          <div class="war-multi-target-hint">${myTurn?(warMultiSelectedTarget?"🎯 "+wtr("target")+": "+escapeHtml(warMultiPlayers.find(p=>p.device_id===warMultiSelectedTarget)?.display_name||""):"🎯 "+wtr("tapTarget")):"⏳ "+wtr("waitYourTurn")}</div>
          <button id="warMultiReroll" class="secondary war-reroll war-reroll-compact" type="button" ${myTurn?"":"disabled"}>🎲 · 3 💎</button>
        `}
      </section>
    </div>`;

  if(warMultiRoom.status==="finished" && warMultiRoom.winner_device===deviceId){
    const winner=warMultiPlayers.find(p=>p.device_id===deviceId);
    requestAnimationFrame(()=>showWarVictoryCelebration("online-"+warMultiRoom.id+"-"+(warMultiRoom.action_seq||0),winner?.display_name||wtr("winner")));
  }

  root.querySelectorAll("[data-war-target]").forEach(btn=>{
    btn.onclick=()=>{if(!myTurn)return;warMultiSelectedTarget=btn.dataset.warTarget;renderWarMultiGame();};
  });
  root.querySelectorAll("[data-war-action]").forEach(btn=>{
    btn.disabled=!myTurn;btn.onclick=()=>warMultiDoAction(btn.dataset.warAction);
  });

  document.getElementById("warChatToggle")?.addEventListener("click",()=>{
    const current=document.getElementById("warChatInput");
    if(current) warChatDraft=current.value.slice(0,300);
    warChatOpen=!warChatOpen;
    if(!warChatOpen) warChatFocused=false;
    renderWarMultiGame();
    if(warChatOpen) loadWarChat();
  });
  document.getElementById("warChatSend")?.addEventListener("click",sendWarChat);
  const warChatInput=document.getElementById("warChatInput");
  if(warChatInput){
    warChatInput.addEventListener("input",()=>{warChatDraft=warChatInput.value.slice(0,300);});
    warChatInput.addEventListener("focus",()=>{warChatFocused=true;});
    warChatInput.addEventListener("compositionstart",()=>{warChatFocused=true;});
    warChatInput.addEventListener("compositionend",()=>{warChatDraft=warChatInput.value.slice(0,300);});
    warChatInput.addEventListener("blur",()=>{
      setTimeout(()=>{
        if(document.activeElement?.id!=="warChatInput") warChatFocused=false;
      },180);
    });
    warChatInput.addEventListener("keydown",e=>{
      if(e.key==="Enter" && !e.isComposing){
        e.preventDefault();
        sendWarChat();
      }
    });
    if(restoreChatFocus){
      requestAnimationFrame(()=>{
        const input=document.getElementById("warChatInput");
        if(!input) return;
        try{ input.focus({preventScroll:true}); }catch(_){ input.focus(); }
        const end=input.value.length;
        try{ input.setSelectionRange(end,end); }catch(_){}
      });
    }
  }
  document.getElementById("warAdminKickBtn")?.addEventListener("click",adminKickSelected);

  document.getElementById("warMultiReroll")?.addEventListener("click",async()=>{
    if(!myTurn)return;
    const btn=document.getElementById("warMultiReroll");if(btn)btn.disabled=true;
    try{
      const {data,error}=await supabase.rpc("war_multi_reroll",{p_room:warMultiRoom.id,p_device:deviceId});
      if(error)throw error;
      warProfile={...(warProfile||{}),diamonds:Number(data?.diamonds||0)};
      await loadWarMultiState(warMultiRoom.id);renderWarMultiGame();
    }catch(error){
      const raw=String(error?.message||error);
      const hint=root.querySelector(".war-multi-target-hint");
      if(hint)hint.textContent=raw.includes("NOT_ENOUGH_DIAMONDS")?"⚠️ "+wtr("notEnough3"):"⚠️ "+wtr("weaponsNotChanged");
      if(btn)btn.disabled=false;
    }
  });

  document.getElementById("warMultiBack").onclick=()=>{
    clearWarMultiPolling();
    if(warMultiChannel){supabase.removeChannel(warMultiChannel);warMultiChannel=null;}
    warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;warChatOpen=false;warChatMessages=[];warChatDraft="";warChatFocused=false;
    renderLobby();
  };
  document.getElementById("warMultiAgain")?.addEventListener("click",()=>{
    clearWarMultiPolling();
    if(warMultiChannel){supabase.removeChannel(warMultiChannel);warMultiChannel=null;}
    warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;warChatOpen=false;warChatMessages=[];warChatDraft="";warChatFocused=false;
    startWarMultiSearch();
  });
}

async function warMultiDoAction(action){
  if(!warMultiRoom || warMultiRoom.status!=="active") return;
  const me=warMultiMe();
  if(!me || me.eliminated || warMultiRoom.turn_device!==deviceId) return;

  let target=warMultiSelectedTarget;
  const opponents=warMultiAliveOpponents();

  if(!target){
    if(opponents.length===1) target=opponents[0].device_id;
    else {
      const hint=root.querySelector(".war-multi-target-hint");
      if(hint) hint.textContent="⚠️ "+wtr("chooseTarget");
      return;
    }
  }

  root.querySelectorAll("[data-war-action]").forEach(b=>b.disabled=true);
  playWarSound(warSoundForAction(action));

  try{
    const {error}=await supabase.rpc("war_multi_action",{
      p_room:warMultiRoom.id,
      p_device:deviceId,
      p_target:target,
      p_action:action
    });
    if(error) throw error;
    warMultiSelectedTarget=null;
    await loadWarMultiState(warMultiRoom.id);
    renderWarMultiGame();
  }catch(error){
    console.warn("war multi action",error);
    await loadWarMultiState(warMultiRoom.id).catch(()=>{});
    renderWarMultiGame();
  }
}

async function subscribeWarMultiRoom(roomId){
  if(warMultiChannel){
    supabase.removeChannel(warMultiChannel);
    warMultiChannel=null;
  }

  warMultiChannel=supabase.channel("war-multi-"+roomId)
    .on("postgres_changes",{
      event:"UPDATE",schema:"public",table:"war_multi_rooms",filter:"id=eq."+roomId
    },async()=>{
      await loadWarMultiState(roomId).catch(()=>{});
      if(warMultiRoom?.status==="waiting") renderWarMultiWaiting();
      else if(!warChatIsEditing()) renderWarMultiGame();
    })
    .on("postgres_changes",{
      event:"*",schema:"public",table:"war_multi_players",filter:"room_id=eq."+roomId
    },async()=>{
      await loadWarMultiState(roomId).catch(()=>{});
      if(warMultiRoom?.status==="waiting") renderWarMultiWaiting();
      else if(!warChatIsEditing()) renderWarMultiGame();
    })
    .subscribe();
}

async function ensureWarOnlineReady(){
  let session=null;
  try{
    const current=await supabase.auth.getSession();
    session=current?.data?.session||null;
  }catch(_){}

  if(!session && !GAMES_ADMIN_ONLY){
    const response=await fetch(SUPABASE_URL+"/functions/v1/family-login",{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY},
      body:"{}",
      cache:"no-store"
    });
    const tokenData=await response.json().catch(()=>({}));
    if(!response.ok || !tokenData?.token_hash) throw new Error("AUTH_REQUIRED");
    const verified=await supabase.auth.verifyOtp({token_hash:tokenData.token_hash,type:"email"});
    if(verified.error) throw verified.error;
    session=verified.data?.session||null;
    if(!session){
      const refreshed=await supabase.auth.getSession();
      session=refreshed?.data?.session||null;
    }
  }

  if(!session) throw new Error("AUTH_REQUIRED");

  let profile=null;
  const got=await supabase.rpc("user_profile_get",{p_device:deviceId});
  if(got.error) throw got.error;
  profile=got.data||null;

  if(!profile){
    let name=(localStorage.getItem(BOARD_NAME_KEY)||warProfile?.display_name||"").trim().slice(0,20);
    if(name.length<4){
      const suffix=String(deviceId||"").replace(/[^a-z0-9]/gi,"").slice(-6);
      name=("Player"+(suffix||"000001")).slice(0,20);
    }

    let claimed=await supabase.rpc("user_profile_claim",{p_device:deviceId,p_name:name});
    if(claimed.error && String(claimed.error?.message||claimed.error).includes("NAME_TAKEN")){
      const suffix=String(deviceId||"").replace(/[^a-z0-9]/gi,"").slice(-5);
      const fallback=(name.slice(0,Math.max(4,14-suffix.length))+"-"+suffix).slice(0,20);
      claimed=await supabase.rpc("user_profile_claim",{p_device:deviceId,p_name:fallback});
    }
    if(claimed.error) throw claimed.error;
    profile=claimed.data||null;
  }

  if(profile?.is_blocked) throw new Error("USER_BLOCKED");
  if(profile?.display_name) localStorage.setItem(BOARD_NAME_KEY,profile.display_name);

  const warSetup=await supabase.rpc("war_set_profile",{p_device:deviceId,p_name:profile?.display_name||localStorage.getItem(BOARD_NAME_KEY)||"Player"});
  if(warSetup.error) throw warSetup.error;

  return profile;
}

async function startWarMultiSearch(){
  const button=document.getElementById("warMultiBtn")||document.getElementById("warRetryOnline")||document.getElementById("warMultiAgain");
  const info=document.getElementById("warNameInfo");
  if(button) button.disabled=true;

  try{
    const profile=await ensureWarOnlineReady();
    const name=(profile?.display_name||localStorage.getItem(BOARD_NAME_KEY)||"Player").trim().slice(0,20);
    const {data,error}=await supabase.rpc("war_multi_join_global",{p_device:deviceId});
    if(error) throw error;

    const {data:econ,error:econError}=await supabase.rpc("war_get_profile",{p_device:deviceId});
    if(!econError && econ) warProfile=econ;
    else warProfile={...(warProfile||{}),display_name:name,diamonds:Number(warProfile?.diamonds||200)};

    const roomId=data?.room_id;
    if(!roomId) throw new Error("ROOM_NOT_CREATED");

    await loadWarMultiState(roomId);
    await subscribeWarMultiRoom(roomId);

    clearWarMultiPolling();

    const poll=async()=>{
      if(!warMultiRoom?.id) return;
      try{
        const {data:pollData,error:pollError}=await supabase.rpc("war_multi_poll",{
          p_room:warMultiRoom.id,
          p_device:deviceId
        });
        if(pollError) throw pollError;

        if(pollData?.status==="fallback"){
          clearWarMultiPolling();
          if(warMultiChannel){
            supabase.removeChannel(warMultiChannel);
            warMultiChannel=null;
          }
          warMultiRoom=null;
          warMultiPlayers=[];
          warMultiSelectedTarget=null;
          practiceFallbackGame="war";renderWarMultiRetry();
          return;
        }

        await loadWarMultiState(roomId);
        if(warMultiRoom.status==="waiting") renderWarMultiWaiting();
        else{
          if(warMultiPollTimer){ clearInterval(warMultiPollTimer); warMultiPollTimer=null; }
          renderWarMultiGame();
          startWarActivePolling(roomId);
          startWarChatPolling();
        }
      }catch(error){
        console.warn("war multi poll",error);
      }
    };

    await poll();
    if(warMultiRoom?.status==="waiting"){
      warMultiPollTimer=setInterval(poll,1000);
    }
  }catch(error){
    console.warn("war multi join",error);
    const raw=String(error?.message||error||"");
    const message=raw.includes("USER_BLOCKED")
      ?"Llogaria është e bllokuar nga Admini."
      : raw.includes("AUTH_REQUIRED")
        ?"Lidhja e përdoruesit u rifreskua. Provo edhe një herë."
        :"Nuk u hap loja online. Provo përsëri.";
    if(info) info.textContent=message;
    else renderWarMultiRetry();
    if(button) button.disabled=false;
  }
}

let warGameState=null;

const WAR_SPECIALS=[
  {key:"attack",labelKey:"weaponAttack",icon:"🔫",weight:80,small:"−1 ❤️"},
  {key:"bomb",labelKey:"weaponBomb",icon:"💣",weight:28,smallKey:"twoAttacks"},
  {key:"heart",labelKey:"weaponHeart",icon:"❤️",weight:16,small:"+1 ❤️ · max 20"},
  {key:"helicopter",labelKey:"weaponHelicopter",icon:"🚁",weight:3,smallKey:"shootAgain2"},
  {key:"atom",labelKey:"weaponAtom",icon:"☢️",weight:5,small:"−3 ❤️"},
  {key:"protect",labelKey:"weaponProtect",icon:"🛡️",weight:30,smallKey:"protect2"},
  {key:"azrael",labelKey:"weaponAzrael",icon:"👼",weight:2,smallKey:"koNoDefense"},
  {key:"ice",labelKey:"weaponIce",icon:"🧊",weight:15,smallKey:"nextAttack"},
  {key:"drone",labelKey:"weaponDrone",icon:"🛸",weight:12,smallKey:"shootAgain1"},
  {key:"fire",labelKey:"weaponFire",icon:"⭕",weight:13,smallKey:"burnBlack"}
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
  return "attack";
}

function warRollPair(){
  const first=warRollSpecial();
  let second=warRollSpecial();
  let guard=0;
  while(second===first && guard<8){
    second=warRollSpecial();
    guard++;
  }
  return [first,second];
}

function warSpecial(key){
  return WAR_SPECIALS.find(item=>item.key===key)||WAR_SPECIALS[0];
}

function warInitialState(){
  const bonus=warBonusHeartCount();
  const maxHp=Math.min(20,5+bonus);
  const aiLevel=getGameAiLevel("war");
  const enemyHp=aiLevel==="weak"?4:aiLevel==="strong"?6:aiLevel==="pro"?7:5;
  const playerName=warProfile?.display_name||localStorage.getItem(WAR_NAME_KEY)||tr("you");
  const playerWeapons=warRollPair();
  const enemyWeapons=warRollPair();
  return {
    player:{name:playerName,hp:maxHp,maxHp,protect:0,frozen:false,burned:false,special:playerWeapons[0],special2:playerWeapons[1]},
    enemy:{name:tr("computerName"),hp:enemyHp,maxHp:enemyHp,protect:0,frozen:false,burned:false,special:enemyWeapons[0],special2:enemyWeapons[1]},
    turn:"player",
    over:false,
    gameCounted:false,
    serverRewardRecorded:false,
    rerollUsedThisTurn:false,
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
  const item=warSpecial(action);
  return `<button data-war-action="${item.key}" type="button"><span class="war-action-icon" aria-hidden="true">${item.icon}</span><strong>${wtr(item.labelKey)}</strong><small>${item.smallKey?wtr(item.smallKey):item.small}</small></button>`;
}

function warPracticePlayerCard(fighter,{isPlayer=false,isTurn=false}={}){
  const label=isPlayer?fighter.name:wtr("opponent");
  const status=[
    fighter.protect>0?"🛡️×"+fighter.protect:"",
    fighter.frozen?"🧊":"",
    fighter.burned?"🔥":"",
    isTurn?"🎯 "+wtr("turn"):""
  ].filter(Boolean).join(" ");
  const power=warSpecial(fighter.special||"attack")?.icon||"⚔️";
  return `
    <div class="war-room-player-wrap ${isPlayer?"me":""}">
      <div class="war-multi-player war-practice-player ${isPlayer?"me":""} ${isTurn?"turn":""} ${fighter.hp<=0?"eliminated":""} ${fighter.burned?"burned":""}">
        <span class="war-multi-name">${isPlayer?"🇦🇱 ":"🤖 "}${escapeHtml(label)} ${isPlayer?"("+wtr("you")+")":""}</span>
        <span class="war-multi-hearts">${warHearts(fighter.hp,fighter.maxHp)}</span>
        <span class="war-multi-status">${status}</span>
        <span class="war-multi-flag-badge" aria-hidden="true">${isPlayer?"🇦🇱":"🤖"}</span>
        <span class="war-multi-soldier ${isPlayer?"mine":"enemy"} war-shooter ${isPlayer?"war-shooter-player":"war-shooter-enemy"}" aria-hidden="true">
          <img src="./war-soldier.svg" alt="">
          <i class="war-multi-muzzle"></i>
        </span>
        <span class="war-multi-power-badge" aria-hidden="true">${power}</span>
      </div>
      <div class="war-player-weapons ${isPlayer?"mine":""}" aria-label="Armët">
        ${isPlayer
          ? `<button class="war-weapon-icon" data-war-action="${escapeHtml(fighter.special||"attack")}" type="button">${warSpecial(fighter.special||"attack").icon}</button>
             <button class="war-weapon-icon" data-war-action="${escapeHtml(fighter.special2||"attack")}" type="button">${warSpecial(fighter.special2||"attack").icon}</button>`
          : `<span class="war-weapon-icon static">${warSpecial(fighter.special||"attack").icon}</span>
             <span class="war-weapon-icon static">${warSpecial(fighter.special2||"attack").icon}</span>`}
      </div>
    </div>`;
}

function renderWarGame(){
  if(!warGameState) warGameState=warInitialState();
  const s=warGameState;
  const p=s.player;
  const e=s.enemy;
  const games=warGames();
  const wins=warWins();
  const activeBonus=warBonusHeartCount();
  const alive=(p.hp>0?1:0)+(e.hp>0?1:0);

  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-multi-arena war-practice-arena">
        <div class="war-topbar">
          <button id="warBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>⚔️ ${tr("war")}</strong>
          <span class="war-turn">${s.over?wtr("finish"):(s.turn==="player"?wtr("yourTurnCaps"):wtr("opponent"))}</span>
          <button id="warSoundToggle" class="war-sound-toggle" type="button">${warSoundEnabled?wtr("soundOn"):wtr("soundOff")}</button>
          <span id="warAudioStatus" class="war-audio-status"></span>
        </div>

        <div id="warBattleScene" class="war-shared-room war-online-shared-room war-practice-shared-room">
          <div class="war-room-wall"><span>LUFTRA · BATTLE ROYALE</span></div>
          <div class="war-room-floor"></div>
          <div class="war-online-stage war-practice-stage">
            <div class="war-online-opponents">
              ${warPracticePlayerCard(e,{isPlayer:false,isTurn:s.turn==="enemy"})}
            </div>
            <div class="war-online-core" aria-hidden="true">
              <span class="war-online-crown">👑</span>
              <strong>LUFTRA</strong>
              <span>BATTLE ROYALE</span>
              <small>👥 ${alive}/2</small>
            </div>
            <div class="war-online-me">
              ${warPracticePlayerCard(p,{isPlayer:true,isTurn:s.turn==="player"})}
            </div>
          </div>
          <div class="war-shot-lane" aria-hidden="true">
            <span id="warProjectile" class="war-projectile">•</span>
            <span id="warExplosion" class="war-explosion">💥</span>
          </div>
        </div>

        <div class="war-battle-info war-practice-info war-battle-footer">
          <div class="war-battle-meta">
            <strong>❤️ ${activeBonus}</strong>
            <span>🏆 ${wins} · 🎮 ${games}</span>
            <span>💎 ${Number(warProfile?.diamonds||0)}</span>
          </div>
          <p id="warMessage" class="war-message">${escapeHtml(s.message)}</p>
          <small class="war-practice-note">🤖 ${gx("practiceNote")}</small>
        </div>

        ${s.over?`<button id="warRestart" class="primary war-restart" type="button">${wtr("playAgain")}</button>`:`
          <div class="war-practice-controls">
            <button id="warReroll" class="secondary war-reroll war-reroll-compact" type="button" ${s.turn!=="player"||s.rerollUsedThisTurn?"disabled":""}>🎲 · 3 💎</button>
          </div>
        `}
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

  document.getElementById("warReroll")?.addEventListener("click",async()=>{
    if(s.over||s.turn!=="player"||s.rerollUsedThisTurn) return;
    const btn=document.getElementById("warReroll");
    if(btn) btn.disabled=true;
    try{
      const {data,error}=await supabase.rpc("war_spend_reroll",{p_device:deviceId});
      if(error) throw error;
      warProfile={...(warProfile||{}),diamonds:Number(data?.diamonds||0)};
      s.rerollUsedThisTurn=true;
      [p.special,p.special2]=warRollPair();
      s.message="🎲 Armët u ndryshuan për 3 💎.";
      renderWarGame();
    }catch(error){
      s.message=String(error?.message||error).includes("NOT_ENOUGH_DIAMONDS")
        ?"⚠️ Nuk ke 3 💎 për t'i ndryshuar armët."
        :"⚠️ Armët nuk u ndryshuan.";
      renderWarGame();
    }
  });

  root.querySelectorAll("[data-war-action]").forEach(btn=>{
    btn.disabled=s.over||s.turn!=="player";
    btn.onclick=()=>warPlayerAction(btn.dataset.warAction);
  });

  if(s.over && s.enemy.hp<=0 && s.player.hp>0){
    requestAnimationFrame(()=>showWarVictoryCelebration(
      "solo-"+warGames()+"-"+s.player.name,
      s.player.name
    ));
  }
}

async function startWarGame(){
  const button=document.getElementById("warGame");
  if(button)button.disabled=true;
  const difficulty=document.getElementById("boardAiLevel")?.value||getGameAiLevel("war");
  setGameAiLevel("war",difficulty);
  const name=(localStorage.getItem("pajaziti-global-user-name")||tr("you")).trim().slice(0,20);
  warProfile={...(warProfile||{}),display_name:name,diamonds:Number(warProfile?.diamonds||200)};
  warGameState=warInitialState();
  warGameState.practice=true;
  warGameState.message=gx("practiceNote");
  renderWarGame();
  if(button)button.disabled=false;
}

function warFinishIfNeeded(){
  const s=warGameState;
  if(!s) return false;

  if(s.enemy.hp<=0){
    s.over=true;s.turn="none";
    s.message=(lang()==="de"?"🏆 Training gewonnen.":lang()==="tr"?"🏆 Antrenmanı kazandın.":lang()==="en"?"🏆 Practice won.":lang()==="it"?"🏆 Allenamento vinto.":lang()==="hr"?"🏆 Vježba osvojena.":lang()==="fr"?"🏆 Entraînement gagné.":lang()==="ar"?"🏆 فزت في التدريب.":"🏆 Fitove stërvitjen.")+" "+gx("practiceNote");
    return true;
  }
  if(s.player.hp<=0){
    s.over=true;s.turn="none";
    s.message=(lang()==="de"?"💥 Computer hat gewonnen.":lang()==="tr"?"💥 Bilgisayar kazandı.":lang()==="en"?"💥 Computer won.":lang()==="it"?"💥 Il computer ha vinto.":lang()==="hr"?"💥 Računalo je pobijedilo.":lang()==="fr"?"💥 L'ordinateur a gagné.":lang()==="ar"?"💥 فاز الكمبيوتر.":"💥 Kompjuteri fitoi.")+" "+gx("practiceNote");
    return true;
  }

  return false;
}

async function recordWarComputerReward(state){
  if(!state||state.serverRewardRecorded) return;
  state.serverRewardRecorded=true;
  try{
    const {data,error}=await supabase.rpc("war_record_computer_game",{p_device:deviceId});
    if(error) throw error;
    warProfile={...(warProfile||{}),diamonds:Number(data?.diamonds||0),computer_games:Number(data?.computer_games||0)};
    if(Number(data?.reward||0)>0){
      state.message+=" 💎 Çdo 5 lojë: fitove +20 diamanta!";
    }
    if(warGameState===state) renderWarGame();
  }catch(error){
    console.warn("war computer reward",error);
  }
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
  const duration=kind==="victory" ? 1.45 : kind==="rocket" ? .85 : kind==="tank" ? .62 : kind==="attack" ? .18 : .24;
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
    }else if(kind==="victory"){
      const now=ctx.currentTime;
      [523.25,659.25,783.99,1046.5,1318.5].forEach((freq,i)=>{
        const osc=ctx.createOscillator();
        const amp=ctx.createGain();
        osc.type=i<3?"triangle":"sine";
        osc.frequency.value=freq;
        const t=now+i*.18;
        amp.gain.setValueAtTime(.0001,t);
        amp.gain.exponentialRampToValueAtTime(.20,t+.015);
        amp.gain.exponentialRampToValueAtTime(.0001,t+.24);
        osc.connect(amp); amp.connect(ctx.destination);
        osc.start(t); osc.stop(t+.27);
      });
    }
  });
}

function playWarSound(kind){
  if(!warSoundEnabled || !masterSoundEnabled) return;
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
  if(kind==="victory" && navigator.vibrate) navigator.vibrate([80,45,80,45,160]);
}

function showWarVictoryCelebration(key,winnerName="Fituesi"){
  if(!key || warVictoryShownKey===key) return;
  warVictoryShownKey=key;
  playWarSound("victory");
  document.querySelector(".war-victory-celebration")?.remove();
  const box=document.createElement("div");
  box.className="war-victory-celebration";
  const stars=Array.from({length:28},(_,idx)=>{
    const left=7+(idx*37)%86;
    const delay=((idx*11)%28)/100;
    const drift=((idx*29)%120)-60;
    const symbol=["⭐","✨","🌟","💫"][idx%4];
    return '<span style="--x:'+left+'%;--d:'+delay+'s;--drift:'+drift+'px">'+symbol+"</span>";
  }).join("");
  box.innerHTML='<div class="war-victory-title">🏆 FITORE! 🏆</div>'+
    '<div class="war-victory-name">'+escapeHtml(winnerName)+"</div>"+
    '<div class="war-victory-stars" aria-hidden="true">'+stars+"</div>";
  document.body.appendChild(box);
  setTimeout(()=>box.classList.add("show"),20);
  setTimeout(()=>{
    box.classList.remove("show");
    setTimeout(()=>box.remove(),500);
  },2800);
}
function warSoundForAction(action){
  if(action==="bomb"||action==="atom"||action==="azrael"||action==="fire") return "rocket";
  if(action==="helicopter"||action==="drone") return "attack";
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
    const before=actor.hp;
    actor.hp=Math.min(20,actor.hp+1);
    actor.maxHp=Math.min(20,Math.max(actor.maxHp,actor.hp));
    text=actor.hp>before
      ? "❤️ Zemër: +1 ❤️. Tani ke "+actor.hp+" zemra."
      : "❤️ Zemër: ke arritur maksimumin 20 zemra.";
  }else if(action==="helicopter"){
    const hit=warDamage(target,2);
    extraTurn=true;
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Helikopterin, por ti gjuan përsëri."
      : "🚁 Helikopter: −"+hit.damage+" ❤️ dhe ti gjuan përsëri.";
  }else if(action==="drone"){
    const hit=warDamage(target,1);
    extraTurn=true;
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Dronin, por ti gjuan përsëri."
      : "🛸 Droni: −"+hit.damage+" ❤️ dhe ti gjuan përsëri.";
  }else if(action==="fire"){
    const hit=warDamage(target,2);
    if(!hit.blocked) target.burned=true;
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Rrethin e Zjarrtë."
      : "⭕🔥 Rrethi i Zjarrtë: −"+hit.damage+" ❤️. Kundërshtari u dogj dhe u bë i zi.";
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
    (action==="drone"?"drone":
    (action==="fire"?"fire":
    (action==="atom"?"atom":
    (action==="bomb"?"bomb":
    (action==="azrael"?"azrael":"attack"))))));

  shooter?.classList.add("firing");
  target?.classList.remove("hit");
  projectile.className="war-projectile";
  explosion.className="war-explosion";
  projectile.textContent=visualAction==="helicopter"?"🚁":
    visualAction==="drone"?"🛸":
    visualAction==="fire"?"⭕":
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
      visualAction==="drone"?"💥":
      visualAction==="fire"?"🔥":
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

    [p.special,p.special2]=warRollPair();

    if(result.extraTurn){
      warGameState.turn="player";
      warGameState.rerollUsedThisTurn=false;
      renderWarGame();
      return;
    }

    warGameState.turn="enemy";
    renderWarGame();
    setTimeout(warEnemyTurn,650);
  });
}

function warAiActionScore(action,e,p){
  let score=0;
  const protection=(p.protect||0)>0;
  if(action==="attack")score=22;
  else if(action==="bomb")score=protection?18:44;
  else if(action==="heart")score=(e.maxHp-e.hp)*14+(e.hp<=2?45:0);
  else if(action==="helicopter")score=protection?30:62;
  else if(action==="drone")score=protection?24:48;
  else if(action==="fire")score=protection?22:58;
  else if(action==="atom")score=protection?28:78;
  else if(action==="protect")score=e.protect>0?8:(e.hp<=3?72:38);
  else if(action==="azrael")score=protection?32:220;
  else if(action==="ice")score=p.frozen?6:46;
  const damage={attack:1,bomb:2,helicopter:2,drone:1,fire:2,atom:3}[action]||0;
  if(!protection&&damage>=p.hp)score+=160;
  return score;
}
function warChooseEnemyAction(e,p){
  const actions=[e.special,e.special2].filter(Boolean);
  if(!actions.length)return "attack";
  const ranked=actions.map(action=>({action,score:warAiActionScore(action,e,p)})).sort((a,b)=>b.score-a.score);
  const level=getGameAiLevel("war");
  if(level==="weak")return Math.random()<.7?ranked[ranked.length-1].action:actions[Math.floor(Math.random()*actions.length)];
  if(level==="medium")return Math.random()<.65?ranked[0].action:actions[Math.floor(Math.random()*actions.length)];
  if(level==="strong")return Math.random()<.9?ranked[0].action:actions[Math.floor(Math.random()*actions.length)];
  return ranked[0].action;
}

function warEnemyTurn(){
  const s=warGameState;
  if(!s||s.over||s.turn!=="enemy") return;

  const e=s.enemy;
  const p=s.player;
  const wasFrozen=e.frozen;
  if(!e.special||!e.special2){
    [e.special,e.special2]=warRollPair();
  }
  const chosen=warChooseEnemyAction(e,p);

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

      [e.special,e.special2]=warRollPair();

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

function normalizeGameOrder(value){
  const input=Array.isArray(value)?value:[];
  const clean=input.filter((id,index)=>DEFAULT_GAME_ORDER.includes(id)&&input.indexOf(id)===index);
  for(const id of DEFAULT_GAME_ORDER){
    if(!clean.includes(id)) clean.push(id);
  }
  return clean;
}

function gameChoiceLabel(id){
  if(id==="chess") return "♟️ "+tr("chess");
  if(id==="morris") return "🟣 "+tr("morris");
  if(id==="timer") return "⏱️ "+tr("timer");
  if(id==="tetris") return "🧱 "+tr("tetris");
  if(id==="war") return "⚔️ "+tr("war");
  if(id==="kingdom") return "🏰 "+tr("kingdom");
  if(id==="uck") return "🪖 "+tr("uck");
  if(id==="diamondrun") return "💎 "+tr("diamondrun");
  if(id==="diamondadventure") return "💎🏃 Diamond Adventure";
  return id;
}

function gameHasOnline(id){
  return ["chess","morris","timer","tetris","war"].includes(id);
}
function gameUsesComputer(id){
  return ["chess","morris","war","kingdom"].includes(id);
}
function getGameAiLevel(game){
  const level=computerAiLevels[game];
  return ["weak","medium","strong","pro"].includes(level)?level:"medium";
}
function setGameAiLevel(game,level){
  const safe=["weak","medium","strong","pro"].includes(level)?level:"medium";
  computerAiLevels[game]=safe;
  try{localStorage.setItem(COMPUTER_AI_LEVELS_KEY,JSON.stringify(computerAiLevels));}catch(_){}
  if(game==="chess"||game==="morris"){
    boardAiLevel=safe;
    localStorage.setItem(BOARD_AI_LEVEL_KEY,safe);
  }
  return safe;
}
function computerDifficultyText(key){
  const l=lang();
  const map={
    sq:{label:"🤖 Forca e kompjuterit",weak:"I dobët",medium:"I mesëm",strong:"I fortë",pro:"Profesionel",note:"Niveli ndryshon realisht mënyrën si luan kompjuteri."},
    de:{label:"🤖 Computerstärke",weak:"Schwach",medium:"Mittel",strong:"Stark",pro:"Profi",note:"Die Stufe ändert wirklich, wie stark der Computer spielt."},
    tr:{label:"🤖 Bilgisayar gücü",weak:"Zayıf",medium:"Orta",strong:"Güçlü",pro:"Profesyonel",note:"Seviye bilgisayarın gerçekten ne kadar güçlü oynadığını değiştirir."},
    en:{label:"🤖 Computer strength",weak:"Weak",medium:"Medium",strong:"Strong",pro:"Professional",note:"The selected level really changes how strongly the computer plays."},
    it:{label:"🤖 Forza del computer",weak:"Debole",medium:"Medio",strong:"Forte",pro:"Professionale",note:"Il livello cambia davvero la forza di gioco del computer."},
    hr:{label:"🤖 Snaga računala",weak:"Slabo",medium:"Srednje",strong:"Jako",pro:"Profesionalno",note:"Odabrana razina stvarno mijenja jačinu računala."},
    fr:{label:"🤖 Force de l’ordinateur",weak:"Faible",medium:"Moyen",strong:"Fort",pro:"Professionnel",note:"Le niveau change réellement la force de jeu de l’ordinateur."},
    ar:{label:"🤖 قوة الكمبيوتر",weak:"ضعيف",medium:"متوسط",strong:"قوي",pro:"محترف",note:"المستوى يغيّر فعليًا قوة لعب الكمبيوتر."}
  };
  return map[l]?.[key]||map.sq[key]||key;
}
function computerDifficultyControls(game){
  const level=getGameAiLevel(game);
  return '<div class="board-profile-box computer-difficulty-box"><label class="board-ai-level-label">'+computerDifficultyText("label")+
    '<select id="boardAiLevel" class="board-ai-level-select" data-ai-game="'+game+'">'+
      '<option value="weak" '+(level==="weak"?"selected":"")+'>'+computerDifficultyText("weak")+'</option>'+
      '<option value="medium" '+(level==="medium"?"selected":"")+'>'+computerDifficultyText("medium")+'</option>'+
      '<option value="strong" '+(level==="strong"?"selected":"")+'>'+computerDifficultyText("strong")+'</option>'+
      '<option value="pro" '+(level==="pro"?"selected":"")+'>'+computerDifficultyText("pro")+'</option>'+
    '</select></label><div class="game-help">'+computerDifficultyText("note")+'</div></div>';
}
function gameMenuActionText(key){
  const l=lang();
  const map={
    sq:{play:"🎮 Luaj",online:"🌐 Luaj online",computer:"🤖 Luaj me kompjuterin"},
    de:{play:"🎮 Spielen",online:"🌐 Online spielen",computer:"🤖 Gegen Computer"},
    tr:{play:"🎮 Oyna",online:"🌐 Çevrimiçi oyna",computer:"🤖 Bilgisayara karşı"},
    en:{play:"🎮 Play",online:"🌐 Play online",computer:"🤖 Play computer"},
    it:{play:"🎮 Gioca",online:"🌐 Gioca online",computer:"🤖 Gioca col computer"},
    hr:{play:"🎮 Igraj",online:"🌐 Igraj online",computer:"🤖 Igraj protiv računala"},
    fr:{play:"🎮 Jouer",online:"🌐 Jouer en ligne",computer:"🤖 Jouer contre l’ordinateur"},
    ar:{play:"🎮 العب",online:"🌐 العب أونلاين",computer:"🤖 العب ضد الكمبيوتر"}
  };
  return map[l]?.[key]||map.sq[key]||key;
}
function renderGameChoices(){
  return gameOrder.map((id)=>{
    const blocked=activeGameBlock(id)&&!gamesAdmin;
    const online=gameHasOnline(id);
    const computer=gameUsesComputer(id);
    return `<div class="game-choice ${selectedType===id?"active":""} ${blocked?"blocked":""}">
      <button class="game-choice-title" data-game="${id}" type="button" ${blocked?"disabled":""}>${gameChoiceLabel(id)}</button>
      <div class="game-choice-actions ${online?"":"single"}">
        ${online?`<button class="game-choice-online" data-game-online="${id}" type="button" ${blocked?"disabled":""}>${gameMenuActionText("online")}</button>`:""}
        <button class="game-choice-play" data-game-play="${id}" type="button" ${blocked?"disabled":""}>${gameMenuActionText(computer?"computer":"play")}</button>
      </div>
      ${activeGameBlock(id)?`<small class="game-block-note">🔒 ${gameBlockText(id)}</small>`:""}
    </div>`;
  }).join("");
}
async function launchGameFromMenu(id,mode){
  if(activeGameBlock(id)&&!gamesAdmin){
    const m=document.getElementById("gameMessage");
    if(m)m.textContent="Kjo lojë është e bllokuar nga Admini "+gameBlockText(id)+".";
    return;
  }
  selectedType=id;
  if(mode==="online"){
    if(id==="chess"||id==="morris"){await startBoardQuickOnline(id);return;}
    if(id==="timer"||id==="tetris"){await startArcadeQuick(id);return;}
    if(id==="war"){await startWarMultiSearch();return;}
    return;
  }
  if(id==="chess"||id==="morris"){startComputerGame();return;}
  if(id==="timer"){startTimerSoloGame();return;}
  if(id==="tetris"){startTetrisGame({practice:true});return;}
  if(id==="war"){startWarGame();return;}
  if(id==="kingdom"){startKingdomGame();return;}
  if(id==="uck"){startUckGame();return;}
  if(id==="diamondrun"){startDiamondRunGame();return;}
  if(id==="diamondadventure"){startDiamondAdventureGame();return;}
}

function boardGameSelected(){ return selectedType==="chess" || selectedType==="morris"; }
function boardNameValue(){ return (localStorage.getItem("pajaziti-global-user-name") || boardProfile?.display_name || "").trim().slice(0,20); }
async function loadBoardProfileAndLeaderboard(game=selectedType){
  if(game!=="chess" && game!=="morris") return;
  try{
    const profileRes=await supabase.rpc("board_get_profile",{p_device:deviceId});
    if(profileRes.error) throw profileRes.error;
    boardProfile=profileRes.data||null;
    if(boardProfile?.display_name) localStorage.setItem(BOARD_NAME_KEY,boardProfile.display_name);
    const input=document.getElementById("boardPlayerName");
    const info=document.getElementById("boardNameInfo");
    if(input){input.value=boardProfile?.display_name||localStorage.getItem(BOARD_NAME_KEY)||"";input.readOnly=!!boardProfile;input.classList.toggle("board-name-locked",!!boardProfile);}
    if(info) info.textContent=boardProfile ? "" : "Shkruaje emrin një herë. Pastaj ruhet përgjithmonë.";
    const pair=await Promise.all([supabase.rpc("board_weekly_leaderboard",{p_game:game}),supabase.rpc("board_weekly_champion",{p_game:game})]);
    if(pair[0].error) throw pair[0].error;
    if(pair[1].error) throw pair[1].error;
    boardLeaderboardRows=pair[0].data||[];boardChampion=pair[1].data||null;
    renderBoardLeaderboard(game);
  }catch(error){console.warn("board profile/leaderboard",error);}
}
async function ensureBoardProfile(){
  if(boardProfile?.display_name) return boardProfile;
  const name=boardNameValue();
  if(name.length<4) throw new Error("Emri i DIAMOND mungon.");
  const res=await supabase.rpc("board_set_profile",{p_device:deviceId,p_name:name});
  if(res.error){const raw=String(res.error.message||res.error);if(raw.includes("NAME_TAKEN"))throw new Error("Ky emër ekziston. Zgjidh një emër tjetër.");if(raw.includes("NAME_LOCKED"))throw new Error("Emri është i kyçur. Vetëm Admini mund ta ndryshojë.");throw res.error;}
  boardProfile=res.data;localStorage.setItem(BOARD_NAME_KEY,res.data.display_name);await loadBoardProfileAndLeaderboard(selectedType);return boardProfile;
}
function renderBoardLeaderboard(game){
  const el=document.getElementById("boardLeaderboard");if(!el)return;
  const rows=(boardLeaderboardRows||[]).map((r,i)=>"<div class=\"board-rank-row\"><span>"+(i===0?"🏆":(i+1)+".")+" "+escapeHtml(r.display_name)+"</span><strong>"+r.wins+" fitore</strong></div>").join("");
  const champion=boardChampion?.display_name ? "<div class=\"board-champion-line\">"+(boardChampion.completed?"👑 Fituesi i javës së kaluar":"⭐ Kryesuesi i kësaj jave")+": <strong>"+escapeHtml(boardChampion.display_name)+"</strong> · "+Number(boardChampion.wins||0)+" fitore</div>" : "";
  el.innerHTML="<h3>🏆 "+(game==="chess"?"Shah":"Degërxhik")+" · Java</h3>"+champion+"<div class=\"board-ranking\">"+(rows||"<div class=\"muted\">Ende nuk ka fitore këtë javë.</div>")+"</div>";
}
async function loadBoardRoomNames(){
  boardRoomNames={};if(!room||room.local||!["chess","morris"].includes(room.game_type))return;
  const devices=[room.player1_device,room.player2_device].filter(Boolean);if(!devices.length)return;
  const res=await supabase.from("board_profiles").select("device_id,display_name").in("device_id",devices);
  for(const p of (res.data||[])) boardRoomNames[p.device_id]=p.display_name;
}
async function loadBoardAdminProfiles(){
  const box=document.getElementById("boardAdminProfiles");if(!gamesAdmin||!box)return;
  const res=await supabase.rpc("board_admin_list_profiles");
  if(res.error){box.innerHTML="<div class=\"muted\">Nuk u ngarkuan lojtarët.</div>";return;}
  box.innerHTML=(res.data||[]).map(p=>"<div class=\"board-admin-row\"><div><strong>"+escapeHtml(p.display_name)+"</strong><small>♟️ "+p.chess_wins+" · 🟣 "+p.morris_wins+"</small></div><input maxlength=\"20\" value=\""+escapeHtml(p.display_name)+"\" data-board-admin-name=\""+escapeHtml(p.device_id)+"\"><button class=\"secondary\" type=\"button\" data-board-admin-save=\""+escapeHtml(p.device_id)+"\">Ruaj emrin</button></div>").join("")||"<div class=\"muted\">Nuk ka lojtarë.</div>";
  box.querySelectorAll("[data-board-admin-save]").forEach(btn=>{btn.onclick=async()=>{const dev=btn.dataset.boardAdminSave;const input=box.querySelector('[data-board-admin-name="'+CSS.escape(dev)+'"]');const name=(input?.value||"").trim().slice(0,20);btn.disabled=true;const out=await supabase.rpc("board_admin_rename",{p_device:dev,p_name:name});btn.disabled=false;if(out.error){alert("Emri nuk u ndryshua: "+(out.error.message||"gabim"));return;}await loadBoardAdminProfiles();await loadBoardProfileAndLeaderboard(selectedType);};});
}
function clearBoardRematchTimer(){if(boardRematchTimer){clearInterval(boardRematchTimer);boardRematchTimer=null;}}
async function recordBoardWin(color,reason="win"){
  if(!room||room.local||!room.player2_device||!["chess","morris"].includes(room.game_type))return;
  const winnerDevice=color==="w"?room.player1_device:room.player2_device;
  const out=await supabase.rpc("board_finish_game",{p_room:room.id,p_winner_device:winnerDevice,p_reason:reason});if(out.error)console.warn("board finish",out.error);
  room=await fetchRoomById(room.id).catch(()=>room);await loadBoardProfileAndLeaderboard(room.game_type).catch(()=>{});
}
async function resignBoardGame(){
  if(!room||room.local||room.status!=="active")return;
  if(!confirm("A dëshiron të dorëzohesh? Kundërshtari merr fitoren."))return;
  const out=await supabase.rpc("board_resign",{p_room:room.id,p_device:deviceId});if(out.error){alert("Nuk u bë dorëzimi.");return;}
  room=await fetchRoomById(room.id);renderRoom();
}
async function requestBoardRematch(){
  if(!room||room.local||room.status!=="finished")return;const btn=document.getElementById("boardRematchBtn");if(btn)btn.disabled=true;
  const out=await supabase.rpc("board_request_rematch",{p_room:room.id,p_device:deviceId});if(out.error){if(btn)btn.disabled=false;return;}
  boardRematchRequested=true;
  if(out.data?.new_room_id){const next=await fetchRoomById(out.data.new_room_id);boardRematchRequested=false;clearBoardRematchTimer();await openRoom(next);return;}
  if(btn){btn.textContent="⏳ Duke pritur kundërshtarin…";btn.disabled=true;}startBoardRematchPolling();
}
function startBoardRematchPolling(){
  if(!room||room.local||room.status!=="finished")return;clearBoardRematchTimer();const oldRoomId=room.id;
  const poll=async()=>{if(!room||room.id!==oldRoomId)return clearBoardRematchTimer();try{const out=await supabase.rpc("board_rematch_status",{p_room:oldRoomId,p_device:deviceId});if(out.error)return;boardRematchRequested=!!out.data?.requested;const btn=document.getElementById("boardRematchBtn");if(btn&&boardRematchRequested){btn.textContent="⏳ Duke pritur kundërshtarin…";btn.disabled=true;}if(out.data?.new_room_id){clearBoardRematchTimer();const next=await fetchRoomById(out.data.new_room_id);boardRematchRequested=false;await openRoom(next);}}catch(_){}};
  poll();boardRematchTimer=setInterval(poll,1800);
}
async function loadGameBlocks(){
  try{
    const {data,error}=await supabase.rpc("game_blocks_list");
    if(error)throw error;
    gameBlocks={};
    for(const row of (data||[]))gameBlocks[row.game_id]=row;
  }catch(error){console.warn("game blocks",error);}
}
function activeGameBlock(id){
  const b=gameBlocks[id];
  return !!(b?.is_blocked && b?.blocked_until && new Date(b.blocked_until).getTime()>Date.now());
}
function gameBlockText(id){
  const b=gameBlocks[id];
  if(!activeGameBlock(id))return "";
  return "deri "+new Date(b.blocked_until).toLocaleString();
}
async function setAdminGameBlock(){
  const game=document.getElementById("gameBlockSelect")?.value;
  const untilValue=document.getElementById("gameBlockUntil")?.value;
  const msg=document.getElementById("gameBlockStatus");
  if(!game||!untilValue){if(msg)msg.textContent="Zgjidh lojën dhe kohën.";return;}
  const until=new Date(untilValue);
  const {error}=await supabase.rpc("game_block_set",{p_game:game,p_until:until.toISOString()});
  if(error){if(msg)msg.textContent="Gabim: "+(error.message||error);return;}
  await loadGameBlocks();renderLobby();
}

async function loadGameOrder(){
  try{
    const {data:sessionData}=await supabase.auth.getSession();
    const user=sessionData?.session?.user||null;
    gamesAdmin=user?.email===ADMIN_EMAIL || window.DiamondUnifiedAdmin===true || localStorage.getItem("diamond-unified-admin")==="1";

    const {data,error}=await supabase
      .from("app_settings")
      .select("value")
      .eq("key",GAME_ORDER_SETTING_KEY)
      .maybeSingle();

    if(error){
      console.warn("Game order load",error);
      gameOrder=[...DEFAULT_GAME_ORDER];
      return;
    }
    gameOrder=normalizeGameOrder(data?.value);
  }catch(error){
    console.warn("Game order load",error);
    gameOrder=[...DEFAULT_GAME_ORDER];
  }
}

async function saveGameOrder(){
  const status=document.getElementById("gameOrderStatus");
  const save=document.getElementById("gameOrderSave");
  if(!gamesAdmin) return;
  if(save) save.disabled=true;
  if(status) status.textContent="Po ruhet…";
  try{
    const {data:sessionData}=await supabase.auth.getSession();
    const user=sessionData?.session?.user;
    if(!user || user.email!==ADMIN_EMAIL) throw new Error("Vetëm admini mund ta ndryshojë renditjen.");

    const {error}=await supabase.from("app_settings").upsert({
      key:GAME_ORDER_SETTING_KEY,
      value:gameOrder,
      updated_at:new Date().toISOString(),
      updated_by:user.id
    },{onConflict:"key"});
    if(error) throw error;
    if(status) status.textContent="✅ U ruajt. Kjo renditje u del të gjithëve.";
  }catch(error){
    if(status) status.textContent="❌ Nuk u ruajt: "+(error?.message||"gabim");
  }finally{
    if(save) save.disabled=false;
  }
}

function bindGameOrderAdmin(){
  if(!gamesAdmin) return;
  root.querySelectorAll("[data-game-order-move]").forEach((button)=>{
    button.onclick=()=>{
      const id=button.dataset.gameId;
      const index=gameOrder.indexOf(id);
      const delta=button.dataset.gameOrderMove==="up"?-1:1;
      const next=index+delta;
      if(index<0 || next<0 || next>=gameOrder.length) return;
      [gameOrder[index],gameOrder[next]]=[gameOrder[next],gameOrder[index]];
      renderLobby();
    };
  });
  const save=document.getElementById("gameOrderSave");
  if(save) save.onclick=saveGameOrder;
}

function renderLobby(msg=""){
  if(aiTimer){ clearTimeout(aiTimer); aiTimer=null; }
  room=null; selected=null;
  root.innerHTML=`
    <div class="games-shell">
      <section class="card games-lobby">
        <h2>🎮 ${tr("games")}</h2>
        <p class="muted">${tr("choose")}</p>
        <div class="game-global-controls">
          <button id="gameMasterSound" class="secondary" type="button">${masterSoundEnabled?gx("soundAllOn"):gx("soundAllOff")}</button>
          <button id="gameMusicToggle" class="secondary" type="button">${gameMusicEnabled?gx("musicOn"):gx("musicOff")}</button>
        </div>
        ${gameThemeControls()}
        <div class="games-choice">
          ${renderGameChoices()}
        </div>

        ${gamesAdmin?`
          <section class="game-order-admin">
            <div class="game-order-head">
              <strong>👑 Renditja e lojërave</strong>
              <small>Admini zgjedh cila lojë del e para për të gjithë.</small>
            </div>
            <div class="game-order-list">
              ${gameOrder.map((id,index)=>`
                <div class="game-order-row">
                  <span>${index+1}. ${gameChoiceLabel(id)}</span>
                  <div>
                    <button class="secondary game-order-move" type="button" data-game-id="${id}" data-game-order-move="up" ${index===0?"disabled":""}>⬆️</button>
                    <button class="secondary game-order-move" type="button" data-game-id="${id}" data-game-order-move="down" ${index===gameOrder.length-1?"disabled":""}>⬇️</button>
                  </div>
                </div>
              `).join("")}
            </div>
            <button id="gameOrderSave" class="primary" type="button">Ruaj renditjen</button>
            <div id="gameOrderStatus" class="message"></div>
            <div class="game-block-admin">
              <strong>🔒 Blloko një lojë për një kohë</strong>
              <select id="gameBlockSelect">
                <option value="chess">Shah</option>
                <option value="morris">Degërxhik</option>
                <option value="timer">Kral i Sekondave</option>
                <option value="tetris">Blloqe</option>
                <option value="war">Luftra</option>
                <option value="kingdom">Mbretëria e Fundit</option>
                <option value="uck">UÇK – Rruga e Lirisë</option>
                <option value="diamondrun">Diamond Run</option>
                <option value="diamondadventure">Diamond Adventure</option>
              </select>
              <input id="gameBlockUntil" type="datetime-local">
              <div class="game-block-actions">
                <button id="gameBlockSave" class="secondary" type="button">Blloko deri atëherë</button>
                <button id="gameBlockClear" class="secondary" type="button">Hape lojën</button>
              </div>
              <div id="gameBlockStatus" class="message"></div>
            </div>
          </section>
        `:""}

        ${gameUsesComputer(selectedType)?computerDifficultyControls(selectedType):""}

        ${(selectedType==="chess" || selectedType==="morris") ? `
          <div class="board-profile-box">
            <div class="game-help">👤 Emri: <strong>${escapeHtml(localStorage.getItem("pajaziti-global-user-name")||"—")}</strong></div>
            <div class="game-help">⬆️ Zgjidh “Luaj online” ose “Luaj me kompjuterin” te karta e lojës sipër.</div>
          </div>
          <section id="boardLeaderboard" class="card board-leaderboard"><div class="muted">🏆 Po ngarkohet renditja javore…</div></section>
          ${gamesAdmin?'<section class="card board-admin-panel"><h3>👑 Admin · Emrat e lojtarëve</h3><p class="muted">Vetëm Admini mund t’i ndryshojë. Pikët mbeten të njëjta.</p><div id="boardAdminProfiles">Po ngarkohen lojtarët…</div></section>':""}
        ` : selectedType==="timer" ? `
          <div class="game-help">👤 ${escapeHtml(localStorage.getItem("pajaziti-global-user-name")||"—")}</div>
          <div class="game-help">⬆️ Zgjidh “Luaj” ose “Luaj online” te karta e lojës sipër.</div>
          <div class="game-help">🎯 Online: app-i zgjedh vetë një numër nga 00:01 deri 09:99. I pari që shtyp STOP në kohën e duhur fiton.</div>
          <div class="game-help">👥 ${tr("maxPlayers")} · 🔒 ${tr("hiddenTime")}</div>
        ` : selectedType==="diamondrun" ? `
          <div class="game-help">💎 ${tr("diamondrun")}</div>
          <div class="game-help">⬆️ Shtyp “Luaj” te karta Diamond Run sipër.</div>
          <div class="game-help">🏃 Vrapo · ⬆️ Kërce · 💎 Mblidh diamante · ❤️ 3 jetë · 🚩 Arrij flamurin</div>
          <div class="game-help">🎯 5 nivele · checkpoint · armiq · pengesa · komandim me prekje në telefon.</div>
        ` : selectedType==="diamondadventure" ? `
          <div class="game-help">💎🏃 Diamond Adventure</div>
          <div class="game-help">🌴 5 botë · 📦 kuti speciale · 🌀 rrotullim · 🛡️ mburojë · 👹 Boss · 💾 progres i ruajtur.</div>
          <div class="game-help">⬆️ Shtyp “Luaj” te karta Diamond Adventure sipër.</div>
        ` : selectedType==="uck" ? `
          <div class="game-help">🪖 ${tr("uck")}</div>
          <div class="game-help">⬆️ Shtyp “Luaj” te karta UÇK sipër.</div>
          <div class="game-help">🚑 Ndihmë · 📦 Furnizime · 👨‍👩‍👧 Civilë · 🧭 Rrugë e sigurt · 🛡️ Mbrojtje zone</div>
          <div class="game-help">🎯 Misione të ndryshme, pikë, jetë dhe terren malor.</div>
        ` : selectedType==="kingdom" ? `
          <div class="game-help">🏰 ${tr("kingdom")}</div>
          <div class="game-help">⬆️ Shtyp “Luaj me kompjuterin” te karta e lojës sipër.</div>
          <div class="game-help">🌱 Tokë · 🧱 Mur · 🛡️ Ushtar · 🌉 Urë · 🔥 Zjarr · 🌊 Ujë · 💣 Bombë · 💎 Diamanti i Zi</div>
          <div class="game-help">🎯 24 raunde · pushto kështjellën ose mbaro me territorin më të madh.</div>
        ` : selectedType==="war" ? `
          <div class="war-user-setup">
            <div class="war-economy-head">
              <strong>👤 ${escapeHtml(localStorage.getItem("pajaziti-global-user-name")||"—")}</strong>
              <strong class="war-diamonds">💎 <span id="warDiamonds">200</span></strong>
            </div>
            <input id="warPlayerName" type="hidden" value="${escapeHtml(localStorage.getItem("pajaziti-global-user-name")||"")}">
            <div id="warNameInfo" class="game-help hidden"></div>
            <div class="war-diamond-note">💎 +5 çdo orë · 🎲 armë të reja 3 💎 · 🤖 ${gx("practiceNote")}</div>
            <div class="game-help">⬆️ Zgjidh “Luaj online” ose “Luaj me kompjuterin” te karta Luftra sipër.</div>
            <div id="warMultiCount" class="war-online-count">👥 Në pritje: 0 / 8</div>
            <div class="game-help">Online pret 10 sekonda. Nëse askush nuk hyn, del “Provo përsëri” — nuk kalon te kompjuteri.</div>
          </div>
          <section id="warLeaderboard" class="war-leaderboard"><div class="muted">🏆 Po ngarkohet renditja javore…</div></section>
          ${gamesAdmin?`<section class="war-admin-panel"><h3>👑 Admin · Luftra</h3><p class="muted">Jep diamanta çdo lojtari. Emri lidhet me pajisjen dhe mund të ndryshohet vetëm 2 herë.</p><div id="warAdminProfiles">Po ngarkohen lojtarët…</div></section>`:""}
        ` : selectedType==="tetris" ? `
          <div class="game-help">👤 ${escapeHtml(localStorage.getItem("pajaziti-global-user-name")||"—")}</div>
          <div class="game-help">⬆️ Zgjidh “Luaj” ose “Luaj online” te karta Blloqe sipër.</div>
          <div class="game-help">Online pret deri 15 sekonda. Lojtari i fundit që mbetet në lojë fiton 🥇.</div>
          <div class="game-help">👆 Prek një herë ekranin = rrotullo · ✋ Mbaje të shtypur dhe tërhiqe = lëvize ku dëshiron</div>
          <section id="tetrisRecentWins" class="tetris-leaderboard-mini"><div class="muted">🥇 Po ngarkohen fituesit online…</div></section>
          <section id="tetrisLobbyLeaderboard" class="tetris-leaderboard-mini"><div class="muted">🏆 Po ngarkohet renditja…</div></section>
        ` : `<button id="computerGame" class="primary" type="button">🤖 ${tr("computer")}</button>`}

        ${(selectedType==="tetris" || selectedType==="war" || selectedType==="kingdom" || selectedType==="uck" || selectedType==="diamondrun" || selectedType==="diamondadventure" || selectedType==="chess" || selectedType==="morris" || selectedType==="timer") ? "" : `
          <div class="game-help">🌐 ${tr("online")}</div>
          <button id="createGame" class="secondary" type="button">${tr("create")}</button>
          <div class="game-join-row">
            <input id="joinCode" type="text" maxlength="8" placeholder="${tr("code")}">
            <button id="joinGame" class="secondary" type="button">${tr("join")}</button>
          </div>
        `}
        ${practiceFallbackGame===selectedType?`<div class="practice-fallback-box"><strong>${escapeHtml(gx("noOnlineFound"))}</strong><button id="onlinePracticeFallback" class="primary" type="button">${escapeHtml(gx("practice"))}</button><small>${escapeHtml(gx("practiceNote"))}</small></div>`:""}
        <div id="gameMessage" class="message">${msg}</div>
      </section>
      ${selectedType==="timer" ? `<section id="timerLeaderboard" class="card timer-leaderboard"><div class="muted">${tr("weekly")}…</div></section>` : ""}
    </div>`;
  if(selectedType==="timer") loadTimerLeaderboard();
  scheduleAutoTranslateGameUI();
  document.getElementById("onlinePracticeFallback")?.addEventListener("click",()=>startPracticeForGame(selectedType));
  ensureGameInfoButton();
  document.getElementById("gameMasterSound")?.addEventListener("click",()=>{setMasterSound(!masterSoundEnabled);renderLobby();});
  document.getElementById("gameMusicToggle")?.addEventListener("click",()=>{setGameMusic(!gameMusicEnabled);renderLobby();});
  document.getElementById("gameThemeToggle")?.addEventListener("click",()=>{gameThemePanelOpen=!gameThemePanelOpen;renderLobby();});
  ["gameColorLight","gameColorDark","gameColorPrimary","gameColorSecondary","gameColorArena"].forEach(id=>document.getElementById(id)?.addEventListener("input",()=>{if(!gamesAdmin)saveUserGameTheme();}));
  document.getElementById("saveAdminGameTheme")?.addEventListener("click",saveAdminGameTheme);
  document.getElementById("resetUserGameTheme")?.addEventListener("click",resetUserGameTheme);
  root.querySelectorAll("[data-game]").forEach(btn=>btn.onclick=()=>{const id=btn.dataset.game;if(activeGameBlock(id)&&!gamesAdmin){const m=document.getElementById("gameMessage");if(m)m.textContent="Kjo lojë është e bllokuar nga Admini "+gameBlockText(id)+".";return;}selectedType=id;renderLobby();});
  root.querySelectorAll("[data-game-play]").forEach(btn=>btn.onclick=async()=>{btn.disabled=true;try{await launchGameFromMenu(btn.dataset.gamePlay,"play");}finally{if(btn.isConnected)btn.disabled=false;}});
  root.querySelectorAll("[data-game-online]").forEach(btn=>btn.onclick=async()=>{btn.disabled=true;try{await launchGameFromMenu(btn.dataset.gameOnline,"online");}finally{if(btn.isConnected)btn.disabled=false;}});
  const warChoice=root.querySelector('[data-game="war"]'); if(warChoice) warChoice.addEventListener("click",()=>{selectedType="war";renderLobby();},{once:true});
  bindGameOrderAdmin();
  document.getElementById("gameBlockSave")?.addEventListener("click",setAdminGameBlock);
  document.getElementById("gameBlockClear")?.addEventListener("click",async()=>{
    const game=document.getElementById("gameBlockSelect")?.value;if(!game)return;
    await supabase.rpc("game_block_set",{p_game:game,p_until:null});
    await loadGameBlocks();renderLobby();
  });
  const computerButton=document.getElementById("computerGame");
  if(computerButton) computerButton.onclick=startComputerGame;
  const timerSoloButton=document.getElementById("timerSoloGame");
  if(timerSoloButton) timerSoloButton.onclick=startTimerSoloGame;
  document.getElementById("timerQuickOnline")?.addEventListener("click",()=>startArcadeQuick("timer"));
  document.getElementById("boardQuickOnline")?.addEventListener("click",()=>startBoardQuickOnline(selectedType));
  document.getElementById("boardAiLevel")?.addEventListener("change",(e)=>{
    const game=e.target.dataset.aiGame||selectedType;
    const level=setGameAiLevel(game,e.target.value||"medium");
    if(game==="chess"||game==="morris")boardAiLevel=level;
  });
  document.getElementById("boardPracticeNow")?.addEventListener("click",()=>{
    const pick=document.getElementById("boardAiLevel")?.value;
    if(pick){boardAiLevel=pick;localStorage.setItem(BOARD_AI_LEVEL_KEY,boardAiLevel);}
    startPracticeForGame(selectedType);
  });
  if(boardGameSelected()){
    loadBoardProfileAndLeaderboard(selectedType);if(gamesAdmin)loadBoardAdminProfiles();
  }

  const diamondRunButton=document.getElementById("diamondRunGame");
  if(diamondRunButton) diamondRunButton.onclick=startDiamondRunGame;

  const uckButton=document.getElementById("uckGame");
  if(uckButton) uckButton.onclick=startUckGame;

  const kingdomButton=document.getElementById("kingdomGame");
  if(kingdomButton) kingdomButton.onclick=startKingdomGame;

  const tetrisButton=document.getElementById("tetrisGame");
  if(tetrisButton) tetrisButton.onclick=startTetrisGame;
  document.getElementById("tetrisQuickOnline")?.addEventListener("click",()=>startArcadeQuick("tetris"));

  const warNameInput=document.getElementById("warPlayerName");
  if(warNameInput){
    warNameInput.addEventListener("input",()=>{
      if(!warProfile||warRenameEditing) localStorage.setItem(WAR_NAME_KEY,warNameInput.value.trim().slice(0,20));
    });
  }
  const warRenameBtn=document.getElementById("warRenameBtn");
  if(warRenameBtn){
    warRenameBtn.onclick=async()=>{
      const info=document.getElementById("warNameInfo");
      if(!warProfile) return;
      if(Number(warProfile.rename_count||0)>=2){ if(info) info.textContent="Emrin mund ta ndryshosh maksimum 2 herë."; return; }
      if(!warRenameEditing){
        warRenameEditing=true;
        if(warNameInput){
          warNameInput.readOnly=false;
          warNameInput.classList.remove("war-name-locked");
          warNameInput.focus();
          warNameInput.select();
        }
        warRenameBtn.textContent="💾 Ruaj emrin · 25 💎";
        if(info) info.textContent="Shkruaje emrin e ri. Ruajtja kushton 25 💎.";
        return;
      }
      warRenameBtn.disabled=true;
      try{
        await saveWarProfile();
        warRenameEditing=false;
        await loadWarProfileAndLeaderboard();
      }catch(error){
        if(info) info.textContent=error?.message||"Emri nuk u ndryshua.";
      }finally{
        warRenameBtn.disabled=false;
      }
    };
  }
  const warButton=document.getElementById("warGame");
  if(warButton) warButton.onclick=startWarGame;
  const warMultiBtn=document.getElementById("warMultiBtn");
  if(warMultiBtn) warMultiBtn.onclick=startWarMultiSearch;
  if(selectedType==="war"){
    loadWarProfileAndLeaderboard();
    refreshWarMultiLobbyCount();
    if(gamesAdmin) loadWarAdminPanel();
  }

  const createButton=document.getElementById("createGame");
  if(createButton) createButton.onclick=createRoom;

  const joinButton=document.getElementById("joinGame");
  if(joinButton) joinButton.onclick=joinRoom;

  if(selectedType==="tetris"){
    loadTetrisLeaderboard("tetrisLobbyLeaderboard");
    loadArcadeWins("tetris","tetrisRecentWins");
  }
}


async function startDiamondAdventureGame(){
  stopGameMusic();
  try{
    const mod=await import("./diamond-adventure.js?v=1");
    mod.startDiamondAdventureGame({root,onBack:()=>renderLobby()});
  }catch(error){
    console.warn("diamond adventure",error);
    renderLobby("Diamond Adventure nuk u hap. Provo përsëri.");
  }
}

async function startDiamondRunGame(){
  stopGameMusic();
  try{
    const mod=await import("./diamond-run.js?v=4");
    mod.startDiamondRunGame({root,onBack:()=>renderLobby()});
  }catch(error){
    console.warn("diamond run",error);
    renderLobby("Diamond Run nuk u hap. Provo përsëri.");
  }
}

async function startUckGame(){
  stopGameMusic();
  try{
    const mod=await import("./uck.js?v=1");
    mod.startUckGame({root,onBack:()=>renderLobby()});
  }catch(error){
    console.warn("uck game",error);
    renderLobby("UÇK – Rruga e Lirisë nuk u hap. Provo përsëri.");
  }
}

async function startKingdomGame(){
  stopGameMusic();
  try{
    const difficulty=document.getElementById("boardAiLevel")?.value||getGameAiLevel("kingdom");
    setGameAiLevel("kingdom",difficulty);
    const mod=await import("./kingdom.js?v=2");
    mod.startKingdomGame({root,onBack:()=>renderLobby(),difficulty});
  }catch(error){
    console.warn("kingdom game",error);
    renderLobby("Mbretëria e Fundit nuk u hap. Provo përsëri.");
  }
}

function clearQuickChess(){
  if(quickChessTimer){clearInterval(quickChessTimer);quickChessTimer=null;}
  quickChessDeadline=0;
}

async function startBoardQuickOnline(game){
  clearQuickChess();clearBoardRematchTimer();const btn=document.getElementById("boardQuickOnline");if(btn)btn.disabled=true;
  try{
    const profile=await ensureBoardProfile();
    const out=await supabase.rpc("board_quick_join",{p_game:game,p_device:deviceId,p_name:profile.display_name});if(out.error)throw out.error;
    const roomId=out.data?.room_id;if(!roomId)throw new Error("ROOM_NOT_CREATED");quickChessDeadline=new Date(out.data.deadline).getTime();
    let fresh=await fetchRoomById(roomId);await openRoom(fresh);
    const tick=async()=>{try{fresh=await fetchRoomById(roomId);room=fresh;if(fresh.status==="active"&&fresh.player2_device){clearQuickChess();await loadBoardRoomNames();renderRoom();return;}const left=Math.max(0,Math.ceil((quickChessDeadline-Date.now())/1000));const status=document.querySelector(".game-status");if(status)status.textContent=gx("onlineWait")+" "+left+" s";if(Date.now()>=quickChessDeadline){const again=await fetchRoomById(roomId).catch(()=>null);if(again?.status==="active"&&again.player2_device){room=again;clearQuickChess();await loadBoardRoomNames();renderRoom();return;}await supabase.rpc("board_quick_cancel",{p_room:roomId,p_device:deviceId});clearQuickChess();room=null;practiceFallbackGame=game;renderLobby(gx("noOnlineFound"));}}catch(error){console.warn("board quick online",error);}};
    await tick();if(room?.status==="waiting")quickChessTimer=setInterval(tick,1000);
  }catch(error){const raw=String(error?.message||error);renderLobby(raw.includes("NAME_TAKEN")?"Ky emër ekziston. Zgjidh një tjetër.":raw.includes("NAME_LOCKED")?"Emri është i kyçur. Vetëm Admini mund ta ndryshojë.":"Nuk u hap loja online. Provo përsëri.");}
  finally{if(btn)btn.disabled=false;}
}
function clearArcadePolling(){if(arcadePollTimer){clearInterval(arcadePollTimer);arcadePollTimer=null;}if(tetrisOnlineProgressTimer){clearInterval(tetrisOnlineProgressTimer);tetrisOnlineProgressTimer=null;}if(arcadeClockTimer){clearInterval(arcadeClockTimer);arcadeClockTimer=null;}}

function arcadeName(){ return (localStorage.getItem("pajaziti-global-user-name")||"").trim().slice(0,24); }

function arcadeHundredths(ms){
  const v=Math.max(0,Math.min(9990,Number(ms)||0));
  const sec=Math.floor(v/1000);
  const hs=Math.floor((v%1000)/10);
  return String(sec).padStart(2,"0")+":"+String(hs).padStart(2,"0");
}

async function loadArcadePlayers(){
  if(!arcadeRoom?.room_id) return [];
  const {data,error}=await supabase.from("arcade_players")
    .select("room_id,device_id,display_name,eliminated,score,lines,stop_ms,joined_at,last_seen_at")
    .eq("room_id",arcadeRoom.room_id)
    .order("joined_at",{ascending:true});
  if(error) throw error;
  arcadePlayers=data||[];
  return arcadePlayers;
}

async function loadArcadeWins(game,targetId){
  const el=document.getElementById(targetId);
  if(!el) return;
  try{
    const {data,error}=await supabase.from("arcade_wins")
      .select("winner_name,opponents,medal,won_at")
      .eq("game_type",game)
      .order("won_at",{ascending:false})
      .limit(6);
    if(error) throw error;
    const rows=(data||[]).map(x=>{
      const when=new Date(x.won_at).toLocaleString([], {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
      return '<div class="tetris-rank-row"><span>'+escapeHtml(x.medal+" "+x.winner_name)+'</span><strong>'+escapeHtml(when+" · kundër "+(x.opponents||"—"))+'</strong></div>';
    }).join("");
    el.innerHTML='<h3>🥇 Fituesit Online</h3><div class="tetris-ranking">'+(rows||'<div class="muted">Ende nuk ka fitues online.</div>')+'</div>';
  }catch(error){
    console.warn("arcade wins",error);
  }
}

async function leaveArcade(){
  const id=arcadeRoom?.room_id;
  clearArcadePolling();
  if(id) await supabase.rpc("arcade_leave",{p_room:id,p_device:deviceId}).catch(()=>{});
  arcadeRoom=null;arcadePlayers=[];arcadeMode=null;arcadeStarted=false;tetrisOnline=false;
}

async function startArcadeQuick(game){
  const name=arcadeName(game);
  if(!name){renderLobby(tr("needName"));return;}
  clearArcadePolling();
  arcadeMode=game;
  arcadeStarted=false;
  try{
    const {data,error}=await supabase.rpc("arcade_join",{p_game:game,p_device:deviceId,p_name:name});
    if(error) throw error;
    arcadeRoom=data;
    await loadArcadePlayers();
    renderArcadeWaiting();
    const tick=async()=>{
      if(!arcadeRoom?.room_id)return;
      try{
        const {data:state,error:pollError}=await supabase.rpc("arcade_poll",{p_room:arcadeRoom.room_id,p_device:deviceId});
        if(pollError) throw pollError;
        arcadeRoom={...arcadeRoom,...state};
        await loadArcadePlayers();
        if(state.status==="cancelled"){
          clearArcadePolling();
          const g=arcadeMode;
          arcadeRoom=null;arcadePlayers=[];arcadeStarted=false;
          practiceFallbackGame=g;renderLobby(gx("noOnlineFound"));
          arcadeMode=g;
          return;
        }
        if(state.status==="finished"){
          clearArcadePolling();
          if(game==="timer") renderArcadeTimer();
          else finishTetrisOnline();
          return;
        }
        if(state.status==="active"){
          if(game==="timer") renderArcadeTimer();
          else if(!arcadeStarted){
            arcadeStarted=true;
            tetrisOnline=true;
            startTetrisGame({online:true});
            startTetrisOnlineHeartbeat();
          }else{
            updateTetrisOnlineStatus();
          }
        }else{
          renderArcadeWaiting();
        }
      }catch(error){console.warn("arcade poll",error);}
    };
    await tick();
    if(arcadeRoom?.room_id) arcadePollTimer=setInterval(tick,800);
  }catch(error){
    console.warn("arcade join",error);
    practiceFallbackGame=game;renderLobby(tr("error"));
  }
}

function renderArcadeWaiting(){
  if(!arcadeRoom)return;
  const deadline=new Date(arcadeRoom.join_deadline).getTime();
  const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));
  const max=arcadeMode==="tetris"?4:8;
  root.innerHTML='<div class="games-shell"><section class="card arcade-wait-card">'+
    '<h2>🌐 '+(arcadeMode==="tetris"?"Blloqe Online":"Kral i Sekondave Online")+'</h2>'+
    '<div class="arcade-countdown">'+left+'</div>'+
    '<p>Po presim lojtarë… '+arcadePlayers.length+' / '+max+'</p>'+
    '<div class="timer-player-list">'+arcadePlayers.map((p,i)=>'<div class="timer-player-row"><span><strong>'+(i+1)+'. '+escapeHtml(p.display_name)+'</strong></span><span>🟢</span></div>').join("")+'</div>'+
    '<button id="arcadeLeave" class="secondary" type="button">← Kthehu te lojërat</button>'+
    '</section></div>';
  document.getElementById("arcadeLeave").onclick=async()=>{await leaveArcade();renderLobby();};
}

function startArcadeVisibleClock(){if(arcadeClockTimer){clearInterval(arcadeClockTimer);arcadeClockTimer=null;}const tick=()=>{const el=document.getElementById("arcadeRunningClock");if(!el||!arcadeRoom?.started_at)return;const start=new Date(arcadeRoom.started_at).getTime();el.textContent=arcadeHundredths(Math.max(0,Date.now()-start));};tick();arcadeClockTimer=setInterval(tick,20);}
function renderArcadeTimer(){
  if(!arcadeRoom)return;if(arcadeClockTimer){clearInterval(arcadeClockTimer);arcadeClockTimer=null;}
  const startedAt=arcadeRoom.started_at?new Date(arcadeRoom.started_at).getTime():0;
  const target=arcadeHundredths(arcadeRoom.target_ms);
  const winner=arcadePlayers.find(p=>p.device_id===arcadeRoom.winner_device);
  const finished=arcadeRoom.status==="finished";
  const beforeStart=startedAt && Date.now()<startedAt;
  root.innerHTML='<div class="games-shell"><section class="card arcade-timer-card">'+
    '<h2>👑 Kral i Sekondave Online</h2>'+
    '<div class="arcade-target-label">NDAL TE</div>'+
    '<div class="arcade-target">'+target+'</div>'+(!finished?'<div id="arcadeRunningClock" class="arcade-running-clock">00:00</div>':'')+
    (finished
      ? '<div class="timer-crown">👑</div><div class="timer-big-message">Fituesi</div><div class="timer-winner-name">'+escapeHtml(winner?.display_name||"—")+'</div>'
      : '<div class="game-help">'+(beforeStart?"Bëhu gati…":"I pari që shtyp STOP në ose pas kohës së treguar fiton.")+'</div><button id="arcadeTimerStop" class="timer-stop-button" type="button" '+(beforeStart?"disabled":"")+'>STOP</button><div id="arcadeTimerMsg" class="message"></div>')+
    '<section><h3>👥 Lojtarët</h3><div class="timer-player-list">'+arcadePlayers.map((p,i)=>'<div class="timer-player-row"><span><strong>'+(i+1)+'. '+escapeHtml(p.display_name)+'</strong></span><span>'+(p.device_id===arcadeRoom.winner_device?"👑":"🟢")+'</span></div>').join("")+'</div></section>'+
    '<button id="arcadeLeave" class="secondary" type="button">← Kthehu te lojërat</button>'+
    '</section></div>';
  document.getElementById("arcadeTimerStop")?.addEventListener("click",stopArcadeTimer);
  document.getElementById("arcadeLeave").onclick=async()=>{await leaveArcade();renderLobby();};
  if(!finished&&!beforeStart)startArcadeVisibleClock();
}

async function stopArcadeTimer(){
  const btn=document.getElementById("arcadeTimerStop");
  if(btn)btn.disabled=true;
  try{
    const {data,error}=await supabase.rpc("arcade_timer_stop",{p_room:arcadeRoom.room_id,p_device:deviceId});
    if(error)throw error;
    if(data?.too_early){
      const msg=document.getElementById("arcadeTimerMsg");
      if(msg)msg.textContent="⏱️ Shumë herët. Prit deri te "+arcadeHundredths(data.target_ms)+".";
      if(btn)btn.disabled=false;
      return;
    }
    arcadeRoom={...arcadeRoom,...data,status:data?.status||arcadeRoom.status};
    await loadArcadePlayers();
    renderArcadeTimer();
  }catch(error){
    console.warn("arcade timer stop",error);
    if(btn)btn.disabled=false;
  }
}

async function reportTetrisOnline(eliminated=false){
  if(!tetrisOnline||!arcadeRoom?.room_id||!tetris)return;
  try{
    const {data,error}=await supabase.rpc("arcade_tetris_progress",{
      p_room:arcadeRoom.room_id,p_device:deviceId,
      p_score:Number(tetris.score||0),p_lines:Number(tetris.lines||0),p_eliminated:!!eliminated
    });
    if(error)throw error;
    if(data?.status==="finished"){
      arcadeRoom={...arcadeRoom,...data};
      await loadArcadePlayers();
      finishTetrisOnline();
    }
  }catch(error){console.warn("tetris online progress",error);}
}

function startTetrisOnlineHeartbeat(){
  if(tetrisOnlineProgressTimer)clearInterval(tetrisOnlineProgressTimer);
  tetrisOnlineProgressTimer=setInterval(async()=>{
    if(!tetrisOnline||!arcadeRoom?.room_id)return;
    await reportTetrisOnline(false);
    await loadArcadePlayers().catch(()=>{});
    updateTetrisOnlineStatus();
  },2500);
}

function updateTetrisOnlineStatus(){
  const el=document.getElementById("tetrisOnlineStatus");
  if(!el)return;
  const alive=arcadePlayers.filter(p=>!p.eliminated);
  el.innerHTML='<strong>🌐 Online · '+alive.length+' gjallë / '+arcadePlayers.length+'</strong>'+
    '<div class="tetris-online-players">'+arcadePlayers.map(p=>'<span class="'+(p.eliminated?"out":"")+'">'+escapeHtml(p.display_name)+' '+(p.eliminated?"❌":"🟢")+'</span>').join("")+'</div>';
}

function finishTetrisOnline(){
  if(!tetrisOnline)return;
  clearArcadePolling();
  const winner=arcadePlayers.find(p=>p.device_id===arcadeRoom?.winner_device);
  if(tetris){
    tetris.gameOver=true;
    stopTetris();
    const overlay=document.getElementById("tetrisOverlay");
    if(overlay){
      overlay.classList.remove("hidden");
      overlay.innerHTML='<div><strong>🥇 '+escapeHtml(winner?.display_name||"Fituesi")+'</strong><br><span>Fitoi Blloqe Online</span></div>';
    }
  }
  updateTetrisOnlineStatus();
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
  const difficulty=document.getElementById("boardAiLevel")?.value||getGameAiLevel(selectedType);
  boardAiLevel=setGameAiLevel(selectedType,difficulty);
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
  room=r;selected=null;boardRematchRequested=false;clearBoardRematchTimer();
  if(room.game_type==="timer")lastTimerSoundKey="";
  if(room.game_type==="timer")await loadTimerPlayers();
  if(["chess","morris"].includes(room.game_type)){await loadBoardRoomNames();await loadBoardProfileAndLeaderboard(room.game_type).catch(()=>{});}
  subscribeRoom();renderRoom();
}

function subscribeRoom(){
  if(room?.localTimer) return;
  if(channel)supabase.removeChannel(channel);
  channel=supabase.channel("game-"+room.id)
    .on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_rooms",filter:"id=eq."+room.id},async payload=>{
      room=payload.new;selected=null;
      if(room.game_type==="timer")await loadTimerPlayers();
      if(["chess","morris"].includes(room.game_type))await loadBoardRoomNames();
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
  if(s.winner){const winnerDevice=s.winner==="w"?room.player1_device:room.player2_device;const name=boardRoomNames[winnerDevice]||(s.winner==="w"?tr("white"):tr("black"));return `${tr("gameOver")} · ${tr("winner")}: ${name}`;}
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
        ${local?`<div class="practice-banner">${gx("practiceNote")}</div>`:""}
        <div class="game-status">${waiting && ["chess","morris"].includes(room.game_type) && quickChessDeadline ? "🌐 Duke pritur lojtar online… "+Math.max(0,Math.ceil((quickChessDeadline-Date.now())/1000))+" s" : waiting?tr("waiting"):statusText()}</div>
        <div class="game-meta-grid">
          <div class="game-meta-box ${room.game_type==="morris"?"morris-player-white":""}">⚪ ${tr("white")}: ${local?"Ti":escapeHtml(boardRoomNames[room.player1_device]||"Lojtari 1")}</div>
          <div class="game-meta-box ${room.game_type==="morris"?"morris-player-black":""}">⚫ ${tr("black")}: ${local ? "🤖 "+tr("computerName") : (room.player2_device?escapeHtml(boardRoomNames[room.player2_device]||"Lojtari 2"):"…")}</div>
        </div>
      </section>
      <section class="card ${room.game_type==="morris"?"morris-board-card":""}">
        <div class="game-board-wrap" id="gameBoard"></div>
        <div class="game-help">${room.game_type==="chess"?tr("helpChess"):tr("helpMorris")}</div>
        <div class="game-actions">
          ${local ? `<button id="newComputerGame" class="primary" type="button">${tr("newGame")}</button>` : ""}
          ${!local&&room.status==="active"&&room.player2_device?'<button id="boardResignBtn" class="secondary board-resign-btn" type="button">${gx("resign")}</button>':""}
          ${!local&&room.status==="finished"?'<button id="boardRematchBtn" class="primary" type="button">${gx("rematch")}</button>':""}
          <button id="leaveGame" class="secondary" type="button">${tr("leave")}</button>
        </div>
      </section>
    </div>`;
  const copyButton=document.getElementById("copyRoom");
  if(copyButton) copyButton.onclick=async()=>{await navigator.clipboard.writeText(room.code);copyButton.textContent=tr("copied");};
  const newButton=document.getElementById("newComputerGame");
  if(newButton)newButton.onclick=startComputerGame;
  document.getElementById("boardResignBtn")?.addEventListener("click",resignBoardGame);
  document.getElementById("boardRematchBtn")?.addEventListener("click",requestBoardRematch);
  document.getElementById("leaveGame").onclick=()=>{clearBoardRematchTimer();if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}if(channel)supabase.removeChannel(channel);channel=null;stopGameAudioForExit();renderLobby();};
  if(!local&&room.status==="finished")startBoardRematchPolling();
  if(room.game_type==="chess")renderChess(myColor());else renderMorris(myColor());
  scheduleComputerTurn();
  scheduleAutoTranslateGameUI();
  ensureGameInfoButton();
}

function clearTimerVisibleClock(){if(timerVisibleClockTimer){clearInterval(timerVisibleClockTimer);timerVisibleClockTimer=null;}}
function updateTimerVisibleClock(){const el=document.getElementById("timerVisibleClock");if(!el||!room?.state?.start_at)return;const start=new Date(room.state.start_at).getTime();el.textContent=timerMs(Math.max(0,Date.now()-start));}
function clearTimerPhaseTimeout(){if(timerPhaseTimeout){clearTimeout(timerPhaseTimeout);timerPhaseTimeout=null;}clearTimerVisibleClock();}

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
      <div id="timerVisibleClock" class="visible-seconds-clock">${started?timerMs(Math.max(0,Date.now()-startAt)):"0.000 s"}</div>
      <div class="timer-big-message">${waitingForStart ? tr("ready") : (me?.eliminated ? tr("youEliminated") : me?.stop_ms!=null ? tr("stopped") : "Sekondat po ecin")}</div>
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

  if(waitingForStart)scheduleTimerPhaseRender();
  if(phase==="countdown"&&started){updateTimerVisibleClock();timerVisibleClockTimer=setInterval(updateTimerVisibleClock,20);}
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

const C_SYM={wp:"♟",wr:"♜",wn:"♞",wb:"♝",wq:"♛",wk:"♚",bp:"♟",br:"♜",bn:"♞",bb:"♝",bq:"♛",bk:"♚"};

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
  if(boardChampion?.display_name){const mark=document.createElement("div");mark.className="board-champion-watermark";mark.textContent="👑 "+boardChampion.display_name;board.appendChild(mark);}
  wrap.innerHTML="";wrap.appendChild(board);
}

async function chessClick(r,c){
  if(!room.player2_device||room.state.winner)return;
  const color=myColor();if(room.state.turn!==color)return;
  const b=room.state.board;
  if(!selected){if(b[r][c]&&b[r][c][0]===color){genericGameTone(330,.04);selected=[r,c];renderRoom();}return;}
  if(b[r][c]&&b[r][c][0]===color){selected=[r,c];renderRoom();return;}
  const moves=chessMoves(b,...selected);
  if(!moves.some(x=>x[0]===r&&x[1]===c)){selected=null;renderRoom();return;}
  const nb=b.map(row=>row.slice());
  let piece=nb[selected[0]][selected[1]],captured=nb[r][c];
  nb[selected[0]][selected[1]]=null;if(piece[1]==="p"&&(r===0||r===7))piece=piece[0]+"q";nb[r][c]=piece;
  const ns={...room.state,board:nb,turn:color==="w"?"b":"w"};if(captured&&captured[1]==="k")ns.winner=color;
  genericGameTone(captured?220:520,captured?.[1]==="k"?.15:.06);selected=null;await saveState(ns,"active");if(ns.winner&&!room.local)await recordBoardWin(ns.winner,"win");if(!room.local)renderRoom();
}

function aiPickByLevel(candidates){
  if(!candidates.length) return null;
  const sorted=[...candidates].sort((a,b)=>b.score-a.score);
  if(boardAiLevel==="weak") return sorted[Math.floor(Math.random()*sorted.length)];
  if(boardAiLevel==="medium") return sorted[Math.floor(Math.random()*Math.min(6,sorted.length))];
  if(boardAiLevel==="strong") return sorted[Math.floor(Math.random()*Math.min(2,sorted.length))];
  return sorted[0];
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
      if(boardAiLevel==="strong"||boardAiLevel==="pro"){
        const next=st.board.map(row=>row.slice());
        next[r][c]=null; next[rr][cc]=p;
        let movedDanger=0,opponentBestCapture=0,blackBestThreat=0;
        for(let wr=0;wr<8;wr++) for(let wc=0;wc<8;wc++){
          const wp=next[wr][wc];
          if(!wp||wp[0]!=="w") continue;
          for(const [trr,tcc] of chessMoves(next,wr,wc)){
            const target=next[trr][tcc];
            if(trr===rr&&tcc===cc)movedDanger=Math.max(movedDanger,values[p[1]]||0);
            if(target&&target[0]==="b")opponentBestCapture=Math.max(opponentBestCapture,values[target[1]]||0);
          }
        }
        for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
          const bp=next[br][bc];
          if(!bp||bp[0]!=="b")continue;
          for(const [trr,tcc] of chessMoves(next,br,bc)){
            const target=next[trr][tcc];
            if(target&&target[0]==="w")blackBestThreat=Math.max(blackBestThreat,values[target[1]]||0);
          }
        }
        score-=movedDanger*(boardAiLevel==="pro"?14:9);
        score-=opponentBestCapture*(boardAiLevel==="pro"?7:3);
        score+=blackBestThreat*(boardAiLevel==="pro"?6:3);
      }
      score += boardAiLevel==="pro" ? 0 : Math.random()*3;
      candidates.push({r,c,rr,cc,score});
    }
  }

  if(!candidates.length){
    st.winner="w";
    room.state=st;
    renderRoom();
    return;
  }

  const pick=aiPickByLevel(candidates);
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
  if(boardChampion?.display_name){const mark=document.createElement("div");mark.className="board-champion-watermark morris-champion-watermark";mark.textContent="👑 "+boardChampion.display_name;board.appendChild(mark);}
  wrap.innerHTML="";wrap.appendChild(board);
}

async function morrisClick(pos){
  if(!room.player2_device||room.state.winner)return;
  genericGameTone(390,.045);
  const color=myColor(),other=color==="w"?"b":"w",st=structuredClone(room.state);if(st.turn!==color)return;
  if(st.mustRemove){
    if(st.board[pos]!==other)return;if(formsMill(st.board,pos,other)&&!allInMill(st.board,other))return;
    st.board[pos]=null;st.mustRemove=false;st.turn=other;if(st.placed[other]>=9&&countPieces(st.board,other)<3)st.winner=color;
    selected=null;await saveState(st,"active");if(st.winner&&!room.local)await recordBoardWin(st.winner,"win");if(!room.local)renderRoom();return;
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
  if(!empty.length) return undefined;
  if(boardAiLevel==="weak") return empty[Math.floor(Math.random()*empty.length)];

  const ranked=empty.map(pos=>{
    let score=0;
    const own=st.board.slice(); own[pos]=color;
    const opp=st.board.slice(); opp[pos]=other;
    if(formsMill(own,pos,color)) score+=100;
    if(formsMill(opp,pos,other)) score+=boardAiLevel==="medium"?55:85;
    score+=M_LINES.filter(line=>line.includes(pos)).length*2;
    if(boardAiLevel!=="pro") score+=Math.random()*5;
    return {pos,score};
  }).sort((a,b)=>b.score-a.score);

  if(boardAiLevel==="medium") return ranked[Math.floor(Math.random()*Math.min(4,ranked.length))].pos;
  if(boardAiLevel==="strong") return ranked[Math.floor(Math.random()*Math.min(2,ranked.length))].pos;
  return ranked[0].pos;
}

function computerMorrisMove(){
  if(!room?.local || room.game_type!=="morris" || room.state.turn!=="b" || room.state.winner) return;

  const st=structuredClone(room.state);
  const color="b", other="w";

  if(st.mustRemove){
    let targets=st.board.map((v,i)=>v===other?i:-1).filter(i=>i>=0);
    const nonMill=targets.filter(i=>!formsMill(st.board,i,other));
    if(nonMill.length) targets=nonMill;
    const ranked=targets.map(pos=>{
      let score=M_LINES.filter(line=>line.includes(pos)).length*4;
      for(const line of M_LINES.filter(line=>line.includes(pos))){
        const own=line.filter(i=>st.board[i]===other).length;
        const empty=line.filter(i=>st.board[i]===null).length;
        if(own===2&&empty===1)score+=45;
        if(own===1&&empty===2)score+=10;
      }
      return {pos,score};
    }).sort((a,b)=>b.score-a.score);
    const pos=boardAiLevel==="weak"
      ? targets[Math.floor(Math.random()*targets.length)]
      : boardAiLevel==="medium"
        ? ranked[Math.floor(Math.random()*Math.min(3,ranked.length))]?.pos
        : boardAiLevel==="strong"
          ? ranked[Math.floor(Math.random()*Math.min(2,ranked.length))]?.pos
          : ranked[0]?.pos;
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
      let score=formsMill(b,to,color)?120:0;
      const blockProbe=b.slice();blockProbe[to]=other;
      if(formsMill(blockProbe,to,other))score+=boardAiLevel==="medium"?35:70;
      score+=M_LINES.filter(line=>line.includes(to)).length*3;
      if(boardAiLevel==="pro"){
        for(const line of M_LINES.filter(line=>line.includes(to))){
          const own=line.filter(i=>b[i]===color).length;
          const empty=line.filter(i=>b[i]===null).length;
          if(own===2&&empty===1)score+=24;
        }
      }
      if(boardAiLevel!=="pro")score+=Math.random()*5;
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
  const pick=boardAiLevel==="weak"
    ? moves[Math.floor(Math.random()*moves.length)]
    : boardAiLevel==="medium"
      ? moves[Math.floor(Math.random()*Math.min(5,moves.length))]
      : boardAiLevel==="strong"
        ? moves[Math.floor(Math.random()*Math.min(2,moves.length))]
        : moves[0];
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
    if(tetrisOnline) setTimeout(()=>reportTetrisOnline(true),0);
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
  if(!tetris || !tetris.gameOver || tetrisPractice) return;

  const name=(localStorage.getItem("pajaziti-global-user-name")||"").trim().slice(0,24);
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

function startTetrisGame(options={}){
  const online=options?.online===true;
  tetrisOnline=online;
  tetrisPractice=!online || options?.practice===true;
  enterTetrisFullscreen();
  const playerName=(document.getElementById("tetrisPlayerName")?.value || localStorage.getItem(TETRIS_NAME_KEY) || "").trim().slice(0,24);
  if(!playerName){ exitTetrisFullscreen(); renderLobby(tr("needName")); return; }
  localStorage.setItem(TETRIS_NAME_KEY,playerName);
  if(channel){supabase.removeChannel(channel);channel=null;}
  if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}
  stopTetris();
  room=null;
  selected=null;
  if(!online){arcadeStarted=false;}

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

        ${tetrisPractice?`<div class="practice-banner">${gx("practiceNote")}</div>`:""}
        <div class="tetris-stats">
          <div><span>${gx("score")}</span><strong id="tetrisScore">0</strong></div>
          <div><span>${gx("lines")}</span><strong id="tetrisLines">0</strong></div>
          <div><span>${gx("level")}</span><strong id="tetrisLevel">1</strong></div>
          <div><span>${gx("best")}</span><strong id="tetrisHigh">${localStorage.getItem(TETRIS_HIGH_KEY)||0}</strong></div>
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
          <button id="tetrisPause" class="secondary" type="button">${gx("pause")}</button>
          <button id="tetrisSound" class="secondary" type="button">${tetrisSoundEnabled?"🔊 Zëri ON":"🔇 Zëri OFF"}</button>
          <button id="tetrisNew" class="primary" type="button">🔄 ${tr("newGame")}</button>
        </div>

        ${tetrisOnline?'<section id="tetrisOnlineStatus" class="card tetris-online-status"></section>':""}
        <section id="tetrisLeaderboard" class="tetris-leaderboard">
          <div class="muted">🏆 Po ngarkohet renditja…</div>
        </section>
      </section>
    </div>`;

  document.getElementById("tetrisBack").onclick=async()=>{stopTetris();tetris=null;if(tetrisOnline)await leaveArcade();await exitTetrisFullscreen();renderLobby();};
  document.getElementById("tetrisPause").onclick=tetrisPause;
  const tetrisSoundBtn=document.getElementById("tetrisSound");
  if(tetrisSoundBtn) tetrisSoundBtn.onclick=()=>{ setTetrisSound(!tetrisSoundEnabled); tetrisSoundBtn.textContent=tetrisSoundEnabled?"🔊 Zëri ON":"🔇 Zëri OFF"; };
  document.getElementById("tetrisNew").onclick=()=>tetrisOnline?startTetrisGame({online:true}):startTetrisGame();
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
  if(tetrisOnline) updateTetrisOnlineStatus();
  playTetrisSound("start");
  tetrisRestartTimer();
}


async function activate(){
  startTetrisScoreRealtime();
  if(tabLabel)tabLabel.textContent=tr("games");
  await Promise.all([loadGameOrder(),loadGameBlocks(),loadGameThemeDefaults(),loadGameControlLayouts()]);
  if(room)renderRoom();else renderLobby();
}

async function reloadSettings(){
  await Promise.all([loadGameOrder(),loadGameBlocks(),loadGameThemeDefaults(),loadGameControlLayouts()]);
  if(!room) renderLobby();
}

document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement && !document.getElementById("tetrisBoard")){
    document.body.classList.remove("tetris-fullscreen-active");
  }
});

window.PajazitiGames={
  activate,
  deactivate:()=>{
    stopGameAudioForExit();
    stopTetris();
    clearTimerPhaseTimeout();
    if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}
  },
  reloadSettings,
  reloadLanguage:()=>{if(!room)renderLobby();else renderRoom();scheduleAutoTranslateGameUI();},
  refreshUserName:()=>{boardProfile=null;warProfile=null;if(!room)renderLobby();else renderRoom();}
};
if(tabLabel)tabLabel.textContent=tr("games");
