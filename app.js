import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSSYWLztQOxUs52ojGyS6c1ys559pBrlU",
  authDomain: "familja-9e838.firebaseapp.com",
  projectId: "familja-9e838",
  storageBucket: "familja-9e838.firebasestorage.app",
  messagingSenderId: "113229526674"
};

const FAMILY_EMAIL = "familja@familja.local";
const ADMIN_EMAIL = "admin@familja.local";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
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

let mode = "family";
let unsubscribeMedia = null;
let installPrompt = null;

function setMode(next) {
  mode = next;
  familyMode.classList.toggle("active", next === "family");
  adminMode.classList.toggle("active", next === "admin");
  codeInput.value = "";
  codeInput.placeholder = next === "admin" ? "Kodi i administratorit" : "Kodi i familjes";
  loginMessage.textContent = "";
}
familyMode.addEventListener("click", () => setMode("family"));
adminMode.addEventListener("click", () => setMode("admin"));

function showMessage(el, text, kind) {
  el.textContent = text;
  el.className = "message" + (kind ? " " + kind : "");
}

loginBtn.addEventListener("click", async () => {
  const code = codeInput.value.trim();
  if (!code) return showMessage(loginMessage, "Shkruaj kodin.", "error");
  loginBtn.disabled = true;
  showMessage(loginMessage, "Po kontrolloj kodin…");
  try {
    const email = mode === "admin" ? ADMIN_EMAIL : FAMILY_EMAIL;
    await signInWithEmailAndPassword(auth, email, code);
    showMessage(loginMessage, "");
  } catch (e) {
    console.error(e);
    showMessage(loginMessage, "Kodi nuk është i saktë ose Firebase Authentication nuk është aktivizuar ende.", "error");
  } finally {
    loginBtn.disabled = false;
  }
});

codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginBtn.click();
});

logoutBtn.addEventListener("click", () => signOut(auth));
refreshBtn.addEventListener("click", () => startMediaListener());

async function startMediaListener() {
  if (unsubscribeMedia) unsubscribeMedia();
  gallery.innerHTML = "";
  try {
    const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
    unsubscribeMedia = onSnapshot(q, async (snap) => {
      gallery.innerHTML = "";
      mediaCount.textContent = String(snap.size);
      emptyState.classList.toggle("hidden", snap.size > 0);
      for (const d of snap.docs) {
        const item = d.data();
        const card = document.createElement("article");
        card.className = "media-card";
        try {
          const url = await getDownloadURL(ref(storage, item.storagePath));
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

          if (auth.currentUser && auth.currentUser.email === ADMIN_EMAIL) {
            const del = document.createElement("button");
            del.type = "button";
            del.className = "danger";
            del.textContent = "Fshi";
            del.addEventListener("click", async () => {
              if (!confirm("Ta fshij këtë material?")) return;
              try {
                await deleteObject(ref(storage, item.storagePath));
                await deleteDoc(doc(db, "media", d.id));
              } catch (e) {
                alert("Nuk u fshi: " + (e && e.message ? e.message : e));
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
    }, (e) => {
      console.error(e);
      emptyState.classList.remove("hidden");
      emptyState.querySelector("h2").textContent = "Firebase nuk është gati ende";
      emptyState.querySelector("p").textContent = "Duhet të aktivizohen Firestore, Storage dhe rregullat e sigurisë.";
    });
  } catch (e) {
    console.error(e);
  }
}

uploadBtn.addEventListener("click", async () => {
  const files = Array.from(mediaInput.files);
  if (!files.length) return showMessage(uploadStatus, "Zgjidh së paku një foto ose video.", "error");
  if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) return;

  uploadBtn.disabled = true;
  let done = 0;
  try {
    for (const file of files) {
      showMessage(uploadStatus, "Po ngarkoj " + (done + 1) + "/" + files.length + ": " + file.name);
      const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const path = "media/" + Date.now() + "_" + Math.random().toString(36).slice(2,8) + "_" + safe;
      const target = ref(storage, path);
      await uploadBytes(target, file, { contentType: file.type });
      await addDoc(collection(db, "media"), {
        name: file.name,
        type: file.type,
        storagePath: path,
        createdAt: serverTimestamp()
      });
      done++;
    }
    mediaInput.value = "";
    showMessage(uploadStatus, "U ngarkuan " + done + " materiale.", "success");
  } catch (e) {
    console.error(e);
    showMessage(uploadStatus, "Ngarkimi dështoi: " + (e && e.message ? e.message : e), "error");
  } finally {
    uploadBtn.disabled = false;
  }
});

onAuthStateChanged(auth, (user) => {
  const signedIn = !!user;
  loginView.classList.toggle("hidden", signedIn);
  appView.classList.toggle("hidden", !signedIn);

  if (!signedIn) {
    if (unsubscribeMedia) unsubscribeMedia();
    gallery.innerHTML = "";
    return;
  }

  const isAdmin = user.email === ADMIN_EMAIL;
  adminPanel.classList.toggle("hidden", !isAdmin);
  roleLabel.textContent = isAdmin ? "Administrator" : "Anëtar i familjes";
  startMediaListener();
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(console.error);
}
