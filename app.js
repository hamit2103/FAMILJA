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

const loginView = $("loginView");
const appView = $("appView");
const familyMode = $("familyMode");
const adminMode = $("adminMode");
const codeInput = $("codeInput");
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
const galleryTab = $("galleryTab");
const infoTab = $("infoTab");
const prayerTab = $("prayerTab");
const galleryView = $("galleryView");
const infoView = $("infoView");
const prayerView = $("prayerView");
const infoName = $("infoName");
const infoText = $("infoText");
const infoSendBtn = $("infoSendBtn");
const infoStatus = $("infoStatus");
const infoRefreshBtn = $("infoRefreshBtn");
const infoList = $("infoList");
const infoEmpty = $("infoEmpty");
const infoCount = $("infoCount");
const onlineCount = $("onlineCount");
const storageCard = $("storageCard");
const storageUsed = $("storageUsed");
const storagePercent = $("storagePercent");
const storageBar = $("storageBar");
const prayerLocation = $("prayerLocation");
const prayerLocationBtn = $("prayerLocationBtn");
const prayerNext = $("prayerNext");
const prayerStatus = $("prayerStatus");
const prayerList = $("prayerList");

let mode = "family";
let realtimeChannel = null;
let installPrompt = null;
let currentUser = null;
let mediaItems = [];
let prayerTimings = null;
let prayerTimingsDate = "";
let prayerTimezone = "";
let prayerCheckTimer = null;
let prayerAudioContext = null;
let nativeCalendarCache = null;
let nativeCalendarCacheKey = "";

const PRAYER_COORDS_KEY = "pajaziti-prayer-coords";
const PRAYER_ALARMS_KEY = "pajaziti-prayer-alarms";
const PRAYER_LAST_ALERT_KEY = "pajaziti-prayer-last-alert";
const PRAYERS = [
  { key: "Fajr", label: "Sabahu" },
  { key: "Dhuhr", label: "Dreka" },
  { key: "Asr", label: "Ikindia" },
  { key: "Maghrib", label: "Akshami" },
  { key: "Isha", label: "Jacia" }
];

let prayerAlarms = (() => {
  try {
    return JSON.parse(localStorage.getItem(PRAYER_ALARMS_KEY) || "{}");
  } catch (_) {
    return {};
  }
})();

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
lightbox.setAttribute("aria-label", "Foto në ekran të plotë");

const lightboxImage = document.createElement("img");
lightboxImage.alt = "Foto";

const lightboxClose = document.createElement("button");
lightboxClose.type = "button";
lightboxClose.className = "lightbox-close";
lightboxClose.setAttribute("aria-label", "Mbyll");
lightboxClose.textContent = "×";

lightbox.appendChild(lightboxImage);
lightbox.appendChild(lightboxClose);
document.body.appendChild(lightbox);

function openLightbox(url, alt = "Foto") {
  lightboxImage.src = url;
  lightboxImage.alt = alt;
  lightbox.classList.remove("hidden");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
    closeLightbox();
  }
});

function setSection(next) {
  const showGallery = next === "gallery";
  const showInfo = next === "info";
  const showPrayer = next === "prayer";

  galleryTab.classList.toggle("active", showGallery);
  infoTab.classList.toggle("active", showInfo);
  prayerTab.classList.toggle("active", showPrayer);

  galleryView.classList.toggle("hidden", !showGallery);
  infoView.classList.toggle("hidden", !showInfo);
  prayerView.classList.toggle("hidden", !showPrayer);

  if (showInfo) loadInfo();
  if (showPrayer) loadPrayerTimes(false);
}
galleryTab.addEventListener("click", () => setSection("gallery"));
infoTab.addEventListener("click", () => setSection("info"));
prayerTab.addEventListener("click", () => setSection("prayer"));

function setMode(next) {
  mode = next;
  familyMode.classList.toggle("active", next === "family");
  adminMode.classList.toggle("active", next === "admin");
  codeInput.value = "";
  codeInput.placeholder =
    next === "admin" ? "Kodi i administratorit" : "Kodi i familjes";
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
      "Supabase nuk është lidhur ende. Duhet Project URL dhe anon key.",
      "error"
    );
  }

  const code = codeInput.value.trim();
  if (!code) return showMessage(loginMessage, "Shkruaj kodin.", "error");

  loginBtn.disabled = true;
  showMessage(loginMessage, "Po kontrolloj kodin…");

  const email = mode === "admin" ? ADMIN_EMAIL : FAMILY_EMAIL;
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: code
  });

  if (error) {
    console.error(error);
    const raw = (error.message || "").toLowerCase();
    let message = "Nuk mund të hyhet. Kontrollo kodin.";
    if (raw.includes("invalid login credentials")) {
      message = "Kodi nuk përputhet me këtë llogari.";
    } else if (raw.includes("email not confirmed")) {
      message = "Llogaria në Supabase nuk është konfirmuar ende.";
    } else if (raw.includes("rate limit")) {
      message = "Shumë tentativa. Prit pak dhe provo përsëri.";
    } else if (error.message) {
      message = "Gabim: " + error.message;
    }
    showMessage(loginMessage, message, "error");
  } else {
    showMessage(loginMessage, "");
  }
  loginBtn.disabled = false;
}

loginBtn.addEventListener("click", login);
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

logoutBtn.addEventListener("click", async () => {
  if (supabase) await supabase.auth.signOut();
});

refreshBtn.addEventListener("click", loadMedia);

async function loadInfo() {
  if (!supabase || !currentUser) return;

  const { data, error } = await supabase
    .from("information")
    .select("id,author,message,created_at,user_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    showMessage(infoStatus, "Informacioni nuk është gati ende.", "error");
    return;
  }

  infoList.innerHTML = "";
  infoCount.textContent = String(data.length);
  infoEmpty.classList.toggle("hidden", data.length > 0);

  for (const item of data) {
    const card = document.createElement("article");
    card.className = "info-item";

    const head = document.createElement("div");
    head.className = "info-head";

    const left = document.createElement("div");
    const author = document.createElement("div");
    author.className = "info-author";
    author.textContent = item.author || "Familja";

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
      del.textContent = "Fshi";
      del.addEventListener("click", async () => {
        if (!confirm("Ta fshij këtë informacion?")) return;
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
  if (!supabase || !currentUser) return;

  const author = infoName.value.trim();
  const message = infoText.value.trim();

  if (!author) {
    return showMessage(infoStatus, "Shkruaj emrin.", "error");
  }
  if (!message) {
    return showMessage(infoStatus, "Shkruaj mesazhin.", "error");
  }

  infoSendBtn.disabled = true;
  showMessage(infoStatus, "Po publikohet...");

  const { error } = await supabase.from("information").insert({
    author,
    message,
    user_id: currentUser.id
  });

  infoSendBtn.disabled = false;

  if (error) {
    console.error(error);
    showMessage(infoStatus, "Publikimi dështoi: " + error.message, "error");
    return;
  }

  localStorage.setItem("pajaziti-info-name", author);
  infoText.value = "";
  showMessage(infoStatus, "U publikua.", "success");
  await loadInfo();
});

const savedInfoName = localStorage.getItem("pajaziti-info-name");
if (savedInfoName) infoName.value = savedInfoName;



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
      reject(new Error("Ky telefon nuk e mbështet vendndodhjen."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(
        savePrayerCoords(position.coords.latitude, position.coords.longitude)
      ),
      (error) => {
        let message = "Nuk u mor vendndodhja.";
        if (error?.code === 1) message = "Duhet ta lejosh vendndodhjen për oraret e namazit.";
        if (error?.code === 2) message = "Vendndodhja nuk u gjet. Provo përsëri.";
        if (error?.code === 3) message = "Vendndodhja vonoi shumë. Provo përsëri.";
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
  if (!response.ok) throw new Error("Nuk u morën oraret e namazit.");

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

  prayerLocation.textContent = "Zona: " + prayerTimezone;
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
    prayerLocation.textContent = "Preke “Vendndodhja” për oraret e sakta.";
    prayerStatus.textContent = "";
    if (!prayerTimings) prayerList.innerHTML = "";
    return;
  }

  try {
    prayerLocationBtn.disabled = true;
    showMessage(prayerStatus, forceLocation ? "Po marr vendndodhjen…" : "Po marr oraret…");

    if (!coords) coords = await getPhoneLocation();
    await fetchPrayerTimes(coords);

    showMessage(prayerStatus, "Oraret u përditësuan.", "success");
  } catch (error) {
    console.error("Prayer times failed", error);
    showMessage(prayerStatus, error?.message || "Nuk u morën oraret.", "error");
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
    throw new Error("Nuk u gjetën orare të ardhshme për " + prayer.label + ".");
  }

  window.AndroidPrayer.schedulePrayer(
    prayer.key,
    prayer.label,
    JSON.stringify(times)
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
    name.textContent = prayer.label;

    const time = document.createElement("div");
    time.className = "prayer-time";
    time.textContent = prayerTimings[prayer.key] || "--:--";

    const alarm = document.createElement("button");
    alarm.type = "button";
    alarm.className = "prayer-alarm" + (prayerAlarms[prayer.key] ? " active" : "");
    alarm.textContent = prayerAlarms[prayer.key] ? "🔔 Alarm ON" : "🔕 Alarm OFF";
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
              "Po regjistroj alarmin sistemor për " + prayer.label + "…"
            );
            await scheduleNativePrayer(prayer);
            showMessage(
              prayerStatus,
              "Alarmi sistemor për " + prayer.label + " u aktivizua.",
              "success"
            );
          } else {
            showMessage(
              prayerStatus,
              "Alarmi u aktivizua. Për alarm edhe kur app-i është i mbyllur përdor APK Android.",
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
            "Alarmi për " + prayer.label + " u çaktivizua."
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
    prayerNext.textContent = "Namazi i radhës: Sabahu nesër";
  } else {
    prayerNext.textContent =
      "Namazi i radhës: " + next.label + " në " + prayerTimings[next.key];
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
  const title = "🕌 Koha e namazit";
  const body = "Është koha e " + prayer.label + " (" + time + ").";

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
    uploadTitle.textContent = "Shto foto ose video";
    uploadHint.textContent = "Administratori mund të ngarkojë foto dhe video.";
    mediaInput.accept = "image/*,video/*";
    uploadBtn.disabled = false;
    return;
  }

  const used = ownFamilyPhotoCount(items);
  const remaining = Math.max(0, FAMILY_PHOTO_LIMIT - used);

  uploadTitle.textContent = "Shto fotot e tua";
  uploadHint.textContent =
    "Ke ngarkuar " + used + "/" + FAMILY_PHOTO_LIMIT +
    " foto. Mund të shtosh edhe " + remaining + ".";
  mediaInput.accept = "image/*";
  uploadBtn.disabled = remaining === 0;

  if (remaining === 0) {
    showMessage(
      uploadStatus,
      "E ke arritur kufirin prej 3 fotove. Fshi një nga fotot e tua për të ngarkuar një tjetër.",
      ""
    );
  }
}

async function deleteMediaItem(item) {
  if (!supabase || !currentUser) return;

  if (!isAdmin() && !isOwnFamilyPhoto(item)) {
    alert("Mund të fshish vetëm fotot që ke ngarkuar vetë.");
    return;
  }

  if (!confirm("Ta fshij këtë material?")) return;

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
    emptyState.querySelector("h2").textContent = "Supabase nuk është gati ende";
    emptyState.querySelector("p").textContent =
      "Duhet të ekzekutohet skedari supabase/setup.sql në SQL Editor.";
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
        preview.alt = item.name || "Foto";
        preview.src = url;
        preview.title = "Preke për ta zmadhuar";
        preview.addEventListener("click", () => openLightbox(url, item.name || "Foto"));
      }

      card.appendChild(preview);

      const meta = document.createElement("div");
      meta.className = "media-meta";

      const name = document.createElement("div");
      name.className = "media-name";
      name.textContent = item.name || "Material";
      meta.appendChild(name);

      const actions = document.createElement("div");
      actions.className = "media-actions";

      const download = document.createElement("a");
      download.href = url;
      download.target = "_blank";
      download.rel = "noopener";
      download.textContent = "Shkarko";
      actions.appendChild(download);

      if (isAdmin() || isOwnFamilyPhoto(item)) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "danger";
        del.textContent = "Fshi";
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
    storageUsed.textContent = "Matësi kërkon përditësimin e SQL.";
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
      isAdmin() ? "Zgjidh së paku një foto ose video." : "Zgjidh së paku një foto.",
      "error"
    );
  }

  if (!isAdmin()) {
    const nonImages = files.filter((file) => !(file.type || "").startsWith("image/"));
    if (nonImages.length) {
      return showMessage(
        uploadStatus,
        "Anëtarët e familjes mund të ngarkojnë vetëm foto.",
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
        "E ke arritur kufirin prej 3 fotove. Fshi një foto tënden për të ngarkuar një tjetër.",
        "error"
      );
    }

    if (files.length > remaining) {
      return showMessage(
        uploadStatus,
        "Mund të ngarkosh vetëm " + remaining +
          " foto të tjera. Kufiri është 3 foto për person/pajisje.",
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
          originalFile.name +
            " është mbi 50 MB edhe pas optimizimit dhe u anashkalua.",
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
        message += " U kursyen rreth " + formatBytes(savedBytes) + " hapësirë.";
      }
      if (skipped > 0) {
        message += " " + skipped + " skedarë u anashkaluan.";
      }
      showMessage(uploadStatus, message, "success");
      await loadMedia();
    } else {
      showMessage(uploadStatus, "Asnjë skedar nuk u ngarkua.", "error");
    }
  } catch (e) {
    console.error(e);
    showMessage(
      uploadStatus,
      "Ngarkimi dështoi: " + (e?.message || e),
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
      () => loadInfo()
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

  if (!signedIn) {
    gallery.innerHTML = "";
    mediaItems = [];
    mediaCount.textContent = "0";
    uploadStatus.textContent = "";
    if (storageCard) storageCard.classList.add("hidden");
    if (onlineCount) onlineCount.textContent = "0";
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
  roleLabel.textContent = isAdmin() ? "Administrator" : "Anëtar i familjes";
  uploadStatus.textContent = "";
  await loadMedia();
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
    "Kodi i aplikacionit është kaluar në Supabase Free. Tani duhet vetëm ta lidhim projektin Supabase.",
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
    alert("Në Chrome, hap menunë ⋮ dhe zgjidh “Install app” ose “Add to Home screen”.");
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
  const url = new URL("./", window.location.href).href;
  try {
    if (navigator.share) {
      await navigator.share({
        title: "PAJAZITI",
        text: "Hape dhe instalo aplikacionin PAJAZITI.",
        url
      });
      return;
    }
    await navigator.clipboard.writeText(url);
    showMessage(loginMessage, "Linku u kopjua. Tani mund ta dërgosh.", "success");
  } catch (e) {
    if (e?.name !== "AbortError") {
      try {
        await navigator.clipboard.writeText(url);
        showMessage(loginMessage, "Linku u kopjua. Tani mund ta dërgosh.", "success");
      } catch (_) {
        showMessage(loginMessage, "Linku: " + url, "");
      }
    }
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(console.error);
}
