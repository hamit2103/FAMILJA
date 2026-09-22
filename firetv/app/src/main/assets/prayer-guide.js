const PRAYER_HELP_LANG_KEY="pajaziti-language";
const PH={
sq:{
 salahTitle:"Si falet namazi", salahIntro:"5 namaze farz në ditë · 17 rekate farz. Numrat më poshtë ndjekin praktikën hanefi/Diyanet.",
 prayers:[
  ["Sabahu","2 sunet + 2 farz"],
  ["Dreka","4 sunet + 4 farz + 2 sunet"],
  ["Ikindia","4 sunet + 4 farz"],
  ["Akshami","3 farz + 2 sunet"],
  ["Jacia","4 sunet + 4 farz + 2 sunet + 3 vitr (vaxhib te hanefitë)"]
 ],
 stepsTitle:"Rendi bazë i faljes",
 steps:["Bëj nijetin dhe drejtohu nga Kibla.","Thuaj “Allahu Ekber” dhe fillo namazin në këmbë.","Në kijam lexo El-Fatiha; në rekatet ku lexohet sure shto edhe një sure/ajete.","Shko në ruku, ngrihu përsëri, pastaj bëj dy sexhde me ulje mes tyre.","Në rekatin e dytë ulu dhe lexo Ettehijjatu.","Nëse namazi ka 3 ose 4 rekate, ngrihu dhe vazhdo rekatet e mbetura.","Në uljen e fundit lexo Ettehijjatu, salavatet dhe duanë; përfundo me selam djathtas dhe majtas."],
 note:"Shënim: hollësitë e suneteve dhe vitrit mund të ndryshojnë sipas medhhebit.",
 wuduTitle:"Abdesi & Gusli", wuduIntro:"Udhëzim i shkurtër sipas praktikës hanefi.",
 wuduFardTitle:"4 farzet e abdesit", wuduFard:["Larja e fytyrës.","Larja e duarve dhe krahëve deri përfshirë bërrylat.","Mes'h mbi të paktën një të katërtën e kokës.","Larja e këmbëve deri përfshirë nyjet."],
 wuduStepsTitle:"Si merret abdesi", wuduSteps:["Bëj nijetin dhe thuaj Bismilah.","Laji duart 3 herë.","Shpëlaje gojën 3 herë.","Pastro hundën me ujë 3 herë.","Laje fytyrën 3 herë.","Laji krahët deri te bërrylat 3 herë, fillo me të djathtin.","Bëj mes'h kokën një herë dhe fshiji veshët.","Laji këmbët deri te nyjet 3 herë, fillo me të djathtën."],
 ghuslFardTitle:"3 farzet e guslit (hanefi)", ghuslFard:["Shpëlarja e plotë e gojës.","Futja e ujit në hundë.","Larja e tërë trupit pa lënë vend të thatë."],
 ghuslStepsTitle:"Si merret gusli", ghuslSteps:["Bëj nijetin dhe thuaj Bismilah.","Laji duart dhe pastro papastërtitë nga trupi.","Merr abdes si për namaz.","Hidh ujë mbi kokë dhe rrënjët e flokëve.","Laje të gjithë trupin, duke u siguruar që uji arrin kudo."],
 close:"Mbyll", back:"← Namazi", openSalah:"Hap udhëzimin →", openWudu:"Hap Abdesin & Guslin →", salahCard:"Namazet & rekatet", salahCardDesc:"Si falen 5 namazet dhe sa farz/sunet kanë.", wuduCard:"Abdesi & Gusli", wuduCardDesc:"Si merret abdesi dhe si bëhet gusli."
},
de:{
 salahTitle:"So wird das Gebet verrichtet", salahIntro:"5 Pflichtgebete pro Tag · 17 Fard-Rakʿa. Die Angaben folgen der hanafitischen/Diyanet-Praxis.",
 prayers:[["Fajr","2 Sunna + 2 Fard"],["Dhuhr","4 Sunna + 4 Fard + 2 Sunna"],["Asr","4 Sunna + 4 Fard"],["Maghrib","3 Fard + 2 Sunna"],["Isha","4 Sunna + 4 Fard + 2 Sunna + 3 Witr (bei Hanafiten wajib)"]],
 stepsTitle:"Grundablauf des Gebets", steps:["Fasse die Absicht und richte dich zur Qibla.","Beginne im Stehen mit „Allahu Akbar“.","Im Stehen Al-Fatiha lesen; wo vorgesehen zusätzlich eine Sura oder Verse.","In Ruku gehen, wieder aufrichten und danach zwei Sujud mit kurzem Sitzen dazwischen.","Nach der zweiten Rakʿa sitzen und At-Tahiyyat lesen.","Bei 3 oder 4 Rakʿa aufstehen und die übrigen Rakʿa fortsetzen.","Im letzten Sitzen At-Tahiyyat, Salawat und Dua lesen; mit Salam nach rechts und links beenden."],
 note:"Hinweis: Einzelheiten zu Sunna und Witr können je nach Rechtsschule abweichen.",
 wuduTitle:"Wudu & Ghusl", wuduIntro:"Kurzanleitung nach hanafitischer Praxis.",
 wuduFardTitle:"4 Fard des Wudu", wuduFard:["Gesicht waschen.","Arme einschließlich Ellbogen waschen.","Mindestens ein Viertel des Kopfes wischen.","Füße einschließlich Knöchel waschen."],
 wuduStepsTitle:"So macht man Wudu", wuduSteps:["Absicht fassen und Bismillah sagen.","Hände 3-mal waschen.","Mund 3-mal spülen.","Nase 3-mal mit Wasser reinigen.","Gesicht 3-mal waschen.","Arme bis zu den Ellbogen 3-mal waschen, rechts beginnen.","Kopf einmal wischen und Ohren wischen.","Füße bis zu den Knöcheln 3-mal waschen, rechts beginnen."],
 ghuslFardTitle:"3 Fard des Ghusl (hanafitisch)", ghuslFard:["Mund vollständig ausspülen.","Wasser in die Nase bringen.","Den ganzen Körper waschen, ohne eine trockene Stelle zu lassen."],
 ghuslStepsTitle:"So macht man Ghusl", ghuslSteps:["Absicht fassen und Bismillah sagen.","Hände waschen und Unreinheiten entfernen.","Wudu wie für das Gebet machen.","Wasser über Kopf und Haarwurzeln geben.","Den ganzen Körper vollständig waschen."],
 close:"Schließen",back:"← Gebet",openSalah:"Anleitung öffnen →",openWudu:"Wudu & Ghusl öffnen →",salahCard:"Gebete & Rakʿa",salahCardDesc:"Wie die 5 Gebete verrichtet werden und wie viele Fard/Sunna sie haben.",wuduCard:"Wudu & Ghusl",wuduCardDesc:"Wie man Wudu und Ghusl macht."
},
tr:{
 salahTitle:"Namaz nasıl kılınır", salahIntro:"Günde 5 farz namaz · toplam 17 farz rekât. Sayılar Hanefi/Diyanet uygulamasına göredir.",
 prayers:[["Sabah","2 sünnet + 2 farz"],["Öğle","4 sünnet + 4 farz + 2 sünnet"],["İkindi","4 sünnet + 4 farz"],["Akşam","3 farz + 2 sünnet"],["Yatsı","4 sünnet + 4 farz + 2 sünnet + 3 vitir (Hanefide vacip)"]],
 stepsTitle:"Namazın temel sırası",steps:["Niyet et ve kıbleye dön.","Ayakta “Allahu Ekber” diyerek namaza başla.","Kıyamda Fatiha oku; gerekli rekâtlarda ayrıca sure veya ayet oku.","Rükûya git, doğrul ve ardından arada oturarak iki secde yap.","İkinci rekâtta oturup Ettehiyyatü oku.","Namaz 3 veya 4 rekât ise kalkıp kalan rekâtları tamamla.","Son oturuşta Ettehiyyatü, salavatlar ve dua oku; sağa ve sola selam vererek bitir."],
 note:"Not: Sünnet ve vitir ayrıntıları mezhebe göre değişebilir.",
 wuduTitle:"Abdest & Gusül",wuduIntro:"Hanefi uygulamasına göre kısa anlatım.",
 wuduFardTitle:"Abdestin 4 farzı",wuduFard:["Yüzü yıkamak.","Kolları dirseklerle birlikte yıkamak.","Başın en az dörtte birini mesh etmek.","Ayakları topuklarla birlikte yıkamak."],
 wuduStepsTitle:"Abdest nasıl alınır",wuduSteps:["Niyet et ve Bismillah de.","Elleri 3 kez yıka.","Ağzı 3 kez çalkala.","Burnu 3 kez suyla temizle.","Yüzü 3 kez yıka.","Kolları dirseklere kadar 3 kez yıka; sağdan başla.","Başı bir kez mesh et ve kulakları sil.","Ayakları topuklara kadar 3 kez yıka; sağdan başla."],
 ghuslFardTitle:"Guslün 3 farzı (Hanefi)",ghuslFard:["Ağzı tamamen yıkamak.","Burna su vermek.","Bütün bedeni kuru yer bırakmadan yıkamak."],
 ghuslStepsTitle:"Gusül nasıl alınır",ghuslSteps:["Niyet et ve Bismillah de.","Elleri ve bedendeki necaseti temizle.","Namaz abdesti gibi abdest al.","Başa ve saç diplerine su dök.","Bütün bedeni su ulaşacak şekilde yıka."],
 close:"Kapat",back:"← Namaz",openSalah:"Anlatımı aç →",openWudu:"Abdest & Guslü aç →",salahCard:"Namazlar & rekâtlar",salahCardDesc:"5 namaz nasıl kılınır, kaç farz ve sünnet vardır.",wuduCard:"Abdest & Gusül",wuduCardDesc:"Abdest nasıl alınır ve gusül nasıl yapılır."
},
en:{
 salahTitle:"How to pray",salahIntro:"5 obligatory prayers per day · 17 fard rak'ahs. Counts follow Hanafi/Diyanet practice.",
 prayers:[["Fajr","2 Sunnah + 2 Fard"],["Dhuhr","4 Sunnah + 4 Fard + 2 Sunnah"],["Asr","4 Sunnah + 4 Fard"],["Maghrib","3 Fard + 2 Sunnah"],["Isha","4 Sunnah + 4 Fard + 2 Sunnah + 3 Witr (wajib in Hanafi)"]],
 stepsTitle:"Basic prayer sequence",steps:["Make the intention and face the Qibla.","Begin standing with “Allahu Akbar”.","While standing, recite Al-Fatiha; where required add a surah or verses.","Bow in ruku, rise, then make two sujud with a sitting between them.","After the second rak'ah sit and recite At-Tahiyyat.","For 3- or 4-rak'ah prayers, stand and complete the remaining rak'ahs.","In the final sitting recite At-Tahiyyat, salawat and dua; finish with salam to the right and left."],
 note:"Note: details of Sunnah and Witr can differ by madhhab.",
 wuduTitle:"Wudu & Ghusl",wuduIntro:"Short guide following Hanafi practice.",
 wuduFardTitle:"4 obligatory acts of Wudu",wuduFard:["Wash the face.","Wash the arms including the elbows.","Wipe at least one quarter of the head.","Wash the feet including the ankles."],
 wuduStepsTitle:"How to make Wudu",wuduSteps:["Make the intention and say Bismillah.","Wash the hands 3 times.","Rinse the mouth 3 times.","Clean the nose with water 3 times.","Wash the face 3 times.","Wash the arms to the elbows 3 times, starting with the right.","Wipe the head once and wipe the ears.","Wash the feet to the ankles 3 times, starting with the right."],
 ghuslFardTitle:"3 obligatory acts of Ghusl (Hanafi)",ghuslFard:["Rinse the mouth thoroughly.","Put water into the nose.","Wash the entire body without leaving a dry spot."],
 ghuslStepsTitle:"How to make Ghusl",ghuslSteps:["Make the intention and say Bismillah.","Wash the hands and remove impurities.","Make Wudu as for prayer.","Pour water over the head and hair roots.","Wash the entire body so water reaches everywhere."],
 close:"Close",back:"← Prayer",openSalah:"Open guide →",openWudu:"Open Wudu & Ghusl →",salahCard:"Prayers & rak'ahs",salahCardDesc:"How to pray the 5 prayers and their fard/sunnah rak'ahs.",wuduCard:"Wudu & Ghusl",wuduCardDesc:"How to make Wudu and Ghusl."
},
hr:{salahTitle:"Kako se klanja namaz",salahIntro:"5 obaveznih namaza dnevno · 17 farz rekata. Brojevi prate hanefijsku/Diyanet praksu.",prayers:[["Sabah","2 sunnet + 2 farz"],["Podne","4 sunnet + 4 farz + 2 sunnet"],["Ikindija","4 sunnet + 4 farz"],["Akšam","3 farz + 2 sunnet"],["Jacija","4 sunnet + 4 farz + 2 sunnet + 3 vitr (vadžib kod hanefija)"]],stepsTitle:"Osnovni redoslijed namaza",steps:["Učini nijjet i okreni se prema Kibli.","Počni stojeći riječima „Allahu Ekber“.","U kijamu prouči Fatihu; gdje je propisano dodaj suru ili ajete.","Idi na ruku, ispravi se, zatim učini dvije sedžde sa sjedenjem između.","Nakon drugog rekata sjedi i prouči Ettehijjatu.","Kod 3 ili 4 rekata ustani i dovrši preostale rekate.","Na zadnjem sjedenju prouči Ettehijjatu, salavate i dovu; završi selamom desno i lijevo."],note:"Napomena: detalji sunneta i vitra mogu se razlikovati prema mezhebu.",wuduTitle:"Abdest & Gusul",wuduIntro:"Kratke upute prema hanefijskoj praksi.",wuduFardTitle:"4 farza abdesta",wuduFard:["Oprati lice.","Oprati ruke s laktovima.","Potrti najmanje četvrtinu glave.","Oprati noge s člancima."],wuduStepsTitle:"Kako uzeti abdest",wuduSteps:["Učini nijjet i reci Bismillah.","Operi šake 3 puta.","Isperi usta 3 puta.","Očisti nos vodom 3 puta.","Operi lice 3 puta.","Operi ruke do laktova 3 puta, počevši desnom.","Potri glavu jednom i uši.","Operi noge do članaka 3 puta, počevši desnom."],ghuslFardTitle:"3 farza gusula (hanefi)",ghuslFard:["Temeljito isprati usta.","Uvući vodu u nos.","Oprati cijelo tijelo bez suhog mjesta."],ghuslStepsTitle:"Kako uzeti gusul",ghuslSteps:["Učini nijjet i reci Bismillah.","Operi ruke i ukloni nečistoću.","Uzmi abdest kao za namaz.","Polij vodu po glavi i korijenu kose.","Operi cijelo tijelo da voda dođe svuda."],close:"Zatvori",back:"← Namaz",openSalah:"Otvori upute →",openWudu:"Otvori Abdest & Gusul →",salahCard:"Namazi & rekati",salahCardDesc:"Kako se klanja 5 namaza i koliko imaju farza/sunneta.",wuduCard:"Abdest & Gusul",wuduCardDesc:"Kako uzeti abdest i gusul."},
it:{salahTitle:"Come si esegue la preghiera",salahIntro:"5 preghiere obbligatorie al giorno · 17 rakaʿat fard. Conteggio secondo la pratica hanafita/Diyanet.",prayers:[["Fajr","2 Sunna + 2 Fard"],["Dhuhr","4 Sunna + 4 Fard + 2 Sunna"],["Asr","4 Sunna + 4 Fard"],["Maghrib","3 Fard + 2 Sunna"],["Isha","4 Sunna + 4 Fard + 2 Sunna + 3 Witr (wajib hanafita)"]],stepsTitle:"Sequenza di base",steps:["Fai l'intenzione e rivolgiti verso la Qibla.","Inizia in piedi con «Allahu Akbar».","In piedi recita Al-Fatiha; dove previsto aggiungi una sura o versetti.","Vai in ruku, rialzati, poi fai due sujud con una seduta tra i due.","Dopo la seconda rakaʿa siediti e recita At-Tahiyyat.","Per preghiere di 3 o 4 rakaʿat alzati e completa quelle restanti.","Nell'ultima seduta recita At-Tahiyyat, salawat e dua; termina con salam a destra e sinistra."],note:"Nota: i dettagli di Sunna e Witr possono variare secondo la scuola giuridica.",wuduTitle:"Wudu & Ghusl",wuduIntro:"Guida breve secondo la pratica hanafita.",wuduFardTitle:"4 obblighi del Wudu",wuduFard:["Lavare il viso.","Lavare le braccia inclusi i gomiti.","Passare la mano bagnata su almeno un quarto della testa.","Lavare i piedi incluse le caviglie."],wuduStepsTitle:"Come fare Wudu",wuduSteps:["Fai l'intenzione e dì Bismillah.","Lava le mani 3 volte.","Sciacqua la bocca 3 volte.","Pulisci il naso con acqua 3 volte.","Lava il viso 3 volte.","Lava le braccia fino ai gomiti 3 volte, iniziando dalla destra.","Passa la mano sulla testa una volta e pulisci le orecchie.","Lava i piedi fino alle caviglie 3 volte, iniziando dal destro."],ghuslFardTitle:"3 obblighi del Ghusl (hanafita)",ghuslFard:["Sciacquare completamente la bocca.","Far entrare acqua nel naso.","Lavare tutto il corpo senza lasciare zone asciutte."],ghuslStepsTitle:"Come fare Ghusl",ghuslSteps:["Fai l'intenzione e dì Bismillah.","Lava le mani e rimuovi le impurità.","Fai Wudu come per la preghiera.","Versa acqua sulla testa e sulle radici dei capelli.","Lava tutto il corpo facendo arrivare l'acqua ovunque."],close:"Chiudi",back:"← Preghiera",openSalah:"Apri guida →",openWudu:"Apri Wudu & Ghusl →",salahCard:"Preghiere & rakaʿat",salahCardDesc:"Come eseguire le 5 preghiere e quante rakaʿat fard/sunna hanno.",wuduCard:"Wudu & Ghusl",wuduCardDesc:"Come fare Wudu e Ghusl."},
fr:{salahTitle:"Comment faire la prière",salahIntro:"5 prières obligatoires par jour · 17 rakʿat fard. Comptage selon la pratique hanafite/Diyanet.",prayers:[["Fajr","2 Sunna + 2 Fard"],["Dhuhr","4 Sunna + 4 Fard + 2 Sunna"],["Asr","4 Sunna + 4 Fard"],["Maghrib","3 Fard + 2 Sunna"],["Isha","4 Sunna + 4 Fard + 2 Sunna + 3 Witr (wajib hanafite)"]],stepsTitle:"Ordre de base de la prière",steps:["Forme l'intention et tourne-toi vers la Qibla.","Commence debout par « Allahu Akbar ».","Debout, récite Al-Fatiha ; lorsque requis ajoute une sourate ou des versets.","Fais le ruku, redresse-toi, puis deux sujud avec une assise entre eux.","Après la deuxième rakʿa, assieds-toi et récite At-Tahiyyat.","Pour 3 ou 4 rakʿat, relève-toi et complète les rakʿat restantes.","À la dernière assise récite At-Tahiyyat, les salawat et une dua ; termine par le salam à droite et à gauche."],note:"Remarque : les détails de la Sunna et du Witr peuvent varier selon l'école juridique.",wuduTitle:"Wudu & Ghusl",wuduIntro:"Guide court selon la pratique hanafite.",wuduFardTitle:"4 obligations du Wudu",wuduFard:["Laver le visage.","Laver les bras avec les coudes.","Essuyer au moins un quart de la tête.","Laver les pieds avec les chevilles."],wuduStepsTitle:"Comment faire le Wudu",wuduSteps:["Forme l'intention et dis Bismillah.","Lave les mains 3 fois.","Rince la bouche 3 fois.","Nettoie le nez avec de l'eau 3 fois.","Lave le visage 3 fois.","Lave les bras jusqu'aux coudes 3 fois, en commençant par le droit.","Essuie la tête une fois et les oreilles.","Lave les pieds jusqu'aux chevilles 3 fois, en commençant par le droit."],ghuslFardTitle:"3 obligations du Ghusl (hanafite)",ghuslFard:["Rincer complètement la bouche.","Faire entrer de l'eau dans le nez.","Laver tout le corps sans laisser de zone sèche."],ghuslStepsTitle:"Comment faire le Ghusl",ghuslSteps:["Forme l'intention et dis Bismillah.","Lave les mains et enlève les impuretés.","Fais le Wudu comme pour la prière.","Verse de l'eau sur la tête et les racines des cheveux.","Lave tout le corps afin que l'eau atteigne partout."],close:"Fermer",back:"← Prière",openSalah:"Ouvrir le guide →",openWudu:"Ouvrir Wudu & Ghusl →",salahCard:"Prières & rakʿat",salahCardDesc:"Comment accomplir les 5 prières et leurs rakʿat fard/sunna.",wuduCard:"Wudu & Ghusl",wuduCardDesc:"Comment faire le Wudu et le Ghusl."},
ar:{salahTitle:"كيفية أداء الصلاة",salahIntro:"خمس صلوات مفروضة يومياً · 17 ركعة فرض. الأعداد وفق المذهب الحنفي/ممارسة ديانت.",prayers:[["الفجر","2 سنة + 2 فرض"],["الظهر","4 سنة + 4 فرض + 2 سنة"],["العصر","4 سنة + 4 فرض"],["المغرب","3 فرض + 2 سنة"],["العشاء","4 سنة + 4 فرض + 2 سنة + 3 وتر (واجب عند الحنفية)"]],stepsTitle:"الترتيب الأساسي للصلاة",steps:["انوِ الصلاة واستقبل القبلة.","ابدأ قائماً بقول «الله أكبر».","في القيام اقرأ الفاتحة، وفي المواضع المطلوبة أضف سورة أو آيات.","اركع ثم اعتدل ثم اسجد سجدتين مع الجلوس بينهما.","بعد الركعة الثانية اجلس واقرأ التشهد.","إذا كانت الصلاة 3 أو 4 ركعات فقم وأكمل الركعات الباقية.","في الجلسة الأخيرة اقرأ التشهد والصلاة على النبي والدعاء، ثم سلّم يميناً ويساراً."],note:"ملاحظة: تفاصيل السنن والوتر قد تختلف باختلاف المذهب.",wuduTitle:"الوضوء والغسل",wuduIntro:"دليل مختصر وفق المذهب الحنفي.",wuduFardTitle:"فروض الوضوء الأربعة",wuduFard:["غسل الوجه.","غسل اليدين والذراعين مع المرفقين.","مسح ربع الرأس على الأقل.","غسل القدمين مع الكعبين."],wuduStepsTitle:"كيفية الوضوء",wuduSteps:["انوِ وقل بسم الله.","اغسل اليدين 3 مرات.","تمضمض 3 مرات.","استنشق الماء ونظف الأنف 3 مرات.","اغسل الوجه 3 مرات.","اغسل الذراعين إلى المرفقين 3 مرات وابدأ باليمين.","امسح الرأس مرة وامسح الأذنين.","اغسل القدمين إلى الكعبين 3 مرات وابدأ باليمين."],ghuslFardTitle:"فروض الغسل الثلاثة (حنفي)",ghuslFard:["مضمضة الفم جيداً.","إيصال الماء إلى الأنف.","غسل جميع الجسد دون ترك موضع جاف."],ghuslStepsTitle:"كيفية الغسل",ghuslSteps:["انوِ وقل بسم الله.","اغسل اليدين وأزل النجاسة.","توضأ وضوء الصلاة.","صب الماء على الرأس وأصول الشعر.","اغسل جميع الجسد حتى يصل الماء إلى كل مكان."],close:"إغلاق",back:"الصلاة →",openSalah:"افتح الدليل ←",openWudu:"افتح الوضوء والغسل ←",salahCard:"الصلوات والركعات",salahCardDesc:"كيفية أداء الصلوات الخمس وعدد ركعات الفرض والسنة.",wuduCard:"الوضوء والغسل",wuduCardDesc:"كيفية الوضوء وكيفية الغسل."}
};

let helpMode=null;
function phLang(){const l=localStorage.getItem(PRAYER_HELP_LANG_KEY)||"sq";return PH[l]?l:"en";}
function ph(){return PH[phLang()]||PH.en;}
function listHtml(items,ordered=true){const tag=ordered?"ol":"ul";return "<"+tag+" class='prayer-guide-list'>"+items.map(x=>"<li>"+x+"</li>").join("")+"</"+tag+">";}

function updateCards(){
 const t=ph();
 const sTitle=document.getElementById("prayerGuideCardTitle");
 const sDesc=document.getElementById("prayerGuideCardDesc");
 const sOpen=document.getElementById("prayerGuideCardOpen");
 const wTitle=document.getElementById("wuduGuideCardTitle");
 const wDesc=document.getElementById("wuduGuideCardDesc");
 const wOpen=document.getElementById("wuduGuideCardOpen");
 if(sTitle)sTitle.textContent=t.salahCard;if(sDesc)sDesc.textContent=t.salahCardDesc;if(sOpen)sOpen.textContent=t.openSalah;
 if(wTitle)wTitle.textContent=t.wuduCard;if(wDesc)wDesc.textContent=t.wuduCardDesc;if(wOpen)wOpen.textContent=t.openWudu;
}

function renderHelp(){
 const panel=document.getElementById("prayerHelpPanel"); if(!panel||!helpMode)return;
 const t=ph();
 if(helpMode==="salah"){
   panel.innerHTML=`<div class="prayer-guide-head"><button id="prayerHelpBack" class="secondary" type="button">${t.back}</button><button id="prayerHelpClose" class="secondary" type="button">${t.close}</button></div>
   <h2>🕌 ${t.salahTitle}</h2><p class="muted">${t.salahIntro}</p>
   <div class="prayer-rakat-grid">${t.prayers.map(x=>`<div class="prayer-rakat-row"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("")}</div>
   <h3>${t.stepsTitle}</h3>${listHtml(t.steps,true)}<p class="muted small">${t.note}</p>`;
 }else{
   panel.innerHTML=`<div class="prayer-guide-head"><button id="prayerHelpBack" class="secondary" type="button">${t.back}</button><button id="prayerHelpClose" class="secondary" type="button">${t.close}</button></div>
   <h2>💧 ${t.wuduTitle}</h2><p class="muted">${t.wuduIntro}</p>
   <h3>${t.wuduFardTitle}</h3>${listHtml(t.wuduFard,false)}
   <h3>${t.wuduStepsTitle}</h3>${listHtml(t.wuduSteps,true)}
   <h3>${t.ghuslFardTitle}</h3>${listHtml(t.ghuslFard,false)}
   <h3>${t.ghuslStepsTitle}</h3>${listHtml(t.ghuslSteps,true)}`;
 }
 panel.classList.remove("hidden");
 document.getElementById("prayerGuideCard")?.classList.add("prayer-help-open");
 document.getElementById("wuduGuideCard")?.classList.add("prayer-help-open");
 document.getElementById("prayerHelpBack")?.addEventListener("click",closeHelp);
 document.getElementById("prayerHelpClose")?.addEventListener("click",closeHelp);
 panel.scrollIntoView({behavior:"smooth",block:"start"});
}
function openHelp(mode){helpMode=mode;renderHelp();}
function closeHelp(){const panel=document.getElementById("prayerHelpPanel");if(panel)panel.classList.add("hidden");helpMode=null;}
function back(){if(helpMode){closeHelp();return true;}return false;}
function reloadLanguage(){updateCards();if(helpMode)renderHelp();}

document.getElementById("prayerGuideCard")?.addEventListener("click",()=>openHelp("salah"));
document.getElementById("wuduGuideCard")?.addEventListener("click",()=>openHelp("wudu"));
updateCards();
window.DiamondPrayerGuide={open:openHelp,close:closeHelp,back,reloadLanguage};
