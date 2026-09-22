const SHARE_APP_LANG_KEY="pajaziti-language";
const SHARE_APP_URL="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-apk";
const SA={
sq:{tab:"Ndaje appin",title:"Ndaje linkun e DIAMOND",desc:"Ky link është gjithmonë i njëjtë dhe shkarkon automatikisht versionin më të ri të DIAMOND.",share:"Ndaje",copy:"Kopjo linkun",copied:"Linku u kopjua.",hint:"Mund ta dërgosh me WhatsApp, SMS, Messenger ose çdo aplikacion tjetër."},
de:{tab:"App teilen",title:"DIAMOND-Link teilen",desc:"Dieser Link bleibt immer gleich und lädt automatisch die neueste DIAMOND-Version herunter.",share:"Teilen",copy:"Link kopieren",copied:"Link wurde kopiert.",hint:"Du kannst ihn per WhatsApp, SMS, Messenger oder einer anderen App senden."},
tr:{tab:"Uygulamayı paylaş",title:"DIAMOND bağlantısını paylaş",desc:"Bu bağlantı her zaman aynıdır ve DIAMOND'un en yeni sürümünü otomatik indirir.",share:"Paylaş",copy:"Bağlantıyı kopyala",copied:"Bağlantı kopyalandı.",hint:"WhatsApp, SMS, Messenger veya başka bir uygulamayla gönderebilirsin."},
en:{tab:"Share app",title:"Share the DIAMOND link",desc:"This link always stays the same and automatically downloads the newest DIAMOND version.",share:"Share",copy:"Copy link",copied:"Link copied.",hint:"Send it with WhatsApp, SMS, Messenger or any other app."},
it:{tab:"Condividi app",title:"Condividi il link DIAMOND",desc:"Questo link resta sempre uguale e scarica automaticamente la versione più recente di DIAMOND.",share:"Condividi",copy:"Copia link",copied:"Link copiato.",hint:"Puoi inviarlo con WhatsApp, SMS, Messenger o qualsiasi altra app."},
hr:{tab:"Podijeli app",title:"Podijeli DIAMOND poveznicu",desc:"Ova poveznica uvijek ostaje ista i automatski preuzima najnoviju verziju DIAMOND-a.",share:"Podijeli",copy:"Kopiraj poveznicu",copied:"Poveznica je kopirana.",hint:"Možeš je poslati putem WhatsAppa, SMS-a, Messengera ili druge aplikacije."},
fr:{tab:"Partager l'app",title:"Partager le lien DIAMOND",desc:"Ce lien reste toujours le même et télécharge automatiquement la version la plus récente de DIAMOND.",share:"Partager",copy:"Copier le lien",copied:"Lien copié.",hint:"Tu peux l'envoyer par WhatsApp, SMS, Messenger ou une autre application."},
ar:{tab:"مشاركة التطبيق",title:"مشاركة رابط DIAMOND",desc:"يبقى هذا الرابط نفسه دائماً ويحمّل تلقائياً أحدث إصدار من DIAMOND.",share:"مشاركة",copy:"نسخ الرابط",copied:"تم نسخ الرابط.",hint:"يمكنك إرساله عبر واتساب أو الرسائل أو أي تطبيق آخر."}
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
document.getElementById("shareAppButton")?.addEventListener("click",doShare);
document.getElementById("copyShareAppButton")?.addEventListener("click",()=>doCopy(true));
shareAppRender();
window.DiamondShareApp={activate:shareAppRender,reloadLanguage:shareAppRender,url:SHARE_APP_URL};
