const LANG_KEY="pajaziti-language";
const TX={
sq:{title:"UÇK – Rruga e Lirisë",back:"Kthehu te lojërat",mission:"Misioni",score:"Pikë",health:"Jetë",supplies:"Furnizime",civilians:"Civilë",medkits:"Ndihmë",move:"Lëviz",act:"Vepro",restart:"Luaj përsëri",next:"Misioni tjetër",done:"Misioni u krye!",failed:"Misioni dështoi.",goal:"Qëllimi",safe:"Arrij te pika e sigurt",supply:"Dërgo furnizimet",rescue:"Ndihmo të plagosurit",escort:"Shoqëro civilët",secure:"Siguro zonën",hint:"Prek një katror ngjitur për të lëvizur. Prek objektin kur je pranë tij për të vepruar.",mountain:"Mal",forest:"Pyll",road:"Rrugë",danger:"Rrezik",safezone:"Pikë e sigurt",civil:"Civil",crate:"Furnizim",wounded:"I plagosur",zone:"Zonë",complete:"Misioni u krye me sukses.",choose:"Zgjidh misionin"},
de:{title:"UÇK – Weg der Freiheit",back:"Zurück zu den Spielen",mission:"Mission",score:"Punkte",health:"Leben",supplies:"Vorräte",civilians:"Zivilisten",medkits:"Hilfe",move:"Bewegen",act:"Aktion",restart:"Nochmal",next:"Nächste Mission",done:"Mission geschafft!",failed:"Mission gescheitert.",goal:"Ziel",safe:"Erreiche den sicheren Punkt",supply:"Liefere die Vorräte",rescue:"Hilf den Verwundeten",escort:"Begleite die Zivilisten",secure:"Sichere die Zone",hint:"Tippe auf ein angrenzendes Feld, um dich zu bewegen. Tippe auf ein Objekt, wenn du daneben stehst.",mountain:"Berg",forest:"Wald",road:"Weg",danger:"Gefahr",safezone:"Sicherer Punkt",civil:"Zivilist",crate:"Vorräte",wounded:"Verwundet",zone:"Zone",complete:"Mission erfolgreich abgeschlossen.",choose:"Mission wählen"},
tr:{title:"UÇK – Özgürlük Yolu",back:"Oyunlara dön",mission:"Görev",score:"Puan",health:"Can",supplies:"Malzeme",civilians:"Siviller",medkits:"Yardım",move:"Hareket",act:"Eylem",restart:"Tekrar",next:"Sonraki görev",done:"Görev tamamlandı!",failed:"Görev başarısız.",goal:"Amaç",safe:"Güvenli noktaya ulaş",supply:"Malzemeleri ulaştır",rescue:"Yaralılara yardım et",escort:"Sivillere eşlik et",secure:"Bölgeyi güvene al",hint:"Hareket etmek için yanındaki kareye dokun. Nesneye komşuyken ona dokunarak eylem yap.",mountain:"Dağ",forest:"Orman",road:"Yol",danger:"Risk",safezone:"Güvenli nokta",civil:"Sivil",crate:"Malzeme",wounded:"Yaralı",zone:"Bölge",complete:"Görev başarıyla tamamlandı.",choose:"Görev seç"},
en:{title:"UÇK – Road to Freedom",back:"Back to games",mission:"Mission",score:"Score",health:"Health",supplies:"Supplies",civilians:"Civilians",medkits:"Aid",move:"Move",act:"Act",restart:"Play again",next:"Next mission",done:"Mission complete!",failed:"Mission failed.",goal:"Goal",safe:"Reach the safe point",supply:"Deliver the supplies",rescue:"Help the wounded",escort:"Escort civilians",secure:"Secure the zone",hint:"Tap an adjacent tile to move. Tap an object when you are next to it to interact.",mountain:"Mountain",forest:"Forest",road:"Road",danger:"Danger",safezone:"Safe point",civil:"Civilian",crate:"Supplies",wounded:"Wounded",zone:"Zone",complete:"Mission completed successfully.",choose:"Choose mission"}};
let root,onBack,lang="sq",state=null;
const t=k=>(TX[lang]||TX.en)[k]||TX.en[k]||k;
const W=8,H=10;
const MISSIONS=[
{id:"safe",name:"safe",goal:"safe",objects:[{x:6,y:1,type:"safezone"}]},
{id:"supply",name:"supply",goal:"supply",objects:[{x:1,y:7,type:"crate"},{x:6,y:1,type:"zone"}]},
{id:"rescue",name:"rescue",goal:"rescue",objects:[{x:5,y:3,type:"wounded"},{x:6,y:1,type:"safezone"}]},
{id:"escort",name:"escort",goal:"escort",objects:[{x:3,y:6,type:"civil"},{x:6,y:1,type:"safezone"}]},
{id:"secure",name:"secure",goal:"secure",objects:[{x:6,y:2,type:"zone"},{x:2,y:4,type:"zone"},{x:5,y:6,type:"zone"}]}
];
const terrain=[
"MMMMMMMM",
"M..F...M",
"M.FF...M",
"M..R.F.M",
"M.RR...M",
"M..R.F.M",
"M.FR...M",
"M..R...M",
"M......M",
"MMMMMMMM"
];
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function key(x,y){return x+","+y}
function at(x,y){return terrain[y]?.[x]||"M"}
function pass(x,y){return x>=0&&x<W&&y>=0&&y<H&&at(x,y)!=="M"}
function objAt(x,y){return state.objects.find(o=>o.x===x&&o.y===y&&!o.done)}
function near(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)===1}
function iconTerrain(c){return c==="M"?"⛰️":c==="F"?"🌲":c==="R"?"🟫":"·"}
function iconObj(o){return o.type==="safezone"?"🏁":o.type==="crate"?"📦":o.type==="wounded"?"🩹":o.type==="civil"?"👨‍👩‍👧":o.type==="zone"?"🛡️":""}
function missionComplete(){
 const m=MISSIONS[state.mission];
 if(m.id==="safe")return state.objects.every(o=>o.type!=="safezone"||o.done);
 if(m.id==="supply")return state.delivered;
 if(m.id==="rescue")return state.rescued&&state.objects.every(o=>o.type!=="safezone"||o.done);
 if(m.id==="escort")return state.escorted&&state.objects.every(o=>o.type!=="safezone"||o.done);
 if(m.id==="secure")return state.objects.filter(o=>o.type==="zone").every(o=>o.done);
 return false;
}
function resetMission(i=0){
 const m=MISSIONS[i];
 state={mission:i,player:{x:1,y:8},health:5,score:0,steps:0,carrying:false,rescued:false,escorted:false,delivered:false,objects:m.objects.map(o=>({...o,done:false})),message:t("hint"),over:false,win:false};
 render();
}
function dangerCheck(){
 state.steps++;
 if(state.steps%5===0&&Math.random()<.45){state.health--;state.message="⚠️ "+t("danger")+" −1 ❤️";if(state.health<=0){state.over=true;state.win=false;}}
}
function move(x,y){
 if(state.over||!near(state.player,{x,y})||!pass(x,y))return;
 const o=objAt(x,y);
 if(o){state.message=t("act")+": "+t(o.type);return;}
 state.player={x,y};state.score+=2;dangerCheck();checkArrival();render();
}
function interact(o){
 if(state.over||!near(state.player,o))return;
 const m=MISSIONS[state.mission].id;
 if(o.type==="crate"){o.done=true;state.carrying=true;state.score+=20;state.message="📦 "+t("supplies")+" ✓";}
 else if(o.type==="wounded"){o.done=true;state.rescued=true;state.score+=35;state.message="🩹 "+t("rescue")+" ✓";}
 else if(o.type==="civil"){o.done=true;state.escorted=true;state.score+=30;state.message="👨‍👩‍👧 "+t("escort")+" ✓";}
 else if(o.type==="zone"){
   if(m==="supply"&&state.carrying){o.done=true;state.delivered=true;state.score+=45;state.message="📦 "+t("supply")+" ✓";}
   else if(m==="secure"){o.done=true;state.score+=25;state.message="🛡️ "+t("secure")+" ✓";}
 }
 else if(o.type==="safezone"){
   if(m==="safe"){o.done=true;state.score+=50;}
   else if(m==="rescue"&&state.rescued){o.done=true;state.score+=45;}
   else if(m==="escort"&&state.escorted){o.done=true;state.score+=45;}
 }
 if(missionComplete()){state.over=true;state.win=true;state.score+=state.health*10;state.message=t("complete");}
 render();
}
function checkArrival(){
 const o=objAt(state.player.x,state.player.y);if(o)interact(o);
}
function styles(){
 if(document.getElementById("uck-style"))return;
 const s=document.createElement("style");s.id="uck-style";s.textContent=`
.uck{min-height:100%;padding:12px;background:linear-gradient(#1f2937,#0f172a);color:#fff}.uck-head{max-width:720px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:8px}.uck-head button,.uck-action{border:0;border-radius:14px;padding:10px 12px;font-weight:900}.uck-head button{background:#fff;color:#111}.uck-title{font-weight:1000;text-align:center}.uck-stats,.uck-missions{max-width:720px;margin:10px auto;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.uck-stat,.uck-mission{background:#ffffff17;border:1px solid #ffffff22;border-radius:14px;padding:9px;text-align:center}.uck-mission{color:#fff;font-weight:900}.uck-mission.on{outline:2px solid #facc15}.uck-board{width:min(94vw,560px);margin:auto;display:grid;grid-template-columns:repeat(8,1fr);gap:3px;background:#020617;padding:5px;border-radius:18px}.uck-cell{aspect-ratio:1;border:0;border-radius:7px;background:#334155;color:#fff;font-size:clamp(15px,4vw,24px);position:relative}.uck-cell.r{background:#57534e}.uck-cell.f{background:#14532d}.uck-cell.m{background:#475569}.uck-cell.player:after{content:"🪖";position:absolute;inset:0;display:grid;place-items:center;font-size:clamp(18px,5vw,30px)}.uck-cell.interact{outline:3px solid #facc15;outline-offset:-3px}.uck-goal,.uck-msg{max-width:720px;margin:10px auto;padding:10px;border-radius:14px;background:#ffffff15;text-align:center}.uck-msg{min-height:42px;font-weight:800}.uck-result{max-width:720px;margin:12px auto;background:#fff;color:#111;padding:14px;border-radius:17px;text-align:center;font-weight:1000}.uck-help{max-width:720px;margin:8px auto;text-align:center;color:#dbeafe;font-size:.9rem}`;document.head.appendChild(s);
}
function render(){
 const m=MISSIONS[state.mission], reachable=new Set();
 [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const x=state.player.x+dx,y=state.player.y+dy;if(pass(x,y))reachable.add(key(x,y))});
 const cells=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const o=objAt(x,y),isP=state.player.x===x&&state.player.y===y,can=reachable.has(key(x,y)),cls=at(x,y)==="M"?"m":at(x,y)==="F"?"f":at(x,y)==="R"?"r":"";
   cells.push(`<button class="uck-cell ${cls} ${isP?"player":""} ${can&&o?"interact":""}" data-x="${x}" data-y="${y}">${isP?"":o?iconObj(o):iconTerrain(at(x,y))}</button>`);
 }
 root.innerHTML=`<section class="uck"><div class="uck-head"><button id="uckBack">← ${esc(t("back"))}</button><div class="uck-title">🪖 ${esc(t("title"))}</div><button id="uckReset">↻</button></div>
 <div class="uck-missions">${MISSIONS.map((q,i)=>`<button class="uck-mission ${i===state.mission?"on":""}" data-mission="${i}">${i+1}. ${esc(t(q.name))}</button>`).join("")}</div>
 <div class="uck-stats"><div class="uck-stat">❤️ ${esc(t("health"))}<br><b>${state.health}</b></div><div class="uck-stat">⭐ ${esc(t("score"))}<br><b>${state.score}</b></div><div class="uck-stat">👣<br><b>${state.steps}</b></div></div>
 <div class="uck-goal"><b>${esc(t("goal"))}:</b> ${esc(t(m.goal))}</div><div class="uck-board">${cells.join("")}</div>
 <div class="uck-msg">${esc(state.message)}</div>${state.over?`<div class="uck-result">${state.win?"🏆 "+esc(t("done")):"💥 "+esc(t("failed"))}<br><button id="uckAgain" class="uck-action">${esc(t("restart"))}</button> ${state.win&&state.mission<MISSIONS.length-1?`<button id="uckNext" class="uck-action">${esc(t("next"))}</button>`:""}</div>`:""}
 <div class="uck-help">${esc(t("hint"))}</div></section>`;
 document.getElementById("uckBack").onclick=()=>onBack?.();
 document.getElementById("uckReset").onclick=()=>resetMission(state.mission);
 document.getElementById("uckAgain")?.addEventListener("click",()=>resetMission(state.mission));
 document.getElementById("uckNext")?.addEventListener("click",()=>resetMission(Math.min(MISSIONS.length-1,state.mission+1)));
 root.querySelectorAll("[data-mission]").forEach(b=>b.onclick=()=>resetMission(+b.dataset.mission));
 root.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const x=+b.dataset.x,y=+b.dataset.y,o=objAt(x,y);if(o&&near(state.player,o))interact(o);else move(x,y);});
}
export function startUckGame(opts={}){root=opts.root||document.getElementById("gamesRoot");onBack=opts.onBack;lang=localStorage.getItem(LANG_KEY)||"sq";if(!TX[lang])lang="en";styles();resetMission(0);}
