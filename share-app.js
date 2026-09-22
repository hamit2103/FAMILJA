const SHARE_APP_LANG_KEY="pajaziti-language";
const SHARE_APP_URL="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-apk";
const SHARE_IOS_URL="https://familja.vercel.app/";
const SA={
sq:{tab:"Ndaje appin",title:"Ndaje linkun e DIAMOND",desc:"Ky link është gjithmonë i njëjtë dhe shkarkon automatikisht versionin më të ri të DIAMOND.",share:"Ndaje",copy:"Kopjo linkun",copied:"Linku u kopjua.",hint:"Mund ta dërgosh me WhatsApp, SMS, Messenger ose çdo aplikacion tjetër.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"Ky link e hap DIAMOND në web. Hape në Safari dhe pastaj përdor Share → Add to Home Screen.",openSafari:"Hape në Safari",iosCopied:"Linku për iPhone u kopjua."},
de:{tab:"App teilen",title:"DIAMOND-Link teilen",desc:"Dieser Link bleibt immer gleich und lädt automatisch die neueste DIAMOND-Version herunter.",share:"Teilen",copy:"Link kopieren",copied:"Link wurde kopiert.",hint:"Du kannst ihn per WhatsApp, SMS, Messenger oder einer anderen App senden.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"Dieser Link öffnet DIAMOND im Web. In Safari öffnen und dann Teilen → Zum Home-Bildschirm.",openSafari:"In Safari öffnen",iosCopied:"iPhone-Link wurde kopiert."},
tr:{tab:"Uygulamayı paylaş",title:"DIAMOND bağlantısını paylaş",desc:"Bu bağlantı her zaman aynıdır ve DIAMOND'un en yeni sürümünü otomatik indirir.",share:"Paylaş",copy:"Bağlantıyı kopyala",copied:"Bağlantı kopyalandı.",hint:"WhatsApp, SMS, Messenger veya başka bir uygulamayla gönderebilirsin.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"Bu bağlantı DIAMOND'u webde açar. Safari'de açıp Paylaş → Ana Ekrana Ekle seçeneğini kullan.",openSafari:"Safari'de aç",iosCopied:"iPhone bağlantısı kopyalandı."},
en:{tab:"Share app",title:"Share the DIAMOND link",desc:"This link always stays the same and automatically downloads the newest DIAMOND version.",share:"Share",copy:"Copy link",copied:"Link copied.",hint:"Send it with WhatsApp, SMS, Messenger or any other app.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"This link opens DIAMOND on the web. Open it in Safari, then use Share → Add to Home Screen.",openSafari:"Open in Safari",iosCopied:"iPhone link copied."},
it:{tab:"Condividi app",title:"Condividi il link DIAMOND",desc:"Questo link resta sempre uguale e scarica automaticamente la versione più recente di DIAMOND.",share:"Condividi",copy:"Copia link",copied:"Link copiato.",hint:"Puoi inviarlo con WhatsApp, SMS, Messenger o qualsiasi altra app.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"Questo link apre DIAMOND sul web. Aprilo in Safari e usa Condividi → Aggiungi a Home.",openSafari:"Apri in Safari",iosCopied:"Link iPhone copiato."},
hr:{tab:"Podijeli app",title:"Podijeli DIAMOND poveznicu",desc:"Ova poveznica uvijek ostaje ista i automatski preuzima najnoviju verziju DIAMOND-a.",share:"Podijeli",copy:"Kopiraj poveznicu",copied:"Poveznica je kopirana.",hint:"Možeš je poslati putem WhatsAppa, SMS-a, Messengera ili druge aplikacije.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"Ova poveznica otvara DIAMOND na webu. Otvori je u Safariju pa koristi Dijeli → Add to Home Screen.",openSafari:"Otvori u Safariju",iosCopied:"iPhone poveznica je kopirana."},
fr:{tab:"Partager l'app",title:"Partager le lien DIAMOND",desc:"Ce lien reste toujours le même et télécharge automatiquement la version la plus récente de DIAMOND.",share:"Partager",copy:"Copier le lien",copied:"Lien copié.",hint:"Tu peux l'envoyer par WhatsApp, SMS, Messenger ou une autre application.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"Ce lien ouvre DIAMOND sur le web. Ouvre-le dans Safari puis utilise Partager → Sur l’écran d’accueil.",openSafari:"Ouvrir dans Safari",iosCopied:"Lien iPhone copié."},
ar:{tab:"مشاركة التطبيق",title:"مشاركة رابط DIAMOND",desc:"يبقى هذا الرابط نفسه دائماً ويحمّل تلقائياً أحدث إصدار من DIAMOND.",share:"مشاركة",copy:"نسخ الرابط",copied:"تم نسخ الرابط.",hint:"يمكنك إرساله عبر واتساب أو الرسائل أو أي تطبيق آخر.",android:"Android (APK)",ios:"iPhone / Safari",iosDesc:"يفتح هذا الرابط DIAMOND على الويب. افتحه في Safari ثم استخدم مشاركة → إضافة إلى الشاشة الرئيسية.",openSafari:"افتح في Safari",iosCopied:"تم نسخ رابط iPhone."}
};
function sal(){const l=localStorage.getItem(SHARE_APP_LANG_KEY)||"sq";return SA[l]?l:"en";}
function sat(k){return SA[sal()]?.[k]??SA.en[k]??k;}
function shareAppRender(){
 const tab=document.getElementById("shareAppTabLabel"); if(tab)tab.textContent=sat("tab");
 const title=document.getElementById("shareAppTitle"); if(title)title.textContent=sat("title");
 const desc=document.getElementById("shareAppDesc"); if(desc)desc.textContent=sat("desc");
 const btn=document.getElementById("shareAppButton"); if(btn)btn.textContent="🔗 "+sat("share");
 const copy=document.getElementById("copyShareAppButton"); if(copy)copy.textContent="📋 "+sat("copy");
 const hint=document.getElementById("shareAppHint"); if(hint)hint.textContent=sat("hint");
 const link=document.getElementById("shareAppLink"); if(link)link.value=SHARE_APP_URL;
 const androidTitle=document.getElementById("shareAndroidTitle"); if(androidTitle)androidTitle.textContent=sat("android");
 const iosTitle=document.getElementById("shareIosTitle"); if(iosTitle)iosTitle.textContent="🍎 "+sat("ios");
 const iosDesc=document.getElementById("shareIosDesc"); if(iosDesc)iosDesc.textContent=sat("iosDesc");
 const iosShare=document.getElementById("shareIosButton"); if(iosShare)iosShare.textContent="🍎 "+sat("share");
 const iosCopy=document.getElementById("copyShareIosButton"); if(iosCopy)iosCopy.textContent="📋 "+sat("copy");
 const iosOpen=document.getElementById("openShareIosButton"); if(iosOpen)iosOpen.textContent="🌐 "+sat("openSafari");
 const iosLink=document.getElementById("shareIosLink"); if(iosLink)iosLink.value=SHARE_IOS_URL;
}
async function markShare(){try{await window.DiamondRegisterShareEvent?.();}catch(_){}}
async function doShare(){
 await markShare();
 const data={title:"DIAMOND",text:sat("desc"),url:SHARE_APP_URL};
 try{
   if(navigator.share){await navigator.share(data);return;}
 }catch(e){if(e?.name==="AbortError")return;}
 await doCopy(false);
}
async function doCopy(track=true){
 if(track)await markShare();
 const status=document.getElementById("shareAppStatus");
 try{
   await navigator.clipboard.writeText(SHARE_APP_URL);
   if(status){status.textContent=sat("copied");status.className="message success";}
 }catch(_){
   const link=document.getElementById("shareAppLink");
   link?.select?.();
   document.execCommand?.("copy");
   if(status){status.textContent=sat("copied");status.className="message success";}
 }
}
async function doIosShare(){
 await markShare();
 const data={title:"DIAMOND",text:sat("iosDesc"),url:SHARE_IOS_URL};
 try{
   if(navigator.share){await navigator.share(data);return;}
 }catch(e){if(e?.name==="AbortError")return;}
 await doIosCopy(false);
}
async function doIosCopy(track=true){
 if(track)await markShare();
 const status=document.getElementById("shareIosStatus");
 try{
   await navigator.clipboard.writeText(SHARE_IOS_URL);
 }catch(_){
   const link=document.getElementById("shareIosLink");
   link?.select?.();
   document.execCommand?.("copy");
 }
 if(status){status.textContent=sat("iosCopied");status.className="message success";}
}
function openIos(){
 window.open(SHARE_IOS_URL,"_blank","noopener");
}

document.getElementById("shareAppButton")?.addEventListener("click",doShare);
document.getElementById("copyShareAppButton")?.addEventListener("click",()=>doCopy(true));
document.getElementById("shareIosButton")?.addEventListener("click",doIosShare);
document.getElementById("copyShareIosButton")?.addEventListener("click",()=>doIosCopy(true));
document.getElementById("openShareIosButton")?.addEventListener("click",openIos);
shareAppRender();
window.DiamondShareApp={activate:shareAppRender,reloadLanguage:shareAppRender,url:SHARE_APP_URL,iosUrl:SHARE_IOS_URL};
