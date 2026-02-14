const ground = document.getElementById("ground");
const dropdown = document.getElementById("playerDropdown");
const loadDropdown = document.getElementById("loadDropdown");

let selected = [];

defaultPlayers.forEach(p => {
  const opt = document.createElement("option");
  opt.value = p.name;
  opt.textContent = p.name;
  dropdown.appendChild(opt);
});

function render() {
  ground.innerHTML = "";

  selected.forEach(p => {
    const el = document.createElement("div");
    el.className = "player";
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";

    const img = document.createElement("img");
    img.src = p.img;

    const name = document.createElement("div");
    name.className = "player-name";
    name.textContent = p.name;

    const title = document.createElement("div");
    title.className = "player-title";
    title.textContent = p.title;

    el.append(img, name, title);

    if (p.badge) {
      const badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = p.badge;
      el.appendChild(badge);
    }

    makeDraggable(el, p);
    ground.appendChild(el);
  });
}

function addPlayer() {
  const name = dropdown.value;
  if (!name || selected.find(p => p.name === name)) return;
  const base = defaultPlayers.find(p => p.name === name);

  selected.push({
    ...base,
    x: ground.clientWidth / 2 - 40,
    y: ground.clientHeight / 2 - 40
  });

  render();
}

function makeDraggable(el, player) {
  let offsetX = 0, offsetY = 0;

  el.addEventListener("pointerdown", e => {
    e.preventDefault(); // prevent text/image selection
    const rect = el.getBoundingClientRect();
    const groundRect = ground.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.setPointerCapture(e.pointerId);

    const move = e => {
      const x = e.clientX - groundRect.left - offsetX;
      const y = e.clientY - groundRect.top - offsetY;

      player.x = Math.max(0, Math.min(ground.clientWidth - el.offsetWidth, x));
      player.y = Math.max(0, Math.min(ground.clientHeight - el.offsetHeight, y));

      el.style.left = player.x + "px";
      el.style.top = player.y + "px";
    };

    const end = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
  });
}

function saveTeam() {
  const name = document.getElementById("teamName").value;
  if (!name) return;
  localStorage.setItem(name, JSON.stringify(selected));
  refreshLoad();
}

function loadTeam() {
  const name = loadDropdown.value;
  if (!name) return;
  selected = JSON.parse(localStorage.getItem(name));
  render();
}

function refreshLoad() {
  loadDropdown.innerHTML = `<option value="">Load Team</option>`;
  Object.keys(localStorage).forEach(k => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = k;
    loadDropdown.appendChild(o);
  });
}

function exportImage() {
  html2canvas(ground, { scale: 2, useCORS: true }).then(canvas => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "team.png";
    a.click();
  });
}

refreshLoad();
