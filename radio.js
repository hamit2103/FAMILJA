import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const ADMIN_EMAIL = "admin@familja.local";
const APP_MODE = document.querySelector('meta[name="diamond-mode"]')?.content === "admin" ? "admin" : "public";
const ADMIN_ONLY = APP_MODE === "admin";
const TABLE = "radio_stations";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: ADMIN_ONLY ? "diamond-admin-auth" : "diamond-family-auth" }
});

const root = document.getElementById("radioRoot");
const LANG_KEY="pajaziti-language";
const RADIO_TXT={
  sq:{choose:"Zgjidh radion që dëshiron ta dëgjosh.",pick:"Zgjidh radion",pickList:"Zgjidh një radio nga lista",tap:"Preke një radio më poshtë.",radios:"Radiot",folders:"Zgjidh një folder për radiot shqiptare ose turke.",back:"← Folderat",add:"Shto radio",admin:"Vetëm administratori mund të shtojë ose fshijë radio. Për web, linku HTTPS është më i sigurt.",name:"Emri i radios",url:"Linku i radios",folder:"Folderi",save:"Shto radion",playing:"Radioja po luan.",connecting:"Po lidhet me radion...",failed:"Kjo radio nuk po lidhet për momentin. Provo një radio tjetër.",delete:"Fshi",empty:"Ende nuk ka radio në këtë folder."},
  de:{choose:"Wähle den Radiosender, den du hören möchtest.",pick:"Radio wählen",pickList:"Wähle einen Sender aus der Liste",tap:"Tippe unten auf einen Sender.",radios:"Radios",folders:"Wähle einen Ordner für albanische oder türkische Radiosender.",back:"← Ordner",add:"Radio hinzufügen",admin:"Nur der Administrator kann Radiosender hinzufügen oder löschen. Für das Web ist ein HTTPS-Link sicherer.",name:"Name des Radios",url:"Radio-Link",folder:"Ordner",save:"Radio hinzufügen",playing:"Radio läuft.",connecting:"Verbindung zum Radio…",failed:"Dieses Radio ist momentan nicht erreichbar. Probiere ein anderes.",delete:"Löschen",empty:"Noch keine Radios in diesem Ordner."},
  tr:{choose:"Dinlemek istediğin radyoyu seç.",pick:"Radyo seç",pickList:"Listeden bir radyo seç",tap:"Aşağıdan bir radyoya dokun.",radios:"Radyolar",folders:"Arnavutça veya Türkçe radyolar için bir klasör seç.",back:"← Klasörler",add:"Radyo ekle",admin:"Yalnızca yönetici radyo ekleyebilir veya silebilir. Web için HTTPS bağlantısı daha güvenlidir.",name:"Radyo adı",url:"Radyo bağlantısı",folder:"Klasör",save:"Radyoyu ekle",playing:"Radyo çalıyor.",connecting:"Radyoya bağlanıyor...",failed:"Bu radyoya şu anda bağlanılamıyor. Başka bir radyo dene.",delete:"Sil",empty:"Bu klasörde henüz radyo yok."},
  en:{choose:"Choose the radio you want to listen to.",pick:"Choose radio",pickList:"Choose a radio from the list",tap:"Tap a radio below.",radios:"Radios",folders:"Choose a folder for Albanian or Turkish radio stations.",back:"← Folders",add:"Add radio",admin:"Only the administrator can add or delete radio stations. HTTPS links are safer for web playback.",name:"Radio name",url:"Radio link",folder:"Folder",save:"Add radio",playing:"Radio is playing.",connecting:"Connecting to radio...",failed:"This radio is not connecting right now. Try another station.",delete:"Delete",empty:"No radio stations in this folder yet."},
  it:{choose:"Scegli la radio che vuoi ascoltare.",pick:"Scegli radio",pickList:"Scegli una radio dalla lista",tap:"Tocca una radio qui sotto.",radios:"Radio",folders:"Scegli una cartella per le radio albanesi o turche.",back:"← Cartelle",add:"Aggiungi radio",admin:"Solo l'amministratore può aggiungere o eliminare radio. Un link HTTPS è più sicuro sul web.",name:"Nome radio",url:"Link radio",folder:"Cartella",save:"Aggiungi radio",playing:"La radio è in riproduzione.",connecting:"Connessione alla radio...",failed:"Questa radio non è raggiungibile al momento. Provane un'altra.",delete:"Elimina",empty:"Nessuna radio in questa cartella."},
  hr:{choose:"Odaberi radio koji želiš slušati.",pick:"Odaberi radio",pickList:"Odaberi radio s popisa",tap:"Dodirni radio ispod.",radios:"Radio",folders:"Odaberi mapu za albanske ili turske radio postaje.",back:"← Mape",add:"Dodaj radio",admin:"Samo administrator može dodavati ili brisati radio postaje. HTTPS poveznica je sigurnija za web.",name:"Naziv radija",url:"Poveznica radija",folder:"Mapa",save:"Dodaj radio",playing:"Radio svira.",connecting:"Povezivanje s radiom...",failed:"Ovaj radio trenutačno nije dostupan. Pokušaj drugi.",delete:"Izbriši",empty:"U ovoj mapi još nema radija."},
  ar:{choose:"اختر الراديو الذي تريد الاستماع إليه.",pick:"اختر الراديو",pickList:"اختر محطة من القائمة",tap:"اضغط على محطة في الأسفل.",radios:"الراديو",folders:"اختر مجلدًا لمحطات الراديو الألبانية أو التركية.",back:"← المجلدات",add:"إضافة راديو",admin:"يمكن للمشرف فقط إضافة أو حذف محطات الراديو. رابط HTTPS أكثر أمانًا على الويب.",name:"اسم الراديو",url:"رابط الراديو",folder:"المجلد",save:"إضافة الراديو",playing:"الراديو يعمل.",connecting:"جارٍ الاتصال بالراديو...",failed:"تعذر الاتصال بهذه المحطة حاليًا. جرّب محطة أخرى.",delete:"حذف",empty:"لا توجد محطات في هذا المجلد بعد."},
  fr:{choose:"Choisissez la radio que vous souhaitez écouter.",pick:"Choisir une radio",pickList:"Choisissez une radio dans la liste",tap:"Touchez une radio ci-dessous.",radios:"Radios",folders:"Choisissez un dossier pour les radios albanaises ou turques.",back:"← Dossiers",add:"Ajouter une radio",admin:"Seul l'administrateur peut ajouter ou supprimer des radios. Un lien HTTPS est plus sûr sur le web.",name:"Nom de la radio",url:"Lien de la radio",folder:"Dossier",save:"Ajouter la radio",playing:"La radio est en lecture.",connecting:"Connexion à la radio...",failed:"Cette radio ne répond pas pour le moment. Essayez-en une autre.",delete:"Supprimer",empty:"Aucune radio dans ce dossier pour le moment."}
};
function radioLang(){const l=localStorage.getItem(LANG_KEY)||"sq";return RADIO_TXT[l]?l:"sq";}
function rt(k){return RADIO_TXT[radioLang()]?.[k]||RADIO_TXT.en[k]||k;}
let rendered = false;
let channel = null;
let currentUser = null;
let stations = [];
let currentStationId = null;
let activeFolder = null;

function isAdmin() {
  return currentUser?.email === ADMIN_EMAIL;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function render() {
  if (!root || rendered) return;
  rendered = true;

  root.innerHTML = `
    <div class="radio-shell">
      <section class="radio-hero">
        <div class="radio-title-row">
          <div class="radio-icon">📻</div>
          <div>
            <h2>Radio</h2>
            <p>${rt("choose")}</p>
          </div>
        </div>
      </section>

      <section class="card radio-player-card">
        <div class="radio-live-badge">
          <span class="radio-live-dot"></span>
          <span id="radioLiveText">${rt("pick")}</span>
        </div>
        <h2 id="radioStationTitle">${rt("pickList")}</h2>
        <audio id="radioPlayer" class="radio-player" controls preload="none" playsinline></audio>
        <div id="radioStatus" class="message">${rt("tap")}</div>
      </section>

      <section class="card radio-list-card">
        <h2>📻 ${rt("radios")}</h2>
        <p class="muted small">${rt("folders")}</p>

        <div id="radioFolderGrid" class="radio-folder-grid">
          <button class="radio-folder-card" type="button" data-radio-folder="sq">
            <span class="radio-folder-flag">🇦🇱</span>
            <strong>Shqip</strong>
            <small id="radioFolderSqCount">0 radio</small>
          </button>
          <button class="radio-folder-card" type="button" data-radio-folder="tr">
            <span class="radio-folder-flag">🇹🇷</span>
            <strong>Turqisht</strong>
            <small id="radioFolderTrCount">0 radio</small>
          </button>
        </div>

        <div id="radioFolderView" class="hidden">
          <div class="radio-folder-head">
            <button id="radioFolderBack" class="secondary" type="button">${rt("back")}</button>
            <strong id="radioFolderTitle"></strong>
          </div>
          <div id="radioStationList" class="radio-station-list"></div>
        </div>
      </section>

      <section id="radioAdminCard" class="card radio-admin-card hidden">
        <h2>⚙️ ${rt("add")}</h2>
        <p class="muted radio-admin-note">${rt("admin")}</p>

        <label for="radioNameInput">${rt("name")}</label>
        <input id="radioNameInput" type="text" maxlength="80" placeholder="p.sh. Radio Ferizaj">

        <label for="radioUrlInput">${rt("url")}</label>
        <input id="radioUrlInput" type="url" inputmode="url" placeholder="https://...">

        <label for="radioLanguageInput">${rt("folder")}</label>
        <select id="radioLanguageInput" class="radio-folder-select">
          <option value="sq">🇦🇱 Shqip</option>
          <option value="tr">🇹🇷 Turqisht</option>
        </select>

        <button id="radioSaveBtn" class="primary" type="button">${rt("save")}</button>
        <div id="radioAdminStatus" class="message"></div>
      </section>
    </div>
  `;

  document.getElementById("radioSaveBtn")?.addEventListener("click", addStation);
  document.querySelectorAll("[data-radio-folder]").forEach((button) => {
    button.addEventListener("click", () => openFolder(button.dataset.radioFolder));
  });
  document.getElementById("radioFolderBack")?.addEventListener("click", closeFolder);

  const player = document.getElementById("radioPlayer");
  player?.addEventListener("playing", () => {
    showStatus(rt("playing"), "success");
  });
  player?.addEventListener("waiting", () => {
    showStatus(rt("connecting"));
  });
  player?.addEventListener("error", () => {
    showStatus(rt("failed"), "error");
  });
}

function showStatus(text, kind = "") {
  const el = document.getElementById("radioStatus");
  if (!el) return;
  el.className = "message" + (kind ? " " + kind : "");
  el.textContent = text || "";
}

function showAdminStatus(text, kind = "") {
  const el = document.getElementById("radioAdminStatus");
  if (!el) return;
  el.className = "message" + (kind ? " " + kind : "");
  el.textContent = text || "";
}

async function selectStation(station) {
  if (!station?.stream_url) return;

  currentStationId = station.id;

  const title = station.title?.trim() || "Radio";
  const titleEl = document.getElementById("radioStationTitle");
  const liveText = document.getElementById("radioLiveText");
  const player = document.getElementById("radioPlayer");

  if (titleEl) titleEl.textContent = title;
  if (liveText) liveText.textContent = title;

  if (player) {
    try {
      player.pause();
      player.src = station.stream_url;
      player.load();
      showStatus(rt("connecting"));
      await player.play();
      showStatus(rt("playing"), "success");
    } catch (error) {
      console.error("Radio play failed", error);
      showStatus("Radioja nuk u nis automatikisht. Provo përsëri.", "error");
    }
  }

  renderStationList();
}

async function deleteStation(id) {
  if (!isAdmin()) return;
  if (!confirm("Ta fshij këtë radio?")) return;

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    showAdminStatus("Nuk u fshi: " + error.message, "error");
    return;
  }

  if (currentStationId === id) {
    currentStationId = null;
    const player = document.getElementById("radioPlayer");
    player?.pause();
    player?.removeAttribute("src");
    player?.load();
  }

  await loadStations();
}

function updateFolderCounts() {
  const sq = stations.filter((station) => station.language_group === "sq").length;
  const tr = stations.filter((station) => station.language_group === "tr").length;
  const sqEl = document.getElementById("radioFolderSqCount");
  const trEl = document.getElementById("radioFolderTrCount");
  if (sqEl) sqEl.textContent = sq + " radio";
  if (trEl) trEl.textContent = tr + " radio";
}

function openFolder(folder) {
  activeFolder = folder === "tr" ? "tr" : "sq";
  document.getElementById("radioFolderGrid")?.classList.add("hidden");
  document.getElementById("radioFolderView")?.classList.remove("hidden");
  const title = document.getElementById("radioFolderTitle");
  if (title) title.textContent = activeFolder === "tr" ? "🇹🇷 Radio Turqisht" : "🇦🇱 Radio Shqip";
  renderStationList();
}

function closeFolder() {
  activeFolder = null;
  document.getElementById("radioFolderView")?.classList.add("hidden");
  document.getElementById("radioFolderGrid")?.classList.remove("hidden");
}

function renderStationList() {
  const list = document.getElementById("radioStationList");
  updateFolderCounts();
  if (!list || !activeFolder) return;

  const visibleStations = stations.filter((station) => station.language_group === activeFolder);

  if (!visibleStations.length) {
    list.innerHTML = '<div class="muted">'+rt("empty")+'</div>';
    return;
  }

  list.innerHTML = visibleStations.map((station) => {
    const active = station.id === currentStationId ? " active" : "";
    const deleteButton = isAdmin()
      ? `<button class="radio-delete-btn" type="button" data-delete-radio="${station.id}">${rt("delete")}</button>`
      : "";

    return `
      <div class="radio-station-row${active}">
        <button class="radio-station-play" type="button" data-radio-id="${station.id}">
          <span class="radio-station-icon">📻</span>
          <span class="radio-station-name">${escapeHtml(station.title)}</span>
          <span class="radio-station-action">▶</span>
        </button>
        ${deleteButton}
      </div>
    `;
  }).join("");

  list.querySelectorAll("[data-radio-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.radioId);
      const station = stations.find((item) => item.id === id);
      if (station) selectStation(station);
    });
  });

  list.querySelectorAll("[data-delete-radio]").forEach((button) => {
    button.addEventListener("click", () => deleteStation(Number(button.dataset.deleteRadio)));
  });
}

async function loadStations() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,title,stream_url,language_group,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Radio list failed", error);
    showStatus("Lista e radiove nuk u ngarkua.", "error");
    return;
  }

  stations = data || [];
  updateFolderCounts();
  if (activeFolder) renderStationList();

  if (currentStationId) {
    const current = stations.find((item) => item.id === currentStationId);
    if (!current && stations.length) selectStation(stations[0]);
  }
}

async function addStation() {
  if (!isAdmin()) {
    showAdminStatus("Vetëm administratori mund të shtojë radio.", "error");
    return;
  }

  const title = document.getElementById("radioNameInput")?.value.trim() || "";
  const streamUrl = document.getElementById("radioUrlInput")?.value.trim() || "";
  const languageGroup = document.getElementById("radioLanguageInput")?.value === "tr" ? "tr" : "sq";

  if (!title) {
    showAdminStatus("Shkruaj emrin e radios.", "error");
    return;
  }

  if (!/^https?:\/\//i.test(streamUrl)) {
    showAdminStatus("Vendos një link që fillon me http:// ose https://", "error");
    return;
  }

  showAdminStatus("Po shtohet...");

  const { error } = await supabase.from(TABLE).insert({
    title,
    stream_url: streamUrl,
    language_group: languageGroup,
    created_by: currentUser.id,
    updated_at: new Date().toISOString()
  });

  if (error) {
    console.error("Radio add failed", error);
    showAdminStatus("Nuk u shtua: " + error.message, "error");
    return;
  }

  document.getElementById("radioNameInput").value = "";
  document.getElementById("radioUrlInput").value = "";
  activeFolder = languageGroup;
  openFolder(languageGroup);
  showAdminStatus("Radioja u shtua dhe u del të gjithëve.", "success");
  await loadStations();
}

function startRealtime() {
  if (channel) return;

  channel = supabase
    .channel("radio-stations-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE },
      () => loadStations()
    )
    .subscribe();
}

function reloadLanguage(){
  rendered=false;
  if(root) root.innerHTML="";
  render();
  updateFolderCounts();
  if(activeFolder) openFolder(activeFolder);
}

async function activate() {
  render();

  const { data } = await supabase.auth.getSession();
  currentUser = data.session?.user || null;

  document.getElementById("radioAdminCard")?.classList.toggle("hidden", !isAdmin());

  await loadStations();
  startRealtime();
}

window.PajazitiRadio={ activate ,reloadLanguage};
