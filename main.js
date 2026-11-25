const DEFAULT_STATE = {
  passcode: "170757",
  name: "ARI",
  handle: "@ari.nocturne",
  bio: "\"Even the darkest night bleeds into silence; some ghosts never truly leave.\"",
  avatar: "ari.com.jpg",
  banner: "ari014.gif",
  music: "arianarak.mp3",
  theme: "default",
  font: "'Cinzel Decorative', serif",
  accent: "#9e8fb2",
  links: [
    { label: "INSTAGRAM", url: "https://instagram.com" },
    { label: "SPOTIFY PLAYLIST", url: "https://spotify.com" }
  ],
  reviews: [
    { id: 1, author: "stranger", text: "still haunting my thoughts at 3am.", time: "03:14" }
  ]
};

let state = JSON.parse(localStorage.getItem("ari_gothic_state")) || structuredClone(DEFAULT_STATE);

function saveState() {
  localStorage.setItem("ari_gothic_state", JSON.stringify(state));
  renderApp();
}

function renderApp() {
  document.getElementById("ui-name").textContent = state.name;
  document.getElementById("ui-name").style.fontFamily = state.font;
  document.getElementById("ui-handle").textContent = state.handle;
  document.getElementById("ui-bio").textContent = state.bio;
  document.getElementById("ui-avatar").src = state.avatar;
  document.getElementById("ui-banner").src = state.banner;
  document.getElementById("ui-track").textContent = state.music;

  const audio = document.getElementById("bg-music");
  if (!audio.src.endsWith(state.music)) {
    audio.src = state.music;
  }

  document.body.className = state.theme !== "default" ? `theme-${state.theme}` : "";
  document.documentElement.style.setProperty("--accent-color", state.accent);

  const linksContainer = document.getElementById("ui-links");
  linksContainer.innerHTML = "";
  state.links.forEach(link => {
    const a = document.createElement("a");
    a.className = "link-item";
    a.href = link.url;
    a.target = "_blank";
    a.innerHTML = `<span>${escapeHtml(link.label)}</span><span class="link-arrow">↗</span>`;
    linksContainer.appendChild(a);
  });

  const reviewsContainer = document.getElementById("ui-reviews");
  document.getElementById("review-count").textContent = `${state.reviews.length} NOTES`;
  reviewsContainer.innerHTML = "";
  state.reviews.slice().reverse().forEach(rev => {
    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <div class="review-meta">
        <span>${escapeHtml(rev.author || "anonymous")}</span>
        <span>${rev.time}</span>
      </div>
      <div class="review-text">${escapeHtml(rev.text)}</div>
    `;
    reviewsContainer.appendChild(div);
  });
}

const audio = document.getElementById("bg-music");
const audioBar = document.getElementById("audio-bar");
const audioToggle = document.getElementById("audio-toggle");
const entryGate = document.getElementById("entry-gate");

function startAudio() {
  audio.play().then(() => {
    audioBar.classList.add("playing");
    audioToggle.textContent = "PAUSE";
  }).catch(() => {
    audioBar.classList.remove("playing");
    audioToggle.textContent = "PLAY";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderApp();
  audio.play().then(() => {
    entryGate.classList.add("hidden");
    audioBar.classList.add("playing");
    audioToggle.textContent = "PAUSE";
  }).catch(() => {});
});

entryGate.addEventListener("click", () => {
  entryGate.classList.add("hidden");
  startAudio();
});

audioToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  if (audio.paused) {
    startAudio();
  } else {
    audio.pause();
    audioBar.classList.remove("playing");
    audioToggle.textContent = "PLAY";
  }
});

const gothicGlyphs = ["†", "✦", "⸸", "✧", "❖", "⋆"];
document.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button, input, select, a, .admin-panel")) return;

  const count = 6;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement("span");
    spark.className = "gothic-spark";
    spark.textContent = gothicGlyphs[Math.floor(Math.random() * gothicGlyphs.length)];
    
    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5);
    const distance = 28 + Math.random() * 38;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 15;

    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    spark.style.setProperty("--tx", `${tx}px`);
    spark.style.setProperty("--ty", `${ty}px`);
    spark.style.fontSize = `${11 + Math.random() * 8}px`;

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 1100);
  }
});

document.getElementById("review-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const author = document.getElementById("rev-author").value.trim();
  const text = document.getElementById("rev-content").value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.toTimeString().slice(0, 5);

  state.reviews.push({
    id: Date.now(),
    author: author || "anonymous",
    text,
    time
  });

  document.getElementById("rev-content").value = "";
  saveState();
});

document.getElementById("admin-trigger").addEventListener("click", () => {
  document.getElementById("pass-input").value = "";
  document.getElementById("auth-modal").classList.add("active");
});

function closeModals() {
  document.getElementById("auth-modal").classList.remove("active");
  document.getElementById("admin-modal").classList.remove("active");
}

function verifyPasscode() {
  const entered = document.getElementById("pass-input").value;
  if (entered === state.passcode) {
    document.getElementById("auth-modal").classList.remove("active");
    openAdminDashboard();
  } else {
    alert("INVALID PASSCODE");
  }
}

function openAdminDashboard() {
  document.getElementById("cfg-name").value = state.name;
  document.getElementById("cfg-handle").value = state.handle;
  document.getElementById("cfg-bio").value = state.bio;
  document.getElementById("cfg-avatar").value = state.avatar;
  document.getElementById("cfg-banner").value = state.banner;
  document.getElementById("cfg-music").value = state.music;
  document.getElementById("cfg-theme").value = state.theme;
  document.getElementById("cfg-font").value = state.font;
  document.getElementById("cfg-accent").value = state.accent;

  renderAdminLists();
  document.getElementById("admin-modal").classList.add("active");
}

function renderAdminLists() {
  const linkList = document.getElementById("admin-links-list");
  linkList.innerHTML = "";
  state.links.forEach((l, idx) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:6px 10px; border-radius:8px; font-size:0.75rem;";
    row.innerHTML = `
      <span>${escapeHtml(l.label)}</span>
      <button class="del-btn" onclick="deleteLink(${idx})">DELETE</button>
    `;
    linkList.appendChild(row);
  });

  const revList = document.getElementById("admin-reviews-list");
  revList.innerHTML = "";
  state.reviews.forEach((r, idx) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:6px 10px; border-radius:8px; font-size:0.72rem; gap:8px;";
    row.innerHTML = `
      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><b>${escapeHtml(r.author)}:</b> ${escapeHtml(r.text)}</span>
      <button class="del-btn" onclick="deleteReview(${idx})">DELETE</button>
    `;
    revList.appendChild(row);
  });
}

function saveGeneralConfig() {
  state.name = document.getElementById("cfg-name").value || "ARI";
  state.handle = document.getElementById("cfg-handle").value;
  state.bio = document.getElementById("cfg-bio").value;
  state.avatar = document.getElementById("cfg-avatar").value || "ari.com.jpg";
  state.banner = document.getElementById("cfg-banner").value || "ari014.gif";
  state.music = document.getElementById("cfg-music").value || "arianarak.mp3";
  state.theme = document.getElementById("cfg-theme").value;
  state.font = document.getElementById("cfg-font").value;
  state.accent = document.getElementById("cfg-accent").value;
  saveState();
  alert("SANCTUM UPDATED");
}

function addLink() {
  const label = document.getElementById("new-link-label").value.trim();
  const url = document.getElementById("new-link-url").value.trim();
  if (!label || !url) return;
  state.links.push({ label, url });
  document.getElementById("new-link-label").value = "";
  document.getElementById("new-link-url").value = "";
  saveState();
  renderAdminLists();
}

function deleteLink(index) {
  state.links.splice(index, 1);
  saveState();
  renderAdminLists();
}

function deleteReview(index) {
  state.reviews.splice(index, 1);
  saveState();
  renderAdminLists();
}

function updatePasscode() {
  const newPass = document.getElementById("new-passcode").value.trim();
  if (newPass.length < 4) {
    alert("PASSCODE TOO SHORT");
    return;
  }
  state.passcode = newPass;
  document.getElementById("new-passcode").value = "";
  saveState();
  alert("PASSCODE UPDATED");
}

function resetAllData() {
  if (confirm("RESET EVERYTHING TO DEFAULT?")) {
    localStorage.removeItem("ari_gothic_state");
    state = structuredClone(DEFAULT_STATE);
    saveState();
    openAdminDashboard();
  }
}

function escapeHtml(str) {
  const p = document.createElement("p");
  p.textContent = str;
  return p.innerHTML;
}
