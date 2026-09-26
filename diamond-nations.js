const SAVE_KEY="diamond-nations-save-v1";

const I18N={
  sq:{title:"DIAMOND NATIONS",objective:"Objektivi: pushto kryeqytetin kundërshtar",back:"Kthehu",newGame:"Lojë e re",turn:"Raundi",gold:"Ar",energy:"Energji",metal:"Materiale",diamonds:"Diamante",army:"Ushtri",defense:"Mbrojtje",capital:"Kryeqytet",neutral:"Neutral",you:"Ti",enemy:"Kompjuteri",attack:"Sulmo",recruit:"Rekruto",defend:"Mbrojtje",radar:"Radar",strike:"Diamond Strike",selectOwn:"Zgjidh një territor tëndin.",selectTarget:"Pastaj zgjidh një territor fqinj për ta sulmuar.",notAdjacent:"Ky territor nuk është fqinj.",needEnergy:"Nuk ke energji të mjaftueshme.",needGold:"Nuk ke ar/materiale të mjaftueshme.",needDiamonds:"Duhen 3 diamante.",radarDone:"Radari zbuloi fuqinë e territoreve kundërshtare.",recruited:"Ushtria u forcua.",fortified:"Mbrojtja u forcua.",captured:"Territori u pushtua!",failed:"Sulmi dështoi.",strikeHit:"Diamond Strike goditi objektivin.",win:"FITORE! Pushtove kryeqytetin kundërshtar.",lose:"HUMBE! Kryeqyteti yt u pushtua.",computerMove:"Kompjuteri po lëviz…",saved:"Progresi ruhet në këtë telefon.",legend:"Vjollcë = ti · Kuqe = kompjuteri · Gri = neutral",tapHint:"Prek territorin tënd, pastaj një fqinj.",restartConfirm:"Të fillojë lojë e re?"},
  de:{title:"DIAMOND NATIONS",objective:"Ziel: Erobere die gegnerische Hauptstadt",back:"Zurück",newGame:"Neues Spiel",turn:"Runde",gold:"Gold",energy:"Energie",metal:"Material",diamonds:"Diamanten",army:"Armee",defense:"Verteidigung",capital:"Hauptstadt",neutral:"Neutral",you:"Du",enemy:"Computer",attack:"Angreifen",recruit:"Rekrutieren",defend:"Verteidigen",radar:"Radar",strike:"Diamond Strike",selectOwn:"Wähle ein eigenes Gebiet.",selectTarget:"Wähle danach ein angrenzendes Ziel.",notAdjacent:"Dieses Gebiet grenzt nicht an.",needEnergy:"Nicht genug Energie.",needGold:"Nicht genug Gold/Material.",needDiamonds:"Du brauchst 3 Diamanten.",radarDone:"Radar hat gegnerische Stärken aufgedeckt.",recruited:"Armee verstärkt.",fortified:"Verteidigung verstärkt.",captured:"Gebiet erobert!",failed:"Angriff gescheitert.",strikeHit:"Diamond Strike hat das Ziel getroffen.",win:"SIEG! Die gegnerische Hauptstadt ist gefallen.",lose:"NIEDERLAGE! Deine Hauptstadt wurde erobert.",computerMove:"Computer ist am Zug…",saved:"Fortschritt wird auf diesem Gerät gespeichert.",legend:"Violett = du · Rot = Computer · Grau = neutral",tapHint:"Tippe dein Gebiet an, dann ein angrenzendes Ziel.",restartConfirm:"Neues Spiel starten?"},
  tr:{title:"DIAMOND NATIONS",objective:"Hedef: rakibin başkentini ele geçir",back:"Geri",newGame:"Yeni oyun",turn:"Tur",gold:"Altın",energy:"Enerji",metal:"Malzeme",diamonds:"Elmas",army:"Ordu",defense:"Savunma",capital:"Başkent",neutral:"Tarafsız",you:"Sen",enemy:"Bilgisayar",attack:"Saldır",recruit:"Asker al",defend:"Savun",radar:"Radar",strike:"Diamond Strike",selectOwn:"Kendi bölgelerinden birini seç.",selectTarget:"Sonra komşu bir hedef seç.",notAdjacent:"Bu bölge komşu değil.",needEnergy:"Yeterli enerji yok.",needGold:"Yeterli altın/malzeme yok.",needDiamonds:"3 elmas gerekiyor.",radarDone:"Radar rakip güçlerini gösterdi.",recruited:"Ordu güçlendirildi.",fortified:"Savunma güçlendirildi.",captured:"Bölge ele geçirildi!",failed:"Saldırı başarısız.",strikeHit:"Diamond Strike hedefi vurdu.",win:"ZAFER! Rakibin başkentini ele geçirdin.",lose:"KAYBETTİN! Başkentin ele geçirildi.",computerMove:"Bilgisayar oynuyor…",saved:"İlerleme bu telefonda saklanır.",legend:"Mor = sen · Kırmızı = bilgisayar · Gri = tarafsız",tapHint:"Kendi bölgene, sonra komşu hedefe dokun.",restartConfirm:"Yeni oyun başlasın mı?"},
  en:{title:"DIAMOND NATIONS",objective:"Objective: capture the enemy capital",back:"Back",newGame:"New game",turn:"Turn",gold:"Gold",energy:"Energy",metal:"Materials",diamonds:"Diamonds",army:"Army",defense:"Defense",capital:"Capital",neutral:"Neutral",you:"You",enemy:"Computer",attack:"Attack",recruit:"Recruit",defend:"Defense",radar:"Radar",strike:"Diamond Strike",selectOwn:"Select one of your territories.",selectTarget:"Then select an adjacent target.",notAdjacent:"That territory is not adjacent.",needEnergy:"Not enough energy.",needGold:"Not enough gold/materials.",needDiamonds:"You need 3 diamonds.",radarDone:"Radar revealed enemy strength.",recruited:"Army reinforced.",fortified:"Defense reinforced.",captured:"Territory captured!",failed:"Attack failed.",strikeHit:"Diamond Strike hit the target.",win:"VICTORY! You captured the enemy capital.",lose:"DEFEAT! Your capital was captured.",computerMove:"Computer is moving…",saved:"Progress is saved on this device.",legend:"Violet = you · Red = computer · Gray = neutral",tapHint:"Tap your territory, then an adjacent target.",restartConfirm:"Start a new game?"},
  it:{title:"DIAMOND NATIONS",objective:"Obiettivo: conquista la capitale nemica",back:"Indietro",newGame:"Nuova partita",turn:"Turno",gold:"Oro",energy:"Energia",metal:"Materiali",diamonds:"Diamanti",army:"Esercito",defense:"Difesa",capital:"Capitale",neutral:"Neutrale",you:"Tu",enemy:"Computer",attack:"Attacca",recruit:"Recluta",defend:"Difesa",radar:"Radar",strike:"Diamond Strike",selectOwn:"Seleziona un tuo territorio.",selectTarget:"Poi seleziona un obiettivo confinante.",notAdjacent:"Il territorio non è confinante.",needEnergy:"Energia insufficiente.",needGold:"Oro/materiali insufficienti.",needDiamonds:"Servono 3 diamanti.",radarDone:"Il radar ha rivelato le forze nemiche.",recruited:"Esercito rinforzato.",fortified:"Difesa rinforzata.",captured:"Territorio conquistato!",failed:"Attacco fallito.",strikeHit:"Diamond Strike ha colpito il bersaglio.",win:"VITTORIA! Hai conquistato la capitale nemica.",lose:"SCONFITTA! La tua capitale è stata conquistata.",computerMove:"Il computer sta giocando…",saved:"I progressi sono salvati su questo dispositivo.",legend:"Viola = tu · Rosso = computer · Grigio = neutrale",tapHint:"Tocca il tuo territorio, poi un bersaglio confinante.",restartConfirm:"Iniziare una nuova partita?"},
  hr:{title:"DIAMOND NATIONS",objective:"Cilj: osvoji protivnički glavni grad",back:"Natrag",newGame:"Nova igra",turn:"Potez",gold:"Zlato",energy:"Energija",metal:"Materijali",diamonds:"Dijamanti",army:"Vojska",defense:"Obrana",capital:"Glavni grad",neutral:"Neutralno",you:"Ti",enemy:"Računalo",attack:"Napad",recruit:"Regrutiraj",defend:"Obrana",radar:"Radar",strike:"Diamond Strike",selectOwn:"Odaberi svoj teritorij.",selectTarget:"Zatim odaberi susjedni cilj.",notAdjacent:"Taj teritorij nije susjedan.",needEnergy:"Nema dovoljno energije.",needGold:"Nema dovoljno zlata/materijala.",needDiamonds:"Potrebna su 3 dijamanta.",radarDone:"Radar je otkrio snagu protivnika.",recruited:"Vojska je pojačana.",fortified:"Obrana je pojačana.",captured:"Teritorij osvojen!",failed:"Napad nije uspio.",strikeHit:"Diamond Strike pogodio je cilj.",win:"POBJEDA! Osvojio si protivnički glavni grad.",lose:"PORAZ! Tvoj glavni grad je osvojen.",computerMove:"Računalo igra…",saved:"Napredak se sprema na ovom uređaju.",legend:"Ljubičasto = ti · Crveno = računalo · Sivo = neutralno",tapHint:"Dodirni svoj teritorij, zatim susjedni cilj.",restartConfirm:"Pokrenuti novu igru?"},
  fr:{title:"DIAMOND NATIONS",objective:"Objectif : capturer la capitale ennemie",back:"Retour",newGame:"Nouvelle partie",turn:"Tour",gold:"Or",energy:"Énergie",metal:"Matériaux",diamonds:"Diamants",army:"Armée",defense:"Défense",capital:"Capitale",neutral:"Neutre",you:"Vous",enemy:"Ordinateur",attack:"Attaquer",recruit:"Recruter",defend:"Défense",radar:"Radar",strike:"Diamond Strike",selectOwn:"Sélectionnez un de vos territoires.",selectTarget:"Puis choisissez une cible adjacente.",notAdjacent:"Ce territoire n'est pas adjacent.",needEnergy:"Pas assez d'énergie.",needGold:"Pas assez d'or/matériaux.",needDiamonds:"Il faut 3 diamants.",radarDone:"Le radar a révélé la puissance ennemie.",recruited:"Armée renforcée.",fortified:"Défense renforcée.",captured:"Territoire capturé !",failed:"Attaque échouée.",strikeHit:"Diamond Strike a frappé la cible.",win:"VICTOIRE ! Vous avez capturé la capitale ennemie.",lose:"DÉFAITE ! Votre capitale a été capturée.",computerMove:"L'ordinateur joue…",saved:"La progression est sauvegardée sur cet appareil.",legend:"Violet = vous · Rouge = ordinateur · Gris = neutre",tapHint:"Touchez votre territoire puis une cible adjacente.",restartConfirm:"Commencer une nouvelle partie ?"},
  ar:{title:"DIAMOND NATIONS",objective:"الهدف: احتلال عاصمة الخصم",back:"رجوع",newGame:"لعبة جديدة",turn:"الدور",gold:"ذهب",energy:"طاقة",metal:"مواد",diamonds:"ألماس",army:"جيش",defense:"دفاع",capital:"العاصمة",neutral:"محايد",you:"أنت",enemy:"الكمبيوتر",attack:"هجوم",recruit:"تجنيد",defend:"دفاع",radar:"رادار",strike:"Diamond Strike",selectOwn:"اختر إحدى مناطقك.",selectTarget:"ثم اختر هدفاً مجاوراً.",notAdjacent:"هذه المنطقة غير مجاورة.",needEnergy:"الطاقة غير كافية.",needGold:"الذهب/المواد غير كافية.",needDiamonds:"تحتاج إلى 3 ألماسات.",radarDone:"كشف الرادار قوة الخصم.",recruited:"تم تعزيز الجيش.",fortified:"تم تعزيز الدفاع.",captured:"تم احتلال المنطقة!",failed:"فشل الهجوم.",strikeHit:"أصاب Diamond Strike الهدف.",win:"فوز! احتللت عاصمة الخصم.",lose:"خسارة! تم احتلال عاصمتك.",computerMove:"الكمبيوتر يتحرك…",saved:"يتم حفظ التقدم على هذا الجهاز.",legend:"بنفسجي = أنت · أحمر = الكمبيوتر · رمادي = محايد",tapHint:"اضغط منطقتك ثم هدفاً مجاوراً.",restartConfirm:"بدء لعبة جديدة؟"}
};

const REGIONS=[
  {id:"aurora",name:"Aurora",pts:"20,55 145,25 185,105 110,165 28,135",x:98,y:94},
  {id:"nordia",name:"Nordia",pts:"188,38 335,28 360,118 245,155 185,105",x:273,y:91},
  {id:"atlantia",name:"Atlantia",pts:"35,168 112,170 155,260 90,325 28,282",x:87,y:240},
  {id:"diamond",name:"Diamond Republic",pts:"115,168 245,158 270,260 160,300 155,260",x:196,y:223},
  {id:"balkan",name:"Balkan Core",pts:"245,158 360,120 430,185 390,275 270,260",x:340,y:205},
  {id:"anadolu",name:"Anatolia",pts:"432,185 555,150 625,225 575,315 390,275",x:505,y:235},
  {id:"andesia",name:"Andesia",pts:"28,286 91,328 145,420 90,530 35,455",x:85,y:406},
  {id:"sahara",name:"Sahara",pts:"160,304 270,264 390,278 372,390 248,430 146,420",x:271,y:350},
  {id:"nile",name:"Nile Gate",pts:"392,280 575,318 555,420 372,390",x:475,y:356},
  {id:"pacifica",name:"Pacifica",pts:"92,532 146,423 246,432 260,550 180,620 105,600",x:176,y:526},
  {id:"equatoria",name:"Equatoria",pts:"248,432 374,393 458,470 412,575 260,550",x:340,y:493},
  {id:"orienta",name:"Orienta",pts:"458,470 558,422 625,505 585,610 412,575",x:523,y:518}
];
const ADJ={
  aurora:["nordia","atlantia","diamond"],nordia:["aurora","diamond","balkan"],
  atlantia:["aurora","diamond","andesia"],diamond:["aurora","nordia","atlantia","balkan","sahara"],
  balkan:["nordia","diamond","anadolu","sahara","nile"],anadolu:["balkan","nile","orienta"],
  andesia:["atlantia","sahara","pacifica"],sahara:["diamond","balkan","andesia","nile","pacifica","equatoria"],
  nile:["balkan","anadolu","sahara","equatoria","orienta"],pacifica:["andesia","sahara","equatoria"],
  equatoria:["sahara","nile","pacifica","orienta"],orienta:["anadolu","nile","equatoria"]
};

function freshState(){
  const owners={aurora:"n",nordia:"a",atlantia:"p",diamond:"p",balkan:"p",anadolu:"a",andesia:"n",sahara:"n",nile:"n",pacifica:"n",equatoria:"a",orienta:"n"};
  const capitals={diamond:true,nordia:true};
  return {
    turn:1,gold:900,energy:130,metal:500,diamonds:5,selected:"diamond",target:null,reveal:false,over:false,message:"",
    regions:Object.fromEntries(REGIONS.map((r,i)=>[r.id,{owner:owners[r.id],army:owners[r.id]==="p"?55:owners[r.id]==="a"?50:28+(i%4)*4,defense:owners[r.id]==="n"?1:2,capital:!!capitals[r.id]}]))
  };
}

function safeLoad(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");
    if(!s||!s.regions)return freshState();
    for(const r of REGIONS) if(!s.regions[r.id]) return freshState();
    return s;
  }catch(_){return freshState();}
}
function save(s){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s));}catch(_){}}

function injectStyle(){
  if(document.getElementById("diamondNationsStyle"))return;
  const style=document.createElement("style");style.id="diamondNationsStyle";style.textContent=`
  .diamond-nations-shell{min-height:100%;background:radial-gradient(circle at 50% 0,#172554 0,#080d1c 42%,#030712 100%);color:#fff;padding:10px 10px 90px;box-sizing:border-box;font-family:system-ui,sans-serif}
  .dn-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}.dn-title{display:flex;align-items:center;gap:8px;font-weight:1000;font-size:19px;letter-spacing:.8px}.dn-gem{font-size:24px;filter:drop-shadow(0 0 10px #a855f7)}
  .dn-smallbtn{border:1px solid #475569;background:#111827;color:#fff;border-radius:11px;padding:8px 10px;font-weight:800}
  .dn-objective{padding:9px 11px;border:1px solid #6d28d9;border-radius:14px;background:linear-gradient(135deg,rgba(91,33,182,.38),rgba(30,64,175,.2));font-size:13px;font-weight:800;margin-bottom:8px}
  .dn-res{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:8px}.dn-res div{background:#0f172a;border:1px solid #334155;border-radius:11px;padding:7px 5px;text-align:center;font-size:11px}.dn-res strong{display:block;font-size:14px;margin-top:2px}
  .dn-topline{display:flex;justify-content:space-between;gap:8px;font-size:12px;margin:7px 1px;color:#cbd5e1}.dn-map-wrap{position:relative;border-radius:18px;overflow:hidden;border:1px solid #334155;background:radial-gradient(circle at 50% 45%,#12365a,#07101e 64%,#030712);box-shadow:0 18px 45px rgba(0,0,0,.42)}
  .dn-map{display:block;width:100%;height:auto;max-height:56vh}.dn-sea{fill:#06162a}.dn-region{stroke:#dbeafe;stroke-width:2;cursor:pointer;transition:.16s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55))}.dn-region.p{fill:#7c3aed}.dn-region.a{fill:#b91c1c}.dn-region.n{fill:#475569}.dn-region.selected{stroke:#fef08a;stroke-width:5}.dn-region.target{stroke:#38bdf8;stroke-width:5;stroke-dasharray:8 5}.dn-region:hover{opacity:.9}
  .dn-label{font-size:11px;fill:#fff;font-weight:900;text-anchor:middle;pointer-events:none;text-shadow:0 2px 2px #000}.dn-stat{font-size:10px;fill:#e2e8f0;font-weight:800;text-anchor:middle;pointer-events:none}.dn-capital{font-size:14px;pointer-events:none;text-anchor:middle}
  .dn-panel{margin-top:8px;background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:16px;padding:10px}.dn-selected{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.dn-selected strong{font-size:16px}.dn-owner{font-size:11px;color:#cbd5e1}.dn-message{min-height:37px;margin-top:8px;padding:8px 10px;border-radius:11px;background:#020617;border:1px solid #1e293b;font-size:12px;line-height:1.35}
  .dn-actions{position:sticky;bottom:4px;display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-top:9px;z-index:3}.dn-actions button{min-height:54px;border-radius:14px;border:1px solid #475569;background:linear-gradient(180deg,#172554,#0f172a);color:#fff;font-weight:900;font-size:10px;padding:4px}.dn-actions button span{display:block;font-size:20px;margin-bottom:2px}.dn-actions button.primary{border-color:#a855f7;background:linear-gradient(180deg,#7e22ce,#4c1d95)}.dn-actions button:disabled{opacity:.45}
  .dn-legend{font-size:10px;text-align:center;color:#94a3b8;margin-top:7px}.dn-gameover{padding:10px;margin-top:8px;border-radius:13px;background:#312e81;border:1px solid #a78bfa;font-weight:1000;text-align:center;font-size:16px}
  @media(max-width:390px){.dn-label{font-size:9px}.dn-stat{font-size:9px}.dn-actions button{font-size:9px;min-height:50px}.dn-actions button span{font-size:18px}}
  `;document.head.appendChild(style);
}

function startDiamondNationsGame({root,onBack,difficulty="medium",lang="sq"}){
  injectStyle();
  const t=I18N[lang]||I18N.sq;
  let state=safeLoad();
  let busy=false;
  const aiFactor={weak:.78,medium:1,strong:1.18,pro:1.38}[difficulty]||1;

  function ownerName(o){return o==="p"?t.you:o==="a"?t.enemy:t.neutral;}
  function income(){
    const count=Object.values(state.regions).filter(r=>r.owner==="p").length;
    state.gold+=80+count*70;state.energy=Math.min(999,state.energy+18+count*5);state.metal+=35+count*28;
    if(state.turn%4===0)state.diamonds+=1;
  }
  function enemyIncome(){
    for(const r of Object.values(state.regions)) if(r.owner==="a") r.army=Math.min(180,r.army+4+Math.round(aiFactor*3));
  }
  function capitalOwner(which){
    const id=which==="p"?"diamond":"nordia";
    return state.regions[id]?.owner;
  }
  function checkGameOver(){
    if(capitalOwner("a")==="p"){state.over=true;state.message=t.win;}
    else if(capitalOwner("p")==="a"){state.over=true;state.message=t.lose;}
    return state.over;
  }
  function selectedRegion(){return state.regions[state.selected];}
  function targetRegion(){return state.regions[state.target];}
  function adjacent(a,b){return !!ADJ[a]?.includes(b);}

  function render(){
    const selected=REGIONS.find(r=>r.id===state.selected)||REGIONS[0], sr=state.regions[selected.id];
    const target=state.target?REGIONS.find(r=>r.id===state.target):null;
    const polygons=REGIONS.map(r=>{
      const rr=state.regions[r.id];
      const canSee=rr.owner!=="a"||state.reveal||rr.capital||adjacent(state.selected,r.id);
      const armyText=canSee?("⚔ "+Math.max(0,Math.round(rr.army))):"⚔ ?";
      return `<g data-region="${r.id}">
        <polygon class="dn-region ${rr.owner} ${state.selected===r.id?"selected":""} ${state.target===r.id?"target":""}" points="${r.pts}"></polygon>
        <text class="dn-label" x="${r.x}" y="${r.y}">${r.name}</text>
        <text class="dn-stat" x="${r.x}" y="${r.y+16}">${armyText} · 🛡 ${rr.defense}</text>
        ${rr.capital?`<text class="dn-capital" x="${r.x}" y="${r.y-17}">♛</text>`:""}
      </g>`;
    }).join("");

    root.innerHTML=`<div class="diamond-nations-shell">
      <div class="dn-head"><div class="dn-title"><span class="dn-gem">💎</span><span>${t.title}</span></div><div><button id="dnNew" class="dn-smallbtn" type="button">↻ ${t.newGame}</button> <button id="dnBack" class="dn-smallbtn" type="button">← ${t.back}</button></div></div>
      <div class="dn-objective">🎯 ${t.objective}</div>
      <div class="dn-res">
        <div>🪙 ${t.gold}<strong>${state.gold}</strong></div><div>⚡ ${t.energy}<strong>${state.energy}</strong></div><div>🔩 ${t.metal}<strong>${state.metal}</strong></div><div>💎 ${t.diamonds}<strong>${state.diamonds}</strong></div>
      </div>
      <div class="dn-topline"><span>⏱ ${t.turn} ${state.turn}</span><span>${t.tapHint}</span></div>
      <div class="dn-map-wrap"><svg class="dn-map" viewBox="0 0 655 640" role="img" aria-label="${t.title}"><rect class="dn-sea" x="0" y="0" width="655" height="640"></rect>${polygons}</svg></div>
      <div class="dn-panel">
        <div class="dn-selected"><div><strong>${selected.name}</strong><div class="dn-owner">${ownerName(sr.owner)} ${sr.capital?"· ♛ "+t.capital:""}</div></div><div style="text-align:right"><strong>⚔ ${Math.round(sr.army)}</strong><div class="dn-owner">🛡 ${sr.defense}</div></div></div>
        ${target?`<div class="dn-owner" style="margin-top:6px">🎯 ${target.name} · ${ownerName(state.regions[target.id].owner)}</div>`:""}
        <div class="dn-message">${state.message||t.selectOwn+" "+t.selectTarget}</div>
        ${state.over?`<div class="dn-gameover">${state.message}</div>`:""}
      </div>
      <div class="dn-actions">
        <button id="dnAttack" class="diamond-movable-control primary" type="button" ${state.over||busy?"disabled":""}><span>⚔️</span>${t.attack}</button>
        <button id="dnRecruit" class="diamond-movable-control" type="button" ${state.over||busy?"disabled":""}><span>🪖</span>${t.recruit}</button>
        <button id="dnDefend" class="diamond-movable-control" type="button" ${state.over||busy?"disabled":""}><span>🛡️</span>${t.defend}</button>
        <button id="dnRadar" class="diamond-movable-control" type="button" ${state.over||busy?"disabled":""}><span>📡</span>${t.radar}</button>
        <button id="dnStrike" class="diamond-movable-control" type="button" ${state.over||busy?"disabled":""}><span>💎</span>${t.strike}</button>
      </div>
      <div class="dn-legend">${t.legend} · ${t.saved}</div>
    </div>`;

    root.querySelectorAll("[data-region]").forEach(g=>g.addEventListener("click",()=>{
      if(busy||state.over)return;
      const id=g.dataset.region, rr=state.regions[id];
      if(rr.owner==="p"){state.selected=id;state.target=null;state.message=t.selectTarget;}
      else if(state.selected&&adjacent(state.selected,id)){state.target=id;state.message="🎯 "+REGIONS.find(x=>x.id===id).name;}
      else{state.target=null;state.message=t.notAdjacent;}
      save(state);render();
    }));
    document.getElementById("dnBack").onclick=()=>{save(state);onBack?.();};
    document.getElementById("dnNew").onclick=()=>{if(confirm(t.restartConfirm)){state=freshState();save(state);render();}};
    document.getElementById("dnAttack").onclick=()=>playerAttack(false);
    document.getElementById("dnRecruit").onclick=recruit;
    document.getElementById("dnDefend").onclick=fortify;
    document.getElementById("dnRadar").onclick=radar;
    document.getElementById("dnStrike").onclick=()=>playerAttack(true);
  }

  function endPlayerTurn(){
    if(checkGameOver()){save(state);render();return;}
    busy=true;state.message=t.computerMove;save(state);render();
    setTimeout(()=>{aiTurn();state.turn+=1;income();enemyIncome();checkGameOver();busy=false;save(state);render();},520);
  }

  function playerAttack(strike){
    const s=selectedRegion(), trg=targetRegion();
    if(!s||s.owner!=="p"){state.message=t.selectOwn;render();return;}
    if(!trg||trg.owner==="p"){state.message=t.selectTarget;render();return;}
    if(!adjacent(state.selected,state.target)){state.message=t.notAdjacent;render();return;}
    if(strike){
      if(state.diamonds<3){state.message=t.needDiamonds;render();return;}
      state.diamonds-=3;trg.army=Math.max(0,trg.army-38);trg.defense=Math.max(0,trg.defense-1);
      if(trg.army<=8){trg.owner="p";trg.army=18;trg.defense=1;state.message=t.captured;} else state.message=t.strikeHit;
      endPlayerTurn();return;
    }
    if(state.energy<20){state.message=t.needEnergy;render();return;}
    if(s.army<14){state.message=t.selectOwn;render();return;}
    state.energy-=20;
    const attackPower=s.army*(.82+Math.random()*.38);
    const defendPower=trg.army*(.78+Math.random()*.36)+trg.defense*12;
    if(attackPower>defendPower){
      const remaining=Math.max(12,Math.round(s.army-(defendPower*.42)));
      s.army=Math.max(8,Math.round(s.army*.28));trg.owner="p";trg.army=remaining;trg.defense=Math.max(1,trg.defense-1);state.message=t.captured;
    }else{
      s.army=Math.max(7,Math.round(s.army*.54));trg.army=Math.max(8,Math.round(trg.army*.78));state.message=t.failed;
    }
    endPlayerTurn();
  }

  function recruit(){
    const s=selectedRegion();if(!s||s.owner!=="p"){state.message=t.selectOwn;render();return;}
    if(state.gold<250||state.metal<80){state.message=t.needGold;render();return;}
    state.gold-=250;state.metal-=80;s.army=Math.min(200,s.army+24);state.message=t.recruited;endPlayerTurn();
  }
  function fortify(){
    const s=selectedRegion();if(!s||s.owner!=="p"){state.message=t.selectOwn;render();return;}
    if(state.metal<110){state.message=t.needGold;render();return;}
    state.metal-=110;s.defense=Math.min(7,s.defense+1);s.army=Math.min(200,s.army+6);state.message=t.fortified;endPlayerTurn();
  }
  function radar(){
    if(state.energy<25){state.message=t.needEnergy;render();return;}
    state.energy-=25;state.reveal=true;state.message=t.radarDone;endPlayerTurn();
  }

  function aiTurn(){
    const aiIds=REGIONS.filter(r=>state.regions[r.id].owner==="a").map(r=>r.id);
    if(!aiIds.length)return;
    const moves=difficulty==="pro"?2:1;
    for(let move=0;move<moves;move++){
      const choices=[];
      for(const id of aiIds){
        const src=state.regions[id];if(!src||src.owner!=="a"||src.army<18)continue;
        for(const n of ADJ[id]){
          const trg=state.regions[n];if(trg.owner!=="a")choices.push({id,n,score:src.army-(trg.army+trg.defense*10)});
        }
      }
      if(!choices.length){const id=aiIds[Math.floor(Math.random()*aiIds.length)];if(state.regions[id])state.regions[id].army+=10;continue;}
      choices.sort((a,b)=>b.score-a.score);
      const pick=(difficulty==="weak"&&Math.random()<.55)?choices[Math.floor(Math.random()*choices.length)]:choices[0];
      const src=state.regions[pick.id],trg=state.regions[pick.n];
      const ap=src.army*aiFactor*(.8+Math.random()*.35), dp=trg.army*(.82+Math.random()*.3)+trg.defense*11;
      if(ap>dp){
        const remain=Math.max(10,Math.round(src.army-dp*.45));src.army=Math.max(8,Math.round(src.army*.3));trg.owner="a";trg.army=remain;trg.defense=Math.max(1,trg.defense-1);
      }else{src.army=Math.max(8,Math.round(src.army*.6));trg.army=Math.max(8,Math.round(trg.army*.84));}
      if(checkGameOver())break;
    }
  }

  render();
}


globalThis.DiamondNations={startDiamondNationsGame};
