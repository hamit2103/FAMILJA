import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const ADMIN_EMAIL = "admin@familja.local";
const TABLE = "radio_stations";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

const root = document.getElementById("radioRoot");
let rendered = false;
let channel = null;
let currentUser = null;
let stations = [];
let currentStationId = null;

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
            <p>Zgjidh radion që dëshiron ta dëgjosh.</p>
          </div>
        </div>
      </section>

      <section class="card radio-player-card">
        <div class="radio-live-badge">
          <span class="radio-live-dot"></span>
          <span id="radioLiveText">Zgjidh radion</span>
        </div>
        <h2 id="radioStationTitle">Zgjidh një radio nga lista</h2>
        <audio id="radioPlayer" class="radio-player" controls preload="none" playsinline></audio>
        <div id="radioStatus" class="message">Preke një radio më poshtë.</div>
      </section>

      <section class="card radio-list-card">
        <h2>📻 Radiot</h2>
        <p class="muted small">Secili mund të zgjedhë cilën radio dëshiron të dëgjojë.</p>
        <div id="radioStationList" class="radio-station-list"></div>
      </section>

      <section id="radioAdminCard" class="card radio-admin-card hidden">
        <h2>⚙️ Shto radio</h2>
        <p class="muted radio-admin-note">Vetëm administratori mund të shtojë ose fshijë radio. Për web, linku HTTPS është më i sigurt.</p>

        <label for="radioNameInput">Emri i radios</label>
        <input id="radioNameInput" type="text" maxlength="80" placeholder="p.sh. Radio Ferizaj">

        <label for="radioUrlInput">Linku i radios</label>
        <input id="radioUrlInput" type="url" inputmode="url" placeholder="https://...">

        <button id="radioSaveBtn" class="primary" type="button">Shto radion</button>
        <div id="radioAdminStatus" class="message"></div>
      </section>
    </div>
  `;

  document.getElementById("radioSaveBtn")?.addEventListener("click", addStation);

  const player = document.getElementById("radioPlayer");
  player?.addEventListener("playing", () => {
    showStatus("Radioja po luan.", "success");
  });
  player?.addEventListener("waiting", () => {
    showStatus("Po lidhet me radion...");
  });
  player?.addEventListener("error", () => {
    showStatus("Kjo radio nuk po lidhet për momentin. Provo një radio tjetër.", "error");
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

function selectStation(station) {
  if (!station?.stream_url) return;

  currentStationId = station.id;

  const title = station.title?.trim() || "Radio";
  const titleEl = document.getElementById("radioStationTitle");
  const liveText = document.getElementById("radioLiveText");
  const player = document.getElementById("radioPlayer");

  if (titleEl) titleEl.textContent = title;
  if (liveText) liveText.textContent = title;

  if (player) {
    player.pause();
    player.src = station.stream_url;
    player.load();
  }

  showStatus("Preke Play për ta dëgjuar radion.", "success");
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

function renderStationList() {
  const list = document.getElementById("radioStationList");
  if (!list) return;

  if (!stations.length) {
    list.innerHTML = '<div class="muted">Ende nuk ka radio.</div>';
    return;
  }

  list.innerHTML = stations.map((station) => {
    const active = station.id === currentStationId ? " active" : "";
    const deleteButton = isAdmin()
      ? `<button class="radio-delete-btn" type="button" data-delete-radio="${station.id}">Fshi</button>`
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
    .select("id,title,stream_url,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Radio list failed", error);
    showStatus("Lista e radiove nuk u ngarkua.", "error");
    return;
  }

  stations = data || [];
  renderStationList();

  if (!currentStationId && stations.length) {
    selectStation(stations[0]);
  } else if (currentStationId) {
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

async function activate() {
  render();

  const { data } = await supabase.auth.getSession();
  currentUser = data.session?.user || null;

  document.getElementById("radioAdminCard")?.classList.toggle("hidden", !isAdmin());

  await loadStations();
  startRealtime();
}

window.PajazitiRadio = { activate };
