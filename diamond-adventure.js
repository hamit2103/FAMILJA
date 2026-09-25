const LANG_KEY="pajaziti-language";
const PROGRESS_PREFIX="diamond-adventure-progress-v1:";
const TEXT={
  sq:{title:"DIAMOND ADVENTURE",back:"Kthehu",level:"Niveli",lives:"Jetë",diamonds:"Diamante",score:"Pikë",jump:"Kërcim",spin:"Rrotullim",resume:"Vazhdo",restart:"Fillo nga fillimi",continueFrom:"Vazhdo nga niveli",next:"Niveli tjetër",again:"Luaj përsëri",win:"Urime! E përfundove Diamond Adventure!",lost:"Humbët një jetë",boss:"BOSS",tip:"Lëviz, kërce dhe rrotullohu. Thyej kutitë, mblidh diamantet dhe mund armiqtë."},
  de:{title:"DIAMOND ADVENTURE",back:"Zurück",level:"Level",lives:"Leben",diamonds:"Diamanten",score:"Punkte",jump:"Springen",spin:"Wirbel",resume:"Weiter",restart:"Von vorne",continueFrom:"Weiter ab Level",next:"Nächstes Level",again:"Nochmal spielen",win:"Glückwunsch! Diamond Adventure geschafft!",lost:"Ein Leben verloren",boss:"BOSS",tip:"Bewegen, springen und wirbeln. Kisten zerstören, Diamanten sammeln und Gegner besiegen."},
  tr:{title:"DIAMOND ADVENTURE",back:"Geri",level:"Bölüm",lives:"Can",diamonds:"Elmas",score:"Puan",jump:"Zıpla",spin:"Dönüş",resume:"Devam",restart:"Baştan başla",continueFrom:"Bu bölümden devam et",next:"Sonraki bölüm",again:"Tekrar oyna",win:"Tebrikler! Diamond Adventure tamamlandı!",lost:"Bir can kaybettin",boss:"BOSS",tip:"Hareket et, zıpla ve dön. Kutuları kır, elmasları topla ve düşmanları yen."},
  en:{title:"DIAMOND ADVENTURE",back:"Back",level:"Level",lives:"Lives",diamonds:"Diamonds",score:"Score",jump:"Jump",spin:"Spin",resume:"Resume",restart:"Start over",continueFrom:"Continue from level",next:"Next level",again:"Play again",win:"Congratulations! You finished Diamond Adventure!",lost:"You lost a life",boss:"BOSS",tip:"Move, jump and spin. Break boxes, collect diamonds and defeat enemies."},
  it:{title:"DIAMOND ADVENTURE",back:"Indietro",level:"Livello",lives:"Vite",diamonds:"Diamanti",score:"Punti",jump:"Salta",spin:"Rotazione",resume:"Continua",restart:"Ricomincia",continueFrom:"Continua dal livello",next:"Livello successivo",again:"Gioca ancora",win:"Complimenti! Hai finito Diamond Adventure!",lost:"Hai perso una vita",boss:"BOSS",tip:"Muoviti, salta e ruota. Rompi le casse, raccogli diamanti e sconfiggi i nemici."},
  hr:{title:"DIAMOND ADVENTURE",back:"Natrag",level:"Razina",lives:"Životi",diamonds:"Dijamanti",score:"Bodovi",jump:"Skoči",spin:"Okret",resume:"Nastavi",restart:"Ispočetka",continueFrom:"Nastavi od razine",next:"Sljedeća razina",again:"Igraj ponovno",win:"Čestitamo! Završio si Diamond Adventure!",lost:"Izgubio si život",boss:"BOSS",tip:"Kreći se, skači i okreći. Razbij kutije, skupljaj dijamante i pobijedi neprijatelje."},
  fr:{title:"DIAMOND ADVENTURE",back:"Retour",level:"Niveau",lives:"Vies",diamonds:"Diamants",score:"Score",jump:"Saut",spin:"Rotation",resume:"Continuer",restart:"Recommencer",continueFrom:"Continuer au niveau",next:"Niveau suivant",again:"Rejouer",win:"Bravo ! Diamond Adventure terminé !",lost:"Vous avez perdu une vie",boss:"BOSS",tip:"Déplacez-vous, sautez et tournez. Cassez les caisses, ramassez les diamants et battez les ennemis."},
  ar:{title:"DIAMOND ADVENTURE",back:"رجوع",level:"المستوى",lives:"الحياة",diamonds:"الألماس",score:"النقاط",jump:"قفز",spin:"دوران",resume:"متابعة",restart:"ابدأ من جديد",continueFrom:"متابعة من المستوى",next:"المستوى التالي",again:"العب مجدداً",win:"تهانينا! أنهيت Diamond Adventure!",lost:"خسرت حياة",boss:"الزعيم",tip:"تحرك واقفز ولف. اكسر الصناديق واجمع الألماس واهزم الأعداء."}
};
function lang(){const l=localStorage.getItem(LANG_KEY)||"sq";return TEXT[l]?l:"sq";}
function t(k){return TEXT[lang()][k]||TEXT.sq[k]||k;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function hit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function playerName(){return (localStorage.getItem("pajaziti-global-user-name")||"Player").trim().slice(0,24);}
function progressKey(){return PROGRESS_PREFIX+playerName().toLowerCase();}
function readProgress(){try{return JSON.parse(localStorage.getItem(progressKey())||"null");}catch(_){return null;}}
function writeProgress(v){try{localStorage.setItem(progressKey(),JSON.stringify(v));}catch(_){}}
function clearProgress(){try{localStorage.removeItem(progressKey());}catch(_){}}

const THEMES=[
  {name:"Jungle",sky1:"#38bdf8",sky2:"#d9f99d",ground:"#4d7c0f",top:"#84cc16",accent:"#22c55e"},
  {name:"Snow",sky1:"#bfdbfe",sky2:"#f8fafc",ground:"#64748b",top:"#f8fafc",accent:"#38bdf8"},
  {name:"Desert",sky1:"#fbbf24",sky2:"#fde68a",ground:"#92400e",top:"#f59e0b",accent:"#ef4444"},
  {name:"Night",sky1:"#111827",sky2:"#312e81",ground:"#1f2937",top:"#8b5cf6",accent:"#22d3ee"},
  {name:"Castle",sky1:"#334155",sky2:"#0f172a",ground:"#3f3f46",top:"#a1a1aa",accent:"#f43f5e"}
];

function stageData(index){
  const width=2800+index*380;
  const groundY=570;
  const gaps=[
    [[760,900],[1760,1890]],
    [[520,670],[1380,1530],[2350,2500]],
    [[840,1010],[1640,1810],[2630,2780]],
    [[620,790],[1460,1620],[2220,2400],[3100,3260]],
    [[720,900],[1510,1690],[2360,2540],[3240,3420]]
  ][index];
  const solids=[];
  let cur=0;
  for(const g of gaps){if(g[0]>cur)solids.push({x:cur,y:groundY,w:g[0]-cur,h:100});cur=g[1];}
  if(cur<width)solids.push({x:cur,y:groundY,w:width-cur,h:100});
  const plats=[];
  for(let x=330,i=0;x<width-300;x+=360,i++){
    const y=430-(i%3)*58;
    const p={x:x,y:y,w:170+(i%2)*45,h:22};
    plats.push(p);solids.push(p);
  }
  const diamonds=[];
  for(let x=170,i=0;x<width-160;x+=145,i++)diamonds.push({x:x,y:470-(i%4)*42,r:9,taken:false});
  for(const p of plats)diamonds.push({x:p.x+p.w/2,y:p.y-35,r:9,taken:false});
  const boxes=[];
  const boxTypes=["diamond","shield","diamond","life","speed"];
  for(let i=0;i<plats.length;i+=2)boxes.push({x:plats[i].x+55,y:plats[i].y-42,w:38,h:38,type:boxTypes[(i/2+index)%boxTypes.length],broken:false});
  const enemies=[];
  for(let i=0;i<4+index*2;i++){
    const x=520+i*((width-900)/(4+index*2));
    enemies.push({x:x,y:groundY-38,w:38,h:38,vx:(i%2?1:-1)*(62+index*7),min:x-90,max:x+90,dead:false});
  }
  const spikes=[];
  for(let i=0;i<2+index;i++)spikes.push({x:1080+i*620+(index%2)*80,y:groundY-25,w:54,h:25});
  const boss=index===4?{x:width-520,y:groundY-92,w:92,h:92,hp:5,maxHp:5,vx:-80,min:width-760,max:width-260,dead:false,hitCooldown:0}:null;
  return {index:index,width:width,groundY:groundY,solids:solids,plats:plats,diamonds:diamonds,boxes:boxes,enemies:enemies,spikes:spikes,boss:boss,finish:width-100,theme:THEMES[index]};
}

function makeAudio(){
  let ctx=null;
  function tone(f,d,type,vol){
    try{
      ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==="suspended")ctx.resume();
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type=type||"sine";o.frequency.value=f;g.gain.value=vol||.025;o.connect(g);g.connect(ctx.destination);o.start();
      g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d);o.stop(ctx.currentTime+d);
    }catch(_){}
  }
  return {
    jump:function(){tone(520,.08,"square",.02);},
    diamond:function(){tone(920,.07,"sine",.02);},
    box:function(){tone(260,.09,"square",.03);},
    spin:function(){tone(330,.07,"sawtooth",.02);},
    hit:function(){tone(120,.18,"sawtooth",.04);},
    enemy:function(){tone(210,.08,"square",.03);},
    power:function(){tone(600,.08);setTimeout(function(){tone(900,.1);},70);},
    win:function(){tone(600,.1);setTimeout(function(){tone(800,.1);},100);setTimeout(function(){tone(1050,.16);},200);}
  };
}

export function startDiamondAdventureGame(opts){
  const root=opts&&opts.root;
  const onBack=opts&&opts.onBack;
  if(!root)return;
  const audio=makeAudio();
  let stageIndex=0,stage=stageData(0),lives=3,diamonds=0,score=0,nextLifeAt=100;
  let camera=0,paused=false,ended=false,raf=0,last=performance.now(),invuln=0,speedBoost=0;
  let respawnX=90,respawnY=450;
  const input={left:false,right:false,jump:false,jumpPressed:false,spinPressed:false};
  const player={x:90,y:450,w:36,h:52,vx:0,vy:0,onGround:false,facing:1,spin:0,shield:0};

  root.innerHTML=
    '<div class="da-shell">'+
      '<div class="da-top"><button id="daBack" class="da-small">← '+t("back")+'</button><strong>💎 '+t("title")+'</strong><button id="daPause" class="da-small">⏸</button></div>'+
      '<div class="da-hud"><span id="daLevel"></span><span id="daLives"></span><span id="daDiamonds"></span><span id="daScore"></span><span id="daShield"></span></div>'+
      '<div class="da-wrap"><canvas id="daCanvas" width="960" height="640"></canvas><div id="daMessage" class="da-message hidden"></div></div>'+
      '<div class="da-controls"><div class="da-move"><button id="daLeft">◀</button><button id="daRight">▶</button></div><button id="daSpin" class="da-spin">🌀<small>'+t("spin")+'</small></button><button id="daJump" class="da-jump">⬆<small>'+t("jump")+'</small></button></div>'+
      '<div class="da-tip">'+t("tip")+'</div>'+
    '</div>';

  const style=document.createElement("style");
  style.id="diamondAdventureStyle";
  style.textContent=
    ".da-shell{min-height:100%;box-sizing:border-box;padding:8px;background:linear-gradient(180deg,#06162d,#102a43);color:#fff;font-family:system-ui,sans-serif}"+
    ".da-top,.da-hud{max-width:980px;margin:0 auto 7px;display:flex;align-items:center;justify-content:space-between;gap:7px}"+
    ".da-top strong{font-size:17px;letter-spacing:.06em;text-align:center}.da-small{border:1px solid rgba(255,255,255,.25);background:rgba(2,6,23,.72);color:#fff;border-radius:13px;padding:9px 10px;font-weight:900}"+
    ".da-hud{background:rgba(2,6,23,.55);border:1px solid rgba(125,211,252,.25);padding:8px 10px;border-radius:14px;font-size:12px;font-weight:900;flex-wrap:wrap}"+
    ".da-wrap{position:relative;max-width:980px;margin:auto;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.2);box-shadow:0 16px 38px rgba(0,0,0,.35)}"+
    ".da-wrap canvas{display:block;width:100%;height:auto;aspect-ratio:3/2;touch-action:none;background:#38bdf8}"+
    ".da-message{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;text-align:center;padding:22px;background:rgba(2,6,23,.82);backdrop-filter:blur(5px);font-weight:900;font-size:20px}"+
    ".da-message.hidden{display:none}.da-message .actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:center}.da-message button{border:0;border-radius:14px;padding:11px 16px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;font-weight:900}.da-message button.alt{background:#111827;border:1px solid rgba(255,255,255,.25)}"+
    ".da-controls{max-width:720px;margin:7px auto 0;display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:end;user-select:none}.da-move{display:grid;grid-template-columns:1fr 1fr;gap:9px}.da-controls button{height:68px;border:1px solid rgba(255,255,255,.28);border-radius:22px;background:linear-gradient(160deg,#1e3a8a,#312e81);color:#fff;font-size:27px;font-weight:950;box-shadow:0 8px 18px rgba(0,0,0,.28);touch-action:none}.da-controls button small{display:block;font-size:10px}.da-spin,.da-jump{width:78px}.da-spin{background:linear-gradient(160deg,#0ea5e9,#2563eb)!important;border-radius:50%!important}.da-jump{background:linear-gradient(160deg,#f59e0b,#ea580c)!important;border-radius:50%!important}.da-tip{text-align:center;max-width:900px;margin:6px auto 0;font-size:11px;opacity:.86}"+
    "@media(max-width:560px){.da-shell{padding:5px}.da-wrap canvas{min-height:410px;object-fit:fill}.da-controls{grid-template-columns:1fr 62px 62px;gap:7px}.da-controls button{height:60px}.da-spin,.da-jump{width:60px}.da-top strong{font-size:14px}.da-small{padding:7px;font-size:11px}}";
  document.getElementById("diamondAdventureStyle")?.remove();
  document.head.appendChild(style);

  const canvas=document.getElementById("daCanvas");
  const ctx=canvas.getContext("2d");
  const msg=document.getElementById("daMessage");

  function hud(){
    document.getElementById("daLevel").textContent="🏁 "+t("level")+" "+(stageIndex+1)+"/5";
    document.getElementById("daLives").textContent="❤️ "+t("lives")+": "+lives;
    document.getElementById("daDiamonds").textContent="💎 "+t("diamonds")+": "+diamonds;
    document.getElementById("daScore").textContent="⭐ "+t("score")+": "+score;
    document.getElementById("daShield").textContent=player.shield>0?"🛡️ "+player.shield:"";
  }
  function save(){
    writeProgress({stageIndex:stageIndex,lives:lives,diamonds:diamonds,score:score,nextLifeAt:nextLifeAt,updatedAt:Date.now()});
  }
  function hideMessage(){msg.classList.add("hidden");msg.innerHTML="";}
  function showMessage(textValue,primary,primaryFn,secondary,secondaryFn){
    paused=true;msg.classList.remove("hidden");
    msg.innerHTML='<div>'+textValue+'</div><div class="actions"><button id="daPrimary">'+primary+'</button>'+(secondary?'<button id="daSecondary" class="alt">'+secondary+'</button>':'')+'</div>';
    document.getElementById("daPrimary").onclick=primaryFn;
    const s=document.getElementById("daSecondary");if(s)s.onclick=secondaryFn;
  }
  function resetPlayer(){
    player.x=respawnX;player.y=respawnY;player.vx=0;player.vy=0;player.spin=0;invuln=1.15;
  }
  function loadStage(index,doSave){
    stageIndex=index;stage=stageData(index);camera=0;respawnX=90;respawnY=450;paused=false;ended=false;speedBoost=0;player.shield=0;resetPlayer();hideMessage();hud();if(doSave!==false)save();
  }
  function resumePrompt(saved){
    showMessage("👤 "+playerName()+"<br>🏁 "+t("level")+" "+(saved.stageIndex+1)+"/5",t("continueFrom")+" "+(saved.stageIndex+1),function(){
      lives=Math.max(1,Number(saved.lives)||3);diamonds=Math.max(0,Number(saved.diamonds)||0);score=Math.max(0,Number(saved.score)||0);nextLifeAt=Math.max(100,Number(saved.nextLifeAt)||100);loadStage(saved.stageIndex,true);
    },t("restart"),function(){clearProgress();lives=3;diamonds=0;score=0;nextLifeAt=100;loadStage(0,true);});
  }
  function damage(){
    if(invuln>0||ended)return;
    audio.hit();
    if(player.shield>0){player.shield--;invuln=1.1;hud();save();return;}
    lives--;hud();
    if(lives<=0){
      lives=3;save();
      showMessage(t("lost")+"<br>🏁 "+t("level")+" "+(stageIndex+1),t("again"),function(){loadStage(stageIndex,true);});
    }else{resetPlayer();save();}
  }
  function addDiamonds(n){
    diamonds+=n;score+=n*20;
    while(diamonds>=nextLifeAt){lives++;nextLifeAt+=100;audio.power();}
    hud();
  }
  function breakBox(b){
    if(b.broken)return;b.broken=true;audio.box();score+=70;
    if(b.type==="diamond")addDiamonds(5);
    else if(b.type==="shield"){player.shield=Math.min(3,player.shield+1);audio.power();}
    else if(b.type==="life"){lives++;audio.power();}
    else if(b.type==="speed"){speedBoost=8;audio.power();}
    hud();save();
  }
  function nextStage(){
    if(ended)return;ended=true;audio.win();score+=500+stageIndex*150;hud();
    if(stageIndex>=4){
      clearProgress();
      showMessage(t("win")+"<br>⭐ "+score+" · 💎 "+diamonds,t("again"),function(){lives=3;diamonds=0;score=0;nextLifeAt=100;loadStage(0,true);});
    }else{
      const next=stageIndex+1;
      writeProgress({stageIndex:next,lives:lives,diamonds:diamonds,score:score,nextLifeAt:nextLifeAt,updatedAt:Date.now()});
      showMessage("✅ "+t("level")+" "+(stageIndex+1),t("next"),function(){loadStage(next,true);});
    }
  }
  function jump(){if(player.onGround&&!paused){player.vy=-670;player.onGround=false;audio.jump();}}
  function spin(){if(paused||ended||player.spin>0)return;player.spin=.48;audio.spin();}

  function update(dt){
    if(paused||ended)return;
    if(invuln>0)invuln-=dt;if(player.spin>0)player.spin-=dt;if(speedBoost>0)speedBoost-=dt;
    const max=speedBoost>0?360:285,acc=1500,fric=1800;
    if(input.left){player.vx=Math.max(-max,player.vx-acc*dt);player.facing=-1;}
    else if(input.right){player.vx=Math.min(max,player.vx+acc*dt);player.facing=1;}
    else if(player.vx>0)player.vx=Math.max(0,player.vx-fric*dt);else if(player.vx<0)player.vx=Math.min(0,player.vx+fric*dt);
    if(input.jumpPressed){input.jumpPressed=false;jump();}
    if(input.spinPressed){input.spinPressed=false;spin();}
    player.vy+=1550*dt;
    player.x+=player.vx*dt;
    for(const s of stage.solids)if(hit(player,s)){if(player.vx>0)player.x=s.x-player.w;else if(player.vx<0)player.x=s.x+s.w;player.vx=0;}
    player.x=clamp(player.x,0,stage.width-player.w);
    const prevBottom=player.y+player.h;player.y+=player.vy*dt;player.onGround=false;
    for(const s of stage.solids)if(hit(player,s)){
      if(player.vy>0&&prevBottom<=s.y+14){player.y=s.y-player.h;player.vy=0;player.onGround=true;}
      else if(player.vy<0){player.y=s.y+s.h;player.vy=0;}
    }
    if(player.y>760){damage();resetPlayer();}

    for(const d of stage.diamonds)if(!d.taken&&player.x+player.w>d.x-d.r&&player.x<d.x+d.r&&player.y+player.h>d.y-d.r&&player.y<d.y+d.r){d.taken=true;addDiamonds(1);audio.diamond();}
    for(const b of stage.boxes)if(!b.broken&&hit(player,b)){
      const fromBelow=player.vy<0&&player.y>b.y+b.h-22;
      if(player.spin>0||fromBelow)breakBox(b);
    }
    for(const e of stage.enemies){
      if(e.dead)continue;e.x+=e.vx*dt;if(e.x<e.min){e.x=e.min;e.vx=Math.abs(e.vx);}if(e.x>e.max){e.x=e.max;e.vx=-Math.abs(e.vx);}
      if(hit(player,e)){
        if(player.spin>0){e.dead=true;score+=120;audio.enemy();hud();}
        else if(player.vy>110&&prevBottom<=e.y+18){e.dead=true;player.vy=-410;score+=120;audio.enemy();hud();}
        else damage();
      }
    }
    for(const sp of stage.spikes)if(hit(player,sp))damage();

    if(stage.boss&&!stage.boss.dead){
      const b=stage.boss;b.x+=b.vx*dt;if(b.x<b.min){b.x=b.min;b.vx=Math.abs(b.vx);}if(b.x>b.max){b.x=b.max;b.vx=-Math.abs(b.vx);}
      if(b.hitCooldown>0)b.hitCooldown-=dt;
      if(hit(player,b)){
        if(player.spin>0&&b.hitCooldown<=0){b.hp--;b.hitCooldown=.7;score+=250;audio.enemy();player.vx=-player.facing*180;if(b.hp<=0){b.dead=true;score+=1000;audio.win();}hud();}
        else if(player.vy>120&&prevBottom<=b.y+20&&b.hitCooldown<=0){b.hp--;b.hitCooldown=.7;player.vy=-480;score+=250;audio.enemy();if(b.hp<=0){b.dead=true;score+=1000;audio.win();}hud();}
        else damage();
      }
    }
    if(player.x+player.w>stage.finish&&(!stage.boss||stage.boss.dead))nextStage();
    const target=clamp(player.x-300,0,Math.max(0,stage.width-canvas.width));camera+=(target-camera)*Math.min(1,dt*6);
  }

  function drawDiamond(x,y,r){
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle="#67e8f9";ctx.shadowColor="#e0f2fe";ctx.shadowBlur=16;ctx.fillRect(-r*.72,-r*.72,r*1.44,r*1.44);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.strokeRect(-r*.72,-r*.72,r*1.44,r*1.44);ctx.restore();
  }
  function drawBg(){
    const th=stage.theme,g=ctx.createLinearGradient(0,0,0,640);g.addColorStop(0,th.sky1);g.addColorStop(1,th.sky2);ctx.fillStyle=g;ctx.fillRect(0,0,960,640);
    ctx.globalAlpha=.3;ctx.fillStyle="#fff";for(let i=0;i<18;i++){const x=(i*137-camera*.08)%1200;const y=45+(i*71)%320;ctx.beginPath();ctx.arc(x,y,2+(i%3),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    ctx.fillStyle="rgba(15,23,42,.18)";ctx.beginPath();ctx.moveTo(0,540);for(let x=0;x<=1000;x+=130)ctx.lineTo(x,350+((x/130)%3)*55);ctx.lineTo(1000,640);ctx.lineTo(0,640);ctx.fill();
  }
  function drawWorld(){
    ctx.save();ctx.translate(-camera,0);const th=stage.theme;
    for(const s of stage.solids){ctx.fillStyle=s.y>=stage.groundY?th.ground:"rgba(71,85,105,.85)";ctx.fillRect(s.x,s.y,s.w,s.h);ctx.fillStyle=s.y>=stage.groundY?th.top:th.accent;ctx.fillRect(s.x,s.y,s.w,7);}
    for(const sp of stage.spikes){ctx.fillStyle="#ef4444";for(let x=sp.x;x<sp.x+sp.w;x+=18){ctx.beginPath();ctx.moveTo(x,sp.y+sp.h);ctx.lineTo(x+9,sp.y);ctx.lineTo(x+18,sp.y+sp.h);ctx.fill();}}
    for(const d of stage.diamonds)if(!d.taken)drawDiamond(d.x,d.y,d.r);
    for(const b of stage.boxes)if(!b.broken){ctx.fillStyle=b.type==="diamond"?"#a16207":b.type==="shield"?"#2563eb":b.type==="life"?"#dc2626":b.type==="speed"?"#7c3aed":"#92400e";ctx.fillRect(b.x,b.y,b.w,b.h);ctx.strokeStyle="#fde68a";ctx.lineWidth=3;ctx.strokeRect(b.x+3,b.y+3,b.w-6,b.h-6);ctx.fillStyle="#fff";ctx.font="20px system-ui";ctx.fillText(b.type==="diamond"?"💎":b.type==="shield"?"🛡️":b.type==="life"?"❤️":"⚡",b.x+8,b.y+27);}
    for(const e of stage.enemies)if(!e.dead){ctx.fillStyle="#ea580c";ctx.beginPath();ctx.arc(e.x+19,e.y+20,19,0,Math.PI*2);ctx.fill();ctx.fillStyle="#111827";ctx.fillRect(e.x+8,e.y+13,6,6);ctx.fillRect(e.x+24,e.y+13,6,6);ctx.fillStyle="#fff";ctx.fillRect(e.x+10,e.y+15,2,2);ctx.fillRect(e.x+26,e.y+15,2,2);}
    if(stage.boss&&!stage.boss.dead){const b=stage.boss;ctx.fillStyle="#991b1b";ctx.beginPath();ctx.arc(b.x+b.w/2,b.y+b.h/2,b.w/2,0,Math.PI*2);ctx.fill();ctx.fillStyle="#f97316";for(let a=0;a<8;a++){const ang=a*Math.PI/4;ctx.beginPath();ctx.moveTo(b.x+b.w/2+Math.cos(ang)*40,b.y+b.h/2+Math.sin(ang)*40);ctx.lineTo(b.x+b.w/2+Math.cos(ang-.18)*58,b.y+b.h/2+Math.sin(ang-.18)*58);ctx.lineTo(b.x+b.w/2+Math.cos(ang+.18)*58,b.y+b.h/2+Math.sin(ang+.18)*58);ctx.fill();}ctx.fillStyle="#fff";ctx.font="bold 16px system-ui";ctx.fillText(t("boss")+" "+b.hp+"/"+b.maxHp,b.x-5,b.y-12);}
    ctx.fillStyle="#f8fafc";ctx.fillRect(stage.finish,stage.groundY-145,6,145);ctx.fillStyle=th.accent;ctx.beginPath();ctx.moveTo(stage.finish+6,stage.groundY-140);ctx.lineTo(stage.finish+62,stage.groundY-120);ctx.lineTo(stage.finish+6,stage.groundY-100);ctx.fill();

    ctx.save();if(invuln>0&&Math.floor(invuln*12)%2===0)ctx.globalAlpha=.35;ctx.translate(player.x+player.w/2,player.y+player.h/2);ctx.scale(player.facing,1);
    if(player.spin>0)ctx.rotate((.48-player.spin)*18);
    ctx.fillStyle="#1d4ed8";ctx.fillRect(-15,-6,30,34);ctx.fillStyle="#0f172a";ctx.fillRect(-14,28,10,8);ctx.fillRect(4,28,10,8);ctx.fillStyle="#f2c7a7";ctx.beginPath();ctx.arc(0,-19,13,0,Math.PI*2);ctx.fill();ctx.fillStyle="#111827";ctx.beginPath();ctx.moveTo(-13,-29);ctx.lineTo(-3,-40);ctx.lineTo(2,-30);ctx.lineTo(11,-39);ctx.lineTo(13,-26);ctx.fill();drawDiamond(0,7,6);if(player.shield>0){ctx.strokeStyle="#67e8f9";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.stroke();}ctx.restore();
    ctx.restore();
  }
  function draw(){drawBg();drawWorld();}
  function loop(now){const dt=Math.min(.033,(now-last)/1000||.016);last=now;update(dt);draw();raf=requestAnimationFrame(loop);}

  function downKey(e){if(["ArrowLeft","a","A"].includes(e.key)){input.left=true;e.preventDefault();}if(["ArrowRight","d","D"].includes(e.key)){input.right=true;e.preventDefault();}if(["ArrowUp"," ","w","W"].includes(e.key)){if(!input.jump)input.jumpPressed=true;input.jump=true;e.preventDefault();}if(["x","X","Enter"].includes(e.key)){input.spinPressed=true;e.preventDefault();}}
  function upKey(e){if(["ArrowLeft","a","A"].includes(e.key))input.left=false;if(["ArrowRight","d","D"].includes(e.key))input.right=false;if(["ArrowUp"," ","w","W"].includes(e.key))input.jump=false;}
  window.addEventListener("keydown",downKey);window.addEventListener("keyup",upKey);

  function bindHold(id,key){
    const el=document.getElementById(id);
    const down=function(e){e.preventDefault();if(key==="jump"){if(!input.jump)input.jumpPressed=true;input.jump=true;}else if(key==="spin"){input.spinPressed=true;}else input[key]=true;};
    const up=function(e){e.preventDefault();if(key==="jump")input.jump=false;else if(key!=="spin")input[key]=false;};
    el.addEventListener("pointerdown",down);el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);el.addEventListener("pointerleave",up);
  }
  bindHold("daLeft","left");bindHold("daRight","right");bindHold("daJump","jump");bindHold("daSpin","spin");

  document.getElementById("daPause").onclick=function(){paused=!paused;this.textContent=paused?"▶":"⏸";};
  function cleanup(){save();cancelAnimationFrame(raf);window.removeEventListener("keydown",downKey);window.removeEventListener("keyup",upKey);document.getElementById("diamondAdventureStyle")?.remove();}
  document.getElementById("daBack").onclick=function(){cleanup();if(typeof onBack==="function")onBack();};

  hud();
  const saved=readProgress();
  if(saved&&Number.isInteger(saved.stageIndex)&&saved.stageIndex>0&&saved.stageIndex<5)resumePrompt(saved);
  raf=requestAnimationFrame(loop);
}
