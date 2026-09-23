import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const APP_MODE = document.querySelector('meta[name="diamond-mode"]')?.content === "admin" ? "admin" : "public";
const ADMIN_ONLY = APP_MODE === "admin";

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
      auth: { persistSession: true, autoRefreshToken: true, storageKey: ADMIN_ONLY ? "diamond-admin-auth" : "diamond-family-auth" }
    })
  : null;

const $ = (id) => document.getElementById(id);

const LANGUAGE_KEY = "pajaziti-language";
const I18N = {
  sq: {
    "home.quote":"Ne e bëjmë të pamundurën të mundur.",
    "language.label":"Gjuha","app.subtitle":"","mode.family":"Përdoruesi","mode.admin":"Admin",
    "login.label":"Kodi i hyrjes","login.placeholder":"Shkruaj kodin","login.adminPlaceholder":"Kodi i administratorit","login.familyPlaceholder":"Kodi i familjes",
    "login.button":"Hyr","login.userButton":"Hyr si Përdorues","login.userDirectHint":"Përdoruesi hyn direkt pa kod.","install.app":"Instalo aplikacionin","install.short":"Instalo","share":"Ndaje APK-në","logout":"Dil","online":"Online:",
    "auth.note":"",
    "tabs.photos":"Reklama","tabs.info":"Informacion","tabs.prayer":"Namazi","upload.addPhoto":"Shto reklamë","upload.addMedia":"Shto reklamë (foto ose video)",
    "upload.adminHint":"Vetëm administratori mund të ngarkojë dhe menaxhojë reklamat.","upload.familyTitle":"Shto fotot e tua","upload.button":"Ngarko",
    "upload.familyHint":"Ke ngarkuar {used}/3 foto. Mund të shtosh edhe {remaining}.","storage.title":"Hapësira e përdorur",
    "storage.adminOnly":"E dukshme vetëm për administratorin","materials":" materiale","refresh":"Rifresko",
    "empty.mediaTitle":"Ende nuk ka reklama","empty.mediaBody":"Kur administratori të ngarkojë një reklamë, ajo do të shfaqet këtu.",
    "info.title":"Informacion","info.familyWrite":"Vetëm administratori mund të shkruajë këtu.","info.name":"Emri","info.namePlaceholder":"Shkruaj emrin tënd",
    "info.message":"Mesazhi","info.messagePlaceholder":"Shkruaj informacionin...","info.publish":"Publiko","info.notes":" shënime",
    "info.emptyTitle":"Ende nuk ka informacion","info.emptyBody":"Kur administratori të publikojë diçka, do të shfaqet këtu.","role.admin":"Administrator","role.family":"Anëtar i familjes",
    "download":"Shkarko","delete":"Fshi","material":"Material","photo":"Foto","confirm.delete":"Ta fshij këtë material?","confirm.deleteInfo":"Ta fshij këtë informacion?",
    "prayer.title":"Koha e namazit","prayer.locationPrompt":"Zgjidh vendndodhjen e telefonit.","prayer.locationBtn":"Vendndodhja",
    "prayer.method":"Ora llogaritet sipas vendndodhjes së telefonit me metodën Diyanet.","prayer.alarmTitle":"🔔 Alarmet janë sipas dëshirës.",
    "prayer.alarmBody":"Aktivizo vetëm namazet për të cilat dëshiron njoftim në këtë telefon. Në APK Android alarmi regjistrohet në sistem dhe punon edhe kur aplikacioni është i mbyllur.",
    "prayer.Fajr":"Sabahu","prayer.Dhuhr":"Dreka","prayer.Asr":"Ikindia","prayer.Maghrib":"Akshami","prayer.Isha":"Jacia",
    "prayer.next":"Namazi i radhës: {name} në {time}","prayer.nextTomorrow":"Namazi i radhës: Sabahu nesër","prayer.remaining":"Ka mbetur {time}","prayer.zone":"Zona: {zone}","prayer.qibla":"Kibla","prayer.qiblaActivate":"Aktivizo busullën","prayer.qiblaNeedLocation":"Zgjidh vendndodhjen për drejtimin e Kiblës.","prayer.qiblaFromNorth":"{degrees}° nga veriu","prayer.qiblaReady":"Ktheje telefonin derisa shigjeta të tregojë lart.","prayer.qiblaNoSensor":"Drejtimi është llogaritur nga veriu. Busulla e telefonit nuk u aktivizua.","prayer.kerahat":"Kerahet vakti","prayer.kerahatSunrise":"Pas lindjes së diellit","prayer.kerahatNoon":"Para drekës","prayer.kerahatSunset":"Para akshamit","prayer.kerahatNote":"Këto intervale janë afërsisht dhe mund të ndryshojnë sipas medhhebit.",
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
    "share.text":"Shkarko dhe instalo APK-në Diamond në Android.","share.copied":"Linku i APK-së u kopjua. Tani mund ta dërgosh.",
    "error.supabaseNotLinked":"Supabase nuk është lidhur ende. Duhet Project URL dhe anon key.","error.infoNotReady":"Informacioni nuk është gati ende.","error.publishFailed":"Publikimi dështoi: {error}",
    "error.locationUnsupported":"Ky telefon nuk e mbështet vendndodhjen.","error.prayerFetch":"Nuk u morën oraret e namazit.","prayer.locationTap":"Preke “Vendndodhja” për oraret e sakta.",
    "error.futureTimes":"Nuk u gjetën orare të ardhshme për {name}.","error.supabaseNotReady":"Supabase nuk është gati ende","error.runSql":"Duhet të ekzekutohet skedari supabase/setup.sql në SQL Editor.",
    "error.storageSql":"Matësi kërkon përditësimin e SQL.","error.fileTooLarge":"{name} është mbi 50 MB edhe pas optimizimit dhe u anashkalua.","upload.savedSpace":"U kursyen rreth {size} hapësirë.",
    "upload.skipped":"{count} skedarë u anashkaluan.","error.uploadFailed":"Ngarkimi dështoi: {error}","error.setupSupabase":"Kodi i aplikacionit është kaluar në Supabase Free. Tani duhet vetëm ta lidhim projektin Supabase.",
    "install.chrome":"Në Chrome, hap menunë ⋮ dhe zgjidh “Install app” ose “Add to Home screen”."
  },
  de: {
    "home.quote":"Wir machen das Unmögliche möglich.",
    "language.label":"Sprache","app.subtitle":"","mode.family":"Benutzer","mode.admin":"Admin",
    "login.label":"Zugangscode","login.placeholder":"Code eingeben","login.adminPlaceholder":"Administrator-Code","login.familyPlaceholder":"Familien-Code",
    "login.button":"Anmelden","login.userButton":"Als Benutzer anmelden","login.userDirectHint":"Benutzer meldet sich direkt ohne Code an.","install.app":"App installieren","install.short":"Installieren","share":"APK teilen","logout":"Abmelden","online":"Online:",
    "auth.note":"",
    "tabs.photos":"Werbung","tabs.info":"Information","tabs.prayer":"Gebet","upload.addPhoto":"Werbung hinzufügen","upload.addMedia":"Werbung hinzufügen (Foto oder Video)",
    "upload.adminHint":"Nur der Administrator kann Werbung hochladen und verwalten.","upload.familyTitle":"Deine Fotos hinzufügen","upload.button":"Hochladen",
    "upload.familyHint":"Du hast {used}/3 Fotos hochgeladen. Du kannst noch {remaining} hinzufügen.","storage.title":"Verwendeter Speicher",
    "storage.adminOnly":"Nur für den Administrator sichtbar","materials":" Medien","refresh":"Aktualisieren",
    "empty.mediaTitle":"Noch keine Werbung","empty.mediaBody":"Wenn der Administrator Werbung hochlädt, erscheint sie hier.",
    "info.title":"Information","info.familyWrite":"Nur der Administrator kann hier schreiben.","info.name":"Name","info.namePlaceholder":"Deinen Namen eingeben",
    "info.message":"Nachricht","info.messagePlaceholder":"Information eingeben...","info.publish":"Veröffentlichen","info.notes":" Einträge",
    "info.emptyTitle":"Noch keine Informationen","info.emptyBody":"Wenn der Administrator etwas veröffentlicht, erscheint es hier.","role.admin":"Administrator","role.family":"Familienmitglied",
    "download":"Herunterladen","delete":"Löschen","material":"Medium","photo":"Foto","confirm.delete":"Dieses Medium löschen?","confirm.deleteInfo":"Diese Information löschen?",
    "prayer.title":"Gebetszeiten","prayer.locationPrompt":"Standort des Telefons auswählen.","prayer.locationBtn":"Standort",
    "prayer.method":"Die Zeiten werden anhand des Telefonstandorts nach der Diyanet-Methode berechnet.","prayer.alarmTitle":"🔔 Alarme sind optional.",
    "prayer.alarmBody":"Aktiviere nur die Gebete, für die du auf diesem Telefon eine Benachrichtigung möchtest. In der Android-APK wird der Alarm im System registriert und funktioniert auch bei geschlossener App.",
    "prayer.Fajr":"Fajr","prayer.Dhuhr":"Dhuhr","prayer.Asr":"Asr","prayer.Maghrib":"Maghrib","prayer.Isha":"Isha",
    "prayer.next":"Nächstes Gebet: {name} um {time}","prayer.nextTomorrow":"Nächstes Gebet: Fajr morgen","prayer.remaining":"Verbleibend {time}","prayer.zone":"Zone: {zone}","prayer.qibla":"Qibla","prayer.qiblaActivate":"Kompass aktivieren","prayer.qiblaNeedLocation":"Standort für die Qibla-Richtung auswählen.","prayer.qiblaFromNorth":"{degrees}° von Norden","prayer.qiblaReady":"Drehe das Telefon, bis der Pfeil nach oben zeigt.","prayer.qiblaNoSensor":"Die Richtung wurde von Norden berechnet. Der Telefonkompass ist nicht aktiv.","prayer.kerahat":"Kerahat-Zeiten","prayer.kerahatSunrise":"Nach Sonnenaufgang","prayer.kerahatNoon":"Vor Dhuhr","prayer.kerahatSunset":"Vor Maghrib","prayer.kerahatNote":"Diese Zeitfenster sind ungefähr und können je nach Rechtsschule abweichen.",
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
    "share.text":"Lade die Diamond-APK herunter und installiere sie auf Android.","share.copied":"Der APK-Link wurde kopiert. Du kannst ihn jetzt senden.",
    "error.supabaseNotLinked":"Supabase ist noch nicht verbunden. Project URL und anon key werden benötigt.","error.infoNotReady":"Die Informationen sind noch nicht verfügbar.","error.publishFailed":"Veröffentlichen fehlgeschlagen: {
    "home.quote":"We make the impossible possible.",error}",
    "error.locationUnsupported":"Dieses Telefon unterstützt keinen Standortzugriff.","error.prayerFetch":"Gebetszeiten konnten nicht geladen werden.","prayer.locationTap":"Tippe auf „Standort“ für genaue Gebetszeiten.",
    "error.futureTimes":"Keine zukünftigen Zeiten für {name} gefunden.","error.supabaseNotReady":"Supabase ist noch nicht bereit","error.runSql":"Die Datei supabase/setup.sql muss im SQL Editor ausgeführt werden.",
    "error.storageSql":"Der Speicherzähler benötigt das SQL-Update.","error.fileTooLarge":"{name} ist auch nach der Optimierung größer als 50 MB und wurde übersprungen.","upload.savedSpace":"Etwa {size} Speicher wurden gespart.",
    "upload.skipped":"{count} Datei(en) wurden übersprungen.","error.uploadFailed":"Upload fehlgeschlagen: {error}","error.setupSupabase":"Die App wurde auf Supabase Free umgestellt. Jetzt muss nur noch das Supabase-Projekt verbunden werden.",
    "install.chrome":"Öffne in Chrome das Menü ⋮ und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“."
  },
  tr: {
    "home.quote":"İmkânsızı mümkün kılıyoruz.",
    "language.label":"Dil","app.subtitle":"","mode.family":"Kullanıcı","mode.admin":"Yönetici",
    "login.label":"Giriş kodu","login.placeholder":"Kodu gir","login.adminPlaceholder":"Yönetici kodu","login.familyPlaceholder":"Aile kodu",
    "login.button":"Giriş yap","login.userButton":"Kullanıcı olarak gir","login.userDirectHint":"Kullanıcı kod olmadan doğrudan giriş yapar.","install.app":"Uygulamayı yükle","install.short":"Yükle","share":"APK'yı paylaş","logout":"Çıkış","online":"Çevrimiçi:",
    "auth.note":"",
    "tabs.photos":"Reklamlar","tabs.info":"Bilgi","tabs.prayer":"Namaz","upload.addPhoto":"Reklam ekle","upload.addMedia":"Reklam ekle (fotoğraf veya video)",
    "upload.adminHint":"Reklamları yalnızca yönetici yükleyebilir ve yönetebilir.","upload.familyTitle":"Fotoğraflarını ekle","upload.button":"Yükle",
    "upload.familyHint":"{used}/3 fotoğraf yükledin. {remaining} tane daha ekleyebilirsin.","storage.title":"Kullanılan alan",
    "storage.adminOnly":"Yalnızca yönetici görebilir","materials":" medya","refresh":"Yenile",
    "empty.mediaTitle":"Henüz reklam yok","empty.mediaBody":"Yönetici reklam yüklediğinde burada görünecek.",
    "info.title":"Bilgi","info.familyWrite":"Buraya yalnızca yönetici yazabilir.","info.name":"İsim","info.namePlaceholder":"Adını yaz",
    "info.message":"Mesaj","info.messagePlaceholder":"Bilgiyi yaz...","info.publish":"Yayınla","info.notes":" not",
    "info.emptyTitle":"Henüz bilgi yok","info.emptyBody":"Yönetici bir şey yayınladığında burada görünecek.","role.admin":"Yönetici","role.family":"Aile üyesi",
    "download":"İndir","delete":"Sil","material":"Medya","photo":"Fotoğraf","confirm.delete":"Bu medya silinsin mi?","confirm.deleteInfo":"Bu bilgi silinsin mi?",
    "prayer.title":"Namaz vakitleri","prayer.locationPrompt":"Telefonun konumunu seç.","prayer.locationBtn":"Konum",
    "prayer.method":"Vakitler telefonun konumuna göre Diyanet yöntemiyle hesaplanır.","prayer.alarmTitle":"🔔 Alarmlar isteğe bağlıdır.",
    "prayer.alarmBody":"Bu telefonda bildirim almak istediğin namazlar için alarmı aç. Android APK'da alarm sisteme kaydedilir ve uygulama kapalıyken de çalışır.",
    "prayer.Fajr":"Sabah","prayer.Dhuhr":"Öğle","prayer.Asr":"İkindi","prayer.Maghrib":"Akşam","prayer.Isha":"Yatsı",
    "prayer.next":"Sıradaki namaz: {name} {time}","prayer.nextTomorrow":"Sıradaki namaz: Sabah yarın","prayer.remaining":"Kalan süre {time}","prayer.zone":"Bölge: {zone}","prayer.qibla":"Kıble","prayer.qiblaActivate":"Pusulayı aç","prayer.qiblaNeedLocation":"Kıble yönü için konumu seç.","prayer.qiblaFromNorth":"Kuzeyden {degrees}°","prayer.qiblaReady":"Ok yukarıyı gösterene kadar telefonu çevir.","prayer.qiblaNoSensor":"Yön kuzeye göre hesaplandı. Telefon pusulası etkin değil.","prayer.kerahat":"Kerahat vakti","prayer.kerahatSunrise":"Güneş doğduktan sonra","prayer.kerahatNoon":"Öğleden önce","prayer.kerahatSunset":"Akşamdan önce","prayer.kerahatNote":"Bu aralıklar yaklaşık olup mezhebe göre değişebilir.",
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
    "share.text":"Diamond APK dosyasını indir ve Android'e yükle.","share.copied":"APK bağlantısı kopyalandı. Şimdi gönderebilirsin.",
    "error.supabaseNotLinked":"Supabase henüz bağlı değil. Project URL ve anon key gerekiyor.","error.infoNotReady":"Bilgi bölümü henüz hazır değil.","error.publishFailed":"Yayınlama başarısız: {error}",
    "error.locationUnsupported":"Bu telefon konum özelliğini desteklemiyor.","error.prayerFetch":"Namaz vakitleri alınamadı.","prayer.locationTap":"Doğru namaz vakitleri için “Konum”a dokun.",
    "error.futureTimes":"{name} için gelecek vakit bulunamadı.","error.supabaseNotReady":"Supabase henüz hazır değil","error.runSql":"supabase/setup.sql dosyası SQL Editor'de çalıştırılmalı.",
    "error.storageSql":"Depolama göstergesi SQL güncellemesini gerektiriyor.","error.fileTooLarge":"{name}, optimizasyondan sonra da 50 MB'tan büyük olduğu için atlandı.","upload.savedSpace":"Yaklaşık {size} alan tasarrufu sağlandı.",
    "upload.skipped":"{count} dosya atlandı.","error.uploadFailed":"Yükleme başarısız: {error}","error.setupSupabase":"Uygulama Supabase Free'a geçirildi. Şimdi yalnızca Supabase projesinin bağlanması gerekiyor.",
    "install.chrome":"Chrome'da ⋮ menüsünü aç ve “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini seç."
  }
};

const HOME_QUOTES={sq:"Ne e bëjmë të pamundurën të mundur.",de:"Wir machen das Unmögliche möglich.",tr:"İmkânsızı mümkün kılıyoruz.",en:"We make the impossible possible.",it:"Rendiamo possibile l’impossibile.",hr:"Mi činimo nemoguće mogućim.",ar:"نحن نجعل المستحيل ممكناً.",fr:"Nous rendons l’impossible possible."};

const EXTRA_I18N = {
  sq:{
    "tabs.clock":"Ora","tabs.sport":"Sport","tabs.games":"Lojëra","tabs.tv":"TV","tabs.radio":"Radio","tabs.chat":"Chat",
    "theme.title":"Ngjyrat e mia","theme.note":"Ndryshimet ruhen vetëm në këtë telefon.","theme.bg":"Sfondi","theme.cards":"Kartat","theme.buttons":"Butonat","theme.accent":"Aktive / ikonat","theme.text":"Teksti","theme.reset":"Kthe ngjyrat fillestare",
    "menu.title":"Renditja e ikonave","menu.note":"Vetëm Admini e ndryshon. Renditja u del të gjithëve.","menu.save":"Ruaj renditjen",
    "clock.title":"Ora Diamond","clock.description":"Widget modern për ekranin kryesor. Ora vazhdon të shihet edhe kur app-i është i mbyllur.","clock.germany":"Gjermani","clock.kosovo":"Kosovë","clock.turkey":"Turqi","clock.newyork":"New York","clock.add":"Shto orën në ekran","clock.androidHint":"Në Android, shtype butonin për ta vendosur widgetin në Home Screen.","clock.pinRequest":"Android do të hapë kërkesën për widget. Zgjidh “Shto”.","clock.nativeOnly":"Widgeti i ekranit kryesor është i disponueshëm në versionin Android të Diamond.",
    "chat.title":"Chat","chat.free":"Chat falas dhe pa kufi për të gjithë.","chat.freeBadge":"FALAS","chat.account":"Emri / llogaria jote","chat.namePlaceholder":"Shkruaj emrin","chat.saveName":"Ruaj emrin","chat.nameRule":"Emrin mund ta zgjedhësh vetëm një herë. Pastaj nuk mund të ndryshohet. Emrat që përdoren nga dikush tjetër nuk lejohen.","chat.messagePlaceholder":"Shkruaj mesazhin...","chat.send":"Dërgo","chat.messages":"Mesazhet","admin.installsTitle":"Instalime","admin.installsNote":"Pajisje që e kanë hapur versionin e ri të app-it."
  },
  de:{
    "tabs.clock":"Uhr","tabs.sport":"Sport","tabs.games":"Spiele","tabs.tv":"TV","tabs.radio":"Radio","tabs.chat":"Chat",
    "theme.title":"Meine Farben","theme.note":"Änderungen werden nur auf diesem Telefon gespeichert.","theme.bg":"Hintergrund","theme.cards":"Karten","theme.buttons":"Schaltflächen","theme.accent":"Aktiv / Symbole","theme.text":"Text","theme.reset":"Standardfarben wiederherstellen",
    "menu.title":"Reihenfolge der Symbole","menu.note":"Nur der Admin kann sie ändern. Die Reihenfolge gilt für alle.","menu.save":"Reihenfolge speichern",
    "clock.title":"Diamond Uhr","clock.description":"Modernes Widget für den Startbildschirm. Die Uhr bleibt sichtbar, auch wenn die App geschlossen ist.","clock.germany":"Deutschland","clock.kosovo":"Kosovo","clock.turkey":"Türkei","clock.newyork":"New York","clock.add":"Uhr zum Bildschirm hinzufügen","clock.androidHint":"Tippe unter Android auf die Schaltfläche, um das Widget zum Startbildschirm hinzuzufügen.","clock.pinRequest":"Android öffnet die Widget-Anfrage. Wähle „Hinzufügen“.","clock.nativeOnly":"Das Startbildschirm-Widget ist in der Android-Version von Diamond verfügbar.",
    "chat.title":"Chat","chat.free":"Kostenloser und unbegrenzter Chat für alle.","chat.freeBadge":"KOSTENLOS","chat.account":"Dein Name / Konto","chat.namePlaceholder":"Name eingeben","chat.saveName":"Name speichern","chat.nameRule":"Du kannst deinen Namen nur einmal wählen. Danach kann er nicht mehr geändert werden. Bereits verwendete Namen sind nicht erlaubt.","chat.messagePlaceholder":"Nachricht schreiben...","chat.send":"Senden","chat.messages":"Nachrichten","admin.installsTitle":"Installationen","admin.installsNote":"Geräte, die die neue App-Version geöffnet haben."
  },
  tr:{
    "tabs.clock":"Saat","tabs.sport":"Spor","tabs.games":"Oyunlar","tabs.tv":"TV","tabs.radio":"Radyo","tabs.chat":"Sohbet",
    "theme.title":"Renklerim","theme.note":"Değişiklikler yalnızca bu telefonda saklanır.","theme.bg":"Arka plan","theme.cards":"Kartlar","theme.buttons":"Düğmeler","theme.accent":"Aktif / simgeler","theme.text":"Metin","theme.reset":"Varsayılan renklere dön",
    "menu.title":"Simge sıralaması","menu.note":"Yalnızca yönetici değiştirebilir. Sıralama herkes için geçerlidir.","menu.save":"Sıralamayı kaydet",
    "clock.title":"Diamond Saat","clock.description":"Ana ekran için modern widget. Uygulama kapalıyken de saat görünür.","clock.germany":"Almanya","clock.kosovo":"Kosova","clock.turkey":"Türkiye","clock.newyork":"New York","clock.add":"Saati ekrana ekle","clock.androidHint":"Android'de widgetı ana ekrana eklemek için düğmeye bas.","clock.pinRequest":"Android widget ekleme isteğini açacak. “Ekle”yi seç.","clock.nativeOnly":"Ana ekran widgetı Diamond'nin Android sürümünde kullanılabilir.",
    "chat.title":"Sohbet","chat.free":"Herkes için ücretsiz ve sınırsız sohbet.","chat.freeBadge":"ÜCRETSİZ","chat.account":"Adın / hesabın","chat.namePlaceholder":"Adını yaz","chat.saveName":"Adı kaydet","chat.nameRule":"Adını yalnızca bir kez seçebilirsin. Sonra değiştirilemez. Başkasının kullandığı adlara izin verilmez.","chat.messagePlaceholder":"Mesaj yaz...","chat.send":"Gönder","chat.messages":"Mesajlar","admin.installsTitle":"Kurulumlar","admin.installsNote":"Uygulamanın yeni sürümünü açan cihazlar."
  },
  en:{
    "language.label":"Language","app.subtitle":"","mode.family":"User","mode.admin":"Admin",
    "login.label":"Access code","login.placeholder":"Enter code","login.adminPlaceholder":"Administrator code","login.familyPlaceholder":"Family code","login.button":"Sign in","login.userButton":"Sign in as User","login.userDirectHint":"Users sign in directly without a code.",
    "install.app":"Install app","install.short":"Install","share":"Share APK","logout":"Log out","online":"Online:","auth.note":"",
    "tabs.photos":"Ads","tabs.info":"Information","tabs.prayer":"Prayer","tabs.clock":"Clock","tabs.sport":"Sport","tabs.games":"Games","tabs.tv":"TV","tabs.radio":"Radio","tabs.chat":"Chat",
    "upload.addPhoto":"Add ad","upload.addMedia":"Add ad (photo or video)","upload.adminHint":"Only the administrator can upload and manage ads.","upload.familyTitle":"Add your photos","upload.button":"Upload","upload.familyHint":"You uploaded {used}/3 photos. You can add {remaining} more.",
    "storage.title":"Storage used","storage.adminOnly":"Visible only to the administrator","materials":" items","refresh":"Refresh",
    "empty.mediaTitle":"No ads yet","empty.mediaBody":"When the administrator uploads an ad, it will appear here.",
    "info.title":"Information","info.familyWrite":"Only the administrator can write here.","info.name":"Name","info.namePlaceholder":"Enter your name","info.message":"Message","info.messagePlaceholder":"Write information...","info.publish":"Publish","info.notes":" notes","info.emptyTitle":"No information yet","info.emptyBody":"When the administrator publishes something, it will appear here.",
    "role.admin":"Administrator","role.family":"Family member","download":"Download","delete":"Delete","material":"Item","photo":"Photo","confirm.delete":"Delete this item?","confirm.deleteInfo":"Delete this information?",
    "prayer.title":"Prayer times","prayer.locationPrompt":"Choose the phone location.","prayer.locationBtn":"Location","prayer.method":"Times are calculated from the phone location using the Diyanet method.","prayer.alarmTitle":"🔔 Alarms are optional.","prayer.alarmBody":"Enable only the prayers for which you want a notification on this phone. In the Android APK the alarm is registered in the system and works even when the app is closed.",
    "prayer.Fajr":"Fajr","prayer.Dhuhr":"Dhuhr","prayer.Asr":"Asr","prayer.Maghrib":"Maghrib","prayer.Isha":"Isha","prayer.next":"Next prayer: {name} at {time}","prayer.nextTomorrow":"Next prayer: Fajr tomorrow","prayer.remaining":"{time} remaining","prayer.zone":"Zone: {zone}","prayer.qibla":"Qibla","prayer.qiblaActivate":"Activate compass","prayer.qiblaNeedLocation":"Choose location for Qibla direction.","prayer.qiblaFromNorth":"{degrees}° from north","prayer.qiblaReady":"Turn the phone until the arrow points up.","prayer.qiblaNoSensor":"Direction is calculated from north. The phone compass was not activated.","prayer.kerahat":"Disliked prayer times","prayer.kerahatSunrise":"After sunrise","prayer.kerahatNoon":"Before Dhuhr","prayer.kerahatSunset":"Before Maghrib","prayer.kerahatNote":"These intervals are approximate and may vary by school of law.",
    "alarm.on":"🔔 Alarm ON","alarm.off":"🔕 Alarm OFF","alarm.activating":"Registering system alarm for {name}…","alarm.activated":"System alarm for {name} was enabled.","alarm.webActivated":"Alarm enabled. For alarms while the app is closed, use the Android APK.","alarm.disabled":"Alarm for {name} was disabled.","alarm.title":"🕌 Prayer time","alarm.body":"It is time for {name} ({time}).","alarm.stop":"Stop","alarm.channel":"Prayer alarms","alarm.channelDesc":"Prayer time alarm",
    "login.enterCode":"Enter the code.","login.checking":"Checking code…","login.badCode":"The code does not match this account.","login.emailUnconfirmed":"The Supabase account has not been confirmed yet.","login.rateLimit":"Too many attempts. Wait a little and try again.","login.failed":"Unable to sign in. Check the code.",
    "info.enterName":"Enter the name.","info.enterMessage":"Enter the message.","info.publishing":"Publishing...","info.published":"Published.",
    "family.limit":"You reached the 3-photo limit. Delete one of your photos to upload another.","family.onlyOwnDelete":"You can delete only photos you uploaded yourself.","family.onlyPhotos":"Family members can upload photos only.","family.remaining":"You can upload only {remaining} more photos. The limit is 3 photos per person/device.",
    "upload.chooseMedia":"Choose at least one photo or video.","upload.choosePhoto":"Choose at least one photo.","upload.none":"No files were uploaded.","upload.done":"Uploaded {count} items.","location.permission":"Allow location access for prayer times.","location.notFound":"Location was not found. Try again.","location.timeout":"Location took too long. Try again.","location.loading":"Getting location…","prayer.loading":"Loading prayer times…","prayer.updated":"Prayer times updated.",
    "share.text":"Download and install the Diamond APK on Android.","share.copied":"APK link copied. You can send it now.","error.supabaseNotLinked":"Supabase is not linked yet. Project URL and anon key are required.","error.infoNotReady":"Information is not ready yet.","error.publishFailed":"Publishing failed: {error}","error.locationUnsupported":"This phone does not support location.","error.prayerFetch":"Prayer times could not be loaded.","prayer.locationTap":"Tap “Location” for accurate prayer times.","error.futureTimes":"No future times found for {name}.","error.supabaseNotReady":"Supabase is not ready yet","error.runSql":"Run supabase/setup.sql in the SQL Editor.","error.storageSql":"The storage meter requires the SQL update.","error.fileTooLarge":"{name} is over 50 MB even after optimization and was skipped.","upload.savedSpace":"Saved about {size} of space.","upload.skipped":"{count} files were skipped.","error.uploadFailed":"Upload failed: {error}","error.setupSupabase":"The app has been moved to Supabase Free. Only the Supabase project connection is needed now.","install.chrome":"In Chrome, open the ⋮ menu and choose “Install app” or “Add to Home screen”.",
    "theme.title":"My colors","theme.note":"Changes are saved only on this phone.","theme.bg":"Background","theme.cards":"Cards","theme.buttons":"Buttons","theme.accent":"Active / icons","theme.text":"Text","theme.reset":"Restore default colors","menu.title":"Icon order","menu.note":"Only the Admin can change it. The order is shown to everyone.","menu.save":"Save order",
    "clock.title":"Diamond Clock","clock.description":"Modern home-screen widget. The clock remains visible even when the app is closed.","clock.germany":"Germany","clock.kosovo":"Kosovo","clock.turkey":"Turkey","clock.newyork":"New York","clock.add":"Add clock to screen","clock.androidHint":"On Android, press the button to place the widget on the Home Screen.","clock.pinRequest":"Android will open the widget request. Choose “Add”.","clock.nativeOnly":"The home-screen widget is available in the Android version of Diamond.",
    "chat.title":"Chat","chat.free":"Free and unlimited chat for everyone.","chat.freeBadge":"FREE","chat.account":"Your name / account","chat.namePlaceholder":"Enter your name","chat.saveName":"Save name","chat.nameRule":"You can choose your name only once. It cannot be changed afterward. Names already used by someone else are not allowed.","chat.messagePlaceholder":"Write a message...","chat.send":"Send","chat.messages":"Messages","admin.installsTitle":"Installations","admin.installsNote":"Appareils ayant ouvert la nouvelle version de l’application.","admin.installsTitle":"Installs","admin.installsNote":"Devices that have opened the new app version."
  },
  it:{
    "language.label":"Lingua","app.subtitle":"","mode.family":"Utente","mode.admin":"Admin","login.label":"Codice di accesso","login.placeholder":"Inserisci codice","login.adminPlaceholder":"Codice amministratore","login.familyPlaceholder":"Codice famiglia","login.button":"Accedi","login.userButton":"Accedi come utente","login.userDirectHint":"L'utente accede direttamente senza codice.","install.app":"Installa app","install.short":"Installa","share":"Condividi APK","logout":"Esci","online":"Online:",
    "tabs.photos":"Pubblicità","tabs.info":"Informazioni","tabs.prayer":"Preghiera","tabs.clock":"Ora","tabs.sport":"Sport","tabs.games":"Giochi","tabs.tv":"TV","tabs.radio":"Radio","tabs.chat":"Chat","refresh":"Aggiorna","role.admin":"Amministratore","role.family":"Membro della famiglia","download":"Scarica","delete":"Elimina",
    "prayer.title":"Orari di preghiera","prayer.locationPrompt":"Scegli la posizione del telefono.","prayer.locationBtn":"Posizione","prayer.Fajr":"Fajr","prayer.Dhuhr":"Dhuhr","prayer.Asr":"Asr","prayer.Maghrib":"Maghrib","prayer.Isha":"Isha","prayer.next":"Prossima preghiera: {name} alle {time}","prayer.remaining":"Mancano {time}","prayer.qibla":"Qibla","prayer.qiblaActivate":"Attiva bussola","prayer.kerahat":"Orari sconsigliati",
    "theme.title":"I miei colori","theme.note":"Le modifiche vengono salvate solo su questo telefono.","theme.bg":"Sfondo","theme.cards":"Schede","theme.buttons":"Pulsanti","theme.accent":"Attivo / icone","theme.text":"Testo","theme.reset":"Ripristina colori predefiniti","menu.title":"Ordine icone","menu.note":"Solo l'Admin può modificarlo. L'ordine vale per tutti.","menu.save":"Salva ordine",
    "clock.title":"Ora Diamond","clock.description":"Widget moderno per la schermata Home. L'ora resta visibile anche quando l'app è chiusa.","clock.germany":"Germania","clock.kosovo":"Kosovo","clock.turkey":"Turchia","clock.newyork":"New York","clock.add":"Aggiungi l'orologio allo schermo","clock.androidHint":"Su Android, premi il pulsante per aggiungere il widget alla schermata Home.","clock.pinRequest":"Android aprirà la richiesta del widget. Scegli “Aggiungi”.","clock.nativeOnly":"Il widget della schermata Home è disponibile nella versione Android di Diamond.",
    "chat.title":"Chat","chat.free":"Chat gratuita e senza limiti per tutti.","chat.freeBadge":"GRATIS","chat.account":"Il tuo nome / account","chat.namePlaceholder":"Inserisci il nome","chat.saveName":"Salva nome","chat.nameRule":"Puoi scegliere il nome una sola volta. Dopo non potrà essere modificato. I nomi già usati non sono consentiti.","chat.messagePlaceholder":"Scrivi un messaggio...","chat.send":"Invia","chat.messages":"Messaggi","admin.installsTitle":"Installazioni","admin.installsNote":"Dispositivi che hanno aperto la nuova versione dell’app."
  },
  hr:{
    "language.label":"Jezik","app.subtitle":"","mode.family":"Korisnik","mode.admin":"Admin","login.label":"Pristupni kod","login.placeholder":"Unesite kod","login.adminPlaceholder":"Administratorski kod","login.familyPlaceholder":"Obiteljski kod","login.button":"Prijava","login.userButton":"Prijavi se kao korisnik","login.userDirectHint":"Korisnik se prijavljuje izravno bez koda.","install.app":"Instaliraj aplikaciju","install.short":"Instaliraj","share":"Podijeli APK","logout":"Odjava","online":"Online:",
    "tabs.photos":"Oglasi","tabs.info":"Informacije","tabs.prayer":"Namaz","tabs.clock":"Sat","tabs.sport":"Sport","tabs.games":"Igre","tabs.tv":"TV","tabs.radio":"Radio","tabs.chat":"Chat","refresh":"Osvježi","role.admin":"Administrator","role.family":"Član obitelji","download":"Preuzmi","delete":"Izbriši",
    "prayer.title":"Vremena namaza","prayer.locationPrompt":"Odaberite lokaciju telefona.","prayer.locationBtn":"Lokacija","prayer.Fajr":"Sabah","prayer.Dhuhr":"Podne","prayer.Asr":"Ikindija","prayer.Maghrib":"Akšam","prayer.Isha":"Jacija","prayer.next":"Sljedeći namaz: {name} u {time}","prayer.remaining":"Preostalo {time}","prayer.qibla":"Kibla","prayer.qiblaActivate":"Aktiviraj kompas","prayer.kerahat":"Kerahat vrijeme",
    "theme.title":"Moje boje","theme.note":"Promjene se spremaju samo na ovom telefonu.","theme.bg":"Pozadina","theme.cards":"Kartice","theme.buttons":"Gumbi","theme.accent":"Aktivno / ikone","theme.text":"Tekst","theme.reset":"Vrati zadane boje","menu.title":"Redoslijed ikona","menu.note":"Samo Admin može mijenjati. Redoslijed vrijedi za sve.","menu.save":"Spremi redoslijed",
    "clock.title":"Diamond Sat","clock.description":"Moderan widget za početni zaslon. Sat ostaje vidljiv i kada je aplikacija zatvorena.","clock.germany":"Njemačka","clock.kosovo":"Kosovo","clock.turkey":"Turska","clock.newyork":"New York","clock.add":"Dodaj sat na zaslon","clock.androidHint":"Na Androidu pritisni gumb za dodavanje widgeta na početni zaslon.","clock.pinRequest":"Android će otvoriti zahtjev za widget. Odaberi “Dodaj”.","clock.nativeOnly":"Widget početnog zaslona dostupan je u Android verziji Diamond.",
    "chat.title":"Chat","chat.free":"Besplatan i neograničen chat za sve.","chat.freeBadge":"BESPLATNO","chat.account":"Tvoje ime / račun","chat.namePlaceholder":"Unesi ime","chat.saveName":"Spremi ime","chat.nameRule":"Ime možeš odabrati samo jednom. Nakon toga se ne može promijeniti. Već korištena imena nisu dopuštena.","chat.messagePlaceholder":"Napiši poruku...","chat.send":"Pošalji","chat.messages":"Poruke","admin.installsTitle":"Instalacije","admin.installsNote":"Uređaji koji su otvorili novu verziju aplikacije."
  },
  ar:{
    "language.label":"اللغة","app.subtitle":"","mode.family":"المستخدم","mode.admin":"المشرف","login.label":"رمز الدخول","login.placeholder":"أدخل الرمز","login.adminPlaceholder":"رمز المشرف","login.familyPlaceholder":"رمز العائلة","login.button":"دخول","login.userButton":"الدخول كمستخدم","login.userDirectHint":"يدخل المستخدم مباشرة دون رمز.","install.app":"تثبيت التطبيق","install.short":"تثبيت","share":"مشاركة APK","logout":"تسجيل الخروج","online":"متصل:",
    "tabs.photos":"الإعلانات","tabs.info":"المعلومات","tabs.prayer":"الصلاة","tabs.clock":"الساعة","tabs.sport":"الرياضة","tabs.games":"الألعاب","tabs.tv":"TV","tabs.radio":"الراديو","tabs.chat":"الدردشة","refresh":"تحديث","role.admin":"المشرف","role.family":"عضو العائلة","download":"تنزيل","delete":"حذف",
    "prayer.title":"مواقيت الصلاة","prayer.locationPrompt":"اختر موقع الهاتف.","prayer.locationBtn":"الموقع","prayer.Fajr":"الفجر","prayer.Dhuhr":"الظهر","prayer.Asr":"العصر","prayer.Maghrib":"المغرب","prayer.Isha":"العشاء","prayer.next":"الصلاة التالية: {name} عند {time}","prayer.remaining":"متبقي {time}","prayer.qibla":"القبلة","prayer.qiblaActivate":"تفعيل البوصلة","prayer.kerahat":"أوقات الكراهة",
    "theme.title":"ألواني","theme.note":"يتم حفظ التغييرات على هذا الهاتف فقط.","theme.bg":"الخلفية","theme.cards":"البطاقات","theme.buttons":"الأزرار","theme.accent":"النشط / الأيقونات","theme.text":"النص","theme.reset":"استعادة الألوان الافتراضية","menu.title":"ترتيب الأيقونات","menu.note":"يمكن للمشرف فقط تغييره. يظهر الترتيب للجميع.","menu.save":"حفظ الترتيب",
    "clock.title":"ساعة Diamond","clock.description":"ودجت حديث للشاشة الرئيسية. تبقى الساعة ظاهرة حتى عند إغلاق التطبيق.","clock.germany":"ألمانيا","clock.kosovo":"كوسوفو","clock.turkey":"تركيا","clock.newyork":"نيويورك","clock.add":"إضافة الساعة إلى الشاشة","clock.androidHint":"على Android اضغط الزر لإضافة الودجت إلى الشاشة الرئيسية.","clock.pinRequest":"سيفتح Android طلب إضافة الودجت. اختر «إضافة».","clock.nativeOnly":"ودجت الشاشة الرئيسية متاح في نسخة Android من Diamond.",
    "chat.title":"الدردشة","chat.free":"دردشة مجانية وغير محدودة للجميع.","chat.freeBadge":"مجاني","chat.account":"اسمك / حسابك","chat.namePlaceholder":"أدخل الاسم","chat.saveName":"حفظ الاسم","chat.nameRule":"يمكنك اختيار الاسم مرة واحدة فقط، وبعدها لا يمكن تغييره. الأسماء المستخدمة من أشخاص آخرين غير مسموحة.","chat.messagePlaceholder":"اكتب رسالة...","chat.send":"إرسال","chat.messages":"الرسائل","admin.installsTitle":"التثبيتات","admin.installsNote":"الأجهزة التي فتحت الإصدار الجديد من التطبيق."
  },
  fr:{
    "language.label":"Langue","app.subtitle":"","mode.family":"Utilisateur","mode.admin":"Admin","login.label":"Code d'accès","login.placeholder":"Entrez le code","login.adminPlaceholder":"Code administrateur","login.familyPlaceholder":"Code famille","login.button":"Connexion","login.userButton":"Se connecter comme utilisateur","login.userDirectHint":"L'utilisateur se connecte directement sans code.","install.app":"Installer l'application","install.short":"Installer","share":"Partager l'APK","logout":"Déconnexion","online":"En ligne :",
    "tabs.photos":"Publicités","tabs.info":"Informations","tabs.prayer":"Prière","tabs.clock":"Horloge","tabs.sport":"Sport","tabs.games":"Jeux","tabs.tv":"TV","tabs.radio":"Radio","tabs.chat":"Chat","refresh":"Actualiser","role.admin":"Administrateur","role.family":"Membre de la famille","download":"Télécharger","delete":"Supprimer",
    "prayer.title":"Horaires de prière","prayer.locationPrompt":"Choisissez la position du téléphone.","prayer.locationBtn":"Position","prayer.Fajr":"Fajr","prayer.Dhuhr":"Dhuhr","prayer.Asr":"Asr","prayer.Maghrib":"Maghrib","prayer.Isha":"Isha","prayer.next":"Prochaine prière : {name} à {time}","prayer.remaining":"Il reste {time}","prayer.qibla":"Qibla","prayer.qiblaActivate":"Activer la boussole","prayer.kerahat":"Horaires déconseillés",
    "theme.title":"Mes couleurs","theme.note":"Les modifications sont enregistrées uniquement sur ce téléphone.","theme.bg":"Arrière-plan","theme.cards":"Cartes","theme.buttons":"Boutons","theme.accent":"Actif / icônes","theme.text":"Texte","theme.reset":"Restaurer les couleurs par défaut","menu.title":"Ordre des icônes","menu.note":"Seul l'Admin peut le modifier. L'ordre s'applique à tous.","menu.save":"Enregistrer l'ordre",
    "clock.title":"Horloge Diamond","clock.description":"Widget moderne pour l'écran d'accueil. L'horloge reste visible même lorsque l'application est fermée.","clock.germany":"Allemagne","clock.kosovo":"Kosovo","clock.turkey":"Turquie","clock.newyork":"New York","clock.add":"Ajouter l'horloge à l'écran","clock.androidHint":"Sur Android, appuyez sur le bouton pour ajouter le widget à l'écran d'accueil.","clock.pinRequest":"Android ouvrira la demande de widget. Choisissez « Ajouter ».","clock.nativeOnly":"Le widget d'écran d'accueil est disponible dans la version Android de Diamond.",
    "chat.title":"Chat","chat.free":"Chat gratuit et illimité pour tous.","chat.freeBadge":"GRATUIT","chat.account":"Votre nom / compte","chat.namePlaceholder":"Entrez le nom","chat.saveName":"Enregistrer le nom","chat.nameRule":"Vous ne pouvez choisir votre nom qu'une seule fois. Ensuite il ne peut plus être modifié. Les noms déjà utilisés ne sont pas autorisés.","chat.messagePlaceholder":"Écrire un message...","chat.send":"Envoyer","chat.messages":"Messages"
  }
};

for(const [code,values] of Object.entries(EXTRA_I18N)){
  I18N[code] = {...(I18N[code]||I18N.en||I18N.sq), ...values};
}

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "sq";
if (!I18N[currentLanguage]) currentLanguage = "sq";

function t(key, vars = {}) {
  let value = I18N[currentLanguage]?.[key] ?? I18N.en?.[key] ?? I18N.sq[key] ?? key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll("{" + name + "}", String(replacement));
  }
  return value;
}

async function loadDiamondWeather() {
  const cityEl=document.getElementById("diamondWeatherCity");
  const weekEl=document.getElementById("diamondWeatherWeek");
  if(!cityEl||!weekEl) return;
  const lang=currentLanguage || "sq";
  const render=async(lat,lon,city)=>{
    try{
      const url="https://api.open-meteo.com/v1/forecast?latitude="+encodeURIComponent(lat)+"&longitude="+encodeURIComponent(lon)+"&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7";
      const r=await fetch(url,{cache:"no-store"}); if(!r.ok) throw new Error("weather");
      const d=await r.json(); const daily=d.daily||{};
      const days=(daily.time||[]).map((date,i)=>{
        const dt=new Date(date+"T12:00:00");
        const name=new Intl.DateTimeFormat(lang,{weekday:"short"}).format(dt);
        const code=Number(daily.weather_code?.[i]??0);
        const icon=code===0?"☀️":code<=3?"⛅":code<=48?"🌫️":code<=67?"🌧️":code<=77?"🌨️":code<=82?"🌦️":"⛈️";
        return name+" "+icon+" "+Math.round(daily.temperature_2m_max?.[i])+"°/"+Math.round(daily.temperature_2m_min?.[i])+"°";
      });
      cityEl.textContent="📍 "+city;
      weekEl.textContent=days.join(" · ");
    }catch(_){ weekEl.textContent="Moti 7 ditë"; }
  };
  const fallback=()=>render(48.7758,9.1829,"Stuttgart");
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async pos=>{
      let city="Vendndodhja ime";
      try{
        const r=await fetch("https://geocoding-api.open-meteo.com/v1/reverse?latitude="+pos.coords.latitude+"&longitude="+pos.coords.longitude+"&language="+lang+"&format=json");
        if(r.ok){const j=await r.json(); city=j.results?.[0]?.name||city;}
      }catch(_){}
      render(pos.coords.latitude,pos.coords.longitude,city);
    },fallback,{enableHighAccuracy:false,timeout:5000,maximumAge:1800000});
  } else fallback();
}

function prayerLabel(key) {
  return t("prayer." + key);
}

function applyLanguage(language = currentLanguage) {
  if (!I18N[language]) language = "sq";
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  const dq=document.getElementById("diamondQuote"); if(dq) dq.textContent="“"+(HOME_QUOTES[language]||HOME_QUOTES.sq)+"”";

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

  try { window.AndroidClock?.setLanguage?.(language); } catch (_) {}
  window.PajazitiSports?.reloadLanguage?.();
  window.PajazitiGames?.reloadLanguage?.();
  window.PajazitiTV?.reloadLanguage?.();
  window.PajazitiRadio?.reloadLanguage?.();
  window.DiamondQuran?.reloadLanguage?.();
  window.DiamondPrayerGuide?.reloadLanguage?.();
  window.DiamondPrayerExtras?.reloadLanguage?.(language);
  window.DiamondRuqya?.reloadLanguage?.();
  window.DiamondDiet?.reloadLanguage?.();
  const simple={
    sq:{diet:"Diet",ki:"KI",share:"Ndaje appin",news:"Lajme",back:"← Kthehu mbrapa",admin:"Admin",login:"Hyr"},
    de:{diet:"Ernährung",ki:"KI",share:"App teilen",news:"Nachrichten",back:"← Zurück",admin:"Admin",login:"Anmelden"},
    tr:{diet:"Diyet",ki:"YZ",share:"Uygulamayı paylaş",news:"Haberler",back:"← Geri",admin:"Yönetici",login:"Giriş"},
    en:{diet:"Diet",ki:"AI",share:"Share app",news:"News",back:"← Back",admin:"Admin",login:"Sign in"},
    it:{diet:"Dieta",ki:"IA",share:"Condividi app",news:"Notizie",back:"← Indietro",admin:"Admin",login:"Accedi"},
    hr:{diet:"Prehrana",ki:"AI",share:"Podijeli aplikaciju",news:"Vijesti",back:"← Natrag",admin:"Admin",login:"Prijava"},
    fr:{diet:"Régime",ki:"IA",share:"Partager l’app",news:"Actualités",back:"← Retour",admin:"Admin",login:"Connexion"},
    ar:{diet:"النظام الغذائي",ki:"الذكاء الاصطناعي",share:"مشاركة التطبيق",news:"الأخبار",back:"← رجوع",admin:"المشرف",login:"دخول"}
  }[language]||{};
  [["dietTabLabel","diet"],["kiTabLabel","ki"],["shareAppTabLabel","share"],["newsTabLabel","news"],["sectionBackBtn","back"],["adminMode","admin"],["loginBtn","login"]].forEach(([id,k])=>{const el=document.getElementById(id);if(el&&simple[k])el.textContent=simple[k];});
  window.DiamondKI?.reloadLanguage?.();
  window.DiamondShareApp?.reloadLanguage?.();
  window.DiamondNews?.reloadLanguage?.();
  loadDiamondWeather().catch(()=>{});

  if (typeof mode !== "undefined" && codeInput) {
    codeInput.placeholder = mode === "admin"
      ? t("login.adminPlaceholder")
      : t("login.familyPlaceholder");
  }

  if (typeof mode !== "undefined" && loginBtn) {
    loginBtn.textContent = mode === "admin"
      ? t("login.button")
      : t("login.userButton");
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
const clockTab = $("clockTab");
const sportTab = $("sportTab");
const gamesTab = $("gamesTab");
const tvTab = $("tvTab");
const radioTab = $("radioTab");
const dietTab = $("dietTab");
const kiTab = $("kiTab");
const shareAppTab = $("shareAppTab");
const newsTab = $("newsTab");
const menuOrderAdmin = $("menuOrderAdmin");
const menuOrderList = $("menuOrderList");
const menuOrderSave = $("menuOrderSave");
const menuOrderStatus = $("menuOrderStatus");
const galleryView = $("galleryView");
const infoView = $("infoView");
const prayerView = $("prayerView");
const clockView = $("clockView");
const sportView = $("sportView");
const gamesView = $("gamesView");
const tvView = $("tvView");
const radioView = $("radioView");
const dietView = $("dietView");
const kiView = $("kiView");
const shareAppView = $("shareAppView");
const newsView = $("newsView");
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
const appVersionLabel = $("appVersionLabel");
const languageSelectLogin = $("languageSelectLogin");
const languageSelectApp = $("languageSelectApp");
const themeBtn = $("themeBtn");
const themePanel = $("themePanel");
const themeCloseBtn = $("themeCloseBtn");
const themeResetBtn = $("themeResetBtn");
const themeBgColor = $("themeBgColor");
const themeCardColor = $("themeCardColor");
const themeButtonColor = $("themeButtonColor");
const themeAccentColor = $("themeAccentColor");
const themeTextColor = $("themeTextColor");
const installStatsCard = $("installStatsCard");
const installCount = $("installCount");
const shareDeviceCount = $("shareDeviceCount");
const dailyActiveCount = $("dailyActiveCount");
const newDeviceNotifyBtn = $("newDeviceNotifyBtn");
const adminStatsStatus = $("adminStatsStatus");
const storageCard = $("storageCard");
const storageUsed = $("storageUsed");
const storagePercent = $("storagePercent");
const storageBar = $("storageBar");
const prayerLocation = $("prayerLocation");
const prayerLocationBtn = $("prayerLocationBtn");
const prayerNext = $("prayerNext");
const prayerStatus = $("prayerStatus");
const prayerList = $("prayerList");
const qiblaArrow = $("qiblaArrow");
const qiblaDirection = $("qiblaDirection");
const qiblaStatus = $("qiblaStatus");
const qiblaCompassBtn = $("qiblaCompassBtn");
const kerahatSunrise = $("kerahatSunrise");
const kerahatNoon = $("kerahatNoon");
const kerahatSunset = $("kerahatSunset");
const chatPlanBadge = $("chatPlanBadge");
const chatName = $("chatName");
const chatSaveNameBtn = $("chatSaveNameBtn");
const chatText = $("chatText");
const chatLimitText = $("chatLimitText");
const chatSendBtn = $("chatSendBtn");
const chatStatus = $("chatStatus");
const chatRefreshBtn = $("chatRefreshBtn");
const chatList = $("chatList");
const addClockWidgetBtn = $("addClockWidgetBtn");
const clockWidgetStatus = $("clockWidgetStatus");
let clockPreviewTimer = null;

function refreshAppVersionLabel(){
  if(!appVersionLabel) return;
  try{
    const version=window.AndroidApp?.getVersionName?.();
    if(version){
      appVersionLabel.textContent="v"+String(version).replace(/^v/i,"");
      return;
    }
  }catch(_){}
  if(!appVersionLabel.textContent.trim()) appVersionLabel.textContent="v5.4";
}
refreshAppVersionLabel();

languageSelectLogin?.addEventListener("change", (e) => applyLanguage(e.target.value));
languageSelectApp?.addEventListener("change", (e) => applyLanguage(e.target.value));

const PERSONAL_THEME_KEY = "pajaziti_personal_theme_v2";
const DEFAULT_PERSONAL_THEME = {
  bg: "#91d7df",
  card: "#d6d3c2",
  button: "#c4dbc1",
  accent: "#7b3aec",
  text: "#111827"
};

function isThemeColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function normalizePersonalTheme(value = {}) {
  const result = { ...DEFAULT_PERSONAL_THEME };
  for (const key of Object.keys(result)) {
    if (isThemeColor(value?.[key])) result[key] = value[key];
  }
  return result;
}

function readPersonalTheme() {
  try {
    return normalizePersonalTheme(JSON.parse(localStorage.getItem(PERSONAL_THEME_KEY) || "{}"));
  } catch {
    return { ...DEFAULT_PERSONAL_THEME };
  }
}

function syncThemeInputs(theme) {
  if (themeBgColor) themeBgColor.value = theme.bg;
  if (themeCardColor) themeCardColor.value = theme.card;
  if (themeButtonColor) themeButtonColor.value = theme.button;
  if (themeAccentColor) themeAccentColor.value = theme.accent;
  if (themeTextColor) themeTextColor.value = theme.text;
}

function applyPersonalTheme(value, persist = true) {
  const theme = normalizePersonalTheme(value);
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", theme.bg);
  root.style.setProperty("--theme-card", theme.card);
  root.style.setProperty("--theme-button", theme.button);
  root.style.setProperty("--theme-accent", theme.accent);
  root.style.setProperty("--theme-text", theme.text);

  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.bg);
  syncThemeInputs(theme);

  if (persist) {
    localStorage.setItem(PERSONAL_THEME_KEY, JSON.stringify(theme));
  }
}

function themeFromInputs() {
  return normalizePersonalTheme({
    bg: themeBgColor?.value,
    card: themeCardColor?.value,
    button: themeButtonColor?.value,
    accent: themeAccentColor?.value,
    text: themeTextColor?.value
  });
}

applyPersonalTheme(readPersonalTheme(), false);

themeBtn?.addEventListener("click", () => {
  themePanel?.classList.toggle("hidden");
  if (!themePanel?.classList.contains("hidden")) {
    syncThemeInputs(readPersonalTheme());
  }
});

themeCloseBtn?.addEventListener("click", () => {
  themePanel?.classList.add("hidden");
});

[themeBgColor, themeCardColor, themeButtonColor, themeAccentColor, themeTextColor]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener("input", () => applyPersonalTheme(themeFromInputs()));
    input.addEventListener("change", () => applyPersonalTheme(themeFromInputs()));
  });

themeResetBtn?.addEventListener("click", () => {
  localStorage.removeItem(PERSONAL_THEME_KEY);
  applyPersonalTheme(DEFAULT_PERSONAL_THEME, false);
});

let mode = ADMIN_ONLY ? "admin" : "family";
let realtimeChannel = null;
let installPrompt = null;
let currentUser = null;
let activeSection = "gallery";
let mediaItems = [];
let prayerTimings = null;
let prayerTimingsDate = "";
let prayerTimezone = "";
let prayerTomorrowFajr = "";
let prayerCheckTimer = null;
let prayerCountdownTimer = null;
let prayerAudioContext = null;
let qiblaBearing = null;
let qiblaHeading = null;
let qiblaCompassListening = false;
let nativeCalendarCache = null;
let nativeCalendarCacheKey = "";

const DEFAULT_TAB_ORDER = ["galleryTab","infoTab","prayerTab","clockTab","sportTab","gamesTab","tvTab","radioTab","dietTab","kiTab","shareAppTab","newsTab"];
const TAB_LABELS = {
  galleryTab:"📢 Reklama",
  infoTab:"ℹ️ Informacion",
  prayerTab:"🕌 Namazi",
  clockTab:"🕒 Ora",
  sportTab:"⚽ Sport",
  gamesTab:"🎮 Lojëra",
  tvTab:"📺 TV",
  radioTab:"📻 Radio",
  dietTab:"🥗 Diet",
  kiTab:"🤖 KI",
  shareAppTab:"🔗 Ndaje appin",
  newsTab:"📰 Lajme"
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
setMode(mode);

const PRESENCE_DEVICE_KEY = "pajaziti-presence-device";
let presenceDeviceId = localStorage.getItem(PRESENCE_DEVICE_KEY);
if (!presenceDeviceId) {
  presenceDeviceId =
    (globalThis.crypto?.randomUUID?.() || ("device_" + Math.random().toString(36).slice(2) + Date.now()));
  localStorage.setItem(PRESENCE_DEVICE_KEY, presenceDeviceId);
}

const CHAT_NAME_KEY = "pajaziti-chat-name";
let chatCurrentStatus = null;


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

let hiddenTabs=[];

function applyHiddenTabs(){
  for(const id of DEFAULT_TAB_ORDER){
    const el=document.getElementById(id);
    if(el) el.classList.toggle("admin-hidden-tab",hiddenTabs.includes(id));
  }
}

async function loadHiddenTabs(){
  if(!supabase || !currentUser) return;
  const {data,error}=await supabase
    .from("app_settings")
    .select("value")
    .eq("key","hidden_tabs")
    .maybeSingle();
  if(error){console.warn("Hidden tabs load",error);return;}
  hiddenTabs=Array.isArray(data?.value)?data.value.filter(id=>DEFAULT_TAB_ORDER.includes(id)):[];
  applyHiddenTabs();
  if(isAdmin()) renderMenuOrderAdmin();
}

async function saveHiddenTabs(){
  if(!supabase || !isAdmin()) return;
  const {error}=await supabase.from("app_settings").upsert({
    key:"hidden_tabs",
    value:hiddenTabs,
    updated_at:new Date().toISOString(),
    updated_by:currentUser.id
  },{onConflict:"key"});
  if(error){
    showMessage(menuOrderStatus,"Nuk u ruajt fshehja: "+error.message,"error");
    return;
  }
  applyHiddenTabs();
  showMessage(menuOrderStatus,"Folderët u përditësuan për të gjithë.","success");
}

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
        <button class="secondary menu-order-visibility" type="button" data-visible-id="${id}">${hiddenTabs.includes(id)?"↩️ Kthe":"🙈 Hiq"}</button>
        <button class="secondary menu-order-move" type="button" data-move="up" ${index===0?"disabled":""}>⬆️</button>
        <button class="secondary menu-order-move" type="button" data-move="down" ${index===order.length-1?"disabled":""}>⬇️</button>
      </div>
    </div>
  `).join("");

  menuOrderList.querySelectorAll(".menu-order-visibility").forEach((button)=>{
    button.addEventListener("click",async()=>{
      const id=button.dataset.visibleId;
      if(!id) return;
      if(hiddenTabs.includes(id)) hiddenTabs=hiddenTabs.filter(x=>x!==id);
      else hiddenTabs=[...new Set([...hiddenTabs,id])];
      await saveHiddenTabs();
      renderMenuOrderAdmin();
    });
  });

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

function updateClockPreview(){
  document.querySelectorAll("[data-clock-zone]").forEach((el)=>{
    try{
      el.textContent=new Intl.DateTimeFormat("sq-AL",{
        timeZone:el.dataset.clockZone,
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
      }).format(new Date());
    }catch(_){
      el.textContent="--:--";
    }
  });
}

function startClockPreview(){
  updateClockPreview();
  if(clockPreviewTimer) clearInterval(clockPreviewTimer);
  clockPreviewTimer=setInterval(updateClockPreview,1000);
}

function stopClockPreview(){
  if(clockPreviewTimer){
    clearInterval(clockPreviewTimer);
    clockPreviewTimer=null;
  }
}

addClockWidgetBtn?.addEventListener("click",()=>{
  try{
    if(window.AndroidClock?.isNativeAndroid?.()){
      clockWidgetStatus.textContent="📌 "+t("clock.pinRequest");
      window.AndroidClock.requestClockWidget();
      return;
    }
  }catch(_){}
  clockWidgetStatus.textContent=t("clock.nativeOnly");
});

function setSection(next) {
  activeSection = next;
  const sectionBackBtn = document.getElementById("sectionBackBtn");
  const appTabsNav = document.getElementById("appTabs");
  const isHome = next === "home";
  const showGallery = next === "gallery";
  const showInfo = next === "info";
  const showPrayer = next === "prayer";
  const showClock = next === "clock";
  const showSport = next === "sport";
  const showGames = next === "games";
  const showTv = next === "tv";
  const showRadio = next === "radio";
  const showDiet = next === "diet";
  const showKI = next === "ki";
  const showShareApp = next === "shareapp";
  const showNews = next === "news";

  galleryTab?.classList.toggle("active", showGallery);
  infoTab?.classList.toggle("active", showInfo);
  prayerTab?.classList.toggle("active", showPrayer);
  clockTab?.classList.toggle("active", showClock);
  sportTab?.classList.toggle("active", showSport);
  gamesTab?.classList.toggle("active", showGames);
  tvTab?.classList.toggle("active", showTv);
  radioTab?.classList.toggle("active", showRadio);
  dietTab?.classList.toggle("active", showDiet);
  kiTab?.classList.toggle("active", showKI);
  shareAppTab?.classList.toggle("active", showShareApp);
  newsTab?.classList.toggle("active", showNews);

  galleryView?.classList.toggle("hidden", !showGallery);
  infoView?.classList.toggle("hidden", !showInfo);
  prayerView?.classList.toggle("hidden", !showPrayer);
  clockView?.classList.toggle("hidden", !showClock);
  sportView?.classList.toggle("hidden", !showSport);
  gamesView?.classList.toggle("hidden", !showGames);
  tvView?.classList.toggle("hidden", !showTv);
  radioView?.classList.toggle("hidden", !showRadio);
  dietView?.classList.toggle("hidden", !showDiet);
  kiView?.classList.toggle("hidden", !showKI);
  shareAppView?.classList.toggle("hidden", !showShareApp);
  newsView?.classList.toggle("hidden", !showNews);

  appTabsNav?.classList.toggle("hidden", !isHome);
  sectionBackBtn?.classList.toggle("hidden", isHome);

  if (showInfo) loadInfo({ markRead: true });
  if (showPrayer) loadPrayerTimes(false);
  if (showClock) startClockPreview(); else stopClockPreview();
  if (showSport) window.PajazitiSports?.activate?.();
  if (showGames) window.PajazitiGames?.activate?.();
  if (showTv) window.PajazitiTV?.activate?.();
  if (showRadio) window.PajazitiRadio?.activate?.();
  if (showDiet) window.DiamondDiet?.activate?.();
  if (showKI) window.DiamondKI?.activate?.();
  if (showShareApp) window.DiamondShareApp?.activate?.();
  if (showNews) window.DiamondNews?.activate?.();
}
galleryTab?.addEventListener("click", () => setSection("gallery"));
infoTab?.addEventListener("click", () => setSection("info"));
prayerTab?.addEventListener("click", () => setSection("prayer"));
clockTab?.addEventListener("click", () => setSection("clock"));
sportTab?.addEventListener("click", () => setSection("sport"));
gamesTab?.addEventListener("click", () => setSection("games"));
tvTab?.addEventListener("click", () => setSection("tv"));
radioTab?.addEventListener("click", () => setSection("radio"));
dietTab?.addEventListener("click", () => setSection("diet"));
kiTab?.addEventListener("click", () => setSection("ki"));
shareAppTab?.addEventListener("click", () => setSection("shareapp"));
newsTab?.addEventListener("click", () => setSection("news"));
document.getElementById("sectionBackBtn")?.addEventListener("click", () => setSection("home"));

function setMode(next) {
  if (ADMIN_ONLY) next = "admin";
  else if (next !== "admin") next = "family";
  mode = next;

  familyMode?.classList.toggle("active", next === "family");
  adminMode?.classList.toggle("active", next === "admin");
  codeInput.value = "";
  codeInput.placeholder = t("login.adminPlaceholder");
  loginBtn.textContent = next === "admin" ? t("login.button") : t("login.userButton");
  loginMessage.textContent = "";

  if (ADMIN_ONLY) {
    document.querySelector(".mode-switch")?.classList.add("hidden");
    familyDirectHint?.classList.add("hidden");
    adminCodeWrap?.classList.remove("hidden");
  } else {
    document.querySelector(".mode-switch")?.classList.remove("hidden");
    familyMode?.classList.remove("hidden");
    adminMode?.classList.remove("hidden");
    familyDirectHint?.classList.toggle("hidden", next === "admin");
    adminCodeWrap?.classList.toggle("hidden", next !== "admin");
  }
}
familyMode?.addEventListener("click", () => setMode("family"));
adminMode?.addEventListener("click", () => setMode("admin"));

function showMessage(el, text, kind = "") {
  el.textContent = text;
  el.className = "message" + (kind ? " " + kind : "");
}

function isAdmin() {
  return currentUser?.email === ADMIN_EMAIL;
}

async function registerInstall(){
  if(!supabase || !currentUser || ADMIN_ONLY) return;
  try{
    let versionName="5.20";
    try{
      versionName=window.AndroidApp?.getVersionName?.() || versionName;
    }catch(_){}
    await supabase.from("app_installs").upsert({
      device_id: presenceDeviceId,
      user_id: currentUser.id,
      package_name: "com.pajaziti.familja",
      version_name: versionName,
      last_seen: new Date().toISOString()
    },{onConflict:"device_id"});
  }catch(error){
    console.warn("Install register",error);
  }
}

async function registerDailyActivity(){
  if(!supabase || !currentUser || ADMIN_ONLY) return;
  try{
    await supabase.rpc("log_daily_activity",{p_device:presenceDeviceId});
  }catch(error){
    console.warn("Daily activity",error);
  }
}

window.DiamondRegisterShareEvent = () => registerShareEvent();

async function registerShareEvent(){
  if(!supabase || !currentUser || ADMIN_ONLY) return;
  try{
    await supabase.from("app_share_events").insert({
      device_id:presenceDeviceId
    });
  }catch(error){
    console.warn("Share event",error);
  }
}

async function loadAdminStats(){
  if(!isAdmin()) return;
  try{
    const res=await fetch(
      "https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/diamond-admin-stats?t="+Date.now(),
      {cache:"no-store"}
    );
    const data=await res.json();
    if(!res.ok || data?.error) throw new Error(data?.error||("HTTP "+res.status));
    if(installCount) installCount.textContent=String(data.installs||0);
    if(shareDeviceCount) shareDeviceCount.textContent=String(data.uniqueSharers||0);
    if(dailyActiveCount) dailyActiveCount.textContent=String(data.activeToday||0);
  }catch(error){
    console.warn("Admin stats",error);
    if(adminStatsStatus) showMessage(adminStatsStatus,"Statistikat nuk u ngarkuan.","error");
  }
}

async function loadInstallCount(){
  return loadAdminStats();
}

function refreshNewDeviceNotifyButton(){
  if(!newDeviceNotifyBtn) return;
  let enabled=false;
  try{enabled=!!window.AndroidAdmin?.isNewDeviceAlertsEnabled?.();}catch(_){}
  newDeviceNotifyBtn.textContent=enabled?"🔔 ON":"🔕 OFF";
  newDeviceNotifyBtn.classList.toggle("active",enabled);
}

newDeviceNotifyBtn?.addEventListener("click",()=>{
  try{
    if(window.AndroidAdmin?.isNativeAdmin?.()){
      const next=!window.AndroidAdmin.isNewDeviceAlertsEnabled();
      window.AndroidAdmin.setNewDeviceAlertsEnabled(next);
      if(next) window.AndroidAdmin.requestNotificationPermission();
      refreshNewDeviceNotifyButton();
      if(adminStatsStatus) showMessage(adminStatsStatus,next?"Njoftimet u aktivizuan.":"Njoftimet u çaktivizuan.","success");
      return;
    }
  }catch(error){console.warn(error);}
  if(adminStatsStatus) showMessage(adminStatsStatus,"Ky njoftim funksionon në DIAMOND ADMIN Android.","error");
});

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
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) throw new Error("Family session missing");
      currentUser = sessionData.session.user;
      loginView.classList.add("hidden");
      appView.classList.remove("hidden");
      setSection("home");
      await applySession(sessionData.session);
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
    showMessage(loginMessage, "Nuk mund të hyhet si përdorues. Provo përsëri.", "error");
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
  currentUser = null;
  setSection("home");
  appView?.classList.add("hidden");
  loginView?.classList.remove("hidden");
  setMode("family");
  if (onlineCount) onlineCount.textContent = "0";
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

async function translateInfoForCurrentLanguage(item) {
  if (!item?.message || !["de","tr"].includes(currentLanguage)) {
    return item?.message || "";
  }

  const stored = currentLanguage === "de" ? item.message_de : item.message_tr;
  if (stored) return stored;

  const cacheKey = "pajaziti-info-translation-" + item.id + "-" + currentLanguage;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "sq");
    url.searchParams.set("tl", currentLanguage);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", item.message);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    const translated = Array.isArray(data?.[0])
      ? data[0].map((part) => String(part?.[0] || "")).join("").trim()
      : "";

    if (translated) {
      localStorage.setItem(cacheKey, translated);
      return translated;
    }
  } catch (error) {
    console.warn("Info translation failed", error);
  }

  return item.message;
}

async function loadInfo({ markRead = activeSection === "info" } = {}) {
  if (!supabase || !currentUser) return;

  const { data, error } = await supabase
    .from("information")
    .select("id,author,message,message_de,message_tr,created_at,user_id")
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
    if (currentLanguage === "de" || currentLanguage === "tr") {
      translateInfoForCurrentLanguage(item).then((translated) => {
        if (text.isConnected) text.textContent = translated || item.message || "";
      });
    }
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

  const { data: publishData, error } = await supabase.functions.invoke("publish-info", {
    body: { message }
  });

  infoSendBtn.disabled = false;

  if (error || publishData?.error) {
    console.error(error || publishData?.error);
    showMessage(
      infoStatus,
      t("error.publishFailed", { error: error?.message || publishData?.error || "unknown" }),
      "error"
    );
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

function timeWithOffset(value, offsetMinutes = 0) {
  const mins = timeToMinutes(value);
  if (mins === null) return "--:--";
  const total = (mins + offsetMinutes + 1440) % 1440;
  return String(Math.floor(total / 60)).padStart(2, "0") + ":" +
    String(total % 60).padStart(2, "0");
}

function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return String(h).padStart(2, "0") + ":" +
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0");
}

function dateAtPrayerTime(value, dayOffset = 0) {
  const mins = timeToMinutes(value);
  if (mins === null) return null;
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  return d;
}

function renderKerahatTimes() {
  if (!prayerTimings) return;

  // Practical display windows. They are intentionally marked as approximate
  // because exact fiqh details can differ by madhhab/local authority.
  const rows = [
    { el: kerahatSunrise, start: prayerTimings.Sunrise, end: timeWithOffset(prayerTimings.Sunrise, 45), minutes: 45 },
    { el: kerahatNoon, start: timeWithOffset(prayerTimings.Dhuhr, -10), end: prayerTimings.Dhuhr, minutes: 10 },
    { el: kerahatSunset, start: timeWithOffset(prayerTimings.Maghrib || prayerTimings.Sunset, -45), end: prayerTimings.Maghrib || prayerTimings.Sunset, minutes: 45 }
  ];

  for (const row of rows) {
    if (!row.el) continue;
    if (!row.start || row.start === "--:--" || !row.end || row.end === "--:--") {
      row.el.textContent = "--:--";
      continue;
    }
    row.el.textContent = row.start + " – " + row.end + " · " + row.minutes + " min";
  }
}

function calculateQiblaBearing(latitude, longitude) {
  const kaabaLat = 21.4225 * Math.PI / 180;
  const kaabaLon = 39.8262 * Math.PI / 180;
  const lat = Number(latitude) * Math.PI / 180;
  const lon = Number(longitude) * Math.PI / 180;
  const y = Math.sin(kaabaLon - lon);
  const x = Math.cos(lat) * Math.tan(kaabaLat) -
    Math.sin(lat) * Math.cos(kaabaLon - lon);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function normalizeAngleDelta(value) {
  let delta = ((value + 540) % 360) - 180;
  return delta;
}

let qiblaWasAligned = false;
let qiblaLastBeepAt = 0;

function qiblaBeep() {
  const now = Date.now();
  if (now - qiblaLastBeepAt < 1800) return;
  qiblaLastBeepAt = now;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const tone = (when) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 920;
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.22, when + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.13);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(when); osc.stop(when + 0.15);
    };
    tone(ctx.currentTime);
    tone(ctx.currentTime + 0.22);
    setTimeout(() => ctx.close().catch(()=>{}), 650);
  } catch (_) {}
}

function renderQiblaArrow() {
  if (!Number.isFinite(qiblaBearing) || !qiblaArrow) return;
  const rotation = Number.isFinite(qiblaHeading)
    ? normalizeAngleDelta(qiblaBearing - qiblaHeading)
    : qiblaBearing;

  const compass = qiblaArrow.closest(".qibla-compass");
  // The marker stays fixed; the compass dial itself turns with the phone.
  qiblaArrow.style.transform = "translate(-50%, -50%) rotate(-90deg)";
  if (compass) compass.style.setProperty("--qibla-dial-rotation", (-rotation).toFixed(1) + "deg");

  const aligned = Number.isFinite(qiblaHeading) && Math.abs(rotation) <= 5;
  qiblaArrow.classList.toggle("qibla-correct", aligned);
  qiblaArrow.classList.toggle("qibla-wrong", !aligned);
  compass?.classList.toggle("qibla-aligned", aligned);

  if (aligned && !qiblaWasAligned) qiblaBeep();
  qiblaWasAligned = aligned;

  if (qiblaDirection) {
    const base = t("prayer.qiblaFromNorth", { degrees: Math.round(qiblaBearing) });
    const difference = Number.isFinite(qiblaHeading) ? Math.round(Math.abs(rotation)) : null;
    qiblaDirection.textContent = difference === null
      ? base
      : base + " · " + difference + "°";
  }
}

function updateQibla(coords) {
  if (!coords) {
    if (qiblaDirection) qiblaDirection.textContent = "--°";
    if (qiblaStatus) qiblaStatus.textContent = t("prayer.qiblaNeedLocation");
    return;
  }
  qiblaBearing = calculateQiblaBearing(coords.latitude, coords.longitude);
  try { window.AndroidCompass?.setLocation?.(coords.latitude, coords.longitude); } catch (_) {}
  renderQiblaArrow();
  if (qiblaStatus) {
    qiblaStatus.textContent = Number.isFinite(qiblaHeading)
      ? t("prayer.qiblaReady")
      : t("prayer.qiblaNoSensor");
  }
}

function onDeviceOrientation(event) {
  let heading = null;
  if (Number.isFinite(event.webkitCompassHeading)) {
    heading = event.webkitCompassHeading;
  } else if (event.absolute && Number.isFinite(event.alpha)) {
    heading = (360 - event.alpha) % 360;
  } else if (Number.isFinite(event.alpha)) {
    heading = (360 - event.alpha) % 360;
  }
  if (!Number.isFinite(heading)) return;
  qiblaHeading = heading;
  renderQiblaArrow();
  if (qiblaStatus) qiblaStatus.textContent = t("prayer.qiblaReady");
}

let qiblaNativeTimer = null;

async function enableQiblaCompass() {
  try {
    const coords = savedPrayerCoords();
    if (window.AndroidCompass?.isAvailable?.()) {
      if (coords) window.AndroidCompass.setLocation(coords.latitude, coords.longitude);
      window.AndroidCompass.start();
      if (qiblaNativeTimer) clearInterval(qiblaNativeTimer);
      qiblaNativeTimer = setInterval(() => {
        try {
          const heading = Number(window.AndroidCompass.getHeading());
          if (Number.isFinite(heading) && heading >= 0) {
            qiblaHeading = heading;
            renderQiblaArrow();
            if (qiblaStatus) qiblaStatus.textContent = t("prayer.qiblaReady");
          }
        } catch (_) {}
      }, 120);
      qiblaCompassListening = true;
      updateQibla(coords);
      return;
    }

    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") throw new Error("permission");
    }
    if (!qiblaCompassListening) {
      window.addEventListener("deviceorientationabsolute", onDeviceOrientation, true);
      window.addEventListener("deviceorientation", onDeviceOrientation, true);
      qiblaCompassListening = true;
    }
    updateQibla(coords);
  } catch (error) {
    console.warn("Qibla compass", error);
    if (qiblaStatus) qiblaStatus.textContent = t("prayer.qiblaNoSensor");
  }
}

qiblaCompassBtn?.addEventListener("click", enableQiblaCompass);

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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10 * 60 * 1000 }
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
  // Keep solar times too, because the kerahat windows depend on them.
  prayerTimings.Sunrise = cleanPrayerTime(json.data.timings.Sunrise);
  prayerTimings.Sunset = cleanPrayerTime(json.data.timings.Sunset);
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
    updateQibla(null);
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
  renderKerahatTimes();

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
  let nextPrayer = null;
  let nextTime = null;
  let nextDate = null;

  for (const prayer of PRAYERS) {
    const candidate = dateAtPrayerTime(prayerTimings[prayer.key], 0);
    if (candidate && candidate.getTime() >= now.getTime()) {
      nextPrayer = prayer;
      nextTime = prayerTimings[prayer.key];
      nextDate = candidate;
      break;
    }
  }

  if (!nextPrayer) {
    nextPrayer = PRAYERS[0];
    nextTime = prayerTomorrowFajr && prayerTomorrowFajr !== "--:--"
      ? prayerTomorrowFajr
      : prayerTimings.Fajr;
    nextDate = dateAtPrayerTime(nextTime, 1);
  }

  const remaining = nextDate
    ? formatCountdown(nextDate.getTime() - now.getTime())
    : "--:--:--";

  const firstLine = nextDate && nextDate.getDate() !== now.getDate()
    ? t("prayer.nextTomorrow") + (nextTime ? " " + nextTime : "")
    : t("prayer.next", {
        name: prayerLabel(nextPrayer.key),
        time: nextTime || "--:--"
      });

  prayerNext.innerHTML =
    '<div class="prayer-next-main">' + firstLine + '</div>' +
    '<div class="prayer-countdown">' +
      t("prayer.remaining", { time: remaining }) +
    '</div>';
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
  if (prayerCountdownTimer) clearInterval(prayerCountdownTimer);
  prayerCheckTimer = setInterval(checkPrayerAlarms, 20000);
  prayerCountdownTimer = setInterval(updateNextPrayer, 1000);
  checkPrayerAlarms();
  updateNextPrayer();
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
  if (!currentUser || !isAdmin()) {
    adminPanel?.classList.add("hidden");
    return;
  }

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
  if (!supabase || !currentUser || !isAdmin()) return;

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

      if (isAdmin()) {
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
  if (!supabase || !currentUser || !isAdmin()) return;

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


function chatSavedName() {
  return (localStorage.getItem(CHAT_NAME_KEY) || "").trim();
}

function lockChatNameUi(name) {
  const fixed = (name || "").trim();
  if (fixed) localStorage.setItem(CHAT_NAME_KEY, fixed);
  if (chatName) {
    chatName.value = fixed;
    chatName.readOnly = true;
    chatName.disabled = true;
    chatName.classList.add("chat-name-locked");
  }
  if (chatSaveNameBtn) {
    chatSaveNameBtn.disabled = true;
    chatSaveNameBtn.textContent = "🔒 Emri i fiksuar";
  }
}

function unlockChatNameUi() {
  if (chatName) {
    chatName.readOnly = false;
    chatName.disabled = false;
    chatName.classList.remove("chat-name-locked");
  }
  if (chatSaveNameBtn) {
    chatSaveNameBtn.disabled = false;
    chatSaveNameBtn.textContent = "Ruaj emrin";
  }
}

function chatNameErrorMessage(error) {
  const raw = String(error?.message || error || "");
  if (raw.includes("NAME_TAKEN")) {
    return "Ky emër ekziston tashmë. Zgjidh një emër tjetër.";
  }
  if (raw.includes("NAME_LOCKED")) {
    return "Emri është fiksuar dhe nuk mund të ndryshohet.";
  }
  if (raw.includes("INVALID_NAME")) {
    return "Emri duhet të ketë 1–32 shkronja.";
  }
  return "Emri nuk u ruajt. Provo përsëri.";
}

async function loadChatProfile() {
  if (!supabase || !currentUser) return null;

  const { data, error } = await supabase.rpc("chat_get_profile", {
    p_device: presenceDeviceId
  });

  if (error) {
    console.error("Chat profile load failed", error);
    return null;
  }

  if (data?.registered && data?.display_name) {
    lockChatNameUi(data.display_name);
    return data.display_name;
  }

  unlockChatNameUi();
  if (chatName && !chatName.value) chatName.value = chatSavedName();
  return null;
}

async function saveChatName() {
  if (!supabase || !currentUser) return false;

  const existing = chatSavedName();
  if (chatName?.disabled && existing) {
    showMessage(chatStatus, "Ky emër është fiksuar përgjithmonë.", "success");
    return true;
  }

  const name = (chatName?.value || "").trim().replace(/\s+/g, " ").slice(0, 32);
  if (!name) {
    showMessage(chatStatus, "Shkruaj emrin tënd.", "error");
    return false;
  }

  if (chatSaveNameBtn) chatSaveNameBtn.disabled = true;
  showMessage(chatStatus, "Po kontrollohet emri...");

  const { data, error } = await supabase.rpc("chat_claim_name", {
    p_device: presenceDeviceId,
    p_name: name
  });

  if (error) {
    console.error("Chat name claim failed", error);
    unlockChatNameUi();
    showMessage(chatStatus, chatNameErrorMessage(error), "error");
    return false;
  }

  const fixedName = (data?.display_name || name).trim();
  lockChatNameUi(fixedName);
  showMessage(chatStatus, "Emri u ruajt përgjithmonë. Nuk mund të ndryshohet më.", "success");
  return true;
}

chatSaveNameBtn?.addEventListener("click", () => {
  saveChatName();
});

function formatChatTime(value) {
  try {
    return new Date(value).toLocaleString("sq-AL", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
    });
  } catch (_) {
    return "";
  }
}

function renderChatStatus(status) {
  chatCurrentStatus = status || { free:true, unlimited:true };
  if (chatPlanBadge) chatPlanBadge.textContent = "FALAS";
  if (chatLimitText) chatLimitText.textContent = "Mesazhe pa kufi për të gjithë.";
  if (chatSendBtn) chatSendBtn.disabled = false;
}

async function loadChatStatus() {
  if (!supabase || !currentUser) return;
  const { data, error } = await supabase.rpc("chat_status", { p_device: presenceDeviceId });
  if (error) {
    console.error("Chat status failed", error);
    showMessage(chatStatus, "Nuk u kontrollua limiti i chat-it.", "error");
    return;
  }
  renderChatStatus(data || {});
}

async function loadChatMessages() {
  if (!supabase || !currentUser) return;
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id,device_id,display_name,message,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Chat load failed", error);
    showMessage(chatStatus, "Chat-i nuk u ngarkua.", "error");
    return;
  }

  chatList.innerHTML = "";
  for (const item of (data || []).reverse()) {
    const row = document.createElement("article");
    row.className = "chat-message" + (item.device_id === presenceDeviceId ? " mine" : "");

    const head = document.createElement("div");
    head.className = "chat-message-head";

    const name = document.createElement("strong");
    name.textContent = item.display_name || "User";
    const time = document.createElement("span");
    time.className = "muted small";
    time.textContent = formatChatTime(item.created_at);
    head.append(name, time);

    const body = document.createElement("div");
    body.className = "chat-message-body";
    body.textContent = item.message || "";

    row.append(head, body);

    if (isAdmin()) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "chat-delete-btn";
      del.textContent = "Fshi";
      del.addEventListener("click", async () => {
        if (!confirm("Ta fshij këtë mesazh?")) return;
        const { error: delError } = await supabase.rpc("chat_delete_message", { p_id: item.id });
        if (delError) {
          alert("Nuk u fshi: " + delError.message);
          return;
        }
        await loadChatMessages();
      });
      row.appendChild(del);
    }

    chatList.appendChild(row);
  }

  chatList.scrollTop = chatList.scrollHeight;
}

async function loadChat() {
  if (!supabase || !currentUser) return;
  await loadChatProfile();
  await Promise.all([loadChatMessages(), loadChatStatus()]);
}

chatRefreshBtn?.addEventListener("click", loadChat);

chatSendBtn?.addEventListener("click", async () => {
  if (!supabase || !currentUser) return;

  let name = chatSavedName();
  if (!name || !chatName?.disabled) {
    const saved = await saveChatName();
    if (!saved) return;
    name = chatSavedName();
  }

  const message = (chatText?.value || "").trim();
  if (!message) return showMessage(chatStatus, "Shkruaj mesazhin.", "error");

  chatSendBtn.disabled = true;
  showMessage(chatStatus, "Po dërgohet...");

  const { data, error } = await supabase.rpc("chat_send_message", {
    p_device: presenceDeviceId,
    p_name: name.slice(0, 32),
    p_message: message.slice(0, 500)
  });

  if (error) {
    console.error(error);
    showMessage(chatStatus, "Mesazhi nuk u dërgua.", "error");
  } else {
    chatText.value = "";
    showMessage(chatStatus, "U dërgua.", "success");
    if (data) {
      renderChatStatus({
        paid: data.paid,
        paid_until: chatCurrentStatus?.paid_until || null,
        remaining_today: data.remaining_today
      });
    }
    await loadChatMessages();
    await loadChatStatus();
  }

  chatSendBtn.disabled = false;
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
      () => {
        loadSharedMenuOrder();
        loadHiddenTabs();
        window.PajazitiGames?.reloadSettings?.();
      }
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
  installStatsCard?.classList.toggle("hidden", !signedIn || !isAdmin());
  installStatsCard?.classList.toggle("hidden", !signedIn || !isAdmin());
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

  adminPanel.classList.toggle("hidden", !isAdmin());
  if (storageCard) storageCard.classList.toggle("hidden", !isAdmin());
  roleLabel.textContent = isAdmin() ? t("role.admin") : t("role.family");
  uploadStatus.textContent = "";
  setSection("home");
  await loadMedia();
  await loadSharedMenuOrder();
  await loadHiddenTabs();
  const savedCoords = savedPrayerCoords();
  if (savedCoords) {
    fetchPrayerTimes(savedCoords).catch((error) => console.warn("Prayer preload failed", error));
  }
  if (chatName) chatName.value = chatSavedName();
  loadChatProfile().catch(console.warn);
  startPrayerAlarmChecker();
  await registerInstall();
  await registerDailyActivity();
  if(isAdmin()) { await loadAdminStats(); refreshNewDeviceNotifyButton(); }
  startRealtime();
}

loadDiamondWeather().catch(()=>{});

if (supabase) {
  const { data } = await supabase.auth.getSession();
  let session = data.session;

  const wrongSession =
    (ADMIN_ONLY && session?.user?.email !== ADMIN_EMAIL);

  if (session && wrongSession) {
    await supabase.auth.signOut();
    session = null;
  }

  await applySession(session);

  if (!session) {
    setMode(ADMIN_ONLY ? "admin" : "family");
  }

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    setTimeout(() => applySession(nextSession), 0);
  });
} else {
  showMessage(
    loginMessage,
    t("error.setupSupabase"),
    ""
  );
}

const isIosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandaloneApp = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

if (isIosDevice && !isStandaloneApp) {
  installBtn?.classList.remove("hidden");
  installLoginBtn?.classList.remove("hidden");
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  installBtn.classList.remove("hidden");
  installLoginBtn.classList.remove("hidden");
});

async function triggerInstall() {
  if (!installPrompt) {
    if (isIosDevice) {
      alert("Në iPhone: hape DIAMOND në Safari, shtyp Share (katrori me shigjetë lart), pastaj zgjidh “Add to Home Screen” / “Shto në ekranin kryesor” dhe konfirmo Add.");
      return;
    }
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
  await registerShareEvent();
  const url = isIosDevice ? "https://familja.vercel.app/" : "https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-apk";
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Diamond",
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


window.DiamondNavigationBack = function(){
  try {
    if (window.DiamondPrayerExtras?.back?.()) return true;
    if (window.DiamondQuran?.back?.()) return true;
    const quranPanel=document.getElementById("quranPanel");
    if(quranPanel && !quranPanel.classList.contains("hidden")){
      window.DiamondQuran?.close?.();
      return true;
    }
    if(window.DiamondPrayerGuide?.back?.()) return true;
    if(activeSection && activeSection!=="home"){
      setSection("home");
      return true;
    }
    if(appView && !appView.classList.contains("hidden")){
      return true;
    }
  } catch(_) {}
  return false;
};


/* DIAMOND Namaz pages: overview keeps prayer times visible; tools open separately */
(() => {
  const view=document.getElementById("prayerView");
  const grid=view?.querySelector(".prayer-tools-grid");
  if(!view||!grid)return;
  const cards=Array.from(grid.children);
  const qibla=document.getElementById("qiblaToolCard");
  const kerahat=document.getElementById("kerahatToolCard");
  const panels=["quranPanel","prayerHelpPanel","ruqyaPanel","prayerDuaPanel","quranLearnPanel","tasbihPanel"].map(id=>document.getElementById(id)).filter(Boolean);
  const prayerTop=view.querySelector(":scope > .prayer-card");
  const list=document.getElementById("prayerList");
  const note=view.querySelector(":scope > .prayer-note");
  const back=document.getElementById("prayerMiniBack");
  const showOverview=()=>{
    prayerTop?.classList.remove("hidden");
    list?.classList.remove("hidden");
    note?.classList.remove("hidden");
    grid.classList.remove("hidden");
    cards.forEach(x=>x.classList.remove("hidden"));
    panels.forEach(x=>x.classList.add("hidden"));
    back?.classList.add("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const openTool=(tool)=>{
    prayerTop?.classList.add("hidden"); list?.classList.add("hidden"); note?.classList.add("hidden");
    grid.classList.remove("hidden"); cards.forEach(x=>x.classList.toggle("hidden",x!==tool));
    panels.forEach(x=>x.classList.add("hidden")); back?.classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  };
  [qibla,kerahat].forEach(tool=>tool?.addEventListener("click",e=>{if(!e.target.closest("button"))openTool(tool);}));
  back?.addEventListener("click",showOverview);
  document.getElementById("prayerTab")?.addEventListener("click",()=>setTimeout(showOverview,0));
  showOverview();
})();
