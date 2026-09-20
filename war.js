
const root = document.getElementById("gamesRoot");
const NATION_KEY = "pajaziti-luftra-nation";

const NATIONS = [
  { code: "XK", name: "Kosovë", flag: "🇽🇰" },
  { code: "AL", name: "Shqipëri", flag: "🇦🇱" },
  { code: "DE", name: "Gjermani", flag: "🇩🇪" },
  { code: "TR", name: "Turqi", flag: "🇹🇷" },
  { code: "US", name: "SHBA", flag: "🇺🇸" },
  { code: "GB", name: "Britani", flag: "🇬🇧" },
  { code: "FR", name: "Francë", flag: "🇫🇷" },
  { code: "IT", name: "Itali", flag: "🇮🇹" },
  { code: "CH", name: "Zvicër", flag: "🇨🇭" },
  { code: "AT", name: "Austri", flag: "🇦🇹" },
  { code: "HR", name: "Kroaci", flag: "🇭🇷" },
  { code: "BA", name: "Bosnjë", flag: "🇧🇦" }
];

let game = null;
let aiTimer = null;

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function nation(code) {
  return NATIONS.find((n) => n.code === code) || NATIONS[0];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function injectStyle() {
  if (document.getElementById("luftraStyles")) return;
  const style = document.createElement("style");
  style.id = "luftraStyles";
  style.textContent = `
    .luftra-choice{background:linear-gradient(135deg,#7f1d1d,#111827)!important;color:#fff!important}
    .luftra-shell{max-width:900px;margin:0 auto}
    .luftra-lobby{display:grid;gap:14px}
    .luftra-hero{padding:18px;border-radius:22px;background:linear-gradient(145deg,#111827,#7f1d1d);color:#fff}
    .luftra-hero h2{margin:0 0 6px;font-size:30px}
    .luftra-select{width:100%;min-height:50px;border:1px solid #d1d5db;border-radius:14px;padding:0 12px;background:#fff;font:inherit;font-weight:800}
    .luftra-battlefield{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;padding:14px;border-radius:24px;background:linear-gradient(145deg,#172554,#7f1d1d 55%,#111827)}
    .luftra-nation{display:grid;gap:8px;text-align:center;padding:13px 10px;border-radius:18px;background:rgba(255,255,255,.96);box-shadow:0 10px 24px rgba(0,0,0,.2)}
    .luftra-flag{font-size:48px;line-height:1}
    .luftra-vs{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#991b1b;font-weight:950;box-shadow:0 8px 18px rgba(0,0,0,.25)}
    .luftra-hp-line{display:flex;justify-content:space-between;gap:8px;font-size:12px}
    .luftra-hp{height:12px;border-radius:999px;overflow:hidden;background:#fee2e2}
    .luftra-hp i{display:block;height:100%;background:linear-gradient(90deg,#ef4444,#22c55e);transition:width .25s ease}
    .luftra-mini{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;font-size:12px;font-weight:850}
    .luftra-turn{margin:12px 0;padding:12px;border-radius:14px;text-align:center;background:#dbeafe;color:#1e3a8a;font-weight:950}
    .luftra-turn.finished{background:#fef3c7;color:#92400e}
    .luftra-actions{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:12px 0}
    .luftra-actions button{min-height:82px;border:0;border-radius:16px;background:#f3f4f6;display:grid;place-items:center;align-content:center;gap:2px;font-size:24px}
    .luftra-actions button span{font-size:12px;font-weight:900}
    .luftra-actions button small{font-size:10px;color:#6b7280;font-weight:800}
    .luftra-actions button:disabled{opacity:.42;filter:grayscale(.6)}
    .luftra-log{display:grid;gap:7px;margin-top:14px}
    .luftra-log-row{padding:9px 11px;border-radius:12px;background:#f8fafc;font-size:13px}
    .luftra-log-row.win{background:#dcfce7;color:#166534;font-weight:900}
    .luftra-log-row.lose{background:#fee2e2;color:#991b1b;font-weight:900}
    @media(max-width:600px){
      .luftra-battlefield{padding:9px;gap:6px}
      .luftra-nation{padding:10px 6px}
      .luftra-flag{font-size:38px}
      .luftra-vs{width:38px;height:38px;font-size:12px}
      .luftra-actions{grid-template-columns:repeat(3,minmax(0,1fr))}
      .luftra-actions button{min-height:75px}
    }
  `;
  document.head.appendChild(style);
}

function installButton() {
  if (!root) return;
  const choices = root.querySelector(".games-choice");
  if (!choices || choices.querySelector('[data-luftra="1"]')) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "game-choice luftra-choice";
  btn.dataset.luftra = "1";
  btn.textContent = "⚔️ Luftra";
  btn.addEventListener("click", showLobby);
  choices.appendChild(btn);
}

function showLobby() {
  if (aiTimer) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
  game = null;
  const saved = localStorage.getItem(NATION_KEY) || "XK";
  root.innerHTML = `
    <div class="games-shell luftra-shell">
      <section class="card luftra-lobby">
        <div class="luftra-hero">
          <h2>⚔️ Luftra</h2>
          <div>Strategji me shtete — lufto me radhë dhe fito betejën.</div>
        </div>

        <label for="luftraNation"><strong>🌍 Zgjidh shtetin tënd</strong></label>
        <select id="luftraNation" class="luftra-select">
          ${NATIONS.map((n) => `<option value="${n.code}" ${saved === n.code ? "selected" : ""}>${n.flag} ${n.name}</option>`).join("")}
        </select>

        <button id="luftraStart" class="primary" type="button">⚔️ Fillo betejën</button>
        <div class="game-help">⚔️ Sulm · 🪖 Tank · 🚀 Raketë · 🛡️ Mbrojtje · ❤️ Medkit</div>
        <button id="luftraBack" class="secondary" type="button">← Kthehu te lojërat</button>
      </section>
    </div>
  `;

  const select = document.getElementById("luftraNation");
  select?.addEventListener("change", () => localStorage.setItem(NATION_KEY, select.value));
  document.getElementById("luftraStart")?.addEventListener("click", startBattle);
  document.getElementById("luftraBack")?.addEventListener("click", () => window.PajazitiGames?.activate?.());
}

function addLog(text, kind = "") {
  if (!game) return;
  game.log.unshift({ text, kind });
  game.log = game.log.slice(0, 12);
}

function hit(target, amount) {
  let left = Math.max(0, amount);
  const shieldUsed = Math.min(target.shield, left);
  target.shield -= shieldUsed;
  left -= shieldUsed;
  target.hp = Math.max(0, target.hp - left);
  return { damage: left, shield: shieldUsed };
}

function act(actor, target, action, enemy = false) {
  const who = `${actor.nation.flag} ${actor.nation.name}`;

  if (action === "attack") {
    const x = hit(target, rand(11, 18));
    addLog(`${who} sulmoi: -${x.damage} fuqi${x.shield ? ` (${x.shield} u ndal nga mburoja)` : ""}`);
    return true;
  }

  if (action === "tank") {
    if (actor.energy < 2) return false;
    actor.energy -= 2;
    const x = hit(target, rand(18, 27));
    addLog(`🪖 ${who} përdori tank: -${x.damage} fuqi`);
    return true;
  }

  if (action === "rocket") {
    if (actor.energy < 3) return false;
    actor.energy -= 3;
    const x = hit(target, rand(25, 36));
    addLog(`🚀 ${who} lëshoi raketë: -${x.damage} fuqi`);
    return true;
  }

  if (action === "shield") {
    if (actor.energy < 1) return false;
    actor.energy -= 1;
    const gain = rand(14, 22);
    actor.shield = Math.min(40, actor.shield + gain);
    addLog(`🛡️ ${who} mori +${gain} mburojë`);
    return true;
  }

  if (action === "heal") {
    if (actor.energy < 2 || actor.medkits <= 0 || actor.hp >= 100) return false;
    actor.energy -= 2;
    actor.medkits -= 1;
    const before = actor.hp;
    actor.hp = Math.min(100, actor.hp + rand(18, 28));
    addLog(`❤️ ${who} u shërua +${actor.hp - before}`);
    return true;
  }

  return false;
}

function checkEnd() {
  if (game.enemy.hp <= 0) {
    game.over = true;
    game.winner = "player";
    addLog(`🏆 Fitore! ${game.player.nation.name} fitoi betejën.`, "win");
    return true;
  }
  if (game.player.hp <= 0) {
    game.over = true;
    game.winner = "enemy";
    addLog(`💥 ${game.enemy.nation.name} fitoi betejën.`, "lose");
    return true;
  }
  return false;
}

function aiChoice() {
  const ai = game.enemy;
  if (ai.hp < 38 && ai.medkits > 0 && ai.energy >= 2 && Math.random() < 0.42) return "heal";
  if (ai.shield < 10 && ai.energy >= 1 && Math.random() < 0.22) return "shield";
  if (ai.energy >= 3 && Math.random() < 0.28) return "rocket";
  if (ai.energy >= 2 && Math.random() < 0.42) return "tank";
  return "attack";
}

function playerAction(action) {
  if (!game || game.over || game.turn !== "player") return;
  const ok = act(game.player, game.enemy, action);
  if (!ok) {
    const status = document.getElementById("luftraStatus");
    if (status) status.textContent = "Nuk ke energji të mjaftueshme për këtë veprim.";
    return;
  }

  if (checkEnd()) {
    renderBattle();
    return;
  }

  game.turn = "enemy";
  renderBattle();

  aiTimer = setTimeout(() => {
    aiTimer = null;
    if (!game || game.over || game.turn !== "enemy") return;
    game.enemy.energy = Math.min(5, game.enemy.energy + 1);
    let choice = aiChoice();
    if (!act(game.enemy, game.player, choice, true)) act(game.enemy, game.player, "attack", true);

    if (!checkEnd()) {
      game.turn = "player";
      game.player.energy = Math.min(5, game.player.energy + 1);
    }
    renderBattle();
  }, 650);
}

function unitCard(side) {
  const u = game[side];
  const hp = Math.max(0, Math.min(100, u.hp));
  return `
    <div class="luftra-nation">
      <div class="luftra-flag">${u.nation.flag}</div>
      <strong>${esc(u.nation.name)}</strong>
      <div class="luftra-hp-line"><span>Fuqi</span><b>${hp}/100</b></div>
      <div class="luftra-hp"><i style="width:${hp}%"></i></div>
      <div class="luftra-mini">
        <span>🛡️ ${u.shield}</span>
        <span>⚡ ${u.energy}/5</span>
        <span>❤️ ${u.medkits}</span>
      </div>
    </div>
  `;
}

function renderBattle() {
  const yourTurn = game.turn === "player" && !game.over;
  const title = game.over
    ? (game.winner === "player" ? "🏆 TI FITOVE!" : "💥 KUNDËRSHTARI FITOI")
    : (yourTurn ? "🎯 Radha jote" : "⏳ Kundërshtari po luan…");

  root.innerHTML = `
    <div class="games-shell luftra-shell">
      <section class="card">
        <div class="game-room-head">
          <div>
            <div class="muted small">⚔️ Strategji</div>
            <div class="game-room-code">Luftra</div>
          </div>
          <button id="luftraBack" class="secondary" type="button">Kthehu</button>
        </div>

        <div class="luftra-battlefield">
          ${unitCard("player")}
          <div class="luftra-vs">VS</div>
          ${unitCard("enemy")}
        </div>

        <div class="luftra-turn ${game.over ? "finished" : ""}">${title}</div>
        <div id="luftraStatus" class="message"></div>

        <div class="luftra-actions">
          <button data-action="attack" ${yourTurn ? "" : "disabled"}>⚔️<span>Sulm</span><small>falas</small></button>
          <button data-action="tank" ${yourTurn && game.player.energy >= 2 ? "" : "disabled"}>🪖<span>Tank</span><small>⚡2</small></button>
          <button data-action="rocket" ${yourTurn && game.player.energy >= 3 ? "" : "disabled"}>🚀<span>Raketë</span><small>⚡3</small></button>
          <button data-action="shield" ${yourTurn && game.player.energy >= 1 ? "" : "disabled"}>🛡️<span>Mbrojtje</span><small>⚡1</small></button>
          <button data-action="heal" ${yourTurn && game.player.energy >= 2 && game.player.medkits > 0 && game.player.hp < 100 ? "" : "disabled"}>❤️<span>Medkit</span><small>⚡2</small></button>
        </div>

        <div class="luftra-log">
          <strong>📜 Beteja</strong>
          ${game.log.map((x) => `<div class="luftra-log-row ${x.kind}">${esc(x.text)}</div>`).join("")}
        </div>

        ${game.over ? '<button id="luftraAgain" class="primary" type="button">🔄 Luaj përsëri</button>' : ""}
      </section>
    </div>
  `;

  document.getElementById("luftraBack")?.addEventListener("click", showLobby);
  document.getElementById("luftraAgain")?.addEventListener("click", startBattle);
  root.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => playerAction(btn.dataset.action));
  });
}

function startBattle() {
  if (aiTimer) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }

  const select = document.getElementById("luftraNation");
  const code = select?.value || localStorage.getItem(NATION_KEY) || "XK";
  localStorage.setItem(NATION_KEY, code);

  const playerNation = nation(code);
  const enemies = NATIONS.filter((n) => n.code !== code);
  const enemyNation = enemies[Math.floor(Math.random() * enemies.length)];

  game = {
    player: { nation: playerNation, hp: 100, shield: 0, energy: 3, medkits: 2 },
    enemy: { nation: enemyNation, hp: 100, shield: 0, energy: 3, medkits: 2 },
    turn: "player",
    over: false,
    winner: null,
    log: [{ text: `⚔️ Beteja filloi: ${playerNation.name} kundër ${enemyNation.name}`, kind: "" }]
  };

  renderBattle();
}

injectStyle();
installButton();

const observer = new MutationObserver(() => installButton());
if (root) observer.observe(root, { childList: true, subtree: true });
