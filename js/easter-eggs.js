/* ============================================================================
   EASTER-EGGS.JS — every hidden/bonus feature that isn't part of the main
   8-scene journey: the Konami code, secret clickable stars scattered across
   several scenes, and the two mini-games reachable from the Final Surprise
   scene's "One More Secret…" button (scratch card + swap puzzle).
============================================================================ */
const EasterEggs = (function () {
  // ── Konami code (↑ ↑ ↓ ↓ ← → ← → B A) ──────────────────────────────────
  const KONAMI_SEQUENCE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
  ];
  let konamiProgress = 0;

  function initKonami() {
    $("#konami-message").textContent = CONFIG.easterEggs.konamiMessage;
    $("#konami-overlay").addEventListener("click", closeKonami);

    document.addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI_SEQUENCE[konamiProgress]) {
        konamiProgress += 1;
        if (konamiProgress === KONAMI_SEQUENCE.length) {
          konamiProgress = 0;
          triggerKonami();
        }
      } else {
        konamiProgress = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    });
  }

  function triggerKonami() {
    playChime("success");
    const overlay = $("#konami-overlay");
    overlay.hidden = false;

    if (!AppState.reducedMotion) {
      const burstCanvas = document.createElement("canvas");
      burstCanvas.style.position = "fixed";
      burstCanvas.style.inset = "0";
      burstCanvas.style.width = "100%";
      burstCanvas.style.height = "100%";
      burstCanvas.style.zIndex = "125";
      burstCanvas.style.pointerEvents = "none";
      document.body.appendChild(burstCanvas);

      const burstSystem = createParticleSystem(burstCanvas);
      burstSystem.spawnConfettiBurst(90);
      for (let i = 0; i < 6; i++) burstSystem.launchFirework();

      setTimeout(() => {
        burstSystem.stop();
        burstCanvas.remove();
      }, 2600);
    }

    setTimeout(closeKonami, 3200);
  }

  function closeKonami() {
    $("#konami-overlay").hidden = true;
  }

  // ── Secret clickable stars, one hidden in each of several scenes ──────
  const STAR_SCENES = ["welcome", "letter", "gallery", "timeline", "notes", "wishes"];
  const foundStars = new Set();
  let toastTimer = null;

  function initSecretStars() {
    const messages = CONFIG.secretStars.messages;

    STAR_SCENES.forEach((sceneName, i) => {
      if (i >= messages.length) return;
      const sceneEl = document.getElementById("scene-" + sceneName);
      if (!sceneEl) return;

      const star = document.createElement("button");
      star.type = "button";
      star.className = "secret-star";
      star.setAttribute("aria-label", "A secret sparkle");
      star.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><use href="#icon-sparkle"></use></svg>';
      star.addEventListener("click", () => handleStarFound(star, i, messages[i]));

      sceneEl.appendChild(star);
    });
  }

  function handleStarFound(starEl, index, message) {
    if (!foundStars.has(index)) {
      foundStars.add(index);
      starEl.classList.add("is-found");
      starEl.disabled = true;
      playChime("chime");
      updateStarCounter();
    }
    showStarToast(message);
  }

  function showStarToast(message) {
    const toast = $("#star-toast");
    toast.textContent = message;
    toast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function updateStarCounter() {
    const counter = $("#star-counter");
    const total = Math.min(CONFIG.secretStars.messages.length, STAR_SCENES.length);
    counter.hidden = foundStars.size === 0;
    $("#star-count-text").textContent = foundStars.size + "/" + total;
  }

  // ── Bonus: scratch-off card ─────────────────────────────────────────────
  let scratchCtx = null;
  let isScratching = false;
  let scratchRevealed = false;
  let scratchLastCheck = 0;

  function openScratchCard() {
    playChime("click");
    openModal($("#scratch-modal"));
    const canvas = $("#scratch-canvas");
    if (!scratchCtx) {
      scratchCtx = canvas.getContext("2d");
      canvas.addEventListener("pointerdown", (e) => {
        isScratching = true;
        scratchAt(canvas, e);
      });
      canvas.addEventListener("pointermove", (e) => {
        if (isScratching) scratchAt(canvas, e);
      });
      window.addEventListener("pointerup", () => { isScratching = false; });
    }
    scratchRevealed = false;
    drawScratchCoating(canvas);
  }

  function drawScratchCoating(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    scratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    scratchCtx.globalCompositeOperation = "source-over";
    const gradient = scratchCtx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#d9af6a");
    gradient.addColorStop(1, "#eeaecb");
    scratchCtx.fillStyle = gradient;
    scratchCtx.fillRect(0, 0, width, height);

    scratchCtx.fillStyle = "rgba(255,255,255,0.92)";
    scratchCtx.font = "600 16px " + getComputedStyle(document.body).fontFamily;
    scratchCtx.textAlign = "center";
    scratchCtx.textBaseline = "middle";
    scratchCtx.fillText(CONFIG.scratchCard.label, width / 2, height / 2);
  }

  function scratchAt(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    scratchCtx.globalCompositeOperation = "destination-out";
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
    scratchCtx.fill();
    checkScratchProgress(canvas);
  }

  function checkScratchProgress(canvas) {
    if (scratchRevealed) return;
    const now = performance.now();
    if (now - scratchLastCheck < 150) return;
    scratchLastCheck = now;

    const data = scratchCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 40) {
      total++;
      if (data[i] < 40) transparent++;
    }
    if (total > 0 && transparent / total > 0.5) {
      scratchRevealed = true;
      scratchCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      playChime("success");
    }
  }

  // ── Bonus: little swap puzzle ────────────────────────────────────────
  let puzzleTiles = [];
  let puzzleSelectedIndex = null;
  let puzzleSolved = false;
  let puzzleBuilt = false;

  function openPuzzle() {
    playChime("click");
    openModal($("#puzzle-modal"));
    $("#puzzle-instructions").textContent = CONFIG.puzzle.instructions;
    if (!puzzleBuilt || puzzleSolved) {
      buildPuzzle();
      puzzleBuilt = true;
    }
  }

  function buildPuzzle() {
    const target = CONFIG.puzzle.solvedOrder;
    puzzleTiles = shuffleUntilDifferent(target);
    puzzleSolved = false;
    puzzleSelectedIndex = null;
    $("#puzzle-solved-message").textContent = CONFIG.puzzle.solvedMessage;
    $("#puzzle-solved-message").hidden = true;
    renderPuzzle();
  }

  function shuffleUntilDifferent(target) {
    let attempt = shuffle(target);
    let tries = 0;
    while (attempt.join("|") === target.join("|") && tries < 10) {
      attempt = shuffle(target);
      tries++;
    }
    return attempt;
  }

  function renderPuzzle() {
    const grid = $("#puzzle-grid");
    grid.innerHTML = "";
    const target = CONFIG.puzzle.solvedOrder;

    puzzleTiles.forEach((word, i) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "puzzle-tile";
      if (word === target[i]) tile.classList.add("is-correct");
      tile.textContent = word;
      tile.setAttribute("aria-label", "Tile " + (i + 1) + ": " + word);
      tile.addEventListener("click", () => handleTileClick(i));
      grid.appendChild(tile);
    });
  }

  function handleTileClick(index) {
    if (puzzleSolved) return;
    const tiles = $$(".puzzle-tile", $("#puzzle-grid"));

    if (puzzleSelectedIndex === null) {
      puzzleSelectedIndex = index;
      tiles[index].classList.add("is-selected");
      playChime("click");
      return;
    }

    if (puzzleSelectedIndex === index) {
      tiles[index].classList.remove("is-selected");
      puzzleSelectedIndex = null;
      return;
    }

    const temp = puzzleTiles[puzzleSelectedIndex];
    puzzleTiles[puzzleSelectedIndex] = puzzleTiles[index];
    puzzleTiles[index] = temp;
    puzzleSelectedIndex = null;

    playChime("flip");
    renderPuzzle();

    const target = CONFIG.puzzle.solvedOrder;
    if (puzzleTiles.every((word, i) => word === target[i])) {
      puzzleSolved = true;
      $("#puzzle-solved-message").hidden = false;
      playChime("success");
    }
  }

  // ── Wire the "secrets hub" modal opened from the Final Surprise scene ──
  function initSecretsHub() {
    $("#open-scratch-btn").addEventListener("click", openScratchCard);
    $("#open-puzzle-btn").addEventListener("click", openPuzzle);
  }

  function init() {
    initKonami();
    initSecretStars();
    initSecretsHub();
  }

  return { init };
})();
