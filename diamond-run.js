const LANG_KEY="pajaziti-lang";
const TEXT={
sq:{title:"DIAMOND RUN",level:"Niveli",lives:"Jetë",diamonds:"Diamante",score:"Pikë",pause:"Pauzë",resume:"Vazhdo",back:"Kthehu te lojërat",start:"Fillo",restart:"Luaj përsëri",next:"Niveli tjetër",win:"Urime! I përfundove të gjitha nivelet.",lost:"Mbaruan jetët.",checkpoint:"Checkpoint!",tip:"Lëviz majtas/djathtas dhe kërce. Mblidh diamantet, shmang pengesat dhe arrij flamurin."},
de:{title:"DIAMOND RUN",level:"Level",lives:"Leben",diamonds:"Diamanten",score:"Punkte",pause:"Pause",resume:"Weiter",back:"Zurück zu den Spielen",start:"Start",restart:"Nochmal spielen",next:"Nächstes Level",win:"Glückwunsch! Du hast alle Level geschafft.",lost:"Keine Leben mehr.",checkpoint:"Checkpoint!",tip:"Bewege dich nach links/rechts und springe. Sammle Diamanten, meide Hindernisse und erreiche die Flagge."},
tr:{title:"DIAMOND RUN",level:"Bölüm",lives:"Can",diamonds:"Elmas",score:"Puan",pause:"Duraklat",resume:"Devam",back:"Oyunlara dön",start:"Başla",restart:"Tekrar oyna",next:"Sonraki bölüm",win:"Tebrikler! Tüm bölümleri tamamladın.",lost:"Canların bitti.",checkpoint:"Kontrol noktası!",tip:"Sağa/sola hareket et ve zıpla. Elmasları topla, engellerden kaç ve bayrağa ulaş."},
en:{title:"DIAMOND RUN",level:"Level",lives:"Lives",diamonds:"Diamonds",score:"Score",pause:"Pause",resume:"Resume",back:"Back to games",start:"Start",restart:"Play again",next:"Next level",win:"Congratulations! You finished every level.",lost:"No lives left.",checkpoint:"Checkpoint!",tip:"Move left/right and jump. Collect diamonds, avoid hazards and reach the flag."},
it:{title:"DIAMOND RUN",level:"Livello",lives:"Vite",diamonds:"Diamanti",score:"Punti",pause:"Pausa",resume:"Continua",back:"Torna ai giochi",start:"Inizia",restart:"Gioca ancora",next:"Livello successivo",win:"Complimenti! Hai completato tutti i livelli.",lost:"Vite finite.",checkpoint:"Checkpoint!",tip:"Muoviti a sinistra/destra e salta. Raccogli i diamanti, evita gli ostacoli e raggiungi la bandiera."},
hr:{title:"DIAMOND RUN",level:"Razina",lives:"Životi",diamonds:"Dijamanti",score:"Bodovi",pause:"Pauza",resume:"Nastavi",back:"Natrag na igre",start:"Počni",restart:"Igraj ponovno",next:"Sljedeća razina",win:"Čestitamo! Završio si sve razine.",lost:"Nema više života.",checkpoint:"Kontrolna točka!",tip:"Kreći se lijevo/desno i skači. Skupljaj dijamante, izbjegavaj prepreke i dođi do zastave."},
fr:{title:"DIAMOND RUN",level:"Niveau",lives:"Vies",diamonds:"Diamants",score:"Score",pause:"Pause",resume:"Continuer",back:"Retour aux jeux",start:"Commencer",restart:"Rejouer",next:"Niveau suivant",win:"Bravo ! Vous avez terminé tous les niveaux.",lost:"Plus de vies.",checkpoint:"Point de contrôle !",tip:"Déplacez-vous à gauche/droite et sautez. Ramassez les diamants, évitez les dangers et atteignez le drapeau."},
ar:{title:"DIAMOND RUN",level:"المستوى",lives:"الحياة",diamonds:"الألماس",score:"النقاط",pause:"إيقاف",resume:"متابعة",back:"العودة للألعاب",start:"ابدأ",restart:"العب مجدداً",next:"المستوى التالي",win:"تهانينا! أنهيت جميع المستويات.",lost:"انتهت الأرواح.",checkpoint:"نقطة حفظ!",tip:"تحرك يميناً ويساراً واقفز. اجمع الألماس وتجنب العقبات وصل إلى العلم."}
};
function lang(){const l=localStorage.getItem(LANG_KEY)||"sq";return TEXT[l]?l:"sq";}
function t(k){return TEXT[lang()][k]||TEXT.sq[k]||k;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rectHit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function levelData(index){
  const n=index+1;
  const width=2600+index*420;
  const floorY=470;
  const gaps=[
    [[720,850],[1650,1760]],
    [[520,660],[1260,1410],[2260,2390]],
    [[860,1020],[1520,1690],[2520,2700]],
    [[610,760],[1320,1490],[2050,2240],[3000,3180]],
    [[820,990],[1640,1810],[2460,2660],[3300,3510]]
  ][index];
  const solids=[];
  let cur=0;
  for(const g of gaps){if(g[0]>cur)solids.push({x:cur,y:floorY,w:g[0]-cur,h:80});cur=g[1];}
  if(cur<width)solids.push({x:cur,y:floorY,w:width-cur,h:80});
  const platSets=[
    [[330,390,170],[900,350,190],[1210,300,160],[1830,365,210],[2180,315,180]],
    [[250,360,160],[720,330,190],[1030,275,160],[1490,355,170],[1840,300,190],[2420,350,160]],
    [[300,360,180],[620,300,160],[1080,350,200],[1390,280,170],[1770,330,180],[2130,270,160],[2770,340,190]],
    [[260,350,160],[820,315,170],[1120,250,150],[1540,345,200],[1900,285,160],[2290,350,190],[2720,300,170],[3240,345,190]],
    [[220,360,170],[560,300,180],[1060,345,190],[1380,270,160],[1880,335,190],[2200,265,160],[2720,350,200],[3050,285,170],[3570,335,190]]
  ][index];
  for(const p of platSets)solids.push({x:p[0],y:p[1],w:p[2],h:22});
  const diamonds=[];
  for(let x=180;x<width-180;x+=220){const y=330-((x/220)%3)*35;diamonds.push({x:x,y:y,r:11,taken:false});}
  for(const p of platSets)diamonds.push({x:p[0]+p[2]/2,y:p[1]-34,r:11,taken:false});
  const enemies=[];
  const enemyCount=4+index*2;
  for(let i=0;i<enemyCount;i++){const x=450+i*((width-850)/enemyCount);enemies.push({x:x,y:floorY-34,w:34,h:34,vx:(i%2?1:-1)*(55+index*8),min:x-90,max:x+90,dead:false});}
  const spikes=[];
  for(let i=0;i<2+index;i++){const x=1050+i*620+(index%2)*90;spikes.push({x:x,y:floorY-24,w:54,h:24});}
  const checkpoints=[{x:Math.floor(width*0.38),active:false},{x:Math.floor(width*0.70),active:false}];
  return {n:n,width:width,floorY:floorY,solids:solids,diamonds:diamonds,enemies:enemies,spikes:spikes,checkpoints:checkpoints,finish:width-120};
}
function makeAudio(){
  let ctx=null;
  function tone(freq,dur,type,vol){
    try{
      ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==="suspended")ctx.resume();
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type=type||"sine";o.frequency.value=freq;g.gain.value=vol||0.035;
      o.connect(g);g.connect(ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+dur);o.stop(ctx.currentTime+dur);
    }catch(_){}
  }
  return {jump:function(){tone(460,.09,"square",.025);},coin:function(){tone(820,.08,"sine",.025);setTimeout(function(){tone(1060,.07,"sine",.02);},55);},hit:function(){tone(120,.18,"sawtooth",.04);},stomp:function(){tone(250,.07,"square",.03);},flag:function(){tone(620,.1,"sine",.03);setTimeout(function(){tone(820,.12,"sine",.03);},100);}};
}
export function startDiamondRunGame(opts){
  const root=opts&&opts.root;
  const onBack=opts&&opts.onBack;
  if(!root)return;
  const audio=makeAudio();
  let levelIndex=0,level=levelData(0),raf=0,last=performance.now(),camera=0,paused=false,ended=false;
  let lives=3,score=0,totalDiamonds=0,respawnX=90,respawnY=350,invuln=0;
  const input={left:false,right:false,jump:false,jumpPressed:false};
  const player={x:90,y:350,w:34,h:46,vx:0,vy:0,onGround:false,facing:1};
  root.innerHTML='<div class="diamond-run-shell"><div class="diamond-run-top"><button id="drBack" class="diamond-run-small">← '+t("back")+'</button><strong>💎 '+t("title")+'</strong><button id="drPause" class="diamond-run-small">⏸ '+t("pause")+'</button></div><div class="diamond-run-hud"><span id="drLevel"></span><span id="drLives"></span><span id="drDiamonds"></span><span id="drScore"></span></div><div class="diamond-run-canvas-wrap"><canvas id="diamondRunCanvas" width="960" height="540"></canvas><div id="drMessage" class="diamond-run-message hidden"></div></div><p class="diamond-run-tip">'+t("tip")+'</p><div class="diamond-run-controls"><button id="drLeft" aria-label="left">◀</button><button id="drJump" class="jump">⬆</button><button id="drRight" aria-label="right">▶</button></div></div>';
  const style=document.createElement("style");
  style.id="diamondRunStyle";
  style.textContent=".diamond-run-shell{min-height:100%;padding:10px;box-sizing:border-box;background:linear-gradient(180deg,#120b2d,#23104f 46%,#09182b);color:#fff;font-family:system-ui,sans-serif}.diamond-run-top,.diamond-run-hud{display:flex;align-items:center;justify-content:space-between;gap:8px;max-width:980px;margin:0 auto 8px}.diamond-run-top strong{font-size:18px;letter-spacing:.08em}.diamond-run-small{border:1px solid rgba(255,255,255,.25);background:rgba(8,8,25,.72);color:#fff;border-radius:12px;padding:9px 11px;font-weight:800}.diamond-run-hud{background:rgba(8,8,25,.58);border:1px solid rgba(183,122,255,.28);border-radius:14px;padding:8px 10px;font-weight:800;font-size:13px;flex-wrap:wrap}.diamond-run-canvas-wrap{position:relative;max-width:980px;margin:auto;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.18);box-shadow:0 15px 38px rgba(0,0,0,.35);background:#071426}.diamond-run-canvas-wrap canvas{display:block;width:100%;height:auto;touch-action:none}.diamond-run-message{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;padding:24px;text-align:center;background:rgba(4,5,18,.78);backdrop-filter:blur(5px);font-weight:900;font-size:22px}.diamond-run-message.hidden{display:none}.diamond-run-message button{border:0;border-radius:15px;padding:12px 18px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;font-weight:900;font-size:16px}.diamond-run-tip{max-width:980px;margin:8px auto;text-align:center;font-size:12px;opacity:.82}.diamond-run-controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;max-width:520px;margin:10px auto 2px;user-select:none}.diamond-run-controls button{height:64px;border-radius:20px;border:1px solid rgba(255,255,255,.22);background:rgba(54,24,115,.8);color:#fff;font-size:30px;font-weight:900;box-shadow:0 6px 16px rgba(0,0,0,.28);touch-action:none}.diamond-run-controls button.jump{background:linear-gradient(160deg,#7c3aed,#2563eb)}@media(min-width:900px){.diamond-run-controls{max-width:420px}.diamond-run-controls button{height:58px}}";
  document.head.appendChild(style);
  const canvas=document.getElementById("diamondRunCanvas"),ctx=canvas.getContext("2d"),msg=document.getElementById("drMessage");
  function hud(){
    document.getElementById("drLevel").textContent="🏁 "+t("level")+" "+level.n+"/5";
    document.getElementById("drLives").textContent="❤️ "+t("lives")+": "+lives;
    document.getElementById("drDiamonds").textContent="💎 "+t("diamonds")+": "+totalDiamonds;
    document.getElementById("drScore").textContent="⭐ "+t("score")+": "+score;
  }
  function resetPlayer(){player.x=respawnX;player.y=respawnY;player.vx=0;player.vy=0;invuln=1.2;}
  function loadLevel(i){
    levelIndex=i;level=levelData(i);respawnX=90;respawnY=350;camera=0;ended=false;paused=false;resetPlayer();hud();hideMessage();
  }
  function hideMessage(){msg.classList.add("hidden");msg.innerHTML="";}
  function showMessage(text,buttonText,action){
    paused=true;msg.classList.remove("hidden");msg.innerHTML="<div>"+text+"</div><button id=\"drMsgBtn\">"+buttonText+"</button>";
    document.getElementById("drMsgBtn").onclick=action;
  }
  function damage(){
    if(invuln>0||ended)return;
    lives--;audio.hit();hud();
    if(lives<=0){ended=true;showMessage(t("lost"),t("restart"),function(){lives=3;score=0;totalDiamonds=0;loadLevel(0);});}
    else resetPlayer();
  }
  function nextLevel(){
    if(ended)return;
    ended=true;audio.flag();score+=500+levelIndex*150;hud();
    if(levelIndex>=4){showMessage(t("win")+"<br>⭐ "+score+" · 💎 "+totalDiamonds,t("restart"),function(){lives=3;score=0;totalDiamonds=0;loadLevel(0);});}
    else showMessage("✅ "+t("level")+" "+level.n+"!",t("next"),function(){loadLevel(levelIndex+1);});
  }
  function jump(){
    if(player.onGround&&!paused){player.vy=-610;player.onGround=false;audio.jump();}
  }
  function update(dt){
    if(paused||ended)return;
    if(invuln>0)invuln-=dt;
    const ax=1400,max=250,fric=1700;
    if(input.left){player.vx=Math.max(-max,player.vx-ax*dt);player.facing=-1;}
    else if(input.right){player.vx=Math.min(max,player.vx+ax*dt);player.facing=1;}
    else{
      if(player.vx>0)player.vx=Math.max(0,player.vx-fric*dt);
      if(player.vx<0)player.vx=Math.min(0,player.vx+fric*dt);
    }
    if(input.jumpPressed){jump();input.jumpPressed=false;}
    player.vy+=1450*dt;
    const oldX=player.x;
    player.x+=player.vx*dt;
    for(const s of level.solids){if(rectHit(player,s)){if(player.vx>0)player.x=s.x-player.w;else if(player.vx<0)player.x=s.x+s.w;player.vx=0;}}
    player.x=clamp(player.x,0,level.width-player.w);
    player.onGround=false;
    const prevBottom=player.y+player.h;
    player.y+=player.vy*dt;
    for(const s of level.solids){
      if(rectHit(player,s)){
        if(player.vy>0&&prevBottom<=s.y+10){player.y=s.y-player.h;player.vy=0;player.onGround=true;}
        else if(player.vy<0){player.y=s.y+s.h;player.vy=0;}
      }
    }
    if(player.y>620)damage();
    for(const d of level.diamonds){
      if(!d.taken&&player.x+player.w>d.x-d.r&&player.x<d.x+d.r&&player.y+player.h>d.y-d.r&&player.y<d.y+d.r){d.taken=true;totalDiamonds++;score+=25;audio.coin();hud();}
    }
    for(const e of level.enemies){
      if(e.dead)continue;
      e.x+=e.vx*dt;if(e.x<e.min){e.x=e.min;e.vx=Math.abs(e.vx);}if(e.x>e.max){e.x=e.max;e.vx=-Math.abs(e.vx);}
      if(rectHit(player,e)){
        if(player.vy>100&&prevBottom<=e.y+14){e.dead=true;player.vy=-370;score+=100;audio.stomp();hud();}
        else damage();
      }
    }
    for(const sp of level.spikes)if(rectHit(player,sp))damage();
    for(const cp of level.checkpoints){
      if(!cp.active&&player.x>cp.x){cp.active=true;respawnX=cp.x+24;respawnY=360;score+=80;hud();}
    }
    if(player.x+player.w>level.finish)nextLevel();
    const target=clamp(player.x-320,0,Math.max(0,level.width-canvas.width));
    camera+=(target-camera)*Math.min(1,dt*6);
    if(Math.abs(player.x-oldX)>1)score+=0;
  }
  function diamond(x,y,r,alpha){
    ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle="#7dd3fc";ctx.shadowColor="#c4b5fd";ctx.shadowBlur=18;ctx.fillRect(-r*.72,-r*.72,r*1.44,r*1.44);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.strokeRect(-r*.72,-r*.72,r*1.44,r*1.44);ctx.restore();
  }
  function drawBg(){
    const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,"#13052f");g.addColorStop(.52,"#222b6a");g.addColorStop(1,"#0b1b2b");ctx.fillStyle=g;ctx.fillRect(0,0,960,540);
    ctx.globalAlpha=.7;for(let i=0;i<24;i++){const x=(i*97-camera*.08)%1100;const y=35+(i*53)%250;ctx.fillStyle=i%3?"#fff":"#c4b5fd";ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
    ctx.fillStyle="#1b2a55";ctx.beginPath();ctx.moveTo(0,420);for(let x=0;x<=1000;x+=120){ctx.lineTo(x,280+((x/120)%2)*90);}ctx.lineTo(1000,540);ctx.lineTo(0,540);ctx.fill();
    ctx.fillStyle="#12213f";ctx.beginPath();ctx.moveTo(0,455);for(let x=0;x<=1000;x+=95){ctx.lineTo(x,350+((x/95+1)%3)*28);}ctx.lineTo(1000,540);ctx.lineTo(0,540);ctx.fill();
  }
  function drawWorld(){
    ctx.save();ctx.translate(-camera,0);
    for(const s of level.solids){
      ctx.fillStyle=s.y>=level.floorY?"#173f31":"#50307d";ctx.fillRect(s.x,s.y,s.w,s.h);
      ctx.fillStyle=s.y>=level.floorY?"#36a269":"#9d7be8";ctx.fillRect(s.x,s.y,s.w,7);
      if(s.y<level.floorY){ctx.globalAlpha=.24;ctx.fillStyle="#fff";for(let x=s.x+10;x<s.x+s.w;x+=26)ctx.fillRect(x,s.y+10,8,3);ctx.globalAlpha=1;}
    }
    for(const sp of level.spikes){ctx.fillStyle="#ef4444";for(let x=sp.x;x<sp.x+sp.w;x+=18){ctx.beginPath();ctx.moveTo(x,sp.y+sp.h);ctx.lineTo(x+9,sp.y);ctx.lineTo(x+18,sp.y+sp.h);ctx.fill();}}
    for(const d of level.diamonds)if(!d.taken)diamond(d.x,d.y,d.r,1);
    for(const cp of level.checkpoints){ctx.fillStyle=cp.active?"#22c55e":"#fbbf24";ctx.fillRect(cp.x,390,5,80);ctx.beginPath();ctx.moveTo(cp.x+5,395);ctx.lineTo(cp.x+48,408);ctx.lineTo(cp.x+5,421);ctx.fill();if(cp.active)diamond(cp.x+25,382,7,.85);}
    for(const e of level.enemies){
      if(e.dead)continue;
      ctx.fillStyle="#ef6b4a";ctx.fillRect(e.x,e.y,e.w,e.h);ctx.fillStyle="#2b1028";ctx.fillRect(e.x+5,e.y+8,7,7);ctx.fillRect(e.x+22,e.y+8,7,7);ctx.fillStyle="#fff";ctx.fillRect(e.x+7,e.y+10,2,2);ctx.fillRect(e.x+24,e.y+10,2,2);ctx.fillStyle="#111827";ctx.fillRect(e.x+5,e.y+30,9,4);ctx.fillRect(e.x+20,e.y+30,9,4);
    }
    ctx.fillStyle="#e5e7eb";ctx.fillRect(level.finish,300,7,170);ctx.fillStyle="#8b5cf6";ctx.beginPath();ctx.moveTo(level.finish+7,305);ctx.lineTo(level.finish+70,325);ctx.lineTo(level.finish+7,345);ctx.fill();diamond(level.finish+31,325,9,1);
    ctx.save();if(invuln>0&&Math.floor(invuln*12)%2===0)ctx.globalAlpha=.35;
    ctx.translate(player.x+player.w/2,player.y+player.h/2);ctx.scale(player.facing,1);
    ctx.fillStyle="#2563eb";ctx.fillRect(-13,-9,26,28);ctx.fillStyle="#111827";ctx.fillRect(-12,19,9,7);ctx.fillRect(3,19,9,7);
    ctx.fillStyle="#f2c7a7";ctx.beginPath();ctx.arc(0,-18,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#1e1b4b";ctx.fillRect(-12,-27,24,7);ctx.fillStyle="#fff";ctx.fillRect(4,-20,4,4);
    diamond(0,2,6,1);ctx.restore();
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
  }
  function keyUp(e){if(["ArrowLeft","a","A"].includes(e.key))input.left=false;if(["ArrowRight","d","D"].includes(e.key))input.right=false;if(["ArrowUp"," ","w","W"].includes(e.key))input.jump=false;}
  window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);
  function bindHold(id,key){
    const el=document.getElementById(id);
    const down=function(e){e.preventDefault();if(key==="jump"){if(!input.jump)input.jumpPressed=true;input.jump=true;}else input[key]=true;};
    const up=function(e){e.preventDefault();if(key==="jump")input.jump=false;else input[key]=false;};
    el.addEventListener("pointerdown",down);el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);el.addEventListener("pointerleave",up);
  }
  bindHold("drLeft","left");bindHold("drRight","right");bindHold("drJump","jump");
  document.getElementById("drPause").onclick=function(){paused=!paused;this.textContent=paused?"▶ "+t("resume"):"⏸ "+t("pause");};
  function cleanup(){cancelAnimationFrame(raf);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);document.getElementById("diamondRunStyle")?.remove();}
  document.getElementById("drBack").onclick=function(){cleanup();if(typeof onBack==="function")onBack();};
  hud();raf=requestAnimationFrame(loop);
}
