const DIET_LANG_KEY="pajaziti-language";
const DIET_PROFILE_KEY="diamond-diet-profile-v1";
const DIET_LOG_KEY="diamond-diet-log-v1";
const DIET_DAY_KEY="diamond-diet-day-v1";

const DT={
  sq:{tab:"Diet",title:"Diet & Kalori",private:"Vetëm në këtë telefon",privateText:"Emri, pesha dhe ushqimet ruhen vetëm në këtë telefon.",name:"Emri",weight:"Pesha (kg)",save:"Ruaj profilin",target:"Synimi ditor",eaten:"Të konsumuara",remaining:"Të mbetura",food:"Çfarë ke ngrënë ose pirë?",placeholder:"p.sh. 2 vezë, 100 g bukë, 250 ml qumësht",add:"Shto",today:"Sot",empty:"Ende nuk ke shtuar ushqim sot.",delete:"Fshi",notFound:"Nuk e njoha ushqimin. Shkruaj edhe sasinë ose kaloritë, p.sh. “200 g oriz” ose “450 kcal”.",saved:"U ruajt.",needProfile:"Shkruaj emrin dhe peshën së pari.",estimate:"Vlerësim orientues për të rritur; vetëm pesha nuk mjafton për një llogaritje mjekësisht të saktë.",kcal:"kcal",water:"Ujë",foodAdded:"U shtua",under18:"Për persona nën 18 vjeç, shtatzëni ose gjendje mjekësore, mos përdor objektiv automatik pa këshillë profesionale.",kcalTarget:"Synimi kcal / ditë",bmi:"BMI",goalType:"Ziel",lose:"Dua të humb kg",gain:"Dua të shtoj kg",targetWeight:"Sa kg dëshiron të bëhesh?",targetDate:"Deri në cilën datë?",startedAt:"Data dhe ora kur e ke nisur",walking:"Sa ecje ke bërë sot?",walkingPh:"p.sh. 5 km ose 8 000 hapa",meals:"Çfarë ke ngrënë sot?",breakfast:"Mëngjes",lunch:"Drekë",dinner:"Mbrëmje",extra:"Extra / snack",mealPh:"Shkruaj çfarë ke ngrënë...",saveDay:"Ruaj ditarin e sotëm",daySaved:"Ditari u ruajt.",goalWeight:"Pesha Ziel"},
  de:{tab:"Diät",title:"Diät & Kalorien",private:"Nur auf diesem Telefon",privateText:"Name, Gewicht und Essensdaten werden nur auf diesem Telefon gespeichert.",name:"Name",weight:"Gewicht (kg)",save:"Profil speichern",target:"Tagesziel",eaten:"Verbraucht",remaining:"Übrig",food:"Was hast du gegessen oder getrunken?",placeholder:"z. B. 2 Eier, 100 g Brot, 250 ml Milch",add:"Hinzufügen",today:"Heute",empty:"Heute wurde noch nichts eingetragen.",delete:"Löschen",notFound:"Lebensmittel nicht erkannt. Menge oder Kalorien angeben, z. B. „200 g Reis“ oder „450 kcal“.",saved:"Gespeichert.",needProfile:"Bitte zuerst Name und Gewicht eintragen.",estimate:"Orientierungswert für Erwachsene; nur das Gewicht reicht nicht für eine medizinisch genaue Kalorienberechnung.",kcal:"kcal",water:"Wasser",foodAdded:"Hinzugefügt",under18:"Unter 18, in Schwangerschaft oder bei Erkrankungen kein automatisches Kalorienziel ohne professionelle Beratung verwenden.",kcalTarget:"Kalorienziel / Tag",bmi:"BMI",goalType:"Ziel",lose:"Ich möchte abnehmen",gain:"Ich möchte zunehmen",targetWeight:"Zielgewicht (kg)",targetDate:"Bis zu welchem Datum?",startedAt:"Startdatum und Uhrzeit",walking:"Wie viel bist du heute gegangen?",walkingPh:"z. B. 5 km oder 8.000 Schritte",meals:"Was hast du heute gegessen?",breakfast:"Frühstück",lunch:"Mittagessen",dinner:"Abendessen",extra:"Extra / Snack",mealPh:"Schreibe, was du gegessen hast...",saveDay:"Heutiges Tagebuch speichern",daySaved:"Tagebuch gespeichert.",goalWeight:"Zielgewicht"},
  tr:{tab:"Diyet",title:"Diyet & Kalori",private:"Sadece bu telefonda",privateText:"İsim, kilo ve yemek kayıtları yalnızca bu telefonda saklanır.",name:"İsim",weight:"Kilo (kg)",save:"Profili kaydet",target:"Günlük hedef",eaten:"Tüketilen",remaining:"Kalan",food:"Ne yedin veya içtin?",placeholder:"örn. 2 yumurta, 100 g ekmek, 250 ml süt",add:"Ekle",today:"Bugün",empty:"Bugün henüz yemek eklenmedi.",delete:"Sil",notFound:"Yiyeceği tanıyamadım. Miktarı veya kaloriyi yaz: “200 g pilav” veya “450 kcal”.",saved:"Kaydedildi.",needProfile:"Önce isim ve kilonu yaz.",estimate:"Yetişkinler için yaklaşık değerdir; yalnızca kilo tıbben kesin kalori hesabı için yeterli değildir.",kcal:"kcal",water:"Su",foodAdded:"Eklendi",under18:"18 yaş altı, hamilelik veya sağlık sorunlarında profesyonel danışmanlık olmadan otomatik kalori hedefi kullanma.",kcalTarget:"Günlük kcal hedefi",bmi:"BMI",goalType:"Hedef",lose:"Kilo vermek istiyorum",gain:"Kilo almak istiyorum",targetWeight:"Hedef kilo (kg)",targetDate:"Hangi tarihe kadar?",startedAt:"Başlangıç tarihi ve saati",walking:"Bugün ne kadar yürüdün?",walkingPh:"örn. 5 km veya 8.000 adım",meals:"Bugün ne yedin?",breakfast:"Kahvaltı",lunch:"Öğle",dinner:"Akşam",extra:"Ekstra / atıştırma",mealPh:"Ne yediğini yaz...",saveDay:"Bugünün günlüğünü kaydet",daySaved:"Günlük kaydedildi.",goalWeight:"Hedef kilo"},
  en:{tab:"Diet",title:"Diet & Calories",private:"Only on this phone",privateText:"Name, weight and food logs are stored only on this phone.",name:"Name",weight:"Weight (kg)",save:"Save profile",target:"Daily target",eaten:"Consumed",remaining:"Remaining",food:"What did you eat or drink?",placeholder:"e.g. 2 eggs, 100 g bread, 250 ml milk",add:"Add",today:"Today",empty:"No food added today yet.",delete:"Delete",notFound:"Food not recognized. Add an amount or calories, e.g. “200 g rice” or “450 kcal”.",saved:"Saved.",needProfile:"Enter your name and weight first.",estimate:"Approximate adult estimate; weight alone is not enough for a medically precise calorie target.",kcal:"kcal",water:"Water",foodAdded:"Added",under18:"If under 18, pregnant or managing a medical condition, do not use an automatic calorie target without professional advice.",kcalTarget:"Daily kcal target",bmi:"BMI",goalType:"Goal",lose:"I want to lose weight",gain:"I want to gain weight",targetWeight:"Target weight (kg)",targetDate:"Target date",startedAt:"Start date and time",walking:"How much did you walk today?",walkingPh:"e.g. 5 km or 8,000 steps",meals:"What did you eat today?",breakfast:"Breakfast",lunch:"Lunch",dinner:"Dinner",extra:"Extra / snack",mealPh:"Write what you ate...",saveDay:"Save today's diary",daySaved:"Diary saved.",goalWeight:"Target weight"},
  it:{tab:"Dieta",title:"Dieta & Calorie",private:"Solo su questo telefono",privateText:"Nome, peso e pasti vengono salvati solo su questo telefono.",name:"Nome",weight:"Peso (kg)",save:"Salva profilo",target:"Obiettivo giornaliero",eaten:"Consumate",remaining:"Rimanenti",food:"Cosa hai mangiato o bevuto?",placeholder:"es. 2 uova, 100 g pane, 250 ml latte",add:"Aggiungi",today:"Oggi",empty:"Nessun alimento registrato oggi.",delete:"Elimina",notFound:"Alimento non riconosciuto. Indica quantità o calorie.",saved:"Salvato.",needProfile:"Inserisci prima nome e peso.",estimate:"Stima orientativa per adulti; il solo peso non basta per un calcolo medico preciso.",kcal:"kcal",water:"Acqua",foodAdded:"Aggiunto",under18:"Sotto i 18 anni, in gravidanza o con condizioni mediche, non usare un obiettivo automatico senza consiglio professionale.",kcalTarget:"Obiettivo kcal / giorno",bmi:"BMI",goalType:"Obiettivo",lose:"Voglio perdere peso",gain:"Voglio aumentare peso",targetWeight:"Peso obiettivo (kg)",targetDate:"Data obiettivo",startedAt:"Data e ora di inizio",walking:"Quanto hai camminato oggi?",walkingPh:"es. 5 km o 8.000 passi",meals:"Cosa hai mangiato oggi?",breakfast:"Colazione",lunch:"Pranzo",dinner:"Cena",extra:"Extra / snack",mealPh:"Scrivi cosa hai mangiato...",saveDay:"Salva diario di oggi",daySaved:"Diario salvato.",goalWeight:"Peso obiettivo"},
  hr:{tab:"Dijeta",title:"Dijeta & Kalorije",private:"Samo na ovom telefonu",privateText:"Ime, težina i obroci spremaju se samo na ovom telefonu.",name:"Ime",weight:"Težina (kg)",save:"Spremi profil",target:"Dnevni cilj",eaten:"Potrošeno",remaining:"Preostalo",food:"Što si jeo ili pio?",placeholder:"npr. 2 jaja, 100 g kruha, 250 ml mlijeka",add:"Dodaj",today:"Danas",empty:"Danas još nema unosa.",delete:"Izbriši",notFound:"Namirnica nije prepoznata. Dodaj količinu ili kalorije.",saved:"Spremljeno.",needProfile:"Prvo unesi ime i težinu.",estimate:"Okvirna procjena za odrasle; sama težina nije dovoljna za medicinski precizan izračun.",kcal:"kcal",water:"Voda",foodAdded:"Dodano",under18:"Za mlađe od 18, trudnoću ili zdravstvena stanja ne koristi automatski cilj bez stručnog savjeta.",kcalTarget:"Dnevni kcal cilj",bmi:"BMI",goalType:"Cilj",lose:"Želim smršavjeti",gain:"Želim dobiti na težini",targetWeight:"Ciljana težina (kg)",targetDate:"Ciljani datum",startedAt:"Datum i vrijeme početka",walking:"Koliko si danas hodao?",walkingPh:"npr. 5 km ili 8.000 koraka",meals:"Što si danas jeo?",breakfast:"Doručak",lunch:"Ručak",dinner:"Večera",extra:"Extra / međuobrok",mealPh:"Napiši što si jeo...",saveDay:"Spremi današnji dnevnik",daySaved:"Dnevnik spremljen.",goalWeight:"Ciljana težina"},
  fr:{tab:"Régime",title:"Régime & Calories",private:"Uniquement sur ce téléphone",privateText:"Le nom, le poids et les repas restent uniquement sur ce téléphone.",name:"Nom",weight:"Poids (kg)",save:"Enregistrer",target:"Objectif quotidien",eaten:"Consommées",remaining:"Restantes",food:"Qu'as-tu mangé ou bu ?",placeholder:"ex. 2 œufs, 100 g pain, 250 ml lait",add:"Ajouter",today:"Aujourd'hui",empty:"Aucun aliment ajouté aujourd'hui.",delete:"Supprimer",notFound:"Aliment non reconnu. Ajoute une quantité ou les calories.",saved:"Enregistré.",needProfile:"Entre d'abord ton nom et ton poids.",estimate:"Estimation indicative pour adultes; le poids seul ne suffit pas pour un calcul médical précis.",kcal:"kcal",water:"Eau",foodAdded:"Ajouté",under18:"Moins de 18 ans, grossesse ou problème médical: ne pas utiliser un objectif automatique sans avis professionnel.",kcalTarget:"Objectif kcal / jour",bmi:"IMC",goalType:"Objectif",lose:"Je veux perdre du poids",gain:"Je veux prendre du poids",targetWeight:"Poids cible (kg)",targetDate:"Date cible",startedAt:"Date et heure de début",walking:"Combien as-tu marché aujourd'hui ?",walkingPh:"ex. 5 km ou 8 000 pas",meals:"Qu'as-tu mangé aujourd'hui ?",breakfast:"Petit-déjeuner",lunch:"Déjeuner",dinner:"Dîner",extra:"Extra / collation",mealPh:"Écris ce que tu as mangé...",saveDay:"Enregistrer le journal du jour",daySaved:"Journal enregistré.",goalWeight:"Poids cible"},
  ar:{tab:"حمية",title:"الحمية والسعرات",private:"على هذا الهاتف فقط",privateText:"الاسم والوزن وسجل الطعام محفوظة على هذا الهاتف فقط.",name:"الاسم",weight:"الوزن (كغ)",save:"حفظ الملف",target:"الهدف اليومي",eaten:"المستهلك",remaining:"المتبقي",food:"ماذا أكلت أو شربت؟",placeholder:"مثال: بيضتان، 100غ خبز، 250مل حليب",add:"إضافة",today:"اليوم",empty:"لا توجد إضافات اليوم.",delete:"حذف",notFound:"لم أتعرف على الطعام. أضف الكمية أو السعرات.",saved:"تم الحفظ.",needProfile:"أدخل الاسم والوزن أولاً.",estimate:"تقدير تقريبي للبالغين؛ الوزن وحده لا يكفي لحساب طبي دقيق.",kcal:"سعرة",water:"ماء",foodAdded:"تمت الإضافة",under18:"لمن هم دون 18 أو في الحمل أو مع حالة طبية، لا تستخدم هدفاً تلقائياً دون استشارة مختص.",kcalTarget:"هدف السعرات اليومي",bmi:"BMI",goalType:"الهدف",lose:"أريد إنقاص الوزن",gain:"أريد زيادة الوزن",targetWeight:"الوزن المستهدف (كغ)",targetDate:"تاريخ الهدف",startedAt:"تاريخ ووقت البداية",walking:"كم مشيت اليوم؟",walkingPh:"مثال: 5 كم أو 8000 خطوة",meals:"ماذا أكلت اليوم؟",breakfast:"الفطور",lunch:"الغداء",dinner:"العشاء",extra:"إضافي / وجبة خفيفة",mealPh:"اكتب ماذا أكلت...",saveDay:"حفظ يوميات اليوم",daySaved:"تم حفظ اليوميات.",goalWeight:"الوزن المستهدف"}
};
const DTX={
 sq:{height:"Gjatësia (cm)",auto:"Automatik",manual:"Manual",bmiMode:"BMI mënyra",kcalMode:"kcal mënyra",bmiFormula:"BMI = pesha ÷ (gjatësia × gjatësia)",bmiUnder:"Nënpeshë",bmiNormal:"Peshë normale",bmiOver:"Mbipeshë",bmiOb1:"Obezitet gradë 1",bmiOb2:"Obezitet gradë 2",bmiOb3:"Obezitet gradë 3",autoKcalNote:"Vlerësim automatik sipas peshës aktuale, peshës Ziel dhe datës. Është orientues, jo rekomandim mjekësor.",needAutoKcal:"Për kcal automatike duhen pesha aktuale, pesha Ziel dhe data e Ziel-it.",days:"ditë",dailyChange:"ndryshim ditor"},
 de:{height:"Größe (cm)",auto:"Automatisch",manual:"Manuell",bmiMode:"BMI-Modus",kcalMode:"kcal-Modus",bmiFormula:"BMI = Gewicht ÷ (Größe × Größe)",bmiUnder:"Untergewicht",bmiNormal:"Normalgewicht",bmiOver:"Übergewicht",bmiOb1:"Adipositas Grad 1",bmiOb2:"Adipositas Grad 2",bmiOb3:"Adipositas Grad 3",autoKcalNote:"Automatische Schätzung nach aktuellem Gewicht, Zielgewicht und Zieldatum. Nur Orientierung, keine medizinische Empfehlung.",needAutoKcal:"Für automatische kcal werden aktuelles Gewicht, Zielgewicht und Zieldatum benötigt.",days:"Tage",dailyChange:"tägliche Anpassung"},
 tr:{height:"Boy (cm)",auto:"Otomatik",manual:"Manuel",bmiMode:"BMI modu",kcalMode:"kcal modu",bmiFormula:"BMI = kilo ÷ (boy × boy)",bmiUnder:"Düşük kilo",bmiNormal:"Normal kilo",bmiOver:"Fazla kilo",bmiOb1:"Obezite derece 1",bmiOb2:"Obezite derece 2",bmiOb3:"Obezite derece 3",autoKcalNote:"Mevcut kilo, hedef kilo ve hedef tarihe göre otomatik tahmin. Yalnızca yönlendiricidir, tıbbi öneri değildir.",needAutoKcal:"Otomatik kcal için mevcut kilo, hedef kilo ve hedef tarih gerekir.",days:"gün",dailyChange:"günlük değişim"},
 en:{height:"Height (cm)",auto:"Automatic",manual:"Manual",bmiMode:"BMI mode",kcalMode:"kcal mode",bmiFormula:"BMI = weight ÷ (height × height)",bmiUnder:"Underweight",bmiNormal:"Normal weight",bmiOver:"Overweight",bmiOb1:"Obesity class 1",bmiOb2:"Obesity class 2",bmiOb3:"Obesity class 3",autoKcalNote:"Automatic estimate based on current weight, target weight and target date. It is guidance, not medical advice.",needAutoKcal:"Automatic kcal needs current weight, target weight and target date.",days:"days",dailyChange:"daily adjustment"},
 it:{height:"Altezza (cm)",auto:"Automatico",manual:"Manuale",bmiMode:"Modalità BMI",kcalMode:"Modalità kcal",bmiFormula:"BMI = peso ÷ (altezza × altezza)",bmiUnder:"Sottopeso",bmiNormal:"Peso normale",bmiOver:"Sovrappeso",bmiOb1:"Obesità grado 1",bmiOb2:"Obesità grado 2",bmiOb3:"Obesità grado 3",autoKcalNote:"Stima automatica in base a peso attuale, peso obiettivo e data. Solo orientativa, non è un consiglio medico.",needAutoKcal:"Per kcal automatiche servono peso attuale, peso obiettivo e data.",days:"giorni",dailyChange:"variazione giornaliera"},
 hr:{height:"Visina (cm)",auto:"Automatski",manual:"Ručno",bmiMode:"BMI način",kcalMode:"kcal način",bmiFormula:"BMI = težina ÷ (visina × visina)",bmiUnder:"Pothranjenost",bmiNormal:"Normalna težina",bmiOver:"Prekomjerna težina",bmiOb1:"Pretilost stupanj 1",bmiOb2:"Pretilost stupanj 2",bmiOb3:"Pretilost stupanj 3",autoKcalNote:"Automatska procjena prema trenutačnoj težini, ciljanoj težini i datumu. Samo orijentacijski, nije medicinski savjet.",needAutoKcal:"Za automatske kcal trebaju trenutačna težina, ciljna težina i datum.",days:"dana",dailyChange:"dnevna promjena"},
 fr:{height:"Taille (cm)",auto:"Automatique",manual:"Manuel",bmiMode:"Mode IMC",kcalMode:"Mode kcal",bmiFormula:"IMC = poids ÷ (taille × taille)",bmiUnder:"Insuffisance pondérale",bmiNormal:"Poids normal",bmiOver:"Surpoids",bmiOb1:"Obésité grade 1",bmiOb2:"Obésité grade 2",bmiOb3:"Obésité grade 3",autoKcalNote:"Estimation automatique selon le poids actuel, le poids cible et la date cible. Indicative seulement, pas un avis médical.",needAutoKcal:"Pour les kcal automatiques, il faut le poids actuel, le poids cible et la date cible.",days:"jours",dailyChange:"ajustement quotidien"},
 ar:{height:"الطول (سم)",auto:"تلقائي",manual:"يدوي",bmiMode:"وضع BMI",kcalMode:"وضع السعرات",bmiFormula:"BMI = الوزن ÷ (الطول × الطول)",bmiUnder:"نقص وزن",bmiNormal:"وزن طبيعي",bmiOver:"زيادة وزن",bmiOb1:"سمنة درجة 1",bmiOb2:"سمنة درجة 2",bmiOb3:"سمنة درجة 3",autoKcalNote:"تقدير تلقائي حسب الوزن الحالي والوزن المستهدف والتاريخ المستهدف. إرشادي فقط وليس توصية طبية.",needAutoKcal:"للسعرات التلقائية يلزم الوزن الحالي والوزن المستهدف والتاريخ.",days:"أيام",dailyChange:"تعديل يومي"}
};
function dl(){const l=localStorage.getItem(DIET_LANG_KEY)||"sq";return DT[l]?l:"en";}
function dt(k){return DT[dl()]?.[k]??DTX[dl()]?.[k]??DT.en[k]??DTX.en[k]??k;}
function dateKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");}
function read(key,fb){try{return JSON.parse(localStorage.getItem(key)||"")||fb}catch{return fb}}
function write(key,v){localStorage.setItem(key,JSON.stringify(v))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

function nowLocalInput(){const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+"T"+p(d.getHours())+":"+p(d.getMinutes());}
function numValue(id){const raw=document.getElementById(id)?.value;if(raw==null||raw==="")return 0;const n=Number(raw);return Number.isFinite(n)?n:0;}

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

function profile(){
 const p=read(DIET_PROFILE_KEY,{name:"",weight:0,target:0});
 const oldTarget=Number(p.target||0);
 return {...p,bmi:p.bmi??"",height:Number(p.height||0),bmiMode:String(p.bmiMode||"auto"),kcalMode:String(p.kcalMode||(oldTarget?"manual":"auto")),targetWeight:Number(p.targetWeight||0),targetDate:String(p.targetDate||""),startedAt:String(p.startedAt||""),goalDirection:String(p.goalDirection||"lose")};
}
function calcBmi(weight,heightCm){
 const w=Number(weight),h=Number(heightCm)/100;
 if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return null;
 return Math.round((w/(h*h))*10)/10;
}
function bmiCategory(v){
 const n=Number(v); if(!Number.isFinite(n)||n<=0)return "";
 if(n<18.5)return dt("bmiUnder");
 if(n<25)return dt("bmiNormal");
 if(n<30)return dt("bmiOver");
 if(n<35)return dt("bmiOb1");
 if(n<40)return dt("bmiOb2");
 return dt("bmiOb3");
}
function daysUntil(dateText){
 if(!dateText)return 0;
 const target=new Date(dateText+"T23:59:59"),now=new Date();
 const d=Math.ceil((target-now)/86400000);
 return Number.isFinite(d)?Math.max(0,d):0;
}
function autoKcalPlan(weight,targetWeight,targetDate,goalDirection){
 const w=Number(weight),tw=Number(targetWeight),days=daysUntil(targetDate);
 if(!w||!tw||!days)return {target:0,maintenance:0,adjustment:0,days};
 const maintenance=Math.round((w*30)/10)*10;
 const kgDiff=Math.abs(tw-w);
 const rawAdj=Math.round((kgDiff*7700/days)/10)*10;
 const adjustment=Math.min(1000,rawAdj);
 let target=goalDirection==="gain"?maintenance+adjustment:maintenance-adjustment;
 target=Math.max(1200,Math.min(4500,Math.round(target/10)*10));
 return {target,maintenance,adjustment,days};
}
function logs(){return read(DIET_LOG_KEY,{});}
function todayLogs(){return logs()[dateKey()]||[];}
function saveToday(items){const all=logs();all[dateKey()]=items;write(DIET_LOG_KEY,all);}
function dayJournal(){const all=read(DIET_DAY_KEY,{});return all[dateKey()]||{walking:"",breakfast:"",lunch:"",dinner:"",extra:""};}
function saveDayJournal(v){const all=read(DIET_DAY_KEY,{});all[dateKey()]=v;write(DIET_DAY_KEY,all);}
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
 const p=profile(),items=todayLogs(),day=dayJournal(),used=items.reduce((sum,x)=>sum+Number(x.kcal||0),0);
 const autoBmi=calcBmi(p.weight,p.height),displayBmi=p.bmiMode==="auto"?(autoBmi??""):p.bmi;
 const plan=autoKcalPlan(p.weight,p.targetWeight,p.targetDate,p.goalDirection);
 const target=p.kcalMode==="auto"?plan.target:Number(p.target||0);
 const remain=target?target-used:0,pct=target?Math.min(100,Math.round(used/target*100)):0,started=p.startedAt||nowLocalInput();
 root.innerHTML=`
 <section class="card local-private-head"><h2>🥗 ${esc(dt("title"))}</h2><span>🔒 ${esc(dt("private"))}</span><p class="muted small">${esc(dt("privateText"))}</p></section>
 <section class="card diet-profile diet-goal-card">
   <div class="diet-field-grid">
     <label>${esc(dt("name"))}<input id="dietName" value="${esc(p.name||"")}" maxlength="40"></label>
     <label>${esc(dt("weight"))}<input id="dietWeight" type="number" min="20" max="400" step="0.1" value="${p.weight||""}"></label>
     <label>${esc(dt("height"))}<input id="dietHeight" type="number" min="80" max="250" step="0.1" value="${p.height||""}"></label>
     <label>${esc(dt("bmiMode"))}<select id="dietBmiMode"><option value="auto" ${p.bmiMode==="auto"?"selected":""}>${esc(dt("auto"))}</option><option value="manual" ${p.bmiMode==="manual"?"selected":""}>${esc(dt("manual"))}</option></select></label>
     <label>${esc(dt("bmi"))}<input id="dietBmi" type="number" min="0" max="100" step="0.1" value="${displayBmi!==""?esc(displayBmi):""}" ${p.bmiMode==="auto"?"readonly":""}><small id="dietBmiCategory" class="diet-calc-note">${displayBmi!==""?esc(bmiCategory(displayBmi)):""} ${p.bmiMode==="auto"?"· "+esc(dt("bmiFormula")):""}</small></label>
     <label>${esc(dt("goalType"))}<select id="dietGoalDirection"><option value="lose" ${p.goalDirection==="lose"?"selected":""}>${esc(dt("lose"))}</option><option value="gain" ${p.goalDirection==="gain"?"selected":""}>${esc(dt("gain"))}</option></select></label>
     <label>${esc(dt("targetWeight"))}<input id="dietTargetWeight" type="number" min="20" max="400" step="0.1" value="${p.targetWeight||""}"></label>
     <label>${esc(dt("targetDate"))}<input id="dietTargetDate" type="date" value="${esc(p.targetDate)}"></label>
     <label>${esc(dt("kcalMode"))}<select id="dietKcalMode"><option value="auto" ${p.kcalMode==="auto"?"selected":""}>${esc(dt("auto"))}</option><option value="manual" ${p.kcalMode==="manual"?"selected":""}>${esc(dt("manual"))}</option></select></label>
     <label>${esc(dt("kcalTarget"))}<input id="dietKcalTarget" type="number" min="0" max="10000" step="10" value="${target||""}" ${p.kcalMode==="auto"?"readonly":""}><small id="dietKcalCalcNote" class="diet-calc-note">${p.kcalMode==="auto"?(plan.target?(esc(dt("autoKcalNote"))+" · "+plan.days+" "+esc(dt("days"))+" · "+(p.goalDirection==="gain"?"+":"-")+plan.adjustment+" "+esc(dt("kcal"))+" "+esc(dt("dailyChange"))):esc(dt("needAutoKcal"))):""}</small></label>
     <label>${esc(dt("startedAt"))}<input id="dietStartedAt" type="datetime-local" value="${esc(started)}"></label>
   </div>
   <button id="dietSave" class="primary" type="button">${esc(dt("save"))}</button><div id="dietStatus" class="message"></div>
 </section>
 <section class="diet-summary">
   <div class="card diet-metric"><small>${esc(dt("target"))}</small><strong>${target||"—"}</strong><span>${esc(dt("kcal"))}</span></div>
   <div class="card diet-metric"><small>${esc(dt("eaten"))}</small><strong>${used}</strong><span>${esc(dt("kcal"))}</span></div>
   <div class="card diet-metric"><small>${esc(dt("remaining"))}</small><strong>${target?remain:"—"}</strong><span>${esc(dt("kcal"))}</span></div>
   <div class="card diet-metric"><small>${esc(dt("bmi"))}</small><strong id="dietSummaryBmi">${displayBmi!==""?esc(displayBmi):"—"}</strong><span id="dietSummaryBmiCat">${displayBmi!==""?esc(bmiCategory(displayBmi)):"BMI"}</span></div>
   <div class="card diet-metric"><small>${esc(dt("goalWeight"))}</small><strong>${p.targetWeight||"—"}</strong><span>kg</span></div>
 </section>
 <div class="diet-progress"><div style="width:${pct}%"></div></div>
 <section class="card diet-diary-card">
   <h3>🚶 ${esc(dt("walking"))}</h3><input id="dietWalking" type="text" value="${esc(day.walking||"")}" placeholder="${esc(dt("walkingPh"))}">
   <h3>🍽️ ${esc(dt("meals"))}</h3>
   <div class="diet-meal-grid">
     <label><span>🌅 ${esc(dt("breakfast"))}</span><textarea id="dietBreakfast" rows="3" placeholder="${esc(dt("mealPh"))}">${esc(day.breakfast||"")}</textarea></label>
     <label><span>☀️ ${esc(dt("lunch"))}</span><textarea id="dietLunch" rows="3" placeholder="${esc(dt("mealPh"))}">${esc(day.lunch||"")}</textarea></label>
     <label><span>🌙 ${esc(dt("dinner"))}</span><textarea id="dietDinner" rows="3" placeholder="${esc(dt("mealPh"))}">${esc(day.dinner||"")}</textarea></label>
     <label><span>🍎 ${esc(dt("extra"))}</span><textarea id="dietExtra" rows="3" placeholder="${esc(dt("mealPh"))}">${esc(day.extra||"")}</textarea></label>
   </div>
   <button id="dietSaveDay" class="primary" type="button">${esc(dt("saveDay"))}</button><div id="dietDayStatus" class="message"></div>
 </section>
 <section class="card diet-add-card"><h3>➕ ${esc(dt("food"))}</h3><textarea id="dietFood" rows="2" placeholder="${esc(dt("placeholder"))}"></textarea><button id="dietAdd" class="primary" type="button">${esc(dt("add"))}</button><div id="dietFoodStatus" class="message"></div></section>
 <section class="card"><h3>📅 ${esc(dt("today"))}</h3><div id="dietList" class="diet-list">${items.length?items.map((x,i)=>`<div class="diet-row"><div><strong>${esc(x.label)}</strong><small>${new Date(x.time).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div><b>${x.kcal} ${esc(dt("kcal"))}</b><button type="button" data-diet-del="${i}">×</button></div>`).join(""):`<p class="muted">${esc(dt("empty"))}</p>`}</div></section>`;

 const liveCalc=()=>{
   const w=numValue("dietWeight"),h=numValue("dietHeight"),tw=numValue("dietTargetWeight"),date=document.getElementById("dietTargetDate")?.value||"",direction=document.getElementById("dietGoalDirection")?.value||"lose";
   const bmiMode=document.getElementById("dietBmiMode")?.value||"auto",bmiInput=document.getElementById("dietBmi"),bmiNote=document.getElementById("dietBmiCategory");
   if(bmiInput){bmiInput.readOnly=bmiMode==="auto";if(bmiMode==="auto"){const v=calcBmi(w,h);bmiInput.value=v??"";}const v=bmiInput.value;if(bmiNote)bmiNote.textContent=v?(bmiCategory(v)+(bmiMode==="auto"?" · "+dt("bmiFormula"):"")):"";}
   const kcalMode=document.getElementById("dietKcalMode")?.value||"auto",kcalInput=document.getElementById("dietKcalTarget"),kcalNote=document.getElementById("dietKcalCalcNote"),planNow=autoKcalPlan(w,tw,date,direction);
   if(kcalInput){kcalInput.readOnly=kcalMode==="auto";if(kcalMode==="auto")kcalInput.value=planNow.target||"";}
   if(kcalNote)kcalNote.textContent=kcalMode==="auto"?(planNow.target?(dt("autoKcalNote")+" · "+planNow.days+" "+dt("days")+" · "+(direction==="gain"?"+":"-")+planNow.adjustment+" "+dt("kcal")+" "+dt("dailyChange")):dt("needAutoKcal")):"";
 };
 ["dietWeight","dietHeight","dietTargetWeight","dietTargetDate","dietGoalDirection","dietBmiMode","dietKcalMode"].forEach(id=>document.getElementById(id)?.addEventListener("input",liveCalc));
 ["dietGoalDirection","dietBmiMode","dietKcalMode"].forEach(id=>document.getElementById(id)?.addEventListener("change",liveCalc));

 document.getElementById("dietSave")?.addEventListener("click",()=>{
   liveCalc();
   const saved={name:document.getElementById("dietName")?.value.trim()||"",weight:numValue("dietWeight"),height:numValue("dietHeight"),bmiMode:document.getElementById("dietBmiMode")?.value||"auto",bmi:document.getElementById("dietBmi")?.value||"",kcalMode:document.getElementById("dietKcalMode")?.value||"auto",target:numValue("dietKcalTarget"),goalDirection:document.getElementById("dietGoalDirection")?.value||"lose",targetWeight:numValue("dietTargetWeight"),targetDate:document.getElementById("dietTargetDate")?.value||"",startedAt:document.getElementById("dietStartedAt")?.value||""};
   write(DIET_PROFILE_KEY,saved);const status=document.getElementById("dietStatus");if(status)status.textContent=dt("saved");setTimeout(render,250);
 });
 document.getElementById("dietSaveDay")?.addEventListener("click",()=>{saveDayJournal({walking:document.getElementById("dietWalking")?.value.trim()||"",breakfast:document.getElementById("dietBreakfast")?.value.trim()||"",lunch:document.getElementById("dietLunch")?.value.trim()||"",dinner:document.getElementById("dietDinner")?.value.trim()||"",extra:document.getElementById("dietExtra")?.value.trim()||""});const status=document.getElementById("dietDayStatus");if(status)status.textContent=dt("daySaved");});
 document.getElementById("dietAdd")?.addEventListener("click",()=>{const status=document.getElementById("dietFoodStatus"),input=document.getElementById("dietFood"),parsed=parseFood(input?.value||"");if(!parsed){if(status)status.textContent=dt("notFound");return;}const arr=todayLogs();arr.push({...parsed,time:new Date().toISOString()});saveToday(arr);if(input)input.value="";render();});
 root.querySelectorAll("[data-diet-del]").forEach(btn=>btn.addEventListener("click",()=>{const arr=todayLogs();arr.splice(Number(btn.dataset.dietDel),1);saveToday(arr);render();}));
}
function reloadLanguage(){const tab=document.getElementById("dietTabLabel");if(tab)tab.textContent=dt("tab");render();}
window.DiamondDiet={activate:render,reloadLanguage};
reloadLanguage();