import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

const root = document.getElementById("gamesRoot");
const tabLabel = document.getElementById("gamesTabLabel");
const DEVICE_KEY = "pajaziti-presence-device";
const LANG_KEY = "pajaziti-language";

let deviceId = localStorage.getItem(DEVICE_KEY);
if (!deviceId) {
  deviceId = globalThis.crypto?.randomUUID?.() || ("device_" + Date.now() + Math.random().toString(36).slice(2));
  localStorage.setItem(DEVICE_KEY, deviceId);
}

const TXT = {
  sq:{games:"Lojëra",online:"Luaj online",chess:"Shah",morris:"Mühle",choose:"Zgjidh lojën",create:"Krijo dhomë",code:"Kodi i dhomës",join:"Hyr në dhomë",waiting:"Duke pritur lojtarin e dytë…",yourTurn:"Radha jote",opponentTurn:"Radha e kundërshtarit",white:"Bardhë",black:"Zi",leave:"Dil nga loja",room:"Dhoma",copy:"Kopjo kodin",copied:"Kodi u kopjua",invalid:"Kodi nuk u gjet.",full:"Dhoma është e mbushur.",gameOver:"Loja përfundoi",winner:"Fituesi",helpChess:"Prek figurën tënde, pastaj katrorin ku dëshiron ta lëvizësh.",helpMorris:"Në fillim vendos 9 gurët. Kur krijon treshe (mühle), hiq një gur të kundërshtarit.",error:"Gabim"},
  de:{games:"Spiele",online:"Online spielen",chess:"Schach",morris:"Mühle",choose:"Spiel wählen",create:"Raum erstellen",code:"Raumcode",join:"Raum beitreten",waiting:"Warte auf den zweiten Spieler…",yourTurn:"Du bist am Zug",opponentTurn:"Gegner ist am Zug",white:"Weiß",black:"Schwarz",leave:"Spiel verlassen",room:"Raum",copy:"Code kopieren",copied:"Code kopiert",invalid:"Code nicht gefunden.",full:"Raum ist voll.",gameOver:"Spiel beendet",winner:"Gewinner",helpChess:"Tippe deine Figur an und danach das Zielfeld.",helpMorris:"Setze zuerst deine 9 Steine. Bei einer Mühle darfst du einen gegnerischen Stein entfernen.",error:"Fehler"},
  tr:{games:"Oyunlar",online:"Çevrimiçi oyna",chess:"Satranç",morris:"Dokuz Taş",choose:"Oyun seç",create:"Oda oluştur",code:"Oda kodu",join:"Odaya katıl",waiting:"İkinci oyuncu bekleniyor…",yourTurn:"Sıra sende",opponentTurn:"Sıra rakipte",white:"Beyaz",black:"Siyah",leave:"Oyundan çık",room:"Oda",copy:"Kodu kopyala",copied:"Kod kopyalandı",invalid:"Kod bulunamadı.",full:"Oda dolu.",gameOver:"Oyun bitti",winner:"Kazanan",helpChess:"Kendi taşına, sonra gitmek istediğin kareye dokun.",helpMorris:"Önce 9 taşını yerleştir. Üçlü yaptığında rakibin bir taşını kaldırabilirsin.",error:"Hata"}
};

function lang(){ const l=localStorage.getItem(LANG_KEY)||"sq"; return TXT[l]?l:"sq"; }
function tr(k){ return TXT[lang()][k] || TXT.sq[k] || k; }

let selectedType="chess";
let room=null;
let channel=null;
let selected=null;

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
  room=null; selected=null;
  root.innerHTML=`
    <div class="games-shell">
      <section class="card games-lobby">
        <h2>🎮 ${tr("online")}</h2>
        <p class="muted">${tr("choose")}</p>
        <div class="games-choice">
          <button class="game-choice ${selectedType==="chess"?"active":""}" data-game="chess">♟️ ${tr("chess")}</button>
          <button class="game-choice ${selectedType==="morris"?"active":""}" data-game="morris">⭕ ${tr("morris")}</button>
        </div>
        <button id="createGame" class="primary" type="button">${tr("create")}</button>
        <div class="game-join-row">
          <input id="joinCode" type="text" maxlength="8" placeholder="${tr("code")}">
          <button id="joinGame" class="secondary" type="button">${tr("join")}</button>
        </div>
        <div id="gameMessage" class="message">${msg}</div>
      </section>
    </div>`;
  root.querySelectorAll("[data-game]").forEach(btn=>btn.onclick=()=>{selectedType=btn.dataset.game;renderLobby();});
  document.getElementById("createGame").onclick=createRoom;
  document.getElementById("joinGame").onclick=joinRoom;
}

async function createRoom(){
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
  if(data.player1_device!==deviceId&&data.player2_device&&data.player2_device!==deviceId){document.getElementById("gameMessage").textContent=tr("full");return;}
  if(!data.player2_device&&data.player1_device!==deviceId){
    const {data:updated,error:uerr}=await supabase.from("game_rooms").update({player2_device:deviceId,status:"active",updated_at:new Date().toISOString()}).eq("id",data.id).select().single();
    if(uerr)return; openRoom(updated); return;
  }
  openRoom(data);
}

function openRoom(r){ room=r; selected=null; subscribeRoom(); renderRoom(); }

function subscribeRoom(){
  if(channel)supabase.removeChannel(channel);
  channel=supabase.channel("game-"+room.id)
    .on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_rooms",filter:"id=eq."+room.id},payload=>{room=payload.new;selected=null;renderRoom();})
    .subscribe();
}

async function saveState(state,status=room.status){
  room.state=state; room.status=status;
  const {data,error}=await supabase.from("game_rooms").update({state,status,updated_at:new Date().toISOString()}).eq("id",room.id).select().single();
  if(!error)room=data;
}

function statusText(){
  const s=room.state||{};
  if(s.winner){ const name=s.winner==="w"?tr("white"):tr("black"); return `${tr("gameOver")} · ${tr("winner")}: ${name}`; }
  return s.turn===myColor()?tr("yourTurn"):tr("opponentTurn");
}

function renderRoom(){
  if(!room)return renderLobby();
  const waiting=!room.player2_device;
  root.innerHTML=`
    <div class="games-shell">
      <section class="card">
        <div class="game-room-head">
          <div><div class="muted small">${tr("room")}</div><div class="game-room-code">${room.code}</div></div>
          <button id="copyRoom" class="secondary" type="button">${tr("copy")}</button>
        </div>
        <div class="game-status">${waiting?tr("waiting"):statusText()}</div>
        <div class="game-meta-grid">
          <div class="game-meta-box">⚪ ${tr("white")}: ${room.player1_device===deviceId?"✓":""}</div>
          <div class="game-meta-box">⚫ ${tr("black")}: ${room.player2_device===deviceId?"✓":room.player2_device?"●":"…"}</div>
        </div>
      </section>
      <section class="card">
        <div class="game-board-wrap" id="gameBoard"></div>
        <div class="game-help">${room.game_type==="chess"?tr("helpChess"):tr("helpMorris")}</div>
        <div class="game-actions"><button id="leaveGame" class="secondary" type="button">${tr("leave")}</button></div>
      </section>
    </div>`;
  document.getElementById("copyRoom").onclick=async()=>{await navigator.clipboard.writeText(room.code);document.getElementById("copyRoom").textContent=tr("copied");};
  document.getElementById("leaveGame").onclick=()=>{if(channel)supabase.removeChannel(channel);channel=null;renderLobby();};
  if(room.game_type==="chess")renderChess(myColor());else renderMorris(myColor());
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
  selected=null;await saveState(ns,"active");renderRoom();
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
    selected=null;await saveState(st,"active");renderRoom();return;
  }
  if(st.placed[color]<9){
    if(st.board[pos])return;st.board[pos]=color;st.placed[color]++;if(formsMill(st.board,pos,color))st.mustRemove=true;else st.turn=other;
    await saveState(st,"active");renderRoom();return;
  }
  if(selected===null){if(st.board[pos]===color){selected=pos;renderRoom();}return;}
  if(st.board[pos]===color){selected=pos;renderRoom();return;}
  if(st.board[pos]!==null){selected=null;renderRoom();return;}
  const flying=countPieces(st.board,color)===3;if(!flying&&!adjacent(selected,pos))return;
  st.board[selected]=null;st.board[pos]=color;if(formsMill(st.board,pos,color))st.mustRemove=true;else st.turn=other;
  selected=null;await saveState(st,"active");renderRoom();
}

function activate(){
  if(tabLabel)tabLabel.textContent=tr("games");
  if(room)renderRoom();else renderLobby();
}

window.PajazitiGames={activate};
if(tabLabel)tabLabel.textContent=tr("games");
