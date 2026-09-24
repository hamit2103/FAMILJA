const ANDROID_URL="https://htuzevfjmctmjnqrdrrq.supabase.co/functions/v1/familja-apk";
const FIRE_URL="https://familja.vercel.app/pajaziti-firetv.apk";
const IOS_URL="https://familja.vercel.app/?install=ios";
export default function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");
  const explicit=String(req.query?.platform||"").toLowerCase();
  const ua=String(req.headers["user-agent"]||"");
  const fire=/\bAFT[A-Z0-9]+\b|Fire TV|AmazonWebAppPlatform|Silk\//i.test(ua);
  const ios=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/i.test(ua)&&/Mobile\//i.test(ua));
  const android=/Android/i.test(ua);
  let p=explicit;
  if(!p){if(fire)p="firestick";else if(ios)p="ios";else if(android)p="android";}
  if(p==="firestick"||p==="fire")return res.redirect(302,FIRE_URL);
  if(p==="ios"||p==="iphone")return res.redirect(302,IOS_URL);
  if(p==="android")return res.redirect(302,ANDROID_URL);
  res.setHeader("Content-Type","text/html; charset=utf-8");
  return res.status(200).send('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIAMOND</title><style>body{font-family:system-ui;background:#eef8ff;padding:24px}.c{max-width:520px;margin:7vh auto;background:#fff;border-radius:22px;padding:22px}a{display:block;margin:12px 0;padding:15px;border-radius:14px;background:#183b64;color:#fff;text-decoration:none;font-weight:800;text-align:center}</style><div class="c"><h1>💎 DIAMOND</h1><p>Zgjidh pajisjen / Choose your device:</p><a href="/android">📱 Android</a><a href="/firestick">📺 Fire TV Stick</a><a href="/iphone">🍎 iPhone / Safari</a></div>');
}