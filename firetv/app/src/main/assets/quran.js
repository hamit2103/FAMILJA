const QURAN_API = "https://api.alquran.cloud/v1";
const QURAN_UI_LANG_KEY="pajaziti-language";
const QURAN_UI_TXT={
  sq:{open:"Hap Kuranin →",close:"Mbyll",desc:"Lexo Kuranin sipas sures dhe zgjidh gjuhën.",surahs:"114 suret",back:"← Suret",loadingSurahs:"Po ngarkohen suret...",loadingSurah:"Po ngarkohet sureja...",loadError:"Kurani nuk u ngarkua. Kontrollo internetin dhe provo përsëri.",surahError:"Sureja nuk u ngarkua. Kontrollo internetin dhe provo përsëri.",ayahs:"ajete"},
  de:{open:"Koran öffnen →",close:"Schließen",desc:"Lies den Koran nach Sure und wähle die Sprache.",surahs:"114 Suren",back:"← Suren",loadingSurahs:"Suren werden geladen...",loadingSurah:"Sure wird geladen...",loadError:"Der Koran konnte nicht geladen werden. Prüfe die Internetverbindung und versuche es erneut.",surahError:"Die Sure konnte nicht geladen werden. Prüfe die Internetverbindung und versuche es erneut.",ayahs:"Verse"},
  tr:{open:"Kuran'ı aç →",close:"Kapat",desc:"Surelere göre Kuran'ı oku ve dili seç.",surahs:"114 sure",back:"← Sureler",loadingSurahs:"Sureler yükleniyor...",loadingSurah:"Sure yükleniyor...",loadError:"Kuran yüklenemedi. İnternet bağlantını kontrol edip tekrar dene.",surahError:"Sure yüklenemedi. İnternet bağlantını kontrol edip tekrar dene.",ayahs:"ayet"},
  en:{open:"Open Quran →",close:"Close",desc:"Read the Quran by surah and choose the language.",surahs:"114 surahs",back:"← Surahs",loadingSurahs:"Loading surahs...",loadingSurah:"Loading surah...",loadError:"The Quran could not be loaded. Check your internet connection and try again.",surahError:"The surah could not be loaded. Check your internet connection and try again.",ayahs:"verses"},
  it:{open:"Apri Corano →",close:"Chiudi",desc:"Leggi il Corano per sura e scegli la lingua.",surahs:"114 sure",back:"← Sure",loadingSurahs:"Caricamento sure...",loadingSurah:"Caricamento sura...",loadError:"Impossibile caricare il Corano. Controlla Internet e riprova.",surahError:"Impossibile caricare la sura. Controlla Internet e riprova.",ayahs:"versetti"},
  hr:{open:"Otvori Kur'an →",close:"Zatvori",desc:"Čitaj Kur'an po surama i odaberi jezik.",surahs:"114 sura",back:"← Sure",loadingSurahs:"Učitavanje sura...",loadingSurah:"Učitavanje sure...",loadError:"Kur'an se nije mogao učitati. Provjeri internet i pokušaj ponovno.",surahError:"Sura se nije mogla učitati. Provjeri internet i pokušaj ponovno.",ayahs:"ajeta"},
  fr:{open:"Ouvrir le Coran →",close:"Fermer",desc:"Lisez le Coran par sourate et choisissez la langue.",surahs:"114 sourates",back:"← Sourates",loadingSurahs:"Chargement des sourates...",loadingSurah:"Chargement de la sourate...",loadError:"Le Coran n'a pas pu être chargé. Vérifiez Internet et réessayez.",surahError:"La sourate n'a pas pu être chargée. Vérifiez Internet et réessayez.",ayahs:"versets"},
  ar:{open:"افتح القرآن ←",close:"إغلاق",desc:"اقرأ القرآن حسب السورة واختر اللغة.",surahs:"114 سورة",back:"السور →",loadingSurahs:"جارٍ تحميل السور...",loadingSurah:"جارٍ تحميل السورة...",loadError:"تعذر تحميل القرآن. تحقق من اتصال الإنترنت وحاول مرة أخرى.",surahError:"تعذر تحميل السورة. تحقق من اتصال الإنترنت وحاول مرة أخرى.",ayahs:"آيات"}
};
function qUiLang(){const l=localStorage.getItem(QURAN_UI_LANG_KEY)||"sq";return QURAN_UI_TXT[l]?l:"en";}
function qt(k){return QURAN_UI_TXT[qUiLang()]?.[k]??QURAN_UI_TXT.en[k]??k;}

const QURAN_LANG_KEY = "diamond-quran-language";
const QURAN_EDITION_CACHE = "diamond-quran-editions-v1";

const quranState = {
  rendered: false,
  surahs: [],
  selectedSurah: null,
  language: localStorage.getItem(QURAN_LANG_KEY) || "ar",
  editions: {}
};

const quranLanguageNames = {
  ar: "العربية",
  sq: "Shqip",
  tr: "Türkçe",
  de: "Deutsch"
};

function quranRoot() {
  return document.getElementById("quranPanel");
}

function quranMessage(text = "", kind = "") {
  const el = document.getElementById("quranStatus");
  if (!el) return;
  el.textContent = text;
  el.className = "message" + (kind ? " " + kind : "");
}

function quranEscape(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
}

function quranRenderShell() {
  const root = quranRoot();
  if (!root || quranState.rendered) return;
  quranState.rendered = true;

  root.innerHTML = `
    <div class="quran-head">
      <div>
        <h2>📖 Kuran</h2>
        <p class="muted small">${qt("desc")}</p>
      </div>
      <button id="quranCloseBtn" class="secondary" type="button">${qt("close")}</button>
    </div>

    <div class="quran-language-row">
      <button type="button" class="quran-lang-btn" data-quran-lang="ar">🇸🇦 Arabisht</button>
      <button type="button" class="quran-lang-btn" data-quran-lang="sq">🇦🇱 Shqip</button>
      <button type="button" class="quran-lang-btn" data-quran-lang="tr">🇹🇷 Türkçe</button>
      <button type="button" class="quran-lang-btn" data-quran-lang="de">🇩🇪 Deutsch</button>
    </div>

    <div id="quranStatus" class="message"></div>

    <div id="quranLibrary">
      <div class="quran-list-title">${qt("surahs")}</div>
      <div id="quranSurahList" class="quran-surah-list"></div>
    </div>

    <div id="quranReader" class="hidden">
      <div class="quran-reader-head">
        <button id="quranBackBtn" class="secondary" type="button">${qt("back")}</button>
        <div>
          <strong id="quranSurahTitle"></strong>
          <div id="quranSurahMeta" class="muted small"></div>
        </div>
      </div>
      <div id="quranAyahs" class="quran-ayahs"></div>
    </div>
  `;

  document.getElementById("quranCloseBtn")?.addEventListener("click", closeQuran);
  document.getElementById("quranBackBtn")?.addEventListener("click", showQuranLibrary);
  root.querySelectorAll("[data-quran-lang]").forEach(btn => {
    btn.addEventListener("click", async () => {
      quranState.language = btn.dataset.quranLang || "ar";
      localStorage.setItem(QURAN_LANG_KEY, quranState.language);
      updateQuranLanguageButtons();
      if (quranState.selectedSurah) {
        await loadQuranSurah(quranState.selectedSurah);
      }
    });
  });

  updateQuranLanguageButtons();
}

function updateQuranLanguageButtons() {
  const root = quranRoot();
  root?.querySelectorAll("[data-quran-lang]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.quranLang === quranState.language);
  });
}

function openQuran() {
  quranRenderShell();
  quranRoot()?.classList.remove("hidden");
  document.getElementById("quranOpenCard")?.classList.add("quran-open");
  if (!quranState.surahs.length) loadQuranSurahList();
  else renderQuranSurahList();
  quranRoot()?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeQuran() {
  quranRoot()?.classList.add("hidden");
  document.getElementById("quranOpenCard")?.classList.remove("quran-open");
}

function showQuranLibrary() {
  quranState.selectedSurah = null;
  document.getElementById("quranLibrary")?.classList.remove("hidden");
  document.getElementById("quranReader")?.classList.add("hidden");
  quranMessage("");
}

async function loadQuranSurahList() {
  quranMessage(qt("loadingSurahs"));
  try {
    const response = await fetch(QURAN_API + "/surah", { cache: "no-store" });
    const json = await response.json();
    if (!response.ok || json?.code !== 200 || !Array.isArray(json?.data)) {
      throw new Error("Lista e sureve nuk u kthye si duhet.");
    }
    quranState.surahs = json.data;
    renderQuranSurahList();
    quranMessage("");
  } catch (error) {
    console.error("Quran surah list failed", error);
    quranMessage(qt("loadError"), "error");
  }
}

function renderQuranSurahList() {
  const list = document.getElementById("quranSurahList");
  if (!list) return;
  list.innerHTML = quranState.surahs.map(surah => `
    <button class="quran-surah-row" type="button" data-quran-surah="${surah.number}">
      <span class="quran-surah-number">${surah.number}</span>
      <span class="quran-surah-main">
        <strong>${quranEscape(surah.englishName || "")}</strong>
        <small>${quranEscape(surah.englishNameTranslation || "")} · ${surah.numberOfAyahs} ajete</small>
      </span>
      <span class="quran-surah-ar">${quranEscape(surah.name || "")}</span>
    </button>
  `).join("");

  list.querySelectorAll("[data-quran-surah]").forEach(btn => {
    btn.addEventListener("click", () => loadQuranSurah(Number(btn.dataset.quranSurah)));
  });
}

async function discoverQuranEdition(language) {
  if (language === "ar") return "quran-uthmani";
  if (quranState.editions[language]) return quranState.editions[language];

  try {
    const cached = JSON.parse(localStorage.getItem(QURAN_EDITION_CACHE) || "{}");
    if (cached?.[language]) {
      quranState.editions[language] = cached[language];
      return cached[language];
    }
  } catch (_) {}

  const response = await fetch(QURAN_API + "/edition/language/" + encodeURIComponent(language), { cache: "no-store" });
  const json = await response.json();
  const editions = Array.isArray(json?.data) ? json.data : [];
  const preferred = editions.find(e => e.type === "translation" && e.format === "text")
    || editions.find(e => e.type === "translation")
    || editions.find(e => e.format === "text")
    || editions[0];

  if (!preferred?.identifier) throw new Error("Nuk u gjet përkthimi për " + language);

  quranState.editions[language] = preferred.identifier;
  try {
    const cached = JSON.parse(localStorage.getItem(QURAN_EDITION_CACHE) || "{}");
    cached[language] = preferred.identifier;
    localStorage.setItem(QURAN_EDITION_CACHE, JSON.stringify(cached));
  } catch (_) {}
  return preferred.identifier;
}

async function fetchQuranSurah(number, edition) {
  const response = await fetch(QURAN_API + "/surah/" + number + "/" + edition, { cache: "no-store" });
  const json = await response.json();
  if (!response.ok || json?.code !== 200 || !json?.data?.ayahs) {
    throw new Error("Sureja nuk u ngarkua.");
  }
  return json.data;
}

async function loadQuranSurah(number) {
  quranState.selectedSurah = number;
  document.getElementById("quranLibrary")?.classList.add("hidden");
  document.getElementById("quranReader")?.classList.remove("hidden");
  const ayahsEl = document.getElementById("quranAyahs");
  if (ayahsEl) ayahsEl.innerHTML = "";
  quranMessage(qt("loadingSurah"));

  try {
    const arabicPromise = fetchQuranSurah(number, "quran-uthmani");
    const selectedLanguage = quranState.language;
    const edition = await discoverQuranEdition(selectedLanguage);
    const selectedPromise = selectedLanguage === "ar"
      ? arabicPromise
      : fetchQuranSurah(number, edition);

    const [arabic, selected] = await Promise.all([arabicPromise, selectedPromise]);

    const title = document.getElementById("quranSurahTitle");
    const meta = document.getElementById("quranSurahMeta");
    if (title) title.textContent = (arabic.number + ". " + (arabic.englishName || "") + " — " + (arabic.name || ""));
    if (meta) meta.textContent = (arabic.numberOfAyahs || arabic.ayahs.length) + " " + qt("ayahs") + " · " + quranLanguageNames[selectedLanguage];

    if (ayahsEl) {
      ayahsEl.innerHTML = arabic.ayahs.map((ayah, index) => {
        const translated = selectedLanguage === "ar" ? "" : (selected.ayahs?.[index]?.text || "");
        return `
          <article class="quran-ayah-card">
            <div class="quran-ayah-number">${ayah.numberInSurah}</div>
            <div class="quran-arabic" dir="rtl" lang="ar">${quranEscape(ayah.text || "")}</div>
            ${translated ? `<div class="quran-translation" lang="${selectedLanguage}">${quranEscape(translated)}</div>` : ""}
          </article>
        `;
      }).join("");
    }

    quranMessage("");
    document.getElementById("quranReader")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Quran surah failed", error);
    quranMessage(qt("surahError"), "error");
  }
}

document.getElementById("quranOpenCard")?.addEventListener("click", openQuran);

window.DiamondQuran = { open: openQuran, close: closeQuran };


function reloadQuranLanguage(){
  const wasOpen = !quranRoot()?.classList.contains("hidden");
  quranState.rendered = false;
  const root=quranRoot();
  if(root) root.innerHTML="";
  quranRenderShell();
  if(wasOpen) root?.classList.remove("hidden");
  const card=document.getElementById("quranOpenCard");
  if(card){
    const strong=card.querySelector("strong");
    if(strong) strong.textContent=qt("open");
  }
  if(quranState.surahs.length) renderQuranSurahList();
}
window.DiamondQuran = { open: openQuran, close: closeQuran, reloadLanguage: reloadQuranLanguage };

function backQuran(){
  const reader=document.getElementById("quranReader");
  if(reader && !reader.classList.contains("hidden")){
    showQuranLibrary();
    return true;
  }
  const root=quranRoot();
  if(root && !root.classList.contains("hidden")){
    closeQuran();
    return true;
  }
  return false;
}
if(window.DiamondQuran){
  window.DiamondQuran.back=backQuran;
}
