
const LANG_KEY="pajaziti-language";
const TXT={
sq:{duaTitle:"Mëso dua",duaDesc:"Duat dhe dhikret kryesore të namazit",learnTitle:"Mëso Kuranin",learnDesc:"Germat arabe dhe shqiptimi me zë",tasbihTitle:"Tespih",tasbihDesc:"Numërues i ruajtur në telefon",openDua:"Hap duatë →",openLearn:"Mëso germat →",openTasbih:"Hap tespihin →",close:"Mbyll",back:"← Namazi",listen:"Dëgjo",arabic:"Arabisht",pron:"Shqiptimi",meaning:"Kuptimi",target:"Objektivi",count:"Numri",set:"Ruaj",reset:"Reset",minus:"−1",plus:"+1",reached:"Objektivi u arrit!",manual:"Vendos numrin aktual",phrase:"Dhikri",teacher:"Shënim: shqiptimi me zë është ndihmës. Për texhvid të saktë mëso edhe me mësues."},
tr:{duaTitle:"Dua öğren",duaDesc:"Namazda okunan temel dua ve zikirler",learnTitle:"Kur'an öğren",learnDesc:"Arap harfleri ve sesli telaffuz",tasbihTitle:"Tesbih",tasbihDesc:"Uygulama kapansa da sayacı korur",openDua:"Duaları aç →",openLearn:"Harfleri öğren →",openTasbih:"Tesbihi aç →",close:"Kapat",back:"← Namaz",listen:"Dinle",arabic:"Arapça",pron:"Okunuş",meaning:"Anlam",target:"Hedef",count:"Sayı",set:"Kaydet",reset:"Sıfırla",minus:"−1",plus:"+1",reached:"Hedefe ulaşıldı!",manual:"Mevcut sayıyı ayarla",phrase:"Zikir",teacher:"Not: sesli telaffuz yardımcıdır. Doğru tecvid için bir hocadan da öğren."},
de:{duaTitle:"Duas lernen",duaDesc:"Wichtige Bittgebete und Dhikr im Gebet",learnTitle:"Koran lernen",learnDesc:"Arabische Buchstaben mit Aussprache",tasbihTitle:"Tasbih",tasbihDesc:"Zähler bleibt nach Schließen der App gespeichert",openDua:"Duas öffnen →",openLearn:"Buchstaben lernen →",openTasbih:"Tasbih öffnen →",close:"Schließen",back:"← Gebet",listen:"Anhören",arabic:"Arabisch",pron:"Aussprache",meaning:"Bedeutung",target:"Ziel",count:"Zähler",set:"Speichern",reset:"Zurücksetzen",minus:"−1",plus:"+1",reached:"Ziel erreicht!",manual:"Aktuellen Zähler setzen",phrase:"Dhikr",teacher:"Hinweis: Die Audio-Aussprache ist eine Lernhilfe. Für korrektes Tajwid zusätzlich mit einer Lehrperson lernen."},
en:{duaTitle:"Learn duas",duaDesc:"Core supplications and dhikr used in prayer",learnTitle:"Learn Quran",learnDesc:"Arabic letters with spoken pronunciation",tasbihTitle:"Tasbih",tasbihDesc:"Counter stays saved after closing the app",openDua:"Open duas →",openLearn:"Learn letters →",openTasbih:"Open tasbih →",close:"Close",back:"← Prayer",listen:"Listen",arabic:"Arabic",pron:"Pronunciation",meaning:"Meaning",target:"Target",count:"Count",set:"Save",reset:"Reset",minus:"−1",plus:"+1",reached:"Target reached!",manual:"Set current count",phrase:"Dhikr",teacher:"Note: audio pronunciation is a learning aid. For accurate tajwid also learn with a teacher."}
};
function lang(){const l=localStorage.getItem(LANG_KEY)||"sq";return TXT[l]?l:"en"}
function t(){return TXT[lang()]||TXT.en}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

const DUAS=[
{title:"Subhaneke (në fillim)",ar:"سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",tr:"Subhâneke Allâhumme ve bi hamdik, ve tebârekesmuk, ve teâlâ xhedduk, ve lâ ilâhe gajruke.",sq:"I Lartësuar je Ti, o Allah, dhe Ty të takon lavdërimi; i bekuar është Emri Yt, e lartë është Madhëria Jote dhe s’ka të adhuruar tjetër me të drejtë përveç Teje."},
{title:"Eudhu & Bismilah",ar:"أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ · بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",tr:"Eudhu billâhi mine-sh-shejtâni-rraxhîm. Bismil-lâhi-r-Rahmâni-r-Rahîm.",sq:"Kërkoj mbrojtje tek Allahu nga shejtani i mallkuar. Me emrin e Allahut, të Gjithëmëshirshmit, Mëshirëplotit."},
{title:"Në ruku",ar:"سُبْحَانَ رَبِّيَ الْعَظِيمِ",tr:"Subhâne Rabbijel-Adhîm.",sq:"I Lartësuar është Zoti im, Madhështori."},
{title:"Kur ngrihesh nga rukuja",ar:"سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ · رَبَّنَا لَكَ الْحَمْدُ",tr:"SemiAllâhu limen hamideh. Rabbenâ lekel-hamd.",sq:"Allahu e dëgjon atë që e lavdëron. Zoti ynë, Ty të takon lavdërimi."},
{title:"Në sexhde",ar:"سُبْحَانَ رَبِّيَ الأَعْلَى",tr:"Subhâne Rabbijel-A'lâ.",sq:"I Lartësuar është Zoti im, më i Larti."},
{title:"Mes dy sexhdeve",ar:"رَبِّ اغْفِرْ لِي",tr:"Rabbighfir lî.",sq:"Zoti im, më fal."},
{title:"Ettehijjatu",ar:"التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",tr:"Ettehijjâtu lillâhi ves-salavâtu vet-tajjibât. Es-selâmu alejke ejjuhen-nebijju ve rahmetullâhi ve berekâtuhu. Es-selâmu alejnâ ve alâ ibâdillâhis-sâlihîn. Eshhedu en lâ ilâhe il-lallâh ve eshhedu enne Muhammeden abduhu ve resûluhu.",sq:"Përshëndetjet, adhurimet dhe të mirat janë për Allahun... Dëshmoj se s’ka të adhuruar me të drejtë përveç Allahut dhe se Muhamedi është robi dhe i Dërguari i Tij."},
{title:"Salavatet Ibrahimije",ar:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",tr:"Allâhumme salli alâ Muhammedin ve alâ âli Muhammed... Allâhumme bârik alâ Muhammedin ve alâ âli Muhammed...",sq:"O Allah, bekoje Muhamedin dhe familjen e Muhamedit, ashtu siç e bekove Ibrahimin dhe familjen e Ibrahimit..."},
{title:"Rabbena atina",ar:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",tr:"Rabbenâ âtinâ fid-dunjâ haseneten ve fil-âhireti haseneten ve kinâ adhâben-nâr.",sq:"Zoti ynë, na jep të mira në këtë botë dhe të mira në botën tjetër dhe na ruaj nga dënimi i zjarrit."},
{title:"Dua e Kunutit (vitr, hanefi)",ar:"اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ وَنُؤْمِنُ بِكَ وَنَتُوبُ إِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ نَشْكُرُكَ وَلَا نَكْفُرُكَ...",tr:"Allâhumme innâ nesteînuke ve nestagfiruke ve nestehdîke ve nu’minu bike ve netûbu ilejke ve netevekkelu alejke...",sq:"O Allah, prej Teje kërkojmë ndihmë, falje dhe udhëzim; Ty të besojmë, tek Ti pendohemi dhe tek Ti mbështetemi..."},
{title:"Selami në fund",ar:"السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",tr:"Es-selâmu alejkum ve rahmetullâh.",sq:"Paqja dhe mëshira e Allahut qoftë mbi ju."},
{title:"Pas namazit",ar:"أَسْتَغْفِرُ اللَّهَ ×٣ · اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",tr:"Estagfirullâh ×3. Allâhumme entes-selâm ve minkes-selâm, tebârekte jâ Dhel-xhelâli vel-ikrâm.",sq:"Kërkoj falje nga Allahu ×3. O Allah, Ti je Paqja dhe prej Teje vjen paqja; i Bekuar je, o Zot i Madhështisë dhe Nderit."}
];

const LETTERS=[
["ا","Alif","a / â"],["ب","Ba","b"],["ت","Ta","t"],["ث","Tha","th (si think)"],["ج","Xhim","xh"],["ح","Ha","h e thellë"],["خ","Kha","kh / h e fortë"],["د","Dal","d"],["ذ","Dhal","dh (si this)"],["ر","Ra","r"],["ز","Zaj","z"],["س","Sin","s"],["ش","Shin","sh"],["ص","Sad","s e trashë"],["ض","Dad","d e trashë"],["ط","Ta","t e trashë"],["ظ","Dha","dh e trashë"],["ع","Ajn","tingull i fytit"],["غ","Gajn","gh"],["ف","Fa","f"],["ق","Kaf","q e thellë"],["ك","Kef","k"],["ل","Lam","l"],["م","Mim","m"],["ن","Nun","n"],["ه","Ha","h"],["و","Waw","w / u / û"],["ي","Ja","j / i / î"]
];

function speakArabic(text){
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang="ar-SA";u.rate=.65;u.pitch=1;
    const vs=speechSynthesis.getVoices();
    const v=vs.find(x=>/^ar/i.test(x.lang));
    if(v)u.voice=v;
    speechSynthesis.speak(u);
  }catch(_){}
}
function updateCards(){
 const x=t();
 const map=[["prayerDuaCardTitle",x.duaTitle],["prayerDuaCardDesc",x.duaDesc],["prayerDuaCardOpen",x.openDua],["quranLearnCardTitle",x.learnTitle],["quranLearnCardDesc",x.learnDesc],["quranLearnCardOpen",x.openLearn],["tasbihCardTitle",x.tasbihTitle],["tasbihCardDesc",x.tasbihDesc],["tasbihCardOpen",x.openTasbih]];
 map.forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v});
}
function closeAll(){
 ["prayerDuaPanel","quranLearnPanel","tasbihPanel"].forEach(id=>document.getElementById(id)?.classList.add("hidden"));
}
function openDuas(){
 const x=t(),p=document.getElementById("prayerDuaPanel");if(!p)return;
 p.innerHTML=`<div class="prayer-extra-head"><button class="secondary" id="duaBack">${esc(x.back)}</button><button class="secondary" id="duaClose">${esc(x.close)}</button></div><h2>🤲 ${esc(x.duaTitle)}</h2><p class="muted">${esc(x.duaDesc)}</p><div class="dua-learn-list">${DUAS.map((d,i)=>`<article class="dua-learn-item"><h3>${i+1}. ${esc(d.title)}</h3><div class="dua-ar">${esc(d.ar)}</div><div><strong>${esc(x.pron)}:</strong> ${esc(d.tr)}</div><div class="muted small"><strong>${esc(x.meaning)}:</strong> ${esc(d.sq)}</div><button type="button" class="secondary dua-audio" data-ar="${esc(d.ar)}">🔊 ${esc(x.listen)}</button></article>`).join("")}</div>`;
 closeAll();p.classList.remove("hidden");p.querySelectorAll(".dua-audio").forEach(b=>b.addEventListener("click",()=>speakArabic(b.dataset.ar||"")));document.getElementById("duaBack")?.addEventListener("click",closeAll);document.getElementById("duaClose")?.addEventListener("click",closeAll);p.scrollIntoView({behavior:"smooth",block:"start"});
}
function openLearn(){
 const x=t(),p=document.getElementById("quranLearnPanel");if(!p)return;
 p.innerHTML=`<div class="prayer-extra-head"><button class="secondary" id="learnBack">${esc(x.back)}</button><button class="secondary" id="learnClose">${esc(x.close)}</button></div><h2>🔤 ${esc(x.learnTitle)}</h2><p class="muted">${esc(x.learnDesc)}</p><div class="arabic-letter-grid">${LETTERS.map((a,i)=>`<button type="button" class="arabic-letter-card" data-say="${esc(a[0])}"><span class="arabic-letter">${esc(a[0])}</span><strong>${i+1}. ${esc(a[1])}</strong><small>${esc(a[2])}</small><span>🔊</span></button>`).join("")}</div><p class="muted small">ℹ️ ${esc(x.teacher)}</p>`;
 closeAll();p.classList.remove("hidden");p.querySelectorAll(".arabic-letter-card").forEach(b=>b.addEventListener("click",()=>speakArabic(b.dataset.say||"")));document.getElementById("learnBack")?.addEventListener("click",closeAll);document.getElementById("learnClose")?.addEventListener("click",closeAll);p.scrollIntoView({behavior:"smooth",block:"start"});
}
const TKEY="diamond-tasbih-v1";
function readTasbih(){try{return {...{count:0,target:33,phrase:"Subhanallah"},...JSON.parse(localStorage.getItem(TKEY)||"{}")}}catch{return{count:0,target:33,phrase:"Subhanallah"}}}
function saveTasbih(s){localStorage.setItem(TKEY,JSON.stringify(s))}
function renderTasbih(){
 const x=t(),p=document.getElementById("tasbihPanel");if(!p)return;const s=readTasbih();
 p.innerHTML=`<div class="prayer-extra-head"><button class="secondary" id="tasbihBack">${esc(x.back)}</button><button class="secondary" id="tasbihClose">${esc(x.close)}</button></div><h2>📿 ${esc(x.tasbihTitle)}</h2><p class="muted">${esc(x.tasbihDesc)}</p><div class="tasbih-shell"><label>${esc(x.phrase)}<select id="tasbihPhrase"><option>Subhanallah</option><option>Alhamdulillah</option><option>Allahu Ekber</option><option>La ilahe illallah</option><option>Estagfirullah</option></select></label><div class="tasbih-count" id="tasbihCount">${s.count}</div><div class="tasbih-target">${esc(x.target)}: <strong id="tasbihTargetText">${s.target}</strong></div><div id="tasbihReached" class="tasbih-reached ${s.target>0&&s.count>=s.target?"":"hidden"}">✅ ${esc(x.reached)}</div><button id="tasbihPlus" class="tasbih-plus" type="button">+1</button><div class="tasbih-small-actions"><button id="tasbihMinus" class="secondary" type="button">${esc(x.minus)}</button><button id="tasbihReset" class="secondary danger-soft" type="button">${esc(x.reset)}</button></div><div class="tasbih-program"><label>${esc(x.target)}<input id="tasbihTarget" type="number" min="0" max="999999" value="${s.target}"></label><label>${esc(x.manual)}<input id="tasbihManual" type="number" min="0" max="999999" value="${s.count}"></label><button id="tasbihSave" class="primary" type="button">${esc(x.set)}</button></div></div>`;
 document.getElementById("tasbihPhrase").value=s.phrase||"Subhanallah";
 document.getElementById("tasbihBack")?.addEventListener("click",closeAll);document.getElementById("tasbihClose")?.addEventListener("click",closeAll);
 const update=(next)=>{saveTasbih(next);renderTasbih();};
 document.getElementById("tasbihPlus")?.addEventListener("click",()=>{const n=readTasbih();n.count++;saveTasbih(n);try{navigator.vibrate?.(20)}catch(_){};if(n.target>0&&n.count===n.target){try{navigator.vibrate?.([80,60,120])}catch(_){}}renderTasbih()});
 document.getElementById("tasbihMinus")?.addEventListener("click",()=>{const n=readTasbih();n.count=Math.max(0,n.count-1);update(n)});
 document.getElementById("tasbihReset")?.addEventListener("click",()=>{const n=readTasbih();n.count=0;update(n)});
 document.getElementById("tasbihPhrase")?.addEventListener("change",e=>{const n=readTasbih();n.phrase=e.target.value;saveTasbih(n)});
 document.getElementById("tasbihSave")?.addEventListener("click",()=>{const n=readTasbih();n.target=Math.max(0,Number(document.getElementById("tasbihTarget").value)||0);n.count=Math.max(0,Number(document.getElementById("tasbihManual").value)||0);n.phrase=document.getElementById("tasbihPhrase").value;update(n)});
}
function openTasbih(){closeAll();const p=document.getElementById("tasbihPanel");p?.classList.remove("hidden");renderTasbih();p?.scrollIntoView({behavior:"smooth",block:"start"})}
function back(){const ids=["prayerDuaPanel","quranLearnPanel","tasbihPanel"];for(const id of ids){const p=document.getElementById(id);if(p&&!p.classList.contains("hidden")){p.classList.add("hidden");return true}}return false}
document.getElementById("prayerDuaCard")?.addEventListener("click",openDuas);
document.getElementById("quranLearnCard")?.addEventListener("click",openLearn);
document.getElementById("tasbihCard")?.addEventListener("click",openTasbih);
window.addEventListener("storage",e=>{if(e.key===LANG_KEY)updateCards()});
updateCards();
window.DiamondPrayerExtras={back,close:closeAll,reloadLanguage:updateCards};
