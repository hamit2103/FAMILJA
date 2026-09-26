const SESSION_KEY="diamond-nearby-session-v1";
const MEDIA_GRANTS_KEY="diamond-nearby-media-grants-v1";
const T={
  sq:{title:"Gjej telefonin",note:"Privat · vetëm për userat që i lejon Admini.",create:"Krijo kod",join:"Hyr me kod",duration:"Koha e kodit",h1:"1 orë",h2:"4 orë",h3:"Pa afat",codePh:"Shkruaj kodin 8-shifror",yourCode:"Kodi yt",copy:"Kopjo",waiting:"Duke pritur telefonin tjetër…",connected:"Lidhur me",left:"Koha e mbetur",location:"Vendndodhja",locOn:"Lokacioni po ndahet vetëm gjatë këtij sesioni.",locOff:"Lejo lokacionin që telefoni tjetër të mund të të gjejë.",partnerLoc:"Lokacioni i telefonit tjetër",noLoc:"Ende nuk ka lokacion.",navigate:"🧭 Navigo te telefoni",distance:"Distanca",camera:"📷 Kërko kamerën + zërin",stopMedia:"⛔ Ndalo kamerën/zërin",end:"Mbyll sesionin",request:"Telefoni tjetër kërkon kamerën dhe mikrofonin tënd.",allow:"Lejo",decline:"Refuzo",live:"🔴 LIVE — kamera/mikrofoni po ndahen",requestSent:"Kërkesa u dërgua. Telefoni tjetër duhet ta lejojë.",declined:"Kërkesa u refuzua.",expired:"Sesioni ka përfunduar.",copied:"Kodi u kopjua.",needPermission:"Duhet ta lejosh vendndodhjen.",mediaDenied:"Kamera/mikrofoni nuk u lejuan.",notSupported:"Ky telefon/browser nuk e mbështet këtë funksion.",loading:"Po lidhet…",onlyAllowed:"Ky modul duhet të aktivizohet nga Admini për këtë user.",sharePreview:"Pamja që po ndan",remote:"Pamja e telefonit tjetër",custom:"Kodi që zgjedh ti",customPh:"4–12 shkronja ose numra",shareAdmin:"Ndaj lokacionin me Adminin",shareAdminOn:"Lokacioni po ndahet me Adminin.",shareAdminOff:"Lokacioni nuk po ndahet me Adminin.",cameraOnly:"📷 Kërko vetëm kamerën",audioOnly:"🎙️ Kërko vetëm zërin",both:"📷🎙️ Kërko kamerën + zërin",callAudio:"📞 Thirrje me zë",callVideo:"🎥 Video-thirrje",switchCamera:"🔄 Ndërro kamerën",allowNow:"Lejo vetëm tani",allowAlways:"Lejo pa më pyetur për këtë user",permissions:"Lejet e ruajtura",revoke:"Hiq lejet e ruajtura",incomingCall:"Po të thërret",ringing:"Po thërret…",front:"Përpara",back:"Mbrapa"},
  de:{title:"Telefon finden",note:"Privat · nur für vom Admin freigeschaltete Nutzer.",create:"Code erstellen",join:"Mit Code verbinden",duration:"Code-Dauer",h1:"1 Stunde",h2:"4 Stunden",h3:"Ohne Ablauf",codePh:"8-stelligen Code eingeben",yourCode:"Dein Code",copy:"Kopieren",waiting:"Warte auf das andere Telefon…",connected:"Verbunden mit",left:"Verbleibende Zeit",location:"Standort",locOn:"Der Standort wird nur während dieser Sitzung geteilt.",locOff:"Standort erlauben, damit das andere Telefon dich finden kann.",partnerLoc:"Standort des anderen Telefons",noLoc:"Noch kein Standort.",navigate:"🧭 Zum Telefon navigieren",distance:"Entfernung",camera:"📷 Kamera + Ton anfragen",stopMedia:"⛔ Kamera/Ton stoppen",end:"Sitzung beenden",request:"Das andere Telefon möchte auf deine Kamera und dein Mikrofon zugreifen.",allow:"Erlauben",decline:"Ablehnen",live:"🔴 LIVE — Kamera/Mikrofon werden geteilt",requestSent:"Anfrage gesendet. Das andere Telefon muss zustimmen.",declined:"Anfrage abgelehnt.",expired:"Sitzung beendet.",copied:"Code kopiert.",needPermission:"Standortberechtigung erforderlich.",mediaDenied:"Kamera/Mikrofon wurden nicht erlaubt.",notSupported:"Dieses Telefon/Browser unterstützt die Funktion nicht.",loading:"Verbindung wird hergestellt…",onlyAllowed:"Dieses Modul muss vom Admin für diesen Nutzer aktiviert werden.",sharePreview:"Geteilte Ansicht",remote:"Ansicht des anderen Telefons",custom:"Eigener Code",customPh:"4–12 Buchstaben oder Zahlen",shareAdmin:"Standort mit Admin teilen",shareAdminOn:"Standort wird mit Admin geteilt.",shareAdminOff:"Standort wird nicht mit Admin geteilt.",cameraOnly:"📷 Nur Kamera anfragen",audioOnly:"🎙️ Nur Ton anfragen",both:"📷🎙️ Kamera + Ton anfragen",callAudio:"📞 Sprachanruf",callVideo:"🎥 Videoanruf",switchCamera:"🔄 Kamera wechseln",allowNow:"Nur jetzt erlauben",allowAlways:"Für diesen Nutzer nicht mehr fragen",permissions:"Gespeicherte Berechtigungen",revoke:"Gespeicherte Berechtigungen löschen",incomingCall:"Eingehender Anruf",ringing:"Anruf läuft…",front:"Vorne",back:"Hinten"},
  tr:{title:"Telefonu bul",note:"Özel · yalnızca yönetici izin verdiği kullanıcılar.",create:"Kod oluştur",join:"Kodla bağlan",duration:"Kod süresi",h1:"1 saat",h2:"4 saat",h3:"Süresiz",codePh:"8 haneli kodu yaz",yourCode:"Kodun",copy:"Kopyala",waiting:"Diğer telefon bekleniyor…",connected:"Bağlı",left:"Kalan süre",location:"Konum",locOn:"Konum yalnızca bu oturum sırasında paylaşılıyor.",locOff:"Diğer telefonun seni bulabilmesi için konuma izin ver.",partnerLoc:"Diğer telefonun konumu",noLoc:"Henüz konum yok.",navigate:"🧭 Telefona git",distance:"Mesafe",camera:"📷 Kamera + ses iste",stopMedia:"⛔ Kamera/sesi durdur",end:"Oturumu kapat",request:"Diğer telefon kamera ve mikrofonunu açmanı istiyor.",allow:"İzin ver",decline:"Reddet",live:"🔴 CANLI — kamera/mikrofon paylaşılıyor",requestSent:"İstek gönderildi. Diğer telefon izin vermeli.",declined:"İstek reddedildi.",expired:"Oturum sona erdi.",copied:"Kod kopyalandı.",needPermission:"Konuma izin vermelisin.",mediaDenied:"Kamera/mikrofona izin verilmedi.",notSupported:"Bu telefon/tarayıcı bu özelliği desteklemiyor.",loading:"Bağlanıyor…",onlyAllowed:"Bu modülü yönetici bu kullanıcı için açmalıdır.",sharePreview:"Paylaştığın görüntü",remote:"Diğer telefonun görüntüsü",custom:"Kendi kodun",customPh:"4–12 harf veya rakam",shareAdmin:"Konumu Admin ile paylaş",shareAdminOn:"Konum Admin ile paylaşılıyor.",shareAdminOff:"Konum Admin ile paylaşılmıyor.",cameraOnly:"📷 Sadece kamera iste",audioOnly:"🎙️ Sadece ses iste",both:"📷🎙️ Kamera + ses iste",callAudio:"📞 Sesli arama",callVideo:"🎥 Görüntülü arama",switchCamera:"🔄 Kamerayı değiştir",allowNow:"Sadece şimdi izin ver",allowAlways:"Bu kullanıcı için tekrar sorma",permissions:"Kayıtlı izinler",revoke:"Kayıtlı izinleri kaldır",incomingCall:"Gelen arama",ringing:"Aranıyor…",front:"Ön",back:"Arka"},
  en:{title:"Find phone",note:"Private · only for users enabled by Admin.",create:"Create code",join:"Join with code",duration:"Code duration",h1:"1 hour",h2:"4 hours",h3:"No expiry",codePh:"Enter 8-character code",yourCode:"Your code",copy:"Copy",waiting:"Waiting for the other phone…",connected:"Connected with",left:"Time left",location:"Location",locOn:"Location is shared only during this session.",locOff:"Allow location so the other phone can find you.",partnerLoc:"Other phone location",noLoc:"No location yet.",navigate:"🧭 Navigate to phone",distance:"Distance",camera:"📷 Request camera + audio",stopMedia:"⛔ Stop camera/audio",end:"End session",request:"The other phone is requesting access to your camera and microphone.",allow:"Allow",decline:"Decline",live:"🔴 LIVE — camera/microphone are being shared",requestSent:"Request sent. The other phone must allow it.",declined:"Request declined.",expired:"Session ended.",copied:"Code copied.",needPermission:"Location permission is required.",mediaDenied:"Camera/microphone permission was not granted.",notSupported:"This phone/browser does not support the feature.",loading:"Connecting…",onlyAllowed:"Admin must enable this module for this user.",sharePreview:"Your shared view",remote:"Other phone view",custom:"Your own code",customPh:"4–12 letters or numbers",shareAdmin:"Share location with Admin",shareAdminOn:"Location is being shared with Admin.",shareAdminOff:"Location is not being shared with Admin.",cameraOnly:"📷 Request camera only",audioOnly:"🎙️ Request audio only",both:"📷🎙️ Request camera + audio",callAudio:"📞 Audio call",callVideo:"🎥 Video call",switchCamera:"🔄 Switch camera",allowNow:"Allow only now",allowAlways:"Always allow for this user",permissions:"Saved permissions",revoke:"Revoke saved permissions",incomingCall:"Incoming call",ringing:"Calling…",front:"Front",back:"Back"},
  it:{title:"Trova telefono",note:"Privato · solo per utenti autorizzati dall'Admin.",create:"Crea codice",join:"Entra con codice",duration:"Durata del codice",h1:"1 ora",h2:"4 ore",h3:"Senza scadenza",codePh:"Inserisci il codice di 8 caratteri",yourCode:"Il tuo codice",copy:"Copia",waiting:"In attesa dell'altro telefono…",connected:"Connesso con",left:"Tempo rimasto",location:"Posizione",locOn:"La posizione è condivisa solo durante questa sessione.",locOff:"Consenti la posizione per permettere all'altro telefono di trovarti.",partnerLoc:"Posizione dell'altro telefono",noLoc:"Nessuna posizione ancora.",navigate:"🧭 Naviga al telefono",distance:"Distanza",camera:"📷 Richiedi camera + audio",stopMedia:"⛔ Ferma camera/audio",end:"Chiudi sessione",request:"L'altro telefono richiede accesso a fotocamera e microfono.",allow:"Consenti",decline:"Rifiuta",live:"🔴 LIVE — fotocamera/microfono condivisi",requestSent:"Richiesta inviata. L'altro telefono deve consentire.",declined:"Richiesta rifiutata.",expired:"Sessione terminata.",copied:"Codice copiato.",needPermission:"È necessario consentire la posizione.",mediaDenied:"Fotocamera/microfono non autorizzati.",notSupported:"Questo telefono/browser non supporta la funzione.",loading:"Connessione…",onlyAllowed:"L'Admin deve attivare questo modulo per l'utente.",sharePreview:"Vista condivisa",remote:"Vista dell'altro telefono"},
  hr:{title:"Pronađi telefon",note:"Privatno · samo za korisnike kojima Admin dopusti.",create:"Izradi kod",join:"Uđi kodom",duration:"Trajanje koda",h1:"1 sat",h2:"4 sata",h3:"Bez isteka",codePh:"Unesi kod od 8 znakova",yourCode:"Tvoj kod",copy:"Kopiraj",waiting:"Čeka se drugi telefon…",connected:"Povezano s",left:"Preostalo vrijeme",location:"Lokacija",locOn:"Lokacija se dijeli samo tijekom ove sesije.",locOff:"Dopusti lokaciju kako bi te drugi telefon mogao pronaći.",partnerLoc:"Lokacija drugog telefona",noLoc:"Lokacija još nije dostupna.",navigate:"🧭 Navigiraj do telefona",distance:"Udaljenost",camera:"📷 Zatraži kameru + zvuk",stopMedia:"⛔ Zaustavi kameru/zvuk",end:"Završi sesiju",request:"Drugi telefon traži pristup tvojoj kameri i mikrofonu.",allow:"Dopusti",decline:"Odbij",live:"🔴 UŽIVO — kamera/mikrofon se dijele",requestSent:"Zahtjev poslan. Drugi telefon mora dopustiti.",declined:"Zahtjev odbijen.",expired:"Sesija završena.",copied:"Kod kopiran.",needPermission:"Potrebna je dozvola za lokaciju.",mediaDenied:"Kamera/mikrofon nisu dopušteni.",notSupported:"Ovaj telefon/preglednik ne podržava funkciju.",loading:"Povezivanje…",onlyAllowed:"Admin mora omogućiti ovaj modul za korisnika.",sharePreview:"Tvoj prijenos",remote:"Prijenos drugog telefona"},
  fr:{title:"Trouver le téléphone",note:"Privé · seulement pour les utilisateurs autorisés par l'Admin.",create:"Créer un code",join:"Entrer avec un code",duration:"Durée du code",h1:"1 heure",h2:"4 heures",h3:"Sans expiration",codePh:"Saisir le code de 8 caractères",yourCode:"Votre code",copy:"Copier",waiting:"En attente de l'autre téléphone…",connected:"Connecté avec",left:"Temps restant",location:"Position",locOn:"La position est partagée uniquement pendant cette session.",locOff:"Autorisez la position afin que l'autre téléphone puisse vous trouver.",partnerLoc:"Position de l'autre téléphone",noLoc:"Pas encore de position.",navigate:"🧭 Naviguer vers le téléphone",distance:"Distance",camera:"📷 Demander caméra + audio",stopMedia:"⛔ Arrêter caméra/audio",end:"Terminer la session",request:"L'autre téléphone demande l'accès à votre caméra et microphone.",allow:"Autoriser",decline:"Refuser",live:"🔴 LIVE — caméra/microphone partagés",requestSent:"Demande envoyée. L'autre téléphone doit autoriser.",declined:"Demande refusée.",expired:"Session terminée.",copied:"Code copié.",needPermission:"L'autorisation de localisation est requise.",mediaDenied:"Caméra/microphone non autorisés.",notSupported:"Ce téléphone/navigateur ne prend pas en charge cette fonction.",loading:"Connexion…",onlyAllowed:"L'Admin doit activer ce module pour cet utilisateur.",sharePreview:"Votre vue partagée",remote:"Vue de l'autre téléphone"},
  ar:{title:"العثور على الهاتف",note:"خاص · فقط للمستخدمين الذين يسمح لهم المشرف.",create:"إنشاء رمز",join:"الدخول بالرمز",duration:"مدة الرمز",h1:"ساعة",h2:"4 ساعات",h3:"بدون انتهاء",codePh:"أدخل الرمز المكون من 8 أحرف",yourCode:"رمزك",copy:"نسخ",waiting:"بانتظار الهاتف الآخر…",connected:"متصل مع",left:"الوقت المتبقي",location:"الموقع",locOn:"تتم مشاركة الموقع فقط أثناء هذه الجلسة.",locOff:"اسمح بالموقع ليتمكن الهاتف الآخر من العثور عليك.",partnerLoc:"موقع الهاتف الآخر",noLoc:"لا يوجد موقع بعد.",navigate:"🧭 التنقل إلى الهاتف",distance:"المسافة",camera:"📷 طلب الكاميرا + الصوت",stopMedia:"⛔ إيقاف الكاميرا/الصوت",end:"إنهاء الجلسة",request:"الهاتف الآخر يطلب الوصول إلى الكاميرا والميكروفون.",allow:"سماح",decline:"رفض",live:"🔴 مباشر — تتم مشاركة الكاميرا/الميكروفون",requestSent:"تم إرسال الطلب. يجب أن يسمح الهاتف الآخر.",declined:"تم رفض الطلب.",expired:"انتهت الجلسة.",copied:"تم نسخ الرمز.",needPermission:"يجب السماح بالموقع.",mediaDenied:"لم يتم السماح بالكاميرا/الميكروفون.",notSupported:"هذا الهاتف/المتصفح لا يدعم الميزة.",loading:"جارٍ الاتصال…",onlyAllowed:"يجب على المشرف تفعيل هذه الوحدة لهذا المستخدم.",sharePreview:"الصورة التي تشاركها",remote:"صورة الهاتف الآخر"}
};
let session=null,stateTimer=null,signalTimer=null,watchId=null,lastLocSent=0,lastSignalId=0,ownLocation=null,pc=null,localStream=null,remoteStream=null,pendingCandidates=[],active=false,requestModal=null,partnerDevice=null,partnerName="",currentFacing="environment",currentMediaMode=null,currentCall=false,ringTimer=null,ringAudioCtx=null;

const root=()=>document.getElementById("nearbyRoot");
const ctx=()=>window.DiamondNearbyContext;
const lang=()=>{const l=ctx()?.language?.()||localStorage.getItem("pajaziti-language")||"sq";return T[l]?l:"en"};
const tx=(k)=>T[lang()]?.[k]||T.en[k]||k;
const by=(id)=>document.getElementById(id);
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function setMsg(text,type=""){const e=by("nearbyStatus");if(!e)return;e.textContent=text||"";e.className="message "+type}
async function rpc(name,args={}){const c=ctx()?.client?.();if(!c)throw new Error("SUPABASE_NOT_READY");const {data,error}=await c.rpc(name,args);if(error)throw error;return data}
function credentials(){return {p_device:ctx()?.device?.()||"",p_secret:ctx()?.secret?.()||""}}
function formatLeft(sec){sec=Math.max(0,Number(sec)||0);const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return (h?String(h).padStart(2,"0")+":":"")+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
function distanceMeters(a,b){if(!a||!b)return null;const R=6371000,r=Math.PI/180;const p1=a.latitude*r,p2=b.latitude*r,dp=(b.latitude-a.latitude)*r,dl=(b.longitude-a.longitude)*r;const x=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
function render(){
 const r=root();if(!r)return;
 r.innerHTML=`
 <div class="nearby-shell">
   <section class="card nearby-hero">
     <div class="nearby-icon">📍</div><div><h2 id="nearbyTitle"></h2><p id="nearbyNote" class="muted"></p></div>
   </section>
   <section id="nearbyIdle" class="card nearby-idle">
     <label class="nearby-label"><span id="nearbyDurationLabel"></span>
       <select id="nearbyDuration"><option value="60"></option><option value="240"></option><option value="0"></option></select>
     </label>
     <label class="nearby-label"><span id="nearbyCustomLabel"></span>
       <input id="nearbyCustomCode" maxlength="12" autocomplete="off" autocapitalize="characters">
     </label>
     <button id="nearbyCreate" class="primary" type="button"></button>
     <div class="nearby-divider"><span>—</span></div>
     <input id="nearbyCodeInput" maxlength="12" autocomplete="one-time-code" autocapitalize="characters">
     <button id="nearbyJoin" class="secondary" type="button"></button>
     <div class="nearby-admin-share">
       <label><input id="nearbyAdminShareToggle" type="checkbox"> <span id="nearbyAdminShareLabel"></span></label>
       <small id="nearbyAdminShareStatus" class="muted"></small>
     </div>
   </section>
   <section id="nearbySession" class="hidden">
     <section class="card nearby-session-head">
       <div><small id="nearbyYourCodeLabel"></small><div class="nearby-code-row"><strong id="nearbyCode">--------</strong><button id="nearbyCopy" class="secondary" type="button"></button></div></div>
       <div class="nearby-time"><small id="nearbyLeftLabel"></small><strong id="nearbyLeft">--:--</strong></div>
     </section>
     <section class="card nearby-status-card">
       <div id="nearbyPartner" class="nearby-partner"></div>
       <div id="nearbyOwnLoc" class="nearby-loc-note"></div>
     </section>
     <section class="card nearby-map-card">
       <h3 id="nearbyPartnerLocLabel"></h3>
       <div id="nearbyPartnerLoc" class="nearby-coords"></div>
       <div id="nearbyDistance" class="nearby-distance"></div>
       <button id="nearbyNavigate" class="primary" type="button" disabled></button>
     </section>
     <section class="card nearby-media-card">
       <div id="nearbyLiveBadge" class="nearby-live hidden"></div>
       <div class="nearby-video-grid">
         <div id="nearbyRemoteWrap" class="hidden"><small id="nearbyRemoteLabel"></small><video id="nearbyRemoteVideo" playsinline autoplay controls></video></div>
         <div id="nearbyLocalWrap" class="hidden"><small id="nearbyLocalLabel"></small><video id="nearbyLocalVideo" playsinline autoplay muted></video></div>
       </div>
       <div class="nearby-media-actions">
         <button id="nearbyCameraOnly" class="secondary" type="button"></button>
         <button id="nearbyAudioOnly" class="secondary" type="button"></button>
         <button id="nearbyMediaRequest" class="primary" type="button"></button>
         <button id="nearbyCallAudio" class="secondary" type="button"></button>
         <button id="nearbyCallVideo" class="secondary" type="button"></button>
         <button id="nearbySwitchCamera" class="secondary hidden" type="button"></button>
         <button id="nearbyPermissions" class="secondary" type="button"></button>
       </div>
       <button id="nearbyMediaStop" class="secondary hidden" type="button"></button>
     </section>
     <button id="nearbyEnd" class="nearby-end" type="button"></button>
   </section>
   <div id="nearbyStatus" class="message"></div>
 </div>`;
 bind();
 reloadLanguage();
}
function reloadLanguage(){
 if(!root())return;
 const map={nearbyTitle:"title",nearbyNote:"note",nearbyDurationLabel:"duration",nearbyCreate:"create",nearbyCustomLabel:"custom",nearbyAdminShareLabel:"shareAdmin",nearbyJoin:"join",nearbyYourCodeLabel:"yourCode",nearbyCopy:"copy",nearbyLeftLabel:"left",nearbyPartnerLocLabel:"partnerLoc",nearbyNavigate:"navigate",nearbyCameraOnly:"cameraOnly",nearbyAudioOnly:"audioOnly",nearbyMediaRequest:"both",nearbyCallAudio:"callAudio",nearbyCallVideo:"callVideo",nearbySwitchCamera:"switchCamera",nearbyPermissions:"permissions",nearbyMediaStop:"stopMedia",nearbyEnd:"end",nearbyLiveBadge:"live",nearbyRemoteLabel:"remote",nearbyLocalLabel:"sharePreview"};
 for(const [id,k] of Object.entries(map)){const e=by(id);if(e)e.textContent=tx(k)}
 const d=by("nearbyDuration");if(d){d.options[0].text=tx("h1");d.options[1].text=tx("h2");d.options[2].text=tx("h3")}
 const ci=by("nearbyCodeInput");if(ci)ci.placeholder=tx("codePh");
 const cc=by("nearbyCustomCode");if(cc)cc.placeholder=tx("customPh");
 if(session) pollState().catch(()=>{});
}
function bind(){
 by("nearbyCreate")?.addEventListener("click",createSession);
 by("nearbyAdminShareToggle")?.addEventListener("change",toggleAdminLocationShare);
 by("nearbyJoin")?.addEventListener("click",joinSession);
 by("nearbyCodeInput")?.addEventListener("input",e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12)});
 by("nearbyCustomCode")?.addEventListener("input",e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12)});
 by("nearbyCopy")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(session?.code||"");setMsg(tx("copied"),"success")}catch(_){}});
 by("nearbyNavigate")?.addEventListener("click",navigate);
 by("nearbyCameraOnly")?.addEventListener("click",()=>requestMedia({video:true,audio:false,call:false}));
 by("nearbyAudioOnly")?.addEventListener("click",()=>requestMedia({video:false,audio:true,call:false}));
 by("nearbyMediaRequest")?.addEventListener("click",()=>requestMedia({video:true,audio:true,call:false}));
 by("nearbyCallAudio")?.addEventListener("click",()=>requestMedia({video:false,audio:true,call:true}));
 by("nearbyCallVideo")?.addEventListener("click",()=>requestMedia({video:true,audio:true,call:true}));
 by("nearbySwitchCamera")?.addEventListener("click",requestCameraSwitch);
 by("nearbyPermissions")?.addEventListener("click",showPermissionManager);
 by("nearbyMediaStop")?.addEventListener("click",()=>stopPeer(true));
 by("nearbyEnd")?.addEventListener("click",endSession);
}
function saveSession(){if(session?.id)localStorage.setItem(SESSION_KEY,JSON.stringify({id:session.id,code:session.code||""}));else localStorage.removeItem(SESSION_KEY)}
function readSaved(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||"null")}catch(_){return null}}
function showSession(){by("nearbyIdle")?.classList.add("hidden");by("nearbySession")?.classList.remove("hidden");if(by("nearbyCode"))by("nearbyCode").textContent=session?.code||"--------"}
function showIdle(){by("nearbyIdle")?.classList.remove("hidden");by("nearbySession")?.classList.add("hidden")}
async function createSession(){
 setMsg(tx("loading"));
 try{
   await ctx()?.ensureRegistered?.();
   const duration=Number(by("nearbyDuration")?.value||60);
   const customCode=String(by("nearbyCustomCode")?.value||"").trim().toUpperCase();
   if(customCode && (customCode.length<4||customCode.length>12)){setMsg(tx("customPh"),"error");return}
   const data=await rpc("nearby_create_session_v2",{...credentials(),p_duration:duration,p_code:customCode||null});
   session={id:data.session_id,code:data.code};lastSignalId=0;saveSession();showSession();startSessionWork();setMsg(tx("waiting"));
 }catch(e){
   const m=String(e?.message||e||"");
   if(m.includes("CODE_ALREADY_USED")) setMsg("Ky kod përdoret. Zgjidh një tjetër.","error");
   else handleError(e);
 }
}
async function joinSession(){
 const code=(by("nearbyCodeInput")?.value||"").trim().toUpperCase();
 if(code.length<4||code.length>12){setMsg(tx("codePh"),"error");return}
 setMsg(tx("loading"));
 try{
   await ctx()?.ensureRegistered?.();
   const data=await rpc("nearby_join_session",{...credentials(),p_code:code});
   session={id:data.session_id,code:data.code};lastSignalId=0;saveSession();showSession();startSessionWork();setMsg("");
 }catch(e){handleError(e)}
}
function handleError(e){
 const m=String(e?.message||e||"");
 if(/NEARBY_NOT_ALLOWED|INVALID_MODULE|DEVICE_NOT_VERIFIED/.test(m))setMsg(tx("onlyAllowed"),"error");
 else if(/EXPIRED|NOT_FOUND/.test(m))setMsg(tx("expired"),"error");
 else setMsg(m.replace(/^.*?error:\s*/i,"")||"Gabim","error");
}
function startSessionWork(){
 if(!session?.id)return;
 stopTimers();startLocation();
 pollState().catch(handleError);pollSignals().catch(()=>{});
 stateTimer=setInterval(()=>pollState().catch(handleError),3000);
 signalTimer=setInterval(()=>pollSignals().catch(()=>{}),1200);
}
function stopTimers(){if(stateTimer)clearInterval(stateTimer);if(signalTimer)clearInterval(signalTimer);stateTimer=null;signalTimer=null}
function startLocation(){
 stopLocation();
 if(!navigator.geolocation){if(by("nearbyOwnLoc"))by("nearbyOwnLoc").textContent=tx("notSupported");return}
 watchId=navigator.geolocation.watchPosition(pos=>{
   ownLocation={latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracy:pos.coords.accuracy};
   if(by("nearbyOwnLoc"))by("nearbyOwnLoc").textContent="✅ "+tx("locOn");
   const now=Date.now();if(now-lastLocSent<5000||!session?.id)return;lastLocSent=now;
   rpc("nearby_update_location",{...credentials(),p_session:session.id,p_lat:ownLocation.latitude,p_lng:ownLocation.longitude,p_accuracy:ownLocation.accuracy}).catch(handleError);
 },()=>{if(by("nearbyOwnLoc"))by("nearbyOwnLoc").textContent="⚠️ "+tx("locOff")},{enableHighAccuracy:true,maximumAge:4000,timeout:12000});
}
function stopLocation(){if(watchId!==null&&navigator.geolocation){try{navigator.geolocation.clearWatch(watchId)}catch(_){}}watchId=null}
async function pollState(){
 if(!session?.id)return;
 const s=await rpc("nearby_session_state",{...credentials(),p_session:session.id});
 session.code=s.code||session.code;partnerDevice=s.partner_device||partnerDevice;partnerName=s.partner_name||partnerName;saveSession();showSession();
 if(by("nearbyCode"))by("nearbyCode").textContent=session.code||"--------";
 if(by("nearbyLeft"))by("nearbyLeft").textContent=s.permanent?("∞ · "+tx("h3")):formatLeft(s.seconds_left);
 if(by("nearbyPartner"))by("nearbyPartner").innerHTML=s.partner_connected?"✅ "+esc(tx("connected"))+" <strong>"+esc(s.partner_name||"")+"</strong>":"⏳ "+esc(tx("waiting"));
 const loc=s.partner_location;
 const locBox=by("nearbyPartnerLoc"),distBox=by("nearbyDistance"),nav=by("nearbyNavigate");
 if(loc){
   locBox.textContent=Number(loc.latitude).toFixed(6)+", "+Number(loc.longitude).toFixed(6);
   const d=distanceMeters(ownLocation,loc);distBox.textContent=d==null?"":tx("distance")+": "+(d<1000?Math.round(d)+" m":(d/1000).toFixed(2)+" km");
   nav.disabled=false;nav.dataset.lat=String(loc.latitude);nav.dataset.lng=String(loc.longitude);
 }else{locBox.textContent=tx("noLoc");distBox.textContent="";nav.disabled=true;delete nav.dataset.lat;delete nav.dataset.lng}
 if(s.status==="ended"||(!s.permanent&&Number(s.seconds_left)<=0)){setMsg(tx("expired"),"error");cleanupSession();showIdle()}
}
function navigate(){
 const b=by("nearbyNavigate"),lat=b?.dataset.lat,lng=b?.dataset.lng;if(!lat||!lng)return;
 window.open("https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(lat+","+lng),"_blank","noopener");
}
function grantsRead(){
 try{return JSON.parse(localStorage.getItem(MEDIA_GRANTS_KEY)||"{}")||{}}catch(_){return{}}
}
function grantsForPeer(){
 const all=grantsRead();return partnerDevice?all[partnerDevice]||{camera:false,audio:false}:{camera:false,audio:false};
}
function grantsSave(camera,audio){
 if(!partnerDevice)return;
 const all=grantsRead();all[partnerDevice]={camera:!!camera,audio:!!audio,partnerName:partnerName||"",updatedAt:Date.now()};
 localStorage.setItem(MEDIA_GRANTS_KEY,JSON.stringify(all));
}
function grantsRevoke(){
 if(!partnerDevice)return;
 const all=grantsRead();delete all[partnerDevice];localStorage.setItem(MEDIA_GRANTS_KEY,JSON.stringify(all));
}
async function requestMedia(opts){
 if(!session?.id||!partnerDevice)return;
 try{
   await sendSignal("media_request",{action:opts.call?"call":"media",video:!!opts.video,audio:!!opts.audio});
   setMsg(opts.call?tx("ringing"):tx("requestSent"),"success");
 }catch(e){handleError(e)}
}
async function requestCameraSwitch(){
 if(!session?.id||!partnerDevice)return;
 try{await sendSignal("media_request",{action:"camera_switch"});}catch(e){handleError(e)}
}
function showPermissionManager(){
 if(requestModal)return;
 const g=grantsForPeer();
 requestModal=document.createElement("div");requestModal.className="nearby-consent-overlay";
 if(req.call)startRingTone();
 requestModal.innerHTML='<div class="nearby-consent-card"><h3>🔐 '+esc(tx("permissions"))+'</h3><p>'+esc(partnerName||"")+'</p><p>📷 '+(g.camera?"✅":"❌")+' &nbsp; 🎙️ '+(g.audio?"✅":"❌")+'</p><div><button id="nearbyPermClose" class="secondary" type="button">'+esc(tx("decline"))+'</button><button id="nearbyPermRevoke" class="primary" type="button">'+esc(tx("revoke"))+'</button></div></div>';
 document.body.appendChild(requestModal);
 by("nearbyPermClose")?.addEventListener("click",closeConsent);
 by("nearbyPermRevoke")?.addEventListener("click",()=>{grantsRevoke();closeConsent();setMsg(tx("revoke"),"success")});
}
async function pollSignals(){
 if(!session?.id)return;
 const rows=await rpc("nearby_signal_poll",{...credentials(),p_session:session.id,p_after_id:lastSignalId})||[];
 for(const row of rows){lastSignalId=Math.max(lastSignalId,Number(row.id)||0);await handleSignal(row)}
}
async function sendSignal(kind,payload={}){return rpc("nearby_signal_send",{...credentials(),p_session:session.id,p_kind:kind,p_payload:payload})}
async function handleSignal(row){
 const p=row.payload||{};
 if(row.kind==="media_request")return handleMediaRequest(p);
 if(row.kind==="media_accept")return startCallerPeer(p);
 if(row.kind==="media_decline"){setMsg(tx("declined"),"error");return}
 if(row.kind==="offer")return handleOffer(p);
 if(row.kind==="answer"){if(pc){await pc.setRemoteDescription(new RTCSessionDescription(p));await flushCandidates()}return}
 if(row.kind==="candidate"){const c=new RTCIceCandidate(p);if(pc?.remoteDescription)await pc.addIceCandidate(c).catch(()=>{});else pendingCandidates.push(c);return}
 if(row.kind==="hangup"){stopPeer(false);return}
}
async function handleMediaRequest(req){
 const action=req?.action||"media";
 if(action==="camera_switch"){
   if(localStream?.getVideoTracks?.().length) await switchOwnCamera();
   return;
 }
 const video=!!req?.video,audio=!!req?.audio,call=action==="call";
 const g=grantsForPeer();
 const covered=(!video||g.camera)&&(!audio||g.audio);
 if(covered){
   await allowMedia({video,audio,call,remember:false,auto:true});
   return;
 }
 incomingRequest({video,audio,call});
}
function startRingTone(){
 stopRingTone();
 try{
   ringAudioCtx=new (window.AudioContext||window.webkitAudioContext)();
   const beep=()=>{
     if(!ringAudioCtx)return;
     const o=ringAudioCtx.createOscillator(),g=ringAudioCtx.createGain();
     o.frequency.value=880;g.gain.value=.08;o.connect(g);g.connect(ringAudioCtx.destination);
     o.start();setTimeout(()=>{try{o.stop()}catch(_){}},280);
   };
   beep();ringTimer=setInterval(beep,900);
 }catch(_){}
}
function stopRingTone(){
 if(ringTimer)clearInterval(ringTimer);ringTimer=null;
 if(ringAudioCtx){try{ringAudioCtx.close()}catch(_){}ringAudioCtx=null}
}
function incomingRequest(req){
 if(requestModal)return;
 const title=req.call?tx("incomingCall"):tx("request");
 const icons=(req.video?"📷 ":"")+(req.audio?"🎙️":"");
 requestModal=document.createElement("div");requestModal.className="nearby-consent-overlay";
 requestModal.innerHTML='<div class="nearby-consent-card"><h3>'+icons+'</h3><p><strong>'+esc(title)+'</strong><br>'+esc(partnerName||"")+'</p><div class="nearby-consent-actions"><button id="nearbyConsentNo" class="secondary" type="button">'+esc(tx("decline"))+'</button><button id="nearbyConsentNow" class="secondary" type="button">'+esc(tx("allowNow"))+'</button><button id="nearbyConsentAlways" class="primary" type="button">'+esc(tx("allowAlways"))+'</button></div></div>';
 document.body.appendChild(requestModal);
 by("nearbyConsentNo")?.addEventListener("click",async()=>{stopRingTone();closeConsent();await sendSignal("media_decline",{action:req.call?"call":"media"}).catch(()=>{})});
 by("nearbyConsentNow")?.addEventListener("click",async()=>{stopRingTone();closeConsent();await allowMedia({...req,remember:false})});
 by("nearbyConsentAlways")?.addEventListener("click",async()=>{stopRingTone();closeConsent();await allowMedia({...req,remember:true})});
}
function closeConsent(){stopRingTone();requestModal?.remove();requestModal=null}
async function getMediaStream(video,audio){
 if(!navigator.mediaDevices?.getUserMedia)throw new Error("NOT_SUPPORTED");
 const constraints={
   video:video?{facingMode:{ideal:currentFacing}}:false,
   audio:audio?true:false
 };
 return navigator.mediaDevices.getUserMedia(constraints);
}
async function allowMedia({video,audio,call,remember}){
 try{
   if(remember){
     const g=grantsForPeer();
     grantsSave(g.camera||video,g.audio||audio);
   }
   localStream=await getMediaStream(video,audio);
   currentMediaMode={video:!!video,audio:!!audio};currentCall=!!call;
   const v=by("nearbyLocalVideo");
   if(video&&v){v.srcObject=localStream;by("nearbyLocalWrap")?.classList.remove("hidden");}
   by("nearbyLiveBadge")?.classList.remove("hidden");by("nearbyMediaStop")?.classList.remove("hidden");
   if(video)by("nearbySwitchCamera")?.classList.remove("hidden");
   await sendSignal("media_accept",{action:call?"call":"media",video:!!video,audio:!!audio});
 }catch(_){
   setMsg(tx("mediaDenied"),"error");
   await sendSignal("media_decline",{action:call?"call":"media"}).catch(()=>{});
 }
}
async function switchOwnCamera(){
 if(!localStream?.getVideoTracks?.().length)return;
 const next=currentFacing==="environment"?"user":"environment";
 try{
   const fresh=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:next}},audio:false});
   const newTrack=fresh.getVideoTracks()[0];
   const oldTrack=localStream.getVideoTracks()[0];
   if(pc){
     const sender=pc.getSenders().find(x=>x.track?.kind==="video");
     if(sender)await sender.replaceTrack(newTrack);
   }
   localStream.removeTrack(oldTrack);oldTrack.stop();localStream.addTrack(newTrack);
   const v=by("nearbyLocalVideo");if(v)v.srcObject=localStream;
   currentFacing=next;
   for(const t of fresh.getTracks()){if(t!==newTrack)t.stop()}
 }catch(_){setMsg(tx("mediaDenied"),"error")}
}
function makePeer(){
 if(typeof RTCPeerConnection==="undefined"){setMsg(tx("notSupported"),"error");return null}
 if(pc)try{pc.close()}catch(_){}
 pc=new RTCPeerConnection({iceServers:[{urls:["stun:stun.l.google.com:19302","stun:stun1.l.google.com:19302"]}]});
 pc.onicecandidate=e=>{if(e.candidate)sendSignal("candidate",e.candidate.toJSON()).catch(()=>{})};
 pc.ontrack=e=>{remoteStream=e.streams?.[0]||remoteStream||new MediaStream();if(!e.streams?.[0])remoteStream.addTrack(e.track);const v=by("nearbyRemoteVideo");if(v)v.srcObject=remoteStream;by("nearbyRemoteWrap")?.classList.remove("hidden");by("nearbyLiveBadge")?.classList.remove("hidden");by("nearbyMediaStop")?.classList.remove("hidden");if(e.track.kind==="video")by("nearbySwitchCamera")?.classList.remove("hidden")};
 pc.onconnectionstatechange=()=>{if(["failed","closed"].includes(pc?.connectionState||""))stopPeer(false)};
 return pc;
}
async function startCallerPeer(meta={}){
 const p=makePeer();if(!p)return;
 const isCall=meta?.action==="call";
 if(isCall){
   try{
     localStream=await getMediaStream(!!meta.video,!!meta.audio);
     currentMediaMode={video:!!meta.video,audio:!!meta.audio};currentCall=true;
     for(const track of localStream.getTracks())p.addTrack(track,localStream);
     if(meta.video){
       const v=by("nearbyLocalVideo");if(v)v.srcObject=localStream;
       by("nearbyLocalWrap")?.classList.remove("hidden");
       by("nearbySwitchCamera")?.classList.remove("hidden");
     }
     by("nearbyLiveBadge")?.classList.remove("hidden");by("nearbyMediaStop")?.classList.remove("hidden");
   }catch(_){await sendSignal("hangup",{}).catch(()=>{});setMsg(tx("mediaDenied"),"error");return}
 }
 const offer=await p.createOffer({offerToReceiveAudio:true,offerToReceiveVideo:true});
 await p.setLocalDescription(offer);await sendSignal("offer",p.localDescription.toJSON());
}
async function handleOffer(payload){
 if(!localStream){await sendSignal("hangup",{}).catch(()=>{});return}
 const p=makePeer();if(!p)return;
 for(const track of localStream.getTracks())p.addTrack(track,localStream);
 await p.setRemoteDescription(new RTCSessionDescription(payload));await flushCandidates();
 const answer=await p.createAnswer();await p.setLocalDescription(answer);await sendSignal("answer",p.localDescription.toJSON());
}
async function flushCandidates(){if(!pc?.remoteDescription)return;const q=pendingCandidates.splice(0);for(const c of q)await pc.addIceCandidate(c).catch(()=>{})}
async function stopPeer(notify){
 if(notify&&session?.id)await sendSignal("hangup",{}).catch(()=>{});
 try{pc?.close()}catch(_){}pc=null;pendingCandidates=[];
 if(localStream){for(const t of localStream.getTracks())t.stop()}localStream=null;
 if(remoteStream){for(const t of remoteStream.getTracks())t.stop()}remoteStream=null;
 for(const id of ["nearbyLocalVideo","nearbyRemoteVideo"]){const v=by(id);if(v)v.srcObject=null}
 by("nearbyLocalWrap")?.classList.add("hidden");by("nearbyRemoteWrap")?.classList.add("hidden");by("nearbyLiveBadge")?.classList.add("hidden");by("nearbyMediaStop")?.classList.add("hidden");by("nearbySwitchCamera")?.classList.add("hidden");currentMediaMode=null;currentCall=false;
}
async function endSession(){
 if(!session?.id)return;
 try{await stopPeer(true);await rpc("nearby_end_session",{...credentials(),p_session:session.id})}catch(_){}
 cleanupSession();showIdle();setMsg(tx("expired"));
}
function cleanupSession(){stopTimers();stopLocation();stopRingTone();stopPeer(false);closeConsent();session=null;partnerDevice=null;partnerName="";lastSignalId=0;saveSession()}
async function restore(){
 const saved=readSaved();if(!saved?.id)return false;
 session={id:saved.id,code:saved.code||""};
 try{const s=await rpc("nearby_session_state",{...credentials(),p_session:session.id});if(s.status==="ended"||Number(s.seconds_left)<=0)throw new Error("SESSION_EXPIRED");session.code=s.code||session.code;showSession();startSessionWork();return true}catch(_){cleanupSession();showIdle();return false}
}
let adminShareWatch=null;
async function loadAdminLocationShareState(){
 try{
   const data=await rpc("admin_location_share_get",credentials());
   const t=by("nearbyAdminShareToggle"),st=by("nearbyAdminShareStatus");
   if(t)t.checked=!!data?.enabled;
   if(st)st.textContent=data?.enabled?tx("shareAdminOn"):tx("shareAdminOff");
   if(data?.enabled) startAdminShareWatch();
 }catch(_){}
}
function stopAdminShareWatch(){
 if(adminShareWatch!==null&&navigator.geolocation){try{navigator.geolocation.clearWatch(adminShareWatch)}catch(_){}}
 adminShareWatch=null;
}
function startAdminShareWatch(){
 stopAdminShareWatch();
 if(!navigator.geolocation)return;
 adminShareWatch=navigator.geolocation.watchPosition(async(pos)=>{
   try{
     await rpc("admin_location_share_set",{...credentials(),p_enabled:true,p_lat:pos.coords.latitude,p_lng:pos.coords.longitude,p_accuracy:pos.coords.accuracy});
     const st=by("nearbyAdminShareStatus");if(st)st.textContent=tx("shareAdminOn");
   }catch(_){}
 },()=>{}, {enableHighAccuracy:true,maximumAge:15000,timeout:15000});
}
async function toggleAdminLocationShare(){
 const t=by("nearbyAdminShareToggle"),st=by("nearbyAdminShareStatus");
 if(!t)return;
 if(!t.checked){
   stopAdminShareWatch();
   try{await rpc("admin_location_share_set",{...credentials(),p_enabled:false,p_lat:null,p_lng:null,p_accuracy:null});}catch(_){}
   if(st)st.textContent=tx("shareAdminOff");
   return;
 }
 if(!navigator.geolocation){t.checked=false;return}
 navigator.geolocation.getCurrentPosition(async(pos)=>{
   try{
     await rpc("admin_location_share_set",{...credentials(),p_enabled:true,p_lat:pos.coords.latitude,p_lng:pos.coords.longitude,p_accuracy:pos.coords.accuracy});
     if(st)st.textContent=tx("shareAdminOn");
     startAdminShareWatch();
   }catch(e){t.checked=false;handleError(e)}
 },()=>{t.checked=false;if(st)st.textContent=tx("needPermission")},{enableHighAccuracy:true,timeout:15000});
}
async function activate(){
 active=true;if(!root())return; if(!by("nearbyIdle"))render();reloadLanguage();
 loadAdminLocationShareState().catch(()=>{});
 if(session){showSession();startSessionWork();return}
 await restore();
}
function deactivate(){active=false;stopTimers();stopLocation();stopAdminShareWatch();stopPeer(true);closeConsent()}
window.DiamondNearby={activate,deactivate,reloadLanguage};
