const K="diamond-slot-state-v1";
const SYMS=[["diamond","💎",50],["heart","❤️",30],["star","⭐",25],["apple","🍎",20],["strawberry","🍓",15]];
const BETS=[25,50,100,200,500];
function fresh(){return{bal:2850,bet:100,m:{diamond:0,heart:0,star:0,apple:0,strawberry:0},free:0,x2:0,best:0};}
function load(){try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(K)||"{}"));}catch(_){return fresh();}}
function save(s){localStorage.setItem(K,JSON.stringify(s));}
function pick(){const r=Math.random();if(r<.12)return SYMS[0];if(r<.32)return SYMS[1];if(r<.50)return SYMS[2];if(r<.78)return SYMS[3];return SYMS[4];}
function grid(){return Array.from({length:3},()=>Array.from({length:5},()=>pick()));}
function longest(row,id){let b=0,n=0;for(const x of row){if(x[0]===id){n++;b=Math.max(b,n);}else n=0;}return b;}
function css(){
 if(document.getElementById("ds-css"))return;
 const s=document.createElement("style");s.id="ds-css";s.textContent=`
.ds{min-height:100%;padding:10px 8px 90px;box-sizing:border-box;color:#fff;background:radial-gradient(circle at 50% 10%,#59147a,#07102b 38%,#020713);font-family:system-ui}
.ds-top{display:flex;align-items:center;gap:8px}.ds-back{width:40px;height:40px;border-radius:12px;border:1px solid #25c8ff;background:#071a3c;color:#fff;font-size:24px}.ds-title{flex:1;font-size:20px;font-weight:1000}.ds-bal{padding:8px 10px;border:1px solid #2e8cff;border-radius:14px;background:#071836;font-weight:900}
.ds-hero{text-align:center;margin:5px 0 9px}.ds-hero b{display:block;font-size:34px;color:#8edaff;text-shadow:0 0 16px #1680ff;line-height:.9}.ds-hero strong{font-size:26px;color:#ffc34d;text-shadow:0 0 13px #ff6a00}
.ds-meters{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-bottom:8px}.ds-meter{padding:5px 2px;text-align:center;border:1px solid var(--c);border-radius:10px;background:#071027}.ds-meter .ic{font-size:22px}.ds-meter b{display:block;font-size:8px}.ds-bar{height:6px;border-radius:8px;overflow:hidden;background:#0c1d39;border:1px solid #ffffff30}.ds-bar i{display:block;height:100%;background:var(--c)}.ds-meter small{font-size:8px}
.ds-wrap{padding:6px;border-radius:18px;background:linear-gradient(135deg,#d34cff,#2c79ff,#ffbd3f);box-shadow:0 0 22px #6a27d7}.ds-reels{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:5px;border:2px solid #ffd569;border-radius:14px;background:#020817}.ds-cell{aspect-ratio:1;display:grid;place-items:center;font-size:clamp(29px,10vw,55px);background:linear-gradient(#0a1940,#03091d);border:1px solid #20366f}.ds.spinning .ds-cell{filter:blur(1px);transform:scale(.9)}
.ds-msg{min-height:42px;margin:8px 0 6px;padding:7px;border:1px solid #318eff66;border-radius:12px;background:#06132c;text-align:center;font-size:11px;display:grid;place-items:center}.ds-msg.win{border-color:#ffd64e;color:#fff2a3}
.ds-controls{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:6px;align-items:center}.ds-bet,.ds-auto{min-height:60px;border:1px solid #3388f5;border-radius:16px;background:#071a3c;color:#fff;font-weight:900}.ds-bet{display:grid;grid-template-columns:30px 1fr 30px;align-items:center;padding:4px;text-align:center}.ds-bet button{width:29px;height:29px;border-radius:50%;border:1px solid #4b91ff;background:#133574;color:#fff;font-size:18px}.ds-bet small{font-size:9px}.ds-bet b{display:block}
.ds-spin{aspect-ratio:1;max-width:108px;width:100%;justify-self:center;border-radius:50%;border:4px solid #ff7cf5;background:radial-gradient(circle,#dc42ff,#6f25df 65%,#271064);color:#fff;font-weight:1000;box-shadow:0 0 22px #a738ff}.ds-auto.on{background:linear-gradient(135deg,#7629e8,#246aff)}
.ds-info{text-align:center;margin-top:8px;font-size:9px;padding:7px;border:1px solid #1ca5ff;border-radius:12px;background:#06142d}
`;document.head.appendChild(s);
}
export function startDiamondSlotGame({root,onBack}={}){
 if(!root)return;css();let st=load(),g=grid(),busy=false,timer=null,autoTimer=null;st.auto=false;
 root.innerHTML=`<section class="ds">
 <div class="ds-top"><button id="dsBack" class="ds-back">‹</button><div class="ds-title">💎 DIAMOND</div><div class="ds-bal">💎 <span id="bal"></span></div></div>
 <div class="ds-hero"><b>DIAMOND</b><strong>SLOT</strong></div>
 <div class="ds-meters">${SYMS.map(x=>`<div class="ds-meter" style="--c:${x[0]==="diamond"?"#19c7ff":x[0]==="heart"?"#ff3186":x[0]==="star"?"#ffc83d":x[0]==="apple"?"#31e86a":"#d85cff"}"><div class="ic">${x[1]}</div><b>${x[0].toUpperCase()}</b><div class="ds-bar"><i id="b-${x[0]}"></i></div><small id="m-${x[0]}"></small></div>`).join("")}</div>
 <div class="ds-wrap"><div id="reels" class="ds-reels"></div></div>
 <div id="msg" class="ds-msg">5 💎 në një rrotullim = 1000 diamante · 2+ ❤️ në vijë japin bonus.</div>
 <div class="ds-controls"><div class="ds-bet"><button id="minus">−</button><small>BAST<b id="bet"></b></small><button id="plus">+</button></div><button id="spin" class="ds-spin">↻<br>RROTULLO</button><button id="auto" class="ds-auto">↻ AUTO</button></div>
 <div class="ds-info">💎 shkalla = +1000 · ❤️ = +750 · ⭐ = x2 · 🍎 = 3 rrotullime falas · 🍓 = +1500</div></section>`;
 const sh=root.querySelector(".ds"),re=root.querySelector("#reels"),msg=root.querySelector("#msg"),bal=root.querySelector("#bal"),bet=root.querySelector("#bet"),sp=root.querySelector("#spin"),au=root.querySelector("#auto");
 function rg(){re.innerHTML=g.flat().map(x=>`<div class="ds-cell">${x[1]}</div>`).join("");}
 function rs(){bal.textContent=Math.floor(st.bal).toLocaleString();bet.textContent=st.bet+" 💎";SYMS.forEach(x=>{const v=st.m[x[0]]||0;root.querySelector("#m-"+x[0]).textContent=v+" / "+x[2];root.querySelector("#b-"+x[0]).style.width=Math.min(100,v/x[2]*100)+"%";});au.classList.toggle("on",st.auto);au.textContent=st.auto?"■ NDAL AUTO":"↻ AUTO";save(st);}
 function reward(id,n,a){st.m[id]=(st.m[id]||0)+n;const t=SYMS.find(x=>x[0]===id)[2];while(st.m[id]>=t){st.m[id]-=t;if(id==="diamond"){st.bal+=1000;a.push("💎 +1000");}if(id==="heart"){st.bal+=750;a.push("❤️ +750");}if(id==="star"){st.x2=(st.x2||0)+1;a.push("⭐ x2");}if(id==="apple"){st.free=(st.free||0)+3;a.push("🍎 +3 falas");}if(id==="strawberry"){st.bal+=1500;a.push("🍓 +1500");}}}
 function evalSpin(){const c={diamond:0,heart:0,star:0,apple:0,strawberry:0},a=[];g.flat().forEach(x=>c[x[0]]++);let win=0;if(c.diamond>=5){win+=1000;a.push("💎 5+ = +1000");}for(const row of g){for(const x of SYMS){const r=longest(row,x[0]);if(x[0]==="heart"&&r>=2){const p=[0,0,80,200,500,1000][r];win+=p;a.push("❤️ "+r+" në vijë +"+p);}else if(r>=3){const p=(x[0]==="diamond"?[0,0,0,120,400,1000]:[0,0,0,70,220,600])[r];win+=p;if(p)a.push(x[1]+" "+r+" në vijë +"+p);}}}if((st.x2||0)>0&&win){win*=2;st.x2--;a.push("⚡ x2");}st.bal+=win;SYMS.forEach(x=>reward(x[0],c[x[0]],a));st.best=Math.max(st.best||0,win);rs();msg.textContent=a.length?"FITOVE "+win+" 💎 · "+a.slice(0,3).join(" · "):"Pa fitim këtë herë. Shkallët u mbushën.";msg.classList.toggle("win",a.length>0);}
 function spin(){if(busy)return;if((st.free||0)<=0&&st.bal<st.bet){st.auto=false;rs();msg.textContent="Nuk ke diamante të mjaftueshme.";return;}busy=true;sh.classList.add("spinning");if((st.free||0)>0)st.free--;else st.bal-=st.bet;rs();let n=0;timer=setInterval(()=>{g=grid();rg();if(++n>8){clearInterval(timer);timer=null;}},70);setTimeout(()=>{if(timer){clearInterval(timer);timer=null;}g=grid();rg();sh.classList.remove("spinning");busy=false;evalSpin();if(st.auto)autoTimer=setTimeout(spin,850);},760);}
 function cb(d){if(busy)return;let i=BETS.indexOf(st.bet);i=Math.max(0,Math.min(BETS.length-1,i+d));st.bet=BETS[i];rs();}
 root.querySelector("#minus").onclick=()=>cb(-1);root.querySelector("#plus").onclick=()=>cb(1);sp.onclick=spin;au.onclick=()=>{st.auto=!st.auto;rs();if(st.auto&&!busy)spin();};root.querySelector("#dsBack").onclick=()=>{st.auto=false;if(timer)clearInterval(timer);if(autoTimer)clearTimeout(autoTimer);save(st);onBack?.();};rg();rs();
}