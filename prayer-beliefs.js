const LANG_KEY="pajaziti-language";

const UI={
sq:{back:"← Kthehu",close:"Mbyll",sources:"Burimet",note:"Shënim"},
de:{back:"← Zurück",close:"Schließen",sources:"Quellen",note:"Hinweis"},
tr:{back:"← Geri",close:"Kapat",sources:"Kaynaklar",note:"Not"},
en:{back:"← Back",close:"Close",sources:"Sources",note:"Note"},
it:{back:"← Indietro",close:"Chiudi",sources:"Fonti",note:"Nota"},
hr:{back:"← Natrag",close:"Zatvori",sources:"Izvori",note:"Napomena"},
fr:{back:"← Retour",close:"Fermer",sources:"Sources",note:"Remarque"},
ar:{back:"← رجوع",close:"إغلاق",sources:"المصادر",note:"ملاحظة"}
};

const SPEC={
angels:{icon:"👼",ids:["jibril","mikail","israfil","malik","deathAngel","munkarNakir","harutMarut","scribes","guardians","throne"]},
devil:{icon:"😈",ids:["iblis","shayatin","whispers","prayer","limits","protection","balance"]},
prophets:{icon:"📜",ids:["adam","idris","nuh","hud","salih","ibrahim","lut","ismail","ishaq","yaqub","yusuf","ayyub","shuayb","musa","harun","dhulkifl","dawud","sulayman","ilyas","alyasa","yunus","zakariya","yahya","isa","muhammad"]},
qadr:{icon:"📖",ids:["knowledge","writing","will","creation","choice","dua","tawakkul","trials"]},
death:{icon:"⚰️",ids:["death","soul","barzakh","grave","trumpet","resurrection","gathering","book","scale","sirat","final","benefit"]}
};

const META={
jibril:["🕊️","Kuran 2:97; 66:4; 81:19–21"],mikail:["🌧️","Kuran 2:98; Sahih Muslim 770"],israfil:["📯","Sahih Muslim 770; Kuran 39:68"],malik:["🔥","Kuran 43:77"],deathAngel:["⚰️","Kuran 32:11; 6:61"],munkarNakir:["❓","Jami‘ at-Tirmidhi 1071"],harutMarut:["📜","Kuran 2:102"],scribes:["✍️","Kuran 50:17–18; 82:10–12"],guardians:["🛡️","Kuran 13:11"],throne:["✨","Kuran 40:7; 69:17"],
iblis:["🔥","Kuran 7:11–18; 18:50; 38:71–85"],shayatin:["🌑","Kuran 6:112; 114:1–6"],whispers:["🌀","Kuran 114:1–6; 7:200"],prayer:["🕌","Sahih Muslim 2203; Sahih al-Bukhari 608"],limits:["⛓️","Kuran 14:22"],protection:["🛡️","Kuran 16:98; 7:200; Sahih al-Bukhari 2311"],balance:["🤍","Parim i përgjithshëm islam: përgjegjësi, dua dhe marrje e shkaqeve"],
adam:["🌍","Kuran 2:30–39; 7:11–27"],idris:["📖","Kuran 19:56–57; 21:85"],nuh:["🚢","Kuran 11:25–49; Sure Nuh 71"],hud:["🏜️","Kuran 7:65–72; 11:50–60"],salih:["🐪","Kuran 7:73–79; 11:61–68"],ibrahim:["🕋","Kuran 2:124–132; 21:51–70; 37:99–111"],lut:["🏘️","Kuran 7:80–84; 11:77–83"],ismail:["🕋","Kuran 2:125–129; 19:54–55"],ishaq:["🌿","Kuran 11:71–73; 37:112–113"],yaqub:["🤲","Kuran 12:6–18; 12:83–87"],yusuf:["🌙","Sure Jusuf 12"],ayyub:["🤍","Kuran 21:83–84; 38:41–44"],shuayb:["⚖️","Kuran 7:85–93; 11:84–95"],musa:["🌊","Kuran 20; 26:10–68; 28"],harun:["🤝","Kuran 20:29–36; 7:142–151"],dhulkifl:["⭐","Kuran 21:85–86; 38:48"],dawud:["📖","Kuran 4:163; 38:17–26"],sulayman:["👑","Kuran 27:15–44; 38:30–40"],ilyas:["🌿","Kuran 37:123–132"],alyasa:["📜","Kuran 6:86; 38:48"],yunus:["🐋","Kuran 21:87–88; 37:139–148"],zakariya:["🤲","Kuran 3:37–41; 19:2–11"],yahya:["🌱","Kuran 3:39; 19:12–15"],isa:["✨","Kuran 3:45–55; 5:110; 19:16–36"],muhammad:["🌙","Kuran 33:40; 21:107; 48:29"],
knowledge:["🧠","Kuran 22:70; 6:59"],writing:["✍️","Kuran 57:22; 22:70"],will:["✨","Kuran 76:29–30; 81:28–29"],creation:["🌍","Kuran 39:62; 37:96"],choice:["⚖️","Kuran 18:29; 53:39"],dua:["🤲","Kuran 40:60"],tawakkul:["🛠️","Kuran 3:159; 65:3"],trials:["🤍","Kuran 57:23; Sahih Muslim 2664"],
death:["⚰️","Kuran 3:185; 16:61"],soul:["🕊️","Kuran 32:11; 6:61"],barzakh:["🌒","Kuran 23:99–100"],grave:["❓","Sahih al-Bukhari 1338; Jami‘ at-Tirmidhi 1071"],trumpet:["📯","Kuran 39:68; 31:34"],resurrection:["🌍","Kuran 36:51–52; 22:7"],gathering:["👥","Kuran 18:47; 6:22"],book:["📖","Kuran 17:13–14; 18:49"],scale:["⚖️","Kuran 21:47; 7:8–9"],sirat:["🌉","Sahih al-Bukhari 7439; Sahih Muslim 183"],final:["🌿","Kuran 3:185; 98:6–8"],benefit:["🤲","Sahih Muslim 1631; Kuran 59:10"]
};

const DATA={
sq:{
angels:{title:"Melaqet",intro:"Në Islam besohet në melaqet si krijesa të Allahut që i binden Atij. Këtu paraqiten vetëm emrat dhe detyrat që kanë bazë në Kuran ose hadithe të njohura.",note:"“Forca” e melaqeve nuk matet me nivele si në lojë. Tregohet vetëm ajo aftësi ose detyrë që burimet ia atribuojnë, dhe të gjitha veprojnë vetëm me urdhrin e Allahut.",e:{
jibril:["Xhibrili (Jibril)","Meleku i shpalljes. Ia solli shpalljen pejgamberëve dhe Kuranin Muhamedit ﷺ. Në Kuran përshkruhet si i fuqishëm dhe me pozitë të lartë."],
mikail:["Mikaili (Mika'il)","Përmendet me emër në Kuran dhe është nga melaqet e mëdha. Në traditën islame lidhet me çështje të furnizimit dhe shiut me urdhrin e Allahut."],
israfil:["Israfili","Në hadith përmendet si një nga melaqet e mëdha. Tradita e lidh me fryrjen e Surit në Ditën e Kiametit, vetëm me urdhrin e Allahut."],
malik:["Maliku","Mbikëqyrësi i Xhehenemit, i përmendur me emër në Kuran."],
deathAngel:["Meleku i vdekjes","Merr shpirtrat kur vjen afati i caktuar. Kurani e quan “Meleku i vdekjes”; emri Azrail është i përhapur në traditë, por nuk është emër kuranor."],
munkarNakir:["Munkar dhe Nakir","Në hadithe përmenden si melaqet që e pyesin njeriun në varr. Nuk shtohen tregime popullore pa burim."],
harutMarut:["Haruti dhe Maruti","Dy melaqe të përmendura në Kuran në rrëfimin e Babilonisë; paralajmëronin njerëzit që prova të mos shndërrohej në mohim."],
scribes:["Melaqet shkrues","Regjistrojnë veprat dhe fjalët e njeriut; Kurani i përshkruan si të nderuar dhe shkrues."],
guardians:["Melaqet ruajtës","Me urdhrin e Allahut e ruajnë njeriun sipas caktimit të Tij. Mbrojtja nuk është e pavarur."],
throne:["Bartësit e Arshit","Melaqe që mbajnë Arshin dhe luten për besimtarët. Emrat e tyre individualë nuk na janë dhënë."]}},
devil:{title:"Shejtani & Vesveset",intro:"Kjo pjesë shpjegon çfarë thonë Kurani dhe hadithet për Iblisin, shejtanët, vesveset dhe mënyrat e mbrojtjes.",note:"Shejtani nuk ka fuqi të pakufizuar mbi njeriun. Ai tundon dhe pëshpërit; njeriu mbetet përgjegjës për zgjedhjet e veta.",e:{
iblis:["Iblisi","Iblisi është nga xhinët. Refuzoi urdhrin për t’iu përulur Ademit nga mendjemadhësia dhe kërkon t’i devijojë njerëzit."],
shayatin:["Shejtanët","Termi përdoret për qenie rebele që nxisin të keqen. Kurani përmend shejtanë nga xhinët dhe njerëzit."],
whispers:["Vesveset","Pëshpëritje që nxisin frikë, dyshim ose mëkat. Mbrojtja fillon duke kërkuar strehim tek Allahu dhe duke mos e ushqyer mendimin e padëshiruar."],
prayer:["Gjatë namazit","Hadithet përmendin se shejtani përpiqet ta shpërqendrojë njeriun gjatë namazit. Kërko mbrojtje tek Allahu dhe rikthehu te namazi pa panik."],
limits:["Kufiri i ndikimit","Në Ditën e Gjykimit shejtani pranon se ai vetëm i ftoi njerëzit dhe ata iu përgjigjën. Nuk është justifikim për mëkatin."],
protection:["Si të mbrohesh","Thuaj “Eudhu billahi mine-sh-shejtani-rraxhim”, lexo Kuranin, ruaj namazin, bëj dhikër dhe dua. Ajetul Kursi, El-Felek dhe En-Nas janë ndër tekstet e njohura të mbrojtjes."],
balance:["Mos e tepro me frikën","Jo çdo problem i atribuohet shejtanit. Sëmundja, ankthi dhe problemet praktike kërkojnë edhe shkaqet reale dhe zgjidhjet e tyre."]}},
prophets:{title:"Pejgamberët",intro:"Kurani përmend me emër 25 pejgamberë. Këtu ke një përmbledhje të shkurtër për secilin, pa portrete ose figura të tyre.",note:"Të gjithë pejgamberët thirrën në adhurimin e Allahut. Mrekullitë ndodhën vetëm me lejen e Allahut.",e:{
adam:["Ademi a.s.","Njeriu i parë dhe pejgamber. Historia e tij mëson pendimin, përgjegjësinë dhe mëshirën e Allahut."],
idris:["Idrisi a.s.","Pejgamber i përmendur si i sinqertë dhe i ngritur në pozitë të lartë."],
nuh:["Nuhu a.s.","Thirri popullin për një kohë të gjatë; anija dhe përmbytja janë pjesë e historisë së tij. Mësimi kryesor është durimi."],
hud:["Hudi a.s.","U dërgua te populli Ad dhe i thirri të braktisnin mendjemadhësinë dhe idhujtarinë."],
salih:["Salihu a.s.","U dërgua te Themudi; deveja ishte shenjë për ta. Historia paralajmëron kundër kryeneçësisë."],
ibrahim:["Ibrahimi a.s.","Model i teuhidit; sfidoi idhujtarinë dhe bashkë me Ismailin ngriti themelet e Qabes."],
lut:["Luti a.s.","Thirri popullin e tij të largohej nga mëkatet dhe prishja morale dhe qëndroi me të vërtetën."],
ismail:["Ismaili a.s.","Biri i Ibrahimit, i njohur për besnikëri ndaj premtimit; ndihmoi në ngritjen e Qabes."],
ishaq:["Is’haku a.s.","Biri i Ibrahimit dhe pejgamber nga i cili vazhdoi një degë e madhe e pejgamberëve."],
yaqub:["Jakubi a.s.","I quajtur edhe Israil; baba i Jusufit. Historia e tij është shembull i sabrit të bukur dhe shpresës."],
yusuf:["Jusufi a.s.","Nga pusi në pallat: u sprovua me zili, padrejtësi dhe burg, pastaj u ngrit në pozitë. Mësim për pastërti, durim dhe falje."],
ayyub:["Ejubi a.s.","U sprovua rëndë dhe u bë shembull i durimit dhe i mos-humbjes së shpresës në mëshirën e Allahut."],
shuayb:["Shuajbi a.s.","Thirri popullin e tij në drejtësi në tregti dhe largim nga mashtrimi."],
musa:["Musai a.s.","U dërgua te Faraoni; Allahu i dha shenja të mëdha, përfshirë shkopin dhe çarjen e detit."],
harun:["Haruni a.s.","Vëllai i Musait dhe pejgamber; e ndihmoi në misionin ndaj Faraonit."],
dhulkifl:["Dhulkifli a.s.","Përmendet ndër të durueshmit dhe të mirët."],
dawud:["Davudi a.s.","Pejgamber dhe mbret; iu dha Zeburi dhe u dallua me gjykim dhe adhurim."],
sulayman:["Sulejmani a.s.","Pejgamber dhe mbret; Allahu i dha sundim të veçantë. Historia e tij mëson se pushteti është amanet."],
ilyas:["Iljasi a.s.","Thirri popullin e tij ta adhuronte Allahun dhe të linte adhurimin e Ba‘lit."],
alyasa:["Eljeseu a.s.","Përmendet ndër të zgjedhurit dhe të mirët."],
yunus:["Junusi a.s.","Në barkun e peshkut bëri dua dhe Allahu e shpëtoi. Historia e tij është mësim për pendimin dhe duanë."],
zakariya:["Zekerijai a.s.","U lut për pasardhës në moshë të thyer dhe Allahu i dhuroi Jahjan."],
yahya:["Jahjai a.s.","Pejgamber i pastër dhe i devotshëm, i urtë që në rini."],
isa:["Isai a.s.","Lindi në mënyrë të mrekullueshme nga Merjemja. Allahu i dha mrekulli me lejen e Tij; ai është rob dhe i dërguar i Allahut."],
muhammad:["Muhamedi ﷺ","I dërguari i fundit, të cilit iu shpall Kurani. Jeta e tij përfshin Mekën, Hixhretin, Medinën dhe përhapjen e mesazhit."]}},
qadr:{title:"Kaderi – Caktimi i Allahut",intro:"Besimi në kader do të thotë se Allahu di, ka shkruar, dëshiron dhe krijon gjithçka, ndërsa njeriu ka zgjedhje reale dhe mban përgjegjësi për veprat e veta.",note:"Kaderi nuk është arsye për pasivitet. Besimtari merr shkaqet, punon, lutet dhe pastaj mbështetet tek Allahu.",e:{
knowledge:["1. Dituria e Allahut","Allahu di çdo gjë: të kaluarën, të tashmen dhe të ardhmen. Dituria e Allahut nuk e detyron njeriun të zgjedhë mëkatin."],
writing:["2. Shkrimi","Kurani përmend se ngjarjet janë të shkruara para se të ndodhin. Kjo nuk e anulon përgjegjësinë dhe përpjekjen njerëzore."],
will:["3. Vullneti i Allahut","Asgjë nuk del jashtë vullnetit të Allahut, ndërsa njeriu gjithsesi zgjedh dhe për këtë arsye gjykohet."],
creation:["4. Krijimi","Allahu është Krijuesi i gjithçkaje. Veprat e njeriut ndodhin brenda krijimit dhe caktimit të Allahut."],
choice:["Zgjedhja dhe përgjegjësia","Njeriu nuk është robot. Ai zgjedh, synon dhe vepron, ndaj mban përgjegjësi. Kaderi nuk justifikon mëkatin."],
dua:["Duaja dhe kaderi","Duaja vetë është pjesë e kaderit dhe është shkak që Allahu ka urdhëruar ta përdorim."],
tawakkul:["Tawakkul dhe marrja e shkaqeve","Besimtari merr masat e arsyeshme dhe mbështetet tek Allahu për rezultatin. P.sh. shkon te mjeku, merr trajtimin dhe bën dua."],
trials:["Kur vjen sprova","Besimi në kader ndihmon që njeriu të mos shkatërrohet nga “sikur të kisha…”. Dhimbja lejohet; dëshpërimi nga mëshira e Allahut jo."]}},
death:{title:"Vdekja & Ringjallja",intro:"Një rrugëtim i shkurtër sipas Kuranit dhe haditheve: Jeta → Vdekja → Berzahu → Ringjallja → Gjykimi → Përfundimi.",note:"Detajet e botës së padukshme merren vetëm nga shpallja; nuk shtojmë tregime pa burim.",e:{
death:["Vdekja","Çdo shpirt do ta shijojë vdekjen. Afati i secilit është në dijen e Allahut."],
soul:["Marrja e shpirtit","Kur vjen afati, shpirti merret me urdhrin e Allahut. Kurani përmend Melekun e vdekjes dhe melaqet që marrin shpirtrat."],
barzakh:["Berzahu","Periudha mes vdekjes dhe ringjalljes quhet berzah. Detajet e saj i dimë vetëm nga shpallja."],
grave:["Pyetjet e varrit","Hadithet flasin për pyetjet në varr rreth Zotit, fesë dhe të dërguarit."],
trumpet:["Fryrja e Surit","Kur Allahu urdhëron, do të fryhet Suri dhe do të fillojnë ngjarjet e mëdha të Kiametit. Koha e saktë dihet vetëm nga Allahu."],
resurrection:["Ringjallja","Njerëzit do të dalin nga varret dhe do të ringjallen. Për Allahun ringjallja është e lehtë ashtu si krijimi i parë."],
gathering:["Mahsheri – tubimi","Të gjithë do të tubohen për gjykim dhe askush nuk do të humbasë nga dijenia e Allahut."],
book:["Libri i veprave","Secili do të përballet me regjistrin e veprave të veta."],
scale:["Mizani","Veprat do të peshohen me drejtësi të plotë; nuk do të bëhet padrejtësia më e vogël."],
sirat:["Sirati","Hadithet autentike përmendin urën mbi Xhehenem që njerëzit do ta kalojnë sipas gjendjes së tyre."],
final:["Xheneti dhe Xhehenemi","Përfundimi është Xheneti ose Xhehenemi sipas drejtësisë dhe mëshirës së Allahut."],
benefit:["Çfarë i bën dobi të vdekurit","Hadithi i njohur përmend sadakanë e vazhdueshme, dijen e dobishme dhe fëmijën e mirë që lutet për të; bëhet edhe dua për të vdekurit."]}}
},

de:{
angels:{title:"Die Engel",intro:"Im Islam gehört der Glaube an die Engel zum Glauben. Hier stehen nur Namen und Aufgaben, die im Koran oder in bekannten Hadithen belegt sind.",note:"Die ‘Kraft’ der Engel wird nicht in Stufen gemessen. Genannt werden nur Aufgaben und Fähigkeiten aus den Quellen; alle handeln nur auf Allahs Befehl.",e:{
jibril:["Jibril (Gabriel)","Engel der Offenbarung. Er brachte den Propheten die Offenbarung und Muhammad ﷺ den Koran. Im Koran wird er als stark und hochgestellt beschrieben."],
mikail:["Mika'il","Im Koran namentlich erwähnt und einer der großen Engel. In der islamischen Überlieferung mit Versorgung und Regen auf Allahs Befehl verbunden."],
israfil:["Israfil","In Hadithen als einer der großen Engel erwähnt. Die Überlieferung verbindet ihn mit dem Blasen ins Horn am Tag des Gerichts, nur auf Allahs Befehl."],
malik:["Malik","Der Wächter der Hölle, im Koran namentlich erwähnt."],
deathAngel:["Engel des Todes","Nimmt die Seelen, wenn ihre festgesetzte Zeit kommt. Der Koran nennt ihn ‘Engel des Todes’; der Name Azrail ist verbreitet, aber nicht koranisch belegt."],
munkarNakir:["Munkar und Nakir","In Hadithen als Engel erwähnt, die den Menschen im Grab befragen. Volkserzählungen ohne Quelle werden nicht hinzugefügt."],
harutMarut:["Harut und Marut","Zwei im Koran erwähnte Engel in der Erzählung von Babylon; sie warnten die Menschen vor der Prüfung."],
scribes:["Die schreibenden Engel","Sie schreiben Taten und Worte des Menschen auf; der Koran beschreibt sie als geehrte Schreiber."],
guardians:["Die schützenden Engel","Sie schützen den Menschen nach Allahs Befehl und Bestimmung. Ihr Schutz ist nicht unabhängig."],
throne:["Träger des Thrones","Engel, die den Thron tragen und für die Gläubigen bitten. Ihre einzelnen Namen wurden uns nicht genannt."]}},
devil:{title:"Satan & Einflüsterungen",intro:"Dieser Abschnitt erklärt, was Koran und Hadithe über Iblis, Satane, Einflüsterungen und Schutz davor sagen.",note:"Satan hat keine unbegrenzte Macht über den Menschen. Er versucht und flüstert ein; der Mensch bleibt für seine Entscheidungen verantwortlich.",e:{
iblis:["Iblis","Iblis gehört zu den Dschinn. Aus Hochmut verweigerte er den Befehl, sich vor Adam niederzuwerfen, und versucht Menschen irrezuführen."],
shayatin:["Die Satane","Der Begriff bezeichnet rebellische Wesen, die zum Bösen anstiften. Der Koran erwähnt Satane unter Dschinn und Menschen."],
whispers:["Einflüsterungen","Gedanken, die Angst, Zweifel oder Sünde fördern. Schutz beginnt damit, Zuflucht bei Allah zu suchen und den unerwünschten Gedanken nicht zu nähren."],
prayer:["Während des Gebets","Hadithe berichten, dass Satan versucht, Menschen im Gebet abzulenken. Suche Schutz bei Allah und kehre ruhig zum Gebet zurück."],
limits:["Grenzen seines Einflusses","Am Tag des Gerichts sagt Satan, dass er nur gerufen habe und die Menschen ihm folgten. Er ist keine Entschuldigung für Sünde."],
protection:["Wie man sich schützt","Sage ‘A'udhu billahi min ash-shaytan ir-rajim’, lies Koran, halte das Gebet, mache Dhikr und Dua. Ayat al-Kursi, Al-Falaq und An-Nas sind bekannte Schutztexte."],
balance:["Nicht alles Satan zuschreiben","Nicht jedes Problem kommt von Satan. Krankheit, Angst und praktische Probleme brauchen auch reale Ursachenklärung und passende Hilfe."]}},
prophets:{title:"Die Propheten",intro:"Der Koran nennt 25 Propheten beim Namen. Hier findest du zu jedem eine kurze Zusammenfassung, ohne Bilder oder Darstellungen der Propheten.",note:"Alle Propheten riefen zur Anbetung Allahs auf. Wunder geschahen nur mit Allahs Erlaubnis.",e:{
adam:["Adam a.s.","Erster Mensch und Prophet. Seine Geschichte lehrt Reue, Verantwortung und Allahs Barmherzigkeit."],
idris:["Idris a.s.","Prophet, der als wahrhaftig und in eine hohe Stellung erhoben beschrieben wird."],
nuh:["Nuh a.s.","Rief sein Volk sehr lange; Arche und Flut gehören zu seiner Geschichte. Hauptlehre: Geduld."],
hud:["Hud a.s.","Zu ‘Ad gesandt; er rief sie auf, Hochmut und Götzendienst aufzugeben."],
salih:["Salih a.s.","Zu Thamud gesandt; die Kamelstute war ein Zeichen. Seine Geschichte warnt vor sturer Ablehnung."],
ibrahim:["Ibrahim a.s.","Vorbild des Tauhid; widersetzte sich dem Götzendienst und errichtete mit Ismail die Grundmauern der Kaaba."],
lut:["Lut a.s.","Rief sein Volk zur Abkehr von Sünde und moralischer Verderbnis und hielt an der Wahrheit fest."],
ismail:["Ismail a.s.","Sohn Ibrahims, bekannt für Treue zum Versprechen; half beim Bau der Kaaba."],
ishaq:["Ishaq a.s.","Sohn Ibrahims und Prophet; von ihm ging eine große Linie weiterer Propheten aus."],
yaqub:["Yaqub a.s.","Auch Israel genannt; Vater von Yusuf. Seine Geschichte zeigt schöne Geduld und Hoffnung."],
yusuf:["Yusuf a.s.","Vom Brunnen bis zum Palast: Neid, Unrecht und Gefängnis, dann Erhöhung. Lehre: Reinheit, Geduld und Vergebung."],
ayyub:["Ayyub a.s.","Wurde schwer geprüft und zum Beispiel für Geduld und Hoffnung auf Allahs Barmherzigkeit."],
shuayb:["Shuayb a.s.","Rief zu Gerechtigkeit im Handel und zum Verlassen von Betrug auf."],
musa:["Musa a.s.","Zu Pharao gesandt; Allah gab ihm große Zeichen, darunter den Stab und die Teilung des Meeres."],
harun:["Harun a.s.","Bruder Musas und Prophet; unterstützte ihn in der Mission zu Pharao."],
dhulkifl:["Dhul-Kifl a.s.","Wird unter den Geduldigen und Rechtschaffenen erwähnt."],
dawud:["Dawud a.s.","Prophet und König; erhielt den Zabur und war für gerechtes Urteil und Gottesdienst bekannt."],
sulayman:["Sulayman a.s.","Prophet und König; Allah gab ihm besondere Herrschaft. Seine Geschichte lehrt, dass Macht ein anvertrautes Gut ist."],
ilyas:["Ilyas a.s.","Rief sein Volk auf, Allah zu dienen und die Verehrung Baals zu verlassen."],
alyasa:["Al-Yasa a.s.","Wird unter den Auserwählten und Rechtschaffenen genannt."],
yunus:["Yunus a.s.","Im Bauch des Fisches machte er Dua und Allah rettete ihn. Lehre: Reue und Bittgebet."],
zakariya:["Zakariya a.s.","Bat im hohen Alter um Nachkommen und Allah schenkte ihm Yahya."],
yahya:["Yahya a.s.","Reiner und gottesfürchtiger Prophet, dem schon in jungen Jahren Weisheit gegeben wurde."],
isa:["Isa a.s.","Wurde auf wunderbare Weise von Maryam geboren. Allah gab ihm Wunder mit Seiner Erlaubnis; er ist Diener und Gesandter Allahs."],
muhammad:["Muhammad ﷺ","Der letzte Gesandte, dem der Koran offenbart wurde. Sein Leben umfasst Mekka, Hidschra, Medina und die Verkündung der Botschaft."]}},
qadr:{title:"Qadar – Allahs Bestimmung",intro:"Glaube an Qadar bedeutet: Allah weiß, hat geschrieben, will und erschafft alles; zugleich besitzt der Mensch echte Wahl und Verantwortung.",note:"Qadar ist kein Grund für Passivität. Der Gläubige handelt, nutzt Mittel, bittet Allah und vertraut Ihm beim Ergebnis.",e:{
knowledge:["1. Allahs Wissen","Allah weiß Vergangenheit, Gegenwart und Zukunft. Sein Wissen zwingt den Menschen nicht zur Sünde."],
writing:["2. Das Schreiben","Der Koran sagt, dass Ereignisse geschrieben sind, bevor sie eintreten. Das hebt Verantwortung und Anstrengung nicht auf."],
will:["3. Allahs Wille","Nichts liegt außerhalb Allahs Willen; dennoch wählt der Mensch und wird deshalb beurteilt."],
creation:["4. Schöpfung","Allah ist Schöpfer aller Dinge. Menschliche Handlungen geschehen innerhalb Seiner Schöpfung und Bestimmung."],
choice:["Wahl und Verantwortung","Der Mensch ist kein Roboter. Er wählt, beabsichtigt und handelt; Qadar entschuldigt keine Sünde."],
dua:["Dua und Qadar","Dua selbst gehört zum Qadar und ist ein Mittel, das Allah uns zu nutzen befohlen hat."],
tawakkul:["Tawakkul und Mittel ergreifen","Der Gläubige ergreift vernünftige Mittel und vertraut Allah beim Ergebnis, z.B. Arztbesuch, Behandlung und Dua."],
trials:["Wenn Prüfungen kommen","Glaube an Qadar schützt davor, sich mit ‘hätte ich doch…’ zu zerstören. Trauer ist erlaubt; Verzweiflung an Allahs Barmherzigkeit nicht."]}},
death:{title:"Tod & Auferstehung",intro:"Ein kurzer Weg nach Koran und Hadith: Leben → Tod → Barzakh → Auferstehung → Gericht → Ausgang.",note:"Details der unsichtbaren Welt werden nur aus Offenbarung genommen; Geschichten ohne Quelle werden nicht hinzugefügt.",e:{
death:["Der Tod","Jede Seele wird den Tod kosten. Die festgesetzte Zeit jedes Menschen liegt in Allahs Wissen."],
soul:["Die Seele wird genommen","Wenn die Zeit kommt, wird die Seele auf Allahs Befehl genommen. Der Koran erwähnt den Engel des Todes und Engel, die Seelen nehmen."],
barzakh:["Barzakh","Die Zeit zwischen Tod und Auferstehung heißt Barzakh. Details kennen wir nur aus der Offenbarung."],
grave:["Fragen im Grab","Hadithe berichten von Fragen im Grab über den Herrn, die Religion und den Gesandten."],
trumpet:["Das Horn","Auf Allahs Befehl wird ins Horn geblasen und die großen Ereignisse des Jüngsten Tages beginnen. Den genauen Zeitpunkt kennt nur Allah."],
resurrection:["Auferstehung","Menschen werden aus den Gräbern hervorkommen und auferstehen. Für Allah ist die Wiedererschaffung leicht."],
gathering:["Versammlung","Alle werden zum Gericht versammelt; niemand entgeht Allahs Wissen."],
book:["Buch der Taten","Jeder wird mit dem Verzeichnis seiner eigenen Taten konfrontiert."],
scale:["Waage","Taten werden mit vollkommener Gerechtigkeit gewogen; nicht die kleinste Ungerechtigkeit geschieht."],
sirat:["Sirat","Authentische Hadithe erwähnen die Brücke über der Hölle, die Menschen entsprechend ihrem Zustand überqueren."],
final:["Paradies und Hölle","Der endgültige Ausgang ist Paradies oder Hölle nach Allahs Gerechtigkeit und Barmherzigkeit."],
benefit:["Was dem Verstorbenen nützt","Der bekannte Hadith nennt fortlaufende Sadaqa, nützliches Wissen und ein rechtschaffenes Kind, das für ihn betet; auch Dua für Verstorbene wird gemacht."]}}
},

tr:{
angels:{title:"Melekler",intro:"İslam'da meleklere iman esastır. Burada yalnızca Kur'an veya güvenilir hadislerde dayanağı bulunan isim ve görevler yer alır.",note:"Meleklerin ‘gücü’ oyunlardaki gibi seviyelerle ölçülmez. Sadece kaynaklarda bildirilen görev ve özellikler anlatılır; hepsi Allah'ın emriyle hareket eder.",e:{
jibril:["Cebrâil (Jibril)","Vahiy meleğidir. Peygamberlere vahyi, Muhammed ﷺ'e Kur'an'ı getirdi. Kur'an'da güçlü ve yüksek makam sahibi olarak anlatılır."],
mikail:["Mikâil","Kur'an'da adı geçer ve büyük meleklerdendir. İslami rivayette Allah'ın emriyle rızık ve yağmurla ilişkilendirilir."],
israfil:["İsrâfil","Hadislerde büyük meleklerden biri olarak geçer. Rivayetlerde kıyamet günü Sûr'a üflemesiyle ilişkilendirilir; bu yalnız Allah'ın emriyle olur."],
malik:["Mâlik","Cehennemin görevlisi olarak Kur'an'da adıyla anılır."],
deathAngel:["Ölüm meleği","Ecel geldiğinde ruhları Allah'ın emriyle alır. Kur'an ‘ölüm meleği’ der; Azrail adı yaygındır fakat Kur'an'da isim olarak geçmez."],
munkarNakir:["Münker ve Nekir","Hadislerde kabirde insanı sorgulayan melekler olarak anılır. Kaynaksız halk anlatıları eklenmez."],
harutMarut:["Hârût ve Mârût","Kur'an'da Babil kıssasında geçen iki melek; insanları imtihan konusunda uyarırlar."],
scribes:["Yazıcı melekler","İnsanın söz ve amellerini kaydederler; Kur'an onları değerli yazıcılar olarak niteler."],
guardians:["Koruyucu melekler","Allah'ın emri ve takdiriyle insanı korurlar. Bu koruma bağımsız değildir."],
throne:["Arşı taşıyan melekler","Arşı taşır ve müminler için dua ederler. Bireysel isimleri bize bildirilmemiştir."]}},
devil:{title:"Şeytan & Vesvese",intro:"Bu bölüm Kur'an ve hadislerde İblis, şeytanlar, vesvese ve korunma yolları hakkında bildirilenleri açıklar.",note:"Şeytanın insan üzerinde sınırsız gücü yoktur. Vesvese verir ve çağırır; insan kendi seçimlerinden sorumludur.",e:{
iblis:["İblis","İblis cinlerdendir. Kibirlenerek Âdem'e secde emrine karşı geldi ve insanları saptırmaya çalışır."],
shayatin:["Şeytanlar","Kötülüğe çağıran azgın varlıklar için kullanılan bir terimdir. Kur'an cinlerden ve insanlardan şeytanlardan söz eder."],
whispers:["Vesvese","Korku, şüphe veya günaha iten fısıltılardır. Allah'a sığınmak ve istenmeyen düşünceyi beslememek korunmanın temelidir."],
prayer:["Namaz sırasında","Hadislerde şeytanın namazda insanı şaşırtmaya çalıştığı bildirilir. Allah'a sığın ve paniğe kapılmadan namaza dön."],
limits:["Etkisinin sınırı","Kıyamet günü şeytan yalnızca çağırdığını, insanların da ona uyduğunu söyler. Günah için mazeret değildir."],
protection:["Nasıl korunulur","‘Eûzü billahi mine'ş-şeytânirracîm’ de, Kur'an oku, namazı koru, zikir ve dua yap. Ayetel Kürsi, Felak ve Nas bilinen korunma metinlerindendir."],
balance:["Her şeyi şeytana bağlama","Her sorun şeytandan değildir. Hastalık, kaygı ve pratik sorunlar gerçek sebeplerin araştırılmasını ve uygun yardımı da gerektirir."]}},
prophets:{title:"Peygamberler",intro:"Kur'an'da adı geçen 25 peygamber vardır. Burada her biri için kısa bilgi bulunur; peygamberlerin resim veya tasvirleri kullanılmaz.",note:"Bütün peygamberler Allah'a kulluğa çağırdı. Mucizeler yalnız Allah'ın izniyle gerçekleşti.",e:{
adam:["Âdem a.s.","İlk insan ve peygamber. Kıssası tövbe, sorumluluk ve Allah'ın rahmetini öğretir."],
idris:["İdris a.s.","Doğru sözlü ve yüksek bir makama yükseltilmiş bir peygamber olarak anılır."],
nuh:["Nuh a.s.","Kavmini çok uzun süre çağırdı; gemi ve tufan kıssasının parçasıdır. Ana ders sabırdır."],
hud:["Hûd a.s.","Âd kavmine gönderildi; kibir ve putperestliği bırakmaya çağırdı."],
salih:["Sâlih a.s.","Semûd'a gönderildi; deve onlar için bir işaretti. Kıssa inatçı reddedişe karşı uyarır."],
ibrahim:["İbrahim a.s.","Tevhidin örneğidir; putperestliğe karşı çıktı ve İsmail ile Kâbe'nin temellerini yükseltti."],
lut:["Lût a.s.","Kavmini günah ve ahlaki bozulmadan dönmeye çağırdı, hak üzerinde durdu."],
ismail:["İsmail a.s.","İbrahim'in oğlu; sözünde durmasıyla tanınır ve Kâbe'nin inşasında yardım etti."],
ishaq:["İshak a.s.","İbrahim'in oğlu ve peygamber; ondan birçok peygamberin geldiği bir soy devam etti."],
yaqub:["Yakub a.s.","İsrail olarak da anılır; Yusuf'un babasıdır. Kıssası güzel sabır ve ümidi gösterir."],
yusuf:["Yusuf a.s.","Kuyudan saraya: kıskançlık, haksızlık ve hapisle sınandı, sonra yükseltildi. Ders: iffet, sabır ve affetmek."],
ayyub:["Eyyûb a.s.","Ağır şekilde sınandı ve sabır ile Allah'ın rahmetinden ümit kesmemenin örneği oldu."],
shuayb:["Şuayb a.s.","Ticarette adalete ve hileyi bırakmaya çağırdı."],
musa:["Mûsâ a.s.","Firavun'a gönderildi; Allah ona asa ve denizin yarılması dahil büyük işaretler verdi."],
harun:["Hârûn a.s.","Musa'nın kardeşi ve peygamber; Firavun'a tebliğ görevinde ona yardım etti."],
dhulkifl:["Zülkifl a.s.","Sabreden ve salih kişiler arasında anılır."],
dawud:["Dâvûd a.s.","Peygamber ve hükümdar; Zebur verildi, adalet ve ibadetle öne çıktı."],
sulayman:["Süleyman a.s.","Peygamber ve hükümdar; Allah ona özel bir hükümranlık verdi. Gücün emanet olduğunu öğretir."],
ilyas:["İlyas a.s.","Kavmini Allah'a kulluğa ve Ba'l putunu bırakmaya çağırdı."],
alyasa:["Elyesa a.s.","Seçilmiş ve salih kişiler arasında anılır."],
yunus:["Yunus a.s.","Balığın karnında dua etti ve Allah onu kurtardı. Tövbe ve dua için güçlü bir örnektir."],
zakariya:["Zekeriyya a.s.","İleri yaşta evlat için dua etti ve Allah ona Yahya'yı verdi."],
yahya:["Yahya a.s.","Temiz ve takvalı peygamber; genç yaşta hikmet verildi."],
isa:["İsa a.s.","Meryem'den mucizevi şekilde doğdu. Allah ona kendi izniyle mucizeler verdi; o Allah'ın kulu ve elçisidir."],
muhammad:["Muhammed ﷺ","Son peygamberdir ve Kur'an ona indirildi. Hayatı Mekke, Hicret, Medine ve mesajın tebliğini kapsar."]}},
qadr:{title:"Kader",intro:"Kadere iman; Allah'ın her şeyi bilmesi, yazması, dilemesi ve yaratması, insanın ise gerçek seçim ve sorumluluk sahibi olması demektir.",note:"Kader pasiflik bahanesi değildir. Mümin sebeplere sarılır, çalışır, dua eder ve sonucu Allah'a bırakır.",e:{
knowledge:["1. Allah'ın bilgisi","Allah geçmişi, şimdiyi ve geleceği bilir. Allah'ın bilgisi insanı günaha zorlamaz."],
writing:["2. Yazılması","Kur'an olayların gerçekleşmeden önce yazılmış olduğunu bildirir. Bu sorumluluğu ve çabayı ortadan kaldırmaz."],
will:["3. Allah'ın dilemesi","Hiçbir şey Allah'ın iradesi dışında değildir; yine de insan seçer ve seçimi sebebiyle hesaba çekilir."],
creation:["4. Yaratma","Allah her şeyin yaratıcısıdır. İnsan fiilleri de O'nun yaratması ve kaderi içinde gerçekleşir."],
choice:["Seçim ve sorumluluk","İnsan robot değildir. Seçer, niyet eder ve yapar; kader günah için mazeret değildir."],
dua:["Dua ve kader","Dua da kaderin bir parçasıdır ve Allah'ın kullanmamızı emrettiği bir sebeptir."],
tawakkul:["Tevekkül ve sebeplere sarılmak","Mümin makul tedbirleri alır ve sonucu Allah'a bırakır; örneğin doktora gider, tedavi olur ve dua eder."],
trials:["Sınav geldiğinde","Kadere iman ‘keşke…’ düşüncesiyle kendini yıkmayı önler. Üzülmek doğaldır; Allah'ın rahmetinden ümit kesmek doğru değildir."]}},
death:{title:"Ölüm & Diriliş",intro:"Kur'an ve hadislere göre kısa bir yolculuk: Hayat → Ölüm → Berzah → Diriliş → Hesap → Sonuç.",note:"Gayb âleminin ayrıntıları yalnız vahiyden alınır; kaynaksız hikâyeler eklenmez.",e:{
death:["Ölüm","Her nefis ölümü tadacaktır. Her insanın eceli Allah'ın ilmindedir."],
soul:["Ruhun alınması","Ecel geldiğinde ruh Allah'ın emriyle alınır. Kur'an ölüm meleğini ve ruhları alan melekleri zikreder."],
barzakh:["Berzah","Ölüm ile diriliş arasındaki döneme berzah denir. Ayrıntılarını yalnız vahiyden biliriz."],
grave:["Kabir soruları","Hadisler kabirde Rab, din ve peygamber hakkında soruların olacağını bildirir."],
trumpet:["Sûr'a üfürülmesi","Allah emrettiğinde Sûr'a üfürülür ve kıyametin büyük olayları başlar. Zamanını yalnız Allah bilir."],
resurrection:["Diriliş","İnsanlar kabirlerden çıkarılıp diriltilecektir. İlk yaratılışı yapan Allah için yeniden diriltmek kolaydır."],
gathering:["Mahşer","Herkes hesap için toplanacak ve hiç kimse Allah'ın ilminden kaçamayacaktır."],
book:["Amel defteri","Herkes kendi amel kaydıyla karşılaşacaktır."],
scale:["Mizan","Ameller tam adaletle tartılacak; en küçük haksızlık yapılmayacaktır."],
sirat:["Sırat","Sahih hadislerde insanların durumlarına göre üzerinden geçeceği Cehennem üzerindeki köprü anlatılır."],
final:["Cennet ve Cehennem","Nihai sonuç Allah'ın adaleti ve rahmetiyle Cennet veya Cehennemdir."],
benefit:["Ölüye fayda verenler","Meşhur hadis sadaka-i cariye, faydalı ilim ve dua eden salih evladı sayar; ölüler için dua da edilir."]}}
},

en:{
angels:{title:"Angels",intro:"In Islam, belief in angels is part of faith. Only names and duties grounded in the Quran or well-known hadith are included here.",note:"Angelic ‘power’ is not ranked like a game. We only mention abilities and duties found in the sources, and all angels act only by Allah's command.",e:{
jibril:["Jibril (Gabriel)","The angel of revelation. He brought revelation to the prophets and the Quran to Muhammad ﷺ. The Quran describes him as mighty and honored."],
mikail:["Mika'il","Named in the Quran and one of the great angels. Islamic tradition associates him with provision and rain by Allah's command."],
israfil:["Israfil","Mentioned in hadith among the great angels. Tradition associates him with blowing the Trumpet on the Last Day, only by Allah's command."],
malik:["Malik","The keeper of Hell, named in the Quran."],
deathAngel:["Angel of Death","Takes souls when their appointed term arrives. The Quran calls him the ‘Angel of Death’; the name Azrael is widespread in tradition but is not a Quranic name."],
munkarNakir:["Munkar and Nakir","Mentioned in hadith as the angels who question a person in the grave. Unverified folk stories are not added."],
harutMarut:["Harut and Marut","Two angels mentioned in the Quran in the Babylon account; they warned people about the trial."],
scribes:["Recording angels","They record human deeds and words; the Quran describes them as honored scribes."],
guardians:["Guardian angels","They guard a person by Allah's command and decree. Their protection is not independent."],
throne:["Bearers of the Throne","Angels who bear the Throne and pray for believers. Their individual names have not been given to us."]}},
devil:{title:"Satan & Whispers",intro:"This section explains what the Quran and hadith say about Iblis, devils, whispers and ways to seek protection.",note:"Satan does not have unlimited power over people. He tempts and whispers; a person remains responsible for choices.",e:{
iblis:["Iblis","Iblis is from the jinn. Out of arrogance he refused the command concerning Adam and seeks to mislead people."],
shayatin:["Devils","A term for rebellious beings that call to evil. The Quran mentions devils among jinn and humans."],
whispers:["Whispers","Suggestions that push fear, doubt or sin. Protection begins with seeking refuge in Allah and not feeding unwanted thoughts."],
prayer:["During prayer","Hadith mention Satan trying to distract a person in prayer. Seek refuge in Allah and calmly return attention to the prayer."],
limits:["Limits of his influence","On the Last Day Satan will say that he only called people and they responded. He is not an excuse for sin."],
protection:["How to protect yourself","Say ‘A'udhu billahi min ash-shaytan ir-rajim’, recite Quran, guard the prayer, make dhikr and dua. Ayat al-Kursi, Al-Falaq and An-Nas are well-known protection texts."],
balance:["Do not blame everything on Satan","Not every problem comes from Satan. Illness, anxiety and practical problems also require real causes to be considered and appropriate help."]}},
prophets:{title:"Prophets",intro:"The Quran names 25 prophets. Here is a short summary of each, without portraits or depictions of the prophets.",note:"All prophets called people to worship Allah. Miracles occurred only by Allah's permission.",e:{
adam:["Adam a.s.","The first human and a prophet. His story teaches repentance, responsibility and Allah's mercy."],
idris:["Idris a.s.","A prophet described as truthful and raised to a high station."],
nuh:["Nuh a.s.","Called his people for a very long time; the Ark and flood are part of his story. Main lesson: patience."],
hud:["Hud a.s.","Sent to ‘Ad; he called them to leave arrogance and idolatry."],
salih:["Salih a.s.","Sent to Thamud; the she-camel was a sign for them. His story warns against stubborn rejection."],
ibrahim:["Ibrahim a.s.","A model of pure monotheism; opposed idolatry and raised the foundations of the Kaaba with Ismail."],
lut:["Lut a.s.","Called his people away from sin and moral corruption and remained firm upon the truth."],
ismail:["Ismail a.s.","Son of Ibrahim, known for keeping promises; helped raise the Kaaba."],
ishaq:["Ishaq a.s.","Son of Ibrahim and a prophet from whom a major line of prophets continued."],
yaqub:["Yaqub a.s.","Also called Israel; father of Yusuf. His story models beautiful patience and hope."],
yusuf:["Yusuf a.s.","From the well to authority: tested by jealousy, injustice and prison, then raised in rank. Lessons: purity, patience and forgiveness."],
ayyub:["Ayyub a.s.","Severely tested and became a model of patience and never losing hope in Allah's mercy."],
shuayb:["Shuayb a.s.","Called his people to justice in trade and to abandon cheating."],
musa:["Musa a.s.","Sent to Pharaoh; Allah gave him great signs including the staff and the splitting of the sea."],
harun:["Harun a.s.","Brother of Musa and a prophet; helped him in the mission to Pharaoh."],
dhulkifl:["Dhul-Kifl a.s.","Mentioned among the patient and righteous."],
dawud:["Dawud a.s.","Prophet and king; given the Zabur and known for judgment and worship."],
sulayman:["Sulayman a.s.","Prophet and king; Allah gave him a special kingdom. His story teaches that power is a trust."],
ilyas:["Ilyas a.s.","Called his people to worship Allah and leave the worship of Baal."],
alyasa:["Al-Yasa a.s.","Mentioned among the chosen and righteous."],
yunus:["Yunus a.s.","Prayed while in the fish and Allah saved him. His story teaches repentance and dua."],
zakariya:["Zakariya a.s.","Prayed for a child in old age and Allah granted him Yahya."],
yahya:["Yahya a.s.","A pure and devout prophet who was given wisdom while young."],
isa:["Isa a.s.","Born miraculously to Maryam. Allah gave him miracles by His permission; he is Allah's servant and messenger."],
muhammad:["Muhammad ﷺ","The final messenger, to whom the Quran was revealed. His life includes Makkah, the Hijrah, Madinah and conveying the message."]}},
qadr:{title:"Divine Decree (Qadr)",intro:"Belief in Qadr means Allah knows, has written, wills and creates all things, while human beings still have real choice and responsibility.",note:"Qadr is not an excuse for passivity. A believer acts, takes proper means, makes dua and trusts Allah with the outcome.",e:{
knowledge:["1. Allah's knowledge","Allah knows past, present and future. His knowledge does not force a person to choose sin."],
writing:["2. Writing","The Quran states that events are written before they occur. This does not cancel human responsibility or effort."],
will:["3. Allah's will","Nothing is outside Allah's will, yet a person still chooses and is judged for those choices."],
creation:["4. Creation","Allah is the Creator of all things. Human actions occur within His creation and decree."],
choice:["Choice and responsibility","A human is not a robot. People choose, intend and act; Qadr is not an excuse for wrongdoing."],
dua:["Dua and Qadr","Dua itself is part of Qadr and one of the means Allah has instructed us to use."],
tawakkul:["Tawakkul and taking means","A believer uses reasonable means and trusts Allah with the result, e.g. seeing a doctor, taking treatment and making dua."],
trials:["When trials come","Belief in Qadr helps a person avoid being destroyed by ‘if only…’. Grief is natural; despair of Allah's mercy is not."]}},
death:{title:"Death & Resurrection",intro:"A short journey according to Quran and hadith: Life → Death → Barzakh → Resurrection → Judgment → Final outcome.",note:"Details of the unseen are taken only from revelation; unsupported stories are not added.",e:{
death:["Death","Every soul will taste death. The appointed time of each person is known to Allah."],
soul:["Taking of the soul","When the term arrives, the soul is taken by Allah's command. The Quran mentions the Angel of Death and angels who take souls."],
barzakh:["Barzakh","The period between death and resurrection is called Barzakh. We know its details only through revelation."],
grave:["Questions of the grave","Hadith speak of questions in the grave concerning one's Lord, religion and messenger."],
trumpet:["Blowing of the Trumpet","When Allah commands, the Trumpet will be blown and the great events of the Last Day will begin. Only Allah knows its exact time."],
resurrection:["Resurrection","People will come out of the graves and be raised. Re-creation is easy for Allah just as the first creation was."],
gathering:["Gathering","Everyone will be gathered for judgment and no one escapes Allah's knowledge."],
book:["Book of deeds","Every person will face the record of his or her deeds."],
scale:["The Scale","Deeds will be weighed with perfect justice; not the smallest injustice will be done."],
sirat:["Sirat","Authentic hadith mention a bridge over Hell which people will cross according to their condition."],
final:["Paradise and Hell","The final outcome is Paradise or Hell according to Allah's justice and mercy."],
benefit:["What benefits the deceased","The well-known hadith mentions ongoing charity, beneficial knowledge and a righteous child who prays for the deceased; dua is also made for the dead."]}}
},

it:{
angels:{title:"Gli angeli",intro:"Nell'Islam la fede negli angeli fa parte della fede. Qui compaiono solo nomi e compiti fondati sul Corano o su hadith conosciuti.",note:"La ‘forza’ degli angeli non viene misurata a livelli come in un gioco. Indichiamo solo compiti e capacità riportati nelle fonti; tutti agiscono per ordine di Allah.",e:{
jibril:["Jibril (Gabriele)","Angelo della rivelazione. Portò la rivelazione ai profeti e il Corano a Muhammad ﷺ. Nel Corano è descritto come potente e onorato."],
mikail:["Mika'il","Nominato nel Corano e tra i grandi angeli. Nella tradizione islamica è collegato al sostentamento e alla pioggia per ordine di Allah."],
israfil:["Israfil","Menzionato negli hadith tra i grandi angeli. La tradizione lo collega al soffio nella Tromba nel Giorno del Giudizio, solo per ordine di Allah."],
malik:["Malik","Custode dell'Inferno, nominato nel Corano."],
deathAngel:["Angelo della morte","Prende le anime quando giunge il termine stabilito. Il Corano lo chiama ‘Angelo della morte’; il nome Azrael è diffuso nella tradizione ma non è un nome coranico."],
munkarNakir:["Munkar e Nakir","Negli hadith sono gli angeli che interrogano la persona nella tomba. Non si aggiungono racconti popolari senza fonte."],
harutMarut:["Harut e Marut","Due angeli menzionati nel Corano nel racconto di Babilonia; avvertivano le persone della prova."],
scribes:["Angeli scrivani","Registrano le azioni e le parole dell'uomo; il Corano li descrive come nobili scrivani."],
guardians:["Angeli custodi","Proteggono la persona per ordine e decreto di Allah. La loro protezione non è indipendente."],
throne:["Portatori del Trono","Angeli che portano il Trono e pregano per i credenti. I loro nomi individuali non ci sono stati rivelati."]}},
devil:{title:"Satana & sussurri",intro:"Questa sezione spiega ciò che Corano e hadith dicono su Iblis, i diavoli, i sussurri e la protezione.",note:"Satana non ha potere illimitato sull'uomo. Tenta e sussurra; la persona resta responsabile delle proprie scelte.",e:{
iblis:["Iblis","Iblis è tra i jinn. Per superbia rifiutò il comando riguardo ad Adamo e cerca di sviare le persone."],
shayatin:["I diavoli","Termine per esseri ribelli che invitano al male. Il Corano menziona diavoli tra jinn e uomini."],
whispers:["Sussurri","Pensieri che spingono a paura, dubbio o peccato. La protezione inizia cercando rifugio in Allah e non alimentando il pensiero indesiderato."],
prayer:["Durante la preghiera","Gli hadith ricordano che Satana cerca di distrarre durante la preghiera. Cerca rifugio in Allah e torna con calma alla preghiera."],
limits:["Limiti della sua influenza","Nel Giorno del Giudizio Satana dirà di aver soltanto chiamato e che le persone gli hanno risposto. Non è una scusa per il peccato."],
protection:["Come proteggersi","Di' ‘A'udhu billahi min ash-shaytan ir-rajim’, recita il Corano, custodisci la preghiera, fai dhikr e dua. Ayat al-Kursi, Al-Falaq e An-Nas sono testi noti di protezione."],
balance:["Non attribuire tutto a Satana","Non ogni problema viene da Satana. Malattia, ansia e problemi pratici richiedono anche cause reali e aiuto appropriato."]}},
prophets:{title:"I profeti",intro:"Il Corano nomina 25 profeti. Qui trovi un breve riassunto di ciascuno, senza ritratti o raffigurazioni.",note:"Tutti i profeti chiamarono all'adorazione di Allah. I miracoli avvennero solo con il permesso di Allah.",e:{
adam:["Adamo a.s.","Primo uomo e profeta. La sua storia insegna pentimento, responsabilità e misericordia di Allah."],
idris:["Idris a.s.","Profeta descritto come veritiero e innalzato a una posizione elevata."],
nuh:["Nuh a.s.","Chiamò il suo popolo per molto tempo; l'Arca e il diluvio fanno parte della sua storia. Lezione principale: pazienza."],
hud:["Hud a.s.","Inviato ad ‘Ad; li invitò ad abbandonare arroganza e idolatria."],
salih:["Salih a.s.","Inviato a Thamud; la cammella fu un segno. La sua storia avverte contro il rifiuto ostinato."],
ibrahim:["Ibrahim a.s.","Modello di puro monoteismo; contrastò l'idolatria e con Ismail innalzò le fondamenta della Kaaba."],
lut:["Lut a.s.","Invitò il suo popolo ad abbandonare il peccato e la corruzione morale e rimase saldo nella verità."],
ismail:["Ismail a.s.","Figlio di Ibrahim, noto per mantenere le promesse; aiutò a costruire la Kaaba."],
ishaq:["Ishaq a.s.","Figlio di Ibrahim e profeta, da cui continuò una grande linea di profeti."],
yaqub:["Yaqub a.s.","Chiamato anche Israele; padre di Yusuf. La sua storia mostra bella pazienza e speranza."],
yusuf:["Yusuf a.s.","Dal pozzo al potere: gelosia, ingiustizia e prigione, poi elevazione. Lezioni: purezza, pazienza e perdono."],
ayyub:["Ayyub a.s.","Fu duramente provato e divenne esempio di pazienza e speranza nella misericordia di Allah."],
shuayb:["Shuayb a.s.","Chiamò alla giustizia nel commercio e ad abbandonare l'inganno."],
musa:["Musa a.s.","Inviato al Faraone; Allah gli diede grandi segni, tra cui il bastone e la divisione del mare."],
harun:["Harun a.s.","Fratello di Musa e profeta; lo aiutò nella missione presso il Faraone."],
dhulkifl:["Dhul-Kifl a.s.","Menzionato tra i pazienti e i giusti."],
dawud:["Dawud a.s.","Profeta e re; ricevette lo Zabur ed era noto per il giudizio e l'adorazione."],
sulayman:["Sulayman a.s.","Profeta e re; Allah gli diede un regno speciale. La sua storia insegna che il potere è un affidamento."],
ilyas:["Ilyas a.s.","Invitò il suo popolo ad adorare Allah e ad abbandonare il culto di Baal."],
alyasa:["Al-Yasa a.s.","Menzionato tra gli eletti e i giusti."],
yunus:["Yunus a.s.","Pregò nel ventre del pesce e Allah lo salvò. La sua storia insegna pentimento e dua."],
zakariya:["Zakariya a.s.","Pregò per un figlio in età avanzata e Allah gli concesse Yahya."],
yahya:["Yahya a.s.","Profeta puro e devoto, al quale fu data saggezza da giovane."],
isa:["Isa a.s.","Nacque miracolosamente da Maryam. Allah gli diede miracoli con il Suo permesso; è servo e messaggero di Allah."],
muhammad:["Muhammad ﷺ","Ultimo messaggero, al quale fu rivelato il Corano. La sua vita comprende Mecca, Egira, Medina e la trasmissione del messaggio."]}},
qadr:{title:"Decreto divino (Qadr)",intro:"Credere nel Qadr significa che Allah conosce, ha scritto, vuole e crea ogni cosa, mentre l'uomo possiede una scelta reale e responsabilità.",note:"Il Qadr non è una scusa per la passività. Il credente agisce, usa i mezzi, fa dua e affida il risultato ad Allah.",e:{
knowledge:["1. La conoscenza di Allah","Allah conosce passato, presente e futuro. La Sua conoscenza non costringe l'uomo al peccato."],
writing:["2. La scrittura","Il Corano afferma che gli eventi sono scritti prima che avvengano. Ciò non annulla responsabilità e impegno."],
will:["3. La volontà di Allah","Nulla è fuori dalla volontà di Allah, eppure l'uomo sceglie ed è giudicato per le sue scelte."],
creation:["4. La creazione","Allah è il Creatore di ogni cosa. Le azioni umane avvengono all'interno della Sua creazione e del Suo decreto."],
choice:["Scelta e responsabilità","L'uomo non è un robot. Sceglie, intende e agisce; il Qadr non giustifica il peccato."],
dua:["Dua e Qadr","La dua stessa fa parte del Qadr ed è uno dei mezzi che Allah ci ha ordinato di usare."],
tawakkul:["Tawakkul e prendere i mezzi","Il credente usa mezzi ragionevoli e affida il risultato ad Allah, per esempio andando dal medico, curandosi e facendo dua."],
trials:["Quando arrivano le prove","La fede nel Qadr aiuta a non distruggersi con ‘se solo…’. Il dolore è naturale; disperare della misericordia di Allah non lo è."]}},
death:{title:"Morte & Resurrezione",intro:"Un breve percorso secondo Corano e hadith: Vita → Morte → Barzakh → Resurrezione → Giudizio → Esito finale.",note:"I dettagli dell'invisibile si prendono solo dalla rivelazione; non si aggiungono storie senza fonte.",e:{
death:["La morte","Ogni anima gusterà la morte. Il termine stabilito di ogni persona è noto ad Allah."],
soul:["La presa dell'anima","Quando giunge il termine, l'anima viene presa per ordine di Allah. Il Corano menziona l'Angelo della morte e gli angeli che prendono le anime."],
barzakh:["Barzakh","Il periodo tra morte e resurrezione si chiama Barzakh. Ne conosciamo i dettagli solo tramite rivelazione."],
grave:["Domande della tomba","Gli hadith parlano di domande nella tomba riguardo al Signore, alla religione e al messaggero."],
trumpet:["Il soffio nella Tromba","Quando Allah ordinerà, sarà soffiata la Tromba e inizieranno i grandi eventi dell'Ultimo Giorno. Solo Allah ne conosce il momento."],
resurrection:["Resurrezione","Le persone usciranno dalle tombe e saranno risuscitate. Ricreare è facile per Allah come la prima creazione."],
gathering:["Raduno","Tutti saranno radunati per il giudizio e nessuno sfugge alla conoscenza di Allah."],
book:["Libro delle opere","Ogni persona affronterà il registro delle proprie opere."],
scale:["La Bilancia","Le opere saranno pesate con perfetta giustizia; non sarà commessa la minima ingiustizia."],
sirat:["Sirat","Hadith autentici menzionano il ponte sopra l'Inferno che le persone attraverseranno secondo la loro condizione."],
final:["Paradiso e Inferno","L'esito finale è Paradiso o Inferno secondo la giustizia e la misericordia di Allah."],
benefit:["Ciò che beneficia il defunto","Il noto hadith cita carità continua, conoscenza utile e un figlio giusto che prega per il defunto; si fa anche dua per i morti."]}}
},

hr:{
angels:{title:"Meleki",intro:"U islamu je vjerovanje u meleke dio imana. Ovdje su samo imena i zadaće koje imaju osnovu u Kur'anu ili poznatim hadisima.",note:"‘Snaga’ meleka ne mjeri se razinama kao u igri. Navode se samo zadaće i sposobnosti iz izvora; svi djeluju samo Allahovom naredbom.",e:{
jibril:["Džibril","Melek objave. Donosio je objavu poslanicima i Kur'an Muhammedu ﷺ. U Kur'anu je opisan kao snažan i ugledan."],
mikail:["Mikail","Po imenu spomenut u Kur'anu i jedan od velikih meleka. U islamskoj predaji povezuje se s opskrbom i kišom Allahovom naredbom."],
israfil:["Israfil","U hadisima se spominje među velikim melekima. Predaja ga povezuje s puhanjem u Sur na Sudnjem danu, samo Allahovom naredbom."],
malik:["Malik","Čuvar Džehennema, po imenu spomenut u Kur'anu."],
deathAngel:["Melek smrti","Uzima duše kada dođe određeni čas. Kur'an ga naziva ‘Melek smrti’; ime Azrail je rašireno u predaji, ali nije kur'ansko ime."],
munkarNakir:["Munkir i Nekir","U hadisima se spominju kao meleki koji ispituju čovjeka u kaburu. Ne dodaju se narodne priče bez izvora."],
harutMarut:["Harut i Marut","Dva meleka spomenuta u Kur'anu u priči o Babilonu; upozoravali su ljude na iskušenje."],
scribes:["Meleki pisari","Bilježe čovjekova djela i riječi; Kur'an ih opisuje kao časne pisare."],
guardians:["Meleki čuvari","Čuvaju čovjeka po Allahovoj naredbi i odredbi. Njihova zaštita nije neovisna."],
throne:["Nosioci Arša","Meleki koji nose Arš i mole za vjernike. Njihova pojedinačna imena nisu nam objavljena."]}},
devil:{title:"Šejtan & došaptavanja",intro:"Ovaj dio objašnjava što Kur'an i hadisi kažu o Iblisu, šejtanima, vesvesama i zaštiti.",note:"Šejtan nema neograničenu moć nad čovjekom. On zavodi i došaptava; čovjek ostaje odgovoran za svoje izbore.",e:{
iblis:["Iblis","Iblis je od džinna. Iz oholosti je odbio naredbu vezanu uz Adema i nastoji ljude zavesti."],
shayatin:["Šejtani","Izraz za buntovna bića koja pozivaju zlu. Kur'an spominje šejtane među džinnima i ljudima."],
whispers:["Vesvese","Došaptavanja koja potiču strah, sumnju ili grijeh. Zaštita počinje traženjem utočišta kod Allaha i nehranjenjem neželjenih misli."],
prayer:["Tijekom namaza","Hadisi navode da šejtan pokušava ometati čovjeka u namazu. Zatraži zaštitu kod Allaha i mirno se vrati namazu."],
limits:["Granice njegova utjecaja","Na Sudnjem danu šejtan će reći da je samo pozivao, a ljudi su se odazvali. On nije opravdanje za grijeh."],
protection:["Kako se zaštititi","Reci ‘E'uzu billahi mineš-šejtanir-radžim’, uči Kur'an, čuvaj namaz, čini zikr i dovu. Ajetul-Kursi, El-Felek i En-Nas poznati su tekstovi zaštite."],
balance:["Ne pripisuj sve šejtanu","Nije svaki problem od šejtana. Bolest, tjeskoba i praktični problemi zahtijevaju i stvarne uzroke te odgovarajuću pomoć."]}},
prophets:{title:"Poslanici",intro:"Kur'an po imenu spominje 25 poslanika. Ovdje je kratak sažetak svakoga, bez portreta ili prikaza poslanika.",note:"Svi poslanici pozivali su obožavanju Allaha. Mudžize su se događale samo Allahovom dozvolom.",e:{
adam:["Adem a.s.","Prvi čovjek i poslanik. Njegova priča uči pokajanju, odgovornosti i Allahovoj milosti."],
idris:["Idris a.s.","Poslanik opisan kao istinoljubiv i uzdignut na visoko mjesto."],
nuh:["Nuh a.s.","Dugo je pozivao svoj narod; lađa i potop dio su njegove priče. Glavna pouka je strpljenje."],
hud:["Hud a.s.","Poslan Adu; pozivao ih je da ostave oholost i idolopoklonstvo."],
salih:["Salih a.s.","Poslan Semudu; deva je bila znak. Priča upozorava na tvrdoglavo odbijanje istine."],
ibrahim:["Ibrahim a.s.","Uzoran u tevhidu; suprotstavio se idolopoklonstvu i s Ismailom podigao temelje Kabe."],
lut:["Lut a.s.","Pozivao svoj narod da ostavi grijeh i moralnu pokvarenost te ostao čvrst na istini."],
ismail:["Ismail a.s.","Ibrahimov sin, poznat po održavanju obećanja; pomagao je u gradnji Kabe."],
ishaq:["Ishak a.s.","Ibrahimov sin i poslanik, od kojega se nastavila velika loza poslanika."],
yaqub:["Jakub a.s.","Poznat i kao Israil; Jusufov otac. Njegova priča pokazuje lijepo strpljenje i nadu."],
yusuf:["Jusuf a.s.","Od bunara do vlasti: kušan zavišću, nepravdom i zatvorom, zatim uzdignut. Pouke: čednost, strpljenje i oprost."],
ayyub:["Ejub a.s.","Teško iskušan i postao primjer strpljenja i nade u Allahovu milost."],
shuayb:["Šuajb a.s.","Pozivao pravednosti u trgovini i napuštanju prevare."],
musa:["Musa a.s.","Poslan faraonu; Allah mu je dao velike znakove, uključujući štap i razdvajanje mora."],
harun:["Harun a.s.","Musaov brat i poslanik; pomagao mu je u misiji prema faraonu."],
dhulkifl:["Zulkifl a.s.","Spomenut među strpljivima i dobrima."],
dawud:["Davud a.s.","Poslanik i kralj; dobio Zebur i bio poznat po pravednom suđenju i ibadetu."],
sulayman:["Sulejman a.s.","Poslanik i kralj; Allah mu je dao posebnu vlast. Njegova priča uči da je moć emanet."],
ilyas:["Iljas a.s.","Pozivao svoj narod da obožava Allaha i ostavi obožavanje Ba'la."],
alyasa:["El-Jesa a.s.","Spomenut među odabranima i dobrima."],
yunus:["Junus a.s.","U utrobi ribe učinio je dovu i Allah ga je spasio. Priča uči pokajanju i dovi."],
zakariya:["Zekerijja a.s.","Molio za potomka u starosti i Allah mu je darovao Jahjaa."],
yahya:["Jahja a.s.","Čist i bogobojazan poslanik kojem je mudrost dana još u mladosti."],
isa:["Isa a.s.","Čudesno rođen od Merjeme. Allah mu je dao mudžize Svojom dozvolom; on je Allahov rob i poslanik."],
muhammad:["Muhammed ﷺ","Posljednji poslanik kojem je objavljen Kur'an. Njegov život obuhvaća Meku, Hidžru, Medinu i prenošenje poruke."]}},
qadr:{title:"Kader",intro:"Vjerovanje u kader znači da Allah zna, zapisao je, hoće i stvara sve, dok čovjek ipak ima stvaran izbor i odgovornost.",note:"Kader nije opravdanje za pasivnost. Vjernik djeluje, uzima uzroke, čini dovu i oslanja se na Allaha za ishod.",e:{
knowledge:["1. Allahovo znanje","Allah zna prošlost, sadašnjost i budućnost. Njegovo znanje ne prisiljava čovjeka na grijeh."],
writing:["2. Zapisivanje","Kur'an navodi da su događaji zapisani prije nego nastupe. To ne ukida odgovornost ni trud."],
will:["3. Allahova volja","Ništa nije izvan Allahove volje, ali čovjek ipak bira i odgovara za svoj izbor."],
creation:["4. Stvaranje","Allah je Stvoritelj svega. Čovjekova djela događaju se unutar Njegova stvaranja i odredbe."],
choice:["Izbor i odgovornost","Čovjek nije robot. Bira, namjerava i djeluje; kader nije opravdanje za grijeh."],
dua:["Dova i kader","Dova je i sama dio kadera i jedan od uzroka koje nam je Allah naredio koristiti."],
tawakkul:["Tevekkul i uzimanje uzroka","Vjernik poduzima razumne korake i oslanja se na Allaha za rezultat, npr. ide liječniku, liječi se i čini dovu."],
trials:["Kada dođe iskušenje","Vjerovanje u kader štiti od samouništavanja mislima ‘da sam samo…’. Tuga je prirodna; očaj u Allahovu milost nije."]}},
death:{title:"Smrt & proživljenje",intro:"Kratak put prema Kur'anu i hadisima: Život → Smrt → Berzah → Proživljenje → Sud → Konačni ishod.",note:"Detalji nevidljivog svijeta uzimaju se samo iz objave; priče bez izvora se ne dodaju.",e:{
death:["Smrt","Svaka duša okusit će smrt. Vrijeme svakog čovjeka poznato je Allahu."],
soul:["Uzimanje duše","Kada dođe rok, duša se uzima Allahovom naredbom. Kur'an spominje Meleka smrti i meleke koji uzimaju duše."],
barzakh:["Berzah","Razdoblje između smrti i proživljenja zove se berzah. Detalje znamo samo iz objave."],
grave:["Pitanja u kaburu","Hadisi govore o pitanjima u kaburu o Gospodaru, vjeri i poslaniku."],
trumpet:["Puhanje u Sur","Kada Allah naredi, puhnut će se u Sur i počet će veliki događaji Sudnjeg dana. Točan čas zna samo Allah."],
resurrection:["Proživljenje","Ljudi će izaći iz grobova i biti proživljeni. Allahu je ponovno stvaranje lako kao i prvo stvaranje."],
gathering:["Okupljanje","Svi će biti okupljeni radi suda i nitko ne izmiče Allahovu znanju."],
book:["Knjiga djela","Svaka osoba suočit će se sa zapisom vlastitih djela."],
scale:["Mizan","Djela će biti vagana savršenom pravdom; neće se učiniti ni najmanja nepravda."],
sirat:["Sirat","Vjerodostojni hadisi spominju most iznad Džehennema koji će ljudi prelaziti prema svome stanju."],
final:["Džennet i Džehennem","Konačni ishod je Džennet ili Džehennem prema Allahovoj pravdi i milosti."],
benefit:["Što koristi umrlom","Poznati hadis navodi trajnu sadaku, korisno znanje i dobro dijete koje moli za umrlog; za umrle se također čini dova."]}}
},

fr:{
angels:{title:"Les anges",intro:"En Islam, croire aux anges fait partie de la foi. Ici figurent seulement les noms et missions fondés sur le Coran ou des hadiths connus.",note:"La ‘force’ des anges ne se mesure pas en niveaux comme dans un jeu. Seules les missions et capacités rapportées par les sources sont indiquées; tous agissent sur ordre d'Allah.",e:{
jibril:["Jibril (Gabriel)","Ange de la révélation. Il apporta la révélation aux prophètes et le Coran à Muhammad ﷺ. Le Coran le décrit comme puissant et honoré."],
mikail:["Mika'il","Nommé dans le Coran et compté parmi les grands anges. La tradition islamique l'associe à la subsistance et à la pluie par ordre d'Allah."],
israfil:["Israfil","Mentionné dans les hadiths parmi les grands anges. La tradition l'associe au souffle dans la Trompe au Jour du Jugement, uniquement sur ordre d'Allah."],
malik:["Malik","Gardien de l'Enfer, nommé dans le Coran."],
deathAngel:["Ange de la mort","Prend les âmes lorsque leur terme arrive. Le Coran l'appelle ‘Ange de la mort’; le nom Azraël est répandu dans la tradition mais n'est pas un nom coranique."],
munkarNakir:["Munkar et Nakir","Mentionnés dans les hadiths comme les anges qui interrogent la personne dans la tombe. Les récits populaires sans source ne sont pas ajoutés."],
harutMarut:["Harut et Marut","Deux anges mentionnés dans le Coran dans le récit de Babylone; ils avertissaient les gens de l'épreuve."],
scribes:["Anges scribes","Ils enregistrent les actes et paroles des humains; le Coran les décrit comme de nobles scribes."],
guardians:["Anges gardiens","Ils protègent la personne par ordre et décret d'Allah. Leur protection n'est pas indépendante."],
throne:["Porteurs du Trône","Des anges qui portent le Trône et invoquent pour les croyants. Leurs noms individuels ne nous ont pas été révélés."]}},
devil:{title:"Satan & tentations",intro:"Cette partie explique ce que le Coran et les hadiths disent d'Iblis, des démons, des suggestions et de la protection.",note:"Satan n'a pas un pouvoir illimité sur l'être humain. Il tente et suggère; la personne reste responsable de ses choix.",e:{
iblis:["Iblis","Iblis fait partie des djinns. Par orgueil, il refusa l'ordre concernant Adam et cherche à égarer les humains."],
shayatin:["Les démons","Terme pour des êtres rebelles qui appellent au mal. Le Coran mentionne des démons parmi les djinns et les humains."],
whispers:["Les suggestions","Des pensées qui poussent à la peur, au doute ou au péché. La protection commence par chercher refuge auprès d'Allah et ne pas nourrir la pensée indésirable."],
prayer:["Pendant la prière","Les hadiths mentionnent que Satan tente de distraire pendant la prière. Cherche refuge auprès d'Allah et reviens calmement à la prière."],
limits:["Limites de son influence","Au Jour du Jugement, Satan dira qu'il a seulement appelé les gens et qu'ils lui ont répondu. Il n'est pas une excuse pour le péché."],
protection:["Comment se protéger","Dis ‘A'udhu billahi min ash-shaytan ir-rajim’, récite le Coran, préserve la prière, fais du dhikr et des duas. Ayat al-Kursi, Al-Falaq et An-Nas sont des textes connus de protection."],
balance:["Ne pas tout attribuer à Satan","Tous les problèmes ne viennent pas de Satan. Maladie, anxiété et difficultés pratiques demandent aussi l'examen des causes réelles et une aide appropriée."]}},
prophets:{title:"Les prophètes",intro:"Le Coran nomme 25 prophètes. Voici un bref résumé de chacun, sans portraits ni représentations.",note:"Tous les prophètes ont appelé à adorer Allah. Les miracles n'ont eu lieu qu'avec la permission d'Allah.",e:{
adam:["Adam a.s.","Premier homme et prophète. Son histoire enseigne le repentir, la responsabilité et la miséricorde d'Allah."],
idris:["Idris a.s.","Prophète décrit comme véridique et élevé à un rang élevé."],
nuh:["Nuh a.s.","Il appela son peuple très longtemps; l'Arche et le déluge font partie de son histoire. Leçon principale: la patience."],
hud:["Hud a.s.","Envoyé à ‘Ad; il les appela à abandonner l'orgueil et l'idolâtrie."],
salih:["Salih a.s.","Envoyé à Thamud; la chamelle fut un signe. Son histoire met en garde contre le rejet obstiné."],
ibrahim:["Ibrahim a.s.","Modèle du monothéisme pur; il s'opposa à l'idolâtrie et éleva les fondations de la Kaaba avec Ismail."],
lut:["Lut a.s.","Il appela son peuple à abandonner le péché et la corruption morale et resta ferme sur la vérité."],
ismail:["Ismail a.s.","Fils d'Ibrahim, connu pour tenir ses promesses; il participa à la construction de la Kaaba."],
ishaq:["Ishaq a.s.","Fils d'Ibrahim et prophète, d'où continua une grande lignée de prophètes."],
yaqub:["Yaqub a.s.","Aussi appelé Israël; père de Yusuf. Son histoire montre une belle patience et l'espérance."],
yusuf:["Yusuf a.s.","Du puits au pouvoir: jalousie, injustice et prison, puis élévation. Leçons: pureté, patience et pardon."],
ayyub:["Ayyub a.s.","Durement éprouvé, il devint un exemple de patience et d'espérance en la miséricorde d'Allah."],
shuayb:["Shuayb a.s.","Il appela à la justice dans le commerce et à abandonner la fraude."],
musa:["Musa a.s.","Envoyé à Pharaon; Allah lui donna de grands signes, dont le bâton et l'ouverture de la mer."],
harun:["Harun a.s.","Frère de Musa et prophète; il l'aida dans sa mission auprès de Pharaon."],
dhulkifl:["Dhul-Kifl a.s.","Mentionné parmi les patients et les vertueux."],
dawud:["Dawud a.s.","Prophète et roi; il reçut le Zabur et fut connu pour son jugement et son adoration."],
sulayman:["Sulayman a.s.","Prophète et roi; Allah lui donna un royaume particulier. Son histoire enseigne que le pouvoir est un dépôt."],
ilyas:["Ilyas a.s.","Il appela son peuple à adorer Allah et à abandonner le culte de Baal."],
alyasa:["Al-Yasa a.s.","Mentionné parmi les élus et les vertueux."],
yunus:["Yunus a.s.","Il invoqua Allah dans le ventre du poisson et Allah le sauva. Son histoire enseigne le repentir et la dua."],
zakariya:["Zakariya a.s.","Il demanda un enfant à un âge avancé et Allah lui accorda Yahya."],
yahya:["Yahya a.s.","Prophète pur et pieux, à qui la sagesse fut donnée dans sa jeunesse."],
isa:["Isa a.s.","Né miraculeusement de Maryam. Allah lui donna des miracles avec Sa permission; il est serviteur et messager d'Allah."],
muhammad:["Muhammad ﷺ","Dernier messager, à qui le Coran fut révélé. Sa vie comprend La Mecque, l'Hégire, Médine et la transmission du message."]}},
qadr:{title:"Décret divin (Qadr)",intro:"Croire au Qadr signifie qu'Allah sait, a écrit, veut et crée toute chose, tandis que l'être humain possède un vrai choix et une responsabilité.",note:"Le Qadr n'est pas une excuse à la passivité. Le croyant agit, prend les moyens, fait dua et confie le résultat à Allah.",e:{
knowledge:["1. La connaissance d'Allah","Allah connaît le passé, le présent et le futur. Sa connaissance ne force pas l'homme à pécher."],
writing:["2. L'écriture","Le Coran indique que les événements sont écrits avant qu'ils n'arrivent. Cela n'annule ni la responsabilité ni l'effort."],
will:["3. La volonté d'Allah","Rien n'est en dehors de la volonté d'Allah, mais l'homme choisit et est jugé pour ses choix."],
creation:["4. La création","Allah est le Créateur de toute chose. Les actes humains ont lieu dans Sa création et Son décret."],
choice:["Choix et responsabilité","L'homme n'est pas un robot. Il choisit, veut et agit; le Qadr n'excuse pas le péché."],
dua:["Dua et Qadr","La dua elle-même fait partie du Qadr et compte parmi les moyens qu'Allah nous a ordonné d'utiliser."],
tawakkul:["Tawakkul et prendre les moyens","Le croyant utilise les moyens raisonnables et confie le résultat à Allah, par exemple consulter un médecin, se soigner et faire dua."],
trials:["Quand l'épreuve arrive","La foi au Qadr aide à ne pas se détruire par les ‘si seulement…’. La tristesse est naturelle; désespérer de la miséricorde d'Allah ne l'est pas."]}},
death:{title:"Mort & Résurrection",intro:"Un bref parcours selon le Coran et les hadiths: Vie → Mort → Barzakh → Résurrection → Jugement → Issue finale.",note:"Les détails de l'invisible sont pris uniquement de la révélation; les histoires sans source ne sont pas ajoutées.",e:{
death:["La mort","Toute âme goûtera la mort. Le terme fixé de chacun est connu d'Allah."],
soul:["La prise de l'âme","Quand le terme arrive, l'âme est prise sur ordre d'Allah. Le Coran mentionne l'Ange de la mort et des anges qui prennent les âmes."],
barzakh:["Barzakh","La période entre la mort et la résurrection s'appelle Barzakh. Nous n'en connaissons les détails que par la révélation."],
grave:["Questions de la tombe","Les hadiths parlent de questions dans la tombe au sujet du Seigneur, de la religion et du messager."],
trumpet:["Le souffle dans la Trompe","Quand Allah l'ordonnera, la Trompe sera soufflée et les grands événements du Dernier Jour commenceront. Seul Allah en connaît le moment."],
resurrection:["Résurrection","Les gens sortiront des tombes et seront ressuscités. Recréer est facile pour Allah comme la première création."],
gathering:["Rassemblement","Tous seront rassemblés pour le jugement et personne n'échappe à la connaissance d'Allah."],
book:["Livre des actes","Chaque personne sera confrontée au registre de ses propres actes."],
scale:["La Balance","Les actes seront pesés avec une justice parfaite; aucune injustice ne sera commise."],
sirat:["Sirat","Des hadiths authentiques mentionnent le pont au-dessus de l'Enfer que les gens traverseront selon leur état."],
final:["Paradis et Enfer","L'issue finale est le Paradis ou l'Enfer selon la justice et la miséricorde d'Allah."],
benefit:["Ce qui profite au défunt","Le hadith connu mentionne l'aumône continue, la connaissance utile et l'enfant pieux qui prie pour le défunt; on fait aussi dua pour les morts."]}}
},

ar:{
angels:{title:"الملائكة",intro:"الإيمان بالملائكة من أصول الإيمان في الإسلام. هنا نذكر فقط الأسماء والمهام التي لها أصل في القرآن أو الأحاديث المعروفة.",note:"قوة الملائكة لا تُقاس بمستويات مثل الألعاب. نذكر فقط ما ورد من وظائف وصفات، وكلهم يعملون بأمر الله وحده.",e:{
jibril:["جبريل عليه السلام","مَلَك الوحي. جاء بالوحي إلى الأنبياء وبالقرآن إلى محمد ﷺ، ووصفه القرآن بالقوة والمكانة."],
mikail:["ميكائيل عليه السلام","ذُكر باسمه في القرآن وهو من كبار الملائكة. وترتبط به في الروايات الإسلامية أمور الرزق والمطر بأمر الله."],
israfil:["إسرافيل","ذُكر في الأحاديث ضمن كبار الملائكة، وترتبط به في الروايات النفخة في الصور يوم القيامة، بأمر الله فقط."],
malik:["مالك","خازن جهنم، ذُكر باسمه في القرآن."],
deathAngel:["مَلَك الموت","يقبض الأرواح عند حلول الأجل بأمر الله. سماه القرآن ‘مَلَك الموت’؛ واسم عزرائيل مشهور في التراث لكنه ليس اسماً قرآنياً."],
munkarNakir:["منكر ونكير","ورد ذكرهما في الأحاديث في سؤال الإنسان في القبر. ولا نضيف القصص الشعبية التي لا سند لها."],
harutMarut:["هاروت وماروت","ملكان ذُكرا في القرآن في قصة بابل، وكانا يحذران الناس من الفتنة."],
scribes:["الملائكة الكتبة","يسجلون أعمال الإنسان وأقواله، ووصفهم القرآن بأنهم كرام كاتبون."],
guardians:["الملائكة الحفظة","يحفظون الإنسان بأمر الله وتقديره، وليس لهم استقلال عن أمره."],
throne:["حملة العرش","ملائكة يحملون العرش ويدعون للمؤمنين. لم تُذكر لنا أسماؤهم الفردية."]}},
devil:{title:"الشيطان والوساوس",intro:"يشرح هذا القسم ما يقوله القرآن والحديث عن إبليس والشياطين والوساوس وطرق الاستعاذة والحماية.",note:"ليس للشيطان سلطان مطلق على الإنسان. يوسوس ويغري، ويبقى الإنسان مسؤولاً عن اختياراته.",e:{
iblis:["إبليس","إبليس من الجن. رفض أمر الله المتعلق بآدم بسبب الكبر، ويسعى إلى إضلال الناس."],
shayatin:["الشياطين","اسم للمتمردين الذين يدعون إلى الشر. ويذكر القرآن شياطين من الجن والإنس."],
whispers:["الوساوس","خواطر تدفع إلى الخوف أو الشك أو المعصية. تبدأ الحماية بالاستعاذة بالله وعدم تغذية الفكرة المزعجة."],
prayer:["أثناء الصلاة","تذكر الأحاديث أن الشيطان يحاول تشتيت المصلي. استعذ بالله وارجع إلى صلاتك بهدوء."],
limits:["حدود تأثيره","يقر الشيطان يوم القيامة بأنه دعا الناس فاستجابوا له. لذلك لا يكون عذراً للمعصية."],
protection:["كيف تحمي نفسك","قل: أعوذ بالله من الشيطان الرجيم، واقرأ القرآن، وحافظ على الصلاة والذكر والدعاء. وآية الكرسي والفلق والناس من نصوص الحماية المعروفة."],
balance:["لا تنسب كل شيء للشيطان","ليس كل مرض أو قلق أو مشكلة من الشيطان. يجب أيضاً النظر في الأسباب الواقعية وطلب المساعدة المناسبة."]}},
prophets:{title:"الأنبياء",intro:"ذكر القرآن خمسة وعشرين نبياً بأسمائهم. هنا ملخص قصير لكل واحد منهم، من دون صور أو تجسيد للأنبياء.",note:"دعا جميع الأنبياء إلى عبادة الله. والمعجزات وقعت بإذن الله وحده.",e:{
adam:["آدم عليه السلام","أول إنسان ونبي. تعلم قصته التوبة والمسؤولية ورحمة الله."],
idris:["إدريس عليه السلام","نبي وصفه القرآن بالصدق ورفعه مكاناً علياً."],
nuh:["نوح عليه السلام","دعا قومه زمناً طويلاً، ومن قصته السفينة والطوفان. وأبرز دروسها الصبر."],
hud:["هود عليه السلام","أُرسل إلى عاد ودعاهم إلى ترك الكبر وعبادة الأصنام."],
salih:["صالح عليه السلام","أُرسل إلى ثمود وكانت الناقة آية لهم. وقصته تحذر من العناد في رد الحق."],
ibrahim:["إبراهيم عليه السلام","إمام في التوحيد، واجه الشرك ورفع قواعد الكعبة مع إسماعيل."],
lut:["لوط عليه السلام","دعا قومه إلى ترك المعاصي والفساد الأخلاقي وثبت على الحق."],
ismail:["إسماعيل عليه السلام","ابن إبراهيم، عُرف بالوفاء بالوعد وساعد في رفع قواعد الكعبة."],
ishaq:["إسحاق عليه السلام","ابن إبراهيم ونبي، واستمرت من نسله سلسلة كبيرة من الأنبياء."],
yaqub:["يعقوب عليه السلام","يُسمى إسرائيل أيضاً، وهو والد يوسف. تعلم قصته الصبر الجميل والرجاء."],
yusuf:["يوسف عليه السلام","من الجب إلى التمكين: ابتُلي بالحسد والظلم والسجن ثم رفعه الله. من دروسه العفة والصبر والعفو."],
ayyub:["أيوب عليه السلام","ابتُلي ابتلاء شديداً وصار مثالاً في الصبر وعدم اليأس من رحمة الله."],
shuayb:["شعيب عليه السلام","دعا قومه إلى العدل في التجارة وترك الغش."],
musa:["موسى عليه السلام","أُرسل إلى فرعون وأعطاه الله آيات عظيمة منها العصا وانفلاق البحر."],
harun:["هارون عليه السلام","أخو موسى ونبي، أعانه في دعوة فرعون."],
dhulkifl:["ذو الكفل عليه السلام","ذُكر ضمن الصابرين والأخيار."],
dawud:["داود عليه السلام","نبي وملك، آتاه الله الزبور وعُرف بالحكم والعبادة."],
sulayman:["سليمان عليه السلام","نبي وملك، أعطاه الله ملكاً خاصاً. تعلم قصته أن السلطة أمانة."],
ilyas:["إلياس عليه السلام","دعا قومه إلى عبادة الله وترك عبادة بعل."],
alyasa:["اليسع عليه السلام","ذُكر ضمن الأخيار والمصطفين."],
yunus:["يونس عليه السلام","دعا الله في بطن الحوت فنجاه. تعلم قصته التوبة والدعاء."],
zakariya:["زكريا عليه السلام","دعا الله أن يرزقه ولداً في الكبر فوهبه يحيى."],
yahya:["يحيى عليه السلام","نبي طاهر تقي، آتاه الله الحكمة وهو صغير."],
isa:["عيسى عليه السلام","وُلد من مريم ولادة معجزة، وآتاه الله معجزات بإذنه؛ وهو عبد الله ورسوله."],
muhammad:["محمد ﷺ","خاتم الرسل، أنزل الله عليه القرآن. تشمل سيرته مكة والهجرة والمدينة وتبليغ الرسالة."]}},
qadr:{title:"القدر",intro:"الإيمان بالقدر يعني أن الله يعلم كل شيء وكتبه وشاءه وخلقه، مع بقاء اختيار الإنسان الحقيقي ومسؤوليته.",note:"القدر ليس عذراً للكسل. يأخذ المؤمن بالأسباب ويعمل ويدعو ويتوكل على الله في النتيجة.",e:{
knowledge:["1. علم الله","يعلم الله الماضي والحاضر والمستقبل. علمه لا يجبر الإنسان على اختيار المعصية."],
writing:["2. الكتابة","يذكر القرآن أن الأمور مكتوبة قبل وقوعها. وهذا لا يلغي المسؤولية ولا السعي."],
will:["3. مشيئة الله","لا شيء يخرج عن مشيئة الله، ومع ذلك يختار الإنسان ويحاسب على اختياره."],
creation:["4. الخلق","الله خالق كل شيء، وأفعال الإنسان تقع ضمن خلق الله وقدره."],
choice:["الاختيار والمسؤولية","الإنسان ليس آلة. يختار وينوي ويعمل؛ والقدر لا يبرر المعصية."],
dua:["الدعاء والقدر","الدعاء نفسه من القدر وهو سبب أمرنا الله باستعماله."],
tawakkul:["التوكل والأخذ بالأسباب","يأخذ المؤمن بالأسباب المعقولة ويتوكل على الله في النتيجة؛ مثل مراجعة الطبيب والعلاج مع الدعاء."],
trials:["عند الابتلاء","الإيمان بالقدر يساعد على عدم الانهيار بسبب ‘لو أني…’. الحزن طبيعي، أما اليأس من رحمة الله فليس كذلك."]}},
death:{title:"الموت والبعث",intro:"رحلة مختصرة بحسب القرآن والحديث: الحياة ← الموت ← البرزخ ← البعث ← الحساب ← المصير.",note:"تفاصيل عالم الغيب لا تؤخذ إلا من الوحي، ولا نضيف قصصاً بلا مصدر.",e:{
death:["الموت","كل نفس ذائقة الموت، وأجل كل إنسان معلوم عند الله."],
soul:["قبض الروح","عند حلول الأجل تُقبض الروح بأمر الله. ويذكر القرآن مَلَك الموت والملائكة الذين يتوفون الأرواح."],
barzakh:["البرزخ","الفترة بين الموت والبعث تسمى البرزخ، ولا نعرف تفاصيلها إلا بالوحي."],
grave:["أسئلة القبر","تذكر الأحاديث أسئلة في القبر عن الرب والدين والرسول."],
trumpet:["النفخ في الصور","عندما يأمر الله يُنفخ في الصور وتبدأ أحداث القيامة الكبرى. لا يعلم وقتها إلا الله."],
resurrection:["البعث","يخرج الناس من القبور ويُبعثون. وإعادة الخلق يسيرة على الله كما بدأ الخلق أول مرة."],
gathering:["الحشر","يجمع الناس للحساب ولا يغيب أحد عن علم الله."],
book:["كتاب الأعمال","يواجه كل إنسان سجل أعماله."],
scale:["الميزان","توزن الأعمال بعدل كامل ولا يقع أدنى ظلم."],
sirat:["الصراط","تذكر الأحاديث الصحيحة الجسر فوق جهنم الذي يمر عليه الناس بحسب أحوالهم."],
final:["الجنة والنار","المصير النهائي هو الجنة أو النار وفق عدل الله ورحمته."],
benefit:["ما ينفع الميت","يذكر الحديث الصدقة الجارية والعلم النافع والولد الصالح الذي يدعو للميت، كما يُدعى للموتى."]}}
}
};

function currentLang(){
  const l=(localStorage.getItem(LANG_KEY)||"sq").toLowerCase();
  return DATA[l]?l:"en";
}
function ui(){return UI[currentLang()]||UI.en;}
function topicData(topic){
  const l=currentLang();
  return DATA[l]?.[topic]||DATA.en[topic];
}
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
  .belief-item h3{display:flex;align-items:center;gap:9px;margin:0 0 7px;font-size:18px}.belief-item p{margin:6px 0;line-height:1.5}
  .belief-source{font-size:12px;color:#4b5563;border-top:1px dashed #cbd5e1;margin-top:9px;padding-top:7px}
  #beliefPanel[dir="rtl"] .belief-item h3{flex-direction:row-reverse;justify-content:flex-end}
  @media (prefers-color-scheme:dark){.belief-item{background:#111827;color:#f8fafc}.belief-source{color:#cbd5e1}}
  `;document.head.appendChild(s);
}
function ensurePanel(){
  let p=document.getElementById("beliefPanel");
  if(p)return p;
  const view=document.getElementById("prayerView");if(!view)return null;
  p=document.createElement("section");p.id="beliefPanel";p.className="card quran-panel hidden";
  const list=document.getElementById("prayerList");if(list)view.insertBefore(p,list);else view.appendChild(p);
  return p;
}
let activeTopic="";
function render(topic){
  activeTopic=topic||activeTopic||"angels";
  ensureStyle();
  const p=ensurePanel();if(!p)return;
  const t=topicData(activeTopic),u=ui(),spec=SPEC[activeTopic]||SPEC.angels,l=currentLang();
  p.dir=l==="ar"?"rtl":"ltr";
  p.innerHTML=`
    <div class="belief-head"><button id="beliefBack" class="secondary" type="button">${esc(u.back)}</button><button id="beliefClose" class="secondary" type="button">${esc(u.close)}</button></div>
    <section class="belief-hero"><h2>${esc(spec.icon)} ${esc(t.title)}</h2><p>${esc(t.intro)}</p><div class="belief-notice"><strong>${esc(u.note)}:</strong> ${esc(t.note)}</div></section>
    <div class="belief-list">${spec.ids.map(id=>{
      const row=t.e?.[id]||DATA.en[activeTopic]?.e?.[id]||[id,""];
      const meta=META[id]||["📖",""];
      return `<article class="belief-item"><h3><span>${esc(meta[0])}</span><span>${esc(row[0])}</span></h3><p>${esc(row[1])}</p><div class="belief-source"><strong>📖 ${esc(u.sources)}:</strong> ${esc(meta[1])}</div></article>`;
    }).join("")}</div>`;
  p.classList.remove("hidden");
  document.getElementById("beliefBack")?.addEventListener("click",close);
  document.getElementById("beliefClose")?.addEventListener("click",close);
}
function open(topic){render(topic);document.getElementById("beliefPanel")?.scrollIntoView({behavior:"smooth",block:"start"});}
function close(){document.getElementById("beliefPanel")?.classList.add("hidden");}
function back(){const p=document.getElementById("beliefPanel");if(p&&!p.classList.contains("hidden")){close();return true;}return false;}
function reloadLanguage(){
  const p=document.getElementById("beliefPanel");
  if(activeTopic&&p&&!p.classList.contains("hidden"))render(activeTopic);
}
window.addEventListener("storage",e=>{if(e.key===LANG_KEY)reloadLanguage();});
window.DiamondBeliefs={open,close,back,reloadLanguage};
