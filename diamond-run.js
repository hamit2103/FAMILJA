const LANG_KEY="pajaziti-lang";
const PROGRESS_PREFIX="diamond-run-progress-v2:";
const TEXT={
sq:{title:"DIAMOND RUN",level:"Niveli",lives:"Jetë",diamonds:"Diamante",score:"Pikë",pause:"Pauzë",resume:"Vazhdo",back:"Kthehu te lojërat",restart:"Luaj përsëri",next:"Niveli tjetër",win:"Urime! I përfundove të gjitha nivelet.",lost:"Mbaruan jetët.",checkpoint:"Checkpoint!",tip:"Lëviz me pullat në të djathtë, kërce majtas. Merr 2 diamantet e mëdha: i pari të rrit, i dyti të jep armën.",player:"Lojtari",continueFrom:"Vazhdo nga niveli",startOver:"Fillo nga fillimi",saved:"Progresi ruhet automatikisht",big:"I madh",armed:"I armatosur",small:"I vogël",shoot:"Gjuaj"},
de:{title:"DIAMOND RUN",level:"Level",lives:"Leben",diamonds:"Diamanten",score:"Punkte",pause:"Pause",resume:"Weiter",back:"Zurück zu den Spielen",restart:"Nochmal spielen",next:"Nächstes Level",win:"Glückwunsch! Du hast alle Level geschafft.",lost:"Keine Leben mehr.",checkpoint:"Checkpoint!",tip:"Bewege dich mit den Tasten rechts und springe links. Sammle 2 große Diamanten: der erste macht dich groß, der zweite gibt dir die Waffe.",player:"Spieler",continueFrom:"Weiter ab Level",startOver:"Von vorne beginnen",saved:"Fortschritt wird automatisch gespeichert",big:"Groß",armed:"Bewaffnet",small:"Klein",shoot:"Schießen"},
tr:{title:"DIAMOND RUN",level:"Bölüm",lives:"Can",diamonds:"Elmas",score:"Puan",pause:"Duraklat",resume:"Devam",back:"Oyunlara dön",restart:"Tekrar oyna",next:"Sonraki bölüm",win:"Tebrikler! Tüm bölümleri tamamladın.",lost:"Canların bitti.",checkpoint:"Kontrol noktası!",tip:"Sağdaki tuşlarla hareket et, soldan zıpla. 2 büyük elması al: ilki seni büyütür, ikincisi silah verir.",player:"Oyuncu",continueFrom:"Bu bölümden devam et",startOver:"Baştan başla",saved:"İlerleme otomatik kaydedilir",big:"Büyük",armed:"Silahlı",small:"Küçük",shoot:"Ateş"},
en:{title:"DIAMOND RUN",level:"Level",lives:"Lives",diamonds:"Diamonds",score:"Score",pause:"Pause",resume:"Resume",back:"Back to games",restart:"Play again",next:"Next level",win:"Congratulations! You finished every level.",lost:"No lives left.",checkpoint:"Checkpoint!",tip:"Move with the buttons on the right and jump on the left. Collect 2 large diamonds: the first makes you big, the second gives you a weapon.",player:"Player",continueFrom:"Continue from level",startOver:"Start from the beginning",saved:"Progress is saved automatically",big:"Big",armed:"Armed",small:"Small",shoot:"Shoot"},
it:{title:"DIAMOND RUN",level:"Livello",lives:"Vite",diamonds:"Diamanti",score:"Punti",pause:"Pausa",resume:"Continua",back:"Torna ai giochi",restart:"Gioca ancora",next:"Livello successivo",win:"Complimenti! Hai completato tutti i livelli.",lost:"Vite finite.",checkpoint:"Checkpoint!",tip:"Muoviti con i pulsanti a destra e salta a sinistra. Raccogli 2 diamanti grandi: il primo ti ingrandisce, il secondo ti dà l'arma.",player:"Giocatore",continueFrom:"Continua dal livello",startOver:"Ricomincia dall'inizio",saved:"I progressi vengono salvati automaticamente",big:"Grande",armed:"Armato",small:"Piccolo",shoot:"Spara"},
hr:{title:"DIAMOND RUN",level:"Razina",lives:"Životi",diamonds:"Dijamanti",score:"Bodovi",pause:"Pauza",resume:"Nastavi",back:"Natrag na igre",restart:"Igraj ponovno",next:"Sljedeća razina",win:"Čestitamo! Završio si sve razine.",lost:"Nema više života.",checkpoint:"Kontrolna točka!",tip:"Kreći se tipkama desno i skači lijevo. Uzmi 2 velika dijamanta: prvi te povećava, drugi ti daje oružje.",player:"Igrač",continueFrom:"Nastavi od razine",startOver:"Počni ispočetka",saved:"Napredak se automatski sprema",big:"Velik",armed:"Naoružan",small:"Malen",shoot:"Pucaj"},
fr:{title:"DIAMOND RUN",level:"Niveau",lives:"Vies",diamonds:"Diamants",score:"Score",pause:"Pause",resume:"Continuer",back:"Retour aux jeux",restart:"Rejouer",next:"Niveau suivant",win:"Bravo ! Vous avez terminé tous les niveaux.",lost:"Plus de vies.",checkpoint:"Point de contrôle !",tip:"Déplacez-vous avec les boutons à droite et sautez à gauche. Prenez 2 gros diamants : le premier vous agrandit, le second donne l'arme.",player:"Joueur",continueFrom:"Continuer au niveau",startOver:"Recommencer depuis le début",saved:"La progression est enregistrée automatiquement",big:"Grand",armed:"Armé",small:"Petit",shoot:"Tirer"},
ar:{title:"DIAMOND RUN",level:"المستوى",lives:"الحياة",diamonds:"الألماس",score:"النقاط",pause:"إيقاف",resume:"متابعة",back:"العودة للألعاب",restart:"العب مجدداً",next:"المستوى التالي",win:"تهانينا! أنهيت جميع المستويات.",lost:"انتهت الأرواح.",checkpoint:"نقطة حفظ!",tip:"تحرك بأزرار اليمين واقفز بزر اليسار. اجمع الماستين كبيرتين: الأولى تكبّرك والثانية تمنحك السلاح.",player:"اللاعب",continueFrom:"متابعة من المستوى",startOver:"ابدأ من البداية",saved:"يتم حفظ التقدم تلقائياً",big:"كبير",armed:"مسلح",small:"صغير",shoot:"إطلاق"}
};
function lang(){const l=localStorage.getItem(LANG_KEY)||localStorage.getItem("pajaziti-language")||"sq";return TEXT[l]?l:"sq";}
function t(k){return TEXT[lang()][k]||TEXT.sq[k]||k;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rectHit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function safeName(){
  return (localStorage.getItem("pajaziti-global-user-name")||localStorage.getItem("pajaziti-war-name")||t("player")).trim().slice(0,24)||t("player");
}
function progressKey(){return PROGRESS_PREFIX+safeName().toLowerCase();}
function readProgress(){
  try{
    const p=JSON.parse(localStorage.getItem(progressKey())||"null");
    if(!p||!Number.isInteger(p.levelIndex)||p.levelIndex<0||p.levelIndex>4)return null;
    return p;
  }catch(_){return null;}
}
function writeProgress(data){
  try{localStorage.setItem(progressKey(),JSON.stringify(data));}catch(_){}
}
function clearProgress(){try{localStorage.removeItem(progressKey());}catch(_){}}

function levelData(index){
  const n=index+1;
  const width=2600+index*420;
  const floorY=635;
  const gaps=[
    [[720,850],[1650,1760]],
    [[520,660],[1260,1410],[2260,2390]],
    [[860,1020],[1520,1690],[2520,2700]],
    [[610,760],[1320,1490],[2050,2240],[3000,3180]],
    [[820,990],[1640,1810],[2460,2660],[3300,3510]]
  ][index];
  const solids=[];
  let cur=0;
  for(const g of gaps){
    if(g[0]>cur)solids.push({x:cur,y:floorY,w:g[0]-cur,h:95});
    cur=g[1];
  }
  if(cur<width)solids.push({x:cur,y:floorY,w:width-cur,h:95});
  const rawPlatSets=[
    [[330,390,170],[900,350,190],[1210,300,160],[1830,365,210],[2180,315,180]],
    [[250,360,160],[720,330,190],[1030,275,160],[1490,355,170],[1840,300,190],[2420,350,160]],
    [[300,360,180],[620,300,160],[1080,350,200],[1390,280,170],[1770,330,180],[2130,270,160],[2770,340,190]],
    [[260,350,160],[820,315,170],[1120,250,150],[1540,345,200],[1900,285,160],[2290,350,190],[2720,300,170],[3240,345,190]],
    [[220,360,170],[560,300,180],[1060,345,190],[1380,270,160],[1880,335,190],[2200,265,160],[2720,350,200],[3050,285,170],[3570,335,190]]
  ][index];
  const platSets=rawPlatSets.map(p=>[p[0],p[1]+145,p[2]]);
  for(const p of platSets)solids.push({x:p[0],y:p[1],w:p[2],h:22});
  const diamonds=[];
  for(let x=180;x<width-180;x+=220){
    const y=500-((x/220)%3)*35;
    diamonds.push({x:x,y:y,r:11,taken:false});
  }
  for(const p of platSets)diamonds.push({x:p[0]+p[2]/2,y:p[1]-34,r:11,taken:false});
  const p1=platSets[Math.min(1,platSets.length-1)];
  const p2=platSets[Math.max(2,Math.floor(platSets.length*.62))];
  const powerDiamonds=[
    {x:p1[0]+p1[2]/2,y:p1[1]-64,r:23,taken:false},
    {x:p2[0]+p2[2]/2,y:p2[1]-64,r:23,taken:false}
  ];
  const enemies=[];
  const enemyCount=4+index*2;
  for(let i=0;i<enemyCount;i++){
    const x=450+i*((width-850)/enemyCount);
    enemies.push({x:x,y:floorY-34,w:34,h:34,vx:(i%2?1:-1)*(55+index*8),min:x-90,max:x+90,dead:false});
  }
  const spikes=[];
  for(let i=0;i<2+index;i++){
    const x=1050+i*620+(index%2)*90;
    spikes.push({x:x,y:floorY-24,w:54,h:24});
  }
  const checkpoints=[{x:Math.floor(width*.38),active:false},{x:Math.floor(width*.70),active:false}];
  return {n,width,floorY,solids,diamonds,powerDiamonds,enemies,spikes,checkpoints,finish:width-120};
}

function makeAudio(){
  let ctx=null;
  function tone(freq,dur,type,vol){
    try{
      ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==="suspended")ctx.resume();
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type=type||"sine";o.frequency.value=freq;g.gain.value=vol||.035;
      o.connect(g);g.connect(ctx.destination);o.start();
      g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+dur);
      o.stop(ctx.currentTime+dur);
    }catch(_){}
  }
  return {
    jump(){tone(460,.09,"square",.025);},
    coin(){tone(820,.08,"sine",.025);setTimeout(()=>tone(1060,.07,"sine",.02),55);},
    power(){tone(520,.08,"sine",.03);setTimeout(()=>tone(760,.08,"sine",.03),70);setTimeout(()=>tone(1040,.1,"sine",.025),140);},
    shot(){tone(300,.05,"square",.025);},
    hit(){tone(120,.18,"sawtooth",.04);},
    stomp(){tone(250,.07,"square",.03);},
    flag(){tone(620,.1,"sine",.03);setTimeout(()=>tone(820,.12,"sine",.03),100);}
  };
}

export function startDiamondRunGame(opts){
  const root=opts&&opts.root;
  const onBack=opts&&opts.onBack;
  if(!root)return;
  const audio=makeAudio();
  const userName=safeName();
  let levelIndex=0,level=levelData(0),raf=0,last=performance.now(),camera=0,paused=false,ended=false;
  let lives=3,score=0,totalDiamonds=0,respawnX=90,respawnY=520,invuln=0;
  let bullets=[],lastShotAt=0;
  const input={left:false,right:false,jump:false,jumpPressed:false};
  const player={x:90,y:520,w:34,h:46,vx:0,vy:0,onGround:false,facing:1,power:0};

  root.innerHTML='<div class="diamond-run-shell">'+
    '<div class="diamond-run-top"><button id="drBack" class="diamond-run-small">← '+t("back")+'</button><strong>💎 '+t("title")+'</strong><button id="drPause" class="diamond-run-small">⏸ '+t("pause")+'</button></div>'+
    '<div class="diamond-run-playerline"><span>👤 '+t("player")+': <b>'+escapeHtml(userName)+'</b></span><span>💾 '+t("saved")+'</span></div>'+
    '<div class="diamond-run-hud"><span id="drLevel"></span><span id="drLives"></span><span id="drDiamonds"></span><span id="drScore"></span><span id="drPower"></span></div>'+
    '<div class="diamond-run-canvas-wrap"><canvas id="diamondRunCanvas" width="960" height="720"></canvas><div id="drMessage" class="diamond-run-message hidden"></div></div>'+
    '<div class="diamond-run-controls"><button id="drJump" class="jump" aria-label="jump">⬆</button><div class="diamond-run-right-controls"><button id="drShoot" class="shoot hidden" aria-label="'+t("shoot")+'">💥</button><div class="diamond-run-move-pair"><button id="drLeft" aria-label="left">◀</button><button id="drRight" aria-label="right">▶</button></div></div></div>'+
    '<p class="diamond-run-tip">'+t("tip")+'</p>'+
    '</div>';

  const style=document.createElement("style");
  style.id="diamondRunStyle";
  style.textContent=".diamond-run-shell{min-height:100%;padding:10px 10px 18px;box-sizing:border-box;background:linear-gradient(180deg,#120b2d,#23104f 46%,#09182b);color:#fff;font-family:system-ui,sans-serif}.diamond-run-top,.diamond-run-hud,.diamond-run-playerline{display:flex;align-items:center;justify-content:space-between;gap:8px;max-width:980px;margin:0 auto 8px}.diamond-run-top strong{font-size:18px;letter-spacing:.08em;text-align:center}.diamond-run-small{border:1px solid rgba(255,255,255,.25);background:rgba(8,8,25,.72);color:#fff;border-radius:14px;padding:10px 12px;font-weight:900}.diamond-run-playerline{font-size:12px;opacity:.92;flex-wrap:wrap}.diamond-run-hud{background:rgba(8,8,25,.58);border:1px solid rgba(183,122,255,.28);border-radius:14px;padding:8px 10px;font-weight:900;font-size:13px;flex-wrap:wrap}.diamond-run-canvas-wrap{position:relative;max-width:980px;margin:auto;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.18);box-shadow:0 15px 38px rgba(0,0,0,.35);background:#071426}.diamond-run-canvas-wrap canvas{display:block;width:100%;height:auto;aspect-ratio:4/3;touch-action:none}.diamond-run-message{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;padding:24px;text-align:center;background:rgba(4,5,18,.82);backdrop-filter:blur(5px);font-weight:900;font-size:22px}.diamond-run-message.hidden{display:none}.diamond-run-message .dr-message-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.diamond-run-message button{border:0;border-radius:15px;padding:12px 18px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;font-weight:900;font-size:16px}.diamond-run-message button.secondary{background:rgba(15,23,42,.92);border:1px solid rgba(255,255,255,.28)}.diamond-run-tip{max-width:980px;margin:5px auto 0;text-align:center;font-size:12px;opacity:.86}.diamond-run-controls{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;max-width:680px;margin:5px auto 0;user-select:none}.diamond-run-controls button{border:1px solid rgba(255,255,255,.25);background:linear-gradient(160deg,#4c1d95,#312e81);color:#fff;font-size:28px;font-weight:950;box-shadow:inset 0 2px 0 rgba(255,255,255,.12),0 8px 18px rgba(0,0,0,.32);touch-action:none}.diamond-run-controls .jump{width:72px;height:72px;min-width:72px;border-radius:50%;background:linear-gradient(160deg,#7c3aed,#2563eb)}.diamond-run-right-controls{display:flex;flex-direction:column;align-items:flex-end;gap:8px}.diamond-run-move-pair{display:flex;gap:10px}.diamond-run-move-pair button{width:144px;height:72px;border-radius:24px}.diamond-run-controls .shoot{width:62px;height:62px;border-radius:50%;background:linear-gradient(160deg,#f59e0b,#ef4444);font-size:25px}.diamond-run-controls .hidden{visibility:hidden;pointer-events:none}@media(max-width:560px){.diamond-run-shell{padding-left:6px;padding-right:6px}.diamond-run-top strong{font-size:16px}.diamond-run-small{padding:9px 8px;font-size:12px}.diamond-run-canvas-wrap canvas{min-height:430px;object-fit:fill}.diamond-run-controls{max-width:100%;padding:0 8px}.diamond-run-controls .jump{width:66px;height:66px;min-width:66px}.diamond-run-move-pair button{width:118px;height:66px}.diamond-run-controls .shoot{width:56px;height:56px}}";
  document.getElementById("diamondRunStyle")?.remove();
  document.head.appendChild(style);

  const canvas=document.getElementById("diamondRunCanvas");
  const ctx=canvas.getContext("2d");
  const msg=document.getElementById("drMessage");
  const shootBtn=document.getElementById("drShoot");

  function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function powerText(){return player.power===2?"💎🔫 "+t("armed"):player.power===1?"💎 "+t("big"):"• "+t("small");}
  function hud(){
    document.getElementById("drLevel").textContent="🏁 "+t("level")+" "+level.n+"/5";
    document.getElementById("drLives").textContent="❤️ "+t("lives")+": "+lives;
    document.getElementById("drDiamonds").textContent="💎 "+t("diamonds")+": "+totalDiamonds;
    document.getElementById("drScore").textContent="⭐ "+t("score")+": "+score;
    document.getElementById("drPower").textContent=powerText();
    shootBtn.classList.toggle("hidden",player.power!==2);
  }
  function saveProgress(){
    writeProgress({levelIndex,lives,score,totalDiamonds,updatedAt:Date.now()});
  }
  function setPower(next,keepFeet=true){
    const foot=player.y+player.h;
    player.power=clamp(next,0,2);
    if(player.power>0){player.w=58;player.h=82;}else{player.w=34;player.h=46;}
    if(keepFeet)player.y=foot-player.h;
    hud();
  }
  function resetPlayer(){
    setPower(0,false);
    player.x=respawnX;player.y=respawnY;player.vx=0;player.vy=0;invuln=1.2;bullets=[];
  }
  function loadLevel(i,shouldSave=true){
    levelIndex=i;level=levelData(i);respawnX=90;respawnY=520;camera=0;ended=false;paused=false;bullets=[];
    resetPlayer();hud();hideMessage();
    if(shouldSave)saveProgress();
  }
  function hideMessage(){msg.classList.add("hidden");msg.innerHTML="";}
  function showMessage(text,buttonText,action){
    paused=true;msg.classList.remove("hidden");
    msg.innerHTML=`<div>${text}</div><div class="dr-message-actions"><button id="drMsgBtn">${buttonText}</button></div>`;
    document.getElementById("drMsgBtn").onclick=action;
  }
  function showResumeChoice(saved){
    paused=true;msg.classList.remove("hidden");
    msg.innerHTML=`<div>👤 ${escapeHtml(userName)}<br>🏁 ${t("level")} ${saved.levelIndex+1}/5</div><div class="dr-message-actions"><button id="drContinue">▶ ${t("continueFrom")} ${saved.levelIndex+1}</button><button id="drRestartSaved" class="secondary">↺ ${t("startOver")}</button></div>`;
    document.getElementById("drContinue").onclick=function(){
      lives=clamp(Number(saved.lives)||3,1,9);
      score=Math.max(0,Number(saved.score)||0);
      totalDiamonds=Math.max(0,Number(saved.totalDiamonds)||0);
      loadLevel(saved.levelIndex,true);
    };
    document.getElementById("drRestartSaved").onclick=function(){
      clearProgress();lives=3;score=0;totalDiamonds=0;loadLevel(0,true);
    };
  }
  function damage(){
    if(invuln>0||ended)return;
    audio.hit();
    if(player.power===2){
      setPower(1);invuln=1.2;saveProgress();return;
    }
    if(player.power===1){
      setPower(0);invuln=1.2;saveProgress();return;
    }
    lives--;hud();
    if(lives<=0){
      ended=true;
      clearProgress();
      showMessage(t("lost"),t("restart"),function(){lives=3;score=0;totalDiamonds=0;loadLevel(0,true);});
    }else{
      resetPlayer();saveProgress();
    }
  }
  function nextLevel(){
    if(ended)return;
    ended=true;audio.flag();score+=500+levelIndex*150;hud();
    if(levelIndex>=4){
      clearProgress();
      showMessage(t("win")+"<br>⭐ "+score+" · 💎 "+totalDiamonds,t("restart"),function(){lives=3;score=0;totalDiamonds=0;loadLevel(0,true);});
    }else{
      const next=levelIndex+1;
      writeProgress({levelIndex:next,lives,score,totalDiamonds,updatedAt:Date.now()});
      showMessage("✅ "+t("level")+" "+level.n+"!",t("next"),function(){loadLevel(next,true);});
    }
  }
  function jump(){if(player.onGround&&!paused){player.vy=-650;player.onGround=false;audio.jump();}}
  function shoot(){
    if(paused||ended||player.power!==2)return;
    const now=performance.now();
    if(now-lastShotAt<240)return;
    lastShotAt=now;
    bullets.push({x:player.facing>0?player.x+player.w+3:player.x-13,y:player.y+player.h*.48,w:14,h:6,vx:player.facing*720});
    audio.shot();
  }

  function update(dt){
    if(paused||ended)return;
    if(invuln>0)invuln-=dt;
    const ax=1450,max=270,fric=1750;
    if(input.left){player.vx=Math.max(-max,player.vx-ax*dt);player.facing=-1;}
    else if(input.right){player.vx=Math.min(max,player.vx+ax*dt);player.facing=1;}
    else{
      if(player.vx>0)player.vx=Math.max(0,player.vx-fric*dt);
      if(player.vx<0)player.vx=Math.min(0,player.vx+fric*dt);
    }
    if(input.jumpPressed){jump();input.jumpPressed=false;}
    player.vy+=1500*dt;
    player.x+=player.vx*dt;
    for(const s of level.solids){
      if(rectHit(player,s)){
        if(player.vx>0)player.x=s.x-player.w;
        else if(player.vx<0)player.x=s.x+s.w;
        player.vx=0;
      }
    }
    player.x=clamp(player.x,0,level.width-player.w);
    player.onGround=false;
    const prevBottom=player.y+player.h;
    player.y+=player.vy*dt;
    for(const s of level.solids){
      if(rectHit(player,s)){
        if(player.vy>0&&prevBottom<=s.y+12){player.y=s.y-player.h;player.vy=0;player.onGround=true;}
        else if(player.vy<0){player.y=s.y+s.h;player.vy=0;}
      }
    }
    if(player.y>800)damage();

    for(const d of level.diamonds){
      if(!d.taken&&player.x+player.w>d.x-d.r&&player.x<d.x+d.r&&player.y+player.h>d.y-d.r&&player.y<d.y+d.r){
        d.taken=true;totalDiamonds++;score+=25;audio.coin();hud();
      }
    }
    for(const d of level.powerDiamonds){
      if(!d.taken&&player.x+player.w>d.x-d.r&&player.x<d.x+d.r&&player.y+player.h>d.y-d.r&&player.y<d.y+d.r){
        d.taken=true;totalDiamonds++;score+=150;setPower(Math.min(2,player.power+1));audio.power();saveProgress();
      }
    }

    for(const e of level.enemies){
      if(e.dead)continue;
      e.x+=e.vx*dt;
      if(e.x<e.min){e.x=e.min;e.vx=Math.abs(e.vx);}
      if(e.x>e.max){e.x=e.max;e.vx=-Math.abs(e.vx);}
      if(rectHit(player,e)){
        if(player.vy>100&&prevBottom<=e.y+16){
          e.dead=true;player.vy=-390;score+=100;audio.stomp();hud();saveProgress();
        }else damage();
      }
    }

    for(const b of bullets){
      b.x+=b.vx*dt;
      for(const e of level.enemies){
        if(!e.dead&&rectHit(b,e)){
          e.dead=true;b.dead=true;score+=120;audio.stomp();hud();saveProgress();break;
        }
      }
    }
    bullets=bullets.filter(b=>!b.dead&&b.x>camera-80&&b.x<camera+canvas.width+120);

    for(const sp of level.spikes)if(rectHit(player,sp))damage();
    for(const cp of level.checkpoints){
      if(!cp.active&&player.x>cp.x){
        cp.active=true;respawnX=cp.x+24;respawnY=level.floorY-120;score+=80;hud();saveProgress();
      }
    }
    if(player.x+player.w>level.finish)nextLevel();
    const target=clamp(player.x-320,0,Math.max(0,level.width-canvas.width));
    camera+=(target-camera)*Math.min(1,dt*6);
  }

  function diamond(x,y,r,alpha){
    ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.translate(x,y);ctx.rotate(Math.PI/4);
    ctx.fillStyle="#7dd3fc";ctx.shadowColor="#c4b5fd";ctx.shadowBlur=r>15?26:18;
    ctx.fillRect(-r*.72,-r*.72,r*1.44,r*1.44);ctx.strokeStyle="#fff";ctx.lineWidth=r>15?3:2;
    ctx.strokeRect(-r*.72,-r*.72,r*1.44,r*1.44);ctx.restore();
  }
  function drawBg(){
    const g=ctx.createLinearGradient(0,0,0,720);
    g.addColorStop(0,"#13052f");g.addColorStop(.52,"#222b6a");g.addColorStop(1,"#0b1b2b");
    ctx.fillStyle=g;ctx.fillRect(0,0,960,720);
    ctx.globalAlpha=.7;
    for(let i=0;i<32;i++){const x=(i*97-camera*.08)%1100;const y=35+(i*53)%390;ctx.fillStyle=i%3?"#fff":"#c4b5fd";ctx.fillRect(x,y,2,2);}
    ctx.globalAlpha=1;
    ctx.fillStyle="#1b2a55";ctx.beginPath();ctx.moveTo(0,600);
    for(let x=0;x<=1000;x+=120)ctx.lineTo(x,390+((x/120)%2)*105);
    ctx.lineTo(1000,720);ctx.lineTo(0,720);ctx.fill();
    ctx.fillStyle="#12213f";ctx.beginPath();ctx.moveTo(0,640);
    for(let x=0;x<=1000;x+=95)ctx.lineTo(x,500+((x/95+1)%3)*35);
    ctx.lineTo(1000,720);ctx.lineTo(0,720);ctx.fill();
  }
  function drawWorld(){
    ctx.save();ctx.translate(-camera,0);
    for(const s of level.solids){
      ctx.fillStyle=s.y>=level.floorY?"#173f31":"#50307d";ctx.fillRect(s.x,s.y,s.w,s.h);
      ctx.fillStyle=s.y>=level.floorY?"#36a269":"#9d7be8";ctx.fillRect(s.x,s.y,s.w,7);
      if(s.y<level.floorY){
        ctx.globalAlpha=.24;ctx.fillStyle="#fff";
        for(let x=s.x+10;x<s.x+s.w;x+=26)ctx.fillRect(x,s.y+10,8,3);
        ctx.globalAlpha=1;
      }
    }
    for(const sp of level.spikes){
      ctx.fillStyle="#ef4444";
      for(let x=sp.x;x<sp.x+sp.w;x+=18){ctx.beginPath();ctx.moveTo(x,sp.y+sp.h);ctx.lineTo(x+9,sp.y);ctx.lineTo(x+18,sp.y+sp.h);ctx.fill();}
    }
    for(const d of level.diamonds)if(!d.taken)diamond(d.x,d.y,d.r,1);
    for(const d of level.powerDiamonds)if(!d.taken){
      ctx.save();ctx.shadowColor="#67e8f9";ctx.shadowBlur=24;diamond(d.x,d.y,d.r,1);ctx.restore();
    }
    for(const cp of level.checkpoints){
      ctx.fillStyle=cp.active?"#22c55e":"#fbbf24";
      ctx.fillRect(cp.x,level.floorY-80,5,80);
      ctx.beginPath();ctx.moveTo(cp.x+5,level.floorY-75);ctx.lineTo(cp.x+48,level.floorY-62);ctx.lineTo(cp.x+5,level.floorY-49);ctx.fill();
      if(cp.active)diamond(cp.x+25,level.floorY-88,7,.85);
    }
    for(const e of level.enemies){
      if(e.dead)continue;
      ctx.fillStyle="#ef6b4a";ctx.fillRect(e.x,e.y,e.w,e.h);ctx.fillStyle="#2b1028";
      ctx.fillRect(e.x+5,e.y+8,7,7);ctx.fillRect(e.x+22,e.y+8,7,7);ctx.fillStyle="#fff";
      ctx.fillRect(e.x+7,e.y+10,2,2);ctx.fillRect(e.x+24,e.y+10,2,2);ctx.fillStyle="#111827";
      ctx.fillRect(e.x+5,e.y+30,9,4);ctx.fillRect(e.x+20,e.y+30,9,4);
    }
    for(const b of bullets){
      ctx.fillStyle="#fde047";ctx.shadowColor="#f97316";ctx.shadowBlur=10;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.shadowBlur=0;
    }
    ctx.fillStyle="#e5e7eb";ctx.fillRect(level.finish,level.floorY-170,7,170);
    ctx.fillStyle="#8b5cf6";ctx.beginPath();ctx.moveTo(level.finish+7,level.floorY-165);ctx.lineTo(level.finish+70,level.floorY-145);ctx.lineTo(level.finish+7,level.floorY-125);ctx.fill();
    diamond(level.finish+31,level.floorY-145,9,1);

    ctx.save();
    if(invuln>0&&Math.floor(invuln*12)%2===0)ctx.globalAlpha=.35;
    ctx.translate(player.x+player.w/2,player.y+player.h/2);ctx.scale(player.facing,1);
    const scale=player.power>0?1.55:1;
    ctx.scale(scale,scale);
    ctx.fillStyle="#2563eb";ctx.fillRect(-13,-9,26,28);
    ctx.fillStyle="#111827";ctx.fillRect(-12,19,9,7);ctx.fillRect(3,19,9,7);
    ctx.fillStyle="#f2c7a7";ctx.beginPath();ctx.arc(0,-18,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#1e1b4b";ctx.fillRect(-12,-27,24,7);ctx.fillStyle="#fff";ctx.fillRect(4,-20,4,4);
    diamond(0,2,6,1);
    if(player.power===2){
      diamond(0,-39,9,1);
      ctx.fillStyle="#d1d5db";ctx.fillRect(12,-4,22,7);ctx.fillStyle="#111827";ctx.fillRect(28,-2,11,3);
    }
    ctx.restore();
    ctx.restore();
  }
  function draw(){drawBg();drawWorld();}
  function loop(now){
    const dt=Math.min(.033,(now-last)/1000||.016);last=now;update(dt);draw();raf=requestAnimationFrame(loop);
  }
  function keyDown(e){
    if(["ArrowLeft","a","A"].includes(e.key)){input.left=true;e.preventDefault();}
    if(["ArrowRight","d","D"].includes(e.key)){input.right=true;e.preventDefault();}
    if(["ArrowUp"," ","w","W"].includes(e.key)){if(!input.jump)input.jumpPressed=true;input.jump=true;e.preventDefault();}
    if(["x","X","Enter"].includes(e.key)){shoot();e.preventDefault();}
  }
  function keyUp(e){
    if(["ArrowLeft","a","A"].includes(e.key))input.left=false;
    if(["ArrowRight","d","D"].includes(e.key))input.right=false;
    if(["ArrowUp"," ","w","W"].includes(e.key))input.jump=false;
  }
  window.addEventListener("keydown",keyDown);
  window.addEventListener("keyup",keyUp);

  function bindHold(id,key){
    const el=document.getElementById(id);
    const down=function(e){
      e.preventDefault();
      if(key==="jump"){if(!input.jump)input.jumpPressed=true;input.jump=true;}else input[key]=true;
    };
    const up=function(e){e.preventDefault();if(key==="jump")input.jump=false;else input[key]=false;};
    el.addEventListener("pointerdown",down);el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);el.addEventListener("pointerleave",up);
  }
  bindHold("drLeft","left");bindHold("drRight","right");bindHold("drJump","jump");
  shootBtn.addEventListener("pointerdown",e=>{e.preventDefault();shoot();});
  canvas.addEventListener("pointerdown",e=>{if(player.power===2&&e.pointerType==="mouse")shoot();});

  document.getElementById("drPause").onclick=function(){
    paused=!paused;this.textContent=paused?"▶ "+t("resume"):"⏸ "+t("pause");
  };
  function cleanup(){
    if(!ended)saveProgress();
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown",keyDown);
    window.removeEventListener("keyup",keyUp);
    document.getElementById("diamondRunStyle")?.remove();
  }
  document.getElementById("drBack").onclick=function(){cleanup();if(typeof onBack==="function")onBack();};

  hud();
  const saved=readProgress();
  if(saved&&saved.levelIndex>0)showResumeChoice(saved);
  raf=requestAnimationFrame(loop);
}
