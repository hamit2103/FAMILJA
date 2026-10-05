const USER_NAME_KEY="pajaziti-global-user-name";
const SOUND_KEY="diamond-game-sound-master";

function safeName(){return (localStorage.getItem(USER_NAME_KEY)||"User").trim()||"User";}
function money(n){return Math.max(0,Math.floor(Number(n)||0)).toLocaleString();}
function loadState(key,fresh){
  try{return {...fresh,...(JSON.parse(localStorage.getItem(key)||"{}")||{})};}
  catch(_){return {...fresh};}
}
function saveState(key,state){try{localStorage.setItem(key,JSON.stringify(state));}catch(_){}}
let audioCtx=null;
function beep(freq=440,d=.08,v=.08,type="sine",delay=0){
  if(localStorage.getItem(SOUND_KEY)==="off")return;
  try{
    const A=window.AudioContext||window.webkitAudioContext;
    if(!A)return;
    if(!audioCtx)audioCtx=new A();
    if(audioCtx.state==="suspended")audioCtx.resume().catch(()=>{});
    const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=audioCtx.currentTime+delay;
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+d+.03);
  }catch(_){}
}
function addStyle(){
  if(document.getElementById("diamond-casino-css"))return;
  const s=document.createElement("style");s.id="diamond-casino-css";s.textContent=`
  .dc{min-height:100%;box-sizing:border-box;padding:10px 8px 90px;color:#fff;background:radial-gradient(circle at 50% 0,#351070,#070b20 45%,#02050d);font-family:system-ui}
  .dc-top{display:flex;align-items:center;gap:8px}.dc-back{width:40px;height:40px;border-radius:12px;border:1px solid #6ea8ff;background:#071735;color:#fff;font-size:24px;font-weight:900}
  .dc-title{flex:1;font-size:18px;font-weight:1000}.dc-user{font-size:11px;font-weight:900;opacity:.9}.dc-bal{padding:8px 10px;border:1px solid #ffe167;border-radius:13px;background:#16132b;font-weight:1000}
  .dc-card{margin-top:10px;padding:10px;border:1px solid #ffffff24;border-radius:18px;background:#081127cc;box-shadow:0 12px 30px #0006}
  .dc-btn{min-height:44px;border:1px solid #ffffff30;border-radius:13px;background:linear-gradient(135deg,#6d28d9,#2563eb);color:#fff;font-weight:1000;padding:8px 12px}
  .dc-btn.alt{background:#121a34}.dc-btn.gold{background:linear-gradient(135deg,#9a6700,#f2b705);color:#1c1300}.dc-btn.red{background:linear-gradient(135deg,#8b1538,#e11d48)}
  .dc-row{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.dc-msg{min-height:38px;margin-top:8px;padding:8px;border-radius:12px;background:#020817;border:1px solid #ffffff1f;font-weight:800}
  .dc-select{padding:9px;border-radius:11px;background:#101a36;color:#fff;border:1px solid #ffffff2d;font-weight:900}
  .genie-lamp{text-align:center;font-size:64px;filter:drop-shadow(0 0 22px #8de4ff);animation:lampFloat 1.5s ease-in-out infinite alternate}@keyframes lampFloat{to{transform:translateY(-7px) rotate(3deg)}}
  .genie-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;padding:6px;border:3px solid #d5a7ff;border-radius:18px;background:#020817}
  .genie-cell{aspect-ratio:1;display:grid;place-items:center;font-size:clamp(28px,10vw,54px);background:linear-gradient(#132253,#05091b);border:1px solid #31406d;border-radius:8px}
  .genie-spinning .genie-cell{animation:genieFall .16s linear infinite}@keyframes genieFall{50%{transform:translateY(15%);filter:blur(1px);opacity:.65}}
  .genie-overlay{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:rgba(0,0,0,.82);padding:20px}.genie-overlay.hidden{display:none}
  .genie-pop{width:min(92vw,430px);padding:20px;border:3px solid #80dfff;border-radius:26px;background:radial-gradient(circle at 50% 0,#6635a8,#081331 65%);text-align:center;box-shadow:0 0 55px #57d5ff88}
  .genie-big{font-size:100px;display:block;animation:geniePop .5s ease-in-out infinite alternate}@keyframes geniePop{to{transform:scale(1.08) translateY(-5px)}}
  .wish-grid,.chest-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.chest-grid{grid-template-columns:repeat(5,1fr)}.wish-grid button,.chest-grid button{font-size:34px;min-height:70px}
  .poker-table{padding:14px;border:4px solid #5230a8;border-radius:48% 48% 24px 24px;background:radial-gradient(circle,#12643a,#07341f 65%,#042214);box-shadow:inset 0 0 35px #0009,0 0 28px #8b5cf655}
  .poker-zone{text-align:center;margin:8px 0}.poker-name{font-size:12px;font-weight:1000}.cards{display:flex;justify-content:center;gap:6px;min-height:74px;flex-wrap:wrap}.playing-card{width:48px;height:68px;border-radius:8px;background:#fff;color:#111;display:flex;flex-direction:column;justify-content:space-between;padding:5px;box-sizing:border-box;font-weight:1000;box-shadow:0 3px 10px #0008}.playing-card.red{color:#c51635}.playing-card.back{background:repeating-linear-gradient(45deg,#26186b,#26186b 6px,#5737c4 6px,#5737c4 12px);color:transparent;border:2px solid #fff}.playing-card .suit{font-size:22px;text-align:center}
  .poker-pot{text-align:center;font-size:18px;font-weight:1000;color:#ffe16b;margin:7px}.poker-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}
  .roulette-wheel{width:190px;height:190px;margin:8px auto;border-radius:50%;border:10px double #e6bb4f;background:conic-gradient(#d11 0 10deg,#111 10deg 20deg,#d11 20deg 30deg,#111 30deg 40deg,#147b36 40deg 50deg,#111 50deg 60deg,#d11 60deg 70deg,#111 70deg 80deg,#d11 80deg 90deg,#111 90deg 100deg,#d11 100deg 110deg,#111 110deg 120deg,#d11 120deg 130deg,#111 130deg 140deg,#d11 140deg 150deg,#111 150deg 160deg,#d11 160deg 170deg,#111 170deg 180deg,#d11 180deg 190deg,#111 190deg 200deg,#d11 200deg 210deg,#111 210deg 220deg,#d11 220deg 230deg,#111 230deg 240deg,#d11 240deg 250deg,#111 250deg 260deg,#d11 260deg 270deg,#111 270deg 280deg,#d11 280deg 290deg,#111 290deg 300deg,#d11 300deg 310deg,#111 310deg 320deg,#d11 320deg 330deg,#111 330deg 340deg,#d11 340deg 350deg,#147b36 350deg 360deg);display:grid;place-items:center;transition:transform 2s cubic-bezier(.12,.65,.18,1)}
  .roulette-wheel.spin{transform:rotate(1440deg)}.roulette-center{width:75px;height:75px;border-radius:50%;background:#e9c665;color:#201300;display:grid;place-items:center;font-size:28px;font-weight:1000;border:5px solid #fff3b0}
  .roulette-bets{display:grid;grid-template-columns:repeat(6,1fr);gap:3px}.roulette-num{min-height:34px;border:1px solid #ffffff33;border-radius:7px;background:#151a28;color:#fff;font-weight:900}.roulette-num.red{background:#a91d36}.roulette-num.black{background:#111}.roulette-num.green{background:#087a38}.roulette-num.active{outline:3px solid #ffe15c;transform:scale(1.04)}
  .roulette-outsides{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:7px}
  `;document.head.appendChild(s);
}
function topBar(title,balance,backId){return `<div class="dc-top"><button id="${backId}" class="dc-back">‹</button><div class="dc-title">${title}</div><div class="dc-user">👤 ${safeName()}</div><div class="dc-bal">💎 <span data-casino-bal>${money(balance)}</span></div></div>`;}

/* ---------------- GENIE ---------------- */
const GENIE_KEY="diamond-genie-v1";
const GENIE_BETS=[1,5,10,20,50,100,500,1000,5000,10000];
const GS=[
  {id:"diamond",ic:"💎",w:9,p:10},{id:"lamp",ic:"🪔",w:9,p:7},{id:"genie",ic:"🧞",w:5,p:12},
  {id:"palace",ic:"🕌",w:10,p:6},{id:"moon",ic:"🌙",w:12,p:5},{id:"coin",ic:"🪙",w:16,p:4},{id:"snake",ic:"🐍",w:12,p:3},{id:"star",ic:"⭐",w:14,p:4}
];
function geniePick(magic=0){
  const boosted=GS.map(x=>({...x,w:x.w+((magic>0&&(x.id==="lamp"||x.id==="genie"))?7:0)}));
  const total=boosted.reduce((a,x)=>a+x.w,0);let r=Math.random()*total;
  for(const x of boosted){r-=x.w;if(r<=0)return x;}return boosted[boosted.length-1];
}
function genieGrid(magic=0){return Array.from({length:3},()=>Array.from({length:5},()=>geniePick(magic)));}
function genieLineWin(grid,bet){
  let win=0,notes=[];
  for(const row of grid){
    let anchor=row.find(x=>x.id!=="genie")?.id||"genie",count=0;
    for(const x of row){if(x.id===anchor||x.id==="genie")count++;else break;}
    if(count>=3){const sym=GS.find(x=>x.id===anchor)||GS[2],p=sym.p*(count-2)*bet;win+=p;notes.push(sym.ic+" x"+count+" +"+p);}
  }
  return {win,notes};
}
export function startDiamondGenie({root,onBack}={}){
  if(!root)return;addStyle();
  let st=loadState(GENIE_KEY,{bal:1500,bet:5,magic:0,free:0,best:0});
  if(!GENIE_BETS.includes(st.bet))st.bet=5;
  let grid=genieGrid(st.magic),busy=false,spinTimer=null;
  root.innerHTML=`<section class="dc">
    ${topBar("🧞 DIAMOND GENIE – 3 DËSHIRAT",st.bal,"dgBack")}
    <div class="dc-card"><div class="genie-lamp">🪔</div><div style="text-align:center;font-weight:1000">3 LLAMBA = 3 DËSHIRA · 3 XHINË = DHOMA E THESARIT</div>
      <div id="genieMagic" style="text-align:center;margin:5px">🌙 Natë magjike: ${st.magic||0}</div></div>
    <div class="dc-card"><div id="genieGrid" class="genie-grid"></div></div>
    <div id="genieMsg" class="dc-msg">Rrotullo dhe kërko 3 🪔 ose 3 🧞.</div>
    <div class="dc-card dc-row"><label>BAST <select id="genieBet" class="dc-select">${GENIE_BETS.map(b=>`<option value="${b}" ${b===st.bet?"selected":""}>${money(b)} 💎</option>`).join("")}</select></label>
      <button id="genieSpin" class="dc-btn gold" style="flex:1">↻ RROTULLO</button></div>
    <div id="genieOverlay" class="genie-overlay hidden"><div class="genie-pop"><span class="genie-big">🧞</span><h2 id="genieOverlayTitle">3 DËSHIRAT</h2><div id="genieOverlayBody"></div><button id="genieOverlayClose" class="dc-btn alt" style="margin-top:12px">Mbyll</button></div></div>
  </section>`;
  const q=s=>root.querySelector(s),gridEl=q("#genieGrid"),msg=q("#genieMsg"),balEls=root.querySelectorAll("[data-casino-bal]"),overlay=q("#genieOverlay"),body=q("#genieOverlayBody"),title=q("#genieOverlayTitle");
  function save(){saveState(GENIE_KEY,st);}
  function render(){
    gridEl.innerHTML=grid.flat().map(x=>`<div class="genie-cell">${x.ic}</div>`).join("");
    balEls.forEach(x=>x.textContent=money(st.bal));q("#genieMagic").textContent="🌙 Natë magjike: "+(st.magic||0);q("#genieBet").value=String(st.bet);save();
  }
  function rewardWish(){
    const choices=[
      {t:"💎 ×2 BAST",v:()=>2*st.bet},{t:"💎 ×5 BAST",v:()=>5*st.bet},{t:"💎 ×10 BAST",v:()=>10*st.bet},
      {t:"🎁 5 rrotullime falas",v:()=>{st.free=(st.free||0)+5;return 0;}},{t:"🌙 5 net magjike",v:()=>{st.magic=Math.max(st.magic||0,5);return 0;}},
      {t:"👑 THESAR ×25",v:()=>25*st.bet}
    ];
    return choices[Math.floor(Math.random()*choices.length)];
  }
  function showWishes(){
    overlay.classList.remove("hidden");title.textContent="🧞 3 DËSHIRAT";let left=3;
    body.innerHTML=`<p>Zgjidh një dëshirë. Ke <b id="wishLeft">3</b> dëshira.</p><div class="wish-grid">${[1,2,3].map(i=>`<button class="dc-btn" data-wish="${i}">✨</button>`).join("")}</div><div id="wishResult" class="dc-msg"></div>`;
    body.querySelectorAll("[data-wish]").forEach(btn=>btn.onclick=()=>{
      if(btn.disabled||left<=0)return;const r=rewardWish(),gain=r.v();if(gain>0)st.bal+=gain;
      btn.textContent="🎁";btn.disabled=true;left--;body.querySelector("#wishLeft").textContent=left;body.querySelector("#wishResult").textContent=r.t+(gain?" = +"+money(gain)+" 💎":"");
      beep(650,.12,.12,"sine",0);beep(900,.18,.14,"sine",.12);render();
      if(left<=0)setTimeout(()=>overlay.classList.add("hidden"),800);
    });
  }
  function showTreasure(){
    overlay.classList.remove("hidden");title.textContent="👑 DHOMA E THESARIT";
    const mult=[5,10,25,50,100].sort(()=>Math.random()-.5);
    body.innerHTML=`<p>Zgjidh vetëm një arkë.</p><div class="chest-grid">${mult.map((m,i)=>`<button class="dc-btn gold" data-chest="${i}" data-m="${m}">🧰</button>`).join("")}</div><div id="chestResult" class="dc-msg"></div>`;
    body.querySelectorAll("[data-chest]").forEach(btn=>btn.onclick=()=>{
      if(body.dataset.done)return;body.dataset.done="1";const m=Number(btn.dataset.m),gain=m*st.bet;st.bal+=gain;btn.textContent="💎";
      body.querySelector("#chestResult").textContent="👑 ×"+m+" = +"+money(gain)+" 💎";beep(523,.1,.14,"sine");beep(784,.14,.16,"sine",.12);beep(1047,.2,.18,"sine",.28);render();
      setTimeout(()=>overlay.classList.add("hidden"),1100);
    });
  }
  function finish(){
    busy=false;gridEl.classList.remove("genie-spinning");
    const lamps=grid.flat().filter(x=>x.id==="lamp").length,genies=grid.flat().filter(x=>x.id==="genie").length,moons=grid.flat().filter(x=>x.id==="moon").length,snakes=grid.flat().filter(x=>x.id==="snake").length;
    const out=genieLineWin(grid,st.bet);st.bal+=out.win;st.best=Math.max(st.best||0,out.win);
    let notes=[...out.notes];
    if(moons>=3){st.magic=5;notes.push("🌙 NATË MAGJIKE 5 rrotullime");}
    if(snakes>=3&&st.bal>0){const loss=Math.min(st.bal,2*st.bet);st.bal-=loss;notes.push("🐍 −"+loss);}
    if(st.magic>0)st.magic--;
    if(out.win>0){beep(520,.1,.12);beep(760,.16,.14,"sine",.12);}
    msg.textContent=notes.length?notes.join(" · "):"Pa fitim këtë herë.";
    render();
    if(lamps>=3)setTimeout(showWishes,350);
    else if(genies>=3)setTimeout(showTreasure,350);
  }
  q("#genieSpin").onclick=()=>{
    if(busy)return;st.bet=Number(q("#genieBet").value)||5;if(st.free>0)st.free--;else if(st.bal<st.bet){msg.textContent="Nuk ke diamante të mjaftueshme.";return;}else st.bal-=st.bet;
    busy=true;gridEl.classList.add("genie-spinning");render();msg.textContent=st.free>0?"🎁 Rrotullim falas…":"Po rrotullohet…";let n=0;
    spinTimer=setInterval(()=>{grid=genieGrid(st.magic);render();if(++n>=10){clearInterval(spinTimer);grid=genieGrid(st.magic);render();finish();}},70);beep(230,.05,.08,"square");
  };
  q("#genieBet").onchange=()=>{st.bet=Number(q("#genieBet").value)||5;render();};
  q("#genieOverlayClose").onclick=()=>overlay.classList.add("hidden");
  q("#dgBack").onclick=()=>{if(spinTimer)clearInterval(spinTimer);save();onBack?.();};
  render();
}

/* ---------------- TEXAS POKER ---------------- */
const POKER_KEY="diamond-texas-poker-v1";
const POKER_BETS=[1,5,10,20,50,100,200,500,1000,5000];
const SUITS=["♠","♥","♦","♣"],RANKS=[2,3,4,5,6,7,8,9,10,11,12,13,14];
function deck(){const d=[];for(const s of SUITS)for(const r of RANKS)d.push({s,r});for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
function rankText(r){return r===14?"A":r===13?"K":r===12?"Q":r===11?"J":String(r);}
function cardHtml(c,back=false){if(back)return '<div class="playing-card back">?</div>';const red=c.s==="♥"||c.s==="♦";return `<div class="playing-card ${red?"red":""}"><span>${rankText(c.r)}</span><span class="suit">${c.s}</span><span style="text-align:right">${rankText(c.r)}</span></div>`;}
function comb(arr,k,start=0,p=[],out=[]){if(p.length===k){out.push([...p]);return out;}for(let i=start;i<arr.length;i++){p.push(arr[i]);comb(arr,k,i+1,p,out);p.pop();}return out;}
function fiveScore(cards){
  const rs=cards.map(c=>c.r).sort((a,b)=>b-a),counts={};rs.forEach(r=>counts[r]=(counts[r]||0)+1);
  const unique=[...new Set(rs)].sort((a,b)=>b-a);if(unique[0]===14&&!unique.includes(1))unique.push(1);
  let straight=0;for(let i=0;i<=unique.length-5;i++){if(unique[i]-unique[i+4]===4){straight=unique[i];break;}}
  const flush=cards.every(c=>c.s===cards[0].s);
  const groups=Object.entries(counts).map(([r,n])=>({r:+r,n})).sort((a,b)=>b.n-a.n||b.r-a.r);
  if(flush&&straight)return [8,straight];
  if(groups[0].n===4)return [7,groups[0].r,groups[1].r];
  if(groups[0].n===3&&groups[1]?.n===2)return [6,groups[0].r,groups[1].r];
  if(flush)return [5,...rs];
  if(straight)return [4,straight];
  if(groups[0].n===3)return [3,groups[0].r,...groups.filter(g=>g.n===1).map(g=>g.r).sort((a,b)=>b-a)];
  const pairs=groups.filter(g=>g.n===2).sort((a,b)=>b.r-a.r);
  if(pairs.length>=2){const kicker=groups.filter(g=>g.n===1).map(g=>g.r).sort((a,b)=>b-a)[0]||0;return [2,pairs[0].r,pairs[1].r,kicker];}
  if(pairs.length===1)return [1,pairs[0].r,...groups.filter(g=>g.n===1).map(g=>g.r).sort((a,b)=>b-a)];
  return [0,...rs];
}
function cmpScore(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const x=a[i]||0,y=b[i]||0;if(x!==y)return x>y?1:-1;}return 0;}
function bestScore(cards){let best=null;for(const c of comb(cards,5)){const s=fiveScore(c);if(!best||cmpScore(s,best)>0)best=s;}return best;}
const HAND_NAMES=["Kartë e lartë","Një palë","Dy palë","Treshe","Straight","Flush","Full House","Katër të njëjta","Straight Flush"];
export function startDiamondTexasPoker({root,onBack}={}){
  if(!root)return;addStyle();
  let st=loadState(POKER_KEY,{bal:2500,bet:10,best:0}),hand=null;
  if(!POKER_BETS.includes(st.bet))st.bet=10;
  root.innerHTML=`<section class="dc">
    ${topBar("♠️ DIAMOND TEXAS POKER",st.bal,"pokerBack")}
    <div class="dc-card dc-row"><label>BAST <select id="pokerBet" class="dc-select">${POKER_BETS.map(b=>`<option value="${b}" ${b===st.bet?"selected":""}>${money(b)} 💎</option>`).join("")}</select></label><button id="pokerNew" class="dc-btn gold">🃏 DORË E RE</button></div>
    <div class="dc-card poker-table">
      <div class="poker-zone"><div class="poker-name">🤖 KOMPJUTERI</div><div id="dealerCards" class="cards"></div></div>
      <div class="poker-pot">POT: 💎 <span id="pokerPot">0</span></div>
      <div class="poker-zone"><div id="community" class="cards"></div></div>
      <div class="poker-zone"><div class="poker-name">👤 ${safeName()}</div><div id="playerCards" class="cards"></div></div>
    </div>
    <div id="pokerMsg" class="dc-msg">Shtyp “DORË E RE”.</div>
    <div class="poker-actions"><button id="pokerFold" class="dc-btn red">FOLD</button><button id="pokerCheck" class="dc-btn alt">CHECK / CALL</button><button id="pokerRaise" class="dc-btn">RAISE</button><button id="pokerAllin" class="dc-btn gold" style="grid-column:1/-1">ALL-IN</button></div>
  </section>`;
  const q=s=>root.querySelector(s),msg=q("#pokerMsg"),balEls=root.querySelectorAll("[data-casino-bal]");
  function save(){saveState(POKER_KEY,st);}
  function render(showDealer=false){
    balEls.forEach(x=>x.textContent=money(st.bal));q("#pokerBet").value=String(st.bet);
    if(!hand){q("#dealerCards").innerHTML="";q("#playerCards").innerHTML="";q("#community").innerHTML="";q("#pokerPot").textContent="0";return;}
    q("#dealerCards").innerHTML=hand.dealer.map(c=>cardHtml(c,!showDealer&&!hand.done)).join("");
    q("#playerCards").innerHTML=hand.player.map(c=>cardHtml(c)).join("");
    q("#community").innerHTML=hand.community.slice(0,hand.revealed).map(c=>cardHtml(c)).join("");
    q("#pokerPot").textContent=money(hand.pot);save();
  }
  function advance(){
    if(!hand||hand.done)return;
    if(hand.revealed===0){hand.revealed=3;msg.textContent="FLOP · zgjidh veprimin tjetër.";}
    else if(hand.revealed===3){hand.revealed=4;msg.textContent="TURN · zgjidh veprimin tjetër.";}
    else if(hand.revealed===4){hand.revealed=5;msg.textContent="RIVER · zgjidh veprimin tjetër.";}
    else showdown();
    render();
  }
  function showdown(){
    if(!hand||hand.done)return;hand.revealed=5;hand.done=true;
    const ps=bestScore([...hand.player,...hand.community]),ds=bestScore([...hand.dealer,...hand.community]),cmp=cmpScore(ps,ds);
    if(cmp>0){st.bal+=hand.pot;st.best=Math.max(st.best||0,hand.pot);msg.textContent="🏆 FITOVE · "+HAND_NAMES[ps[0]]+" · +"+money(hand.pot)+" 💎";beep(523,.1,.14);beep(784,.15,.16,"sine",.12);}
    else if(cmp===0){const back=Math.floor(hand.pot/2);st.bal+=back;msg.textContent="🤝 BARAZIM · "+HAND_NAMES[ps[0]]+" · +"+money(back)+" 💎";}
    else msg.textContent="🤖 Kompjuteri fitoi · "+HAND_NAMES[ds[0]]+".";
    render(true);save();
  }
  function pay(n){n=Math.max(0,Math.min(st.bal,Math.floor(n)));st.bal-=n;hand.pot+=n*2;return n;}
  q("#pokerNew").onclick=()=>{
    st.bet=Number(q("#pokerBet").value)||10;if(st.bal<st.bet){msg.textContent="Nuk ke diamante të mjaftueshme.";return;}
    const d=deck();hand={player:[d.pop(),d.pop()],dealer:[d.pop(),d.pop()],community:[d.pop(),d.pop(),d.pop(),d.pop(),d.pop()],revealed:0,pot:0,done:false};pay(st.bet);msg.textContent="PRE-FLOP · CHECK/CALL, RAISE, ALL-IN ose FOLD.";render();
  };
  q("#pokerCheck").onclick=()=>{if(!hand||hand.done)return;advance();};
  q("#pokerRaise").onclick=()=>{if(!hand||hand.done)return;if(st.bal<st.bet){msg.textContent="Nuk ke mjaft për RAISE.";return;}pay(st.bet);msg.textContent="RAISE +"+money(st.bet)+" · kompjuteri CALL.";advance();};
  q("#pokerAllin").onclick=()=>{if(!hand||hand.done||st.bal<=0)return;const n=st.bal;pay(n);hand.revealed=5;msg.textContent="🔥 ALL-IN "+money(n)+"!";showdown();};
  q("#pokerFold").onclick=()=>{if(!hand||hand.done)return;hand.done=true;msg.textContent="FOLD · humbe potin.";render(true);};
  q("#pokerBet").onchange=()=>{st.bet=Number(q("#pokerBet").value)||10;save();};
  q("#pokerBack").onclick=()=>{save();onBack?.();};
  render();
}

/* ---------------- ROULETTE ---------------- */
const ROULETTE_KEY="diamond-roulette-v1";
const ROULETTE_STAKES=[1,5,10,20,50,100,200,500,1000,5000,10000];
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
function rColor(n){return n===0?"green":RED.has(n)?"red":"black";}
export function startDiamondRoulette({root,onBack}={}){
  if(!root)return;addStyle();
  let st=loadState(ROULETTE_KEY,{bal:2000,stake:10,best:0}),selection={type:"red",value:"red"},busy=false;
  if(!ROULETTE_STAKES.includes(st.stake))st.stake=10;
  root.innerHTML=`<section class="dc">
    ${topBar("🎡 DIAMOND ROULETTE",st.bal,"rouletteBack")}
    <div class="dc-card"><div id="rouletteWheel" class="roulette-wheel"><div id="rouletteResult" class="roulette-center">?</div></div></div>
    <div class="dc-card dc-row"><label>BAST <select id="rouletteStake" class="dc-select">${ROULETTE_STAKES.map(b=>`<option value="${b}" ${b===st.stake?"selected":""}>${money(b)} 💎</option>`).join("")}</select></label><button id="rouletteSpin" class="dc-btn gold" style="flex:1">🎡 RROTULLO</button></div>
    <div class="dc-card"><strong>Zgjidh numrin:</strong><div class="roulette-bets" style="margin-top:7px">
      ${Array.from({length:37},(_,n)=>`<button class="roulette-num ${rColor(n)}" data-rnum="${n}">${n}</button>`).join("")}
    </div>
    <div class="roulette-outsides">
      <button class="dc-btn red" data-rout="red">🔴 KUQE</button><button class="dc-btn alt" data-rout="black">⚫ ZEZË</button><button class="dc-btn alt" data-rout="even">ÇIFT</button>
      <button class="dc-btn alt" data-rout="odd">TEK</button><button class="dc-btn alt" data-rout="low">1–18</button><button class="dc-btn alt" data-rout="high">19–36</button>
    </div></div>
    <div id="rouletteChoice" class="dc-msg">Basti: 🔴 KUQE</div><div id="rouletteMsg" class="dc-msg">Numër i vetëm paguan 35:1. Kuqe/zezë, çift/tek dhe 1–18/19–36 paguajnë 1:1.</div>
  </section>`;
  const q=s=>root.querySelector(s),msg=q("#rouletteMsg"),choice=q("#rouletteChoice"),wheel=q("#rouletteWheel"),center=q("#rouletteResult"),balEls=root.querySelectorAll("[data-casino-bal]");
  function save(){saveState(ROULETTE_KEY,st);}
  function render(){balEls.forEach(x=>x.textContent=money(st.bal));q("#rouletteStake").value=String(st.stake);root.querySelectorAll(".roulette-num").forEach(b=>b.classList.toggle("active",selection.type==="number"&&Number(b.dataset.rnum)===selection.value));save();}
  function chooseOutside(v){selection={type:v,value:v};choice.textContent="Basti: "+({red:"🔴 KUQE",black:"⚫ ZEZË",even:"ÇIFT",odd:"TEK",low:"1–18",high:"19–36"}[v]||v);render();}
  root.querySelectorAll("[data-rnum]").forEach(b=>b.onclick=()=>{selection={type:"number",value:Number(b.dataset.rnum)};choice.textContent="Basti: NUMRI "+selection.value;render();});
  root.querySelectorAll("[data-rout]").forEach(b=>b.onclick=()=>chooseOutside(b.dataset.rout));
  function winFor(n){
    if(selection.type==="number")return n===selection.value?36:0;
    if(n===0)return 0;
    if(selection.type==="red")return RED.has(n)?2:0;
    if(selection.type==="black")return !RED.has(n)?2:0;
    if(selection.type==="even")return n%2===0?2:0;
    if(selection.type==="odd")return n%2===1?2:0;
    if(selection.type==="low")return n>=1&&n<=18?2:0;
    if(selection.type==="high")return n>=19&&n<=36?2:0;
    return 0;
  }
  q("#rouletteSpin").onclick=()=>{
    if(busy)return;st.stake=Number(q("#rouletteStake").value)||10;if(st.bal<st.stake){msg.textContent="Nuk ke diamante të mjaftueshme.";return;}
    st.bal-=st.stake;busy=true;render();wheel.classList.remove("spin");void wheel.offsetWidth;wheel.classList.add("spin");center.textContent="…";msg.textContent="Topi po rrotullohet…";beep(210,.08,.08,"square");
    const n=Math.floor(Math.random()*37);
    setTimeout(()=>{busy=false;wheel.classList.remove("spin");center.textContent=String(n);center.style.background=rColor(n)==="red"?"#d91c3c":rColor(n)==="black"?"#111":"#15803d";center.style.color="#fff";
      const mult=winFor(n);if(mult){const gain=st.stake*mult;st.bal+=gain;st.best=Math.max(st.best||0,gain);msg.textContent="🏆 Doli "+n+" · FITOVE +"+money(gain)+" 💎";beep(523,.1,.14);beep(784,.16,.16,"sine",.12);}else msg.textContent="Doli "+n+" · pa fitim.";
      render();
    },2000);
  };
  q("#rouletteStake").onchange=()=>{st.stake=Number(q("#rouletteStake").value)||10;save();};
  q("#rouletteBack").onclick=()=>{save();onBack?.();};
  render();
}
