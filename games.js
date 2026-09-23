import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const GAMES_ADMIN_ONLY = document.querySelector('meta[name="diamond-mode"]')?.content === "admin";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: GAMES_ADMIN_ONLY ? "diamond-admin-auth" : "diamond-family-auth"
  }
});

const root = document.getElementById("gamesRoot");
const tabLabel = document.getElementById("gamesTabLabel");
const DEVICE_KEY = "pajaziti-presence-device";
const LANG_KEY = "pajaziti-language";
const TIMER_NAME_KEY = "pajaziti-timer-name";
const TIMER_SOUND_KEY = "pajaziti-timer-sound";
const TETRIS_NAME_KEY = "pajaziti-tetris-name";
const TETRIS_SOUND_KEY = "pajaziti-tetris-sound";
const WAR_SOUND_KEY = "pajaziti-war-sound";
const WAR_WINS_KEY = "pajaziti-war-wins";
const WAR_GAMES_KEY = "pajaziti-war-games";
const WAR_BONUS_HEARTS_KEY = "pajaziti-war-bonus-hearts";
const WAR_NAME_KEY = "pajaziti-war-name";
const ADMIN_EMAIL = "admin@familja.local";
const GAME_ORDER_SETTING_KEY = "game_order";
const DEFAULT_GAME_ORDER = ["chess","morris","timer","tetris","war"];
let gameOrder = [...DEFAULT_GAME_ORDER];
let gamesAdmin = false;

let deviceId = localStorage.getItem(DEVICE_KEY);
if (!deviceId) {
  deviceId = globalThis.crypto?.randomUUID?.() || ("device_" + Date.now() + Math.random().toString(36).slice(2));
  localStorage.setItem(DEVICE_KEY, deviceId);
}

const TXT = {
  sq:{games:"Lojëra",online:"Luaj online",computer:"Luaj me kompjuter",computerName:"Kompjuteri",computerThinking:"Kompjuteri po mendon…",newGame:"Lojë e re",chess:"Shah",morris:"Degërxhik",timer:"Kral i Sekondave",tetris:"Blloqe",war:"Luftra",choose:"Zgjidh lojën",playerName:"Emri yt",needName:"Shkruaj emrin tënd.",needPlayers:"Duhet të jenë së paku 2 lojtarë.",ready:"Bëhu gati…",hiddenTime:"Sekondat janë të fshehura",stop:"STOP",stopped:"E ndale! Prit lojtarët e tjerë…",round:"Raundi",startRound:"Fillo raundin",eliminated:"u eliminua",king:"Kral i lojës",power:"Fuqi",weekly:"Renditja javore",lastChampion:"Kampioni i javës së kaluar",wins:"Fitore",players:"Lojtarë",maxPlayers:"2–8 lojtarë",roomLocked:"Loja ka filluar; nuk mund të hyjnë lojtarë të rinj.",youEliminated:"Je eliminuar. Shiko deri në fund.",backGames:"Kthehu te lojërat",soloTimer:"🤖 Luaj vetë",practiceOnly:"Stërvitje kundër kompjuterit — nuk hyn në renditjen javore.",you:"Ti",opponents:"Kundërshtarët",active:"Në lojë",soundOn:"🔊 Zëri ON",soundOff:"🔇 Zëri OFF",create:"Krijo dhomë",code:"Kodi i dhomës",join:"Hyr në dhomë",waiting:"Duke pritur lojtarin e dytë…",yourTurn:"Radha jote",opponentTurn:"Radha e kundërshtarit",white:"Bardhë",black:"Zi",leave:"Dil nga loja",room:"Dhoma",copy:"Kopjo kodin",copied:"Kodi u kopjua",invalid:"Kodi nuk u gjet.",full:"Dhoma është e mbushur.",gameOver:"Loja përfundoi",winner:"Fituesi",helpChess:"Prek figurën tënde, pastaj katrorin ku dëshiron ta lëvizësh.",helpMorris:"Në fillim vendos 9 gurët. Kur krijon treshe, hiq një gur të kundërshtarit.",error:"Gabim"},
  de:{games:"Spiele",online:"Online spielen",computer:"Gegen Computer",computerName:"Computer",computerThinking:"Computer denkt…",newGame:"Neues Spiel",chess:"Schach",morris:"Degërxhik",timer:"Sekundenkönig",tetris:"Blloqe",war:"Krieg",choose:"Spiel wählen",playerName:"Dein Name",needName:"Gib deinen Namen ein.",needPlayers:"Mindestens 2 Spieler sind nötig.",ready:"Mach dich bereit…",hiddenTime:"Die Sekunden sind verborgen",stop:"STOP",stopped:"Gestoppt! Warte auf die anderen…",round:"Runde",startRound:"Runde starten",eliminated:"ist ausgeschieden",king:"König des Spiels",power:"Stärke",weekly:"Wochenrangliste",lastChampion:"Champion der letzten Woche",wins:"Siege",players:"Spieler",maxPlayers:"2–8 Spieler",roomLocked:"Das Spiel hat begonnen; neue Spieler können nicht mehr beitreten.",youEliminated:"Du bist ausgeschieden. Schau bis zum Ende zu.",backGames:"Zurück zu den Spielen",soloTimer:"🤖 Alleine spielen",practiceOnly:"Training gegen den Computer — zählt nicht für die Wochenrangliste.",you:"Du",opponents:"Gegner",active:"Im Spiel",soundOn:"🔊 Ton AN",soundOff:"🔇 Ton AUS",create:"Raum erstellen",code:"Raumcode",join:"Raum beitreten",waiting:"Warte auf den zweiten Spieler…",yourTurn:"Du bist am Zug",opponentTurn:"Gegner ist am Zug",white:"Weiß",black:"Schwarz",leave:"Spiel verlassen",room:"Raum",copy:"Code kopieren",copied:"Code kopiert",invalid:"Code nicht gefunden.",full:"Raum ist voll.",gameOver:"Spiel beendet",winner:"Gewinner",helpChess:"Tippe deine Figur an und danach das Zielfeld.",helpMorris:"Setze zuerst deine 9 Steine. Bei einer Dreierreihe darfst du einen gegnerischen Stein entfernen.",error:"Fehler"},
  tr:{games:"Oyunlar",online:"Çevrimiçi oyna",computer:"Bilgisayara karşı oyna",computerName:"Bilgisayar",computerThinking:"Bilgisayar düşünüyor…",newGame:"Yeni oyun",chess:"Satranç",morris:"Dokuz Taş",timer:"Saniye Kralı",tetris:"Blloqe",war:"Savaş",choose:"Oyun seç",playerName:"Adın",needName:"Adını yaz.",needPlayers:"En az 2 oyuncu gerekli.",ready:"Hazır ol…",hiddenTime:"Saniyeler gizli",stop:"STOP",stopped:"Durdurdun! Diğer oyuncuları bekle…",round:"Tur",startRound:"Turu başlat",eliminated:"elendi",king:"Oyunun kralı",power:"Güç",weekly:"Haftalık sıralama",lastChampion:"Geçen haftanın şampiyonu",wins:"Galibiyet",players:"Oyuncular",maxPlayers:"2–8 oyuncu",roomLocked:"Oyun başladı; yeni oyuncu katılamaz.",youEliminated:"Elendin. Sonuna kadar izleyebilirsin.",backGames:"Oyunlara dön",soloTimer:"🤖 Tek başına oyna",practiceOnly:"Bilgisayara karşı antrenman — haftalık sıralamaya sayılmaz.",you:"Sen",opponents:"Rakipler",active:"Oyunda",soundOn:"🔊 Ses AÇIK",soundOff:"🔇 Ses KAPALI",create:"Oda oluştur",code:"Oda kodu",join:"Odaya katıl",waiting:"İkinci oyuncu bekleniyor…",yourTurn:"Sıra sende",opponentTurn:"Sıra rakipte",white:"Beyaz",black:"Siyah",leave:"Oyundan çık",room:"Oda",copy:"Kodu kopyala",copied:"Kod kopyalandı",invalid:"Kod bulunamadı.",full:"Oda dolu.",gameOver:"Oyun bitti",winner:"Kazanan",helpChess:"Kendi taşına, sonra gitmek istediğin kareye dokun.",helpMorris:"Önce 9 taşını yerleştir. Üçlü yaptığında rakibin bir taşını kaldırabilirsin.",error:"Hata"},
  en:{games:"Games",online:"Play online",computer:"Play vs computer",computerName:"Computer",computerThinking:"Computer is thinking…",newGame:"New game",chess:"Chess",morris:"Nine Men's Morris",timer:"King of Seconds",tetris:"Blocks",war:"War",choose:"Choose a game",playerName:"Your name",needName:"Enter your name.",needPlayers:"At least 2 players are required.",ready:"Get ready…",hiddenTime:"Seconds are hidden",stop:"STOP",stopped:"Stopped! Wait for the others…",round:"Round",startRound:"Start round",eliminated:"eliminated",king:"King of the game",power:"Power",weekly:"Weekly ranking",lastChampion:"Last week's champion",wins:"Wins",players:"Players",maxPlayers:"2–8 players",roomLocked:"The game has started; new players cannot join.",youEliminated:"You are eliminated. Watch until the end.",backGames:"Back to games",soloTimer:"🤖 Play solo",practiceOnly:"Practice vs computer — does not count in weekly ranking.",you:"You",opponents:"Opponents",active:"Active",soundOn:"🔊 Sound ON",soundOff:"🔇 Sound OFF",create:"Create room",code:"Room code",join:"Join room",waiting:"Waiting for second player…",yourTurn:"Your turn",opponentTurn:"Opponent's turn",white:"White",black:"Black",leave:"Leave game",room:"Room",copy:"Copy code",copied:"Code copied",invalid:"Room not found.",full:"Room is full.",gameOver:"Game over",winner:"Winner",helpChess:"Tap your piece, then the destination square.",helpMorris:"Place your 9 stones first. When you make a row of three, remove one opponent stone.",error:"Error"},
  it:{games:"Giochi",online:"Gioca online",computer:"Gioca contro il computer",computerName:"Computer",computerThinking:"Il computer sta pensando…",newGame:"Nuova partita",chess:"Scacchi",morris:"Mulino",timer:"Re dei secondi",tetris:"Blocchi",war:"Guerra",choose:"Scegli il gioco",playerName:"Il tuo nome",needName:"Inserisci il tuo nome.",needPlayers:"Servono almeno 2 giocatori.",ready:"Preparati…",hiddenTime:"I secondi sono nascosti",stop:"STOP",stopped:"Fermato! Attendi gli altri…",round:"Round",startRound:"Avvia round",eliminated:"eliminato",king:"Re del gioco",power:"Potenza",weekly:"Classifica settimanale",lastChampion:"Campione della scorsa settimana",wins:"Vittorie",players:"Giocatori",maxPlayers:"2–8 giocatori",roomLocked:"La partita è iniziata; non possono entrare nuovi giocatori.",youEliminated:"Sei eliminato. Guarda fino alla fine.",backGames:"Torna ai giochi",soloTimer:"🤖 Gioca da solo",practiceOnly:"Allenamento contro il computer — non conta nella classifica.",you:"Tu",opponents:"Avversari",active:"In gioco",soundOn:"🔊 Audio ON",soundOff:"🔇 Audio OFF",create:"Crea stanza",code:"Codice stanza",join:"Entra",waiting:"In attesa del secondo giocatore…",yourTurn:"Il tuo turno",opponentTurn:"Turno avversario",white:"Bianco",black:"Nero",leave:"Esci dal gioco",room:"Stanza",copy:"Copia codice",copied:"Codice copiato",invalid:"Stanza non trovata.",full:"Stanza piena.",gameOver:"Partita finita",winner:"Vincitore",helpChess:"Tocca il tuo pezzo, poi la casella di destinazione.",helpMorris:"Posiziona prima 9 pedine. Quando crei una fila di tre, rimuovi una pedina avversaria.",error:"Errore"},
  hr:{games:"Igre",online:"Igraj online",computer:"Igraj protiv računala",computerName:"Računalo",computerThinking:"Računalo razmišlja…",newGame:"Nova igra",chess:"Šah",morris:"Mlin",timer:"Kralj sekundi",tetris:"Blokovi",war:"Rat",choose:"Odaberi igru",playerName:"Tvoje ime",needName:"Unesi svoje ime.",needPlayers:"Potrebna su najmanje 2 igrača.",ready:"Pripremi se…",hiddenTime:"Sekunde su skrivene",stop:"STOP",stopped:"Zaustavljeno! Pričekaj ostale…",round:"Runda",startRound:"Pokreni rundu",eliminated:"eliminiran",king:"Kralj igre",power:"Snaga",weekly:"Tjedna ljestvica",lastChampion:"Prošlotjedni prvak",wins:"Pobjede",players:"Igrači",maxPlayers:"2–8 igrača",roomLocked:"Igra je počela; novi igrači se ne mogu pridružiti.",youEliminated:"Eliminiran si. Gledaj do kraja.",backGames:"Natrag na igre",soloTimer:"🤖 Igraj sam",practiceOnly:"Vježba protiv računala — ne računa se u tjednu ljestvicu.",you:"Ti",opponents:"Protivnici",active:"U igri",soundOn:"🔊 Zvuk UKLJ",soundOff:"🔇 Zvuk ISKLJ",create:"Stvori sobu",code:"Kod sobe",join:"Uđi",waiting:"Čeka se drugi igrač…",yourTurn:"Tvoj potez",opponentTurn:"Potez protivnika",white:"Bijeli",black:"Crni",leave:"Napusti igru",room:"Soba",copy:"Kopiraj kod",copied:"Kod kopiran",invalid:"Soba nije pronađena.",full:"Soba je puna.",gameOver:"Igra završena",winner:"Pobjednik",helpChess:"Dodirni svoju figuru, zatim odredišno polje.",helpMorris:"Prvo postavi 9 kamenčića. Kad napraviš niz od tri, ukloni protivnički.",error:"Greška"},
  ar:{games:"الألعاب",online:"العب عبر الإنترنت",computer:"العب ضد الكمبيوتر",computerName:"الكمبيوتر",computerThinking:"الكمبيوتر يفكر…",newGame:"لعبة جديدة",chess:"الشطرنج",morris:"الطاحونة",timer:"ملك الثواني",tetris:"الكتل",war:"الحرب",choose:"اختر اللعبة",playerName:"اسمك",needName:"اكتب اسمك.",needPlayers:"يلزم لاعبان على الأقل.",ready:"استعد…",hiddenTime:"الثواني مخفية",stop:"إيقاف",stopped:"توقفت! انتظر الآخرين…",round:"الجولة",startRound:"ابدأ الجولة",eliminated:"تم إقصاؤه",king:"ملك اللعبة",power:"القوة",weekly:"الترتيب الأسبوعي",lastChampion:"بطل الأسبوع الماضي",wins:"انتصارات",players:"اللاعبون",maxPlayers:"2–8 لاعبين",roomLocked:"بدأت اللعبة؛ لا يمكن للاعبين جدد الانضمام.",youEliminated:"تم إقصاؤك. شاهد حتى النهاية.",backGames:"العودة للألعاب",soloTimer:"🤖 العب وحدك",practiceOnly:"تدريب ضد الكمبيوتر — لا يحتسب في الترتيب الأسبوعي.",you:"أنت",opponents:"الخصوم",active:"في اللعب",soundOn:"🔊 الصوت يعمل",soundOff:"🔇 الصوت متوقف",create:"إنشاء غرفة",code:"رمز الغرفة",join:"انضم",waiting:"بانتظار اللاعب الثاني…",yourTurn:"دورك",opponentTurn:"دور الخصم",white:"أبيض",black:"أسود",leave:"مغادرة اللعبة",room:"الغرفة",copy:"نسخ الرمز",copied:"تم النسخ",invalid:"الغرفة غير موجودة.",full:"الغرفة ممتلئة.",gameOver:"انتهت اللعبة",winner:"الفائز",helpChess:"اضغط قطعتك ثم مربع الوجهة.",helpMorris:"ضع أحجارك التسعة أولاً. عند تكوين ثلاثة في صف، أزل حجرًا للخصم.",error:"خطأ"},
  fr:{games:"Jeux",online:"Jouer en ligne",computer:"Jouer contre l'ordinateur",computerName:"Ordinateur",computerThinking:"L'ordinateur réfléchit…",newGame:"Nouvelle partie",chess:"Échecs",morris:"Moulin",timer:"Roi des secondes",tetris:"Blocs",war:"Guerre",choose:"Choisir un jeu",playerName:"Votre nom",needName:"Entrez votre nom.",needPlayers:"Au moins 2 joueurs sont requis.",ready:"Préparez-vous…",hiddenTime:"Les secondes sont cachées",stop:"STOP",stopped:"Arrêté ! Attendez les autres…",round:"Manche",startRound:"Démarrer la manche",eliminated:"éliminé",king:"Roi du jeu",power:"Puissance",weekly:"Classement hebdomadaire",lastChampion:"Champion de la semaine dernière",wins:"Victoires",players:"Joueurs",maxPlayers:"2–8 joueurs",roomLocked:"La partie a commencé ; aucun nouveau joueur ne peut rejoindre.",youEliminated:"Vous êtes éliminé. Regardez jusqu'à la fin.",backGames:"Retour aux jeux",soloTimer:"🤖 Jouer seul",practiceOnly:"Entraînement contre l'ordinateur — ne compte pas pour le classement.",you:"Vous",opponents:"Adversaires",active:"En jeu",soundOn:"🔊 Son ON",soundOff:"🔇 Son OFF",create:"Créer une salle",code:"Code de salle",join:"Rejoindre",waiting:"En attente du deuxième joueur…",yourTurn:"À vous de jouer",opponentTurn:"Tour de l'adversaire",white:"Blanc",black:"Noir",leave:"Quitter la partie",room:"Salle",copy:"Copier le code",copied:"Code copié",invalid:"Salle introuvable.",full:"Salle pleine.",gameOver:"Partie terminée",winner:"Gagnant",helpChess:"Touchez votre pièce puis la case de destination.",helpMorris:"Placez d'abord vos 9 pions. Quand vous formez une ligne de trois, retirez un pion adverse.",error:"Erreur"}
};

function lang(){ const l=localStorage.getItem(LANG_KEY)||"sq"; return TXT[l]?l:"sq"; }
function tr(k){ return TXT[lang()][k] || TXT.sq[k] || k; }

const WAR_TXT={
  sq:{yourTurnCaps:"RADHA JOTE",opponent:"KUNDËRSHTARI",you:"TI",yourWeapons:"ARMËT E TUA",soundOn:"🔊 Zëri ON",soundOff:"🔇 Zëri OFF",changeWeapons:"🎲 Ndrysho armët",wins:"fitore",games:"lojëra",bonus:"bonus",chooseWeapon:"Zgjidh njërën nga 2 armët.",playAgain:"🔄 Luaj përsëri",weaponAttack:"Sulm",weaponBomb:"Bombë",weaponHeart:"Zemër",weaponHelicopter:"Helikopter",weaponAtom:"Atom",weaponProtect:"Mbrojtje",weaponAzrael:"Melaqja Asrail",weaponIce:"Akull",weaponDrone:"Droni",weaponFire:"Rreth i zjarrtë",twoAttacks:"2 sulme",shootAgain2:"−2 ❤️ · gjuan prapë",protect2:"mbron 2 herë",koNoDefense:"KO pa mbrojtje",nextAttack:"arma tjetër bëhet Sulm",shootAgain1:"−1 ❤️ · gjuan prapë",burnBlack:"−2 ❤️ · e bën të zi",finish:"FUND",warOnline:"Luftra Online",waitingPlayers:"Duke pritur lojtarët…",wait10:"Po presim deri në 10 sekonda që të hyjë së paku një lojtar tjetër.",noComputerNote:"Nëse askush nuk hyn, nuk luan kundër kompjuterit — del pulla “Provo përsëri”.",retry:"🔄 Provo përsëri",noPlayer:"Nuk u gjet lojtar tjetër.",noComputerSwitch:"Nuk kalon automatikisht te kompjuteri.",waitTurnCaps:"PRIT RADHËN",alive:"gjallë",players:"lojtarë",winner:"Fituesi",playOnlineAgain:"🌐 Përsëri luaj online",target:"Objektivi",tapTarget:"Prek lojtarin që dëshiron ta sulmosh.",waitYourTurn:"Prit deri sa të vijë radha jote.",eliminated:"Eliminuar",turn:"Radha",notEnough3:"Nuk ke 3 💎.",weaponsNotChanged:"Armët nuk u ndryshuan.",chooseTarget:"Zgjidh së pari cilin lojtar dëshiron ta godasësh."},
  de:{yourTurnCaps:"DU BIST DRAN",opponent:"GEGNER",you:"DU",yourWeapons:"DEINE WAFFEN",soundOn:"🔊 Ton AN",soundOff:"🔇 Ton AUS",changeWeapons:"🎲 Waffen wechseln",wins:"Siege",games:"Spiele",bonus:"Bonus",chooseWeapon:"Wähle eine deiner 2 Waffen.",playAgain:"🔄 Noch einmal spielen",weaponAttack:"Angriff",weaponBomb:"Bombe",weaponHeart:"Herz",weaponHelicopter:"Hubschrauber",weaponAtom:"Atom",weaponProtect:"Schutz",weaponAzrael:"Engel Azrael",weaponIce:"Eis",weaponDrone:"Drohne",weaponFire:"Feuerring",twoAttacks:"2 Angriffe",shootAgain2:"−2 ❤️ · nochmal schießen",protect2:"schützt 2-mal",koNoDefense:"KO ohne Schutz",nextAttack:"nächste Waffe wird Angriff",shootAgain1:"−1 ❤️ · nochmal schießen",burnBlack:"−2 ❤️ · verbrennt Gegner",finish:"ENDE",warOnline:"Krieg Online",waitingPlayers:"Warte auf Spieler…",wait10:"Wir warten bis zu 10 Sekunden auf mindestens einen weiteren Spieler.",noComputerNote:"Wenn niemand beitritt, spielst du nicht gegen den Computer — „Erneut versuchen“ erscheint.",retry:"🔄 Erneut versuchen",noPlayer:"Kein weiterer Spieler gefunden.",noComputerSwitch:"Es wird nicht automatisch auf den Computer gewechselt.",waitTurnCaps:"WARTE AUF DEINEN ZUG",alive:"am Leben",players:"Spieler",winner:"Gewinner",playOnlineAgain:"🌐 Erneut online spielen",target:"Ziel",tapTarget:"Tippe den Spieler an, den du angreifen willst.",waitYourTurn:"Warte, bis du an der Reihe bist.",eliminated:"Ausgeschieden",turn:"Zug",notEnough3:"Du hast keine 3 💎.",weaponsNotChanged:"Waffen wurden nicht geändert.",chooseTarget:"Wähle zuerst einen Spieler als Ziel."},
  tr:{yourTurnCaps:"SIRA SENDE",opponent:"RAKİP",you:"SEN",yourWeapons:"SİLAHLARIN",soundOn:"🔊 Ses AÇIK",soundOff:"🔇 Ses KAPALI",changeWeapons:"🎲 Silahları değiştir",wins:"galibiyet",games:"oyun",bonus:"bonus",chooseWeapon:"2 silahtan birini seç.",playAgain:"🔄 Tekrar oyna",weaponAttack:"Saldırı",weaponBomb:"Bomba",weaponHeart:"Kalp",weaponHelicopter:"Helikopter",weaponAtom:"Atom",weaponProtect:"Koruma",weaponAzrael:"Azrail Meleği",weaponIce:"Buz",weaponDrone:"Dron",weaponFire:"Ateş çemberi",twoAttacks:"2 saldırı",shootAgain2:"−2 ❤️ · tekrar ateş et",protect2:"2 kez korur",koNoDefense:"koruma yoksa KO",nextAttack:"sonraki silah Saldırı olur",shootAgain1:"−1 ❤️ · tekrar ateş et",burnBlack:"−2 ❤️ · rakibi yakar",finish:"BİTTİ",warOnline:"Çevrimiçi Savaş",waitingPlayers:"Oyuncular bekleniyor…",wait10:"En az bir oyuncunun daha katılması için 10 saniye bekliyoruz.",noComputerNote:"Kimse katılmazsa bilgisayara karşı başlamaz — “Tekrar dene” düğmesi çıkar.",retry:"🔄 Tekrar dene",noPlayer:"Başka oyuncu bulunamadı.",noComputerSwitch:"Otomatik olarak bilgisayara geçmez.",waitTurnCaps:"SIRANI BEKLE",alive:"hayatta",players:"oyuncu",winner:"Kazanan",playOnlineAgain:"🌐 Yeniden çevrimiçi oyna",target:"Hedef",tapTarget:"Saldırmak istediğin oyuncuya dokun.",waitYourTurn:"Sıranın gelmesini bekle.",eliminated:"Elendi",turn:"Sıra",notEnough3:"3 💎 yok.",weaponsNotChanged:"Silahlar değiştirilmedi.",chooseTarget:"Önce vurmak istediğin oyuncuyu seç."},
  en:{yourTurnCaps:"YOUR TURN",opponent:"OPPONENT",you:"YOU",yourWeapons:"YOUR WEAPONS",soundOn:"🔊 Sound ON",soundOff:"🔇 Sound OFF",changeWeapons:"🎲 Change weapons",wins:"wins",games:"games",bonus:"bonus",chooseWeapon:"Choose one of your 2 weapons.",playAgain:"🔄 Play again",weaponAttack:"Attack",weaponBomb:"Bomb",weaponHeart:"Heart",weaponHelicopter:"Helicopter",weaponAtom:"Atom",weaponProtect:"Protection",weaponAzrael:"Angel Azrael",weaponIce:"Ice",weaponDrone:"Drone",weaponFire:"Fire ring",twoAttacks:"2 attacks",shootAgain2:"−2 ❤️ · shoot again",protect2:"blocks 2 times",koNoDefense:"KO without protection",nextAttack:"next weapon becomes Attack",shootAgain1:"−1 ❤️ · shoot again",burnBlack:"−2 ❤️ · burns opponent",finish:"END",warOnline:"War Online",waitingPlayers:"Waiting for players…",wait10:"Waiting up to 10 seconds for at least one more player.",noComputerNote:"If nobody joins, you will not play the computer — “Try again” appears.",retry:"🔄 Try again",noPlayer:"No other player found.",noComputerSwitch:"It will not switch automatically to the computer.",waitTurnCaps:"WAIT FOR YOUR TURN",alive:"alive",players:"players",winner:"Winner",playOnlineAgain:"🌐 Play online again",target:"Target",tapTarget:"Tap the player you want to attack.",waitYourTurn:"Wait until it is your turn.",eliminated:"Eliminated",turn:"Turn",notEnough3:"You do not have 3 💎.",weaponsNotChanged:"Weapons were not changed.",chooseTarget:"Choose the player you want to hit first."},
  it:{yourTurnCaps:"TOCCA A TE",opponent:"AVVERSARIO",you:"TU",yourWeapons:"LE TUE ARMI",soundOn:"🔊 Audio ON",soundOff:"🔇 Audio OFF",changeWeapons:"🎲 Cambia armi",wins:"vittorie",games:"partite",bonus:"bonus",chooseWeapon:"Scegli una delle 2 armi.",playAgain:"🔄 Gioca ancora",weaponAttack:"Attacco",weaponBomb:"Bomba",weaponHeart:"Cuore",weaponHelicopter:"Elicottero",weaponAtom:"Atomica",weaponProtect:"Protezione",weaponAzrael:"Angelo Azrael",weaponIce:"Ghiaccio",weaponDrone:"Drone",weaponFire:"Cerchio di fuoco",twoAttacks:"2 attacchi",shootAgain2:"−2 ❤️ · spara di nuovo",protect2:"protegge 2 volte",koNoDefense:"KO senza protezione",nextAttack:"la prossima arma diventa Attacco",shootAgain1:"−1 ❤️ · spara di nuovo",burnBlack:"−2 ❤️ · brucia il nemico",finish:"FINE",warOnline:"Guerra Online",waitingPlayers:"In attesa dei giocatori…",wait10:"Attendiamo fino a 10 secondi per almeno un altro giocatore.",noComputerNote:"Se non entra nessuno, non giochi contro il computer — appare “Riprova”.",retry:"🔄 Riprova",noPlayer:"Nessun altro giocatore trovato.",noComputerSwitch:"Non passa automaticamente al computer.",waitTurnCaps:"ASPETTA IL TUO TURNO",alive:"vivi",players:"giocatori",winner:"Vincitore",playOnlineAgain:"🌐 Gioca di nuovo online",target:"Bersaglio",tapTarget:"Tocca il giocatore che vuoi attaccare.",waitYourTurn:"Aspetta il tuo turno.",eliminated:"Eliminato",turn:"Turno",notEnough3:"Non hai 3 💎.",weaponsNotChanged:"Le armi non sono state cambiate.",chooseTarget:"Scegli prima il giocatore da colpire."},
  hr:{yourTurnCaps:"TVOJ POTEZ",opponent:"PROTIVNIK",you:"TI",yourWeapons:"TVOJE ORUŽJE",soundOn:"🔊 Zvuk UKLJ.",soundOff:"🔇 Zvuk ISKLJ.",changeWeapons:"🎲 Promijeni oružje",wins:"pobjeda",games:"igara",bonus:"bonus",chooseWeapon:"Odaberi jedno od 2 oružja.",playAgain:"🔄 Igraj ponovno",weaponAttack:"Napad",weaponBomb:"Bomba",weaponHeart:"Srce",weaponHelicopter:"Helikopter",weaponAtom:"Atom",weaponProtect:"Zaštita",weaponAzrael:"Anđeo Azrael",weaponIce:"Led",weaponDrone:"Dron",weaponFire:"Vatreni krug",twoAttacks:"2 napada",shootAgain2:"−2 ❤️ · pucaj ponovno",protect2:"štiti 2 puta",koNoDefense:"KO bez zaštite",nextAttack:"sljedeće oružje postaje Napad",shootAgain1:"−1 ❤️ · pucaj ponovno",burnBlack:"−2 ❤️ · spaljuje protivnika",finish:"KRAJ",warOnline:"Rat Online",waitingPlayers:"Čekanje igrača…",wait10:"Čekamo do 10 sekundi da se pridruži barem još jedan igrač.",noComputerNote:"Ako se nitko ne pridruži, ne igraš protiv računala — pojavit će se “Pokušaj ponovno”.",retry:"🔄 Pokušaj ponovno",noPlayer:"Nije pronađen drugi igrač.",noComputerSwitch:"Ne prebacuje se automatski na računalo.",waitTurnCaps:"ČEKAJ SVOJ POTEZ",alive:"živih",players:"igrača",winner:"Pobjednik",playOnlineAgain:"🌐 Ponovno igraj online",target:"Meta",tapTarget:"Dodirni igrača kojeg želiš napasti.",waitYourTurn:"Čekaj svoj potez.",eliminated:"Eliminiran",turn:"Potez",notEnough3:"Nemaš 3 💎.",weaponsNotChanged:"Oružje nije promijenjeno.",chooseTarget:"Prvo odaberi igrača kojeg želiš pogoditi."},
  fr:{yourTurnCaps:"À TON TOUR",opponent:"ADVERSAIRE",you:"TOI",yourWeapons:"TES ARMES",soundOn:"🔊 Son ON",soundOff:"🔇 Son OFF",changeWeapons:"🎲 Changer les armes",wins:"victoires",games:"parties",bonus:"bonus",chooseWeapon:"Choisis une de tes 2 armes.",playAgain:"🔄 Rejouer",weaponAttack:"Attaque",weaponBomb:"Bombe",weaponHeart:"Cœur",weaponHelicopter:"Hélicoptère",weaponAtom:"Atome",weaponProtect:"Protection",weaponAzrael:"Ange Azraël",weaponIce:"Glace",weaponDrone:"Drone",weaponFire:"Cercle de feu",twoAttacks:"2 attaques",shootAgain2:"−2 ❤️ · tire encore",protect2:"protège 2 fois",koNoDefense:"KO sans protection",nextAttack:"la prochaine arme devient Attaque",shootAgain1:"−1 ❤️ · tire encore",burnBlack:"−2 ❤️ · brûle l'adversaire",finish:"FIN",warOnline:"Guerre en ligne",waitingPlayers:"En attente des joueurs…",wait10:"Nous attendons jusqu'à 10 secondes qu'un autre joueur arrive.",noComputerNote:"Si personne ne rejoint, tu ne joues pas contre l'ordinateur — « Réessayer » apparaît.",retry:"🔄 Réessayer",noPlayer:"Aucun autre joueur trouvé.",noComputerSwitch:"Pas de passage automatique à l'ordinateur.",waitTurnCaps:"ATTENDS TON TOUR",alive:"en vie",players:"joueurs",winner:"Gagnant",playOnlineAgain:"🌐 Rejouer en ligne",target:"Cible",tapTarget:"Touche le joueur que tu veux attaquer.",waitYourTurn:"Attends ton tour.",eliminated:"Éliminé",turn:"Tour",notEnough3:"Tu n'as pas 3 💎.",weaponsNotChanged:"Les armes n'ont pas été changées.",chooseTarget:"Choisis d'abord le joueur à frapper."},
  ar:{yourTurnCaps:"دورك",opponent:"الخصم",you:"أنت",yourWeapons:"أسلحتك",soundOn:"🔊 الصوت يعمل",soundOff:"🔇 الصوت متوقف",changeWeapons:"🎲 تغيير الأسلحة",wins:"انتصارات",games:"ألعاب",bonus:"إضافي",chooseWeapon:"اختر أحد السلاحين.",playAgain:"🔄 العب مرة أخرى",weaponAttack:"هجوم",weaponBomb:"قنبلة",weaponHeart:"قلب",weaponHelicopter:"مروحية",weaponAtom:"ذري",weaponProtect:"حماية",weaponAzrael:"ملك الموت عزرائيل",weaponIce:"جليد",weaponDrone:"طائرة مسيّرة",weaponFire:"حلقة نار",twoAttacks:"هجومان",shootAgain2:"−2 ❤️ · أطلق مجددًا",protect2:"يحمي مرتين",koNoDefense:"إقصاء بلا حماية",nextAttack:"السلاح التالي يصبح هجومًا",shootAgain1:"−1 ❤️ · أطلق مجددًا",burnBlack:"−2 ❤️ · يحرق الخصم",finish:"النهاية",warOnline:"الحرب أونلاين",waitingPlayers:"بانتظار اللاعبين…",wait10:"ننتظر حتى 10 ثوانٍ لانضمام لاعب آخر.",noComputerNote:"إذا لم ينضم أحد فلن تلعب ضد الكمبيوتر — سيظهر زر «حاول مجددًا».",retry:"🔄 حاول مجددًا",noPlayer:"لم يتم العثور على لاعب آخر.",noComputerSwitch:"لن يتم التحويل تلقائيًا إلى الكمبيوتر.",waitTurnCaps:"انتظر دورك",alive:"أحياء",players:"لاعبين",winner:"الفائز",playOnlineAgain:"🌐 العب أونلاين مرة أخرى",target:"الهدف",tapTarget:"اضغط على اللاعب الذي تريد مهاجمته.",waitYourTurn:"انتظر حتى يحين دورك.",eliminated:"تم الإقصاء",turn:"الدور",notEnough3:"ليس لديك 3 💎.",weaponsNotChanged:"لم يتم تغيير الأسلحة.",chooseTarget:"اختر أولًا اللاعب الذي تريد ضربه."}
};
function wtr(k){ return WAR_TXT[lang()]?.[k] || WAR_TXT.sq[k] || k; }


let selectedType="chess";
let room=null;
let channel=null;
let selected=null;
let aiTimer=null;
let timerPlayers=[];
let timerPhaseTimeout=null;
let gameAudioContext=null;
let lastTimerSoundKey="";
let timerSoundEnabled=localStorage.getItem(TIMER_SOUND_KEY)!=="off";
let tetrisSoundEnabled=localStorage.getItem(TETRIS_SOUND_KEY)!=="off";
let warSoundEnabled=localStorage.getItem(WAR_SOUND_KEY)!=="off";
let warVictoryShownKey="";

async function ensureGameAudio(){
  if(!timerSoundEnabled) return null;
  try{
    if(!gameAudioContext){
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx) return null;
      gameAudioContext=new AudioCtx();
    }
    if(gameAudioContext.state==="suspended") await gameAudioContext.resume();
    return gameAudioContext;
  }catch(_){
    return null;
  }
}

function soundTone(frequency,duration=0.12,delay=0,type="sine",gainValue=0.16){
  if(!timerSoundEnabled) return;
  ensureGameAudio().then(ctx=>{
    if(!ctx) return;
    const start=ctx.currentTime+delay;
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type=type;
    osc.frequency.setValueAtTime(frequency,start);
    gain.gain.setValueAtTime(0.0001,start);
    gain.gain.exponentialRampToValueAtTime(gainValue,start+0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start+duration+0.02);
  });
}

function playTimerSound(kind){
  if(!timerSoundEnabled) return;
  if(kind==="start"){
    soundTone(660,0.12,0);
    soundTone(880,0.18,0.14);
  }else if(kind==="stop"){
    soundTone(440,0.09,0,"square",0.10);
  }else if(kind==="win"){
    soundTone(523,0.12,0);
    soundTone(659,0.12,0.13);
    soundTone(784,0.24,0.26);
  }else if(kind==="lose"){
    soundTone(330,0.16,0);
    soundTone(220,0.30,0.17);
  }else{
    soundTone(520,0.12,0);
  }
}

function tetrisTone(frequency,duration=0.08,delay=0,type="square",gainValue=0.07){
  if(!tetrisSoundEnabled) return;
  ensureGameAudio().then(ctx=>{
    if(!ctx) return;
    const start=ctx.currentTime+delay;
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type=type;
    osc.frequency.setValueAtTime(frequency,start);
    gain.gain.setValueAtTime(0.0001,start);
    gain.gain.exponentialRampToValueAtTime(gainValue,start+0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start+duration+0.02);
  });
}

function playTetrisSound(kind){
  if(!tetrisSoundEnabled) return;
  if(kind==="move"){
    tetrisTone(180,0.035,0,"square",0.03);
  }else if(kind==="rotate"){
    tetrisTone(300,0.05,0,"square",0.04);
    tetrisTone(420,0.05,0.04,"square",0.035);
  }else if(kind==="drop"){
    tetrisTone(150,0.05,0,"sawtooth",0.05);
    tetrisTone(110,0.07,0.04,"sawtooth",0.045);
  }else if(kind==="line"){
    tetrisTone(523,0.08,0,"square",0.06);
    tetrisTone(659,0.08,0.08,"square",0.06);
    tetrisTone(784,0.12,0.16,"square",0.07);
  }else if(kind==="gameover"){
    tetrisTone(330,0.12,0,"sawtooth",0.06);
    tetrisTone(247,0.15,0.12,"sawtooth",0.06);
    tetrisTone(165,0.24,0.27,"sawtooth",0.06);
  }else if(kind==="start"){
    tetrisTone(440,0.07,0,"square",0.05);
    tetrisTone(660,0.07,0.08,"square",0.05);
    tetrisTone(880,0.12,0.16,"square",0.06);
  }
}

function setTetrisSound(enabled){
  tetrisSoundEnabled=!!enabled;
  localStorage.setItem(TETRIS_SOUND_KEY,tetrisSoundEnabled?"on":"off");
  if(tetrisSoundEnabled){
    ensureGameAudio();
    playTetrisSound("rotate");
  }
}

function setTimerSound(enabled){
  timerSoundEnabled=!!enabled;
  localStorage.setItem(TIMER_SOUND_KEY,timerSoundEnabled?"on":"off");
  if(timerSoundEnabled){
    ensureGameAudio();
    playTimerSound("stop");
  }
}

function timerInitials(name=""){
  const parts=String(name).trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return "?";
  return parts.slice(0,2).map(p=>p[0]?.toUpperCase()||"").join("");
}

function maybePlayTimerStateSound(st,started){
  if(!room || room.game_type!=="timer" || !timerSoundEnabled) return;

  let key="";
  let kind="";

  if(st.phase==="countdown" && started){
    key="start:"+room.id+":"+(st.round||0);
    kind="start";
  }else if(st.phase==="results"){
    key="result:"+room.id+":"+(st.round||0)+":"+(st.eliminated_device||"");
    kind=st.eliminated_device===deviceId?"lose":"win";
  }else if(st.phase==="finished"){
    key="finished:"+room.id+":"+(st.round||0)+":"+(st.winner_device||"");
    kind=st.winner_device===deviceId?"win":"lose";
  }

  if(key && key!==lastTimerSoundKey){
    lastTimerSoundKey=key;
    playTimerSound(kind);
  }
}

root?.addEventListener("pointerdown",(event)=>{
  if(timerSoundEnabled) ensureGameAudio();
  if(warSoundEnabled && event.target?.closest?.(".war-shell")){
    // Android/PWA: audio must be unlocked directly from a user gesture.
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(AudioCtx && !gameAudioContext) gameAudioContext=new AudioCtx();
      if(gameAudioContext?.state==="suspended") gameAudioContext.resume().catch(()=>{});
    }catch(_){}
  }
},{passive:true,capture:true});

function escapeHtml(value=""){
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

function timerName(){
  const input=document.getElementById("timerPlayerName");
  const name=(input?.value || localStorage.getItem(TIMER_NAME_KEY) || "").trim().slice(0,24);
  if(name) localStorage.setItem(TIMER_NAME_KEY,name);
  return name;
}

async function fetchRoomById(id){
  const {data,error}=await supabase.from("game_rooms").select("*").eq("id",id).single();
  if(error) throw error;
  return data;
}

async function loadTimerPlayers(){
  if(!room || room.game_type!=="timer" || room.localTimer) return;
  const {data,error}=await supabase.from("timer_players")
    .select("room_id,device_id,display_name,eliminated,stop_ms,joined_at")
    .eq("room_id",room.id)
    .order("joined_at",{ascending:true});
  if(!error) timerPlayers=data||[];
}

function timerPlayer(device){
  return timerPlayers.find(p=>p.device_id===device);
}

function timerActivePlayers(){
  return timerPlayers.filter(p=>!p.eliminated);
}

function timerMs(ms){
  return Number.isFinite(Number(ms)) ? (Number(ms)/1000).toFixed(3)+" s" : "—";
}

async function loadTimerLeaderboard(){
  const el=document.getElementById("timerLeaderboard");
  if(!el) return;
  try{
    const {data:week}=await supabase.rpc("timer_current_week_start");
    const current=String(week);
    const prevDate=new Date(current+"T00:00:00Z");
    prevDate.setUTCDate(prevDate.getUTCDate()-7);
    const previous=prevDate.toISOString().slice(0,10);

    const [{data:rows},{data:last},{data:kings}]=await Promise.all([
      supabase.from("timer_weekly_scores").select("display_name,wins,best_ms,week_start").eq("week_start",current).order("wins",{ascending:false}).order("best_ms",{ascending:true}).limit(8),
      supabase.from("timer_weekly_scores").select("display_name,wins,week_start").eq("week_start",previous).order("wins",{ascending:false}).order("best_ms",{ascending:true}).limit(1),
      supabase.from("timer_profiles").select("display_name,power,crowns").order("power",{ascending:false}).limit(3)
    ]);

    const ranking=(rows||[]).map((r,i)=>`<div class="timer-rank-row"><span>${i+1}. ${escapeHtml(r.display_name)}</span><strong>🏆 ${r.wins}</strong></div>`).join("");
    const lastChampion=last?.[0] ? `<div class="timer-champion">🏆 ${tr("lastChampion")}: <strong>${escapeHtml(last[0].display_name)}</strong></div>` : "";
    const kingRows=(kings||[]).map((r,i)=>`<div class="timer-rank-row"><span>${i===0?"👑":"⚡"} ${escapeHtml(r.display_name)}</span><strong>${tr("power")}: ${r.power}</strong></div>`).join("");

    el.innerHTML=`
      <h3>🏆 ${tr("weekly")}</h3>
      ${lastChampion}
      <div class="timer-ranking">${ranking || "—"}</div>
      <h3>👑 ${tr("king")}</h3>
      <div class="timer-ranking">${kingRows || "—"}</div>`;
  }catch(error){
    console.warn("Timer leaderboard",error);
  }
}

function roomCode(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}



let warProfile=null;
let warRenameEditing=false;
let warLeaderboardRows=[];
let warChampion=null;
let warMultiRoom=null;
let warMultiPlayers=[];
let warMultiChannel=null;
let warMultiPollTimer=null;
let warMultiSelectedTarget=null;
let warChatOpen=false;
let warChatMessages=[];
let warChatDraft="";
let warChatFocused=false;
let warChatTimer=null;
let warActiveTimer=null;
let warAdminProfiles=[];

async function loadWarProfileAndLeaderboard(){
  const info=document.getElementById("warNameInfo");
  const board=document.getElementById("warLeaderboard");
  const diamondEl=document.getElementById("warDiamonds");
  const renameBtn=document.getElementById("warRenameBtn");
  const input=document.getElementById("warPlayerName");
  try{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return;

    const {data:profile,error:profileError}=await supabase.rpc("war_get_profile",{p_device:deviceId});
    if(profileError) throw profileError;

    if(profile){
      warProfile=profile;
      localStorage.setItem(WAR_NAME_KEY,profile.display_name);
      if(input){
        input.value=profile.display_name;
        input.readOnly=!warRenameEditing;
        input.classList.toggle("war-name-locked",!warRenameEditing);
      }
      if(diamondEl) diamondEl.textContent=String(Number(profile.diamonds||0));
      if(renameBtn){
        const renameCount=Number(profile.rename_count||0);
        renameBtn.hidden=renameCount>=2;
        renameBtn.textContent=warRenameEditing ? "💾 Ruaj emrin · 25 💎" : "✏️ Ndrysho emrin · 25 💎";
      }
      if(info){
        const renameCount=Number(profile.rename_count||0);
        info.textContent=renameCount>=2
          ? "🔒 Ke përdorur 2 ndryshimet e emrit. Emri nuk mund të ndryshohet më."
          : (warRenameEditing
              ? "Shkruaje emrin e ri. Ruajtja kushton 25 💎."
              : "🔒 Emri ruhet për këtë pajisje. Mund ta ndryshosh edhe "+(2-renameCount)+" herë me 25 💎.");
      }
    }else{
      warProfile=null;
      warRenameEditing=false;
      if(input){
        input.readOnly=false;
        input.classList.remove("war-name-locked");
      }
      if(diamondEl) diamondEl.textContent="200";
      if(renameBtn) renameBtn.hidden=true;
      if(info) info.textContent="Zgjidhe emrin e parë. Emri i ri ruhet përgjithmonë; më pas ndryshimi kushton 25 💎.";
    }

    const {data:weekKey}=await supabase.rpc("war_week_key",{});
    if(!weekKey) return;

    const previous=new Date(String(weekKey)+"T00:00:00Z");
    previous.setUTCDate(previous.getUTCDate()-7);
    const prevKey=previous.toISOString().slice(0,10);

    const [{data:rows},{data:previousRows}]=await Promise.all([
      supabase.from("war_weekly_scores")
        .select("display_name,points,device_id")
        .eq("week_key",weekKey)
        .order("points",{ascending:false})
        .order("updated_at",{ascending:true})
        .limit(10),
      supabase.from("war_weekly_scores")
        .select("display_name,points")
        .eq("week_key",prevKey)
        .order("points",{ascending:false})
        .order("updated_at",{ascending:true})
        .limit(1)
    ]);

    warLeaderboardRows=rows||[];
    warChampion=previousRows?.[0]||null;

    if(board){
      board.innerHTML=`
        <h3>🏆 Renditja javore</h3>
        <div class="war-week-note">Shpërblimet: 🥇 500 💎 · 🥈 100 💎 · 🥉 50 💎</div>
        ${warChampion?`<div class="war-champion">👑 Fituesi i javës së kaluar: <strong>${escapeHtml(warChampion.display_name)}</strong> — ${warChampion.points} pikë</div>`:""}
        <div class="war-ranking">
          ${warLeaderboardRows.length?warLeaderboardRows.map((row,i)=>`
            <div class="war-rank-row">
              <span>${i+1}. ${escapeHtml(row.display_name)}</span>
              <strong>${row.points} pikë</strong>
            </div>`).join(""):'<div class="muted">Ende nuk ka fitore këtë javë.</div>'}
        </div>`;
    }
  }catch(error){
    console.warn("War profile/leaderboard",error);
    if(board) board.innerHTML='<div class="muted">Renditja javore nuk u ngarkua.</div>';
  }
}

async function saveWarProfile(){
  const input=document.getElementById("warPlayerName");
  const name=(input?.value||localStorage.getItem(WAR_NAME_KEY)||"").trim().slice(0,20);
  if(name.length<2){
    throw new Error("Emri duhet të ketë së paku 2 shkronja.");
  }
  const previousName=warProfile?.display_name||"";
  const {data,error}=await supabase.rpc("war_set_profile",{p_device:deviceId,p_name:name});
  if(error){
    const raw=String(error.message||error);
    if(raw.includes("NOT_ENOUGH_DIAMONDS")) throw new Error("Nuk ke 25 💎 për ta ndryshuar emrin.");
    if(raw.includes("RENAME_LIMIT")) throw new Error("Emrin mund ta ndryshosh maksimum 2 herë.");
    throw error;
  }
  localStorage.setItem(WAR_NAME_KEY,name);
  const {data:fresh,error:freshError}=await supabase.rpc("war_get_profile",{p_device:deviceId});
  if(!freshError && fresh) warProfile=fresh;
  else warProfile={...(warProfile||{}),...(data?.[0]||{}),display_name:name};

  if(previousName && previousName!==name) warRenameEditing=false;
  return warProfile;
}

async function awardWarWeeklyPoint(){
  try{
    const {error}=await supabase.rpc("war_award_win",{p_device:deviceId});
    if(error) throw error;
    loadWarProfileAndLeaderboard().catch(()=>{});
  }catch(error){
    console.warn("War weekly point",error);
  }
}


async function refreshWarMultiLobbyCount(){
  const el=document.getElementById("warMultiCount");
  if(!el) return;
  try{
    const {data,error}=await supabase.rpc("war_multi_lobby_count");
    if(error) throw error;
    el.textContent="👥 Në pritje: "+Math.min(8,Number(data||0))+" / 8";
  }catch(_){
    el.textContent="👥 Në pritje: — / 8";
  }
}

function clearWarMultiPolling(){
  if(warMultiPollTimer){ clearInterval(warMultiPollTimer); warMultiPollTimer=null; }
  if(warActiveTimer){ clearInterval(warActiveTimer); warActiveTimer=null; }
  if(warChatTimer){ clearInterval(warChatTimer); warChatTimer=null; }
}

async function loadWarMultiState(roomId){
  const [{data:roomData,error:roomError},{data:playersData,error:playersError}]=await Promise.all([
    supabase.from("war_multi_rooms").select("*").eq("id",roomId).single(),
    supabase.from("war_multi_players")
      .select("room_id,device_id,display_name,hp,max_hp,protect,frozen,burned,special,special2,eliminated,turn_order,last_seen_at,kicked,kicked_at")
      .eq("room_id",roomId)
      .order("turn_order",{ascending:true})
  ]);
  if(roomError) throw roomError;
  if(playersError) throw playersError;
  warMultiRoom=roomData;
  warMultiPlayers=playersData||[];
}

function warMultiMe(){
  return warMultiPlayers.find(p=>p.device_id===deviceId)||null;
}

function warMultiAliveOpponents(){
  return warMultiPlayers.filter(p=>p.device_id!==deviceId && !p.eliminated && !p.kicked && p.hp>0);
}

function warMultiPlayerCard(player){
  const isMe=player.device_id===deviceId;
  const isTurn=warMultiRoom?.turn_device===player.device_id;
  const selected=warMultiSelectedTarget===player.device_id;
  const offline=player.last_seen_at && (Date.now()-new Date(player.last_seen_at).getTime()>12000);
  return `
    <div class="war-room-player-wrap ${isMe?"me":""}">
      <button class="war-multi-player ${isMe?"me":""} ${isTurn?"turn":""} ${selected?"selected":""} ${player.eliminated?"eliminated":""} ${player.burned?"burned":""} ${offline?"offline":""}"
        type="button"
        data-war-target="${escapeHtml(player.device_id)}"
        ${isMe||player.eliminated||player.kicked?"disabled":""}>
        <span class="war-multi-name">${isMe?"🇦🇱 ":""}${escapeHtml(player.display_name)} ${isMe?"(Ti)":""}</span>
        <span class="war-multi-hearts">${warHearts(player.hp,player.max_hp)}</span>
        <span class="war-multi-status">
          ${player.kicked?"🚫 Larguar nga admini":""}
          ${player.eliminated&&!player.kicked?"☠️ "+wtr("eliminated"):""}
          ${offline&&!player.eliminated&&!player.kicked?" 🤖 AUTO":""}
          ${player.protect>0?" 🛡️×"+player.protect:""}
          ${player.frozen?" 🧊":""}
          ${player.burned?" 🔥":""}
          ${isTurn&&!player.eliminated&&!player.kicked?" 🎯 "+wtr("turn"):""}
        </span>
        <span class="war-multi-soldier ${isMe?"mine":"enemy"}" aria-hidden="true">
          <img src="./war-soldier.svg" alt="">
          <i class="war-multi-muzzle"></i>
        </span>
      </button>
      ${gamesAdmin&&!isMe&&!player.kicked?`<label class="war-admin-kick-pick"><input type="checkbox" data-war-kick-device="${escapeHtml(player.device_id)}"> Largo</label>`:""}
    </div>`;
}


function warChatIsEditing(){
  const input=document.getElementById("warChatInput");
  return !!(warChatFocused || (input && document.activeElement===input));
}

async function loadWarChat(){
  if(!warMultiRoom?.id) return;
  const {data,error}=await supabase.from("war_room_messages")
    .select("id,device_id,display_name,body,created_at")
    .eq("room_id",warMultiRoom.id)
    .order("created_at",{ascending:true})
    .limit(80);
  if(error) return;
  warChatMessages=data||[];
  const list=document.getElementById("warChatList");
  if(list){
    list.innerHTML=warChatMessages.map(m=>`<div class="war-chat-line ${m.device_id===deviceId?"mine":""}"><strong>${escapeHtml(m.display_name)}</strong><span>${escapeHtml(m.body)}</span></div>`).join("") || '<div class="muted">—</div>';
    list.scrollTop=list.scrollHeight;
  }
}

async function sendWarChat(){
  const input=document.getElementById("warChatInput");
  if(input) warChatDraft=input.value.slice(0,300);
  const body=(warChatDraft||"").trim().slice(0,300);
  if(!body||!warMultiRoom?.id) return;
  const {error}=await supabase.rpc("war_room_send_message",{p_room:warMultiRoom.id,p_device:deviceId,p_body:body});
  if(!error){
    warChatDraft="";
    warChatFocused=false;
    if(input) input.value="";
  }
  await loadWarChat();
}

function startWarChatPolling(){
  if(warChatTimer) clearInterval(warChatTimer);
  loadWarChat().catch(()=>{});
  warChatTimer=setInterval(()=>loadWarChat().catch(()=>{}),2500);
}

function startWarActivePolling(roomId){
  if(warActiveTimer) clearInterval(warActiveTimer);
  let lastSig="";
  warActiveTimer=setInterval(async()=>{
    if(!warMultiRoom?.id || warMultiRoom.id!==roomId) return;
    try{
      const {data,error}=await supabase.rpc("war_multi_poll",{p_room:roomId,p_device:deviceId});
      if(error) throw error;
      if(data?.status==="kicked"){
        clearWarMultiPolling();
        warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;
        renderLobby("🚫 Admini të largoi nga loja.");
        return;
      }
      await supabase.rpc("war_multi_autoplay",{p_room:roomId});
      await loadWarMultiState(roomId);
      const me=warMultiMe();
      if(me?.kicked){
        clearWarMultiPolling();
        warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;
        renderLobby("🚫 Admini të largoi nga loja.");
        return;
      }
      const sig=[warMultiRoom.status,warMultiRoom.turn_device,warMultiRoom.action_seq,...warMultiPlayers.map(p=>p.device_id+":"+p.hp+":"+p.eliminated+":"+p.kicked)].join("|");
      if(sig!==lastSig){
        lastSig=sig;
        if(!warChatIsEditing()) renderWarMultiGame();
      }
    }catch(error){
      console.warn("war active poll",error);
    }
  },3500);
}

async function loadWarAdminPanel(){
  const box=document.getElementById("warAdminProfiles");
  if(!gamesAdmin||!box) return;
  const {data,error}=await supabase.rpc("war_admin_list_profiles");
  if(error){box.innerHTML='<div class="muted">Nuk u ngarkuan lojtarët.</div>';return;}
  warAdminProfiles=data||[];
  box.innerHTML=warAdminProfiles.map(p=>`
    <div class="war-admin-profile-row">
      <div><strong>${escapeHtml(p.display_name)}</strong><small>💎 ${p.diamonds} · emri ${p.rename_count}/2</small></div>
      <input type="number" min="1" max="1000000" value="50" data-war-gift-amount="${escapeHtml(p.device_id)}">
      <button class="secondary" type="button" data-war-gift="${escapeHtml(p.device_id)}">🎁 Jep 💎</button>
    </div>`).join("") || '<div class="muted">Nuk ka lojtarë.</div>';
  box.querySelectorAll("[data-war-gift]").forEach(btn=>{
    btn.onclick=async()=>{
      const dev=btn.dataset.warGift;
      const input=box.querySelector('[data-war-gift-amount="'+CSS.escape(dev)+'"]');
      const amount=Math.max(1,Math.min(1000000,Number(input?.value||0)));
      btn.disabled=true;
      const {error}=await supabase.rpc("war_admin_gift_diamonds",{p_device:dev,p_amount:amount});
      btn.disabled=false;
      if(error){alert("Nuk u dërguan diamantet.");return;}
      await loadWarAdminPanel();
    };
  });
}

async function adminKickSelected(){
  if(!gamesAdmin||!warMultiRoom?.id) return;
  const devices=[...document.querySelectorAll("[data-war-kick-device]:checked")].map(x=>x.dataset.warKickDevice);
  if(!devices.length) return;
  const {error}=await supabase.rpc("war_admin_kick_players",{p_room:warMultiRoom.id,p_devices:devices});
  if(error){alert("Nuk u larguan lojtarët.");return;}
  await loadWarMultiState(warMultiRoom.id);
  renderWarMultiGame();
}

function renderWarMultiWaiting(){
  if(!warMultiRoom) return;
  const starts=new Date(warMultiRoom.starts_at).getTime();
  const sec=Math.max(0,Math.ceil((starts-Date.now())/1000));

  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-multi-waiting">
        <div class="war-topbar">
          <button id="warMultiBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>🌐 ${wtr("warOnline")}</strong>
        </div>
        <div class="war-multi-wait-card">
          <div class="war-multi-count-big">${warMultiPlayers.length} / 8</div>
          <h2>👥 ${wtr("waitingPlayers")}</h2>
          <div class="war-multi-countdown">${sec}</div>
          <p>${wtr("wait10")}</p>
          <div class="war-multi-wait-list">
            ${warMultiPlayers.map((p,i)=>`<div><strong>${i+1}. ${escapeHtml(p.display_name)}</strong></div>`).join("")}
          </div>
          <p class="muted">${wtr("noComputerNote")}</p>
        </div>
      </section>
    </div>`;

  document.getElementById("warMultiBack").onclick=()=>{
    clearWarMultiPolling();
    if(warMultiChannel){
      supabase.removeChannel(warMultiChannel);
      warMultiChannel=null;
    }
    warMultiRoom=null;
    warMultiPlayers=[];
    renderLobby();
  };
}

function renderWarMultiRetry(){
  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-multi-waiting">
        <div class="war-topbar">
          <button id="warRetryBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>🌐 ${wtr("warOnline")}</strong>
        </div>
        <div class="war-multi-wait-card war-retry-card">
          <div class="war-retry-icon">⏱️</div>
          <h2>${wtr("noPlayer")}</h2>
          <p>${wtr("noComputerSwitch")}</p>
          <button id="warRetryOnline" class="primary" type="button">${wtr("retry")}</button>
        </div>
      </section>
    </div>`;
  document.getElementById("warRetryBack").onclick=()=>renderLobby();
  document.getElementById("warRetryOnline").onclick=()=>startWarMultiSearch();
}

function renderWarMultiGame(){
  if(!warMultiRoom) return;
  const previousChatInput=document.getElementById("warChatInput");
  if(previousChatInput) warChatDraft=previousChatInput.value.slice(0,300);
  const restoreChatFocus=warChatOpen && warChatIsEditing();
  const me=warMultiMe();
  if(me?.kicked){
    clearWarMultiPolling();
    warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;
    renderLobby("🚫 Admini të largoi nga loja.");
    return;
  }
  const alive=warMultiPlayers.filter(p=>!p.eliminated&&!p.kicked&&p.hp>0);
  const myTurn=warMultiRoom.status==="active" && warMultiRoom.turn_device===deviceId && me && !me.eliminated && !me.kicked;
  const opponents=warMultiAliveOpponents();

  if(warMultiSelectedTarget && !opponents.some(p=>p.device_id===warMultiSelectedTarget)) warMultiSelectedTarget=null;
  if(!warMultiSelectedTarget && opponents.length===1) warMultiSelectedTarget=opponents[0].device_id;

  const special=me?.special||"attack";
  const special2=me?.special2||"attack";
  const enemyPlayers=warMultiPlayers.filter(p=>p.device_id!==deviceId);
  const myPlayer=warMultiPlayers.find(p=>p.device_id===deviceId)||null;

  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-multi-arena">
        <div class="war-topbar">
          <button id="warMultiBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>🌐 ${wtr("warOnline")}</strong>
          <span class="war-turn">${warMultiRoom.status==="finished"?wtr("finish"):(myTurn?wtr("yourTurnCaps"):wtr("waitTurnCaps"))}</span>
        </div>

        <div class="war-multi-summary">
          <strong>👥 ${alive.length} ${wtr("alive")} / ${warMultiPlayers.length} ${wtr("players")}</strong>
          <span>💎 ${Number(warProfile?.diamonds||0)}</span>
          <span>${escapeHtml(warMultiRoom.message||"")}</span>
        </div>

        <div class="war-shared-room war-online-shared-room">
          <div class="war-room-wall"><span>ANGEL ARENA</span></div>
          <div class="war-room-floor"></div>
          <div class="war-online-stage">
            <div class="war-online-opponents">${enemyPlayers.map(warMultiPlayerCard).join("")}</div>
            <div class="war-online-vs" aria-hidden="true"><span>VS</span></div>
            <div class="war-online-me">${myPlayer?warMultiPlayerCard(myPlayer):""}</div>
          </div>
        </div>

        <div class="war-room-tools">
          <button id="warChatToggle" class="secondary" type="button">💬 Chat ${warChatOpen?"▲":"▼"}</button>
          ${gamesAdmin?'<button id="warAdminKickBtn" class="danger" type="button">🚫 Largo të zgjedhurit</button>':""}
        </div>

        <section id="warChatPanel" class="war-chat-panel ${warChatOpen?"":"hidden"}">
          <div id="warChatList" class="war-chat-list">${warChatMessages.map(m=>`<div class="war-chat-line ${m.device_id===deviceId?"mine":""}"><strong>${escapeHtml(m.display_name)}</strong><span>${escapeHtml(m.body)}</span></div>`).join("")}</div>
          <div class="war-chat-compose">
            <input id="warChatInput" type="text" maxlength="300" autocomplete="off" enterkeyhint="send" placeholder="Shkruaj mesazh…" value="${escapeHtml(warChatDraft)}">
            <button id="warChatSend" class="primary" type="button">Dërgo</button>
          </div>
        </section>

        ${warMultiRoom.status==="finished"?`
          <div class="war-multi-winner">🏆 ${wtr("winner")}: <strong>${escapeHtml(warMultiPlayers.find(p=>p.device_id===warMultiRoom.winner_device)?.display_name||"—")}</strong></div>
          <button id="warMultiAgain" class="primary" type="button">${wtr("playOnlineAgain")}</button>
        `:`
          <div class="war-multi-target-hint">${myTurn?(warMultiSelectedTarget?"🎯 "+wtr("target")+": "+escapeHtml(warMultiPlayers.find(p=>p.device_id===warMultiSelectedTarget)?.display_name||""):"🎯 "+wtr("tapTarget")):"⏳ "+wtr("waitYourTurn")}</div>
          <div class="war-actions">${warActionCard(special)}${warActionCard(special2)}</div>
          <button id="warMultiReroll" class="secondary war-reroll" type="button" ${myTurn?"":"disabled"}>🎲 ${wtr("changeWeapons")} · 3 💎</button>
        `}
      </section>
    </div>`;

  if(warMultiRoom.status==="finished" && warMultiRoom.winner_device===deviceId){
    const winner=warMultiPlayers.find(p=>p.device_id===deviceId);
    requestAnimationFrame(()=>showWarVictoryCelebration("online-"+warMultiRoom.id+"-"+(warMultiRoom.action_seq||0),winner?.display_name||wtr("winner")));
  }

  root.querySelectorAll("[data-war-target]").forEach(btn=>{
    btn.onclick=()=>{if(!myTurn)return;warMultiSelectedTarget=btn.dataset.warTarget;renderWarMultiGame();};
  });
  root.querySelectorAll("[data-war-action]").forEach(btn=>{
    btn.disabled=!myTurn;btn.onclick=()=>warMultiDoAction(btn.dataset.warAction);
  });

  document.getElementById("warChatToggle")?.addEventListener("click",()=>{
    const current=document.getElementById("warChatInput");
    if(current) warChatDraft=current.value.slice(0,300);
    warChatOpen=!warChatOpen;
    if(!warChatOpen) warChatFocused=false;
    renderWarMultiGame();
    if(warChatOpen) loadWarChat();
  });
  document.getElementById("warChatSend")?.addEventListener("click",sendWarChat);
  const warChatInput=document.getElementById("warChatInput");
  if(warChatInput){
    warChatInput.addEventListener("input",()=>{warChatDraft=warChatInput.value.slice(0,300);});
    warChatInput.addEventListener("focus",()=>{warChatFocused=true;});
    warChatInput.addEventListener("compositionstart",()=>{warChatFocused=true;});
    warChatInput.addEventListener("compositionend",()=>{warChatDraft=warChatInput.value.slice(0,300);});
    warChatInput.addEventListener("blur",()=>{
      setTimeout(()=>{
        if(document.activeElement?.id!=="warChatInput") warChatFocused=false;
      },180);
    });
    warChatInput.addEventListener("keydown",e=>{
      if(e.key==="Enter" && !e.isComposing){
        e.preventDefault();
        sendWarChat();
      }
    });
    if(restoreChatFocus){
      requestAnimationFrame(()=>{
        const input=document.getElementById("warChatInput");
        if(!input) return;
        try{ input.focus({preventScroll:true}); }catch(_){ input.focus(); }
        const end=input.value.length;
        try{ input.setSelectionRange(end,end); }catch(_){}
      });
    }
  }
  document.getElementById("warAdminKickBtn")?.addEventListener("click",adminKickSelected);

  document.getElementById("warMultiReroll")?.addEventListener("click",async()=>{
    if(!myTurn)return;
    const btn=document.getElementById("warMultiReroll");if(btn)btn.disabled=true;
    try{
      const {data,error}=await supabase.rpc("war_multi_reroll",{p_room:warMultiRoom.id,p_device:deviceId});
      if(error)throw error;
      warProfile={...(warProfile||{}),diamonds:Number(data?.diamonds||0)};
      await loadWarMultiState(warMultiRoom.id);renderWarMultiGame();
    }catch(error){
      const raw=String(error?.message||error);
      const hint=root.querySelector(".war-multi-target-hint");
      if(hint)hint.textContent=raw.includes("NOT_ENOUGH_DIAMONDS")?"⚠️ "+wtr("notEnough3"):"⚠️ "+wtr("weaponsNotChanged");
      if(btn)btn.disabled=false;
    }
  });

  document.getElementById("warMultiBack").onclick=()=>{
    clearWarMultiPolling();
    if(warMultiChannel){supabase.removeChannel(warMultiChannel);warMultiChannel=null;}
    warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;warChatOpen=false;warChatMessages=[];warChatDraft="";warChatFocused=false;
    renderLobby();
  };
  document.getElementById("warMultiAgain")?.addEventListener("click",()=>{
    clearWarMultiPolling();
    if(warMultiChannel){supabase.removeChannel(warMultiChannel);warMultiChannel=null;}
    warMultiRoom=null;warMultiPlayers=[];warMultiSelectedTarget=null;warChatOpen=false;warChatMessages=[];warChatDraft="";warChatFocused=false;
    startWarMultiSearch();
  });
}

async function warMultiDoAction(action){
  if(!warMultiRoom || warMultiRoom.status!=="active") return;
  const me=warMultiMe();
  if(!me || me.eliminated || warMultiRoom.turn_device!==deviceId) return;

  let target=warMultiSelectedTarget;
  const opponents=warMultiAliveOpponents();

  if(!target){
    if(opponents.length===1) target=opponents[0].device_id;
    else {
      const hint=root.querySelector(".war-multi-target-hint");
      if(hint) hint.textContent="⚠️ "+wtr("chooseTarget");
      return;
    }
  }

  root.querySelectorAll("[data-war-action]").forEach(b=>b.disabled=true);
  playWarSound(warSoundForAction(action));

  try{
    const {error}=await supabase.rpc("war_multi_action",{
      p_room:warMultiRoom.id,
      p_device:deviceId,
      p_target:target,
      p_action:action
    });
    if(error) throw error;
    warMultiSelectedTarget=null;
    await loadWarMultiState(warMultiRoom.id);
    renderWarMultiGame();
  }catch(error){
    console.warn("war multi action",error);
    await loadWarMultiState(warMultiRoom.id).catch(()=>{});
    renderWarMultiGame();
  }
}

async function subscribeWarMultiRoom(roomId){
  if(warMultiChannel){
    supabase.removeChannel(warMultiChannel);
    warMultiChannel=null;
  }

  warMultiChannel=supabase.channel("war-multi-"+roomId)
    .on("postgres_changes",{
      event:"UPDATE",schema:"public",table:"war_multi_rooms",filter:"id=eq."+roomId
    },async()=>{
      await loadWarMultiState(roomId).catch(()=>{});
      if(warMultiRoom?.status==="waiting") renderWarMultiWaiting();
      else if(!warChatIsEditing()) renderWarMultiGame();
    })
    .on("postgres_changes",{
      event:"*",schema:"public",table:"war_multi_players",filter:"room_id=eq."+roomId
    },async()=>{
      await loadWarMultiState(roomId).catch(()=>{});
      if(warMultiRoom?.status==="waiting") renderWarMultiWaiting();
      else if(!warChatIsEditing()) renderWarMultiGame();
    })
    .subscribe();
}

async function startWarMultiSearch(){
  const button=document.getElementById("warMultiBtn")||document.getElementById("warRetryOnline")||document.getElementById("warMultiAgain");
  const info=document.getElementById("warNameInfo");
  if(button) button.disabled=true;

  try{
    await saveWarProfile();
    const {data:econ}=await supabase.rpc("war_get_profile",{p_device:deviceId});
    if(econ) warProfile=econ;
    const name=warProfile?.display_name||localStorage.getItem(WAR_NAME_KEY)||"User";
    const {data,error}=await supabase.rpc("war_multi_join",{
      p_device:deviceId,
      p_name:name
    });
    if(error) throw error;

    const roomId=data?.room_id;
    if(!roomId) throw new Error("ROOM_NOT_CREATED");

    await loadWarMultiState(roomId);
    await subscribeWarMultiRoom(roomId);

    clearWarMultiPolling();

    const poll=async()=>{
      if(!warMultiRoom?.id) return;
      try{
        const {data:pollData,error:pollError}=await supabase.rpc("war_multi_poll",{
          p_room:warMultiRoom.id,
          p_device:deviceId
        });
        if(pollError) throw pollError;

        if(pollData?.status==="fallback"){
          clearWarMultiPolling();
          if(warMultiChannel){
            supabase.removeChannel(warMultiChannel);
            warMultiChannel=null;
          }
          warMultiRoom=null;
          warMultiPlayers=[];
          warMultiSelectedTarget=null;
          renderWarMultiRetry();
          return;
        }

        await loadWarMultiState(roomId);
        if(warMultiRoom.status==="waiting") renderWarMultiWaiting();
        else{
          if(warMultiPollTimer){ clearInterval(warMultiPollTimer); warMultiPollTimer=null; }
          renderWarMultiGame();
          startWarActivePolling(roomId);
          startWarChatPolling();
        }
      }catch(error){
        console.warn("war multi poll",error);
      }
    };

    await poll();
    if(warMultiRoom?.status==="waiting"){
      warMultiPollTimer=setInterval(poll,1000);
    }
  }catch(error){
    console.warn("war multi join",error);
    if(info) info.textContent="Nuk u hap loja online. Provo përsëri.";
    else renderWarMultiRetry();
    if(button) button.disabled=false;
  }
}

let warGameState=null;

const WAR_SPECIALS=[
  {key:"attack",labelKey:"weaponAttack",icon:"🔫",weight:80,small:"−1 ❤️"},
  {key:"bomb",labelKey:"weaponBomb",icon:"💣",weight:28,smallKey:"twoAttacks"},
  {key:"heart",labelKey:"weaponHeart",icon:"❤️",weight:16,small:"+1 ❤️ · max 20"},
  {key:"helicopter",labelKey:"weaponHelicopter",icon:"🚁",weight:3,smallKey:"shootAgain2"},
  {key:"atom",labelKey:"weaponAtom",icon:"☢️",weight:5,small:"−3 ❤️"},
  {key:"protect",labelKey:"weaponProtect",icon:"🛡️",weight:30,smallKey:"protect2"},
  {key:"azrael",labelKey:"weaponAzrael",icon:"👼",weight:2,smallKey:"koNoDefense"},
  {key:"ice",labelKey:"weaponIce",icon:"🧊",weight:15,smallKey:"nextAttack"},
  {key:"drone",labelKey:"weaponDrone",icon:"🛸",weight:12,smallKey:"shootAgain1"},
  {key:"fire",labelKey:"weaponFire",icon:"⭕",weight:13,smallKey:"burnBlack"}
];

function warWins(){
  const value=Number(localStorage.getItem(WAR_WINS_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}

function warGames(){
  const value=Number(localStorage.getItem(WAR_GAMES_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}

function warBonusExpiries(){
  let list=[];
  try{
    const raw=JSON.parse(localStorage.getItem(WAR_BONUS_HEARTS_KEY)||"[]");
    if(Array.isArray(raw)) list=raw.map(Number).filter(Number.isFinite);
  }catch(_){}
  const now=Date.now();
  const active=list.filter(expiry=>expiry>now);
  if(active.length!==list.length){
    localStorage.setItem(WAR_BONUS_HEARTS_KEY,JSON.stringify(active));
  }
  return active;
}

function warBonusHeartCount(){
  return warBonusExpiries().length;
}

function warAdd24HourHeart(){
  const list=warBonusExpiries();
  list.push(Date.now()+24*60*60*1000);
  localStorage.setItem(WAR_BONUS_HEARTS_KEY,JSON.stringify(list));
}

function warRollSpecial(){
  const total=WAR_SPECIALS.reduce((sum,item)=>sum+item.weight,0);
  let roll=Math.random()*total;
  for(const item of WAR_SPECIALS){
    roll-=item.weight;
    if(roll<0) return item.key;
  }
  return "attack";
}

function warRollPair(){
  const first=warRollSpecial();
  let second=warRollSpecial();
  let guard=0;
  while(second===first && guard<8){
    second=warRollSpecial();
    guard++;
  }
  return [first,second];
}

function warSpecial(key){
  return WAR_SPECIALS.find(item=>item.key===key)||WAR_SPECIALS[0];
}

function warInitialState(){
  const bonus=warBonusHeartCount();
  const maxHp=Math.min(20,5+bonus);
  const playerName=warProfile?.display_name||localStorage.getItem(WAR_NAME_KEY)||tr("you");
  const playerWeapons=warRollPair();
  const enemyWeapons=warRollPair();
  return {
    player:{name:playerName,hp:maxHp,maxHp,protect:0,frozen:false,burned:false,special:playerWeapons[0],special2:playerWeapons[1]},
    enemy:{name:tr("computerName"),hp:5,maxHp:5,protect:0,frozen:false,burned:false,special:enemyWeapons[0],special2:enemyWeapons[1]},
    turn:"player",
    over:false,
    gameCounted:false,
    serverRewardRecorded:false,
    rerollUsedThisTurn:false,
    message:bonus>0
      ? "Ke "+bonus+" zemër bonus aktive për 24 orë."
      : "Zgjidh njërën nga 2 armët."
  };
}

function warHearts(current,max=5){
  const full=Math.max(0,Math.min(max,Math.round(current)));
  return Array.from({length:max},(_,i)=>
    `<span class="war-heart ${i<full?"full":"empty"}" aria-hidden="true">${i<full?"❤️":"🖤"}</span>`
  ).join("");
}

function warBlockWeapon(target){
  if((target.protect||0)<=0) return false;
  target.protect=Math.max(0,target.protect-1);
  return true;
}

function warDamage(target,hearts,{bypassProtection=false}={}){
  if(!bypassProtection && warBlockWeapon(target)){
    return {damage:0,blocked:true};
  }
  const damage=Math.max(0,Math.min(target.hp,Math.round(hearts)));
  target.hp=Math.max(0,target.hp-damage);
  return {damage,blocked:false};
}

function warBombDamage(target){
  let total=0;
  let blocked=0;
  for(let i=0;i<2;i++){
    const hit=warDamage(target,1);
    if(hit.blocked) blocked++;
    total+=hit.damage;
    if(target.hp<=0) break;
  }
  return {damage:total,blocked};
}

function warRecordCompletedGame(won){
  const s=warGameState;
  if(!s || s.gameCounted) return {games:warGames(),bonusAdded:false};
  s.gameCounted=true;

  const games=warGames()+1;
  localStorage.setItem(WAR_GAMES_KEY,String(games));

  if(won){
    localStorage.setItem(WAR_WINS_KEY,String(warWins()+1));
  }

  let bonusAdded=false;
  if(games%20===0){
    warAdd24HourHeart();
    bonusAdded=true;
  }
  return {games,bonusAdded};
}

function warActionCard(action){
  const item=warSpecial(action);
  return `<button data-war-action="${item.key}" type="button"><span class="war-action-icon" aria-hidden="true">${item.icon}</span><strong>${wtr(item.labelKey)}</strong><small>${item.smallKey?wtr(item.smallKey):item.small}</small></button>`;
}

function renderWarGame(){
  if(!warGameState) warGameState=warInitialState();
  const s=warGameState;
  const p=s.player;
  const e=s.enemy;
  const games=warGames();
  const wins=warWins();
  const activeBonus=warBonusHeartCount();

  const soldierMarkup=()=>`
    <span class="war-soldier-figure" aria-hidden="true">
      <img class="war-soldier-art" src="./war-soldier.svg" alt="">
    </span>`;

  root.innerHTML=`
    <div class="war-shell">
      <section class="war-arena war-arena-new">
        <div class="war-topbar">
          <button id="warBack" class="war-exit" type="button">← ${tr("backGames")}</button>
          <strong>⚔️ ${tr("war")}</strong>
          <span class="war-turn">${s.over?wtr("finish"):(s.turn==="player"?wtr("yourTurnCaps"):wtr("opponent"))}</span>
          <button id="warSoundToggle" class="war-sound-toggle" type="button">${warSoundEnabled?wtr("soundOn"):wtr("soundOff")}</button>
          <span id="warAudioStatus" class="war-audio-status"></span>
        </div>

        <div id="warBattleScene" class="war-battle-scene war-battle-scene-new">
          <div class="war-combatant war-combatant-enemy ${e.burned?"burned":""}">
            <div class="war-combatant-info">
              <span class="war-side-label">${wtr("opponent")}</span>
              <strong class="war-combatant-name">🤖 ${escapeHtml(e.name)}</strong>
              <div class="war-hearts war-compact-hearts" aria-label="${e.hp} zemra">${warHearts(e.hp,e.maxHp)}</div>
              <div class="war-status-icons war-status-compact">
                ${e.protect>0?`<span>🛡️×${e.protect}</span>`:""}
                ${e.frozen?"<span>🧊</span>":""}
                ${e.burned?"<span>🔥</span>":""}
              </div>
            </div>
            <div class="war-shooter war-shooter-enemy">
              ${soldierMarkup()}
            </div>
          </div>

          <div class="war-shot-lane">
            <span id="warProjectile" class="war-projectile">•</span>
            <span id="warExplosion" class="war-explosion">💥</span>
          </div>

          <div class="war-combatant war-combatant-player ${p.burned?"burned":""}">
            <div class="war-combatant-info">
              <span class="war-side-label">${wtr("you")}</span>
              <strong class="war-combatant-name">🇦🇱 ${escapeHtml(p.name)}</strong>
              <div class="war-hearts war-compact-hearts" aria-label="${p.hp} zemra">${warHearts(p.hp,p.maxHp)}</div>
              <div class="war-status-icons war-status-compact">
                ${p.protect>0?`<span>🛡️×${p.protect}</span>`:""}
                ${p.frozen?"<span>🧊</span>":""}
                ${p.burned?"<span>🔥</span>":""}
              </div>
            </div>
            <div class="war-shooter war-shooter-player">
              ${soldierMarkup()}
            </div>
          </div>

          <aside class="war-weapons-panel">
            <div class="war-weapons-title">${wtr("yourWeapons")}</div>
            <div class="war-actions war-side-actions">
              ${warActionCard(p.special)}
              ${warActionCard(p.special2)}
            </div>
            <button id="warReroll" class="war-reroll" type="button" ${s.over||s.turn!=="player"||s.rerollUsedThisTurn?"disabled":""}>${wtr("changeWeapons")}<br><small>3 💎</small></button>
          </aside>
        </div>

        <div class="war-battle-info">
          <div class="war-progress war-progress-inline">
            <strong>🏆 ${wins} ${wtr("wins")}</strong>
            <small>🎮 ${games} ${wtr("games")} · ❤️ ${wtr("bonus")}: ${activeBonus} · 💎 ${Number(warProfile?.diamonds||0)}</small>
          </div>
          <div class="war-vs">VS</div>
          <p id="warMessage" class="war-message">${escapeHtml(s.message)}</p>
        </div>

        ${s.over?`<button id="warRestart" class="primary war-restart" type="button">${wtr("playAgain")}</button>`:""}
      </section>
    </div>`;

  document.getElementById("warSoundToggle")?.addEventListener("click",async()=>{
    warSoundEnabled=!warSoundEnabled;
    localStorage.setItem(WAR_SOUND_KEY,warSoundEnabled?"on":"off");
    if(warSoundEnabled){
      await ensureWarAudio();
      playWarSound("attack");
    }
    renderWarGame();
  });

  document.getElementById("warBack").onclick=()=>{
    warGameState=null;
    renderLobby();
  };

  document.getElementById("warRestart")?.addEventListener("click",()=>{
    warGameState=warInitialState();
    renderWarGame();
  });

  document.getElementById("warReroll")?.addEventListener("click",async()=>{
    if(s.over||s.turn!=="player"||s.rerollUsedThisTurn) return;
    const btn=document.getElementById("warReroll");
    if(btn) btn.disabled=true;
    try{
      const {data,error}=await supabase.rpc("war_spend_reroll",{p_device:deviceId});
      if(error) throw error;
      warProfile={...(warProfile||{}),diamonds:Number(data?.diamonds||0)};
      s.rerollUsedThisTurn=true;
      [p.special,p.special2]=warRollPair();
      s.message="🎲 Armët u ndryshuan për 3 💎.";
      renderWarGame();
    }catch(error){
      s.message=String(error?.message||error).includes("NOT_ENOUGH_DIAMONDS")
        ?"⚠️ Nuk ke 3 💎 për t'i ndryshuar armët."
        :"⚠️ Armët nuk u ndryshuan.";
      renderWarGame();
    }
  });

  root.querySelectorAll("[data-war-action]").forEach(btn=>{
    btn.disabled=s.over||s.turn!=="player";
    btn.onclick=()=>warPlayerAction(btn.dataset.warAction);
  });

  if(s.over && s.enemy.hp<=0 && s.player.hp>0){
    requestAnimationFrame(()=>showWarVictoryCelebration(
      "solo-"+warGames()+"-"+s.player.name,
      s.player.name
    ));
  }
}

async function startWarGame(){
  const button=document.getElementById("warGame");
  if(!supabase){ if(button) button.disabled=false; return; }
  if(button) button.disabled=true;
  try{
    await saveWarProfile();
    const {data:econ}=await supabase.rpc("war_get_profile",{p_device:deviceId});
    if(econ) warProfile=econ;
    warGameState=warInitialState();
    renderWarGame();
  }catch(error){
    const info=document.getElementById("warNameInfo");
    if(info){
      info.textContent=error?.message||"Nuk u ruajt useri.";
      info.classList.add("error");
    }
  }finally{
    if(button) button.disabled=false;
  }
}

function warFinishIfNeeded(){
  const s=warGameState;
  if(!s) return false;

  if(s.enemy.hp<=0){
    s.over=true;
    s.turn="none";
    const result=warRecordCompletedGame(true);
    awardWarWeeklyPoint();
    s.message="🏆 Fitove luftën! +1 pikë në renditjen javore.";
    if(result.bonusAdded){
      s.message+=" ❤️ Arrite "+result.games+" lojëra: fitove +1 zemër për 24 orë.";
    }
    recordWarComputerReward(s);
    return true;
  }

  if(s.player.hp<=0){
    s.over=true;
    s.turn="none";
    const result=warRecordCompletedGame(false);
    s.message="💥 Kundërshtari fitoi.";
    if(result.bonusAdded){
      s.message+=" ❤️ Arrite "+result.games+" lojëra: fitove +1 zemër për 24 orë.";
    }
    recordWarComputerReward(s);
    return true;
  }

  return false;
}

async function recordWarComputerReward(state){
  if(!state||state.serverRewardRecorded) return;
  state.serverRewardRecorded=true;
  try{
    const {data,error}=await supabase.rpc("war_record_computer_game",{p_device:deviceId});
    if(error) throw error;
    warProfile={...(warProfile||{}),diamonds:Number(data?.diamonds||0),computer_games:Number(data?.computer_games||0)};
    if(Number(data?.reward||0)>0){
      state.message+=" 💎 Çdo 5 lojë: fitove +20 diamanta!";
    }
    if(warGameState===state) renderWarGame();
  }catch(error){
    console.warn("war computer reward",error);
  }
}

async function ensureWarAudio(){
  try{
    if(!gameAudioContext){
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx) return null;
      gameAudioContext=new AudioCtx();
    }
    if(gameAudioContext.state==="suspended") await gameAudioContext.resume();
    return gameAudioContext;
  }catch(_){
    return null;
  }
}

function warNoise(ctx,{delay=0,duration=.12,gain=.5,filterType="lowpass",frequency=1800}={}){
  const start=ctx.currentTime+delay;
  const length=Math.max(1,Math.floor(ctx.sampleRate*duration));
  const buffer=ctx.createBuffer(1,length,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<length;i++){
    const decay=1-(i/length);
    data[i]=(Math.random()*2-1)*decay;
  }
  const src=ctx.createBufferSource();
  const filter=ctx.createBiquadFilter();
  const amp=ctx.createGain();
  src.buffer=buffer;
  filter.type=filterType;
  filter.frequency.setValueAtTime(frequency,start);
  amp.gain.setValueAtTime(.0001,start);
  amp.gain.exponentialRampToValueAtTime(Math.max(.001,gain),start+.004);
  amp.gain.exponentialRampToValueAtTime(.0001,start+duration);
  src.connect(filter);
  filter.connect(amp);
  amp.connect(ctx.destination);
  src.start(start);
  src.stop(start+duration+.02);
}

function warLowBoom(ctx,{delay=0,duration=.28,startFreq=120,endFreq=42,gain=.55}={}){
  const start=ctx.currentTime+delay;
  const osc=ctx.createOscillator();
  const amp=ctx.createGain();
  osc.type="sine";
  osc.frequency.setValueAtTime(startFreq,start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),start+duration);
  amp.gain.setValueAtTime(.0001,start);
  amp.gain.exponentialRampToValueAtTime(gain,start+.008);
  amp.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(start);
  osc.stop(start+duration+.03);
}

const warMediaUrls={};

function warWavUrl(kind){
  if(warMediaUrls[kind]) return warMediaUrls[kind];

  const sampleRate=22050;
  const duration=kind==="victory" ? 1.45 : kind==="rocket" ? .85 : kind==="tank" ? .62 : kind==="attack" ? .18 : .24;
  const samples=Math.floor(sampleRate*duration);
  const bytes=new ArrayBuffer(44+samples*2);
  const view=new DataView(bytes);

  function text4(offset,text){
    for(let i=0;i<4;i++) view.setUint8(offset+i,text.charCodeAt(i));
  }
  text4(0,"RIFF");
  view.setUint32(4,36+samples*2,true);
  text4(8,"WAVE");
  text4(12,"fmt ");
  view.setUint32(16,16,true);
  view.setUint16(20,1,true);
  view.setUint16(22,1,true);
  view.setUint32(24,sampleRate,true);
  view.setUint32(28,sampleRate*2,true);
  view.setUint16(32,2,true);
  view.setUint16(34,16,true);
  text4(36,"data");
  view.setUint32(40,samples*2,true);

  for(let i=0;i<samples;i++){
    const t=i/sampleRate;
    const x=i/samples;
    let v=0;

    if(kind==="attack"){
      const crack=(Math.random()*2-1)*Math.pow(1-x,5);
      const boom=Math.sin(2*Math.PI*(115-65*x)*t)*Math.exp(-28*t);
      v=.86*crack+.52*boom;
    }else if(kind==="tank"){
      const blast=(Math.random()*2-1)*Math.exp(-7*t);
      const low=Math.sin(2*Math.PI*(82-42*x)*t)*Math.exp(-4.5*t);
      const metal=Math.sin(2*Math.PI*420*t)*Math.exp(-10*t);
      v=.48*blast+.78*low+.12*metal;
    }else if(kind==="rocket"){
      if(t<.24){
        const launch=(Math.random()*2-1)*(.3+.5*(t/.24));
        const whine=Math.sin(2*Math.PI*(260+900*t)*t);
        v=.34*launch+.18*whine;
      }else{
        const bt=t-.24;
        const blast=(Math.random()*2-1)*Math.exp(-5*bt);
        const low=Math.sin(2*Math.PI*(72-35*(bt/.61))*bt)*Math.exp(-3.2*bt);
        v=.62*blast+.82*low;
      }
    }else if(kind==="defend"){
      v=.28*Math.sin(2*Math.PI*(260+520*x)*t)*Math.exp(-5*t);
    }else if(kind==="medkit"){
      const f=x<.33?520:x<.66?660:820;
      v=.22*Math.sin(2*Math.PI*f*t)*Math.exp(-2.5*t);
    }

    v=Math.max(-1,Math.min(1,v));
    view.setInt16(44+i*2,Math.round(v*32767),true);
  }

  const blob=new Blob([bytes],{type:"audio/wav"});
  warMediaUrls[kind]=URL.createObjectURL(blob);
  return warMediaUrls[kind];
}

function playWarWebAudio(kind){
  ensureWarAudio().then(ctx=>{
    if(!ctx) return;
    if(kind==="attack"){
      warNoise(ctx,{duration:.075,gain:.72,filterType:"highpass",frequency:900});
      warLowBoom(ctx,{duration:.11,startFreq:150,endFreq:58,gain:.42});
      warNoise(ctx,{delay:.055,duration:.055,gain:.28,filterType:"bandpass",frequency:2200});
    }else if(kind==="tank"){
      warNoise(ctx,{duration:.18,gain:.75,filterType:"lowpass",frequency:1500});
      warLowBoom(ctx,{duration:.48,startFreq:105,endFreq:30,gain:.78});
      warNoise(ctx,{delay:.08,duration:.30,gain:.30,filterType:"lowpass",frequency:650});
    }else if(kind==="rocket"){
      warNoise(ctx,{duration:.28,gain:.38,filterType:"bandpass",frequency:1100});
      warLowBoom(ctx,{delay:.23,duration:.58,startFreq:92,endFreq:24,gain:.86});
      warNoise(ctx,{delay:.23,duration:.38,gain:.82,filterType:"lowpass",frequency:1200});
    }else if(kind==="defend"){
      const now=ctx.currentTime;
      const osc=ctx.createOscillator();
      const amp=ctx.createGain();
      osc.type="triangle";
      osc.frequency.setValueAtTime(260,now);
      osc.frequency.exponentialRampToValueAtTime(780,now+.16);
      amp.gain.setValueAtTime(.0001,now);
      amp.gain.exponentialRampToValueAtTime(.18,now+.02);
      amp.gain.exponentialRampToValueAtTime(.0001,now+.20);
      osc.connect(amp); amp.connect(ctx.destination);
      osc.start(now); osc.stop(now+.22);
    }else if(kind==="medkit"){
      const now=ctx.currentTime;
      [520,660,820].forEach((f,i)=>{
        const osc=ctx.createOscillator();
        const amp=ctx.createGain();
        osc.type="sine";
        osc.frequency.value=f;
        const t=now+i*.07;
        amp.gain.setValueAtTime(.0001,t);
        amp.gain.exponentialRampToValueAtTime(.12,t+.01);
        amp.gain.exponentialRampToValueAtTime(.0001,t+.08);
        osc.connect(amp); amp.connect(ctx.destination);
        osc.start(t); osc.stop(t+.10);
      });
    }else if(kind==="victory"){
      const now=ctx.currentTime;
      [523.25,659.25,783.99,1046.5,1318.5].forEach((freq,i)=>{
        const osc=ctx.createOscillator();
        const amp=ctx.createGain();
        osc.type=i<3?"triangle":"sine";
        osc.frequency.value=freq;
        const t=now+i*.18;
        amp.gain.setValueAtTime(.0001,t);
        amp.gain.exponentialRampToValueAtTime(.20,t+.015);
        amp.gain.exponentialRampToValueAtTime(.0001,t+.24);
        osc.connect(amp); amp.connect(ctx.destination);
        osc.start(t); osc.stop(t+.27);
      });
    }
  });
}

function playWarSound(kind){
  if(!warSoundEnabled) return;
  try{
    const audio=new Audio(warWavUrl(kind));
    audio.preload="auto";
    audio.volume=1;
    audio.muted=false;
    audio.playsInline=true;
    const promise=audio.play();
    if(promise?.catch){
      promise.catch(error=>{
        console.warn("War HTMLAudio blocked, using WebAudio fallback",error);
        playWarWebAudio(kind);
        const status=document.getElementById("warAudioStatus");
        if(status) status.textContent="⚠️ Audio u bllokua nga telefoni — po përdor fallback.";
      });
    }
  }catch(error){
    console.warn("War audio failed",error);
    playWarWebAudio(kind);
  }

  if(kind==="attack" && navigator.vibrate) navigator.vibrate(28);
  if(kind==="tank" && navigator.vibrate) navigator.vibrate([55,25,85]);
  if(kind==="rocket" && navigator.vibrate) navigator.vibrate([45,120,110]);
  if(kind==="victory" && navigator.vibrate) navigator.vibrate([80,45,80,45,160]);
}

function showWarVictoryCelebration(key,winnerName="Fituesi"){
  if(!key || warVictoryShownKey===key) return;
  warVictoryShownKey=key;
  playWarSound("victory");
  document.querySelector(".war-victory-celebration")?.remove();
  const box=document.createElement("div");
  box.className="war-victory-celebration";
  const stars=Array.from({length:28},(_,idx)=>{
    const left=7+(idx*37)%86;
    const delay=((idx*11)%28)/100;
    const drift=((idx*29)%120)-60;
    const symbol=["⭐","✨","🌟","💫"][idx%4];
    return '<span style="--x:'+left+'%;--d:'+delay+'s;--drift:'+drift+'px">'+symbol+"</span>";
  }).join("");
  box.innerHTML='<div class="war-victory-title">🏆 FITORE! 🏆</div>'+
    '<div class="war-victory-name">'+escapeHtml(winnerName)+"</div>"+
    '<div class="war-victory-stars" aria-hidden="true">'+stars+"</div>";
  document.body.appendChild(box);
  setTimeout(()=>box.classList.add("show"),20);
  setTimeout(()=>{
    box.classList.remove("show");
    setTimeout(()=>box.remove(),500);
  },2800);
}
function warSoundForAction(action){
  if(action==="bomb"||action==="atom"||action==="azrael"||action==="fire") return "rocket";
  if(action==="helicopter"||action==="drone") return "attack";
  if(action==="heart") return "medkit";
  if(action==="protect"||action==="ice") return "defend";
  return "attack";
}

function warExecuteAction(actor,target,action,isPlayer){
  if(actor.frozen){
    actor.frozen=false;
    action="attack";
  }

  playWarSound(warSoundForAction(action));
  let extraTurn=false;
  let text="";

  if(action==="attack"){
    const hit=warDamage(target,1);
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Sulmin."
      : "🔫 Sulm: −"+hit.damage+" ❤️.";
  }else if(action==="bomb"){
    const hit=warBombDamage(target);
    text=hit.damage>0
      ? "💣 Bombë: "+hit.damage+" zemra u humbën."
      : "🛡️ Mbrojtja bllokoi Bombën.";
  }else if(action==="heart"){
    const before=actor.hp;
    actor.hp=Math.min(20,actor.hp+1);
    actor.maxHp=Math.min(20,Math.max(actor.maxHp,actor.hp));
    text=actor.hp>before
      ? "❤️ Zemër: +1 ❤️. Tani ke "+actor.hp+" zemra."
      : "❤️ Zemër: ke arritur maksimumin 20 zemra.";
  }else if(action==="helicopter"){
    const hit=warDamage(target,2);
    extraTurn=true;
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Helikopterin, por ti gjuan përsëri."
      : "🚁 Helikopter: −"+hit.damage+" ❤️ dhe ti gjuan përsëri.";
  }else if(action==="drone"){
    const hit=warDamage(target,1);
    extraTurn=true;
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Dronin, por ti gjuan përsëri."
      : "🛸 Droni: −"+hit.damage+" ❤️ dhe ti gjuan përsëri.";
  }else if(action==="fire"){
    const hit=warDamage(target,2);
    if(!hit.blocked) target.burned=true;
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Rrethin e Zjarrtë."
      : "⭕🔥 Rrethi i Zjarrtë: −"+hit.damage+" ❤️. Kundërshtari u dogj dhe u bë i zi.";
  }else if(action==="atom"){
    const hit=warDamage(target,3);
    text=hit.blocked
      ? "🛡️ Mbrojtja bllokoi Atomin."
      : "☢️ Atom: −"+hit.damage+" ❤️.";
  }else if(action==="protect"){
    actor.protect=2;
    text="🛡️ Mbrojtje aktive për 2 armë.";
  }else if(action==="azrael"){
    if(warBlockWeapon(target)){
      text="🛡️ Mbrojtja të shpëtoi nga Melaqja Asrail.";
    }else{
      target.hp=0;
      text="👼 Melaqja Asrail: kundërshtari u eliminua menjëherë.";
    }
  }else if(action==="ice"){
    target.frozen=true;
    text="🧊 Akull: në radhën tjetër, çfarëdo arme që zgjedh bëhet vetëm Sulm.";
  }

  return {extraTurn,text};
}


function warAnimateAction(action,fromPlayer,done){
  const scene=document.getElementById("warBattleScene");
  const projectile=document.getElementById("warProjectile");
  const explosion=document.getElementById("warExplosion");
  if(!scene||!projectile||!explosion){
    done();
    return;
  }

  const shooter=scene.querySelector(fromPlayer?".war-shooter-player":".war-shooter-enemy");
  const target=scene.querySelector(fromPlayer?".war-shooter-enemy":".war-shooter-player");
  const visualAction=(action==="heart"||action==="protect"||action==="ice")?action:
    (action==="helicopter"?"helicopter":
    (action==="drone"?"drone":
    (action==="fire"?"fire":
    (action==="atom"?"atom":
    (action==="bomb"?"bomb":
    (action==="azrael"?"azrael":"attack"))))));

  shooter?.classList.add("firing");
  target?.classList.remove("hit");
  projectile.className="war-projectile";
  explosion.className="war-explosion";
  projectile.textContent=visualAction==="helicopter"?"🚁":
    visualAction==="drone"?"🛸":
    visualAction==="fire"?"⭕":
    visualAction==="atom"?"☢️":
    visualAction==="bomb"?"💣":
    visualAction==="azrael"?"👼":
    visualAction==="ice"?"🧊":
    visualAction==="heart"?"❤️":
    visualAction==="protect"?"🛡️":"•";

  if(visualAction==="heart"||visualAction==="protect"){
    shooter?.classList.add(visualAction==="heart"?"healing":"guarding");
    setTimeout(()=>{
      shooter?.classList.remove("firing","healing","guarding");
      done();
    },420);
    return;
  }

  projectile.classList.add(fromPlayer?"fly-up":"fly-down",visualAction);
  setTimeout(()=>{
    explosion.textContent=visualAction==="ice"?"❄️":
      visualAction==="azrael"?"✨":
      visualAction==="helicopter"?"💥":
      visualAction==="drone"?"💥":
      visualAction==="fire"?"🔥":
      visualAction==="atom"?"☢️":
      visualAction==="bomb"?"💥":"✴️";
    explosion.classList.add(fromPlayer?"at-top":"at-bottom","show");
    target?.classList.add("hit");
  },300);

  setTimeout(()=>{
    shooter?.classList.remove("firing");
    target?.classList.remove("hit");
    projectile.className="war-projectile";
    explosion.className="war-explosion";
    done();
  },620);
}

function warPlayerAction(action){
  const s=warGameState;
  if(!s||s.over||s.turn!=="player") return;

  s.turn="animating";
  root.querySelectorAll("[data-war-action]").forEach(btn=>btn.disabled=true);

  warAnimateAction(action,true,()=>{
    if(!warGameState||warGameState.over) return;
    const p=warGameState.player;
    const e=warGameState.enemy;
    const wasFrozen=p.frozen;
    const result=warExecuteAction(p,e,action,true);

    if(wasFrozen){
      warGameState.message="🧊 Ishe i ngrirë: arma u kthye në Sulm. "+result.text;
    }else{
      warGameState.message=result.text;
    }

    if(warFinishIfNeeded()) return renderWarGame();

    [p.special,p.special2]=warRollPair();

    if(result.extraTurn){
      warGameState.turn="player";
      warGameState.rerollUsedThisTurn=false;
      renderWarGame();
      return;
    }

    warGameState.turn="enemy";
    renderWarGame();
    setTimeout(warEnemyTurn,650);
  });
}

function warEnemyTurn(){
  const s=warGameState;
  if(!s||s.over||s.turn!=="enemy") return;

  const e=s.enemy;
  const p=s.player;
  const wasFrozen=e.frozen;
  if(!e.special||!e.special2){
    [e.special,e.special2]=warRollPair();
  }
  const chosen=Math.random()<.5?e.special:e.special2;

  s.turn="animating";
  renderWarGame();

  setTimeout(()=>{
    warAnimateAction(chosen,false,()=>{
      if(!warGameState||warGameState.over) return;
      const result=warExecuteAction(e,p,chosen,false);

      if(wasFrozen){
        warGameState.message="🧊 Kundërshtari ishte i ngrirë: arma e tij u kthye në Sulm. "+result.text;
      }else{
        warGameState.message="🤖 "+result.text;
      }

      if(warFinishIfNeeded()) return renderWarGame();

      [e.special,e.special2]=warRollPair();

      if(result.extraTurn){
        warGameState.turn="enemy";
        renderWarGame();
        setTimeout(warEnemyTurn,650);
        return;
      }

      warGameState.turn="player";
      renderWarGame();
    });
  },80);
}

function chessInitial(){
  return {board:[
    ["br","bn","bb","bq","bk","bb","bn","br"],
    ["bp","bp","bp","bp","bp","bp","bp","bp"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["wp","wp","wp","wp","wp","wp","wp","wp"],
    ["wr","wn","wb","wq","wk","wb","wn","wr"]
  ],turn:"w",winner:null};
}

const M_POS=[[.08,.08],[.5,.08],[.92,.08],[.22,.22],[.5,.22],[.78,.22],[.36,.36],[.5,.36],[.64,.36],[.08,.5],[.22,.5],[.36,.5],[.64,.5],[.78,.5],[.92,.5],[.36,.64],[.5,.64],[.64,.64],[.22,.78],[.5,.78],[.78,.78],[.08,.92],[.5,.92],[.92,.92]];
const M_LINES=[[0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]];
const M_EDGES=[[0,1],[1,2],[0,9],[2,14],[3,4],[4,5],[3,10],[5,13],[6,7],[7,8],[6,11],[8,12],[9,10],[10,11],[12,13],[13,14],[15,16],[16,17],[15,11],[17,12],[18,19],[19,20],[18,10],[20,13],[21,22],[22,23],[21,9],[23,14],[7,4],[4,1],[16,19],[19,22]];
function morrisInitial(){ return {board:Array(24).fill(null),turn:"w",placed:{w:0,b:0},winner:null,mustRemove:false}; }

function myColor(){
  if(!room) return null;
  return room.player1_device===deviceId ? "w" : room.player2_device===deviceId ? "b" : null;
}

function normalizeGameOrder(value){
  const input=Array.isArray(value)?value:[];
  const clean=input.filter((id,index)=>DEFAULT_GAME_ORDER.includes(id)&&input.indexOf(id)===index);
  for(const id of DEFAULT_GAME_ORDER){
    if(!clean.includes(id)) clean.push(id);
  }
  return clean;
}

function gameChoiceLabel(id){
  if(id==="chess") return "♟️ "+tr("chess");
  if(id==="morris") return "🟣 "+tr("morris");
  if(id==="timer") return "⏱️ "+tr("timer");
  if(id==="tetris") return "🧱 "+tr("tetris");
  if(id==="war") return "⚔️ "+tr("war");
  return id;
}

function renderGameChoices(){
  return gameOrder.map((id)=>
    `<button class="game-choice ${selectedType===id?"active":""}" data-game="${id}">${gameChoiceLabel(id)}</button>`
  ).join("");
}

async function loadGameOrder(){
  try{
    const {data:sessionData}=await supabase.auth.getSession();
    const user=sessionData?.session?.user||null;
    gamesAdmin=user?.email===ADMIN_EMAIL || window.DiamondUnifiedAdmin===true || localStorage.getItem("diamond-unified-admin")==="1";

    const {data,error}=await supabase
      .from("app_settings")
      .select("value")
      .eq("key",GAME_ORDER_SETTING_KEY)
      .maybeSingle();

    if(error){
      console.warn("Game order load",error);
      gameOrder=[...DEFAULT_GAME_ORDER];
      return;
    }
    gameOrder=normalizeGameOrder(data?.value);
  }catch(error){
    console.warn("Game order load",error);
    gameOrder=[...DEFAULT_GAME_ORDER];
  }
}

async function saveGameOrder(){
  const status=document.getElementById("gameOrderStatus");
  const save=document.getElementById("gameOrderSave");
  if(!gamesAdmin) return;
  if(save) save.disabled=true;
  if(status) status.textContent="Po ruhet…";
  try{
    const {data:sessionData}=await supabase.auth.getSession();
    const user=sessionData?.session?.user;
    if(!user || user.email!==ADMIN_EMAIL) throw new Error("Vetëm admini mund ta ndryshojë renditjen.");

    const {error}=await supabase.from("app_settings").upsert({
      key:GAME_ORDER_SETTING_KEY,
      value:gameOrder,
      updated_at:new Date().toISOString(),
      updated_by:user.id
    },{onConflict:"key"});
    if(error) throw error;
    if(status) status.textContent="✅ U ruajt. Kjo renditje u del të gjithëve.";
  }catch(error){
    if(status) status.textContent="❌ Nuk u ruajt: "+(error?.message||"gabim");
  }finally{
    if(save) save.disabled=false;
  }
}

function bindGameOrderAdmin(){
  if(!gamesAdmin) return;
  root.querySelectorAll("[data-game-order-move]").forEach((button)=>{
    button.onclick=()=>{
      const id=button.dataset.gameId;
      const index=gameOrder.indexOf(id);
      const delta=button.dataset.gameOrderMove==="up"?-1:1;
      const next=index+delta;
      if(index<0 || next<0 || next>=gameOrder.length) return;
      [gameOrder[index],gameOrder[next]]=[gameOrder[next],gameOrder[index]];
      renderLobby();
    };
  });
  const save=document.getElementById("gameOrderSave");
  if(save) save.onclick=saveGameOrder;
}

function renderLobby(msg=""){
  if(aiTimer){ clearTimeout(aiTimer); aiTimer=null; }
  room=null; selected=null;
  root.innerHTML=`
    <div class="games-shell">
      <section class="card games-lobby">
        <h2>🎮 ${tr("games")}</h2>
        <p class="muted">${tr("choose")}</p>
        <div class="games-choice">
          ${renderGameChoices()}
        </div>

        ${gamesAdmin?`
          <section class="game-order-admin">
            <div class="game-order-head">
              <strong>👑 Renditja e lojërave</strong>
              <small>Admini zgjedh cila lojë del e para për të gjithë.</small>
            </div>
            <div class="game-order-list">
              ${gameOrder.map((id,index)=>`
                <div class="game-order-row">
                  <span>${index+1}. ${gameChoiceLabel(id)}</span>
                  <div>
                    <button class="secondary game-order-move" type="button" data-game-id="${id}" data-game-order-move="up" ${index===0?"disabled":""}>⬆️</button>
                    <button class="secondary game-order-move" type="button" data-game-id="${id}" data-game-order-move="down" ${index===gameOrder.length-1?"disabled":""}>⬇️</button>
                  </div>
                </div>
              `).join("")}
            </div>
            <button id="gameOrderSave" class="primary" type="button">Ruaj renditjen</button>
            <div id="gameOrderStatus" class="message"></div>
          </section>
        `:""}

        ${selectedType==="timer" ? `
          <input id="timerPlayerName" type="text" maxlength="24" placeholder="${tr("playerName")}" value="${escapeHtml(localStorage.getItem(TIMER_NAME_KEY)||"")}">
          <button id="timerSoloGame" class="primary" type="button">${tr("soloTimer")}</button>
          <div class="game-help">👥 ${tr("maxPlayers")} · 🔒 ${tr("hiddenTime")}</div>
        ` : selectedType==="war" ? `
          <div class="war-user-setup">
            <div class="war-economy-head">
              <label for="warPlayerName"><strong>👤 User</strong></label>
              <strong class="war-diamonds">💎 <span id="warDiamonds">200</span></strong>
            </div>
            <input id="warPlayerName" type="text" maxlength="20" placeholder="Emri i userit" value="${escapeHtml(localStorage.getItem(WAR_NAME_KEY)||"")}">
            <button id="warRenameBtn" class="secondary war-rename-btn" type="button" hidden>✏️ Ndrysho emrin · 25 💎</button>
            <div id="warNameInfo" class="game-help">Po ngarkohet profili…</div>
            <div class="war-diamond-note">💎 +5 çdo orë · 🎮 +20 💎 çdo 5 lojëra kundër kompjuterit · 🎲 armë të reja 3 💎</div>
            <button id="warGame" class="primary" type="button">🤖 Luaj me kompjuter</button>
            <button id="warMultiBtn" class="secondary war-online-btn" type="button">🌐 Luaj Online (deri 8 veta)</button>
            <div id="warMultiCount" class="war-online-count">👥 Në pritje: 0 / 8</div>
            <div class="game-help">Online pret 10 sekonda. Nëse askush nuk hyn, del “Provo përsëri” — nuk kalon te kompjuteri.</div>
          </div>
          <section id="warLeaderboard" class="war-leaderboard"><div class="muted">🏆 Po ngarkohet renditja javore…</div></section>
          ${gamesAdmin?`<section class="war-admin-panel"><h3>👑 Admin · Luftra</h3><p class="muted">Jep diamanta çdo lojtari. Emri lidhet me pajisjen dhe mund të ndryshohet vetëm 2 herë.</p><div id="warAdminProfiles">Po ngarkohen lojtarët…</div></section>`:""}
        ` : selectedType==="tetris" ? `
          <input id="tetrisPlayerName" type="text" maxlength="24" placeholder="${tr("playerName")}" value="${escapeHtml(localStorage.getItem(TETRIS_NAME_KEY)||"")}">
          <button id="tetrisGame" class="primary" type="button">🧱 ${tr("tetris")}</button>
          <div class="game-help">👆 Prek një herë ekranin = rrotullo · ✋ Mbaje të shtypur dhe tërhiqe = lëvize ku dëshiron</div>
          <section id="tetrisLobbyLeaderboard" class="tetris-leaderboard-mini"><div class="muted">🏆 Po ngarkohet renditja…</div></section>
        ` : `<button id="computerGame" class="primary" type="button">🤖 ${tr("computer")}</button>`}

        ${(selectedType==="tetris" || selectedType==="war") ? "" : `
          <div class="game-help">🌐 ${tr("online")}</div>
          <button id="createGame" class="secondary" type="button">${tr("create")}</button>
          <div class="game-join-row">
            <input id="joinCode" type="text" maxlength="8" placeholder="${tr("code")}">
            <button id="joinGame" class="secondary" type="button">${tr("join")}</button>
          </div>
        `}
        <div id="gameMessage" class="message">${msg}</div>
      </section>
      ${selectedType==="timer" ? `<section id="timerLeaderboard" class="card timer-leaderboard"><div class="muted">${tr("weekly")}…</div></section>` : ""}
    </div>`;
  if(selectedType==="timer") loadTimerLeaderboard();
  root.querySelectorAll("[data-game]").forEach(btn=>btn.onclick=()=>{selectedType=btn.dataset.game;renderLobby();});
  const warChoice=root.querySelector('[data-game="war"]'); if(warChoice) warChoice.addEventListener("click",()=>{selectedType="war";renderLobby();},{once:true});
  bindGameOrderAdmin();
  const computerButton=document.getElementById("computerGame");
  if(computerButton) computerButton.onclick=startComputerGame;
  const timerName=document.getElementById("timerPlayerName");
  if(timerName) timerName.addEventListener("input",()=>localStorage.setItem(TIMER_NAME_KEY,timerName.value.trim()));
  const timerSoloButton=document.getElementById("timerSoloGame");
  if(timerSoloButton) timerSoloButton.onclick=startTimerSoloGame;

  const tetrisNameInput=document.getElementById("tetrisPlayerName");
  if(tetrisNameInput){
    tetrisNameInput.addEventListener("input",()=>localStorage.setItem(TETRIS_NAME_KEY,tetrisNameInput.value.trim().slice(0,24)));
  }

  const tetrisButton=document.getElementById("tetrisGame");
  if(tetrisButton) tetrisButton.onclick=startTetrisGame;

  const warNameInput=document.getElementById("warPlayerName");
  if(warNameInput){
    warNameInput.addEventListener("input",()=>{
      if(!warProfile||warRenameEditing) localStorage.setItem(WAR_NAME_KEY,warNameInput.value.trim().slice(0,20));
    });
  }
  const warRenameBtn=document.getElementById("warRenameBtn");
  if(warRenameBtn){
    warRenameBtn.onclick=async()=>{
      const info=document.getElementById("warNameInfo");
      if(!warProfile) return;
      if(Number(warProfile.rename_count||0)>=2){ if(info) info.textContent="Emrin mund ta ndryshosh maksimum 2 herë."; return; }
      if(!warRenameEditing){
        warRenameEditing=true;
        if(warNameInput){
          warNameInput.readOnly=false;
          warNameInput.classList.remove("war-name-locked");
          warNameInput.focus();
          warNameInput.select();
        }
        warRenameBtn.textContent="💾 Ruaj emrin · 25 💎";
        if(info) info.textContent="Shkruaje emrin e ri. Ruajtja kushton 25 💎.";
        return;
      }
      warRenameBtn.disabled=true;
      try{
        await saveWarProfile();
        warRenameEditing=false;
        await loadWarProfileAndLeaderboard();
      }catch(error){
        if(info) info.textContent=error?.message||"Emri nuk u ndryshua.";
      }finally{
        warRenameBtn.disabled=false;
      }
    };
  }
  const warButton=document.getElementById("warGame");
  if(warButton) warButton.onclick=startWarGame;
  const warMultiBtn=document.getElementById("warMultiBtn");
  if(warMultiBtn) warMultiBtn.onclick=startWarMultiSearch;
  if(selectedType==="war"){
    loadWarProfileAndLeaderboard();
    refreshWarMultiLobbyCount();
    if(gamesAdmin) loadWarAdminPanel();
  }

  const createButton=document.getElementById("createGame");
  if(createButton) createButton.onclick=createRoom;

  const joinButton=document.getElementById("joinGame");
  if(joinButton) joinButton.onclick=joinRoom;

  if(selectedType==="tetris") loadTetrisLeaderboard("tetrisLobbyLeaderboard");
}

function startTimerSoloGame(){
  const name=timerName();
  lastTimerSoundKey="";
  if(!name){ renderLobby(tr("needName")); return; }

  if(channel){ supabase.removeChannel(channel); channel=null; }
  clearTimerPhaseTimeout();

  room={
    id:"local-timer",
    code:"AI",
    game_type:"timer",
    player1_device:deviceId,
    player2_device:"computer",
    state:{
      phase:"lobby",
      round:0,
      start_at:null,
      eliminated_device:null,
      winner_device:null,
      bot_stop_ms:null
    },
    status:"active",
    localTimer:true
  };

  timerPlayers=[
    {
      room_id:"local-timer",
      device_id:deviceId,
      display_name:name,
      eliminated:false,
      stop_ms:null,
      joined_at:new Date().toISOString()
    },
    {
      room_id:"local-timer",
      device_id:"computer",
      display_name:tr("computerName"),
      eliminated:false,
      stop_ms:null,
      joined_at:new Date(Date.now()+1).toISOString()
    }
  ];

  renderTimerRoom();
}

function startComputerGame(){
  if(selectedType==="timer") return;
  if(channel){ supabase.removeChannel(channel); channel=null; }
  if(aiTimer){ clearTimeout(aiTimer); aiTimer=null; }
  room={
    id:"local-computer",
    code:"AI",
    game_type:selectedType,
    player1_device:deviceId,
    player2_device:"computer",
    state:selectedType==="chess"?chessInitial():morrisInitial(),
    status:"active",
    local:true
  };
  selected=null;
  renderRoom();
}

function scheduleComputerTurn(){
  if(!room?.local || room.state?.winner || room.state?.turn!=="b") return;
  if(aiTimer) clearTimeout(aiTimer);
  aiTimer=setTimeout(()=>{
    aiTimer=null;
    if(!room?.local || room.state?.winner || room.state?.turn!=="b") return;
    if(room.game_type==="chess") computerChessMove();
    else computerMorrisMove();
  },650);
}

async function createRoom(){
  if(selectedType==="timer"){
    const name=timerName();
    if(!name){ renderLobby(tr("needName")); return; }
    for(let i=0;i<5;i++){
      const code=roomCode();
      const {data,error}=await supabase.rpc("timer_create_room",{p_code:code,p_device:deviceId,p_name:name});
      if(!error && data){
        const created=await fetchRoomById(data);
        await openRoom(created);
        return;
      }
    }
    renderLobby(tr("error"));
    return;
  }

  const state=selectedType==="chess"?chessInitial():morrisInitial();
  for(let i=0;i<5;i++){
    const code=roomCode();
    const {data,error}=await supabase.from("game_rooms").insert({code,game_type:selectedType,player1_device:deviceId,state,status:"waiting"}).select().single();
    if(!error){openRoom(data);return;}
  }
  renderLobby(tr("error"));
}

async function joinRoom(){
  const code=(document.getElementById("joinCode").value||"").trim().toUpperCase();
  if(!code)return;
  const {data,error}=await supabase.from("game_rooms").select("*").eq("code",code).maybeSingle();
  if(error||!data){document.getElementById("gameMessage").textContent=tr("invalid");return;}

  if(data.game_type==="timer"){
    const name=timerName();
    if(!name){ document.getElementById("gameMessage").textContent=tr("needName"); return; }
    const {data:roomId,error:joinError}=await supabase.rpc("timer_join_room",{p_code:code,p_device:deviceId,p_name:name});
    if(joinError){
      const raw=String(joinError.message||"");
      document.getElementById("gameMessage").textContent=
        raw.includes("ROOM_FULL") ? tr("full") :
        raw.includes("ROOM_LOCKED") ? tr("roomLocked") : tr("invalid");
      return;
    }
    const joined=await fetchRoomById(roomId);
    await openRoom(joined);
    return;
  }

  if(data.player1_device!==deviceId&&data.player2_device&&data.player2_device!==deviceId){document.getElementById("gameMessage").textContent=tr("full");return;}
  if(!data.player2_device&&data.player1_device!==deviceId){
    const {data:updated,error:uerr}=await supabase.from("game_rooms").update({player2_device:deviceId,status:"active",updated_at:new Date().toISOString()}).eq("id",data.id).select().single();
    if(uerr)return; openRoom(updated); return;
  }
  openRoom(data);
}

async function openRoom(r){
  room=r; selected=null;
  if(room.game_type==="timer") lastTimerSoundKey="";
  if(room.game_type==="timer") await loadTimerPlayers();
  subscribeRoom();
  renderRoom();
}

function subscribeRoom(){
  if(room?.localTimer) return;
  if(channel)supabase.removeChannel(channel);
  channel=supabase.channel("game-"+room.id)
    .on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_rooms",filter:"id=eq."+room.id},async payload=>{
      room=payload.new; selected=null;
      if(room.game_type==="timer") await loadTimerPlayers();
      renderRoom();
    })
    .on("postgres_changes",{event:"*",schema:"public",table:"timer_players",filter:"room_id=eq."+room.id},async ()=>{
      if(room?.game_type!=="timer") return;
      await loadTimerPlayers();
      renderRoom();
    })
    .subscribe();
}

async function saveState(state,status=room.status){
  room.state=state; room.status=status;

  if(room.local){
    renderRoom();
    scheduleComputerTurn();
    return;
  }

  const {data,error}=await supabase.from("game_rooms").update({state,status,updated_at:new Date().toISOString()}).eq("id",room.id).select().single();
  if(!error)room=data;
}

function statusText(){
  const s=room.state||{};
  if(s.winner){ const name=s.winner==="w"?tr("white"):tr("black"); return `${tr("gameOver")} · ${tr("winner")}: ${name}`; }
  if(room.local && s.turn==="b") return tr("computerThinking");
  return s.turn===myColor()?tr("yourTurn"):tr("opponentTurn");
}

function renderRoom(){
  if(!room)return renderLobby();
  if(room.game_type==="timer"){ renderTimerRoom(); return; }
  const waiting=!room.player2_device;
  const local=!!room.local;
  root.innerHTML=`
    <div class="games-shell ${room.game_type==="morris"?"morris-game-shell":""}">
      <section class="card ${room.game_type==="morris"?"morris-player-card":""}">
        <div class="game-room-head">
          <div>
            <div class="muted small">${local ? "🤖 "+tr("computerName") : tr("room")}</div>
            <div class="game-room-code">${local ? (room.game_type==="chess"?"♟️ "+tr("chess"):"🟣 "+tr("morris")) : room.code}</div>
          </div>
          ${local ? "" : `<button id="copyRoom" class="secondary" type="button">${tr("copy")}</button>`}
        </div>
        <div class="game-status">${waiting?tr("waiting"):statusText()}</div>
        <div class="game-meta-grid">
          <div class="game-meta-box ${room.game_type==="morris"?"morris-player-white":""}">⚪ ${tr("white")}: ✓</div>
          <div class="game-meta-box ${room.game_type==="morris"?"morris-player-black":""}">⚫ ${tr("black")}: ${local ? "🤖 "+tr("computerName") : (room.player2_device===deviceId?"✓":room.player2_device?"●":"…")}</div>
        </div>
      </section>
      <section class="card ${room.game_type==="morris"?"morris-board-card":""}">
        <div class="game-board-wrap" id="gameBoard"></div>
        <div class="game-help">${room.game_type==="chess"?tr("helpChess"):tr("helpMorris")}</div>
        <div class="game-actions">
          ${local ? `<button id="newComputerGame" class="primary" type="button">${tr("newGame")}</button>` : ""}
          <button id="leaveGame" class="secondary" type="button">${tr("leave")}</button>
        </div>
      </section>
    </div>`;
  const copyButton=document.getElementById("copyRoom");
  if(copyButton) copyButton.onclick=async()=>{await navigator.clipboard.writeText(room.code);copyButton.textContent=tr("copied");};
  const newButton=document.getElementById("newComputerGame");
  if(newButton) newButton.onclick=startComputerGame;
  document.getElementById("leaveGame").onclick=()=>{if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}if(channel)supabase.removeChannel(channel);channel=null;renderLobby();};
  if(room.game_type==="chess")renderChess(myColor());else renderMorris(myColor());
  scheduleComputerTurn();
}

function clearTimerPhaseTimeout(){
  if(timerPhaseTimeout){ clearTimeout(timerPhaseTimeout); timerPhaseTimeout=null; }
}

function scheduleTimerPhaseRender(){
  clearTimerPhaseTimeout();
  const start=room?.state?.start_at ? new Date(room.state.start_at).getTime() : 0;
  if(!start) return;
  const delay=start-Date.now();
  if(delay>0 && delay<15000){
    timerPhaseTimeout=setTimeout(()=>{
      timerPhaseTimeout=null;
      if(room?.game_type==="timer"){
        playTimerSound("start");
        lastTimerSoundKey="start:"+room.id+":"+(room.state?.round||0);
        renderTimerRoom();
      }
    },delay+30);
  }
}

function renderTimerRoom(){
  clearTimerPhaseTimeout();
  const st=room.state||{};
  const phase=st.phase||"lobby";
  const active=timerActivePlayers();
  const me=timerPlayer(deviceId);
  const host=room.player1_device===deviceId;
  const localTimer=!!room.localTimer;
  const startAt=st.start_at ? new Date(st.start_at).getTime() : 0;
  const started=startAt && Date.now()>=startAt;
  const canStop=phase==="countdown" && started && me && !me.eliminated && me.stop_ms==null;
  const waitingForStart=phase==="countdown" && !started;
  const opponents=timerPlayers.filter(p=>p.device_id!==deviceId);

  const meCard=me ? `
    <div class="timer-face-card me ${me.eliminated?"eliminated":""}">
      <div class="timer-avatar">${escapeHtml(timerInitials(me.display_name))}</div>
      <div class="timer-face-name">${escapeHtml(me.display_name)}</div>
      <div class="timer-face-label">👤 ${tr("you")}</div>
    </div>` : "";

  const opponentCards=opponents.map(p=>`
    <div class="timer-face-card opponent ${p.eliminated?"eliminated":""}">
      <div class="timer-avatar">${p.device_id==="computer"?"🤖":escapeHtml(timerInitials(p.display_name))}</div>
      <div class="timer-face-name">${escapeHtml(p.display_name)}</div>
      <div class="timer-face-label">${p.eliminated?"❌ "+tr("eliminated"):"🟢 "+tr("active")}</div>
    </div>`).join("");

  const versusHtml=`
    <div class="timer-versus">
      <div class="timer-versus-side">${meCard}</div>
      <div class="timer-vs">VS</div>
      <div class="timer-opponents">
        <div class="timer-opponents-title">${tr("opponents")}</div>
        <div class="timer-opponent-grid">${opponentCards || "—"}</div>
      </div>
    </div>`;

  let center="";
  if(phase==="lobby"){
    center=`
      <div class="secret-clock">🔒 ---.--- s</div>
      <div class="timer-big-message">${active.length<2 ? tr("needPlayers") : tr("hiddenTime")}</div>
      ${host && active.length>=2 ? `<button id="startTimerRound" class="timer-start-button" type="button">▶️ ${tr("startRound")}</button>` : ""}
    `;
  }else if(phase==="countdown"){
    center=`
      <div class="secret-clock">🔒 ---.--- s</div>
      <div class="timer-big-message">${waitingForStart ? tr("ready") : (me?.eliminated ? tr("youEliminated") : me?.stop_ms!=null ? tr("stopped") : tr("hiddenTime"))}</div>
      ${canStop ? `<button id="timerStopButton" class="timer-stop-button" type="button">${tr("stop")}</button>` : ""}
    `;
  }else if(phase==="results"){
    const out=timerPlayer(st.eliminated_device);
    center=`
      <div class="timer-big-message">❌ ${out ? escapeHtml(out.display_name)+" "+tr("eliminated") : tr("gameOver")}</div>
      ${host && active.length>=2 ? `<button id="startTimerRound" class="timer-start-button" type="button">▶️ ${tr("startRound")}</button>` : ""}
    `;
  }else if(phase==="finished"){
    const winner=timerPlayer(st.winner_device);
    center=`
      <div class="timer-crown">👑</div>
      <div class="timer-big-message">${tr("king")}</div>
      <div class="timer-winner-name">${winner ? escapeHtml(winner.display_name) : ""}</div>
      ${localTimer ? `<div class="game-help">${tr("practiceOnly")}</div>` : `<div class="timer-power-win">⚡ +10 ${tr("power")}</div>`}
      <button id="timerBackGames" class="secondary" type="button">${tr("backGames")}</button>
    `;
  }

  const revealTimes=phase==="results" || phase==="finished";
  const playersHtml=timerPlayers.map((p,i)=>{
    const eliminated=p.eliminated;
    const time=revealTimes && p.stop_ms!=null ? `<span class="timer-result-time">${timerMs(p.stop_ms)}</span>` : "";
    return `<div class="timer-player-row ${eliminated?"eliminated":""}">
      <span><strong>${i+1}. ${escapeHtml(p.display_name)}</strong> ${p.device_id===deviceId?"👤":""}</span>
      <span>${eliminated?"❌":"🟢"} ${time}</span>
    </div>`;
  }).join("");

  root.innerHTML=`
    <div class="games-shell">
      <section class="card timer-room-card">
        <div class="game-room-head">
          <div>
            <div class="muted small">${localTimer ? "🤖 "+tr("computerName") : tr("room")+" · "+tr("players")+" "+timerPlayers.length+"/8"}</div>
            <div class="game-room-code">${localTimer ? "⏱️ "+tr("timer") : room.code}</div>
          </div>
          ${localTimer ? "" : `<button id="copyRoom" class="secondary" type="button">${tr("copy")}</button>`}
        </div>
        <div class="timer-round-line">
          <div class="timer-round-label">⏱️ ${tr("timer")} · ${tr("round")} ${st.round||0}</div>
          <button id="timerSoundButton" class="secondary timer-sound-button" type="button">${timerSoundEnabled?tr("soundOn"):tr("soundOff")}</button>
        </div>
        ${versusHtml}
        <div class="timer-center">${center}</div>
      </section>

      <section class="card">
        <h3>👥 ${tr("players")}</h3>
        <div class="timer-player-list">${playersHtml}</div>
      </section>

      ${localTimer ? `<section class="card"><div class="game-help">${tr("practiceOnly")}</div></section>` : `<section id="timerRoomLeaderboard" class="card timer-leaderboard"></section>`}

      <div class="game-actions">
        <button id="leaveGame" class="secondary" type="button">${tr("leave")}</button>
      </div>
    </div>`;

  const soundButton=document.getElementById("timerSoundButton");
  if(soundButton) soundButton.onclick=async()=>{
    setTimerSound(!timerSoundEnabled);
    renderTimerRoom();
  };

  const copy=document.getElementById("copyRoom");
  if(copy) copy.onclick=async()=>{ await navigator.clipboard.writeText(room.code); copy.textContent=tr("copied"); };

  const start=document.getElementById("startTimerRound");
  if(start) start.onclick=startTimerRound;

  const stop=document.getElementById("timerStopButton");
  if(stop) stop.onclick=stopTimer;

  const back=document.getElementById("timerBackGames");
  if(back) back.onclick=()=>{ if(channel)supabase.removeChannel(channel); channel=null; room=null; renderLobby(); };

  const leave=document.getElementById("leaveGame");
  if(leave) leave.onclick=()=>{ clearTimerPhaseTimeout(); if(channel)supabase.removeChannel(channel); channel=null; room=null; renderLobby(); };

  if(waitingForStart) scheduleTimerPhaseRender();
  maybePlayTimerStateSound(st,started);
  if(!localTimer) loadTimerLeaderboardInto("timerRoomLeaderboard");
}

async function startTimerRound(){
  const button=document.getElementById("startTimerRound");
  if(button) button.disabled=true;
  await ensureGameAudio();

  if(room?.localTimer){
    const delay=1800+Math.floor(Math.random()*3200);
    const startAt=Date.now()+delay;
    const botStop=650+Math.floor(Math.random()*2850);

    for(const player of timerPlayers){
      player.eliminated=false;
      player.stop_ms=null;
    }

    room.state={
      phase:"countdown",
      round:(room.state?.round||0)+1,
      start_at:new Date(startAt).toISOString(),
      eliminated_device:null,
      winner_device:null,
      bot_stop_ms:botStop
    };
    renderTimerRoom();
    return;
  }

  try{
    const {error}=await supabase.rpc("timer_start_round",{p_room:room.id,p_device:deviceId});
    if(error) throw error;
    room=await fetchRoomById(room.id);
    await loadTimerPlayers();
    renderTimerRoom();
  }catch(error){
    console.warn("timer start",error);
    if(button) button.disabled=false;
  }
}

async function stopTimer(){
  const button=document.getElementById("timerStopButton");
  if(button) button.disabled=true;
  playTimerSound("stop");

  if(room?.localTimer){
    const startAt=new Date(room.state.start_at).getTime();
    if(!startAt || Date.now()<startAt){
      if(button) button.disabled=false;
      return;
    }

    const human=Math.max(0,Date.now()-startAt);
    const bot=Number(room.state.bot_stop_ms)||1500;
    const me=timerPlayer(deviceId);
    const computer=timerPlayer("computer");

    if(me) me.stop_ms=human;
    if(computer) computer.stop_ms=bot;

    const humanWins=human<=bot;
    const winner=humanWins?deviceId:"computer";
    const loser=humanWins?"computer":deviceId;

    if(me) me.eliminated=!humanWins;
    if(computer) computer.eliminated=humanWins;

    room.state={
      ...room.state,
      phase:"finished",
      eliminated_device:loser,
      winner_device:winner
    };
    renderTimerRoom();
    return;
  }

  try{
    const {error}=await supabase.rpc("timer_submit_stop",{p_room:room.id,p_device:deviceId});
    if(error) throw error;
    room=await fetchRoomById(room.id);
    await loadTimerPlayers();
    renderTimerRoom();
  }catch(error){
    console.warn("timer stop",error);
    if(button) button.disabled=false;
  }
}

async function loadTimerLeaderboardInto(id){
  const el=document.getElementById(id);
  if(!el) return;
  try{
    const {data:kings}=await supabase.from("timer_profiles").select("display_name,power,crowns").order("power",{ascending:false}).limit(5);
    if(!document.getElementById(id)) return;
    el.innerHTML=`<h3>👑 ${tr("king")}</h3><div class="timer-ranking">${(kings||[]).map((r,i)=>`
      <div class="timer-rank-row"><span>${i===0?"👑":"⚡"} ${escapeHtml(r.display_name)}</span><strong>${tr("power")}: ${r.power}</strong></div>`).join("") || "—"}</div>`;
  }catch(error){ console.warn(error); }
}

const C_SYM={wp:"♙",wr:"♖",wn:"♘",wb:"♗",wq:"♕",wk:"♔",bp:"♟",br:"♜",bn:"♞",bb:"♝",bq:"♛",bk:"♚"};

function chessMoves(board,r,c){
  const p=board[r][c]; if(!p)return [];
  const col=p[0],type=p[1],out=[];
  const add=(rr,cc)=>{if(rr<0||rr>7||cc<0||cc>7)return false;const q=board[rr][cc];if(!q){out.push([rr,cc]);return true;}if(q[0]!==col)out.push([rr,cc]);return false;};
  if(type==="p"){
    const d=col==="w"?-1:1,start=col==="w"?6:1;
    if(r+d>=0&&r+d<8&&!board[r+d][c]){out.push([r+d,c]);if(r===start&&!board[r+2*d][c])out.push([r+2*d,c]);}
    for(const dc of [-1,1]){const rr=r+d,cc=c+dc;if(rr>=0&&rr<8&&cc>=0&&cc<8&&board[rr][cc]&&board[rr][cc][0]!==col)out.push([rr,cc]);}
  } else if(type==="n"){
    for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])add(r+dr,c+dc);
  } else if(type==="k"){
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc)add(r+dr,c+dc);
  } else {
    const dirs=type==="b"?[[-1,-1],[-1,1],[1,-1],[1,1]]:type==="r"?[[-1,0],[1,0],[0,-1],[0,1]]:[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
    for(const [dr,dc] of dirs){let rr=r+dr,cc=c+dc;while(add(rr,cc)){rr+=dr;cc+=dc;}}
  }
  return out;
}

function renderChess(color){
  const wrap=document.getElementById("gameBoard"),st=room.state;
  const board=document.createElement("div");board.className="chess-board";
  const targets=selected?chessMoves(st.board,...selected):[];
  for(let vr=0;vr<8;vr++)for(let vc=0;vc<8;vc++){
    const r=color==="b"?7-vr:vr,c=color==="b"?7-vc:vc;
    const sq=document.createElement("button");sq.className="chess-square "+((r+c)%2?"dark":"light");
    if(selected&&selected[0]===r&&selected[1]===c)sq.classList.add("selected");
    if(targets.some(x=>x[0]===r&&x[1]===c))sq.classList.add("target");
    const p=st.board[r][c];
    if(p){const span=document.createElement("span");span.className="chess-piece "+(p[0]==="w"?"white":"black");span.textContent=C_SYM[p];sq.appendChild(span);}
    sq.onclick=()=>chessClick(r,c);board.appendChild(sq);
  }
  wrap.innerHTML="";wrap.appendChild(board);
}

async function chessClick(r,c){
  if(!room.player2_device||room.state.winner)return;
  const color=myColor();if(room.state.turn!==color)return;
  const b=room.state.board;
  if(!selected){if(b[r][c]&&b[r][c][0]===color){selected=[r,c];renderRoom();}return;}
  if(b[r][c]&&b[r][c][0]===color){selected=[r,c];renderRoom();return;}
  const moves=chessMoves(b,...selected);
  if(!moves.some(x=>x[0]===r&&x[1]===c)){selected=null;renderRoom();return;}
  const nb=b.map(row=>row.slice());
  let piece=nb[selected[0]][selected[1]],captured=nb[r][c];
  nb[selected[0]][selected[1]]=null;if(piece[1]==="p"&&(r===0||r===7))piece=piece[0]+"q";nb[r][c]=piece;
  const ns={...room.state,board:nb,turn:color==="w"?"b":"w"};if(captured&&captured[1]==="k")ns.winner=color;
  selected=null;await saveState(ns,"active");if(!room.local)renderRoom();
}

function computerChessMove(){
  if(!room?.local || room.game_type!=="chess" || room.state.turn!=="b" || room.state.winner) return;

  const st=structuredClone(room.state);
  const candidates=[];
  const values={p:1,n:3,b:3,r:5,q:9,k:50};

  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=st.board[r][c];
    if(!p || p[0]!=="b") continue;
    for(const [rr,cc] of chessMoves(st.board,r,c)){
      const captured=st.board[rr][cc];
      let score=(captured ? (values[captured[1]]||0)*20 : 0);
      score += (3.5-Math.abs(3.5-rr)) + (3.5-Math.abs(3.5-cc));
      score += Math.random()*3;
      candidates.push({r,c,rr,cc,score});
    }
  }

  if(!candidates.length){
    st.winner="w";
    room.state=st;
    renderRoom();
    return;
  }

  candidates.sort((a,b)=>b.score-a.score);
  const pick=candidates[Math.floor(Math.random()*Math.min(3,candidates.length))];
  let piece=st.board[pick.r][pick.c];
  const captured=st.board[pick.rr][pick.cc];
  st.board[pick.r][pick.c]=null;
  if(piece[1]==="p" && pick.rr===7) piece="bq";
  st.board[pick.rr][pick.cc]=piece;
  if(captured && captured[1]==="k") st.winner="b";
  st.turn="w";
  room.state=st;
  renderRoom();
}

function adjacent(a,b){return M_EDGES.some(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));}
function formsMill(board,pos,color){return M_LINES.some(line=>line.includes(pos)&&line.every(i=>board[i]===color));}
function allInMill(board,color){const ps=board.map((v,i)=>v===color?i:-1).filter(i=>i>=0);return ps.length&&ps.every(i=>formsMill(board,i,color));}
function countPieces(board,color){return board.filter(x=>x===color).length;}

function renderMorris(){
  const wrap=document.getElementById("gameBoard"),st=room.state,board=document.createElement("div");board.className="morris-board";
  wrap.classList.add("morris-board-wrap");
  for(const [a,b] of M_EDGES){
    const [x1,y1]=M_POS[a],[x2,y2]=M_POS[b],dx=(x2-x1)*100,dy=(y2-y1)*100,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;
    const line=document.createElement("div");line.className="morris-line";line.style.left=(x1*100)+"%";line.style.top=(y1*100)+"%";line.style.width=len+"%";line.style.transform=`rotate(${ang}deg)`;board.appendChild(line);
  }
  for(let i=0;i<24;i++){
    const btn=document.createElement("button");btn.className="morris-point";if(st.board[i])btn.classList.add(st.board[i]==="w"?"white":"black");if(selected===i)btn.classList.add("selected");
    btn.style.left=(M_POS[i][0]*100)+"%";btn.style.top=(M_POS[i][1]*100)+"%";btn.onclick=()=>morrisClick(i);board.appendChild(btn);
  }
  wrap.innerHTML="";wrap.appendChild(board);
}

async function morrisClick(pos){
  if(!room.player2_device||room.state.winner)return;
  const color=myColor(),other=color==="w"?"b":"w",st=structuredClone(room.state);if(st.turn!==color)return;
  if(st.mustRemove){
    if(st.board[pos]!==other)return;if(formsMill(st.board,pos,other)&&!allInMill(st.board,other))return;
    st.board[pos]=null;st.mustRemove=false;st.turn=other;if(st.placed[other]>=9&&countPieces(st.board,other)<3)st.winner=color;
    selected=null;await saveState(st,"active");if(!room.local)renderRoom();return;
  }
  if(st.placed[color]<9){
    if(st.board[pos])return;st.board[pos]=color;st.placed[color]++;if(formsMill(st.board,pos,color))st.mustRemove=true;else st.turn=other;
    await saveState(st,"active");if(!room.local)renderRoom();return;
  }
  if(selected===null){if(st.board[pos]===color){selected=pos;renderRoom();}return;}
  if(st.board[pos]===color){selected=pos;renderRoom();return;}
  if(st.board[pos]!==null){selected=null;renderRoom();return;}
  const flying=countPieces(st.board,color)===3;if(!flying&&!adjacent(selected,pos))return;
  st.board[selected]=null;st.board[pos]=color;if(formsMill(st.board,pos,color))st.mustRemove=true;else st.turn=other;
  selected=null;await saveState(st,"active");if(!room.local)renderRoom();
}

function bestMorrisPlacement(st,color){
  const other=color==="w"?"b":"w";
  const empty=st.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);

  for(const pos of empty){
    const b=st.board.slice(); b[pos]=color;
    if(formsMill(b,pos,color)) return pos;
  }
  for(const pos of empty){
    const b=st.board.slice(); b[pos]=other;
    if(formsMill(b,pos,other)) return pos;
  }
  return empty[Math.floor(Math.random()*empty.length)];
}

function computerMorrisMove(){
  if(!room?.local || room.game_type!=="morris" || room.state.turn!=="b" || room.state.winner) return;

  const st=structuredClone(room.state);
  const color="b", other="w";

  if(st.mustRemove){
    let targets=st.board.map((v,i)=>v===other?i:-1).filter(i=>i>=0);
    const nonMill=targets.filter(i=>!formsMill(st.board,i,other));
    if(nonMill.length) targets=nonMill;
    const pos=targets[Math.floor(Math.random()*targets.length)];
    if(pos!==undefined) st.board[pos]=null;
    st.mustRemove=false;
    st.turn=other;
    if(st.placed[other]>=9 && countPieces(st.board,other)<3) st.winner=color;
    room.state=st;
    renderRoom();
    return;
  }

  if(st.placed[color]<9){
    const pos=bestMorrisPlacement(st,color);
    if(pos===undefined) return;
    st.board[pos]=color;
    st.placed[color]++;
    if(formsMill(st.board,pos,color)){
      st.mustRemove=true;
      room.state=st;
      renderRoom();
      scheduleComputerTurn();
      return;
    }
    st.turn=other;
    room.state=st;
    renderRoom();
    return;
  }

  const pieces=st.board.map((v,i)=>v===color?i:-1).filter(i=>i>=0);
  const flying=pieces.length===3;
  const moves=[];

  for(const from of pieces){
    const targets=st.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0 && (flying || adjacent(from,i)));
    for(const to of targets){
      const b=st.board.slice();
      b[from]=null; b[to]=color;
      let score=formsMill(b,to,color)?100:0;
      score+=Math.random()*5;
      moves.push({from,to,score});
    }
  }

  if(!moves.length){
    st.winner="w";
    room.state=st;
    renderRoom();
    return;
  }

  moves.sort((a,b)=>b.score-a.score);
  const pick=moves[0];
  st.board[pick.from]=null;
  st.board[pick.to]=color;

  if(formsMill(st.board,pick.to,color)){
    st.mustRemove=true;
    room.state=st;
    renderRoom();
    scheduleComputerTurn();
    return;
  }

  st.turn=other;
  room.state=st;
  renderRoom();
}


const TETRIS_COLS=10;
const TETRIS_ROWS=20;
const TETRIS_HIGH_KEY="pajaziti-tetris-high";
const TETROMINOES=[
  {name:"I",m:[[1,1,1,1]]},
  {name:"O",m:[[1,1],[1,1]]},
  {name:"T",m:[[0,1,0],[1,1,1]]},
  {name:"S",m:[[0,1,1],[1,1,0]]},
  {name:"Z",m:[[1,1,0],[0,1,1]]},
  {name:"J",m:[[1,0,0],[1,1,1]]},
  {name:"L",m:[[0,0,1],[1,1,1]]}
];
let tetris=null;
let tetrisTimer=null;
let tetrisKeyHandler=null;
let tetrisScoresChannel=null;

function startTetrisScoreRealtime(){
  if(tetrisScoresChannel) return;
  tetrisScoresChannel=supabase
    .channel("tetris-scores-live")
    .on("postgres_changes",{event:"*",schema:"public",table:"tetris_scores"},()=>{
      if(document.getElementById("tetrisLeaderboard")) loadTetrisLeaderboard();
      if(document.getElementById("tetrisLobbyLeaderboard")) loadTetrisLeaderboard("tetrisLobbyLeaderboard");
    })
    .subscribe();
}

function stopTetris(){
  if(tetrisTimer){ clearInterval(tetrisTimer); tetrisTimer=null; }
  if(tetrisKeyHandler){ document.removeEventListener("keydown",tetrisKeyHandler); tetrisKeyHandler=null; }
}

function tetrisPiece(){
  const p=TETROMINOES[Math.floor(Math.random()*TETROMINOES.length)];
  return {
    name:p.name,
    m:p.m.map(row=>row.slice()),
    x:Math.floor((TETRIS_COLS-p.m[0].length)/2),
    y:-1
  };
}

function tetrisRotate(matrix){
  return matrix[0].map((_,i)=>matrix.map(row=>row[i]).reverse());
}

function tetrisCollides(piece,dx=0,dy=0,matrix=piece.m){
  for(let r=0;r<matrix.length;r++){
    for(let c=0;c<matrix[r].length;c++){
      if(!matrix[r][c]) continue;
      const x=piece.x+c+dx;
      const y=piece.y+r+dy;
      if(x<0||x>=TETRIS_COLS||y>=TETRIS_ROWS) return true;
      if(y>=0 && tetris.board[y][x]) return true;
    }
  }
  return false;
}

function tetrisMerge(){
  const p=tetris.current;
  p.m.forEach((row,r)=>row.forEach((v,c)=>{
    if(!v) return;
    const y=p.y+r;
    const x=p.x+c;
    if(y>=0 && y<TETRIS_ROWS) tetris.board[y][x]=p.name;
  }));
}

function tetrisClearLines(){
  let cleared=0;
  for(let r=TETRIS_ROWS-1;r>=0;r--){
    if(tetris.board[r].every(Boolean)){
      tetris.board.splice(r,1);
      tetris.board.unshift(Array(TETRIS_COLS).fill(null));
      cleared++;
      r++;
    }
  }
  if(!cleared) return;
  playTetrisSound("line");
  const points=[0,100,300,500,800][cleared]||1200;
  tetris.lines+=cleared;
  tetris.score+=points*tetris.level;
  tetris.level=1+Math.floor(tetris.lines/10);
  const high=Math.max(Number(localStorage.getItem(TETRIS_HIGH_KEY)||0),tetris.score);
  localStorage.setItem(TETRIS_HIGH_KEY,String(high));
  tetrisRestartTimer();
}

function tetrisSpawn(){
  tetris.current=tetrisPiece();
  if(tetrisCollides(tetris.current,0,0)){
    tetris.gameOver=true;
    stopTetris();
    setTimeout(saveTetrisScore,0);
  }
}

function tetrisStep(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  if(!tetrisCollides(tetris.current,0,1)){
    tetris.current.y++;
  }else{
    tetrisMerge();
    tetrisClearLines();
    tetrisSpawn();
  }
  renderTetrisBoard();
}

function tetrisRestartTimer(){
  if(tetrisTimer) clearInterval(tetrisTimer);
  if(!tetris || tetris.paused || tetris.gameOver) return;
  const speed=Math.max(110,700-(tetris.level-1)*55);
  tetrisTimer=setInterval(tetrisStep,speed);
}

function tetrisMove(dx){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  if(!tetrisCollides(tetris.current,dx,0)) { tetris.current.x+=dx; playTetrisSound("move"); }
  renderTetrisBoard();
}

function tetrisSoftDrop(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  if(!tetrisCollides(tetris.current,0,1)){
    tetris.current.y++;
    tetris.score+=1;
  }else{
    tetrisStep();
    return;
  }
  renderTetrisBoard();
}

function tetrisHardDrop(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  let n=0;
  while(!tetrisCollides(tetris.current,0,1)){
    tetris.current.y++;
    n++;
  }
  tetris.score+=n*2;
  playTetrisSound("drop");
  tetrisMerge();
  tetrisClearLines();
  tetrisSpawn();
  renderTetrisBoard();
}

function tetrisTurn(){
  if(!tetris || tetris.paused || tetris.gameOver) return;
  const rotated=tetrisRotate(tetris.current.m);
  for(const kick of [0,-1,1,-2,2]){
    if(!tetrisCollides(tetris.current,kick,0,rotated)){
      tetris.current.x+=kick;
      tetris.current.m=rotated;
      playTetrisSound("rotate");
      break;
    }
  }
  renderTetrisBoard();
}

function tetrisPause(){
  if(!tetris || tetris.gameOver) return;
  tetris.paused=!tetris.paused;
  if(tetris.paused){
    if(tetrisTimer){clearInterval(tetrisTimer);tetrisTimer=null;}
  }else{
    tetrisRestartTimer();
  }
  renderTetrisBoard();
}

function renderTetrisBoard(){
  if(!tetris) return;
  const boardEl=document.getElementById("tetrisBoard");
  if(!boardEl) return;

  const visible=tetris.board.map(row=>row.slice());
  const p=tetris.current;
  if(p && !tetris.gameOver){
    p.m.forEach((row,r)=>row.forEach((v,c)=>{
      if(!v) return;
      const y=p.y+r,x=p.x+c;
      if(y>=0&&y<TETRIS_ROWS&&x>=0&&x<TETRIS_COLS) visible[y][x]=p.name;
    }));
  }

  boardEl.innerHTML=visible.flatMap((row,r)=>row.map((v,c)=>
    `<div class="tetris-cell${v?" filled piece-"+v:""}"></div>`
  )).join("");

  const score=document.getElementById("tetrisScore");
  const lines=document.getElementById("tetrisLines");
  const level=document.getElementById("tetrisLevel");
  const high=document.getElementById("tetrisHigh");
  if(score) score.textContent=String(tetris.score);
  if(lines) lines.textContent=String(tetris.lines);
  if(level) level.textContent=String(tetris.level);
  if(high) high.textContent=String(Math.max(Number(localStorage.getItem(TETRIS_HIGH_KEY)||0),tetris.score));

  const pause=document.getElementById("tetrisPause");
  if(pause) pause.textContent=tetris.paused?"▶️ Vazhdo":"⏸️ Pauzë";

  const overlay=document.getElementById("tetrisOverlay");
  if(overlay){
    overlay.classList.toggle("hidden",!tetris.gameOver&&!tetris.paused);
    overlay.innerHTML=tetris.gameOver
      ? `<div><strong>Game Over</strong><br><span>Score: ${tetris.score}</span></div>`
      : tetris.paused ? "<strong>Pauzë</strong>" : "";
  }
}

async function loadTetrisLeaderboard(targetId="tetrisLeaderboard"){
  const el=document.getElementById(targetId);
  if(!el) return;
  try{
    const {data,error}=await supabase
      .from("tetris_scores")
      .select("device_id,display_name,best_score,best_lines,updated_at")
      .order("best_score",{ascending:false})
      .order("best_lines",{ascending:false})
      .limit(20);
    if(error) throw error;
    if(!document.getElementById(targetId)) return;

    const rows=(data||[]).map((r,i)=>`
      <div class="tetris-rank-row">
        <span>${i===0?"👑":(i+1)+"."} ${escapeHtml(r.display_name)}</span>
        <strong>${r.best_score} pts · ${r.best_lines} lines</strong>
      </div>`).join("");

    el.innerHTML=`
      <h3>🏆 Rekordet Blloqe</h3>
      <div class="tetris-ranking">${rows || '<div class="muted">Ende nuk ka rezultate.</div>'}</div>`;
  }catch(error){
    console.warn("Blloqe leaderboard",error);
    if(document.getElementById(targetId)) el.innerHTML='<div class="muted">Renditja nuk u ngarkua.</div>';
  }
}

async function saveTetrisScore(){
  if(!tetris || !tetris.gameOver) return;

  const name=(localStorage.getItem(TETRIS_NAME_KEY)||"").trim().slice(0,24);
  if(!name) return;

  try{
    const {data:existing}=await supabase
      .from("tetris_scores")
      .select("best_score,best_lines")
      .eq("device_id",deviceId)
      .maybeSingle();

    const bestScore=Math.max(Number(existing?.best_score||0),Number(tetris.score||0));
    const bestLines=Math.max(
      Number(existing?.best_score||0)===bestScore ? Number(existing?.best_lines||0) : 0,
      Number(tetris.lines||0)
    );

    await supabase.from("tetris_scores").upsert({
      device_id:deviceId,
      display_name:name,
      best_score:bestScore,
      best_lines:bestLines,
      updated_at:new Date().toISOString()
    },{onConflict:"device_id"});

    await loadTetrisLeaderboard();
  }catch(error){
    console.warn("Blloqe score save",error);
  }
}

function setupTetrisTouchControls(){
  const board=document.getElementById("tetrisBoard");
  if(!board) return;

  let holdTimer=null;
  let holding=false;
  let moved=false;
  let startX=0;
  let startY=0;
  let lastX=0;
  let lastY=0;
  let activePointer=null;

  const clearHold=()=>{
    if(holdTimer){ clearTimeout(holdTimer); holdTimer=null; }
  };

  const movePieceToward=(clientX,clientY)=>{
    if(!tetris || tetris.paused || tetris.gameOver || !tetris.current) return;

    const rect=board.getBoundingClientRect();
    const cellW=rect.width/TETRIS_COLS;
    const cellH=rect.height/TETRIS_ROWS;
    const pieceWidth=tetris.current.m[0].length;

    const targetCol=Math.max(
      0,
      Math.min(
        TETRIS_COLS-pieceWidth,
        Math.round((clientX-rect.left)/cellW-pieceWidth/2)
      )
    );

    while(tetris.current.x<targetCol && !tetrisCollides(tetris.current,1,0)){
      tetris.current.x++;
      playTetrisSound("move");
    }
    while(tetris.current.x>targetCol && !tetrisCollides(tetris.current,-1,0)){
      tetris.current.x--;
      playTetrisSound("move");
    }

    const deltaY=clientY-lastY;
    if(deltaY>cellH*0.55){
      const steps=Math.min(6,Math.max(1,Math.floor(deltaY/cellH)));
      for(let i=0;i<steps;i++){
        if(tetrisCollides(tetris.current,0,1)) break;
        tetris.current.y++;
        tetris.score+=1;
      }
      lastY=clientY;
    }

    renderTetrisBoard();
  };

  board.addEventListener("pointerdown",(event)=>{
    if(!tetris || tetris.paused || tetris.gameOver) return;
    event.preventDefault();

    activePointer=event.pointerId;
    startX=lastX=event.clientX;
    startY=lastY=event.clientY;
    holding=false;
    moved=false;

    try{ board.setPointerCapture(event.pointerId); }catch(_){}

    clearHold();
    holdTimer=setTimeout(()=>{
      holding=true;
      board.classList.add("tetris-dragging");
      playTetrisSound("move");
      movePieceToward(lastX,lastY);
    },260);
  });

  board.addEventListener("pointermove",(event)=>{
    if(activePointer!==event.pointerId) return;
    lastX=event.clientX;

    if(Math.abs(event.clientX-startX)>8 || Math.abs(event.clientY-startY)>8){
      moved=true;
    }

    if(holding){
      event.preventDefault();
      movePieceToward(event.clientX,event.clientY);
    }
  });

  const finish=(event)=>{
    if(activePointer!==event.pointerId) return;
    event.preventDefault();
    clearHold();

    if(holding){
      movePieceToward(event.clientX,event.clientY);
    }else if(!moved){
      tetrisTurn();
    }

    holding=false;
    moved=false;
    activePointer=null;
    board.classList.remove("tetris-dragging");

    try{ board.releasePointerCapture(event.pointerId); }catch(_){}
  };

  board.addEventListener("pointerup",finish);
  board.addEventListener("pointercancel",(event)=>{
    if(activePointer!==event.pointerId) return;
    clearHold();
    holding=false;
    moved=false;
    activePointer=null;
    board.classList.remove("tetris-dragging");
  });

  board.addEventListener("contextmenu",(event)=>event.preventDefault());
}

async function enterTetrisFullscreen(){
  document.body.classList.add("tetris-fullscreen-active");
  try{
    const el=document.documentElement;
    if(!document.fullscreenElement && el.requestFullscreen){
      await el.requestFullscreen();
    }
  }catch(_){
    // CSS fullscreen fallback remains active when browser fullscreen is blocked.
  }
}

async function exitTetrisFullscreen(){
  document.body.classList.remove("tetris-fullscreen-active");
  try{
    if(document.fullscreenElement && document.exitFullscreen){
      await document.exitFullscreen();
    }
  }catch(_){}
}

function startTetrisGame(){
  enterTetrisFullscreen();
  const playerName=(document.getElementById("tetrisPlayerName")?.value || localStorage.getItem(TETRIS_NAME_KEY) || "").trim().slice(0,24);
  if(!playerName){ exitTetrisFullscreen(); renderLobby(tr("needName")); return; }
  localStorage.setItem(TETRIS_NAME_KEY,playerName);
  if(channel){supabase.removeChannel(channel);channel=null;}
  if(aiTimer){clearTimeout(aiTimer);aiTimer=null;}
  stopTetris();
  room=null;
  selected=null;

  tetris={
    board:Array.from({length:TETRIS_ROWS},()=>Array(TETRIS_COLS).fill(null)),
    current:null,
    score:0,
    lines:0,
    level:1,
    paused:false,
    gameOver:false
  };
  tetrisSpawn();

  root.innerHTML=`
    <div class="games-shell tetris-shell">
      <section class="card tetris-card">
        <div class="game-room-head">
          <div>
            <div class="muted small">🧱</div>
            <div class="game-room-code">Blloqe</div>
          </div>
          <button id="tetrisBack" class="secondary" type="button">${tr("backGames")}</button>
        </div>

        <div class="tetris-stats">
          <div><span>Score</span><strong id="tetrisScore">0</strong></div>
          <div><span>Lines</span><strong id="tetrisLines">0</strong></div>
          <div><span>Level</span><strong id="tetrisLevel">1</strong></div>
          <div><span>Best</span><strong id="tetrisHigh">${localStorage.getItem(TETRIS_HIGH_KEY)||0}</strong></div>
        </div>

        <div class="tetris-board-wrap">
          <div id="tetrisBoard" class="tetris-board"></div>
          <div id="tetrisOverlay" class="tetris-overlay hidden"></div>
        </div>

        <div class="tetris-touch-help">👆 Prek 1 herë = rrotullo · ✋ Mbaje dhe tërhiqe = lëvize</div>\n\n        <div class="tetris-controls">
          <button type="button" data-tetris="left">⬅️</button>
          <button type="button" data-tetris="rotate">⤾</button>
          <button type="button" data-tetris="right">➡️</button>
          <button type="button" data-tetris="down">⬇️</button>
          <button type="button" data-tetris="drop">⏬</button>
        </div>

        <div class="tetris-actions">
          <button id="tetrisPause" class="secondary" type="button">⏸️ Pauzë</button>
          <button id="tetrisSound" class="secondary" type="button">${tetrisSoundEnabled?"🔊 Zëri ON":"🔇 Zëri OFF"}</button>
          <button id="tetrisNew" class="primary" type="button">🔄 ${tr("newGame")}</button>
        </div>

        <section id="tetrisLeaderboard" class="tetris-leaderboard">
          <div class="muted">🏆 Po ngarkohet renditja…</div>
        </section>
      </section>
    </div>`;

  document.getElementById("tetrisBack").onclick=async()=>{stopTetris();tetris=null;await exitTetrisFullscreen();renderLobby();};
  document.getElementById("tetrisPause").onclick=tetrisPause;
  const tetrisSoundBtn=document.getElementById("tetrisSound");
  if(tetrisSoundBtn) tetrisSoundBtn.onclick=()=>{ setTetrisSound(!tetrisSoundEnabled); tetrisSoundBtn.textContent=tetrisSoundEnabled?"🔊 Zëri ON":"🔇 Zëri OFF"; };
  document.getElementById("tetrisNew").onclick=startTetrisGame;
  root.querySelectorAll("[data-tetris]").forEach(btn=>{
    const action=btn.dataset.tetris;
    const run=()=>{
      if(action==="left")tetrisMove(-1);
      else if(action==="right")tetrisMove(1);
      else if(action==="rotate")tetrisTurn();
      else if(action==="down")tetrisSoftDrop();
      else if(action==="drop")tetrisHardDrop();
    };
    btn.addEventListener("click",run);
  });

  tetrisKeyHandler=(event)=>{
    if(!root.contains(document.getElementById("tetrisBoard"))) return;
    if(["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," ","p","P"].includes(event.key)) event.preventDefault();
    if(event.key==="ArrowLeft")tetrisMove(-1);
    else if(event.key==="ArrowRight")tetrisMove(1);
    else if(event.key==="ArrowDown")tetrisSoftDrop();
    else if(event.key==="ArrowUp")tetrisTurn();
    else if(event.key===" ")tetrisHardDrop();
    else if(event.key==="p"||event.key==="P")tetrisPause();
  };
  document.addEventListener("keydown",tetrisKeyHandler);
  setupTetrisTouchControls();

  renderTetrisBoard();
  loadTetrisLeaderboard();
  playTetrisSound("start");
  tetrisRestartTimer();
}


async function activate(){
  startTetrisScoreRealtime();
  if(tabLabel)tabLabel.textContent=tr("games");
  await loadGameOrder();
  if(room)renderRoom();else renderLobby();
}

async function reloadSettings(){
  await loadGameOrder();
  if(!room) renderLobby();
}

document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement && !document.getElementById("tetrisBoard")){
    document.body.classList.remove("tetris-fullscreen-active");
  }
});

window.PajazitiGames={activate,reloadSettings,reloadLanguage:()=>{if(!room)renderLobby();else renderRoom();}};
if(tabLabel)tabLabel.textContent=tr("games");
