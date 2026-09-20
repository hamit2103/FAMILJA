import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const FAMILY_EMAIL = "familja@familja.local";
const ADMIN_EMAIL = "admin@familja.local";
const BUCKET = "familja-media";
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const IMAGE_MAX_DIMENSION = 1920;
const IMAGE_QUALITY = 0.78;
const IMAGE_OPTIMIZE_MIN_SIZE = 350 * 1024;
const FAMILY_PHOTO_LIMIT = 3;
const FREE_STORAGE_LIMIT_BYTES = 1024 * 1024 * 1024;

const configured =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

const supabase = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

const $ = (id) => document.getElementById(id);

const LANGUAGE_KEY = "pajaziti-language";
const I18N = {
  sq: {
    "language.label":"Gjuha","app.subtitle":"Album privat për foto dhe video","mode.family":"Familja","mode.admin":"Admin",
    "login.label":"Kodi i hyrjes","login.placeholder":"Shkruaj kodin","login.adminPlaceholder":"Kodi i administratorit","login.familyPlaceholder":"Kodi i familjes",
    "login.button":"Hyr","install.app":"Instalo aplikacionin","install.short":"Instalo","share":"Ndaje APK-në","logout":"Dil","online":"Online:",
    "auth.note":"Kodi kontrollohet përmes Supabase Authentication. Fotot dhe videot ruhen privatisht në Supabase dhe nuk ruhen në telefonin e vizitorit, përveç nëse ai zgjedh t’i shkarkojë.",
    "tabs.photos":"Foto","tabs.info":"Informacion","tabs.prayer":"Namazi","upload.addPhoto":"Shto foto","upload.addMedia":"Shto foto ose video",
    "upload.adminHint":"Administratori mund të ngarkojë foto dhe video.","upload.familyTitle":"Shto fotot e tua","upload.button":"Ngarko",
    "upload.familyHint":"Ke ngarkuar {used}/3 foto. Mund të shtosh edhe {remaining}.","storage.title":"Hapësira e përdorur",
    "storage.adminOnly":"E dukshme vetëm për administratorin","materials":" materiale","refresh":"Rifresko",
    "empty.mediaTitle":"Ende nuk ka materiale","empty.mediaBody":"Kur administratori të ngarkojë foto ose video, ato do të shfaqen këtu automatikisht.",
    "info.title":"Informacion","info.familyWrite":"Vetëm administratori mund të shkruajë këtu.","info.name":"Emri","info.namePlaceholder":"Shkruaj emrin tënd",
    "info.message":"Mesazhi","info.messagePlaceholder":"Shkruaj informacionin...","info.publish":"Publiko","info.notes":" shënime",
    "info.emptyTitle":"Ende nuk ka informacion","info.emptyBody":"Kur administratori të publikojë diçka, do të shfaqet këtu.","role.admin":"Administrator","role.family":"Anëtar i familjes",
    "download":"Shkarko","delete":"Fshi","material":"Material","photo":"Foto","confirm.delete":"Ta fshij këtë material?","confirm.deleteInfo":"Ta fshij këtë informacion?",
    "prayer.title":"Koha e namazit","prayer.locationPrompt":"Zgjidh vendndodhjen e telefonit.","prayer.locationBtn":"Vendndodhja",
    "prayer.method":"Ora llogaritet sipas vendndodhjes së telefonit me metodën Diyanet.","prayer.alarmTitle":"🔔 Alarmet janë sipas dëshirës.",
    "prayer.alarmBody":"Aktivizo vetëm namazet për të cilat dëshiron njoftim në këtë telefon. Në APK Android alarmi regjistrohet në sistem dhe punon edhe kur aplikacioni është i mbyllur.",
    "prayer.Fajr":"Sabahu","prayer.Dhuhr":"Dreka","prayer.Asr":"Ikindia","prayer.Maghrib":"Akshami","prayer.Isha":"Jacia",
    "prayer.next":"Namazi i radhës: {name} në {time}","prayer.nextTomorrow":"Namazi i radhës: Sabahu nesër","prayer.zone":"Zona: {zone}",
    "alarm.on":"🔔 Alarm ON","alarm.off":"🔕 Alarm OFF","alarm.activating":"Po regjistroj alarmin sistemor për {name}…","alarm.activated":"Alarmi sistemor për {name} u aktivizua.",
    "alarm.webActivated":"Alarmi u aktivizua. Për alarm edhe kur app-i është i mbyllur përdor APK Android.","alarm.disabled":"Alarmi për {name} u çaktivizua.",
    "alarm.title":"🕌 Koha e namazit","alarm.body":"Është koha e {name} ({time}).","alarm.stop":"Ndalo","alarm.channel":"Alarmet e namazit","alarm.channelDesc":"Alarm për kohën e namazit",
    "login.enterCode":"Shkruaj kodin.","login.checking":"Po kontrolloj kodin…","login.badCode":"Kodi nuk përputhet me këtë llogari.","login.emailUnconfirmed":"Llogaria në Supabase nuk është konfirmuar ende.",
    "login.rateLimit":"Shumë tentativa. Prit pak dhe provo përsëri.","login.failed":"Nuk mund të hyhet. Kontrollo kodin.",
    "info.enterName":"Shkruaj emrin.","info.enterMessage":"Shkruaj mesazhin.","info.publishing":"Po publikohet...","info.published":"U publikua.",
    "family.limit":"E ke arritur kufirin prej 3 fotove. Fshi një nga fotot e tua për të ngarkuar një tjetër.","family.onlyOwnDelete":"Mund të fshish vetëm fotot që ke ngarkuar vetë.",
    "family.onlyPhotos":"Anëtarët e familjes mund të ngarkojnë vetëm foto.","family.remaining":"Mund të ngarkosh vetëm {remaining} foto të tjera. Kufiri është 3 foto për person/pajisje.",
    "upload.chooseMedia":"Zgjidh së paku një foto ose video.","upload.choosePhoto":"Zgjidh së paku një foto.","upload.none":"Asnjë skedar nuk u ngarkua.",
    "upload.done":"U ngarkuan {count} materiale.","location.permission":"Duhet ta lejosh vendndodhjen për oraret e namazit.","location.notFound":"Vendndodhja nuk u gjet. Provo përsëri.",
    "location.timeout":"Vendndodhja vonoi shumë. Provo përsëri.","location.loading":"Po marr vendndodhjen…","prayer.loading":"Po marr oraret…","prayer.updated":"Oraret u përditësuan.",
    "share.text":"Shkarko dhe instalo APK-në PAJAZITI në Android.","share.copied":"Linku i APK-së u kopjua. Tani mund ta dërgosh.",
    "error.supabaseNotLinked":"Supabase nuk është lidhur ende. Duhet Project URL dhe anon key.","error.infoNotReady":"Informacioni nuk është gati ende.","error.publishFailed":"Publikimi dështoi: {error}",
    "error.locationUnsupported":"Ky telefon nuk e mbështet vendndodhjen.","error.prayerFetch":"Nuk u morën oraret e namazit.","prayer.locationTap":"Preke “Vendndodhja” për oraret e sakta.",
    "error.futureTimes":"Nuk u gjetën orare të ardhshme për {name}.","error.supabaseNotReady":"Supabase nuk është gati ende","error.runSql":"Duhet të ekzekutohet skedari supabase/setup.sql në SQL Editor.",
    "error.storageSql":"Matësi kërkon përditësimin e SQL.","error.fileTooLarge":"{name} është mbi 50 MB edhe pas optimizimit dhe u anashkalua.","upload.savedSpace":"U kursyen rreth {size} hapësirë.",
    "upload.skipped":"{count} skedarë u anashkaluan.","error.uploadFailed":"Ngarkimi dështoi: {error}","error.setupSupabase":"Kodi i aplikacionit është kaluar në Supabase Free. Tani duhet vetëm ta lidhim projektin Supabase.",
    "install.chrome":"Në Chrome, hap menunë ⋮ dhe zgjidh “Install app” ose “Add to Home screen”."
  },
  de: {
    "language.label":"Sprache","app.subtitle":"Privates Album für Fotos und Videos","mode.family":"Familie","mode.admin":"Admin",
    "login.label":"Zugangscode","login.placeholder":"Code eingeben","login.adminPlaceholder":"Administrator-Code","login.familyPlaceholder":"Familien-Code",
    "login.button":"Anmelden","install.app":"App installieren","install.short":"Installieren","share":"APK teilen","logout":"Abmelden","online":"Online:",
    "auth.note":"Der Code wird über Supabase Authentication geprüft. Fotos und Videos werden privat in Supabase gespeichert und nicht auf dem Gerät des Besuchers gespeichert, außer er lädt sie herunter.",
    "tabs.photos":"Fotos","tabs.info":"Information","tabs.prayer":"Gebet","upload.addPhoto":"Foto hinzufügen","upload.addMedia":"Foto oder Video hinzufügen",
    "upload.adminHint":"Der Administrator kann Fotos und Videos hochladen.","upload.familyTitle":"Deine Fotos hinzufügen","upload.button":"Hochladen",
    "upload.familyHint":"Du hast {used}/3 Fotos hochgeladen. Du kannst noch {remaining} hinzufügen.","storage.title":"Verwendeter Speicher",
    "storage.adminOnly":"Nur für den Administrator sichtbar","materials":" Medien","refresh":"Aktualisieren",
    "empty.mediaTitle":"Noch keine Medien","empty.mediaBody":"Wenn der Administrator Fotos oder Videos hochlädt, erscheinen sie hier automatisch.",
    "info.title":"Information","info.familyWrite":"Nur der Administrator kann hier schreiben.","info.name":"Name","info.namePlaceholder":"Deinen Namen eingeben",
    "info.message":"Nachricht","info.messagePlaceholder":"Information eingeben...","info.publish":"Veröffentlichen","info.notes":" Einträge",
    "info.emptyTitle":"Noch keine Informationen","info.emptyBody":"Wenn der Administrator etwas veröffentlicht, erscheint es hier.","role.admin":"Administrator","role.family":"Familienmitglied",
    "download":"Herunterladen","delete":"Löschen","material":"Medium","photo":"Foto","confirm.delete":"Dieses Medium löschen?","confirm.deleteInfo":"Diese Information löschen?",
    "prayer.title":"Gebetszeiten","prayer.locationPrompt":"Standort des Telefons auswählen.","prayer.locationBtn":"Standort",
    "prayer.method":"Die Zeiten werden anhand des Telefonstandorts nach der Diyanet-Methode berechnet.","prayer.alarmTitle":"🔔 Alarme sind optional.",
    "prayer.alarmBody":"Aktiviere nur die Gebete, für die du auf diesem Telefon eine Benachrichtigung möchtest. In der Android-APK wird der Alarm im System registriert und funktioniert auch bei geschlossener App.",
    "prayer.Fajr":"Fajr","prayer.Dhuhr":"Dhuhr","prayer.Asr":"Asr","prayer.Maghrib":"Maghrib","prayer.Isha":"Isha",
    "prayer.next":"Nächstes Gebet: {name} um {time}","prayer.nextTomorrow":"Nächstes Gebet: Fajr morgen","prayer.zone":"Zone: {zone}",
    "alarm.on":"🔔 Alarm AN","alarm.off":"🔕 Alarm AUS","alarm.activating":"Systemalarm für {name} wird eingerichtet…","alarm.activated":"Systemalarm für {name} wurde aktiviert.",
    "alarm.webActivated":"Alarm aktiviert. Für einen Alarm auch bei geschlossener App verwende die Android-APK.","alarm.disabled":"Alarm für {name} wurde deaktiviert.",
    "alarm.title":"🕌 Gebetszeit","alarm.body":"Es ist Zeit für {name} ({time}).","alarm.stop":"Stoppen","alarm.channel":"Gebetsalarme","alarm.channelDesc":"Alarm zur Gebetszeit",
    "login.enterCode":"Code eingeben.","login.checking":"Code wird geprüft…","login.badCode":"Der Code passt nicht zu diesem Konto.","login.emailUnconfirmed":"Das Supabase-Konto wurde noch nicht bestätigt.",
    "login.rateLimit":"Zu viele Versuche. Warte kurz und versuche es erneut.","login.failed":"Anmeldung nicht möglich. Prüfe den Code.",
    "info.enterName":"Name eingeben.","info.enterMessage":"Nachricht eingeben.","info.publishing":"Wird veröffentlicht...","info.published":"Veröffentlicht.",
    "family.limit":"Du hast das Limit von 3 Fotos erreicht. Lösche eines deiner Fotos, um ein neues hochzuladen.","family.onlyOwnDelete":"Du kannst nur Fotos löschen, die du selbst hochgeladen hast.",
    "family.onlyPhotos":"Familienmitglieder können nur Fotos hochladen.","family.remaining":"Du kannst nur noch {remaining} Foto(s) hochladen. Das Limit beträgt 3 Fotos pro Person/Gerät.",
    "upload.chooseMedia":"Wähle mindestens ein Foto oder Video aus.","upload.choosePhoto":"Wähle mindestens ein Foto aus.","upload.none":"Keine Datei wurde hochgeladen.",
    "upload.done":"{count} Medien wurden hochgeladen.","location.permission":"Erlaube den Standortzugriff für die Gebetszeiten.","location.notFound":"Standort nicht gefunden. Versuche es erneut.",
    "location.timeout":"Standortabfrage dauerte zu lange. Versuche es erneut.","location.loading":"Standort wird ermittelt…","prayer.loading":"Gebetszeiten werden geladen…","prayer.updated":"Gebetszeiten wurden aktualisiert.",
    "share.text":"Lade die PAJAZITI-APK herunter und installiere sie auf Android.","share.copied":"Der APK-Link wurde kopiert. Du kannst ihn jetzt senden.",
    "error.supabaseNotLinked":"Supabase ist noch nicht verbunden. Project URL und anon key werden benötigt.","error.infoNotReady":"Die Informationen sind noch nicht verfügbar.","error.publishFailed":"Veröffentlichen fehlgeschlagen: {error}",
    "error.locationUnsupported":"Dieses Telefon unterstützt keinen Standortzugriff.","error.prayerFetch":"Gebetszeiten konnten nicht geladen werden.","prayer.locationTap":"Tippe auf „Standort“ für genaue Gebetszeiten.",
    "error.futureTimes":"Keine zukünftigen Zeiten für {name} gefunden.","error.supabaseNotReady":"Supabase ist noch nicht bereit","error.runSql":"Die Datei supabase/setup.sql muss im SQL Editor ausgeführt werden.",
    "error.storageSql":"Der Speicherzähler benötigt das SQL-Update.","error.fileTooLarge":"{name} ist auch nach der Optimierung größer als 50 MB und wurde übersprungen.","upload.savedSpace":"Etwa {size} Speicher wurden gespart.",
    "upload.skipped":"{count} Datei(en) wurden übersprungen.","error.uploadFailed":"Upload fehlgeschlagen: {error}","error.setupSupabase":"Die App wurde auf Supabase Free umgestellt. Jetzt muss nur noch das Supabase-Projekt verbunden werden.",
    "install.chrome":"Öffne in Chrome das Menü ⋮ und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“."
  },
  tr: {
    "language.label":"Dil","app.subtitle":"Fotoğraf ve videolar için özel albüm","mode.family":"Aile","mode.admin":"Yönetici",
    "login.label":"Giriş kodu","login.placeholder":"Kodu gir","login.adminPlaceholder":"Yönetici kodu","login.familyPlaceholder":"Aile kodu",
    "login.button":"Giriş yap","install.app":"Uygulamayı yükle","install.short":"Yükle","share":"APK'yı paylaş","logout":"Çıkış","online":"Çevrimiçi:",
    "auth.note":"Kod Supabase Authentication üzerinden kontrol edilir. Fotoğraf ve videolar Supabase'de özel olarak saklanır ve ziyaretçi indirmeyi seçmedikçe telefonuna kaydedilmez.",
    "tabs.photos":"Fotoğraflar","tabs.info":"Bilgi","tabs.prayer":"Namaz","upload.addPhoto":"Fotoğraf ekle","upload.addMedia":"Fotoğraf veya video ekle",
    "upload.adminHint":"Yönetici fotoğraf ve video yükleyebilir.","upload.familyTitle":"Fotoğraflarını ekle","upload.button":"Yükle",
    "upload.familyHint":"{used}/3 fotoğraf yükledin. {remaining} tane daha ekleyebilirsin.","storage.title":"Kullanılan alan",
    "storage.adminOnly":"Yalnızca yönetici görebilir","materials":" medya","refresh":"Yenile",
    "empty.mediaTitle":"Henüz medya yok","empty.mediaBody":"Yönetici fotoğraf veya video yüklediğinde burada otomatik olarak görünecek.",
    "info.title":"Bilgi","info.familyWrite":"Buraya yalnızca yönetici yazabilir.","info.name":"İsim","info.namePlaceholder":"Adını yaz",
    "info.message":"Mesaj","info.messagePlaceholder":"Bilgiyi yaz...","info.publish":"Yayınla","info.notes":" not",
    "info.emptyTitle":"Henüz bilgi yok","info.emptyBody":"Yönetici bir şey yayınladığında burada görünecek.","role.admin":"Yönetici","role.family":"Aile üyesi",
    "download":"İndir","delete":"Sil","material":"Medya","photo":"Fotoğraf","confirm.delete":"Bu medya silinsin mi?","confirm.deleteInfo":"Bu bilgi silinsin mi?",
    "prayer.title":"Namaz vakitleri","prayer.locationPrompt":"Telefonun konumunu seç.","prayer.locationBtn":"Konum",
    "prayer.method":"Vakitler telefonun konumuna göre Diyanet yöntemiyle hesaplanır.","prayer.alarmTitle":"🔔 Alarmlar isteğe bağlıdır.",
    "prayer.alarmBody":"Bu telefonda bildirim almak istediğin namazlar için alarmı aç. Android APK'da alarm sisteme kaydedilir ve uygulama kapalıyken de çalışır.",
    "prayer.Fajr":"Sabah","prayer.Dhuhr":"Öğle","prayer.Asr":"İkindi","prayer.Maghrib":"Akşam","prayer.Isha":"Yatsı",
    "prayer.next":"Sıradaki namaz: {name} {time}","prayer.nextTomorrow":"Sıradaki namaz: Sabah yarın","prayer.zone":"Bölge: {zone}",
    "alarm.on":"🔔 Alarm AÇIK","alarm.off":"🔕 Alarm KAPALI","alarm.activating":"{name} için sistem alarmı ayarlanıyor…","alarm.activated":"{name} için sistem alarmı etkinleştirildi.",
    "alarm.webActivated":"Alarm etkinleştirildi. Uygulama kapalıyken de çalması için Android APK'yı kullan.","alarm.disabled":"{name} alarmı kapatıldı.",
    "alarm.title":"🕌 Namaz vakti","alarm.body":"{name} vakti geldi ({time}).","alarm.stop":"Durdur","alarm.channel":"Namaz alarmları","alarm.channelDesc":"Namaz vakti alarmı",
    "login.enterCode":"Kodu gir.","login.checking":"Kod kontrol ediliyor…","login.badCode":"Kod bu hesapla eşleşmiyor.","login.emailUnconfirmed":"Supabase hesabı henüz doğrulanmamış.",
    "login.rateLimit":"Çok fazla deneme. Biraz bekleyip tekrar dene.","login.failed":"Giriş yapılamadı. Kodu kontrol et.",
    "info.enterName":"Adını yaz.","info.enterMessage":"Mesajını yaz.","info.publishing":"Yayınlanıyor...","info.published":"Yayınlandı.",
    "family.limit":"3 fotoğraf sınırına ulaştın. Yeni fotoğraf yüklemek için kendi fotoğraflarından birini sil.","family.onlyOwnDelete":"Yalnızca kendin yüklediğin fotoğrafları silebilirsin.",
    "family.onlyPhotos":"Aile üyeleri yalnızca fotoğraf yükleyebilir.","family.remaining":"Yalnızca {remaining} fotoğraf daha yükleyebilirsin. Sınır kişi/cihaz başına 3 fotoğraftır.",
    "upload.chooseMedia":"En az bir fotoğraf veya video seç.","upload.choosePhoto":"En az bir fotoğraf seç.","upload.none":"Hiçbir dosya yüklenmedi.",
    "upload.done":"{count} medya yüklendi.","location.permission":"Namaz vakitleri için konum izni vermelisin.","location.notFound":"Konum bulunamadı. Tekrar dene.",
    "location.timeout":"Konum çok geç yanıt verdi. Tekrar dene.","location.loading":"Konum alınıyor…","prayer.loading":"Namaz vakitleri alınıyor…","prayer.updated":"Namaz vakitleri güncellendi.",
    "share.text":"PAJAZITI APK dosyasını indir ve Android'e yükle.","share.copied":"APK bağlantısı kopyalandı. Şimdi gönderebilirsin.",
    "error.supabaseNotLinked":"Supabase henüz bağlı değil. Project URL ve anon key gerekiyor.","error.infoNotReady":"Bilgi bölümü henüz hazır değil.","error.publishFailed":"Yayınlama başarısız: {error}",
    "error.locationUnsupported":"Bu telefon konum özelliğini desteklemiyor.","error.prayerFetch":"Namaz vakitleri alınamadı.","prayer.locationTap":"Doğru namaz vakitleri için “Konum”a dokun.",
    "error.futureTimes":"{name} için gelecek vakit bulunamadı.","error.supabaseNotReady":"Supabase henüz hazır değil","error.runSql":"supabase/setup.sql dosyası SQL Editor'de çalıştırılmalı.",
    "error.storageSql":"Depolama göstergesi SQL güncellemesini gerektiriyor.","error.fileTooLarge":"{name}, optimizasyondan sonra da 50 MB'tan büyük olduğu için atlandı.","upload.savedSpace":"Yaklaşık {size} alan tasarrufu sağlandı.",
    "upload.skipped":"{count} dosya atlandı.","error.uploadFailed":"Yükleme başarısız: {error}","error.setupSupabase":"Uygulama Supabase Free'a geçirildi. Şimdi yalnızca Supabase projesinin bağlanması gerekiyor.",
    "install.chrome":"Chrome'da ⋮ menüsünü aç ve “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini seç."
  }
};

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "sq";
if (!I18N[currentLanguage]) currentLanguage = "sq";

function t(key, vars = {}) {
  let value = I18N[currentLanguage]?.[key] ?? I18N.sq[key] ?? key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll("{" + name + "}", String(replacement));
  }
  return value;
}

function prayerLabel(key) {
  return t("prayer." + key);
}

function applyLanguage(language = currentLanguage) {
  if (!I18N[language]) language = "sq";
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  const loginSelect = document.getElementById("languageSelectLogin");
  const appSelect = document.getElementById("languageSelectApp");
  if (loginSelect) loginSelect.value = language;
  if (appSelect) appSelect.value = language;

  if (typeof mode !== "undefined" && codeInput) {
    codeInput.placeholder = mode === "admin"
      ? t("login.adminPlaceholder")
      : t("login.familyPlaceholder");
  }

  if (currentUser) {
    roleLabel.textContent = isAdmin() ? t("role.admin") : t("role.family");
    updateUploadPanel(mediaItems);
    renderPrayerTimes();
    updateNextPrayer();
    loadMedia().catch(console.warn);
    loadInfo({ markRead: false }).catch(console.warn);
  }
}


const loginView = $("loginView");
const appView = $("appView");
const familyMode = $("familyMode");
const adminMode = $("adminMode");
const codeInput = $("codeInput");
const adminCodeWrap = $("adminCodeWrap");
const familyDirectHint = $("familyDirectHint");
const loginBtn = $("loginBtn");
const loginMessage = $("loginMessage");
const adminPanel = $("adminPanel");
const roleLabel = $("roleLabel");
const gallery = $("gallery");
const emptyState = $("emptyState");
const mediaCount = $("mediaCount");
const uploadBtn = $("uploadBtn");
const mediaInput = $("mediaInput");
const uploadStatus = $("uploadStatus");
const uploadTitle = $("uploadTitle");
const uploadHint = $("uploadHint");
const logoutBtn = $("logoutBtn");
const refreshBtn = $("refreshBtn");
const installBtn = $("installBtn");
const installLoginBtn = $("installLoginBtn");
const shareBtn = $("shareBtn");
const appTabs = $("appTabs");
const galleryTab = $("galleryTab");
const infoTab = $("infoTab");
const infoUnreadBadge = $("infoUnreadBadge");
const prayerTab = $("prayerTab");
const gamesTab = $("gamesTab");
const tvTab = $("tvTab");
const radioTab = $("radioTab");
const menuOrderAdmin = $("menuOrderAdmin");
const menuOrderList = $("menuOrderList");
const menuOrderSave = $("menuOrderSave");
const menuOrderStatus = $("menuOrderStatus");
const galleryView = $("galleryView");
const infoView = $("infoView");
const prayerView = $("prayerView");
const gamesView = $("gamesView");
const tvView = $("tvView");
const radioView = $("radioView");
const infoCompose = $("infoCompose");
const infoName = $("infoName");
const infoText = $("infoText");
const infoSendBtn = $("infoSendBtn");
const infoStatus = $("infoStatus");
const infoRefreshBtn = $("infoRefreshBtn");
const infoList = $("infoList");
const infoEmpty = $("infoEmpty");
const infoCount = $("infoCount");
const onlineCount = $("onlineCount");
const languageSelectLogin = $("languageSelectLogin");
const languageSelectApp = $("languageSelectApp");
const storageCard = $("storageCard");
const storageUsed = $("storageUsed");
const storagePercent = $("storagePercent");
const storageBar = $("storageBar");
const prayerLocation = $("prayerLocation");
const prayerLocationBtn = $("prayerLocationBtn");
const prayerNext = $("prayerNext");
const prayerStatus = $("prayerStatus");
const prayerList = $("prayerList");

languageSelectLogin?.addEventListener("change", (e) => applyLanguage(e.target.value));
languageSelectApp?.addEventListener("change", (e) => applyLanguage(e.target.value));

let mode = "family";
let realtimeChannel = null;
let installPrompt = null;
let currentUser = null;
let activeSection = "gallery";
let mediaItems = [];
let prayerTimings = null;
let prayerTimingsDate = "";
let prayerTimezone = "";
let prayerCheckTimer = null;
let prayerAudioContext = null;
let nativeCalendarCache = null;
let nativeCalendarCacheKey = "";

const DEFAULT_TAB_ORDER = ["galleryTab","infoTab","prayerTab","gamesTab","tvTab","radioTab"];
const TAB_LABELS = {
  galleryTab:"📷 Foto",
  infoTab:"ℹ️ Informacion",
  prayerTab:"🕌 Namazi",
  gamesTab:"🎮 Lojëra",
  tvTab:"📺 TV",
  radioTab:"📻 Radio"
};
const INFO_SEEN_KEY = "pajaziti-info-seen-id";
const PRAYER_COORDS_KEY = "pajaziti-prayer-coords";
const PRAYER_ALARMS_KEY = "pajaziti-prayer-alarms";
const PRAYER_LAST_ALERT_KEY = "pajaziti-prayer-last-alert";
const PRAYERS = [
  { key: "Fajr" },
  { key: "Dhuhr" },
  { key: "Asr" },
  { key: "Maghrib" },
  { key: "Isha" }
];

let prayerAlarms = (() => {
  try {
    return JSON.parse(localStorage.getItem(PRAYER_ALARMS_KEY) || "{}");
  } catch (_) {
    return {};
  }
})();

applyLanguage(currentLanguage);
setMode("family");

const PRESENCE_DEVICE_KEY = "pajaziti-presence-device";
let presenceDeviceId = localStorage.getItem(PRESENCE_DEVICE_KEY);
if (!presenceDeviceId) {
  presenceDeviceId =
    (globalThis.crypto?.randomUUID?.() || ("device_" + Math.random().toString(36).slice(2) + Date.now()));
  localStorage.setItem(PRESENCE_DEVICE_KEY, presenceDeviceId);
}

const lightbox = document.createElement("div");
lightbox.className = "lightbox hidden";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", t("photo"));

const lightboxImage = document.createElement("img");
lightboxImage.alt = "Foto";

const lightboxClose = document.createElement("button");
lightboxClose.type = "button";
lightboxClose.className = "lightbox-close";
lightboxClose.setAttribute("aria-label", "×");
lightboxClose.textContent = "×";

lightbox.appendChild(lightboxImage);
lightbox.appendChild(lightboxClose);
document.body.appendChild(lightbox);

let lightboxItems = [];
let lightboxIndex = 0;
let lightboxTouchStartX = 0;
let lightboxTouchStartY = 0;

function collectLightboxItems() {
  return Array.from(gallery.querySelectorAll(".media-card img")).map((img) => ({
    url: img.currentSrc || img.src,
    alt: img.alt || t("photo")
  }));
}

function showLightboxImage(index) {
  if (!lightboxItems.length) return;

  const total = lightboxItems.length;
  lightboxIndex = ((index % total) + total) % total;

  const item = lightboxItems[lightboxIndex];
  lightboxImage.src = item.url;
  lightboxImage.alt = item.alt || t("photo");
}

function openLightbox(url, alt = "") {
  lightboxItems = collectLightboxItems();

  let index = lightboxItems.findIndex((item) => item.url === url);
  if (index < 0) {
    lightboxItems.unshift({ url, alt: alt || t("photo") });
    index = 0;
  }

  showLightboxImage(index);
  lightbox.classList.remove("hidden");
  document.body.classList.add("lightbox-open");
}

function nextLightboxImage() {
  if (lightboxItems.length > 1) {
    showLightboxImage(lightboxIndex + 1);
  }
}

function previousLightboxImage() {
  if (lightboxItems.length > 1) {
    showLightboxImage(lightboxIndex - 1);
  }
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxImage.src = "";
  lightboxItems = [];
  document.body.classList.remove("lightbox-open");
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    lightboxTouchStartX = touch.clientX;
    lightboxTouchStartY = touch.clientY;
  },
  { passive: true }
);

lightbox.addEventListener(
  "touchend",
  (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;

    const diffX = touch.clientX - lightboxTouchStartX;
    const diffY = touch.clientY - lightboxTouchStartY;

    if (Math.abs(diffX) < 50 || Math.abs(diffX) <= Math.abs(diffY)) return;

    // Sipas kërkesës: rrëshqit djathtas = fotoja tjetër,
    // rrëshqit majtas = fotoja paraprake.
    if (diffX > 0) {
      nextLightboxImage();
    } else {
      previousLightboxImage();
    }
  },
  { passive: true }
);

document.addEventListener("keydown", (event) => {
  if (lightbox.classList.contains("hidden")) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    nextLightboxImage();
  } else if (event.key === "ArrowLeft") {
    previousLightboxImage();
  }
});

function normalizeMenuOrder(order){
  const incoming = Array.isArray(order) ? order.filter((id)=>DEFAULT_TAB_ORDER.includes(id)) : [];
  return [...new Set([...incoming,...DEFAULT_TAB_ORDER])];
}

function applyMenuOrder(order){
  if(!appTabs) return;
  for(const id of normalizeMenuOrder(order)){
    const el=document.getElementById(id);
    if(el) appTabs.appendChild(el);
  }
}

function currentMenuOrder(){
  return Array.from(appTabs?.querySelectorAll(".app-tab") || [])
    .map((el)=>el.id)
    .filter((id)=>DEFAULT_TAB_ORDER.includes(id));
}

function renderMenuOrderAdmin(){
  if(!menuOrderList || !isAdmin()) return;
  const order=currentMenuOrder();
  menuOrderList.innerHTML=order.map((id,index)=>`
    <div class="menu-order-row" data-menu-id="${id}">
      <span class="menu-order-name">${TAB_LABELS[id] || id}</span>
      <div class="menu-order-actions">
        <button class="secondary menu-order-move" type="button" data-move="up" ${index===0?"disabled":""}>⬆️</button>
        <button class="secondary menu-order-move" type="button" data-move="down" ${index===order.length-1?"disabled":""}>⬇️</button>
      </div>
    </div>
  `).join("");

  menuOrderList.querySelectorAll(".menu-order-move").forEach((button)=>{
    button.addEventListener("click",()=>{
      const row=button.closest(".menu-order-row");
      const rows=Array.from(menuOrderList.querySelectorAll(".menu-order-row"));
      const index=rows.indexOf(row);
      const dir=button.dataset.move;
      if(dir==="up" && index>0){
        menuOrderList.insertBefore(row, rows[index-1]);
      }else if(dir==="down" && index<rows.length-1){
        menuOrderList.insertBefore(rows[index+1], row);
      }
      const nextOrder=Array.from(menuOrderList.querySelectorAll(".menu-order-row")).map((el)=>el.dataset.menuId);
      applyMenuOrder(nextOrder);
      renderMenuOrderAdmin();
    });
  });
}

async function loadSharedMenuOrder(){
  if(!supabase || !currentUser) return;
  const {data,error}=await supabase
    .from("app_settings")
    .select("value")
    .eq("key","tab_order")
    .maybeSingle();

  if(error){
    console.warn("Menu order load failed",error);
    return;
  }

  applyMenuOrder(data?.value || DEFAULT_TAB_ORDER);
  if(isAdmin()) renderMenuOrderAdmin();
}

async function saveSharedMenuOrder(){
  if(!supabase || !currentUser || !isAdmin()) return;
  const order=currentMenuOrder();
  menuOrderSave.disabled=true;
  showMessage(menuOrderStatus,"Po ruhet...");

  const {error}=await supabase.from("app_settings").upsert({
    key:"tab_order",
    value:order,
    updated_at:new Date().toISOString(),
    updated_by:currentUser.id
  },{onConflict:"key"});

  menuOrderSave.disabled=false;

  if(error){
    console.error(error);
    showMessage(menuOrderStatus,"Nuk u ruajt: "+error.message,"error");
    return;
  }

  showMessage(menuOrderStatus,"U ruajt. Kjo renditje u del të gjithëve.","success");
}

menuOrderSave?.addEventListener("click",saveSharedMenuOrder);

function setSection(next) {
  activeSection = next;
  const showGallery = next === "gallery";
  const showInfo = next === "info";
  const showPrayer = next === "prayer";
  const showGames = next === "games";
  const showTv = next === "tv";
  const showRadio = next === "radio";

  galleryTab.classList.toggle("active", showGallery);
  infoTab.classList.toggle("active", showInfo);
  prayerTab.classList.toggle("active", showPrayer);
  gamesTab.classList.toggle("active", showGames);
  tvTab.classList.toggle("active", showTv);
  radioTab.classList.toggle("active", showRadio);

  galleryView.classList.toggle("hidden", !showGallery);
  infoView.classList.toggle("hidden", !showInfo);
  prayerView.classList.toggle("hidden", !showPrayer);
  gamesView.classList.toggle("hidden", !showGames);
  tvView.classList.toggle("hidden", !showTv);
  radioView.classList.toggle("hidden", !showRadio);

  if (showInfo) loadInfo({ markRead: true });
  if (showPrayer) loadPrayerTimes(false);
  if (showGames) window.PajazitiGames?.activate?.();
  if (showTv) window.PajazitiTV?.activate?.();
  if (showRadio) window.PajazitiRadio?.activate?.();
}
galleryTab.addEventListener("click", () => setSection("gallery"));
infoTab.addEventListener("click", () => setSection("info"));
prayerTab.addEventListener("click", () => setSection("prayer"));
gamesTab.addEventListener("click", () => setSection("games"));
tvTab.addEventListener("click", () => setSection("tv"));
radioTab.addEventListener("click", () => setSection("radio"));

function setMode(next) {
  mode = next;
  familyMode.classList.toggle("active", next === "family");
  adminMode.classList.toggle("active", next === "admin");
  codeInput.value = "";
  codeInput.placeholder = t("login.adminPlaceholder");
  adminCodeWrap?.classList.toggle("hidden", next !== "admin");
  familyDirectHint?.classList.toggle("hidden", next === "admin");
  loginBtn.textContent = next === "admin" ? t("login.button") : "Hyr te Familja";
  loginMessage.textContent = "";
}
familyMode.addEventListener("click", () => setMode("family"));
adminMode.addEventListener("click", () => setMode("admin"));

function showMessage(el, text, kind = "") {
  el.textContent = text;
  el.className = "message" + (kind ? " " + kind : "");
}

function isAdmin() {
  return currentUser?.email === ADMIN_EMAIL;
}

async function login() {
  if (!configured) {
    return showMessage(
      loginMessage,
      t("error.supabaseNotLinked"),
      "error"
    );
  }

  loginBtn.disabled = true;
  showMessage(loginMessage, t("login.checking"));

  try {
    if (mode === "family") {
      const { data: tokenData, error: fnError } = await supabase.functions.invoke("family-login", {
        body: {}
      });
      if (fnError) throw fnError;
      if (!tokenData?.token_hash) throw new Error("Family token missing");

      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenData.token_hash,
        type: "email"
      });
      if (verifyError) throw verifyError;
      showMessage(loginMessage, "");
    } else {
      const code = codeInput.value.trim();
      if (!code) {
        loginBtn.disabled = false;
        return showMessage(loginMessage, t("login.enterCode"), "error");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: code
      });

      if (error) {
        console.error(error);
        const raw = (error.message || "").toLowerCase();
        let message = t("login.failed");
        if (raw.includes("invalid login credentials")) {
          message = t("login.badCode");
        } else if (raw.includes("email not confirmed")) {
          message = t("login.emailUnconfirmed");
        } else if (raw.includes("rate limit")) {
          message = t("login.rateLimit");
        } else if (error.message) {
          message = "Gabim: " + error.message;
        }
        showMessage(loginMessage, message, "error");
      } else {
        showMessage(loginMessage, "");
      }
    }
  } catch (error) {
    console.error(error);
    showMessage(loginMessage, "Nuk mund të hyhet te Familja. Provo përsëri.", "error");
  } finally {
    loginBtn.disabled = false;
  }
}
loginBtn.addEventListener("click", login);
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && mode === "admin") login();
});

logoutBtn.addEventListener("click", async () => {
  if (supabase) await supabase.auth.signOut();
});

refreshBtn.addEventListener("click", loadMedia);

function updateInfoUnreadBadge(items, markRead = false) {
  if (!infoUnreadBadge) return;

  if (isAdmin()) {
    infoUnreadBadge.classList.add("hidden");
    infoUnreadBadge.textContent = "0";
    return;
  }

  const maxId = (items || []).reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  let seenId = Number(localStorage.getItem(INFO_SEEN_KEY) || 0);

  if (markRead && maxId > 0) {
    localStorage.setItem(INFO_SEEN_KEY, String(maxId));
    seenId = maxId;
  }

  const unread = (items || []).filter((item) => (Number(item.id) || 0) > seenId).length;
  infoUnreadBadge.textContent = unread > 99 ? "99+" : String(unread);
  infoUnreadBadge.classList.toggle("hidden", unread === 0);
}

async function loadInfo({ markRead = activeSection === "info" } = {}) {
  if (!supabase || !currentUser) return;

  const { data, error } = await supabase
    .from("information")
    .select("id,author,message,created_at,user_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    showMessage(infoStatus, t("error.infoNotReady"), "error");
    return;
  }

  updateInfoUnreadBadge(data, markRead);

  infoList.innerHTML = "";
  infoCount.textContent = String(data.length);
  infoEmpty.classList.toggle("hidden", data.length > 0);

  for (const item of data) {
    const card = document.createElement("article");
    card.className = "info-item info-admin-message";

    const head = document.createElement("div");
    head.className = "info-head";

    const left = document.createElement("div");
    const author = document.createElement("div");
    author.className = "info-author";
    author.textContent = item.author || t("mode.family");

    const time = document.createElement("div");
    time.className = "info-time";
    time.textContent = new Date(item.created_at).toLocaleString("sq-AL");

    left.appendChild(author);
    left.appendChild(time);
    head.appendChild(left);

    card.appendChild(head);

    const text = document.createElement("div");
    text.className = "info-text";
    text.textContent = item.message || "";
    card.appendChild(text);

    if (isAdmin()) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "info-delete";
      del.textContent = t("delete");
      del.addEventListener("click", async () => {
        if (!confirm(t("confirm.deleteInfo"))) return;
        const { error: delError } = await supabase
          .from("information")
          .delete()
          .eq("id", item.id);
        if (delError) {
          alert("Nuk u fshi: " + delError.message);
          return;
        }
        await loadInfo();
      });
      card.appendChild(del);
    }

    infoList.appendChild(card);
  }
}

infoRefreshBtn.addEventListener("click", loadInfo);

infoSendBtn.addEventListener("click", async () => {
  if (!supabase || !currentUser || !isAdmin()) return;

  const author = "Admin";
  const message = infoText.value.trim();
  if (!message) {
    return showMessage(infoStatus, t("info.enterMessage"), "error");
  }

  infoSendBtn.disabled = true;
  showMessage(infoStatus, t("info.publishing"));

  const { error } = await supabase.from("information").insert({
    author,
    message,
    user_id: currentUser.id
  });

  infoSendBtn.disabled = false;

  if (error) {
    console.error(error);
    showMessage(infoStatus, t("error.publishFailed", { error: error.message }), "error");
    return;
  }

  infoText.value = "";
  showMessage(infoStatus, t("info.published"), "success");
  await loadInfo();
});

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function apiDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return d + "-" + m + "-" + y;
}

function cleanPrayerTime(value) {
  const match = String(value || "").match(/\b(\d{1,2}:\d{2})\b/);
  return match ? match[1].padStart(5, "0") : "--:--";
}

function savedPrayerCoords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PRAYER_COORDS_KEY) || "null");
    if (
      parsed &&
      Number.isFinite(Number(parsed.latitude)) &&
      Number.isFinite(Number(parsed.longitude))
    ) {
      return {
        latitude: Number(parsed.latitude),
        longitude: Number(parsed.longitude)
      };
    }
  } catch (_) {}
  return null;
}

function savePrayerCoords(latitude, longitude) {
  const coords = {
    latitude: Number(Number(latitude).toFixed(4)),
    longitude: Number(Number(longitude).toFixed(4))
  };
  localStorage.setItem(PRAYER_COORDS_KEY, JSON.stringify(coords));
  return coords;
}

function getPhoneLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error(t("error.locationUnsupported")));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(
        savePrayerCoords(position.coords.latitude, position.coords.longitude)
      ),
      (error) => {
        let message = "Nuk u mor vendndodhja.";
        if (error?.code === 1) message = t("location.permission");
        if (error?.code === 2) message = t("location.notFound");
        if (error?.code === 3) message = t("location.timeout");
        reject(new Error(message));
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 6 * 60 * 60 * 1000 }
    );
  });
}

async function fetchPrayerTimes(coords) {
  const date = new Date();
  const url = new URL("https://api.aladhan.com/v1/timings/" + apiDate(date));
  url.searchParams.set("latitude", coords.latitude);
  url.searchParams.set("longitude", coords.longitude);
  url.searchParams.set("method", "13");
  url.searchParams.set("school", "1");

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error(t("error.prayerFetch"));

  const json = await response.json();
  if (json?.code !== 200 || !json?.data?.timings) {
    throw new Error("Oraret e namazit nuk u kthyen si duhet.");
  }

  prayerTimings = {};
  for (const prayer of PRAYERS) {
    prayerTimings[prayer.key] = cleanPrayerTime(json.data.timings[prayer.key]);
  }
  prayerTimingsDate = localDateKey(date);
  prayerTimezone = json.data.meta?.timezone || "Europe/Berlin";

  prayerLocation.textContent = t("prayer.zone", { zone: prayerTimezone });
  renderPrayerTimes();
  updateNextPrayer();

  if (isNativePrayerApp()) {
    refreshNativePrayerSchedules().catch((error) =>
      console.warn("Native prayer refresh failed", error)
    );
  }
}

async function loadPrayerTimes(forceLocation = false) {
  if (!currentUser) return;

  let coords = forceLocation ? null : savedPrayerCoords();

  if (!coords && !forceLocation) {
    prayerLocation.textContent = t("prayer.locationTap");
    prayerStatus.textContent = "";
    if (!prayerTimings) prayerList.innerHTML = "";
    return;
  }

  try {
    prayerLocationBtn.disabled = true;
    showMessage(prayerStatus, forceLocation ? t("location.loading") : t("prayer.loading"));

    if (!coords) coords = await getPhoneLocation();
    await fetchPrayerTimes(coords);

    showMessage(prayerStatus, t("prayer.updated"), "success");
  } catch (error) {
    console.error("Prayer times failed", error);
    showMessage(prayerStatus, error?.message || t("error.prayerFetch"), "error");
  } finally {
    prayerLocationBtn.disabled = false;
  }
}

prayerLocationBtn.addEventListener("click", () => loadPrayerTimes(true));

function savePrayerAlarms() {
  localStorage.setItem(PRAYER_ALARMS_KEY, JSON.stringify(prayerAlarms));
}

function isNativePrayerApp() {
  try {
    return !!(window.AndroidPrayer && window.AndroidPrayer.isNativeAndroid());
  } catch (_) {
    return false;
  }
}

function monthKey(year, month) {
  return year + "-" + String(month).padStart(2, "0");
}

async function fetchPrayerCalendarMonth(coords, year, month) {
  const url = new URL(
    "https://api.aladhan.com/v1/calendar/" + year + "/" + month
  );
  url.searchParams.set("latitude", coords.latitude);
  url.searchParams.set("longitude", coords.longitude);
  url.searchParams.set("method", "13");
  url.searchParams.set("school", "1");

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error("Nuk u mor kalendari i namazit.");

  const json = await response.json();
  if (json?.code !== 200 || !Array.isArray(json?.data)) {
    throw new Error("Kalendari i namazit nuk u kthye si duhet.");
  }

  return json.data;
}

async function getNativePrayerCalendar(coords) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  const nextDate = new Date(thisYear, thisMonth, 1);
  const nextYear = nextDate.getFullYear();
  const nextMonth = nextDate.getMonth() + 1;

  const key =
    coords.latitude + "," + coords.longitude + ":" +
    monthKey(thisYear, thisMonth) + ":" +
    monthKey(nextYear, nextMonth);

  if (nativeCalendarCache && nativeCalendarCacheKey === key) {
    return nativeCalendarCache;
  }

  const [current, next] = await Promise.all([
    fetchPrayerCalendarMonth(coords, thisYear, thisMonth),
    fetchPrayerCalendarMonth(coords, nextYear, nextMonth)
  ]);

  nativeCalendarCache = [...current, ...next];
  nativeCalendarCacheKey = key;
  return nativeCalendarCache;
}

function prayerTimestampFromCalendarDay(day, prayerKey) {
  const gregorian = day?.date?.gregorian?.date || "";
  const match = gregorian.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const time = cleanPrayerTime(day?.timings?.[prayerKey]);
  const parts = time.split(":").map(Number);
  if (
    parts.length !== 2 ||
    !Number.isFinite(parts[0]) ||
    !Number.isFinite(parts[1])
  ) return null;

  const timestamp = new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]),
    parts[0],
    parts[1],
    0,
    0
  ).getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
}

async function scheduleNativePrayer(prayer) {
  if (!isNativePrayerApp()) return false;

  const coords = savedPrayerCoords();
  if (!coords) {
    throw new Error("Zgjidh fillimisht vendndodhjen.");
  }

  const calendar = await getNativePrayerCalendar(coords);
  const now = Date.now() - 60_000;
  const times = calendar
    .map((day) => prayerTimestampFromCalendarDay(day, prayer.key))
    .filter((value) => Number.isFinite(value) && value > now)
    .slice(0, 45);

  if (!times.length) {
    throw new Error(t("error.futureTimes", { name: prayerLabel(prayer.key) }));
  }

  window.AndroidPrayer.schedulePrayer(
    prayer.key,
    prayerLabel(prayer.key),
    JSON.stringify(times),
    currentLanguage
  );
  return true;
}

async function refreshNativePrayerSchedules() {
  if (!isNativePrayerApp()) return;

  const coords = savedPrayerCoords();
  if (!coords) return;

  for (const prayer of PRAYERS) {
    if (!prayerAlarms[prayer.key]) continue;
    try {
      await scheduleNativePrayer(prayer);
    } catch (error) {
      console.warn("Native prayer schedule failed", prayer.key, error);
    }
  }
}

window.addEventListener("androidPrayerReady", () => {
  refreshNativePrayerSchedules().catch(console.warn);
});


async function requestAlarmPermission() {
  try {
    if (isNativePrayerApp()) {
      window.AndroidPrayer.requestAlarmPermissions();
      return;
    }

    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (!prayerAudioContext && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      prayerAudioContext = new AudioCtx();
    }
    if (prayerAudioContext?.state === "suspended") {
      await prayerAudioContext.resume();
    }
  } catch (error) {
    console.warn("Alarm permission/audio", error);
  }
}

function renderPrayerTimes() {
  prayerList.innerHTML = "";
  if (!prayerTimings) return;

  for (const prayer of PRAYERS) {
    const row = document.createElement("article");
    row.className = "prayer-item";

    const name = document.createElement("div");
    name.className = "prayer-name";
    name.textContent = prayerLabel(prayer.key);

    const time = document.createElement("div");
    time.className = "prayer-time";
    time.textContent = prayerTimings[prayer.key] || "--:--";

    const alarm = document.createElement("button");
    alarm.type = "button";
    alarm.className = "prayer-alarm" + (prayerAlarms[prayer.key] ? " active" : "");
    alarm.textContent = prayerAlarms[prayer.key] ? t("alarm.on") : t("alarm.off");
    alarm.addEventListener("click", async () => {
      const next = !prayerAlarms[prayer.key];
      alarm.disabled = true;

      try {
        if (next) {
          await requestAlarmPermission();
          prayerAlarms[prayer.key] = true;
          savePrayerAlarms();

          if (isNativePrayerApp()) {
            showMessage(
              prayerStatus,
              t("alarm.activating", { name: prayerLabel(prayer.key) })
            );
            await scheduleNativePrayer(prayer);
            showMessage(
              prayerStatus,
              t("alarm.activated", { name: prayerLabel(prayer.key) }),
              "success"
            );
          } else {
            showMessage(
              prayerStatus,
              t("alarm.webActivated"),
              "success"
            );
          }
        } else {
          prayerAlarms[prayer.key] = false;
          savePrayerAlarms();

          if (isNativePrayerApp()) {
            window.AndroidPrayer.cancelPrayer(prayer.key);
          }

          showMessage(
            prayerStatus,
            t("alarm.disabled", { name: prayerLabel(prayer.key) })
          );
        }
      } catch (error) {
        prayerAlarms[prayer.key] = false;
        savePrayerAlarms();
        console.error("Prayer alarm toggle failed", error);
        showMessage(
          prayerStatus,
          error?.message || "Alarmi nuk u regjistrua.",
          "error"
        );
      } finally {
        renderPrayerTimes();
        checkPrayerAlarms();
      }
    });

    row.appendChild(name);
    row.appendChild(time);
    row.appendChild(alarm);
    prayerList.appendChild(row);
  }
}

function timeToMinutes(value) {
  const [h, m] = String(value || "").split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function updateNextPrayer() {
  if (!prayerTimings) {
    prayerNext.classList.add("hidden");
    return;
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let next = null;

  for (const prayer of PRAYERS) {
    const mins = timeToMinutes(prayerTimings[prayer.key]);
    if (mins !== null && mins >= nowMinutes) {
      next = prayer;
      break;
    }
  }

  if (!next) {
    prayerNext.textContent = t("prayer.nextTomorrow");
  } else {
    prayerNext.textContent =
      t("prayer.next", { name: prayerLabel(next.key), time: prayerTimings[next.key] });
  }
  prayerNext.classList.remove("hidden");
}

function playPrayerAlarmTone() {
  try {
    if (!prayerAudioContext) return;
    const now = prayerAudioContext.currentTime;

    for (let i = 0; i < 3; i++) {
      const oscillator = prayerAudioContext.createOscillator();
      const gain = prayerAudioContext.createGain();
      oscillator.frequency.value = 740;
      gain.gain.setValueAtTime(0.0001, now + i * 0.55);
      gain.gain.exponentialRampToValueAtTime(0.22, now + i * 0.55 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.55 + 0.35);
      oscillator.connect(gain);
      gain.connect(prayerAudioContext.destination);
      oscillator.start(now + i * 0.55);
      oscillator.stop(now + i * 0.55 + 0.38);
    }
  } catch (error) {
    console.warn("Alarm tone failed", error);
  }
}

async function notifyPrayer(prayer, time) {
  const title = t("alarm.title");
  const body = t("alarm.body", { name: prayerLabel(prayer.key), time });

  try {
    if ("serviceWorker" in navigator && "Notification" in window && Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon: "./icon.svg",
        badge: "./icon.svg",
        tag: "prayer-" + prayer.key + "-" + localDateKey(),
        vibrate: [250, 120, 250, 120, 400]
      });
    }
  } catch (error) {
    console.warn("Prayer notification failed", error);
  }

  if (navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 400]);
  playPrayerAlarmTone();
  showMessage(prayerStatus, body, "success");
}

async function checkPrayerAlarms() {
  if (isNativePrayerApp()) {
    updateNextPrayer();
    return;
  }

  const coords = savedPrayerCoords();
  if (!coords) return;

  const today = localDateKey();
  if (!prayerTimings || prayerTimingsDate !== today) {
    try {
      await fetchPrayerTimes(coords);
    } catch (error) {
      console.warn("Prayer refresh failed", error);
      return;
    }
  }

  updateNextPrayer();

  const now = new Date();
  const current = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

  for (const prayer of PRAYERS) {
    if (!prayerAlarms[prayer.key]) continue;
    if (prayerTimings[prayer.key] !== current) continue;

    const alertKey = today + ":" + prayer.key;
    if (localStorage.getItem(PRAYER_LAST_ALERT_KEY) === alertKey) continue;

    localStorage.setItem(PRAYER_LAST_ALERT_KEY, alertKey);
    await notifyPrayer(prayer, current);
    break;
  }
}

function startPrayerAlarmChecker() {
  if (prayerCheckTimer) clearInterval(prayerCheckTimer);
  prayerCheckTimer = setInterval(checkPrayerAlarms, 20000);
  checkPrayerAlarms();
}

function familyFolderPrefix() {
  return "family/" + presenceDeviceId + "/";
}

function isOwnFamilyPhoto(item) {
  return (
    !isAdmin() &&
    (item?.type || "").startsWith("image/") &&
    (item?.storage_path || "").startsWith(familyFolderPrefix())
  );
}

function ownFamilyPhotoCount(items = mediaItems) {
  return items.filter((item) =>
    (item?.type || "").startsWith("image/") &&
    (item?.storage_path || "").startsWith(familyFolderPrefix())
  ).length;
}

function updateUploadPanel(items = mediaItems) {
  if (!currentUser) return;

  if (isAdmin()) {
    uploadTitle.textContent = t("upload.addMedia");
    uploadHint.textContent = t("upload.adminHint");
    mediaInput.accept = "image/*,video/*";
    uploadBtn.disabled = false;
    return;
  }

  const used = ownFamilyPhotoCount(items);
  const remaining = Math.max(0, FAMILY_PHOTO_LIMIT - used);

  uploadTitle.textContent = t("upload.familyTitle");
  uploadHint.textContent = t("upload.familyHint", { used, remaining });
  mediaInput.accept = "image/*";
  uploadBtn.disabled = remaining === 0;

  if (remaining === 0) {
    showMessage(
      uploadStatus,
      t("family.limit"),
      ""
    );
  }
}

async function deleteMediaItem(item) {
  if (!supabase || !currentUser) return;

  if (!isAdmin() && !isOwnFamilyPhoto(item)) {
    alert(t("family.onlyOwnDelete"));
    return;
  }

  if (!confirm(t("confirm.delete"))) return;

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([item.storage_path]);

  if (storageError) {
    alert("Nuk u fshi skedari: " + storageError.message);
    return;
  }

  const { error: dbError } = await supabase
    .from("media")
    .delete()
    .eq("id", item.id);

  if (dbError) {
    alert("Nuk u fshi regjistri: " + dbError.message);
    return;
  }

  await loadMedia();
}

async function signedUrl(path) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

async function loadMedia() {
  if (!supabase || !currentUser) return;

  gallery.innerHTML = "";
  const { data, error } = await supabase
    .from("media")
    .select("id,name,type,storage_path,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    emptyState.classList.remove("hidden");
    emptyState.querySelector("h2").textContent = t("error.supabaseNotReady");
    emptyState.querySelector("p").textContent = t("error.runSql");
    return;
  }

  mediaItems = data || [];
  mediaCount.textContent = String(mediaItems.length);
  emptyState.classList.toggle("hidden", mediaItems.length > 0);
  updateUploadPanel(mediaItems);
  await updateStorageUsage();

  for (const item of data) {
    const card = document.createElement("article");
    card.className = "media-card";

    try {
      const url = await signedUrl(item.storage_path);
      let preview;

      if ((item.type || "").startsWith("video/")) {
        preview = document.createElement("video");
        preview.controls = true;
        preview.preload = "metadata";
        preview.src = url;
      } else {
        preview = document.createElement("img");
        preview.loading = "lazy";
        preview.alt = item.name || t("photo");
        preview.src = url;
        preview.title = t("photo");
        preview.addEventListener("click", () => openLightbox(url, item.name || "Foto"));
      }

      card.appendChild(preview);

      const meta = document.createElement("div");
      meta.className = "media-meta";

      const name = document.createElement("div");
      name.className = "media-name";
      name.textContent = item.name || t("material");
      meta.appendChild(name);

      const actions = document.createElement("div");
      actions.className = "media-actions";

      const download = document.createElement("a");
      download.href = url;
      download.target = "_blank";
      download.rel = "noopener";
      download.textContent = t("download");
      actions.appendChild(download);

      if (isAdmin() || isOwnFamilyPhoto(item)) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "danger";
        del.textContent = t("delete");
        del.addEventListener("click", () => deleteMediaItem(item));
        actions.appendChild(del);
      }

      meta.appendChild(actions);
      card.appendChild(meta);
      gallery.appendChild(card);
    } catch (e) {
      console.error("Media load failed", e);
    }
  }
}


async function updateStorageUsage() {
  if (!storageCard || !currentUser) return;

  storageCard.classList.toggle("hidden", !isAdmin());
  if (!isAdmin()) return;

  const { data, error } = await supabase.rpc("admin_storage_usage");

  if (error) {
    console.error("Storage usage failed", error);
    storageUsed.textContent = t("error.storageSql");
    storagePercent.textContent = "—";
    storageBar.style.width = "0%";
    return;
  }

  const used = Number(data || 0);
  const percent = Math.min(100, Math.max(0, (used / FREE_STORAGE_LIMIT_BYTES) * 100));

  storageUsed.textContent =
    formatBytes(used) + " / 1 GB";
  storagePercent.textContent =
    (percent < 1 && used > 0 ? percent.toFixed(1) : Math.round(percent)) + "%";
  storageBar.style.width = percent + "%";
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function optimizeImage(file) {
  if (!(file?.type || "").startsWith("image/")) {
    return { file, savedBytes: 0, optimized: false };
  }

  if (
    file.type === "image/gif" ||
    file.type === "image/svg+xml" ||
    file.size < IMAGE_OPTIMIZE_MIN_SIZE
  ) {
    return { file, savedBytes: 0, optimized: false };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, IMAGE_MAX_DIMENSION / longest);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return { file, savedBytes: 0, optimized: false };

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY)
    );

    if (!blob || blob.size >= file.size * 0.95) {
      return { file, savedBytes: 0, optimized: false };
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "foto";
    const optimizedFile = new File([blob], baseName + ".webp", {
      type: "image/webp",
      lastModified: file.lastModified
    });

    return {
      file: optimizedFile,
      savedBytes: Math.max(0, file.size - optimizedFile.size),
      optimized: true
    };
  } catch (error) {
    console.warn("Foto nuk u optimizua, po ngarkohet origjinali.", error);
    return { file, savedBytes: 0, optimized: false };
  } finally {
    if (bitmap?.close) bitmap.close();
  }
}

uploadBtn.addEventListener("click", async () => {
  if (!supabase || !currentUser) return;

  const files = Array.from(mediaInput.files);
  if (!files.length) {
    return showMessage(
      uploadStatus,
      isAdmin() ? t("upload.chooseMedia") : t("upload.choosePhoto"),
      "error"
    );
  }

  if (!isAdmin()) {
    const nonImages = files.filter((file) => !(file.type || "").startsWith("image/"));
    if (nonImages.length) {
      return showMessage(
        uploadStatus,
        t("family.onlyPhotos"),
        "error"
      );
    }

    const { count, error: countError } = await supabase
      .from("media")
      .select("id", { count: "exact", head: true })
      .like("storage_path", familyFolderPrefix() + "%");

    if (countError) {
      return showMessage(
        uploadStatus,
        "Nuk munda ta kontrolloj kufirin e fotove: " + countError.message,
        "error"
      );
    }

    const used = count || 0;
    const remaining = Math.max(0, FAMILY_PHOTO_LIMIT - used);

    if (remaining === 0) {
      updateUploadPanel(mediaItems);
      return showMessage(
        uploadStatus,
        t("family.limit"),
        "error"
      );
    }

    if (files.length > remaining) {
      return showMessage(
        uploadStatus,
        t("family.remaining", { remaining }),
        "error"
      );
    }
  }

  uploadBtn.disabled = true;
  let done = 0;
  let skipped = 0;
  let savedBytes = 0;

  try {
    for (const originalFile of files) {
      if ((originalFile.type || "").startsWith("image/")) {
        showMessage(
          uploadStatus,
          "Po optimizoj foton " + (done + skipped + 1) + "/" + files.length + ": " + originalFile.name
        );
      }

      const prepared = await optimizeImage(originalFile);
      const file = prepared.file;
      savedBytes += prepared.savedBytes;

      if (file.size > MAX_FILE_SIZE) {
        skipped++;
        showMessage(
          uploadStatus,
          t("error.fileTooLarge", { name: originalFile.name }),
          "error"
        );
        continue;
      }

      showMessage(
        uploadStatus,
        "Po ngarkoj " + (done + 1) + "/" + files.length + ": " + originalFile.name
      );

      const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const ownerFolder = isAdmin()
        ? "admin/" + currentUser.id + "/"
        : familyFolderPrefix();

      const path =
        ownerFolder +
        Date.now() +
        "_" +
        Math.random().toString(36).slice(2, 8) +
        "_" +
        safe;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("media").insert({
        name: originalFile.name,
        type: file.type,
        storage_path: path
      });

      if (insertError) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw insertError;
      }

      done++;
    }

    mediaInput.value = "";

    if (done > 0) {
      let message = "U ngarkuan " + done + (done === 1 ? " foto/material." : " materiale.");
      if (savedBytes > 0) {
        message += " " + t("upload.savedSpace", { size: formatBytes(savedBytes) });
      }
      if (skipped > 0) {
        message += " " + t("upload.skipped", { count: skipped });
      }
      showMessage(uploadStatus, message, "success");
      await loadMedia();
    } else {
      showMessage(uploadStatus, t("upload.none"), "error");
    }
  } catch (e) {
    console.error(e);
    showMessage(
      uploadStatus,
      t("error.uploadFailed", { error: (e?.message || e) }),
      "error"
    );
  } finally {
    if (isAdmin()) {
      uploadBtn.disabled = false;
    } else {
      updateUploadPanel(mediaItems);
    }
  }
});

function updateOnlineCount() {
  if (!onlineCount || !realtimeChannel) return;
  const state = realtimeChannel.presenceState();
  onlineCount.textContent = String(Object.keys(state).length);
}

function startRealtime() {
  if (!supabase || !currentUser) return;
  if (realtimeChannel) supabase.removeChannel(realtimeChannel);

  if (onlineCount) onlineCount.textContent = "0";

  realtimeChannel = supabase
    .channel("familja-live", {
      config: {
        presence: { key: presenceDeviceId }
      }
    })
    .on(
      "presence",
      { event: "sync" },
      updateOnlineCount
    )
    .on(
      "presence",
      { event: "join" },
      updateOnlineCount
    )
    .on(
      "presence",
      { event: "leave" },
      updateOnlineCount
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "media" },
      () => loadMedia()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "information" },
      () => loadInfo({ markRead: activeSection === "info" })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "app_settings" },
      () => loadSharedMenuOrder()
    )
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await realtimeChannel.track({
          device_id: presenceDeviceId,
          role: isAdmin() ? "admin" : "family",
          online_at: new Date().toISOString()
        });
        updateOnlineCount();
      }
    });
}

async function applySession(session) {
  currentUser = session?.user || null;
  const signedIn = !!currentUser;

  loginView.classList.toggle("hidden", signedIn);
  appView.classList.toggle("hidden", !signedIn);
  infoCompose?.classList.toggle("hidden", !signedIn || !isAdmin());
  menuOrderAdmin?.classList.toggle("hidden", !signedIn || !isAdmin());
  if (isAdmin()) infoUnreadBadge?.classList.add("hidden");

  if (!signedIn) {
    gallery.innerHTML = "";
    mediaItems = [];
    mediaCount.textContent = "0";
    uploadStatus.textContent = "";
    if (storageCard) storageCard.classList.add("hidden");
    if (onlineCount) onlineCount.textContent = "0";
    if (infoUnreadBadge) infoUnreadBadge.classList.add("hidden");
    if (prayerCheckTimer) {
      clearInterval(prayerCheckTimer);
      prayerCheckTimer = null;
    }
    if (realtimeChannel && supabase) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
    return;
  }

  adminPanel.classList.remove("hidden");
  if (storageCard) storageCard.classList.toggle("hidden", !isAdmin());
  roleLabel.textContent = isAdmin() ? t("role.admin") : t("role.family");
  uploadStatus.textContent = "";
  await loadMedia();
  await loadSharedMenuOrder();
  const savedCoords = savedPrayerCoords();
  if (savedCoords) {
    fetchPrayerTimes(savedCoords).catch((error) => console.warn("Prayer preload failed", error));
  }
  startPrayerAlarmChecker();
  startRealtime();
}

if (supabase) {
  const { data } = await supabase.auth.getSession();
  await applySession(data.session);

  supabase.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => applySession(session), 0);
  });
} else {
  showMessage(
    loginMessage,
    t("error.setupSupabase"),
    ""
  );
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  installBtn.classList.remove("hidden");
  installLoginBtn.classList.remove("hidden");
});

async function triggerInstall() {
  if (!installPrompt) {
    alert(t("install.chrome"));
    return;
  }
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installBtn.classList.add("hidden");
  installLoginBtn.classList.add("hidden");
}

installBtn.addEventListener("click", triggerInstall);
installLoginBtn.addEventListener("click", triggerInstall);

shareBtn.addEventListener("click", async () => {
  const url = new URL("/pajaziti-android.apk", window.location.origin).href;
  try {
    if (navigator.share) {
      await navigator.share({
        title: "PAJAZITI",
        text: t("share.text"),
        url
      });
      return;
    }
    await navigator.clipboard.writeText(url);
    showMessage(loginMessage, t("share.copied"), "success");
  } catch (e) {
    if (e?.name !== "AbortError") {
      try {
        await navigator.clipboard.writeText(url);
        showMessage(loginMessage, t("share.copied"), "success");
      } catch (_) {
        showMessage(loginMessage, "Linku: " + url, "");
      }
    }
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(console.error);
}
