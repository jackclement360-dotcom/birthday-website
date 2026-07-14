/* ============================================================================
   WISHES.JS — Scene 7: Birthday Wishes. Fireworks, confetti, rising hearts,
   and balloons/lanterns — a short celebratory show that starts the moment
   this scene is entered and stops cleanly the moment it's left.
   Text comes from CONFIG.wishes — see js/config.js.
============================================================================ */
const SceneWishes = (function () {
  let system = null;
  let fireworkInterval = null;
  let heartInterval = null;
  let floaterInterval = null;
  let floatersLayer = null;

  const BALLOON_COLORS = ["#eeaecb", "#dcd0f5", "#f0d9a3", "#d9789f", "#b6a0e0"];

  function init() {
    $("#wishes-heading").textContent = CONFIG.wishes.heading;
    $("#wishes-subheading").textContent = CONFIG.wishes.subheading;

    const continueBtn = $("#wishes-continue-btn");
    continueBtn.textContent = CONFIG.wishes.buttonText;
    continueBtn.addEventListener("click", () => {
      playChime("click");
      Journey.next();
    });

    AppEvents.on("scene:enter", (name) => {
      if (name === "wishes") startShow();
      else stopShow();
    });
  }

  function startShow() {
    const canvas = $("#wishes-canvas");
    if (!system) system = createParticleSystem(canvas);
    else system.resize();

    system.clear();
    system.spawnConfettiBurst(AppState.reducedMotion ? 40 : 120);

    if (!AppState.reducedMotion) {
      fireworkInterval = setInterval(() => system.launchFirework(), randomBetween(900, 1700));
      heartInterval = setInterval(() => system.spawnHeart(), 350);

      floatersLayer = document.createElement("div");
      floatersLayer.className = "floaters-layer";
      $("#scene-wishes").appendChild(floatersLayer);
      spawnFloater();
      floaterInterval = setInterval(spawnFloater, 1300);
    }
  }

  function spawnFloater() {
    if (!floatersLayer) return;
    const isBalloon = Math.random() > 0.4;
    const el = document.createElement("div");
    el.className = isBalloon ? "balloon" : "lantern";
    el.style.left = randomBetween(5, 90) + "%";
    el.style.setProperty("--drift", randomBetween(-60, 60) + "px");
    el.style.animationDuration = randomBetween(9, 15) + "s";
    if (isBalloon) {
      el.style.background = BALLOON_COLORS[randomInt(0, BALLOON_COLORS.length - 1)];
    }
    floatersLayer.appendChild(el);
    setTimeout(() => el.remove(), 16000);
  }

  function stopShow() {
    if (system) system.stop();
    if (fireworkInterval) clearInterval(fireworkInterval);
    if (heartInterval) clearInterval(heartInterval);
    if (floaterInterval) clearInterval(floaterInterval);
    fireworkInterval = null;
    heartInterval = null;
    floaterInterval = null;
    if (floatersLayer && floatersLayer.parentNode) floatersLayer.parentNode.removeChild(floatersLayer);
    floatersLayer = null;
  }

  return { init };
})();
