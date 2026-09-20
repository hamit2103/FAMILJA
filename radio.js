import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const ADMIN_EMAIL = "admin@familja.local";
const TABLE = "radio_shared_station";
const ZERI_SHTIMES_PROXY = `${SUPABASE_URL}/functions/v1/zeri-shtimes-radio`;
const RADIO_PROXY_URL = `${SUPABASE_URL}/functions/v1/radio-proxy`;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

const root = document.getElementById("radioRoot");
let rendered = false;
let channel = null;
let currentUser = null;
let currentStation = null;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function isAdmin() {
  return currentUser?.email === ADMIN_EMAIL;
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
            <p>Dëgjo radion që vendos administratori.</p>
          </div>
        </div>
      </section>

      <section class="card radio-player-card">
        <div class="radio-live-badge">
          <span class="radio-live-dot"></span>
          <span id="radioLiveText">Radio</span>
        </div>
        <h2 id="radioStationTitle">Ende nuk ka radio</h2>
        <audio id="radioPlayer" class="radio-player" controls preload="none" playsinline></audio>
        <div id="radioStatus" class="message">Administratori duhet të vendosë një link radio.</div>
      </section>

      <section id="radioAdminCard" class="card radio-admin-card hidden">
        <h2>⚙️ Vendos radion</h2>
        <p class="muted radio-admin-note">Kjo pjesë shihet vetëm nga administratori. Linku që ruan këtu do t’u dalë të gjithëve.</p>

        <label for="radioNameInput">Emri i radios</label>
        <input id="radioNameInput" type="text" maxlength="80" placeholder="p.sh. Radio Kosova">

        <label for="radioUrlInput">Linku i radios</label>
        <input id="radioUrlInput" type="url" inputmode="url" placeholder="https://...">

        <button id="radioSaveBtn" class="primary" type="button">Ruaj radion</button>
        <div id="radioAdminStatus" class="message"></div>
      </section>
    </div>
  `;

  document.getElementById("radioSaveBtn")?.addEventListener("click", saveStation);

  const player = document.getElementById("radioPlayer");
  player?.addEventListener("playing", () => {
    showStatus("Radioja po luan.", "success");
  });
  player?.addEventListener("error", () => {
    showStatus("Radioja nuk po lidhet për momentin. Provo përsëri pas pak.", "error");
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

async function resolvePlaylistUrl(url) {
  if (!/\.(m3u|pls)(?:$|\?)/i.test(url)) return url;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return url;
    const text = await res.text();

    if (/\.pls(?:$|\?)/i.test(url)) {
      const match = text.match(/^File\d+=(https?:\/\/\S+)/im);
      return match?.[1]?.trim() || url;
    }

    const line = text
      .split(/\r?\n/)
      .map((v) => v.trim())
      .find((v) => v && !v.startsWith("#") && /^https?:\/\//i.test(v));
    return line || url;
  } catch (_) {
    return url;
  }
}

async function applyStation(station) {
  currentStation = station || null;

  const titleEl = document.getElementById("radioStationTitle");
  const liveText = document.getElementById("radioLiveText");
  const player = document.getElementById("radioPlayer");
  const nameInput = document.getElementById("radioNameInput");
  const urlInput = document.getElementById("radioUrlInput");

  if (!station?.stream_url) {
    if (titleEl) titleEl.textContent = "Ende nuk ka radio";
    if (liveText) liveText.textContent = "Radio";
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    if (nameInput) nameInput.value = "";
    if (urlInput) urlInput.value = "";
    showStatus("Administratori duhet të vendosë një link radio.");
    return;
  }

  const title = station.title?.trim() || "Radio";
  if (titleEl) titleEl.textContent = title;
  if (liveText) liveText.textContent = title;
  if (nameInput) nameInput.value = title;
  if (urlInput) urlInput.value = station.stream_url;

  const resolved = await resolvePlaylistUrl(station.stream_url);
  const playable = /^http:\/\//i.test(resolved) ? RADIO_PROXY_URL : resolved;
  if (player && player.src !== playable) {
    player.pause();
    player.src = playable;
    player.load();
  }

  showStatus("Preke Play për ta dëgjuar radion.", "success");
}

async function loadStation() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,title,stream_url,updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Radio load failed", error);
    showStatus("Radioja nuk u ngarkua. Provo përsëri.", "error");
    return;
  }

  await applyStation(data);
}

async function saveStation() {
  if (!isAdmin()) {
    showAdminStatus("Vetëm administratori mund ta ndryshojë radion.", "error");
    return;
  }

  const title = document.getElementById("radioNameInput")?.value.trim() || "Radio";
  const streamUrl = document.getElementById("radioUrlInput")?.value.trim() || "";

  if (!/^https?:\/\//i.test(streamUrl)) {
    showAdminStatus("Vendos një link që fillon me http:// ose https://", "error");
    return;
  }

  showAdminStatus("Po ruhet...");

  const { error } = await supabase.from(TABLE).upsert({
    id: 1,
    title,
    stream_url: streamUrl,
    updated_at: new Date().toISOString(),
    updated_by: currentUser.id
  }, { onConflict: "id" });

  if (error) {
    console.error("Radio save failed", error);
    showAdminStatus("Nuk u ruajt: " + error.message, "error");
    return;
  }

  showAdminStatus("Radioja u ruajt dhe tani u del të gjithëve.", "success");
  await loadStation();
}

function startRealtime() {
  if (channel) return;

  channel = supabase
    .channel("shared-radio-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE },
      () => loadStation()
    )
    .subscribe();
}

async function activate() {
  render();

  const { data } = await supabase.auth.getSession();
  currentUser = data.session?.user || null;

  const adminCard = document.getElementById("radioAdminCard");
  adminCard?.classList.toggle("hidden", !isAdmin());

  await loadStation();
  startRealtime();
}

window.PajazitiRadio = { activate };
