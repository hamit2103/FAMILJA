const K="diamond-slot-state-v1";
const SYMS=[["diamond","💎",50],["heart","❤️",30],["star","⭐",25],["apple","🍎",20],["strawberry","🍓",15]];
const BOOK=["book","📖",0],HAMMER=["hammer","🔨",0],POISON=["poison","🧪",0];
const BETS=[1,5,10,20,50,100,200,500,1000,5000,10000];
const SYM_BY_ID=Object.fromEntries(SYMS.map(x=>[x[0],x]));

function nearestBet(v){
  const n=Number(v)||20;
  return BETS.reduce((best,x)=>Math.abs(x-n)<Math.abs(best-n)?x:best,BETS[0]);
}
function fresh(){return{bal:2850,bet:20,m:{diamond:0,heart:0,star:0,apple:0,strawberry:0},free:0,x2:0,best:0,bonusSpins:0,bonusSymbol:"",bonusBet:0,poisonCounter:0,poisonNext:3};}
function load(){
  try{
    const raw=JSON.parse(localStorage.getItem(K)||"{}")||{},d=fresh();
    d.bal=Math.max(0,Math.floor(Number(raw.bal??d.bal)||0));
    d.bet=nearestBet(raw.bet??d.bet);
    d.free=Math.max(0,Math.floor(Number(raw.free)||0));
    d.x2=Math.max(0,Math.floor(Number(raw.x2)||0));
    d.best=Math.max(0,Math.floor(Number(raw.best)||0));
    d.bonusSpins=Math.max(0,Math.floor(Number(raw.bonusSpins)||0));
    d.bonusSymbol=SYM_BY_ID[raw.bonusSymbol]?raw.bonusSymbol:"";
    d.bonusBet=nearestBet(raw.bonusBet||d.bet);
    d.poisonCounter=Math.max(0,Math.floor(Number(raw.poisonCounter)||0));
    d.poisonNext=[3,4].includes(Number(raw.poisonNext))?Number(raw.poisonNext):3;
    d.m={...d.m,...(raw.m||{})};
    for(const x of SYMS)d.m[x[0]]=Math.max(0,Math.floor(Number(d.m[x[0]])||0))%x[2];
    return d;
  }catch(_){return fresh();}
}
function save(s){try{localStorage.setItem(K,JSON.stringify({...s,auto:false}));}catch(_){}}
function pickBase(){const q=Math.random();if(q<.12)return SYMS[0];if(q<.32)return SYMS[1];if(q<.50)return SYMS[2];if(q<.78)return SYMS[3];return SYMS[4];}
function visualPick(){return Math.random()<.20?BOOK:pickBase();}
function visualGrid(){return Array.from({length:3},()=>Array.from({length:5},()=>visualPick()));}
function baseGrid(){return Array.from({length:3},()=>Array.from({length:5},()=>pickBase()));}
function shuffledPositions(){
  const p=Array.from({length:15},(_,i)=>i);
  for(let i=p.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]];}
  return p;
}
function placeSymbol(board,symbol,count,filter=()=>true){
  let left=count;
  for(const p of shuffledPositions()){
    if(left<=0)break;
    const row=Math.floor(p/5),col=p%5;
    if(!filter(board[row][col]))continue;
    board[row][col]=symbol;left--;
  }
}
function buildFinalGrid({bonusActive=false,bonusSymbol="",poisonCount=0}={}){
  const board=baseGrid();
  const bookBonus=!bonusActive&&Math.random()<.05;

  if(bookBonus){
    placeSymbol(board,BOOK,3);
  }else{
    const z=Math.random(),books=z<.10?0:z<.70?1:2;
    placeSymbol(board,BOOK,books);
  }

  const filledCols=new Set();
  if(bonusActive&&SYM_BY_ID[bonusSymbol]){
    for(let col=0;col<5;col++){
      if(board.some(row=>row[col][0]===bonusSymbol)){
        filledCols.add(col);
        for(let row=0;row<3;row++)board[row][col]=SYM_BY_ID[bonusSymbol];
      }
    }
  }

  // 🧪 Xeheri nuk del kurrë në bonus.
  const poison=!bonusActive?Math.max(0,Math.floor(Number(poisonCount)||0)):0;
  if(poison>0)placeSymbol(board,POISON,poison,x=>x[0]!=="book");

  const hammer=!bonusActive&&Math.random()<.07;
  if(hammer)placeSymbol(board,HAMMER,1,x=>x[0]!=="book"&&x[0]!=="poison");

  return{board,bookBonus,hammer,poisonCount:poison,filledCols};
}
function scaledPrize(base,bet){return Math.max(1,Math.round(Number(base||0)*(Number(bet)||1)/25));}
function longest(row,id){let b=0,n=0;for(const x of row){if(x[0]===id){n++;b=Math.max(b,n);}else n=0;}return b;}

let slotAudio=null,slotSpinToneTimer=null,slotBonusMusicTimer=null,slotBonusMusicStep=0;
function stopBonusMusic(){
  if(slotBonusMusicTimer){clearInterval(slotBonusMusicTimer);slotBonusMusicTimer=null;}
  slotBonusMusicStep=0;
}
function startBonusMusic(){
  stopBonusMusic();
  const melody=[392,523,659,523,440,587,698,587];
  const play=()=>{
    if(localStorage.getItem("diamond-game-sound-master")==="off")return;
    const f=melody[slotBonusMusicStep%melody.length];
    slotBeep(f,.22,.085,"triangle",0);
    if(slotBonusMusicStep%2===0)slotBeep(f/2,.18,.045,"sine",.02);
    slotBonusMusicStep++;
  };
  play();
  slotBonusMusicTimer=setInterval(play,360);
}
function slotAudioContext(){
  if(localStorage.getItem("diamond-game-sound-master")==="off")return null;
  try{
    if(!slotAudio){
      const A=window.AudioContext||window.webkitAudioContext;
      if(!A)return null;
      slotAudio=new A();
    }
    if(slotAudio.state==="suspended")slotAudio.resume().catch(()=>{});
    return slotAudio;
  }catch(_){return null;}
}
function slotBeep(freq,duration=.05,volume=.08,type="square",delay=0){
  const ctx=slotAudioContext();if(!ctx)return;
  try{
    const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime+delay;
    osc.type=type;osc.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.01);
    gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+duration+.03);
  }catch(_){}
}
function startSlotSpinSound(){
  stopSlotSpinSound();let n=0;
  slotSpinToneTimer=setInterval(()=>{slotBeep(190+(n%7)*35,.055,.065,"square");n++;},75);
}
function stopSlotSpinSound(){if(slotSpinToneTimer){clearInterval(slotSpinToneTimer);slotSpinToneTimer=null;}}
function playSlotWinSound(){
  slotBeep(523,.11,.14,"sine",0);slotBeep(659,.11,.14,"sine",.10);
  slotBeep(784,.14,.16,"sine",.20);slotBeep(1047,.25,.18,"sine",.34);
}
function connectedSymbolGroups(board){
  const rows=board.length,cols=board[0]?.length||0,seen=new Set(),groups=[];
  const dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const id=board[r][c]?.[0];
      if(!SYM_BY_ID[id])continue;

      const key=r+","+c;
      if(seen.has(key))continue;

      const stack=[[r,c]],cells=[];
      seen.add(key);

      while(stack.length){
        const [cr,cc]=stack.pop();
        cells.push([cr,cc]);

        for(const [dr,dc] of dirs){
          const nr=cr+dr,nc=cc+dc;
          if(nr<0||nr>=rows||nc<0||nc>=cols)continue;
          if(board[nr][nc]?.[0]!==id)continue;

          const nk=nr+","+nc;
          if(seen.has(nk))continue;

          seen.add(nk);
          stack.push([nr,nc]);
        }
      }

      groups.push({id,cells,count:cells.length});
    }
  }
  return groups;
}

function fillMeter(state,id,count){
  const cap=SYM_BY_ID[id]?.[2]||0;
  if(!cap||!state?.m)return;
  state.m[id]=Math.min(cap,(Number(state.m[id])||0)+Math.max(0,Number(count)||0));
}
function meterConnectedReward(state,id,count,bet){
  const cap=SYM_BY_ID[id]?.[2]||0;
  if(!cap||count<2||!state?.m)return 0;
  if((Number(state.m[id])||0)<cap)return 0;

  // Fitimi bazë për BAST 1 dhe 2 simbole të lidhura:
  // 🍓=1, 🍎=2, ⭐=3, ❤️=5, 💎=10.
  const baseBySymbol={
    strawberry:1,
    apple:2,
    star:3,
    heart:5,
    diamond:10
  };
  const base=Number(baseBySymbol[id]||0);
  if(base<=0)return 0;

  // Çdo simbol shtesë rrit fitimin proporcionalisht:
  // 2 simbole = 1x, 3 = 1.5x, 4 = 2x, 5 = 2.5x...
  return Math.max(1,Math.round(base*(count/2)*(Number(bet)||1)));
}
function css(){
 if(document.getElementById("ds-css"))return;
 const s=document.createElement("style");s.id="ds-css";s.textContent=`
.ds{min-height:100%;padding:10px 8px 90px;box-sizing:border-box;color:#fff;background:radial-gradient(circle at 50% 10%,#59147a,#07102b 38%,#020713);font-family:system-ui;transition:background .35s,box-shadow .35s}
.ds.bonus-active{background:radial-gradient(circle at 50% 8%,#20c96b 0,#087a3b 34%,#043c21 72%,#01150c 100%);box-shadow:inset 0 0 70px #36ff8a55}
.ds-top{display:flex;align-items:center;gap:8px}.ds-back{width:40px;height:40px;border-radius:12px;border:1px solid #25c8ff;background:#071a3c;color:#fff;font-size:24px}.ds-title{flex:1;font-size:20px;font-weight:1000}.ds-bal{padding:8px 10px;border:1px solid #2e8cff;border-radius:14px;background:#071836;font-weight:900}
.ds-hero{text-align:center;margin:5px 0 9px}.ds-hero b{display:block;font-size:34px;color:#8edaff;text-shadow:0 0 16px #1680ff;line-height:.9}.ds-hero strong{font-size:26px;color:#ffc34d;text-shadow:0 0 13px #ff6a00}
.ds-meters{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-bottom:8px}.ds-meter{padding:5px 2px;text-align:center;border:1px solid var(--c);border-radius:10px;background:#071027}.ds-meter .ic{font-size:22px}.ds-meter b{display:block;font-size:8px}.ds-bar{height:6px;border-radius:8px;overflow:hidden;background:#0c1d39;border:1px solid #ffffff30}.ds-bar i{display:block;height:100%;background:var(--c)}.ds-meter small{font-size:8px}
.ds-wrap{padding:6px;border-radius:18px;background:linear-gradient(135deg,#d34cff,#2c79ff,#ffbd3f);box-shadow:0 0 22px #6a27d7;overflow:hidden}.ds-reels{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:5px;border:2px solid #ffd569;border-radius:14px;background:#020817;overflow:hidden}.ds-cell{aspect-ratio:1;display:grid;place-items:center;font-size:clamp(29px,10vw,55px);background:linear-gradient(#0a1940,#03091d);border:1px solid #20366f;will-change:transform,opacity}
@keyframes dsFall{0%{transform:translateY(-135%);opacity:.15}35%{opacity:1}100%{transform:translateY(135%);opacity:.25}}
.ds.spinning .ds-cell{animation:dsFall .20s linear infinite;animation-delay:calc(var(--col,0) * -0.03s);filter:drop-shadow(0 0 8px #8948ff)}
.ds-cell.bonus-col{outline:2px solid #ffe55d;box-shadow:inset 0 0 15px #ffcb2e,0 0 12px #8b5cff;animation:dsBonusPulse .45s ease-in-out 2}
@keyframes dsBonusPulse{50%{transform:scale(1.07);filter:brightness(1.35)}}
.ds-bonus{margin:5px 0 8px;padding:7px 9px;border:1px solid #ffe85d;border-radius:12px;background:linear-gradient(135deg,#4c1d95,#172554);font-size:11px;font-weight:900;text-align:center;box-shadow:0 0 15px #7c3aed66}
.ds-bonus.hidden{display:none}
.ds-hammer{position:fixed;inset:0;z-index:2147483646;pointer-events:none;overflow:hidden;background:transparent}
.ds-hammer.hidden{display:none}
.ds-hammer-fall{position:absolute;left:50%;top:-180px;transform:translateX(-50%);text-align:center;color:#fff;font-weight:1000;text-shadow:0 3px 12px #000;animation:hammerDrop 1.15s cubic-bezier(.2,.75,.35,1) forwards}
.ds-hammer .hammer-icon{display:block;font-size:112px;line-height:1;filter:drop-shadow(0 0 18px #ffbe2e)}
.ds-hammer .hammer-bam{display:block;margin-top:8px;font-size:28px;color:#ffd84d;letter-spacing:2px;text-shadow:0 0 16px #ff7900,0 3px 8px #000}
@keyframes hammerDrop{
  0%{top:-180px;transform:translateX(-50%) rotate(-28deg) scale(.7);opacity:0}
  25%{opacity:1}
  58%{top:42%;transform:translateX(-50%) rotate(18deg) scale(1.22)}
  70%{top:50%;transform:translateX(-50%) rotate(-8deg) scale(1.05)}
  100%{top:115%;transform:translateX(-50%) rotate(18deg) scale(.88);opacity:.15}
}
.ds-book-overlay{position:fixed;inset:0;z-index:2147483645;display:grid;place-items:center;background:rgba(2,10,18,.82);backdrop-filter:blur(5px)}
.ds-book-overlay.hidden{display:none}
.ds-book-card{width:min(82vw,340px);padding:20px 16px;border:3px solid #f7d65b;border-radius:24px;background:radial-gradient(circle at 50% 25%,#1f8f51,#073a22 62%,#02190f);box-shadow:0 0 48px #30ff8c88;text-align:center;color:#fff}
.ds-book-icon{font-size:108px;line-height:1;display:block;transform-origin:center;animation:bookFlip .22s ease-in-out infinite alternate;filter:drop-shadow(0 0 20px #ffe46a)}
.ds-book-symbol{font-size:82px;line-height:1.05;display:block;margin-top:8px;filter:drop-shadow(0 0 18px #fff6)}
.ds-book-text{display:block;margin-top:10px;font-size:17px;font-weight:1000;letter-spacing:.5px}
.ds-book-overlay.done .ds-book-icon{animation:none;transform:scale(1.05)}
.ds-book-overlay.done .ds-book-symbol{animation:bookChosen .55s ease-in-out 2}
@keyframes bookFlip{from{transform:perspective(500px) rotateY(-34deg) scale(.94)}to{transform:perspective(500px) rotateY(34deg) scale(1.05)}}
@keyframes bookChosen{50%{transform:scale(1.23);filter:drop-shadow(0 0 30px #fff)}}
.ds-msg{min-height:42px;margin:8px 0 6px;padding:7px;border:1px solid #318eff66;border-radius:12px;background:#06132c;text-align:center;font-size:11px;display:grid;place-items:center}.ds-msg.win{border-color:#ffd64e;color:#fff2a3}
.ds-controls{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:6px;align-items:center}.ds-bet,.ds-auto{min-height:60px;border:1px solid #3388f5;border-radius:16px;background:#071a3c;color:#fff;font-weight:900}.ds-bet{display:grid;grid-template-columns:30px 1fr 30px;align-items:center;padding:4px;text-align:center}.ds-bet button{width:29px;height:29px;border-radius:50%;border:1px solid #4b91ff;background:#133574;color:#fff;font-size:18px}.ds-bet small{font-size:9px}.ds-bet b{display:block}
.ds-spin{aspect-ratio:1;max-width:108px;width:100%;justify-self:center;border-radius:50%;border:4px solid #ff7cf5;background:radial-gradient(circle,#dc42ff,#6f25df 65%,#271064);color:#fff;font-weight:1000;box-shadow:0 0 22px #a738ff}.ds-auto.on{background:linear-gradient(135deg,#7629e8,#246aff)}
.ds-info{text-align:center;margin-top:8px;font-size:9px;padding:7px;border:1px solid #1ca5ff;border-radius:12px;background:#06142d}
`;document.head.appendChild(s);
}
export function startDiamondSlotGame({root,onBack}={}){
 if(!root)return;css();let st=load(),g=visualGrid(),busy=false,timer=null,autoTimer=null,bonusCols=new Set(),hammerPending=false,bookPending=false,bonusRoundActive=false;st.auto=false;
 root.innerHTML=`<section class="ds">
 <div class="ds-top"><button id="dsBack" class="ds-back">‹</button><div class="ds-title">💎 DIAMOND</div><div class="ds-bal">💎 <span id="bal"></span></div></div>
 <div class="ds-hero"><b>DIAMOND</b><strong>SLOT</strong></div>
 <div class="ds-meters">${SYMS.map(x=>`<div class="ds-meter" style="--c:${x[0]==="diamond"?"#19c7ff":x[0]==="heart"?"#ff3186":x[0]==="star"?"#ffc83d":x[0]==="apple"?"#31e86a":"#d85cff"}"><div class="ic">${x[1]}</div><b>${x[0].toUpperCase()}</b><div class="ds-bar"><i id="b-${x[0]}"></i></div><small id="m-${x[0]}"></small></div>`).join("")}</div>
 <div id="bonusBanner" class="ds-bonus hidden"></div>
 <div class="ds-wrap"><div id="reels" class="ds-reels"></div></div>
 <div id="msg" class="ds-msg">Shkalla duhet të jetë FULL. Pastaj 2+ simbole të lidhura japin fitim sipas bastit.</div>
 <div class="ds-controls"><div class="ds-bet"><button id="minus">−</button><small>BAST<b id="bet"></b></small><button id="plus">+</button></div><button id="spin" class="ds-spin">↻<br>RROTULLO</button><button id="auto" class="ds-auto">↻ AUTO</button></div>
 <div id="dsInfo" class="ds-info"></div>
 <div id="hammerOverlay" class="ds-hammer hidden"><div class="ds-hammer-fall"><span class="hammer-icon">🔨</span><span class="hammer-bam">BAM! BAM!</span></div></div>
 <div id="bookOverlay" class="ds-book-overlay hidden"><div class="ds-book-card"><span class="ds-book-icon">📖</span><span id="bookSymbol" class="ds-book-symbol">💎</span><span id="bookText" class="ds-book-text">BONUS PO ZGJEDH SIMBOLIN…</span></div></div></section>`;
 const sh=root.querySelector(".ds"),re=root.querySelector("#reels"),msg=root.querySelector("#msg"),bal=root.querySelector("#bal"),bet=root.querySelector("#bet"),sp=root.querySelector("#spin"),au=root.querySelector("#auto");
 const minus=root.querySelector("#minus"),plus=root.querySelector("#plus"),bonusBanner=root.querySelector("#bonusBanner"),infoEl=root.querySelector("#dsInfo"),hammerOverlay=root.querySelector("#hammerOverlay"),bookOverlay=root.querySelector("#bookOverlay"),bookSymbol=root.querySelector("#bookSymbol"),bookText=root.querySelector("#bookText");
 function rg(){re.innerHTML=g.flat().map((x,i)=>`<div class="ds-cell ${bonusCols.has(i%5)?"bonus-col":""}" style="--col:${i%5}">${x[1]}</div>`).join("");}
 function rs(){
   bal.textContent=Math.floor(st.bal).toLocaleString();bet.textContent=st.bet+" 💎";
   SYMS.forEach(x=>{
     const v=st.m[x[0]]||0;
     root.querySelector("#m-"+x[0]).textContent=v+" / "+x[2];
     root.querySelector("#b-"+x[0]).style.width=Math.min(100,v/x[2]*100)+"%";
   });

   const bonusOn=((st.bonusSpins||0)>0||bonusRoundActive)&&SYM_BY_ID[st.bonusSymbol];
   sh.classList.toggle("bonus-active",!!bonusOn);
   if(bonusOn){
     bonusBanner.classList.remove("hidden");
     bonusBanner.textContent="📖 BONUS "+st.bonusSpins+" lojëra · "+SYM_BY_ID[st.bonusSymbol][1]+" "+st.bonusSymbol.toUpperCase()+" mbush kolonën vertikale";
   }else{
     bonusBanner.classList.add("hidden");
     bonusBanner.textContent="";
   }

   minus.disabled=!!bonusOn||busy;plus.disabled=!!bonusOn||busy;
   au.classList.toggle("on",st.auto);au.textContent=st.auto?"■ NDAL AUTO":"↻ AUTO";
   const b=st.bet;
   infoEl.textContent="BAST "+b+" 💎 · FULL: 💎50 ❤️30 ⭐25 🍎20 🍓15 · BAST 1 me 2 të lidhura: 💎10 ❤️5 ⭐3 🍎2 🍓1 · 🔨 7% · 📖 3 libra 5% · 🧪 1=pa efekt, 2=−1, 3+=0";
   save(st);
 }
 function updateMetersOnly(counts){
   for(const x of SYMS)fillMeter(st,x[0],counts[x[0]]||0);
 }

 function showHammer(){
   if(bonusRoundActive||(st.bonusSpins||0)>0)return;
   hammerPending=true;

   for(const x of SYMS)st.m[x[0]]=0;
   rs();

   hammerOverlay.classList.remove("hidden");
   const fall=hammerOverlay.querySelector(".ds-hammer-fall");
   if(fall){
     fall.style.animation="none";
     void fall.offsetWidth;
     fall.style.animation="";
   }

   msg.textContent="🔨 BAM! BAM! Çekiqi i ktheu të gjitha shkallët në 0.";
   msg.classList.remove("win");

   slotBeep(105,.20,.24,"sawtooth",0);
   slotBeep(72,.27,.25,"square",.22);
   slotBeep(118,.19,.23,"sawtooth",.48);
   slotBeep(68,.31,.25,"square",.68);

   setTimeout(()=>{
     hammerOverlay.classList.add("hidden");
     hammerPending=false;
     rs();
     if(st.auto&&!busy&&!bookPending)autoTimer=setTimeout(spin,260);
   },1250);
 }

 function applyPoison(count,a){
   const n=Math.max(0,Math.floor(Number(count)||0));
   if(n<=0)return;

   if(n===1){
     a.push("🧪 1 shishe · pa efekt");
     slotBeep(250,.10,.10,"triangle");
     return;
   }

   if(n===2){
     for(const x of SYMS)st.m[x[0]]=Math.max(0,(Number(st.m[x[0]])||0)-1);
     a.push("🧪🧪 −1 nga çdo shkallë");
     slotBeep(180,.16,.16,"sawtooth",0);
     slotBeep(140,.20,.16,"sawtooth",.18);
     return;
   }

   for(const x of SYMS)st.m[x[0]]=0;
   a.push("🧪🧪🧪 XEHER · të gjitha shkallët = 0");
   slotBeep(130,.20,.20,"sawtooth",0);
   slotBeep(90,.28,.22,"square",.20);
   slotBeep(65,.34,.24,"square",.48);
 }

 function showBookBonus(chosen,spinBet){
   if(!chosen)return;
   bookPending=true;st.auto=!!st.auto;
   bookOverlay.classList.remove("hidden","done");
   bookText.textContent="BONUS PO ZGJEDH SIMBOLIN…";

   let step=0;
   const cycle=setInterval(()=>{
     const s=SYMS[step%SYMS.length];
     bookSymbol.textContent=s[1];
     slotBeep(360+(step%5)*70,.055,.11,"triangle");
     step++;
   },150);

   setTimeout(()=>{
     clearInterval(cycle);
     bookSymbol.textContent=chosen[1];
     bookText.textContent=chosen[1]+" "+chosen[0].toUpperCase()+" · 10 LOJËRA BONUS";
     bookOverlay.classList.add("done");
     slotBeep(660,.16,.16,"sine",0);
     slotBeep(880,.20,.18,"sine",.14);

     st.bonusSpins=(st.bonusSpins||0)+10;
     st.bonusSymbol=chosen[0];
     st.bonusBet=spinBet;
     bonusRoundActive=false;
     rs();
     startBonusMusic();

     setTimeout(()=>{
       bookOverlay.classList.add("hidden");
       bookOverlay.classList.remove("done");
       bookPending=false;
       rs();
       if(st.auto&&!busy&&!hammerPending)autoTimer=setTimeout(spin,350);
     },1200);
   },1650);
 }

 function evalSpin(meta={}){
   const c={diamond:0,heart:0,star:0,apple:0,strawberry:0},a=[];
   const spinBet=Number(meta.spinBet)||st.bet;
   let win=0;

   g.flat().forEach(x=>{
     if(Object.prototype.hasOwnProperty.call(c,x[0]))c[x[0]]++;
   });

   // Shkallët vetëm mbushen deri në maksimum; nuk japin para para se të jenë full.
   updateMetersOnly(c);

   // 🧪 Efekti aplikohet pas mbushjes së këtij rrotullimi.
   // 1 = pa efekt, 2 = -1 nga çdo shkallë, 3+ = të gjitha në 0.
   applyPoison(meta.poisonCount||0,a);

   // Pasi shkalla është full, vetëm grupet me 2+ simbole të lidhura japin fitim.
   // Çdo grup i lidhur numërohet vetëm një herë.
   for(const group of connectedSymbolGroups(g)){
     if(group.count<2)continue;
     const p=meterConnectedReward(st,group.id,group.count,spinBet);
     if(p>0){
       win+=p;
       const icon=SYM_BY_ID[group.id]?.[1]||"";
       a.push(icon+" "+group.count+" të lidhura +"+p);
     }
   }

   st.bal+=win;

   if(meta.bookBonus){
     const chosen=SYMS[Math.floor(Math.random()*SYMS.length)];
     a.push("📖 3 LIBRA = 10 BONUS");
     showBookBonus(chosen,spinBet);
   }

   if(st.bal<BETS[0]&&(st.free||0)<=0&&(st.bonusSpins||0)<=0){
     st.bal=500;
     a.push("🎁 +500 diamante për të vazhduar");
   }

   st.x2=0;
   st.best=Math.max(st.best||0,win);
   rs();

   if(a.length){
     msg.textContent=(win>0?"FITOVE "+win+" 💎 · ":"")+a.slice(0,4).join(" · ");
     msg.classList.add("win");
     playSlotWinSound();
   }else{
     msg.textContent="Shkallët po mbushen. Fitim vetëm kur shkalla është full dhe ka 2+ simbole të lidhura.";
     msg.classList.remove("win");
   }

   if(meta.hammer&&!meta.bonusActive)showHammer();
 }
 function spin(){
   if(busy||hammerPending||bookPending)return;

   const bonusActive=(st.bonusSpins||0)>0&&!!SYM_BY_ID[st.bonusSymbol];
   bonusRoundActive=!!bonusActive;
   const spinBet=bonusActive?(st.bonusBet||st.bet):st.bet;

   let poisonCount=0;
   if(!bonusActive){
     const pr=Math.random();
     if(pr<.01){
       poisonCount=3;
     }else if(pr<.06){
       poisonCount=2;
     }else{
       st.poisonCounter=(Number(st.poisonCounter)||0)+1;
       if(st.poisonCounter>=Math.max(3,Math.min(4,Number(st.poisonNext)||3))){
         poisonCount=1;
       }
     }

     if(poisonCount>0){
       st.poisonCounter=0;
       st.poisonNext=Math.random()<.5?3:4;
     }
   }

   if(!bonusActive&&(st.free||0)<=0&&st.bal<st.bet){
     if(st.bal<BETS[0]){
       st.bal=500;st.auto=false;rs();
       msg.textContent="🎁 More 500 diamante për të vazhduar.";
       msg.classList.add("win");playSlotWinSound();return;
     }
     st.auto=false;rs();msg.textContent="Nuk ke diamante të mjaftueshme.";return;
   }

   busy=true;bonusCols=new Set();sh.classList.add("spinning");
   if(bonusActive)st.bonusSpins=Math.max(0,st.bonusSpins-1);
   else if((st.free||0)>0)st.free--;
   else st.bal-=st.bet;

   rs();msg.textContent=bonusActive?"📖 BONUS po rrotullohet…":"Po rrotullohet…";msg.classList.remove("win");
   startSlotSpinSound();

   let n=0;
   timer=setInterval(()=>{
     g=visualGrid();bonusCols=new Set();rg();
     if(++n>12){clearInterval(timer);timer=null;}
   },70);

   setTimeout(()=>{
     if(timer){clearInterval(timer);timer=null;}
     stopSlotSpinSound();

     const result=buildFinalGrid({bonusActive,bonusSymbol:st.bonusSymbol,poisonCount});
     g=result.board;bonusCols=result.filledCols;rg();
     sh.classList.remove("spinning");busy=false;

     try{
       evalSpin({bookBonus:result.bookBonus,hammer:result.hammer,poisonCount:result.poisonCount,spinBet,bonusActive});
     }catch(error){
       console.error("DIAMOND SLOT eval error",error);
       msg.textContent="Gabimi i lojës u kap. Provo rrotullimin përsëri.";
       msg.classList.remove("win");
       if(result.hammer&&!bonusActive)showHammer();
       if(result.poisonCount&&!bonusActive){
         const temp=[];
         applyPoison(result.poisonCount,temp);
         rs();
       }
       if(result.bookBonus&&!bonusActive){
         const chosen=SYMS[Math.floor(Math.random()*SYMS.length)];
         showBookBonus(chosen,spinBet);
       }
     }

     if(bonusActive&&st.bonusSpins<=0){
       bonusRoundActive=false;
       st.bonusSymbol="";st.bonusBet=0;
       stopBonusMusic();
       rs();
     }else if(!bonusActive){
       bonusRoundActive=false;
       rs();
     }

     if(st.auto&&!hammerPending&&!bookPending)autoTimer=setTimeout(spin,850);
   },980);
 }
 function cb(d){
   if(busy||hammerPending||(st.bonusSpins||0)>0)return;
   let i=BETS.indexOf(st.bet);if(i<0)i=BETS.indexOf(nearestBet(st.bet));
   i=Math.max(0,Math.min(BETS.length-1,i+d));st.bet=BETS[i];rs();
 }
 minus.onclick=()=>cb(-1);plus.onclick=()=>cb(1);sp.onclick=spin;
 au.onclick=()=>{if(hammerPending)return;st.auto=!st.auto;rs();if(st.auto&&!busy)spin();};
 root.querySelector("#dsBack").onclick=()=>{st.auto=false;stopSlotSpinSound();stopBonusMusic();if(timer)clearInterval(timer);if(autoTimer)clearTimeout(autoTimer);save(st);onBack?.();};
 rg();rs();if((st.bonusSpins||0)>0&&SYM_BY_ID[st.bonusSymbol])startBonusMusic();
}