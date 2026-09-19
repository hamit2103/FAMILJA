import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const FAMILY_EMAIL = "familja@familja.local";
const ADMIN_EMAIL = "admin@familja.local";
const BUCKET = "familja-media";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

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
const logoutBtn = $("logoutBtn");
const refreshBtn = $("refreshBtn");
const installBtn = $("installBtn");
const installLoginBtn = $("installLoginBtn");
const shareBtn = $("shareBtn");
const galleryTab = $("galleryTab");
const infoTab = $("infoTab");
const galleryView = $("galleryView");
const infoView = $("infoView");
const infoName = $("infoName");
const infoText = $("infoText");
const infoSendBtn = $("infoSendBtn");
const infoStatus = $("infoStatus");
const infoRefreshBtn = $("infoRefreshBtn");
const infoList = $("infoList");
const infoEmpty = $("infoEmpty");
const infoCount = $("infoCount");

let mode = "family";
let realtimeChannel = null;
let installPrompt = null;
let currentUser = null;

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
  const showInfo = next === "info";
  galleryTab.classList.toggle("active", !showInfo);
  infoTab.classList.toggle("active", showInfo);
  galleryView.classList.toggle("hidden", showInfo);
  infoView.classList.toggle("hidden", !showInfo);
  if (showInfo) loadInfo();
}
galleryTab.addEventListener("click", () => setSection("gallery"));
infoTab.addEventListener("click", () => setSection("info"));

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

  mediaCount.textContent = String(data.length);
  emptyState.classList.toggle("hidden", data.length > 0);

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

      if (isAdmin()) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "danger";
        del.textContent = "Fshi";
        del.addEventListener("click", async () => {
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
          }
        });
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

uploadBtn.addEventListener("click", async () => {
  if (!supabase || !isAdmin()) return;

  const files = Array.from(mediaInput.files);
  if (!files.length) {
    return showMessage(
      uploadStatus,
      "Zgjidh së paku një foto ose video.",
      "error"
    );
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return showMessage(
        uploadStatus,
        file.name + " është mbi 50 MB. Plani falas lejon maksimum 50 MB për skedar.",
        "error"
      );
    }
  }

  uploadBtn.disabled = true;
  let done = 0;

  try {
    for (const file of files) {
      showMessage(
        uploadStatus,
        "Po ngarkoj " + (done + 1) + "/" + files.length + ": " + file.name
      );

      const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const path =
        currentUser.id +
        "/" +
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
        name: file.name,
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
    showMessage(uploadStatus, "U ngarkuan " + done + " materiale.", "success");
    await loadMedia();
  } catch (e) {
    console.error(e);
    showMessage(
      uploadStatus,
      "Ngarkimi dështoi: " + (e?.message || e),
      "error"
    );
  } finally {
    uploadBtn.disabled = false;
  }
});

function startRealtime() {
  if (!supabase) return;
  if (realtimeChannel) supabase.removeChannel(realtimeChannel);

  realtimeChannel = supabase
    .channel("familja-live")
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
    .subscribe();
}

async function applySession(session) {
  currentUser = session?.user || null;
  const signedIn = !!currentUser;

  loginView.classList.toggle("hidden", signedIn);
  appView.classList.toggle("hidden", !signedIn);

  if (!signedIn) {
    gallery.innerHTML = "";
    mediaCount.textContent = "0";
    if (realtimeChannel && supabase) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
    return;
  }

  adminPanel.classList.toggle("hidden", !isAdmin());
  roleLabel.textContent = isAdmin() ? "Administrator" : "Anëtar i familjes";
  await loadMedia();
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
