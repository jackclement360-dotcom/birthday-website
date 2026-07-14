/* ============================================================================
   MAIN.JS — boots the whole experience: populates global text, wires up the
   Journey (scene-switching) controller, decides whether to show the
   Countdown, and initializes every section module + the ambient background.
   This is the only file that runs itself automatically on page load —
   everything else just defines things for this file to call.
============================================================================ */

// ── Journey: the scene-switching controller ─────────────────────────────
const Journey = (function () {
  const SCENE_ORDER = ["welcome", "letter", "gallery", "reasons", "timeline", "notes", "wishes", "finale"];
  let currentIndex = 0;
  let visited = new Set();
  let dotsContainer = null;

  function init() {
    dotsContainer = $("#progress-dots");
    buildDots();
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    SCENE_ORDER.forEach((name) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "progress-dot";
      dot.setAttribute("aria-label", "Go to " + name);
      dot.disabled = true;
      dot.addEventListener("click", () => {
        if (visited.has(name)) goTo(name);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    $$(".progress-dot", dotsContainer).forEach((dot, i) => {
      const name = SCENE_ORDER[i];
      dot.classList.toggle("is-current", i === currentIndex);
      dot.classList.toggle("is-visited", visited.has(name));
      dot.disabled = !visited.has(name);
    });
  }

  function goTo(name) {
    const target = document.getElementById("scene-" + name);
    if (!target) return;

    const activeEl = $(".scene.is-active");
    if (activeEl && activeEl !== target) {
      activeEl.classList.remove("is-active");
      activeEl.setAttribute("aria-hidden", "true");
      if ("inert" in activeEl) activeEl.inert = true;
    }

    const index = SCENE_ORDER.indexOf(name);
    if (index !== -1) {
      currentIndex = index;
      if (dotsContainer) dotsContainer.hidden = false;
    }
    visited.add(name);

    target.classList.add("is-active");
    target.removeAttribute("aria-hidden");
    if ("inert" in target) target.inert = false;

    window.scrollTo({ top: 0, behavior: AppState.reducedMotion ? "auto" : "smooth" });
    updateDots();
    AppEvents.emit("scene:enter", name);
  }

  function next() {
    const nextName = SCENE_ORDER[currentIndex + 1];
    if (nextName) goTo(nextName);
  }

  function restart() {
    visited = new Set();
    currentIndex = 0;
    goTo(SCENE_ORDER[0]);
  }

  function current() {
    return SCENE_ORDER[currentIndex];
  }

  return { init, goTo, next, restart, current, SCENE_ORDER };
})();

// ── Countdown pre-scene — only shown if her birthday hasn't arrived yet ──
const CountdownGate = (function () {
  let intervalId = null;

  function shouldShow() {
    if (!CONFIG.countdown || !CONFIG.countdown.enabled) return false;
    const target = new Date(CONFIG.countdown.targetDate).getTime();
    return !isNaN(target) && target > Date.now();
  }

  function start() {
    $("#countdown-heading").textContent = CONFIG.countdown.heading;
    $("#countdown-subheading").textContent = CONFIG.countdown.subheading;
    $("#countdown-arrived").textContent = CONFIG.countdown.arrivedMessage;

    $("#countdown-skip-btn").addEventListener("click", () => {
      playChime("click");
      finish();
    });

    tick();
    intervalId = setInterval(tick, 1000);

    const scene = $("#scene-countdown");
    scene.classList.add("is-active");
    scene.removeAttribute("aria-hidden");
    if ("inert" in scene) scene.inert = false;
  }

  function tick() {
    const target = new Date(CONFIG.countdown.targetDate).getTime();
    const remaining = target - Date.now();

    if (remaining <= 0) {
      $("#countdown-arrived").hidden = false;
      ["cd-days", "cd-hours", "cd-minutes", "cd-seconds"].forEach((id) => {
        $("#" + id).textContent = "00";
      });
      clearInterval(intervalId);
      setTimeout(finish, 1400);
      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining / 3600000) % 24);
    const minutes = Math.floor((remaining / 60000) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    $("#cd-days").textContent = String(days).padStart(2, "0");
    $("#cd-hours").textContent = String(hours).padStart(2, "0");
    $("#cd-minutes").textContent = String(minutes).padStart(2, "0");
    $("#cd-seconds").textContent = String(seconds).padStart(2, "0");
  }

  function finish() {
    if (intervalId) clearInterval(intervalId);
    Journey.goTo("welcome");
  }

  return { shouldShow, start };
})();

// ── Boot sequence ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyGlobalText();

  Journey.init();
  SceneWelcome.init();
  SceneLetter.init();
  SceneGallery.init();
  SceneReasons.init();
  SceneTimeline.init();
  SceneNotes.init();
  SceneWishes.init();
  SceneFinale.init();

  AudioController.init();
  AmbientParticles.init();
  CursorSparkles.init();
  EasterEggs.init();
  wireModalCloseTargets();

  if (CountdownGate.shouldShow()) {
    CountdownGate.start();
  } else {
    Journey.goTo("welcome");
  }

  hideLoadingScreen();
});

function applyGlobalText() {
  if (CONFIG.meta && CONFIG.meta.pageTitle) {
    document.title = CONFIG.meta.pageTitle;
    const titleEl = $("#page-title");
    if (titleEl) titleEl.textContent = CONFIG.meta.pageTitle;
  }
  const loadingMessage = $("#loading-message");
  if (loadingMessage) loadingMessage.textContent = CONFIG.loading.message;
}

function hideLoadingScreen() {
  const screen = $("#loading-screen");
  if (!screen) return;
  // A short, deliberate pause so the loading screen reads as a moment
  // rather than a flash — shortened automatically for reduced-motion users.
  const delay = AppState.reducedMotion ? 200 : 900;
  setTimeout(() => {
    screen.classList.add("is-hidden");
    setTimeout(() => { screen.style.display = "none"; }, 700);
  }, delay);
}
