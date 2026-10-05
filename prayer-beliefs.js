const BELIEF_LANG_KEY="pajaziti-language";

const LABELS={
  sq:{angels:"Melaqet",devil:"Shejtani & Vesveset",prophets:"Pejgamberët",qadr:"Kaderi",death:"Vdekja & Ringjallja",back:"← Kthehu",close:"Mbyll",sources:"Burimet",note:"Shënim"},
  de:{angels:"Die Engel",devil:"Satan & Einflüsterungen",prophets:"Die Propheten",qadr:"Qadar",death:"Tod & Auferstehung",back:"← Zurück",close:"Schließen",sources:"Quellen",note:"Hinweis"},
  tr:{angels:"Melekler",devil:"Şeytan & Vesvese",prophets:"Peygamberler",qadr:"Kader",death:"Ölüm & Diriliş",back:"← Geri",close:"Kapat",sources:"Kaynaklar",note:"Not"},
  en:{angels:"Angels",devil:"Satan & Whispers",prophets:"Prophets",qadr:"Divine Decree",death:"Death & Resurrection",back:"← Back",close:"Close",sources:"Sources",note:"Note"}
};

const SQ={
  angels:{
    icon:"👼",title:"Melaqet",intro:"Në Islam besohet në melaqet si krijesa të Allahut që i binden Atij. Jo të gjitha melaqet na janë treguar me emër; këtu paraqiten vetëm emrat dhe detyrat që kanë bazë në Kuran ose hadithe të njohura.",
    notice:"“Forca” e melaqeve nuk matet me nivele si në lojë. Për secilin tregohet vetëm ajo aftësi ose detyrë që burimet ia atribuojnë, dhe të gjitha veprojnë vetëm me urdhrin e Allahut.",
    items:[
      {t:"Xhibrili (Jibril)",i:"🕊️",d:"Meleku i shpalljes. Ia solli shpalljen pejgamberëve dhe Kuranin Muhamedit ﷺ.",p:"Në Kuran përshkruhet si i fuqishëm dhe me pozitë të lartë. Kjo nuk nënkupton fuqi të pavarur nga Allahu.",s:"Kuran 2:97; 66:4; 81:19–21"},
      {t:"Mikaili (Mika'il)",i:"🌧️",d:"Përmendet me emër në Kuran dhe është nga melaqet e mëdha. Në traditën islame lidhet me çështje të furnizimit dhe shiut me urdhrin e Allahut.",p:"Nuk kemi matje numerike të fuqisë së tij.",s:"Kuran 2:98; Sahih Muslim 770"},
      {t:"Israfili",i:"📯",d:"Në hadith përmendet si një nga melaqet e mëdha. Tradita e lidh me fryrjen e Surit në Ditën e Kiametit.",p:"Fryrja e Surit ndodh vetëm kur Allahu urdhëron.",s:"Sahih Muslim 770; për Surin: Kuran 39:68"},
      {t:"Maliku",i:"🔥",d:"Mbikëqyrësi i Xhehenemit, i përmendur me emër.",p:"Detyra e tij është ajo që Allahu ia ka caktuar.",s:"Kuran 43:77"},
      {t:"Meleku i vdekjes",i:"⚰️",d:"Merr shpirtrat kur vjen afati i caktuar. Kurani e quan ‘Meleku i vdekjes’.",p:"Emri ‘Azrail’ është i përhapur në traditë, por nuk është emër i vërtetuar në Kuran.",s:"Kuran 32:11; 6:61"},
      {t:"Munkar dhe Nakir",i:"❓",d:"Në hadithe përmenden si melaqet që e pyesin njeriun në varr.",p:"Përshkrimet duhen marrë vetëm aq sa vijnë nga burimet, pa shtuar tregime popullore.",s:"Jami‘ at-Tirmidhi 1071"},
      {t:"Haruti dhe Maruti",i:"📜",d:"Dy melaqe të përmendura në Kuran në rrëfimin e Babilonisë; paralajmëronin njerëzit që prova të mos shndërrohej në mohim.",p:"Teksti kuranor duhet lexuar me kujdes, pa legjenda shtesë.",s:"Kuran 2:102"},
      {t:"Melaqet shkrues",i:"✍️",d:"Regjistrojnë veprat dhe fjalët e njeriut.",p:"Kurani i përshkruan si të nderuar dhe shkrues.",s:"Kuran 50:17–18; 82:10–12"},
      {t:"Melaqet ruajtës",i:"🛡️",d:"Me urdhrin e Allahut e ruajnë njeriun sipas caktimit të Tij.",p:"Mbrojtja nuk është e pavarur; është vetëm me urdhrin e Allahut.",s:"Kuran 13:11"},
      {t:"Bartësit e Arshit",i:"✨",d:"Melaqe që mbajnë Arshin dhe luten për besimtarët.",p:"Janë përmendur në Kuran, por emrat e tyre individualë nuk na janë dhënë.",s:"Kuran 40:7; 69:17"}
    ]
  },
  devil:{
    icon:"😈",title:"Shejtani & Vesveset",intro:"Kjo pjesë shpjegon çfarë thonë Kurani dhe hadithet për Iblisin, shejtanët, vesveset dhe mënyrat e mbrojtjes.",
    notice:"Shejtani nuk ka fuqi të pakufizuar mbi njeriun. Ai tundon, zbukuron të keqen dhe pëshpërit; njeriu mbetet përgjegjës për zgjedhjet e veta.",
    items:[
      {t:"Iblisi",i:"🔥",d:"Iblisi është nga xhinët. Refuzoi urdhrin për t’iu përulur Ademit nga mendjemadhësia.",p:"Ai kërkon t’i devijojë njerëzit, por nuk mund t’i detyrojë me forcë të bëjnë mëkat.",s:"Kuran 7:11–18; 18:50; 38:71–85"},
      {t:"Shejtanët",i:"🌑",d:"Termi përdoret për qenie rebele që nxisin të keqen. Kurani përmend shejtanë nga xhinët dhe njerëzit.",p:"Qëllimi i tyre është mashtrimi dhe largimi nga bindja ndaj Allahut.",s:"Kuran 6:112; 114:1–6"},
      {t:"Vesveset",i:"🌀",d:"Pëshpëritje që nxisin frikë, dyshim ose mëkat. Njeriu nuk gjykohet për mendimin e paqëllimshëm që e refuzon.",p:"Mbrojtja fillon duke kërkuar strehim tek Allahu dhe duke mos e ushqyer mendimin e padëshiruar.",s:"Kuran 114:1–6; 7:200"},
      {t:"Gjatë namazit",i:"🕌",d:"Hadithet përmendin se shejtani përpiqet ta shpërqendrojë njeriun gjatë namazit.",p:"Kur ndodh shpërqendrim, kërko mbrojtje tek Allahu dhe rikthehu te namazi pa panik.",s:"Sahih Muslim 2203; Sahih al-Bukhari 608"},
      {t:"Kufiri i ndikimit të tij",i:"⛓️",d:"Në Ditën e Gjykimit shejtani pranon se ai vetëm i ftoi njerëzit dhe ata iu përgjigjën.",p:"Ai nuk është justifikim për mëkatin; njeriu ka përgjegjësi për zgjedhjen.",s:"Kuran 14:22"},
      {t:"Si të mbrohesh",i:"🛡️",d:"Thuaj ‘Eudhu billahi mine-sh-shejtani-rraxhim’, lexo Kuranin, ruaj namazin, bëj dhikër dhe dua.",p:"Ajetul Kursi dhe suret El-Felek e En-Nas janë ndër tekstet e njohura të mbrojtjes.",s:"Kuran 16:98; 7:200; Sahih al-Bukhari 2311"},
      {t:"Mos e tepro me frikën",i:"🤍",d:"Besimtari nuk duhet t’ia atribuojë çdo problem shejtanit. Sëmundja, ankthi, gabimet dhe problemet praktike kërkojnë edhe shkaqet reale dhe zgjidhjet e tyre.",p:"Besimi, duaja dhe veprimi i arsyeshëm shkojnë bashkë.",s:"Parim i përgjithshëm islam: përgjegjësi, dua dhe marrje e shkaqeve"}
    ]
  },
  prophets:{
    icon:"📜",title:"Pejgamberët",intro:"Kurani përmend me emër 25 pejgamberë. Këtu ke një përmbledhje të shkurtër për secilin; pa portrete ose figura të tyre.",
    notice:"Të gjithë pejgamberët thirrën në adhurimin e Allahut. Mrekullitë ndodhën vetëm me lejen e Allahut.",
    items:[
      {t:"Ademi a.s.",i:"🌍",d:"Njeriu i parë dhe pejgamber. Historia e tij mëson pendimin, përgjegjësinë dhe mëshirën e Allahut.",p:"Mësim: gabimi nuk është fundi kur njeriu pendohet sinqerisht.",s:"Kuran 2:30–39; 7:11–27"},
      {t:"Idrisi a.s.",i:"📖",d:"Pejgamber i përmendur si i sinqertë dhe i ngritur në pozitë të lartë.",p:"Mësim: sinqeriteti dhe qëndrueshmëria.",s:"Kuran 19:56–57; 21:85"},
      {t:"Nuhu a.s.",i:"🚢",d:"Thirri popullin e tij për një kohë të gjatë; anija dhe përmbytja janë pjesë e historisë së tij.",p:"Mësim: durim i gjatë në thirrjen për të vërtetën.",s:"Kuran 11:25–49; Sure Nuh 71"},
      {t:"Hudi a.s.",i:"🏜️",d:"U dërgua te populli Ad dhe i thirri të braktisnin mendjemadhësinë dhe idhujtarinë.",p:"Mësim: fuqia materiale nuk të mbron nga padrejtësia.",s:"Kuran 7:65–72; 11:50–60"},
      {t:"Salihu a.s.",i:"🐪",d:"U dërgua te Themudi; deveja ishte shenjë për ta.",p:"Mësim: mos i sfido shenjat e Allahut me kryeneçësi.",s:"Kuran 7:73–79; 11:61–68"},
      {t:"Ibrahimi a.s.",i:"🕋",d:"Model i teuhidit; sfidoi idhujtarinë dhe bashkë me Ismailin ngriti themelet e Qabes.",p:"Mësim: besim, bindje dhe sakrificë.",s:"Kuran 2:124–132; 21:51–70; 37:99–111"},
      {t:"Luti a.s.",i:"🏘️",d:"Thirri popullin e tij të largohej nga mëkatet dhe prishja morale.",p:"Mësim: qëndro me të vërtetën edhe kur shumica refuzon.",s:"Kuran 7:80–84; 11:77–83"},
      {t:"Ismaili a.s.",i:"🕋",d:"Biri i Ibrahimit, i njohur për besnikëri ndaj premtimit; ndihmoi në ngritjen e Qabes.",p:"Mësim: besnikëri, durim dhe bindje.",s:"Kuran 2:125–129; 19:54–55"},
      {t:"Is’haku a.s.",i:"🌿",d:"Biri i Ibrahimit dhe pejgamber nga i cili vazhdoi një degë e madhe e pejgamberëve.",p:"Mësim: premtimi i Allahut realizohet në kohën e Tij.",s:"Kuran 11:71–73; 37:112–113"},
      {t:"Jakubi a.s.",i:"🤲",d:"I quajtur edhe Israil; baba i Jusufit dhe vëllezërve të tij.",p:"Mësim: sabr i bukur dhe shpresë tek Allahu.",s:"Kuran 12:6–18; 12:83–87"},
      {t:"Jusufi a.s.",i:"🌙",d:"Nga pusi në pallat: u sprovua me zili, padrejtësi dhe burg, pastaj u ngrit në pozitë.",p:"Mësim: pastërti, durim dhe falje.",s:"Sure Jusuf 12"},
      {t:"Ejubi a.s.",i:"🤍",d:"U sprovua rëndë dhe u bë shembull i durimit.",p:"Mësim: mos humb shpresën në mëshirën e Allahut.",s:"Kuran 21:83–84; 38:41–44"},
      {t:"Shuajbi a.s.",i:"⚖️",d:"Thirri popullin e tij në drejtësi në tregti dhe largim nga mashtrimi.",p:"Mësim: feja përfshin edhe ndershmërinë ekonomike.",s:"Kuran 7:85–93; 11:84–95"},
      {t:"Musai a.s.",i:"🌊",d:"U dërgua te Faraoni; Allahu i dha shenja të mëdha, përfshirë shkopin dhe çarjen e detit.",p:"Mësim: guxim përballë tiranisë dhe mbështetje tek Allahu.",s:"Kuran 20; 26:10–68; 28"},
      {t:"Haruni a.s.",i:"🤝",d:"Vëllai i Musait dhe pejgamber; e ndihmoi në misionin ndaj Faraonit.",p:"Mësim: bashkëpunimi në të mirë.",s:"Kuran 20:29–36; 7:142–151"},
      {t:"Dhulkifli a.s.",i:"⭐",d:"Përmendet ndër të durueshmit dhe të mirët.",p:"Mësim: durim dhe drejtësi.",s:"Kuran 21:85–86; 38:48"},
      {t:"Davudi a.s.",i:"📖",d:"Pejgamber dhe mbret; iu dha Zeburi dhe u dallua me gjykim.",p:"Mësim: drejtësi, adhurim dhe pendim.",s:"Kuran 4:163; 38:17–26"},
      {t:"Sulejmani a.s.",i:"👑",d:"Pejgamber dhe mbret; Allahu i dha sundim të veçantë dhe aftësi të jashtëzakonshme.",p:"Mësim: pushteti është amanet dhe duhet shoqëruar me mirënjohje.",s:"Kuran 27:15–44; 38:30–40"},
      {t:"Iljasi a.s.",i:"🌿",d:"Thirri popullin e tij ta adhuronte Allahun dhe të linte adhurimin e Ba‘lit.",p:"Mësim: ruaj teuhidin edhe kur shoqëria devijon.",s:"Kuran 37:123–132"},
      {t:"Eljeseu a.s.",i:"📜",d:"Përmendet ndër të zgjedhurit dhe të mirët.",p:"Mësim: vazhdimësi në bindje.",s:"Kuran 6:86; 38:48"},
      {t:"Junusi a.s.",i:"🐋",d:"U largua nga populli i tij, pastaj në barkun e peshkut bëri dua dhe Allahu e shpëtoi.",p:"Mësim: pendimi dhe duaja në vështirësi.",s:"Kuran 21:87–88; 37:139–148"},
      {t:"Zekerijai a.s.",i:"🤲",d:"U lut për pasardhës në moshë të thyer dhe Allahu i dhuroi Jahjan.",p:"Mësim: mos e humb shpresën në dua.",s:"Kuran 3:37–41; 19:2–11"},
      {t:"Jahjai a.s.",i:"🌱",d:"Pejgamber i pastër dhe i devotshëm, i urtë që në rini.",p:"Mësim: pastërti, butësi dhe devotshmëri.",s:"Kuran 3:39; 19:12–15"},
      {t:"Isai a.s.",i:"✨",d:"Lindi në mënyrë të mrekullueshme nga Merjemja. Allahu i dha mrekulli me lejen e Tij.",p:"Mësim: Isai është rob dhe i dërguar i Allahut; mrekullitë e tij janë me lejen e Allahut.",s:"Kuran 3:45–55; 5:110; 19:16–36"},
      {t:"Muhamedi ﷺ",i:"🌙",d:"I dërguari i fundit, të cilit iu shpall Kurani. Jeta e tij përfshin Mekën, Hixhretin, Medinën dhe përhapjen e mesazhit.",p:"Mësim: mëshirë, drejtësi, adhurim dhe pasim i shpalljes.",s:"Kuran 33:40; 21:107; 48:29"}
    ]
  },
  qadr:{
    icon:"📖",title:"Kaderi – Caktimi i Allahut",intro:"Besimi në kader do të thotë se Allahu di, ka shkruar, dëshiron dhe krijon gjithçka, ndërsa njeriu ka zgjedhje reale dhe mban përgjegjësi për veprat e veta.",
    notice:"Kaderi nuk është arsye për pasivitet. Besimtari merr shkaqet, punon, lutet dhe pastaj mbështetet tek Allahu.",
    items:[
      {t:"1. Dituria e Allahut",i:"🧠",d:"Allahu di çdo gjë: të kaluarën, të tashmen dhe të ardhmen.",p:"Dituria e Allahut nuk e detyron njeriun të zgjedhë mëkatin.",s:"Kuran 22:70; 6:59"},
      {t:"2. Shkrimi",i:"✍️",d:"Kurani përmend se ngjarjet janë të shkruara para se të ndodhin.",p:"Kjo nuk e anulon përgjegjësinë dhe përpjekjen njerëzore.",s:"Kuran 57:22; 22:70"},
      {t:"3. Vullneti i Allahut",i:"✨",d:"Asgjë nuk del jashtë vullnetit të Allahut.",p:"Njeriu gjithsesi zgjedh dhe për këtë arsye urdhërohet, ndalohet dhe gjykohet.",s:"Kuran 76:29–30; 81:28–29"},
      {t:"4. Krijimi",i:"🌍",d:"Allahu është Krijuesi i gjithçkaje.",p:"Veprat e njeriut ndodhin brenda krijimit dhe caktimit të Allahut.",s:"Kuran 39:62; 37:96"},
      {t:"Zgjedhja dhe përgjegjësia",i:"⚖️",d:"Njeriu nuk është robot. Ai zgjedh, synon dhe vepron, ndaj mban përgjegjësi.",p:"Kaderi nuk përdoret si justifikim për padrejtësi ose mëkat.",s:"Kuran 18:29; 53:39"},
      {t:"Duaja dhe kaderi",i:"🤲",d:"Duaja vetë është pjesë e kaderit dhe është shkak që Allahu ka urdhëruar ta përdorim.",p:"Nuk thuhet se Allahut i ndryshon dija; për ne, duaja është një nga shkaqet që Allahu ka caktuar.",s:"Kuran 40:60; hadithe të shumta për nxitjen e duasë"},
      {t:"Tawakkul dhe marrja e shkaqeve",i:"🛠️",d:"Besimtari merr masat e arsyeshme dhe mbështetet tek Allahu për rezultatin.",p:"Shembull: shkon te mjeku, merr trajtimin dhe bën dua; rezultati është në dorën e Allahut.",s:"Kuran 3:159; 65:3"},
      {t:"Kur vjen sprova",i:"🤍",d:"Besimi në kader ndihmon që njeriu të mos shkatërrohet nga ‘sikur të kisha…’.",p:"Lejohet dhimbja dhe pikëllimi; ndalohet dëshpërimi nga mëshira e Allahut.",s:"Kuran 57:23; Sahih Muslim 2664"}
    ]
  },
  death:{
    icon:"⚰️",title:"Vdekja & Ringjallja",intro:"Një rrugëtim i shkurtër sipas Kuranit dhe haditheve: Jeta → Vdekja → Berzahu → Ringjallja → Gjykimi → Përfundimi.",
    notice:"Detajet e botës së padukshme merren vetëm nga shpallja; nuk shtojmë tregime që nuk kanë burim.",
    items:[
      {t:"Vdekja",i:"⚰️",d:"Çdo shpirt do ta shijojë vdekjen. Afati i secilit është në dijen e Allahut.",p:"Vdekja nuk është zhdukje, por kalim në një fazë tjetër.",s:"Kuran 3:185; 16:61"},
      {t:"Marrja e shpirtit",i:"🕊️",d:"Kur vjen afati, shpirti merret me urdhrin e Allahut.",p:"Kurani përmend Melekun e vdekjes dhe melaqet që marrin shpirtrat.",s:"Kuran 32:11; 6:61"},
      {t:"Berzahu",i:"🌒",d:"Periudha mes vdekjes dhe ringjalljes quhet berzah.",p:"Është botë e padukshme; detajet nuk mund t’i dimë përtej shpalljes.",s:"Kuran 23:99–100"},
      {t:"Pyetjet e varrit",i:"❓",d:"Hadithet flasin për pyetjet në varr rreth Zotit, fesë dhe të dërguarit.",p:"Besimtari përgatitet me iman dhe vepra, jo duke mësuar thjesht përgjigje përmendësh.",s:"Hadithe të varrit: Sahih al-Bukhari 1338; Jami‘ at-Tirmidhi 1071"},
      {t:"Fryrja e Surit",i:"📯",d:"Kur Allahu urdhëron, do të fryhet Suri dhe do të fillojnë ngjarjet e mëdha të Kiametit.",p:"Koha e saktë e Kiametit dihet vetëm nga Allahu.",s:"Kuran 39:68; 31:34"},
      {t:"Ringjallja",i:"🌍",d:"Njerëzit do të dalin nga varret dhe do të ringjallen.",p:"Për Allahun ringjallja është e lehtë ashtu si krijimi i parë.",s:"Kuran 36:51–52; 22:7"},
      {t:"Mahsheri – tubimi",i:"👥",d:"Të gjithë do të tubohen për gjykim.",p:"Askush nuk do të humbasë nga dijenia dhe drejtësia e Allahut.",s:"Kuran 18:47; 6:22"},
      {t:"Libri i veprave",i:"📖",d:"Secili do të përballet me regjistrin e veprave të veta.",p:"Kjo na kujton rëndësinë e fjalëve dhe veprave të përditshme.",s:"Kuran 17:13–14; 18:49"},
      {t:"Mizani",i:"⚖️",d:"Veprat do të peshohen me drejtësi të plotë.",p:"As edhe padrejtësia më e vogël nuk do të bëhet.",s:"Kuran 21:47; 7:8–9"},
      {t:"Sirati",i:"🌉",d:"Hadithet autentike përmendin urën mbi Xhehenem që njerëzit do ta kalojnë sipas gjendjes së tyre.",p:"Detajet merren nga hadithet, pa ilustrime ose pretendime për formën e tij reale.",s:"Sahih al-Bukhari 7439; Sahih Muslim 183"},
      {t:"Xheneti dhe Xhehenemi",i:"🌿",d:"Përfundimi i përhershëm është Xheneti ose Xhehenemi sipas drejtësisë dhe mëshirës së Allahut.",p:"Besimtari jeton mes shpresës në mëshirën e Allahut dhe frikës nga llogaria.",s:"Kuran 3:185; 98:6–8"},
      {t:"Çfarë i bën dobi të vdekurit",i:"🤲",d:"Hadithi i njohur përmend sadakanë e vazhdueshme, dijen e dobishme dhe fëmijën e mirë që lutet për të.",p:"Gjithashtu bëhet dua dhe kërkohet falje për të vdekurit.",s:"Sahih Muslim 1631; Kuran 59:10"}
    ]
  }
};

function lang(){const l=(localStorage.getItem(BELIEF_LANG_KEY)||"sq").toLowerCase();return LABELS[l]?l:"en";}
function labels(){return LABELS[lang()]||LABELS.en;}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

function ensureStyle(){
  if(document.getElementById("prayer-beliefs-style"))return;
  const s=document.createElement("style");s.id="prayer-beliefs-style";s.textContent=`
  #beliefPanel{max-width:900px;margin-inline:auto}
  .belief-head{display:flex;justify-content:space-between;gap:8px;position:sticky;top:6px;z-index:22;padding:6px 0;background:linear-gradient(180deg,var(--card,#fff) 72%,transparent)}
  .belief-hero{padding:18px;border-radius:22px;background:linear-gradient(145deg,rgba(91,52,183,.12),rgba(31,153,230,.1));border:1px solid rgba(93,75,176,.18);margin-bottom:12px}
  .belief-hero h2{margin:0 0 8px;font-size:clamp(24px,6vw,34px)}
  .belief-notice{padding:10px 12px;border-radius:14px;background:rgba(255,193,7,.12);border:1px solid rgba(204,151,0,.22);font-weight:700}
  .belief-list{display:grid;gap:10px}
  .belief-item{padding:14px;border-radius:18px;background:rgba(255,255,255,.92);border:1px solid rgba(72,65,130,.14);box-shadow:0 7px 18px rgba(20,25,60,.08);color:#111827}
  .belief-item h3{display:flex;align-items:center;gap:9px;margin:0 0 7px;font-size:18px}
  .belief-item p{margin:6px 0;line-height:1.5}
  .belief-power{padding:8px 10px;border-radius:11px;background:#f5f2ff}
  .belief-source{font-size:12px;color:#4b5563;border-top:1px dashed #cbd5e1;margin-top:9px;padding-top:7px}
  @media (prefers-color-scheme:dark){.belief-item{background:#111827;color:#f8fafc}.belief-power{background:#201936}.belief-source{color:#cbd5e1}}
  `;document.head.appendChild(s);
}

function ensurePanel(){
  let p=document.getElementById("beliefPanel");
  if(p)return p;
  const view=document.getElementById("prayerView");if(!view)return null;
  p=document.createElement("section");p.id="beliefPanel";p.className="card quran-panel hidden";
  const list=document.getElementById("prayerList");
  if(list)view.insertBefore(p,list);else view.appendChild(p);
  return p;
}

function topicData(topic){
  return SQ[topic]||SQ.angels;
}

function render(topic){
  ensureStyle();
  const p=ensurePanel();if(!p)return;
  const t=topicData(topic),l=labels();
  p.innerHTML=`
    <div class="belief-head">
      <button id="beliefBack" class="secondary" type="button">${esc(l.back)}</button>
      <button id="beliefClose" class="secondary" type="button">${esc(l.close)}</button>
    </div>
    <section class="belief-hero">
      <h2>${esc(t.icon)} ${esc(t.title)}</h2>
      <p>${esc(t.intro)}</p>
      <div class="belief-notice"><strong>${esc(l.note)}:</strong> ${esc(t.notice)}</div>
    </section>
    <div class="belief-list">
      ${t.items.map(x=>`<article class="belief-item">
        <h3><span>${esc(x.i)}</span><span>${esc(x.t)}</span></h3>
        <p>${esc(x.d)}</p>
        <p class="belief-power">${esc(x.p)}</p>
        <div class="belief-source"><strong>📖 ${esc(l.sources)}:</strong> ${esc(x.s)}</div>
      </article>`).join("")}
    </div>`;
  p.classList.remove("hidden");
  document.getElementById("beliefBack")?.addEventListener("click",close);
  document.getElementById("beliefClose")?.addEventListener("click",close);
  p.scrollIntoView({behavior:"smooth",block:"start"});
}

function open(topic){render(topic);}
function close(){document.getElementById("beliefPanel")?.classList.add("hidden");}
function back(){const p=document.getElementById("beliefPanel");if(p&&!p.classList.contains("hidden")){close();return true;}return false;}
function reloadLanguage(){}

window.DiamondBeliefs={open,close,back,reloadLanguage};
