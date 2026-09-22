const DIET_LANG_KEY="pajaziti-language";
const DIET_PROFILE_KEY="diamond-diet-profile-v1";
const DIET_LOG_KEY="diamond-diet-log-v1";

const DT={
  sq:{tab:"Diet",title:"Diet & Kalori",private:"Vetëm në këtë telefon",privateText:"Emri, pesha dhe ushqimet ruhen vetëm në këtë telefon.",name:"Emri",weight:"Pesha (kg)",save:"Ruaj profilin",target:"Synimi ditor",eaten:"Të konsumuara",remaining:"Të mbetura",food:"Çfarë ke ngrënë ose pirë?",placeholder:"p.sh. 2 vezë, 100 g bukë, 250 ml qumësht",add:"Shto",today:"Sot",empty:"Ende nuk ke shtuar ushqim sot.",delete:"Fshi",notFound:"Nuk e njoha ushqimin. Shkruaj edhe sasinë ose kaloritë, p.sh. “200 g oriz” ose “450 kcal”.",saved:"U ruajt.",needProfile:"Shkruaj emrin dhe peshën së pari.",estimate:"Vlerësim orientues për të rritur; vetëm pesha nuk mjafton për një llogaritje mjekësisht të saktë.",kcal:"kcal",water:"Ujë",foodAdded:"U shtua",under18:"Për persona nën 18 vjeç, shtatzëni ose gjendje mjekësore, mos përdor objektiv automatik pa këshillë profesionale."},
  de:{tab:"Diät",title:"Diät & Kalorien",private:"Nur auf diesem Telefon",privateText:"Name, Gewicht und Essensdaten werden nur auf diesem Telefon gespeichert.",name:"Name",weight:"Gewicht (kg)",save:"Profil speichern",target:"Tagesziel",eaten:"Verbraucht",remaining:"Übrig",food:"Was hast du gegessen oder getrunken?",placeholder:"z. B. 2 Eier, 100 g Brot, 250 ml Milch",add:"Hinzufügen",today:"Heute",empty:"Heute wurde noch nichts eingetragen.",delete:"Löschen",notFound:"Lebensmittel nicht erkannt. Menge oder Kalorien angeben, z. B. „200 g Reis“ oder „450 kcal“.",saved:"Gespeichert.",needProfile:"Bitte zuerst Name und Gewicht eintragen.",estimate:"Orientierungswert für Erwachsene; nur das Gewicht reicht nicht für eine medizinisch genaue Kalorienberechnung.",kcal:"kcal",water:"Wasser",foodAdded:"Hinzugefügt",under18:"Unter 18, in Schwangerschaft oder bei Erkrankungen kein automatisches Kalorienziel ohne professionelle Beratung verwenden."},
  tr:{tab:"Diyet",title:"Diyet & Kalori",private:"Sadece bu telefonda",privateText:"İsim, kilo ve yemek kayıtları yalnızca bu telefonda saklanır.",name:"İsim",weight:"Kilo (kg)",save:"Profili kaydet",target:"Günlük hedef",eaten:"Tüketilen",remaining:"Kalan",food:"Ne yedin veya içtin?",placeholder:"örn. 2 yumurta, 100 g ekmek, 250 ml süt",add:"Ekle",today:"Bugün",empty:"Bugün henüz yemek eklenmedi.",delete:"Sil",notFound:"Yiyeceği tanıyamadım. Miktarı veya kaloriyi yaz: “200 g pilav” veya “450 kcal”.",saved:"Kaydedildi.",needProfile:"Önce isim ve kilonu yaz.",estimate:"Yetişkinler için yaklaşık değerdir; yalnızca kilo tıbben kesin kalori hesabı için yeterli değildir.",kcal:"kcal",water:"Su",foodAdded:"Eklendi",under18:"18 yaş altı, hamilelik veya sağlık sorunlarında profesyonel danışmanlık olmadan otomatik kalori hedefi kullanma."},
  en:{tab:"Diet",title:"Diet & Calories",private:"Only on this phone",privateText:"Name, weight and food logs are stored only on this phone.",name:"Name",weight:"Weight (kg)",save:"Save profile",target:"Daily target",eaten:"Consumed",remaining:"Remaining",food:"What did you eat or drink?",placeholder:"e.g. 2 eggs, 100 g bread, 250 ml milk",add:"Add",today:"Today",empty:"No food added today yet.",delete:"Delete",notFound:"Food not recognized. Add an amount or calories, e.g. “200 g rice” or “450 kcal”.",saved:"Saved.",needProfile:"Enter your name and weight first.",estimate:"Approximate adult estimate; weight alone is not enough for a medically precise calorie target.",kcal:"kcal",water:"Water",foodAdded:"Added",under18:"If under 18, pregnant or managing a medical condition, do not use an automatic calorie target without professional advice."},
  it:{tab:"Dieta",title:"Dieta & Calorie",private:"Solo su questo telefono",privateText:"Nome, peso e pasti vengono salvati solo su questo telefono.",name:"Nome",weight:"Peso (kg)",save:"Salva profilo",target:"Obiettivo giornaliero",eaten:"Consumate",remaining:"Rimanenti",food:"Cosa hai mangiato o bevuto?",placeholder:"es. 2 uova, 100 g pane, 250 ml latte",add:"Aggiungi",today:"Oggi",empty:"Nessun alimento registrato oggi.",delete:"Elimina",notFound:"Alimento non riconosciuto. Indica quantità o calorie.",saved:"Salvato.",needProfile:"Inserisci prima nome e peso.",estimate:"Stima orientativa per adulti; il solo peso non basta per un calcolo medico preciso.",kcal:"kcal",water:"Acqua",foodAdded:"Aggiunto",under18:"Sotto i 18 anni, in gravidanza o con condizioni mediche, non usare un obiettivo automatico senza consiglio professionale."},
  hr:{tab:"Dijeta",title:"Dijeta & Kalorije",private:"Samo na ovom telefonu",privateText:"Ime, težina i obroci spremaju se samo na ovom telefonu.",name:"Ime",weight:"Težina (kg)",save:"Spremi profil",target:"Dnevni cilj",eaten:"Potrošeno",remaining:"Preostalo",food:"Što si jeo ili pio?",placeholder:"npr. 2 jaja, 100 g kruha, 250 ml mlijeka",add:"Dodaj",today:"Danas",empty:"Danas još nema unosa.",delete:"Izbriši",notFound:"Namirnica nije prepoznata. Dodaj količinu ili kalorije.",saved:"Spremljeno.",needProfile:"Prvo unesi ime i težinu.",estimate:"Okvirna procjena za odrasle; sama težina nije dovoljna za medicinski precizan izračun.",kcal:"kcal",water:"Voda",foodAdded:"Dodano",under18:"Za mlađe od 18, trudnoću ili zdravstvena stanja ne koristi automatski cilj bez stručnog savjeta."},
  fr:{tab:"Régime",title:"Régime & Calories",private:"Uniquement sur ce téléphone",privateText:"Le nom, le poids et les repas restent uniquement sur ce téléphone.",name:"Nom",weight:"Poids (kg)",save:"Enregistrer",target:"Objectif quotidien",eaten:"Consommées",remaining:"Restantes",food:"Qu'as-tu mangé ou bu ?",placeholder:"ex. 2 œufs, 100 g pain, 250 ml lait",add:"Ajouter",today:"Aujourd'hui",empty:"Aucun aliment ajouté aujourd'hui.",delete:"Supprimer",notFound:"Aliment non reconnu. Ajoute une quantité ou les calories.",saved:"Enregistré.",needProfile:"Entre d'abord ton nom et ton poids.",estimate:"Estimation indicative pour adultes; le poids seul ne suffit pas pour un calcul médical précis.",kcal:"kcal",water:"Eau",foodAdded:"Ajouté",under18:"Moins de 18 ans, grossesse ou problème médical: ne pas utiliser un objectif automatique sans avis professionnel."},
  ar:{tab:"حمية",title:"الحمية والسعرات",private:"على هذا الهاتف فقط",privateText:"الاسم والوزن وسجل الطعام محفوظة على هذا الهاتف فقط.",name:"الاسم",weight:"الوزن (كغ)",save:"حفظ الملف",target:"الهدف اليومي",eaten:"المستهلك",remaining:"المتبقي",food:"ماذا أكلت أو شربت؟",placeholder:"مثال: بيضتان، 100غ خبز، 250مل حليب",add:"إضافة",today:"اليوم",empty:"لا توجد إضافات اليوم.",delete:"حذف",notFound:"لم أتعرف على الطعام. أضف الكمية أو السعرات.",saved:"تم الحفظ.",needProfile:"أدخل الاسم والوزن أولاً.",estimate:"تقدير تقريبي للبالغين؛ الوزن وحده لا يكفي لحساب طبي دقيق.",kcal:"سعرة",water:"ماء",foodAdded:"تمت الإضافة",under18:"لمن هم دون 18 أو في الحمل أو مع حالة طبية، لا تستخدم هدفاً تلقائياً دون استشارة مختص."}
};
function dl(){const l=localStorage.getItem(DIET_LANG_KEY)||"sq";return DT[l]?l:"en";}
function dt(k){return DT[dl()]?.[k]??DT.en[k]??k;}
function dateKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");}
function read(key,fb){try{return JSON.parse(localStorage.getItem(key)||"")||fb}catch{return fb}}
function write(key,v){localStorage.setItem(key,JSON.stringify(v))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

const FOODS=[
 {p:["buk","brot","bread","ekmek"],k:250,kind:"g",serv:50},
 {p:["oriz","reis","rice","pirinç","pilav"],k:130,kind:"g",serv:200},
 {p:["makaron","pasta","nudel","makarna"],k:150,kind:"g",serv:200},
 {p:["pul","huhn","chicken","tavuk"],k:165,kind:"g",serv:180},
 {p:["mish viçi","rind","beef","dana"],k:250,kind:"g",serv:180},
 {p:["peshk","fisch","fish","balık"],k:180,kind:"g",serv:180},
 {p:["vez","ei","egg","yumurta"],k:78,kind:"unit",serv:1},
 {p:["qumësht","milch","milk","süt"],k:50,kind:"ml",serv:250},
 {p:["kos","joghurt","yogurt","yoğurt"],k:60,kind:"g",serv:200},
 {p:["djath","käse","cheese","peynir"],k:280,kind:"g",serv:50},
 {p:["moll","apfel","apple","elma"],k:95,kind:"unit",serv:1},
 {p:["banan","banana","muz"],k:105,kind:"unit",serv:1},
 {p:["patate","kartoff","potato","patates"],k:80,kind:"g",serv:250},
 {p:["pomfrit","fries","frites","patates kızart"],k:312,kind:"g",serv:150},
 {p:["pizza"],k:266,kind:"g",serv:300},
 {p:["doner","döner","kebab"],k:650,kind:"unit",serv:1},
 {p:["burek","börek"],k:500,kind:"unit",serv:1},
 {p:["sup","suppe","soup","çorba"],k:120,kind:"unit",serv:1},
 {p:["sallat","salat","salad"],k:150,kind:"unit",serv:1},
 {p:["çokoll","schokolade","chocolate","çikolata"],k:535,kind:"g",serv:50},
 {p:["bisk","keks","cookie","kurabi"],k:480,kind:"g",serv:50},
 {p:["cola","kola"],k:42,kind:"ml",serv:330},
 {p:["lëng","saft","juice","meyve suyu"],k:45,kind:"ml",serv:250},
 {p:["ayran"],k:35,kind:"ml",serv:250},
 {p:["kafe","kaffee","coffee","kahve"],k:3,kind:"unit",serv:1},
 {p:["ujë","wasser","water","su"],k:0,kind:"ml",serv:250}
];

function profile(){return read(DIET_PROFILE_KEY,{name:"",weight:0,target:0});}
function estimateTarget(weight){
 const w=Number(weight);
 if(!Number.isFinite(w)||w<35||w>300)return 0;
 const raw=Math.round(w*30*0.85/50)*50;
 return Math.max(1500,Math.min(2800,raw));
}
function logs(){return read(DIET_LOG_KEY,{});}
function todayLogs(){return logs()[dateKey()]||[];}
function saveToday(items){const all=logs();all[dateKey()]=items;write(DIET_LOG_KEY,all);}
function parseFood(text){
 const raw=String(text||"").trim();
 if(!raw)return null;
 const exact=raw.match(/(\d+(?:[.,]\d+)?)\s*kcal/i);
 if(exact)return {label:raw,kcal:Math.max(0,Math.round(Number(exact[1].replace(",","."))))};
 const lower=raw.toLocaleLowerCase();
 const food=FOODS.find(f=>f.p.some(p=>lower.includes(p)));
 if(!food)return null;
 let amount=null;
 if(food.kind==="g"){
   const kg=lower.match(/(\d+(?:[.,]\d+)?)\s*kg\b/);
   const g=lower.match(/(\d+(?:[.,]\d+)?)\s*g\b/);
   amount=kg?Number(kg[1].replace(",","."))*1000:g?Number(g[1].replace(",",".")):food.serv;
   return {label:raw,kcal:Math.round(amount*food.k/100)};
 }
 if(food.kind==="ml"){
   const l=lower.match(/(\d+(?:[.,]\d+)?)\s*l\b/);
   const ml=lower.match(/(\d+(?:[.,]\d+)?)\s*ml\b/);
   amount=l?Number(l[1].replace(",","."))*1000:ml?Number(ml[1].replace(",",".")):food.serv;
   return {label:raw,kcal:Math.round(amount*food.k/100)};
 }
 const count=lower.match(/(^|\s)(\d+(?:[.,]\d+)?)(?=\s|$)/);
 amount=count?Number(count[2].replace(",",".")):food.serv;
 return {label:raw,kcal:Math.round(amount*food.k)};
}
function render(){
 const root=document.getElementById("dietRoot");if(!root)return;
 const p=profile(),items=todayLogs(),used=items.reduce((s,x)=>s+Number(x.kcal||0),0),target=Number(p.target||0),remain=Math.max(0,target-used);
 const pct=target?Math.min(100,Math.round(used/target*100)):0;
 root.innerHTML=`
 <section class="card local-private-head"><h2>🥗 ${esc(dt("title"))}</h2><span>🔒 ${esc(dt("private"))}</span><p class="muted small">${esc(dt("privateText"))}</p></section>
 <section class="card diet-profile">
   <div class="local-grid-2"><label>${esc(dt("name"))}<input id="dietName" value="${esc(p.name||"")}" maxlength="40"></label><label>${esc(dt("weight"))}<input id="dietWeight" type="number" min="35" max="300" step="0.1" value="${p.weight||""}"></label></div>
   <button id="dietSave" class="primary" type="button">${esc(dt("save"))}</button><div id="dietStatus" class="message"></div>
   <p class="muted small">${esc(dt("estimate"))}</p><p class="muted small">⚠️ ${esc(dt("under18"))}</p>
 </section>
 <section class="diet-summary">
   <div class="card diet-metric"><small>${esc(dt("target"))}</small><strong>${target||"—"}</strong><span>${esc(dt("kcal"))}</span></div>
   <div class="card diet-metric"><small>${esc(dt("eaten"))}</small><strong>${used}</strong><span>${esc(dt("kcal"))}</span></div>
   <div class="card diet-metric"><small>${esc(dt("remaining"))}</small><strong>${target?remain:"—"}</strong><span>${esc(dt("kcal"))}</span></div>
 </section>
 <div class="diet-progress"><div style="width:${pct}%"></div></div>
 <section class="card diet-add-card"><h3>🍽️ ${esc(dt("food"))}</h3><textarea id="dietFood" rows="2" placeholder="${esc(dt("placeholder"))}"></textarea><button id="dietAdd" class="primary" type="button">${esc(dt("add"))}</button><div id="dietFoodStatus" class="message"></div></section>
 <section class="card"><h3>📅 ${esc(dt("today"))}</h3><div id="dietList" class="diet-list">${items.length?items.map((x,i)=>`<div class="diet-row"><div><strong>${esc(x.label)}</strong><small>${new Date(x.time).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div><b>${x.kcal} ${esc(dt("kcal"))}</b><button type="button" data-diet-del="${i}">×</button></div>`).join(""):`<p class="muted">${esc(dt("empty"))}</p>`}</div></section>`;
 document.getElementById("dietSave")?.addEventListener("click",()=>{
   const name=document.getElementById("dietName")?.value.trim()||"";
   const weight=Number(document.getElementById("dietWeight")?.value||0);
   const status=document.getElementById("dietStatus");
   if(!name||!weight){if(status)status.textContent=dt("needProfile");return;}
   write(DIET_PROFILE_KEY,{name,weight,target:estimateTarget(weight)});
   if(status)status.textContent=dt("saved");setTimeout(render,300);
 });
 document.getElementById("dietAdd")?.addEventListener("click",()=>{
   const p=profile(),status=document.getElementById("dietFoodStatus");
   if(!p.name||!p.weight){if(status)status.textContent=dt("needProfile");return;}
   const input=document.getElementById("dietFood");const parsed=parseFood(input?.value||"");
   if(!parsed){if(status)status.textContent=dt("notFound");return;}
   const arr=todayLogs();arr.push({...parsed,time:new Date().toISOString()});saveToday(arr);if(input)input.value="";render();
 });
 root.querySelectorAll("[data-diet-del]").forEach(btn=>btn.addEventListener("click",()=>{const arr=todayLogs();arr.splice(Number(btn.dataset.dietDel),1);saveToday(arr);render();}));
}
function reloadLanguage(){const tab=document.getElementById("dietTabLabel");if(tab)tab.textContent=dt("tab");render();}
window.DiamondDiet={activate:render,reloadLanguage};
reloadLanguage();